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
    /**
     * Statistiques globales
     * GET /api/admin/stats
     */
    public function stats()
    {
        return response()->json([
            'users' => User::count(),
            'clients' => User::where('role', 'client')->count(),
            'fournisseurs' => User::where('role', 'fournisseur')->count(),
            'admins' => User::where('role', 'admin')->count(),
            'profils_fournisseurs' => Fournisseur::count(),
            'produits' => Produit::count(),
            'commandes' => Commande::count(),
            'commandes_en_attente' => Commande::where('statut', 'en attente de paiement')->count(),
            'commandes_payees' => Commande::where('statut', 'payée')->count(),
            'commandes_livrees' => Commande::where('statut', 'livrée')->count(),
            'chiffre_affaires' => Commande::where('statut', 'livrée')->sum('montant_total'),
            'chiffre_affaires_total' => Commande::sum('montant_total')
        ]);
    }

    /**
     * Liste de tous les fournisseurs (avec leurs utilisateurs)
     * GET /api/admin/fournisseurs
     */
    public function fournisseurs()
    {
        $fournisseurs = Fournisseur::with('user')->get();
        return response()->json($fournisseurs);
    }

    /**
     * Liste de tous les produits (avec leurs fournisseurs)
     * GET /api/admin/produits
     */
    public function produits()
    {
        $produits = Produit::with('fournisseur')->get();
        return response()->json($produits);
    }

    /**
     * Liste de toutes les commandes (avec utilisateurs et détails)
     * GET /api/admin/commandes
     */
    public function commandes()
    {
        $commandes = Commande::with(['user', 'details.produit'])
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($commandes);
    }

    /**
     * Mettre à jour le statut d'une commande
     * PUT /api/admin/commande/{id}/statut
     */
    public function updateCommandeStatut(Request $request, $id)
    {
        $request->validate([
            'statut' => 'required|in:en attente de paiement,payée,en préparation,en livraison,livrée,annulée'
        ]);

        $commande = Commande::findOrFail($id);
        $ancienStatut = $commande->statut;
        $commande->statut = $request->statut;
        $commande->save();

        return response()->json([
            'message' => 'Statut mis à jour avec succès',
            'ancien_statut' => $ancienStatut,
            'nouveau_statut' => $commande->statut,
            'commande' => $commande
        ]);
    }

    /**
     * Supprimer un utilisateur (soft delete ou définitif)
     * DELETE /api/admin/user/{id}
     */
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        
        // Empêcher la suppression du dernier admin
        if ($user->role === 'admin' && User::where('role', 'admin')->count() <= 1) {
            return response()->json(['error' => 'Impossible de supprimer le dernier administrateur'], 400);
        }

        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }

    /**
     * Supprimer un produit
     * DELETE /api/admin/produit/{id}
     */
    public function deleteProduit($id)
    {
        $produit = Produit::findOrFail($id);
        $produit->delete();

        return response()->json(['message' => 'Produit supprimé avec succès']);
    }
}