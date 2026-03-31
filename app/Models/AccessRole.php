<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Role;
use App\Models\AccessRight;

class AccessRole extends Model
{
    use HasFactory;

    protected $fillable = [
        'role_id',
        'accessright_id',
        'status',
    ];

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function accessRight()
    {
        return $this->belongsTo(AccessRight::class, 'accessright_id');
    }
}