<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Graduate;

class RecordRequest extends Model
{
    use HasFactory;

    protected $table = 'record_requests';

    protected $fillable = [
        'graduate_id',
        'request_type',
        'purpose',
        'quantity',
        'request_date',
        'request_status',
        'schedule_date',
        'payment_status',
        'remarks',
    ];

    protected $casts = [
        'request_date' => 'date',
        'schedule_date' => 'date',
    ];

    // Relation to Graduate
    public function graduate()
    {
        return $this->belongsTo(Graduate::class);
    }
}