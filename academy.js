
// ==========================================
// OPENFEES ACADEMY — COMPLETE JAVASCRIPT
// ==========================================

"use strict";

// ==========================================
// MOBILE NAVIGATION
// ==========================================

const academyMenuToggle = document.getElementById(
  "academyMenuToggle"
);

const academyNavigation = document.getElementById(
  "academy-navigation"
);

if (academyMenuToggle && academyNavigation) {

  function closeAcademyMenu() {
    academyNavigation.classList.remove("is-open");

    academyMenuToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    academyMenuToggle.setAttribute(
      "aria-label",
      "Open Academy menu"
    );
  }

  academyMenuToggle.addEventListener("click", () => {

    const isOpen = academyNavigation.classList.toggle(
      "is-open"
    );

    academyMenuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    academyMenuToggle.setAttribute(
      "aria-label",
      isOpen
        ? "Close Academy menu"
        : "Open Academy menu"
    );
  });

  academyNavigation.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeAcademyMenu);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeAcademyMenu();
    }
  });

  document.addEventListener("click", event => {

    if (
      !academyMenuToggle.contains(event.target) &&
      !academyNavigation.contains(event.target)
    ) {
      closeAcademyMenu();
    }
  });
}


// ==========================================
// CBT DEMO — ORIGINAL PRACTICE QUESTIONS
//
// These are NOT historical JAMB/WAEC/NECO
// questions. The labels describe styles,
// not verified examination provenance.
// ==========================================

const academyDemoBanks = {

  jamb: {
    label: "JAMB-style practice demo",

    questions: [
      {
        subject: "Mathematics",
        question:
          "If 4x + 6 = 26, what is the value of x?",
        options: [
          "4",
          "5",
          "6",
          "8"
        ],
        correct: 1,
        explanation:
          "Subtract 6 from both sides to get 4x = 20. Divide by 4, so x = 5."
      },

      {
        subject: "English Language",
        question:
          "Choose the word closest in meaning to 'diligent'.",
        options: [
          "Careless",
          "Hardworking",
          "Confused",
          "Uncertain"
        ],
        correct: 1,
        explanation:
          "Diligent means showing steady effort and careful attention to work."
      },

      {
        subject: "Biology",
        question:
          "Which part of a plant cell mainly contains chlorophyll?",
        options: [
          "Nucleus",
          "Cell wall",
          "Chloroplast",
          "Vacuole"
        ],
        correct: 2,
        explanation:
          "Chlorophyll is found in chloroplasts, which capture light energy for photosynthesis."
      }
    ]
  },

  waec: {
    label: "WAEC-style practice demo",

    questions: [
      {
        subject: "Mathematics",
        question:
          "What is 15% of 200?",
        options: [
          "15",
          "20",
          "30",
          "40"
        ],
        correct: 2,
        explanation:
          "15% of 200 = (15 ÷ 100) × 200 = 30."
      },

      {
        subject: "English Language",
        question:
          "Which sentence uses the correct subject-verb agreement?",
        options: [
          "She go to school every day.",
          "She going to school every day.",
          "She goes to school every day.",
          "She gone to school every day."
        ],
        correct: 2,
        explanation:
          "With the third-person singular subject 'she', the simple present form is 'goes'."
      },

      {
        subject: "Chemistry",
        question:
          "Which of these substances has a neutral pH at 25°C?",
        options: [
          "Pure water",
          "Lemon juice",
          "Vinegar",
          "Household bleach"
        ],
        correct: 0,
        explanation:
          "Pure water is neutral at 25°C and has a pH of approximately 7."
      }
    ]
  },

  neco: {
    label: "NECO-style practice demo",

    questions: [
      {
        subject: "Mathematics",
        question:
          "A rectangle is 8 cm long and 5 cm wide. What is its area?",
        options: [
          "13 cm²",
          "26 cm²",
          "40 cm²",
          "80 cm²"
        ],
        correct: 2,
        explanation:
          "The area of a rectangle is length × width. So 8 × 5 = 40 cm²."
      },

      {
        subject: "Biology",
        question:
          "Which human organ is mainly responsible for pumping blood?",
        options: [
          "Liver",
          "Heart",
          "Kidney",
          "Lung"
        ],
        correct: 1,
        explanation:
          "The heart pumps blood through blood vessels around the body."
      },

      {
        subject: "English Language",
        question:
          "Choose the correctly punctuated sentence.",
        options: [
          "Where are you going.",
          "Where are you going!",
          "Where are you going?",
          "Where are you going,"
        ],
        correct: 2,
        explanation:
          "A direct question normally ends with a question mark."
      }
    ]
  }
};


