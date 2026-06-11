<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Produit;
use App\Models\Fournisseur;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OrderValidationTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $produit;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Créer un utilisateur client
        $this->user = User::factory()->create([
            'role' => 'client'
        ]);
        
        // Créer un fournisseur et un produit
        $fournisseurUser = User::factory()->create(['role' => 'fournisseur']);
        $fournisseur = Fournisseur::create([
            'user_id' => $fournisseurUser->id,
            'nom' => 'Test Fournisseur',
            'adresse' => 'Test Adresse',
            'latitude' => 48.8566,
            'longitude' => 2.3522
        ]);
        
        $this->produit = Produit::create([
            'fournisseur_id' => $fournisseur->id,
            'nom' => 'Test Produit',
            'prix' => 10.00,
            'description' => 'Description test'
        ]);
    }

    public function test_commande_echoue_si_panier_vide()
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/commande/valider', [
                'mode_paiement' => 'MVola',
                'adresse_livraison' => '12 Rue Test, 75001 Paris'
            ]);
        
        $response->assertStatus(400);
        $response->assertJson(['error' => 'Votre panier est vide']);
    }

    public function test_commande_reussit_avec_panier_non_vide()
    {
        // Créer un panier avec un produit
        $cart = Cart::create(['user_id' => $this->user->id]);
        CartItem::create([
            'cart_id' => $cart->id,
            'produit_id' => $this->produit->id,
            'quantite' => 2,
            'prix_unitaire' => $this->produit->prix
        ]);
        
        $response = $this->actingAs($this->user)
            ->postJson('/api/commande/valider', [
                'mode_paiement' => 'MVola',
                'adresse_livraison' => '12 Rue Test, 75001 Paris'
            ]);
        
        $response->assertStatus(201);
        $response->assertJsonStructure([
            'message',
            'commande' => ['id', 'numero_commande', 'statut', 'montant_total']
        ]);
    }
}