<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RecordRequest;
use App\Models\Graduate;
use Carbon\Carbon;

class RecordRequestSeeder extends Seeder
{
    public function run(): void
    {
        $graduate = Graduate::first();

        if ($graduate) {
            RecordRequest::create([
                'graduate_id' => $graduate->id,
                'request_type' => 'Transcript',
                'purpose' => 'Employment application',
                'quantity' => 2,
                'request_date' => Carbon::now(),
                'request_status' => 'pending',
                'schedule_date' => Carbon::now()->addDays(3),
                'payment_status' => 'unpaid',
                'remarks' => 'Urgent request',
            ]);

            RecordRequest::create([
                'graduate_id' => $graduate->id,
                'request_type' => 'Diploma',
                'purpose' => 'Personal copy',
                'quantity' => 1,
                'request_date' => Carbon::now(),
                'request_status' => 'approved',
                'schedule_date' => Carbon::now()->addDays(5),
                'payment_status' => 'paid',
                'remarks' => null,
            ]);
        }
    }
}