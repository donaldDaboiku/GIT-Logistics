<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreShipmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, list<string>> */
    public function rules(): array
    {
        return [
            'customer' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'origin' => ['required', 'string', 'max:255'],
            'destination' => ['required', 'string', 'max:255'],
            'package' => ['required', 'string', 'max:500'],
            'weight' => ['required', 'numeric', 'min:0.01', 'max:99999'],
            'amount' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
            'expected_at' => ['required', 'date', 'after_or_equal:today'],
        ];
    }
}
