const STORAGE_KEY = "from-dupa-with-looove-state";
const VERSION = "0.2.0"; // bump on release
const LESSON_SIZE = 10;
const RECENTLY_SEEN_LIMIT = 60; // exercises to remember for variety
const TOPICS = window.TOPICS || [];
const EXERCISE_LABELS = window.EXERCISE_LABELS || {};

const BENNY_CORRECT = [
  "assets/cute_benny-321464fd-1067-4687-922b-9f8059701c40.png",
  "assets/playfull_benny-84186625-2b82-44cd-9f30-140c158a868e.png",
  "assets/sexy_benny-6e85556f-0403-4595-9ff4-9f2beb71e303.png",
  "assets/sitting_benny-e5870622-388b-4fc5-bb8b-0d8fe02245a7.png",
  "assets/sitting_benny_2-a8af868e-e68e-4a54-97ce-5e4bed0333fb.png"
];
const BENNY_INCORRECT = [
  "assets/sad_benny-15321187-ab7a-40a8-b8fe-218e4f7e291b.png",
  "assets/puppy_eyes_benny-98e183c4-e916-4cdb-a4eb-9800dc91517a.png",
  "assets/curios_benny-f49d8b73-aa47-4c99-b1f0-428bc772cab3.png",
  "assets/shocked_benny-200de375-fb3d-43b0-9c54-9f3acc1b9c30.png",
  "assets/angry_benny-928ce6d3-6503-48e1-9f4b-aa926b07049e.png",
  "assets/young_benny-af3c6154-3373-49cb-b66e-24b32e9a9769.png",
  "assets/hairy_benny-94b81c86-a315-4046-9b33-087eff1ca3f2.png"
];

function pickBennyImage(isCorrect) {
  const pool = isCorrect ? BENNY_CORRECT : BENNY_INCORRECT;
  return pool[Math.floor(Math.random() * pool.length)];
}
const lessonEngine = window.lessonEngine;

const elements = {
  viewHome: document.getElementById("viewHome"),
  viewLesson: document.getElementById("viewLesson"),
  viewSummary: document.getElementById("viewSummary"),
  viewStats: document.getElementById("viewStats"),
  topicSelector: document.getElementById("topicSelector"),
  profileStatus: document.getElementById("profileStatus"),
  generateLessonButton: document.getElementById("generateLessonButton"),
  lastLessonChip: document.getElementById("lastLessonChip"),
  statsButton: document.getElementById("statsButton"),
  statsCloseButton: document.getElementById("statsCloseButton"),
  lessonBackButton: document.getElementById("lessonBackButton"),
  lessonCounter: document.getElementById("lessonCounter"),
  lessonProgressBar: document.getElementById("lessonProgressBar"),
  exerciseType: document.getElementById("exerciseType"),
  exercisePrompt: document.getElementById("exercisePrompt"),
  exerciseChoices: document.getElementById("exerciseChoices"),
  textAnswerField: document.getElementById("textAnswerField"),
  textAnswerLabel: document.querySelector("#textAnswerField span"),
  textAnswerInput: document.getElementById("textAnswerInput"),
  answerForm: document.getElementById("answerForm"),
  submitAnswerButton: document.getElementById("submitAnswerButton"),
  nextQuestionButton: document.getElementById("nextQuestionButton"),
  feedbackCard: document.getElementById("feedbackCard"),
  summaryStats: document.getElementById("summaryStats"),
  summaryWeakPatterns: document.getElementById("summaryWeakPatterns"),
  newLessonButton: document.getElementById("newLessonButton"),
  resetProgressButton: document.getElementById("resetProgressButton"),
  weakPatternsList: document.getElementById("weakPatternsList"),
  recentLessonsList: document.getElementById("recentLessonsList"),
  versionLabel: document.getElementById("versionLabel")
};

const state = loadState();
let currentLesson = null;
let selectedChoice = null;
let sentenceJudgmentState = null;

function showView(viewName) {
  document.querySelectorAll(".view").forEach(el => {
    el.classList.toggle("hidden", el.dataset.view !== viewName);
  });
}

elements.versionLabel.textContent = "v" + VERSION;
renderTopicSelector();
renderDashboard();