// ==========================================
// CBT DEMO ELEMENTS
// ==========================================

const demoExamSelect = document.getElementById(
  "demoExamSelect"
);

const demoExamLabel = document.getElementById(
  "demoExamLabel"
);

const demoQuestionView = document.getElementById(
  "demoQuestionView"
);

const demoResultsView = document.getElementById(
  "demoResultsView"
);

const demoQuestionCounter = document.getElementById(
  "demoQuestionCounter"
);

const demoProgressText = document.getElementById(
  "demoProgressText"
);

const demoProgressFill = document.getElementById(
  "demoProgressFill"
);

const demoQuestionSubject = document.getElementById(
  "demoQuestionSubject"
);

const demoQuestionText = document.getElementById(
  "demoQuestionText"
);

const demoAnswerList = document.getElementById(
  "demoAnswerList"
);

const demoPreviousButton = document.getElementById(
  "demoPreviousButton"
);

const demoNextButton = document.getElementById(
  "demoNextButton"
);

const demoScore = document.getElementById(
  "demoScore"
);

const demoResultMessage = document.getElementById(
  "demoResultMessage"
);

const demoReviewList = document.getElementById(
  "demoReviewList"
);

const demoRestartButton = document.getElementById(
  "demoRestartButton"
);


// ==========================================
// CBT DEMO STATE
// ==========================================

let currentDemoExam = "jamb";
let currentDemoQuestionIndex = 0;
let demoAnswers = [];

function getActiveDemoQuestions() {

  return academyDemoBanks[currentDemoExam].questions;
}

function resetAcademyDemo(examType = currentDemoExam) {

  if (!academyDemoBanks[examType]) {
    examType = "jamb";
  }

  currentDemoExam = examType;
  currentDemoQuestionIndex = 0;

  const questions = getActiveDemoQuestions();

  demoAnswers = Array(questions.length).fill(null);

  if (demoExamSelect) {
    demoExamSelect.value = currentDemoExam;
  }

  if (demoQuestionView) {
    demoQuestionView.hidden = false;
  }

  if (demoResultsView) {
    demoResultsView.hidden = true;
  }

  renderAcademyQuestion();
}


// ==========================================
// RENDER A PRACTICE QUESTION
// ==========================================

function renderAcademyQuestion() {

  if (!demoQuestionView || !demoAnswerList) return;

  const questions = getActiveDemoQuestions();
  const question = questions[currentDemoQuestionIndex];

  if (!question) return;

  const answeredCount = demoAnswers.filter(
    answer => answer !== null
  ).length;

  demoExamLabel.textContent =
    academyDemoBanks[currentDemoExam].label;

  demoQuestionCounter.textContent =
    `Question ${currentDemoQuestionIndex + 1} of ${questions.length}`;

  demoProgressText.textContent =
    `${answeredCount} answered`;

  demoProgressFill.style.width =
    `${(answeredCount / questions.length) * 100}%`;

  demoQuestionSubject.textContent = question.subject;

  demoQuestionText.textContent = question.question;

  // Clear previous choices safely.

  demoAnswerList.replaceChildren();

  const letters = ["A", "B", "C", "D"];

  question.options.forEach((option, index) => {

    const selected =
      demoAnswers[currentDemoQuestionIndex] === index;

    const button = document.createElement("button");

    button.type = "button";
    button.className = "demo-answer-option";

    button.setAttribute(
      "aria-pressed",
      String(selected)
    );

    const letter = document.createElement("span");

    letter.className = "demo-option-letter";
    letter.textContent = letters[index];

    const answerText = document.createElement("span");

    answerText.textContent = option;

    button.append(letter, answerText);

    button.addEventListener("click", () => {

      demoAnswers[currentDemoQuestionIndex] = index;

      renderAcademyQuestion();
    });

    demoAnswerList.appendChild(button);
  });

  demoPreviousButton.disabled =
    currentDemoQuestionIndex === 0;

  demoNextButton.textContent =
    currentDemoQuestionIndex === questions.length - 1
      ? "Finish Practice →"
      : "Next Question →";
}


