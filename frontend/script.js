// === DATA PERTANYAAN ===
const questions = [
  { text: "Kamu percaya gak, kadang seseorang bisa bikin nyaman cuma lewat cara ngomongnya?", type: "yesno" },
  { text: "Kalau misal aku salah satu dari orang itu, kamu bakal ngasih aku kesempatan?", type: "yesno" },
  { text: "Kalau iya, enaknya pertama kali kita ngelakuin hal seru bareng apa nih?", type: "text" },
  { text: "Kamu ngerasa gak sih, kita bisa jadi duo paling kompak kalo main bareng?", type: "yesno" },
  { text: "Hal kecil dari orang yang kamu suka, yang bisa bikin kamu senyum seharian tuh apa?", type: "text" },
  { text: "Kamu bakal tetep nyautin chat aku terus kan? Jangan ghosting aku yakk 🥹", type: "yesno" },
  { text: "Kamu lebih suka suasana tenang kayak chill di rumah, atau yang rame kayak nongkrong malem-malem?", type: "text" },
  { text: "Kalau aku tiba-tiba ngajak kamu jalan random, kamu mau gak? 😏", type: "yesno" },
  { text: "Satu kata deh, gimana kesan kamu waktu pertama kali liat aku?", type: "text" },
  { text: "Terakhir nih... kamu ngerasa kita cocok gak, jujur aja 😉", type: "yesno" },
];

let currentQuestion = 0;
let answers = [];
let userName = "";
let soundEnabled = true;
let clickCount = 0;
let isAnswerLocked = false; // 🔒 NEW: Lock untuk mencegah double answer

// === MULAI ===
function startQuestions() {
  const input = document.getElementById("nama");
  const name = input.value.trim();

  if (!name) {
    alert("Masukkan nama kamu dulu ya");
    input.focus();
    return;
  }

  userName = name;

  const intro = document.getElementById("intro");
  intro.classList.remove("active");

  setTimeout(() => {
    const quiz = document.getElementById("quiz");
    quiz.classList.add("active");
    currentQuestion = 0;
    answers = [];
    clickCount = 0;
    isAnswerLocked = false; // 🔒 Reset lock
    updateProgress();
    showQuestion();

    const card = document.getElementById("loveCard");
    card.classList.add("flipped");
  }, 500);
}

// === TAMPILKAN PERTANYAAN ===
function showQuestion() {
  const q = questions[currentQuestion];
  document.getElementById("question-text").textContent = q.text;
  document.getElementById("question-number").textContent = currentQuestion + 1;

  const yesNoGroup = document.getElementById("yesno-group");
  const textGroup = document.getElementById("text-group");
  const emoji = document.querySelector(".emoji-reaction");
  const noBtn = document.getElementById("no-btn");
  const questionBox = document.querySelector(".question-box");

  // Reset UI
  yesNoGroup.style.display = "none";
  textGroup.classList.add("hidden");
  emoji.style.opacity = "0";
  hideNoMessage();
  questionBox.classList.remove("show");

  // 🔒 UNLOCK tombol untuk pertanyaan baru
  isAnswerLocked = false;

  // Enable semua tombol
  enableAllButtons();

  // Reset tombol No
  noBtn.classList.remove("wiggle", "run-away", "jumpy-tiny", "spinning-mad", "invisible-tricky");
  noBtn.style.transform = "";
  noBtn.style.opacity = "1";
  noBtn.style.fontSize = "";
  noBtn.style.transition = "";
  noBtn.style.position = "";
  noBtn.style.zIndex = "";
  noBtn.innerHTML = '<span>Enggak 🥲</span>';
  clickCount = 0;

  // Hapus semua efek/clone
  removeAllEffects();

  // Tampilkan sesuai tipe
  if (q.type === "yesno") {
    yesNoGroup.style.display = "flex";
  } else if (q.type === "text") {
    textGroup.classList.remove("hidden");
    const input = document.getElementById("text-answer");
    input.value = "";
    setTimeout(() => input.focus(), 100);
  }

  updateProgress();
}

// === JAWAB "YES" ===
function answerYes() {
  // 🔒 CEK LOCK - jika sudah dijawab, jangan proses lagi
  if (isAnswerLocked || questions[currentQuestion].type !== "yesno") return;

  // 🔒 LOCK jawaban
  isAnswerLocked = true;
  disableAllButtons();

  answers.push("Yes");

  showReaction("😋");
  playSound("pop");
  miniConfetti();

  setTimeout(() => {
    nextQuestion();
  }, 1800);
}

