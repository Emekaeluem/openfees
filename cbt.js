
"use strict";

/* ==========================================
   OPENFEES ACADEMY — CBT ENGINE
   Independent educational practice system
========================================== */

const $ = id => document.getElementById(id);

const STORAGE_KEY = "openfees-academy-cbt-v2";

const EXAMS = {
  jamb: "JAMB / UTME",
  waec: "WAEC",
  neco: "NECO"
};

const SUBJECTS = [
  "Mathematics",
  "English Language",
  "Biology",
  "Chemistry",
  "Physics",
  "Economics",
  "Government"
];

const LETTERS = ["A", "B", "C", "D"];
const PAGE_SIZE = 10;
const questionBank = {};

let setup = null;
let session = null;
let timerInterval = null;
let finalResult = null;

/* ==========================================
   ORIGINAL QUESTION BANK
   No historical exam-year claims
========================================== */

function addQuestion(
  subject, topic, question, options, answer, explanation
) {
  if (!questionBank[subject]) {
    questionBank[subject] = [];
  }

  questionBank[subject].push({
    id: `original-${subject}-${questionBank[subject].length + 1}`,
    subject,
    topic,
    question,
    options,
    correct: answer,
    explanation,
    year: null,
    origin: "original"
  });
}

function rotateOptions(correct, wrong, seed) {
  const items = [String(correct), ...wrong.map(String)];
  const shift = seed % items.length;

  const options = [
    ...items.slice(shift),
    ...items.slice(0, shift)
  ];

  return {
    options,
    correct: options.indexOf(String(correct))
  };
}

/* 60 generated, original Mathematics questions */

for (let i = 1; i <= 12; i++) {
  const x = i + 2;
  const a = (i % 5) + 2;
  const b = i + 5;
  const total = a * x + b;

  const choice = rotateOptions(
    x, [x + 1, x - 1, x + 2], i
  );

  addQuestion(
    "Mathematics",
    "Algebra",
    `Solve ${a}x + ${b} = ${total}.`,
    choice.options,
    choice.correct,
    `Subtract ${b} from both sides. Then divide by ${a}. x = ${x}.`
  );
}

for (let i = 1; i <= 12; i++) {
  const number = 20 * (i + 4);
  const percent = ((i % 4) + 1) * 5;
  const answer = number * percent / 100;

  const choice = rotateOptions(
    answer,
    [answer + 2, answer + 5, answer + 10],
    i + 1
  );

  addQuestion(
    "Mathematics",
    "Percentages",
    `Find ${percent}% of ${number}.`,
    choice.options,
    choice.correct,
    `${percent}/100 × ${number} = ${answer}.`
  );
}

for (let i = 1; i <= 12; i++) {
  const length = i + 4;
  const width = (i % 5) + 3;
  const area = length * width;

  const choice = rotateOptions(
    `${area} cm²`,
    [
      `${2 * (length + width)} cm²`,
      `${area + length} cm²`,
      `${area + width} cm²`
    ],
    i + 2
  );

  addQuestion(
    "Mathematics",
    "Mensuration",
    `A rectangle measures ${length} cm by ${width} cm. Find its area.`,
    choice.options,
    choice.correct,
    `Area = length × width = ${length} × ${width} = ${area} cm².`
  );
}

for (let i = 1; i <= 12; i++) {
  const first = i + 3;
  const difference = (i % 4) + 2;
  const answer = first + 5 * difference;

  const choice = rotateOptions(
    answer,
    [
      answer + difference,
      answer - difference,
      answer + 1
    ],
    i + 3
  );

  addQuestion(
    "Mathematics",
    "Sequences",
    `The sequence begins ${first}, ${first + difference}, ${first + 2 * difference}, ... What is its 6th term?`,
    choice.options,
    choice.correct,
    `The common difference is ${difference}. The sixth term is ${first} + 5 × ${difference} = ${answer}.`
  );
}

for (let i = 1; i <= 12; i++) {
  const a = (i + 2) * 3;
  const b = (i % 5) + 2;
  const product = a * b;

  const choice = rotateOptions(
    b, [b + 1, b + 2, b + 3], i + 4
  );

  addQuestion(
    "Mathematics",
    "Arithmetic",
    `Evaluate ${product} ÷ ${a}.`,
    choice.options,
    choice.correct,
    `${product} divided by ${a} equals ${b}.`
  );
}

/* Other original questions */

