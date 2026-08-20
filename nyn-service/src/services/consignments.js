import {
  ref,
  push,
  set,
  update,
  get,
  query,
  orderByChild,
  equalTo,
  limitToLast,
  startAt,
  endAt,
} from 'firebase/database';
import { db } from './firebase';
import { generateCNNumber } from '../utils/generateCNNumber';

const CONSIGNMENTS_PATH = 'consignments';

// ---- Create --------------------------------------------------------------

/**
 * Creates a new consignment record.
 * - Generates a unique CN number (never reused, never duplicated).
 * - Stores an index entry under consignments_by_cn/{cnNumber} -> id so a
 *   CN-number search is an O(1) lookup instead of a full scan.
 */
export async function createConsignment(formData, userUid) {
  const cnNumber = await generateCNNumber();

  const newRef = push(ref(db, CONSIGNMENTS_PATH));
  const now = Date.now();

  const record = {
    ...formData,
    id: newRef.key,
    cnNumber,
    createdAt: now,
    updatedAt: now,
    createdBy: userUid,
  };

  await set(newRef, record);
  await set(ref(db, `consignments_by_cn/${cnNumber}`), newRef.key);

  return record;
}

// ---- Update ----------------------------------------------------------------

// Never changes cnNumber, createdAt, or createdBy.
export async function updateConsignment(id, formData) {
  const updates = {
    ...formData,
    updatedAt: Date.now(),
  };
  delete updates.cnNumber;
  delete updates.createdAt;
  delete updates.createdBy;
  delete updates.id;

  await update(ref(db, `${CONSIGNMENTS_PATH}/${id}`), updates);
}

// ---- Read --------------------------------------------------------------

export async function getConsignmentById(id) {
  const snap = await get(ref(db, `${CONSIGNMENTS_PATH}/${id}`));
  return snap.exists() ? snap.val() : null;
}

export async function getConsignmentByCNNumber(cnNumber) {
  const idxSnap = await get(ref(db, `consignments_by_cn/${cnNumber}`));
  if (!idxSnap.exists()) return null;
  return getConsignmentById(idxSnap.val());
}

// Most recent N records, newest first. Used by Dashboard + History (first page).
export async function getRecentConsignments(count = 50) {
  const q = query(ref(db, CONSIGNMENTS_PATH), orderByChild('createdAt'), limitToLast(count));
  const snap = await get(q);
  if (!snap.exists()) return [];
  return Object.values(snap.val()).sort((a, b) => b.createdAt - a.createdAt);
}

export async function getConsignmentsByDateRange(fromISO, toISO) {
  const q = query(
    ref(db, CONSIGNMENTS_PATH),
    orderByChild('date'),
    startAt(fromISO),
    endAt(toISO || fromISO + '\uf8ff')
  );
  const snap = await get(q);
  if (!snap.exists()) return [];
  return Object.values(snap.val()).sort((a, b) => b.createdAt - a.createdAt);
}

export async function getConsignmentsByField(field, value) {
  const q = query(ref(db, CONSIGNMENTS_PATH), orderByChild(field), equalTo(value));
  const snap = await get(q);
  if (!snap.exists()) return [];
  return Object.values(snap.val()).sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * General-purpose search.
 *
 * Realtime Database can only efficiently index/query one field at a time,
 * so the strategy is:
 *  - Exact CN number -> O(1) index lookup (consignments_by_cn).
 *  - Date / date range given -> indexed query on "date", then filter the
 *    (small) result set further in memory for any other criteria.
 *  - Otherwise -> pull the most recent N records (bounded, not the whole
 *    database) and filter in memory. This is fine at personal/small
 *    business scale (thousands of records); if the dataset grows much
 *    larger, add more denormalized index nodes (e.g. consignments_by_booking)
 *    the same way consignments_by_cn is done above.
 */
export async function searchConsignments(filters) {
  const { cnNumber, bookingNumber, containerNumber, pickupDepot, dateFrom, dateTo } = filters;

  if (cnNumber) {
    const exact = await getConsignmentByCNNumber(cnNumber.trim().toUpperCase());
    return exact ? [exact] : [];
  }

  let candidates;
  if (dateFrom || dateTo) {
    candidates = await getConsignmentsByDateRange(dateFrom || '0000-00-00', dateTo);
  } else {
    candidates = await getRecentConsignments(500);
  }

  return candidates.filter((c) => {
    if (bookingNumber && !String(c.bookingNumber || '').toLowerCase().includes(bookingNumber.toLowerCase())) return false;
    if (containerNumber) {
      const containers = `${c.containerNumber1 || ''} ${c.containerNumber2 || ''}`.toLowerCase();
      if (!containers.includes(containerNumber.toLowerCase())) return false;
    }
    if (pickupDepot && !String(c.collectionFrom || '').toLowerCase().includes(pickupDepot.toLowerCase())) return false;
    return true;
  });
}

// ---- Stats (Dashboard) --------------------------------------------------

export async function getDashboardStats() {
  const recent = await getRecentConsignments(2000);
  const todayISO = new Date().toISOString().slice(0, 10);
  const thisMonth = todayISO.slice(0, 7);

  return {
    todayCount: recent.filter((c) => c.date === todayISO).length,
    monthCount: recent.filter((c) => (c.date || '').startsWith(thisMonth)).length,
    totalCount: recent.length,
    recent: recent.slice(0, 8),
  };
}
