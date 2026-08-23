# BANKSO — Contact par e-mail + Google Sheets

Le `contact.html` est déjà prêt à envoyer :
- nom
- e-mail
- sujet
- message

Le même endpoint Google Apps Script peut également recevoir les réservations.

## 1. Créer le Google Sheet

Crée un Google Sheet, par exemple :
**BANKSO — Commandes & Messages**

Puis ouvre :
**Extensions → Apps Script**

## 2. Installer le script

Supprime le contenu de `Code.gs` et colle le contenu de :

`google-apps-script/Code.gs`

Dans cette ligne :

`const DESTINATION_EMAIL = "TON_EMAIL_ICI@gmail.com";`

mets l'adresse à laquelle tu veux recevoir les messages.

Exemple :
`const DESTINATION_EMAIL = "bankso@gmail.com";`

## 3. Déployer

Dans Apps Script :

**Déployer → Nouveau déploiement**

Choisis :
- Type : **Application Web**
- Exécuter en tant que : **Moi**
- Qui a accès : **Tout le monde**

Autorise les permissions demandées par Google.

Copie ensuite l'URL qui finit par `/exec`.

## 4. Mettre l'URL dans le site

Ouvre :

`bankso_work/js/config.js`

et mets :

```js
window.BANKSO_CONFIG = {
  GOOGLE_SCRIPT_URL: "TON_URL_GOOGLE_APPS_SCRIPT"
};
```

Exemple :

```js
window.BANKSO_CONFIG = {
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/XXXXXXXX/exec"
};
```

## 5. Ce que tu recevras

Quand quelqu'un utilise Contact, tu recevras un e-mail :

**Objet :**
`BANKSO — Nouvelle question : Question sur une pièce`

Avec :
- Nom
- E-mail
- Sujet
- Message

Le message sera également enregistré automatiquement dans l'onglet **Contacts** du Google Sheet.

Les réservations continuent d'être enregistrées dans l'onglet **Reservations** et un e-mail est envoyé pour chaque réservation.

## Important

Après une modification de `Code.gs`, il faut créer une nouvelle version du déploiement :
**Déployer → Gérer les déploiements → Modifier → Nouvelle version → Déployer**.


## Correction importante pour plusieurs articles
La nouvelle version de Code.gs enregistre **une ligne par T-shirt** dans l'onglet Reservations. Une réservation de 2 T-shirts crée donc 2 lignes avec le même ID de réservation. Après avoir remplacé Code.gs dans Apps Script, il faut impérativement faire **Déployer → Gérer les déploiements → Modifier → Nouvelle version → Déployer**. L'URL /exec reste normalement la même.
