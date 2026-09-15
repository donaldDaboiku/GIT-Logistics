<?php

namespace App\Http\Requests;

use App\Enums\ShipmentStatus;
use App\Models\Shipment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateShipmentStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::enum(ShipmentStatus::class)],
            'location' => ['required', 'string', 'max:255'],
            'note' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            /** @var Shipment $shipment */
            $shipment = $this->route('shipment');
            $current = ShipmentStatus::tryFrom((string) $shipment->status);
            $next = ShipmentStatus::tryFrom((string) $this->input('status'));

            if (! $current || ! $next) {
                return;
            }

            if ($current === $next) {
                $validator->errors()->add('status', 'Shipment is already in this status.');

                return;
            }

            if ($current->isTerminal()) {
                $validator->errors()->add(
                    'status',
                    "Cannot update a {$current->value} shipment.",
                );

                return;
            }

            if (! $current->canTransitionTo($next)) {
                $allowed = implode(', ', $current->allowedNextValues()) ?: 'none';
                $validator->errors()->add(
                    'status',
                    "Cannot move from {$current->value} to {$next->value}. Allowed: {$allowed}.",
                );
            }
        });
    }
}
