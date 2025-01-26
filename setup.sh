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
if [ -z "$db_name" ]; then
    echo "❌ Le nom de la base de données ne peut pas être vide."
    exit 1
fi

read -p "👤 Entrez le nom d'utilisateur de la base de données : " db_user
if [ -z "$db_user" ]; then
    echo "❌ Le nom d'utilisateur ne peut pas être vide."
    exit 1
fi

read -s -p "🔑 Entrez le mot de passe de la base de données : " db_password
echo
if [ -z "$db_password" ]; then
    echo "❌ Le mot de passe ne peut pas être vide."
    exit 1
fi

read -p "🌐 Entrez l'adresse de votre serveur de base de données (127.0.0.1 par défaut) : " db_host
db_host=${db_host:-127.0.0.1}

read -p "📡 Entrez le port de votre base de données (3306 par défaut) : " db_port
db_port=${db_port:-3306}

# Modifier DATABASE_URL dans .env
sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"mysql://$db_user:$db_password@$db_host:$db_port/$db_name?serverVersion=8.0.40&charset=utf8\"|" .env
echo "✅ Configuration de la connexion à la base de données mise à jour."

# Étape 3 : Installer les dépendances Composer
echo "📦 Installation des dépendances Composer..."
composer install

# Étape 4 : Créer la base de données
echo "🗄️ Création de la base de données..."
php bin/console doctrine:database:create --if-not-exists

echo "✅ Base de données créée (ou déjà existante)."

# Étape 5 : Appliquer les migrations
echo "🛠️ Application des migrations..."
php bin/console doctrine:migrations:migrate --no-interaction

echo "✅ Migrations appliquées avec succès."

echo "============================"
echo "✅ Configuration terminée avec succès !"
echo "============================"