// ==========================================
// NAVIGATION BETWEEN QUESTIONS
// ==========================================

function goToPreviousQuestion() {

  if (currentDemoQuestionIndex > 0) {

    currentDemoQuestionIndex--;

    renderAcademyQuestion();
  }
}

function goToNextQuestion() {

  const questions = getActiveDemoQuestions();

  if (currentDemoQuestionIndex < questions.length - 1) {

    currentDemoQuestionIndex++;

    renderAcademyQuestion();

  } else {

    showAcademyResults();
  }
}


// ==========================================
// EXAM RESULTS AND EXPLANATIONS
// ==========================================

function showAcademyResults() {

  const questions = getActiveDemoQuestions();

  let correctAnswers = 0;

  questions.forEach((question, index) => {

    if (demoAnswers[index] === question.correct) {
      correctAnswers++;
    }
  });

  demoQuestionView.hidden = true;
  demoResultsView.hidden = false;

  demoScore.textContent =
    `${correctAnswers} / ${questions.length}`;

  if (correctAnswers === questions.length) {

    demoResultMessage.textContent =
      "Excellent work! You got every question right.";

  } else if (correctAnswers >= 2) {

    demoResultMessage.textContent =
      "Good effort! Review the explanations and keep practising.";

  } else {

    demoResultMessage.textContent =
      "Every attempt helps you learn. Review the answers and try again.";
  }

  demoReviewList.replaceChildren();

  questions.forEach((question, index) => {

    const selectedAnswer = demoAnswers[index];

    const correct =
      selectedAnswer === question.correct;

    const review = document.createElement("div");

    review.className = "demo-review-item";

    const status = document.createElement("span");

    status.className = correct
      ? "demo-review-status"
      : "demo-review-status is-wrong";

    status.textContent = correct
      ? "✓ Correct"
      : selectedAnswer === null
        ? "Not answered"
        : "Review this answer";

    const title = document.createElement("strong");

    title.textContent =
      `Question ${index + 1}: ${question.subject}`;

    const questionText = document.createElement("p");

    questionText.textContent = question.question;

    const yourAnswer = document.createElement("p");

    yourAnswer.textContent =
      selectedAnswer === null
        ? "Your answer: Not answered"
        : `Your answer: ${question.options[selectedAnswer]}`;

    const correctAnswer = document.createElement("p");

    correctAnswer.textContent =
      `Correct answer: ${question.options[question.correct]}`;

    const explanation = document.createElement("p");

    explanation.textContent =
      `Explanation: ${question.explanation}`;

    review.append(
      status,
      title,
      questionText,
      yourAnswer,
      correctAnswer,
      explanation
    );

    demoReviewList.appendChild(review);
  });

  demoResultsView.scrollIntoView({
    behavior: window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches ? "auto" : "smooth",
    block: "nearest"
  });
}


// ==========================================
// CONNECT CBT CONTROLS
// ==========================================

if (demoExamSelect && demoQuestionView) {

  demoExamSelect.addEventListener("change", () => {
    resetAcademyDemo(demoExamSelect.value);
  });

  demoPreviousButton.addEventListener(
    "click",
    goToPreviousQuestion
  );

  demoNextButton.addEventListener(
    "click",
    goToNextQuestion
  );

  demoRestartButton.addEventListener(
    "click",
    () => resetAcademyDemo()
  );

  // Examinations are previews, not
  // official past-question sessions.

  document.querySelectorAll(
    "[data-start-exam]"
  ).forEach(button => {

    button.addEventListener("click", () => {

      const exam = button.dataset.startExam;

      resetAcademyDemo(exam);

      document.getElementById("cbt-demo")?.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth"
      });
    });
  });

  resetAcademyDemo("jamb");
}


// ==========================================
// COPYRIGHT YEAR
// ==========================================

document.querySelectorAll(
  "[data-academy-year]"
).forEach(element => {

  element.textContent = new Date().getFullYear();
});
