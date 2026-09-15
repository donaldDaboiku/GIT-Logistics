<?php

namespace App\Http\Requests;

use App\Enums\ShipmentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
}
