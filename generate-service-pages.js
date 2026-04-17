#!/usr/bin/env node
// =====================================================================
// LFO — Générateur de 22 pages service statiques
// Usage: node generate-service-pages.js
// =====================================================================

const fs = require('fs');

// =====================================================================
// 22 SERVICES — DONNÉES COMPLÈTES
// =====================================================================

const SERVICES = [
  // ─── CATÉGORIE : Procédures d'ouverture ───
  {
    id: 'nda', slug: 'service-nda',
    name: 'NDA — Déclaration d\'activité',
    category: 'Procédures d\'ouverture', categoryColor: '#D85A30', categoryLight: '#FFF8F3',
    shortDesc: 'Numéro de Déclaration d\'Activité auprès de la DREETS — obligatoire pour exercer.',
    longDesc: 'La déclaration d\'activité (NDA) est la première étape obligatoire pour tout organisme de formation. Elle vous permet d\'obtenir votre numéro d\'enregistrement auprès de la DREETS et d\'exercer légalement. Notre équipe constitue votre dossier complet, génère les documents requis (Cerfa, convention, programme) et dépose le dossier pour vous.',
    price: '290€', oldPrice: '990€', time: '3 semaines',
    paymentModes: 'Comptant ou 2 x 150€', tag: null,
    steps: [
      { title: 'Configuration', desc: 'Vérification SIRET, upload documents, choix options' },
      { title: 'Dépôt du dossier', desc: 'Chatbot IA génère Cerfa + convention + programme, expert dépose à la DREETS' },
      { title: 'Réception courrier', desc: 'La DREETS envoie le récépissé (~30 jours), vous uploadez le courrier' },
      { title: 'Terminée', desc: 'Numéro NDA enregistré, badge activé sur votre organisme' },
    ],
    includes: [
      'Vérification complète de votre dossier',
      'Génération du Cerfa 10443 (BPF)',
      'Rédaction de la convention de formation type',
      'Création du programme de formation',
      'Dépôt du dossier auprès de la DREETS (inclus)',
      'Suivi jusqu\'à réception du récépissé',
      'Expert dédié tout au long du processus',
    ],
    prerequisites: [],
    options: [
      { name: 'Formateur habilité LFO', price: '+220€', desc: 'Si vous n\'avez pas de formateur' },
    ],
    faq: [
      { q: 'Combien de temps pour obtenir le NDA ?', a: 'Environ 30 jours après dépôt du dossier complet auprès de la DREETS.' },
      { q: 'Quels documents dois-je fournir ?', a: 'Casier judiciaire B3 du dirigeant (< 3 mois), pièce d\'identité recto-verso, CV et diplômes du formateur.' },
      { q: 'Le NDA est-il obligatoire ?', a: 'Oui, tout organisme dispensant des formations professionnelles doit détenir un NDA valide.' },
    ],
    ctaLink: '/creer-of', ctaLabel: 'Commander',
  },
  {
    id: 'creation_of', slug: 'service-creation-of',
    name: 'Création OF — Organisme de Formation',
    category: 'Procédures d\'ouverture', categoryColor: '#D85A30', categoryLight: '#FFF8F3',
    shortDesc: 'OF complet : statuts + SIRET + NDA + Qualiopi — clé en main.',
    longDesc: 'Nous créons votre organisme de formation de A à Z : rédaction des statuts juridiques, immatriculation au greffe, obtention du SIRET, dépôt NDA auprès de la DREETS, et accompagnement Qualiopi. Un expert dédié vous accompagne à chaque étape.',
    price: '1 490€', oldPrice: '3 990€', time: '6 semaines',
    paymentModes: 'Comptant ou 3 x 497€', tag: 'Le plus demandé',
    steps: [
      { title: 'Configuration', desc: 'Choix forme juridique, Kbis existant ou création, options' },
      { title: 'Kbis', desc: 'Rédaction statuts, immatriculation, obtention Kbis' },
      { title: 'NDA', desc: 'Parcours NDA intégré (Cerfa + dépôt DREETS)' },
      { title: 'Qualiopi', desc: 'Préparation 32 indicateurs + accompagnement audit' },
      { title: 'Options annexes', desc: 'Bilan, VAE, formations supplémentaires si cochés' },
      { title: 'Terminée', desc: 'OF opérationnel et prêt à facturer' },
    ],
    includes: [
      'Rédaction des statuts juridiques',
      'Immatriculation au greffe et obtention SIRET',
      'Déclaration d\'activité NDA complète',
      'Accompagnement certification Qualiopi (32 indicateurs)',
      'Convention de formation + CGV + documents légaux',
      'Expert dédié de bout en bout',
      'Suivi temps réel dans votre dashboard',
    ],
    prerequisites: [],
    options: [
      { name: 'Bilan de compétences', price: '+490€', desc: 'Ajout spécialisation bilan' },
      { name: 'VAE', price: '+490€', desc: 'Ajout spécialisation VAE' },
      { name: 'Formateur LFO', price: '+220€', desc: 'Si vous n\'avez pas de formateur' },
      { name: 'Kbis existant', price: '-100€', desc: 'Réduction si vous avez déjà un Kbis' },
    ],
    faq: [
      { q: 'Combien de temps pour créer un OF complet ?', a: 'Environ 6 semaines pour l\'ensemble (Kbis + NDA + Qualiopi).' },
      { q: 'Les annonces légales sont-elles incluses ?', a: 'Non, les annonces légales et frais d\'audit Qualiopi ne sont pas inclus.' },
      { q: 'Quelle forme juridique choisir ?', a: 'Notre expert vous conseille. SASU est la plus courante pour un formateur indépendant.' },
      { q: 'Puis-je ajouter des options plus tard ?', a: 'Oui, vous pouvez ajouter Bilan, VAE, EDOF ou un site à tout moment.' },
    ],
    ctaLink: '/creer-of', ctaLabel: 'Créer mon OF',
  },
  {
    id: 'creation_formation', slug: 'service-creation-formation',
    name: 'Création Formation',
    category: 'Procédures d\'ouverture', categoryColor: '#D85A30', categoryLight: '#FFF8F3',
    shortDesc: '1 formation complète avec 5 modules : programme, supports, quiz, évaluation.',
    longDesc: 'Nous créons votre formation de A à Z : programme pédagogique détaillé, supports écrits, quiz, évaluations, fiche formateur et vidéos de cours basiques. Le chatbot IA approfondit votre brief, l\'expert produit tous les livrables, et vous validez avant mise en catalogue.',
    price: '990€', oldPrice: '2 990€', time: '4 semaines',
    paymentModes: 'Comptant ou 3 x 330€', tag: null,
    steps: [
      { title: 'Configuration', desc: 'Brief formation + upload contenus existants + options' },
      { title: 'Création', desc: 'Chatbot IA approfondit le brief + expert produit les livrables' },
      { title: 'Vérification formateur', desc: 'CV + diplômes + validation adéquation formation' },
      { title: 'Validation client', desc: 'Livraison + aller-retour ajustements + signature' },
      { title: 'Terminée', desc: 'Formation ajoutée au catalogue de votre OF' },
    ],
    includes: [
      'Programme pédagogique détaillé',
      'Supports écrits (slides PDF + cahiers d\'exercices)',
      'Quiz + évaluations intermédiaires',
      'Évaluation finale type certification',
      'Fiche formateur complète',
      'Vidéos de cours basiques',
      'Expert pédagogique dédié',
    ],
    prerequisites: [],
    options: [
      { name: 'Module supplémentaire', price: '+290€', desc: 'Par module au-delà des 5 inclus' },
      { name: 'Vidéos pro (tournage)', price: '+8 000€', desc: 'Tournage professionnel complet' },
      { name: 'Formateur LFO', price: '+220€', desc: 'Si vous n\'avez pas de formateur' },
    ],
    faq: [
      { q: 'Combien de modules sont inclus ?', a: '5 modules de base sont inclus dans le prix. Chaque module supplémentaire coûte 290€.' },
      { q: 'Les vidéos sont-elles incluses ?', a: 'Oui, des vidéos basiques sont incluses. Pour un tournage professionnel, l\'option est à 8 000€.' },
      { q: 'Puis-je fournir mes propres contenus ?', a: 'Oui, vous pouvez uploader vos contenus existants à l\'étape 1 et nous les structurerons.' },
    ],
    ctaLink: '/creer-of', ctaLabel: 'Commander',
  },
  {
    id: 'edof', slug: 'service-edof',
    name: 'EDOF — Accès Mon Compte Formation',
    category: 'Procédures d\'ouverture', categoryColor: '#D85A30', categoryLight: '#FFF8F3',
    shortDesc: 'Référencement Mon Compte Formation pour accéder au CPF. Dossier déposé sous 48h.',
    longDesc: 'L\'ouverture EDOF vous permet de référencer vos formations sur Mon Compte Formation et d\'accéder aux financements CPF. Notre équipe prend en charge l\'intégralité du processus : constitution du dossier, chatbot IA pour le formulaire, dépôt auprès de la Caisse des Dépôts, et participation au webinaire obligatoire.',
    price: '490€', oldPrice: '1 990€', time: '6 semaines',
    paymentModes: 'Comptant ou 2 x 245€', tag: 'Best seller',
    steps: [
      { title: 'Configuration', desc: 'Sélection organisme, upload Qualiopi + NDA + documents' },
      { title: 'Formulaire', desc: 'Chatbot IA conversationnel qui remplit le formulaire EDOF pour vous' },
      { title: 'Dépôt', desc: 'Expert envoie le dossier à la Caisse des Dépôts + documents complémentaires' },
      { title: 'Webinaire', desc: 'LFO participe au webinaire obligatoire à votre place (inclus)' },
      { title: 'Terminée', desc: 'Compte EDOF actif, vos formations sont en ligne' },
    ],
    includes: [
      'Analyse et vérification de tous vos documents',
      'Formulaire EDOF pré-rempli par notre IA',
      'Dépôt du dossier auprès de la Caisse des Dépôts',
      'Participation au webinaire obligatoire (inclus)',
      'Gestion des documents complémentaires si demandés',
      'Mise en ligne de vos premières formations',
      'Expert dédié et suivi temps réel',
    ],
    prerequisites: ['NDA active', 'Certification Qualiopi'],
    options: [
      { name: 'Formateur supplémentaire', price: '+190€', desc: 'Par formateur au-delà du 1er' },
      { name: 'Site internet vitrine', price: '+990€', desc: 'Site professionnel clé en main' },
    ],
    faq: [
      { q: 'Combien de temps pour obtenir l\'accès EDOF ?', a: 'En moyenne 6 semaines à compter du dépôt du dossier complet.' },
      { q: 'Le webinaire est-il obligatoire ?', a: 'Oui, la CDC exige la participation. Nous y participons à votre place (inclus).' },
      { q: 'Puis-je ajouter plusieurs formateurs ?', a: 'Oui, le premier est inclus, chaque formateur supplémentaire coûte 190€.' },
    ],
    ctaLink: '/monaccesedof', ctaLabel: 'Commander',
  },
  {
    id: 'qualiopi', slug: 'service-qualiopi',
    name: 'Qualiopi — Certification Qualité',
    category: 'Procédures d\'ouverture', categoryColor: '#D85A30', categoryLight: '#FFF8F3',
    shortDesc: 'Certification qualité obligatoire — 32 indicateurs préparés par notre équipe.',
    longDesc: 'La certification Qualiopi est obligatoire pour accéder aux financements publics (CPF, OPCO, France Travail). Nous préparons l\'intégralité de vos preuves pour les 32 indicateurs, vous suggérons 3 certificateurs, et vous accompagnons jusqu\'au jour de l\'audit.',
    price: '990€', oldPrice: '2 990€', time: '8 semaines',
    paymentModes: 'Comptant ou 3 x 330€', tag: 'Indispensable',
    steps: [
      { title: 'Configuration', desc: 'Sélection organisme, upload NDA et documents existants' },
      { title: 'Préparation', desc: 'Chatbot IA + expert génèrent les 32 preuves indicateurs' },
      { title: 'Audit', desc: 'Choix certificateur + accompagnement jour J + plan NC si besoin' },
      { title: 'Terminée', desc: 'Certificat Qualiopi reçu, badge activé' },
    ],
    includes: [
      'Génération des preuves pour les 32 indicateurs',
      'Procédures qualité complètes',
      'Suggestion de 3 certificateurs',
      'Accompagnement jusqu\'au jour de l\'audit',
      'Plan d\'action en cas de non-conformités',
      'Expert qualité dédié',
    ],
    prerequisites: ['NDA active'],
    options: [
      { name: 'Référent qualité jour audit', price: '+490€', desc: 'Expert LFO présent le jour de l\'audit' },
      { name: 'Formateur LFO', price: '+220€', desc: 'Si vous n\'avez pas de formateur qualifié' },
    ],
    faq: [
      { q: 'Qualiopi est-elle obligatoire ?', a: 'Oui, pour accéder aux financements publics (CPF, OPCO, France Travail, etc.).' },
      { q: 'Combien coûte l\'audit ?', a: 'L\'audit est facturé par le certificateur (1 500 à 3 000€). Non inclus dans notre tarif.' },
      { q: 'Que se passe-t-il en cas de non-conformité ?', a: 'Nous aidons à rédiger le plan d\'action corrective dans les délais.' },
    ],
    ctaLink: '/creer-of', ctaLabel: 'Commander',
  },
  {
    id: 'opco', slug: 'service-opco',
    name: 'OPCO — Référencement financeur',
    category: 'Procédures d\'ouverture', categoryColor: '#D85A30', categoryLight: '#FFF8F3',
    shortDesc: 'Référencement auprès de l\'OPCO de votre choix pour accéder aux financements.',
    longDesc: 'Le référencement OPCO vous permet d\'accéder aux financements des entreprises via leur opérateur de compétences. Notre expert prépare votre dossier de candidature, génère les documents aux formats exigés par chaque OPCO, et envoie les candidatures.',
    price: '290€ / OPCO', oldPrice: '990€', time: '3 semaines',
    paymentModes: 'Comptant ou 2x par OPCO', tag: null,
    steps: [
      { title: 'Configuration', desc: 'Sélection organisme + Qualiopi + NDA + choix OPCOs' },
      { title: 'RDV expert', desc: 'Préparation dossier candidature + docs format OPCO + envoi' },
      { title: 'Terminée', desc: 'Accords de référencement reçus, badges OPCO activés' },
    ],
    includes: [
      'Préparation du dossier de candidature par OPCO',
      'Programmes au format exigé par chaque OPCO',
      'Grille tarifaire conforme',
      'CV formateurs formatés',
      'Envoi des candidatures (inclus)',
      'Expert dédié',
    ],
    prerequisites: ['NDA active', 'Certification Qualiopi'],
    options: [
      { name: 'Formateur LFO', price: '+220€', desc: 'Si vous n\'avez pas de formateur' },
    ],
    faq: [
      { q: 'Combien d\'OPCOs puis-je choisir ?', a: 'Autant que vous le souhaitez. Le prix est de 290€ par OPCO sélectionné.' },
      { q: 'Quels sont les 11 OPCOs ?', a: 'Atlas, AFDAS, Akto, Constructys, Opco EP, Opco 2i, Mobilités, Uniformation, Ocapiat, Santé, Cohésion sociale.' },
      { q: 'Qualiopi est-elle nécessaire ?', a: 'Oui, la certification Qualiopi est obligatoire pour être référencé auprès des OPCOs.' },
    ],
    ctaLink: '/creer-of', ctaLabel: 'Commander',
  },
  {
    id: 'france_travail', slug: 'service-france-travail',
    name: 'France Travail — Compte KAIROS',
    category: 'Procédures d\'ouverture', categoryColor: '#D85A30', categoryLight: '#FFF8F3',
    shortDesc: 'Création compte KAIROS pour former les demandeurs d\'emploi.',
    longDesc: 'Le référencement France Travail vous permet de former les demandeurs d\'emploi via le dispositif AIF. Nous créons votre compte KAIROS, configurons vos fiches formation, et préparons les conventions AIF type.',
    price: '290€', oldPrice: '990€', time: '3 semaines',
    paymentModes: 'Comptant ou 2 x 145€', tag: null,
    steps: [
      { title: 'Configuration', desc: 'Sélection organisme + Qualiopi + NDA + catalogue formations' },
      { title: 'RDV expert', desc: 'Création compte KAIROS + fiches formation + convention AIF type' },
      { title: 'Terminée', desc: 'Compte KAIROS actif, badge France Travail activé' },
    ],
    includes: [
      'Création du compte KAIROS',
      'Configuration des fiches formation',
      'Convention AIF type',
      'Envoi du dossier France Travail',
      'Expert dédié',
    ],
    prerequisites: ['NDA active', 'Certification Qualiopi', 'Au moins 1 formation créée'],
    options: [
      { name: 'Formateur LFO', price: '+220€', desc: 'Si vous n\'avez pas de formateur' },
    ],
    faq: [
      { q: 'Qu\'est-ce que KAIROS ?', a: 'KAIROS est la plateforme de France Travail pour gérer les conventions de formation des demandeurs d\'emploi.' },
      { q: 'Faut-il avoir des formations déjà créées ?', a: 'Oui. Si vous n\'en avez pas, nous pouvons les créer pour vous (990€ par formation).' },
      { q: 'Combien de temps pour l\'activation ?', a: 'Environ 3 semaines après envoi du dossier complet.' },
    ],
    ctaLink: '/creer-of', ctaLabel: 'Commander',
  },

  // ─── CATÉGORIE : Niches spécialisées ───
  {
    id: 'controle', slug: 'service-controle',
    name: 'Contrôle DREETS',
    category: 'Démarches spécialisées', categoryColor: '#7F77DD', categoryLight: '#EEEDFE',
    shortDesc: 'Mise en conformité suite à un contrôle DREETS — réactif ou anticipé.',
    longDesc: 'Qu\'il s\'agisse d\'un contrôle annoncé par la DREETS ou d\'une mise en conformité préventive, notre expert analyse votre dossier, identifie les écarts et produit l\'ensemble des documents correctifs. Nous préparons votre réponse complète.',
    price: '890€', oldPrice: '2 490€', time: '4 semaines',
    paymentModes: 'Comptant ou 3 x 297€', tag: null,
    steps: [
      { title: 'Configuration', desc: 'Choix mode (réactif/anticipé) + upload documents + courrier DREETS' },
      { title: 'Diagnostic', desc: 'Expert analyse dossier, diagnostic par critère, plan d\'action' },
      { title: 'Conformité', desc: 'Production des documents mis en conformité + réponse DREETS' },
      { title: 'Terminée', desc: 'Réponse déposée (réactif) ou organisme à jour (anticipé)' },
    ],
    includes: [
      'Diagnostic complet par critère',
      'Plan d\'action corrective',
      'Production des documents conformes (CGV, conventions, BPF)',
      'Rédaction de la réponse DREETS',
      'Expert conformité dédié',
    ],
    prerequisites: [],
    options: [
      { name: 'Formateur LFO', price: '+220€', desc: 'Si vous n\'avez pas de formateur' },
    ],
    faq: [
      { q: 'Que faire si je reçois un courrier de contrôle ?', a: 'Contactez-nous immédiatement. Plus tôt nous intervenons, mieux c\'est.' },
      { q: 'Le contrôle anticipé est-il utile ?', a: 'Oui, il permet d\'identifier et corriger les écarts avant un éventuel contrôle.' },
      { q: 'L\'expert suit-il après le dépôt ?', a: 'L\'expert prépare et dépose la réponse. Le suivi post-dépôt n\'est pas inclus.' },
    ],
    ctaLink: '/creer-of', ctaLabel: 'Commander',
  },
  {
    id: 'uai', slug: 'service-uai',
    name: 'UAI — Unité Administrative Immatriculée',
    category: 'Démarches spécialisées', categoryColor: '#7F77DD', categoryLight: '#EEEDFE',
    shortDesc: 'Numéro UAI auprès du rectorat pour les formations RS/RNCP.',
    longDesc: 'Le numéro UAI est attribué par le rectorat et est nécessaire pour dispenser certaines formations inscrites au RS ou au RNCP. Nous constituons votre dossier et le déposons auprès du rectorat compétent.',
    price: '149€', oldPrice: '490€', time: '3 semaines',
    paymentModes: 'Comptant uniquement', tag: null,
    steps: [
      { title: 'Configuration', desc: 'Sélection organisme + formations RS/RNCP concernées' },
      { title: 'Dépôt', desc: 'Chatbot IA + génération dossier + expert dépose au rectorat' },
      { title: 'Terminée', desc: 'Numéro UAI enregistré, badge activé' },
    ],
    includes: [
      'Constitution du dossier rectorat',
      'Génération des documents requis',
      'Dépôt auprès du rectorat (inclus)',
      'Suivi jusqu\'à attribution du numéro',
    ],
    prerequisites: ['Kbis', 'NDA active'],
    options: [],
    faq: [
      { q: 'Qu\'est-ce qu\'un numéro UAI ?', a: 'C\'est un identifiant attribué par le rectorat, nécessaire pour dispenser des formations RS/RNCP.' },
      { q: 'Pourquoi pas de paiement en 2x ?', a: 'Le prix de 149€ ne permet pas l\'échelonnement. Paiement comptant uniquement.' },
    ],
    ctaLink: '/creer-of', ctaLabel: 'Commander',
  },
  {
    id: 'centre_examen', slug: 'service-centre-examen',
    name: 'Centre d\'examen',
    category: 'Démarches spécialisées', categoryColor: '#7F77DD', categoryLight: '#EEEDFE',
    shortDesc: 'Devenir centre d\'examen agréé pour des certifications RS/RNCP.',
    longDesc: 'Nous vous accompagnons pour devenir centre d\'examen agréé : audit de vos locaux, constitution du dossier de candidature, convention certificateur, règlement intérieur d\'examen, et accompagnement lors de l\'inspection terrain.',
    price: '1 990€', oldPrice: '4 990€', time: '3 mois',
    paymentModes: 'Comptant ou 3 x 663€', tag: null,
    steps: [
      { title: 'Configuration', desc: 'Organisme + Qualiopi + plans locaux + RC pro + certifications visées' },
      { title: 'Audit locaux', desc: 'Vérification conformité + photos + diagnostic + plan NC' },
      { title: 'Dépôt dossier', desc: 'Candidature + convention certificateur + règlement examen' },
      { title: 'Inspection', desc: 'Certificateur vient sur place. Option expert LFO présent' },
      { title: 'Terminée', desc: 'Agrément centre d\'examen reçu, badge activé' },
    ],
    includes: [
      'Audit de conformité de vos locaux',
      'Constitution du dossier de candidature',
      'Convention certificateur négociée',
      'Règlement intérieur d\'examen',
      'Accompagnement inspection terrain',
      'Expert dédié',
    ],
    prerequisites: ['Certification Qualiopi'],
    options: [
      { name: 'Expert LFO jour inspection', price: '+490€', desc: 'Expert présent lors de l\'inspection terrain' },
      { name: 'Formateur LFO', price: '+220€', desc: 'Si vous n\'avez pas de formateur' },
    ],
    faq: [
      { q: 'Qualiopi est-elle nécessaire ?', a: 'Oui, la certification Qualiopi est un prérequis obligatoire.' },
      { q: 'L\'inspection est-elle systématique ?', a: 'Cela dépend du certificateur. Nous vous préparons dans tous les cas.' },
      { q: 'Combien de certifications puis-je viser ?', a: 'Autant que vous le souhaitez, le dossier est adapté à chaque certification.' },
    ],
    ctaLink: '/creer-of', ctaLabel: 'Commander',
  },
  {
    id: 'agrement_prefectoral', slug: 'service-agrement-prefectoral',
    name: 'Agrément préfectoral',
    category: 'Démarches spécialisées', categoryColor: '#7F77DD', categoryLight: '#EEEDFE',
    shortDesc: 'Auto-école, SSIAP, CACES, habilitations électriques — agrément préfecture.',
    longDesc: 'L\'agrément préfectoral est nécessaire pour certaines formations réglementées. Nous constituons votre dossier complet, générons le programme spécifique, et accompagnons le processus jusqu\'à réception de l\'arrêté préfectoral.',
    price: '690€', oldPrice: '1 990€', time: '2 mois',
    paymentModes: 'Comptant ou 3 x 230€', tag: null,
    steps: [
      { title: 'Configuration', desc: 'Organisme + casier B3 + CV formateurs + type agrément' },
      { title: 'Dépôt dossier', desc: 'Chatbot IA génère dossier préfecture + programme spécifique' },
      { title: 'Inspection', desc: 'Étape conditionnelle si préfecture exige une inspection' },
      { title: 'Terminée', desc: 'Arrêté préfectoral reçu, badge activé' },
    ],
    includes: [
      'Constitution du dossier préfecture',
      'Programme de formation spécifique',
      'Dépôt du dossier (inclus)',
      'Accompagnement inspection si requise',
      'Expert dédié',
    ],
    prerequisites: [],
    options: [
      { name: 'Formateurs spécifiques LFO', price: '+450€', desc: 'Auto-école, SSIAP, CACES, habilitations électriques' },
      { name: 'Expert LFO jour inspection', price: '+490€', desc: 'Présent lors de l\'inspection préfectorale' },
    ],
    faq: [
      { q: 'Quels types d\'agrément ?', a: 'Auto-école, SSIAP, CACES, habilitations électriques, et autres formations réglementées.' },
      { q: 'L\'inspection est-elle obligatoire ?', a: 'Pas toujours. Si la préfecture l\'exige, nous vous accompagnons.' },
      { q: 'Faut-il Qualiopi ?', a: 'Non, l\'agrément préfectoral n\'exige pas Qualiopi (mais c\'est recommandé).' },
    ],
    ctaLink: '/creer-of', ctaLabel: 'Commander',
  },
  {
    id: 'formation_elus', slug: 'service-formation-elus',
    name: 'Formation des élus',
    category: 'Démarches spécialisées', categoryColor: '#7F77DD', categoryLight: '#EEEDFE',
    shortDesc: 'OF spécialisé formation des élus locaux — agrément CNFEL inclus.',
    longDesc: 'L\'agrément pour la formation des élus locaux est délivré par la Commission Nationale de la Formation des Élus Locaux (CNFEL). Nous préparons l\'intégralité du dossier, les programmes conformes au répertoire officiel, et assurons le dépôt en préfecture.',
    price: '3 490€', oldPrice: '6 990€', time: '3 mois',
    paymentModes: 'Comptant ou 3 x 1 163€', tag: null,
    steps: [
      { title: 'Configuration', desc: 'Organisme + Qualiopi + documents + thèmes formation' },
      { title: 'Préparation', desc: 'Dossier agrément (3 exemplaires) + programmes conformes' },
      { title: 'Dépôt préfecture', desc: 'Envoi 3 exemplaires à la préfecture + accusé réception' },
      { title: 'Commission CNFEL', desc: 'Attente avis CNFEL (séances tous les 2 mois)' },
      { title: 'Terminée', desc: 'Agrément reçu (2 ans 1ère fois, 4 ans renouvellement)' },
    ],
    includes: [
      'Constitution du dossier (3 exemplaires)',
      'Programmes conformes au répertoire officiel',
      'Fiche de présentation de l\'organisme',
      'Dépôt en préfecture (inclus)',
      'Suivi commission CNFEL',
      'Expert dédié',
    ],
    prerequisites: ['Kbis + NDA', 'Certification Qualiopi', 'Bilans certifiés des 2 derniers exercices'],
    options: [
      { name: 'Formateur LFO', price: '+220€', desc: 'Si vous n\'avez pas de formateur' },
    ],
    faq: [
      { q: 'Combien de temps pour l\'agrément ?', a: 'Environ 3 mois. La CNFEL siège tous les 2 mois environ.' },
      { q: 'Qualiopi est-elle obligatoire ?', a: 'Oui, depuis le 01/01/2024 pour l\'agrément formation des élus.' },
      { q: 'Quelle durée d\'agrément ?', a: '2 ans pour une première demande, 4 ans pour un renouvellement.' },
    ],
    ctaLink: '/creer-of', ctaLabel: 'Commander',
  },
  {
    id: 'habilitation', slug: 'service-habilitation',
    name: 'Habilitation RS/RNCP',
    category: 'Démarches spécialisées', categoryColor: '#7F77DD', categoryLight: '#EEEDFE',
    shortDesc: 'Être habilité par un certificateur à dispenser une certification enregistrée.',
    longDesc: 'L\'habilitation vous permet de dispenser une certification inscrite au RS ou au RNCP. Notre expert analyse la certification visée, propose 2-3 certificateurs, constitue le dossier de candidature et négocie la convention.',
    price: '490€+', oldPrice: '1 990€', time: '2 à 8 semaines',
    paymentModes: 'Comptant ou 2 x 245€ (base)', tag: 'Nouveau',
    steps: [
      { title: 'Configuration', desc: 'Organisme + Qualiopi + CV formateurs + certification visée + paiement 490€' },
      { title: 'Analyse', desc: 'Expert analyse faisabilité + propose 2-3 certificateurs + devis' },
      { title: 'Paiement complémentaire', desc: 'Si devis accepté, paiement avant constitution dossier' },
      { title: 'Constitution dossier', desc: 'Candidature + CV formatés + programme conforme + convention' },
      { title: 'Terminée', desc: 'Habilitation active, badge activé' },
    ],
    includes: [
      'Analyse de faisabilité de la certification visée',
      'Proposition de 2-3 certificateurs',
      'Constitution du dossier de candidature',
      'CV formateurs formatés',
      'Programme conforme au référentiel',
      'Négociation convention certificateur',
      'Expert dédié',
    ],
    prerequisites: ['Certification Qualiopi'],
    options: [
      { name: 'Formateur LFO', price: '+220€', desc: 'Si vous n\'avez pas de formateur habilité' },
    ],
    faq: [
      { q: 'Pourquoi un prix de base + devis ?', a: 'Le prix de base couvre l\'analyse. Le devis complémentaire dépend de la certification visée.' },
      { q: 'Qualiopi est-elle nécessaire ?', a: 'Oui, la certification Qualiopi est un prérequis obligatoire.' },
      { q: 'Combien de certifications puis-je viser ?', a: 'Autant que vous le souhaitez, chaque habilitation est traitée séparément.' },
    ],
    ctaLink: '/creer-of', ctaLabel: 'Commander',
  },
  {
    id: 'centre_certifie', slug: 'service-centre-certifie',
    name: 'Centre certifié — Certificateur France Compétences',
    category: 'Démarches spécialisées', categoryColor: '#7F77DD', categoryLight: '#EEEDFE',
    shortDesc: 'Devenir certificateur enregistré auprès de France Compétences (RS ou RNCP).',
    longDesc: 'Nous vous accompagnons pour créer et enregistrer votre propre certification auprès de France Compétences. Prix variable selon le type (RS/RNCP), le niveau visé, et le secteur. Dossier complet, étude de marché, référentiel de compétences, et dépôt sur la plateforme officielle.',
    price: '5 990€+', oldPrice: '14 990€', time: '6 mois',
    paymentModes: '3 x systématique', tag: null,
    steps: [
      { title: 'Configuration', desc: 'Organisme + type RS/RNCP + niveau + secteur + paiement 1ère tranche' },
      { title: 'Cadrage', desc: 'Analyse faisabilité + référentiel activités/compétences + blocs' },
      { title: 'Constitution dossier', desc: 'Paiement 2ème tranche + dossier FC + étude marché + partenariats' },
      { title: 'Dépôt', desc: 'Paiement 3ème tranche + dépôt plateforme + attente commission' },
      { title: 'Terminée', desc: 'Numéro RS/RNCP officiel enregistré' },
    ],
    includes: [
      'Analyse de faisabilité complète',
      'Référentiel activités et compétences',
      'Étude de marché approfondie',
      'Dossier France Compétences complet',
      'Processus de certification',
      'Partenariats entreprises',
      'Expert dédié 6 mois',
    ],
    prerequisites: ['Certification Qualiopi'],
    options: [],
    faq: [
      { q: 'Combien coûte une certification RNCP ?', a: 'De 5 990€ (RS) à 11 990€ (RNCP niveau 7-8). +2 000€ si secteur réglementé. -30% si renouvellement.' },
      { q: 'Combien de temps ?', a: 'Environ 6 mois. La commission France Compétences siège périodiquement.' },
      { q: 'Qualiopi est-elle nécessaire ?', a: 'Oui, la certification Qualiopi est un prérequis obligatoire.' },
    ],
    ctaLink: '/creer-of', ctaLabel: 'Commander',
  },

  // ─── CATÉGORIE : Packs ───
  {
    id: 'pack_presence', slug: 'service-pack-presence',
    name: 'Pack Présence',
    category: 'Packs tout-en-un', categoryColor: '#1D9E75', categoryLight: '#E1F5EE',
    shortDesc: 'Site vitrine + documents légaux + livret d\'accueil.',
    longDesc: 'Le Pack Présence vous donne une présence en ligne professionnelle : site vitrine, documents légaux (CGV, CGU, RGPD, mentions légales) et livret d\'accueil pour vos apprenants.',
    price: '990€', oldPrice: '2 490€', time: '3 semaines',
    paymentModes: 'Comptant ou 3 x 330€', tag: null,
    steps: [
      { title: 'Configuration', desc: 'Brief objectifs + domaine + thématique + paiement' },
      { title: 'Production', desc: 'Site + documents légaux + livret d\'accueil' },
      { title: 'Révision', desc: 'Livraison + aller-retour ajustements' },
      { title: 'Terminée', desc: 'Pack déployé en production' },
    ],
    includes: ['Site vitrine professionnel', 'CGV, CGU, RGPD, mentions légales', 'Livret d\'accueil apprenants', 'Expert dédié'],
    prerequisites: [], options: [],
    faq: [
      { q: 'Le site est-il hébergé ?', a: 'Oui, l\'hébergement est inclus dans le pack.' },
      { q: 'Puis-je modifier le site moi-même ?', a: 'Oui, vous aurez un accès admin pour modifier les contenus.' },
    ],
    ctaLink: '/creer-of', ctaLabel: 'Commander',
  },
  {
    id: 'pack_digital', slug: 'service-pack-digital',
    name: 'Pack Digital',
    category: 'Packs tout-en-un', categoryColor: '#1D9E75', categoryLight: '#E1F5EE',
    shortDesc: 'Présence + LMS + 3 formations + quiz + émargement.',
    longDesc: 'Le Pack Digital inclut tout le Pack Présence plus une plateforme e-learning complète (LMS), 3 formations créées automatiquement à partir de vos thèmes, un système de quiz et d\'émargement.',
    price: '2 990€', oldPrice: '5 990€', time: '4 semaines',
    paymentModes: 'Comptant ou 3 x 997€', tag: 'Meilleur rapport',
    steps: [
      { title: 'Configuration', desc: 'Brief + 3 thèmes de formations + paiement' },
      { title: 'Production', desc: 'Site + LMS + 3 formations + quiz + émargement' },
      { title: 'Révision', desc: 'Livraison + aller-retour ajustements' },
      { title: 'Terminée', desc: 'Pack déployé en production' },
    ],
    includes: ['Tout le Pack Présence', 'Plateforme LMS complète', '3 formations créées (5 modules chacune)', 'Quiz + évaluations', 'Système d\'émargement', 'Expert dédié'],
    prerequisites: [], options: [],
    faq: [
      { q: 'Combien de formations sont incluses ?', a: '3 formations de 5 modules chacune. Modules supplémentaires disponibles.' },
      { q: 'Le LMS est-il personnalisable ?', a: 'Oui, aux couleurs de votre organisme avec votre logo.' },
    ],
    ctaLink: '/creer-of', ctaLabel: 'Commander',
  },
  {
    id: 'pack_premium', slug: 'service-pack-premium',
    name: 'Pack Premium',
    category: 'Packs tout-en-un', categoryColor: '#1D9E75', categoryLight: '#E1F5EE',
    shortDesc: 'Digital + 1 agent IA configuré et opérationnel.',
    longDesc: 'Le Pack Premium inclut tout le Pack Digital plus un agent IA configuré et opérationnel, capable d\'automatiser vos tâches administratives, votre prospection ou votre support client.',
    price: '4 990€', oldPrice: '8 990€', time: '5 semaines',
    paymentModes: 'Comptant ou 3 x 1 663€', tag: null,
    steps: [
      { title: 'Configuration', desc: 'Brief + thèmes + choix agent IA + paiement' },
      { title: 'Production', desc: 'Pack Digital + configuration agent IA' },
      { title: 'Révision', desc: 'Livraison + tests + ajustements' },
      { title: 'Terminée', desc: 'Pack déployé, agent IA actif' },
    ],
    includes: ['Tout le Pack Digital', '1 agent IA configuré (choix parmi 8)', 'Workflows automatisés', 'Guide d\'utilisation', 'Expert dédié'],
    prerequisites: [], options: [],
    faq: [
      { q: 'Quels agents IA sont disponibles ?', a: 'Réseaux sociaux, dossiers admin, candidats, support, apprenants, comptabilité, veille, marketing.' },
      { q: 'Puis-je changer d\'agent ?', a: 'Oui, vous pouvez reconfigurer votre agent après livraison.' },
    ],
    ctaLink: '/creer-of', ctaLabel: 'Commander',
  },
  {
    id: 'pack_enterprise', slug: 'service-pack-enterprise',
    name: 'Pack Enterprise',
    category: 'Packs tout-en-un', categoryColor: '#1D9E75', categoryLight: '#E1F5EE',
    shortDesc: 'Premium + application mobile + agents IA multiples.',
    longDesc: 'Le Pack Enterprise inclut tout le Pack Premium plus une application mobile (iOS et/ou Android) et des agents IA supplémentaires. La solution complète pour les organismes de formation ambitieux.',
    price: '7 990€', oldPrice: '14 990€', time: '6 semaines',
    paymentModes: 'Comptant ou 3 x 2 663€', tag: null,
    steps: [
      { title: 'Configuration', desc: 'Brief + thèmes + agents + app mobile + paiement' },
      { title: 'Production', desc: 'Pack Premium + app mobile + agents supplémentaires' },
      { title: 'Révision', desc: 'Livraison + tests + soumission stores' },
      { title: 'Terminée', desc: 'Pack complet déployé' },
    ],
    includes: ['Tout le Pack Premium', 'Application mobile (iOS et/ou Android)', 'Agents IA supplémentaires', 'Publication sur les stores', 'Expert dédié'],
    prerequisites: [],
    options: [
      { name: 'Agent IA supplémentaire', price: '+390€', desc: 'Par agent au-delà du 1er inclus' },
    ],
    faq: [
      { q: 'L\'app est-elle publiée sur les stores ?', a: 'Oui, nous gérons la soumission sur App Store et Google Play.' },
      { q: 'Combien d\'agents IA sont inclus ?', a: '1 agent inclus. Agents supplémentaires à 390€ chacun.' },
    ],
    ctaLink: '/creer-of', ctaLabel: 'Commander',
  },

  // ─── CATÉGORIE : Solutions digitales ───
  {
    id: 'site', slug: 'service-site',
    name: 'Site internet',
    category: 'Solutions digitales', categoryColor: '#378ADD', categoryLight: '#E6F1FB',
    shortDesc: 'Site vitrine professionnel — design responsive, mentions légales, hébergement inclus.',
    longDesc: 'Nous créons votre site vitrine professionnel : design responsive, mentions légales, hébergement inclus. Options disponibles pour blog, e-commerce et multilingue.',
    price: '990€', oldPrice: '2 490€', time: '3 semaines',
    paymentModes: 'Comptant ou 3 x 330€', tag: 'Populaire',
    steps: [
      { title: 'Configuration', desc: 'Brief + options d\'échelle + paiement' },
      { title: 'Design', desc: 'Wireframes + maquettes V1 + validation' },
      { title: 'Production', desc: 'Site staging + contenus + tests' },
      { title: 'Sécurité', desc: 'SSL + backup + accès admin' },
      { title: 'Terminée', desc: 'Site en production' },
    ],
    includes: ['Site vitrine 3-5 pages', 'Design responsive', 'Mentions légales + CGV', 'SSL + hébergement inclus', 'Accès admin', 'Expert dédié'],
    prerequisites: [],
    options: [
      { name: 'Blog + SEO', price: '+490€', desc: 'Blog intégré avec optimisation SEO' },
      { name: 'E-commerce', price: '+1 500€', desc: 'Boutique formations en ligne' },
      { name: 'Multilingue', price: '+490€', desc: '2+ langues' },
    ],
    faq: [
      { q: 'Le site est-il hébergé ?', a: 'Oui, hébergement et SSL sont inclus dans le prix.' },
      { q: 'Puis-je modifier les contenus ?', a: 'Oui, vous aurez un accès admin pour modifier textes et images.' },
      { q: 'Le site est-il responsive ?', a: 'Oui, optimisé pour mobile, tablette et desktop.' },
    ],
    ctaLink: '/creer-of', ctaLabel: 'Commander',
  },
  {
    id: 'app', slug: 'service-app',
    name: 'Application mobile',
    category: 'Solutions digitales', categoryColor: '#378ADD', categoryLight: '#E6F1FB',
    shortDesc: 'App iOS et/ou Android pour vos apprenants et formateurs.',
    longDesc: 'Nous développons votre application mobile sur mesure pour iOS et/ou Android. Vos apprenants accèdent à leurs formations, émargent, passent les quiz et suivent leur progression depuis leur smartphone.',
    price: '4 990€', oldPrice: '9 990€', time: '6 semaines',
    paymentModes: 'Comptant ou 3 x 1 663€', tag: null,
    steps: [
      { title: 'Configuration', desc: 'Brief + options + comptes développeur + paiement' },
      { title: 'Design', desc: 'Wireframes app + maquettes iOS/Android + validation' },
      { title: 'Production', desc: 'Build TestFlight + APK Android + tests' },
      { title: 'Publication', desc: 'Soumission App Store + Play Store' },
      { title: 'Terminée', desc: 'App live sur les stores' },
    ],
    includes: ['Application iOS ou Android', 'Design sur mesure', 'Accès formations et quiz', 'Émargement mobile', 'Expert dédié'],
    prerequisites: [],
    options: [
      { name: 'iOS + Android', price: '+2 000€', desc: 'Les deux plateformes' },
      { name: 'Publication stores', price: '+490€', desc: 'App Store + Google Play' },
      { name: 'Push + messagerie', price: '+990€', desc: 'Notifications et chat intégré' },
    ],
    faq: [
      { q: 'Faut-il un compte développeur Apple/Google ?', a: 'Oui, nous vous guidons pour la création (environ 99$/an pour Apple, 25$ one-time pour Google).' },
      { q: 'Combien de temps pour la publication ?', a: 'Environ 1 semaine après soumission (validation Apple/Google).' },
    ],
    ctaLink: '/creer-of', ctaLabel: 'Commander',
  },
  {
    id: 'lms', slug: 'service-lms',
    name: 'LMS — Plateforme e-learning',
    category: 'Solutions digitales', categoryColor: '#378ADD', categoryLight: '#E6F1FB',
    shortDesc: 'Plateforme e-learning complète — parcours, quiz, émargement, attestations.',
    longDesc: 'Nous développons votre plateforme LMS sur mesure : parcours pédagogiques, quiz, émargement numérique, attestations automatiques. Scalable de 50 à 500+ apprenants.',
    price: '2 900€', oldPrice: '5 900€', time: '4 semaines',
    paymentModes: 'Comptant ou 3 x 967€', tag: null,
    steps: [
      { title: 'Configuration', desc: 'Brief + options + nombre apprenants + contenus + paiement' },
      { title: 'Design', desc: 'Wireframes LMS (apprenant + admin) + maquettes' },
      { title: 'Production', desc: 'LMS staging + parcours + quiz configurés' },
      { title: 'Sécurité', desc: 'SSL + RGPD + formation admin 1h' },
      { title: 'Terminée', desc: 'LMS en production' },
    ],
    includes: ['LMS jusqu\'à 50 apprenants', 'Parcours pédagogiques', 'Quiz + évaluations', 'Émargement numérique', 'Attestations automatiques', 'Formation admin 1h', 'Expert dédié'],
    prerequisites: [],
    options: [
      { name: '50-500 apprenants', price: '+1 500€', desc: 'Montée en charge' },
      { name: '500+ apprenants', price: '+3 000€', desc: 'Version entreprise' },
      { name: 'Intégration CPF/EDOF', price: '+990€', desc: 'Connexion EDOF' },
      { name: 'App mobile apprenant', price: '+1 990€', desc: 'Application dédiée' },
    ],
    faq: [
      { q: 'Combien d\'apprenants en base ?', a: 'Jusqu\'à 50 apprenants inclus. Options pour monter à 500+.' },
      { q: 'Le LMS est-il RGPD ?', a: 'Oui, nous configurons la conformité RGPD (hébergement France/EU).' },
      { q: 'Puis-je importer mes formations existantes ?', a: 'Oui, nous pouvons importer vos contenus SCORM, PDF ou vidéos.' },
    ],
    ctaLink: '/creer-of', ctaLabel: 'Commander',
  },
  {
    id: 'agent_ia', slug: 'service-agent-ia',
    name: 'Agent IA',
    category: 'Solutions digitales', categoryColor: '#378ADD', categoryLight: '#E6F1FB',
    shortDesc: 'Automatisez vos tâches : admin, prospection, support, conformité.',
    longDesc: 'Nos agents IA automatisent vos tâches récurrentes : réseaux sociaux, dossiers administratifs, réponses aux candidats, support client, gestion apprenants, comptabilité, veille réglementaire et marketing.',
    price: '390€ / agent', oldPrice: '990€', time: '2 semaines',
    paymentModes: 'Comptant ou 2 x 195€ par agent', tag: 'Nouveau',
    steps: [
      { title: 'Configuration', desc: 'Sélection agents (parmi 8) + accès outils + paiement' },
      { title: 'RDV expert', desc: 'Compte-rendu + plan d\'action + périmètre agents' },
      { title: 'Production', desc: 'Configuration + prompts + workflows + tests' },
      { title: 'Terminée', desc: 'Agents actifs + guide d\'utilisation' },
    ],
    includes: ['Configuration agent(s) sur mesure', 'Workflows automatisés', 'Prompts optimisés', 'Tests et validation', 'Guide d\'utilisation', 'Expert IA dédié'],
    prerequisites: [],
    options: [],
    faq: [
      { q: 'Quels agents sont disponibles ?', a: 'Réseaux sociaux, dossiers admin, candidats, support, apprenants, comptabilité, veille réglementaire, marketing.' },
      { q: 'Combien d\'agents puis-je commander ?', a: 'Autant que vous le souhaitez, à 390€ par agent.' },
      { q: 'Les agents fonctionnent-ils en autonomie ?', a: 'Oui, après configuration et validation, ils fonctionnent en continu.' },
    ],
    ctaLink: '/creer-of', ctaLabel: 'Commander',
  },
];

