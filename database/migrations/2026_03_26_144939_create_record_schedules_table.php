<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('record_schedules', function (Blueprint $table) {
            $table->id();

            // Foreign key to record_requests
            $table->foreignId('request_id')->constrained('record_requests')->cascadeOnDelete();

            $table->date('release_date');
            $table->time('release_time');
            $table->string('location')->nullable();
            $table->enum('status', ['pending', 'released', 'cancelled'])->default('pending');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('record_schedules');
    }
};