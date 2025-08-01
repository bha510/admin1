import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔧 Firebase Config
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
  const list = document.getElementById("feedbackList");
  const counter = document.getElementById("totalFeedbacks");
  if (!list || !counter) return;

  list.innerHTML = '';
  const snap = await getDocs(collection(db, "feedback"));
  let count = 0;

  snap.forEach(docSnap => {
    const d = docSnap.data();
    if (!d.name || !d.feedback) return;

    const rakhi = parseInt(d.rakhis || 0);
    const amount = parseInt(d.amount || 0);
    totalRakhis += rakhi;
    totalAmount += amount;

    const card = document.createElement("div");
    card.className = "card mb-3 p-3 shadow-sm";
    card.innerHTML = `
      <h5><i class="bi bi-person-circle"></i> ${d.name}</h5>
      <p><i class="bi bi-chat-dots"></i> ${d.feedback}</p>
      <p><i class="bi bi-basket"></i> Rakhis: <b>${rakhi}</b> | ₹<b>${amount}</b></p>
      ${d.selfie ? `<img src="${d.selfie}" class="img-fluid rounded mb-2" style="max-height: 150px;">` : ""}
      <button class="btn btn-sm btn-danger" onclick="deleteFeedback('${docSnap.id}', ${rakhi}, ${amount})">
        <i class="bi bi-trash3"></i> Delete
      </button>
    `;
    list.appendChild(card);
    count++;
  });

  counter.innerText = count;
}

// ✅ DELETE Feedback
window.deleteFeedback = async function (id, rakhi, amount) {
  try {
    const ref = doc(db, "feedback", id);
    await deleteDoc(ref);

    totalRakhis -= rakhi;
    totalAmount -= amount;

    await initAdmin(); // Reload everything
  } catch (e) {
    alert("Error deleting: " + e.message);
  }
};

// ✅ Load Spins
async function loadSpinResults() {
  const list = document.getElementById("spinResults");
  if (!list) return;

  list.innerHTML = '';
  const snap = await getDocs(collection(db, "spins"));

  snap.forEach(docSnap => {
    const d = docSnap.data();
    if (!d.name || !d.result) return;

    const rakhi = parseInt(d.rakhiCount || 0);
    const amount = parseInt(d.amount || 0);
    totalRakhis += rakhi;
    totalAmount += amount;

    const card = document.createElement("div");
    card.className = "card mb-3 p-3 shadow-sm";
    card.innerHTML = `
      <h5><i class="bi bi-person-fill"></i> ${d.name}</h5>
      <p><i class="bi bi-arrow-repeat"></i> Result: ${d.result}</p>
      <p><i class="bi bi-basket"></i> Rakhis: <b>${rakhi}</b> | ₹<b>${amount}</b></p>
    `;
    list.appendChild(card);
  });
}

// ✅ Load Guess Game
async function loadGuessGame() {
  const list = document.getElementById("guessResults");
  if (!list) return;

  list.innerHTML = '';
  const snap = await getDocs(collection(db, "guessGame"));

  snap.forEach(docSnap => {
    const d = docSnap.data();
    if (!d.name) return;

    const status = d.success ? "✔️ Correct" : "❌ Failed";

    const card = document.createElement("div");
    card.className = "card mb-3 p-3 shadow-sm";
    card.innerHTML = `
      <h5><i class="bi bi-controller"></i> ${d.name}</h5>
      <p><i class="bi bi-check-circle"></i> ${status}</p>
    `;
    list.appendChild(card);
  });
}

// ✅ Load Ring Toss
async function loadRingToss() {
  const list = document.getElementById("ringResults");
  if (!list) return;

  list.innerHTML = '';
  const snap = await getDocs(collection(db, "ringTossGame"));

  snap.forEach(docSnap => {
    const d = docSnap.data();
    if (!d.name) return;

    const card = document.createElement("div");
    card.className = "card mb-3 p-3 shadow-sm";
    card.innerHTML = `
      <h5><i class="bi bi-person-badge"></i> ${d.name}</h5>
      <p><i class="bi bi-trophy"></i> Score: ${d.score}</p>
    `;
    list.appendChild(card);
  });
}

// ✅ Update UI Totals
function updateTotalStatsUI() {
  const r = document.getElementById("totalRakhis");
  const m = document.getElementById("totalMoney");
  if (r) r.innerText = totalRakhis;
  if (m) m.innerText = totalAmount;
}

// ✅ Main Admin Init
async function initAdmin() {
  totalRakhis = 0;
  totalAmount = 0;
  await loadFeedbacks();
  await loadSpinResults();
  await loadGuessGame();
  await loadRingToss();
  updateTotalStatsUI();
}

initAdmin();






