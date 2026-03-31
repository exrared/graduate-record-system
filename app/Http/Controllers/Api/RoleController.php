<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;

class RoleController extends Controller
{
    public function index()
    {
        // Only active roles
        $roles = Role::where('status', 1)->get(['id', 'role_name']);
        return response()->json($roles);
    }
}