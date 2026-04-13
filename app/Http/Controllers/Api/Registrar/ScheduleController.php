<?php

namespace App\Http\Controllers\Api\Registrar;

use App\Http\Controllers\Controller;
use App\Models\RecordSchedule;
use App\Models\RecordRequest;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    use LogsActivity;

    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('role:registrar');
    }

    /**
     * Set release schedule for a request
     */
    public function store(Request $request, $requestId)
    {
        $request->validate([
            'release_date' => 'required|date|after_or_equal:today',
            'release_time' => 'required',
            'location' => 'required|string',
        ]);

        $recordRequest = RecordRequest::findOrFail($requestId);
        
        // Check if schedule already exists
        $schedule = RecordSchedule::where('request_id', $requestId)->first();
        
        if ($schedule) {
            $schedule->update([
                'release_date' => $request->release_date,
                'release_time' => $request->release_time,
                'location' => $request->location,
                'status' => 'scheduled',
            ]);
            $message = 'Schedule updated successfully';
        } else {
            $schedule = RecordSchedule::create([
                'request_id' => $requestId,
                'release_date' => $request->release_date,
                'release_time' => $request->release_time,
                'location' => $request->location,
                'status' => 'scheduled',
            ]);
            $message = 'Schedule created successfully';
        }

        // Update request status to ready if not already
        if ($recordRequest->request_status !== 'ready') {
            $recordRequest->request_status = 'ready';
            $recordRequest->save();
        }

        $this->logActivity(
            'schedule',
            'schedule',
            "Set release schedule for request #{$requestId} on {$request->release_date} at {$request->release_time}",
            null,
            $schedule->toArray()
        );

        return response()->json([
            'message' => $message,
            'schedule' => $schedule
        ]);
    }

    /**
     * Get schedule for a request
     */
    public function show($requestId)
    {
        $schedule = RecordSchedule::where('request_id', $requestId)->first();
        return response()->json($schedule);
    }

    /**
     * Get all schedules (upcoming)
     */
    public function upcoming()
    {
        $schedules = RecordSchedule::with(['recordRequest.graduate.user'])
            ->where('release_date', '>=', now())
            ->orderBy('release_date', 'asc')
            ->get();

        return response()->json($schedules);
    }

    /**
     * Delete schedule
     */
    public function destroy($id)
    {
        $schedule = RecordSchedule::findOrFail($id);
        $requestId = $schedule->request_id;
        $schedule->delete();

        // Update request status back to approved
        $recordRequest = RecordRequest::find($requestId);
        if ($recordRequest && $recordRequest->request_status === 'ready') {
            $recordRequest->request_status = 'approved';
            $recordRequest->save();
        }

        $this->logActivity('delete', 'schedule', "Deleted schedule #{$id}");

        return response()->json(['message' => 'Schedule deleted successfully']);
    }
}