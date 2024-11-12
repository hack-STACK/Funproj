// List of questions for the quiz
const questions = [
"Kalau aku tiba-tiba berubah jadi karakter kartun favorit kamu, bakal tetap mau jalan bareng nggak?",
"Menurutmu, aku lebih lucu dari meme favorit kamu, nggak?",
"Kalau aku tantang kamu untuk maraton nonton film rom-com seharian, kamu sanggup nggak?",
"Kalau tiba-tiba aku jadi super jenius tapi tingkahku jadi aneh, kamu bakal tahan?",
"Kalau bisa baca pikiran, mau nggak kamu tahu apa yang aku pikirkan sekarang?",
];

let currentQuestion = 0;
let answers = [];

function startQuestions() {
  const namaInput = document.getElementById("nama");
  const nama = namaInput.value;
  if (!nama) {
    alert("Silakan masukkan nama Anda terlebih dahulu.");
    return;
  }
  // Sembunyikan input nama dan tombol setelah nama dimasukkan
  namaInput.style.display = "none";
  document.getElementById("que").style.display = "none";
  
  // Tampilkan pertanyaan
  document.getElementById("questions").style.display = "block";
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
  const nama = document.getElementById("nama").value;
  fetch("https://askherserver1.vercel.app/submit", {
    // Replace with your actual server endpoint
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: nama,
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
