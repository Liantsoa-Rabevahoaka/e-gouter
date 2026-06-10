<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Table users
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 100);
            $table->string('prenom', 100);
            $table->string('email', 150)->unique();
            $table->string('telephone', 20);
            $table->string('password');
            $table->enum('role', ['client', 'fournisseur', 'admin'])->default('client');
            $table->timestamps();
            $table->index('email');
        });

        // 2. Table fournisseurs
        Schema::create('fournisseurs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('nom', 150);
            $table->text('adresse');
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->timestamps();
            $table->index(['latitude', 'longitude']);
            $table->index('user_id');
        });

        // 3. Table produits
        Schema::create('produits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fournisseur_id')->constrained()->onDelete('cascade');
            $table->string('nom', 150);
            $table->text('description')->nullable();
            $table->decimal('prix', 10, 2);
            $table->string('image')->nullable();
            $table->timestamps();
            $table->index('fournisseur_id');
        });

        // 4. Table commandes
        Schema::create('commandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('restrict');
            $table->string('numero_commande', 50)->unique();
            $table->decimal('montant_total', 10, 2);
            $table->enum('statut', [
                'en attente de paiement',
                'payée',
                'en préparation',
                'en livraison',
                'livrée',
                'annulée'
            ])->default('en attente de paiement');
            $table->string('mode_paiement', 50);
            $table->text('adresse_livraison');
            $table->timestamps();
            $table->index('user_id');
            $table->index('statut');
        });

        // 5. Table details_commandes
        Schema::create('details_commandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commande_id')->constrained()->onDelete('cascade');
            $table->foreignId('produit_id')->constrained()->onDelete('restrict');
            $table->integer('quantite');
            $table->decimal('prix_unitaire', 10, 2);
            $table->timestamps();
            $table->index('commande_id');
            $table->index('produit_id');
        });

        // 6. Table carts
        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade')->unique();
            $table->timestamps();
        });

        // 7. Table cart_items
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_id')->constrained()->onDelete('cascade');
            $table->foreignId('produit_id')->constrained()->onDelete('cascade');
            $table->integer('quantite')->default(1);
            $table->decimal('prix_unitaire', 10, 2);
            $table->timestamps();
            $table->index('cart_id');
            $table->index('produit_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_items');
        Schema::dropIfExists('carts');
        Schema::dropIfExists('details_commandes');
        Schema::dropIfExists('commandes');
        Schema::dropIfExists('produits');
        Schema::dropIfExists('fournisseurs');
        Schema::dropIfExists('users');
    }
};