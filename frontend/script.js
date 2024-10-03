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
  document.getElementById("questions").style.display = "block";
  document.getElementById("que").style.display = "none";
  askQuestion();
}

function askQuestion() {
  document.getElementById("question-text").innerText = questions[currentQuestion];
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
function playSound() {
  const audio = new Audio('sound.mp4'); // Path to your audio file
  audio.play();
}

function startCountdown() {
  let countdown = 3; // Waktu countdown dalam detik
  const countdownText = document.getElementById("countdown-text");
  const scaryImage = document.getElementById("scary-image");
  const scaryImageUrl = "apacoba.jpg"; // Path ke gambar menyeramkan

  document.getElementById("countdown-container").style.display = "block";

  countdownText.innerText = `Countdown: ${countdown}`;
  const intervalId = setInterval(() => {
    countdown--; // Kurangi countdown setiap detik
    countdownText.innerText = `Countdown: ${countdown}`;
    if (countdown === 0) {
      clearInterval(intervalId); // Hentikan interval ketika countdown mencapai nol
      showScaryImage(scaryImage, scaryImageUrl);
    }
  }, 1000); // 1000ms = 1 detik
}

function showScaryImage(scaryImage, scaryImageUrl) {
  scaryImage.src = scaryImageUrl;
  scaryImage.style.display = "block";
}
function showFinalMessage() {
  document.getElementById("questions").style.display = "none";
  document.getElementById("message").style.display = "block";
  document.getElementById("messageText").innerText =
  "ikan hiu makan tomat, thank you very much :V";
// startCountdown();
playSound();
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
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then((data) => {
    console.log("Success:", data);
    alert("Tenkyu bang");
  })
  .catch((error) => {
    console.error("Error:", error);
    alert("There was a problem submitting your answers. Please try again.");
  });
}

function showConfetti() {
const confettiSettings = { target: "confetti-canvas" };
const confetti = new ConfettiGenerator(confettiSettings);
confetti.render();
}