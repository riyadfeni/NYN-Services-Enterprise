import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConsignmentForm from '../components/ConsignmentForm';
import ConsignmentNote from '../components/ConsignmentNote';
import { createConsignment } from '../services/consignments';
import { useAuth } from '../context';

export default function NewConsignment() {
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState(null);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(form) {
    setSaving(true);
    setError('');
    try {
      const record = await createConsignment(form, user.uid);
      setCreated(record);
    } catch (err) {
      setError(err.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (created) {
    return (
      <div>
        <div className="alert alert-success no-print">
          Consignment {created.cnNumber} created successfully.
        </div>
        <div className="card no-print" style={{ display: 'flex', gap: 10 }}>
          <button className="btn" onClick={() => window.print()}>PRINT CN</button>
          <button className="btn btn-secondary" onClick={() => { setCreated(null); }}>NEW CN</button>
          <button className="btn btn-secondary" onClick={() => navigate('/history')}>VIEW HISTORY</button>
        </div>
        <div className="cn-preview-wrapper cn-print-area">
          <ConsignmentNote data={created} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>New Consignment</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card">
        <ConsignmentForm onSubmit={handleSubmit} submitLabel="SAVE & GENERATE CN" saving={saving} />
      </div>
    </div>
  );
}
