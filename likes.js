import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  documentId,
  getDocs,
  query,
  runTransaction,
  where
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const COLLECTION_NAME = "curtidas";
const MAX_QUERY_SIZE = 30;

export function createLikesClient(firebaseConfig) {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  async function fetchCounts(videoIds) {
    const ids = [...new Set(videoIds.filter(Boolean))];
    const counts = {};
    if (!ids.length) return counts;

    for (let index = 0; index < ids.length; index += MAX_QUERY_SIZE) {
      const chunk = ids.slice(index, index + MAX_QUERY_SIZE);
      const likesQuery = query(collection(db, COLLECTION_NAME), where(documentId(), "in", chunk));
      const snapshot = await getDocs(likesQuery);
      snapshot.forEach((likeDoc) => {
        counts[likeDoc.id] = Number(likeDoc.data().count) || 0;
      });
    }

    return counts;
  }

  async function setLike(videoId, delta) {
    const likeRef = doc(db, COLLECTION_NAME, videoId);

    return runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(likeRef);
      const current = snapshot.exists() ? Number(snapshot.data().count) || 0 : 0;
      const next = Math.max(0, current + delta);

      if (next === current) return next;

      transaction.set(likeRef, { count: next }, { merge: true });
      return next;
    });
  }

  return { fetchCounts, setLike };
}
