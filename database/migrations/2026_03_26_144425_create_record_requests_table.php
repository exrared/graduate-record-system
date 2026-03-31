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
        Schema::create('record_requests', function (Blueprint $table) {
            $table->id();

            // Foreign key to graduates
            $table->foreignId('graduate_id')->constrained('graduates')->cascadeOnDelete();

            $table->string('request_type'); // e.g., Transcript, Diploma
            $table->text('purpose')->nullable(); // reason for request
            $table->integer('quantity')->default(1);
            $table->date('request_date')->useCurrent();
            $table->enum('request_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->date('schedule_date')->nullable(); // pickup or delivery
            $table->enum('payment_status', ['unpaid', 'paid'])->default('unpaid');
            $table->text('remarks')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('record_requests');
    }
};