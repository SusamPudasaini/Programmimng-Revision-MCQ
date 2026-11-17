const QUESTIONS = [{"question": "Which component executes Java bytecode?", "options": ["javac", "JVM", "javadoc", "A text editor"], "answer": 1, "explanation": "The JVM loads and executes Java bytecode."}, {"question": "What does javac Hello.java produce?", "options": ["Hello.exe", "Hello.java", "Hello.class", "Hello.txt"], "answer": 2, "explanation": "javac compiles Java source code into a .class bytecode file."}, {"question": "Which command runs the compiled Hello class?", "options": ["java Hello", "javac Hello", "java Hello.class", "run Hello.java"], "answer": 0, "explanation": "In the two-step workflow, java expects the class name."}, {"question": "Which statement about portability is correct?", "options": ["Every JVM works on every OS", "Java source is native machine code", "Java needs no runtime", "Bytecode needs a compatible JVM"], "answer": 3, "explanation": "Bytecode is portable, while JVM builds depend on the host platform."}, {"question": "A public class Greeting belongs in which file?", "options": ["greeting.java", "Greeting.class", "Greeting.java", "Main.txt"], "answer": 2, "explanation": "The public class name and source filename must match exactly."}, {"question": "Which is a valid conventional variable declaration?", "options": ["int 2quantity = 7;", "double unitPrice = 50.0;", "double unit-price = 50;", "int class = 7;"], "answer": 1, "explanation": "unitPrice follows identifier rules and the camelCase convention."}, {"question": "Which type stores true or false?", "options": ["boolean", "char", "byte", "String only"], "answer": 0, "explanation": "boolean represents logical values: true or false."}, {"question": "What does byte b = 127; b++; leave in b?", "options": ["128", "0", "Compilation error", "-128"], "answer": 3, "explanation": "Incrementing past the maximum byte value wraps to −128."}, {"question": "Which literal represents decimal 26?", "options": ["0b10100", "032", "0x20", "026"], "answer": 1, "explanation": "Octal 032 is 3 × 8 + 2 = 26."}, {"question": "What is the type and value of 'A' + 1?", "options": ["char B", "String A1", "int 66", "int 65"], "answer": 2, "explanation": "Numeric promotion produces int. The character code for A is 65."}, {"question": "What does (int) -7.9 evaluate to?", "options": ["-7", "-8", "7", "Compilation error"], "answer": 0, "explanation": "Conversion to int truncates toward zero."}, {"question": "What does double result = 7 / 2; store?", "options": ["3.5", "7.0", "Compilation error", "3.0"], "answer": 3, "explanation": "Integer division gives 3 before the result is widened to double."}, {"question": "Which expression evaluates to 3.5?", "options": ["(double) (7 / 2)", "7 / 2.0", "(int) 7 / 2", "7 % 2"], "answer": 1, "explanation": "A double operand makes this floating-point division."}, {"question": "Which method compares the text in two Strings?", "options": ["==", "compareReferences()", "equals()", "same()"], "answer": 2, "explanation": "equals() compares text, while == compares references."}, {"question": "Which format displays 125.5 as 125.50?", "options": ["%.2f", "%d", "%c", "%%"], "answer": 0, "explanation": "%.2f displays two digits after the decimal separator."}, {"question": "Which Scanner method reads a full name with spaces?", "options": ["nextInt()", "next()", "nextDouble()", "nextLine()"], "answer": 3, "explanation": "nextLine() reads the rest of the current line, including spaces."}, {"question": "Why can nextLine() return empty after nextInt()?", "options": ["Scanner cannot read Strings", "An unread line separator remains", "The number is too large", "nextLine() always returns empty"], "answer": 1, "explanation": "nextInt() reads the token and can leave the line separator behind."}, {"question": "What does final double PASS_MARK = 40.0; prevent?", "options": ["Reading PASS_MARK", "Multiplying PASS_MARK", "Reassigning PASS_MARK", "Printing PASS_MARK"], "answer": 2, "explanation": "final prevents reassignment after initialization."}, {"question": "What does (char) ('A' + 1) produce?", "options": ["B", "66", "A1", "Compilation error"], "answer": 0, "explanation": "'A' + 1 gives int 66. Casting that value to char gives 'B'."}, {"question": "Which is a widening primitive conversion?", "options": ["double to int", "int to byte", "int to char", "int to double"], "answer": 3, "explanation": "int to double is a widening conversion and needs no explicit cast."}];
const letters = ["A", "B", "C", "D"];
let student = null;
let current = 0;
let answers = Array(QUESTIONS.length).fill(null);

const $ = (id) => document.getElementById(id);
const studentPanel = $("student-panel");
const quizPanel = $("quiz-panel");
const resultPanel = $("result-panel");

$("student-form").addEventListener("submit", (event) => {
  event.preventDefault();
  student = {
    name: $("student-name").value.trim(),
    email: $("student-email").value.trim(),
    section: $("student-section").value.trim()
  };
  if (!student.name || !student.email || !student.section) return;
  studentPanel.classList.add("hidden");
  quizPanel.classList.remove("hidden");
  renderQuestion();
  window.scrollTo({top: 0, behavior: "smooth"});
});

