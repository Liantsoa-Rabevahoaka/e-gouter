cd D:\wamp64\www\e-gouter\backend
composer install
cp .env.example .env   
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve --host=0.0.0.0 --port=8000