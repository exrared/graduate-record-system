<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StudentRecord;
use App\Models\Graduate;
use Carbon\Carbon;

class StudentRecordSeeder extends Seeder
{
    public function run(): void
    {
        $graduate = Graduate::first(); // pick first graduate

        if ($graduate) {
            StudentRecord::create([
                'graduate_id' => $graduate->id,
                'record_type' => 'Transcript',
                'description' => 'Official Transcript of Records',
                'file_path' => 'uploads/student_records/john_doe_transcript.pdf',
                'uploaded_by' => 'admin',
                'date_uploaded' => Carbon::now(),
                'status' => 1,
            ]);

            StudentRecord::create([
                'graduate_id' => $graduate->id,
                'record_type' => 'Diploma',
                'description' => 'Diploma Certificate',
                'file_path' => 'uploads/student_records/john_doe_diploma.pdf',
                'uploaded_by' => 'admin',
                'date_uploaded' => Carbon::now(),
                'status' => 1,
            ]);
        }
    }
}