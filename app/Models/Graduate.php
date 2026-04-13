<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Graduate extends Model
{
    use HasFactory;

    protected $table = 'graduates';

    protected $primaryKey = 'id';

    public $timestamps = false; // using date_created & date_updated

    protected $fillable = [
        'user_id',
        'student_id',
        'firstname',
        'middlename',
        'lastname',
        'suffix',
        'gender',
        'birthdate',
        'place_of_birth',
        'civil_status',
        'nationality',
        'religion',
        'address',
        'city',
        'province',
        'postal_code',
        'contact_number',
        'email',
        'course',
        'department',
        'year_graduated',
        'honors',
        'status',
        'profile_picture',
        'date_created',
        'date_updated',
    ];

    protected $casts = [
        'birthdate' => 'date',
        'status' => 'boolean',
        'date_created' => 'datetime',
        'date_updated' => 'datetime',
    ];

    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}