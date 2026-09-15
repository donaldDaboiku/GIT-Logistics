<?php

namespace Tests\Feature;

use App\Enums\ShipmentStatus;
use App\Models\Shipment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ShipmentApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_tracking_returns_shipment_without_phone(): void
    {
        $shipment = $this->makeShipment();

        $this->getJson('/api/v1/shipments/'.$shipment->tracking_number)
            ->assertOk()
            ->assertJsonPath('data.tracking_number', $shipment->tracking_number)
            ->assertJsonPath('data.status', ShipmentStatus::InTransit->value)
            ->assertJsonMissingPath('data.phone');
    }

    public function test_public_tracking_is_case_insensitive(): void
    {
        $this->makeShipment(['tracking_number' => 'GIT240915000123']);

        $this->getJson('/api/v1/shipments/git240915000123')
            ->assertOk()
            ->assertJsonPath('data.tracking_number', 'GIT240915000123');
    }

    public function test_unknown_tracking_number_returns_not_found(): void
    {
        $this->getJson('/api/v1/shipments/GIT000000000000')->assertNotFound();
    }

    public function test_listing_shipments_requires_authentication(): void
    {
        $this->getJson('/api/v1/shipments')->assertUnauthorized();
    }

    public function test_authenticated_user_can_list_and_create_shipments(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/v1/shipments', [
            'customer' => 'Ada Lovelace',
            'phone' => '+234 801 000 1111',
            'origin' => 'Abuja',
            'destination' => 'Lagos',
            'package' => 'Documents',
            'weight' => 1.5,
            'amount' => 4500,
            'expected_at' => now()->addDay()->toDateString(),
        ])->assertCreated()
            ->assertJsonPath('data.customer', 'Ada Lovelace')
            ->assertJsonPath('data.status', ShipmentStatus::OrderCreated->value)
            ->assertJsonPath('data.events.0.status', ShipmentStatus::OrderCreated->value);

        $this->getJson('/api/v1/shipments')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_store_rejects_invalid_payload(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/v1/shipments', [
            'customer' => '',
            'weight' => 0,
            'amount' => -10,
            'expected_at' => now()->subDay()->toDateString(),
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['customer', 'phone', 'origin', 'destination', 'package', 'weight', 'amount', 'expected_at']);
    }

    public function test_status_update_rejects_unknown_status(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $shipment = $this->makeShipment();

        $this->patchJson("/api/v1/shipments/{$shipment->id}/status", [
            'status' => 'NOT_A_REAL_STATUS',
            'location' => 'Abuja Hub',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['status']);
    }

    public function test_authenticated_user_can_update_status(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $shipment = $this->makeShipment();

        $this->patchJson("/api/v1/shipments/{$shipment->id}/status", [
            'status' => ShipmentStatus::Delivered->value,
            'location' => 'Wuse, Abuja',
            'note' => 'Handed to customer',
        ])->assertOk()
            ->assertJsonPath('data.status', ShipmentStatus::Delivered->value)
            ->assertJsonPath('data.events.1.note', 'Handed to customer');
    }

    /** @param  array<string, mixed>  $overrides */
    private function makeShipment(array $overrides = []): Shipment
    {
        $shipment = Shipment::create(array_merge([
            'tracking_number' => 'GIT240915000123',
            'customer_name' => 'John Adebayo',
            'customer_phone' => '+234 801 234 5678',
            'origin' => 'Abuja',
            'destination' => 'Wuse, Abuja',
            'package_description' => 'Laptop accessories',
            'weight_kg' => 2.5,
            'amount' => 5000,
            'expected_at' => now()->addDay()->toDateString(),
            'status' => ShipmentStatus::InTransit->value,
        ], $overrides));

        $shipment->events()->create([
            'status' => ShipmentStatus::OrderCreated->value,
            'location' => 'Abuja',
            'note' => 'Shipment created',
            'occurred_at' => now()->subDay(),
        ]);

        return $shipment;
    }
}
