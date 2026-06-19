# README.md – Documentation technique du projet E-Goûter

---

## 📋 Table des matières

1. [Présentation du projet](#présentation-du-projet)
2. [Prérequis](#prérequis)
3. [Installation du backend](#installation-du-backend)
4. [Installation du mobile](#installation-du-mobile)
5. [Configuration des variables d'environnement](#configuration-des-variables-denvironnement)
6. [Commandes essentielles](#commandes-essentielles)
7. [Structure des dossiers](#structure-des-dossiers)
8. [Tests](#tests)
9. [Déploiement](#déploiement)
10. [Contribuer](#contribuer)

---

## 1. Présentation du projet

**E-Goûter** est une application mobile de commande de goûters (snacks, boissons, viennoiseries) auprès de fournisseurs proches via géolocalisation.

### 🎯 Fonctionnalités principales

- 🔐 Authentification (inscription / connexion)
- 🗺️ Géolocalisation et liste des fournisseurs triés par distance
- 🍔 Catalogue de produits avec images
- 🛒 Panier d'achat (ajout, modification, suppression)
- 📦 Gestion des commandes et paiement simulé
- 📜 Historique des commandes
- 🛠️ Administration (statistiques, gestion des commandes)

### 🛠️ Stack technique

| Composant | Technologie | Version |
|-----------|-------------|---------|
| **Backend** | Laravel | 11.x |
| **Langage** | PHP | 8.2+ |
| **Base de données** | MySQL | 8.0+ |
| **Frontend mobile** | React Native / Expo | SDK 54 |
| **Authentification** | Laravel Sanctum | - |
| **HTTP Client** | Axios | - |

---

## 2. Prérequis

Avant de commencer, assurez-vous d’avoir installé :

### Backend
- [PHP 8.2 ou supérieur](https://www.php.net/downloads)
- [Composer](https://getcomposer.org/download/)
- [MySQL 8.0 ou supérieur](https://dev.mysql.com/downloads/)
- [Node.js 18+](https://nodejs.org/) (pour les assets si besoin)

### Mobile
- [Node.js 18+](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- [Expo Go](https://expo.dev/client) sur votre téléphone (Android/iOS)
- [Android Studio](https://developer.android.com/studio) (pour l’émulateur)

---

## 3. Installation du backend

### 3.1 Cloner le projet

```bash
git clone <url-du-repo>
cd e-gouter/backend
```

### 3.2 Installer les dépendances PHP

```bash
composer install
```

### 3.3 Configurer l’environnement

Copiez le fichier d’exemple :

```bash
cp .env.example .env
```

### 3.4 Générer la clé applicative

```bash
php artisan key:generate
```

### 3.5 Créer la base de données

Via phpMyAdmin ou ligne de commande :

```sql
CREATE DATABASE e_gouter CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3.6 Configurer `.env`

Ouvrez le fichier `.env` et renseignez vos identifiants :

```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=e_gouter
DB_USERNAME=root
DB_PASSWORD=
```

### 3.7 Lancer les migrations et les seeders

```bash
php artisan migrate:fresh --seed
```

### 3.8 Démarrer le serveur

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

> **Note** : L’option `--host=0.0.0.0` permet à l’API d’être accessible depuis votre téléphone sur le réseau local.

---

## 4. Installation du mobile

### 4.1 Se positionner dans le dossier mobile

```bash
cd ../mobile
```

### 4.2 Installer les dépendances

```bash
npm install
```

### 4.3 Configurer l’URL de l’API

Ouvrez `src/services/api.js` et modifiez l’URL :

```javascript
const API_URL = 'http://192.168.1.XX:8000/api';
```

Remplacez `192.168.1.XX` par l’IP de votre machine (celle que vous avez obtenue avec `ipconfig`).

### 4.4 Lancer l’application

```bash
npx expo start --clear
```

### 4.5 Ouvrir sur le téléphone

- Scannez le QR code avec **Expo Go**
- Ou appuyez sur `a` pour ouvrir sur l’émulateur Android
- Ou `w` pour la version web

---

## 5. Configuration des variables d’environnement

### 5.1 Backend (`.env`)

| Variable | Description | Exemple |
|----------|-------------|---------|
| `APP_ENV` | Environnement | `local` / `production` |
| `APP_DEBUG` | Mode debug | `true` / `false` |
| `APP_URL` | URL de l’application | `http://localhost:8000` |
| `DB_DATABASE` | Nom de la base | `e_gouter` |
| `DB_USERNAME` | Utilisateur MySQL | `root` |
| `DB_PASSWORD` | Mot de passe MySQL | - |

### 5.2 Mobile (`api.js`)

| Variable | Description | Exemple |
|----------|-------------|---------|
| `API_URL` | URL du backend | `http://192.168.1.45:8000/api` |

> 💡 **Astuce** : Pour éviter de modifier l’IP à chaque changement de réseau, utilisez une IP statique ou un service comme ngrok.

---

## 6. Commandes essentielles

### 6.1 Backend

| Commande | Description |
|----------|-------------|
| `php artisan serve` | Démarrer le serveur |
| `php artisan migrate` | Exécuter les migrations |
| `php artisan migrate:fresh` | Réinitialiser les migrations |
| `php artisan migrate:fresh --seed` | Réinitialiser + peupler la base |
| `php artisan db:seed --class=NomSeeder` | Exécuter un seeder spécifique |
| `php artisan make:model Nom` | Créer un modèle |
| `php artisan make:controller Api/NomController` | Créer un contrôleur API |
| `php artisan make:migration nom` | Créer une migration |
| `php artisan route:list` | Lister toutes les routes |
| `php artisan tinker` | Ouvrir un shell interactif |

### 6.2 Mobile

| Commande | Description |
|----------|-------------|
| `npx expo start` | Démarrer Expo |
| `npx expo start --clear` | Démarrer avec cache vidé |
| `npx expo start --tunnel` | Démarrer avec tunnel ngrok |
| `npx expo install [paquet]` | Installer un paquet compatible Expo |
| `npx expo doctor` | Diagnostiquer le projet |
| `npm install` | Installer les dépendances |

---

## 7. Structure des dossiers

### 7.1 Backend

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/                # Contrôleurs API
│   │   └── Middleware/             # Middlewares personnalisés
│   └── Models/                     # Modèles Eloquent
├── config/                         # Fichiers de configuration
├── database/
│   ├── migrations/                 # Migrations
│   └── seeders/                    # Seeders
├── routes/
│   ├── api.php                     # Routes API
│   └── web.php                     # Routes web
├── storage/                        # Logs, sessions, cache
├── .env                            # Variables d’environnement
├── artisan                         # Console Laravel
└── composer.json                   # Dépendances PHP
```

### 7.2 Mobile

```
mobile/
├── app/
│   ├── (tabs)/                     # Routes avec onglets
│   ├── _layout.tsx                 # Layout racine
│   ├── index.tsx                   # Écran d’accueil
│   ├── login.tsx                   # Écran de connexion
│   ├── register.tsx                # Écran d’inscription
│   ├── cart.tsx                    # Écran panier
│   ├── orders.tsx                  # Écran historique
│   ├── admin.tsx                   # Écran administration
│   └── supplier/[id].tsx           # Écran détail fournisseur
├── src/
│   ├── components/                 # Composants réutilisables
│   ├── context/                    # Contextes React (Auth, Cart, Order)
│   ├── services/                   # Services (API, géolocalisation)
│   ├── hooks/                      # Hooks personnalisés
│   └── utils/                      # Fonctions utilitaires
├── assets/                         # Images, polices
├── app.json                        # Configuration Expo
└── package.json                    # Dépendances npm
```

---

## 8. Tests

### 8.1 Backend

```bash
# Exécuter tous les tests
php artisan test

# Exécuter un test spécifique
php artisan test --filter=AdminAccessTest
```

### 8.2 Mobile

```bash
# Aucun test automatisé intégré
# Les tests sont effectués manuellement via Expo Go
```

---

## 9. Déploiement

### 9.1 Backend (production)

1. Mettre à jour les variables `.env` pour la production :
   ```ini
   APP_ENV=production
   APP_DEBUG=false
   ```

2. Optimiser les caches :
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

3. Héberger sur un serveur (ex: VPS, Heroku, etc.)

### 9.2 Mobile (production)

```bash
# Construire l’APK Android
npx expo build:android

# Construire l’IPA iOS
npx expo build:ios
```

---

## 10. Contribuer

1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/amazing-feature`)
3. Commitez vos changements (`git commit -m 'Add amazing feature'`)
4. Poussez la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

---

## 📞 Support

Pour toute question, contactez l’équipe de développement.

---

**© 2026 E-Goûter – Tous droits réservés.**