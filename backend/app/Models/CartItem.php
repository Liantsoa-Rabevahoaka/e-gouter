<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $fillable = ['cart_id', 'produit_id', 'quantite', 'prix_unitaire'];

    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }
}