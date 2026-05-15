# LFO — Catalogue des 22 démarches

> Document de référence validé le 17/04/2026
> Source : sessions de spécification complètes + skill LFO

---

## 🧭 Règles transverses

### Paiement
- **Prix ≤ 500€** : comptant OU 2× (sauf UAI = comptant uniquement)
- **Prix > 500€** : comptant OU 3×
- **Admin peut marquer** : payé comptant hors-site / payé partiel / non payé
- **Blocage étapes** : si paiement 3x et tranche N non payée → étape N+1 bloquée

### Workflow général
- **Client** ne peut jamais revenir sur une étape précédente
- **Expert** reçoit toujours le dossier à l'étape 2
- **Admin** gère l'étape 1 + peut créer démarche pour un client (paiement hors-site)
- **Chatbot IA** est utilisé sur les démarches administratives pour collecter les infos et générer des pré-remplissages
- **Expert vérifie** les docs/formulaires générés par chatbot IA, peut faire aller-retour avec le client
- **Docs légaux officiels** (NDA, Qualiopi, arrêtés préfectoraux) = jamais générés par LFO (délivrés par l'administration)
- **Docs produits par LFO** : conventions, programmes, supports, contrats, CGV, BPF, dossiers de candidature

### Pattern "Formateur LFO"
- Option récurrente : +220€ (standard) ou +450€ (formateurs spécifiques agrément préfectoral)
- Quand le client n'a pas de formateur habilité, LFO en fournit un

### Pattern "Mode accompagnement"
- Présent sur la plupart des démarches : RDV visio ou accompagnement email
- Inclus dans le prix de base (l'expert accompagne toujours)

### Pattern "Cross-sell bloquant"
- Si prérequis manquant → affichage message + bouton vers la démarche manquante
- Applicable à : Formation élus, Centre examen, Centre certifié, Habilitation (Qualiopi requis)

### Pattern "Étape conditionnelle"
- Étapes qui peuvent être marquées "Non requise ✓" selon contexte
- Exemple : Inspection préfectorale (Agrément préfectoral)

### Pattern "Calcul dynamique du prix"
- Le prix change en temps réel à l'étape Configuration selon options cochées
- Applicable : Centre certifié, Site, App, LMS, EDOF (formateurs sup), Agent IA (N agents)

### Pattern "Démarches enfants"
- Pack Digital/Premium/Enterprise créent automatiquement des démarches "Création formation" enfants
- Pack Enterprise ajoute aussi démarches "App mobile" + "Agent IA" enfants
- Affichées dans la liste du client avec badge "Inclus dans Pack [X]"

---

## 📑 Catégorie : Démarrer mon activité

### 1. NDA — Numéro de Déclaration d'Activité

**Prix : 290€** (2× à 150€ ou comptant)

**Options :**
- +220€ Formateur habilité LFO

**Docs client requis (étape 1) :**
- Casier judiciaire B3 du dirigeant (< 3 mois)
- Pièce d'identité du dirigeant (recto-verso)
- CV + diplômes formateur (si formateur par le client, pas LFO)

**Docs générés par LFO :**
- Convention de formation type
- Programme de formation
- Contenu des actions de formation
- Organisation des actions de formation
- Moyens pédagogiques
- Moyens techniques
- Cerfa 10443 (BPF)

**Workflow (4 étapes) :**
1. **Configuration** : SIRET + options + docs + paiement
2. **Dépôt du dossier** : chatbot IA conversationnel → génération Cerfa + convention + programme → expert dépose à la DREETS (inclus dans les 290€)
3. **Réception courrier** : DREETS envoie récépissé (~30 jours) → client upload courrier → expert enregistre numéro NDA
4. **Terminée** : badge ✓ NDA sur la card organisme

---

### 2. Création OF — Création Organisme de Formation

**Prix : 1 490€** (3× à 500€ ou comptant) — **-100€ si Kbis existant**

**Options :**
- +490€ Bilan de compétences
- +490€ VAE
- +220€ Formateur LFO

**Docs client requis (étape 1, cas "Non") :**
- CNI dirigeant
- Justificatif de domicile
- Justificatif siège social

**Docs générés par LFO :**
- Statuts juridiques (LFO rédige, le client dépose capital et publie annonce lui-même)
- Tous les docs NDA + Qualiopi intégrés

**Workflow (6 étapes fixes) :**
1. **Configuration** : Question "Organisme déjà créé ?" (Oui/Non → -100€ si Non)
   - Si Oui : sélection organisme + upload Kbis existant
   - Si Non : saisies projet (nom, forme SAS/SASU/SARL/EURL/EI/Association 1901/Autre, adresse, % parts) + options
2. **Kbis** : si Oui → "Déjà fourni ✓" | si Non → LFO rédige statuts, client dépose capital et publie annonce, Kbis final
3. **NDA** : parcours NDA intégré (chatbot IA + dépôt DREETS)
4. **Qualiopi** : parcours Qualiopi intégré (32 indicateurs + audit)
5. **Options annexes** : si bilan/VAE cochés → ajout formations au catalogue | sinon "Aucune option activée ✓"
6. **Terminée** : OF complet opérationnel

---

### 3. Création Formation

**Prix : 990€** (3× à 330€ ou comptant) — inclut **1 formation avec 5 modules de base**

**Options :**
- +290€ par module supplémentaire
- +8 000€ vidéos complètes (tournage pro)
- +220€ Formateur LFO

**Livrables inclus dans les 990€ :**
- Programme pédagogique détaillé
- Supports écrits (slides PDF + cahiers d'exercices)
- Quiz + évaluations intermédiaires
- **Évaluation finale type certif**
- Fiche formateur (objectifs, méthodes, déroulé séance par séance)
- **Vidéos de cours basiques** (pas tournage pro, mais utilisables)

**Docs client (étape 1) :**
- Brief formation (titre, thématique, public cible, durée, objectifs, certif RS/RNCP visée si applicable)
- Contenus pédagogiques existants (optionnel)

**Workflow (5 étapes) :**
1. **Configuration** : brief + upload contenus existants + options
2. **Création de la formation** : chatbot IA approfondit le brief + expert produit tous les livrables
3. **Vérification formateur** : CV + diplômes (client ou LFO) + validation adéquation formation↔formateur
4. **Validation client** : livraison au client + aller-retour ajustements + signature validation finale
5. **Terminée** : formation ajoutée au catalogue OF

---

### 4. EDOF — Référencement Mon Compte Formation

**Prix : 490€** (2× à 245€ ou comptant)

**Options :**
- +190€ par formateur supplémentaire (au-delà du 1er)
- +990€ site internet (si cross-sell souhaité)

**Philosophie** : le client remplit le minimum, LFO pré-remplit tout le reste via IA à partir des docs fournis, l'expert vérifie, le client valide et télécharge.

**Docs client (étape 1) :**
- Certificat Qualiopi (obligatoire pour EDOF)
- NDA (certificat DREETS)
- CNI / Passeport / Titre de séjour du représentant légal (recto-verso)
- Kbis OU extrait RNE (< 3 mois)
- RIB (IBAN + BIC)
- Nom + URL du médiateur de consommation

**Saisies rapides étape 1 :**
- Nombre de salariés + formateurs
- Sous-traitance oui/non (+ détails)
- Choix des catégories d'actions : Actions de formation / Bilans de compétences / VAE / Apprentissage / Permis / Formation élus
- Codes RS/RNCP ciblés (liste à cocher ou saisie)

**Docs demandés plus tard (étape 3, dépôt) :**
- Casier judiciaire B3 (< 3 mois)
- Déclaration de non-condamnation et filiation (< 3 mois)
- Pièces complémentaires si demandées par CDC

**Workflow (5 étapes) :**
1. **Configuration** : sélection organisme + options + docs essentiels + saisies minimums
2. **Formulaire (chatbot IA + aller-retour expert)** :
   - Chatbot IA conversationnel : "On va faire votre formulaire ensemble. Pouvez-vous me dire..."
   - Pose questions une par une, demande docs au besoin
   - Reprend les données déjà connues (organisme, président)
   - "Merci, je génère votre formulaire"
   - Expert vérifie → aller-retour si incohérences → client valide → télécharge PDF
   - Message final : "Rendez-vous sur [adresse CDC] pour déposer"
3. **Dépôt du dossier** : docs additionnels (casier, non-condamnation) + expert envoie à edofcontact@caissedesdepots.fr + accusé CDC
4. **Webinaire CDC** : LFO participe au webinaire obligatoire à la place du client (inclus) + attestation uploadée
5. **Terminée** : compte EDOF actif

**Note** : autant d'actions et sessions que souhaitées sont incluses, seul +190€/formateur sup et +990€ site sont des options payantes.

---

### 5. Qualiopi

**Prix : 990€** (3× à 330€ ou comptant)

**Options :**
- +490€ Référent qualité LFO présent le jour de l'audit
- +220€ Formateur LFO

**Docs client (étape 1) :**
- Kbis
- NDA
- CV + diplômes des formateurs (si formateur client, sinon +220€)

**Docs générés par LFO (32 indicateurs) :**
- Preuves critère 1 : Information publique
- Preuves critère 2 : Objectifs de formation
- Preuves critère 3 : Adaptation public
- Preuves critère 4 : Moyens pédagogiques
- Preuves critère 5 : Qualification formateurs
- Preuves critère 6 : Inscription environnement
- Preuves critère 7 : Recueil appréciations
- Procédures qualité complètes
- Plan d'action NC si non-conformités post-audit

**Workflow (4 étapes) :**
1. **Configuration** : sélection organisme + docs + options
2. **Préparation dossier** : chatbot IA + LFO génère les 32 preuves. Si preuves uniques manquantes (rapport d'activité précédent, témoignage stagiaire réel) → LFO indique "À fournir : [liste]". Aller-retour expert ↔ client.
3. **Audit** : LFO suggère 3 certificateurs (meilleure réputation / moins cher / plus rapide), client choisit librement. Option +490€ référent présent jour J. Upload rapport audit → plan d'action si NC.
4. **Terminée** : upload certificat → user_organismes.qualiopi = true → badge ✓ Qualiopi

---

### 6. OPCO

**Prix : 290€ × N OPCOs** (2× ou comptant pour chaque OPCO) — prix dynamique selon nombre

**Options :**
- +220€ Formateur LFO

**Docs client (étape 1) :**
- Certificat Qualiopi
- NDA

**Workflow (3 étapes) :**
1. **Configuration** (tous les choix initiaux) :
   - Sélection organisme + Qualiopi + NDA
   - Choix suggestion : "Je choisis mes OPCOs" OU "L'expert me suggère"
   - Si "Je choisis" → liste des 11 OPCOs cochables (Atlas, AFDAS, Akto, Constructys, Opco EP, Opco 2i, Mobilités, Uniformation, Ocapiat, Santé, Cohésion sociale) — prix 290€×N dynamique
   - Choix mode accompagnement : visio ou email
2. **RDV expert (visio ou email)** : expert prépare dossier candidature par OPCO ciblé + docs générés (programmes format OPCO, grille tarifaire, CV formateurs) + envoi candidatures. Si OPCOs suggérés → validation prix final.
3. **Terminée** : accords de référencement reçus + badge par OPCO sur la card organisme

---

### 7. France Travail

**Prix : 290€** (2× à 145€ ou comptant) — inclut création compte KAIROS + fiche par formation

**Options :**
- +220€ Formateur LFO
- **Cross-sell si pas de formations** : redirection vers démarche "Création formation" (990€)

**Docs client (étape 1) :**
- Certificat Qualiopi
- NDA

**Workflow (3 étapes) :**
1. **Configuration** :
   - Sélection organisme + Qualiopi + NDA
   - Question : "Avez-vous déjà vos formations créées ?" → Oui (upload catalogue) / Non (cross-sell Création formation)
   - Choix mode accompagnement : visio ou email
2. **RDV expert (visio ou email)** : création compte KAIROS + fiche par formation + convention AIF type + envoi dossier France Travail
3. **Terminée** : compte KAIROS actif + badge ✓ France Travail

---

## 🎯 Catégorie : Niches spécialisées

### 8. Contrôle

**Prix : 890€** (3× à 296€ ou comptant)

**Options :**
- +220€ Formateur LFO

**Modes de déclenchement :**
- Contrôle réactif : l'organisme a reçu un courrier DREETS
- Contrôle anticipé : mise en conformité préventive (pas de courrier)

**Docs client (étape 1) :**
- Si réactif : courrier DREETS + date + objet du contrôle
- BPF récents, conventions, CGV, CV formateurs

**Workflow (4 étapes) :**
1. **Configuration** : choix mode + upload docs + choix mode accompagnement
2. **RDV expert + diagnostic** : expert analyse, diagnostic par critère, plan d'action correctives
3. **Conformité** : expert produit docs mis en conformité (CGV, conventions, BPF, procédures) + client fournit éléments factuels + upload réponse DREETS
4. **Terminée** : réponse DREETS déposée (réactif) ou organisme à jour (anticipé). **L'expert s'arrête là** — pas de suivi après dépôt

---

### 9. UAI — Unité Administrative Immatriculée

**Prix : 149€** — **comptant uniquement** (pas de paiement échelonné)

**Options :** aucune

**Docs client (étape 1) :**
- Sélection organisme dans la liste user_organismes (doit avoir Kbis + NDA)
- Sélection formations RS/RNCP concernées par la demande UAI

**Workflow (3 étapes) :**
1. **Configuration** : organisme + formations RS/RNCP + choix mode accompagnement
2. **Dépôt du dossier** : chatbot IA + génération dossier + expert dépose au rectorat (inclus dans les 149€)
3. **Terminée** : courrier rectorat → client upload → numéro UAI enregistré → badge ✓ UAI

---

### 10. Centre d'examen

**Prix : 1 990€** (3× à 663€ ou comptant)

**Options :**
- +490€ Expert LFO présent lors de l'inspection terrain (certificateur)
- +220€ Formateur LFO

**Prérequis** : Qualiopi obligatoire (cross-sell bloquant sinon)

**Docs client (étape 1) :**
- Certificat Qualiopi
- Plans des locaux (accessibilité PMR)
- Attestation assurance RC pro

**Choix des certifications visées (3 modes UX) :**
- 🔍 Recherche par intitulé
- 🔢 Saisie numéro RS/RNCP
- 📂 Choix dans la liste filtrée par domaine

**Workflow (5 étapes) :**
1. **Configuration** : organisme + Qualiopi + plans + RC pro + choix certifications + mode accompagnement
2. **Audit des locaux** : expert LFO vérifie conformité + photos client + diagnostic + plan d'action NC
3. **Dépôt du dossier** : chatbot IA génère candidature + convention certificateur + règlement intérieur examen + expert dépose
4. **Inspection terrain** : certificateur vient sur place. Option +490€ expert LFO présent. PV reçu
5. **Terminée** : agrément centre d'examen reçu + badge ✓ Centre examen

---

### 11. Agrément préfectoral

**Prix : 690€** (3× à 230€ ou comptant)

**Options :**
- +450€ Formateurs spécifiques LFO (auto-école, SSIAP, CACES, habilitations électriques, etc.)
- +490€ Expert LFO présent lors de l'inspection préfectorale

**Docs client (étape 1) :**
- Validation organisme via SIRET (sélection dans liste)
- Casier judiciaire B3 du dirigeant (< 3 mois)
- CV des formateurs (ou +450€ si LFO fournit formateurs spécifiques)

**Choix du type d'agrément (3 modes UX) :**
- 🔍 Recherche par intitulé
- 🔢 Saisie RS/RNCP si applicable
- 📂 Liste filtrée par domaine (auto-école, SSIAP, CACES, habilitations électriques, autre)

**Workflow (4 étapes) :**
1. **Configuration** : organisme + casier + CV formateurs + type agrément + mode accompagnement
2. **Dépôt du dossier** : chatbot IA génère dossier préfecture + programme formation spécifique + expert dépose
3. **Inspection préfectorale** (étape conditionnelle) :
   - Affichée seulement si préfecture demande inspection
   - Sinon : "Non requise ✓" et passage direct à étape 4
   - Option +490€ expert LFO présent
4. **Terminée** : arrêté préfectoral reçu + badge ✓ Agrément préfectoral (+ type)

---

### 12. Formation élus

**Prix : 1 500€** (3× à 500€ ou comptant)

**Options :**
- +220€ Formateur LFO

**Prérequis (bloquants, cross-sell) :**
- Organisme existant avec Kbis + NDA
- Qualiopi (obligatoire depuis 01/01/2024 pour agrément élus)

**Docs client (étape 1) :**
- Bilans + comptes de résultat + annexes des 2 derniers exercices clos **certifiés par commissaire aux comptes**
- CV + diplômes des personnes définissant les formations
- Qualification formateurs internes ET externes
- BPF si déjà produit

**Saisie thèmes formation** : parmi le répertoire officiel (arrêté 13 avril 2023)

**Workflow (5 étapes) :**
1. **Configuration** : organisme + cross-sell bloquants + docs + thèmes + mode accompagnement
2. **Préparation du dossier** : chatbot IA + LFO génère dossier agrément (3 exemplaires) + fiche présentation + programmes conformes au répertoire + expert vérifie
3. **Dépôt préfecture** : client OU Expert LFO (inclus) envoie 3 exemplaires à la préfecture du département principal + accusé réception
4. **Commission CNFEL** : attente avis CNFEL (séances tous les 2 mois) + statut "En attente CNFEL — prochaine séance [date]" + notification décision (~1 mois après)
5. **Terminée** : agrément reçu (2 ans première fois, 4 ans renouvellement) + badge ✓ Agrément élus

---

### 13. Habilitation

**Prix : 490€ base** (2× à 245€ ou comptant) + devis complémentaire selon certif visée

**Options :**
- +220€ Formateur LFO

**Prérequis** : Qualiopi obligatoire (cross-sell bloquant)

**Docs client (étape 1) :**
- Certificat Qualiopi
- CV + diplômes des formateurs
- Expérience/références de l'OF

**Choix certification visée (3 modes UX) :**
- 🔍 Recherche par intitulé
- 🔢 Saisie RS/RNCP
- 📂 Liste filtrée par domaine

**Workflow (5 étapes, paiement à étape 3) :**
1. **Configuration** : organisme + Qualiopi + CV formateurs + expérience OF + certif visée + mode accompagnement + **paiement 490€**
2. **Analyse du dossier et recherche** : expert analyse certif visée + propose 2-3 certificateurs (prix/réputation/délai) + diagnostic + devis complémentaire si nécessaire
3. **Paiement complémentaire** (si devis accepté) :
   - Si devis : client paie avant étape 4
   - Sinon : "Non requise ✓"
4. **Constitution du dossier** : chatbot IA génère dossier candidature + CV formatés + programme conforme référentiel + convention certificateur négociée
5. **Terminée** : habilitation active + badge ✓ Habilité [nom certif]

---

### 14. Centre certifié (devenir certificateur France Compétences)

**Grille tarifaire dynamique (paiement 3× systématique) :**

| Type de certification | Prix de base |
|---|---|
| RS généraliste | **5 990€** (3×1 997€) |
| RNCP niveau 3-4 (CAP/Bac) | **7 490€** (3×2 497€) |
| RNCP niveau 5-6 (Bac+2/+3) | **8 990€** (3×2 997€) |
| RNCP niveau 7-8 (Master/Doctorat) | **11 990€** (3×3 997€) |
| **Secteur réglementé** (santé, droit, sport, transport, sécurité privée, finance) | **+2 000€** |
| **Renouvellement** (vs 1ère demande) | **-30%** |

**Prérequis** : Qualiopi obligatoire (cross-sell bloquant)

**Docs client (étape 1) — ULTRA simplifié :**
- Juste saisie de l'organisme dans la liste des organismes déjà enregistrés (détecte auto NDA + Qualiopi)
- Si Qualiopi manquant → cross-sell

**Saisies qui calculent le prix en direct :**
- Type : RS / RNCP
- Si RNCP : niveau (3 à 8)
- Secteur réglementé : oui/non (liste des 6 secteurs)
- Première demande / renouvellement

**Workflow (5 étapes) :**
1. **Configuration avec calcul dynamique** : organisme + auto-détection NDA/Qualiopi + choix type/niveau/secteur/renouvellement → prix total affiché en direct + échéancier 3× + saisie projet (intitulé, secteur/emploi visé) + mode accompagnement + paiement 1ère tranche
2. **Cadrage certification** : expert analyse faisabilité + définit référentiel activités/compétences + planifie blocs de compétences
3. **Constitution du dossier** : paiement 2ème tranche + LFO rédige dossier France Compétences complet + étude marché approfondie + processus certification + partenariats entreprises
4. **Dépôt France Compétences** : paiement 3ème tranche + LFO dépose sur plateforme + accusé officiel + attente commission (3-6 mois)
5. **Commission + Terminée** : passage commission + décision (accord RS/RNCP ou refus) + si accord : numéro officiel enregistré + badge ✓ Certificateur [nom certif]

---

## 📦 Catégorie : Packs

### 15. Pack Présence

**Prix : 990€** (3× à 330€ ou comptant)

**Contenu :**
- Site vitrine
- Documents légaux (CGV, CGU, RGPD, mentions légales)
- Livret d'accueil

---

### 16. Pack Digital

**Prix : 2 990€** (3× à 997€ ou comptant)

**Contenu = Présence + :**
- LMS (plateforme e-learning)
- **3 démarches "Création formation" générées automatiquement** (client saisit 3 thèmes)
- Quizz
- Système d'émargement

---

### 17. Pack Premium

**Prix : 4 990€** (3× à 1 663€ ou comptant)

**Contenu = Digital + :**
- 1 agent IA (client choisit parmi les 8 disponibles)

---

### 18. Pack Enterprise

**Prix : 7 990€** (3× à 2 663€ ou comptant)

**Contenu = Premium + :**
- Application mobile
- Agents IA supplémentaires (+390€ par agent au-delà du 1er inclus)

---

### Workflow uniforme des 4 Packs (4 étapes)

**Démarches administratives (NDA, Qualiopi, EDOF) NON incluses** — le client les prend séparément si besoin.

**Étape 1 — Configuration :**
- Question "Organisme déjà créé ?" → si Non : "Un organisme sera nécessaire — nous le créerons pour vous en parallèle" (pas de -100€)
- Brief objectifs + domaine + thématique
- Si Digital/Premium/Enterprise : saisie des 3 thèmes de formations
- Si Premium/Enterprise : choix du 1er agent IA (parmi 8)
- Si Enterprise : choix agents supplémentaires (+390€/agent)
- Choix mode accompagnement : visio ou email
- Paiement

**Étape 2 — Production :**
- Expert LFO produit tous les livrables du Pack
- Pour Digital+ : 3 démarches "Création formation" enfants créées automatiquement (badge "Inclus dans Pack [X]")
- Pour Premium+ : démarche "Agent IA" enfant
- Pour Enterprise : démarche "App mobile" enfant + démarches "Agent IA" supplémentaires

**Étape 3 — Révision :**
- Livraison au client + aller-retour pour ajustements

**Étape 4 — Terminée** : Pack déployé en production

---

## 🚀 Catégorie : Développer mon organisme

### Pattern commun Site / App / LMS
- Workflow identique en 5 étapes : Configuration → Design → Production → Sécurité → Terminée
- Question "Organisme déjà créé ?" : si Non, client continue sans organisme (créé en parallèle)
- Si Non : saisies spécifiques (références + screenshots + choix RDV visio/online)
- Calcul dynamique du prix à la Configuration selon options cochées

---

### 19. Site internet

**Base : 990€** (3× à 330€ ou comptant)

**Options d'échelle :**
| Option | Ajout |
|---|---|
| Site vitrine simple (3-5 pages) | Base **990€** |
| Site blog + SEO de base | +490€ |
| Site e-commerce (boutique formations) | +1 500€ |
| Multilingue (2+ langues) | +490€ |

**Workflow (5 étapes) :**
1. **Configuration** : organisme ou Non + options d'échelle + prix dynamique + mode accompagnement
2. **Design** : wireframes + maquettes V1 → validation client
3. **Production** : site staging + contenus + tests navigateurs
4. **Sécurité** : SSL + backup + accès admin
5. **Terminée** : site en production

---

### 20. App mobile

**Base : 4 990€** (3× à 1 663€ ou comptant)

**Options d'échelle :**
| Option | Ajout |
|---|---|
| iOS seule OU Android seule | Base **4 990€** |
| iOS + Android (les deux) | +2 000€ |
| Publication stores (App Store + Play Store) | +490€ |
| Notifications push + messagerie | +990€ |

**Workflow (5 étapes) :**
1. **Configuration** : organisme ou Non + options d'échelle + prix dynamique + comptes développeur Apple/Google + mode accompagnement
2. **Design** : wireframes app + maquettes iOS+Android → validation client
3. **Production** : build TestFlight + APK Android + docs API si backend custom
4. **Sécurité** : soumission Apple Store + Play Store + publication OK
5. **Terminée** : app live

---

### 21. LMS

**Base : 2 900€** (3× à 967€ ou comptant)

**Options d'échelle :**
| Option | Ajout |
|---|---|
| LMS jusqu'à 50 apprenants | Base **2 900€** |
| LMS 50-500 apprenants | +1 500€ |
| LMS 500+ apprenants (entreprise) | +3 000€ |
| Intégration CPF / EDOF | +990€ |
| App mobile apprenant | +1 990€ |

**Workflow (5 étapes) :**
1. **Configuration** : organisme ou Non + options d'échelle + prix dynamique + nombre apprenants prévu + contenus pédagogiques (ou brief) + mode accompagnement
2. **Design** : wireframes LMS (apprenant + admin) + maquettes V1
3. **Production** : LMS staging + parcours intégrés + quiz configurés
4. **Sécurité** : SSL + RGPD + formation admin 1h
5. **Terminée** : LMS en production

---

### 22. Agent IA

**Prix : 390€ × N agents** (2× à 195€/agent ou comptant)

**Les 8 agents disponibles :**
1. **Réseaux sociaux** : publier, planifier, répondre aux commentaires
2. **Dossiers administratifs** : EDOF, OPCO, France Travail, Qualiopi
3. **Répondre aux candidats** : tri automatique + réponses personnalisées
4. **Support client** : FAQ + chat + réponses
5. **Gérer les apprenants** : suivi + relances + émargement + attestations
6. **Comptabilité** : factures + devis + relances paiement
7. **Veille réglementaire** : alertes Qualiopi + DREETS + France Compétences
8. **Marketing & prospection** : email + séquences + lead nurturing

**Workflow (4 étapes) :**
1. **Configuration** : organisme ou Non + sélection agents (grid 8 avec checkbox) + calcul prix dynamique 390€×N + accès outils existants (API clés, logins) + mode accompagnement
2. **RDV expert** : compte-rendu + plan d'action + périmètre agent(s)
3. **Production** : configuration agent + prompts + workflows + tests + guide utilisation
4. **Terminée** : agents actifs

---

## 🔗 Cross-sells identifiés

| Démarche source | Prérequis manquant | Cross-sell vers |
|---|---|---|
| Formation élus | Kbis/NDA absent | Création OF |
| Formation élus | Qualiopi absent | Qualiopi |
| Centre examen | Qualiopi absent | Qualiopi |
| Centre certifié | Qualiopi absent | Qualiopi |
| Habilitation | Qualiopi absent | Qualiopi |
| France Travail | Pas de formations | Création formation |
| Toute démarche (optionnel) | Pas de formateur | +220€ formateur LFO inclus |

---

## 💡 Table récapitulative des prix

| # | Démarche | Prix base | Échelonnement |
|---|---|---|---|
| 1 | NDA | 290€ | Comptant / 2× |
| 2 | Création OF | 1 490€ | Comptant / 3× |
| 3 | Création Formation | 990€ | Comptant / 3× |
| 4 | EDOF | 490€ | Comptant / 2× |
| 5 | Qualiopi | 990€ | Comptant / 3× |
| 6 | OPCO | 290€/OPCO | Comptant / 2× |
| 7 | France Travail | 290€ | Comptant / 2× |
| 8 | Contrôle | 890€ | Comptant / 3× |
| 9 | UAI | 149€ | **Comptant uniquement** |
| 10 | Centre examen | 1 990€ | Comptant / 3× |
| 11 | Agrément préfectoral | 690€ | Comptant / 3× |
| 12 | Formation élus | 1 500€ | Comptant / 3× |
| 13 | Habilitation | 490€ base | Comptant / 2× |
| 14 | Centre certifié | 5 990€ à 13 990€ | **3× systématique** |
| 15 | Pack Présence | 990€ | Comptant / 3× |
| 16 | Pack Digital | 2 990€ | Comptant / 3× |
| 17 | Pack Premium | 4 990€ | Comptant / 3× |
| 18 | Pack Enterprise | 7 990€ | Comptant / 3× |
| 19 | Site internet | 990€ base | Comptant / 3× |
| 20 | App mobile | 4 990€ base | Comptant / 3× |
| 21 | LMS | 2 900€ base | Comptant / 3× |
| 22 | Agent IA | 390€/agent | Comptant / 2× |

---

**Document validé le 17/04/2026 — 22/22 démarches spécifiées.**
