<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $table = 'roles';

    protected $primaryKey = 'id';

    public $timestamps = false; // since we use date_created instead

    protected $fillable = [
        'role_name',
        'description',
        'status',
        'date_created'
    ];
}