<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProduitsTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('produits')->insert([
            // ===================== Snack Rapido (fournisseur_id=1) =====================
            [
                'id' => 1,
                'fournisseur_id' => 1,
                'nom' => 'Double Cheese Burger',
                'description' => 'Pain brioché, double steak, cheddar fondu, salade, oignons',
                'prix' => 8.50,
                'image' => 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=200&h=200&fit=crop&crop=center',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'fournisseur_id' => 1,
                'nom' => 'Frites Maison',
                'description' => 'Pommes de terre fraîches coupées, sauce au choix',
                'prix' => 3.50,
                'image' => 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=200&h=200&fit=crop&crop=center',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'fournisseur_id' => 1,
                'nom' => 'Milkshake Vanille',
                'description' => 'Glace vanille, lait, chantilly',
                'prix' => 4.00,
                'image' => 'https://images.unsplash.com/photo-1579954115546-95556d1c76bd?w=200&h=200&fit=crop&crop=center',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // ===================== Pizza Hut Express (fournisseur_id=2) =====================
            [
                'id' => 4,
                'fournisseur_id' => 2,
                'nom' => 'Pizza Margherita',
                'description' => 'Sauce tomate, mozzarella, basilic frais',
                'prix' => 10.00,
                'image' => 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=200&h=200&fit=crop&crop=center',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 5,
                'fournisseur_id' => 2,
                'nom' => 'Pizza Pepperoni',
                'description' => 'Sauce tomate, mozzarella, pepperoni, origan',
                'prix' => 12.00,
                'image' => 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200&h=200&fit=crop&crop=center',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 6,
                'fournisseur_id' => 2,
                'nom' => 'Coca-Cola 50cl',
                'description' => 'Canette 50cl, bien fraîche',
                'prix' => 2.00,
                'image' => 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200&h=200&fit=crop&crop=center',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // ===================== Chez Tacos (fournisseur_id=3) =====================
            [
                'id' => 7,
                'fournisseur_id' => 3,
                'nom' => 'Tacos Viande Hachée',
                'description' => 'Tacos sauce blanche, viande hachée, frites, fromage',
                'prix' => 7.00,
                'image' => 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=200&h=200&fit=crop&crop=center',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 8,
                'fournisseur_id' => 3,
                'nom' => 'Panini Poulet',
                'description' => 'Pain ciabatta, poulet grillé, tomate, mozzarella',
                'prix' => 5.50,
                'image' => 'https://png.pngtree.com/png-vector/20250206/ourmid/pngtree-grilled-chicken-sandwich-with-melted-cheese-and-fresh-vegetables-png-image_15310965.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 9,
                'fournisseur_id' => 3,
                'nom' => 'Jus de Mangue',
                'description' => 'Jus frais pressé, mangue locale',
                'prix' => 3.00,
                'image' => 'https://png.pngtree.com/png-vector/20240831/ourmid/pngtree-mango-juice-clipart-glass-of-smoothie-with-fruit-illustration-png-image_13688793.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // ===================== Pâtisserie Douceur (fournisseur_id=4) =====================
            [
                'id' => 10,
                'fournisseur_id' => 4,
                'nom' => 'Croissant Pur Beurre',
                'description' => 'Feuilleté croustillant, pur beurre AOP',
                'prix' => 1.80,
                'image' => 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&h=200&fit=crop&crop=center',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 11,
                'fournisseur_id' => 4,
                'nom' => 'Croissant',
                'description' => 'Pâte feuilletée, beurre, sucre ',
                'prix' => 1.80,
                'image' => 'https://images.unsplash.com/photo-1623334044303-241021148842?w=200&h=200&fit=crop&crop=center',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 12,
                'fournisseur_id' => 4,
                'nom' => 'Gâteau Forêt Noire',
                'description' => 'Gâteau au chocolat, crème chantilly, cerises',
                'prix' => 4.50,
                'image' => 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop&crop=center',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // ===================== Wok & Noodles (fournisseur_id=5) =====================
            [
                'id' => 13,
                'fournisseur_id' => 5,
                'nom' => 'Riz Cantonnais',
                'description' => 'Riz sauté aux œufs, petits pois, jambon, oignons',
                'prix' => 6.00,
                'image' => 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=200&h=200&fit=crop&crop=center',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 14,
                'fournisseur_id' => 5,
                'nom' => 'Nouilles Sautées Poulet',
                'description' => 'Nouilles fraîches, poulet, légumes croquants',
                'prix' => 6.50,
                'image' => 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&h=200&fit=crop&crop=center',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 15,
                'fournisseur_id' => 5,
                'nom' => 'Boulette de viande',
                'description' => '10 petits boulettes, sauce nuoc-mâm',
                'prix' => 3.50,
                'image' => 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=200&h=200&fit=crop&crop=center ',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}