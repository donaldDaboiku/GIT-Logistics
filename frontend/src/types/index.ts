// ─── Shared domain types ────────────────────────────────────────────────────

export type ShipmentStatus =
  | 'ORDER_CREATED'
  | 'PICKED_UP'
  | 'AT_ORIGIN_HUB'
  | 'IN_TRANSIT'
  | 'AT_DESTINATION_HUB'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'DELIVERY_ATTEMPTED'
  | 'RETURNED'
  | 'CANCELLED';

export interface ShipmentEvent {
  status: ShipmentStatus;
  location: string;
  note: string;
  occurred_at: string;
}

export interface Shipment {
  id?: number;
  tracking_number: string;
  customer: string;
  phone: string;
  origin: string;
  destination: string;
  package: string;
  weight: number;
  amount: number;
  expected_at: string;
  status: ShipmentStatus;
  events: ShipmentEvent[];
  created_at?: string;
}

export interface DashboardStats {
  total: number;
  in_transit: number;
  out_for_delivery: number;
  delivered: number;
  returned: number;
}

export interface CreateShipmentPayload {
  customer: string;
  phone: string;
  origin: string;
  destination: string;
  package: string;
  weight: number;
  amount: number;
  expected_at: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
