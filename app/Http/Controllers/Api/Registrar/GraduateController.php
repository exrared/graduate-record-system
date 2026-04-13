<?php

namespace App\Http\Controllers\Api\Registrar;

use App\Http\Controllers\Controller;
use App\Models\Graduate;
use App\Models\RecordRequest;
use Illuminate\Http\Request;

class GraduateController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('role:registrar');
    }

    /**
     * Get all graduates with filters
     */
    public function index(Request $request)
    {
        $query = Graduate::with('user');

        // Search
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('firstname', 'like', "%{$request->search}%")
                  ->orWhere('lastname', 'like', "%{$request->search}%")
                  ->orWhere('student_id', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%")
                  ->orWhere('course', 'like', "%{$request->search}%");
            });
        }

        // Filter by course
        if ($request->course) {
            $query->where('course', $request->course);
        }

        // Filter by year graduated
        if ($request->year_graduated) {
            $query->where('year_graduated', $request->year_graduated);
        }

        // Filter by department
        if ($request->department) {
            $query->where('department', $request->department);
        }

        // Filter by status
        if ($request->status !== null) {
            $query->where('status', $request->status);
        }

        $graduates = $query->orderBy('lastname')->paginate(20);

        return response()->json($graduates);
    }

    /**
     * Get single graduate details with their requests
     */
    public function show($id)
    {
        $graduate = Graduate::with(['user', 'recordRequests' => function($q) {
            $q->orderBy('request_date', 'desc');
        }])->findOrFail($id);
        
        return response()->json($graduate);
    }

    /**
     * Get graduate by student ID
     */
    public function findByStudentId($studentId)
    {
        $graduate = Graduate::with('user')
            ->where('student_id', $studentId)
            ->first();

        if (!$graduate) {
            return response()->json(['message' => 'Graduate not found'], 404);
        }

        return response()->json($graduate);
    }

    /**
     * Get graduate statistics
     */
    public function stats()
    {
        $stats = [
            'total' => Graduate::count(),
            'active' => Graduate::where('status', 1)->count(),
            'inactive' => Graduate::where('status', 0)->count(),
            'by_course' => Graduate::select('course', \DB::raw('count(*) as total'))
                ->groupBy('course')
                ->get(),
            'by_year' => Graduate::select('year_graduated', \DB::raw('count(*) as total'))
                ->whereNotNull('year_graduated')
                ->groupBy('year_graduated')
                ->get(),
        ];

        return response()->json($stats);
    }

    /**
     * Update graduate status (activate/deactivate)
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|boolean'
        ]);

        $graduate = Graduate::findOrFail($id);
        $graduate->status = $request->status;
        $graduate->save();

        return response()->json([
            'message' => 'Graduate status updated successfully',
            'graduate' => $graduate
        ]);
    }
}