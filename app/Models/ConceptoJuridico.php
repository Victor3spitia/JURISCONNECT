<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConceptoJuridico extends Model
{
    protected $fillable = [
        'id',
        'titulo',
        'categoria', 
        'descripcion',
        'abogado_id',
        'estado',
        'concepto',
        'fecha_radicacion',
        
    ];

    protected $casts = [
        'fecha_radicacion' => 'date',
    ];
    
    protected $attributes = [
    'abogado_id' => null, // O un valor por defecto
];

    // Relación con el abogado (usuario)
    public function abogado(): BelongsTo
    {
        return $this->belongsTo(User::class, 'abogado_id');
    }

    // Relación con el proceso
    public function proceso()
    {
        return $this->belongsTo(Proceso::class, 'proceso_id');
    }
}