function answerNo() {
  // 🔒 CEK LOCK - jika sudah dijawab, jangan proses lagi
  if (isAnswerLocked || questions[currentQuestion].type !== "yesno") return;

  clickCount++;
  playSound("no");

  const noBtn = document.getElementById("no-btn");

  if (clickCount === 1) {
    answers.push("No");
  }

  switch (clickCount) {
    case 1:
      answers[answers.length - 1] = "Yes 1";
      showReaction("😢");
      showNoMessage("Yah, jangan gitu dong sayanggg! Coba lagi yuk 🥺");
      noBtn.classList.add("wiggle");
      setTimeout(() => noBtn.classList.remove("wiggle"), 600);
      break;

    case 2:
      answers[answers.length - 1] = "yes 2";
      showReaction("🏃‍♂️");
      showNoMessage("Waduh, tombolnya lari nih! Coba kejar dong!");
      noBtn.classList.add("run-away");
      noBtn.innerHTML = '<span>Lari ah! 🏃‍♂️</span>';
      break;

    case 3:
      answers[answers.length - 1] = "yes 3 (jadi kecil)";
      showReaction("🔍");
      showNoMessage("Loh, tombolnya jadi kecil dan lompat-lompat! Susah nih!");
      noBtn.classList.add("jumpy-tiny");
      noBtn.innerHTML = '<span>Kecil! 🐭</span>';
      break;

    case 4:
      answers[answers.length - 1] = "yes 4(ada banyak)";
      showReaction("😵");
      showNoMessage("Aduh, tombolnya jadi banyak! Mana yang beneran?");
      createNoButtonClones(5);
      noBtn.style.opacity = "0";
      break;

    case 5:
      answers[answers.length - 1] = "yes 5 (muter-muter)";
      showReaction("🎡");
      showNoMessage("Gilak, tombolnya muter kayak bianglala! Pusing ga?");
      noBtn.style.opacity = "1";
      removeNoClones();
      noBtn.classList.add("spinning-mad");
      noBtn.innerHTML = '<span>Muter! 🎠</span>';
      break;

    case 6:
      answers[answers.length - 1] = "No (pecah berkeping)";
      showReaction("🧩");
      showNoMessage("Wih, tombolnya pecah! Coba susun lagi!");

      // Sembunyikan tombol asli dan buat puzzle
      noBtn.style.display = "none";
      noBtn.style.pointerEvents = "none";
      createNoPuzzle();
      break;

    case 7:
      answers[answers.length - 1] = "No (invisible mode)";
      showReaction("👻");
      showNoMessage("Tombolnya ilang! Tapi masih ada di sekitar sini...");

      // Pastikan hapus efek sebelumnya
      removeNoPuzzle();
      removeNoClones();
      removeMirrorButtons();

      // Reset dan setup untuk efek invisible
      noBtn.style.display = "block";
      noBtn.style.opacity = "1"; // Pastikan visible dulu
      noBtn.style.pointerEvents = "auto"; // Pastikan bisa diklik
      noBtn.style.position = "relative"; // Reset position
      noBtn.style.transform = ""; // Reset transform

      // Hapus semua class sebelumnya dan tambah class baru
      noBtn.className = "no btn-3d invisible-tricky";
      noBtn.innerHTML = '<span>👻</span>';

      // Start the invisible effect
      startInvisibleEffect(noBtn);
      break;

    case 8:
      answers[answers.length - 1] = "yes 8 (tukar posisi)";
      showReaction("🔄");
      showNoMessage("Awas, tombolnya tukar posisi! Jangan sampai salah klik!");
      swapYesNoPositions();
      break;

    case 9:
      answers[answers.length - 1] = "yes Kepaksa (mirror effect)";
      showReaction("🪞");
      showNoMessage("Sekarang ada yang asli dan palsu! Cari yang bener!");
      createMirrorNoButtons();
      break;

    default:
      // 🔒 LOCK jawaban dan paksa YES
      isAnswerLocked = true;
      disableAllButtons();

      const forcedMessages = [
        "OKEEEE! Kamu menang! Tapi jawabannya tetep IYA! 🏆",
        "UDAAAH! Capek ngejar tombol! Auto YES! 🤖",
        "GAME OVER! Jawabannya... IYA! Skill kamu mantep! 🎮",
        "SELESAI! Tombol No nya udah menyerah! YES! 🏳️"
      ];
      const randomMsg = forcedMessages[Math.floor(Math.random() * forcedMessages.length)];

      answers[answers.length - 1] = "Yes (akhirnya menyerah juga 😂)";
      showReaction("🎉");
      showNoMessage(randomMsg);
      playSound("pop");
      miniConfetti();

      resetNoButton();
      removeAllEffects();

      setTimeout(() => {
        hideNoMessage();
        nextQuestion();
      }, 2500);
  }
}


