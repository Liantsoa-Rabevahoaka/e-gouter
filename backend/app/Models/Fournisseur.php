<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fournisseur extends Model
{
    protected $fillable = ['user_id', 'nom', 'adresse', 'latitude', 'longitude'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function produits()
    {
        return $this->hasMany(Produit::class);
    }

    // Scope pour tri par distance (Haversine)
    public function scopeProches($query, $lat, $lon, $distance = 50)
    {
        $haversine = "(6371 * acos(cos(radians($lat)) * cos(radians(latitude)) * cos(radians(longitude) - radians($lon)) + sin(radians($lat)) * sin(radians(latitude))))";
        return $query->select('*')->selectRaw("{$haversine} as distance")->whereRaw("{$haversine} < ?", [$distance])->orderBy('distance');
    }
}