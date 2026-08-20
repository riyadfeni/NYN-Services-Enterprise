import { useEffect, useState } from 'react';
import { ref, get, push, set as fbSet, remove } from 'firebase/database';
import { db } from '../services/firebase';

export default function Settings() {
  const [depots, setDepots] = useState([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  async function loadDepots() {
    const snap = await get(ref(db, 'depots'));
    setDepots(snap.exists() ? Object.entries(snap.val()) : []);
  }

  useEffect(() => { loadDepots(); }, []);

  async function addDepot(e) {
    e.preventDefault();
    if (!name.trim()) return;
    const newRef = push(ref(db, 'depots'));
    await fbSet(newRef, { name: name.trim(), code: code.trim(), status: 'ACTIVE' });
    setName('');
    setCode('');
    loadDepots();
  }

  async function removeDepot(key) {
    await remove(ref(db, `depots/${key}`));
    loadDepots();
  }

  return (
    <div>
      <h1>Settings &rarr; Depots</h1>
      <div className="card">
        <form onSubmit={addDepot} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div className="field" style={{ flex: 1 }}>
            <label>Depot Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field" style={{ width: 120 }}>
            <label>Code</label>
            <input value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <button className="btn" type="submit">+ ADD DEPOT</button>
        </form>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Code</th><th></th></tr></thead>
          <tbody>
            {depots.map(([key, dep]) => (
              <tr key={key}>
                <td>{dep.name}</td>
                <td>{dep.code}</td>
                <td><button className="btn btn-secondary" onClick={() => removeDepot(key)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
