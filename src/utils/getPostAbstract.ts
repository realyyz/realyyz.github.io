const ABSTRACT_HEADINGS = new Set([
  "abstract",
  "摘要",
  "résumé",
  "resumen",
  "zusammenfassung",
  "ملخص",
  "要約",
  "요약",
  "özet",
]);

function normalizeAbstractHeading(text: string): string {
  return text
    .replace(/[*_`]/g, "")
    .replace(/[:：.]$/, "")
    .trim()
    .toLocaleLowerCase();
}

function isAbstractHeading(text: string): boolean {
  return ABSTRACT_HEADINGS.has(normalizeAbstractHeading(text));
}

export function getPostAbstract(body: string | undefined): string | undefined {
  if (!body) return undefined;

  const paragraphs: string[] = [];
  let currentParagraph: string[] = [];
  let foundAbstractBlock = false;

  for (const line of body.split(/\r?\n/)) {
    if (!line.startsWith(">")) {
      if (foundAbstractBlock) break;
      if (line.trim() === "") continue;
      return undefined;
    }

    foundAbstractBlock = true;
    const text = line.slice(1).trim();

    if (!text) {
      if (currentParagraph.length > 0) {
        paragraphs.push(currentParagraph.join(" "));
        currentParagraph = [];
      }
      continue;
    }

    if (isAbstractHeading(text)) continue;
    currentParagraph.push(text);
  }

  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph.join(" "));
  }

  return paragraphs.length > 0 ? paragraphs.join("\n\n") : undefined;
}
