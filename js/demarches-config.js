// Configuration des 21 types de démarches
// Legacy DEM object (referenced by older dashboard code)
if (typeof DEM === 'undefined') { var DEM = { BLOCKING_CROSSSELLS: {}, DEMARCHES: {} }; }

window.DEMARCHE_CONFIG = {
  nda: {
    label:"NDA", prix:290, siret:true,
    etapes:["Configuration","Dépôt du dossier","Terminée"],
    docs:[
      {key:"cni",label:"Pièce d'identité (CNI/Passeport)",req:true},
      {key:"b3",label:"Casier judiciaire B3",req:true,lien:"https://casier-judiciaire.justice.gouv.fr"},
      {key:"kbis",label:"Kbis (moins de 3 mois)",req:true}
    ],
    docsConditionnels:[
      {key:"cv_formateur",label:"CV du formateur",condition:"formateur_oui"},
      {key:"contrat_formateur",label:"Contrat pro organisme / formateur",condition:"formateur_oui"},
      {key:"diplome_formateur",label:"Diplôme du formateur",condition:"formateur_oui",req:false}
    ],
    docsToggle:[
      {key:"convention",label:"Convention / contrat de formation"},
      {key:"programme",label:"Programme de formation"},
      {key:"intervenants",label:"Liste des intervenants"},
      {key:"contenu_orga",label:"Contenu et organisation des actions"}
    ],
    champs:[
      {key:"type_nda",label:"Type de NDA",type:"select",options:["Formation continue","CFA classique","CFA d'entreprise"],req:true},
      {key:"formateur",label:"Avez-vous un formateur ?",type:"formateur_choice",req:true}
    ]
  },
  edof: {
    label:"EDOF", prix:490, siret:true,
    etapes:["Configuration","Formulaire","Dépôt du dossier","Webinaire","Terminée"],
    docs:[
      {key:"qualiopi_doc",label:"Certification Qualiopi en cours de validité",req:true},
    ],
    docsConditionnels:[
      {key:"habilitation_doc",label:"Habilitation RS/RNCP (attestation du certificateur)",condition:"categorie_habilitation_ou_certification"},
      {key:"attestation_rectorat",label:"Attestation du rectorat",condition:"categorie_permis"}
    ],
    docsToggle:[
      {key:"programme",label:"Programme de formation (PDF détaillé)"},
      {key:"cgv",label:"Conditions générales de vente (CGV)"},
      {key:"reglement_interieur",label:"Règlement intérieur"}
    ],
    champs:[
      {key:"categorie",label:"Catégorie de formation",type:"select",options:["Habilitation","Certification","Bilan","VAE","Permis"],req:true},
      {key:"intitule_formation",label:"Intitulé de la formation",type:"text",req:true},
      {key:"objectifs",label:"Objectifs pédagogiques",type:"textarea",req:true},
      {key:"duree_heures",label:"Durée de la formation (en heures)",type:"text",req:true},
      {key:"modalite",label:"Modalités de la formation",type:"select",options:["Présentiel","Distanciel","Mixte (présentiel + distanciel)"],req:true},
      {key:"modalite_evaluation",label:"Modalités d'évaluation",type:"text",req:true},
      {key:"prix_ttc",label:"Prix TTC de la formation (en euros)",type:"text",req:true},
      {key:"lieu",label:"Lieu de la formation",type:"text",req:false},
      {key:"nb_sessions",label:"Nombre de sessions prévues",type:"text",req:false},
      {key:"certification",label:"Numéro RS ou RNCP",type:"certsearch",req:true}
    ]
  },
  qualiopi: {
    label:"Qualiopi", prix:990, siret:true,
    etapes:["Configuration","Indicateurs (32)","Planification audit","Audit","Terminée"],
    docs:[],docsConditionnels:[],docsToggle:[],
    champs:[
      {key:"actions",label:"Actions à certifier",type:"multi",options:["Action de formation","Apprentissage (CFA)","VAE","Bilan de compétences"],req:true},
      {key:"type_audit",label:"Type d'audit",type:"select",options:["Initial","Surveillance","Renouvellement"],req:true}
    ]
  },
  habilitation: {
    label:"Habilitation RS/RNCP", prix:990, siret:true,
    etapes:["Configuration","Constitution du dossier","Convention signée","Terminée"],
    docs:[
      {key:"kbis",label:"Kbis (moins de 3 mois)",req:true},
      {key:"nda_doc",label:"NDA actif",req:true},
      {key:"qualiopi_doc",label:"Certification Qualiopi",req:true}
    ],
    docsConditionnels:[
      {key:"cv_formateur",label:"CV du formateur",condition:"formateur_oui"},
      {key:"contrat_formateur",label:"Contrat pro organisme / formateur",condition:"formateur_oui"},
      {key:"diplome_formateur",label:"Diplôme du formateur",condition:"formateur_oui",req:false}
    ],
    docsToggle:[
      {key:"programme",label:"Programme de formation"},
      {key:"modalites",label:"Modalités d'évaluation"}
    ],
    champs:[
      {key:"certification",label:"Numéro RS ou RNCP",type:"certsearch",req:true},
      {key:"formateur",label:"Avez-vous un formateur ?",type:"formateur_choice",req:true}
    ]
  },
  opco: {
    label:"Référencement OPCO", prix:490, siret:true,
    etapes:["Configuration","Dépôt dossier","Terminée"],
    docs:[{key:"qualiopi_doc",label:"Certification Qualiopi",req:true},{key:"nda_doc",label:"NDA actif",req:true}],
    docsConditionnels:[],docsToggle:[],
    champs:[
      {key:"opcos",label:"OPCOs souhaités",type:"multi",options:["Tous","OPCO EP","AKTO","ATLAS","Uniformation","Constructys","OPCO Santé","AFDAS","Ocapiat","OPCO Mobilités","OPCO Commerce","OPCO 2i"],req:true},
      {key:"disponibilites",label:"Disponibilités RDV expert",type:"text",req:false}
    ]
  },
  france_travail: {
    label:"France Travail (KAIROS)", prix:290, siret:true,
    etapes:["Configuration","Référencement","Terminée"],
    docs:[{key:"qualiopi_doc",label:"Certification Qualiopi",req:true},{key:"nda_doc",label:"NDA actif",req:true}],
    docsConditionnels:[],docsToggle:[],
    champs:[
      {key:"formations_creees",label:"Formations déjà créées ?",type:"select",options:["Oui","Non"],req:true},
      {key:"disponibilites",label:"Disponibilités RDV expert",type:"text",req:false}
    ]
  },
  controle: {
    label:"Contrôle DREETS", prix:890, siret:true,
    etapes:["Configuration","Diagnostic","Plan d'actions","Terminée"],
    docs:[{key:"courrier_dreets",label:"Courrier de la DREETS",req:false},{key:"bpf",label:"Bilan pédagogique et financier (BPF)",req:false}],
    docsConditionnels:[],docsToggle:[],
    champs:[{key:"type_controle",label:"Type de contrôle",type:"select",options:["Contrôle sur pièces","Contrôle sur place","Mise en demeure","Autre"],req:true}]
  },
  uai: {
    label:"UAI (Numéro rectorat)", prix:149, siret:true,
    etapes:["Configuration","Dépôt dossier","Terminée"],
    docs:[],docsConditionnels:[],docsToggle:[],
    champs:[{key:"certification_rs",label:"Certification RS/RNCP visée",type:"text",req:false}]
  },
  centre_examen: {
    label:"Centre d'examen agréé", prix:1990, siret:true,
    etapes:["Configuration","Constitution dossier","Inspection","Agrément","Terminée"],
    docs:[{key:"qualiopi_doc",label:"Certification Qualiopi",req:true},{key:"rc_pro",label:"RC Professionnelle",req:true}],
    docsConditionnels:[],docsToggle:[],
    champs:[{key:"certifications",label:"Certifications visées",type:"text",req:true}]
  },
  agrement_prefectoral: {
    label:"Agrément préfectoral", prix:690, siret:true,
    etapes:["Configuration","Constitution dossier","Dépôt","Terminée"],
    docs:[{key:"b3",label:"Casier judiciaire B3",req:true}],
    docsConditionnels:[],docsToggle:[],
    champs:[{key:"type_agrement",label:"Type d'agrément",type:"select",options:["Sécurité privée","Transport","Sanitaire","Autre"],req:true}]
  },
  formation_elus: {
    label:"Formation des élus locaux", prix:3490, siret:true,
    etapes:["Configuration","Agrément ministériel","Programme CGCT","Dépôt","Inspection","Terminée"],
    docs:[{key:"bilans_certifies",label:"Bilans certifiés",req:true},{key:"bpf",label:"Bilan pédagogique et financier",req:false}],
    docsConditionnels:[],docsToggle:[],
    champs:[{key:"themes",label:"Thèmes visés",type:"textarea",req:true}]
  },
  centre_certifie: {
    label:"Centre Certifié France Compétences", prix:5990, siret:true,
    etapes:["Configuration","Étude de faisabilité","Constitution dossier","Dépôt FC","Commission","Terminée"],
    docs:[],docsConditionnels:[],docsToggle:[],
    champs:[
      {key:"type_certif",label:"Type de certification",type:"select",options:["RS","RNCP"],req:true},
      {key:"premiere_demande",label:"Première demande ou renouvellement",type:"select",options:["Première demande","Renouvellement"],req:true},
      {key:"intitule",label:"Intitulé de la certification",type:"text",req:true}
    ]
  },
  creation_of: {
    label:"Création OF", prix:1490, siret:false,
    etapes:["Configuration","Kbis","NDA","Qualiopi","Options","Terminée"],
    docs:[{key:"cni",label:"Pièce d'identité (CNI/Passeport)",req:true}],
    docsConditionnels:[],docsToggle:[],
    champs:[
      {key:"forme_juridique",label:"Forme juridique",type:"select",options:["SASU","SAS","SARL","EURL","Micro-entrepreneur","Association"],req:true},
      {key:"kbis_existant",label:"Kbis existant ?",type:"select",options:["Oui","Non (à créer)"],req:true}
    ]
  },
  creation_formation: {
    label:"Création de Formation", prix:990, siret:false,
    etapes:["Configuration","Rédaction","Validation","Terminée"],
    docs:[],docsConditionnels:[],docsToggle:[],
    champs:[
      {key:"titre",label:"Titre de la formation",type:"text",req:true},
      {key:"thematique",label:"Thématique",type:"text",req:true},
      {key:"public_cible",label:"Public cible",type:"text",req:false},
      {key:"duree",label:"Durée",type:"text",req:false}
    ]
  },
  site: {
    label:"Site internet professionnel", prix:990, siret:false,
    etapes:["Configuration","Design","Production","Sécurité","Terminé"],
    docs:[],docsConditionnels:[],docsToggle:[],
    champs:[
      {key:"nom_site",label:"Nom du site",type:"text",req:true},
      {key:"inspirations",label:"Sites d'inspiration",type:"textarea",req:false}
    ]
  },
  app: {
    label:"Application mobile", prix:4990, siret:false,
    etapes:["Configuration","Design","Production","Sécurité","Terminé"],
    docs:[],docsConditionnels:[],docsToggle:[],
    champs:[
      {key:"plateforme",label:"Plateforme",type:"select",options:["iOS","Android","iOS + Android"],req:true},
      {key:"brief",label:"Brief fonctionnel",type:"textarea",req:false}
    ]
  },
  lms: {
    label:"LMS (Plateforme e-learning)", prix:2900, siret:false,
    etapes:["Configuration","Design","Production","Sécurité","Terminé"],
    docs:[],docsConditionnels:[],docsToggle:[],
    champs:[
      {key:"nb_apprenants",label:"Nombre d'apprenants prévu",type:"select",options:["1-50","50-500","500+"],req:true},
      {key:"contenus",label:"Contenus existants ?",type:"text",req:false}
    ]
  },
  agent_ia: {
    label:"Agent IA", prix:390, siret:false,
    etapes:["Configuration","RDV expert","Production","Terminé"],
    docs:[],docsConditionnels:[],docsToggle:[],
    champs:[{key:"agents",label:"Agents souhaités",type:"multi",options:["Chatbot site","Email auto","Génération documents","Prospection","CRM","Autre"],req:true}]
  },
  pack_presence: {
    label:"Pack Présence", prix:990, siret:false,
    etapes:["Configuration","Production","Terminé"],
    docs:[],docsConditionnels:[],docsToggle:[],
    champs:[
      {key:"nom_entreprise",label:"Nom de l'entreprise",type:"text",req:true},
      {key:"objectifs_site",label:"Objectifs du site",type:"textarea",req:false}
    ]
  },
  pack_digital: {
    label:"Pack Digital", prix:2990, siret:false,
    etapes:["Configuration","Production","Terminé"],
    docs:[],docsConditionnels:[],docsToggle:[],
    champs:[
      {key:"themes",label:"3 thèmes de formation",type:"textarea",req:true},
      {key:"nom_entreprise",label:"Nom de l'entreprise",type:"text",req:true}
    ]
  },
  pack_premium: {
    label:"Pack Premium", prix:4990, siret:false,
    etapes:["Configuration","Production","Terminé"],
    docs:[],docsConditionnels:[],docsToggle:[],
    champs:[
      {key:"themes",label:"3 thèmes de formation",type:"textarea",req:true},
      {key:"agent_ia",label:"Agent IA souhaité",type:"select",options:["Chatbot","Email auto","CRM","Autre"],req:true}
    ]
  },
  pack_enterprise: {
    label:"Pack Enterprise", prix:7990, siret:false,
    etapes:["Configuration","Production","Terminé"],
    docs:[],docsConditionnels:[],docsToggle:[],
    champs:[
      {key:"themes",label:"3 thèmes de formation",type:"textarea",req:true},
      {key:"agent_ia",label:"Agent IA",type:"select",options:["Chatbot","Email auto","CRM","Autre"],req:true},
      {key:"plateforme_app",label:"Plateforme app",type:"select",options:["iOS","Android","iOS + Android"],req:true}
    ]
  }
};
