# LFO — lesformateurs.online

## Projet
SaaS pour organismes de formation en France. Accompagnement des OF dans leurs démarches administratives (NDA, Qualiopi, EDOF, habilitations RS/RNCP, OPCO, etc.) + services digitaux (site, app, LMS, IA) + marketplace de cession d'OF.

## Stack technique
- **Frontend** : Vanilla JS/HTML/CSS (pas de React/Vue)
- **Backend** : Supabase (PostgreSQL + Auth + Storage + RLS)
  - URL : https://bxijjjbxsevnudienvbv.supabase.co
  - Anon key dans `js/supabase-config.js`
  - Service role key : confidentiel (demander si besoin)
- **Hébergement** : Cloudflare Pages via wrangler
  - Token : confidentiel (variable d'environnement `CLOUDFLARE_API_TOKEN`)
  - Déploiement : `CLOUDFLARE_API_TOKEN=... npx wrangler pages deploy . --project-name=lesformateurs-online --commit-dirty=true`
- **VPS** : 187.124.32.246 (Node.js, port 3891, /opt/lfo-webhook/server.js)
  - Webhook Stripe (Payment Links), N8N, SMTP
  - URL publique : https://webhook.lesformateurs.online
- **Stripe** : Payment Links via `/create-stripe-link`. Buy URL pattern `buy.stripe.com/...?prefilled_email=...`. Email toujours collecté côté Stripe.
- **SMTP** : aaven.coreviewspace.com:587 — 60 comptes @*experienceprod.com (mdp unique confidentiel). 30 mails/jour/boîte (limite Smartlead) → capacité 1 800/jour réparti.
- **Smartlead** : API key confidentielle — campagnes email, 60 comptes
- **N8N** : https://lesformateurs.app.n8n.cloud — 23 workflows post-paiement

## Architecture des fichiers

### Pages générées (21 pages)
- `generate-funnel-pages.js` — génère les pages `acces-*.html` (substeps, paiement, auth)
- `SKIP_SLUGS = ['acces-habilitation', 'acces-qualiopi']` — pages custom exclues du générateur

### Pages custom
- `acces-habilitation.html` — mockup v3 avec CertSelector, docs toggle, triggerUpload
- `acces-qualiopi.html` — 4 onglets : Configuration, Indicateurs (32), Audit, Terminée
- `monaccesedof.html` — guide EDOF avec 5 onglets
- `acces-nda.html` — NDA custom v2

### Dashboard
- `dashboard.html` — ~16000+ lignes, tout-en-un (admin/expert/user)
- `js/demarches-config.js` — config des 21 types de démarches (champs, docs, docsToggle, docsConditionnels, étapes)
- `js/qualiopi-indicateurs.js` — 32 indicateurs Qualiopi (onglet 2)
- `js/qualiopi-audit.js` — planification audit (onglet 3)
- `js/certifications-data.js` — 6575 certifications actives France Compétences (1.7MB)
- `js/cert-selector.js` — composant recherche certifications réutilisable

### Système de démarches
- Table Supabase `demarches` — type, status, current_step, amount_cents, paid, config, user_id, assigned_expert_id
- `current_step` est 1-based (1 = première étape)
- `config.admin_payment = 'offert'` → démarche offerte
- `config.uploaded_docs` → documents uploadés via checklist (fallback quand RLS bloque demarche_documents)
- `config.facture_path` → chemin de la facture PDF dans Storage
- `config.docsToggle` → choix "Je l'ai" / "Créez le" par document

### Flow des démarches
1. Client paie sur `acces-*.html` → démarche créée dans Supabase (step 1)
2. Mode post-paiement : `acces-*.html?demarche=xxx` → charge la démarche, cache le paiement
3. Dashboard : checklist des éléments manquants + boutons Compléter/Uploader
4. Checklist complète → bouton **"Passer à l'étape suivante"** (admin/expert ET user) → step 2
5. Pool expert : démarches step 2+ sans expert assigné
6. Expert prend le dossier → assigned_expert_id rempli → sort du pool
7. Si client retire un doc en step 2 → popup confirmation → retour step 1 (mais expert reste assigné)
8. Optimistic UI partout : `adminChangeStep`, `adminTerminerDemarche`, `adminSupprimerDemarche`, `takeDossier`, `userAdvanceStep` → maj cache local + render immédiat, sync DB en arrière-plan

### Factures
- Admin : rubrique "Factures" dans le dashboard — upload PDF, voir, retirer
- Factures dans Storage : `documents/factures/{demarche_id}/filename.pdf`
- Chemin stocké dans `demarche.config.facture_path`
- User : "Mes factures" — bouton vert "Télécharger" si facture admin, sinon PDF jsPDF
- Offert : prix barré + "Offert par LFO" en violet

### Substeps (parcours achat)
- Step 0 découpé en sous-étapes avec Suivant/Précédent + dots de progression
- Substep 0 : Admin + Email + SIRET
- Substep 1 : Configuration (si extraFields)
- Substep 2 : Options (si options)
- Substep 3 : Récap + Paiement + Réassurance
- Formateurs : choix exclusif (diplômé 220€ OU enregistré 490€, pas les deux)

## Système de panier (nouveau)
- `panier.html` + `js/panier.js` + `js/cart.js` (localStorage clé `lfo_cart_v1`) + `js/cart-nav.js` (icône panier dans top nav, badge orange visible si ≥ 1 article, présent sur 37+ pages)
- `js/services-catalog.js` + `js/services-catalog-data.js` : catalogue 22 services + options payantes par service
- Sur **service-*.html** (22 pages) : bouton "Commander" remplacé par `addServiceToCart(key)` → modal confirmation → "Voir panier" ou "Continuer mes achats"
- Sur **recherche-habilitation.html** : popup IA de recherche (`rhOpenSearchPopup`, `rhPopupSearch`) — input dans la popup, badge IA, animation loading
- Click sur une habilitation → `rhPickHabilitation(code)` ajoute au panier + modal "Aller au paiement" ou "Ajouter d'autres habilitations"
- Sur **panier.html** :
  - Affichage habilitations/packs/services
  - Bloc "Options disponibles" toggles par service (formateur diplômé, EDOF, blog SEO, etc.)
  - EDOF offert auto si habilitation présente — décliner via "Je n'en ai pas besoin" (state persisté `lfo_edof_declined`)
  - Code promo `LFO10` (-10%)
  - Mode paiement comptant ou 3×
  - "Payer" → Supabase auth check → modal si non connecté → création démarche `type='panier'` avec cart_items dans config → `/create-stripe-link` → URL avec `prefilled_email`
  - Stripe success → `/success.html` → marque paid + clear cart (`localStorage.lfo_cart_v1`)

## Marketplace de cession d'OF
- `marketplace.html` + `js/marketplace-popups.js` + `js/marketplace-vendus.js`
- Section "Centres vendus — sept. 2025 à mai 2026" : 54 OF cédés (6 par mois sur 9 mois)
- Popups "Vendre / Acheter" → si pas connecté : **gate email-first** (`_mpShowLoginPopup`) avec email+prénom+nom → crée le compte Supabase automatiquement (mot de passe random envoyé par mail via webhook `/send-new-user-email`) → ouvre directement le popup de saisie annonce
- `mpPubVente` / `mpPubAchat` : insert dans `marketplace_requests`

## Navigation (harmonisée)
Top nav identique sur 37+ pages : **Services · Créer mon OF · Habilitation (vert) · Se former · Recrutement (orange)**
- Plus de "Créer / Certifier" (retiré partout)
- `/recherche-habilitation` est l'unique page habilitation (les anciens liens `service-habilitation.html` sont conservés mais l'index pointe sur recherche-habilitation)
- Sur `/formation`, "Devenir certificateur RS/RNCP" → `/creer-certifier` (page grille tarifaire 6 990€ → 25 000€)

