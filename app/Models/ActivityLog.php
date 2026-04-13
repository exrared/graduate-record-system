<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class ActivityLog extends Model
{
    use HasFactory;

    protected $table = 'activity_logs';

    protected $fillable = [
        'user_id',
        'user_role',        // NEW: admin, registrar, user
        'action',           // NEW: login, logout, create, update, delete, approve, reject, verify
        'module',           // NEW: request, payment, user, schedule, document, auth
        'description',      // NEW: Detailed description
        'activity',         // OLD: keep for backward compatibility
        'old_data',         // NEW: JSON of previous state
        'new_data',         // NEW: JSON of new state
        'ip_address',
        'device',
        'user_agent',       // NEW: Browser/device info
        'log_date',
    ];

    protected $casts = [
        'log_date' => 'datetime',
        'old_data' => 'array',
        'new_data' => 'array',
    ];

    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scope for admin logs
    public function scopeAdmin($query)
    {
        return $query->where('user_role', 'admin');
    }

    // Scope for registrar logs
    public function scopeRegistrar($query)
    {
        return $query->where('user_role', 'registrar');
    }

    // Scope for user logs
    public function scopeUser($query)
    {
        return $query->where('user_role', 'user');
    }

    // Scope for specific action
    public function scopeAction($query, $action)
    {
        return $query->where('action', $action);
    }

    // Scope for specific module
    public function scopeModule($query, $module)
    {
        return $query->where('module', $module);
    }

    // Scope for date range
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('log_date', [$startDate, $endDate]);
    }
}