<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CommandesTableSeeder extends Seeder
{
    public function run(): void
    {
        // Commande 1 : livrée
        $commande1Id = DB::table('commandes')->insertGetId([
            'user_id' => 2,
            'numero_commande' => 'CMD-' . date('Ymd') . '-A1B2',
            'montant_total' => 14.50,
            'statut' => 'livrée',
            'mode_paiement' => 'MVola',
            'adresse_livraison' => '12 Rue Andrianampoinimerina, Antananarivo',
            'created_at' => now()->subDays(3),
            'updated_at' => now()->subDays(3),
        ]);

        DB::table('details_commandes')->insert([
            [
                'commande_id' => $commande1Id,
                'produit_id' => 1,
                'quantite' => 1,
                'prix_unitaire' => 8.50,
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(3),
            ],
            [
                'commande_id' => $commande1Id,
                'produit_id' => 3,
                'quantite' => 2,
                'prix_unitaire' => 3.00,
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(3),
            ],
        ]);

        // Commande 2 : en attente de paiement
        $commande2Id = DB::table('commandes')->insertGetId([
            'user_id' => 2,
            'numero_commande' => 'CMD-' . date('Ymd') . '-C3D4',
            'montant_total' => 12.00,
            'statut' => 'en attente de paiement',
            'mode_paiement' => 'Orange Money',
            'adresse_livraison' => '12 Rue Andrianampoinimerina, Antananarivo',
            'created_at' => now()->subHours(2),
            'updated_at' => now()->subHours(2),
        ]);

        DB::table('details_commandes')->insert([
            [
                'commande_id' => $commande2Id,
                'produit_id' => 5,
                'quantite' => 1,
                'prix_unitaire' => 12.00,
                'created_at' => now()->subHours(2),
                'updated_at' => now()->subHours(2),
            ],
        ]);
    }
}