const originalQuestions = {
  "English Language": [
    ["Vocabulary","Which word is closest in meaning to 'diligent'?",["Careless","Hardworking","Lazy","Forgetful"],1,"Diligent means hardworking and careful."],
    ["Grammar","Choose the correct sentence.",["She go to school.","She goes to school.","She going to school.","She gone to school."],1,"A third-person singular subject takes 'goes' in the simple present."],
    ["Vocabulary","Which word is the opposite of 'generous'?",["Kind","Selfish","Helpful","Giving"],1,"Selfish is the opposite of generous."],
    ["Grammar","Which word is a noun?",["Quickly","Beautiful","Happiness","Run"],2,"Happiness names a state and is a noun."],
    ["Grammar","Choose the correct plural of 'child'.",["Childs","Children","Childes","Childrens"],1,"The irregular plural of child is children."],
    ["Vocabulary","Which word means 'very large'?",["Tiny","Massive","Narrow","Brief"],1,"Massive means very large."],
    ["Grammar","Choose the correct past tense of 'write'.",["Writed","Writing","Wrote","Written"],2,"Wrote is the simple past tense of write."],
    ["Punctuation","Which sentence is punctuated correctly?",["Where are you going.","Where are you going?","Where are you going,","Where are you going!"],1,"A direct question ends with a question mark."],
    ["Grammar","Choose the correct word: She has ___ apple.",["a","an","thee","some"],1,"Use an before a vowel sound."],
    ["Vocabulary","What is the opposite of 'ancient'?",["Old","Modern","Historic","Past"],1,"Modern contrasts with ancient."],
    ["Grammar","Identify the adjective: 'The tall boy smiled.'",["The","Tall","Boy","Smiled"],1,"Tall describes the noun boy."],
    ["Grammar","Which word is an adverb?",["Slowly","Beautiful","Chair","Green"],0,"Slowly describes how an action is performed."],
    ["Vocabulary","Which word is closest in meaning to 'brave'?",["Timid","Courageous","Weak","Nervous"],1,"Courageous is a synonym for brave."],
    ["Grammar","Choose the correct pronoun: ___ are my books.",["This","That","These","It"],2,"These refers to plural things nearby."],
    ["Vocabulary","What is the opposite of 'victory'?",["Success","Defeat","Prize","Reward"],1,"Defeat is the opposite of victory."],
    ["Grammar","Complete: They ___ playing football.",["is","am","are","was"],2,"The plural subject they takes are."],
    ["Vocabulary","Which word means 'to begin'?",["Finish","Commence","End","Close"],1,"Commence means to begin."],
    ["Grammar","Which is a complete sentence?",["Running through the park.","Because it rained.","The teacher explained the lesson.","Under the large table."],2,"A complete sentence has a subject and a predicate."],
    ["Vocabulary","Which word is closest in meaning to 'accurate'?",["Correct","Incorrect","Rough","Vague"],0,"Accurate means correct or precise."],
    ["Grammar","Choose the correct form: He ___ finished his work.",["have","has","having","had been"],1,"He has finished his work is present perfect."]
  ],

  "Biology": [
    ["Cell Biology","Which structure controls most activities of a eukaryotic cell?",["Nucleus","Cell wall","Vacuole","Ribosome"],0,"The nucleus contains genetic material and regulates many cell activities."],
    ["Photosynthesis","Which organelle carries out photosynthesis?",["Mitochondrion","Chloroplast","Nucleus","Ribosome"],1,"Chloroplasts contain the machinery for photosynthesis."],
    ["Human Biology","Which organ pumps blood?",["Liver","Heart","Kidney","Lung"],1,"The heart pumps blood through the circulatory system."],
    ["Nutrition","Which nutrient is mainly used to build and repair body tissues?",["Protein","Water","Starch","Minerals"],0,"Proteins supply amino acids used for tissue growth and repair."],
    ["Ecology","Which organism makes its own food using sunlight?",["Green plant","Lion","Mushroom","Earthworm"],0,"Green plants can photosynthesise."],
    ["Respiration","Which gas is taken in during human aerobic respiration?",["Carbon dioxide","Oxygen","Nitrogen","Helium"],1,"Oxygen is used in aerobic respiration."],
    ["Genetics","What carries hereditary information in living organisms?",["DNA","Starch","Water","Glucose"],0,"DNA carries hereditary information."],
    ["Plant Biology","What is the main function of roots?",["Absorb water and minerals","Produce flowers","Make pollen","Disperse seeds"],0,"Roots mainly anchor plants and absorb water and minerals."],
    ["Human Biology","Which organ filters blood to form urine?",["Stomach","Kidney","Heart","Pancreas"],1,"The kidneys remove wastes and regulate water balance."],
    ["Cell Biology","Which structure controls what enters and leaves a cell?",["Cell membrane","Cell wall","Nucleolus","Chromosome"],0,"The cell membrane regulates movement across the cell boundary."],
    ["Ecology","What is an ecosystem?",["Only living organisms","Living organisms and their environment","Only animals","Only plants"],1,"An ecosystem includes interacting organisms and nonliving environmental factors."],
    ["Reproduction","Which flower part produces pollen?",["Anther","Stigma","Ovary","Sepal"],0,"Anthers produce pollen grains."],
    ["Human Biology","Where does most nutrient absorption occur?",["Stomach","Small intestine","Oesophagus","Large intestine"],1,"The small intestine absorbs most digested nutrients."],
    ["Photosynthesis","Which gas do plants generally absorb during photosynthesis?",["Oxygen","Carbon dioxide","Hydrogen","Nitrogen"],1,"Plants use carbon dioxide to form sugars during photosynthesis."],
    ["Genetics","What is a gene?",["A segment of DNA","A type of mineral","A cell organelle","A body organ"],0,"A gene is a DNA sequence with a biological function."],
    ["Human Biology","Which blood cells mainly transport oxygen?",["Platelets","Red blood cells","White blood cells","Plasma"],1,"Red blood cells contain haemoglobin that transports oxygen."],
    ["Plant Biology","Through which structures do most leaves exchange gases?",["Stomata","Roots","Petals","Seeds"],0,"Stomata allow gas exchange in leaves."],
    ["Ecology","Which organism is a primary consumer in a food chain?",["Grass","Grasshopper","Hawk","Mushroom"],1,"A grasshopper eats producers and is a primary consumer."],
    ["Human Biology","Which part of the nervous system includes the brain and spinal cord?",["Central nervous system","Digestive system","Endocrine system","Circulatory system"],0,"The central nervous system consists of the brain and spinal cord."],
    ["Cell Biology","Which organelle releases energy from food through aerobic respiration?",["Mitochondrion","Cell wall","Vacuole","Chloroplast"],0,"Mitochondria carry out major stages of aerobic respiration."]
  ],

  "Chemistry": [
    ["Atomic Structure","What is the atomic number of an element?",["Number of protons","Number of neutrons","Total mass","Number of shells"],0,"Atomic number equals the number of protons."],
    ["Acids and Bases","What is the pH of pure water at 25°C?",["3","7","10","14"],1,"Pure water is neutral with pH about 7 at 25°C."],
    ["Periodic Table","Which element has the symbol Na?",["Nitrogen","Sodium","Neon","Nickel"],1,"Na is the chemical symbol for sodium."],
    ["Bonding","Which bond involves electron sharing?",["Ionic","Covalent","Metallic","Hydrogen"],1,"A covalent bond involves shared electron pairs."],
    ["Matter","What is the change from liquid to gas called?",["Freezing","Condensation","Evaporation","Melting"],2,"Evaporation changes a liquid to gas."],
    ["Atomic Structure","Which particle has a negative charge?",["Proton","Neutron","Electron","Nucleus"],2,"Electrons carry negative charge."],
    ["Chemical Formulae","What is the formula for water?",["CO2","H2O","NaCl","O2"],1,"Water has the molecular formula H2O."],
    ["Acids and Bases","Which substance is commonly acidic?",["Lemon juice","Soap solution","Bleach","Baking soda solution"],0,"Lemon juice contains citric acid."],
    ["Matter","Which state of matter has a fixed shape and volume?",["Gas","Liquid","Solid","Plasma"],2,"Solids generally maintain both shape and volume."],
    ["Periodic Table","Which gas is represented by O2?",["Nitrogen","Hydrogen","Oxygen","Chlorine"],2,"O2 represents molecular oxygen."]
  ],

  "Physics": [
    ["Motion","What is the SI unit of speed?",["Metre","Metre per second","Second","Newton"],1,"Speed is measured in metres per second."],
    ["Forces","What is the SI unit of force?",["Joule","Watt","Newton","Pascal"],2,"Force is measured in newtons."],
    ["Energy","What is the SI unit of energy?",["Joule","Newton","Volt","Ampere"],0,"Energy is measured in joules."],
    ["Electricity","What is the SI unit of electric current?",["Ohm","Volt","Ampere","Watt"],2,"Current is measured in amperes."],
    ["Light","What happens to light during reflection?",["It bends into another medium","It bounces off a surface","It stops existing","It becomes sound"],1,"Reflection is the bouncing of light from a surface."],
    ["Motion","A car travels 100 m in 20 s. Find its average speed.",["2 m/s","5 m/s","20 m/s","80 m/s"],1,"Speed equals distance divided by time: 100/20 = 5 m/s."],
    ["Energy","Which energy is associated with motion?",["Chemical","Kinetic","Nuclear","Elastic potential"],1,"Kinetic energy is energy due to motion."],
    ["Heat","Which process transfers heat through direct contact?",["Radiation","Conduction","Reflection","Refraction"],1,"Conduction transfers thermal energy through matter."],
    ["Waves","Which quantity measures the number of oscillations per second?",["Wavelength","Frequency","Amplitude","Period"],1,"Frequency is the number of oscillations per second."],
    ["Electricity","Which material is a good electrical conductor?",["Rubber","Glass","Copper","Plastic"],2,"Copper is a good electrical conductor."]
  ],

  "Economics": [
    ["Basic Economics","What is scarcity?",["Unlimited goods","Limited resources relative to wants","No human wants","No production"],1,"Scarcity means resources are limited compared with wants."],
    ["Demand","What happens to quantity demanded when price rises, all else equal?",["Usually falls","Always rises","Never changes","Becomes zero"],0,"The law of demand generally describes an inverse relationship."],
    ["Production","Which is a factor of production?",["Land","Inflation","Demand","Price"],0,"Land is a factor of production."],
    ["Markets","What is a monopoly?",["Many sellers","One seller","Two consumers","Free exchange"],1,"A monopoly involves a single seller in a market."],
    ["Money","Which is a common function of money?",["Medium of exchange","Increase rainfall","Create land","Stop inflation"],0,"Money serves as a medium of exchange."],
    ["Inflation","What is inflation?",["Sustained rise in general prices","A fall in population","An increase in rainfall","The absence of trade"],0,"Inflation is a sustained rise in the general price level."],
    ["Opportunity Cost","What does opportunity cost mean?",["Total revenue","Value of the next best alternative forgone","Fixed cost","Money in a bank"],1,"Opportunity cost is the value of the next best alternative given up."],
    ["Markets","Which market has many buyers and sellers of identical products?",["Perfect competition","Monopoly","Monopsony","Bilateral monopoly"],0,"Perfect competition involves many buyers and sellers of homogeneous products."],
    ["Government","What is a tax?",["Compulsory levy imposed by government","A private gift","A bank loan","A discount"],0,"A tax is a compulsory government levy."],
    ["Trade","What is an import?",["Goods sold abroad","Goods purchased from abroad","Goods destroyed","Goods produced and used locally"],1,"Imports are goods or services purchased from other countries."]
  ],

  "Government": [
    ["Constitution","What is a constitution?",["A country's fundamental legal framework","A market price","A school timetable","A tax receipt"],0,"A constitution establishes core rules of government."],
    ["Democracy","What is a central feature of democracy?",["Citizen participation","Rule by one person only","No elections","No legal rights"],0,"Democracy includes citizens' participation in political decisions."],
    ["Separation of Powers","Which branch interprets laws?",["Executive","Legislature","Judiciary","Civil service"],2,"The judiciary interprets and applies laws."],
    ["Legislature","Which branch makes laws?",["Legislature","Judiciary","Police","Cabinet alone"],0,"The legislature is the lawmaking branch."],
    ["Citizenship","What is citizenship?",["Membership of a state","Ownership of a company","A type of tax","A court ruling"],0,"Citizenship is legal membership of a state."],
    ["Elections","What is universal adult suffrage?",["Voting rights for eligible adults","Voting only by officials","Voting only by property owners","Voting only by teachers"],0,"Universal adult suffrage extends the franchise to eligible adult citizens."],
    ["Rule of Law","What is the rule of law?",["Everyone is subject to the law","Leaders are above the law","Courts are unnecessary","Laws apply only to voters"],0,"The rule of law requires that laws apply to everyone, including public officials."],
    ["Federalism","What is federalism?",["Division of government powers between levels","A system without laws","Rule by one village","No constitution"],0,"Federalism distributes authority between national and subnational governments."],
    ["Executive","Which branch implements government policies?",["Executive","Judiciary","Electorate","Legislature"],0,"The executive administers and implements government policy."],
    ["Political Parties","What is a political party?",["An organisation seeking political power","A school club only","A court building","A government budget"],0,"Political parties organise people to contest elections and pursue policies."]
  ]
};

