<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    protected $fillable = [
        'user_id', 'numero_commande', 'montant_total', 'statut', 
        'mode_paiement', 'adresse_livraison'
    ];

    /**
     * Relation avec l'utilisateur
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation avec les détails de commande
     */
    public function details()
    {
        return $this->hasMany(DetailCommande::class);
    }
}