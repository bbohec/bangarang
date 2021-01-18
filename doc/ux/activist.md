Activist Vegan

    Reventication MonResto
        Existe > Faire/revendiquer un choix
        Existe pas > déclarer la revendication + revendiquer un choix
    Choix

# REVENDICATION SIMPLE : OUI/NON - POUR/CONTRE

## Experience en tant que visiteur
### ✔️ Cas Recherche de revendication
Rechercher des revendications
[MonResto vegan]
    - Est-ce que MonResto devrait proposer des menu à base de steak de soja?
        - Oui X <-- Pas possible car pas inscrit
        - Non

### ✔️ Déclarer une revendication

Déclarer une nouvelle revendication
    - MonResto propose que de la viande dans ses menus, il faut au moins un menu avec que des ingrédiants Vegan.
        Option de revendication > Revendication simple (oui/non) / Revendication avancée/Multi propositions



## ✔️ Expérience en tant que inscrit
### ✔️ Revendiquer

Rechercher des revendications
[MonResto vegan]
    - Est-ce que MonResto devrait proposer des menu à base de steak de soja?
        - Oui X ->> +1 Oui + profil utiliseur ->> a revendiquer
        - Non

### ✔️ Change sa revendication
Rechercher des revendications
[MonResto vegan]
    - Est-ce que MonResto devrait proposer des menu à base de steak de soja?
        - Oui O ->> -1 Oui
        - Non X ->> +1 Non

# REVENDICATION AVANCEES : CHOIX MULTIPLES 
## Experience en tant que visiteur
### ✔️ Déclarer une revendication à choix multiples
- Déclarer une nouvelle revendication
    - MonResto propose trop de viande dans ses menus
        > Option de revendication > Revendication avancée
        - Plus de menu avec des ingrédiants Vegan
        - Remplacer les steak hachés par des steaks au soja

### ✔️ Rajouter des propositions à une revendication
Rechercher une nouvelle revendication
    [MonResto trop viande] >>> any
        - "Est-ce que MonResto propose trop de viande dans ses menu."
        - "PasMonResto ne propose pas de viande"
        - "MonResto propose trop de viande dans ses menus" X

- "MonResto propose trop de viande dans ses menus"
    > Option de revendication > Revendication avancée
    - Plus de menu avec des ingrédiants Vegan
    - Remplacer les steak hachés par des steaks au soja
    - AJOUTER
        > Faire des portions de viande plus petites et issues d'une agriculture située à maximum 50km du restaurant.
    - AJOUTER
        > Faire des portions de viande plus petites et issues d'une agriculture située à maximum 10km du restaurant.

## Expérience en tant que inscrit
### ✔️ Revendiquer pour plusieurs propositions
> Rechercher une nouvelle revendication

- [MonResto trop viande]
    > (recherche sur tous les mots)
    - "Est-ce que MonResto propose trop de viande dans ses menu."
    - "PasMonResto ne propose pas de viande"
    - "MonResto propose trop de viande dans ses menus"
        > Séléctionné

- "MonResto propose trop de viande dans ses menus"
    > Option de revendication > Revendication avancée
    - Plus de menu avec des ingrédiants Vegan 
        > voter POUR + profil utiliseur ->> a revendiqué
    - Remplacer les steak hachés par des steaks au soja 
        > voter POUR + profil utiliseur ->> a revendiqué
    - Faire des portions de viande plus petites et issues d'une agriculture située à maximum 50km du restaurant.
    - Faire des portions de viande plus petites et issues d'une agriculture située à maximum 10km du restaurant.


###  ✔️ Rajouter des propositions à une revendication et Revendiquer contre plusieurs propositions
> Rechercher une nouvelle revendication

- [MonResto trop viande]
    > (recherche sur tous les mots)
    - "Est-ce que MonResto propose trop de viande dans ses menu."
    - "PasMonResto ne propose pas de viande"
    - "MonResto propose trop de viande dans ses menus"
        > Séléctionné

- "MonResto propose trop de viande dans ses menus"
    > Option de revendication > Revendication avancée
    - Plus de menu avec des ingrédiants Vegan +
    - Remplacer les steak hachés par des steaks au soja +
    - Faire des portions de viande plus petites et issues d'une agriculture située à maximum 50km du restaurant.
        > VOTER CONTRE + profil utiliseur ->> a revendiqué
    - Faire des portions de viande plus petites et issues d'une agriculture située à maximum 10km du restaurant.
        > VOTER CONTRE + profil utiliseur ->> a revendiqué

......
###  ✔️ Rajouter des propositions à une revendication
> Rechercher une nouvelle revendication

- [MonResto trop viande]
    > (recherche sur tous les mots)
    - "Est-ce que MonResto propose trop de viande dans ses menu."
    - "PasMonResto ne propose pas de viande"
    - "MonResto propose trop de viande dans ses menus"
        > Séléctionné

- "MonResto propose trop de viande dans ses menus"
    > Option de revendication > Revendication avancée
    - Plus de menu avec des ingrédiants Vegan
    - Remplacer les steak hachés par des steaks au soja
    - Faire des portions de viande plus petites et issues d'une agriculture située à maximum 50km du restaurant.
    - Faire des portions de viande plus petites et issues d'une agriculture située à maximum 10km du restaurant.
    - AJOUTER
        > Faire des portions de viande plus petites et issues d'une agriculture située à maximum 100km du restaurant.

....

### ✔️ Revendiquer être pour une proposition d'une revendication
> Rechercher une nouvelle revendication

- [MonResto trop viande]
    > (recherche sur tous les mots)
    - "Est-ce que MonResto propose trop de viande dans ses menu."
    - "PasMonResto ne propose pas de viande"
    - "MonResto propose trop de viande dans ses menus"
        > Séléctionné

- "MonResto propose trop de viande dans ses menus"
    > Option de revendication > Revendication avancée
    - Plus de menu avec des ingrédiants Vegan +
    - Remplacer les steak hachés par des steaks au soja +
    - Faire des portions de viande plus petites et issues d'une agriculture située à maximum 50km du restaurant. -
    - Faire des portions de viande plus petites et issues d'une agriculture située à maximum 10km du restaurant. -
    - Faire des portions de viande plus petites et issues d'une agriculture située à maximum 100km du restaurant.
        > VOTER POUR + profil utiliseur ->> a revendiqué

......
### Changer d'avis revendiquer être contre une proposition d'une revendication pour laquelle on a revendiqué être pour précédement
> Rechercher une nouvelle revendication

- [MonResto trop viande]
    > (recherche sur tous les mots)
    - "Est-ce que MonResto propose trop de viande dans ses menu."
    - "PasMonResto ne propose pas de viande"
    - "MonResto propose trop de viande dans ses menus"
        > Séléctionné

- "MonResto propose trop de viande dans ses menus"
    > Option de revendication > Revendication avancée
    - Plus de menu avec des ingrédiants Vegan +
    - Remplacer les steak hachés par des steaks au soja +
    - Faire des portions de viande plus petites et issues d'une agriculture située à maximum 50km du restaurant. -
    - Faire des portions de viande plus petites et issues d'une agriculture située à maximum 10km du restaurant. -
    - Faire des portions de viande plus petites et issues d'une agriculture située à maximum 100km du restaurant.
        > VOTER CONTRE >>> POUR -1 / CONTRE +1

......