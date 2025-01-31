# Présentation du projet Job Nest par Sahrane Guassemi

## Description du projet

Job Nest est une application web qui permet de mettre en relation des personnes à la recherche d'un emploi avec des entreprises qui recrutent. Les utilisateurs peuvent s'inscrire sur la plateforme, créer un profil, consulter les offres d'emploi et postuler à celles qui les intéressent. Les entreprises peuvent également s'inscrire, publier des offres d'emploi et consulter les profils des candidats.

## Fonctionnalités de base

- Inscription et connexion des utilisateurs
- Création et modification de profil
- Consultation des offres d'emploi
- Postulation aux offres d'emploi
- Inscription et connexion des entreprises en tant que utilsiateur avec un rôle recruteur
- Récupération des entreprises
- Publication et modification d'offres d'emploi
- Recherche d'offres d'emploi par mots-clés et par localisation
- Récupération des candidatures pour une offre d'emploi
- Récupération des candidatures d'un candidat

## Fonctionnalités supplémentaires intéressantes

### 1) Mise en place d'un système de mail pour notifier les utilisateurs et les entreprises lors d'une postulation a une offre d'emploi ou encore lors de l'inscription sur la plateforme pour confirmer l'inscription.

J'ai créer un service de mail (Service/MailerService.php) et j'ai utilisé le composant Mailer de Symfony pour générer et configurer l'envoi de mail

**Point de réfléxion :** Actuellement si le docker sur lequel tourne le serveur smtp n'est pas en marche, le mail ne sera pas envoyé. Il serait intéressant de mettre en place un système de file d'attente pour les mails qui n'ont pas pu être envoyé pour les envoyer plus tard.

### 2) Mise en place des events listeners pour la gestion d'envoi des mails.

J'ai utilisé les events listener de symfony en faisant un dispatch de l'event lorsque que la requête est envoyée, cela m'a permis de gérer à quel moment je veux déclencher l'evenement pour qu'il soit écouté et ainsi avoir une meilleur maitrise plutôt que d'écouter l'évenement en permanence.

Pour le réaliser, j'ai créer deux dossier :

- Event : qui contient les classes d'événements
- EventListenenr : qui contient les classes d'écouteurs

Dans le dossier event je créer des classes qui contiennent des méthodes qui vont être appelées lors de l'envoi de l'événement. Dans le dossier EventListener je créer des classes qui vont écouter les événements et qui vont appeler les méthodes des classes d'événements.

Pour réaliser cela, j'ai utilisé le composant EventDispatcherInterface de Symfony qui diffuse l'evenement et qui permet de l'écouter et ainsi de déclencher les méthodes des classes d'événements.

Exemple d'utilisation dans le controller d'application :

```php
$eventDispatcher->dispatch(new ApplicationCreatedEvent($application));`
```

**Point de réfléxion :** Pour l'instant, j'ai utilisé les events listener pour l'envoi de mail, mais il serait intéressant de les utiliser pour d'autres fonctionnalités comme la gestion des erreurs, la gestion des logs, etc.
Peut être la mise en place d'event subscriber pour gérer plusieurs événements en même temps sera bénéfique pour l'application dans le futur.
De plus je ne dois surement pas utiliser les events de la meilleure des manières, l'appelle des méthodes par exemple e

### 3) L'upload de fichier avec le bundle VichUploaderBundle

J'ai utilisé le bundle VichUploaderBundle, qui était conseillé dans la documentation upload de Symfony pour gérer l'upload de fichier . Pour ce faire j'ai utilisé l'attribut de Vich qu'on place au dessus de l'entité pour désigné qu'il va contenir une annotation Vich sur un champ pour mettre en place l'upload de fichier.

Exemple au dessus de mon entité User :

```
#[Vich\Uploadable]
```

et sur le champ de l'entité User qui va contenir le fichier :

```php
 #[Vich\UploadableField(mapping: 'user_cv', fileNameProperty: 'cv_path')]

    private ?File $cv_file = null;
```

Pour configurer le bundle, j'ai ajouté les configurations nécessaires dans le fichier config/packages/vich_uploader.yaml en suivant la documentation du bundle.

```yaml
vich_uploader:
  db_driver: orm # sert à indiquer que l'on utilise l'ORM pour la gestion des fichiers

  metadata:
    type: attribute # sert a indiquer que les métadonnées sont définies en tant qu'attributs dans les entités

  mappings:
    user_cv:
      uri_prefix: /uploads/cv # prefix uri pour accéder au fichier uploadé
      upload_destination: "%kernel.project_dir%/public/uploads/cv"
      namer: Vich\UploaderBundle\Naming\SmartUniqueNamer # permet de générer un nom unique pour le fichier
      delete_on_remove: true
      delete_on_update: true
