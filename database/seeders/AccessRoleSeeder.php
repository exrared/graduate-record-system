<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AccessRole;
use App\Models\Role;
use App\Models\AccessRight;

class AccessRoleSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('role_name', 'Admin')->first();
        $accessRights = AccessRight::all();

        if ($adminRole && $accessRights) {
            foreach ($accessRights as $accessRight) {
                AccessRole::create([
                    'role_id' => $adminRole->id,
                    'accessright_id' => $accessRight->id,
                    'status' => 1,
                ]);
            }
        }
    }
}