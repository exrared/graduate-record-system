<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payment;
use App\Models\RecordRequest;
use Carbon\Carbon;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $request = RecordRequest::first();

        if ($request) {
            Payment::create([
                'request_id' => $request->id,
                'amount' => 500.00,
                'payment_method' => 'Cash',
                'reference_number' => 'CASH123456',
                'payment_date' => Carbon::now(),
                'payment_status' => 'paid',
            ]);

            Payment::create([
                'request_id' => $request->id,
                'amount' => 300.00,
                'payment_method' => 'GCash',
                'reference_number' => 'GC123456789',
                'payment_date' => Carbon::now(),
                'payment_status' => 'unpaid',
            ]);
        }
    }
}