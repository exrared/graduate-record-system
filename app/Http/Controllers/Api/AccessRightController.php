<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AccessRight;
use Illuminate\Support\Facades\Validator;

class AccessRightController extends Controller
{
    public function index()
    {
        return response()->json(AccessRight::all());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'access_name' => 'required|string|unique:access_rights,access_name',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:0,1',
        ]);

        if ($validator->fails()) return response()->json($validator->errors(), 422);

        $access = AccessRight::create($validator->validated());
        return response()->json($access, 201);
    }

    public function show($id)
    {
        return response()->json(AccessRight::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $access = AccessRight::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'access_name' => 'sometimes|string|unique:access_rights,access_name,' . $id,
            'description' => 'nullable|string',
            'status' => 'sometimes|in:0,1',
        ]);

        if ($validator->fails()) return response()->json($validator->errors(), 422);

        $access->update($validator->validated());
        return response()->json($access);
    }

    public function destroy($id)
    {
        $access = AccessRight::findOrFail($id);
        $access->delete();

        return response()->json(['message' => 'Access right deleted']);
    }
}