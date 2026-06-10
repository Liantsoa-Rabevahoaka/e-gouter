<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fournisseur;
use Illuminate\Http\Request;

class FournisseurController extends Controller
{
    /**
     * Liste des fournisseurs proches d'un point GPS
     * GET /api/fournisseurs/proches/{lat}/{lon}
     */
    public function proches($lat, $lon)
    {
        // Valider les coordonnées
        if (!is_numeric($lat) || !is_numeric($lon)) {
            return response()->json(['error' => 'Coordonnées invalides'], 400);
        }

        $fournisseurs = Fournisseur::proches($lat, $lon, 50)->get();

        return response()->json($fournisseurs);
    }

    /**
     * Détail d'un fournisseur avec ses produits
     * GET /api/fournisseurs/{id}
     */
    public function show($id)
    {
        $fournisseur = Fournisseur::with('produits')->find($id);

        if (!$fournisseur) {
            return response()->json(['error' => 'Fournisseur non trouvé'], 404);
        }

        return response()->json($fournisseur);
    }
}