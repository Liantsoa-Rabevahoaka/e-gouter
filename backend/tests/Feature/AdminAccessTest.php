<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Commande;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_acces_admin_refuse_pour_client()
    {
        $client = User::factory()->create(['role' => 'client']);
        
        $response = $this->actingAs($client)
            ->getJson('/api/admin/stats');
        
        $response->assertStatus(403);
    }

    public function test_acces_admin_autorise_pour_admin()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        
        $response = $this->actingAs($admin)
            ->getJson('/api/admin/stats');
        
        $response->assertStatus(200);
    }

    public function test_admin_peut_modifier_statut_commande()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $client = User::factory()->create(['role' => 'client']);
        
        $commande = Commande::create([
            'user_id' => $client->id,
            'numero_commande' => 'CMD-TEST-001',
            'montant_total' => 50.00,
            'statut' => 'en attente de paiement',
            'mode_paiement' => 'MVola',
            'adresse_livraison' => 'Test Adresse'
        ]);
        
        $response = $this->actingAs($admin)
            ->putJson("/api/admin/commande/{$commande->id}/statut", [
                'statut' => 'payée'
            ]);
        
        $response->assertStatus(200);
        
        $commande->refresh();
        $this->assertEquals('payée', $commande->statut);
    }
}