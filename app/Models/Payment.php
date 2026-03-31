<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\RecordRequest;

class Payment extends Model
{
    use HasFactory;

    protected $table = 'payments';

    protected $fillable = [
        'request_id',
        'amount',
        'payment_method',
        'reference_number',
        'payment_date',
        'payment_status',
    ];

    protected $casts = [
        'payment_date' => 'date',
    ];

    // Relation to RecordRequest
    public function recordRequest()
    {
        return $this->belongsTo(RecordRequest::class, 'request_id');
    }
}