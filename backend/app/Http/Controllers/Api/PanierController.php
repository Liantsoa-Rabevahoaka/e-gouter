<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Produit;
use Illuminate\Http\Request;

class PanierController extends Controller
{
    /**
     * Récupère ou crée le panier d'un utilisateur
     */
    private function getCart($userId)
    {
        return Cart::firstOrCreate(['user_id' => $userId]);
    }

    /**
     * Afficher le panier
     * GET /api/panier
     */
    public function showCart(Request $request)
    {
        $cart = $this->getCart($request->user()->id);
        $cart->load('items.produit');
        
        return response()->json($cart);
    }

    /**
     * Ajouter un produit au panier
     * POST /api/panier/ajouter
     */
    public function addItem(Request $request)
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'quantite' => 'required|integer|min:1'
        ]);

        $cart = $this->getCart($request->user()->id);
        $produit = Produit::findOrFail($request->produit_id);

        // Vérifier si le produit est déjà dans le panier
        $cartItem = CartItem::where('cart_id', $cart->id)
                            ->where('produit_id', $produit->id)
                            ->first();

        if ($cartItem) {
            // Mettre à jour la quantité
            $cartItem->quantite += $request->quantite;
            $cartItem->save();
        } else {
            // Créer un nouvel élément
            CartItem::create([
                'cart_id' => $cart->id,
                'produit_id' => $produit->id,
                'quantite' => $request->quantite,
                'prix_unitaire' => $produit->prix
            ]);
        }

        // Retourner le panier mis à jour
        return $this->showCart($request);
    }

    /**
     * Modifier la quantité d'un produit dans le panier
     * PUT /api/panier/item/{itemId}
     */
    public function updateItem(Request $request, $itemId)
    {
        $request->validate([
            'quantite' => 'required|integer|min:0'
        ]);

        $cartItem = CartItem::findOrFail($itemId);
        
        // Vérifier que l'élément appartient bien au panier de l'utilisateur
        $cart = $this->getCart($request->user()->id);
        if ($cartItem->cart_id !== $cart->id) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        if ($request->quantite <= 0) {
            $cartItem->delete();
        } else {
            $cartItem->quantite = $request->quantite;
            $cartItem->save();
        }

        return $this->showCart($request);
    }

    /**
     * Supprimer un produit du panier
     * DELETE /api/panier/item/{itemId}
     */
    public function removeItem(Request $request, $itemId)
    {
        $cartItem = CartItem::findOrFail($itemId);
        
        // Vérifier que l'élément appartient bien au panier de l'utilisateur
        $cart = $this->getCart($request->user()->id);
        if ($cartItem->cart_id !== $cart->id) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $cartItem->delete();

        return $this->showCart($request);
    }

    /**
     * Vider complètement le panier
     * DELETE /api/panier/vider
     */
    public function clearCart(Request $request)
    {
        $cart = $this->getCart($request->user()->id);
        $cart->items()->delete();

        return $this->showCart($request);
    }
}