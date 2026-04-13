<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Graduate;
use App\Models\RecordRequest;
use App\Models\Payment;
use App\Models\StudentRecord;

class GraduateController extends Controller
{
    /**
     * Get graduate dashboard data
     */
    public function dashboard()
    {
        try {
            $user = Auth::user();
            $graduate = Graduate::where('user_id', $user->id)->first();
            
            if (!$graduate) {
                return response()->json([
                    'graduateName' => $user->name,
                    'totalRequests' => 0,
                    'pendingRequests' => 0,
                    'approvedRequests' => 0,
                    'completedRequests' => 0,
                    'totalSpent' => 0,
                    'pendingActions' => 0,
                    'recentRequests' => [],
                ]);
            }
            
            $requests = RecordRequest::where('graduate_id', $graduate->id)->get();
            
            $totalRequests = $requests->count();
            $pendingRequests = $requests->whereIn('request_status', ['pending', 'processing'])->count();
            $approvedRequests = $requests->where('request_status', 'approved')->count();
            $completedRequests = $requests->where('request_status', 'completed')->count();
            
            $totalSpent = Payment::whereIn('request_id', $requests->pluck('id'))
                ->where('payment_status', 'paid')
                ->sum('amount');
            
            $recentRequests = $requests->sortByDesc('request_date')->take(5)->values();
            
            return response()->json([
                'graduateName' => $graduate->firstname . ' ' . $graduate->lastname,
                'totalRequests' => $totalRequests,
                'pendingRequests' => $pendingRequests,
                'approvedRequests' => $approvedRequests,
                'completedRequests' => $completedRequests,
                'totalSpent' => (int)$totalSpent,
                'pendingActions' => $pendingRequests,
                'recentRequests' => $recentRequests,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'graduateName' => Auth::user()->name,
                'totalRequests' => 0,
                'pendingRequests' => 0,
                'approvedRequests' => 0,
                'completedRequests' => 0,
                'totalSpent' => 0,
                'pendingActions' => 0,
                'recentRequests' => [],
            ]);
        }
    }