Object.entries(originalQuestions).forEach(([subject, rows]) => {
  rows.forEach(([topic, question, options, correct, explanation]) => {
    addQuestion(
      subject, topic, question, options, correct, explanation
    );
  });
});

/* ==========================================
   HELPERS
========================================== */

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function shuffle(items) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function saveSession() {
  if (!session) return;

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(session)
    );
  } catch (error) {
    console.warn("Browser storage is unavailable.", error);
  }
}

function removeSession() {
  localStorage.removeItem(STORAGE_KEY);
}

function showStage(id) {
  [
    "registrationStage",
    "instructionsStage",
    "examinationStage",
    "resultsStage"
  ].forEach(stage => {
    $(stage).hidden = stage !== id;
  });

  $("cbtIntro").hidden = id === "examinationStage";

  window.scrollTo({ top: 0, behavior: "auto" });
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds % 3600 / 60);
  const remainder = seconds % 60;

  return [hours, minutes, remainder]
    .map(value => String(value).padStart(2, "0"))
    .join(":");
}

function getDurationMinutes(count, mode) {
  // These are OpenFees practice timings, not
  // universal official examination durations.
  const minutesPerQuestion = mode === "simulation" ? 1 : 1.5;

  return Math.ceil(count * minutesPerQuestion);
}

