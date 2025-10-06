<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Lawyer;

class ProcesoFactory extends Factory
{
    public function definition(): array
    {
        $estados = ['Pendiente', 'En curso', 'Finalizado']; 
        $tipos = ['Civil', 'Laboral', 'Penal', 'Familia', 'Comercial'];

        return [
            'tipo_proceso'   => $this->faker->randomElement($tipos),
            'numero_radicado'=> $this->faker->unique()->numerify('RAD-########'),
            'demandante'     => $this->faker->name(),
            'demandado'      => $this->faker->name(),
            'descripcion'    => $this->faker->sentence(12),
            'estado'         => $this->faker->randomElement($estados),         
        ];
    }
}
