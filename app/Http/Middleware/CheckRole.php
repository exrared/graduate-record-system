<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Unauthorized. Please login.'
            ], 401);
        }
        
        if (!in_array(Auth::user()->role, $roles)) {
            return response()->json([
                'message' => 'Access denied. Required role: ' . implode(', ', $roles)
            ], 403);
        }
        
        return $next($request);
    }
}