import type { ShipmentStatus } from '../types';

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  ORDER_CREATED: 'Order Created',
  PICKED_UP: 'Picked Up',
  AT_ORIGIN_HUB: 'At Origin Hub',
  IN_TRANSIT: 'In Transit',
  AT_DESTINATION_HUB: 'At Destination Hub',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  DELIVERY_ATTEMPTED: 'Delivery Attempted',
  RETURNED: 'Returned',
  CANCELLED: 'Cancelled',
};

export const ALL_STATUSES = Object.keys(STATUS_LABELS) as ShipmentStatus[];

export const STATUS_FLOW: ShipmentStatus[] = [
  'ORDER_CREATED',
  'PICKED_UP',
  'AT_ORIGIN_HUB',
  'IN_TRANSIT',
  'AT_DESTINATION_HUB',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

export function statusLabel(status: ShipmentStatus): string {
  return STATUS_LABELS[status] ?? status;
}

export function badgeClass(status: ShipmentStatus): string {
  if (status === 'DELIVERED') return 'badge green';
  if (status === 'OUT_FOR_DELIVERY' || status === 'DELIVERY_ATTEMPTED') return 'badge orange';
  if (status === 'RETURNED' || status === 'CANCELLED') return 'badge red';
  return 'badge';
}
