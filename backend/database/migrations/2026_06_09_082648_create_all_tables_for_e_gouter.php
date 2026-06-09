<?php
// database/migrations/2026_06_09_081346_create_all_tables_for_e_gouter.php
// REMPLACER TOUT LE CONTENU par ceci :

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
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
        });

        // 2. Table fournisseurs
        Schema::create('fournisseurs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('nom', 150);
            $table->text('adresse');
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->timestamps();
        });

        // 3. Table produits
        Schema::create('produits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fournisseur_id')->constrained('fournisseurs')->onDelete('cascade');
            $table->string('nom', 150);
            $table->decimal('prix', 10, 2);
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });

        // 4. Table commandes
        Schema::create('commandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
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
            $table->string('mode_paiement', 50)->nullable();
            $table->text('adresse_livraison');
            $table->timestamps();
        });

        // 5. Table details_commandes
        Schema::create('details_commandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commande_id')->constrained('commandes')->onDelete('cascade');
            $table->foreignId('produit_id')->constrained('produits');
            $table->integer('quantite');
            $table->decimal('prix_unitaire', 10, 2);
            $table->timestamps();
        });

        // 6. Table sessions
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id', 191)->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        // 7. Table cache
        Schema::create('cache', function (Blueprint $table) {
            $table->string('key', 191)->primary();
            $table->mediumText('value');
            $table->integer('expiration');
        });

        // 8. Table cache_locks
        Schema::create('cache_locks', function (Blueprint $table) {
            $table->string('key', 191)->primary();
            $table->string('owner');
            $table->integer('expiration');
        });

        // 9. Table jobs - VERSION CORRIGÉE
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('queue', 191)->index();  // ← 191 au lieu de 255
            $table->longText('payload');
            $table->unsignedTinyInteger('attempts');
            $table->unsignedInteger('reserved_at')->nullable();
            $table->unsignedInteger('available_at');
            $table->unsignedInteger('created_at');
        });

        // 10. Table failed_jobs
        Schema::create('failed_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('uuid', 191)->unique();  // ← 191 au lieu de 255
            $table->text('connection');
            $table->text('queue');
            $table->longText('payload');
            $table->longText('exception');
            $table->timestamp('failed_at')->useCurrent();
        });

        // 11. Table password_reset_tokens
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email', 191)->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });
        
        // 12. Table carts
        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        // 13. Table cart_items
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_id')->constrained()->onDelete('cascade');
            $table->foreignId('produit_id')->constrained();
            $table->integer('quantite')->default(1);
            $table->decimal('prix_unitaire', 8, 2);
            $table->timestamps();
        });        
    }

    public function down(): void
    {
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('failed_jobs');
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('cache_locks');
        Schema::dropIfExists('cache');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('details_commandes');
        Schema::dropIfExists('commandes');
        Schema::dropIfExists('produits');
        Schema::dropIfExists('fournisseurs');
        Schema::dropIfExists('users');
        Schema::dropIfExists('carts');
        Schema::dropIfExists('cart_items');
    }
};