# CONFIGURATION DU PROJET Job Nest

## 1. Installation de l'environnement de développement

**Bonjour monsieur, je vous laisse le choix quant à la configuration du projet, soit d'utiliser le script que j'ai fait qui permet de tout installer automatiquement, soit de suivre les étapes manuellement.**

### Utilisation du script automatisé

**_Se rendre dans le dossier /api et exécuter la commande dans le terminal pour rendre executbale le fichier du script_**

```bash
chmod +x ./setup.sh
```

**_Ensuite, exécuter le script_**

```bash
./setup.sh
```

### Repondez aux question qui apparaitront dans le terminal cela va configurer automatiquement les fichiers .env ainsi que l'installation des dépendances et tout ce qui est nécessaire au projet.

### Installation manuelle

**_*1) Se rendre dans le dossier /api créer à la racine un fichier .env et copier coller dedans le contenu du fichier .env.example*_**

```bash
cp .env.example .env
```

**_*2) Générer l'APP_SECRET en exécutant la commande suivante et copier le code obtenu en la remplaçant dans le fichier .env*_**

```bash
openssl rand -hex 32
```

**_*3) Configurer la base de données en mettant vos propres informations dans le fichier .env*_**

`DATABASE_URL="mysql://username:password@127.0.0.1:3306/db_name?serverVersion=8.0.40&charset=utf8`

**_*4) Installer les dépendances du projet en exécutant la commande suivante dans le terminal*_**

```bash
composer install
```

**_*5) Créer la base de données en exécutant la commande suivante dans le terminal*_**

```bash
php bin/console doctrine:database:create
```

**_*6) Créer les tables de la base de données en exécutant la commande suivante dans le terminal*_**

```bash
php bin/console doctrine:migrations:migrate
```

**_*7) Générer les clés JsonWebToken*_**

```bash
php bin/console lexik:jwt:generate-keypair
```

**Si vous souhaitez ajouter une passphrase pour sécuriser vos clés (optionnel)**

```bash
php bin/console lexik:jwt:generate-keypair --passphrase="VotrePassphraseSécurisée"
```

**_*8) Lancer le build docker de mailtrap par eaudeweb pour la gestion des envois de mails de l'application*_**

```bash
docker run -d --name=mailtrap -p 8940:80 -p 7321:25 eaudeweb/mailtrap
```

**_*Pour accéder à l'interface de mail les identifiants par défaut sont les suivants:*_**
nom d'utilisateur : mailtrap
mot de passe : mailtrap

**_*9) Lancer le serveur de développement en exécutant la commande suivante dans le terminal*_**

```bash
symfony serve --no-tls
```

### Configurer l'environnement de test

**_*1) Créer un fichier .env.test.local à la racine et copier/coller le contenu du fichier.env puis executez ces commandes :*_**

```bash
php bin/console doctrine:database:create --env=test
```

```bash
php bin/console doctrine:migrations:migrate --env=test
```

<!-- Ces commandes permettent de créer et configurer une base de données test -->

### Configuration de l'environnement de développement front-end

**_1) Se rendre dans le dossier /front et exécuter la commande suivante dans le terminal pour installer les dépendances du projet_**

```bash
npm install
```

**_2) Créer un fichier .env à la racine et y insérer la variable d'environnement lié à notre back-end_**

`NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000`

**_3) Lancer le serveur de développement en exécutant la commande suivante dans le terminal_**

```bash
npm run dev
```
