<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\Graduate;
use App\Models\RecordRequest;
use App\Models\Payment;

class PaymentController extends Controller
{
    /**
     * Get all payments (Admin only)
     */
    public function index()
    {
        return response()->json(Payment::with('recordRequest')->get());
    }

    /**
     * Get my payments (for authenticated graduate)
     */
    public function myPayments()
    {
        $user = Auth::user();
        $graduate = Graduate::where('user_id', $user->id)->first();
        
        if (!$graduate) {
            return response()->json([]);
        }
        
        $payments = Payment::whereHas('recordRequest', function($query) use ($graduate) {
            $query->where('graduate_id', $graduate->id);
        })->get();
        
        return response()->json($payments);
    }

    /**
     * Get single payment
     */
    public function show($id)
    {
        $payment = Payment::with('recordRequest')->findOrFail($id);
        return response()->json($payment);
    }

    /**
     * Create payment record
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'request_id' => 'required|exists:record_requests,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
            'reference_number' => 'nullable|string|max:100',
            'payment_status' => 'required|string|in:pending,paid,failed',
        ]);

        $payment = Payment::create([
            'request_id' => $validated['request_id'],
            'amount' => $validated['amount'],
            'payment_method' => $validated['payment_method'],
            'reference_number' => $validated['reference_number'] ?? null,
            'payment_date' => now(),
            'payment_status' => $validated['payment_status'],
        ]);

        // Update the related request payment status
        $recordRequest = RecordRequest::find($validated['request_id']);
        if ($recordRequest) {
            $recordRequest->update(['payment_status' => $validated['payment_status']]);
        }

        return response()->json($payment, 201);
    }

    /**
     * Upload payment proof
     */
    public function uploadProof(Request $request, $id)
    {
        $request->validate([
            'payment_proof' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'payment_method' => 'required|string|in:gcash,cash,bank_transfer',
            'reference_number' => 'nullable|string|max:100',
        ]);
        
        $user = Auth::user();
        $graduate = Graduate::where('user_id', $user->id)->first();
        
        if (!$graduate) {
            return response()->json(['message' => 'Graduate not found'], 404);
        }
        
        $recordRequest = RecordRequest::where('id', $id)
            ->where('graduate_id', $graduate->id)
            ->first();
        
        if (!$recordRequest) {
            return response()->json(['message' => 'Request not found'], 404);
        }
        
        // Store the file
        $file = $request->file('payment_proof');
        $path = $file->store('payment_proofs', 'public');
        
        $amount = $this->calculateAmount($recordRequest->request_type, $recordRequest->quantity);
        
        // Check if payment already exists
        $payment = Payment::where('request_id', $id)->first();
        
        if (!$payment) {
            $payment = Payment::create([
                'request_id' => $id,
                'amount' => $amount,
                'payment_method' => $request->payment_method,
                'reference_number' => $request->reference_number,
                'payment_date' => now(),
                'payment_status' => 'pending',
            ]);
        } else {
            $payment->update([
                'payment_method' => $request->payment_method,
                'reference_number' => $request->reference_number,
                'payment_date' => now(),
                'payment_status' => 'pending',
            ]);
        }
        
        // Update request payment status
        $recordRequest->update(['payment_status' => 'pending']);
        
        return response()->json([
            'message' => 'Payment proof uploaded successfully',
            'payment' => $payment
        ]);
    }

    /**
     * Update payment
     */
    public function update(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);
        
        $validated = $request->validate([
            'payment_status' => 'sometimes|string|in:pending,paid,failed',
            'payment_method' => 'sometimes|string',
            'reference_number' => 'nullable|string|max:100',
        ]);
        
        $payment->update($validated);
        
        // Update the related request payment status
        if (isset($validated['payment_status'])) {
            $recordRequest = RecordRequest::find($payment->request_id);
            if ($recordRequest) {
                $recordRequest->update(['payment_status' => $validated['payment_status']]);
            }
        }
        
        return response()->json($payment);
    }

    /**
     * Download receipt
     */
    public function downloadReceipt($id)
    {
        $user = Auth::user();
        $graduate = Graduate::where('user_id', $user->id)->first();
        
        if (!$graduate) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $payment = Payment::where('id', $id)
            ->whereHas('recordRequest', function($query) use ($graduate) {
                $query->where('graduate_id', $graduate->id);
            })
            ->first();
        
        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }
        
        // For now, return payment data
        // You can implement actual PDF receipt generation here
        return response()->json([
            'message' => 'Receipt data',
            'payment' => $payment,
            'receipt_url' => url('/api/payments/' . $id . '/receipt/download')
        ]);
    }

    /**
     * Delete payment
     */
    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();
        
        return response()->json(['message' => 'Payment deleted successfully']);
    }

    /**
     * Calculate amount based on request type and quantity
     */
    private function calculateAmount($requestType, $quantity)
    {
        $prices = [
            'TOR' => 150,
            'Diploma' => 250,
            'Certificate' => 75,
            'GMC' => 50,
        ];
        
        $price = $prices[$requestType] ?? 100;
        return $price * ($quantity ?? 1);
    }
}