// ===== FUNGSI-FUNGSI EFFECT BARU =====
// ===== FUNGSI EFFECT INVISIBLE =====
let invisibleInterval;

function startInvisibleEffect(button) {
  let isVisible = true;

  invisibleInterval = setInterval(() => {
    if (isVisible) {
      // Mode invisible - hampir tidak terlihat tapi masih bisa diklik
      button.style.opacity = "0.1";
      button.style.pointerEvents = "auto"; // MASIH BISA DIKLIK
    } else {
      // Mode visible - muncul sebentar
      button.style.opacity = "0.9";
      button.style.pointerEvents = "auto"; // MASIH BISA DIKLIK
    }
    isVisible = !isVisible;
  }, 800); // Ganti setiap 800ms
}

function stopInvisibleEffect() {
  if (invisibleInterval) {
    clearInterval(invisibleInterval);
  }
}
// Effect 1: Tombol lari lebih ekstrim
function createRunAwayEffect() {
  const noBtn = document.getElementById("no-btn");
  noBtn.style.transition = "all 0.8s ease";

  setInterval(() => {
    const x = Math.random() * 300 - 150;
    const y = Math.random() * 200 - 100;
    noBtn.style.transform = `translate(${x}px, ${y}px)`;
  }, 800);
}

// Effect 2: Tombol kecil dan lompat-lompat
function createJumpyTinyEffect() {
  const noBtn = document.getElementById("no-btn");
  noBtn.style.transform = "scale(0.4)";
  noBtn.style.transition = "all 0.3s ease";

  setInterval(() => {
    const x = Math.random() * 200 - 100;
    const y = Math.random() * 150 - 75;
    noBtn.style.transform = `translate(${x}px, ${y}px) scale(0.4)`;
  }, 500);
}

// Effect 3: Clone tombol jadi banyak
function createNoButtonClones(count) {
  const originalBtn = document.getElementById("no-btn");
  const btnGroup = document.getElementById("yesno-group");

  // Hapus clone sebelumnya jika ada
  removeNoClones();

  // Tentukan clone mana yang asli (random)
  const realCloneIndex = Math.floor(Math.random() * count);

  for (let i = 0; i < count; i++) {
    const clone = originalBtn.cloneNode(true);
    clone.id = `no-clone-${i}`;
    clone.style.position = "absolute";
    clone.style.left = `${Math.random() * 60 + 20}%`;
    clone.style.top = `${Math.random() * 40 + 30}%`;
    clone.style.transform = `scale(${Math.random() * 0.6 + 0.4})`;
    clone.style.zIndex = "1000";
    clone.style.opacity = "1";
    clone.style.pointerEvents = "auto";
    clone.style.display = "block";

    // Hapus semua class yang tidak perlu
    clone.className = "no btn-3d";

    // Clone yang asli
    if (i === realCloneIndex) {
      clone.onclick = function () {
        // Clone yang asli akan melanjutkan ke case berikutnya
        removeNoClones(); // Hapus semua clone
        answerNo(); // Panggil answerNo lagi untuk lanjut ke case 5
      };
      clone.innerHTML = '<span>Yang Beneran! 🎯</span>';
      clone.style.background = "linear-gradient(135deg, var(--love), var(--cute))";
      clone.style.color = "white";
    } else {
      // Clone palsu
      clone.onclick = function () {
        showNoMessage("Bukan ini yang bener! Cari lagi! ❌");
        playSound("no");
        this.style.background = "#ffcccc";
        this.style.transform += " rotate(180deg)";
        setTimeout(() => {
          if (this.parentNode) {
            this.style.opacity = "0";
            setTimeout(() => {
              if (this.parentNode) {
                this.parentNode.removeChild(this);
              }
            }, 300);
          }
        }, 500);
      };
      clone.innerHTML = '<span>Palsu! 🤥</span>';
    }

    btnGroup.appendChild(clone);
  }
}

