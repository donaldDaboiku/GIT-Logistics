<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hubs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('city');
            $table->string('address')->nullable();
            $table->timestamps();
        });

        Schema::create('riders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hub_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('phone')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['hub_id', 'is_active']);
        });

        Schema::table('shipments', function (Blueprint $table) {
            $table->foreignId('hub_id')->nullable()->after('merchant_id')->constrained()->nullOnDelete();
            $table->foreignId('rider_id')->nullable()->after('hub_id')->constrained()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('shipments', function (Blueprint $table) {
            $table->dropConstrainedForeignId('rider_id');
            $table->dropConstrainedForeignId('hub_id');
        });

        Schema::dropIfExists('riders');
        Schema::dropIfExists('hubs');
    }
};
