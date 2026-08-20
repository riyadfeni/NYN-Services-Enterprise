import { useEffect, useState } from 'react';
import HistoryTable from '../components/HistoryTable';
import { getRecentConsignments } from '../services/consignments';

export default function History() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecentConsignments(100).then((r) => {
      setRecords(r);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1>Consignment History</h1>
      <div className="card">
        {loading ? <p>Loading...</p> : <HistoryTable records={records} />}
      </div>
    </div>
  );
}
