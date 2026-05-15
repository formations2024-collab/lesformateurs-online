/**
 * EDOF Form Help Data — contextual tips, stats, examples for each section
 * Loaded by monaccesedof.html in step-1 (Formulaire)
 */
window.EDOF_HELP = {

  // ═══ MEDIATEURS ═══
  mediateurs: {
    intro: "Depuis 2016, tout professionnel vendant à des particuliers doit désigner un médiateur de la consommation (article L612-1 du Code de la consommation). La Caisse des Dépôts l'exige dans le formulaire EDOF.",
    liste: [
      { nom: "CM2C", prix: "48€ TTC / 3 ans", mediation: "36 à 284€ par médiation", url: "https://www.cm2c.net", note: "Le moins cher du marché" },
      { nom: "CNPM Médiation", prix: "180€ TTC / 3 ans", mediation: "72€ par médiation", url: "https://www.cnpm-mediation-consommation.eu", note: "Le plus utilisé par les OF" },
      { nom: "Médiation Conso Dev", prix: "96€ TTC / 3 ans", mediation: "Variable", url: "https://www.medconsodev.eu", note: "Bon rapport qualité/prix" },
      { nom: "ANM Consommation", prix: "Sur devis", mediation: "Sur devis", url: "https://www.anm-conso.com", note: "Association Nationale des Médiateurs" },
      { nom: "SMP", prix: "30€ TTC / 3 ans", mediation: "180 à 420€ par médiation", url: "https://www.mediateurs-consommation.fr", note: "Adhésion la moins chère" },
    ],
    conseil: "La plupart des OF choisissent le CNPM ou le CM2C. Souscrivez AVANT de remplir le formulaire EDOF — vous aurez besoin du nom et de l'URL du médiateur."
  },

  // ═══ SOUS-TRAITANCE ═══
  soustraitance: {
    regles: [
      "Depuis le 1er avril 2024, le recours à la sous-traitance CPF est encadré par décret (n°2023-1350).",
      "Le sous-traitant DOIT avoir un NDA et être certifié Qualiopi (sauf micro-entrepreneur < 77 700€ CA/an).",
      "La sous-sous-traitance est INTERDITE — votre sous-traitant ne peut pas sous-traiter à son tour.",
      "Maximum 80% de votre CA facturé sur Mon Compte Formation peut être sous-traité.",
      "Vous devez déclarer votre sous-traitance annuellement sur EDOF (entre juin et décembre)."
    ],
    exemples_reponses: [
      { texte: "Non, notre organisme ne fait pas appel à la sous-traitance. Toutes nos formations sont dispensées en interne par nos formateurs salariés.", contexte: "Si vous n'avez pas de sous-traitants" },
      { texte: "Oui, nous faisons appel à des formateurs indépendants sous le régime de la micro-entreprise pour des interventions ponctuelles sur des modules spécialisés. Ces intervenants disposent d'un NDA valide et sont exemptés de Qualiopi (CA < 77 700€).", contexte: "Si vous utilisez des indépendants" },
      { texte: "Oui, nous sous-traitons certaines formations spécialisées à [nom OF], organisme certifié Qualiopi (certificat n°XXX), titulaire du NDA n°XXX. Le volume de sous-traitance représente environ 20% de notre activité CPF.", contexte: "Si vous sous-traitez à un OF Qualiopi" }
    ]
  },

  // ═══ STATS EDOF ═══
  stats: {
    of_total: 14109,
    of_label: "organismes référencés sur EDOF (2024)",
    formations_total: 192000,
    entrees_2025: 673539,
    repartition: { RS: 2526581, RNCP: 675617 },
    rs_pct: "79%",
    rncp_pct: "21%",
    top_certifications: [
      { nom: "TOEIC (anglais)", entrees: 273243 },
      { nom: "Permis de conduire (B, C, D)", entrees: 166041 },
      { nom: "Excel (bureautique)", entrees: 138609 },
      { nom: "CACES (engins de chantier)", entrees: 58085 },
      { nom: "English 360 (anglais pro)", entrees: 56184 },
      { nom: "CLOE anglais", entrees: 54367 },
      { nom: "Certificat Voltaire (français)", entrees: 44766 },
    ],
    salaries_median: "2 à 5 salariés pour la majorité des petits OF",
    formateurs_median: "1 à 3 formateurs pour les OF de taille moyenne",
    conseil_salaries: "La majorité des organismes acceptés déclarent entre 1 et 5 salariés. Si vous êtes en micro-entreprise, déclarez 0 salarié et 1 formateur (vous-même)."
  },

  // ═══ CATEGORIES D'ACTIONS ═══
  categories: {
    repartition: [
      { nom: "Actions de formation", pct: "72%", desc: "Formations certifiantes RS/RNCP — la majorité des OF" },
      { nom: "Bilans de compétences", pct: "12%", desc: "Qualiopi catégorie spécifique requise" },
      { nom: "Permis de conduire", pct: "8%", desc: "Auto-écoles certifiées Qualiopi" },
      { nom: "VAE", pct: "5%", desc: "Accompagnement à la Validation des Acquis" },
      { nom: "Apprentissage", pct: "2%", desc: "CFA uniquement" },
      { nom: "Formation des élus", pct: "1%", desc: "Agrément CNFEL obligatoire" }
    ],
    conseil: "Attention : chaque catégorie cochée DOIT correspondre à une catégorie couverte par votre certificat Qualiopi. C'est la cause n°1 de rejet."
  },

  // ═══ MODALITES D'EVALUATION ═══
  evaluation: {
    intro: "L'indicateur 11 Qualiopi exige des modalités d'évaluation adaptées. EDOF demande comment vous évaluez le besoin AVANT la formation (positionnement).",
    exemples: [
      "Entretien individuel téléphonique ou visioconférence pour identifier le niveau, les attentes et les objectifs du stagiaire. Un questionnaire de positionnement est envoyé par email avant le début de la formation. Les résultats permettent d'adapter le parcours (durée, contenu, rythme).",
      "Test de positionnement en ligne (QCM de 20 questions) pour évaluer le niveau initial du stagiaire sur les compétences visées par la certification. Entretien de 30 minutes avec le responsable pédagogique pour valider l'adéquation entre le projet professionnel et la formation.",
      "Questionnaire d'auto-évaluation envoyé avant l'inscription, suivi d'un entretien de cadrage avec le formateur référent. Analyse du CV et du parcours professionnel pour identifier les acquis et définir les modules à renforcer.",
      "Évaluation diagnostique en début de formation (test écrit + mise en situation) permettant de mesurer les compétences existantes. Entretien individuel pour adapter le plan de formation personnalisé.",
      "Analyse du dossier de candidature (CV, lettre de motivation, projet professionnel) + entretien de positionnement de 45 minutes avec le coordinateur pédagogique. Grille d'évaluation des prérequis validée par le responsable pédagogique."
    ],
    conseil: "Qualiopi exige que le positionnement SERVE à adapter la prestation. Mentionnez toujours comment les résultats sont utilisés pour personnaliser le parcours."
  },

  // ═══ OBJECTIFS PEDAGOGIQUES ═══
  objectifs: {
    intro: "Un objectif pédagogique doit être SMART : Spécifique, Mesurable, Atteignable, Réaliste, Temporel. Utilisez des verbes d'action (Bloom) : identifier, appliquer, analyser, évaluer, créer.",
    exemples_par_type: {
      formation_certifiante: [
        "À l'issue de la formation, le stagiaire sera capable de : maîtriser les fonctionnalités avancées d'Excel (tableaux croisés dynamiques, formules complexes, macros) pour obtenir la certification TOSA Excel niveau avancé.",
        "Acquérir les compétences linguistiques nécessaires à l'obtention du TOEIC avec un score minimum de 785 points (niveau B2), en développant la compréhension orale et écrite en contexte professionnel."
      ],
      bilan_competences: [
        "Permettre au bénéficiaire d'analyser ses compétences professionnelles et personnelles, ses aptitudes et motivations, afin de définir un projet professionnel réaliste et, le cas échéant, un projet de formation.",
        "Accompagner le bénéficiaire dans l'identification de ses atouts et axes de développement, la construction d'un plan d'action concret pour sa reconversion ou son évolution professionnelle."
      ],
      permis_conduire: [
        "Former le candidat à la conduite automobile en vue de l'obtention du permis B, en développant les compétences de sécurité routière, de maîtrise du véhicule et de partage de la route conformément au REMC.",
        "Préparer le candidat aux épreuves théoriques (Code de la route) et pratiques du permis de conduire, en assurant l'acquisition des automatismes de conduite sécuritaire."
      ],
      vae: [
        "Accompagner le candidat dans la démarche de Validation des Acquis de l'Expérience en vue de l'obtention totale ou partielle de la certification visée, par l'identification, la formalisation et la valorisation des compétences acquises.",
      ]
    },
    erreurs: [
      "❌ Trop vague : « Former les stagiaires aux bases d'Excel » → ✅ « Maîtriser les fonctions de calcul, les tableaux croisés dynamiques et la mise en forme conditionnelle dans Excel »",
      "❌ Non mesurable : « Améliorer le niveau d'anglais » → ✅ « Atteindre le niveau B2 du CECRL, validé par l'obtention du TOEIC avec un score ≥ 785 »",
      "❌ Copié-collé du référentiel : reformulez avec vos propres mots en gardant les compétences du bloc",
      "❌ Incohérent avec la certification : l'objectif DOIT correspondre aux compétences évaluées par la certification RS/RNCP visée"
    ]
  },

  // ═══ INTITULES D'OFFRES ═══
  intitules: {
    intro: "Seuls les 90 premiers caractères sont visibles sur Mon Compte Formation. Soyez précis et accrocheur dès le début.",
    exemples: [
      { bon: "Formation Excel avancé — Certification TOSA — 100% à distance — 35h", type: "Formation certifiante RS" },
      { bon: "Anglais professionnel — Préparation TOEIC 785+ — Cours individuels — 40h", type: "Formation certifiante RS" },
      { bon: "Bilan de compétences — 24h — Présentiel et distanciel — Accompagnement personnalisé", type: "Bilan de compétences" },
      { bon: "Permis B accéléré — Formation complète Code + Conduite — 20h de conduite", type: "Permis de conduire" },
      { bon: "Création d'entreprise — Certification RS « Entreprendre » — 5 jours intensifs", type: "Formation certifiante RS" }
    ],
    erreurs: [
      "❌ Trop long : les titulaires ne voient que 90 caractères",
      "❌ Pas de certification mentionnée : toujours indiquer le nom de la certification",
      "❌ Titre commercial uniquement : « Devenez un pro ! » ne passe pas",
      "❌ Durée absente : mentionnez la durée pour rassurer le titulaire"
    ]
  },

  // ═══ CONTENU & POINTS FORTS ═══
  contenu: {
    exemple: "Module 1 — Les fondamentaux (7h) : Introduction aux concepts clés, terminologie, cadre réglementaire. Module 2 — Mise en pratique (14h) : Exercices pratiques, études de cas, simulations. Module 3 — Évaluation et certification (7h) : Révisions, passage de la certification, correction et analyse des résultats. Méthodes pédagogiques : alternance théorie/pratique, supports numériques, mises en situation professionnelles.",
    points_forts_exemples: [
      "Formation 100% individualisée avec un formateur dédié. Passage de certification inclus. Taux de réussite de 95%. Support pédagogique accessible 24/7.",
      "Accompagnement personnalisé par un consultant certifié. Outils psychométriques reconnus (RIASEC, MBTI). Suivi post-bilan à 6 mois inclus.",
      "Formateur expert avec 10+ ans d'expérience terrain. Matériel pédagogique fourni. Accès à la plateforme e-learning pendant 6 mois après la formation."
    ]
  },

  // ═══ RESULTATS ATTENDUS ═══
  resultats: {
    exemples: [
      "Obtention de la certification TOSA Excel avec un score minimum de 726 points (niveau avancé). Le stagiaire sera autonome dans la création de tableaux de bord, l'analyse de données et l'automatisation de tâches sous Excel.",
      "Obtention du TOEIC avec un score ≥ 785 (niveau B2). Le stagiaire pourra communiquer de manière fluide en anglais dans un contexte professionnel international.",
      "Remise d'une synthèse écrite du bilan de compétences comprenant : le projet professionnel validé, le plan d'action détaillé, les formations complémentaires identifiées le cas échéant.",
      "Obtention du permis B. Le candidat maîtrisera la conduite en autonomie, les règles de sécurité routière et les situations de conduite complexes (autoroute, nuit, intempéries)."
    ]
  },

  // ═══ MOTIVATIONS (Step 4) ═══
  motivations: {
    intro: "La motivation doit montrer que vous avez un projet sérieux, cohérent avec votre activité et conforme à la réglementation.",
    exemples: [
      "Notre organisme de formation, spécialisé dans [domaine], souhaite être référencé sur Mon Compte Formation afin de proposer nos formations certifiantes aux titulaires du CPF. Certifié Qualiopi depuis [date], nous dispensons des formations dans le domaine [X] depuis [Y] ans. Notre objectif est de rendre accessibles nos formations à un public plus large via le financement CPF, tout en respectant les conditions d'utilisation de la plateforme.",
      "Organisme de formation certifié Qualiopi (certificat n°XXX), nous souhaitons accéder à l'espace EDOF pour référencer nos formations préparant à la certification [nom certification RS/RNCP]. Avec une expérience de [X] ans dans la formation professionnelle et un taux de réussite de [X]%, nous souhaitons développer notre activité en permettant aux salariés et demandeurs d'emploi de mobiliser leur CPF.",
      "Notre organisme, créé en [année], est spécialisé dans la formation [domaine]. Nous sommes certifiés Qualiopi pour les actions de formation et souhaitons être référencés sur EDOF afin de : (1) proposer nos formations certifiantes RS/RNCP aux bénéficiaires du CPF, (2) contribuer au développement des compétences des actifs, (3) assurer un parcours de formation de qualité conforme aux exigences du RNQ. Nous nous engageons à respecter les CGU et CPOF de la plateforme."
    ],
    conseil: "Mentionnez toujours : votre certification Qualiopi, votre domaine d'expertise, votre ancienneté, et votre engagement à respecter les règles. Si c'est un changement de SIRET, précisez-le."
  },

  // ═══ PIECES JUSTIFICATIVES ═══
  pieces: {
    obligatoires: [
      { doc: "Extrait Kbis de moins de 3 mois (ou RNE)", type: "Entreprise", conseil: "Téléchargez-le sur infogreffe.fr ou monidenum.fr" },
      { doc: "Copie CNI ou passeport du représentant légal", type: "Représentant légal", conseil: "Recto-verso, en cours de validité" },
      { doc: "Déclaration de non-condamnation et filiation", type: "Représentant légal", conseil: "Signée et datée de moins de 3 mois. Modèle téléchargeable sur EDOF" },
    ],
    association: [
      { doc: "Statuts à jour de l'association", type: "Association", conseil: "Avec les membres du bureau et fonctions" },
      { doc: "PV d'Assemblée Générale", type: "Association", conseil: "Le dernier en date" },
      { doc: "Récépissé JOAFE", type: "Association", conseil: "Publication au Journal Officiel" },
    ],
    specifiques: [
      { doc: "Agrément préfectoral", type: "Auto-école", conseil: "Si formations conduite" },
      { doc: "Agrément CNFEL", type: "Élus locaux", conseil: "Si formation des élus" },
      { doc: "Délégation de pouvoir", type: "Si demandeur ≠ RL", conseil: "Modèle sur EDOF" },
    ],
    complementaires: "Programme de formation, grille tarifaire, CV/diplômes formateurs, liasses fiscales, bilans, BPF, attestations, business plan... La liste est non exhaustive et dépend de votre dossier.",
    conseil: "Préparez TOUS les documents AVANT de commencer le formulaire. Format PDF recommandé, 10 Mo max par fichier. Les pièces complémentaires sont demandées APRÈS la soumission, via EDOF uniquement."
  },

  // ═══ FORMATIONS INTERDITES / ERREURS ═══
  interdits: {
    formations: [
      "Formations dont la certification RS/RNCP a expiré (vérifiez sur francecompetences.fr)",
      "Formations sans lien avec une certification active",
      "Formations de développement personnel sans certification",
      "Offres non conformes à la catégorie Qualiopi (ex: proposer un bilan de compétences sans Qualiopi BC)",
      "Formations dispensées par un sous-traitant non conforme (non Qualiopi, pas de NDA)",
    ],
    erreurs_rejet: [
      "Catégorie d'action incohérente avec le certificat Qualiopi",
      "Habilitation manquante pour la certification visée",
      "SIRET non actif ou ne correspondant pas au NDA",
      "Pièces justificatives illisibles, expirées ou manquantes",
      "Description de formation trop courte ou copiée du référentiel",
      "Prix/durée incohérents (ex: 1h pour 5 000€)",
      "URL inaccessible dans la fiche formation",
    ],
    conseil: "100% de nos dossiers sont acceptés grâce à notre IA qui compare votre dossier à 180+ dossiers déjà acceptés avant soumission."
  }
};
