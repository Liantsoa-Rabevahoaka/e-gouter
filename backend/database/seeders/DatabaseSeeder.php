<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Nettoyage des tables (dans l'ordre inverse des dépendances)
        DB::table('cart_items')->truncate();
        DB::table('carts')->truncate();
        DB::table('details_commandes')->truncate();
        DB::table('commandes')->truncate();
        DB::table('produits')->truncate();
        DB::table('fournisseurs')->truncate();
        DB::table('users')->truncate();

        // ==============================================
        // 1. Création des utilisateurs
        // ==============================================

        // Admin
        $adminId = DB::table('users')->insertGetId([
            'nom' => 'Admin',
            'prenom' => 'System',
            'email' => 'admin@egouter.com',
            'telephone' => '0102030405',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Client de test
        $clientId = DB::table('users')->insertGetId([
            'nom' => 'Dupont',
            'prenom' => 'Jean',
            'email' => 'client@egouter.com',
            'telephone' => '0612345678',
            'password' => Hash::make('password'),
            'role' => 'client',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Fournisseur 1 - Snack Express
        $f1UserId = DB::table('users')->insertGetId([
            'nom' => 'Snack',
            'prenom' => 'Express',
            'email' => 'snack@egouter.com',
            'telephone' => '0623456789',
            'password' => Hash::make('password'),
            'role' => 'fournisseur',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Fournisseur 2 - Chez Momo
        $f2UserId = DB::table('users')->insertGetId([
            'nom' => 'Chez',
            'prenom' => 'Momo',
            'email' => 'momo@egouter.com',
            'telephone' => '0634567890',
            'password' => Hash::make('password'),
            'role' => 'fournisseur',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Fournisseur 3 - Pause Gourmande
        $f3UserId = DB::table('users')->insertGetId([
            'nom' => 'Pause',
            'prenom' => 'Gourmande',
            'email' => 'pause@egouter.com',
            'telephone' => '0645678901',
            'password' => Hash::make('password'),
            'role' => 'fournisseur',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // ==============================================
        // 2. Création des fournisseurs (profils)
        // ==============================================

        // Snack Express (proche du centre de Paris)
        $f1Id = DB::table('fournisseurs')->insertGetId([
            'user_id' => $f1UserId,
            'nom' => 'Snack Express',
            'adresse' => '15 Rue de Rivoli, 75001 Paris',
            'latitude' => 48.8566,
            'longitude' => 2.3522,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Chez Momo (un peu plus au nord)
        $f2Id = DB::table('fournisseurs')->insertGetId([
            'user_id' => $f2UserId,
            'nom' => 'Chez Momo',
            'adresse' => '42 Boulevard de la Chapelle, 75018 Paris',
            'latitude' => 48.8900,
            'longitude' => 2.3500,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Pause Gourmande (dans le quartier latin)
        $f3Id = DB::table('fournisseurs')->insertGetId([
            'user_id' => $f3UserId,
            'nom' => 'Pause Gourmande',
            'adresse' => '8 Rue Mouffetard, 75005 Paris',
            'latitude' => 48.8425,
            'longitude' => 2.3480,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // ==============================================
        // 3. Création des produits
        // ==============================================

        // Produits pour Snack Express (f1Id)
        $produits = [
            // Snack Express (f1Id)
            [$f1Id, 'Sandwich Jambon Beurre', 'Sandwich traditionnel jambon beurre frais', 4.50, 'https://picsum.photos/id/106/200/200'],
            [$f1Id, 'Café Allongé', 'Café 100% Arabica, torréfaction artisanale', 2.00, 'https://picsum.photos/id/225/200/200'],
            [$f1Id, 'Jus d\'Orange', 'Jus d\'orange frais pressé sur place', 3.00, 'https://picsum.photos/id/102/200/200'],
            [$f1Id, 'Croissant', 'Croissant pur beurre feuilleté maison', 1.80, 'https://picsum.photos/id/292/200/200'],
            [$f1Id, 'Pain au Chocolat', 'Pain au chocolat artisanal', 1.80, 'https://picsum.photos/id/264/200/200'],
            
            // Chez Momo (f2Id)
            [$f2Id, 'Tacos Viande', 'Tacos sauce blanche, viande, frites', 7.50, 'https://picsum.photos/id/108/200/200'],
            [$f2Id, 'Frites Maison', 'Frites fraîches découpées maison', 3.00, 'https://picsum.photos/id/127/200/200'],
            [$f2Id, 'Coca-Cola', 'Coca-Cola 33cl en bouteille', 2.00, 'https://picsum.photos/id/129/200/200'],
            [$f2Id, 'Muffin Chocolat', 'Muffin fondant au cœur chocolat', 2.50, 'https://picsum.photos/id/136/200/200'],
            
            // Pause Gourmande (f3Id)
            [$f3Id, 'Salade César', 'Poulet grillé, parmesan, croûtons, sauce césar', 8.50, 'https://picsum.photos/id/143/200/200'],
            [$f3Id, 'Quiche Lorraine', 'Quiche faite maison, salade en accompagnement', 5.00, 'https://picsum.photos/id/158/200/200'],
            [$f3Id, 'Thé Vert', 'Thé vert matcha menthe', 2.20, 'https://picsum.photos/id/169/200/200'],
            [$f3Id, 'Club Sandwich', 'Club sandwich poulet, bacon, tomate, salade', 6.50, 'https://picsum.photos/id/185/200/200'],
        ];

        foreach ($produits as $produit) {
            DB::table('produits')->insert([
                'fournisseur_id' => $produit[0],
                'nom' => $produit[1],
                'description' => $produit[2],
                'prix' => $produit[3],
                'image' => $produit[4],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // ==============================================
        // 4. Créer un panier pour le client
        // ==============================================
        DB::table('carts')->insert([
            'user_id' => $clientId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->command->info('✅ Base de données initialisée avec succès !');
        $this->command->info('');
        $this->command->info('📊 Comptes de test :');
        $this->command->info('   Admin    : admin@egouter.com / password');
        $this->command->info('   Client   : client@egouter.com / password');
        $this->command->info('   Snack    : snack@egouter.com / password');
        $this->command->info('   Momo     : momo@egouter.com / password');
        $this->command->info('   Pause    : pause@egouter.com / password');
        $this->command->info('');
        $this->command->info('📍 Coordonnées des fournisseurs (pour tests GPS) :');
        $this->command->info('   Snack Express   : 48.8566, 2.3522 (centre Paris)');
        $this->command->info('   Chez Momo       : 48.8900, 2.3500 (nord Paris)');
        $this->command->info('   Pause Gourmande : 48.8425, 2.3480 (quartier latin)');
    }
}