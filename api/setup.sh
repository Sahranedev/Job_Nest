#!/bin/bash

echo "============================"
echo "✨ Symfony Project Setup ✨"
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

# Étape 2 : Demander les informations de la base de données
read -p "💾 Entrez le nom de votre base de données : " db_name
read -p "👤 Entrez le nom d'utilisateur de la base de données : " db_user
read -s -p "🔑 Entrez le mot de passe de la base de données : " db_password
echo
read -p "🌐 Entrez l'adresse de votre serveur de base de données (127.0.0.1 par défaut) : " db_host
db_host=${db_host:-127.0.0.1}
read -p "📡 Entrez le port de votre base de données (3306 par défaut) : " db_port
db_port=${db_port:-3306}

# Étape 3 : Modifier DATABASE_URL dans .env
echo "🔄 Mise à jour de la configuration de la base de données dans .env..."
sed -i '/^DATABASE_URL=/c\DATABASE_URL="mysql://'"$db_user"':'"$db_password"'@'"$db_host"':'"$db_port"'/'"$db_name"'?serverVersion=8.0.40&charset=utf8"' .env

# Vérification du remplacement
if grep -q "^DATABASE_URL=" .env; then
    echo "✅ Configuration de la connexion à la base de données mise à jour avec succès."
else
    echo "❌ Échec lors de la mise à jour de DATABASE_URL dans le fichier .env."
    exit 1
fi

# Étape 4 : Installation des dépendances Composer
echo "📦 Installation des dépendances Composer..."
composer install

# Étape 5 : Création de la base de données
echo "🗄️ Création de la base de données..."
php bin/console doctrine:database:create --if-not-exists

# Étape 6 : Application des migrations
echo "🛠️ Application des migrations..."
php bin/console doctrine:migrations:migrate --no-interaction

echo "✅ Migrations appliquées avec succès."

echo "============================"
echo "✅ Configuration terminée avec succès ! Vous pouvez maintenant lancer votre application Symfony."
echo "============================"