// =====================================================================
// SVG ILLUSTRATIONS PAR CATÉGORIE
// =====================================================================
const CAT_SVG = {
  "Procédures d'ouverture": (c) => `<svg viewBox="0 0 200 200" fill="none" width="200" height="200">
    <rect x="40" y="30" width="120" height="144" rx="12" fill="${c}" opacity=".08" stroke="${c}" stroke-width="2"/>
    <rect x="56" y="48" width="88" height="8" rx="4" fill="${c}" opacity=".25"/>
    <rect x="56" y="66" width="72" height="6" rx="3" fill="${c}" opacity=".15"/>
    <rect x="56" y="82" width="80" height="6" rx="3" fill="${c}" opacity=".15"/>
    <rect x="56" y="98" width="64" height="6" rx="3" fill="${c}" opacity=".15"/>
    <circle cx="136" cy="136" r="36" fill="white" stroke="${c}" stroke-width="3"/>
    <polyline points="120,136 132,148 152,124" stroke="${c}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  "Démarches spécialisées": (c) => `<svg viewBox="0 0 200 200" fill="none" width="200" height="200">
    <path d="M100 20L30 60v60c0 44 28 70 70 80 42-10 70-36 70-80V60L100 20z" fill="${c}" opacity=".08" stroke="${c}" stroke-width="2"/>
    <path d="M100 40L50 70v50c0 36 22 56 50 64 28-8 50-28 50-64V70L100 40z" fill="white" stroke="${c}" stroke-width="1.5"/>
    <rect x="72" y="76" width="56" height="6" rx="3" fill="${c}" opacity=".2"/>
    <rect x="72" y="90" width="44" height="6" rx="3" fill="${c}" opacity=".15"/>
    <rect x="72" y="104" width="50" height="6" rx="3" fill="${c}" opacity=".15"/>
    <circle cx="100" cy="136" r="16" fill="${c}" opacity=".12"/>
    <polyline points="92,136 98,142 108,130" stroke="${c}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  "Solutions digitales": (c) => `<svg viewBox="0 0 200 200" fill="none" width="200" height="200">
    <rect x="30" y="36" width="140" height="96" rx="12" fill="${c}" opacity=".08" stroke="${c}" stroke-width="2"/>
    <rect x="30" y="36" width="140" height="24" rx="12" fill="${c}" opacity=".06"/>
    <circle cx="50" cy="48" r="4" fill="#E24B4A" opacity=".6"/>
    <circle cx="64" cy="48" r="4" fill="#FFB347" opacity=".6"/>
    <circle cx="78" cy="48" r="4" fill="#1D9E75" opacity=".6"/>
    <path d="M60 84l-16 16 16 16" stroke="${c}" stroke-width="3.5" stroke-linecap="round" opacity=".5"/>
    <path d="M140 84l16 16-16 16" stroke="${c}" stroke-width="3.5" stroke-linecap="round" opacity=".5"/>
    <path d="M110 76L90 116" stroke="${c}" stroke-width="3.5" stroke-linecap="round" opacity=".4"/>
    <rect x="76" y="144" width="48" height="8" rx="4" fill="${c}" opacity=".15"/>
    <circle cx="150" cy="140" r="28" fill="white" stroke="${c}" stroke-width="2"/>
    <path d="M140 140l6 6 12-14" stroke="${c}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  "Packs tout-en-un": (c) => `<svg viewBox="0 0 200 200" fill="none" width="200" height="200">
    <rect x="44" y="60" width="112" height="96" rx="10" fill="${c}" opacity=".08" stroke="${c}" stroke-width="2"/>
    <rect x="44" y="60" width="112" height="20" rx="10" fill="${c}" opacity=".1"/>
    <rect x="76" y="44" width="48" height="24" rx="6" fill="white" stroke="${c}" stroke-width="2"/>
    <rect x="60" y="96" width="80" height="6" rx="3" fill="${c}" opacity=".15"/>
    <rect x="60" y="110" width="64" height="6" rx="3" fill="${c}" opacity=".12"/>
    <rect x="60" y="124" width="72" height="6" rx="3" fill="${c}" opacity=".1"/>
    <circle cx="140" cy="140" r="24" fill="${c}"/>
    <path d="M132 140l6 6 10-12" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
};