elements.topicSelector.addEventListener("change", handleTopicSelectionChange);
elements.generateLessonButton.addEventListener("click", handleGenerateLesson);
elements.answerForm.addEventListener("submit", handleAnswerSubmit);
elements.nextQuestionButton.addEventListener("click", moveToNextQuestion);
elements.statsButton.addEventListener("click", () => showView("stats"));
elements.statsCloseButton.addEventListener("click", () => showView("home"));
elements.lessonBackButton.addEventListener("click", handleLessonBack);
elements.newLessonButton.addEventListener("click", () => showView("home"));
elements.resetProgressButton.addEventListener("click", resetProgress);

function renderLastLessonChip() {
  const last = state.lessons[0];
  if (!last || last.score === null) {
    elements.lastLessonChip.classList.add("hidden");
    return;
  }
  elements.lastLessonChip.textContent = `Poslední lekce: ${last.itemCount} vět, ${last.score}%`;
  elements.lastLessonChip.classList.remove("hidden");
}

function handleLessonBack() {
  if (window.confirm("Opravdu chceš ukončit lekci? Progres se ztratí.")) {
    currentLesson = null;
    showView("home");
    renderLastLessonChip();
  }
}

function renderTopicSelector() {
  const selectedTopics = new Set(state.preferences.selectedTopicIds);
  elements.topicSelector.innerHTML = TOPICS.map(topic => `
    <div class="topic-option">
      <label>
        <input type="checkbox" name="topic" value="${topic.id}" ${selectedTopics.has(topic.id) ? "checked" : ""}>
        <span>
          <strong>${topic.label}</strong>
          <span class="muted">${topic.description}</span>
        </span>
      </label>
    </div>
  `).join("");
}

function loadState() {
  const fallback = {
    preferences: {
      selectedTopicIds: ["reflexive_verbs"]
    },
    answers: [],
    lessons: [],
    errorPatterns: {},
    recentlySeenExerciseKeys: []
  };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    const normalizedState = {
      ...fallback,
      ...parsed,
      preferences: {
        ...fallback.preferences,
        ...(parsed.preferences || {})
      },
      answers: Array.isArray(parsed.answers) ? parsed.answers : [],
      lessons: Array.isArray(parsed.lessons) ? parsed.lessons : [],
      errorPatterns: parsed.errorPatterns || {},
      recentlySeenExerciseKeys: Array.isArray(parsed.recentlySeenExerciseKeys) ? parsed.recentlySeenExerciseKeys : []
    };

    return migrateLegacyState(normalizedState);
  } catch (error) {
    return fallback;
  }
}

function migrateLegacyState(currentState) {
  const patternMapping = {
    reflexive_required: {
      patternId: "particle_presence",
      patternLabel: "Má tam být se, si, nebo nic?"
    },
    reflexive_forbidden: {
      patternId: "particle_presence",
      patternLabel: "Má tam být se, si, nebo nic?"
    },
    meaning_changes: {
      patternId: "argument_structure_contrast",
      patternLabel: "Zvratnost mění stavbu věty"
    }
  };

  const migratedErrorPatterns = {};

  Object.values(currentState.errorPatterns || {}).forEach(pattern => {
    const mapping = patternMapping[pattern.patternId];
    const nextPattern = mapping
      ? {
          ...pattern,
          patternId: mapping.patternId,
          patternLabel: mapping.patternLabel
        }
      : pattern;

    const existing = migratedErrorPatterns[nextPattern.patternId];
    if (!existing) {
      migratedErrorPatterns[nextPattern.patternId] = {
        ...nextPattern
      };
      return;
    }

    existing.correctCount += nextPattern.correctCount || 0;
    existing.incorrectCount += nextPattern.incorrectCount || 0;
    existing.lastSeenAt = [existing.lastSeenAt, nextPattern.lastSeenAt]
      .filter(Boolean)
      .sort()
      .slice(-1)[0] || null;
  });

  return {
    ...currentState,
    errorPatterns: migratedErrorPatterns,
    recentlySeenExerciseKeys: Array.isArray(currentState.recentlySeenExerciseKeys) ? currentState.recentlySeenExerciseKeys : []
  };
}

function saveState() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function handleTopicSelectionChange() {
  const selectedTopicIds = Array.from(document.querySelectorAll('input[name="topic"]:checked')).map(input => input.value);
  state.preferences.selectedTopicIds = selectedTopicIds;
  saveState();

  if (!selectedTopicIds.length) {
    setProfileStatus("Vyber aspoň jeden gramatický jev.", true);
    return;
  }

  setProfileStatus("", false);
}

