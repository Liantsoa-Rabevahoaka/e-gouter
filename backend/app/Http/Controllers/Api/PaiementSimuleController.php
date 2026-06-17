<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use Illuminate\Http\Request;

class PaiementSimuleController extends Controller
{
    public function payer(Request $request, $commandeId)
    {
        $commande = Commande::findOrFail($commandeId);

        // Vérifier que la commande appartient à l'utilisateur
        if ($commande->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        // Vérifier que la commande est en attente de paiement
        if ($commande->statut !== 'en attente de paiement') {
            return response()->json(['error' => 'Cette commande ne peut pas être payée'], 400);
        }

        // Si le mode est "paiement à la livraison", on ne change pas le statut (on garde en attente)
        if ($commande->mode_paiement !== 'paiement à la livraison') {
            $commande->statut = 'payée';
            $commande->save();
            $message = "Paiement simulé effectué avec succès";
        } else {
            $message = "Paiement à la livraison - À régler à la réception";
        }

        return response()->json([
            'message' => $message,
            'commande' => $commande
        ]);
    }
}