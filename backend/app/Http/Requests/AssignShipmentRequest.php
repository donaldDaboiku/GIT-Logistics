<?php

namespace App\Http\Requests;

use App\Models\Rider;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class AssignShipmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, list<string>> */
    public function rules(): array
    {
        return [
            'hub_id' => ['nullable', 'integer', 'exists:hubs,id'],
            'rider_id' => ['nullable', 'integer', 'exists:riders,id'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $hubId = $this->input('hub_id');
            $riderId = $this->input('rider_id');

            if ($riderId && ! $hubId) {
                $validator->errors()->add('hub_id', 'A hub is required when assigning a rider.');

                return;
            }

            if ($riderId && $hubId) {
                $rider = Rider::query()->find($riderId);
                if (! $rider || (int) $rider->hub_id !== (int) $hubId) {
                    $validator->errors()->add('rider_id', 'Selected rider does not belong to the chosen hub.');
                } elseif (! $rider->is_active) {
                    $validator->errors()->add('rider_id', 'Selected rider is inactive.');
                }
            }
        });
    }
}