```

**Point de réfléxion :** Pour l'instant, j'ai implémenté seulement l'upload de CV mais par la suite cela servira également pour la photo de profil et également pour les bannières des entreprises.

### 4) Utilisation du Workflow de Symfony pour la gestion des états des candidatures

```yaml
framework:
  workflows:
    application:
      type: state_machine
      marking_store:
        type: method
        property: status
      supports:
        - App\Entity\Application
      places:
        - SUBMITTED
        - UNDER_REVIEW
        - ACCEPTED
        - REJECTED
      transitions:
        to_review:
          from: SUBMITTED
          to: UNDER_REVIEW
          guard: "is_granted('ROLE_RECRUITER')"
        accept:
          from: UNDER_REVIEW
          to: ACCEPTED
          guard: "is_granted('ROLE_RECRUITER')"
        reject:
          from: UNDER_REVIEW
          to: REJECTED
          guard: "is_granted('ROLE_RECRUITER')"
```

J'ai utilisé le composant Workflow de Symfony pour gérer les états des candidatures. J'ai créé un workflow qui contient des instuctions comme l'entité ciblé et le champ de la propriété qui va changer à travers plusieurs états (SUBMITTED, UNDER_REVIEW, ACCEPTED, REJECTED) et des transitions qui permettent de passer d'un état à un autre.
Ces transitions sont importantes car elles mettent une condition "absolue" pour passer d'un état à un autre, par exemple :

- Pour passer à l'état 'UNDER_REVIEW' il faut obligatoirement être d'abord un état SUBMITTED et comme que je ne donne pas la possibilité dans les transitions de faire le chemin inverse, il est impossible de passer de UNDER_REVIEW à SUBMITTED.

L'utilisation des guard dans les transitions permet de vérifier si l'utilisateur a le rôle nécessaire pour effectuer la transition par exemple :

- Pour passer de l'état 'UNDER_REVIEW' à 'ACCEPTED' il faut obligatoirement être un utilisateur avec le rôle 'ROLE_RECRUITER' sinon la transition ne sera pas possible.

Pour tester le workflow, vous pouvez utiliser la route suivante :

`/api/applications/{id}/workflow/{transition}`

a la place de {transition} il faut donner le nom des transitions qu'on a configuré dans le workflow.yaml, dans notre situation il y a 3 transitions possibles :

- to_review
- accept
- reject

**Point de réfléxion :** J'utilise un autre changement d'était dans l'application qui est l'état d'une offre d'emploi, j'ai utilisé l'approche classique dessus avec des ENUM et une méthode patch pour mettre à jour, j'ai volontairement pas utilisé le workflow pour cet état pour montrer les deux façons de faire et que je n'étais pas sur d'utiliser le workflow de la meilleure des manières.

### BONUS

Si vous le souhaitez je vous ai préparé des body json pour tester les routes :

- Créer un **Candidat** :

```json
{
  "email": "candidat@test.com",
  "password": "password",
  "firstName": "Mule",
  "lastName": "Love",
  "phoneNumber": "1234567890",
  "city": "Tower",
  "address": "20ème étage ToG",
  "age": 19,
  "role": "CANDIDATE"
}
```

Créer un **Recruteur** :

```json
{
  "email": "recruiter@test.com",
  "password": "password",
  "firstName": "Gustang",
  "lastName": "Pobidau",
  "phoneNumber": "1234567890",
  "city": "Lyon",
  "address": "123 Rue de Paris",
  "age": 34,
  "role": "RECRUITER"
}
```

Créer un **Job** :

```json
{
    "title": "Admin Réseau",
    "description": "Nous recherchons admin réseau",
    "location": "Lyon",
    "type": "CDI",
    "company_id": {id de l'entreprise}
}
```

uploader un **CV** :
`http://localhost:8000/api/upload-cv`

```
body : form-data
key = cv
value = {fichier cv importé depuis l'ordinateur}
```

Postuler à une **offre d'emploi** :

```json
{

  "job_id": {id de l'offre d'emploi},
  "user_id": {id du candidat},
  "cover_letter": "Je m'appelle Guichard et je suis passionné par les seismes.",
  "resume_path": "/uploads/cv/{nom_du_fichier.pdf}" /* pas encore implémenté dans l'application */
}
```

### Observation Générale

J'ai décidé de me mettre seul sur ce projet pour pouvoir découvrir les bases et les facettes vu que c'est mon premier projet en PHP et Symfony. Cela m'a permis d'apprendre beaucoup de chose et contrairement au début, j'apprécie beaucoup plus Symfony qu'il y a un mois.

On avait discuter sur le fait d'optimiser les requêtes controller par exemple la création d'un utilisateur au lieu de set chaque champ un par un et de peut être utiliser un serializer, j'ai réussi mais à moitié à cause de l'enum qui n'était pas reconnu par le serializer et je n'ai pas réussi à trouver une solution pour le moment, j'ai du donc laisser comme c'était pour que l'application reste fonctionnelle.

Les test unitaires sont également dérisoire j'ai juste commencer un suivre un petit tutoriel que je n'ai pas encore fini mais je compte bien les finir et mettre en place également des tests d'intégrations/fonctionels.

Le front-end n'est pas très avancé vu que ce n'était pas la priorité mais j'ai quand même essayé de mettre en place une architecture intéressante, je l'espère, avec React Next et zod pour les formulaires.

J'ai bien évidemment pas eu le temps de faire tout ce que je voulais mais j'ai beaucoup aimé travailler sur ce projet. J'ai plein d'idées pour la suite et j'ai hâte de le continuer et de faire une vraie appliction pour la déployer et la présenter dans mon portfolio.
