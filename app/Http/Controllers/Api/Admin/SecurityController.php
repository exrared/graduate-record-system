<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SecurityController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('role:admin');
    }

    /**
     * Get security alerts
     */
    public function alerts()
    {
        $alerts = [
            [
                'id' => 1,
                'severity' => 'high',
                'message' => 'Multiple failed login attempts detected',
                'time' => now()->subMinutes(30)->toDateTimeString(),
                'source' => request()->ip(),
                'status' => 'active'
            ],
            [
                'id' => 2,
                'severity' => 'medium',
                'message' => 'Suspicious activity detected from new device',
                'time' => now()->subHours(2)->toDateTimeString(),
                'source' => '192.168.1.100',
                'status' => 'active'
            ],
            [
                'id' => 3,
                'severity' => 'low',
                'message' => 'Password change request',
                'time' => now()->subHours(5)->toDateTimeString(),
                'source' => '10.0.0.5',
                'status' => 'resolved'
            ]
        ];
        
        return response()->json($alerts);
    }

    /**
     * Get unauthorized access attempts
     */
    public function unauthorizedAttempts()
    {
        $attempts = [
            [
                'id' => 1,
                'ip' => '45.33.22.11',
                'attempt_time' => now()->subMinutes(45)->toDateTimeString(),
                'status' => 'blocked',
                'location' => 'Unknown'
            ],
            [
                'id' => 2,
                'ip' => '103.45.67.89',
                'attempt_time' => now()->subHours(3)->toDateTimeString(),
                'status' => 'blocked',
                'location' => 'Philippines'
            ]
        ];
        
        return response()->json($attempts);
    }

    /**
     * Get system activity logs
     */
    public function activityLogs()
    {
        $activities = [
            [
                'id' => 1,
                'user' => auth()->user()?->name ?? 'Admin',
                'action' => 'Logged in',
                'time' => now()->subMinutes(10)->toDateTimeString(),
                'ip' => request()->ip()
            ],
            [
                'id' => 2,
                'user' => 'Registrar User',
                'action' => 'Updated student record',
                'time' => now()->subHours(1)->toDateTimeString(),
                'ip' => '192.168.1.2'
            ],
            [
                'id' => 3,
                'user' => 'Admin User',
                'action' => 'Created new registrar account',
                'time' => now()->subHours(3)->toDateTimeString(),
                'ip' => '192.168.1.1'
            ]
        ];
        
        return response()->json($activities);
    }
}