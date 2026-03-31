<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Unauthorized. Please login.'
            ], 401);
        }
        
        // Allow users, graduates, and any authenticated user
        if (!in_array(Auth::user()->role, ['user', 'graduate', 'registrar', 'admin'])) {
            return response()->json([
                'message' => 'Access denied.'
            ], 403);
        }
        
        return $next($request);
    }
}