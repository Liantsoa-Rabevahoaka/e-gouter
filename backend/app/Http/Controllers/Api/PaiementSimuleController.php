<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use Illuminate\Http\Request;

class PaiementSimuleController extends Controller
{
    /**
     * Simuler un paiement pour une commande
     * POST /api/paiement/simuler/{commandeId}
     */
    public function payer(Request $request, $commandeId)
    {
        $commande = Commande::findOrFail($commandeId);

        // Vérifier que la commande appartient à l'utilisateur connecté
        if ($commande->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        // Vérifier que la commande est bien en attente de paiement
        if ($commande->statut !== 'en attente de paiement') {
            return response()->json(['error' => 'Cette commande ne peut pas être payée'], 400);
        }

        // Si le mode de paiement est "paiement à la livraison", on ne change pas le statut
        if ($commande->mode_paiement === 'paiement à la livraison') {
            $message = "Paiement à la livraison - À régler à la réception";
            // On passe directement en livraison ? Non, on attend la livraison
            // Pour le suivi, on peut laisser en "en attente de paiement" ou passer en "en préparation"
            // Selon le cahier des charges, on laisse en attente
        } else {
            $commande->statut = 'payée';
            $commande->save();
            $message = "Paiement simulé effectué avec succès";
        }

        return response()->json([
            'message' => $message,
            'commande' => $commande
        ]);
    }
}