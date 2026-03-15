(function () {
  function choice({ id, difficulty, choices, answer, hint }) {
    return {
      id,
      type: "multiple_choice",
      difficulty,
      prompt: "Která věta je správně?",
      choices,
      acceptedAnswers: [answer],
      hint
    };
  }

  function judge({ id, difficulty, sentence, isSentenceCorrect, correctSentence = "", hint }) {
    const exercise = {
      id,
      type: "sentence_judgment",
      difficulty,
      prompt: "Je tato věta správně?",
      sentence,
      isSentenceCorrect,
      hint
    };

    if (!isSentenceCorrect && correctSentence) {
      exercise.acceptedAnswers = [correctSentence];
    }

    return exercise;
  }

  function buildTriple({ idBase, difficulty, correctSentence, wrongSentence, hint }) {
    return [
      choice({
        id: `${idBase}-choice`,
        difficulty,
        choices: [correctSentence, wrongSentence],
        answer: correctSentence,
        hint
      }),
      judge({
        id: `${idBase}-wrong`,
        difficulty,
        sentence: wrongSentence,
        isSentenceCorrect: false,
        correctSentence,
        hint
      }),
      judge({
        id: `${idBase}-correct`,
        difficulty,
        sentence: correctSentence,
        isSentenceCorrect: true,
        hint
      })
    ];
  }

  const HINT = {
    mandatory: (lemma) => {
      const particle = lemma.split(" ").slice(-1)[0];
      return `Pamatuj si celé spojení \`${lemma}\`. Bez \`${particle}\` se nepoužívá.`;
    },
    plain: (lemma) => `U slovesa \`${lemma}\` se \`se\` ani \`si\` nepoužívá.`
  };

  function buildPresenceSet({ idBase, difficulty, lemma, correctSentence, wrongSentence, kind, hint }) {
    return buildTriple({
      idBase,
      difficulty,
      correctSentence,
      wrongSentence,
      hint: hint || HINT[kind](lemma)
    });
  }

  function buildContrastPair({
    idBase,
    difficulty,
    choiceCorrect,
    choiceWrong,
    choiceHint,
    judgeWrong,
    judgeCorrect,
    judgeHint
  }) {
    return [
      choice({
        id: `${idBase}-choice`,
        difficulty,
        choices: [choiceCorrect, choiceWrong],
        answer: choiceCorrect,
        hint: choiceHint
      }),
      judge({
        id: `${idBase}-wrong`,
        difficulty,
        sentence: judgeWrong,
        isSentenceCorrect: false,
        correctSentence: judgeCorrect,
        hint: judgeHint
      })
    ];
  }

  const particlePresenceExercises = [
    ...buildPresenceSet({
      idBase: "presence-bat-se",
      difficulty: 1,
      lemma: "bát se",
      correctSentence: "Děti se bojí tmy.",
      wrongSentence: "Děti bojí tmy.",
      kind: "mandatory"
    }),
    ...buildPresenceSet({
      idBase: "presence-tesit-se",
      difficulty: 1,
      lemma: "těšit se",
      correctSentence: "Na víkend se moc těším.",
      wrongSentence: "Na víkend moc těším.",
      kind: "mandatory",
      hint: "Říkáme `těšit se na něco`. Bez `se` to není správně."
    }),
    ...buildPresenceSet({
      idBase: "presence-divat-se",
      difficulty: 1,
      lemma: "dívat se",
      correctSentence: "Večer se dívá na seriál.",
      wrongSentence: "Večer dívá na seriál.",
      kind: "mandatory",
      hint: "U slovesa `dívat se` nech vždycky `se`."
    }),
    ...buildPresenceSet({
      idBase: "presence-smat-se",
      difficulty: 1,
      lemma: "smát se",
      correctSentence: "Všichni se smáli tomu vtipu.",
      wrongSentence: "Všichni smáli tomu vtipu.",
      kind: "mandatory",
      hint: "Říkáme `smát se něčemu`. Bez `se` věta není správně."
    }),
    ...buildPresenceSet({
      idBase: "presence-ptat-se",
      difficulty: 1,
      lemma: "ptát se",
      correctSentence: "Turista se ptal na cestu.",
      wrongSentence: "Turista ptal na cestu.",
      kind: "mandatory",
      hint: "Pamatuj si `ptát se na něco`. `Se` tu musí zůstat."
    }),
    ...buildPresenceSet({
      idBase: "presence-soustredit-se",
      difficulty: 1,
      lemma: "soustředit se",
      correctSentence: "V hluku se nedokážu soustředit.",
      wrongSentence: "V hluku nedokážu soustředit.",
      kind: "mandatory",
      hint: "Říkáme `soustředit se`. Bez `se` to v této větě nejde."
    }),
    ...buildPresenceSet({
      idBase: "presence-radovat-se",
      difficulty: 1,
      lemma: "radovat se",
      correctSentence: "Děti se radovaly z dárků.",
      wrongSentence: "Děti radovaly z dárků.",
      kind: "mandatory",
      hint: "U slovesa `radovat se` nech `se` vždycky."
    }),
    ...buildPresenceSet({
      idBase: "presence-libit-se",
      difficulty: 1,
      lemma: "líbit se",
      correctSentence: "Ten byt se mi líbí.",
      wrongSentence: "Ten byt mi líbí.",
      kind: "mandatory",
      hint: "Pamatuj si celé spojení `líbit se`. Bez `se` to nefunguje."
    }),
    ...buildPresenceSet({
      idBase: "presence-divit-se",
      difficulty: 1,
      lemma: "divit se",
      correctSentence: "Pořád se divím, že to zvládla.",
      wrongSentence: "Pořád divím, že to zvládla.",
      kind: "mandatory",
      hint: "Říkáme `divit se`. `Se` je součást tohoto slovesa."
    }),
    ...buildPresenceSet({
      idBase: "presence-podobat-se",
      difficulty: 1,
      lemma: "podobat se",
      correctSentence: "Syn se podobá otci.",
      wrongSentence: "Syn podobá otci.",
      kind: "mandatory",
      hint: "Pamatuj si `podobat se někomu`. Bez `se` se to nepoužívá."
    }),
    ...buildTriple({
      idBase: "presence-mluvit",
      difficulty: 1,
      correctSentence: "Celý večer mluvili o cestování.",
      wrongSentence: "Celý večer si mluvili o cestování.",
      hint: "U slovesa `mluvit` se `se` ani `si` nepoužívá."
    }),
    ...buildPresenceSet({
      idBase: "presence-krast",
      difficulty: 1,
      lemma: "krást",
      correctSentence: "Zloděj kradl auto z parkoviště.",
      wrongSentence: "Zloděj se kradl auto z parkoviště.",
      kind: "plain"
    }),
    ...buildPresenceSet({
      idBase: "presence-pracovat",
      difficulty: 1,
      lemma: "pracovat",
      correctSentence: "Jana pracuje na novém projektu.",
      wrongSentence: "Jana se pracuje na novém projektu.",
      kind: "plain"
    }),
    ...buildPresenceSet({
      idBase: "presence-telefonovat",
      difficulty: 1,
      lemma: "telefonovat",
      correctSentence: "Klára večer telefonovala s mámou.",
      wrongSentence: "Klára se večer telefonovala s mámou.",
      kind: "plain"
    }),
    ...buildPresenceSet({
      idBase: "presence-parkovat",
      difficulty: 1,
      lemma: "parkovat",
      correctSentence: "Ondra parkoval před domem.",
      wrongSentence: "Ondra se parkoval před domem.",
      kind: "plain"
    }),
    ...buildPresenceSet({
      idBase: "presence-cvicit",
      difficulty: 1,
      lemma: "cvičit",
      correctSentence: "Honza ráno cvičí v parku.",
      wrongSentence: "Honza se ráno cvičí v parku.",
      kind: "plain"
    }),
    ...buildTriple({
      idBase: "presence-bavit-se",
      difficulty: 1,
      correctSentence: "Hosté se na oslavě bavili až do noci.",
      wrongSentence: "Hosté na oslavě bavili až do noci.",
      hint: "Říkáme `bavit se`. Bez `se` věta není správně."
    }),
    ...buildTriple({
      idBase: "presence-koupat-se",
      difficulty: 2,
      correctSentence: "V létě se koupe v rybníku.",
      wrongSentence: "V létě koupe v rybníku.",
      hint: "Porovnej: `koupe se` = ona je ve vodě; `koupe dítě` = myje někoho jiného."
    }),
    ...buildTriple({
      idBase: "presence-vratit-se",
      difficulty: 2,
      correctSentence: "Po práci se vrátila domů.",
      wrongSentence: "Po práci vrátila domů.",
      hint: "Když se člověk vrací sám, bývá správně `vrátit se`."
    }),
    ...buildTriple({
      idBase: "presence-probudit-se",
      difficulty: 2,
      correctSentence: "Dnes se probudila už v šest.",
      wrongSentence: "Dnes probudila už v šest.",
      hint: "Když někdo otevře oči sám, říkáme `probudit se`."
    }),
    ...buildTriple({
      idBase: "presence-posadit-se",
      difficulty: 2,
      correctSentence: "U dveří se rychle posadil na lavici.",
      wrongSentence: "U dveří rychle posadil na lavici.",
      hint: "Porovnej: `posadil se` = sedl si; `posadil hosta` = usadil jiného člověka."
    }),
    ...buildTriple({
      idBase: "presence-ucit-transitive",
      difficulty: 2,
      correctSentence: "Zkušený učitel Petr učí matematiku na základní škole.",
      wrongSentence: "Zkušený učitel Petr se učí matematiku na základní škole.",
      hint: "Rozlišuj `učit` a `učit se`: učitel `učí`, student `se učí`."
    }),
    ...buildTriple({
      idBase: "presence-vratit-transitive",
      difficulty: 2,
      correctSentence: "Po týdnu vrátila knihu do knihovny.",
      wrongSentence: "Po týdnu se vrátila knihu do knihovny.",
      hint: "`Vrátit se` je člověk zpátky. `Vrátit knihu` je dát věc zpátky."
    }),
    ...buildPresenceSet({
      idBase: "presence-narodit-se",
      difficulty: 1,
      lemma: "narodit se",
      correctSentence: "Dítě se narodilo v lednu.",
      wrongSentence: "Dítě narodilo v lednu.",
      kind: "mandatory"
    }),
    ...buildPresenceSet({
      idBase: "presence-stezovat-si",
      difficulty: 1,
      lemma: "stěžovat si",
      correctSentence: "Soused si stěžuje na hluk.",
      wrongSentence: "Soused stěžuje na hluk.",
      kind: "mandatory",
      hint: "Pamatuj si celé spojení `stěžovat si` / `stěžovat se`. Bez `si`/`se` se nepoužívá."
    }),
    ...buildPresenceSet({
      idBase: "presence-pamatovat-si",
      difficulty: 1,
      lemma: "pamatovat si",
      correctSentence: "Pamatuju si tvoje jméno.",
      wrongSentence: "Pamatuju tvoje jméno.",
      kind: "mandatory",
      hint: "Pamatuj si celé spojení `pamatovat si` / `pamatovat se`. Bez `si` / `se` se nepoužívá."
    }),
    ...buildPresenceSet({
      idBase: "presence-uzivat-si",
      difficulty: 1,
      lemma: "užívat si",
      correctSentence: "Rodina si užívá dovolenou u moře.",
      wrongSentence: "Rodina užívá dovolenou u moře.",
      kind: "mandatory"
    }),
    ...buildTriple({
      idBase: "reciprocal-videt-se",
      difficulty: 2,
      correctSentence: "V pondělí se uvidíme s Hankou.",
      wrongSentence: "V pondělí uvidíme s Hankou.",
      hint: "`Se` tady znamená \"vzájemně\" nebo \"jeden druhého\"."
    }),
    ...buildTriple({
      idBase: "reciprocal-znat-se",
      difficulty: 2,
      correctSentence: "Znají se už od školky.",
      wrongSentence: "Znají už od školky.",
      hint: "`Se` tady znamená \"vzájemně\" nebo \"jeden druhého\"."
    }),
    ...buildTriple({
      idBase: "reciprocal-nenavidet-se",
      difficulty: 2,
      correctSentence: "Ti dva se vždycky nenáviděli.",
      wrongSentence: "Ti dva vždycky nenáviděli.",
      hint: "`Se` tady znamená \"vzájemně\" nebo \"jeden druhého\"."
    }),
    ...buildTriple({
      idBase: "passive-dum-se-opravuje",
      difficulty: 2,
      correctSentence: "Dům se opravuje.",
      wrongSentence: "Dům opravuje.",
      hint: "`Se` tady neznamená „sám sobě“, ale spíš „něco je děláno“, „něco se děje“."
    }),
    ...buildTriple({
      idBase: "passive-tady-se-nekouri",
      difficulty: 2,
      correctSentence: "Tady se nekouří.",
      wrongSentence: "Tady nekouří.",
      hint: "`Se` tady neznamená „sám sobě“, ale spíš „něco je děláno“, „něco se děje“."
    })
  ];

  const seVsSiExercises = [
    ...buildTriple({
      idBase: "se-si-cte-knihu",
      difficulty: 2,
      correctSentence: "Večer si čte knihu.",
      wrongSentence: "Večer se čte knihu.",
      hint: "Když po slovesu následuje věc jako `knihu`, často patří `si`."
    }),
    ...buildTriple({
      idBase: "se-si-umyla-ruce",
      difficulty: 2,
      correctSentence: "Před večeří si umyla ruce.",
      wrongSentence: "Před večeří se umyla ruce.",
      hint: "U částí těla bývá velmi často `si`: `myje si ruce`, `čistí si zuby`, `češe si vlasy`."
    }),
    ...buildTriple({
      idBase: "se-si-osprchovala",
      difficulty: 2,
      correctSentence: "Po tréninku se rychle osprchovala.",
      wrongSentence: "Po tréninku si rychle osprchovala.",
      hint: "Když věta jen říká, co člověk dělá sám se sebou, často stačí `se`."
    }),
    ...buildTriple({
      idBase: "se-si-oblekla-kabat",
      difficulty: 2,
      correctSentence: "Ráno si oblékla kabát.",
      wrongSentence: "Ráno se oblékla kabát.",
      hint: "Zapamatuj si rozdíl: `obléct se` (sama sebe) , ale `obléct si` něco (kabát)."
    }),
    ...buildTriple({
      idBase: "se-si-psali-poznamky",
      difficulty: 2,
      correctSentence: "Na poradě si psali poznámky.",
      wrongSentence: "Na poradě se psali poznámky.",
      hint: "U `psát` bývá často `si`, když píšeš něco pro sebe: `psát si poznámky`, `psát si seznam`."
    }),
    ...buildTriple({
      idBase: "se-si-prevlekl",
      difficulty: 2,
      correctSentence: "Po návratu domů se rychle převlékl.",
      wrongSentence: "Po návratu domů si rychle převlékl.",
      hint: "Když neříkáš co přesně si oblékl, bývá přirozené `převléct se`."
    }),
    ...buildTriple({
      idBase: "se-si-cesala-vlasy",
      difficulty: 2,
      correctSentence: "Před zrcadlem si česala vlasy.",
      wrongSentence: "Před zrcadlem se česala vlasy.",
      hint: "U vlasů bývá často `si`: `češe si vlasy`, `myje si vlasy`."
    }),
    ...buildTriple({
      idBase: "se-si-ucesala",
      difficulty: 2,
      correctSentence: "Před odchodem se učesala.",
      wrongSentence: "Před odchodem si učesala.",
      hint: "Když neříkáš co si češe, bývá přirozené `učesat se`."
    }),
    ...buildTriple({
      idBase: "se-si-cisti-zuby",
      difficulty: 2,
      correctSentence: "Každý večer si čistí zuby.",
      wrongSentence: "Každý večer se čistí zuby.",
      hint: "U zubů je nejběžnější spojení `čistit si zuby`."
    }),
    ...buildTriple({
      idBase: "se-si-umyl",
      difficulty: 2,
      correctSentence: "Po běhu se umyl a převlékl.",
      wrongSentence: "Po běhu si umyl a převlékl.",
      hint: "Když neříkáš co konkrétně si umyl, bývá přirozené `umýt se`."
    }),
    ...buildTriple({
      idBase: "se-si-holi",
      difficulty: 2,
      correctSentence: "Každé ráno se holí před prací.",
      wrongSentence: "Každé ráno si holí před prací.",
      hint: "Rozdíl: `se holí` = holí se obecně; `si holí bradu` = holí si konkrétní část těla. Když část těla není ve větě, patří `se`."
    }),
    choice({
      id: "se-si-sedla-choice",
      difficulty: 2,
      choices: [
        "Sedla si na lavičku vedle kamarádky.",
        "Sedla se na lavičku vedle kamarádky."
      ],
      answer: "Sedla si na lavičku vedle kamarádky.",
      hint: "U sloves jako `sednout si` nebo `lehnout si` používáme `si`."
    }),
    judge({
      id: "se-si-lehl-wrong",
      difficulty: 2,
      sentence: "Po obědě se lehl na gauč.",
      isSentenceCorrect: false,
      correctSentence: "Po obědě si lehl na gauč.",
      hint: "Když si člověk sedá nebo lehá kvůli sobě, bývá správně `si`."
    })
  ];

  const contrastExercises = [
    ...buildContrastPair({
      idBase: "contrast-vratit",
      difficulty: 3,
      choiceCorrect: "Po koncertě se vrátili domů.",
      choiceWrong: "Po koncertě vrátili domů.",
      choiceHint: "Pamatuj si rozdíl: člověk `se vrátí`, ale věc někdo `vrátí`.",
      judgeWrong: "Po škole se vrátil knihu do knihovny.",
      judgeCorrect: "Po škole vrátil knihu do knihovny.",
      judgeHint: "Zeptej se sama sebe: vrací se člověk domů, nebo někdo vrací nějakou věc?"
    }),
    choice({
      id: "contrast-ucit-choice",
      difficulty: 3,
      choices: ["Po večerech se učí češtinu, aby složila zkoušku.", "Po večerech učí češtinu, aby složila zkoušku."],
      answer: "Po večerech se učí češtinu, aby složila zkoušku.",
      hint: "Jednoduché pravidlo: student `se učí`, učitel `učí`."
    }),
    ...buildContrastPair({
      idBase: "contrast-koupat",
      difficulty: 3,
      choiceCorrect: "V létě se koupe v řece skoro každý den.",
      choiceWrong: "V létě koupe v řece skoro každý den.",
      choiceHint: "Porovnej: `koupe se` = je ve vodě; `koupe dítě` = myje někoho jiného.",
      judgeWrong: "Po večeři se koupe malého syna ve vaně.",
      judgeCorrect: "Po večeři koupe malého syna ve vaně.",
      judgeHint: "Když je po slovesu další osoba, často jde o činnost bez `se`."
    }),
    ...buildContrastPair({
      idBase: "contrast-probudit",
      difficulty: 3,
      choiceCorrect: "Dnes se probudila už před šestou.",
      choiceWrong: "Dnes probudila už před šestou.",
      choiceHint: "`Probudit se` = otevřít oči sám. `Probudit syna` = vzbudit někoho jiného.",
      judgeWrong: "Maminka se probudila děti do školy.",
      judgeCorrect: "Maminka probudila děti do školy.",
      judgeHint: "Když budíš někoho jiného, používá se jen `probudit`."
    }),
    choice({
      id: "contrast-posadit-choice",
      difficulty: 3,
      choices: ["Po příchodu se posadila ke stolu.", "Po příchodu posadila ke stolu."],
      answer: "Po příchodu se posadila ke stolu.",
      hint: "`Posadit se` = sednout si. `Posadit hosta` = usadit jiného člověka."
    }),
    choice({
      id: "contrast-oblect-choice",
      difficulty: 3,
      choices: ["Než odešel, rychle se oblékl.", "Než odešel, rychle oblékl."],
      answer: "Než odešel, rychle se oblékl.",
      hint: "Zapamatuj si rozdíl: `obléct se`, ale `obléct dítě` nebo `obléct si kabát`."
    }),
    choice({
      id: "contrast-umyt-choice",
      difficulty: 3,
      choices: ["Po práci se umyl a převlékl.", "Po práci umyl a převlékl."],
      answer: "Po práci se umyl a převlékl.",
      hint: "`Umýt se` = umýt vlastní tělo. `Umýt auto` = umýt nějakou věc."
    }),
    choice({
      id: "contrast-cesat-choice",
      difficulty: 3,
      choices: ["Před odchodem se učesala.", "Před odchodem učesala."],
      answer: "Před odchodem se učesala.",
      hint: "`Učesat se` = učesat sebe. `Učesat dceru` = učesat někoho jiného."
    }),
    ...buildContrastPair({
      idBase: "contrast-prihlasit",
      difficulty: 3,
      choiceCorrect: "Včas se přihlásila na kurz.",
      choiceWrong: "Včas přihlásila na kurz.",
      choiceHint: "`Přihlásit se` = zapsat sebe. `Přihlásit studentku` = zapsat někoho jiného.",
      judgeWrong: "Sekretářka se přihlásila novou studentku do systému.",
      judgeCorrect: "Sekretářka přihlásila novou studentku do systému.",
      judgeHint: "Když zapisuješ jiného člověka, používá se jen `přihlásit`."
    }),
    choice({
      id: "contrast-predstavit-choice",
      difficulty: 3,
      choices: ["Na začátku se představila novým kolegům.", "Na začátku představila novým kolegům."],
      answer: "Na začátku se představila novým kolegům.",
      hint: "`Představit se` = říct, kdo jsem. `Představit plán` = ukázat něco jiného."
    }),
    choice({
      id: "contrast-prevlect-choice",
      difficulty: 3,
      choices: ["Po běhu se rychle převlékl do suchého trička.", "Po běhu rychle převlékl do suchého trička."],
      answer: "Po běhu se rychle převlékl do suchého trička.",
      hint: "`Převléct se` = změnit vlastní oblečení. `Převléct dítě` = převléct někoho jiného."
    }),
    ...buildContrastPair({
      idBase: "contrast-ztratit",
      difficulty: 3,
      choiceCorrect: "Chlapec se ztratil v obchodním centru.",
      choiceWrong: "Chlapec ztratil v obchodním centru.",
      choiceHint: "`Ztratit se` = zabloudit, zmizet. `Ztratit klíče` = někde nechat věc.",
      judgeWrong: "Soused se ztratil peněženku.",
      judgeCorrect: "Soused ztratil peněženku.",
      judgeHint: "Když někdo ztratí věc, používá se jen `ztratit` (bez `se`)."
    })
  ];

  const reflexiveVerbsTopic = {
    id: "reflexive_verbs",
    label: "Zvratná slovesa",
    shortLabel: "Zvratná slovesa",
    description: "Se \"se\" nebo ne se \"se\"?",
    patterns: [
      {
        id: "particle_presence",
        weight: 60,
        label: "Má tam být se, si, nebo nic?",
        exercises: particlePresenceExercises
      },
      {
        id: "se_vs_si",
        weight: 25,
        label: "Potřebujeme se, nebo si?",
        exercises: seVsSiExercises
      },
      {
        id: "argument_structure_contrast",
        weight: 15,
        label: "Zvratnost mění význam věty",
        exercises: contrastExercises
      }
    ]
  };

  window.CzechGrammarTrainerContent = window.CzechGrammarTrainerContent || {};
  window.CzechGrammarTrainerContent.reflexiveVerbsTopic = reflexiveVerbsTopic;
}());
