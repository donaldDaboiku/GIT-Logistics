<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_number')->unique();
            $table->foreignId('merchant_id')->nullable()->constrained()->nullOnDelete();
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('origin');
            $table->string('destination');
            $table->string('package_description');
            $table->decimal('weight_kg', 8, 2)->default(1);
            $table->decimal('amount', 12, 2)->default(0);
            $table->date('expected_at')->nullable();
            $table->string('status')->default('ORDER_CREATED');
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