function setProfileStatus(message, isError) {
  elements.profileStatus.textContent = message;
  elements.profileStatus.style.color = isError ? "var(--danger)" : "var(--muted)";
}

function handleGenerateLesson() {
  if (!state.preferences.selectedTopicIds.length) {
    setProfileStatus("Nejdřív vyber gramatický jev.", true);
    return;
  }

  currentLesson = lessonEngine.generateLesson({
    topics: TOPICS,
    selectedTopicIds: state.preferences.selectedTopicIds,
    errorPatterns: state.errorPatterns,
    recentlySeenExerciseKeys: state.recentlySeenExerciseKeys,
    length: LESSON_SIZE
  });
  if (!currentLesson) {
    setProfileStatus("Pro vybrané téma zatím nejsou dostupná cvičení.", true);
    return;
  }
  selectedChoice = null;
  sentenceJudgmentState = null;
  setProfileStatus("");

  state.lessons.unshift({
    id: currentLesson.id,
    createdAt: currentLesson.createdAt,
    focus: currentLesson.focusSummary,
    itemCount: currentLesson.items.length,
    score: null
  });
  state.lessons = state.lessons.slice(0, 12);
  saveState();
  showView("lesson");
  renderCurrentQuestion();
  renderDashboard();
}

function renderCurrentQuestion() {
  const item = getCurrentItem();
  if (!item) {
    finishLesson();
    return;
  }

  const awaitingCorrection = sentenceJudgmentState?.itemId === item.id && sentenceJudgmentState.awaitingCorrection;
  selectedChoice = null;
  elements.feedbackCard.className = "feedback-card hidden";
  elements.feedbackCard.innerHTML = "";
  elements.nextQuestionButton.classList.add("hidden");
  elements.submitAnswerButton.classList.remove("hidden");
  elements.submitAnswerButton.disabled = false;
  elements.textAnswerInput.value = "";
  elements.textAnswerInput.placeholder = "";

  const position = currentLesson.itemIndex + 1;
  elements.lessonCounter.textContent = `${position} / ${currentLesson.items.length}`;
  elements.lessonProgressBar.style.width = `${(position / currentLesson.items.length) * 100}%`;
  elements.exerciseType.textContent = awaitingCorrection
    ? "Napiš opravu"
    : EXERCISE_LABELS[item.type] || "";
  elements.exercisePrompt.textContent = item.type === "sentence_judgment"
    ? item.sentence
    : item.prompt || "";

  if (item.type === "similar_words") {
    const sentenceWithBlank = (item.sentenceBefore || "") + "_____" + (item.sentenceAfter || "");
    elements.exerciseChoices.innerHTML = `
      <p class="similar-words-sentence">${escapeHtml(sentenceWithBlank)}</p>
      <div class="choice-row choice-row--stacked">
        ${item.options.map(opt =>
          `\u003cbutton class="choice-button choice-button--full" data-option="${escapeHtml(opt)}" type="button">${escapeHtml(opt)}\u003c/button>`
        ).join("")}
      </div>
    `;
    elements.exerciseChoices.classList.remove("hidden");
    elements.textAnswerField.classList.add("hidden");

    Array.from(elements.exerciseChoices.querySelectorAll(".choice-button")).forEach(button => {
      button.addEventListener("click", () => {
        selectedChoice = button.dataset.option;
        elements.exerciseChoices.querySelectorAll(".choice-button").forEach(b => {
          b.classList.toggle("selected", b === button);
        });
      });
    });
  } else if (item.type === "multiple_choice") {
    elements.exerciseChoices.innerHTML = item.choices.map((choice, index) => `
      <button class="choice-button choice-button--full" data-choice-index="${index}" type="button">${escapeHtml(choice)}\u003c/button>
    `).join("");
    elements.exerciseChoices.classList.remove("hidden");
    elements.textAnswerField.classList.add("hidden");

    Array.from(elements.exerciseChoices.querySelectorAll(".choice-button")).forEach(button => {
      button.addEventListener("click", () => {
        selectedChoice = item.choices[Number(button.dataset.choiceIndex)];
        elements.exerciseChoices.querySelectorAll(".choice-button").forEach(other => {
          other.classList.toggle("selected", other === button);
        });
      });
    });
  } else if (awaitingCorrection) {
    elements.submitAnswerButton.textContent = "Odeslat opravu";
    elements.exerciseChoices.innerHTML = "";
    elements.exerciseChoices.classList.add("hidden");
    elements.textAnswerField.classList.remove("hidden");
    elements.textAnswerLabel.textContent = "Napiš opravenou část nebo celou větu";
    window.requestAnimationFrame(() => elements.textAnswerInput.focus());
  } else {
    elements.submitAnswerButton.textContent = "Potvrdit";
    elements.exerciseChoices.innerHTML = [
      '<button class="choice-button choice-button--full" data-choice-value="correct" type="button">Je správně.</button>',
      '<button class="choice-button choice-button--full" data-choice-value="incorrect" type="button">Není správně.</button>'
    ].join("");
    elements.exerciseChoices.classList.remove("hidden");
    elements.textAnswerField.classList.add("hidden");

    elements.exerciseChoices.querySelectorAll(".choice-button").forEach(button => {
      button.addEventListener("click", () => {
        selectedChoice = button.dataset.choiceValue;
        elements.exerciseChoices.querySelectorAll(".choice-button").forEach(other => {
          other.classList.toggle("selected", other === button);
        });
      });
    });
  }

  elements.submitAnswerButton.textContent = awaitingCorrection ? "Odeslat opravu" : (item.type === "multiple_choice" || item.type === "similar_words" ? "Zkontrolovat" : "Potvrdit");
}

