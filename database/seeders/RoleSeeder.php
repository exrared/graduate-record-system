<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use Carbon\Carbon;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        Role::insert([
            [
                'role_name' => 'Admin',
                'description' => 'Full system access',
                'status' => 1,
                'date_created' => Carbon::now(),
            ],
            [
                'role_name' => 'User',
                'description' => 'Regular user access',
                'status' => 1,
                'date_created' => Carbon::now(),
            ],
            [
                'role_name' => 'Guest',
                'description' => 'Limited access',
                'status' => 0,
                'date_created' => Carbon::now(),
            ],
        ]);
    }
}