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
        $commande->statut = 'payée';
        $commande->save();

        return response()->json(['message' => 'Paiement simulé accepté', 'statut' => $commande->statut]);
    }
}