# From Dupa With Looove

Webová aplikace pro procvičování české gramatiky. Zaměřená na pokročilejší cizince.

## Features

- **Více témat**: Zvratná slovesa, Podobná slova (vybíráte jedno nebo obě)
- **Lekce po 10 větách** z vybraných témat
- **Typy cvičení**:
  - `multiple_choice` – výběr správné věty nebo slova
  - `sentence_judgment` – rozhodnutí, zda je věta správně; při chybě pak doplnění opravy
  - `similar_words` – výběr správného slova z dvojice (např. uklidit/uklidnit, tip/typ)
- **Zpětná vazba** po každé odpovědi (správně/nesprávně, vysvětlení, insight)
- **Lokální uložení** historie a chybových vzorců (`localStorage`)
- **Adaptivní výběr** – vzorce, kde děláte nejvíc chyb, dostávají větší váhu

## Structure

```
index.html              # UI shell
src/
  app.js                # UI, state, rendering, persistence
  lesson-engine.js      # generování lekcí, validace odpovědí
  styles.css            # styly
  content/
    index.js            # TOPICS a EXERCISE_LABELS
    reflexive-verbs.js  # cvičení pro zvratná slovesa
    similar-words.js   # cvičení pro podobná slova
docs/
  topics.md             # témata a vzorce
  lesson-schema.json    # JSON schema pro lesson payload
  sources.md            # zdroje a atribuce
data-sources/vallex/   # zdrojová data (nepoužívá se za běhu)
tools/                  # pomocné skripty
```

## Usage

Otevřete `index.html` v prohlížeči (nebo nasaďte na statický hosting).

1. Vyberte téma nebo témata, která chcete procvičit
2. Klikněte na **Vygenerovat lekci**
3. Postupně odpovídejte na jednotlivé věty
4. Na konci lekce získáte shrnutí
