<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Cart;
use App\Models\DetailCommande;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CommandeController extends Controller
{
    public function valider(Request $request)
    {
        $request->validate([
            'mode_paiement' => 'required|in:MVola,Orange Money,Airtel Money,Visa,Mastercard,paiement à la livraison',
            'adresse_livraison' => 'required|string'
        ]);

        $user = $request->user();
        $cart = Cart::where('user_id', $user->id)->with('items.produit')->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['error' => 'Panier vide'], 400);
        }

        $montant_total = $cart->items->sum(function($item) {
            return $item->quantite * $item->prix_unitaire;
        });

        $commande = Commande::create([
            'user_id' => $user->id,
            'numero_commande' => 'CMD-'.date('Ymd').'-'.Str::random(6),
            'montant_total' => $montant_total,
            'statut' => 'en attente de paiement',
            'mode_paiement' => $request->mode_paiement,
            'adresse_livraison' => $request->adresse_livraison
        ]);

        foreach ($cart->items as $item) {
            DetailCommande::create([
                'commande_id' => $commande->id,
                'produit_id' => $item->produit_id,
                'quantite' => $item->quantite,
                'prix' => $item->prix_unitaire
            ]);
        }

        // Vider le panier
        $cart->items()->delete();

        return response()->json($commande, 201);
    }

    public function historique(Request $request)
    {
        $commandes = $request->user()->commandes()->with('details.produit')->orderBy('created_at', 'desc')->get();
        return response()->json($commandes);
    }

    public function suivi($id)
    {
        $commande = Commande::findOrFail($id);
        return response()->json(['statut' => $commande->statut, 'commande' => $commande]);
    }
}