<?php

namespace App\Http\Controllers\Api\Registrar;

use App\Http\Controllers\Controller;
use App\Models\StudentRecord;
use App\Models\Graduate;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    use LogsActivity;

    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('role:registrar');
    }

    /**
     * Get all documents with filters
     */
    public function index(Request $request)
    {
        $query = StudentRecord::with(['graduate.user']);

        if ($request->graduate_id) {
            $query->where('graduate_id', $request->graduate_id);
        }

        if ($request->record_type) {
            $query->where('record_type', $request->record_type);
        }

        if ($request->status !== null) {
            $query->where('status', $request->status);
        }

        $documents = $query->orderBy('date_uploaded', 'desc')->paginate(20);

        // Add full URL for file
        foreach ($documents as $document) {
            $document->file_url = $document->file_path ? Storage::url($document->file_path) : null;
        }

        return response()->json($documents);
    }

    /**
     * Upload a document for a graduate
     */
    public function upload(Request $request)
    {
        $request->validate([
            'graduate_id' => 'required|exists:graduates,id',
            'record_type' => 'required|string',
            'description' => 'nullable|string',
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $graduate = Graduate::findOrFail($request->graduate_id);
        
        $file = $request->file('file');
        $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file->getClientOriginalName());
        $path = $file->storeAs('student_records', $filename, 'public');

        $record = StudentRecord::create([
            'graduate_id' => $request->graduate_id,
            'record_type' => $request->record_type,
            'description' => $request->description,
            'file_path' => $path,
            'uploaded_by' => auth()->id(),
            'date_uploaded' => now(),
            'status' => 1,
        ]);

        $this->logActivity(
            'upload',
            'document',
            "Uploaded {$request->record_type} for student {$graduate->firstname} {$graduate->lastname}",
            null,
            $record->toArray()
        );

        $record->file_url = Storage::url($path);

        return response()->json([
            'message' => 'Document uploaded successfully',
            'record' => $record
        ], 201);
    }

    /**
     * Get single document
     */
    public function show($id)
    {
        $document = StudentRecord::with(['graduate.user'])->findOrFail($id);
        $document->file_url = $document->file_path ? Storage::url($document->file_path) : null;
        
        return response()->json($document);
    }

    /**
     * Update document
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'record_type' => 'sometimes|string',
            'description' => 'nullable|string',
            'status' => 'sometimes|boolean',
        ]);

        $document = StudentRecord::findOrFail($id);
        $document->update($request->only(['record_type', 'description', 'status']));

        $this->logActivity(
            'update',
            'document',
            "Updated document #{$id}",
            null,
            $document->toArray()
        );

        return response()->json([
            'message' => 'Document updated successfully',
            'document' => $document
        ]);
    }

    /**
     * Delete a document
     */
    public function destroy($id)
    {
        $record = StudentRecord::findOrFail($id);
        
        // Delete file from storage
        if ($record->file_path && Storage::disk('public')->exists($record->file_path)) {
            Storage::disk('public')->delete($record->file_path);
        }
        
        $record->delete();

        $this->logActivity('delete', 'document', "Deleted document #{$id}");

        return response()->json(['message' => 'Document deleted successfully']);
    }

    /**
     * Download a document
     */
    public function download($id)
    {
        $record = StudentRecord::findOrFail($id);
        
        if (!$record->file_path || !Storage::disk('public')->exists($record->file_path)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        return response()->download(storage_path('app/public/' . $record->file_path));
    }

    /**
     * Get documents by graduate
     */
    public function byGraduate($graduateId)
    {
        $graduate = Graduate::findOrFail($graduateId);
        
        $documents = StudentRecord::where('graduate_id', $graduateId)
            ->orderBy('date_uploaded', 'desc')
            ->get();

        foreach ($documents as $document) {
            $document->file_url = $document->file_path ? Storage::url($document->file_path) : null;
        }

        return response()->json([
            'graduate' => $graduate,
            'documents' => $documents
        ]);
    }
}