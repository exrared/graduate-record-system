<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\RecordRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('role:admin');
    }

    /**
     * Display admin dashboard
     */
    public function index()
    {
        try {
            $stats = [
                'total_users' => User::count(),
                'total_admins' => User::where('role', 'admin')->count(),
                'total_registrars' => User::where('role', 'registrar')->count(),
                'total_graduates' => User::whereIn('role', ['user', 'graduate'])->count(),
                'total_requests' => RecordRequest::count(),
                'pending_requests' => RecordRequest::where('request_status', 'pending')->count(),
                'completed_requests' => RecordRequest::where('request_status', 'completed')->count(),
                'active_users' => User::where('status', 1)->count(),
                'inactive_users' => User::where('status', 0)->count(),
                'total_revenue' => 0, // Add payment model later
                'total_records' => 0, // Add student records later
            ];

            return response()->json([
                'success' => true,
                'stats' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'stats' => [
                    'total_users' => 0,
                    'total_admins' => 0,
                    'total_registrars' => 0,
                    'total_graduates' => 0,
                    'total_requests' => 0,
                    'pending_requests' => 0,
                    'completed_requests' => 0,
                    'active_users' => 0,
                    'inactive_users' => 0,
                    'total_revenue' => 0,
                    'total_records' => 0,
                ]
            ], 500);
        }
    }

    /**
     * Get admin statistics
     */
    public function stats()
    {
        return $this->index();
    }
}