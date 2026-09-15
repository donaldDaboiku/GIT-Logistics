<?php

namespace Tests\Feature;

use App\Enums\ShipmentStatus;
use App\Models\Shipment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DashboardApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_stats_require_authentication(): void
    {
        $this->getJson('/api/v1/dashboard/stats')->assertUnauthorized();
    }

    public function test_stats_count_shipments_by_status(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->createShipment(ShipmentStatus::InTransit, 'GIT1');
        $this->createShipment(ShipmentStatus::InTransit, 'GIT2');
        $this->createShipment(ShipmentStatus::Delivered, 'GIT3');
        $this->createShipment(ShipmentStatus::Returned, 'GIT4');

        $this->getJson('/api/v1/dashboard/stats')
            ->assertOk()
            ->assertJsonPath('data.total', 4)
            ->assertJsonPath('data.in_transit', 2)
            ->assertJsonPath('data.delivered', 1)
            ->assertJsonPath('data.returned', 1)
            ->assertJsonPath('data.out_for_delivery', 0);
    }

    private function createShipment(ShipmentStatus $status, string $tracking): void
    {
        Shipment::create([
            'tracking_number' => $tracking,
            'customer_name' => 'Test Customer',
            'customer_phone' => '+234 800 000 0000',
            'origin' => 'Abuja',
            'destination' => 'Lagos',
            'package_description' => 'Test parcel',
            'weight_kg' => 1,
            'amount' => 1000,
            'expected_at' => now()->toDateString(),
            'status' => $status->value,
        ]);
    }
}
