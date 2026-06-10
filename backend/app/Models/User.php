<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'nom', 'prenom', 'email', 'telephone', 'password', 'role'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * Relation avec le fournisseur (si l'utilisateur est un fournisseur)
     */
    public function fournisseur()
    {
        return $this->hasOne(Fournisseur::class);
    }

    /**
     * Relation avec les commandes
     */
    public function commandes()
    {
        return $this->hasMany(Commande::class);
    }
}