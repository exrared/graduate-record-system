<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AccessRole;
use Illuminate\Support\Facades\Validator;

class AccessRoleController extends Controller
{
    public function index()
    {
        return response()->json(AccessRole::with(['role', 'accessRight'])->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'role_id' => 'required|exists:roles,id',
            'accessright_id' => 'required|exists:access_rights,id',
            'status' => 'sometimes|in:0,1',
        ]);

        if ($validator->fails()) return response()->json($validator->errors(), 422);

        $roleAccess = AccessRole::create($validator->validated());
        return response()->json($roleAccess, 201);
    }

    public function show($id)
    {
        return response()->json(AccessRole::with(['role', 'accessRight'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $roleAccess = AccessRole::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'role_id' => 'sometimes|exists:roles,id',
            'accessright_id' => 'sometimes|exists:access_rights,id',
            'status' => 'sometimes|in:0,1',
        ]);

        if ($validator->fails()) return response()->json($validator->errors(), 422);

        $roleAccess->update($validator->validated());
        return response()->json($roleAccess);
    }

    public function destroy($id)
    {
        $roleAccess = AccessRole::findOrFail($id);
        $roleAccess->delete();

        return response()->json(['message' => 'Access role deleted']);
    }
}