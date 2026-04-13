<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StudentRecord;
use App\Models\Graduate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class StudentRecordController extends Controller
{
    // GET all student records
    public function index()
    {
        return response()->json(StudentRecord::with('graduate')->get());
    }

    // STORE a new student record
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'graduate_id' => 'required|exists:graduates,id',
            'record_type' => 'required|string',
            'description' => 'nullable|string',
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120', // max 5MB
            'uploaded_by' => 'required|string',
            'status' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Handle file upload
        if ($request->hasFile('file')) {
            $file_path = $request->file('file')->store('uploads/student_records', 'public');
        } else {
            return response()->json(['error' => 'File is required'], 400);
        }

        $record = StudentRecord::create([
            'graduate_id' => $request->graduate_id,
            'record_type' => $request->record_type,
            'description' => $request->description,
            'file_path' => $file_path,
            'uploaded_by' => $request->uploaded_by,
            'date_uploaded' => Carbon::now(),
            'status' => $request->status ?? 1,
        ]);

        return response()->json($record, 201);
    }

    // SHOW a single student record
    public function show($id)
    {
        $record = StudentRecord::with('graduate')->findOrFail($id);
        return response()->json($record);
    }

    // UPDATE a student record
    public function update(Request $request, $id)
    {
        $record = StudentRecord::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'graduate_id' => 'sometimes|exists:graduates,id',
            'record_type' => 'sometimes|string',
            'description' => 'nullable|string',
            'file' => 'sometimes|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'uploaded_by' => 'sometimes|string',
            'status' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Replace file if uploaded
        if ($request->hasFile('file')) {
            // Delete old file
            if (Storage::disk('public')->exists($record->file_path)) {
                Storage::disk('public')->delete($record->file_path);
            }

            $record->file_path = $request->file('file')->store('uploads/student_records', 'public');
        }

        $record->update(array_merge(
            $request->only([
                'graduate_id',
                'record_type',
                'description',
                'uploaded_by',
                'status',
            ]),
            ['date_uploaded' => Carbon::now()]
        ));

        return response()->json($record);
    }

    // DELETE a student record
    public function destroy($id)
    {
        $record = StudentRecord::findOrFail($id);

        // Delete file
        if (Storage::disk('public')->exists($record->file_path)) {
            Storage::disk('public')->delete($record->file_path);
        }

        $record->delete();

        return response()->json(['message' => 'Student record deleted']);
    }

    // DOWNLOAD a student record file
    public function download($id)
    {
        $record = StudentRecord::findOrFail($id);

        if (!Storage::disk('public')->exists($record->file_path)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        return response()->download(storage_path('app/public/' . $record->file_path));
    }

    // ========== ADD THIS METHOD FOR GRADUATE PORTAL ==========
    /**
     * Get my records (for authenticated graduate)
     * This returns only the records belonging to the logged-in graduate
     */
    public function myRecords()
    {
        $user = Auth::user();
        
        // Find the graduate profile associated with the authenticated user
        $graduate = Graduate::where('user_id', $user->id)->first();
        
        if (!$graduate) {
            return response()->json([
                'message' => 'Graduate profile not found',
                'records' => []
            ]);
        }
        
        // Get all records for this graduate
        $records = StudentRecord::where('graduate_id', $graduate->id)->get();
        
        // Add full URL for file download if needed
        foreach ($records as $record) {
            $record->file_url = $record->file_path ? Storage::url($record->file_path) : null;
        }
        
        return response()->json($records);
    }
}