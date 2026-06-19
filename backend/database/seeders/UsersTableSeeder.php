<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'id' => 1,
                'nom' => 'Admin',
                'prenom' => 'System',
                'email' => 'admin@egouter.com',
                'telephone' => '0102030405',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'nom' => 'Rakoto',
                'prenom' => 'Jean',
                'email' => 'client@egouter.com',
                'telephone' => '0321234567',
                'password' => Hash::make('password'),
                'role' => 'client',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'nom' => 'Snack',
                'prenom' => 'Rapido',
                'email' => 'rapido@egouter.com',
                'telephone' => '034123456',
                'password' => Hash::make('password'),
                'role' => 'fournisseur',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'nom' => 'Pizza',
                'prenom' => 'Hut',
                'email' => 'pizza@egouter.com',
                'telephone' => '034234567',
                'password' => Hash::make('password'),
                'role' => 'fournisseur',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 5,
                'nom' => 'Chez',
                'prenom' => 'Tacos',
                'email' => 'tacos@egouter.com',
                'telephone' => '034345678',
                'password' => Hash::make('password'),
                'role' => 'fournisseur',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 6,
                'nom' => 'Patisserie',
                'prenom' => 'Douceur',
                'email' => 'douceur@egouter.com',
                'telephone' => '034456789',
                'password' => Hash::make('password'),
                'role' => 'fournisseur',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 7,
                'nom' => 'Wok',
                'prenom' => 'Noodles',
                'email' => 'wok@egouter.com',
                'telephone' => '034567890',
                'password' => Hash::make('password'),
                'role' => 'fournisseur',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}