function submitMultipleChoice(item) {
  const learnerAnswer = selectedChoice;

  if (!learnerAnswer) {
    showFeedback(false, "Nejdřív vyber odpověď.");
    return;
  }

  const isCorrect = item.acceptedAnswers.some(answer => lessonEngine.normalizeAnswer(answer) === lessonEngine.normalizeAnswer(learnerAnswer));
  const correctVersion = item.type === "similar_words" && item.sentenceBefore != null
    ? (item.sentenceBefore || "") + (item.acceptedAnswers[0] || "") + (item.sentenceAfter || "")
    : (item.acceptedAnswers[0] || "");
  recordAnswer({
    item,
    learnerAnswer,
    isCorrect,
    acceptedAnswers: item.acceptedAnswers,
    correctVersion
  });
}

function getCurrentItem() {
  if (!currentLesson) return null;
  return currentLesson.items[currentLesson.itemIndex] || null;
}

function handleAnswerSubmit(event) {
  event.preventDefault();
  const item = getCurrentItem();
  if (!item) return;

  if (item.type === "multiple_choice" || item.type === "similar_words") {
    submitMultipleChoice(item);
    return;
  }

  submitSentenceJudgment(item);
}

function submitSentenceJudgment(item) {
  const step = getCurrentSentenceJudgmentStep(item);

  if (step === "judgment") {
    if (!selectedChoice) {
      showFeedback(false, "Nejdřív vyber, jestli je věta správně.");
      return;
    }

    const expectedChoice = item.isSentenceCorrect ? "correct" : "incorrect";
    const judgmentIsCorrect = selectedChoice === expectedChoice;

    if (item.isSentenceCorrect || !judgmentIsCorrect) {
      const learnerAnswer = selectedChoice === "correct" ? "Je správně." : "Není správně.";
      recordAnswer({
        item,
        learnerAnswer,
        isCorrect: judgmentIsCorrect,
        acceptedAnswers: [item.isSentenceCorrect ? "Je správně." : "Není správně."],
        verdictAnswer: selectedChoice,
        correctVersion: item.isSentenceCorrect
          ? item.sentence
          : (item.acceptedAnswers[0] || "")
      });
      return;
    }

    sentenceJudgmentState = {
      itemId: item.id,
      awaitingCorrection: true,
      verdictAnswer: selectedChoice
    };
    renderCurrentQuestion();
    return;
  }

  const learnerCorrection = elements.textAnswerInput.value.trim();
  if (!learnerCorrection) {
    showFeedback(false, "Nejdřív napiš opravu.");
    return;
  }

  const isCorrect = lessonEngine.isAcceptedCorrection(item, learnerCorrection);
  recordAnswer({
    item,
    learnerAnswer: `Není správně. -> ${learnerCorrection}`,
    isCorrect,
    acceptedAnswers: item.acceptedAnswers,
    verdictAnswer: sentenceJudgmentState?.verdictAnswer || "incorrect",
    correctionAnswer: learnerCorrection,
    correctVersion: item.acceptedAnswers[0] || ""
  });
}