// =====================================================================
// HTML TEMPLATE
// =====================================================================

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function generatePage(svc) {
  const c = svc.categoryColor;
  const cl = svc.categoryLight;
  const svgFn = CAT_SVG[svc.category] || CAT_SVG["Procédures d'ouverture"];
  const heroSvg = svgFn(c);

  const stepsHtml = svc.steps.map((s, i) => `
      <div class="sp-step" style="animation:fadeUp .4s ${(0.1*i).toFixed(2)}s both">
        <div class="sp-step-num" style="background:${esc(c)}">${i+1}</div>
        <div>
          <div class="sp-step-title">${esc(s.title)}</div>
          <div class="sp-step-desc">${esc(s.desc)}</div>
        </div>
      </div>`).join('\n');

  const includesHtml = svc.includes.map(i => `
      <div class="sp-incl-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="#1D9E75" stroke-width="2.5" width="18" height="18"><polyline points="6,12 10,16 18,8"/></svg>
        <span>${esc(i)}</span>
      </div>`).join('\n');

  const prereqHtml = svc.prerequisites.length ? `
    <section class="sp-section">
      <h2>Prérequis</h2>
      <div class="sp-prereqs">
        ${svc.prerequisites.map(p => `<span class="sp-prereq">${esc(p)}</span>`).join('\n        ')}
      </div>
    </section>` : '';

  const optionsHtml = svc.options.length ? `
    <section class="sp-section">
      <h2>Options disponibles</h2>
      <div class="sp-options">
        ${svc.options.map(o => `
        <div class="sp-option">
          <div class="sp-opt-info"><span class="sp-opt-name">${esc(o.name)}</span><span class="sp-opt-desc">${esc(o.desc)}</span></div>
          <span class="sp-opt-price" style="color:${esc(c)}">${esc(o.price)}</span>
        </div>`).join('\n')}
      </div>
    </section>` : '';

  const faqHtml = svc.faq.map((f, i) => `
      <div class="sp-faq-item" onclick="this.classList.toggle('open')">
        <div class="sp-faq-q">
          <span>${esc(f.q)}</span>
          <svg class="sp-faq-chevron" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" width="18" height="18"><polyline points="6,9 12,15 18,9"/></svg>
        </div>
        <div class="sp-faq-a">${esc(f.a)}</div>
      </div>`).join('\n');

  const tagHtml = svc.tag ? `<span class="sp-hero-tag" style="background:${esc(c)}">${esc(svc.tag)}</span>` : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta http-equiv="Content-Security-Policy" content="default-src 'self' https:; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://www.googletagmanager.com https://www.google-analytics.com https://bxijjjbxsevnudienvbv.supabase.co https://webhook.lesformateurs.online https://*.cal.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https://bxijjjbxsevnudienvbv.supabase.co https://recherche-entreprises.api.gouv.fr https://dgefp.opendatasoft.com https://opendata.caissedesdepots.fr https://webhook.lesformateurs.online https://generativelanguage.googleapis.com https://*.google-analytics.com;">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-B6XVYRVT9D"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-B6XVYRVT9D');</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<title>${esc(svc.name)} — lesformateurs.online</title>
<meta name="description" content="${esc(svc.shortDesc)}">
<link rel="canonical" href="https://lesformateurs.online/${esc(svc.slug)}">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/mono-light.css">
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',-apple-system,sans-serif;color:#1a1a1a;background:#FAFAFA;}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
/* Breadcrumb */
.sp-bread{max-width:960px;margin:0 auto;padding:16px 24px;font-size:12px;color:#9CA3AF;}
.sp-bread a{color:#6B7280;text-decoration:none;}
.sp-bread a:hover{color:#1a1a1a;}
/* Hero split */
.sp-hero{display:grid;grid-template-columns:1fr 1fr;max-width:960px;margin:0 auto;padding:0 24px 48px;gap:40px;align-items:center;}
.sp-hero-left{animation:fadeUp .5s both;}
.sp-hero-tag{display:inline-block;color:#fff;font-size:10px;font-weight:700;padding:4px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px;}
.sp-hero-cat{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;}
.sp-hero-left h1{font-size:34px;font-weight:800;line-height:1.1;letter-spacing:-.5px;margin-bottom:14px;}
.sp-hero-left>p{font-size:14px;color:#6B7280;line-height:1.6;margin-bottom:24px;}
.sp-prices{display:flex;align-items:baseline;gap:10px;margin-bottom:6px;}
.sp-old-price{font-size:16px;color:#9CA3AF;text-decoration:line-through;}
.sp-new-price{font-size:36px;font-weight:800;}
.sp-payment{font-size:12px;color:#9CA3AF;margin-bottom:6px;}
.sp-time{font-size:12px;color:#6B7280;display:flex;align-items:center;gap:4px;margin-bottom:24px;}
.sp-ctas{display:flex;gap:12px;}
.sp-ctas a{padding:14px 28px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;font-family:inherit;transition:all .15s;}
.sp-cta-main{color:#fff;}
.sp-cta-main:hover{transform:scale(1.03);}
.sp-cta-sec{background:#fff;color:#1a1a1a;border:1px solid #E5E7EB;}
.sp-hero-right{display:flex;align-items:center;justify-content:center;animation:fadeUp .5s .15s both;}
/* Sections */
.sp-section{max-width:960px;margin:0 auto;padding:48px 24px;}
.sp-section h2{font-size:24px;font-weight:800;margin-bottom:24px;letter-spacing:-.3px;}
/* Steps */
.sp-steps{display:flex;flex-direction:column;gap:14px;}
.sp-step{display:flex;gap:16px;align-items:flex-start;background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:18px 20px;}
.sp-step-num{width:32px;height:32px;border-radius:50%;color:#fff;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.sp-step-title{font-size:15px;font-weight:700;margin-bottom:4px;}
.sp-step-desc{font-size:13px;color:#6B7280;line-height:1.5;}
/* Includes */
.sp-incl-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.sp-incl-item{display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.5;}
.sp-incl-item svg{flex-shrink:0;margin-top:2px;}
/* Prerequisites */
.sp-prereqs{display:flex;gap:8px;flex-wrap:wrap;}
.sp-prereq{background:#FEF3C7;color:#92400E;font-size:12px;font-weight:600;padding:6px 14px;border-radius:20px;}
/* Options */
.sp-options{display:flex;flex-direction:column;gap:10px;}
.sp-option{display:flex;justify-content:space-between;align-items:center;background:#fff;border:1px solid #E5E7EB;border-radius:10px;padding:14px 18px;}
.sp-opt-name{font-size:14px;font-weight:600;display:block;}
.sp-opt-desc{font-size:12px;color:#9CA3AF;}
.sp-opt-price{font-size:16px;font-weight:800;flex-shrink:0;}
/* FAQ */
.sp-faq{display:flex;flex-direction:column;gap:8px;}
.sp-faq-item{background:#fff;border:1px solid #E5E7EB;border-radius:10px;overflow:hidden;cursor:pointer;}
.sp-faq-q{display:flex;justify-content:space-between;align-items:center;padding:16px 18px;font-size:14px;font-weight:600;}
.sp-faq-chevron{transition:transform .2s;flex-shrink:0;}
.sp-faq-item.open .sp-faq-chevron{transform:rotate(180deg);}
.sp-faq-a{padding:0 18px;max-height:0;overflow:hidden;font-size:13px;color:#6B7280;line-height:1.6;transition:all .2s;}
.sp-faq-item.open .sp-faq-a{max-height:200px;padding:0 18px 16px;}
/* CTA final */
.sp-cta-final{background:linear-gradient(135deg,#1a1a1a,#2D1810);color:#fff;text-align:center;padding:52px 24px;margin-top:24px;}
.sp-cta-final h2{font-size:26px;font-weight:800;margin-bottom:10px;color:#fff;}
.sp-cta-final>p{color:#9CA3AF;font-size:13px;max-width:420px;margin:0 auto 28px;line-height:1.6;}
.sp-cta-final .sp-ctas{justify-content:center;}
.sp-cta-final .sp-cta-sec{border-color:rgba(255,255,255,.2);color:#fff;background:transparent;}
/* Footer */
.sp-footer{background:#1a1a1a;color:#999;padding:40px 24px 20px;font-size:12px;}
.sp-footer-inner{max-width:960px;margin:0 auto;display:flex;justify-content:space-between;flex-wrap:wrap;gap:30px;}
.sp-footer-brand{font-size:17px;font-weight:700;color:#fff;margin-bottom:8px;}
.sp-footer-brand .accent{color:#D85A30;}
.sp-footer-col{display:flex;flex-direction:column;gap:6px;}
.sp-footer-col h4{color:#fff;font-size:12px;margin-bottom:4px;}
.sp-footer-col a{color:#999;text-decoration:none;font-size:12px;}
.sp-footer-col a:hover{color:#fff;}
.sp-footer-bottom{max-width:960px;margin:20px auto 0;padding-top:16px;border-top:1px solid #333;font-size:11px;text-align:center;}
/* Responsive */
@media(max-width:768px){
  .sp-hero{grid-template-columns:1fr;text-align:center;}
  .sp-hero-right{order:-1;}
  .sp-hero-right svg{width:120px !important;height:120px !important;}
  .sp-hero-left h1{font-size:26px;}
  .sp-ctas{flex-direction:column;align-items:center;}
  .sp-prices{justify-content:center;}
  .sp-time{justify-content:center;}
  .sp-incl-grid{grid-template-columns:1fr;}
  .sp-footer-inner{flex-direction:column;}
}
</style>
</head>
<body>

<nav class="ml-nav">
  <a href="index.html" class="ml-logo">les<span class="accent">formateurs</span>.online</a>
  <div class="ml-nav-links" id="navLinks">
    <a href="formation.html">Services</a>
    <a href="creer-of.html">Cr&eacute;er mon OF</a>
    <a href="creer-certifier.html">Cr&eacute;er / Certifier</a>
    <a href="se-former.html">Se former</a>
    <a href="devenir-expert.html" style="color:#D85A30;font-weight:600;">Recrutement</a>
    <a href="#" class="ml-nav-cta btn-login" onclick="openAuthModal();return false;" style="background:#FF8C42;color:#fff;">Connexion</a>
    <a href="dashboard.html" class="ml-nav-cta btn-dashboard hidden">Mon espace</a>
  </div>
  <button class="ml-burger" onclick="document.getElementById('navLinks').classList.toggle('open')"><span></span><span></span><span></span></button>
</nav>

<!-- Breadcrumb -->
<div class="sp-bread">
  <a href="formation.html">Services</a> &rsaquo; <a href="formation.html">${esc(svc.category)}</a> &rsaquo; ${esc(svc.name)}
</div>

<!-- Hero -->
<div class="sp-hero">
  <div class="sp-hero-left">
    ${tagHtml}
    <div class="sp-hero-cat" style="color:${esc(c)}">${esc(svc.category)}</div>
    <h1>${esc(svc.name)}</h1>
    <p>${esc(svc.longDesc)}</p>
    <div class="sp-prices">
      <span class="sp-old-price">${esc(svc.oldPrice)}</span>
      <span class="sp-new-price" style="color:${esc(c)}">${esc(svc.price)}</span>
    </div>
    <div class="sp-payment">${esc(svc.paymentModes)}</div>
    <div class="sp-time">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#9CA3AF" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><polyline points="8,5 8,8 10,9.5"/></svg>
      ${esc(svc.time)}
    </div>
    <div class="sp-ctas">
      <a href="${esc(svc.ctaLink)}" class="sp-cta-main" style="background:${esc(c)}">${esc(svc.ctaLabel)}</a>
      <a href="formation.html" class="sp-cta-sec">Tous les services</a>
    </div>
  </div>
  <div class="sp-hero-right">
    ${heroSvg}
  </div>
</div>

<!-- Steps -->
<section class="sp-section" style="background:#fff;border-top:1px solid #F3F4F6;">
  <h2>Le processus en ${svc.steps.length} &eacute;tapes</h2>
  <div class="sp-steps">
    ${stepsHtml}
  </div>
</section>

<!-- Includes -->
<section class="sp-section">
  <h2>Ce qui est inclus</h2>
  <div class="sp-incl-grid">
    ${includesHtml}
  </div>
</section>

${prereqHtml}
${optionsHtml}

<!-- FAQ -->
<section class="sp-section" style="background:#fff;border-top:1px solid #F3F4F6;">
  <h2>Questions fr&eacute;quentes</h2>
  <div class="sp-faq">
    ${faqHtml}
  </div>
</section>

<!-- CTA Final -->
<section class="sp-cta-final">
  <h2>Pr&ecirc;t &agrave; lancer cette d&eacute;marche ?</h2>
  <p>Paiement s&eacute;curis&eacute;, expert d&eacute;di&eacute;, r&eacute;sultat garanti. ${esc(svc.paymentModes)}.</p>
  <div class="sp-ctas">
    <a href="${esc(svc.ctaLink)}" class="sp-cta-main" style="background:${esc(c)}">${esc(svc.ctaLabel)}</a>
    <a href="formation.html" class="sp-cta-sec">Voir tous les services</a>
  </div>
</section>

<footer class="sp-footer">
  <div class="sp-footer-inner">
    <div>
      <div class="sp-footer-brand">les<span class="accent">formateurs</span>.online</div>
      <p>La plateforme des professionnels de la formation.</p>
      <p style="font-size:11px;color:#666;margin-top:4px;">Experience Prod SASU &middot; SIREN 982 828 774</p>
    </div>
    <div class="sp-footer-col"><h4>Services</h4><a href="formation.html">Services</a><a href="creer-of.html">Cr&eacute;er mon OF</a><a href="se-former.html">Se former</a></div>
    <div class="sp-footer-col"><h4>L&eacute;gal</h4><a href="mentions-legales.html">Mentions l&eacute;gales</a><a href="cgv.html">CGV</a><a href="politique-confidentialite.html">Confidentialit&eacute;</a></div>
  </div>
  <div class="sp-footer-bottom">&copy; 2026 lesformateurs.online</div>
</footer>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
<script src="js/supabase-config.js"></script>
<script src="js/auth-modal.js"></script>
<script>
(async function(){
  try {
    var sb = window.__lfoSupabase; if(!sb) return;
    var r = await sb.auth.getUser();
    if(r.data && r.data.user){
      var l=document.querySelector('.btn-login'),d=document.querySelector('.btn-dashboard');
      if(l)l.classList.add('hidden');if(d)d.classList.remove('hidden');
    }
  } catch(e){}
})();
</script>
</body>
</html>`;
}

// =====================================================================
// GENERATE ALL PAGES
// =====================================================================

console.log('Generating 22 service pages...\n');

SERVICES.forEach(svc => {
  const html = generatePage(svc);
  const filename = svc.slug + '.html';
  fs.writeFileSync(filename, html, 'utf8');
  console.log(`  ${filename} (${svc.name})`);
});

console.log(`\nDone! ${SERVICES.length} pages generated.`);
