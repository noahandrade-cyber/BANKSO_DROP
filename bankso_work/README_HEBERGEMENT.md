# BANKSO — Mise en ligne + réservations Google

## 1. Mettre le site en ligne
Tu peux héberger ce dossier sur Netlify, GitHub Pages ou un autre hébergeur statique.

Important : garde toute l'arborescence (`images`, `css`, `js`, etc.). La page d'entrée est `index.html`.

## 2. À quoi servent Google Sheets et Google Apps Script ?
Le site BANKSO est une interface visible par les clients. Un site HTML statique ne doit pas contenir tes identifiants Google ni envoyer directement des données privées.

- **Google Sheets** = le tableau de bord où les demandes sont enregistrées. Chaque réservation crée une ligne avec date, article, taille, nom, e-mail, téléphone et message.
- **Google Apps Script** = le petit serveur Google qui reçoit le formulaire du site, ajoute la demande dans Sheets et t'envoie un e-mail. Il peut aussi envoyer un accusé de réception au client.

Le fonctionnement est donc :

Client → formulaire BANKSO → Google Apps Script → Google Sheets + ton e-mail

Tu peux ensuite ouvrir le Google Sheet depuis ton téléphone ou ton PC pour voir toutes les réservations.

## 3. Créer le Google Sheet
1. Va sur Google Sheets.
2. Crée une feuille vide, par exemple `BANKSO — Réservations`.
3. Ouvre `Extensions > Apps Script`.
4. Supprime le code présent et colle le contenu de `google-apps-script/Code.gs`.
5. Dans le code, remplace `TON_EMAIL_ICI@gmail.com` par ton adresse e-mail.
6. Enregistre.

## 4. Déployer Google Apps Script
Dans Apps Script :
1. Clique `Déployer`.
2. `Nouveau déploiement`.
3. Type : `Application Web`.
4. Exécuter en tant que : `Moi`.
5. Qui a accès : `Tout le monde`.
6. Déploie.
7. Autorise Google si demandé.
8. Copie l'URL qui finit par `/exec`.

## 5. Connecter BANKSO
Ouvre : `js/config.js`

Mets :

window.BANKSO_CONFIG = {
  GOOGLE_SCRIPT_URL: "TON_URL_QUI_FINIT_PAR_/exec"
};

Remplace l'exemple par l'URL exacte de ton déploiement Apps Script.

## 6. Ce que tu recevras
Quand quelqu'un réserve :
- la demande est enregistrée dans l'onglet `Demandes` du Google Sheet ;
- tu reçois un e-mail avec les informations ;
- le client reçoit un e-mail de confirmation de réception.

La réservation n'est pas un paiement : tu vérifies la disponibilité puis tu confirmes au client.

## 7. Si tu modifies le code Apps Script
Après une modification importante : `Déployer > Gérer les déploiements` puis crée une nouvelle version du déploiement si nécessaire.

## 8. Avant de publier
Fais un test complet depuis un téléphone :
1. ouvre DROP ;
2. ouvre COLLECTION ;
3. ouvre une pièce ;
4. choisis une taille ;
5. ajoute-la à la sélection ;
6. ouvre RÉSERVER ;
7. remplis le formulaire ;
8. vérifie le Google Sheet ;
9. vérifie ton e-mail.
