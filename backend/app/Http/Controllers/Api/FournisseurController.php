<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fournisseur;
use Illuminate\Http\Request;

class FournisseurController extends Controller
{
    public function proches(Request $request, $lat, $lon)
    {
        $fournisseurs = Fournisseur::proches($lat, $lon, 50)->get();
        return response()->json($fournisseurs);
    }

    public function show($id)
    {
        $fournisseur = Fournisseur::with('produits')->findOrFail($id);
        return response()->json($fournisseur);
    }
}