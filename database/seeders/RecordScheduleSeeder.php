<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RecordSchedule;
use App\Models\RecordRequest;
use Carbon\Carbon;

class RecordScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $request = RecordRequest::first();

        if ($request) {
            RecordSchedule::create([
                'request_id' => $request->id,
                'release_date' => Carbon::now()->addDays(3)->toDateString(),
                'release_time' => '10:00:00',
                'location' => 'Main Office',
                'status' => 'pending',
            ]);

            RecordSchedule::create([
                'request_id' => $request->id,
                'release_date' => Carbon::now()->addDays(5)->toDateString(),
                'release_time' => '14:00:00',
                'location' => 'Records Room',
                'status' => 'pending',
            ]);
        }
    }
}