function formatExamLabel(question, exam) {
  if (
    question.origin === "historical" &&
    question.reviewed === true &&
    Number.isInteger(question.year)
  ) {
    return `${EXAMS[exam]} (${question.year})`;
  }

  return "Original Practice";
}

/* ==========================================
   REGISTRATION SETUP
========================================== */

function populateSubjects() {
  $("examSubject").replaceChildren();

  SUBJECTS.forEach(subject => {
    const option = document.createElement("option");

    option.value = subject;
    option.textContent = subject;

    $("examSubject").appendChild(option);
  });

  populateQuestionCounts();
}

function populateQuestionCounts() {
  const subject = $("examSubject").value;
  const source = $("questionSource").value;

  const available = source === "historical"
    ? 60
    : (questionBank[subject] || []).length;

  $("questionCount").replaceChildren();

  [10, 20, 40, 60].forEach(count => {
    if (count > available) return;

    const option = document.createElement("option");

    option.value = String(count);
    option.textContent = `${count} Questions`;

    $("questionCount").appendChild(option);
  });

  const options = $("questionCount").options;

  if (options.length > 0) {
    $("questionCount").value =
      String(Math.min(60, available));
  }

  updateSetupPreview();
}

function updateSetupPreview() {
  const exam = EXAMS[$("examType").value];
  const subject = $("examSubject").value;
  const count = Number($("questionCount").value) || 0;
  const duration = getDurationMinutes(
    count,
    $("examMode").value
  );

  $("setupPreview").textContent =
    `${exam} — ${subject}`;

  $("setupDetails").textContent =
    `${count} questions • ${duration} minutes • 10 per page`;
}

$("examType").addEventListener("change", updateSetupPreview);
$("examMode").addEventListener("change", updateSetupPreview);
$("examSubject").addEventListener("change", populateQuestionCounts);
$("questionSource").addEventListener("change", populateQuestionCounts);
$("questionCount").addEventListener("change", updateSetupPreview);

/* ==========================================
   START REGISTRATION
========================================== */