    /**
     * Get graduate profile - RETURNS ALL FIELDS WITH IMAGE URL
     */
    public function getProfile()
    {
        try {
            $user = Auth::user();
            $graduate = Graduate::where('user_id', $user->id)->first();
            
            if (!$graduate) {
                // Return empty profile data with all fields
                return response()->json([
                    'id' => null,
                    'user_id' => $user->id,
                    'student_id' => '',
                    'firstname' => '',
                    'middlename' => '',
                    'lastname' => '',
                    'suffix' => '',
                    'gender' => '',
                    'birthdate' => '',
                    'place_of_birth' => '',
                    'civil_status' => '',
                    'nationality' => '',
                    'religion' => '',
                    'address' => '',
                    'city' => '',
                    'province' => '',
                    'postal_code' => '',
                    'contact_number' => '',
                    'email' => $user->email,
                    'course' => '',
                    'department' => '',
                    'year_graduated' => '',
                    'honors' => '',
                    'status' => 1,
                    'profile_picture' => null,
                    'profile_picture_url' => null,
                    'date_created' => null,
                    'date_updated' => null,
                ]);
            }
            
            // Generate full URL for profile picture
            $profilePictureUrl = null;
            if ($graduate->profile_picture) {
                $profilePictureUrl = asset('storage/' . $graduate->profile_picture);
            }
            
            // Return ALL graduate fields with image URL
            return response()->json([
                'id' => $graduate->id,
                'user_id' => $graduate->user_id,
                'student_id' => $graduate->student_id,
                'firstname' => $graduate->firstname,
                'middlename' => $graduate->middlename,
                'lastname' => $graduate->lastname,
                'suffix' => $graduate->suffix,
                'gender' => $graduate->gender,
                'birthdate' => $graduate->birthdate,
                'place_of_birth' => $graduate->place_of_birth,
                'civil_status' => $graduate->civil_status,
                'nationality' => $graduate->nationality,
                'religion' => $graduate->religion,
                'address' => $graduate->address,
                'city' => $graduate->city,
                'province' => $graduate->province,
                'postal_code' => $graduate->postal_code,
                'contact_number' => $graduate->contact_number,
                'email' => $graduate->email,
                'course' => $graduate->course,
                'department' => $graduate->department,
                'year_graduated' => $graduate->year_graduated,
                'honors' => $graduate->honors,
                'status' => $graduate->status,
                'profile_picture' => $graduate->profile_picture,
                'profile_picture_url' => $profilePictureUrl,
                'date_created' => $graduate->date_created,
                'date_updated' => $graduate->date_updated,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching profile: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update graduate profile - SAVES ALL FIELDS
     */
    public function updateProfile(Request $request)
    {
        try {
            $user = Auth::user();
            $graduate = Graduate::where('user_id', $user->id)->first();
            
            // Log the incoming data for debugging
            \Log::info('Updating profile for user: ' . $user->id);
            \Log::info('Request data: ', $request->all());
            
            // Prepare all data for update/create
            $data = [
                'student_id' => $request->student_id,
                'firstname' => $request->firstname,
                'middlename' => $request->middlename,
                'lastname' => $request->lastname,
                'suffix' => $request->suffix,
                'gender' => $request->gender,
                'birthdate' => $request->birthdate,
                'place_of_birth' => $request->place_of_birth,
                'civil_status' => $request->civil_status,
                'nationality' => $request->nationality,
                'religion' => $request->religion,
                'address' => $request->address,
                'city' => $request->city,
                'province' => $request->province,
                'postal_code' => $request->postal_code,
                'contact_number' => $request->contact_number,
                'email' => $request->email ?? $user->email,
                'course' => $request->course,
                'department' => $request->department,
                'year_graduated' => $request->year_graduated,
                'honors' => $request->honors,
                'date_updated' => now(),
            ];
            
            if (!$graduate) {
                // Create new profile with all fields
                $data['user_id'] = $user->id;
                $data['date_created'] = now();
                $data['status'] = 1;
                $graduate = Graduate::create($data);
                
                \Log::info('Created new graduate profile: ' . $graduate->id);
            } else {
                // Update existing profile with all fields
                $graduate->update($data);
                \Log::info('Updated graduate profile: ' . $graduate->id);
            }
            
            // Handle profile picture upload if present
            if ($request->hasFile('profile_picture')) {
                $file = $request->file('profile_picture');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('profile_pictures', $filename, 'public');
                $graduate->profile_picture = $path;
                $graduate->save();
                \Log::info('Profile picture uploaded: ' . $path);
            }
            
            // Refresh the model to get latest data
            $graduate->refresh();
            
            // Generate full URL for profile picture
            $profilePictureUrl = null;
            if ($graduate->profile_picture) {
                $profilePictureUrl = asset('storage/' . $graduate->profile_picture);
            }
            
            // Return the updated graduate with all fields
            return response()->json([
                'message' => 'Profile updated successfully',
                'graduate' => $graduate,
                'id' => $graduate->id,
                'student_id' => $graduate->student_id,
                'firstname' => $graduate->firstname,
                'middlename' => $graduate->middlename,
                'lastname' => $graduate->lastname,
                'suffix' => $graduate->suffix,
                'gender' => $graduate->gender,
                'birthdate' => $graduate->birthdate,
                'place_of_birth' => $graduate->place_of_birth,
                'civil_status' => $graduate->civil_status,
                'nationality' => $graduate->nationality,
                'religion' => $graduate->religion,
                'address' => $graduate->address,
                'city' => $graduate->city,
                'province' => $graduate->province,
                'postal_code' => $graduate->postal_code,
                'contact_number' => $graduate->contact_number,
                'email' => $graduate->email,
                'course' => $graduate->course,
                'department' => $graduate->department,
                'year_graduated' => $graduate->year_graduated,
                'honors' => $graduate->honors,
                'profile_picture' => $graduate->profile_picture,
                'profile_picture_url' => $profilePictureUrl,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating profile: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error updating profile: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get profile completion percentage
     */
    public function getProfileCompletion()
    {
        try {
            $user = Auth::user();
            $graduate = Graduate::where('user_id', $user->id)->first();
            
            if (!$graduate) {
                return response()->json([
                    'percentage' => 0,
                    'missingFields' => ['Complete your profile']
                ]);
            }
            
            $requiredFields = [
                'firstname', 'lastname', 'gender', 'birthdate', 
                'civil_status', 'address', 'contact_number', 
                'course', 'year_graduated', 'student_id'
            ];
            
            $missingFields = [];
            foreach ($requiredFields as $field) {
                if (empty($graduate->$field)) {
                    $missingFields[] = str_replace('_', ' ', ucfirst($field));
                }
            }
            
            $filledCount = count($requiredFields) - count($missingFields);
            $percentage = round(($filledCount / count($requiredFields)) * 100);
            
            return response()->json([
                'percentage' => $percentage,
                'missingFields' => $missingFields
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'percentage' => 0,
                'missingFields' => []
            ]);
        }
    }
}