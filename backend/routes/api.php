<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\HubController;
use App\Http\Controllers\Api\V1\ShipmentController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login'])
        ->middleware('throttle:5,1');

    Route::get('/shipments/{tracking}', [ShipmentController::class, 'show'])
        ->middleware('throttle:30,1')
        ->where('tracking', '[A-Za-z0-9]{6,32}');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        Route::get('/shipments', [ShipmentController::class, 'index']);
        Route::post('/shipments', [ShipmentController::class, 'store']);
        Route::patch('/shipments/{shipment}/status', [ShipmentController::class, 'updateStatus']);
        Route::patch('/shipments/{shipment}/assignment', [ShipmentController::class, 'assign']);

        Route::get('/hubs', [HubController::class, 'index']);

        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    });
});
