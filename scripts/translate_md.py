from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parents[1]
POSTS_ROOT = PROJECT_ROOT / "src" / "content" / "posts"

DEFAULT_MODEL = "deepseek-v4-pro"
SECTION_MAX_TOKENS = 16384
FIELDS_MAX_TOKENS = 2048
BASE_URL = "https://api.deepseek.com"
DEEPSEEK_API_KEY_ENV = "DEEPSEEK_API_KEY"
DEEPSEEK_USER_ID_ENV = "DEEPSEEK_USER_ID"
DEFAULT_MAX_TOKENS = 81920
REQUEST_TIMEOUT = 660
RETRY_STATUS_CODES = {429, 500, 503}
NON_RETRY_STATUS_CODES = {400, 401, 402, 422}
USER_ID_RE = re.compile(r"^[a-zA-Z0-9\-_]{1,512}$")

SUPPORTED_LOCALES = (
    "en",
    "zh",
    "zh-TW",
    "ar",
    "id",
    "de",
    "el",
    "es",
    "fa",
    "fr",
    "hi",
    "it",
    "ja",
    "ko",
    "nl",
    "pl",
    "pt-BR",
    "ru",
    "th",
    "tr",
    "uk",
    "ur",
    "vi",
)
NON_DEFAULT_LOCALES = set(SUPPORTED_LOCALES) - {"en"}
LOCALE_LABELS = {
    "en": "English",
    "zh": "Simplified Chinese",
    "zh-TW": "Traditional Chinese (Taiwan)",
    "ar": "Arabic",
    "id": "Indonesian",
    "de": "German",
    "el": "Greek",
    "es": "Spanish",
    "fa": "Persian",
    "fr": "French",
    "hi": "Hindi",
    "it": "Italian",
    "ja": "Japanese",
    "ko": "Korean",
    "nl": "Dutch",
    "pl": "Polish",
    "pt-BR": "Portuguese (Brazil)",
    "ru": "Russian",
    "th": "Thai",
    "tr": "Turkish",
    "uk": "Ukrainian",
    "ur": "Urdu",
    "vi": "Vietnamese",
}


def api_key() -> str:
    key = (os.environ.get(DEEPSEEK_API_KEY_ENV) or "").strip()
    if not key:
        raise RuntimeError(f"{DEEPSEEK_API_KEY_ENV} env var is required")
    return key


def user_id() -> str | None:
    value = (os.environ.get(DEEPSEEK_USER_ID_ENV) or "").strip()
    if not value:
        return None
    if not USER_ID_RE.fullmatch(value):
        raise RuntimeError(
            f"{DEEPSEEK_USER_ID_ENV} must match [a-zA-Z0-9\\-_]+ and be <= 512 chars"
        )
    return value


def split_frontmatter(text: str) -> tuple[str, str]:
    text = text.replace("\r\n", "\n")
    if not text.startswith("---\n"):
        raise ValueError("Input markdown must start with YAML frontmatter")

    marker = "\n---\n"
    end = text.find(marker, 4)
    if end == -1:
        raise ValueError("Input markdown frontmatter is missing its closing ---")

    frontmatter = text[4:end]
    body = text[end + len(marker) :]
    return frontmatter, body


def parse_yaml_scalar(frontmatter: str, key: str) -> str:
    pattern = re.compile(rf"^{re.escape(key)}:\s*(.*)$")
    for line in frontmatter.splitlines():
        match = pattern.match(line)
        if not match:
            continue
        value = match.group(1).strip()
        if value.startswith('"') and value.endswith('"'):
            try:
                return str(json.loads(value))
            except json.JSONDecodeError:
                return value.strip('"')
        if value.startswith("'") and value.endswith("'"):
            return value[1:-1].replace("''", "'")
        return value
    return ""


def yaml_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def replace_yaml_scalar(frontmatter: str, key: str, value: str) -> str:
    lines = frontmatter.splitlines()
    pattern = re.compile(rf"^{re.escape(key)}\s*:")
    replacement = f"{key}: {yaml_string(value)}"

    for index, line in enumerate(lines):
        if pattern.match(line):
            lines[index] = replacement
            return "\n".join(lines)

    insert_at = 0 if key == "title" else min(1, len(lines))
    lines.insert(insert_at, replacement)
    return "\n".join(lines)


