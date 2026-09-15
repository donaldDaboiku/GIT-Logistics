<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Hub;
use Illuminate\Http\JsonResponse;

class HubController extends Controller
{
    public function index(): JsonResponse
    {
        $hubs = Hub::with(['riders' => fn ($q) => $q->where('is_active', true)->orderBy('name')])
            ->orderBy('city')
            ->orderBy('name')
            ->get()
            ->map(fn (Hub $hub) => [
                'id' => $hub->id,
                'name' => $hub->name,
                'city' => $hub->city,
                'address' => $hub->address,
                'riders' => $hub->riders->map(fn ($rider) => [
                    'id' => $rider->id,
                    'name' => $rider->name,
                    'phone' => $rider->phone,
                    'hub_id' => $rider->hub_id,
                ])->values()->all(),
            ]);

        return response()->json(['data' => $hubs]);
    }
}
