/**
 * LFO — Constantes des 22 démarches
 * Version: 1.0 — 17/04/2026
 * Usage: import { DEMARCHES, PAYMENT_RULES, helpers } from './lfo-demarches-constants.js'
 */

// ============================================================
// CATÉGORIES
// ============================================================
export const CATEGORIES = {
  DEMARRER: { id: 'demarrer', label: 'Démarrer mon activité', color: '#10B981', icon: '🟢' },
  NICHE:    { id: 'niche', label: 'Niches spécialisées', color: '#F59E0B', icon: '🟡' },
  PACK:     { id: 'pack', label: 'Packs', color: '#3B82F6', icon: '🔵' },
  DEV:      { id: 'dev', label: 'Développer mon organisme', color: '#8B5CF6', icon: '🟣' },
};

// ============================================================
// RÈGLES DE PAIEMENT
// ============================================================
export const PAYMENT_RULES = {
  // Détermine le mode max disponible selon le prix
  getMaxInstallments(price) {
    if (price < 200) return 1;            // Comptant uniquement
    if (price <= 500) return 2;           // Comptant ou 2×
    return 3;                             // Comptant ou 3×
  },

  // Calcule l'échéancier
  computeInstallments(price, mode) {
    if (mode === 1 || mode === 'comptant') return [price];
    const tranche = Math.ceil(price / mode);
    const last = price - tranche * (mode - 1);
    return Array.from({ length: mode - 1 }, () => tranche).concat(last);
  },

  // Centre certifié = toujours 3×
  FORCED_3X: ['centre_certifie'],
};

