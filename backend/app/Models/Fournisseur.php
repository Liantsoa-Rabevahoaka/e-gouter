<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fournisseur extends Model
{
    protected $fillable = [
        'user_id', 'nom', 'adresse', 'latitude', 'longitude'
    ];

    /**
     * Relation avec l'utilisateur (propriétaire du fournisseur)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation avec les produits
     */
    public function produits()
    {
        return $this->hasMany(Produit::class);
    }

    /**
     * Scope pour récupérer les fournisseurs proches d'un point GPS
     * Formule de Haversine pour calculer la distance en kilomètres
     */
    public function scopeProches($query, $lat, $lon, $distance = 500)
    {
        // Formule de Haversine : distance en km entre deux points GPS
        $haversine = "(6371 * acos(
            cos(radians($lat)) 
            * cos(radians(latitude)) 
            * cos(radians(longitude) - radians($lon)) 
            + sin(radians($lat)) 
            * sin(radians(latitude))
        ))";

        return $query
            ->select('*')
            ->selectRaw("{$haversine} as distance")
            ->whereRaw("{$haversine} < ?", [$distance])
            ->orderBy('distance', 'asc');
    }
}