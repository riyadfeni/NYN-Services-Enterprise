import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../services/consignments';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  return (
    <div>
      <h1>Welcome</h1>
      <button className="btn" onClick={() => navigate('/new')}>+ NEW CONSIGNMENT</button>

      <div className="stats-row" style={{ marginTop: 24 }}>
        <div className="stat-card">
          <div className="stat-value">{stats ? stats.todayCount : '-'}</div>
          <div className="stat-label">Today's Jobs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats ? stats.monthCount : '-'}</div>
          <div className="stat-label">This Month</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats ? stats.totalCount : '-'}</div>
          <div className="stat-label">Total Records</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Recent Consignments</h3>
        {stats && stats.recent.length === 0 && <p style={{ color: '#667085' }}>No consignments yet.</p>}
        {stats && stats.recent.map((r) => (
          <div key={r.id} style={{ padding: '8px 0', borderBottom: '1px solid #eef1f5', cursor: 'pointer' }}
            onClick={() => navigate(`/consignment/${r.id}`)}>
            <span className="badge">{r.cnNumber}</span>{' '}
            <span style={{ color: '#667085', fontSize: 13 }}>{r.collectionFrom} &rarr; {r.deliverTo}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
