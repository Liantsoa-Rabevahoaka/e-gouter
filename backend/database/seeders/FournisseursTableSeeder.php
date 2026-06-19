<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FournisseursTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('fournisseurs')->insert([
            [
                'id' => 1,
                'user_id' => 3,
                'nom' => 'Snack Rapido',
                'adresse' => 'Avenue de l\'Indépendance, Analakely, Antananarivo',
                'latitude' => -18.9068,
                'longitude' => 47.5291,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'user_id' => 4,
                'nom' => 'Pizza Hut Express',
                'adresse' => 'Route d\'Andraharo, Antananarivo',
                'latitude' => -18.8912,
                'longitude' => 47.5305,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'user_id' => 5,
                'nom' => 'Chez Tacos',
                'adresse' => 'Ambohijatovo, Antananarivo',
                'latitude' => -18.9113,
                'longitude' => 47.5240,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'user_id' => 6,
                'nom' => 'Pâtisserie Douceur',
                'adresse' => 'Isoraka, Antananarivo',
                'latitude' => -18.8789,
                'longitude' => 47.5156,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 5,
                'user_id' => 7,
                'nom' => 'Wok & Noodles',
                'adresse' => 'Behoririka, Antananarivo',
                'latitude' => -18.9136,
                'longitude' => 47.5292,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}