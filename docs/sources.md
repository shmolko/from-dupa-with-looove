# Sources

## VALLEX 4.5

This project uses `VALLEX 4.5` as a linguistic source for expanding the reflexive verb exercise bank.

Reference:

- Lopatková, Markéta; et al. `VALLEX 4.5`, LINDAT/CLARIAH-CZ digital library at the Institute of Formal and Applied Linguistics (UFAL), 2022
- handle: `http://hdl.handle.net/11234/1-4756`
- project page: `https://ufal.mff.cuni.cz/vallex`

License shown on the repository page:

- `CC BY-NC-SA 4.0`

## How it is used here

`VALLEX` is used as a source for:

- identifying reflexive lemmas with obligatory `se` or `si`
- spotting contrasts such as `vrátit` vs `vrátit se`
- checking example usages, glosses, and argument patterns
- organizing future exercise groups more systematically

Current curation rule:

- iterative / frequentative forms such as `bávat se` or `blížívat se` are excluded from exercise authoring by default because they are too rare and would be confusing for the learner

`VALLEX` is not treated as a drop-in learner exercise bank. The actual exercises in `src/content/reflexive-verbs.js` are authored for this app, with you acting as curator and the assistant acting as the main content generator.
