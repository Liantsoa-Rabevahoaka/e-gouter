<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Fournisseur;
use App\Models\Produit;
use App\Models\Commande;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware(function ($request, $next) {
            if ($request->user()->role !== 'admin') abort(403);
            return $next($request);
        });
    }

    public function stats()
    {
        return response()->json([
            'users' => User::count(),
            'fournisseurs' => Fournisseur::count(),
            'produits' => Produit::count(),
            'commandes' => Commande::count(),
            'chiffre_affaires' => Commande::sum('montant_total')
        ]);
    }

    public function fournisseurs() { return Fournisseur::with('user')->get(); }
    public function updateFournisseur(Request $r, $id) { /* à implémenter */ }
    public function produits() { return Produit::with('fournisseur')->get(); }
    public function updateProduit(Request $r, $id) { /* à implémenter */ }
    public function commandes() { return Commande::with('user')->get(); }
    public function updateCommandeStatut(Request $r, $id) {
        $commande = Commande::findOrFail($id);
        $commande->statut = $r->statut;
        $commande->save();
        return $commande;
    }
}