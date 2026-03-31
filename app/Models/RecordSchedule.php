<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\RecordRequest;

class RecordSchedule extends Model
{
    use HasFactory;

    protected $table = 'record_schedules';

    protected $fillable = [
        'request_id',
        'release_date',
        'release_time',
        'location',
        'status',
    ];

    protected $casts = [
        'release_date' => 'date',
        'release_time' => 'datetime:H:i',
    ];

    // Relation to RecordRequest
    public function recordRequest()
    {
        return $this->belongsTo(RecordRequest::class, 'request_id');
    }
}