(function () {
  function generateLesson({ topics, selectedTopicIds, errorPatterns, length }) {
    const selectedTopics = resolveSelectedTopics(topics, selectedTopicIds);
    if (!selectedTopics.length) return null;

    const topicPatternPairs = selectedTopics.flatMap(topic =>
      topic.patterns.map(pattern => ({ topic, pattern }))
    );
    if (!topicPatternPairs.length) return null;

    const items = [];
    const usedExerciseIds = new Set();

    for (let index = 0; index < length; index += 1) {
      const { topic, pattern } = chooseWeightedTopicPattern(topicPatternPairs, errorPatterns);
      const exercise = pickExercise(topic, pattern, usedExerciseIds);
      usedExerciseIds.add(getExerciseKey(topic, pattern, exercise));

      items.push({
        id: `${topic.id}-${pattern.id}-${index + 1}`,
        exerciseId: exercise.id,
        topicId: topic.id,
        topicLabel: topic.label,
        patternId: pattern.id,
        patternLabel: pattern.label,
        patternExplanation: pattern.explanation,
        difficulty: exercise.difficulty || 1,
        type: exercise.type,
        prompt: exercise.prompt,
        sentence: exercise.sentence || "",
        sentenceBefore: exercise.sentenceBefore,
        sentenceAfter: exercise.sentenceAfter,
        options: exercise.options || [],
        isSentenceCorrect: typeof exercise.isSentenceCorrect === "boolean" ? exercise.isSentenceCorrect : null,
        choices: exercise.choices || [],
        acceptedAnswers: exercise.acceptedAnswers || [],
        explanation: exercise.explanation,
        insight: exercise.insight
      });
    }

    const focusSummary = selectedTopics.length === 1
      ? selectedTopics[0].shortLabel
      : selectedTopics.map(t => t.shortLabel).join(" + ");

    return {
      id: `lesson-${Date.now()}`,
      createdAt: new Date().toISOString(),
      focusSummary,
      itemIndex: 0,
      answers: [],
      items
    };
  }

  function resolveSelectedTopics(topics, selectedTopicIds) {
    const selected = topics.filter(topic => selectedTopicIds.includes(topic.id));
    return selected.length ? selected : [topics[0]].filter(Boolean);
  }

  function chooseWeightedTopicPattern(topicPatternPairs, errorPatterns) {
    const weighted = topicPatternPairs.map(({ topic, pattern }) => {
      const stats = errorPatterns[pattern.id];
      const baseWeight = pattern.weight || 1;
      return {
        topic,
        pattern,
        weight: baseWeight * (1 + (stats ? stats.incorrectCount : 0))
      };
    });

    return weightedPick(weighted, entry => entry.weight);
  }

  function pickExercise(topic, pattern, usedExerciseIds) {
    const key = (ex) => getExerciseKey(topic, pattern, ex);
    const unusedExercises = pattern.exercises.filter(ex => !usedExerciseIds.has(key(ex)));
    const pool = unusedExercises.length ? unusedExercises : pattern.exercises;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function getExerciseKey(topic, pattern, exercise) {
    return `${topic.id}:${pattern.id}:${exercise.id || exercise.prompt}`;
  }

  function weightedPick(entries, getWeight) {
    const total = entries.reduce((sum, entry) => sum + getWeight(entry), 0);
    let cursor = Math.random() * total;

    for (const entry of entries) {
      cursor -= getWeight(entry);
      if (cursor <= 0) return entry;
    }

    return entries[entries.length - 1];
  }

  function normalizeAnswer(text) {
    return String(text)
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[.,!?;:()„""']/g, "")
      .replace(/\s+/g, " ");
  }

  function isAcceptedCorrection(item, learnerAnswer) {
    const normalizedLearnerAnswer = normalizeAnswer(learnerAnswer);
    if (!normalizedLearnerAnswer) return false;

    return item.acceptedAnswers.some(answer => {
      const normalizedAcceptedAnswer = normalizeAnswer(answer);
      if (normalizedLearnerAnswer === normalizedAcceptedAnswer) {
        return true;
      }

      const learnerTokens = normalizedLearnerAnswer.split(" ").filter(Boolean);
      if (learnerTokens.length < 2) {
        return false;
      }

      const acceptedTokens = normalizedAcceptedAnswer.split(" ").filter(Boolean);
      const originalTokens = normalizeAnswer(item.sentence).split(" ").filter(Boolean);

      return containsTokenSequence(acceptedTokens, learnerTokens)
        && !containsTokenSequence(originalTokens, learnerTokens);
    });
  }

  function containsTokenSequence(haystackTokens, needleTokens) {
    if (!needleTokens.length || needleTokens.length > haystackTokens.length) {
      return false;
    }

    for (let index = 0; index <= haystackTokens.length - needleTokens.length; index += 1) {
      let matches = true;

      for (let offset = 0; offset < needleTokens.length; offset += 1) {
        if (haystackTokens[index + offset] !== needleTokens[offset]) {
          matches = false;
          break;
        }
      }

      if (matches) {
        return true;
      }
    }

    return false;
  }

  window.lessonEngine = {
    generateLesson,
    isAcceptedCorrection,
    normalizeAnswer
  };
}());