function renderQuestion() {
  const item = QUESTIONS[current];
  $("question-counter").textContent = `QUESTION ${current + 1} OF ${QUESTIONS.length}`;
  $("answered-counter").textContent = `${answers.filter(a => a !== null).length} of ${QUESTIONS.length} answered`;
  $("progress-fill").style.width = `${((current + 1) / QUESTIONS.length) * 100}%`;
  $("question-text").textContent = `${current + 1}. ${item.question}`;
  const list = $("options-list");
  list.replaceChildren();
  item.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `option${answers[current] === index ? " selected" : ""}`;
    button.setAttribute("aria-pressed", answers[current] === index ? "true" : "false");
    const letter = document.createElement("span");
    letter.className = "option-letter";
    letter.textContent = letters[index];
    const text = document.createElement("span");
    text.textContent = option;
    button.append(letter, text);
    button.addEventListener("click", () => {
      answers[current] = index;
      renderQuestion();
    });
    list.append(button);
  });
  $("previous-btn").disabled = current === 0;
  $("previous-btn").style.opacity = current === 0 ? ".45" : "1";
  const last = current === QUESTIONS.length - 1;
  $("next-btn").classList.toggle("hidden", last);
  $("submit-btn").classList.toggle("hidden", !last);
  $("quiz-hint").textContent = answers[current] === null
    ? "Choose one answer to continue."
    : "Answer saved. You can change it before submitting.";
}

$("previous-btn").addEventListener("click", () => {
  if (current > 0) { current--; renderQuestion(); }
});
$("next-btn").addEventListener("click", () => {
  if (answers[current] === null) {
    $("quiz-hint").textContent = "Please select an answer before continuing.";
    return;
  }
  current++;
  renderQuestion();
});
$("submit-btn").addEventListener("click", () => {
  const unanswered = answers.filter(a => a === null).length;
  if (unanswered) {
    $("quiz-hint").textContent = `Please answer all questions. ${unanswered} remaining.`;
    const firstMissing = answers.findIndex(a => a === null);
    current = firstMissing;
    renderQuestion();
    $("quiz-hint").textContent = `Please answer this question. ${unanswered} question(s) remaining.`;
    return;
  }
  finishQuiz();
});

async function finishQuiz() {
  quizPanel.classList.add("hidden");
  resultPanel.classList.remove("hidden");
  window.scrollTo({top: 0, behavior: "smooth"});
  const score = answers.reduce((total, answer, index) => total + (answer === QUESTIONS[index].answer ? 1 : 0), 0);
  const percent = Math.round((score / QUESTIONS.length) * 100);
  $("score-value").textContent = `${score}/${QUESTIONS.length}`;
  $("score-percent").textContent = `${percent}%`;
  $("result-title").textContent = score >= 16 ? "Great work!" : score >= 10 ? "Good effort!" : "Keep practising!";
  $("result-summary").textContent = `${student.name}, you answered ${score} out of 20 questions correctly.`;
  renderReview();

  $("send-status").textContent = "Sending your result…";
  $("send-status").className = "send-status";
  try {
    const response = await fetch("/.netlify/functions/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student,
        answers,
        score,
        total: QUESTIONS.length
      })
    });
    if (!response.ok) throw new Error("Submission failed");
    $("send-status").textContent = "Your result has been submitted successfully.";
    $("send-status").style.color = "#16845c";
  } catch (error) {
    $("send-status").textContent = "Your score is shown above, but we couldn't send it. Please contact your instructor.";
    $("send-status").style.color = "#c24f55";
  }
}

function renderReview() {
  const list = $("review-list");
  list.replaceChildren();
  QUESTIONS.forEach((item, index) => {
    const correct = answers[index] === item.answer;
    const card = document.createElement("article");
    card.className = `review-item ${correct ? "correct" : "incorrect"}`;
    const question = document.createElement("p");
    question.className = "review-q";
    question.textContent = `${index + 1}. ${item.question}`;
    const status = document.createElement("p");
    status.className = `review-answer ${correct ? "correct-label" : "incorrect-label"}`;
    status.textContent = correct ? "✓ Correct" : "✕ Incorrect";
    const your = document.createElement("p");
    your.className = "review-answer";
    your.textContent = `Your answer: ${letters[answers[index]]}. ${item.options[answers[index]]}`;
    const answer = document.createElement("p");
    answer.className = "review-answer";
    answer.textContent = `Correct answer: ${letters[item.answer]}. ${item.options[item.answer]}`;
    const explanation = document.createElement("p");
    explanation.className = "review-explanation";
    explanation.textContent = item.explanation;
    card.append(question, status, your, answer, explanation);
    list.append(card);
  });
}

$("restart-btn").addEventListener("click", () => {
  current = 0;
  answers = Array(QUESTIONS.length).fill(null);
  student = null;
  $("student-form").reset();
  resultPanel.classList.add("hidden");
  studentPanel.classList.remove("hidden");
  window.scrollTo({top: 0, behavior: "smooth"});
});
