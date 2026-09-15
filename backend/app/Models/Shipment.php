<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Shipment extends Model
{
    protected $fillable = [
        'tracking_number',
        'merchant_id',
        'hub_id',
        'rider_id',
        'customer_name',
        'customer_phone',
        'origin',
        'destination',
        'package_description',
        'weight_kg',
        'amount',
        'expected_at',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'weight_kg' => 'float',
            'amount' => 'float',
            'expected_at' => 'date:Y-m-d',
        ];
    }

    public function merchant(): BelongsTo
    {
        return $this->belongsTo(Merchant::class);
    }

    public function hub(): BelongsTo
    {
        return $this->belongsTo(Hub::class);
    }

    public function rider(): BelongsTo
    {
        return $this->belongsTo(Rider::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(ShipmentEvent::class)->orderBy('occurred_at');
    }

    public static function generateTrackingNumber(): string
    {
        $prefix = 'GIT'.now()->format('ymd');

        for ($i = 0; $i < 8; $i++) {
            $candidate = $prefix.str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

            if (! static::where('tracking_number', $candidate)->exists()) {
                return $candidate;
            }
        }

        return $prefix.strtoupper(Str::random(6));
    }
}
