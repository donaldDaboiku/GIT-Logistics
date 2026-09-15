import { useState } from 'react';
import { apiErrorMessage } from '../api/errors';
import { useShipmentStore } from '../store/useShipmentStore';
import type { CreateShipmentPayload } from '../types';

interface Props {
  onCreated: (trackingNumber: string) => void;
  onClose: () => void;
}

function today(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function CreateShipmentModal({ onCreated, onClose }: Props) {
  const { create } = useShipmentStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<CreateShipmentPayload>({
    customer: '',
    phone: '',
    origin: 'Abuja',
    destination: '',
    package: '',
    weight: 1,
    amount: 5000,
    expected_at: today(),
  });

  const set = (field: keyof CreateShipmentPayload, value: string | number) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const shipment = await create(form);
      onCreated(shipment.tracking_number);
    } catch (err: unknown) {
      setError(apiErrorMessage(err, 'Could not create shipment. Check the form and try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <div className="modal-head">
          <h3>Create Shipment</h3>
          <button type="button" aria-label="Close create shipment" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="form-grid">
            <label>Customer name<input value={form.customer} onChange={e => set('customer', e.target.value)} required maxLength={255} /></label>
            <label>Customer phone<input value={form.phone} onChange={e => set('phone', e.target.value)} required maxLength={30} /></label>
            <label>Origin<input value={form.origin} onChange={e => set('origin', e.target.value)} required maxLength={255} /></label>
            <label>Destination<input value={form.destination} onChange={e => set('destination', e.target.value)} placeholder="e.g. Wuse, Abuja" required maxLength={255} /></label>
            <label>Package description<input value={form.package} onChange={e => set('package', e.target.value)} placeholder="e.g. Laptop accessories" required maxLength={500} /></label>
            <label>Weight (kg)<input type="number" min="0.01" step="0.01" value={form.weight} onChange={e => set('weight', Number(e.target.value))} required /></label>
            <label>Expected delivery<input type="date" min={today()} value={form.expected_at} onChange={e => set('expected_at', e.target.value)} required /></label>
            <label>Amount (₦)<input type="number" min="0" step="1" value={form.amount} onChange={e => set('amount', Number(e.target.value))} required /></label>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating…' : 'Create Shipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
