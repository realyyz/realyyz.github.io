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
    quote: "你的时间是有限的，所以不要浪费它去过别人的生活。不要被教条所困——那是活在别人思考的结果中。不要让别人的观点的噪音淹没了你自己的内心声音。最重要的是，要有勇气追随你的心和直觉。它们以某种方式已经知道你真正想要成为什么样的人。其他的一切都是次要的。",
  },
  fr: {
    quote: "Votre temps est limité, alors n'en passez pas à vivre la vie des autres. Ne soyez pas piégé par le dogme — c'est vivre avec les résultats de la pensée des autres. Ne laissez pas le bruit des opinions des autres noyer votre propre voix intérieure. Et surtout, avez-vous le courage de suivre votre cœur et votre intuition. Ils savent somehow ce que vous voulez vraiment devenir. Tout le reste est secondaire.",
  },
  es: {
    quote: "Tu tiempo es limitado, así que no lo desperdicies viviendo la vida de alguien más. No te dejes atrapar por el dogma, que es vivir con los resultados del pensamiento de otras personas. No dejes que el ruido de las opiniones de los demás ahogue tu propia voz interior. Y lo más importante, ten el coraje de seguir tu corazón e intuición. De alguna manera ya saben lo que realmente quieres llegar a ser. Todo lo demás es secundario.",
  },
  de: {
    quote: "Ihre Zeit ist begrenzt, also verbringen Sie sie nicht damit, das Leben eines anderen zu führen. Seien Sie nicht durch Dogma gefangen – das ist das Leben mit den Ergebnissen des Denkens anderer. Lassen Sie nicht das Rauschen der Meinungen anderer Ihre eigene innere Stimme übertönen. Und am wichtigsten: haben Sie den Mut, Ihrem Herz und Ihrer Intuition zu folgen. Sie wissen irgendwie bereits, was Sie wirklich zu werden wünschen. Alles andere ist sekundär.",
  },
  tr: {
    quote: "Zamanınız sınırlıdır, bu yüzden başkasının hayatını yaşayarak boşa harcayın. Dogma tarafından yakalanmayın -- bu başkalarının düşüncelerinin sonuçlarıyla yaşamaktır. Başkalarının fikirlerinin gürültüsünü kendi iç sesinizi susturamaz. Ve en önemlisi, kalbinize ve intuisyona güvenerek ilerleme cesareti gösterin. Bir şekilde zaten ne olmak istediğini biliyorlar. Diğer her şey ikinci planda kalır.",
  },
  ar: {
    quote: "وقتكم محدود، لذا لا تضيعواه في عيش حياة شخص آخر. لا تكنوا محتجزين بواسطة dogma -- وهو العيش مع نتائج تفكير الآخرين. لا تدعوا صوت الآخرين يغلفون صوتكم الداخلي. وأهم من ذلك، كنوا شجعان لاتباع قلوبكم وحساساتكم. إنهم يعلمون somehow ما تريد حقاً أن تصبحوا. كل شيء آخر ثانوي.",
  },
  vi: {
    quote: "Thời gian của bạn có hạn, vì vậy đừng lãng phí nó để sống cuộc đời của người khác. Đừng bị mắc kẹt bởi giáo điều — tức là sống với kết quả suy nghĩ của người khác. Đừng để tiếng ồn từ ý kiến của người khác nhấn chìm tiếng nói nội tâm của chính bạn. Và quan trọng nhất, hãy có can đảm để đi theo trái tim và trực giác của mình. Bằng cách nào đó, chúng đã biết bạn thực sự muốn trở thành người như thế nào. Mọi thứ khác đều là thứ yếu.",
  },
  ja: {
    quote: "あなたの時間は限られています。だから、他人の人生を生きることでそれを無駄にしないでください。ドグマにとらわれないでください。それは他人の思考の結果とともに生きることです。他人の意見のノイズがあなた自身の内なる声をかき消さないようにしてください。そして最も重要なことは、あなたの心と直感に従う勇気を持ってください。彼らは somehow あなたが本当に何になりたいかをすでに知っています。その他すべては二次的なものです。",
  },
  ko: {
    quote: "당신의 시간은 한정되어 있으니, 다른 사람의 인생을 사는 데 낭비하지 마세요. 도그마에 갇히지 마세요 -- 그것은 다른 사람들의 생각의 결과로 사는 것입니다. 다른 사람들의 의견의 소음이 당신 자신의 내면의 목소리를 잠식하지 않도록 하세요. 그리고 가장 중요한 것은, 당신의 마음과 직관을 따르는 용기를 가지세요. 그들은 somehow 이미 당신이 진정으로 무엇이 되고 싶은지 알고 있습니다. 나머지는 모두 부차적인 것입니다.",
  },
};

export function getHomeCopy(locale: string): HomeCopy {
  const key = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  const copy = HOME_COPY[key];

  if (copy.quote) return copy;
  return HOME_COPY[DEFAULT_LOCALE];
}
