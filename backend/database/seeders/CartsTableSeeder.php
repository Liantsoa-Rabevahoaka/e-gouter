<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CartsTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('carts')->insert([
            'user_id' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}