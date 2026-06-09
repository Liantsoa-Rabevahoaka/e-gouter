<?php
// database/seeders/EGouterDatabaseSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EGouterDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Vider les tables existantes (optionnel)
        DB::table('details_commandes')->truncate();
        DB::table('commandes')->truncate();
        DB::table('produits')->truncate();
        DB::table('fournisseurs')->truncate();
        DB::table('users')->truncate();

        // 2. Utilisateurs
        DB::table('users')->insert([
            [
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
                'nom' => 'Dupont',
                'prenom' => 'Jean',
                'email' => 'client@egouter.com',
                'telephone' => '0612345678',
                'password' => Hash::make('password'),
                'role' => 'client',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Martin',
                'prenom' => 'Sophie',
                'email' => 'fournisseur@egouter.com',
                'telephone' => '0623456789',
                'password' => Hash::make('password'),
                'role' => 'fournisseur',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // 3. Fournisseurs
        DB::table('fournisseurs')->insert([
            [
                'user_id' => 3,
                'nom' => 'Snack Express',
                'adresse' => '15 Rue de Paris, 75001 Paris',
                'latitude' => 48.85660000,
                'longitude' => 2.35220000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 3,
                'nom' => 'Chez Momo',
                'adresse' => '42 Avenue des Champs, 75008 Paris',
                'latitude' => 48.87380000,
                'longitude' => 2.29500000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 3,
                'nom' => 'Pause Gourmande',
                'adresse' => '8 Boulevard Saint-Michel, 75005 Paris',
                'latitude' => 48.84620000,
                'longitude' => 2.34310000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // 4. Produits
        $produits = [
            // Snack Express (fournisseur_id=1)
            [1, 'Sandwich Jambon Beurre', 4.50, 'Sandwich traditionnel jambon beurre frais', 'https://picsum.photos/id/106/200/200'],
            [1, 'Café Allongé', 2.00, 'Café 100% Arabica, torréfaction artisanale', 'https://picsum.photos/id/225/200/200'],
            [1, 'Jus d\'Orange', 3.00, 'Jus d\'orange frais pressé sur place', 'https://picsum.photos/id/102/200/200'],
            [1, 'Croissant', 1.80, 'Croissant pur beurre feuilleté maison', 'https://picsum.photos/id/292/200/200'],
            [1, 'Pain au Chocolat', 1.80, 'Pain au chocolat artisanal', 'https://picsum.photos/id/264/200/200'],
            [1, 'Eau Minérale', 1.00, 'Eau plate 50cl', 'https://picsum.photos/id/30/200/200'],
            
            // Chez Momo (fournisseur_id=2)
            [2, 'Tacos Viande', 7.50, 'Tacos sauce blanche, viande, frites', 'https://picsum.photos/id/108/200/200'],
            [2, 'Frites Maison', 3.00, 'Frites fraîches découpées maison', 'https://picsum.photos/id/127/200/200'],
            [2, 'Coca-Cola', 2.00, 'Coca-Cola 33cl en bouteille', 'https://picsum.photos/id/129/200/200'],
            [2, 'Muffin Chocolat', 2.50, 'Muffin fondant au cœur chocolat', 'https://picsum.photos/id/136/200/200'],
            [2, 'Sandwich Thon', 5.00, 'Sandwich thon crudités', 'https://picsum.photos/id/159/200/200'],
            
            // Pause Gourmande (fournisseur_id=3)
            [3, 'Salade César', 8.50, 'Poulet grillé, parmesan, croutons, sauce césar', 'https://picsum.photos/id/143/200/200'],
            [3, 'Quiche Lorraine', 5.00, 'Quiche faite maison, salade en accompagnement', 'https://picsum.photos/id/158/200/200'],
            [3, 'Thé Vert', 2.20, 'Thé vert matcha menthe', 'https://picsum.photos/id/169/200/200'],
            [3, 'Club Sandwich', 6.50, 'Club sandwich poulet, bacon, tomate, salade', 'https://picsum.photos/id/185/200/200'],
            [3, 'Jus Multivitaminé', 3.50, 'Mélange de fruits frais', 'https://picsum.photos/id/196/200/200'],
        ];

        foreach ($produits as $produit) {
            DB::table('produits')->insert([
                'fournisseur_id' => $produit[0],
                'nom' => $produit[1],
                'prix' => $produit[2],
                'description' => $produit[3],
                'image' => $produit[4],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 5. Ajouter quelques commandes d'exemple
        DB::table('commandes')->insert([
            [
                'user_id' => 2,
                'numero_commande' => 'CMD-' . strtoupper(uniqid()),
                'montant_total' => 8.50,
                'statut' => 'livree',
                'mode_paiement' => 'MVola',
                'adresse_livraison' => '12 Rue de Paris, 75001 Paris',
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            [
                'user_id' => 2,
                'numero_commande' => 'CMD-' . strtoupper(uniqid()),
                'montant_total' => 4.50,
                'statut' => 'en_attente',
                'mode_paiement' => 'Orange Money',
                'adresse_livraison' => '12 Rue de Paris, 75001 Paris',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // 6. Détails des commandes
        DB::table('details_commandes')->insert([
            [
                'commande_id' => 1,
                'produit_id' => 1,
                'quantite' => 1,
                'prix_unitaire' => 4.50,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'commande_id' => 1,
                'produit_id' => 2,
                'quantite' => 2,
                'prix_unitaire' => 2.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'commande_id' => 2,
                'produit_id' => 8,
                'quantite' => 1,
                'prix_unitaire' => 4.50,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        $this->command->info('✅ Base de données initialisée avec succès !');
        $this->command->info('📊 Utilisateurs : admin@egouter.com / password');
        $this->command->info('📊 Client : client@egouter.com / password');
        $this->command->info('📊 Fournisseur : fournisseur@egouter.com / password');
    }
}