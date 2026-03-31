<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RecordRequest;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class RecordRequestController extends Controller
{
    // GET all record requests
    public function index()
    {
        return response()->json(RecordRequest::with('graduate')->get());
    }

    // STORE a new record request
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'graduate_id' => 'required|exists:graduates,id',
            'request_type' => 'required|string',
            'purpose' => 'nullable|string',
            'quantity' => 'required|integer|min:1',
            'schedule_date' => 'nullable|date',
            'request_status' => 'sometimes|in:pending,approved,rejected',
            'payment_status' => 'sometimes|in:unpaid,paid',
            'remarks' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $record = RecordRequest::create(array_merge(
            $validator->validated(),
            ['request_date' => Carbon::now()]
        ));

        return response()->json($record, 201);
    }

    // SHOW a single record request
    public function show($id)
    {
        $record = RecordRequest::with('graduate')->findOrFail($id);
        return response()->json($record);
    }

    // UPDATE a record request
    public function update(Request $request, $id)
    {
        $record = RecordRequest::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'graduate_id' => 'sometimes|exists:graduates,id',
            'request_type' => 'sometimes|string',
            'purpose' => 'nullable|string',
            'quantity' => 'sometimes|integer|min:1',
            'schedule_date' => 'nullable|date',
            'request_status' => 'sometimes|in:pending,approved,rejected',
            'payment_status' => 'sometimes|in:unpaid,paid',
            'remarks' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $record->update($validator->validated());

        return response()->json($record);
    }

    // DELETE a record request
    public function destroy($id)
    {
        $record = RecordRequest::findOrFail($id);
        $record->delete();

        return response()->json(['message' => 'Record request deleted']);
    }
}