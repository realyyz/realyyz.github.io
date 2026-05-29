import {
  DEFAULT_LOCALE,
  isSupportedLocale,
  type SupportedLocale,
} from "./locales";

type HomeCopy = {
  quote: string;
};

export const HOME_COPY: Record<SupportedLocale, HomeCopy> = {
  en: {
    quote: "Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma -- which is living with the results of other people's thinking. Don't let the noise of other's opinions drown out your own inner voice. And most important, have the courage to follow your heart and intuition. They somehow already know what you truly want to become. Everything else is secondary.",
  },
  zh: {
    quote: "你的时间是有限的，所以不要浪费它去过别人的生活。不要被教条所困——那是活在别人思考的结果中。不要让别人观点的噪音淹没你自己内心的声音。最重要的是，要有勇气追随你的心和直觉。它们以某种方式已经知道你真正想要成为什么样的人。其他的一切都是次要的。",
  },
  "zh-TW": {
    quote: "你的時間有限，所以不要浪費時間去過別人的生活。不要被教條所困——那是活在別人思考的結果裡。不要讓他人意見的噪音淹沒你內心的聲音。最重要的是，要有勇氣追隨你的內心與直覺。它們以某種方式早已知道你真正想成為什麼樣的人。其他一切都是次要的。",
  },
  ar: {
    quote: "وقتك محدود، فلا تضيّعه في عيش حياة شخص آخر. لا تقع أسيراً للعقائد الجامدة — فهي العيش وفق نتائج تفكير الآخرين. لا تدع ضجيج آراء الآخرين يُغرق صوتك الداخلي. والأهم من ذلك، تحلَّ بالشجاعة لتتبع قلبك وحدسك. فهما يعرفان بطريقة ما ما تريد حقاً أن تصبح عليه. وكل ما عداهما ثانوي.",
  },
  id: {
    quote: "Waktumu terbatas, jadi jangan sia-siakan dengan menjalani hidup orang lain. Jangan terjebak oleh dogma — yaitu hidup dengan hasil pemikiran orang lain. Jangan biarkan kebisingan pendapat orang lain menenggelamkan suara hatimu sendiri. Dan yang terpenting, miliki keberanian untuk mengikuti kata hati dan intuisimu. Entah bagaimana, keduanya sudah tahu apa yang sebenarnya ingin kamu capai. Segala sesuatu yang lain bersifat sekunder.",
  },
  de: {
    quote: "Ihre Zeit ist begrenzt, also verbringen Sie sie nicht damit, das Leben eines anderen zu führen. Lassen Sie sich nicht durch Dogmen gefangen nehmen – das heißt, mit den Ergebnissen des Denkens anderer zu leben. Lassen Sie nicht zu, dass der Lärm fremder Meinungen Ihre eigene innere Stimme übertönt. Und am wichtigsten: Haben Sie den Mut, Ihrem Herzen und Ihrer Intuition zu folgen. Sie wissen irgendwie bereits, was Sie wirklich werden möchten. Alles andere ist zweitrangig.",
  },
  el: {
    quote: "Ο χρόνος σας είναι περιορισμένος, γι' αυτό μην τον σπαταλάτε ζώντας τη ζωή κάποιου άλλου. Μην παγιδεύεστε από δόγματα — που σημαίνει να ζείτε με τα αποτελέσματα της σκέψης των άλλων. Μην αφήνετε τον θόρυβο των απόψεων των άλλων να πνίγει τη δική σας εσωτερική φωνή. Και το πιο σημαντικό, να έχετε το θάρρος να ακολουθήσετε την καρδιά και τη διαίσθησή σας. Αυτές γνωρίζουν ήδη, με κάποιον τρόπο, τι θέλετε πραγματικά να γίνετε. Όλα τα υπόλοιπα είναι δευτερεύοντα.",
  },
  es: {
    quote: "Tu tiempo es limitado, así que no lo desperdicies viviendo la vida de alguien más. No te dejes atrapar por el dogma, que es vivir con los resultados del pensamiento de otras personas. No dejes que el ruido de las opiniones de los demás ahogue tu propia voz interior. Y lo más importante, ten el coraje de seguir tu corazón e intuición. De alguna manera ya saben lo que realmente quieres llegar a ser. Todo lo demás es secundario.",
  },
  fa: {
    quote: "زمان شما محدود است، پس آن را با زندگی کردنِ زندگیِ شخصِ دیگری هدر ندهید. اسیرِ جزم‌اندیشی نشوید — که همان زندگی کردن با نتایجِ تفکرِ دیگران است. نگذارید هیاهوی عقایدِ دیگران صدای درونیِ شما را خاموش کند. و مهم‌تر از همه، شهامتِ آن را داشته باشید که از قلب و شهودِ خود پیروی کنید. آن‌ها به‌نوعی از پیش می‌دانند که شما واقعاً می‌خواهید چه کسی شوید. باقیِ همه‌چیز در درجهٔ دوم اهمیت قرار دارد.",
  },
  fr: {
    quote: "Votre temps est limité, alors ne le gaspillez pas à vivre la vie de quelqu'un d'autre. Ne soyez pas prisonnier du dogme — c'est-à-dire vivre avec le fruit de la pensée des autres. Ne laissez pas le bruit des opinions d'autrui étouffer votre propre voix intérieure. Et le plus important : ayez le courage de suivre votre cœur et votre intuition. D'une certaine manière, ils savent déjà ce que vous voulez vraiment devenir. Tout le reste est secondaire.",
  },
  hi: {
    quote: "आपका समय सीमित है, इसलिए इसे किसी और का जीवन जीने में बर्बाद मत कीजिए। हठधर्मिता के जाल में मत फँसिए — जो दूसरों की सोच के परिणामों के साथ जीना है। दूसरों की रायों के शोर को अपनी भीतरी आवाज़ दबाने मत दीजिए। और सबसे महत्वपूर्ण बात, अपने दिल और अंतर्ज्ञान का अनुसरण करने का साहस रखिए। वे किसी न किसी तरह पहले से ही जानते हैं कि आप सचमुच क्या बनना चाहते हैं। बाकी सब कुछ गौण है।",
  },
  it: {
    quote: "Il vostro tempo è limitato, quindi non sprecatelo vivendo la vita di qualcun altro. Non lasciatevi intrappolare dal dogma, che significa vivere seguendo i risultati del pensiero altrui. Non lasciate che il rumore delle opinioni degli altri soffochi la vostra voce interiore. E, cosa più importante, abbiate il coraggio di seguire il vostro cuore e la vostra intuizione. In qualche modo sanno già cosa volete davvero diventare. Tutto il resto è secondario.",
  },
  ja: {
    quote: "あなたの時間は限られています。だから、他人の人生を生きて無駄にしないでください。ドグマにとらわれないでください。それは他人の考えの結果とともに生きることです。他人の意見の雑音に、自分自身の内なる声をかき消されないでください。そして最も大切なのは、自分の心と直感に従う勇気を持つことです。それらは、あなたが本当に何になりたいのかを、なぜか既に知っているのです。ほかのことはすべて二の次です。",
  },
  ko: {
    quote: "당신의 시간은 한정되어 있으니, 다른 사람의 인생을 사는 데 낭비하지 마세요. 도그마에 갇히지 마세요 — 그것은 다른 사람들의 생각의 결과에 맞춰 사는 것입니다. 다른 사람들의 의견이 내는 소음이 당신 내면의 목소리를 잠식하도록 두지 마세요. 그리고 무엇보다 중요한 것은, 당신의 마음과 직관을 따를 용기를 가지는 것입니다. 그것들은 어떻게든 당신이 진정으로 무엇이 되고 싶은지 이미 알고 있습니다. 나머지는 모두 부차적인 것입니다.",
  },
  nl: {
    quote: "Je tijd is beperkt, dus verspil hem niet aan het leven van iemand anders. Laat je niet gevangennemen door dogma's — dat is leven met de resultaten van andermans denken. Laat het lawaai van andermans meningen je eigen innerlijke stem niet overstemmen. En het allerbelangrijkste: heb de moed om je hart en je intuïtie te volgen. Op de een of andere manier weten ze al wat je werkelijk wilt worden. Al het andere is bijzaak.",
  },
  pl: {
    quote: "Twój czas jest ograniczony, więc nie marnuj go na życie cudzym życiem. Nie daj się uwięzić dogmatom — to znaczy żyć zgodnie z rezultatami cudzego myślenia. Nie pozwól, by zgiełk cudzych opinii zagłuszył twój własny wewnętrzny głos. A co najważniejsze, miej odwagę podążać za swoim sercem i intuicją. One w jakiś sposób już wiedzą, kim naprawdę chcesz się stać. Wszystko inne jest drugorzędne.",
  },
  "pt-BR": {
    quote: "O seu tempo é limitado, então não o desperdice vivendo a vida de outra pessoa. Não se deixe aprisionar pelo dogma — que é viver de acordo com os resultados do pensamento alheio. Não deixe que o barulho das opiniões dos outros abafe a sua própria voz interior. E o mais importante: tenha a coragem de seguir o seu coração e a sua intuição. De alguma forma, eles já sabem o que você realmente quer se tornar. Todo o resto é secundário.",
  },
  ru: {
    quote: "Ваше время ограничено, поэтому не тратьте его, проживая чужую жизнь. Не попадайте в ловушку догм — это значит жить с результатами чужого мышления. Не позволяйте шуму чужих мнений заглушить ваш собственный внутренний голос. И самое главное — имейте смелость следовать за своим сердцем и интуицией. Они каким-то образом уже знают, кем вы по-настоящему хотите стать. Всё остальное второстепенно.",
  },
  th: {
    quote: "เวลาของคุณมีจำกัด ดังนั้นอย่าเสียมันไปกับการใช้ชีวิตของคนอื่น อย่าติดกับดักของกรอบความเชื่อ — ซึ่งก็คือการใช้ชีวิตตามผลลัพธ์จากความคิดของผู้อื่น อย่าปล่อยให้เสียงรบกวนจากความคิดเห็นของคนอื่นกลบเสียงภายในใจของคุณเอง และที่สำคัญที่สุด จงมีความกล้าที่จะทำตามหัวใจและสัญชาตญาณของคุณ ด้วยเหตุผลบางอย่าง พวกมันรู้อยู่แล้วว่าคุณอยากเป็นอะไรอย่างแท้จริง สิ่งอื่นทั้งหมดล้วนเป็นเรื่องรอง",
  },
  tr: {
    quote: "Zamanınız sınırlıdır, bu yüzden onu başkasının hayatını yaşayarak boşa harcamayın. Dogmaların tuzağına düşmeyin — ki bu, başkalarının düşüncelerinin sonuçlarıyla yaşamak demektir. Başkalarının görüşlerinin gürültüsünün kendi iç sesinizi bastırmasına izin vermeyin. Ve en önemlisi, kalbinizi ve sezgilerinizi izleme cesaretini gösterin. Onlar bir şekilde gerçekte ne olmak istediğinizi zaten biliyorlar. Geri kalan her şey ikincildir.",
  },
  uk: {
    quote: "Ваш час обмежений, тож не витрачайте його на те, щоб жити чужим життям. Не потрапляйте в пастку догм — це означає жити з результатами чужого мислення. Не дозволяйте шуму чужих думок заглушити ваш власний внутрішній голос. І найголовніше — майте сміливість іти за своїм серцем та інтуїцією. Вони якимось чином уже знають, ким ви насправді хочете стати. Усе інше другорядне.",
  },
  ur: {
    quote: "آپ کا وقت محدود ہے، اس لیے اسے کسی اور کی زندگی جینے میں ضائع نہ کریں۔ جمودِ فکر کے دامِ فریب میں نہ پھنسیں — جو دوسروں کی سوچ کے نتائج کے ساتھ جینا ہے۔ دوسروں کی رائے کے شور کو اپنی اندرونی آواز دبانے نہ دیں۔ اور سب سے اہم بات، اپنے دل اور بصیرت کی پیروی کرنے کا حوصلہ رکھیں۔ وہ کسی نہ کسی طرح پہلے سے جانتے ہیں کہ آپ حقیقت میں کیا بننا چاہتے ہیں۔ باقی سب کچھ ثانوی ہے۔",
  },
  vi: {
    quote: "Thời gian của bạn có hạn, vì vậy đừng lãng phí nó để sống cuộc đời của người khác. Đừng bị mắc kẹt bởi giáo điều — tức là sống với kết quả suy nghĩ của người khác. Đừng để tiếng ồn từ ý kiến của người khác nhấn chìm tiếng nói nội tâm của chính bạn. Và quan trọng nhất, hãy có can đảm để đi theo trái tim và trực giác của mình. Bằng cách nào đó, chúng đã biết bạn thực sự muốn trở thành người như thế nào. Mọi thứ khác đều là thứ yếu.",
  },
};

export function getHomeCopy(locale: string): HomeCopy {
  const key = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  const copy = HOME_COPY[key];

  if (copy.quote) return copy;
  return HOME_COPY[DEFAULT_LOCALE];
}

export function getHomeDescription(locale: string): string {
  const quote = getHomeCopy(locale).quote;
  return quote.match(/^.*?[.!?。！？؟।]/u)?.[0] ?? quote;
}
