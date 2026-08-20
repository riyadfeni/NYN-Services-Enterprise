import { ref, runTransaction } from 'firebase/database';
import { db } from '../services/firebase';

/**
 * Atomically generates the next CN number for the given year using a
 * Firebase Realtime Database transaction on /counters/{year}. This
 * guarantees no two jobs ever get the same number, even if two people
 * (or two tabs) save at the exact same moment.
 *
 * Format: CN-YYYY-XXXXX  (e.g. CN-2026-00127)
 */
export async function generateCNNumber(year = new Date().getFullYear()) {
  const counterRef = ref(db, `counters/${year}`);

  const result = await runTransaction(counterRef, (currentValue) => {
    return (currentValue || 0) + 1;
  });

  if (!result.committed) {
    throw new Error('Could not generate a CN number. Please try again.');
  }

  const nextNumber = result.snapshot.val();
  const padded = String(nextNumber).padStart(5, '0');
  return `CN-${year}-${padded}`;
}
