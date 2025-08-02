
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

async function initAdmin() {
  totalRakhis = 0;
  totalAmount = 0;
  await deleteAllSpinResultsBeforeLoad();
  await loadFeedbacks();
  await loadSpinResults();
  await loadGuessGame();
  await loadRingToss();
  updateTotalStatsUI();
}

async function deleteAllSpinResultsBeforeLoad() {
  const spinsRef = collection(db, "spins");
  const snap = await getDocs(spinsRef);
  for (const docSnap of snap.docs) {
    await deleteDoc(doc(db, "spins", docSnap.id));
  }
  console.log("🔥 All spin results deleted at load.");
}

async function loadFeedbacks() {
  const list = document.getElementById("feedbackList");
  if (!list) return;
  list.innerHTML = '';
  const snap = await getDocs(collection(db, "feedback"));
  snap.forEach(docSnap => {
    const d = docSnap.data();
    if (!d.name) return;
    const card = document.createElement("div");
    card.className = "card mb-3 p-3 shadow-sm";
    card.innerHTML = `
      <h5><i class="bi bi-person-fill"></i> ${d.name}</h5>
      <p><i class="bi bi-chat-left-text-fill"></i> ${d.feedback}</p>
      <p><i class="bi bi-basket"></i> Rakhis: ${d.rakhiCount || 0} | ₹${d.amount || 0}</p>
      <p><i class="bi bi-camera"></i> ${d.selfie ? `<a href="${d.selfie}" target="_blank">View Selfie</a>` : 'No selfie'}</p>
      <button class="btn btn-sm btn-danger mt-2" onclick="deleteFeedback('${docSnap.id}')">
        <i class="bi bi-trash3-fill"></i> Delete
      </button>
    `;
    list.appendChild(card);
  });
}

async function deleteFeedback(id) {
  await deleteDoc(doc(db, "feedback", id));
  initAdmin();
}

async function loadSpinResults() {
  const list = document.getElementById("spinResults");
  if (!list) return;
  list.innerHTML = '';
  const spinsRef = collection(db, "spins");
  const spinQuery = query(spinsRef, orderBy("timestamp", "desc"));
  const snap = await getDocs(spinQuery);
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
      <button class="btn btn-sm btn-danger mt-2" onclick="deleteSpin('${docSnap.id}')">
        <i class="bi bi-trash3-fill"></i> Delete
      </button>
    `;
    list.appendChild(card);
  });
}

async function deleteSpin(id) {
  await deleteDoc(doc(db, "spins", id));
  initAdmin();
}

async function loadGuessGame() {
  const list = document.getElementById("guessResults");
  if (!list) return;
  list.innerHTML = '';
  const snap = await getDocs(collection(db, "guessGame"));
  snap.forEach(docSnap => {
    const d = docSnap.data();
    if (!d.name) return;
    const card = document.createElement("div");
    card.className = "card mb-3 p-3 shadow-sm";
    card.innerHTML = `
      <h5><i class="bi bi-controller"></i> ${d.name}</h5>
      <p><i class="bi bi-lightbulb-fill"></i> Guesses: ${d.guesses?.join(', ')}</p>
      <button class="btn btn-sm btn-danger mt-2" onclick="deleteGuess('${docSnap.id}')">
        <i class="bi bi-trash3-fill"></i> Delete
      </button>
    `;
    list.appendChild(card);
  });
}

async function deleteGuess(id) {
  await deleteDoc(doc(db, "guessGame", id));
  initAdmin();
}

async function loadRingToss() {
  const list = document.getElementById("ringResults");
  if (!list) return;
  list.innerHTML = '';
  const snap = await getDocs(collection(db, "tapGame"));
  snap.forEach(docSnap => {
    const d = docSnap.data();
    if (!d.name) return;
    const card = document.createElement("div");
    card.className = "card mb-3 p-3 shadow-sm";
    card.innerHTML = `
      <h5><i class="bi bi-controller"></i> ${d.name}</h5>
      <p><i class="bi bi-speedometer"></i> Score: ${d.score || 0}</p>
      <button class="btn btn-sm btn-danger mt-2" onclick="deleteTap('${docSnap.id}')">
        <i class="bi bi-trash3-fill"></i> Delete
      </button>
    `;
    list.appendChild(card);
  });
}

async function deleteTap(id) {
  await deleteDoc(doc(db, "tapGame", id));
  initAdmin();
}

function updateTotalStatsUI() {
  const rakhiBox = document.getElementById("totalRakhis");
  const amountBox = document.getElementById("totalAmount");
  if (rakhiBox) rakhiBox.textContent = totalRakhis;
  if (amountBox) amountBox.textContent = `₹${totalAmount}`;
}

// ✅ Start Admin Logic
initAdmin();

// Expose for delete buttons
window.deleteFeedback = deleteFeedback;
window.deleteSpin = deleteSpin;
window.deleteGuess = deleteGuess;
window.deleteTap = deleteTap;
