<?php

namespace App\Http\Controllers\Api\Registrar;

use App\Http\Controllers\Controller;
use App\Models\RecordRequest;
use App\Models\Graduate;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RequestController extends Controller
{
    use LogsActivity;

    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('role:registrar');
    }

    /**
     * Get all requests with filters
     */
    public function index(Request $request)
    {
        $query = RecordRequest::with(['graduate.user']);

        // Filter by status
        if ($request->status) {
            $query->where('request_status', $request->status);
        }

        // Filter by payment status
        if ($request->payment_status) {
            $query->where('payment_status', $request->payment_status);
        }

        // Filter by document type
        if ($request->request_type) {
            $query->where('request_type', $request->request_type);
        }

        // Filter by date range
        if ($request->start_date) {
            $query->whereDate('request_date', '>=', $request->start_date);
        }
        if ($request->end_date) {
            $query->whereDate('request_date', '<=', $request->end_date);
        }

        // Search by student name or ID
        if ($request->search) {
            $query->whereHas('graduate', function ($q) use ($request) {
                $q->where('firstname', 'like', "%{$request->search}%")
                  ->orWhere('lastname', 'like', "%{$request->search}%")
                  ->orWhere('student_id', 'like', "%{$request->search}%");
            });
        }

        $requests = $query->orderBy('request_date', 'desc')->paginate(20);

        return response()->json($requests);
    }

    /**
     * Get pending requests
     */
    public function pending()
    {
        $requests = RecordRequest::with(['graduate.user'])
            ->where('request_status', 'pending')
            ->orderBy('request_date', 'asc')
            ->get();

        return response()->json($requests);
    }

    /**
     * Get approved requests (for scheduling)
     */
    public function approved()
    {
        $requests = RecordRequest::with(['graduate.user'])
            ->where('request_status', 'approved')
            ->orderBy('request_date', 'asc')
            ->get();

        return response()->json($requests);
    }

    /**
     * Get single request details
     */
    public function show($id)
    {
        $request = RecordRequest::with(['graduate.user', 'schedule', 'payment'])->findOrFail($id);
        return response()->json($request);
    }

    /**
     * Approve a request
     */
    public function approve(Request $request, $id)
    {
        $recordRequest = RecordRequest::findOrFail($id);
        
        $oldStatus = $recordRequest->request_status;
        $recordRequest->request_status = 'approved';
        $recordRequest->remarks = $request->remarks ?? 'Request approved. Proceed to payment.';
        $recordRequest->save();

        $this->logActivity(
            'approve',
            'request',
            "Approved document request #{$recordRequest->id}",
            ['status' => $oldStatus],
            ['status' => 'approved']
        );

        return response()->json([
            'message' => 'Request approved successfully',
            'request' => $recordRequest
        ]);
    }

    /**
     * Reject a request
     */
    public function reject(Request $request, $id)
    {
        $request->validate([
            'remarks' => 'required|string|min:10'
        ]);

        $recordRequest = RecordRequest::findOrFail($id);
        
        $oldStatus = $recordRequest->request_status;
        $recordRequest->request_status = 'rejected';
        $recordRequest->remarks = $request->remarks;
        $recordRequest->save();

        $this->logActivity(
            'reject',
            'request',
            "Rejected document request #{$recordRequest->id}. Reason: {$request->remarks}",
            ['status' => $oldStatus],
            ['status' => 'rejected']
        );

        return response()->json([
            'message' => 'Request rejected',
            'request' => $recordRequest
        ]);
    }

    /**
     * Mark request as processing
     */
    public function markProcessing($id)
    {
        $recordRequest = RecordRequest::findOrFail($id);
        
        $oldStatus = $recordRequest->request_status;
        $recordRequest->request_status = 'processing';
        $recordRequest->save();

        $this->logActivity(
            'update',
            'request',
            "Marked request #{$recordRequest->id} as processing",
            ['status' => $oldStatus],
            ['status' => 'processing']
        );

        return response()->json(['message' => 'Request marked as processing']);
    }

    /**
     * Mark request as ready for pickup
     */
    public function markReady($id)
    {
        $recordRequest = RecordRequest::findOrFail($id);
        
        $oldStatus = $recordRequest->request_status;
        $recordRequest->request_status = 'ready';
        $recordRequest->save();

        $this->logActivity(
            'update',
            'request',
            "Marked request #{$recordRequest->id} as ready for pickup",
            ['status' => $oldStatus],
            ['status' => 'ready']
        );

        return response()->json(['message' => 'Request marked as ready for pickup']);
    }

    /**
     * Mark request as completed
     */
    public function markCompleted($id)
    {
        $recordRequest = RecordRequest::findOrFail($id);
        
        $oldStatus = $recordRequest->request_status;
        $recordRequest->request_status = 'completed';
        $recordRequest->save();

        $this->logActivity(
            'complete',
            'request',
            "Marked request #{$recordRequest->id} as completed",
            ['status' => $oldStatus],
            ['status' => 'completed']
        );

        return response()->json(['message' => 'Request marked as completed']);
    }

    /**
     * Get request statistics
     */
    public function stats()
    {
        $stats = [
            'total' => RecordRequest::count(),
            'pending' => RecordRequest::where('request_status', 'pending')->count(),
            'processing' => RecordRequest::where('request_status', 'processing')->count(),
            'approved' => RecordRequest::where('request_status', 'approved')->count(),
            'ready' => RecordRequest::where('request_status', 'ready')->count(),
            'completed' => RecordRequest::where('request_status', 'completed')->count(),
            'rejected' => RecordRequest::where('request_status', 'rejected')->count(),
        ];

        return response()->json($stats);
    }
}