function getCurrentSentenceJudgmentStep(item) {
  if (item.type !== "sentence_judgment") return "answer";
  return sentenceJudgmentState?.itemId === item.id && sentenceJudgmentState.awaitingCorrection
    ? "correction"
    : "judgment";
}

function recordAnswer({ item, learnerAnswer, isCorrect, acceptedAnswers, verdictAnswer = null, correctionAnswer = null, correctVersion = "" }) {
  const answerRecord = {
    lessonId: currentLesson.id,
    itemId: item.id,
    topicId: item.topicId,
    topicLabel: item.topicLabel,
    patternId: item.patternId,
    patternLabel: item.patternLabel,
    difficulty: item.difficulty,
    exerciseType: item.type,
    prompt: item.type === "sentence_judgment" ? item.sentence : item.prompt,
    learnerAnswer,
    acceptedAnswers,
    isCorrect,
    verdictAnswer,
    correctionAnswer,
    answeredAt: new Date().toISOString()
  };

  currentLesson.answers.push(answerRecord);
  state.answers.unshift(answerRecord);
  state.answers = state.answers.slice(0, 120);
  updateErrorPattern(answerRecord);
  const exerciseKey = lessonEngine.getExerciseKeyFromItem(item);
  state.recentlySeenExerciseKeys = [exerciseKey, ...state.recentlySeenExerciseKeys].slice(0, RECENTLY_SEEN_LIMIT);
  saveState();
  renderDashboard();

  sentenceJudgmentState = null;
  showFeedback(isCorrect, {
    correctVersion,
    insight: item.insight
  });
  elements.submitAnswerButton.disabled = true;
  elements.submitAnswerButton.classList.add("hidden");
  elements.nextQuestionButton.classList.remove("hidden");
  const isLastItem = currentLesson.itemIndex === currentLesson.items.length - 1;
  elements.nextQuestionButton.textContent = isLastItem ? "Great success!" : "Další věta";
}

function showFeedback(isCorrect, options = {}) {
  const message = typeof options === "string" ? options : options.message || "";
  const correctVersion = typeof options === "string" ? "" : options.correctVersion || "";
  const insight = typeof options === "string" ? "" : options.insight || "";
  elements.feedbackCard.classList.remove("hidden", "success", "error");
  elements.feedbackCard.classList.add(isCorrect ? "success" : "error");
  const bennyHintBlock = insight
    ? `\u003cdiv class="feedback-hint">\n        \u003cimg src="${pickBennyImage(isCorrect)}" alt="" class="feedback-dog" aria-hidden="true">\n        \u003cp class="feedback-hint-bubble">\u003cstrong>Hint:\u003c/strong> ${escapeHtml(insight)}\u003c/p>\n      \u003c/div>`
    : "";

  const verdictText = message || (isCorrect ? "Správně! Wooohooo!" : "Oj, chybička. Nevadí!");
  const verdictIcon = isCorrect ? "✓" : "✗";
  elements.feedbackCard.innerHTML = `
    \u003cdiv class="feedback-callout ${isCorrect ? "success" : "error"}">\u003cspan class="feedback-callout-icon" aria-hidden="true">${verdictIcon}\u003c/span>${escapeHtml(verdictText)}\u003c/div>
    ${!isCorrect && correctVersion ? `\u003cp>\u003cstrong>Správná verze:\u003c/strong> \u003ccode>${escapeHtml(correctVersion)}\u003c/code>\u003c/p>` : ""}
    ${bennyHintBlock}
  `;
}

function moveToNextQuestion() {
  sentenceJudgmentState = null;
  currentLesson.itemIndex += 1;
  if (currentLesson.itemIndex >= currentLesson.items.length) {
    finishLesson();
    return;
  }
  renderCurrentQuestion();
}

function finishLesson() {
  const correctAnswers = currentLesson.answers.filter(answer => answer.isCorrect).length;
  const score = Math.round((correctAnswers / currentLesson.items.length) * 100);
  const lessonRecord = state.lessons.find(lesson => lesson.id === currentLesson.id);
  if (lessonRecord) {
    lessonRecord.score = score;
  }
  saveState();
  renderDashboard();
  renderLessonSummary();
}

