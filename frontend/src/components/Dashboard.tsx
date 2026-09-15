import { useState, useEffect, useMemo } from 'react';
import { USE_LOCAL_STORAGE } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { useShipmentStore } from '../store/useShipmentStore';
import { CreateShipmentModal } from './CreateShipmentModal';
import { UpdateStatusModal } from './UpdateStatusModal';
import { ALL_STATUSES, badgeClass, statusLabel } from '../lib/status';
import type { Shipment, ShipmentStatus } from '../types';

interface Props {
  onViewShipment: (trackingNumber: string) => void;
}

export function Dashboard({ onViewShipment }: Props) {
  const { shipments, stats, loadAll, loadStats, resetDemo, exportAll, error } = useShipmentStore();
  const token = useAuthStore((s) => s.token);
  const [showModal, setShowModal] = useState(false);
  const [statusTarget, setStatusTarget] = useState<Shipment | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [toast, setToast] = useState('');

  const canOperate = USE_LOCAL_STORAGE || Boolean(token);

  useEffect(() => {
    if (!canOperate) return;
    void loadAll();
    void loadStats();
  }, [canOperate, loadAll, loadStats]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  const filtered: Shipment[] = useMemo(() => {
    const q = search.toLowerCase();
    return shipments.filter(s => {
      const matches = !q || [s.tracking_number, s.customer, s.destination].join(' ').toLowerCase().includes(q);
      return matches && (!statusFilter || s.status === statusFilter);
    });
  }, [shipments, search, statusFilter]);

  const handleCreated = (trackingNumber: string) => {
    setShowModal(false);
    showToast(`Shipment ${trackingNumber} created successfully.`);
    onViewShipment(trackingNumber);
  };

  const handleStatusUpdated = (trackingNumber: string, status: ShipmentStatus) => {
    setStatusTarget(null);
    showToast(`${trackingNumber} updated to ${statusLabel(status)}.`);
  };

  const handleReset = async () => {
    await resetDemo();
    showToast('Demo data restored.');
  };

  return (
    <section id="dashboard" className="section dashboard-section">
      <div className="section-head">
        <div>
          <div className="eyebrow">OPERATIONS</div>
          <h2>Logistics dashboard</h2>
          <p>
            {USE_LOCAL_STORAGE
              ? 'Browser demo mode. Data is stored locally until you connect the Laravel API.'
              : canOperate
                ? 'Live operations view connected to the GIT Logistics API.'
                : 'Sign in to create shipments and view the operations board.'}
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
          disabled={!canOperate}
        >
          + Create Shipment
        </button>
      </div>

      <div className="stats" id="stats">
        {[
          ['Total Shipments', stats.total, 'All recorded shipments'],
          ['In Transit', stats.in_transit, 'Moving between hubs'],
          ['Out for Delivery', stats.out_for_delivery, 'With delivery riders'],
          ['Delivered', stats.delivered, 'Successfully completed'],
          ['Returns', stats.returned, 'Returned shipments'],
        ].map(([label, num, sub]) => (
          <div key={label as string} className="stat">
            <small>{label as string}</small>
            <div className="num">{num as number}</div>
            <small>{sub as string}</small>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <div className="panel">
          <div className="panel-head">
            <h3>Shipments</h3>
            <div className="filters">
              <input
                id="search"
                placeholder="Search tracking/customer..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="">All statuses</option>
                {ALL_STATUSES.map(s => (
                  <option key={s} value={s}>{statusLabel(s)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tracking</th>
                  <th>Customer</th>
                  <th>Destination</th>
                  <th>Status</th>
                  <th>Expected</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {!canOperate ? (
                  <tr><td colSpan={6}>Log in to load shipments.</td></tr>
                ) : error ? (
                  <tr><td colSpan={6}>{error}</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6}>No shipments found.</td></tr>
                ) : filtered.map(s => (
                  <tr key={s.tracking_number}>
                    <td><b>{s.tracking_number}</b></td>
                    <td>{s.customer}</td>
                    <td>{s.destination}</td>
                    <td><span className={badgeClass(s.status)}>{statusLabel(s.status)}</span></td>
                    <td>{s.expected_at}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="btn btn-light"
                          onClick={() => onViewShipment(s.tracking_number)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-light"
                          onClick={() => setStatusTarget(s)}
                        >
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel quick">
          <h3>Quick operations</h3>
          <button onClick={() => setShowModal(true)} disabled={!canOperate}>Create shipment</button>
          {USE_LOCAL_STORAGE && (
            <button onClick={() => void handleReset()}>Reset demo data</button>
          )}
          <button onClick={() => void exportAll()} disabled={!canOperate}>Export shipment JSON</button>
          <div className="notice">
            <b>Demo login:</b><br />
            ops@gitlogistics.ng / password
          </div>
        </div>
      </div>

      {showModal && canOperate && (
        <CreateShipmentModal onCreated={handleCreated} onClose={() => setShowModal(false)} />
      )}

      {statusTarget && (
        <UpdateStatusModal
          shipment={statusTarget}
          onUpdated={(status) => handleStatusUpdated(statusTarget.tracking_number, status)}
          onClose={() => setStatusTarget(null)}
        />
      )}

      {toast && (
        <div className="toast show">{toast}</div>
      )}
    </section>
  );
}