## Pages clients (sites offerts) — accès par token
- `/client/lartdelacouturiere?token=XXX` — Marie Mourgapamodely
- `/client/pamoi?token=JaIG8G8mi6HOxWLw0a34f0GC6wTIqoKJ` — Gaelle Maillot
- `/client/mediacoach?token=95kaMZg9Lyx_La65mkU6b9XutAU_fH2F` — Sylvie Planchard (logo + favicon Media-Coach intégrés)

## Clients actuels (5)
- Marie Mourgapamodely (lartdelacouturiere@gmail.com) — EDOF + Habilitation RNCP41091 + Site offert
- Sylvie Planchard (mediacoach974@gmail.com) — EDOF + Site offert
- Gaelle Maillot (pamelamaillot@pamoi.re) — EDOF + Site offert
- Pierre Medina (pmedina@knowledgeladder.academy) — 2 Habilitations RS7266/RS7344 + EDOF
- Boubacar Kone (kalanbara78@gmail.com) — RS6458 (en attente paiement)
- Nathalie Dumat (duma@gmail.com) — NDA offert + EDOF payé + Habilitation offert + Site offert

## Listes prospection OF (cleané)
Dossier `~/Desktop/Les formateurs.online/` (accès TCC restreint sur macOS — déplacer vers `~/lesformateurs-online/_lfo_listes/` ou autoriser Terminal dans Confidentialité)
- `BASE_COMPLETE_CLEAN.csv` : 133 467 OF cleanés
- 4 segments principaux :
  - Cible 1 Gold (Qualiopi CA 100k+) : 4 497 OF
  - Cible 2 Qualiopi sans certif : 17 363 OF (segmenté A/B/C/D par CA)
  - Cible 3 Upsell déjà RS/RNCP : 6 598 OF
- Source DGEFP : 159 380 OF déclarés en France (dataset `liste-publique-des-of-v2`)

## Conventions
- Pas de tableaux markdown dans les réponses — lignes concises
- Cette fenêtre = LFO uniquement, pas Colors Clubs
- Déployer après chaque modification : `CLOUDFLARE_API_TOKEN=... npx wrangler pages deploy ...`
- Toujours syntax-check le JS avant déploiement (`node -c file.js`)
- Service role key nécessaire pour INSERT/UPDATE sur les tables avec RLS strict
- Pour les mass emails : passer par Smartlead API (respect des limites 30/jour/boîte) plutôt que SMTP direct (qui dépasse la limite)
- Hook PreToolUse bloque les `innerHTML = ...` avec contenu HTML — utiliser `insertAdjacentHTML` après `removeChild` ou `appendChild(createElement(...))`
