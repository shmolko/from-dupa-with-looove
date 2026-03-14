# VALLEX Source Data

This folder stores source data used for authoring exercises. It is not loaded by the app at runtime.

## Dataset

- `vallex-verbs-4.5.json`

Source:
- `VALLEX 4.5`
- publisher: `Charles University, Faculty of Mathematics and Physics, Institute of Formal and Applied Linguistics (UFAL)`
- source URL: `https://lindat.mff.cuni.cz/repository/xmlui/handle/11234/1-4756`
- project page: `https://ufal.mff.cuni.cz/vallex`

## License

The repository page states that `VALLEX 4.5` is licensed under:

- `CC BY-NC-SA 4.0`

This project uses VALLEX as a non-runtime linguistic source for deriving and curating learner-facing exercises for a personal, non-commercial app.

## Usage in this project

The intended workflow is:

1. inspect VALLEX entries and reflexive verb classes
2. derive candidate verb groups and contrasts
3. write original learner-facing exercises in `src/content/reflexive-verbs.js`

The app does not ship raw VALLEX data to the user interface. The dataset supports content authoring and curation.

## Current curation rule

By default, this project does not use iterative / frequentative forms from VALLEX, such as `bávat se` or `blížívat se`, when generating learner-facing exercises. The preferred source forms are the standard `impf`, `pf`, or `biasp` lemmas.
