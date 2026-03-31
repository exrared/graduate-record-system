<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User; // ✅ Import the User model
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin Account
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'username' => 'admin',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'status' => 1,
            ]
        );

        // Create Regular Graduate User
        User::updateOrCreate(
            ['email' => 'jvayunan@example.com'],
            [
                'name' => 'Jvayunan',
                'username' => 'Jvayunan',
                'password' => Hash::make('1234567'),
                'role' => 'user',
                'status' => 1,
            ]
        );
    }
}