def infer_source_and_relative_post(input_path: Path) -> tuple[str, Path]:
    resolved = input_path.resolve()
    try:
        rel = resolved.relative_to(POSTS_ROOT.resolve())
    except ValueError as exc:
        raise ValueError(f"Input markdown must be under {POSTS_ROOT}") from exc

    if not rel.parts:
        raise ValueError("Input path does not point to a post")

    first = rel.parts[0]
    if first in NON_DEFAULT_LOCALES:
        if len(rel.parts) == 1:
            raise ValueError("Input path does not include a markdown filename")
        return first, Path(*rel.parts[1:])

    return "en", rel


def output_path_for(relative_post: Path, locale: str) -> Path:
    if locale == "en":
        return POSTS_ROOT / relative_post
    return POSTS_ROOT / locale / relative_post


def parse_targets(raw: str | None, source_locale: str) -> list[str]:
    if not raw:
        return [locale for locale in SUPPORTED_LOCALES if locale != source_locale]

    targets = [part.strip() for part in raw.split(",") if part.strip()]
    unknown = [locale for locale in targets if locale not in SUPPORTED_LOCALES]
    if unknown:
        raise ValueError(f"Unsupported target locale(s): {', '.join(unknown)}")
    return [locale for locale in targets if locale != source_locale]


def system_prompt(target_locale: str) -> str:
    target_language = LOCALE_LABELS[target_locale]
    return (
        "You are a careful translator for a personal technical blog.\n"
        f"Translate the provided Astro Markdown post into {target_language}.\n"
        "Return only valid JSON with exactly these string keys: "
        "title, description, body_markdown.\n"
        "Preserve Markdown structure, including headings, blockquotes, lists, links, "
        "inline code, code fences, and blank-line rhythm.\n"
        "Do not include YAML frontmatter in body_markdown.\n"
        "Do not translate code, URLs, file paths, package names, or tags.\n"
        "Keep the author's reflective personal voice natural in the target language.\n"
        "Translate for meaning, not word-for-word. Avoid calques and machine-translation phrasing. Rewrite sentences when needed so the result reads like a native essay in the target language.\n"
        "Preserve the opening `<div>` and closing `</div>` tags exactly as written.\n"
        "When the source text deliberately retains English terms alongside their translations "
        "Keep other English terms unchanged in the translation."
    )


def user_prompt(
    *,
    source_locale: str,
    target_locale: str,
    title: str,
    description: str,
    body: str,
) -> str:
    payload = {
        "source_language": LOCALE_LABELS[source_locale],
        "target_language": LOCALE_LABELS[target_locale],
        "title": title,
        "description": description,
        "body_markdown": body,
    }
    return json.dumps(payload, ensure_ascii=False, indent=2)


def chat_body(
    *,
    model: str,
    source_locale: str,
    target_locale: str,
    title: str,
    description: str,
    body: str,
) -> dict[str, Any]:
    request_body: dict[str, Any] = {
        "model": model,
        "max_tokens": DEFAULT_MAX_TOKENS,
        "messages": [
            {"role": "system", "content": system_prompt(target_locale)},
            {
                "role": "user",
                "content": user_prompt(
                    source_locale=source_locale,
                    target_locale=target_locale,
                    title=title,
                    description=description,
                    body=body,
                ),
            },
        ],
        "response_format": {"type": "json_object"},
        "stream": False,
    }

    current_user_id = user_id()
    if current_user_id is not None:
        request_body["user_id"] = current_user_id

    return request_body


def retry_delay(error: urllib.error.HTTPError, attempt: int) -> float:
    retry_after = error.headers.get("Retry-After") if error.headers else None
    if retry_after:
        try:
            return max(0.0, float(retry_after))
        except ValueError:
            pass
    return min(60.0, 2.0**attempt)


