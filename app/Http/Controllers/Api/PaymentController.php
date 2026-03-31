<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class PaymentController extends Controller
{
    // GET all payments
    public function index()
    {
        return response()->json(Payment::with('recordRequest')->get());
    }

    // STORE a new payment
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'request_id' => 'required|exists:record_requests,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
            'reference_number' => 'nullable|string',
            'payment_date' => 'nullable|date',
            'payment_status' => 'sometimes|in:unpaid,paid',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $payment = Payment::create(array_merge(
            $validator->validated(),
            ['payment_date' => $request->payment_date ?? Carbon::now()]
        ));

        return response()->json($payment, 201);
    }

    // SHOW a single payment
    public function show($id)
    {
        $payment = Payment::with('recordRequest')->findOrFail($id);
        return response()->json($payment);
    }

    // UPDATE a payment
    public function update(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'request_id' => 'sometimes|exists:record_requests,id',
            'amount' => 'sometimes|numeric|min:0',
            'payment_method' => 'sometimes|string',
            'reference_number' => 'nullable|string',
            'payment_date' => 'nullable|date',
            'payment_status' => 'sometimes|in:unpaid,paid',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $payment->update(array_merge(
            $validator->validated(),
            ['payment_date' => $request->payment_date ?? $payment->payment_date]
        ));

        return response()->json($payment);
    }

    // DELETE a payment
    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return response()->json(['message' => 'Payment deleted']);
    }
}