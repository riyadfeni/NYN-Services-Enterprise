import { useState } from 'react';
import HistoryTable from '../components/HistoryTable';
import { searchConsignments } from '../services/consignments';

export default function Search() {
  const [filters, setFilters] = useState({
    cnNumber: '', bookingNumber: '', containerNumber: '', pickupDepot: '', dateFrom: '', dateTo: '',
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  function set(field, value) {
    setFilters((f) => ({ ...f, [field]: value }));
  }

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    const r = await searchConsignments(filters);
    setResults(r);
    setLoading(false);
  }

  return (
    <div>
      <h1>Search Consignments</h1>
      <div className="card">
        <form onSubmit={handleSearch} className="form-grid">
          <div className="field"><label>CN Number</label><input value={filters.cnNumber} onChange={(e) => set('cnNumber', e.target.value)} placeholder="CN-2026-00127" /></div>
          <div className="field"><label>Booking Number (BKG REF)</label><input value={filters.bookingNumber} onChange={(e) => set('bookingNumber', e.target.value)} /></div>
          <div className="field"><label>Container Number</label><input value={filters.containerNumber} onChange={(e) => set('containerNumber', e.target.value)} /></div>
          <div className="field"><label>Collection From / Depot</label><input value={filters.pickupDepot} onChange={(e) => set('pickupDepot', e.target.value)} /></div>
          <div className="field"><label>Date From</label><input type="date" value={filters.dateFrom} onChange={(e) => set('dateFrom', e.target.value)} /></div>
          <div className="field"><label>Date To</label><input type="date" value={filters.dateTo} onChange={(e) => set('dateTo', e.target.value)} /></div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Searching...' : 'SEARCH'}</button>
          </div>
        </form>
      </div>
      {results && (
        <div className="card">
          <HistoryTable records={results} />
        </div>
      )}
    </div>
  );
}
