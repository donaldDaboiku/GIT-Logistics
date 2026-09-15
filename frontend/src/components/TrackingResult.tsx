import type { Shipment, ShipmentStatus } from '../types';
import { badgeClass, STATUS_FLOW, statusLabel } from '../lib/status';

interface Props {
  shipment: Shipment | null;
  loading?: boolean;
  notFound?: boolean;
  trackedId?: string;
}

export function TrackingResult({ shipment, loading, notFound, trackedId }: Props) {
  if (loading) {
    return (
      <div className="tracking-card" style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
        <p className="muted">Looking up shipment…</p>
      </div>
    );
  }

  if (notFound && trackedId) {
    return (
      <div className="tracking-card">
        <h3>Shipment not found</h3>
        <p className="muted">
          We couldn't find <b>{trackedId}</b>. Check the tracking number and try again.
        </p>
      </div>
    );
  }

  if (!shipment) return null;

  const flowIndex = resolveFlowIndex(shipment.status);
  const last = shipment.events[shipment.events.length - 1];

  return (
    <div className="tracking-card">
      <div className="track-summary">
        <div>
          <div className="muted">Tracking Number</div>
          <h3>{shipment.tracking_number}</h3>
          <div className="muted">Last updated: {last?.occurred_at ?? '—'}</div>
        </div>
        <span className={badgeClass(shipment.status)}>{statusLabel(shipment.status)}</span>
      </div>

      <div className="timeline">
        {STATUS_FLOW.map((st, i) => {
          const event = shipment.events.find(e => e.status === st);
          return (
            <div key={st} className={`step${i <= flowIndex ? ' done' : ''}${i === flowIndex ? ' current' : ''}`}>
              <div className="dot" />
              <span>{statusLabel(st)}</span>
              <small>{i <= flowIndex ? (event?.occurred_at ?? 'Updated') : 'Pending'}</small>
            </div>
          );
        })}
      </div>

      <div className="track-lower">
        <div className="info-card">
          <h4>Shipment details</h4>
          <div className="info-row"><span>From</span><b>{shipment.origin}</b></div>
          <div className="info-row"><span>To</span><b>{shipment.destination}</b></div>
          <div className="info-row"><span>Package</span><b>{shipment.package}</b></div>
          <div className="info-row"><span>Weight</span><b>{shipment.weight} kg</b></div>
          <div className="info-row"><span>Expected delivery</span><b>{shipment.expected_at}</b></div>
          <div className="info-row"><span>Amount</span><b>₦{shipment.amount.toLocaleString()}</b></div>
        </div>
        <div className="info-card">
          <h4>Tracking history</h4>
          {[...shipment.events].reverse().map((e, i) => (
            <div key={`${e.status}-${e.occurred_at}-${i}`} className="info-row">
              <span>
                <b>{statusLabel(e.status)}</b>
                <br /><small>{e.note} — {e.location}</small>
              </span>
              <b>{e.occurred_at}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function resolveFlowIndex(status: ShipmentStatus): number {
  if (status === 'RETURNED' || status === 'CANCELLED' || status === 'DELIVERY_ATTEMPTED') {
    return STATUS_FLOW.indexOf('OUT_FOR_DELIVERY');
  }
  return Math.max(0, STATUS_FLOW.indexOf(status));
}