// ============================================================
// LES 22 DÉMARCHES
// ============================================================
export const DEMARCHES = {

  // ---------- 🟢 DÉMARRER MON ACTIVITÉ (7) ----------

  nda: {
    id: 'nda',
    name: 'NDA — Numéro de Déclaration d\'Activité',
    category: 'demarrer',
    basePrice: 290,
    steps: ['Configuration', 'Constitution dossier', 'Dépôt DREETS', 'Terminée'],
    docs: ['Kbis (< 3 mois)', 'RIB'],
    options: [
      { id: 'formateur_lfo', label: 'Formateur LFO', price: 220 },
    ],
    chatbotIA: true,
    requiresOrg: true,
  },

  creation_of: {
    id: 'creation_of',
    name: 'Création OF',
    category: 'demarrer',
    basePrice: 1490,
    steps: ['Configuration', 'Rédaction statuts', 'Dépôt capital', 'Greffe', 'Configuration administrative', 'Terminée'],
    docs: ['CNI dirigeant', 'Projet de statuts (ou demande LFO)'],
    options: [
      { id: 'bilan_competences', label: 'Bilan de compétences', price: 490 },
      { id: 'vae', label: 'VAE', price: 490 },
      { id: 'formateur_lfo', label: 'Formateur LFO', price: 220 },
      { id: 'kbis_existant', label: 'Kbis déjà existant (-100€)', price: -100 },
    ],
    chatbotIA: false,
    requiresOrg: false, // C'est elle qui crée l'organisme
  },

  creation_formation: {
    id: 'creation_formation',
    name: 'Création formation',
    category: 'demarrer',
    basePrice: 990,
    steps: ['Configuration', 'Programme', 'Production supports', 'Validation client', 'Terminée'],
    docs: ['Brief thématique'],
    options: [
      { id: 'module_sup', label: 'Module supplémentaire', price: 290, repeatable: true },
      { id: 'video_pro', label: 'Vidéo professionnelle', price: 8000 },
      { id: 'formateur_lfo', label: 'Formateur LFO', price: 220 },
    ],
    chatbotIA: false,
    requiresOrg: true,
    inclus: '5 modules : programme + slides + quiz + évaluation finale + vidéos basiques + fiche formateur',
  },

  edof: {
    id: 'edof',
    name: 'EDOF — Mon Compte Formation',
    category: 'demarrer',
    basePrice: 490,
    steps: ['Configuration', 'Préparation dossier', 'Dépôt EDOF', 'Webinaire CDC', 'Terminée'],
    docs: ['Qualiopi', 'NDA', 'CNI dirigeant', 'Kbis', 'RIB', 'Contrat médiateur', 'Casier B3', 'Déclaration non-condamnation'],
    options: [
      { id: 'formateur_sup', label: 'Formateur supplémentaire', price: 190, repeatable: true },
      { id: 'site_internet', label: 'Site internet vitrine', price: 990 },
    ],
    chatbotIA: true,
    requiresOrg: true,
    prerequisites: ['qualiopi', 'nda'],
  },

  qualiopi: {
    id: 'qualiopi',
    name: 'Qualiopi',
    category: 'demarrer',
    basePrice: 990,
    steps: ['Configuration', 'Préparation 32 indicateurs', 'Audit certificateur', 'Terminée'],
    docs: ['NDA', 'Tous documents existants OF'],
    options: [
      { id: 'referent_audit', label: 'Référent jour d\'audit', price: 490 },
      { id: 'formateur_lfo', label: 'Formateur LFO', price: 220 },
    ],
    chatbotIA: true,
    requiresOrg: true,
  },

  opco: {
    id: 'opco',
    name: 'OPCO',
    category: 'demarrer',
    basePrice: 290, // par OPCO sélectionné
    pricePerUnit: true,
    unitLabel: 'OPCO',
    steps: ['Configuration', 'Dépôt par OPCO', 'Terminée'],
    docs: ['Kbis', 'NDA'],
    options: [
      { id: 'formateur_lfo', label: 'Formateur LFO', price: 220 },
    ],
    opcosList: [
      'Akto', 'Atlas', 'Constructys', 'Afdas', 'OPCO 2i', 'OPCO EP',
      'OPCO Mobilités', 'OPCO Santé', 'OPCO Cohésion sociale', 'Ocapiat', 'Uniformation'
    ],
    chatbotIA: false,
    requiresOrg: true,
    accompagnement: true,
  },

  france_travail: {
    id: 'france_travail',
    name: 'France Travail (KAIROS)',
    category: 'demarrer',
    basePrice: 290,
    steps: ['Configuration', 'Référencement KAIROS', 'Terminée'],
    docs: ['Kbis', 'NDA', 'Liste formations'],
    options: [
      { id: 'formateur_lfo', label: 'Formateur LFO', price: 220 },
    ],
    chatbotIA: false,
    requiresOrg: true,
    suggestions: ['creation_formation'], // si pas de formations
    accompagnement: true,
  },

  // ---------- 🟡 NICHES SPÉCIALISÉES (7) ----------

  controle: {
    id: 'controle',
    name: 'Contrôle DREETS',
    category: 'niche',
    basePrice: 890,
    steps: ['Configuration', 'RDV expert + diagnostic', 'Conformité', 'Terminée'],
    modes: ['reactif', 'anticipe'],
    docs: ['Courrier DREETS (si réactif)', 'BPF', 'Conventions', 'CGV', 'CV formateurs'],
    options: [
      { id: 'formateur_lfo', label: 'Formateur LFO', price: 220 },
    ],
    chatbotIA: false,
    requiresOrg: true,
    accompagnement: true,
  },

  uai: {
    id: 'uai',
    name: 'UAI — Unité Administrative Immatriculée',
    category: 'niche',
    basePrice: 149,
    forcedComptant: true, // pas de paiement échelonné
    steps: ['Configuration', 'Dépôt rectorat', 'Terminée'],
    docs: ['Sélection organisme', 'Sélection formations RS/RNCP'],
    options: [],
    chatbotIA: true,
    requiresOrg: true,
    accompagnement: true,
  },

  centre_examen: {
    id: 'centre_examen',
    name: 'Centre d\'examen',
    category: 'niche',
    basePrice: 1990,
    steps: ['Configuration', 'Audit des locaux', 'Dépôt dossier', 'Inspection terrain', 'Terminée'],
    docs: ['Qualiopi', 'Plans locaux PMR', 'Assurance RC pro'],
    options: [
      { id: 'expert_inspection', label: 'Expert présent inspection', price: 490 },
      { id: 'formateur_lfo', label: 'Formateur LFO', price: 220 },
    ],
    chatbotIA: true,
    requiresOrg: true,
    prerequisites: ['qualiopi'],
    accompagnement: true,
    formationSelectionMode: '3-modes', // Recherche / RS-RNCP / Domaine
  },

  agrement_prefectoral: {
    id: 'agrement_prefectoral',
    name: 'Agrément préfectoral',
    category: 'niche',
    basePrice: 690,
    steps: ['Configuration', 'Dépôt dossier', 'Inspection préfectorale', 'Terminée'],
    docs: ['Casier B3', 'CV formateurs habilités'],
    options: [
      { id: 'formateurs_specifiques', label: 'Formateurs spécifiques LFO (auto-école/SSIAP/CACES/électriques)', price: 450 },
      { id: 'expert_inspection', label: 'Expert présent inspection préfectorale', price: 490 },
    ],
    conditionalSteps: [
      { stepIndex: 2, condition: 'inspection_demandee_par_prefecture', defaultLabel: 'Inspection préfectorale', skippedLabel: 'Inspection non requise ✓' },
    ],
    chatbotIA: true,
    requiresOrg: true,
    accompagnement: true,
    formationSelectionMode: '3-modes',
  },

  formation_elus: {
    id: 'formation_elus',
    name: 'Formation élus',
    category: 'niche',
    basePrice: 1500,
    steps: ['Configuration', 'Préparation dossier', 'Dépôt préfecture', 'Commission CNFEL', 'Terminée'],
    docs: ['Bilans CAC 2 derniers exercices', 'CV équipe', 'BPF', 'Choix thèmes officiels'],
    options: [
      { id: 'formateur_lfo', label: 'Formateur LFO', price: 220 },
    ],
    chatbotIA: true,
    requiresOrg: true,
    prerequisites: ['qualiopi', 'nda'],
    accompagnement: true,
    notes: 'Validité agrément: 2 ans premier / 4 ans renouvellement. Séances CNFEL tous les 2 mois.',
  },

  habilitation: {
    id: 'habilitation',
    name: 'Habilitation',
    category: 'niche',
    basePrice: 490, // paiement initial pour analyse
    steps: ['Configuration', 'Analyse + recherche', 'Paiement complémentaire', 'Constitution dossier', 'Terminée'],
    docs: ['Qualiopi', 'CV formateurs', 'Expérience OF'],
    options: [
      { id: 'formateur_lfo', label: 'Formateur LFO', price: 220 },
    ],
    conditionalSteps: [
      { stepIndex: 2, condition: 'devis_complementaire_emis', defaultLabel: 'Paiement complémentaire', skippedLabel: 'Aucun complément ✓' },
    ],
    chatbotIA: true,
    requiresOrg: true,
    prerequisites: ['qualiopi'],
    accompagnement: true,
    formationSelectionMode: '3-modes',
  },

  centre_certifie: {
    id: 'centre_certifie',
    name: 'Centre certifié (devenir certificateur)',
    category: 'niche',
    basePrice: 5990,
    forced3x: true, // Toujours 3×
    steps: ['Configuration', 'Cadrage certification', 'Constitution dossier', 'Dépôt France Compétences', 'Commission + Terminée'],
    docs: ['Sélection organisme (auto-détecte NDA + Qualiopi)'],
    pricingGrid: {
      type: { rs: 0, rncp: 0 }, // base
      rncpLevel: { '3-4': 1500, '5-6': 3000, '7-8': 6000 },
      regulatedSector: 2000, // +2000€ si secteur réglementé
      renewal: -0.30, // -30%
    },
    regulatedSectors: ['Santé', 'Droit', 'Sport', 'Transport', 'Sécurité privée', 'Finance'],
    chatbotIA: true,
    requiresOrg: true,
    prerequisites: ['qualiopi'],
    accompagnement: true,
    dynamicPricing: true,
  },

  // ---------- 🔵 PACKS (4) ----------

  pack_presence: {
    id: 'pack_presence',
    name: 'Pack Présence',
    category: 'pack',
    basePrice: 990,
    steps: ['Configuration', 'Production', 'Révision', 'Terminée'],
    contains: ['Site vitrine', 'Documents légaux (CGV, CGU, RGPD, mentions)', 'Livret d\'accueil'],
    requiresOrg: false, // créé en parallèle si manquant
    accompagnement: true,
  },

  pack_digital: {
    id: 'pack_digital',
    name: 'Pack Digital',
    category: 'pack',
    basePrice: 2990,
    steps: ['Configuration', 'Production', 'Révision', 'Terminée'],
    contains: ['Pack Présence', 'LMS', '3× Création formation', 'Quizz', 'Émargement'],
    childrenCreated: [
      { type: 'creation_formation', count: 3 },
    ],
    requiresOrg: false,
    accompagnement: true,
  },

  pack_premium: {
    id: 'pack_premium',
    name: 'Pack Premium',
    category: 'pack',
    basePrice: 4990,
    steps: ['Configuration', 'Production', 'Révision', 'Terminée'],
    contains: ['Pack Digital', '1 agent IA'],
    childrenCreated: [
      { type: 'creation_formation', count: 3 },
      { type: 'agent_ia', count: 1 },
    ],
    requiresOrg: false,
    accompagnement: true,
  },

  pack_enterprise: {
    id: 'pack_enterprise',
    name: 'Pack Enterprise',
    category: 'pack',
    basePrice: 7990,
    steps: ['Configuration', 'Production', 'Révision', 'Terminée'],
    contains: ['Pack Premium', 'App mobile', 'Agents IA supplémentaires'],
    childrenCreated: [
      { type: 'creation_formation', count: 3 },
      { type: 'agent_ia', count: 1 },
      { type: 'app_mobile', count: 1 },
    ],
    options: [
      { id: 'agent_sup', label: 'Agent IA supplémentaire', price: 390, repeatable: true },
    ],
    requiresOrg: false,
    accompagnement: true,
  },

  // ---------- 🟣 DÉVELOPPER MON ORGANISME (4) ----------

  site_internet: {
    id: 'site_internet',
    name: 'Site internet',
    category: 'dev',
    basePrice: 990,
    steps: ['Configuration', 'Design', 'Production', 'Sécurité', 'Terminée'],
    options: [
      { id: 'blog_seo', label: 'Blog + SEO', price: 490 },
      { id: 'ecommerce', label: 'E-commerce (boutique formations)', price: 1500 },
      { id: 'multilingue', label: 'Multilingue (2+ langues)', price: 490 },
    ],
    requiresOrg: false,
    accompagnement: true,
    dynamicPricing: true,
  },

  app_mobile: {
    id: 'app_mobile',
    name: 'Application mobile',
    category: 'dev',
    basePrice: 4990,
    steps: ['Configuration', 'Design', 'Production', 'Sécurité', 'Terminée'],
    inclus: 'iOS OU Android (1 plateforme)',
    options: [
      { id: 'ios_android', label: 'iOS + Android (les deux)', price: 2000 },
      { id: 'publication_stores', label: 'Publication stores (App Store + Play Store)', price: 490 },
      { id: 'push_messagerie', label: 'Notifications push + messagerie', price: 990 },
    ],
    requiresOrg: false,
    accompagnement: true,
    dynamicPricing: true,
  },

  lms: {
    id: 'lms',
    name: 'LMS — Plateforme e-learning',
    category: 'dev',
    basePrice: 2900,
    steps: ['Configuration', 'Design', 'Production', 'Sécurité', 'Terminée'],
    inclus: 'Jusqu\'à 50 apprenants',
    options: [
      { id: 'apprenants_50_500', label: '50-500 apprenants', price: 1500 },
      { id: 'apprenants_500_plus', label: '500+ apprenants (entreprise)', price: 3000 },
      { id: 'integration_cpf_edof', label: 'Intégration CPF / EDOF', price: 990 },
      { id: 'app_mobile_apprenant', label: 'App mobile apprenant', price: 1990 },
    ],
    requiresOrg: false,
    accompagnement: true,
    dynamicPricing: true,
  },

  agent_ia: {
    id: 'agent_ia',
    name: 'Agent IA',
    category: 'dev',
    basePrice: 390, // par agent
    pricePerUnit: true,
    unitLabel: 'agent',
    steps: ['Configuration', 'RDV expert', 'Production', 'Terminée'],
    agentsList: [
      { id: 'reseaux_sociaux', label: 'Réseaux sociaux' },
      { id: 'dossiers_admin', label: 'Dossiers administratifs' },
      { id: 'candidats', label: 'Candidats / inscriptions' },
      { id: 'support', label: 'Support apprenants' },
      { id: 'pedagogique', label: 'Suivi pédagogique' },
      { id: 'comptabilite', label: 'Comptabilité' },
      { id: 'veille', label: 'Veille (RNCP, RS, OPCO, etc.)' },
      { id: 'marketing', label: 'Marketing / acquisition' },
    ],
    requiresOrg: false,
    accompagnement: true,
  },
};

