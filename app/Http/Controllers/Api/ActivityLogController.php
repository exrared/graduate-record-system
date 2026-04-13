<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Validator;

class ActivityLogController extends Controller
{
    // List all activity logs (Admin only)
    public function index(Request $request)
    {
        $query = ActivityLog::with('user');
        
        // Filter by user role
        if ($request->user_role) {
            $query->where('user_role', $request->user_role);
        }
        
        // Filter by action
        if ($request->action) {
            $query->where('action', $request->action);
        }
        
        // Filter by module
        if ($request->module) {
            $query->where('module', $request->module);
        }
        
        // Filter by date range
        if ($request->start_date) {
            $query->whereDate('log_date', '>=', $request->start_date);
        }
        if ($request->end_date) {
            $query->whereDate('log_date', '<=', $request->end_date);
        }
        
        // Sort
        $sortBy = $request->sort_by ?? 'log_date';
        $sortOrder = $request->sort_order ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);
        
        // Paginate
        $perPage = $request->per_page ?? 50;
        $logs = $query->paginate($perPage);
        
        return response()->json($logs);
    }
    
    // Get logs for registrar
    public function registrarLogs(Request $request)
    {
        $query = ActivityLog::with('user')
            ->where('user_role', 'registrar')
            ->orWhere('user_role', 'admin');
        
        if ($request->action) {
            $query->where('action', $request->action);
        }
        
        if ($request->module) {
            $query->where('module', $request->module);
        }
        
        $logs = $query->orderBy('log_date', 'desc')
            ->paginate(50);
        
        return response()->json($logs);
    }
    
    // Get logs for specific user
    public function userLogs($userId, Request $request)
    {
        $query = ActivityLog::with('user')
            ->where('user_id', $userId);
        
        if ($request->action) {
            $query->where('action', $request->action);
        }
        
        $logs = $query->orderBy('log_date', 'desc')
            ->paginate(50);
        
        return response()->json($logs);
    }

    // Store a new activity log
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'action' => 'required|string',
            'module' => 'required|string',
            'description' => 'required|string',
            'ip_address' => 'nullable|string',
            'device' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $log = ActivityLog::create([
            'user_id' => $request->user_id,
            'user_role' => $request->user_role ?? 'unknown',
            'action' => $request->action,
            'module' => $request->module,
            'description' => $request->description,
            'activity' => $request->description,
            'old_data' => $request->old_data,
            'new_data' => $request->new_data,
            'ip_address' => $request->ip_address ?? request()->ip(),
            'device' => $request->device ?? request()->userAgent(),
            'user_agent' => $request->user_agent ?? request()->userAgent(),
            'log_date' => now(),
        ]);

        return response()->json($log, 201);
    }

    // Show a single log
    public function show($id)
    {
        $log = ActivityLog::with('user')->findOrFail($id);
        return response()->json($log);
    }

    // Export logs to CSV
    public function export(Request $request)
    {
        $query = ActivityLog::with('user');
        
        if ($request->user_role) {
            $query->where('user_role', $request->user_role);
        }
        
        if ($request->start_date) {
            $query->whereDate('log_date', '>=', $request->start_date);
        }
        if ($request->end_date) {
            $query->whereDate('log_date', '<=', $request->end_date);
        }
        
        $logs = $query->orderBy('log_date', 'desc')->get();
        
        $filename = "activity_logs_" . date('Y-m-d_His') . ".csv";
        $handle = fopen('php://temp', 'w+');
        
        // Headers
        fputcsv($handle, ['ID', 'User', 'Role', 'Action', 'Module', 'Description', 'IP Address', 'Date']);
        
        foreach ($logs as $log) {
            fputcsv($handle, [
                $log->id,
                $log->user->name ?? 'N/A',
                $log->user_role,
                $log->action,
                $log->module,
                $log->description,
                $log->ip_address,
                $log->log_date,
            ]);
        }
        
        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);
        
        return response($csv, 200)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', "attachment; filename=$filename");
    }

    // Delete old logs (Admin only)
    public function clearOldLogs(Request $request)
    {
        $days = $request->days ?? 30;
        $deleted = ActivityLog::where('log_date', '<', now()->subDays($days))->delete();
        
        return response()->json([
            'message' => "Deleted {$deleted} old activity logs",
            'deleted_count' => $deleted
        ]);
    }
}