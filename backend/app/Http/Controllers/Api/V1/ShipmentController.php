<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ShipmentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\AssignShipmentRequest;
use App\Http\Requests\StoreShipmentRequest;
use App\Http\Requests\UpdateShipmentStatusRequest;
use App\Models\Shipment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ShipmentController extends Controller
{
    private const WITH = ['events', 'hub', 'rider'];

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::enum(ShipmentStatus::class)],
        ]);

        $query = Shipment::with(self::WITH)->latest();

        $query->when($request->query('search'), function ($q, string $search) {
            $q->where(function ($inner) use ($search) {
                $inner->where('tracking_number', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%")
                    ->orWhere('destination', 'like', "%{$search}%");
            });
        });

        $query->when($request->query('status'), fn ($q, string $status) => $q->where('status', $status));

        return response()->json([
            'data' => $query->get()->map(fn (Shipment $s) => $this->format($s))->values(),
        ]);
    }

    public function show(string $tracking): JsonResponse
    {
        $shipment = Shipment::with(self::WITH)
            ->where('tracking_number', strtoupper(trim($tracking)))
            ->firstOrFail();

        return response()->json(['data' => $this->format($shipment, public: true)]);
    }

    public function store(StoreShipmentRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $shipment = DB::transaction(function () use ($validated) {
            $shipment = Shipment::create([
                'tracking_number' => Shipment::generateTrackingNumber(),
                'customer_name' => $validated['customer'],
                'customer_phone' => $validated['phone'],
                'origin' => $validated['origin'],
                'destination' => $validated['destination'],
                'package_description' => $validated['package'],
                'weight_kg' => $validated['weight'],
                'amount' => $validated['amount'],
                'expected_at' => $validated['expected_at'],
                'status' => ShipmentStatus::OrderCreated->value,
            ]);

            $shipment->events()->create([
                'status' => ShipmentStatus::OrderCreated->value,
                'location' => $validated['origin'],
                'note' => 'Shipment created',
                'occurred_at' => now(),
            ]);

            return $shipment->load(self::WITH);
        });

        return response()->json(['data' => $this->format($shipment)], 201);
    }

    public function updateStatus(UpdateShipmentStatusRequest $request, Shipment $shipment): JsonResponse
    {
        $validated = $request->validated();

        $shipment = DB::transaction(function () use ($shipment, $validated) {
            $shipment->update(['status' => $validated['status']]);

            $shipment->events()->create([
                'status' => $validated['status'],
                'location' => $validated['location'],
                'note' => $validated['note'] ?? null,
                'occurred_at' => now(),
            ]);

            return $shipment->load(self::WITH);
        });

        return response()->json(['data' => $this->format($shipment)]);
    }

    public function assign(AssignShipmentRequest $request, Shipment $shipment): JsonResponse
    {
        $validated = $request->validated();
        $hubId = $validated['hub_id'] ?? null;
        $riderId = $hubId ? ($validated['rider_id'] ?? null) : null;

        $shipment->update([
            'hub_id' => $hubId,
            'rider_id' => $riderId,
        ]);

        $shipment->load(self::WITH);

        $noteParts = [];
        if ($shipment->hub) {
            $noteParts[] = 'Hub: '.$shipment->hub->name;
        }
        if ($shipment->rider) {
            $noteParts[] = 'Rider: '.$shipment->rider->name;
        }

        if ($noteParts !== []) {
            $shipment->events()->create([
                'status' => $shipment->status,
                'location' => $shipment->hub?->name ?? $shipment->destination,
                'note' => 'Assignment updated — '.implode(', ', $noteParts),
                'occurred_at' => now(),
            ]);
            $shipment->load(self::WITH);
        }

        return response()->json(['data' => $this->format($shipment)]);
    }

    /** @return array<string, mixed> */
    private function format(Shipment $s, bool $public = false): array
    {
        $data = [
            'id' => $s->id,
            'tracking_number' => $s->tracking_number,
            'customer' => $s->customer_name,
            'phone' => $s->customer_phone,
            'origin' => $s->origin,
            'destination' => $s->destination,
            'package' => $s->package_description,
            'weight' => $s->weight_kg,
            'amount' => $s->amount,
            'expected_at' => $s->expected_at?->format('Y-m-d'),
            'status' => $s->status,
            'created_at' => $s->created_at?->toIso8601String(),
            'hub' => $s->hub ? [
                'id' => $s->hub->id,
                'name' => $s->hub->name,
                'city' => $s->hub->city,
            ] : null,
            'rider' => $s->rider ? [
                'id' => $s->rider->id,
                'name' => $s->rider->name,
                'hub_id' => $s->rider->hub_id,
            ] : null,
            'events' => $s->events->map(fn ($e) => [
                'status' => $e->status,
                'location' => $e->location,
                'note' => $e->note ?? '',
                'occurred_at' => $e->occurred_at?->format('Y-m-d H:i') ?? '',
            ])->values()->all(),
        ];

        if ($public) {
            unset($data['phone']);
        }

        return $data;
    }
}
