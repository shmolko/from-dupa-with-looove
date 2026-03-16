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
      hint: "Porovnej: `posadil se` = sedl si; `posadil hosta` = usadit jiného člověka."
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
      kind: "mandatory",
      hint: "Užívat si = vnitřní stav, z něčeho se těším. Užívat bez si = užívat něco, např. užívat (brát) léky."
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
      hint: "`Se` tady neznamená \"sám sobě\", ale spíš \"něco je děláno\", \"něco se děje\"."
    }),
    ...buildTriple({
      idBase: "passive-tady-se-nekouri",
      difficulty: 2,
      correctSentence: "Tady se nekouří.",
      wrongSentence: "Tady nekouří.",
      hint: "`Se` tady neznamená \"sám sobě\", ale spíš \"něco je děláno\", \"něco se děje\"."
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

  const reflexiveVerbsTheory = `
<p>V češtině jsou zvratná slovesa taková, která se pojí s malým slovíčkem <strong>se</strong> nebo <strong>si</strong> a chovají se trochu jinak než „obyčejná\" slovesa. Pro studenta je nejdůležitější znát základní typy zvratných sloves, umět rozlišit <strong>se × si</strong> a vědět, kam je ve větě dát.<sup><a href=\"#ref1\">1</a></sup>, <sup><a href=\"#ref2\">2</a></sup></p>

<h3>Co jsou zvratná slovesa</h3>
<ul>
  <li>Zvratné sloveso = <strong>sloveso + zvratné zájmeno se/si</strong> (učit se, mýt se, stěžovat si, bát se…).<sup><a href=\"#ref3\">3</a></sup>, <sup><a href=\"#ref2\">2</a></sup></li>
  <li>Malé slovo <strong>se/si se vždy vztahuje k podmětu</strong> (já, ty, on…), nikdy k někomu jinému.<sup><a href=\"#ref1\">1</a></sup></li>
  <li>Některá slovesa existují <strong>jen jako zvratná</strong> (smát se, bát se, ptát se, stěžovat si), jiná mohou být <strong>zvratná i nezvratná</strong> (učit × učit se, psát × psát si, mýt × mýt se / mýt si ruce).<sup><a href=\"#ref4\">4</a></sup>, <sup><a href=\"#ref2\">2</a></sup></li>
</ul>

<h3>Zvratné zájmeno se × si (jednoduché pravidlo)</h3>
<p>Autoři pro cizince většinou vysvětlují rozdíl přes otázky:<sup><a href=\"#ref1\">1</a></sup></p>
<ul>
  <li><strong>se</strong> – odpovídá na otázku <strong>koho/co?</strong>
    <ul>
      <li>Myju <strong>se</strong>. (koho? – sebe)<sup><a href=\"#ref5\">5</a></sup>, <sup><a href=\"#ref1\">1</a></sup></li>
      <li>Holím <strong>se</strong>.<sup><a href=\"#ref1\">1</a></sup></li>
    </ul>
  </li>
  <li><strong>si</strong> – odpovídá na otázku <strong>komu/čemu?</strong> (pro koho, sobě)
    <ul>
      <li>Kupuju <strong>si</strong> kávu. (komu? – sobě)<sup><a href=\"#ref1\">1</a></sup></li>
      <li>Dělám <strong>si</strong> poznámky.<sup><a href=\"#ref1\">1</a></sup></li>
    </ul>
  </li>
</ul>

<p>Praktické zjednodušení, které se učí v kurzech:<sup><a href=\"#ref6\">6</a></sup>, <sup><a href=\"#ref1\">1</a></sup></p>
<ul>
  <li>Když <strong>není jiný předmět</strong> (žádné „něco\" bez předložky), často bude <strong>se</strong>:
    <ul>
      <li>Myju <strong>se</strong>., Obléká <strong>se</strong>.<sup><a href=\"#ref5\">5</a></sup>, <sup><a href=\"#ref1\">1</a></sup></li>
    </ul>
  </li>
  <li>Když je tam <strong>ještě nějaký předmět</strong> (něco navíc), často bude <strong>si</strong>:
    <ul>
      <li>Myju <strong>si</strong> ruce., Kupuju <strong>si</strong> knihu., Vařím <strong>si</strong> čaj.<sup><a href=\"#ref5\">5</a></sup>, <sup><a href=\"#ref1\">1</a></sup></li>
    </ul>
  </li>
</ul>

<p>Jsou ale i ustálená spojení, kde je prostě nutné si konkrétní sloveso zapamatovat (např. <strong>stěžovat si, pamatovat si</strong>).<sup><a href=\"#ref2\">2</a></sup>, <sup><a href=\"#ref7\">7</a></sup></p>

<h3>Základní typy zvratných sloves (prakticky)</h3>

<h4>1. „Skutečně\" zvratná – dělám něco sám sobě</h4>
<p>Tady podmět dělá děj sám na sobě (pravý reflexivní význam).<sup><a href=\"#ref6\">6</a></sup>, <sup><a href=\"#ref1\">1</a></sup></p>
<ul>
  <li><strong>se</strong> – přímo na sebe:
    <ul>
      <li>Myju <strong>se</strong>. (umývám svoje tělo)<sup><a href=\"#ref5\">5</a></sup>, <sup><a href=\"#ref1\">1</a></sup></li>
      <li>Oblékám <strong>se</strong>. (oblékám sám sebe)<sup><a href=\"#ref5\">5</a></sup></li>
    </ul>
  </li>
  <li><strong>si</strong> – dělám něco <strong>pro sebe</strong>, pro svůj prospěch:
    <ul>
      <li>Kupuju <strong>si</strong> kávu. (pro sebe)<sup><a href=\"#ref1\">1</a></sup></li>
      <li>Dělám <strong>si</strong> poznámky., Vaříš <strong>si</strong> čaj?<sup><a href=\"#ref1\">1</a></sup></li>
    </ul>
  </li>
</ul>
<p>Když se učíte, je dobré mít v hlavě otázku „Dělám to sám <strong>sebou</strong> (se), nebo <strong>pro sebe</strong> (si)?\".<sup><a href=\"#ref6\">6</a></sup>, <sup><a href=\"#ref1\">1</a></sup></p>

<h4>2. Povinně zvratná slovesa (bez se/si neexistují)</h4>
<p>Některá slovesa se v češtině <strong>vždy</strong> pojí se se/si, a bez nich jsou špatně – ty se v gramatice někdy označují jako <strong>reflexiva tantum</strong>.<sup><a href=\"#ref2\">2</a></sup></p>
<p>Typické příklady:<sup><a href=\"#ref7\">7</a></sup>, <sup><a href=\"#ref2\">2</a></sup>, <sup><a href=\"#ref1\">1</a></sup></p>
<ul>
  <li>s <strong>se</strong>: bát <strong>se</strong>, smát <strong>se</strong>, divit <strong>se</strong>, ptát <strong>se</strong>, narodit <strong>se</strong>, radovat <strong>se</strong></li>
  <li>s <strong>si</strong>: stěžovat <strong>si</strong>, pamatovat <strong>si</strong>, představovat <strong>si</strong>, užívat <strong>si</strong></li>
</ul>
<p>Neřeknu „*stěžuji na sousedy*\", ale <strong>stěžuji si na sousedy</strong>.<sup><a href=\"#ref4\">4</a></sup><br>Tohle je třeba učit se rovnou jako celek: <strong>bát se</strong>, ne „bát\"; <strong>ptát se</strong>, ne „ptát\".<sup><a href=\"#ref2\">2</a></sup>, <sup><a href=\"#ref1\">1</a></sup></p>

<h4>3. Dvojice: nezvratné × zvratné (jiný význam)</h4>
<p>Často přidáním se/si <strong>změní význam slovesa</strong> nebo se zpřesní.<sup><a href=\"#ref8\">8</a></sup>, <sup><a href=\"#ref4\">4</a></sup>, <sup><a href=\"#ref2\">2</a></sup></p>
<ul>
  <li>učit × <strong>učit se</strong>
    <ul>
      <li>Učí děti. (někoho jiného)</li>
      <li>Učí se. (sám studuje)<sup><a href=\"#ref4\">4</a></sup></li>
    </ul>
  </li>
  <li>psát × <strong>psát si</strong>
    <ul>
      <li>Píše dopis.</li>
      <li>Píše si deník. (pro sebe, sobě)<sup><a href=\"#ref4\">4</a></sup></li>
    </ul>
  </li>
  <li>mýt × <strong>mýt se</strong> × <strong>mýt si</strong>
    <ul>
      <li>Myju auto. (něco jiného)</li>
      <li>Myju se. (sám sebe)</li>
      <li>Myju si ruce. (svoje ruce)<sup><a href=\"#ref2\">2</a></sup>, <sup><a href=\"#ref1\">1</a></sup></li>
    </ul>
  </li>
  <li>ztratit × <strong>ztratit se</strong>
    <ul>
      <li>Ztratil klíče.</li>
      <li>Ztratil se. (už ho nevidíme, zabloudil)<sup><a href=\"#ref8\">8</a></sup></li>
    </ul>
  </li>
</ul>
<p>U těchto sloves je dobré učit se <strong>přímo typické věty</strong>, protože význam se často dost změní.<sup><a href=\"#ref8\">8</a></sup>, <sup><a href=\"#ref4\">4</a></sup></p>

<h4>4. „Navzájem\" – reciproký význam</h4>
<p>Tady se děj děje <strong>vzájemně</strong> (jeden druhému).<sup><a href=\"#ref8\">8</a></sup>, <sup><a href=\"#ref2\">2</a></sup></p>
<ul>
  <li>Vidíme <strong>se</strong>. (já vidím tebe a ty vidíš mě)<sup><a href=\"#ref8\">8</a></sup></li>
  <li>Znají <strong>se</strong> už dlouho (znají se navzájem).<sup><a href=\"#ref2\">2</a></sup></li>
  <li>Nenáviděli <strong>se</strong>. (vzájemně)<sup><a href=\"#ref2\">2</a></sup></li>
</ul>
<p>Formálně je to stejné jako obyčejné zvratné sloveso, ale význam je „jeden druhého\".<sup><a href=\"#ref8\">8</a></sup>, <sup><a href=\"#ref2\">2</a></sup></p>

<h4>5. Zvratné pasivum: „něco se dělá\"</h4>
<p>Konstrukce <strong>„sloveso ve 3. osobě + se\"</strong> často vyjadřuje <strong>pasivum</strong> – něco se děje, ale není důležité, kdo to dělá.<sup><a href=\"#ref2\">2</a></sup>, <sup><a href=\"#ref1\">1</a></sup></p>
<ul>
  <li>Dům <strong>se opravuje</strong>. (= Dům je opravován.)<sup><a href=\"#ref2\">2</a></sup></li>
  <li>Dárky <strong>se rozdaly</strong> dětem. (= Dárky byly rozdány.)<sup><a href=\"#ref2\">2</a></sup></li>
  <li>Tady <strong>se nekouří</strong>. (= Je tu zakázáno kouřit.)<sup><a href=\"#ref1\">1</a></sup>, <sup><a href=\"#ref2\">2</a></sup></li>
</ul>
<p>Tohle je velmi běžné v každodenní češtině a pro studenta je užitečné rozpoznat, že <strong>„se\" tady neznamená „sám sobě\"</strong>, ale spíš „něco je děláno\".<sup><a href=\"#ref1\">1</a></sup>, <sup><a href=\"#ref2\">2</a></sup></p>

<h4>6. „Si\" jen pro atmosféru / osobní prospěch</h4>
<p>Některá slovesa můžou mít i <strong>nepovinné si</strong>, které vyjadřuje, že si to člověk dělá „pro sebe\", často s pocitem, že si to užívá.<sup><a href=\"#ref3\">3</a></sup>, <sup><a href=\"#ref8\">8</a></sup>, <sup><a href=\"#ref1\">1</a></sup></p>
<ul>
  <li>Zpívám. × Zpívám <strong>si</strong>. (jen tak pro radost)<sup><a href=\"#ref3\">3</a></sup>, <sup><a href=\"#ref8\">8</a></sup></li>
  <li>Čtu. × Čtu <strong>si</strong> knihu. (pro sebe, v klidu)<sup><a href=\"#ref8\">8</a></sup>, <sup><a href=\"#ref1\">1</a></sup></li>
</ul>
<p>Význam se moc nezmění, ale věta s <strong>si</strong> působí osobněji a „pohodověji\".<sup><a href=\"#ref6\">6</a></sup>, <sup><a href=\"#ref8\">8</a></sup></p>

<h3>Kde stát se/si ve větě</h3>
<p>Čeština má pravidlo, že <strong>se/si většinou nestojí na úplném začátku věty a většinou je „na druhém místě\"</strong>.<sup><a href=\"#ref3\">3</a></sup>, <sup><a href=\"#ref2\">2</a></sup></p>
<p>Typické příklady:<sup><a href=\"#ref3\">3</a></sup>, <sup><a href=\"#ref1\">1</a></sup></p>
<ul>
  <li>Já <strong>se</strong> učím česky.</li>
  <li>Učím <strong>se</strong> česky.</li>
  <li>Včera jsem <strong>se</strong> učil doma.</li>
  <li>Dnes <strong>si</strong> kupuju novou knihu.</li>
</ul>
<p>Některé učebnice to shrnují takto:<sup><a href=\"#ref3\">3</a></sup>, <sup><a href=\"#ref2\">2</a></sup>, <sup><a href=\"#ref1\">1</a></sup></p>
<ul>
  <li>se/si stojí <strong>za prvním přízvučným slovem/výrazem</strong> ve větě (často je to podmět nebo příslovce: „Já se…\", „Dnes se…\").</li>
  <li>Při negaci a složených tvarech platí totéž:
    <ul>
      <li>Neučím <strong>se</strong>.</li>
      <li>Taky <strong>se</strong> učím.</li>
      <li>Musím <strong>se</strong> učit. / Musím se učit češtinu.<sup><a href=\"#ref9\">9</a></sup>, <sup><a href=\"#ref3\">3</a></sup></li>
    </ul>
  </li>
</ul>
<p>Když se sejdou <strong>dvě zvratná slovesa za sebou</strong>, často se jedno <strong>se</strong> vynechá, pokud je význam jasný:</p>
<ul>
  <li>Snažil se učit se. → často jen „Snažil se učit.\", ale tady už může být i významový rozdíl (učit „někoho\" × učit „sebe\"), proto na to češtináři upozorňují.<sup><a href=\"#ref4\">4</a></sup></li>
</ul>

<h3>Praktické tipy</h3>
<ul>
  <li>Uč se slovesa <strong>rovnou s „se/si\" jako součást slovesa</strong>: „bát se\", „ptát se\", „pamatovat si\", „stěžovat si\".<sup><a href=\"#ref7\">7</a></sup>, <sup><a href=\"#ref2\">2</a></sup></li>
  <li>Ptej se: „Dělám něco <strong>sám sobě</strong> (se)? Nebo <strong>pro sebe</strong> a mám ještě nějaký objekt (si)?\".<sup><a href=\"#ref6\">6</a></sup>, <sup><a href=\"#ref1\">1</a></sup></li>
  <li>Všímej si, jestli je význam <strong>normální</strong>, <strong>navzájem</strong>, nebo <strong>pasivní</strong> („něco se dělá\").<sup><a href=\"#ref8\">8</a></sup>, <sup><a href=\"#ref2\">2</a></sup></li>
  <li>Sleduj typické fráze v textech a v mluvení – reflexivita je v češtině velmi častá a hodně věcí se prostě <strong>musí zapamatovat jako celek</strong>.<sup><a href=\"#ref6\">6</a></sup>, <sup><a href=\"#ref1\">1</a></sup></li>
</ul>

<div class=\"theory-divider\">⁂</div>

<section class=\"theory-references\" id=\"theory-refs\">
<h4>Zdroje</h4>
<ol start=\"1\">
  <li value=\"1\" id=\"ref1\"><a href=\"https://cs.terceflmc.com/post/czech-reflexive-se-si-in-czech\" target=\"_blank\" rel=\"noopener\">terceflmc.com</a></li>
  <li value=\"2\" id=\"ref2\"><a href=\"https://prirucka.ujc.cas.cz/?id=580\" target=\"_blank\" rel=\"noopener\">prirucka.ujc.cas.cz</a></li>
  <li value=\"3\" id=\"ref3\"><a href=\"https://www.czechonline.org/upload/Downloads/files/table/19/item/12/61/g-14-slovesa-zvratna.pdf?v=1691419112\" target=\"_blank\" rel=\"noopener\">czechonline.org</a></li>
  <li value=\"4\" id=\"ref4\"><a href=\"https://erikahanackova.cz/slovesa-zvratna-a-nezvratna/\" target=\"_blank\" rel=\"noopener\">erikahanackova.cz</a></li>
  <li value=\"5\" id=\"ref5\"><a href=\"https://www.lingly.ai/czech/grammar/a2/introduction-to-reflexive-verbs\" target=\"_blank\" rel=\"noopener\">lingly.ai</a></li>
  <li value=\"6\" id=\"ref6\"><a href=\"https://nobsczech.cz/blog/reflexive-verbs\" target=\"_blank\" rel=\"noopener\">nobsczech.cz</a></li>
  <li value=\"7\" id=\"ref7\"><a href=\"https://www.ilearnczech.com/pamatujte-si-si-aneb-reflexive-verbs-in-czech-3/\" target=\"_blank\" rel=\"noopener\">ilearnczech.com</a></li>
  <li value=\"8\" id=\"ref8\"><a href=\"https://www.youtube.com/watch?v=yofD1M8BAC4\" target=\"_blank\" rel=\"noopener\">youtube.com</a></li>
  <li value=\"9\" id=\"ref9\"><a href=\"https://studyhub.cz/blog/casovani-zvratnych-sloves/\" target=\"_blank\" rel=\"noopener\">studyhub.cz</a></li>
  <li value=\"10\" id=\"ref10\"><a href=\"https://www.sogoodlanguages.com/cs/zvratna-slovesa/\" target=\"_blank\" rel=\"noopener\">sogoodlanguages.com</a></li>
  <li value=\"11\" id=\"ref11\"><a href=\"https://m.prirucka.ujc.cas.cz/en/?id=580\" target=\"_blank\" rel=\"noopener\">prirucka.ujc.cas.cz (EN)</a></li>
  <li value=\"12\" id=\"ref12\"><a href=\"https://cs.wikipedia.org/wiki/Zvratné_sloveso\" target=\"_blank\" rel=\"noopener\">wikipedia.org</a></li>
  <li value=\"13\" id=\"ref13\"><a href=\"https://www.ascestinaru.cz/poradna-asc-zvratna-zajmena-osobni-ve-skolni-praxi/\" target=\"_blank\" rel=\"noopener\">ascestinaru.cz</a></li>
  <li value=\"14\" id=\"ref14\"><a href=\"https://www.umimecesky.cz/cviceni-zvratna-slovesa-cdj\" target=\"_blank\" rel=\"noopener\">umimecesky.cz</a></li>
  <li value=\"15\" id=\"ref15\"><a href=\"https://vyuka.lingea.cz/francouzstina/gramatika/slovesa/zvratna-slovesa\" target=\"_blank\" rel=\"noopener\">vyuka.lingea.cz</a></li>
</ol>
</section>
`;

  window.CzechGrammarTrainerContent.reflexiveVerbsTheory = reflexiveVerbsTheory;
}());
