<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Fournisseur;
use Illuminate\Foundation\Testing\RefreshDatabase;

class GeolocationTest extends TestCase
{
    use RefreshDatabase;

    public function test_calcule_distance_avec_haversine()
    {
        // Créer un fournisseur proche
        $fournisseurProche = Fournisseur::create([
            'user_id' => User::factory()->create(['role' => 'fournisseur'])->id,
            'nom' => 'Fournisseur Proche',
            'adresse' => 'Proche',
            'latitude' => 48.8566,
            'longitude' => 2.3522
        ]);
        
        // Créer un fournisseur loin
        $fournisseurLoin = Fournisseur::create([
            'user_id' => User::factory()->create(['role' => 'fournisseur'])->id,
            'nom' => 'Fournisseur Loin',
            'adresse' => 'Loin',
            'latitude' => 48.8900,
            'longitude' => 2.3500
        ]);
        
        // Point central (Paris centre)
        $lat = 48.8566;
        $lon = 2.3522;
        
        $fournisseurs = Fournisseur::proches($lat, $lon, 50)->get();
        
        $this->assertCount(2, $fournisseurs);
        $this->assertEquals('Fournisseur Proche', $fournisseurs[0]->nom);
        $this->assertTrue($fournisseurs[0]->distance < $fournisseurs[1]->distance);
    }

    public function test_fournisseurs_tries_par_distance()
    {
        // Créer un client
        $client = User::factory()->create(['role' => 'client']);
        
        // Créer des fournisseurs
        Fournisseur::create([
            'user_id' => User::factory()->create(['role' => 'fournisseur'])->id,
            'nom' => 'Fournisseur 1',
            'adresse' => 'Adresse 1',
            'latitude' => 48.8566,
            'longitude' => 2.3522
        ]);
        
        Fournisseur::create([
            'user_id' => User::factory()->create(['role' => 'fournisseur'])->id,
            'nom' => 'Fournisseur 2',
            'adresse' => 'Adresse 2',
            'latitude' => 48.8900,
            'longitude' => 2.3500
        ]);
        
        $response = $this->actingAs($client)
            ->getJson('/api/fournisseurs/proches/48.8566/2.3522');
        
        $response->assertStatus(200);
    }
}