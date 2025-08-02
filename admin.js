
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyC40ARjwUYMA2WPKxkX9DC81Mmn1AmNwhs",
  authDomain: "zyra-3a549.firebaseapp.com",
  projectId: "zyra-3a549",
  storageBucket: "zyra-3a549.appspot.com",
  messagingSenderId: "748573100132",
  appId: "1:748573100132:web:ae8eeeb02c7c5a2dc27771"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let totalRakhis = 0;
let totalAmount = 0;

// ✅ Load Feedbacks
async function loadFeedbacks() {
  const list = document.getElementById("feedbackResults");
  if (!list) return;

  list.innerHTML = '';
  const snap = await getDocs(collection(db, "feedbacks"));
  snap.forEach(docSnap => {
    const d = docSnap.data();
    const card = document.createElement("div");
    card.className = "card mb-3 p-3 shadow-sm";
    card.innerHTML = `
      <h5><i class="bi bi-person-fill"></i> ${d.name}</h5>
      <p><i class="bi bi-chat-dots"></i> ${d.feedback}</p>
      <p><i class="bi bi-basket"></i> Rakhis: <b>${d.rakhiCount || 0}</b> | ₹<b>${d.amount || 0}</b></p>
    `;
    list.appendChild(card);
    totalRakhis += parseInt(d.rakhiCount || 0);
    totalAmount += parseInt(d.amount || 0);
  });
}

// ✅ Load Spin Results & DELETE OLD ON PAGE LOAD
async function loadSpinResults() {
  const list = document.getElementById("spinResults");
  if (!list) return;

  list.innerHTML = '';

  const spinsRef = collection(db, "spins");
  const spinQuery = query(spinsRef, orderBy("timestamp", "desc"));
  const snap = await getDocs(spinQuery);

  const allSpins = [];
  snap.forEach(docSnap => {
    allSpins.push({ id: docSnap.id, ...docSnap.data() });
  });

  // 🔥 Delete ALL spin entries before loading anything
  for (const spin of allSpins) {
    await deleteDoc(doc(db, "spins", spin.id));
  }

  // ⛔ Optional message shown on clearing
  list.innerHTML = `<div class="text-center text-muted">🧹 All spin entries cleared. Start fresh!</div>`;
}

// ✅ Load Guessing Game Results
async function loadGuessGame() {
  const list = document.getElementById("guessResults");
  if (!list) return;

  list.innerHTML = '';
  const snap = await getDocs(collection(db, "guessGame"));
  snap.forEach(docSnap => {
    const d = docSnap.data();
    const card = document.createElement("div");
    card.className = "card mb-3 p-3 shadow-sm";
    card.innerHTML = `
      <h5><i class="bi bi-person-fill"></i> ${d.name}</h5>
      <p><i class="bi bi-controller"></i> Attempts: ${d.attempts}</p>
      <p><i class="bi bi-award"></i> Guessed: ${d.success ? "✅ Yes" : "❌ No"}</p>
    `;
    list.appendChild(card);
  });
}

// ✅ Load Tap Game Results
async function loadRingToss() {
  const list = document.getElementById("tapResults");
  if (!list) return;

  list.innerHTML = '';
  const snap = await getDocs(collection(db, "tapGame"));
  snap.forEach(docSnap => {
    const d = docSnap.data();
    const card = document.createElement("div");
    card.className = "card mb-3 p-3 shadow-sm";
    card.innerHTML = `
      <h5><i class="bi bi-person-fill"></i> ${d.name}</h5>
      <p><i class="bi bi-trophy"></i> Score: ${d.score}</p>
    `;
    list.appendChild(card);
  });
}

// ✅ Update Total Rakhis and ₹
function updateTotalStatsUI() {
  document.getElementById("totalRakhis").innerText = totalRakhis;
  document.getElementById("totalAmount").innerText = totalAmount;
}

// ✅ Main Admin Init
async function initAdmin() {
  totalRakhis = 0;
  totalAmount = 0;
  await loadFeedbacks();
  await loadSpinResults(); // 🔥 delete old on page load
  await loadGuessGame();
  await loadRingToss();
  updateTotalStatsUI();
}

// ✅ Call it
initAdmin();
