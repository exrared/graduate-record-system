<?php

namespace App\Http\Controllers\Api\Registrar;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\RecordRequest;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    use LogsActivity;

    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('role:registrar');
    }

    /**
     * Get all payments with filters
     */
    public function index(Request $request)
    {
        $query = Payment::with(['recordRequest.graduate.user']);

        if ($request->status) {
            $query->where('payment_status', $request->status);
        }

        if ($request->payment_method) {
            $query->where('payment_method', $request->payment_method);
        }

        if ($request->start_date) {
            $query->whereDate('payment_date', '>=', $request->start_date);
        }
        if ($request->end_date) {
            $query->whereDate('payment_date', '<=', $request->end_date);
        }

        $payments = $query->orderBy('payment_date', 'desc')->paginate(20);

        return response()->json($payments);
    }

    /**
     * Get all pending payments
     */
    public function pending()
    {
        $payments = Payment::with(['recordRequest.graduate.user'])
            ->where('payment_status', 'pending')
            ->orderBy('payment_date', 'asc')
            ->get();

        return response()->json($payments);
    }

    /**
     * Get single payment details
     */
    public function show($id)
    {
        $payment = Payment::with(['recordRequest.graduate.user'])->findOrFail($id);
        return response()->json($payment);
    }

    /**
     * Verify a payment
     */
    public function verify($id)
    {
        $payment = Payment::findOrFail($id);
        
        $oldStatus = $payment->payment_status;
        $payment->payment_status = 'paid';
        $payment->verified_by = auth()->id();
        $payment->verified_at = now();
        $payment->save();

        // Update the related request payment status
        if ($payment->recordRequest) {
            $payment->recordRequest->payment_status = 'paid';
            $payment->recordRequest->save();
        }

        $this->logActivity(
            'verify',
            'payment',
            "Verified payment #{$payment->id} for request #{$payment->request_id}",
            ['status' => $oldStatus],
            ['status' => 'paid']
        );

        return response()->json([
            'message' => 'Payment verified successfully',
            'payment' => $payment
        ]);
    }

    /**
     * Reject a payment
     */
    public function reject(Request $request, $id)
    {
        $request->validate([
            'remarks' => 'required|string'
        ]);

        $payment = Payment::findOrFail($id);
        
        $oldStatus = $payment->payment_status;
        $payment->payment_status = 'failed';
        $payment->remarks = $request->remarks;
        $payment->save();

        $this->logActivity(
            'reject',
            'payment',
            "Rejected payment #{$payment->id}. Reason: {$request->remarks}",
            ['status' => $oldStatus],
            ['status' => 'failed']
        );

        return response()->json([
            'message' => 'Payment rejected',
            'payment' => $payment
        ]);
    }

    /**
     * Get payment statistics
     */
    public function stats()
    {
        $stats = [
            'total' => Payment::count(),
            'pending' => Payment::where('payment_status', 'pending')->count(),
            'paid' => Payment::where('payment_status', 'paid')->count(),
            'failed' => Payment::where('payment_status', 'failed')->count(),
            'total_amount' => Payment::where('payment_status', 'paid')->sum('amount'),
        ];

        return response()->json($stats);
    }
}