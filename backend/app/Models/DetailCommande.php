<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailCommande extends Model
{
    // FORCER le nom de la table (pluriel)
    protected $table = 'details_commandes';

    protected $fillable = [
        'commande_id', 'produit_id', 'quantite', 'prix_unitaire'
    ];

    public function commande()
    {
        return $this->belongsTo(Commande::class);
    }

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }
}