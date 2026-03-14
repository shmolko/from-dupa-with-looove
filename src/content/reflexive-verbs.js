(function () {
  function choice({ id, difficulty, choices, answer, explanation, insight }) {
    return {
      id,
      type: "multiple_choice",
      difficulty,
      prompt: "Která věta je správně?",
      choices,
      acceptedAnswers: [answer],
      explanation,
      insight
    };
  }

  function judge({ id, difficulty, sentence, isSentenceCorrect, correctSentence = "", explanation, insight }) {
    const exercise = {
      id,
      type: "sentence_judgment",
      difficulty,
      prompt: "Je tato věta správně?",
      sentence,
      isSentenceCorrect,
      explanation,
      insight
    };

    if (!isSentenceCorrect && correctSentence) {
      exercise.acceptedAnswers = [correctSentence];
    }

    return exercise;
  }

  function buildTriple({ idBase, difficulty, correctSentence, wrongSentence, explanation, insight }) {
    return [
      choice({
        id: `${idBase}-choice`,
        difficulty,
        choices: [correctSentence, wrongSentence],
        answer: correctSentence,
        explanation,
        insight
      }),
      judge({
        id: `${idBase}-wrong`,
        difficulty,
        sentence: wrongSentence,
        isSentenceCorrect: false,
        correctSentence,
        explanation,
        insight
      }),
      judge({
        id: `${idBase}-correct`,
        difficulty,
        sentence: correctSentence,
        isSentenceCorrect: true,
        explanation,
        insight
      })
    ];
  }

  function buildMandatorySet({ idBase, difficulty, lemma, correctSentence, wrongSentence, hint }) {
    const particle = lemma.split(" ").slice(-1)[0];
    return buildTriple({
      idBase,
      difficulty,
      correctSentence,
      wrongSentence,
      explanation: `Správně je \`${lemma}\`.`,
      insight: hint || `Pamatuj si celé spojení \`${lemma}\`. Bez \`${particle}\` se nepoužívá.`
    });
  }

  function buildPlainSet({ idBase, difficulty, lemma, correctSentence, wrongSentence, hint }) {
    return buildTriple({
      idBase,
      difficulty,
      correctSentence,
      wrongSentence,
      explanation: `V téhle větě je správně sloveso \`${lemma}\`, bez \`se\`.`,
      insight: hint || `U slovesa \`${lemma}\` se v tomto významu \`se\` nepoužívá.`
    });
  }

  function buildContrastPair({
    idBase,
    difficulty,
    choiceCorrect,
    choiceWrong,
    choiceExplanation,
    choiceInsight,
    judgeWrong,
    judgeCorrect,
    judgeExplanation,
    judgeInsight
  }) {
    return [
      choice({
        id: `${idBase}-choice`,
        difficulty,
        choices: [choiceCorrect, choiceWrong],
        answer: choiceCorrect,
        explanation: choiceExplanation,
        insight: choiceInsight
      }),
      judge({
        id: `${idBase}-wrong`,
        difficulty,
        sentence: judgeWrong,
        isSentenceCorrect: false,
        correctSentence: judgeCorrect,
        explanation: judgeExplanation,
        insight: judgeInsight
      })
    ];
  }

  const particlePresenceExercises = [
    ...buildMandatorySet({
      idBase: "presence-bat-se",
      difficulty: 1,
      lemma: "bát se",
      correctSentence: "Děti se bojí tmy.",
      wrongSentence: "Děti bojí tmy.",
      hint: "Pamatuj si celé spojení `bát se`. Bez `se` se nepoužívá."
    }),
    ...buildMandatorySet({
      idBase: "presence-tesit-se",
      difficulty: 1,
      lemma: "těšit se",
      correctSentence: "Na víkend se moc těším.",
      wrongSentence: "Na víkend moc těším.",
      hint: "Říkáme `těšit se na něco`. Bez `se` to není správně."
    }),
    ...buildMandatorySet({
      idBase: "presence-divat-se",
      difficulty: 1,
      lemma: "dívat se",
      correctSentence: "Večer se dívá na seriál.",
      wrongSentence: "Večer dívá na seriál.",
      hint: "U slovesa `dívat se` nech vždycky `se`."
    }),
    ...buildMandatorySet({
      idBase: "presence-smat-se",
      difficulty: 1,
      lemma: "smát se",
      correctSentence: "Všichni se smáli tomu vtipu.",
      wrongSentence: "Všichni smáli tomu vtipu.",
      hint: "Říkáme `smát se něčemu`. Bez `se` věta není správně."
    }),
    ...buildMandatorySet({
      idBase: "presence-ptat-se",
      difficulty: 1,
      lemma: "ptát se",
      correctSentence: "Turista se ptal na cestu.",
      wrongSentence: "Turista ptal na cestu.",
      hint: "Pamatuj si `ptát se na něco`. `Se` tu musí zůstat."
    }),
    ...buildMandatorySet({
      idBase: "presence-soustredit-se",
      difficulty: 1,
      lemma: "soustředit se",
      correctSentence: "V hluku se nedokážu soustředit.",
      wrongSentence: "V hluku nedokážu soustředit.",
      hint: "Říkáme `soustředit se`. Bez `se` to v této větě nejde."
    }),
    ...buildMandatorySet({
      idBase: "presence-radovat-se",
      difficulty: 1,
      lemma: "radovat se",
      correctSentence: "Děti se radovaly z dárků.",
      wrongSentence: "Děti radovaly z dárků.",
      hint: "U slovesa `radovat se` nech `se` vždycky."
    }),
    ...buildMandatorySet({
      idBase: "presence-libit-se",
      difficulty: 1,
      lemma: "líbit se",
      correctSentence: "Ten byt se mi líbí.",
      wrongSentence: "Ten byt mi líbí.",
      hint: "Pamatuj si celé spojení `líbit se`. Bez `se` to nefunguje."
    }),
    ...buildMandatorySet({
      idBase: "presence-divit-se",
      difficulty: 1,
      lemma: "divit se",
      correctSentence: "Pořád se divím, že to zvládla.",
      wrongSentence: "Pořád divím, že to zvládla.",
      hint: "Říkáme `divit se`. `Se` je součást tohoto slovesa."
    }),
    ...buildMandatorySet({
      idBase: "presence-podobat-se",
      difficulty: 1,
      lemma: "podobat se",
      correctSentence: "Syn se podobá otci.",
      wrongSentence: "Syn podobá otci.",
      hint: "Pamatuj si `podobat se někomu`. Bez `se` se to nepoužívá."
    }),
    ...buildTriple({
      idBase: "presence-mluvit",
      difficulty: 1,
      correctSentence: "Celý večer mluvili o cestování.",
      wrongSentence: "Celý večer si mluvili o cestování.",
      explanation: "Tady je správně sloveso `mluvit` bez `se` i bez `si`.",
      insight: "U `mluvit` se nepoužívá ani `se`, ani `si`."
    }),
    ...buildPlainSet({
      idBase: "presence-krast",
      difficulty: 1,
      lemma: "krást",
      correctSentence: "Zloděj kradl auto z parkoviště.",
      wrongSentence: "Zloděj se kradl auto z parkoviště."
    }),
    ...buildPlainSet({
      idBase: "presence-pracovat",
      difficulty: 1,
      lemma: "pracovat",
      correctSentence: "Jana pracuje na novém projektu.",
      wrongSentence: "Jana se pracuje na novém projektu."
    }),
    ...buildPlainSet({
      idBase: "presence-telefonovat",
      difficulty: 1,
      lemma: "telefonovat",
      correctSentence: "Klára večer telefonovala s mámou.",
      wrongSentence: "Klára se večer telefonovala s mámou."
    }),
    ...buildPlainSet({
      idBase: "presence-parkovat",
      difficulty: 1,
      lemma: "parkovat",
      correctSentence: "Ondra parkoval před domem.",
      wrongSentence: "Ondra se parkoval před domem."
    }),
    ...buildPlainSet({
      idBase: "presence-cvicit",
      difficulty: 1,
      lemma: "cvičit",
      correctSentence: "Honza ráno cvičí v parku.",
      wrongSentence: "Honza se ráno cvičí v parku.",
      hint: "U slovesa `cvičit` se v tomto významu `se` nepoužívá."
    }),
    ...buildTriple({
      idBase: "presence-bavit-se",
      difficulty: 1,
      correctSentence: "Hosté se na oslavě bavili až do noci.",
      wrongSentence: "Hosté na oslavě bavili až do noci.",
      explanation: "Tady je správně `bavili se`, protože mluvíme o tom, jak se hosté bavili.",
      insight: "Říkáme `bavit se`. Bez `se` věta není správně."
    }),
    ...buildTriple({
      idBase: "presence-koupat-se",
      difficulty: 2,
      correctSentence: "V létě se koupe v rybníku.",
      wrongSentence: "V létě koupe v rybníku.",
      explanation: "Tady je správně `koupe se`, protože mluvíme o ní samotné.",
      insight: "Porovnej: `koupe se` = ona je ve vodě; `koupe dítě` = myje někoho jiného."
    }),
    ...buildTriple({
      idBase: "presence-vratit-se",
      difficulty: 2,
      correctSentence: "Po práci se vrátila domů.",
      wrongSentence: "Po práci vrátila domů.",
      explanation: "Tady je správně `se vrátila domů`.",
      insight: "Když se člověk vrací sám, bývá správně `vrátit se`."
    }),
    ...buildTriple({
      idBase: "presence-probudit-se",
      difficulty: 2,
      correctSentence: "Dnes se probudila už v šest.",
      wrongSentence: "Dnes probudila už v šest.",
      explanation: "Tady mluvíme o ní samotné, proto `se probudila`.",
      insight: "Když někdo otevře oči sám, říkáme `probudit se`."
    }),
    ...buildTriple({
      idBase: "presence-posadit-se",
      difficulty: 2,
      correctSentence: "U dveří se rychle posadil na lavici.",
      wrongSentence: "U dveří rychle posadil na lavici.",
      explanation: "Tady je správně `se posadil`, protože si sedá on sám.",
      insight: "Porovnej: `posadil se` = sedl si; `posadil hosta` = usadil jiného člověka."
    }),
    ...buildTriple({
      idBase: "presence-ucit-transitive",
      difficulty: 2,
      correctSentence: "Zkušený učitel Petr učí matematiku na základní škole.",
      wrongSentence: "Zkušený učitel Petr se učí matematiku na základní škole.",
      explanation: "Tady je Petr učitel, takže on učí jiné lidi.",
      insight: "Rozlišuj `učit` a `učit se`: učitel `učí`, student `se učí`."
    }),
    ...buildTriple({
      idBase: "presence-vratit-transitive",
      difficulty: 2,
      correctSentence: "Po týdnu vrátila knihu do knihovny.",
      wrongSentence: "Po týdnu se vrátila knihu do knihovny.",
      explanation: "Tady vrací jednu konkrétní věc, proto bez `se`.",
      insight: "`Vrátit se` je člověk zpátky. `Vrátit knihu` je dát věc zpátky."
    })
  ];

  const seVsSiExercises = [
    ...buildTriple({
      idBase: "se-si-cte-knihu",
      difficulty: 2,
      correctSentence: "Večer si čte knihu.",
      wrongSentence: "Večer se čte knihu.",
      explanation: "Správně je `si čte knihu`.",
      insight: "Když po slovesu následuje věc jako `knihu`, často patří `si`."
    }),
    ...buildTriple({
      idBase: "se-si-umyla-ruce",
      difficulty: 2,
      correctSentence: "Před večeří si umyla ruce.",
      wrongSentence: "Před večeří se umyla ruce.",
      explanation: "Správně je `si umyla ruce`.",
      insight: "U částí těla bývá velmi často `si`: `myje si ruce`, `čistí si zuby`, `češe si vlasy`."
    }),
    ...buildTriple({
      idBase: "se-si-osprchovala",
      difficulty: 2,
      correctSentence: "Po tréninku se rychle osprchovala.",
      wrongSentence: "Po tréninku si rychle osprchovala.",
      explanation: "Tady je správně `se osprchovala`.",
      insight: "Když věta jen říká, co člověk dělá sám se sebou, často stačí `se`."
    }),
    ...buildTriple({
      idBase: "se-si-oblekla-kabat",
      difficulty: 2,
      correctSentence: "Ráno si oblékla kabát.",
      wrongSentence: "Ráno se oblékla kabát.",
      explanation: "Správně je `si oblékla kabát`.",
      insight: "Zapamatuj si rozdíl: `obléct se`, ale `obléct si kabát`."
    }),
    ...buildTriple({
      idBase: "se-si-psali-poznamky",
      difficulty: 2,
      correctSentence: "Na poradě si psali poznámky.",
      wrongSentence: "Na poradě se psali poznámky.",
      explanation: "Správně je `si psali poznámky`.",
      insight: "U `psát` bývá často `si`, když píšeš něco pro sebe: `psát si poznámky`, `psát si seznam`."
    }),
    ...buildTriple({
      idBase: "se-si-prevlekl",
      difficulty: 2,
      correctSentence: "Po návratu domů se rychle převlékl.",
      wrongSentence: "Po návratu domů si rychle převlékl.",
      explanation: "Tady je správně `se převlékl`.",
      insight: "Když neříkáš co přesně si oblékl, bývá přirozené `převléct se`."
    }),
    ...buildTriple({
      idBase: "se-si-cesala-vlasy",
      difficulty: 2,
      correctSentence: "Před zrcadlem si česala vlasy.",
      wrongSentence: "Před zrcadlem se česala vlasy.",
      explanation: "Správně je `si česala vlasy`.",
      insight: "U vlasů bývá často `si`: `češe si vlasy`, `myje si vlasy`."
    }),
    ...buildTriple({
      idBase: "se-si-ucesala",
      difficulty: 2,
      correctSentence: "Před odchodem se učesala.",
      wrongSentence: "Před odchodem si učesala.",
      explanation: "Tady je správně `se učesala`.",
      insight: "Když neříkáš co si češe, bývá přirozené `učesat se`."
    }),
    ...buildTriple({
      idBase: "se-si-cisti-zuby",
      difficulty: 2,
      correctSentence: "Každý večer si čistí zuby.",
      wrongSentence: "Každý večer se čistí zuby.",
      explanation: "Správně je `si čistí zuby`.",
      insight: "U zubů je nejběžnější spojení `čistit si zuby`."
    }),
    ...buildTriple({
      idBase: "se-si-umyl",
      difficulty: 2,
      correctSentence: "Po běhu se umyl a převlékl.",
      wrongSentence: "Po běhu si umyl a převlékl.",
      explanation: "Tady je správně `se umyl`.",
      insight: "Když neříkáš co konkrétně si umyl, bývá přirozené `umýt se`."
    }),
    ...buildTriple({
      idBase: "se-si-holi",
      difficulty: 2,
      correctSentence: "Každé ráno se holí před prací.",
      wrongSentence: "Každé ráno si holí před prací.",
      explanation: "Správně je `se holí` – mluvíme jen o tom, že se holí, bez konkrétní části těla.",
      insight: "Rozdíl: `se holí` = holí se obecně; `si holí bradu` = holí si konkrétní část těla. Když část těla není ve větě, patří `se`."
    }),
    choice({
      id: "se-si-sedla-choice",
      difficulty: 2,
      choices: [
        "Sedla si na lavičku vedle kamarádky.",
        "Sedla se na lavičku vedle kamarádky."
      ],
      answer: "Sedla si na lavičku vedle kamarádky.",
      explanation: "Správně je `si sedla na lavičku`.",
      insight: "U sloves jako `sednout si` nebo `lehnout si` používáme `si`."
    }),
    judge({
      id: "se-si-lehl-wrong",
      difficulty: 2,
      sentence: "Po obědě se lehl na gauč.",
      isSentenceCorrect: false,
      correctSentence: "Po obědě si lehl na gauč.",
      explanation: "Správně je `si lehl na gauč`.",
      insight: "Když si člověk sedá nebo lehá kvůli sobě, bývá správně `si`."
    })
  ];

  const contrastExercises = [
    ...buildContrastPair({
      idBase: "contrast-vratit",
      difficulty: 3,
      choiceCorrect: "Po koncertě se vrátili domů.",
      choiceWrong: "Po koncertě vrátili domů.",
      choiceExplanation: "Správně je `se vrátili domů`, protože domů se vracejí oni sami.",
      choiceInsight: "Pamatuj si rozdíl: člověk `se vrátí`, ale věc někdo `vrátí`.",
      judgeWrong: "Po škole se vrátil knihu do knihovny.",
      judgeCorrect: "Po škole vrátil knihu do knihovny.",
      judgeExplanation: "Správně je `vrátil knihu`, bez `se`.",
      judgeInsight: "Zeptej se sama sebe: vrací se člověk domů, nebo někdo vrací nějakou věc?"
    }),
    choice({
      id: "contrast-ucit-choice",
      difficulty: 3,
      choices: ["Po večerech se učí češtinu, aby složila zkoušku.", "Po večerech učí češtinu, aby složila zkoušku."],
      answer: "Po večerech se učí češtinu, aby složila zkoušku.",
      explanation: "Správně je `se učí češtinu`, protože sama studuje.",
      insight: "Jednoduché pravidlo: student `se učí`, učitel `učí`."
    }),
    ...buildContrastPair({
      idBase: "contrast-koupat",
      difficulty: 3,
      choiceCorrect: "V létě se koupe v řece skoro každý den.",
      choiceWrong: "V létě koupe v řece skoro každý den.",
      choiceExplanation: "Správně je `se koupe`, protože mluvíme o ní samotné.",
      choiceInsight: "Porovnej: `koupe se` = je ve vodě; `koupe dítě` = myje někoho jiného.",
      judgeWrong: "Po večeři se koupe malého syna ve vaně.",
      judgeCorrect: "Po večeři koupe malého syna ve vaně.",
      judgeExplanation: "Správně je `koupe malého syna`, bez `se`.",
      judgeInsight: "Když je po slovesu další osoba, často jde o činnost bez `se`."
    }),
    ...buildContrastPair({
      idBase: "contrast-probudit",
      difficulty: 3,
      choiceCorrect: "Dnes se probudila už před šestou.",
      choiceWrong: "Dnes probudila už před šestou.",
      choiceExplanation: "Správně je `se probudila`, protože mluvíme o ní.",
      choiceInsight: "`Probudit se` = otevřít oči sám. `Probudit syna` = vzbudit někoho jiného.",
      judgeWrong: "Maminka se probudila děti do školy.",
      judgeCorrect: "Maminka probudila děti do školy.",
      judgeExplanation: "Správně je `probudila děti`, bez `se`.",
      judgeInsight: "Když budíš někoho jiného, používá se jen `probudit`."
    }),
    choice({
      id: "contrast-posadit-choice",
      difficulty: 3,
      choices: ["Po příchodu se posadila ke stolu.", "Po příchodu posadila ke stolu."],
      answer: "Po příchodu se posadila ke stolu.",
      explanation: "Správně je `se posadila`, protože si sedá sama.",
      insight: "`Posadit se` = sednout si. `Posadit hosta` = usadit jiného člověka."
    }),
    choice({
      id: "contrast-oblect-choice",
      difficulty: 3,
      choices: ["Než odešel, rychle se oblékl.", "Než odešel, rychle oblékl."],
      answer: "Než odešel, rychle se oblékl.",
      explanation: "Správně je `se oblékl`, protože mluvíme o něm samotném.",
      insight: "Zapamatuj si rozdíl: `obléct se`, ale `obléct dítě` nebo `obléct si kabát`."
    }),
    choice({
      id: "contrast-umyt-choice",
      difficulty: 3,
      choices: ["Po práci se umyl a převlékl.", "Po práci umyl a převlékl."],
      answer: "Po práci se umyl a převlékl.",
      explanation: "Správně je `se umyl`, protože mluvíme o něm.",
      insight: "`Umýt se` = umýt vlastní tělo. `Umýt auto` = umýt nějakou věc."
    }),
    choice({
      id: "contrast-cesat-choice",
      difficulty: 3,
      choices: ["Před odchodem se učesala.", "Před odchodem učesala."],
      answer: "Před odchodem se učesala.",
      explanation: "Správně je `se učesala`, protože mluvíme o ní samotné.",
      insight: "`Učesat se` = učesat sebe. `Učesat dceru` = učesat někoho jiného."
    }),
    ...buildContrastPair({
      idBase: "contrast-prihlasit",
      difficulty: 3,
      choiceCorrect: "Včas se přihlásila na kurz.",
      choiceWrong: "Včas přihlásila na kurz.",
      choiceExplanation: "Správně je `se přihlásila na kurz`, protože hlásí sama sebe.",
      choiceInsight: "`Přihlásit se` = zapsat sebe. `Přihlásit studentku` = zapsat někoho jiného.",
      judgeWrong: "Sekretářka se přihlásila novou studentku do systému.",
      judgeCorrect: "Sekretářka přihlásila novou studentku do systému.",
      judgeExplanation: "Správně je `přihlásila novou studentku`, bez `se`.",
      judgeInsight: "Když zapisuješ jiného člověka, používá se jen `přihlásit`."
    }),
    choice({
      id: "contrast-predstavit-choice",
      difficulty: 3,
      choices: ["Na začátku se představila novým kolegům.", "Na začátku představila novým kolegům."],
      answer: "Na začátku se představila novým kolegům.",
      explanation: "Správně je `se představila`, protože mluví o sobě.",
      insight: "`Představit se` = říct, kdo jsem. `Představit plán` = ukázat něco jiného."
    }),
    choice({
      id: "contrast-prevlect-choice",
      difficulty: 3,
      choices: ["Po běhu se rychle převlékl do suchého trička.", "Po běhu rychle převlékl do suchého trička."],
      answer: "Po běhu se rychle převlékl do suchého trička.",
      explanation: "Správně je `se převlékl`, protože mění oblečení on sám.",
      insight: "`Převléct se` = změnit vlastní oblečení. `Převléct dítě` = převléct někoho jiného."
    })
  ];

  const reflexiveVerbsTopic = {
    id: "reflexive_verbs",
    label: "Zvratná slovesa",
    shortLabel: "Zvratná slovesa",
    description: "Má tam být `se`, `si`, nebo nic?",
    patterns: [
      {
        id: "particle_presence",
        weight: 60,
        label: "Má tam být se, si, nebo nic?",
        explanation: "Nejdřív je potřeba poznat, jestli věta chce `se`, `si`, nebo vůbec nic.",
        exercises: particlePresenceExercises
      },
      {
        id: "se_vs_si",
        weight: 25,
        label: "Potřebujeme se, nebo si?",
        explanation: "Tady už víš, že zvratný tvar ve větě být má. Otázka je jen, jestli patří `se`, nebo `si`.",
        exercises: seVsSiExercises
      },
      {
        id: "argument_structure_contrast",
        weight: 15,
        label: "Zvratnost mění význam věty",
        explanation: "Stejné sloveso může s `se`, `si` nebo bez nich znamenat něco jiného. Sleduj, kdo dělá děj a komu se děje.",
        exercises: contrastExercises
      }
    ]
  };

  window.CzechGrammarTrainerContent = window.CzechGrammarTrainerContent || {};
  window.CzechGrammarTrainerContent.reflexiveVerbsTopic = reflexiveVerbsTopic;
}());
