<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\DetailCommande;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CommandeController extends Controller
{
    /**
     * Valider une commande à partir du panier
     * POST /api/commande/valider
     */
    public function valider(Request $request)
    {
        try {
            // 1. Validation des entrées
            $request->validate([
                'mode_paiement' => 'required|in:MVola,Orange Money,Airtel Money,Visa,Mastercard,paiement à la livraison',
                'adresse_livraison' => 'required|string|min:5'
            ]);

            // 2. Récupérer l'utilisateur et son panier
            $user = $request->user();
            $cart = Cart::where('user_id', $user->id)->with('items.produit')->first();

            // 3. Vérifier que le panier n'est pas vide
            if (!$cart || $cart->items->isEmpty()) {
                return response()->json(['error' => 'Votre panier est vide'], 400);
            }

            // 4. Calculer le montant total
            $montantTotal = 0;
            foreach ($cart->items as $item) {
                $montantTotal += $item->quantite * $item->prix_unitaire;
            }

            // 5. Générer un numéro de commande unique
            $numeroCommande = 'CMD-' . date('Ymd') . '-' . strtoupper(Str::random(6));

            // 6. Créer la commande
            $commande = Commande::create([
                'user_id' => $user->id,
                'numero_commande' => $numeroCommande,
                'montant_total' => $montantTotal,
                'statut' => 'en attente de paiement',
                'mode_paiement' => $request->mode_paiement,
                'adresse_livraison' => $request->adresse_livraison
            ]);
            
            // Log de création de commande
            Log::info('Commande créée', ['user_id' => $user->id, 'total' => $montantTotal]);

            // 7. Créer les détails de la commande
            foreach ($cart->items as $item) {
                DetailCommande::create([
                    'commande_id' => $commande->id,
                    'produit_id' => $item->produit_id,
                    'quantite' => $item->quantite,
                    'prix_unitaire' => $item->prix_unitaire
                ]);
            }

            // 8. Vider le panier
            $cart->items()->delete();

            return response()->json([
                'message' => 'Commande créée avec succès',
                'commande' => $commande
            ], 201);

        } catch (\Exception $e) {
            // Journaliser l'erreur pour débogage
            Log::error('Erreur validation commande : ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'error' => 'Erreur interne : ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Historique des commandes de l'utilisateur
     * GET /api/commandes
     */
    public function historique(Request $request)
    {
        $commandes = Commande::where('user_id', $request->user()->id)
            ->with('details.produit')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($commandes);
    }

    /**
     * Suivi d'une commande (statut en temps réel)
     * GET /api/commande/{id}/suivi
     */
    public function suivi($id)
    {
        $commande = Commande::findOrFail($id);
        
        // Vérifier que la commande appartient à l'utilisateur connecté
        if ($commande->user_id !== request()->user()->id) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        return response()->json([
            'id' => $commande->id,
            'numero_commande' => $commande->numero_commande,
            'statut' => $commande->statut,
            'montant_total' => $commande->montant_total,
            'mode_paiement' => $commande->mode_paiement,
            'adresse_livraison' => $commande->adresse_livraison,
            'created_at' => $commande->created_at,
            'updated_at' => $commande->updated_at
        ]);
    }
}