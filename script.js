// List of questions for the quiz
const questions = [
  "Kamu percaya cinta bisa datang dalam sekejap?",
  "Kamu mau jadi pasangan aku yang paling cocok?",
  "Kamu bakal bilang iya kalau aku ajak kamu jalan-jalan?",
  "Kamu pikir kita jadi tim yang paling hebat?",
  "Kalau aku jadi bug, kamu mau bantu aku cari solusi?",
  "Kamu yang bisa membuat hidup aku jadi lebih berwarna?",
  "Kamu janji tidak akan membuat aku jadi bingung?",
];

let currentQuestion = 0;
let answers = [];

function startQuestions() {
  console.log("startQuestions called"); // Debugging line
  document.getElementById("questions").style.display = "block";
  document.getElementById("que").style.display = "none";
  askQuestion();
}

function askQuestion() {
  document.getElementById("question-text").innerText =
    questions[currentQuestion];
  document.getElementById("question-number").innerText = currentQuestion + 1;
}

function answerYes() {
  answers.push("Yes");
  nextQuestionOrSubmit();
}

function answerNo() {
  answers.push("No");
  nextQuestionOrSubmit();
}

function nextQuestionOrSubmit() {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    askQuestion();
  } else {
    showFinalMessage();
  }
}

function showFinalMessage() {
  document.getElementById("questions").style.display = "none";
  document.getElementById("message").style.display = "block";
  document.getElementById("messageText").innerText =
    "Thank you for answering all the questions!";
  submitAnswers(); // Send the answers to the server
  showConfetti();
}

function submitAnswers() {
  fetch("http://localhost:3000/submit", {
    // Replace with your actual server endpoint
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: "Zendria",
      answers: answers,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data); // Debugging line
    })
    .catch((error) => {
      console.error("Error:", error); // Debugging line
    });
}

function showConfetti() {
  const confettiSettings = { target: "confetti-canvas" };
  const confetti = new ConfettiGenerator(confettiSettings);
  confetti.render();
}
