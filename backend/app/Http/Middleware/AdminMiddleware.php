<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Vérifier que l'utilisateur est authentifié et a le rôle 'admin'
        if (!$request->user() || $request->user()->role !== 'admin') {
            return response()->json([
                'error' => 'Accès non autorisé. Droits administrateur requis.'
            ], 403);
        }

        return $next($request);
    }
}