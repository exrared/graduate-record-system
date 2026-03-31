<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        Log::info('Registration attempt', $request->all());
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users', // Required username
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'sometimes|string|in:user,graduate'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Map 'graduate' to 'user' since ENUM doesn't have 'graduate'
            $role = $request->role === 'graduate' ? 'user' : ($request->role ?? 'user');

            $user = User::create([
                'name' => $request->name,
                'username' => $request->username, // THIS WAS MISSING!
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $role,
                'status' => 1
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            Log::info('Registration successful', [
                'user_id' => $user->id,
                'username' => $user->username,
                'email' => $user->email
            ]);

            return response()->json([
                'message' => 'Registration successful',
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer'
            ], 201);

        } catch (\Exception $e) {
            Log::error('Registration error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Registration failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            Log::warning('Login failed: Invalid credentials', ['email' => $request->email]);
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        if ($user->status != 1) {
            Log::warning('Login failed: Account inactive', ['user_id' => $user->id]);
            return response()->json([
                'message' => 'Account is deactivated. Please contact administrator.'
            ], 403);
        }

        // Delete old tokens
        $user->tokens()->delete();
        
        // Create new token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Update last login
        $user->last_login = now();
        $user->save();

        Log::info('Login successful', ['user_id' => $user->id]);

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer'
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        
        Log::info('Logout successful', ['user_id' => $request->user()->id]);
        
        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}