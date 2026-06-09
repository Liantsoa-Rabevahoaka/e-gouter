<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EGouterDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Nettoyage
        DB::table('details_commandes')->truncate();
        DB::table('commandes')->truncate();
        DB::table('cart_items')->truncate();
        DB::table('carts')->truncate();
        DB::table('produits')->truncate();
        DB::table('fournisseurs')->truncate();
        DB::table('users')->truncate();

        // 1. Admin
        $adminId = DB::table('users')->insertGetId([
            'nom' => 'Admin', 'prenom' => 'System', 'email' => 'admin@egouter.com',
            'telephone' => '0102030405', 'password' => Hash::make('password'), 'role' => 'admin',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        // 2. Client
        $clientId = DB::table('users')->insertGetId([
            'nom' => 'Dupont', 'prenom' => 'Jean', 'email' => 'client@egouter.com',
            'telephone' => '0612345678', 'password' => Hash::make('password'), 'role' => 'client',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        // 3. Trois fournisseurs (comptes séparés)
        $fournisseur1Id = DB::table('users')->insertGetId([
            'nom' => 'Snack', 'prenom' => 'Express', 'email' => 'snack@egouter.com',
            'telephone' => '0623456789', 'password' => Hash::make('password'), 'role' => 'fournisseur',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        $fournisseur2Id = DB::table('users')->insertGetId([
            'nom' => 'Chez', 'prenom' => 'Momo', 'email' => 'momo@egouter.com',
            'telephone' => '0634567890', 'password' => Hash::make('password'), 'role' => 'fournisseur',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        $fournisseur3Id = DB::table('users')->insertGetId([
            'nom' => 'Pause', 'prenom' => 'Gourmande', 'email' => 'pause@egouter.com',
            'telephone' => '0645678901', 'password' => Hash::make('password'), 'role' => 'fournisseur',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        // 4. Fournisseurs (profil)
        $f1 = DB::table('fournisseurs')->insertGetId([
            'user_id' => $fournisseur1Id, 'nom' => 'Snack Express',
            'adresse' => '15 Rue de Paris, 75001 Paris', 'latitude' => 48.856600, 'longitude' => 2.352200,
            'created_at' => now(), 'updated_at' => now(),
        ]);
        $f2 = DB::table('fournisseurs')->insertGetId([
            'user_id' => $fournisseur2Id, 'nom' => 'Chez Momo',
            'adresse' => '42 Avenue des Champs, 75008 Paris', 'latitude' => 48.873800, 'longitude' => 2.295000,
            'created_at' => now(), 'updated_at' => now(),
        ]);
        $f3 = DB::table('fournisseurs')->insertGetId([
            'user_id' => $fournisseur3Id, 'nom' => 'Pause Gourmande',
            'adresse' => '8 Boulevard Saint-Michel, 75005 Paris', 'latitude' => 48.846200, 'longitude' => 2.343100,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        // 5. Produits
        $produits = [
            [$f1, 'Sandwich Jambon Beurre', 4.50, 'Sandwich traditionnel', 'https://picsum.photos/id/106/200/200'],
            [$f1, 'Café Allongé', 2.00, 'Café Arabica', 'https://picsum.photos/id/225/200/200'],
            [$f1, 'Jus d\'Orange', 3.00, 'Frais pressé', 'https://picsum.photos/id/102/200/200'],
            [$f1, 'Croissant', 1.80, 'Feuilleté', 'https://picsum.photos/id/292/200/200'],
            [$f1, 'Pain au Chocolat', 1.80, 'Artisanal', 'https://picsum.photos/id/264/200/200'],
            [$f2, 'Tacos Viande', 7.50, 'Tacos sauce blanche', 'https://picsum.photos/id/108/200/200'],
            [$f2, 'Frites Maison', 3.00, 'Frites fraîches', 'https://picsum.photos/id/127/200/200'],
            [$f2, 'Coca-Cola', 2.00, '33cl', 'https://picsum.photos/id/129/200/200'],
            [$f2, 'Muffin Chocolat', 2.50, 'Fondant', 'https://picsum.photos/id/136/200/200'],
            [$f3, 'Salade César', 8.50, 'Poulet, parmesan', 'https://picsum.photos/id/143/200/200'],
            [$f3, 'Quiche Lorraine', 5.00, 'Maison', 'https://picsum.photos/id/158/200/200'],
            [$f3, 'Thé Vert', 2.20, 'Matcha menthe', 'https://picsum.photos/id/169/200/200'],
            [$f3, 'Club Sandwich', 6.50, 'Poulet, bacon', 'https://picsum.photos/id/185/200/200'],
        ];
        foreach ($produits as $p) {
            DB::table('produits')->insert([
                'fournisseur_id' => $p[0], 'nom' => $p[1], 'prix' => $p[2],
                'description' => $p[3], 'image' => $p[4], 'created_at' => now(), 'updated_at' => now(),
            ]);
        }

        // 6. Commandes
        $commande1 = DB::table('commandes')->insertGetId([
            'user_id' => $clientId,
            'numero_commande' => 'CMD-'.date('Ymd').'-'.strtoupper(substr(uniqid(), -4)),
            'montant_total' => 8.50,
            'statut' => 'livrée',
            'mode_paiement' => 'MVola',
            'adresse_livraison' => '12 Rue de Paris, 75001 Paris',
            'created_at' => now()->subDays(2), 'updated_at' => now()->subDays(2),
        ]);
        DB::table('details_commandes')->insert([
            'commande_id' => $commande1, 'produit_id' => 1, 'quantite' => 1, 'prix_unitaire' => 4.50,
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('details_commandes')->insert([
            'commande_id' => $commande1, 'produit_id' => 2, 'quantite' => 2, 'prix_unitaire' => 2.00,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $commande2 = DB::table('commandes')->insertGetId([
            'user_id' => $clientId,
            'numero_commande' => 'CMD-'.date('Ymd').'-'.strtoupper(substr(uniqid(), -4)),
            'montant_total' => 7.50,
            'statut' => 'en attente de paiement',
            'mode_paiement' => 'Orange Money',
            'adresse_livraison' => '12 Rue de Paris, 75001 Paris',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('details_commandes')->insert([
            'commande_id' => $commande2, 'produit_id' => 6, 'quantite' => 1, 'prix_unitaire' => 7.50,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $this->command->info('✅ Base de données initialisée avec succès !');
        $this->command->info('📊 Admin : admin@egouter.com / password');
        $this->command->info('📊 Client : client@egouter.com / password');
        $this->command->info('📊 Fournisseurs : snack@egouter.com, momo@egouter.com, pause@egouter.com / password');
    }
}