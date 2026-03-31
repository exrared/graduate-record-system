<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\GraduateController;
use App\Http\Controllers\Api\StudentRecordController;
use App\Http\Controllers\Api\RecordRequestController;
use App\Http\Controllers\Api\RecordScheduleController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\AccessRightController;
use App\Http\Controllers\Api\AccessRoleController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DashboardController; // Add this import

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/roles', [RoleController::class, 'index']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Dashboard routes
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    
    // Admin only routes
    Route::middleware(['admin'])->group(function () {
        Route::get('/admin/stats', [DashboardController::class, 'adminStats']);
        Route::get('/admin/users', [AdminController::class, 'users']);
        Route::get('/admin/dashboard', [DashboardController::class, 'admin']);
    });
    
    // Registrar routes
    Route::middleware(['registrar'])->group(function () {
        Route::get('/registrar/dashboard', [DashboardController::class, 'registrar']);
        Route::get('/registrar/pending', [RecordRequestController::class, 'pending']);
    });
    
    // Graduate/User routes
    Route::middleware(['user'])->group(function () {
        Route::get('/graduate/dashboard', [DashboardController::class, 'graduate']);
        Route::get('/my-records', [StudentRecordController::class, 'myRecords']);
        Route::get('/my-requests', [RecordRequestController::class, 'myRequests']);
    });
    
    // Resource routes (protected)
    Route::apiResource('graduates', GraduateController::class);
    Route::apiResource('student-records', StudentRecordController::class);
    Route::apiResource('record-requests', RecordRequestController::class);
    Route::apiResource('record-schedules', RecordScheduleController::class);
    Route::apiResource('payments', PaymentController::class);
    Route::apiResource('activity-logs', ActivityLogController::class);
    Route::apiResource('access-rights', AccessRightController::class);
    Route::apiResource('access-roles', AccessRoleController::class);
});