/* LFO pricing - source de vérité unique (cents TTC) */
const PRICING = {
  nda: { price:29000, oldPrice:49900, label:'NDA', desc:"Déclaration d'activité" },
  edof: { price:49000, oldPrice:199000, label:'EDOF', desc:'Mon Compte Formation' },
  qualiopi: { price:99000, oldPrice:299000, label:'Qualiopi', desc:'Certification qualité' },
  creation_of: { price:149000, oldPrice:399000, label:'Création OF', desc:'Organisme de formation' },
  creation_of_cfa: { price:299000, oldPrice:599000, label:'Création CFA', desc:"Centre de formation d'apprentis" },
  habilitation: { price:99000, oldPrice:299000, label:'Habilitation RS/RNCP', desc:'Convention certificateur' },
  certification: { price:599000, oldPrice:1299000, label:'Certification', desc:'Enregistrement France Compétences' },
  opco: { price:29000, oldPrice:49000, label:'OPCO', desc:'Par OPCO (½ journée)', perUnit:true },
  france_travail: { price:29000, oldPrice:59000, label:'France Travail', desc:'Référencement Kairos' },
  controle: { price:89000, oldPrice:199000, label:'Contrôle', desc:'Audit de conformité visio' },
  controle_accompagnement: { price:39000, label:'+Accompagnement jour J' },
  creation_formation: { price:99000, oldPrice:199000, label:'Création formation', desc:'5 modules vidéo 2min' },
  creation_formation_module_sup: { price:29000, label:'+Module supplémentaire' },
  uai: { price:14900, oldPrice:29900, label:'UAI', desc:'Numéro unité administrative' },
  uai_premium: { price:4900, label:'UAI (membre)' },
  centre_examen: { price:199000, oldPrice:399000, label:"Centre d'examen", desc:'Habilitation examens' },
  formation_elus: { price:199000, oldPrice:399000, label:'Formation des élus', desc:'Formation réglementaire élus' },
  agrement_prefectoral: { price:69000, oldPrice:149000, label:'Agrément préfectoral', desc:'Auto-école / école de conduite' },
  agrement_prefectoral_renouvellement: { price:39000, label:'Renouvellement agrément' },
  site_web: { price:99000, oldPrice:199000, label:'Site web vitrine' },
  lms: { price:199000, oldPrice:399000, label:'Plateforme LMS' },
  funnel: { price:149000, oldPrice:299000, label:'Funnel de vente' },
  app_mobile: { price:399000, oldPrice:799000, label:'Application mobile' },
  pack_presence: { price:99000, oldPrice:138800, label:'Pack Présence' },
  pack_digital: { price:299000, oldPrice:484800, label:'Pack Digital' },
  pack_premium: { price:499000, oldPrice:881800, label:'Pack Premium' },
  pack_enterprise: { price:799000, oldPrice:1280800, label:'Pack Enterprise' }
};
const MEMBER_DISCOUNT = 0.10;
function getMemberPrice(key) { const p = PRICING[key]; return p ? Math.round(p.price*(1-MEMBER_DISCOUNT)) : null; }
function formatPrice(cents) { return (cents/100).toLocaleString('fr-FR') + ' €'; }
if (typeof window !== 'undefined') {
  window.PRICING = PRICING;
  window.getMemberPrice = getMemberPrice;
  window.formatPrice = formatPrice;
  window.MEMBER_DISCOUNT = MEMBER_DISCOUNT;
}
