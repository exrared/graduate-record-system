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
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Api\SupportController;
use App\Http\Controllers\Api\Registrar\RequestController;
use App\Http\Controllers\Api\Registrar\ScheduleController;
use App\Http\Controllers\Api\Registrar\PaymentController as RegistrarPaymentController;
use App\Http\Controllers\Api\Registrar\GraduateController as RegistrarGraduateController;
use App\Http\Controllers\Api\Registrar\DocumentController;

// NEW ADMIN CONTROLLERS (organized)
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\UserManagementController;
use App\Http\Controllers\Api\Admin\SecurityController;
use App\Http\Controllers\Api\Admin\BackupController;
use App\Http\Controllers\Api\Admin\RoleManagementController;

// ==================== PUBLIC ROUTES ====================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/roles', [RoleController::class, 'index']);

// ==================== PROTECTED ROUTES ====================
Route::middleware('auth:sanctum')->group(function () {
    
    // ========== AUTH ROUTES ==========
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // ========== DASHBOARD ROUTES ==========
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    
    // ========== SUPPORT ROUTE ==========
    Route::post('/support/contact', [SupportController::class, 'sendEmail']);
    
    // ========== NOTIFICATION ENDPOINTS ==========
    Route::get('/admin/notifications', function() {
        return response()->json([
            [
                'id' => 1,
                'type' => 'success',
                'title' => 'Welcome!',
                'message' => 'Welcome to GradTrack System',
                'isRead' => false,
                'createdAt' => now()->toISOString(),
                'link' => null
            ],
            [
                'id' => 2,
                'type' => 'info',
                'title' => 'System Ready',
                'message' => 'Your dashboard is ready to use',
                'isRead' => false,
                'createdAt' => now()->toISOString(),
                'link' => null
            ]
        ]);
    });
    Route::put('/admin/notifications/{id}/read', function($id) {
        return response()->json(['message' => 'Notification marked as read']);
    });
    Route::post('/admin/notifications/read-all', function() {
        return response()->json(['message' => 'All notifications marked as read']);
    });
    
    // ========== ACTIVITY LOGS ROUTES ==========
    // Admin only
    Route::middleware(['admin'])->group(function () {
        Route::get('/admin/activity-logs', [ActivityLogController::class, 'index']);
        Route::get('/admin/activity-logs/export', [ActivityLogController::class, 'export']);
        Route::delete('/admin/activity-logs/clear', [ActivityLogController::class, 'clearOldLogs']);
    });
    
    // Registrar
    Route::middleware(['registrar'])->group(function () {
        Route::get('/registrar/activity-logs', [ActivityLogController::class, 'registrarLogs']);
        Route::get('/registrar/activity-logs/export', [ActivityLogController::class, 'export']);
    });
    
    // Common
    Route::get('/activity-logs/{id}', [ActivityLogController::class, 'show']);
    Route::get('/users/{id}/activity-logs', [ActivityLogController::class, 'userLogs']);
    
    // ========== REGISTRAR ROUTES ==========
    Route::middleware(['registrar'])->prefix('registrar')->group(function () {
        // Request Management
        Route::get('/requests', [RequestController::class, 'index']);
        Route::get('/requests/pending', [RequestController::class, 'pending']);
        Route::get('/requests/approved', [RequestController::class, 'approved']);
        Route::get('/requests/{id}', [RequestController::class, 'show']);
        Route::put('/requests/{id}/approve', [RequestController::class, 'approve']);
        Route::put('/requests/{id}/reject', [RequestController::class, 'reject']);
        Route::put('/requests/{id}/processing', [RequestController::class, 'markProcessing']);
        Route::put('/requests/{id}/ready', [RequestController::class, 'markReady']);
        Route::put('/requests/{id}/complete', [RequestController::class, 'markCompleted']);
        Route::get('/requests/stats', [RequestController::class, 'stats']);
        
        // Schedule Management
        Route::post('/requests/{id}/schedule', [ScheduleController::class, 'store']);
        Route::get('/schedules/{requestId}', [ScheduleController::class, 'show']);
        Route::get('/schedules/upcoming/all', [ScheduleController::class, 'upcoming']);
        Route::delete('/schedules/{id}', [ScheduleController::class, 'destroy']);
        
        // Payment Management
        Route::get('/payments', [RegistrarPaymentController::class, 'index']);
        Route::get('/payments/pending', [RegistrarPaymentController::class, 'pending']);
        Route::get('/payments/{id}', [RegistrarPaymentController::class, 'show']);
        Route::put('/payments/{id}/verify', [RegistrarPaymentController::class, 'verify']);
        Route::put('/payments/{id}/reject', [RegistrarPaymentController::class, 'reject']);
        Route::get('/payments/stats', [RegistrarPaymentController::class, 'stats']);
        
        // Graduate Management
        Route::get('/graduates', [RegistrarGraduateController::class, 'index']);
        Route::get('/graduates/{id}', [RegistrarGraduateController::class, 'show']);
        Route::get('/graduates/student/{studentId}', [RegistrarGraduateController::class, 'findByStudentId']);
        Route::get('/graduates/stats', [RegistrarGraduateController::class, 'stats']);
        Route::put('/graduates/{id}/status', [RegistrarGraduateController::class, 'updateStatus']);
        
        // Document Management
        Route::get('/documents', [DocumentController::class, 'index']);
        Route::post('/documents/upload', [DocumentController::class, 'upload']);
        Route::get('/documents/{id}', [DocumentController::class, 'show']);
        Route::put('/documents/{id}', [DocumentController::class, 'update']);
        Route::delete('/documents/{id}', [DocumentController::class, 'destroy']);
        Route::get('/documents/{id}/download', [DocumentController::class, 'download']);
        Route::get('/graduates/{graduateId}/documents', [DocumentController::class, 'byGraduate']);
    });
    
    // ========== ADMIN ROUTES (UPDATED - USING ORGANIZED CONTROLLERS) ==========
    Route::middleware(['admin'])->prefix('admin')->group(function () {
        // Dashboard
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);
        Route::get('/stats', [AdminDashboardController::class, 'stats']);
        
        // User Management
        Route::get('/users', [UserManagementController::class, 'index']);
        Route::get('/users/{id}', [UserManagementController::class, 'show']);
        Route::post('/users', [UserManagementController::class, 'store']);
        Route::put('/users/{id}', [UserManagementController::class, 'update']);
        Route::delete('/users/{id}', [UserManagementController::class, 'destroy']);
        Route::post('/users/{id}/deactivate', [UserManagementController::class, 'deactivate']);
        Route::post('/users/{id}/activate', [UserManagementController::class, 'activate']);
        Route::put('/users/{id}/role', [UserManagementController::class, 'updateRole']);
        
        // Security
        Route::get('/security/alerts', [SecurityController::class, 'alerts']);
        Route::get('/security/unauthorized', [SecurityController::class, 'unauthorizedAttempts']);
        Route::get('/security/logs', [SecurityController::class, 'activityLogs']);
        
        // Backup
        Route::get('/backup/history', [BackupController::class, 'history']);
        Route::post('/backup/create', [BackupController::class, 'create']);
        Route::post('/backup/restore', [BackupController::class, 'restore']);
        Route::get('/backup/verify', [BackupController::class, 'verify']);
        
        // Role Management
        Route::get('/roles', [RoleManagementController::class, 'index']);
        Route::post('/roles', [RoleManagementController::class, 'store']);
        Route::put('/roles/{id}', [RoleManagementController::class, 'update']);
        Route::delete('/roles/{id}', [RoleManagementController::class, 'destroy']);
        Route::put('/roles/{id}/status', [RoleManagementController::class, 'updateStatus']);
    });
    
    // ========== GRADUATE/USER ROUTES ==========
    Route::middleware(['user'])->group(function () {
        // Dashboard
        Route::get('/graduate/dashboard', [GraduateController::class, 'dashboard']);
        
        // Profile
        Route::get('/graduate/profile', [GraduateController::class, 'getProfile']);
        Route::post('/graduate/profile', [GraduateController::class, 'updateProfile']);
        Route::get('/graduate/profile-completion', [GraduateController::class, 'getProfileCompletion']);
        
        // Student Records
        Route::get('/graduate/student-records', [StudentRecordController::class, 'myRecords']);
        Route::get('/graduate/student-records/{id}/download', [StudentRecordController::class, 'download']);
        
        // Document Requests
        Route::get('/graduate/requests', [RecordRequestController::class, 'myRequests']);
        Route::post('/graduate/requests', [RecordRequestController::class, 'store']);
        Route::get('/graduate/requests/history', [RecordRequestController::class, 'history']);
        Route::get('/graduate/requests/{id}/track', [RecordRequestController::class, 'track']);
        
        // Payments
        Route::get('/graduate/payments', [PaymentController::class, 'myPayments']);
        Route::post('/graduate/requests/{id}/payment', [PaymentController::class, 'uploadProof']);
        Route::get('/graduate/payments/{id}/receipt', [PaymentController::class, 'downloadReceipt']);
        
        // Legacy routes
        Route::get('/my-records', [StudentRecordController::class, 'myRecords']);
        Route::get('/my-requests', [RecordRequestController::class, 'myRequests']);
    });
    
    // ========== RESOURCE ROUTES ==========
    Route::apiResource('graduates', GraduateController::class);
    Route::apiResource('student-records', StudentRecordController::class);
    Route::apiResource('record-requests', RecordRequestController::class);
    Route::apiResource('record-schedules', RecordScheduleController::class);
    Route::apiResource('payments', PaymentController::class);
    Route::apiResource('activity-logs', ActivityLogController::class);
    Route::apiResource('access-rights', AccessRightController::class);
    Route::apiResource('access-roles', AccessRoleController::class);
});