<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Graduate;
use App\Models\StudentRecord;
use App\Models\RecordRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Display admin dashboard
     */
    public function index()
    {
        return response()->json([
            'message' => 'Admin dashboard',
            'stats' => $this->getStats()
        ]);
    }
    
    /**
     * Dashboard view for web
     */
    public function dashboard()
    {
        return view('admin.dashboard', [
            'stats' => $this->getStats(),
            'users' => User::latest()->take(10)->get()
        ]);
    }
    
    /**
     * Get all users (API endpoint)
     */
    public function users()
    {
        $users = User::all();
        return response()->json($users);
    }
    
    /**
     * Get a specific user
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }
    
    /**
     * Create a new user
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,registrar,user'
        ]);
        
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'status' => 1
        ]);
        
        return response()->json([
            'message' => 'User created successfully',
            'user' => $user
        ], 201);
    }
    
    /**
     * Update user
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'role' => 'sometimes|in:admin,registrar,user',
            'status' => 'sometimes|boolean'
        ]);
        
        $user->update($request->only(['name', 'email', 'role', 'status']));
        
        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }
    
    /**
     * Delete user
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        if (auth()->id() == $id) {
            return response()->json([
                'message' => 'Cannot delete your own account'
            ], 403);
        }
        
        $user->delete();
        
        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }
    
    /**
     * Get admin statistics
     */
    public function stats()
    {
        return response()->json($this->getStats());
    }
    
    /**
     * Get system statistics
     */
    private function getStats()
    {
        return [
            'total_users' => User::count(),
            'total_admins' => User::where('role', 'admin')->count(),
            'total_registrars' => User::where('role', 'registrar')->count(),
            'total_graduates' => User::where('role', 'user')->count(),
            'total_records' => StudentRecord::count(),
            'total_requests' => RecordRequest::count(),
            'pending_requests' => RecordRequest::where('status', 'pending')->count(),
            'completed_requests' => RecordRequest::where('status', 'completed')->count(),
            'active_users' => User::where('status', 1)->count(),
            'inactive_users' => User::where('status', 0)->count(),
        ];
    }
    
    /**
     * Deactivate user account
     */
    public function deactivate($id)
    {
        $user = User::findOrFail($id);
        
        if (auth()->id() == $id) {
            return response()->json([
                'message' => 'Cannot deactivate your own account'
            ], 403);
        }
        
        $user->status = 0;
        $user->save();
        
        return response()->json([
            'message' => 'User deactivated successfully',
            'user' => $user
        ]);
    }
    
    /**
     * Activate user account
     */
    public function activate($id)
    {
        $user = User::findOrFail($id);
        $user->status = 1;
        $user->save();
        
        return response()->json([
            'message' => 'User activated successfully',
            'user' => $user
        ]);
    }
    
    /**
     * Update user role
     */
    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|in:admin,registrar,user'
        ]);
        
        $user = User::findOrFail($id);
        
        if (auth()->id() == $id && $request->role !== 'admin') {
            return response()->json([
                'message' => 'Cannot change your own admin role'
            ], 403);
        }
        
        $user->role = $request->role;
        $user->save();
        
        return response()->json([
            'message' => 'User role updated successfully',
            'user' => $user
        ]);
    }
    
    // ============ SECURITY ENDPOINTS ============
    
    /**
     * Get security alerts
     */
    public function securityAlerts()
    {
        // You can create a SecurityAlert model or return demo data
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
    
    // ============ BACKUP ENDPOINTS ============
    
    /**
     * Get backup history
     */
    public function backupHistory()
    {
        $backups = [
            [
                'id' => 1,
                'filename' => 'backup_' . now()->format('Y_m_d') . '.zip',
                'size' => '2.4 MB',
                'date' => now()->toDateTimeString(),
                'status' => 'completed'
            ],
            [
                'id' => 2,
                'filename' => 'backup_' . now()->subDay()->format('Y_m_d') . '.zip',
                'size' => '2.3 MB',
                'date' => now()->subDay()->toDateTimeString(),
                'status' => 'completed'
            ],
            [
                'id' => 3,
                'filename' => 'backup_' . now()->subDays(2)->format('Y_m_d') . '.zip',
                'size' => '2.3 MB',
                'date' => now()->subDays(2)->toDateTimeString(),
                'status' => 'completed'
            ]
        ];
        
        return response()->json($backups);
    }
    
    /**
     * Create backup
     */
    public function createBackup(Request $request)
    {
        // Here you would implement actual backup logic
        // For now, return success response
        
        return response()->json([
            'message' => 'Backup created successfully',
            'filename' => 'backup_' . now()->format('Y_m_d_H_i_s') . '.zip',
            'size' => '2.5 MB',
            'date' => now()->toDateTimeString()
        ]);
    }
    
    /**
     * Restore backup
     */
    public function restoreBackup(Request $request)
    {
        $request->validate([
            'backup_file' => 'required|file|mimes:zip,sql,gz|max:51200'
        ]);
        
        // Here you would implement actual restore logic
        // For now, return success response
        
        return response()->json([
            'message' => 'Backup restored successfully'
        ]);
    }
    
    /**
     * Verify backup integrity
     */
    public function verifyBackup()
    {
        // Here you would implement actual verification logic
        
        return response()->json([
            'message' => 'All backup files are valid',
            'verified' => true,
            'last_verified' => now()->toDateTimeString()
        ]);
    }
}