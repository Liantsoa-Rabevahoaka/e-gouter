<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use Illuminate\Http\Request;

class ProduitController extends Controller
{
    public function index($fournisseur_id)
    {
        $produits = Produit::where('fournisseur_id', $fournisseur_id)->get();
        return response()->json($produits);
    }

    public function show($id)
    {
        return response()->json(Produit::findOrFail($id));
    }
}