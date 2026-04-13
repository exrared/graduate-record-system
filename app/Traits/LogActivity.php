<?php

namespace App\Traits;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Request;

trait LogsActivity
{
    protected function logActivity($action, $module, $description, $oldData = null, $newData = null)
    {
        try {
            ActivityLog::create([
                'user_id' => auth()->id(),
                'user_role' => auth()->user()->role ?? 'registrar',
                'action' => $action,
                'module' => $module,
                'description' => $description,
                'activity' => $description,
                'old_data' => $oldData ? json_encode($oldData) : null,
                'new_data' => $newData ? json_encode($newData) : null,
                'ip_address' => Request::ip(),
                'device' => Request::userAgent(),
                'user_agent' => Request::userAgent(),
                'log_date' => now(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to log activity: ' . $e->getMessage());
        }
    }
}