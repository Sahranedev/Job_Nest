#!/bin/bash

echo "============================"
echo "✨ Setup du projet JobNest de Sahrane Guassemi ✨"
echo "============================"

# Étape 1 : Vérifier la présence du fichier .env
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Fichier .env créé à partir de .env.example."
    else
        echo "❌ Fichier .env.example introuvable. Assurez-vous qu'il existe."
        exit 1
    fi
fi

# Étape 2 : Générer un APP_SECRET
echo "🔑 Génération d'un nouvel APP_SECRET..."
app_secret=$(openssl rand -hex 32)
sed -i "s|^APP_SECRET=.*|APP_SECRET=$app_secret|" .env
echo "✅ APP_SECRET généré et ajouté au fichier .env."

# Étape 3 : Demander les informations de la base de données
read -p "💾 Entrez le nom de votre base de données : " db_name
read -p "👤 Entrez le nom d'utilisateur de la base de données : " db_user
read -s -p "🔑 Entrez le mot de passe de la base de données : " db_password
echo
read -p "🌐 Entrez l'adresse de votre serveur de base de données (127.0.0.1 par défaut) : " db_host
db_host=${db_host:-127.0.0.1}
read -p "📡 Entrez le port de votre base de données (3306 par défaut) : " db_port
db_port=${db_port:-3306}

# Étape 4 : Modifier DATABASE_URL dans .env
echo "🔄 Mise à jour de la configuration de la base de données dans .env..."
sed -i '/^DATABASE_URL=/c\DATABASE_URL="mysql://'"$db_user"':'"$db_password"'@'"$db_host"':'"$db_port"'/'"$db_name"'?serverVersion=8.0.40&charset=utf8"' .env

# Vérification du remplacement
if grep -q "^DATABASE_URL=" .env; then
    echo "✅ Configuration de la connexion à la base de données mise à jour avec succès."
else
    echo "❌ Échec lors de la mise à jour de DATABASE_URL dans le fichier .env."
    exit 1
fi

# Étape 5 : Installation des dépendances Composer
echo "📦 Installation des dépendances Composer..."
composer install

# Étape 6 : Création de la base de données
echo "🗄️ Création de la base de données..."
php bin/console doctrine:database:create --if-not-exists

# Étape 7 : Application des migrations
echo "🛠️ Application des migrations..."
php bin/console doctrine:migrations:migrate --no-interaction

echo "✅ Migrations appliquées avec succès."

# Étape 8 : Génération des clés JWT
echo "🔐 Génération des clés JWT..."
php bin/console lexik:jwt:generate-keypair --overwrite
echo "✅ Clés JWT générées avec succès."

# Étape 9 : Installation des fixtures
read -p "📦 Voulez-vous installer les fixtures ? (y/n) : " install_fixtures

if [ "$install_fixtures" == "y" ]; then
    echo "📦 Installation des fixtures..."
    php bin/console doctrine:fixtures:load --no-interaction
    echo "✅ Fixtures installées avec succès."
else
    echo "🚫 Installation des fixtures annulée."
fi

echo "🐳 Build de l'environnement docker pour la gestion des mails"

php docker run -d --name=mailtrap -p 8940:80 -p 7321:25 eaudeweb/mailtrap

echo "============================"
echo "✅ Configuration terminée avec succès ! Vous pouvez maintenant lancer votre application Symfony."
echo "============================"
