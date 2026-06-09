<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Produit;
use Illuminate\Http\Request;

class PanierController extends Controller
{
    private function getCart($userId)
    {
        return Cart::firstOrCreate(['user_id' => $userId]);
    }

    public function getCart(Request $request)
    {
        $cart = $this->getCart($request->user()->id);
        $cart->load('items.produit');
        return response()->json($cart);
    }

    public function addItem(Request $request)
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'quantite' => 'required|integer|min:1'
        ]);

        $cart = $this->getCart($request->user()->id);
        $produit = Produit::findOrFail($request->produit_id);

        $cartItem = CartItem::where('cart_id', $cart->id)
                            ->where('produit_id', $produit->id)
                            ->first();

        if ($cartItem) {
            $cartItem->quantite += $request->quantite;
            $cartItem->save();
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'produit_id' => $produit->id,
                'quantite' => $request->quantite,
                'prix_unitaire' => $produit->prix
            ]);
        }

        return $this->getCart($request);
    }

    public function updateItem(Request $request, $itemId)
    {
        $request->validate(['quantite' => 'required|integer|min:0']);
        $cartItem = CartItem::findOrFail($itemId);
        if ($request->quantite <= 0) {
            $cartItem->delete();
        } else {
            $cartItem->quantite = $request->quantite;
            $cartItem->save();
        }
        return $this->getCart($request);
    }

    public function removeItem(Request $request, $itemId)
    {
        CartItem::findOrFail($itemId)->delete();
        return $this->getCart($request);
    }

    public function clearCart(Request $request)
    {
        $cart = $this->getCart($request->user()->id);
        $cart->items()->delete();
        return $this->getCart($request);
    }
}