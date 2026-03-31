<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $this->call([
             RoleSeeder::class,
             GraduateSeeder::class,
             RecordRequestSeeder::class,
             RecordScheduleSeeder::class,
             PaymentSeeder::class,
             StudentRecordSeeder::class,
             ActivityLogSeeder::class,
             AccessRightSeeder::class,
             AccessRoleSeeder::class,
             AdminSeeder::class,
        ]);

        // Admin account
        User::updateOrCreate(
        ['email' => 'admin@example.com'], // unique field
        [
            'name' => 'Admin',
            'username' => 'admin',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 1,
        ]
        
    );

        // Optional test user
        //User::factory()->create([
            //'name' => 'Test User',
            //'email' => 'test@example.com',
        //]);
    }
}