import { useState } from 'react';
import { apiErrorMessage } from '../api/errors';
import { allowedNextStatuses, statusLabel, suggestedNextStatus } from '../lib/status';
import { useShipmentStore } from '../store/useShipmentStore';
import type { Shipment, ShipmentStatus } from '../types';

interface Props {
  shipment: Shipment;
  onUpdated: (status: ShipmentStatus) => void;
  onClose: () => void;
}

export function UpdateStatusModal({ shipment, onUpdated, onClose }: Props) {
  const { updateStatus } = useShipmentStore();
  const last = shipment.events[shipment.events.length - 1];
  const nextOptions = allowedNextStatuses(shipment.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<ShipmentStatus>(suggestedNextStatus(shipment.status));
  const [location, setLocation] = useState(last?.location || shipment.destination);
  const [note, setNote] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await updateStatus(shipment, { status, location, note: note.trim() || undefined });
      onUpdated(status);
    } catch (err: unknown) {
      setError(apiErrorMessage(err, 'Could not update shipment status.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card" style={{ maxWidth: 480 }}>
        <div className="modal-head">
          <h3>Update status</h3>
          <button type="button" aria-label="Close status update" onClick={onClose}>×</button>
        </div>
        <p className="muted" style={{ marginTop: 0 }}>
          {shipment.tracking_number} · {shipment.customer} · current: {statusLabel(shipment.status)}
        </p>
        {nextOptions.length === 0 ? (
          <p className="form-error" role="status">This shipment is closed and cannot be updated.</p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {error && <p className="form-error" role="alert">{error}</p>}
            <label className="field-label">
              Status
              <select value={status} onChange={e => setStatus(e.target.value as ShipmentStatus)} required>
                {nextOptions.map(s => (
                  <option key={s} value={s}>{statusLabel(s)}</option>
                ))}
              </select>
            </label>
            <label className="field-label">
              Location
              <input value={location} onChange={e => setLocation(e.target.value)} required maxLength={255} />
            </label>
            <label className="field-label">
              Note (optional)
              <input value={note} onChange={e => setNote(e.target.value)} maxLength={500} placeholder="e.g. Rider dispatched" />
            </label>
            <div className="modal-actions">
              <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" disabled={loading}>
                {loading ? 'Updating…' : 'Save status'}
              </button>
            </div>
          </form>
        )}
        {nextOptions.length === 0 && (
          <div className="modal-actions">
            <button type="button" className="btn btn-light" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
