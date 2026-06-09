<?php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FournisseurController;
use App\Http\Controllers\Api\ProduitController;
use App\Http\Controllers\Api\PanierController;
use App\Http\Controllers\Api\CommandeController;
use App\Http\Controllers\Api\PaiementSimuleController;
use App\Http\Controllers\Api\AdminController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Fournisseurs & géolocalisation
    Route::get('/fournisseurs/proches/{lat}/{lon}', [FournisseurController::class, 'proches']);
    Route::get('/fournisseurs/{id}', [FournisseurController::class, 'show']);
    Route::get('/fournisseurs/{id}/produits', [ProduitController::class, 'index']);
    Route::get('/produits/{id}', [ProduitController::class, 'show']);

    // Panier
    Route::get('/panier', [PanierController::class, 'getCart']);
    Route::get('/panier', [PanierController::class, 'showCart']);
    Route::post('/panier/ajouter', [PanierController::class, 'addItem']);
    Route::put('/panier/item/{itemId}', [PanierController::class, 'updateItem']);
    Route::delete('/panier/item/{itemId}', [PanierController::class, 'removeItem']);
    Route::delete('/panier/vider', [PanierController::class, 'clearCart']);

    // Commande
    Route::post('/commande/valider', [CommandeController::class, 'valider']);
    Route::get('/commandes', [CommandeController::class, 'historique']);
    Route::get('/commande/{id}/suivi', [CommandeController::class, 'suivi']);

    // Paiement simulé
    Route::post('/paiement/simuler/{commandeId}', [PaiementSimuleController::class, 'payer']);

    // Admin (optionnel)
    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/fournisseurs', [AdminController::class, 'fournisseurs']);
        Route::get('/produits', [AdminController::class, 'produits']);
        Route::get('/commandes', [AdminController::class, 'commandes']);
        Route::put('/commande/{id}/statut', [AdminController::class, 'updateCommandeStatut']);
    });
});