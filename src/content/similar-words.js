(function () {
  function similarWord({ id, difficulty, sentenceBefore, sentenceAfter, options, answer, explanation, insight }) {
    return {
      id,
      type: "similar_words",
      difficulty,
      prompt: "Které slovo je správně?",
      sentenceBefore,
      sentenceAfter,
      options,
      acceptedAnswers: [answer],
      explanation,
      insight
    };
  }

  const similarWordsExercises = [
    similarWord({
      id: "sw-uklidit-1",
      difficulty: 1,
      sentenceBefore: "Musím ještě ",
      sentenceAfter: " pokoj, než přijde návštěva.",
      options: ["uklidit", "uklidnit"],
      answer: "uklidit",
      explanation: "Správně je `uklidit` – jde o uklízení, úklid pokoje.",
      insight: "`uklidit` = to tidy; `uklidnit` = to calm (someone)."
    }),
    similarWord({
      id: "sw-uklidnit-1",
      difficulty: 1,
      sentenceBefore: "Maminka se snažila ",
      sentenceAfter: " dítě po zlém snu.",
      options: ["uklidit", "uklidnit"],
      answer: "uklidnit",
      explanation: "Správně je `uklidnit` – maminka zklidňuje dítě.",
      insight: "`uklidit` = to tidy (things); `uklidnit` = to calm (a person)."
    }),
    similarWord({
      id: "sw-uklidit-2",
      difficulty: 1,
      sentenceBefore: "Nejdřív chci ",
      sentenceAfter: " stůl a potom začnu vařit.",
      options: ["uklidit", "uklidnit"],
      answer: "uklidit",
      explanation: "Správně je `uklidit` – uklízíš stůl.",
      insight: "`uklidit` = to tidy; `uklidnit` = to calm."
    }),
    similarWord({
      id: "sw-uklidnit-2",
      difficulty: 1,
      sentenceBefore: "Zkus se nadechnout, to tě možná ",
      sentenceAfter: ".",
      options: ["uklidí", "uklidní"],
      answer: "uklidní",
      explanation: "Správně je `uklidní` – dýchání tě zklidní.",
      insight: "`uklidit` = to tidy; `uklidnit` = to calm."
    }),
    similarWord({
      id: "sw-tip-1",
      difficulty: 1,
      sentenceBefore: "Máš nějaký dobrý ",
      sentenceAfter: " na levný hotel v centru?",
      options: ["tip", "typ"],
      answer: "tip",
      explanation: "Správně je `tip` – doporučení, rada.",
      insight: "`tip` = tip, recommendation; `typ` = type, kind."
    }),
    similarWord({
      id: "sw-tip-2",
      difficulty: 1,
      sentenceBefore: "Děkuju za ",
      sentenceAfter: " na zajímavý film.",
      options: ["tip", "typ"],
      answer: "tip",
      explanation: "Správně je `tip` – doporučení.",
      insight: "`tip` = tip, recommendation; `typ` = type."
    }),
    similarWord({
      id: "sw-typ-2",
      difficulty: 1,
      sentenceBefore: "Jaký ",
      sentenceAfter: " lidí obvykle pracuje v této firmě?",
      options: ["tip", "typ"],
      answer: "typ",
      explanation: "Správně je `typ` – druh lidí.",
      insight: "`tip` = tip; `typ` = type (of people)."
    }),
    similarWord({
      id: "sw-myt-1",
      difficulty: 1,
      sentenceBefore: "Musím si před jídlem ",
      sentenceAfter: " ruce.",
      options: ["mýt", "mít"],
      answer: "mýt",
      explanation: "Správně je `mýt` – umýt ruce.",
      insight: "`mýt` = to wash; `mít` = to have."
    }),
    similarWord({
      id: "sw-mit-1",
      difficulty: 1,
      sentenceBefore: "Chci ",
      sentenceAfter: " jednou vlastní byt.",
      options: ["mýt", "mít"],
      answer: "mít",
      explanation: "Správně je `mít` – vlastnit byt.",
      insight: "`mýt` = to wash; `mít` = to have."
    }),
    similarWord({
      id: "sw-mit-3",
      difficulty: 1,
      sentenceBefore: "Bohužel dnes nebudu ",
      sentenceAfter: " čas.",
      options: ["mýt", "mít"],
      answer: "mít",
      explanation: "Správně je `mít` – mít čas.",
      insight: "`mýt` = to wash; `mít` = to have."
    }),
    similarWord({
      id: "sw-byt-1",
      difficulty: 1,
      sentenceBefore: "Chci ",
      sentenceAfter: " doma a odpočívat.",
      options: ["být", "bít"],
      answer: "být",
      explanation: "Správně je `být` – být doma.",
      insight: "`být` = to be; `bít` = to hit."
    }),
    similarWord({
      id: "sw-bit-1",
      difficulty: 1,
      sentenceBefore: "Nesmíš ",
      sentenceAfter: " mladšího bratra.",
      options: ["být", "bít"],
      answer: "bít",
      explanation: "Správně je `bít` – nesmíš ho bít.",
      insight: "`být` = to be; `bít` = to hit."
    }),
    similarWord({
      id: "sw-byt-2",
      difficulty: 1,
      sentenceBefore: "Je těžké ",
      sentenceAfter: " pořád krásná.",
      options: ["být", "bít"],
      answer: "být",
      explanation: "Správně je `být` – být krásná.",
      insight: "`být` = to be; `bít` = to hit."
    }),
    similarWord({
      id: "sw-radit-1",
      difficulty: 1,
      sentenceBefore: "Učitel nám chce ",
      sentenceAfter: ", jak se lépe učit slovíčka.",
      options: ["radit", "řadit"],
      answer: "radit",
      explanation: "Správně je `radit` – dávat rady.",
      insight: "`radit` = to advise; `řadit` = to sort, arrange."
    }),
    similarWord({
      id: "sw-radit-2",
      difficulty: 1,
      sentenceBefore: "Prosím tě, můžeš ta jména ",
      sentenceAfter: " podle abecedy?",
      options: ["radit", "řadit"],
      answer: "řadit",
      explanation: "Správně je `řadit` – seřadit jména.",
      insight: "`radit` = to advise; `řadit` = to sort."
    }),
    similarWord({
      id: "sw-radit-3",
      difficulty: 1,
      sentenceBefore: "Rodiče dětem často ",
      sentenceAfter: ", co je správné.",
      options: ["radí", "řadí"],
      answer: "radí",
      explanation: "Správně je `radí` – dávají rady.",
      insight: "`radit` = to advise; `řadit` = to sort."
    }),
    similarWord({
      id: "sw-radit-4",
      difficulty: 1,
      sentenceBefore: "Ve škole jsme se učili ",
      sentenceAfter: " čísla od nejmenšího po největší.",
      options: ["radit", "řadit"],
      answer: "řadit",
      explanation: "Správně je `řadit` – řadit čísla do pořadí.",
      insight: "`radit` = to advise; `řadit` = to sort."
    }),
    similarWord({
      id: "sw-hulka-1",
      difficulty: 1,
      sentenceBefore: "Dědeček chodí o ",
      sentenceAfter: ", protože ho bolí noha.",
      options: ["holce", "hůlce"],
      answer: "hůlce",
      explanation: "Správně je `hůlce` – s hůlkou.",
      insight: "`holka` = girl; `hůlka` = stick, wand."
    }),
    similarWord({
      id: "sw-holka-2",
      difficulty: 1,
      sentenceBefore: "V parku stála mladá ",
      sentenceAfter: " se psem.",
      options: ["holka", "hůlka"],
      answer: "holka",
      explanation: "Správně je `holka` – dívka se psem.",
      insight: "`holka` = girl; `hůlka` = stick, wand."
    }),
    similarWord({
      id: "sw-hulka-2",
      difficulty: 1,
      sentenceBefore: "Harry Potter má kouzelnou ",
      sentenceAfter: ".",
      options: ["holku", "hůlku"],
      answer: "hůlku",
      explanation: "Správně je `hůlku` – kouzelná hůlka.",
      insight: "`holka` = girl; `hůlka` = stick, wand."
    }),
    similarWord({
      id: "sw-horky-1",
      difficulty: 1,
      sentenceBefore: "Pozor, ten čaj je ještě moc ",
      sentenceAfter: ".",
      options: ["horký", "hořký"],
      answer: "horký",
      explanation: "Správně je `horký` – vysoká teplota.",
      insight: "`horký` = hot; `hořký` = bitter."
    }),
    similarWord({
      id: "sw-horky-2",
      difficulty: 1,
      sentenceBefore: "Nemám rád ",
      sentenceAfter: " léky ani kávu bez cukru.",
      options: ["horké", "hořké"],
      answer: "hořké",
      explanation: "Správně je `hořké` – hořká chuť.",
      insight: "`horký` = hot; `hořký` = bitter."
    }),
    similarWord({
      id: "sw-horky-3",
      difficulty: 1,
      sentenceBefore: "V létě byl písek na pláži tak ",
      sentenceAfter: ", že se po něm nedalo chodit.",
      options: ["horký", "hořký"],
      answer: "horký",
      explanation: "Správně je `horký` – horký písek.",
      insight: "`horký` = hot; `hořký` = bitter."
    }),
    similarWord({
      id: "sw-horky-4",
      difficulty: 1,
      sentenceBefore: "Grapefruit má trochu ",
      sentenceAfter: " chuť.",
      options: ["horkou", "hořkou"],
      answer: "hořkou",
      explanation: "Správně je `hořkou` – hořká chuť.",
      insight: "`horký` = hot; `hořký` = bitter."
    }),
  ];

  const similarWordsTopic = {
    id: "similar_words",
    label: "Podobná slova",
    shortLabel: "Podobná slova",
    description: "Uklidit si v myšlenkách a uklidnit mysl.",
    patterns: [
      {
        id: "similar_words",
        weight: 100,
        label: "Podobná slova",
        explanation: "Vyber správné slovo z dvojice, která zní podobně.",
        exercises: similarWordsExercises
      }
    ]
  };

  window.CzechGrammarTrainerContent = window.CzechGrammarTrainerContent || {};
  window.CzechGrammarTrainerContent.similarWordsTopic = similarWordsTopic;
}());
