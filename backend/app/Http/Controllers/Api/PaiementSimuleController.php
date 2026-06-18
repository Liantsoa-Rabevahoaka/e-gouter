<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaiementSimuleController extends Controller
{
    public function payer(Request $request, $commandeId)
    {
        Log::info('Paiement simulé appelé', ['commande_id' => $commandeId, 'user_id' => $request->user()->id]);

        try {
            $commande = Commande::findOrFail($commandeId);

            // Vérifier que la commande appartient à l'utilisateur connecté
            if ($commande->user_id !== $request->user()->id) {
                Log::warning('Tentative de paiement non autorisée', ['commande_id' => $commandeId, 'user_id' => $request->user()->id]);
                return response()->json(['error' => 'Non autorisé'], 403);
            }

            // Vérifier que la commande est bien en attente de paiement
            if ($commande->statut !== 'en attente de paiement') {
                Log::warning('Tentative de paiement sur commande avec statut invalide', [
                    'commande_id' => $commandeId,
                    'statut_actuel' => $commande->statut
                ]);
                return response()->json(['error' => 'Cette commande ne peut pas être payée (statut: ' . $commande->statut . ')'], 400);
            }

            // Si paiement à livraison, ne pas changer le statut
            if ($commande->mode_paiement === 'paiement à la livraison') {
                $message = 'Paiement à la livraison - À régler à la réception';
                // Le statut reste "en attente de paiement" ou on peut le passer en "en préparation"
                // Pour rester cohérent, on laisse "en attente de paiement" jusqu'à livraison
            } else {
                $commande->statut = 'payée';
                $commande->save();
                $message = 'Paiement simulé effectué avec succès';
            }

            Log::info('Paiement réussi', ['commande_id' => $commandeId, 'nouveau_statut' => $commande->statut]);

            return response()->json([
                'message' => $message,
                'commande' => $commande
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors du paiement simulé', [
                'commande_id' => $commandeId,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Erreur interne: ' . $e->getMessage()], 500);
        }
    }
}