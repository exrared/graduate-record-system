<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleManagementController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('role:admin');
    }

    public function index()
    {
        $roles = Role::all();
        return response()->json($roles);
    }

    public function store(Request $request)
    {
        $request->validate([
            'role_name' => 'required|string|unique:roles',
            'description' => 'required|string',
        ]);

        $role = Role::create([
            'role_name' => $request->role_name,
            'description' => $request->description,
            'status' => 'active',
            'date_created' => now(),
        ]);

        return response()->json(['message' => 'Role created successfully', 'role' => $role], 201);
    }

    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);
        $role->update($request->only(['role_name', 'description', 'status']));
        return response()->json(['message' => 'Role updated successfully', 'role' => $role]);
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        if (in_array($role->role_name, ['admin', 'registrar', 'user'])) {
            return response()->json(['message' => 'Cannot delete default roles'], 403);
        }
        $role->delete();
        return response()->json(['message' => 'Role deleted successfully']);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:active,inactive']);
        $role = Role::findOrFail($id);
        $role->status = $request->status;
        $role->save();
        return response()->json(['message' => 'Role status updated successfully']);
    }
}