function renderLessonSummary() {
  const correctAnswers = currentLesson.answers.filter(answer => answer.isCorrect).length;
  const weakestPatterns = summarizeWeakPatternsForLesson(currentLesson.answers);

  elements.summaryStats.innerHTML = `
    \u003cspan class="badge">Správně: ${correctAnswers}\u003c/span>
    \u003cspan class="badge">Chyby: ${currentLesson.items.length - correctAnswers}\u003c/span>
    \u003cspan class="badge">${escapeHtml(currentLesson.focusSummary)}\u003c/span>
  `;
  elements.summaryWeakPatterns.innerHTML = weakestPatterns.length
    ? `\u003cp class="panel-copy">Příště dostanou větší váhu přesně ty typy vět, kde ses spletla.\u003c/p>
       \u003cul class="list">${weakestPatterns.map(item =>
         `\u003cli>\u003cstrong>${escapeHtml(item.label)}\u003c/strong>\u003cbr>\u003cspan class="list-meta">${escapeHtml(item.summary)}\u003c/span>\u003c/li>`
       ).join("")}\u003c/ul>`
    : `\u003cp class="panel-copy">Skvělé, v téhle lekci se neukázala žádná výrazná slabina.\u003c/p>`;

  showView("summary");
  renderLastLessonChip();
}

function summarizeWeakPatternsForLesson(answers) {
  const grouped = {};
  answers.forEach(answer => {
    if (!grouped[answer.patternId]) {
      grouped[answer.patternId] = {
        label: answer.patternLabel,
        correct: 0,
        incorrect: 0
      };
    }
    if (answer.isCorrect) {
      grouped[answer.patternId].correct += 1;
    } else {
      grouped[answer.patternId].incorrect += 1;
    }
  });
  return Object.values(grouped)
    .filter(item => item.incorrect > 0)
    .sort((left, right) => right.incorrect - left.incorrect)
    .slice(0, 3)
    .map(item => ({
      label: item.label,
      summary: `Chyby v lekci: ${item.incorrect}, správně: ${item.correct}.`
    }));
}

function updateErrorPattern(answerRecord) {
  const existing = state.errorPatterns[answerRecord.patternId] || {
    topicId: answerRecord.topicId,
    patternId: answerRecord.patternId,
    patternLabel: answerRecord.patternLabel,
    correctCount: 0,
    incorrectCount: 0,
    lastSeenAt: null
  };
  if (answerRecord.isCorrect) {
    existing.correctCount += 1;
  } else {
    existing.incorrectCount += 1;
  }
  existing.lastSeenAt = answerRecord.answeredAt;
  state.errorPatterns[answerRecord.patternId] = existing;
}

function renderDashboard() {
  const weakPatterns = Object.values(state.errorPatterns)
    .sort((left, right) => {
      if (right.incorrectCount !== left.incorrectCount) return right.incorrectCount - left.incorrectCount;
      return right.correctCount - left.correctCount;
    })
    .slice(0, 5);

  elements.weakPatternsList.innerHTML = weakPatterns.length
    ? weakPatterns.map(pattern => `
      \u003cli>
        \u003cstrong>${escapeHtml(pattern.patternLabel)}\u003c/strong>\u003cbr>
        \u003cspan class="list-meta">Chyby: ${pattern.incorrectCount} · Správně: ${pattern.correctCount}\u003c/span>
      \u003c/li>
    `).join("")
    : "\u003cli>Натím tu nejsou data. Udělej první lekci.\u003c/li>";

  elements.recentLessonsList.innerHTML = state.lessons.length
    ? state.lessons.slice(0, 5).map(lesson => `
      \u003cli>
        \u003cstrong>${new Date(lesson.createdAt).toLocaleString("cs-CZ")}\u003c/strong>\u003cbr>
        \u003cspan class="list-meta">${escapeHtml(lesson.focus)} · ${lesson.itemCount} vět${lesson.score === null ? "" : ` · ${lesson.score}%`}\u003c/span>
      \u003c/li>
    `).join("")
    : "\u003cli>Zatím žádné lekce.\u003c/li>";

  renderLastLessonChip();
}

function resetProgress() {
  if (!window.confirm("Opravdu chceš smazat historii odpovědí i sledované chybové vzorce?")) return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}