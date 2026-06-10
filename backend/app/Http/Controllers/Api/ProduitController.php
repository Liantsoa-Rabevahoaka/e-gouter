<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use App\Models\Fournisseur;
use Illuminate\Http\Request;

class ProduitController extends Controller
{
    /**
     * Liste des produits d'un fournisseur
     * GET /api/fournisseurs/{id}/produits
     */
    public function index($fournisseurId)
    {
        $fournisseur = Fournisseur::find($fournisseurId);

        if (!$fournisseur) {
            return response()->json(['error' => 'Fournisseur non trouvé'], 404);
        }

        $produits = Produit::where('fournisseur_id', $fournisseurId)->get();

        return response()->json($produits);
    }

    /**
     * Détail d'un produit
     * GET /api/produits/{id}
     */
    public function show($id)
    {
        $produit = Produit::with('fournisseur')->find($id);

        if (!$produit) {
            return response()->json(['error' => 'Produit non trouvé'], 404);
        }

        return response()->json($produit);
    }
}