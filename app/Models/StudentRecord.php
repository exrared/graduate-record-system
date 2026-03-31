<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Graduate;

class StudentRecord extends Model
{
    use HasFactory;

    protected $table = 'student_records';

    protected $fillable = [
        'graduate_id',
        'record_type',
        'description',
        'file_path',
        'uploaded_by',
        'date_uploaded',
        'status',
    ];

    protected $casts = [
        'date_uploaded' => 'datetime',
        'status' => 'boolean',
    ];

    // Relation to Graduate
    public function graduate()
    {
        return $this->belongsTo(Graduate::class);
    }
}