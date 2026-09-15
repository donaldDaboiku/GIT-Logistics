import client, { USE_LOCAL_STORAGE } from './client';
import type { Shipment, CreateShipmentPayload, DashboardStats } from '../types';
import { getLocalShipments, saveLocalShipments } from '../data/demo';

// ─── Generate tracking number (local fallback only) ───────────────────────────
function genTracking(count: number): string {
  const ymd = new Date().toISOString().slice(2, 10).replaceAll('-', '');
  return 'GIT' + ymd + String(count + 1).padStart(6, '0');
}

// ─── Shipments ────────────────────────────────────────────────────────────────

export async function fetchShipments(): Promise<Shipment[]> {
  if (USE_LOCAL_STORAGE) return getLocalShipments();
  const { data } = await client.get<{ data: Shipment[] }>('/shipments');
  return data.data;
}

export async function fetchShipmentByTracking(tracking: string): Promise<Shipment | null> {
  if (USE_LOCAL_STORAGE) {
    return getLocalShipments().find(s => s.tracking_number.toUpperCase() === tracking.toUpperCase()) ?? null;
  }
  try {
    const { data } = await client.get<{ data: Shipment }>(`/shipments/${tracking}`);
    return data.data;
  } catch {
    return null;
  }
}

export async function createShipment(payload: CreateShipmentPayload): Promise<Shipment> {
  if (USE_LOCAL_STORAGE) {
    const list = getLocalShipments();
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const shipment: Shipment = {
      tracking_number: genTracking(list.length),
      customer: payload.customer,
      phone: payload.phone,
      origin: payload.origin,
      destination: payload.destination,
      package: payload.package,
      weight: payload.weight,
      amount: payload.amount,
      expected_at: payload.expected_at,
      status: 'ORDER_CREATED',
      events: [{ status: 'ORDER_CREATED', location: payload.origin, note: 'Shipment created', occurred_at: now }],
    };
    saveLocalShipments([shipment, ...list]);
    return shipment;
  }
  const { data } = await client.post<{ data: Shipment }>('/shipments', payload);
  return data.data;
}

// ─── Dashboard stats ──────────────────────────────────────────────────────────

export async function fetchStats(): Promise<DashboardStats> {
  if (USE_LOCAL_STORAGE) {
    const list = getLocalShipments();
    const c = (s: string) => list.filter(x => x.status === s).length;
    return {
      total: list.length,
      in_transit: c('IN_TRANSIT'),
      out_for_delivery: c('OUT_FOR_DELIVERY'),
      delivered: c('DELIVERED'),
      returned: c('RETURNED'),
    };
  }
  const { data } = await client.get<{ data: DashboardStats }>('/dashboard/stats');
  return data.data;
}

// ─── Export helper ────────────────────────────────────────────────────────────

export async function exportShipments(): Promise<void> {
  const list = await fetchShipments();
  const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'git-logistics-shipments.json';
  a.click();
  URL.revokeObjectURL(a.href);
}
