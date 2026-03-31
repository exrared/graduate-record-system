<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Graduate;
use App\Models\StudentRecord;
use App\Models\RecordRequest;
use Illuminate\Support\Facades\Hash;

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
        // For web view
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
        
        // Prevent deleting yourself
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
}