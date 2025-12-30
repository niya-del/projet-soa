# projet-soa
Cette application fournit des opérations CRUD (Créer, Lire, Mettre à jour, Supprimer) pour des entités Personne en utilisant une architecture orientée services avec JPA pour la persistance des données. Le système est conçu pour être indépendant de la base de données avec une gestion appropriée des transactions. 

Stack Technologique 

Java 11+ 

JPA 2.2 (Java Persistence API) 

Maven pour la gestion des dépendances 

Hibernate comme fournisseur JPA 

Tomcat serveur d'application  

Ce projet consiste à développer le frontend d’une application web qui consomme un backend RESTful JEE déjà réalisé lors des TPs précédents. 

Le backend expose des services REST pour la gestion des personnes (Person) en utilisant : 

JAX-RS 

JDBC + requêtes SQL 

JPA (Hibernate) 

Le frontend permet d’interagir avec ces services REST selon une architecture Client / Serveur, sans aucun accès direct à la base de données 

La communication entre le frontend et le backend se fait exclusivement via des services REST exposés par le backend JAX-RS. 

Le frontend consomme les endpoints REST:get/put/post... 

Fonctionnalités Frontend: 

Liste des personnes 

Ajouter une personne 

Modifier une personne 

Supprimer une personne(delete) 

Recherche par ID 