// ============================================================
// CROSS-SELLS BLOQUANTS (prérequis)
// ============================================================
export const BLOCKING_CROSSSELLS = {
  formation_elus: ['qualiopi', 'nda'],
  centre_examen: ['qualiopi'],
  centre_certifie: ['qualiopi'],
  habilitation: ['qualiopi'],
  edof: ['qualiopi', 'nda'],
};

// ============================================================
// CROSS-SELLS SUGGESTIONS (non bloquants)
// ============================================================
export const SUGGESTION_CROSSSELLS = {
  france_travail: { if_no: 'formations', suggest: 'creation_formation' },
  edof: { suggest: 'site_internet' },
};

// ============================================================
// HELPERS
// ============================================================
export const helpers = {
  /**
   * Calcule le prix total d'une démarche selon les options sélectionnées
   * @param {string} demarcheId
   * @param {string[]} selectedOptionIds
   * @param {object} dynamicConfig - pour Centre certifié, Site, App, LMS
   * @returns {number}
   */
  calculatePrice(demarcheId, selectedOptionIds = [], dynamicConfig = {}) {
    const d = DEMARCHES[demarcheId];
    if (!d) return 0;

    let total = d.basePrice;

    // Options classiques
    (d.options || []).forEach(opt => {
      if (selectedOptionIds.includes(opt.id)) {
        total += opt.price;
      }
    });

    // Multiplicateur OPCO ou Agent IA
    if (d.pricePerUnit && dynamicConfig.unitCount) {
      total = d.basePrice * dynamicConfig.unitCount;
    }

    // Centre certifié — grille dynamique
    if (demarcheId === 'centre_certifie') {
      total = d.basePrice;
      if (dynamicConfig.type === 'rncp' && dynamicConfig.rncpLevel) {
        total += d.pricingGrid.rncpLevel[dynamicConfig.rncpLevel] || 0;
      }
      if (dynamicConfig.regulatedSector) total += d.pricingGrid.regulatedSector;
      if (dynamicConfig.renewal) total *= (1 + d.pricingGrid.renewal); // -30%
    }

    return Math.round(total);
  },

  /**
   * Renvoie les modes de paiement disponibles pour une démarche
   * @returns {Array<{mode: string, installments: number}>}
   */
  getAvailablePaymentModes(demarcheId, totalPrice) {
    const d = DEMARCHES[demarcheId];
    const modes = [{ mode: 'comptant', installments: 1 }];

    if (d.forcedComptant) return modes;
    if (d.forced3x) return [{ mode: '3x', installments: 3 }];

    const max = PAYMENT_RULES.getMaxInstallments(totalPrice);
    if (max >= 2) modes.push({ mode: '2x', installments: 2 });
    if (max >= 3) modes.push({ mode: '3x', installments: 3 });

    return modes;
  },

  /**
   * Renvoie les cross-sells bloquants manquants pour une démarche
   * @returns {string[]} liste des prérequis manquants
   */
  getMissingPrerequisites(demarcheId, userOrgBadges = []) {
    const required = BLOCKING_CROSSSELLS[demarcheId] || [];
    return required.filter(req => !userOrgBadges.includes(req));
  },

  /**
   * Détermine si une démarche utilise le chatbot IA
   */
  usesChatbotIA(demarcheId) {
    return DEMARCHES[demarcheId]?.chatbotIA || false;
  },

  /**
   * Liste des démarches enfants à créer pour un Pack
   */
  getChildrenToCreate(demarcheId) {
    return DEMARCHES[demarcheId]?.childrenCreated || [];
  },
};

// ============================================================
// EXPORT DEFAULT
// ============================================================
export default {
  CATEGORIES,
  DEMARCHES,
  PAYMENT_RULES,
  BLOCKING_CROSSSELLS,
  SUGGESTION_CROSSSELLS,
  helpers,
};
