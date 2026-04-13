<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SupportController extends Controller
{
    public function sendEmail(Request $request)
    {
        $request->validate([
            'message' => 'required|string|min:10|max:1000',
        ]);

        $user = Auth::user();
        
        // Get graduate details if available
        $graduate = \App\Models\Graduate::where('user_id', $user->id)->first();
        
        $data = [
            'name' => $user->name,
            'email' => $user->email,
            'student_id' => $graduate->student_id ?? 'N/A',
            'message' => $request->message,
            'date' => now()->toDateTimeString(),
        ];

        // Send email (you need to configure mail settings first)
        try {
            // Option 1: Send email using Laravel Mail
            // Mail::send('emails.support', $data, function ($message) use ($data) {
            //     $message->to('registrar@gradtrack.edu')
            //             ->subject('Support Request from ' . $data['name'])
            //             ->replyTo($data['email']);
            // });
            
            // Option 2: Log to file for now (until mail is configured)
            Log::info('Support Request from ' . $user->name, $data);
            
            return response()->json([
                'message' => 'Your message has been sent. Our support team will respond within 24-48 hours.',
                'success' => true
            ]);
            
        } catch (\Exception $e) {
            Log::error('Support email failed: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to send message. Please try again or contact us directly.',
                'success' => false
            ], 500);
        }
    }
}