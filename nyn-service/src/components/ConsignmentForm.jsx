import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../services/firebase';
import { todayISO } from '../utils/date';

const emptyForm = {
  shipmentType: 'IMPORT',
  portType: 'WESTPORT',
  collectionFrom: '',
  deliverTo: '',
  remarks: '',
  shippingAgent: '',
  etaDate: '',
  operatorCode: '',
  openingDate: '',
  containerNumber1: '',
  containerNumber2: '',
  closingDate: '',
  mtPortRef: '',
  bkgRef: '',
  dischargeTerminal: '',
  sizeType: '',
  vesselName: '',
  driverName: '',
  icNo: '',
  primeMoverNo: '',
  trailerNo: '',
  date: todayISO(),
};

export default function ConsignmentForm({ initialData, onSubmit, submitLabel, saving }) {
  const [form, setForm] = useState({ ...emptyForm, ...(initialData || {}) });
  const [depots, setDepots] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    get(ref(db, 'depots')).then((snap) => {
      if (snap.exists()) setDepots(Object.values(snap.val()));
    });
  }, []);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.collectionFrom || !form.deliverTo || !form.containerNumber1) {
      setError('Please fill in Collection From, Deliver To, and at least one Container Number.');
      return;
    }
    setError('');
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-section">
        <h3>Shipment Type</h3>
        <div className="checkbox-row">
          <label><input type="radio" name="shipmentType" checked={form.shipmentType === 'IMPORT'} onChange={() => set('shipmentType', 'IMPORT')} /> Import</label>
          <label><input type="radio" name="shipmentType" checked={form.shipmentType === 'EXPORT'} onChange={() => set('shipmentType', 'EXPORT')} /> Export</label>
          <label style={{ marginLeft: 24 }}><input type="radio" name="portType" checked={form.portType === 'WESTPORT'} onChange={() => set('portType', 'WESTPORT')} /> Westport - KPM</label>
          <label><input type="radio" name="portType" checked={form.portType === 'NORTHPORT'} onChange={() => set('portType', 'NORTHPORT')} /> North Port - KCT</label>
        </div>
      </div>

      <div className="form-section">
        <h3>Movement Information</h3>
        <div className="form-grid">
          <div className="field">
            <label>Collection From <span className="required">*</span></label>
            <input list="depot-list" value={form.collectionFrom} autoFocus onChange={(e) => set('collectionFrom', e.target.value)} />
          </div>
          <div className="field">
            <label>Deliver To <span className="required">*</span></label>
            <input list="depot-list" value={form.deliverTo} onChange={(e) => set('deliverTo', e.target.value)} />
          </div>
          <datalist id="depot-list">
            {depots.map((dep) => <option key={dep.name} value={dep.name} />)}
          </datalist>
        </div>
        <div className="field" style={{ marginTop: 10 }}>
          <label>Remarks</label>
          <textarea rows={2} value={form.remarks} onChange={(e) => set('remarks', e.target.value)} />
        </div>
      </div>

      <div className="form-section">
        <h3>Shipping Information</h3>
        <div className="form-grid">
          <div className="field"><label>Shipping Agent</label><input value={form.shippingAgent} onChange={(e) => set('shippingAgent', e.target.value)} /></div>
          <div className="field"><label>ETA Date</label><input type="date" value={form.etaDate} onChange={(e) => set('etaDate', e.target.value)} /></div>
          <div className="field"><label>Operator Code</label><input value={form.operatorCode} onChange={(e) => set('operatorCode', e.target.value)} /></div>
          <div className="field"><label>Opening Date</label><input type="date" value={form.openingDate} onChange={(e) => set('openingDate', e.target.value)} /></div>
          <div className="field"><label>Container No. 1 <span className="required">*</span></label><input value={form.containerNumber1} onChange={(e) => set('containerNumber1', e.target.value.toUpperCase())} /></div>
          <div className="field"><label>Closing Date</label><input type="date" value={form.closingDate} onChange={(e) => set('closingDate', e.target.value)} /></div>
          <div className="field"><label>Container No. 2</label><input value={form.containerNumber2} onChange={(e) => set('containerNumber2', e.target.value.toUpperCase())} /></div>
          <div className="field"><label>MT Port Ref</label><input value={form.mtPortRef} onChange={(e) => set('mtPortRef', e.target.value)} /></div>
          <div className="field"><label>Booking Ref (BKG REF)</label><input value={form.bkgRef} onChange={(e) => set('bkgRef', e.target.value)} /></div>
          <div className="field"><label>Discharge Terminal</label><input value={form.dischargeTerminal} onChange={(e) => set('dischargeTerminal', e.target.value)} /></div>
          <div className="field"><label>Size / Type</label><input value={form.sizeType} onChange={(e) => set('sizeType', e.target.value)} placeholder="e.g. 20' GP" /></div>
          <div className="field"><label>Vessel Name</label><input value={form.vesselName} onChange={(e) => set('vesselName', e.target.value)} /></div>
        </div>
      </div>

      <div className="form-section">
        <h3>Driver Details</h3>
        <div className="form-grid">
          <div className="field"><label>Driver Name</label><input value={form.driverName} onChange={(e) => set('driverName', e.target.value)} /></div>
          <div className="field"><label>IC No.</label><input value={form.icNo} onChange={(e) => set('icNo', e.target.value)} /></div>
          <div className="field"><label>Prime Mover No.</label><input value={form.primeMoverNo} onChange={(e) => set('primeMoverNo', e.target.value.toUpperCase())} /></div>
          <div className="field"><label>Trailer No.</label><input value={form.trailerNo} onChange={(e) => set('trailerNo', e.target.value.toUpperCase())} /></div>
          <div className="field"><label>Date</label><input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} /></div>
        </div>
      </div>

      <button className="btn" type="submit" disabled={saving}>
        {saving ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
