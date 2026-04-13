<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\RecordRequest;
use App\Models\Graduate;
use App\Models\RecordSchedule;
use App\Models\Payment;

class RecordRequestController extends Controller
{
    /**
     * Get my requests (for authenticated graduate) - WITH ALL RELATIONSHIPS
     */
    public function myRequests()
    {
        $user = Auth::user();
        $graduate = Graduate::where('user_id', $user->id)->first();
        
        if (!$graduate) {
            return response()->json([]);
        }
        
        $requests = RecordRequest::where('graduate_id', $graduate->id)
            ->with(['schedule', 'payment']) // Load relationships
            ->orderBy('request_date', 'desc')
            ->get();
        
        // Format the data for frontend
        $formattedRequests = $requests->map(function($request) {
            return [
                'id' => $request->id,
                'graduate_id' => $request->graduate_id,
                'request_type' => $request->request_type,
                'purpose' => $request->purpose,
                'quantity' => $request->quantity,
                'request_date' => $request->request_date,
                'request_status' => $request->request_status,
                'schedule_date' => $request->schedule_date,
                'payment_status' => $request->payment_status,
                'remarks' => $request->remarks,
                'created_at' => $request->created_at,
                'updated_at' => $request->updated_at,
                'schedule' => $request->schedule ? [
                    'id' => $request->schedule->id,
                    'release_date' => $request->schedule->release_date,
                    'release_time' => $request->schedule->release_time,
                    'location' => $request->schedule->location,
                    'status' => $request->schedule->status,
                ] : null,
                'payment' => $request->payment ? [
                    'id' => $request->payment->id,
                    'amount' => $request->payment->amount,
                    'payment_method' => $request->payment->payment_method,
                    'reference_number' => $request->payment->reference_number,
                    'payment_date' => $request->payment->payment_date,
                    'payment_status' => $request->payment->payment_status,
                ] : null,
            ];
        });
        
        return response()->json($formattedRequests);
    }

    /**
     * Get request history (ALL requests) - WITH ALL RELATIONSHIPS
     */
    public function history()
    {
        $user = Auth::user();
        $graduate = Graduate::where('user_id', $user->id)->first();
        
        if (!$graduate) {
            return response()->json([]);
        }
        
        $requests = RecordRequest::where('graduate_id', $graduate->id)
            ->with(['schedule', 'payment']) // Load relationships
            ->orderBy('request_date', 'desc')
            ->get();
        
        // Format the data for frontend
        $formattedRequests = $requests->map(function($request) {
            return [
                'id' => $request->id,
                'graduate_id' => $request->graduate_id,
                'request_type' => $request->request_type,
                'purpose' => $request->purpose,
                'quantity' => $request->quantity,
                'request_date' => $request->request_date,
                'request_status' => $request->request_status,
                'schedule_date' => $request->schedule_date,
                'payment_status' => $request->payment_status,
                'remarks' => $request->remarks,
                'created_at' => $request->created_at,
                'updated_at' => $request->updated_at,
                'schedule' => $request->schedule ? [
                    'id' => $request->schedule->id,
                    'release_date' => $request->schedule->release_date,
                    'release_time' => $request->schedule->release_time,
                    'location' => $request->schedule->location,
                    'status' => $request->schedule->status,
                ] : null,
                'payment' => $request->payment ? [
                    'id' => $request->payment->id,
                    'amount' => $request->payment->amount,
                    'payment_method' => $request->payment->payment_method,
                    'reference_number' => $request->payment->reference_number,
                    'payment_date' => $request->payment->payment_date,
                    'payment_status' => $request->payment->payment_status,
                ] : null,
            ];
        });
        
        return response()->json($formattedRequests);
    }

    /**
     * Track a specific request - WITH ALL RELATIONSHIPS
     */
    public function track($id)
    {
        $user = Auth::user();
        $graduate = Graduate::where('user_id', $user->id)->first();
        
        if (!$graduate) {
            return response()->json(['message' => 'Graduate not found'], 404);
        }
        
        $request = RecordRequest::where('id', $id)
            ->where('graduate_id', $graduate->id)
            ->with(['schedule', 'payment'])
            ->first();
        
        if (!$request) {
            return response()->json(['message' => 'Request not found'], 404);
        }
        
        $formattedRequest = [
            'id' => $request->id,
            'graduate_id' => $request->graduate_id,
            'request_type' => $request->request_type,
            'purpose' => $request->purpose,
            'quantity' => $request->quantity,
            'request_date' => $request->request_date,
            'request_status' => $request->request_status,
            'schedule_date' => $request->schedule_date,
            'payment_status' => $request->payment_status,
            'remarks' => $request->remarks,
            'created_at' => $request->created_at,
            'updated_at' => $request->updated_at,
            'schedule' => $request->schedule ? [
                'id' => $request->schedule->id,
                'release_date' => $request->schedule->release_date,
                'release_time' => $request->schedule->release_time,
                'location' => $request->schedule->location,
                'status' => $request->schedule->status,
            ] : null,
            'payment' => $request->payment ? [
                'id' => $request->payment->id,
                'amount' => $request->payment->amount,
                'payment_method' => $request->payment->payment_method,
                'reference_number' => $request->payment->reference_number,
                'payment_date' => $request->payment->payment_date,
                'payment_status' => $request->payment->payment_status,
            ] : null,
        ];
        
        return response()->json($formattedRequest);
    }

    /**
     * Store a new request
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $graduate = Graduate::where('user_id', $user->id)->first();
        
        if (!$graduate) {
            return response()->json(['message' => 'Graduate profile not found'], 404);
        }
        
        $validated = $request->validate([
            'request_type' => 'required|string|in:TOR,Diploma,Certificate,GMC',
            'purpose' => 'required|string|min:10|max:500',
            'quantity' => 'required|integer|min:1|max:10',
            'request_date' => 'required|date',
            'request_status' => 'required|string',
            'payment_status' => 'required|string',
        ]);
        
        $recordRequest = RecordRequest::create([
            'graduate_id' => $graduate->id,
            'request_type' => $validated['request_type'],
            'purpose' => $validated['purpose'],
            'quantity' => $validated['quantity'],
            'request_date' => $validated['request_date'],
            'request_status' => $validated['request_status'],
            'payment_status' => $validated['payment_status'],
        ]);
        
        // Return the created request with formatted data
        return response()->json([
            'message' => 'Request created successfully',
            'request' => [
                'id' => $recordRequest->id,
                'graduate_id' => $recordRequest->graduate_id,
                'request_type' => $recordRequest->request_type,
                'purpose' => $recordRequest->purpose,
                'quantity' => $recordRequest->quantity,
                'request_date' => $recordRequest->request_date,
                'request_status' => $recordRequest->request_status,
                'payment_status' => $recordRequest->payment_status,
                'remarks' => $recordRequest->remarks,
                'schedule' => null,
                'payment' => null,
            ]
        ], 201);
    }
}