import { create } from 'zustand';
import type { CreateShipmentPayload, DashboardStats, Shipment } from '../types';
import { USE_LOCAL_STORAGE } from '../api/client';
import { apiErrorMessage } from '../api/errors';
import {
  createShipment as apiCreate,
  exportShipments,
  fetchShipments,
  fetchShipmentByTracking,
  fetchStats,
} from '../api/shipments';
import { resetLocalShipments } from '../data/demo';

interface ShipmentState {
  shipments: Shipment[];
  stats: DashboardStats;
  trackedShipment: Shipment | null;
  isLoading: boolean;
  trackLoading: boolean;
  error: string | null;

  loadAll: () => Promise<void>;
  loadStats: () => Promise<void>;
  track: (trackingNumber: string) => Promise<void>;
  create: (payload: CreateShipmentPayload) => Promise<Shipment>;
  resetDemo: () => Promise<void>;
  exportAll: () => Promise<void>;
}

const EMPTY_STATS: DashboardStats = {
  total: 0,
  in_transit: 0,
  out_for_delivery: 0,
  delivered: 0,
  returned: 0,
};

export const useShipmentStore = create<ShipmentState>((set) => ({
  shipments: [],
  stats: EMPTY_STATS,
  trackedShipment: null,
  isLoading: false,
  trackLoading: false,
  error: null,

  loadAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const shipments = await fetchShipments();
      set({ shipments, isLoading: false });
    } catch (err: unknown) {
      set({ isLoading: false, error: apiErrorMessage(err, 'Failed to load shipments.') });
    }
  },

  loadStats: async () => {
    try {
      const stats = await fetchStats();
      set({ stats });
    } catch {
      /* stats are non-blocking */
    }
  },

  track: async (trackingNumber: string) => {
    set({ trackLoading: true, trackedShipment: null });
    const shipment = await fetchShipmentByTracking(trackingNumber.trim().toUpperCase());
    set({ trackedShipment: shipment, trackLoading: false });
  },

  create: async (payload: CreateShipmentPayload) => {
    const shipment = await apiCreate(payload);
    const [shipments, stats] = await Promise.all([fetchShipments(), fetchStats()]);
    set({ shipments, stats });
    return shipment;
  },

  resetDemo: async () => {
    if (!USE_LOCAL_STORAGE) return;
    resetLocalShipments();
    const [shipments, stats] = await Promise.all([fetchShipments(), fetchStats()]);
    set({ shipments, stats, trackedShipment: null });
  },

  exportAll: async () => {
    await exportShipments();
  },
}));
