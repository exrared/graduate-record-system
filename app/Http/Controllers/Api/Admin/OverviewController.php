<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\StudentRecord;
use App\Models\RecordRequest;
use Illuminate\Http\Request;

class OverviewController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('role:admin');
    }

    public function stats()
    {
        return response()->json([
            'total_users' => User::count(),
            'total_records' => StudentRecord::count(),
            'total_requests' => RecordRequest::count(),
            'pending_requests' => RecordRequest::where('request_status', 'pending')->count(),
        ]);
    }

    public function recentActivity()
    {
        $recentUsers = User::latest()->take(10)->get();
        $recentRequests = RecordRequest::latest()->take(10)->get();

        return response()->json([
            'recent_users' => $recentUsers,
            'recent_requests' => $recentRequests
        ]);
    }
}