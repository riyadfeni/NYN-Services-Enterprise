import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConsignmentForm from '../components/ConsignmentForm';
import ConsignmentNote from '../components/ConsignmentNote';
import { getConsignmentById, updateConsignment } from '../services/consignments';

export default function ViewConsignment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getConsignmentById(id).then((r) => {
      if (!r) setNotFound(true);
      setRecord(r);
    });
  }, [id]);

  async function handleSave(form) {
    setSaving(true);
    await updateConsignment(id, form);
    const refreshed = await getConsignmentById(id);
    setRecord(refreshed);
    setSaving(false);
    setEditing(false);
  }

  if (notFound) return <div className="card">Record not found.</div>;
  if (!record) return <p>Loading...</p>;

  if (editing) {
    return (
      <div>
        <h1>Edit {record.cnNumber}</h1>
        <div className="card">
          <ConsignmentForm initialData={record} onSubmit={handleSave} submitLabel="SAVE CHANGES" saving={saving} />
        </div>
        <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
      </div>
    );
  }

  return (
    <div>
      <div className="no-print" style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button className="btn" onClick={() => window.print()}>PRINT</button>
        <button className="btn btn-secondary" onClick={() => setEditing(true)}>EDIT</button>
        <button className="btn btn-secondary" onClick={() => navigate('/history')}>BACK</button>
      </div>
      <div className="cn-preview-wrapper cn-print-area">
        <ConsignmentNote data={record} />
      </div>
    </div>
  );
}
