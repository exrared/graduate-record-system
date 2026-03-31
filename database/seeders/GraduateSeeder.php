<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Graduate;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class GraduateSeeder extends Seeder
{
    public function run(): void
    {
        // Get a user or create one if none exists
        $user = User::first();
        
        if (!$user) {
            $user = User::create([
                'name' => 'John Doe',
                'username' => 'johndoe',
                'email' => 'john.doe@example.com',
                'password' => Hash::make('password'),
                'role' => 'user',  // or 'admin' depending on your roles
                'status' => 1,      // 1 for active, 0 for inactive
                'last_login' => Carbon::now(), // or null if you prefer
            ]);
        }

       Graduate::updateOrCreate(
    ['student_id' => 'STU1001'], // unique field
    [
        'user_id' => 1,
        'firstname' => 'John',
        'middlename' => 'A.',
        'lastname' => 'Doe',
        'suffix' => null,
        'gender' => 'male',
        'birthdate' => '1995-05-12',
        'place_of_birth' => 'Cityville',
        'civil_status' => 'single',
        'nationality' => 'Filipino',
        'religion' => 'None',
        'address' => '123 Main Street',
        'city' => 'Metro City',
        'province' => 'Metro Province',
        'postal_code' => '1000',
        'contact_number' => '09171234567',
        'email' => 'john.doe@example.com',
        'course' => 'BS Computer Science',
        'department' => 'IT Department',
        'year_graduated' => 2017,
        'honors' => 'Cum Laude',
        'status' => 1,
        'profile_picture' => null,
        'date_created' => now(),
        'date_updated' => now(),
    ]
);
    }
}