# Gestion d'une Epicerie en Nodejs et SQLite

Compléter un site web en nodejs permettant de gérer une épicerie.

## Contexte du projet
Notre épicerie a fait appel il y a quelques mois à votre agence de communication pour réaliser un site internet. Le site avait 2 objectifs : fournir des informations utiles (présentation, horaire d’ouverture, adresse, plan d'accès...) et permettre à l’utilisateur de consulter les produits disponible.

Suite aux retours de nos clients, nous avons décidé d’ajouter une page spéciale pour les produits frais. Un souci technique a malheureusement effacer les informations de la page d'accueil et a propos.

Le code existant se trouve à cette adresse:

[https://gitlab.com/labege_carbonne/gestion-epicerie-nodejs]() (Faire un fork ou un nouveau dépot, pas un clone)

A partir du dossier de code fourni, réalisez les éléments suivants, en respectant l’architecture existante :

* Sur la page Accueil, ajouter les informations utiles.
* Sur la page A propos, ajouter la présentation de l'épicerie.
* Sur la navbar, ajouter le lien de la nouvelle page ‘produits frais’.
* Créer la page produits frais en reprenant exactement la même structure que la page produits, mais en ajoutant un champ date limite de consommation.
* Afficher uniquement les produits frais non périmés.
* Tout comme pour les produits, les informations pour les produits frais seront stockés dans une base de donnée SQLite. La structure sera exactement la même, mais necessite un champ dlc de type DATE pour la date limite de consommation.
* Modifier la page Inventaire pour gerer les produits frais
* Vérifier que le site est responsive sur mobile.

Technologies à utiliser : Html5 / Bootstrap / Node JS / Express / Ejs / SQLite.

## Modalités pédagogiques
* Travail individuel.
* A rendre avant dimanche soir minuit.
* Technologies à utiliser : Html5 / Bootstrap / Node JS / Express / Ejs / SQLite.

## Critères de performance
* La page d'accueil affiche toutes les informations souhaitées par le client. Basez vous sur l'épicerie de votre commune, ou la plus proche.
* La page A propos affiche la présentation de l'épicerie de votre commune, ou la plus proche.
* La barre de navigation affiche le lien de la page produits frais, et renvoie bien vers la page produits frais.
* La page produits frais affiche uniquement les produits frais non périmés.
* La page Inventaire permet d'ajouter/modifier/supprimer tout les produits (frais ou pas).
* Le site est responsive sur mobile.
* Le code est correctement indenté (se baser sur le style du code existant).
* Chaque fonction est documentée (JSDoc).

## Modalités d'évaluation
Revue de code avec le formateur.

## Livrables
* Dépôt gitlab.
* Site en ligne sur Heroku.
