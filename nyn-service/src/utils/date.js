// Small date helpers. Dates are stored as ISO strings (YYYY-MM-DD) so they
// sort correctly as plain strings in Firebase Realtime Database indexes.

export function toISODate(date) {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

export function formatDisplayDate(isoDate) {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  if (!y || !m || !d) return isoDate;
  return `${d}/${m}/${y}`;
}

export function todayISO() {
  return toISODate(new Date());
}
