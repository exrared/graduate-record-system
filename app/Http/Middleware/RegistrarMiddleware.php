<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RegistrarMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Unauthorized. Please login.'
            ], 401);
        }
        
        if (!in_array(Auth::user()->role, ['registrar', 'admin'])) {
            return response()->json([
                'message' => 'Access denied. Registrar privileges required.'
            ], 403);
        }
        
        return $next($request);
    }
}