// Effect 4: Tombol berputar gila
function createSpinningMadEffect() {
  const noBtn = document.getElementById("no-btn");
  let rotation = 0;

  const spinInterval = setInterval(() => {
    rotation += 30;
    const x = Math.sin(rotation * Math.PI / 180) * 100;
    const y = Math.cos(rotation * Math.PI / 180) * 50;
    noBtn.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(0.7)`;
  }, 100);

  // Simpan interval ID untuk nanti di-clear
  noBtn.setAttribute('data-spin-interval', spinInterval);
}

// Effect 5: Tombol pecah jadi puzzle
function createNoPuzzle() {
  const originalBtn = document.getElementById("no-btn");
  const btnGroup = document.getElementById("yesno-group");

  // Hapus puzzle sebelumnya jika ada
  removeNoPuzzle();

  const pieces = 4;
  // Tentukan piece mana yang asli (random)
  const realPieceIndex = Math.floor(Math.random() * pieces);

  for (let i = 0; i < pieces; i++) {
    const piece = document.createElement('button');
    piece.className = "no btn-3d";
    piece.id = `no-puzzle-${i}`;
    piece.innerHTML = '<span>🧩</span>';
    piece.style.position = "absolute";
    piece.style.width = "80px";
    piece.style.height = "50px";
    piece.style.left = `${Math.random() * 60 + 20}%`;
    piece.style.top = `${Math.random() * 40 + 30}%`;
    piece.style.zIndex = "1000";
    piece.style.opacity = "1";
    piece.style.pointerEvents = "auto";
    piece.style.display = "block";
    piece.style.fontSize = "0.8rem";

    // Piece yang asli
    if (i === realPieceIndex) {
      piece.onclick = function () {
        // Piece yang asli akan melanjutkan ke case berikutnya
        removeNoPuzzle();
        answerNo(); // Panggil answerNo lagi untuk lanjut ke case 7
      };
      piece.style.background = "linear-gradient(135deg, var(--love), var(--cute))";
      piece.style.color = "white";
    } else {
      // Piece palsu
      piece.onclick = function () {
        showNoMessage("Salah piece! Cari yang lain! 🔍");
        playSound("no");
        this.style.background = "#ffcccc";
        this.style.transform += " rotate(180deg)";
        setTimeout(() => {
          if (this.parentNode) {
            this.style.opacity = "0";
            setTimeout(() => {
              if (this.parentNode) {
                this.parentNode.removeChild(this);
              }
            }, 300);
          }
        }, 500);
      };
      piece.style.background = "#fff9fc";
      piece.style.color = "var(--love)";
      piece.style.border = "2px solid #ffe6f2";
    }

    btnGroup.appendChild(piece);
  }
}
// Effect 6: Tombol invisible yang tricky
function createInvisibleTrickyEffect() {
  const noBtn = document.getElementById("no-btn");
  noBtn.style.opacity = "0.1";
  noBtn.style.transition = "opacity 0.5s ease";

  // Kadang muncul sebentar
  setInterval(() => {
    noBtn.style.opacity = Math.random() > 0.7 ? "0.8" : "0.1";
  }, 800);
}

// Effect 7: Tukar posisi Yes dan No
function swapYesNoPositions() {
  const yesBtn = document.querySelector('.yes');
  const noBtn = document.getElementById("no-btn");
  const btnGroup = document.getElementById("yesno-group");

  btnGroup.style.flexDirection = "row-reverse";

  // Kembalikan setelah beberapa saat
  setTimeout(() => {
    btnGroup.style.flexDirection = "";
  }, 3000);
}

// Effect 8: Mirror effect - tombol asli dan palsu
function createMirrorNoButtons() {
  const originalBtn = document.getElementById("no-btn");
  const btnGroup = document.getElementById("yesno-group");

  // Buat 3 mirror
  for (let i = 0; i < 3; i++) {
    const mirror = originalBtn.cloneNode(true);
    mirror.id = `no-mirror-${i}`;
    mirror.style.position = "absolute";
    mirror.style.left = `${Math.random() * 60 + 20}%`;
    mirror.style.top = `${Math.random() * 40 + 30}%`;
    mirror.style.transform = `scale(${Math.random() * 0.6 + 0.7})`;
    mirror.style.zIndex = "1000";
    mirror.innerHTML = '<span>Enggak 🥲</span>';

    // Semua mirror palsu
    mirror.onclick = function () {
      showNoMessage("Ini palsu! Cari yang asli! 👀");
      playSound("no");
      this.style.background = "#ffcccc";
      setTimeout(() => {
        this.style.background = "";
      }, 500);
    };

    btnGroup.appendChild(mirror);
  }
}

// Fungsi reset
// ===== PERBAIKAN FUNGSI RESET =====
function resetNoButton() {
  const noBtn = document.getElementById("no-btn");

  // Hentikan semua efek
  stopInvisibleEffect();
  stopJumpingEffect();

  // Reset semua style
  noBtn.style.cssText = '';
  noBtn.className = "no btn-3d";
  noBtn.innerHTML = '<span>Enggak 🥲</span>';
  noBtn.style.display = "block";
  noBtn.style.opacity = "1";
  noBtn.style.pointerEvents = "auto";
  noBtn.style.position = "";
  noBtn.style.left = "";
  noBtn.style.top = "";
  noBtn.style.transform = "";
  noBtn.style.cursor = "pointer";

  // Hapus semua efek tambahan
  removeNoPuzzle();
  removeNoClones();
  removeMirrorButtons();
}

function removeNoPuzzle() {
  document.querySelectorAll('[id^="no-puzzle-"]').forEach(el => {
    el.remove();
  });
}
function removeNoClones() {
  document.querySelectorAll('[id^="no-clone-"]').forEach(el => el.remove());
}



function removeMirrorButtons() {
  document.querySelectorAll('[id^="no-mirror-"]').forEach(el => el.remove());
}

function removeAllEffects() {
  removeNoClones();
  removeNoPuzzle();
  removeMirrorButtons();
  const btnGroup = document.getElementById("yesno-group");
  btnGroup.style.flexDirection = "";
}
// === TEXT ANSWER ===
// === TEXT ANSWER ===
function submitTextAnswer() {
  // 🔒 CEK LOCK - jika sudah dijawab, jangan proses lagi
  if (isAnswerLocked || questions[currentQuestion].type !== "text") return;
  const text = document.getElementById("text-answer").value.trim();
  if (!text) return alert("Isi dulu jawabannya ya");

  // 🔒 LOCK jawaban
  isAnswerLocked = true;
  disableAllButtons();

  answers.push(text);

  showReaction("🤩");
  playSound("pop");
  miniConfetti();

  setTimeout(() => {
    nextQuestion();
  }, 1800);
}
function disableAllButtons() {
  const yesBtn = document.querySelector('.yes');
  const noBtn = document.getElementById('no-btn');
  const yesNoGroup = document.getElementById('yesno-group');
  const textGroup = document.getElementById('text-group');
  const textInput = document.getElementById('text-answer');
  const textButton = document.querySelector('.btn-next');

  // Non-aktifkan Yes/No buttons
  if (yesNoGroup) {
    yesNoGroup.style.pointerEvents = 'none';
    yesNoGroup.style.opacity = '0.6';
  }

  // Non-aktifkan Text input
  if (textGroup) {
    textGroup.style.pointerEvents = 'none';
    textGroup.style.opacity = '0.6';
    if (textInput) textInput.disabled = true;
    if (textButton) textButton.disabled = true;
  }
}

function enableAllButtons() {
  const yesBtn = document.querySelector('.yes');
  const noBtn = document.getElementById('no-btn');
  const yesNoGroup = document.getElementById('yesno-group');
  const textGroup = document.getElementById('text-group');
  const textInput = document.getElementById('text-answer');
  const textButton = document.querySelector('.btn-next');

  // Aktifkan Yes/No buttons
  if (yesNoGroup) {
    yesNoGroup.style.pointerEvents = 'auto';
    yesNoGroup.style.opacity = '1';
  }

  // Aktifkan Text input
  if (textGroup) {
    textGroup.style.pointerEvents = 'auto';
    textGroup.style.opacity = '1';
    if (textInput) textInput.disabled = false;
    if (textButton) textButton.disabled = false;
  }
}

// === LANJUT KE PERTANYAAN BERIKUTNYA (DIPERBAIKI) ===
// === LANJUT KE PERTANYAAN BERIKUTNYA ===
function nextQuestion() {
  hideNoMessage();

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    updateProgress();

    const card = document.getElementById("loveCard");
    const questionBox = document.querySelector(".question-box");

    questionBox.classList.remove("show");

    setTimeout(() => {
      card.classList.add("flipping");

      setTimeout(() => {
        showQuestion();
        card.classList.remove("flipping");

        void card.offsetWidth;

        setTimeout(() => {
          questionBox.classList.add("show");
        }, 50);

      }, 1400);

    }, 400);

  } else {
    setTimeout(() => {
      goToFinal();
    }, 600);
  }
}

function goToFinal() {
  // Sembunyikan quiz
  document.getElementById("quiz").classList.remove("active");

  // Reset card rotation
  const card = document.getElementById("loveCard");
  card.classList.remove("flipped", "flipping");

  // Tampilkan final setelah delay kecil
  setTimeout(() => {
    const final = document.getElementById("final");
    final.classList.add("active");

    // Isi data final
    document.getElementById("finalName").textContent = userName;
    showConfetti();
    playSound("love");
    submitAnswers();
  }, 300);
}

// === EFEK ===
function showReaction(e) {
  const el = document.querySelector(".emoji-reaction");
  el.textContent = e;
  el.style.opacity = "1";
  el.style.transform = "scale(1.6)";
  setTimeout(() => el.style.transform = "scale(1)", 300);
}

function showNoMessage(t) {
  const m = document.getElementById("no-message");
  m.querySelector("p").textContent = t;
  m.classList.remove("hidden");
  requestAnimationFrame(() => m.classList.add("show"));
}

function hideNoMessage() {
  const m = document.getElementById("no-message");
  if (m) {
    m.classList.remove("show");
    setTimeout(() => m.classList.add("hidden"), 600);
  }
}

function miniConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#ff6b9d', '#ffb6c1']
  });
}

function showConfetti() {
  confetti({
    particleCount: 200,
    spread: 100,
    origin: { y: 0.6 },
    colors: ['#ff6b9d', '#ffb6c1', '#a2d2ff', '#ff8aab']
  });
}

function updateProgress() {
  const p = ((currentQuestion + 1) / questions.length) * 100;
  document.querySelector(".progress-fill").style.width = p + "%";
}

// === RESTART FUNCTION (DIPERBAIKI) ===
function restart() {
  currentQuestion = 0;
  answers = [];
  clickCount = 0;

  // Sembunyikan final
  document.getElementById("final").classList.remove("active");

  // Reset card rotation
  const card = document.getElementById("loveCard");
  card.classList.remove("flipped", "flipping");

  // Tampilkan intro
  setTimeout(() => {
    document.getElementById("intro").classList.add("active");
    document.getElementById("nama").value = "";
    document.getElementById("nama").focus();
  }, 300);
}
function playSound(type) {
  if (!soundEnabled) return;
  const sound = document.getElementById(
    type === "pop" ? "popSound" :
      type === "no" ? "noSound" : "loveSound"
  );
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(() => { });
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById("soundBtn");
  if (btn) btn.textContent = soundEnabled ? "Sound on" : "Sound off";
}

async function submitAnswers() {
  try {
    // Pastikan db tersedia
    if (!window.db) {
      console.warn("Firebase belum terinisialisasi, melewatkan penyimpanan data");
      return;
    }

    // Calculate score based on answers
    let score = 0;
    answers.forEach(answer => {
      if (typeof answer === 'string' && answer.toLowerCase().includes('yes')) {
        score += 10;
      } else if (answer && answer.trim() !== '') {
        score += 5;
      }
    });

    // Save to Firestore menggunakan Firebase v8 syntax
    await window.db.collection("quizResults").add({
      name: userName,
      answers: answers,
      score: score,
      totalQuestions: questions.length,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    console.log("✅ Data tersimpan ke Firestore!");
  } catch (err) {
    console.error("❌ Error saat menyimpan:", err);
    // Optional: Tampilkan pesan error yang lebih informatif
    if (err.code === 'permission-denied') {
      console.warn("Izin ditolak. Pastikan Firestore rules sudah dikonfigurasi.");
    }
  }
}



