(function () {
  const content = window.CzechGrammarTrainerContent || {};

  window.TOPICS = [
    content.reflexiveVerbsTopic,
    content.similarWordsTopic
  ].filter(Boolean);

  window.EXERCISE_LABELS = {
    multiple_choice: "Rozhodni, která věta je správně",
    sentence_judgment: "Rozhodni, jestli je věta správně",
    similar_words: "Vyber správné slovo"
  };
}());