$("registrationForm").addEventListener("submit", async event => {
  event.preventDefault();

  const candidate = $("candidateName").value.trim();
  const exam = $("examType").value;
  const subject = $("examSubject").value;
  const count = Number($("questionCount").value);
  const mode = $("examMode").value;
  const source = $("questionSource").value;

  if (candidate.length < 2) {
    alert("Please enter your full name.");
    return;
  }

  setup = {
    candidate,
    exam,
    subject,
    count,
    mode,
    source,
    durationMinutes: getDurationMinutes(count, mode)
  };

  let questions = [];

  if (source === "historical") {
    try {
      const params = new URLSearchParams({
        exam,
        subject: subject.toLowerCase(),
        count: String(count)
      });

      const response = await fetch(
        `/api/questions?${params.toString()}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to retrieve historical questions."
        );
      }

      questions = data.questions || data.data || [];

      // Require provider-reviewed and dated content
      // before displaying verified-looking year badges.
      questions = questions.map(q => ({
        ...q,
        origin: "historical",
        reviewed: q.reviewed === true
      }));

    } catch (error) {
      alert(
        `Historical questions are not available yet.\n\n${error.message}\n\nChoose OpenFees Original Practice Questions.`
      );
      return;
    }
  } else {
    questions = shuffle(questionBank[subject] || [])
      .slice(0, count);
  }

  if (questions.length !== count) {
    alert(
      `Only ${questions.length} questions are available for this selection. Please choose a different question count.`
    );
    return;
  }

  session = {
    setup,
    questions,
    answers: Array(count).fill(null),
    flags: Array(count).fill(false),
    page: 0,
    startedAt: null,
    endAt: null,
    submitted: false
  };

  $("instructionSummary").textContent =
    `${EXAMS[exam]} • ${subject} • ${count} questions`;

  $("instructionQuestionCount").textContent = count;
  $("instructionDuration").textContent =
    `${setup.durationMinutes} minutes`;

  $("sourceNotice").textContent =
    source === "historical"
      ? "Historical question metadata is supplied by an independent provider. OpenFees is not officially endorsed by the examination bodies."
      : "These are original OpenFees practice questions, not official historical JAMB, WAEC or NECO questions.";

  $("acceptInstructions").checked = false;
  $("startExamination").disabled = true;

  showStage("instructionsStage");
});

$("backToRegistration").addEventListener("click", () => {
  session = null;
  showStage("registrationStage");
});

$("acceptInstructions").addEventListener("change", event => {
  $("startExamination").disabled = !event.target.checked;
});

$("startExamination").addEventListener("click", () => {
  if (!session || !$("acceptInstructions").checked) return;

  session.startedAt = Date.now();
  session.endAt =
    session.startedAt +
    session.setup.durationMinutes * 60 * 1000;

  session.page = 0;

  saveSession();
  showStage("examinationStage");
  renderExamination();
  startTimer();
});

/* ==========================================
   TIMER
========================================== */

function remainingSeconds() {
  if (!session || !session.endAt) return 0;

  return Math.max(
    0,
    Math.ceil((session.endAt - Date.now()) / 1000)
  );
}

function startTimer() {
  clearInterval(timerInterval);

  function tick() {
    if (!session || session.submitted) {
      clearInterval(timerInterval);
      return;
    }

    const remaining = remainingSeconds();

    $("examTimer").textContent = formatTime(remaining);

    $("examTimer").closest(".cbt-timer")
      .classList.toggle("warning", remaining <= 300);

    if (remaining <= 0) {
      submitExam(true);
    }
  }

  tick();

  timerInterval = setInterval(tick, 1000);
}

/* ==========================================
   RENDER 10 QUESTIONS PER PAGE
========================================== */

function renderExamination() {
  if (!session || session.submitted) return;

  if (remainingSeconds() <= 0) {
    submitExam(true);
    return;
  }

  const { questions, answers, flags, page, setup: s } = session;

  const pages = Math.ceil(questions.length / PAGE_SIZE);
  const start = page * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, questions.length);

  const answered = answers.filter(a => a !== null).length;
  const flagged = flags.filter(Boolean).length;

  $("activeExamName").textContent = EXAMS[s.exam];
  $("activeSubject").textContent = s.subject;
  $("activeCandidate").textContent =
    `Candidate: ${s.candidate}`;

  $("currentPageInfo").textContent =
    `Page ${page + 1} of ${pages}`;

  $("pageIndicator").textContent =
    `Page ${page + 1} of ${pages}`;

  $("answeredCount").textContent =
    `${answered} of ${questions.length} answered`;

  $("flaggedCount").textContent =
    `${flagged} marked for review`;

  $("progressFill").style.width =
    `${answered / questions.length * 100}%`;

  const container = $("questionsContainer");
  container.replaceChildren();

  for (let i = start; i < end; i++) {
    const question = questions[i];

    const article = document.createElement("article");
    article.className = "cbt-question";
    article.id = `question-${i + 1}`;

    const sourceLabel = escapeHtml(
      formatExamLabel(question, s.exam)
    );

    article.innerHTML = `
      <div class="cbt-question-header">
        <span class="cbt-question-number">
          QUESTION ${i + 1} OF ${questions.length}
        </span>

        <span class="cbt-source">
          ${sourceLabel}
        </span>
      </div>

      <h3>${escapeHtml(question.question)}</h3>

      <div class="cbt-options">
        ${question.options.map((option, index) => `
          <label class="cbt-option">
            <input
              type="radio"
              name="answer-${i}"
              value="${index}"
              ${answers[i] === index ? "checked" : ""}
            >

            <span>
              <strong>${LETTERS[index]}.</strong>
              ${escapeHtml(option)}
            </span>
          </label>
        `).join("")}
      </div>

      <button
        type="button"
        class="cbt-flag ${flags[i] ? "active" : ""}"
        data-flag="${i}"
        aria-pressed="${flags[i]}"
      >
        ${flags[i] ? "★ Marked for Review" : "☆ Mark for Review"}
      </button>
    `;

    article.querySelectorAll('input[type="radio"]')
      .forEach(input => {
        input.addEventListener("change", () => {
          session.answers[i] = Number(input.value);

          saveSession();
          updateExamProgress();
        });
      });

    article.querySelector("[data-flag]")
      .addEventListener("click", () => {
        session.flags[i] = !session.flags[i];

        saveSession();
        renderExamination();
      });

    container.appendChild(article);
  }

  $("previousPage").disabled = page === 0;
  $("nextPage").disabled = page === pages - 1;

  renderNavigator();
}

function updateExamProgress() {
  const answered =
    session.answers.filter(a => a !== null).length;

  const flagged =
    session.flags.filter(Boolean).length;

  $("answeredCount").textContent =
    `${answered} of ${session.questions.length} answered`;

  $("flaggedCount").textContent =
    `${flagged} marked for review`;

  $("progressFill").style.width =
    `${answered / session.questions.length * 100}%`;

  renderNavigator();
}

function renderNavigator() {
  const navigator = $("questionNavigator");
  navigator.replaceChildren();

  session.questions.forEach((question, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = index + 1;

    if (session.answers[index] !== null) {
      button.classList.add("answered");
    }

    if (session.flags[index]) {
      button.classList.add("flagged");
    }

    if (
      Math.floor(index / PAGE_SIZE) === session.page
    ) {
      button.classList.add("active");
    }

    button.setAttribute(
      "aria-label",
      `Go to question ${index + 1}`
    );

    button.addEventListener("click", () => {
      session.page = Math.floor(index / PAGE_SIZE);

      saveSession();
      renderExamination();

      document.getElementById(`question-${index + 1}`)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
    });

    navigator.appendChild(button);
  });
}

$("previousPage").addEventListener("click", () => {
  if (session.page <= 0) return;

  session.page--;
  saveSession();
  renderExamination();

  $("examinationStage").scrollIntoView();
});

$("nextPage").addEventListener("click", () => {
  const maxPage = Math.ceil(
    session.questions.length / PAGE_SIZE
  ) - 1;

  if (session.page >= maxPage) return;

  session.page++;
  saveSession();
  renderExamination();

  $("examinationStage").scrollIntoView();
});

/* ==========================================
   SUBMISSION
========================================== */

function openSubmissionDialog() {
  if (!session) return;

  const answered =
    session.answers.filter(a => a !== null).length;

  const unanswered = session.questions.length - answered;

  $("submissionSummary").textContent =
    `You answered ${answered} of ${session.questions.length} questions. ${unanswered} question(s) remain unanswered.`;

  $("submissionDialog").showModal();
}

$("submitExamination").addEventListener(
  "click",
  openSubmissionDialog
);

$("cancelSubmission").addEventListener("click", () => {
  $("submissionDialog").close();
});

$("confirmSubmission").addEventListener("click", () => {
  $("submissionDialog").close();
  submitExam(false);
});

function submitExam(autoSubmitted = false) {
  if (!session || session.submitted) return;

  clearInterval(timerInterval);

  session.submitted = true;
  session.submittedAt = Date.now();
  session.autoSubmitted = autoSubmitted;

  try {
    $("submissionDialog").close();
  } catch (_) {}

  finalResult = calculateResults();
  saveSession();

  renderResults();
  showStage("resultsStage");
}

/* ==========================================
   RESULT ANALYSIS
========================================== */

function calculateResults() {
  const topics = {};
  let correct = 0;

  session.questions.forEach((question, index) => {
    const topic = question.topic || "General Practice";

    if (!topics[topic]) {
      topics[topic] = {
        total: 0,
        correct: 0
      };
    }

    topics[topic].total++;

    if (session.answers[index] === question.correct) {
      correct++;
      topics[topic].correct++;
    }
  });

  const total = session.questions.length;
  const attempted =
    session.answers.filter(a => a !== null).length;

  const timeUsed = Math.max(
    0,
    Math.min(
      session.setup.durationMinutes * 60,
      Math.floor(
        (session.submittedAt - session.startedAt) / 1000
      )
    )
  );

  return {
    candidate: session.setup.candidate,
    exam: session.setup.exam,
    subject: session.setup.subject,
    source: session.setup.source,
    total,
    correct,
    attempted,
    incorrect: attempted - correct,
    unanswered: total - attempted,
    percentage: Math.round(correct / total * 100),
    timeUsed,
    duration: session.setup.durationMinutes,
    date: new Date(session.submittedAt),
    topics,
    questions: session.questions,
    answers: session.answers
  };
}

function getRecommendations() {
  const entries = Object.entries(finalResult.topics)
    .map(([topic, data]) => ({
      topic,
      percentage: Math.round(
        data.correct / data.total * 100
      ),
      correct: data.correct,
      total: data.total
    }))
    .sort((a, b) => a.percentage - b.percentage);

  const weak = entries.filter(item => item.percentage < 60);

  if (!weak.length) {
    return [
      "Good work across the topics covered.",
      "Review any questions you missed.",
      "Try another practice examination to build consistency."
    ];
  }

  return [
    ...weak.slice(0, 3).map(item =>
      `Strengthen ${item.topic}: you scored ${item.percentage}% in this topic. Review the explanations and practise more questions.`
    ),
    "After revision, take another targeted practice test."
  ];
}

function renderResults() {
  if (!finalResult) return;

  const r = finalResult;

  $("resultPercentage").textContent =
    `${r.percentage}%`;

  const metrics = [
    ["Correct", `${r.correct}/${r.total}`],
    ["Score", `${r.percentage}%`],
    ["Attempted", `${r.attempted}/${r.total}`],
    ["Time Used", formatTime(r.timeUsed)]
  ];

  $("resultMetrics").innerHTML = metrics.map(
    ([label, value]) => `
      <div class="cbt-metric">
        <strong>${escapeHtml(value)}</strong>
        <span>${escapeHtml(label)}</span>
      </div>
    `
  ).join("");

  $("topicPerformance").innerHTML =
    Object.entries(r.topics)
      .map(([topic, data]) => {
        const percentage = Math.round(
          data.correct / data.total * 100
        );

        return `
          <div class="cbt-topic">
            <div class="cbt-topic-row">
              <span>${escapeHtml(topic)}</span>
              <strong>${percentage}%</strong>
            </div>

            <div class="cbt-topic-track">
              <div
                class="${percentage < 60 ? "weak" : ""}"
                style="width:${percentage}%"
              ></div>
            </div>
          </div>
        `;
      }).join("");

  $("improvementRecommendations").innerHTML =
    getRecommendations().map(message => `
      <div class="cbt-recommendation">
        ${escapeHtml(message)}
      </div>
    `).join("");

  $("answerReview").innerHTML =
    r.questions.map((question, index) => {
      const answer = r.answers[index];

      const correct = answer === question.correct;

      const selectedText = answer === null
        ? "Not answered"
        : question.options[answer];

      return `
        <div class="cbt-review-item">

          <strong>
            Question ${index + 1} —
            ${escapeHtml(question.topic || "General")}
          </strong>

          <p>${escapeHtml(question.question)}</p>

          <p class="${correct ? "correct" : "incorrect"}">
            ${correct ? "Correct" : "Review needed"}
          </p>

          <p>
            Your answer:
            ${escapeHtml(selectedText)}
          </p>

          <p>
            Correct answer:
            ${escapeHtml(question.options[question.correct])}
          </p>

          <p>
            Explanation:
            ${escapeHtml(question.explanation || "Review this topic.")}
          </p>

        </div>
      `;
    }).join("");
}

/* ==========================================
   PDF RESULT REPORT
========================================== */

async function getLogoDataUrl() {
  try {
    const response = await fetch("media/Openfees.png");

    if (!response.ok) return null;

    const blob = await response.blob();

    return await new Promise(resolve => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve(null);

      reader.readAsDataURL(blob);
    });
  } catch (_) {
    return null;
  }
}

function safeFileName(value) {
  return value
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

async function downloadReport() {
  if (!finalResult) return;

  if (!window.jspdf?.jsPDF) {
    alert(
      "The PDF library is unavailable. Choose Print Result, then Save as PDF."
    );
    return;
  }

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const r = finalResult;
  const logo = await getLogoDataUrl();

  const navy = [3, 36, 100];
  const cyan = [0, 174, 238];
  const muted = [83, 106, 130];

  let y = 0;
  let page = 1;

  function header() {
    doc.setFillColor(...navy);
    doc.rect(0, 0, 210, 38, "F");

    if (logo) {
      try {
        const format = logo.includes("image/png")
          ? "PNG"
          : "JPEG";

        doc.addImage(logo, format, 15, 8, 27, 22);
      } catch (_) {}
    }

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.text("OPENFEES ACADEMY", 48, 17);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("STUDENT PERFORMANCE REPORT", 48, 24);

    doc.setDrawColor(...cyan);
    doc.setLineWidth(1.1);
    doc.line(15, 39, 195, 39);

    y = 50;
  }

  function footer() {
    doc.setDrawColor(220, 231, 242);
    doc.line(15, 276, 195, 276);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...muted);

    doc.text(
      "OpenFees Academy | openfees.org | Contact: openfees.org/contact.html",
      15,
      282
    );

    doc.text(
      `Practice assessment only - not an official examination result. Page ${page}`,
      15,
      288
    );
  }

  function nextPageIfNeeded(height = 15) {
    if (y + height <= 269) return;

    footer();
    doc.addPage();
    page++;
    header();
  }

  function line(label, value) {
    nextPageIfNeeded(12);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...navy);
    doc.setFontSize(10);
    doc.text(label, 16, y);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 62, 85);

    const wrapped = doc.splitTextToSize(String(value), 118);
    doc.text(wrapped, 75, y);

    y += Math.max(10, wrapped.length * 5 + 4);
  }

  function heading(text) {
    nextPageIfNeeded(17);

    y += 5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...navy);

    doc.text(text, 16, y);
    y += 9;
  }

  header();

  heading("Candidate Information");

  line("Candidate:", r.candidate);
  line("Examination:", EXAMS[r.exam]);
  line("Subject:", r.subject);
  line("Date:", r.date.toLocaleDateString("en-NG"));
  line("Question Source:", r.source === "historical"
    ? "Independent historical question provider"
    : "OpenFees original practice");

  heading("Examination Summary");

  line("Total Questions:", r.total);
  line("Questions Attempted:", r.attempted);
  line("Correct Answers:", r.correct);
  line("Incorrect Answers:", r.incorrect);
  line("Unanswered:", r.unanswered);
  line("Total Score:", `${r.percentage}%`);
  line("Time Used:", formatTime(r.timeUsed));

  heading("Performance by Topic");

  Object.entries(r.topics).forEach(([topic, data]) => {
    const percentage = Math.round(
      data.correct / data.total * 100
    );

    line(topic + ":", `${data.correct}/${data.total} (${percentage}%)`);
  });

  heading("Recommended Areas for Improvement");

  getRecommendations().forEach((message, index) => {
    const lines = doc.splitTextToSize(
      `${index + 1}. ${message}`,
      178
    );

    nextPageIfNeeded(lines.length * 5 + 8);

    doc.setTextColor(...muted);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    doc.text(lines, 16, y);
    y += lines.length * 5 + 7;
  });

  heading("Assessment Note");

  const note = doc.splitTextToSize(
    "This document records an independent OpenFees Academy practice assessment. It is not an official JAMB, WAEC or NECO statement of results or certificate.",
    175
  );

  nextPageIfNeeded(note.length * 5 + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text(note, 16, y);

  footer();

  doc.save(
    `OpenFees-${safeFileName(r.candidate)}-${r.exam}-Result.pdf`
  );
}

$("downloadPdf").addEventListener(
  "click",
  downloadReport
);

/* ==========================================
   PRINTABLE REPORT
========================================== */

$("printResult").addEventListener("click", () => {
  if (!finalResult) return;

  const r = finalResult;

  const topics = Object.entries(r.topics)
    .map(([topic, data]) => {
      const percentage = Math.round(
        data.correct / data.total * 100
      );

      return `<tr>
        <td>${escapeHtml(topic)}</td>
        <td>${data.correct}/${data.total}</td>
        <td>${percentage}%</td>
      </tr>`;
    }).join("");

  const suggestions = getRecommendations()
    .map(text => `<li>${escapeHtml(text)}</li>`)
    .join("");

  const printWindow = window.open(
    "",
    "_blank",
    "width=900,height=800"
  );

  if (!printWindow) {
    alert("Allow pop-ups to print this report.");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>OpenFees Academy Result</title>
      <style>
        body {
          margin: 0;
          padding: 35px;
          color: #17314f;
          font-family: Arial, sans-serif;
        }
        header {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: #032464;
          color: white;
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
        header img {
          width: 115px;
        }
        h1 { margin: 0; font-size: 24px; }
        h2 { color: #032464; font-size: 18px; }
        p { line-height: 1.7; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0 25px;
        }
        td, th {
          padding: 12px;
          border: 1px solid #d8e5ee;
          text-align: left;
        }
        .score {
          font-size: 35px;
          font-weight: bold;
          color: #008fc7;
        }
        footer {
          margin-top: 45px;
          padding-top: 15px;
          border-top: 1px solid #d8e5ee;
          font-size: 11px;
        }
        @media print {
          @page { size: A4; margin: 16mm; }
          body { padding: 0; }
        }
      </style>
    </head>

    <body>
      <header>
        <img src="${new URL("media/Openfees-white.png", location.href).href}"
             alt="OpenFees">
        <div>
          <h1>OPENFEES ACADEMY</h1>
          STUDENT PERFORMANCE REPORT
        </div>
      </header>

      <h2>Candidate Information</h2>
      <p>
        <strong>Name:</strong> ${escapeHtml(r.candidate)}<br>
        <strong>Examination:</strong> ${EXAMS[r.exam]}<br>
        <strong>Subject:</strong> ${escapeHtml(r.subject)}<br>
        <strong>Date:</strong> ${r.date.toLocaleDateString("en-NG")}
      </p>

      <h2>Examination Performance</h2>

      <p class="score">${r.percentage}%</p>

      <p>
        Correct: ${r.correct}/${r.total}<br>
        Attempted: ${r.attempted}<br>
        Time Used: ${formatTime(r.timeUsed)}
      </p>

      <h2>Topic Breakdown</h2>

      <table>
        <thead>
          <tr>
            <th>Topic</th>
            <th>Correct</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>${topics}</tbody>
      </table>

      <h2>Recommended Areas to Strengthen</h2>
      <ol>${suggestions}</ol>

      <footer>
        OpenFees Academy | openfees.org |
        Contact: openfees.org/contact.html

        <p>
          Independent practice examination result.
          Not an official JAMB, WAEC or NECO certificate.
        </p>
      </footer>
    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  // Allow the report document to display first.
  printWindow.addEventListener("load", () => {
    printWindow.print();
  });
});

/* ==========================================
   NEW EXAM
========================================== */

$("takeAnotherExam").addEventListener("click", () => {
  clearInterval(timerInterval);

  session = null;
  finalResult = null;

  removeSession();
  showStage("registrationStage");
});

/* ==========================================
   RESUME AN INTERRUPTED EXAM
========================================== */

function restoreSavedSession() {
  let saved;

  try {
    saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    );
  } catch (_) {
    removeSession();
    return;
  }

  if (
    !saved ||
    !saved.setup ||
    !Array.isArray(saved.questions) ||
    !Array.isArray(saved.answers) ||
    !Array.isArray(saved.flags)
  ) {
    return;
  }

  if (
    saved.questions.length === 0 ||
    saved.questions.length !== saved.answers.length ||
    saved.questions.length !== saved.flags.length ||
    !Number.isFinite(saved.endAt)
  ) {
    removeSession();
    return;
  }

  if (saved.submitted) {
    removeSession();
    return;
  }

  if (!confirm(
    "You have an unfinished OpenFees CBT session. Would you like to resume it?"
  )) {
    removeSession();
    return;
  }

  setup = saved.setup;
  session = saved;

  if (remainingSeconds() <= 0) {
    submitExam(true);
    return;
  }

  showStage("examinationStage");
  renderExamination();
  startTimer();
}

/* ==========================================
   INITIALISE
========================================== */

function initialiseCBT() {
  populateSubjects();

  const params = new URLSearchParams(location.search);

  const requestedExam = params.get("exam");

  if (EXAMS[requestedExam]) {
    $("examType").value = requestedExam;
  }

  const requestedSubject = params.get("subject");

  if (SUBJECTS.includes(requestedSubject)) {
    $("examSubject").value = requestedSubject;
  }

  populateQuestionCounts();
  updateSetupPreview();

  restoreSavedSession();
}

initialiseCBT();
