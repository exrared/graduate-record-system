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
        Schema::create('graduates', function (Blueprint $table) {
            $table->id();

            // رابطه to users table
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            // Student Info
            $table->string('student_id')->unique();
            $table->string('firstname');
            $table->string('middlename')->nullable();
            $table->string('lastname');
            $table->string('suffix')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();

            // Personal Info
            $table->date('birthdate')->nullable();
            $table->string('place_of_birth')->nullable();
            $table->string('civil_status')->nullable();
            $table->string('nationality')->nullable();
            $table->string('religion')->nullable();

            // Address
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('postal_code')->nullable();

            // Contact
            $table->string('contact_number')->nullable();
            $table->string('email')->nullable();

            // Academic Info
            $table->string('course');
            $table->string('department');
            $table->year('year_graduated')->nullable();
            $table->string('honors')->nullable();

            // System Fields
            $table->boolean('status')->default(1);
            $table->string('profile_picture')->nullable();

            $table->timestamp('date_created')->useCurrent();
            $table->timestamp('date_updated')->nullable()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('graduates');
    }
};