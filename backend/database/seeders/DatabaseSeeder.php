<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(UsersTableSeeder::class);
        $this->call(FournisseursTableSeeder::class);
        $this->call(ProduitsTableSeeder::class);
        $this->call(CartsTableSeeder::class);
        $this->call(CommandesTableSeeder::class);
    }
}