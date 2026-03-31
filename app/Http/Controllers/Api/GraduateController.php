<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Graduate;
use Carbon\Carbon;

class GraduateController extends Controller
{
    // GET all graduates
    public function index()
    {
        return response()->json(Graduate::with('user')->get());
    }

    // STORE a new graduate
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'student_id' => 'required|string|unique:graduates',
            'firstname' => 'required|string',
            'lastname' => 'required|string',
            'course' => 'required|string',
            'department' => 'required|string',
            'year_graduated' => 'nullable|integer',
            // add other fields as needed
        ]);

        $validated['date_created'] = Carbon::now();
        $validated['date_updated'] = Carbon::now();

        $graduate = Graduate::create($validated);

        return response()->json($graduate, 201);
    }

    // SHOW a single graduate
    public function show($id)
    {
        $graduate = Graduate::with('user')->findOrFail($id);
        return response()->json($graduate);
    }

    // UPDATE a graduate
    public function update(Request $request, $id)
    {
        $graduate = Graduate::findOrFail($id);

        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'student_id' => 'sometimes|string|unique:graduates,student_id,' . $id,
            'firstname' => 'sometimes|string',
            'lastname' => 'sometimes|string',
            'course' => 'sometimes|string',
            'department' => 'sometimes|string',
            'year_graduated' => 'nullable|integer',
            'status' => 'sometimes|boolean',
        ]);

        $validated['date_updated'] = Carbon::now();

        $graduate->update($validated);

        return response()->json($graduate);
    }

    // DELETE a graduate
    public function destroy($id)
    {
        $graduate = Graduate::findOrFail($id);
        $graduate->delete();

        return response()->json(['message' => 'Graduate deleted']);
    }
}