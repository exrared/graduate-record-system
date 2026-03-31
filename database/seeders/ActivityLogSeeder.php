<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ActivityLog;
use App\Models\User;
use Carbon\Carbon;

class ActivityLogSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();
        if ($user) {
            ActivityLog::create([
                'user_id' => $user->id,
                'activity' => 'Logged in',
                'ip_address' => '127.0.0.1',
                'device' => 'Chrome Browser',
                'log_date' => Carbon::now(),
            ]);

            ActivityLog::create([
                'user_id' => $user->id,
                'activity' => 'Viewed Student Records',
                'ip_address' => '127.0.0.1',
                'device' => 'Chrome Browser',
                'log_date' => Carbon::now(),
            ]);
        }
    }
}