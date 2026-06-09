<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', '*'], // '*' pour toutes les routes
    'allowed_methods' => ['*'], // Autorise toutes les méthodes HTTP
    'allowed_origins' => ['http://localhost:3000', 'http://localhost:8080'], // URLs de votre frontend
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'], // Autorise tous les en-têtes
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false, // Passez à true si vous utilisez cookies/sessions
];
