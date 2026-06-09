<?php
namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = ['nom', 'prenom', 'email', 'telephone', 'password', 'role'];
    protected $hidden = ['password'];

    public function fournisseur()
    {
        return $this->hasOne(Fournisseur::class);
    }

    public function commandes()
    {
        return $this->hasMany(Commande::class);
    }
}