<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Graduate;
use App\Models\StudentRecord;
use App\Models\RecordRequest;

class DashboardController extends Controller
{
    /**
     * Get general dashboard data
     */
    public function index()
    {
        $user = Auth::user();
        
        return response()->json([
            'message' => 'Dashboard loaded successfully',
            'user' => $user,
            'role' => $user->role,
            'stats' => $this->getUserStats($user)
        ]);
    }
    
    /**
     * Get general statistics
     */
    public function stats()
    {
        $user = Auth::user();
        
        return response()->json([
            'stats' => $this->getUserStats($user)
        ]);
    }
    
    /**
     * Admin-only statistics
     */
    public function adminStats()
    {
        // Check if user is admin
        if (Auth::user()->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized access'
            ], 403);
        }
        
        return response()->json([
            'total_users' => User::count(),
            'total_admins' => User::where('role', 'admin')->count(),
            'total_registrars' => User::where('role', 'registrar')->count(),
            'total_graduates' => User::whereIn('role', ['user', 'graduate'])->count(),
            'total_records' => StudentRecord::count() ?? 0,
            'pending_requests' => RecordRequest::where('status', 'pending')->count() ?? 0,
            'completed_requests' => RecordRequest::where('status', 'completed')->count() ?? 0,
            'active_users' => User::where('status', 1)->count(),
            'inactive_users' => User::where('status', 0)->count(),
        ]);
    }
    
    /**
     * Get user-specific stats
     */
    private function getUserStats($user)
    {
        $stats = [
            'profile_complete' => $user->profile_complete ?? false,
            'member_since' => $user->created_at->format('M Y'),
        ];
        
        switch ($user->role) {
            case 'admin':
                $stats['total_users'] = User::count();
                $stats['total_records'] = StudentRecord::count() ?? 0;
                $stats['pending_requests'] = RecordRequest::where('status', 'pending')->count() ?? 0;
                break;
                
            case 'registrar':
                $stats['total_records'] = StudentRecord::count() ?? 0;
                $stats['pending_requests'] = RecordRequest::where('status', 'pending')->count() ?? 0;
                $stats['processed_today'] = RecordRequest::whereDate('updated_at', today())
                    ->where('status', 'completed')
                    ->count() ?? 0;
                break;
                
            case 'user':
            case 'graduate':
                $stats['my_records'] = StudentRecord::where('user_id', $user->id)->count() ?? 0;
                $stats['my_requests'] = RecordRequest::where('user_id', $user->id)->count() ?? 0;
                $stats['pending_requests'] = RecordRequest::where('user_id', $user->id)
                    ->where('status', 'pending')
                    ->count() ?? 0;
                $stats['completed_requests'] = RecordRequest::where('user_id', $user->id)
                    ->where('status', 'completed')
                    ->count() ?? 0;
                break;
        }
        
        return $stats;
    }
    
    /**
     * Admin dashboard
     */
    public function admin()
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        return response()->json([
            'stats' => $this->adminStats(),
            'recent_users' => User::latest()->take(5)->get(['id', 'name', 'email', 'role', 'created_at']),
            'recent_records' => StudentRecord::with('user')->latest()->take(5)->get(),
            'pending_requests' => RecordRequest::with('user')->where('status', 'pending')->latest()->take(5)->get(),
        ]);
    }
    
    /**
     * Registrar dashboard
     */
    public function registrar()
    {
        if (Auth::user()->role !== 'registrar') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        return response()->json([
            'stats' => $this->getUserStats(Auth::user()),
            'pending_requests' => RecordRequest::with('user')
                ->where('status', 'pending')
                ->latest()
                ->take(10)
                ->get(),
            'recent_processed' => RecordRequest::with('user')
                ->where('status', 'completed')
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }
    
    /**
     * Graduate/User dashboard
     */
    public function graduate()
    {
        $user = Auth::user();
        
        if (!in_array($user->role, ['user', 'graduate'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        return response()->json([
            'user' => $user,
            'stats' => $this->getUserStats($user),
            'recent_records' => StudentRecord::where('user_id', $user->id)
                ->latest()
                ->take(5)
                ->get(),
            'recent_requests' => RecordRequest::where('user_id', $user->id)
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }
}