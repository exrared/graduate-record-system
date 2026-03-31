<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RecordSchedule;
use Illuminate\Support\Facades\Validator;

class RecordScheduleController extends Controller
{
    // GET all record schedules
    public function index()
    {
        return response()->json(RecordSchedule::with('recordRequest')->get());
    }

    // STORE a new record schedule
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'request_id' => 'required|exists:record_requests,id',
            'release_date' => 'required|date',
            'release_time' => 'required|date_format:H:i',
            'location' => 'nullable|string',
            'status' => 'sometimes|in:pending,released,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $schedule = RecordSchedule::create($validator->validated());

        return response()->json($schedule, 201);
    }

    // SHOW a single record schedule
    public function show($id)
    {
        $schedule = RecordSchedule::with('recordRequest')->findOrFail($id);
        return response()->json($schedule);
    }

    // UPDATE a record schedule
    public function update(Request $request, $id)
    {
        $schedule = RecordSchedule::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'request_id' => 'sometimes|exists:record_requests,id',
            'release_date' => 'sometimes|date',
            'release_time' => 'sometimes|date_format:H:i',
            'location' => 'nullable|string',
            'status' => 'sometimes|in:pending,released,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $schedule->update($validator->validated());

        return response()->json($schedule);
    }

    // DELETE a record schedule
    public function destroy($id)
    {
        $schedule = RecordSchedule::findOrFail($id);
        $schedule->delete();

        return response()->json(['message' => 'Record schedule deleted']);
    }
}