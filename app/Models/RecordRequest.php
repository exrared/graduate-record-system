<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    // Relation to RecordSchedule
    public function schedule()
    {
        return $this->hasOne(RecordSchedule::class, 'request_id');
    }

    // Relation to Payment
    public function payment()
    {
        return $this->hasOne(Payment::class, 'request_id');
    }
}