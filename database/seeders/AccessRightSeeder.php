<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AccessRight;
use Carbon\Carbon;

class AccessRightSeeder extends Seeder  // Changed to singular "Right"
{
    public function run(): void
    {
        $accessRights = [
            [
                'access_name' => 'Manage Users',
                'description' => 'Allows managing users',
                'status' => 1,
            ],
            [
                'access_name' => 'Manage Graduates',
                'description' => 'Allows managing graduates',
                'status' => 1,
            ],
            // Add more access rights as needed
        ];

        foreach ($accessRights as $right) {
            AccessRight::firstOrCreate(
                ['access_name' => $right['access_name']],
                [
                    'description' => $right['description'],
                    'status' => $right['status'],
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]
            );
        }
    }
}