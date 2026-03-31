<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Validator;

class ActivityLogController extends Controller
{
    // List all activity logs
    public function index()
    {
        return response()->json(ActivityLog::with('user')->get());
    }

    // Store a new activity log
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'activity' => 'required|string',
            'ip_address' => 'nullable|string',
            'device' => 'nullable|string',
            'log_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $log = ActivityLog::create(array_merge(
            $validator->validated(),
            ['log_date' => $request->log_date ?? now()]
        ));

        return response()->json($log, 201);
    }

    // Show a single log
    public function show($id)
    {
        return response()->json(ActivityLog::with('user')->findOrFail($id));
    }

    // Update a log
    public function update(Request $request, $id)
    {
        $log = ActivityLog::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'user_id' => 'sometimes|exists:users,id',
            'activity' => 'sometimes|string',
            'ip_address' => 'nullable|string',
            'device' => 'nullable|string',
            'log_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $log->update(array_merge(
            $validator->validated(),
            ['log_date' => $request->log_date ?? $log->log_date]
        ));

        return response()->json($log);
    }

    // Delete a log
    public function destroy($id)
    {
        $log = ActivityLog::findOrFail($id);
        $log->delete();

        return response()->json(['message' => 'Activity log deleted']);
    }
}