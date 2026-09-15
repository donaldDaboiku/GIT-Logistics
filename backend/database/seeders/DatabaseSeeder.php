<?php

namespace Database\Seeders;

use App\Models\Shipment;
use App\Models\ShipmentEvent;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the demo data that mirrors the JavaScript prototype exactly.
     */
    public function run(): void
    {
        // ── Demo ops user ────────────────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'ops@gitlogistics.ng'],
            [
                'name' => 'Ops Admin',
                'password' => 'password',
                'role' => 'ops',
            ]
        );

        // ── Demo shipments (mirrors app.js demo array) ───────────────────────
        $shipments = [
            [
                'shipment' => [
                    'tracking_number' => 'GIT240915000123',
                    'customer_name' => 'John Adebayo',
                    'customer_phone' => '+234 801 234 5678',
                    'origin' => 'Abuja',
                    'destination' => 'Wuse, Abuja',
                    'package_description' => 'Laptop accessories',
                    'weight_kg' => 2.5,
                    'amount' => 5000,
                    'expected_at' => '2026-09-16',
                    'status' => 'IN_TRANSIT',
                ],
                'events' => [
                    ['status' => 'ORDER_CREATED',  'location' => 'Abuja',     'note' => 'Shipment created',                     'occurred_at' => '2026-09-14 08:20'],
                    ['status' => 'PICKED_UP',      'location' => 'Abuja',     'note' => 'Package picked up',                    'occurred_at' => '2026-09-14 14:10'],
                    ['status' => 'AT_ORIGIN_HUB',  'location' => 'Abuja Hub', 'note' => 'Package received at origin hub',       'occurred_at' => '2026-09-15 07:30'],
                    ['status' => 'IN_TRANSIT',     'location' => 'Abuja',     'note' => 'Package dispatched toward destination', 'occurred_at' => '2026-09-15 10:45'],
                ],
            ],
            [
                'shipment' => [
                    'tracking_number' => 'GIT240915000456',
                    'customer_name' => 'Ngozi Okafor',
                    'customer_phone' => '+234 803 555 1100',
                    'origin' => 'Lagos',
                    'destination' => 'Maitama, Abuja',
                    'package_description' => 'Fashion items',
                    'weight_kg' => 1.8,
                    'amount' => 8500,
                    'expected_at' => '2026-09-15',
                    'status' => 'OUT_FOR_DELIVERY',
                ],
                'events' => [
                    ['status' => 'ORDER_CREATED',       'location' => 'Lagos',         'note' => 'Shipment created',          'occurred_at' => '2026-09-13 09:00'],
                    ['status' => 'PICKED_UP',           'location' => 'Lagos',         'note' => 'Package picked up',         'occurred_at' => '2026-09-13 12:20'],
                    ['status' => 'AT_ORIGIN_HUB',       'location' => 'Lagos Hub',     'note' => 'Sorted at origin hub',      'occurred_at' => '2026-09-13 16:30'],
                    ['status' => 'IN_TRANSIT',          'location' => 'Lagos → Abuja', 'note' => 'In transit',                'occurred_at' => '2026-09-14 08:00'],
                    ['status' => 'AT_DESTINATION_HUB',  'location' => 'Abuja Hub',     'note' => 'Arrived at destination hub', 'occurred_at' => '2026-09-15 06:45'],
                    ['status' => 'OUT_FOR_DELIVERY',    'location' => 'Maitama',       'note' => 'Rider dispatched',          'occurred_at' => '2026-09-15 08:10'],
                ],
            ],
            [
                'shipment' => [
                    'tracking_number' => 'GIT240910000789',
                    'customer_name' => 'Ibrahim Musa',
                    'customer_phone' => '+234 806 333 2222',
                    'origin' => 'Abuja',
                    'destination' => 'Kaduna',
                    'package_description' => 'Documents',
                    'weight_kg' => 0.4,
                    'amount' => 3500,
                    'expected_at' => '2026-09-12',
                    'status' => 'DELIVERED',
                ],
                'events' => [
                    ['status' => 'ORDER_CREATED', 'location' => 'Abuja',           'note' => 'Shipment created',      'occurred_at' => '2026-09-10 08:00'],
                    ['status' => 'PICKED_UP',     'location' => 'Abuja',           'note' => 'Picked up',             'occurred_at' => '2026-09-10 10:00'],
                    ['status' => 'IN_TRANSIT',    'location' => 'Abuja → Kaduna', 'note' => 'In transit',             'occurred_at' => '2026-09-11 06:30'],
                    ['status' => 'DELIVERED',     'location' => 'Kaduna',          'note' => 'Delivered to customer', 'occurred_at' => '2026-09-12 13:20'],
                ],
            ],
            [
                'shipment' => [
                    'tracking_number' => 'GIT240908000321',
                    'customer_name' => 'Sarah Johnson',
                    'customer_phone' => '+234 809 111 4455',
                    'origin' => 'Abuja',
                    'destination' => 'Gwarinpa, Abuja',
                    'package_description' => 'Electronics',
                    'weight_kg' => 4.2,
                    'amount' => 7000,
                    'expected_at' => '2026-09-10',
                    'status' => 'DELIVERED',
                ],
                'events' => [
                    ['status' => 'ORDER_CREATED', 'location' => 'Abuja',    'note' => 'Shipment created',      'occurred_at' => '2026-09-08 08:00'],
                    ['status' => 'PICKED_UP',     'location' => 'Abuja',    'note' => 'Picked up',             'occurred_at' => '2026-09-08 11:10'],
                    ['status' => 'DELIVERED',     'location' => 'Gwarinpa', 'note' => 'Delivered to customer', 'occurred_at' => '2026-09-10 15:05'],
                ],
            ],
            [
                'shipment' => [
                    'tracking_number' => 'GIT240905000654',
                    'customer_name' => 'Chinedu Eze',
                    'customer_phone' => '+234 802 777 8899',
                    'origin' => 'Port Harcourt',
                    'destination' => 'Abuja',
                    'package_description' => 'Spare parts',
                    'weight_kg' => 7.1,
                    'amount' => 12000,
                    'expected_at' => '2026-09-08',
                    'status' => 'RETURNED',
                ],
                'events' => [
                    ['status' => 'ORDER_CREATED',      'location' => 'Port Harcourt',         'note' => 'Shipment created',     'occurred_at' => '2026-09-05 08:00'],
                    ['status' => 'PICKED_UP',          'location' => 'Port Harcourt',         'note' => 'Picked up',            'occurred_at' => '2026-09-05 10:00'],
                    ['status' => 'IN_TRANSIT',         'location' => 'Port Harcourt → Abuja', 'note' => 'In transit',           'occurred_at' => '2026-09-06 07:00'],
                    ['status' => 'DELIVERY_ATTEMPTED', 'location' => 'Abuja',                 'note' => 'Customer unavailable', 'occurred_at' => '2026-09-08 16:30'],
                    ['status' => 'RETURNED',           'location' => 'Abuja Hub',             'note' => 'Return initiated',     'occurred_at' => '2026-09-09 09:20'],
                ],
            ],
        ];

        foreach ($shipments as $row) {
            // Skip if already seeded
            if (Shipment::where('tracking_number', $row['shipment']['tracking_number'])->exists()) {
                continue;
            }

            $shipment = Shipment::create($row['shipment']);

            foreach ($row['events'] as $event) {
                ShipmentEvent::create(array_merge($event, ['shipment_id' => $shipment->id]));
            }
        }
    }
}
