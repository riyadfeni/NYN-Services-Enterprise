import { useNavigate } from 'react-router-dom';
import { formatDisplayDate } from '../utils/date';

export default function HistoryTable({ records }) {
  const navigate = useNavigate();

  if (!records.length) {
    return <p style={{ color: '#667085' }}>No records found.</p>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>CN Number</th>
          <th>Booking No.</th>
          <th>Container No.</th>
          <th>Collection From</th>
          <th>Date</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {records.map((r) => (
          <tr key={r.id}>
            <td><span className="badge">{r.cnNumber}</span></td>
            <td>{r.bkgRef}</td>
            <td>{r.containerNumber1}</td>
            <td>{r.collectionFrom}</td>
            <td>{formatDisplayDate(r.date)}</td>
            <td>
              <button className="btn btn-secondary" onClick={() => navigate(`/consignment/${r.id}`)}>View</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