def post_chat_completion(body: dict[str, Any], *, max_retries: int = 4) -> dict[str, Any]:
    data = json.dumps(body, ensure_ascii=False).encode("utf-8")
    request = urllib.request.Request(
        f"{BASE_URL}/chat/completions",
        data=data,
        headers={
            "Authorization": f"Bearer {api_key()}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    for attempt in range(max_retries + 1):
        try:
            with urllib.request.urlopen(request, timeout=REQUEST_TIMEOUT) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")
            if exc.code in NON_RETRY_STATUS_CODES:
                raise RuntimeError(f"DeepSeek API failed with HTTP {exc.code}: {detail}") from exc
            if exc.code in RETRY_STATUS_CODES and attempt < max_retries:
                time.sleep(retry_delay(exc, attempt))
                continue
            raise RuntimeError(f"DeepSeek API failed with HTTP {exc.code}: {detail}") from exc

    raise RuntimeError("DeepSeek retry loop exhausted unexpectedly")


def parse_completion(data: dict[str, Any], *, target_locale: str) -> dict[str, str]:
    choice = data["choices"][0]
    finish_reason = choice.get("finish_reason")
    raw_text = choice.get("message", {}).get("content") or ""
    try:
        parsed = json.loads(raw_text)
    except json.JSONDecodeError as exc:
        hint = ""
        if str(finish_reason or "").lower() in {"length", "max_tokens"}:
            hint = "; likely truncated by max_tokens"
        raise ValueError(
            f"DeepSeek {target_locale} translation returned invalid JSON: {exc}{hint}"
        ) from exc

    if not isinstance(parsed, dict):
        raise ValueError(f"DeepSeek {target_locale} translation did not return a JSON object")

    required = ("title", "description", "body_markdown")
    missing = [key for key in required if not isinstance(parsed.get(key), str)]
    if missing:
        raise ValueError(f"DeepSeek response missing string field(s): {', '.join(missing)}")

    return {key: parsed[key].strip() for key in required}


def build_translated_markdown(frontmatter: str, translated: dict[str, str]) -> str:
    updated = replace_yaml_scalar(frontmatter, "title", translated["title"])
    updated = replace_yaml_scalar(updated, "description", translated["description"])
    body = translated["body_markdown"].strip()
    return f"---\n{updated.rstrip()}\n---\n\n{body}\n"


def translate_one(
    *,
    frontmatter: str,
    body: str,
    source_locale: str,
    target_locale: str,
    model: str,
) -> str:
    title = parse_yaml_scalar(frontmatter, "title")
    description = parse_yaml_scalar(frontmatter, "description")
    data = post_chat_completion(
        chat_body(
            model=model,
            source_locale=source_locale,
            target_locale=target_locale,
            title=title,
            description=description,
            body=body,
        )
    )
    return build_translated_markdown(frontmatter, parse_completion(data, target_locale=target_locale))


def get_committed_content(input_path: Path) -> str | None:
    """Return the HEAD-committed text of *input_path*, or None if unavailable."""
    try:
        repo_result = subprocess.run(
            ["git", "rev-parse", "--show-toplevel"],
            capture_output=True, text=True, cwd=str(input_path.parent),
        )
        if repo_result.returncode != 0:
            return None
        repo_root = Path(repo_result.stdout.strip())
        rel = input_path.resolve().relative_to(repo_root.resolve())
        show_result = subprocess.run(
            ["git", "show", f"HEAD:{rel.as_posix()}"],
            capture_output=True, text=True, cwd=str(repo_root),
        )
        if show_result.returncode != 0:
            return None
        return show_result.stdout
    except Exception:
        return None


def split_body_sections(body: str) -> list[str]:
    """
    Split body at every heading line; joining the list reproduces *body* exactly.
    Section 0 = preamble (content before the first heading).
    Each subsequent section begins with its heading line.
    """
    parts = re.split(r"(?m)^(?=#{1,6} )", body)
    return parts if parts else [""]


def diff_frontmatter_fields(
    old_fm: str,
    new_fm: str,
    keys: tuple[str, ...] = ("title", "description"),
) -> set[str]:
    """Return the subset of *keys* whose values differ between the two frontmatter blobs."""
    return {k for k in keys if parse_yaml_scalar(old_fm, k) != parse_yaml_scalar(new_fm, k)}


def diff_section_indices(old_body: str, new_body: str) -> list[int]:
    """Return indices of sections that differ between the two bodies."""
    old_secs = split_body_sections(old_body)
    new_secs = split_body_sections(new_body)
    changed = [i for i, (o, n) in enumerate(zip(old_secs, new_secs)) if o != n]
    changed += list(range(len(old_secs), len(new_secs)))
    return changed


def section_chat_body(
    *,
    model: str,
    source_locale: str,
    target_locale: str,
    section_text: str,
) -> dict[str, Any]:
    target_language = LOCALE_LABELS[target_locale]
    system = (
        "You are a careful translator for a personal technical blog.\n"
        f"Translate the provided Markdown section into {target_language}.\n"
        "Return only valid JSON with exactly one string key: \"section\".\n"
        "The value must be the complete translated section, including the heading line if present.\n"
        "Preserve Markdown structure: headings, blockquotes, lists, links, inline code, code fences, blank-line rhythm.\n"
        "Do not translate code, URLs, file paths, package names, or tags.\n"
        "Keep the author's reflective personal voice natural in the target language.\n"
        "Translate for meaning, not word-for-word. Avoid calques and machine-translation phrasing.\n"
        "Preserve any opening <div> or closing </div> tags exactly as written.\n"
        "When the source text deliberately retains English terms alongside their translations, "
        "keep other English terms unchanged in the translation."
    )
    request_body: dict[str, Any] = {
        "model": model,
        "max_tokens": SECTION_MAX_TOKENS,
        "messages": [
            {"role": "system", "content": system},
            {
                "role": "user",
                "content": json.dumps(
                    {
                        "source_language": LOCALE_LABELS[source_locale],
                        "target_language": target_language,
                        "section": section_text,
                    },
                    ensure_ascii=False,
                    indent=2,
                ),
            },
        ],
        "response_format": {"type": "json_object"},
        "stream": False,
    }
    current_user_id = user_id()
    if current_user_id is not None:
        request_body["user_id"] = current_user_id
    return request_body


def fields_chat_body(
    *,
    model: str,
    source_locale: str,
    target_locale: str,
    fields: dict[str, str],
) -> dict[str, Any]:
    target_language = LOCALE_LABELS[target_locale]
    keys_str = ", ".join(f'"{k}"' for k in fields)
    system = (
        "You are a careful translator for a personal technical blog.\n"
        f"Translate the provided blog metadata fields into {target_language}.\n"
        f"Return only valid JSON with exactly these string keys: {keys_str}.\n"
        "Do not translate tags, code, or URLs.\n"
        "Keep the author's voice natural in the target language."
    )
    request_body: dict[str, Any] = {
        "model": model,
        "max_tokens": FIELDS_MAX_TOKENS,
        "messages": [
            {"role": "system", "content": system},
            {
                "role": "user",
                "content": json.dumps(
                    {
                        "source_language": LOCALE_LABELS[source_locale],
                        "target_language": target_language,
                        **fields,
                    },
                    ensure_ascii=False,
                    indent=2,
                ),
            },
        ],
        "response_format": {"type": "json_object"},
        "stream": False,
    }
    current_user_id = user_id()
    if current_user_id is not None:
        request_body["user_id"] = current_user_id
    return request_body


def translate_diff_one(
    *,
    frontmatter: str,
    body: str,
    changed_fm_keys: set[str],
    changed_section_indices: list[int],
    source_locale: str,
    target_locale: str,
    model: str,
    existing_content: str,
) -> str:
    """Translate only changed parts and patch them into *existing_content*."""
    existing_fm, existing_body = split_frontmatter(existing_content)

    # --- Patch frontmatter fields ---
    updated_fm = existing_fm
    if changed_fm_keys:
        source_fields = {k: parse_yaml_scalar(frontmatter, k) for k in changed_fm_keys}
        data = post_chat_completion(
            fields_chat_body(
                model=model,
                source_locale=source_locale,
                target_locale=target_locale,
                fields=source_fields,
            )
        )
        raw = data["choices"][0].get("message", {}).get("content") or ""
        translated_fields: dict[str, Any] = json.loads(raw)
        for key, value in translated_fields.items():
            if isinstance(value, str):
                updated_fm = replace_yaml_scalar(updated_fm, key, value)

    # --- Patch body sections ---
    updated_body = existing_body
    if changed_section_indices:
        source_sections = split_body_sections(body)
        locale_sections = split_body_sections(existing_body)

        for idx in changed_section_indices:
            if idx >= len(source_sections):
                continue
            data = post_chat_completion(
                section_chat_body(
                    model=model,
                    source_locale=source_locale,
                    target_locale=target_locale,
                    section_text=source_sections[idx],
                )
            )
            raw = data["choices"][0].get("message", {}).get("content") or ""
            translated_section = json.loads(raw).get("section", "").strip()

            # Preserve the trailing whitespace from the original locale section so
            # the spacing between sections stays intact after the patch.
            trailing = "\n\n"
            if idx < len(locale_sections):
                m = re.search(r"\s+$", locale_sections[idx])
                if m:
                    trailing = m.group()

            patched = translated_section + trailing
            if idx < len(locale_sections):
                locale_sections[idx] = patched
            else:
                locale_sections.append(patched)

        updated_body = "".join(locale_sections)

    body_stripped = updated_body.strip()
    return f"---\n{updated_fm.rstrip()}\n---\n\n{body_stripped}\n"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Translate one Astro Markdown post with the DeepSeek API.",
        epilog=(
            "Authentication is read from the current process environment: "
            "DEEPSEEK_API_KEY is required, and DEEPSEEK_USER_ID is optional."
        ),
    )
    parser.add_argument("input", type=Path, help="Markdown post under src/content/posts")
    parser.add_argument(
        "--targets",
        help="Comma-separated target locales. Defaults to every supported locale except the source.",
    )
    parser.add_argument("--overwrite", action="store_true", help="Overwrite existing output files.")
    parser.add_argument("--dry-run", action="store_true", help="Print planned outputs without API calls.")
    parser.add_argument("--model", default=DEFAULT_MODEL, help=f"DeepSeek model, default {DEFAULT_MODEL}.")
    parser.add_argument(
        "--diff",
        action="store_true",
        help=(
            "Translate only sections that changed since the last git commit. "
            "Patches existing locale files in-place; locales without an existing file are skipped."
        ),
    )
    args = parser.parse_args(argv)

    input_path = args.input if args.input.is_absolute() else (Path.cwd() / args.input)
    source_locale, relative_post = infer_source_and_relative_post(input_path)
    targets = parse_targets(args.targets, source_locale)

    frontmatter, body = split_frontmatter(input_path.read_text(encoding="utf-8"))

    planned = [(locale, output_path_for(relative_post, locale)) for locale in targets]

    # ------------------------------------------------------------------ #
    # --diff mode: patch only what changed since HEAD                     #
    # ------------------------------------------------------------------ #
    if args.diff:
        committed_text = get_committed_content(input_path)
        if committed_text is None:
            print(
                "error: could not read committed version from git HEAD; "
                "make sure the file exists in the last commit or omit --diff",
                file=sys.stderr,
            )
            return 1

        old_fm, old_body = split_frontmatter(committed_text.replace("\r\n", "\n"))
        changed_fm_keys = diff_frontmatter_fields(old_fm, frontmatter)
        changed_section_indices = diff_section_indices(old_body, body)

        if not changed_fm_keys and not changed_section_indices:
            print("no changes detected since HEAD, nothing to do")
            return 0

        if changed_fm_keys:
            print(f"changed fields: {', '.join(sorted(changed_fm_keys))}")
        if changed_section_indices:
            print(f"changed section indices: {changed_section_indices}")

        patchable = [(locale, path) for locale, path in planned if path.exists()]
        for locale, path in planned:
            if path.exists():
                print(f"{locale:>6} patch: {path}")
            else:
                print(f"{locale:>6} skip (no existing file): {path}")

        if args.dry_run:
            return 0

        if not patchable:
            print("nothing to patch")
            return 0

        api_key()
        with ThreadPoolExecutor(max_workers=len(patchable)) as executor:
            futures = {
                executor.submit(
                    translate_diff_one,
                    frontmatter=frontmatter,
                    body=body,
                    changed_fm_keys=changed_fm_keys,
                    changed_section_indices=changed_section_indices,
                    source_locale=source_locale,
                    target_locale=locale,
                    model=args.model,
                    existing_content=path.read_text(encoding="utf-8"),
                ): (locale, path)
                for locale, path in patchable
            }
            for future in as_completed(futures):
                locale, path = futures[future]
                patched = future.result()
                path.write_text(patched, encoding="utf-8", newline="\n")
                print(f"patched {locale}: {path}")

        return 0

    # ------------------------------------------------------------------ #
    # Normal mode: translate full article                                  #
    # ------------------------------------------------------------------ #
    for locale, output_path in planned:
        action = "overwrite" if output_path.exists() and args.overwrite else "write"
        if output_path.exists() and not args.overwrite:
            action = "skip existing"
        print(f"{locale:>2} {action}: {output_path}")

    if args.dry_run:
        return 0

    pending = [
        (locale, output_path)
        for locale, output_path in planned
        if args.overwrite or not output_path.exists()
    ]
    if not pending:
        return 0

    api_key()
    max_workers = len(pending)
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {
            executor.submit(
                translate_one,
                frontmatter=frontmatter,
                body=body,
                source_locale=source_locale,
                target_locale=locale,
                model=args.model,
            ): (locale, output_path)
            for locale, output_path in pending
        }
        for future in as_completed(futures):
            locale, output_path = futures[future]
            translated = future.result()
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_text(translated, encoding="utf-8", newline="\n")
            print(f"wrote {locale}: {output_path}")

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"error: {exc}", file=sys.stderr)
        raise SystemExit(1)
