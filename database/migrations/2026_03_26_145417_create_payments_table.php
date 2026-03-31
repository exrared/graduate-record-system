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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            // Foreign key to record_requests
            $table->foreignId('request_id')->constrained('record_requests')->cascadeOnDelete();

            $table->decimal('amount', 10, 2);
            $table->string('payment_method'); // e.g., Cash, GCash, Credit Card
            $table->string('reference_number')->nullable(); // transaction reference
            $table->date('payment_date')->useCurrent();
            $table->enum('payment_status', ['unpaid', 'paid'])->default('unpaid');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};