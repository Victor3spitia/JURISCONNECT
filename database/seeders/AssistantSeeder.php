<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Assistant;

class AssistantSeeder extends Seeder
{
    public function run(): void
    {
        Assistant::factory()->count(20)->create();
    }
}
