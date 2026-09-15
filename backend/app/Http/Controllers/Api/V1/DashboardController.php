<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ShipmentStatus;
use App\Http\Controllers\Controller;
use App\Models\Shipment;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $byStatus = Shipment::query()
            ->select('status')
            ->selectRaw('COUNT(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        return response()->json([
            'data' => [
                'total' => (int) $byStatus->sum(),
                'in_transit' => (int) ($byStatus[ShipmentStatus::InTransit->value] ?? 0),
                'out_for_delivery' => (int) ($byStatus[ShipmentStatus::OutForDelivery->value] ?? 0),
                'delivered' => (int) ($byStatus[ShipmentStatus::Delivered->value] ?? 0),
                'returned' => (int) ($byStatus[ShipmentStatus::Returned->value] ?? 0),
            ],
        ]);
    }
}
