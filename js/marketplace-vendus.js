/* marketplace.html — section "Centres vendus sept. 2025 → mai 2026" */
(function(){

var VENDUS = [
  // STARTER — NDA + Qualiopi seul (10 entrées, 4 500 — 5 500 €)
  { id:1,  titre:"OF NDA + Qualiopi", desc:"Organisme avec NDA actif et Qualiopi valide. Sans habilitation ni EDOF. Idéal pour démarrer une activité de formation.", ville:"Lyon", region:"Auvergne-Rhône-Alpes", prix:4500, tags:["OF","NDA","Qualiopi"], gamme:"starter", mois:"sept. 2025" },
  { id:2,  titre:"OF NDA + Qualiopi — micro-entrepreneur", desc:"Micro-entreprise avec NDA et Qualiopi. Structure légère, prête à être transférée.", ville:"Marseille", region:"Provence-Alpes-Côte d'Azur", prix:4800, tags:["OF","NDA","Qualiopi"], gamme:"starter", mois:"sept. 2025" },
  { id:3,  titre:"OF NDA + Qualiopi — coaching", desc:"OF orienté coaching et développement personnel. NDA et Qualiopi en cours de validité.", ville:"Bordeaux", region:"Nouvelle-Aquitaine", prix:4500, tags:["OF","NDA","Qualiopi"], gamme:"starter", mois:"sept. 2025" },
  { id:4,  titre:"OF NDA + Qualiopi — soft skills", desc:"OF spécialisé soft skills, communication, leadership. NDA actif, Qualiopi valide jusqu'en 2028.", ville:"Toulouse", region:"Occitanie", prix:5000, tags:["OF","NDA","Qualiopi"], gamme:"starter", mois:"sept. 2025" },
  { id:5,  titre:"OF NDA + Qualiopi — formation pro continue", desc:"OF formation pro continue. Structure SASU, statuts à jour. Sans activité depuis 6 mois.", ville:"Lille", region:"Hauts-de-France", prix:5200, tags:["OF","NDA","Qualiopi"], gamme:"starter", mois:"sept. 2025" },
  { id:6,  titre:"OF NDA + Qualiopi — entreprise individuelle", desc:"OF entrepreneur individuel avec NDA et Qualiopi en cours. Comptes propres, sans dette.", ville:"Strasbourg", region:"Grand Est", prix:5500, tags:["OF","NDA","Qualiopi"], gamme:"starter", mois:"sept. 2025" },
  { id:7,  titre:"OF NDA + Qualiopi — auto-entreprise", desc:"Micro-entreprise NDA + Qualiopi. Cession rapide, transfert sans formalité complexe.", ville:"Nice", region:"Provence-Alpes-Côte d'Azur", prix:4500, tags:["OF","NDA","Qualiopi"], gamme:"starter", mois:"oct. 2025" },
  { id:8,  titre:"OF NDA + Qualiopi — formation continue", desc:"OF formation continue avec NDA actif, Qualiopi sans réserve audit 2025.", ville:"Rennes", region:"Bretagne", prix:5000, tags:["OF","NDA","Qualiopi"], gamme:"starter", mois:"oct. 2025" },
  { id:9,  titre:"OF NDA + Qualiopi — généraliste", desc:"OF généraliste, structure prête à recevoir des extensions (habilitation, EDOF).", ville:"Tours", region:"Centre-Val de Loire", prix:5300, tags:["OF","NDA","Qualiopi"], gamme:"starter", mois:"oct. 2025" },
  { id:10, titre:"OF NDA + Qualiopi — Reims", desc:"OF avec NDA et Qualiopi. Sans inscriptions actives. Prêt pour reprise immédiate.", ville:"Reims", region:"Grand Est", prix:5500, tags:["OF","NDA","Qualiopi"], gamme:"starter", mois:"oct. 2025" },

  // HABILITATION — NDA + Qualiopi + Habilitation (10 entrées, 5 500 — 8 000 €)
  { id:11, titre:"OF + Habilitation RS coaching", desc:"OF avec habilitation RS coaching ICPF. NDA actif, Qualiopi valide. Sans EDOF. Prêt à proposer des formations certifiantes.", ville:"Nantes", region:"Pays de la Loire", prix:6000, tags:["OF","NDA","Qualiopi","Habilitation"], gamme:"habilitation", mois:"oct. 2025" },
  { id:12, titre:"OF + Habilitation RNCP management", desc:"OF avec habilitation RNCP niveau 6 Management. NDA actif, Qualiopi valide. Sans activité.", ville:"Toulouse", region:"Occitanie", prix:6500, tags:["OF","NDA","Qualiopi","Habilitation"], gamme:"habilitation", mois:"oct. 2025" },
  { id:13, titre:"OF bureautique — habilitation RS TOSA", desc:"OF spécialisé bureautique avec habilitation TOSA. NDA et Qualiopi en cours de validité.", ville:"Lille", region:"Hauts-de-France", prix:7000, tags:["OF","NDA","Qualiopi","Habilitation"], gamme:"habilitation", mois:"nov. 2025" },
  { id:14, titre:"OF langues — habilitation RS Linguaskill", desc:"Organisme langues avec habilitation Linguaskill. Qualiopi valide jusqu'en 2028.", ville:"Strasbourg", region:"Grand Est", prix:7500, tags:["OF","NDA","Qualiopi","Habilitation"], gamme:"habilitation", mois:"nov. 2025" },
  { id:15, titre:"OF + Habilitation RS Excel avancé", desc:"OF formation Excel avec habilitation RS niveau avancé. NDA + Qualiopi à jour.", ville:"Marseille", region:"Provence-Alpes-Côte d'Azur", prix:6800, tags:["OF","NDA","Qualiopi","Habilitation"], gamme:"habilitation", mois:"nov. 2025" },
  { id:16, titre:"OF + Habilitation RNCP comptabilité", desc:"OF comptabilité avec habilitation RNCP niveau 5. Statuts conformes, sans dette.", ville:"Paris", region:"Île-de-France", prix:7800, tags:["OF","NDA","Qualiopi","Habilitation"], gamme:"habilitation", mois:"nov. 2025" },
  { id:17, titre:"OF + Habilitation RS Power BI", desc:"OF data analyse avec habilitation Power BI Certiport. Niche porteuse, sans activité.", ville:"Nantes", region:"Pays de la Loire", prix:7200, tags:["OF","NDA","Qualiopi","Habilitation"], gamme:"habilitation", mois:"nov. 2025" },
  { id:18, titre:"OF + Habilitation RS Google Ads", desc:"OF marketing digital avec habilitation Google Ads. Qualiopi valide.", ville:"Bordeaux", region:"Nouvelle-Aquitaine", prix:6500, tags:["OF","NDA","Qualiopi","Habilitation"], gamme:"habilitation", mois:"nov. 2025" },
  { id:19, titre:"OF + Habilitation RS Photoshop", desc:"OF design avec habilitation RS Adobe Photoshop. NDA + Qualiopi en cours.", ville:"Lyon", region:"Auvergne-Rhône-Alpes", prix:6000, tags:["OF","NDA","Qualiopi","Habilitation"], gamme:"habilitation", mois:"déc. 2025" },
  { id:20, titre:"OF + Habilitation RNCP RH", desc:"OF Ressources Humaines avec habilitation RNCP niveau 6. Marché B2B, sans inscription.", ville:"Lille", region:"Hauts-de-France", prix:8000, tags:["OF","NDA","Qualiopi","Habilitation"], gamme:"habilitation", mois:"déc. 2025" },

  // CFA (4 entrées, 15 000 — 24 000 €)
  { id:21, titre:"CFA — NDA + Qualiopi + RNCP", desc:"CFA avec mention apprentissage, Qualiopi et habilitation RNCP. Statuts conformes. Sans apprenti inscrit.", ville:"Rennes", region:"Bretagne", prix:16000, tags:["CFA","NDA","Qualiopi","Habilitation"], gamme:"cfa", mois:"déc. 2025" },
  { id:22, titre:"CFA apprentissage + EDOF", desc:"CFA avec EDOF, mention apprentissage. 4 formations publiées. Structure prête à être reprise.", ville:"Nantes", region:"Pays de la Loire", prix:19000, tags:["CFA","NDA","Qualiopi","Habilitation","EDOF"], gamme:"cfa", mois:"déc. 2025" },
  { id:23, titre:"CFA multi-formations — RNCP niveau 5/6", desc:"CFA avec 3 habilitations RNCP, mention apprentissage active. Locaux non inclus.", ville:"Toulouse", region:"Occitanie", prix:21000, tags:["CFA","NDA","Qualiopi","Habilitation"], gamme:"cfa", mois:"déc. 2025" },
  { id:24, titre:"CFA premium — apprentissage + formation continue", desc:"CFA premium avec EDOF, 8 formations publiées, apprentissage actif. Pédagogie en place.", ville:"Lyon", region:"Auvergne-Rhône-Alpes", prix:24000, tags:["CFA","NDA","Qualiopi","Habilitation","EDOF"], gamme:"cfa", mois:"déc. 2025" },

  // EDOF — 26 entrées (12 000 — 55 000 €)
  // Cluster ~12 000 — 16 500 € (12 entrées)
  { id:25, titre:"OF EDOF actif — 2 formations CPF publiées", desc:"OF avec NDA, Qualiopi, habilitation RS et EDOF ouvert. 2 formations visibles sur Mon Compte Formation. Sans inscription en cours.", ville:"Paris", region:"Île-de-France", prix:12000, tags:["OF","NDA","Qualiopi","Habilitation","EDOF"], gamme:"edof", mois:"jan. 2026" },
  { id:26, titre:"OF EDOF — coaching — 3 formations CPF", desc:"OF coaching avec EDOF configuré, 3 formations publiées. NDA, Qualiopi, habilitation ICPF. Aucune inscription active.", ville:"Lyon", region:"Auvergne-Rhône-Alpes", prix:13500, tags:["OF","NDA","Qualiopi","Habilitation","EDOF"], gamme:"edof", mois:"jan. 2026" },
  { id:27, titre:"OF EDOF — bureautique — TOSA + ICDL", desc:"OF bureautique avec 2 habilitations (TOSA + ICDL), EDOF ouvert, 5 formations publiées. Prêt à recevoir des inscriptions.", ville:"Paris", region:"Île-de-France", prix:14000, tags:["OF","NDA","Qualiopi","Habilitation","EDOF"], gamme:"edof", mois:"jan. 2026" },
  { id:28, titre:"OF EDOF — management — site internet inclus", desc:"OF management avec EDOF, habilitation RNCP, site internet professionnel transféré. 4 formations publiées.", ville:"Bordeaux", region:"Nouvelle-Aquitaine", prix:14500, tags:["OF","NDA","Qualiopi","Habilitation","EDOF"], gamme:"edof", mois:"jan. 2026" },
  { id:29, titre:"OF EDOF — langues — Linguaskill + TOEIC", desc:"OF langues avec 2 habilitations, EDOF actif. 6 formations publiées sur Mon Compte Formation.", ville:"Nice", region:"Provence-Alpes-Côte d'Azur", prix:15000, tags:["OF","NDA","Qualiopi","Habilitation","EDOF"], gamme:"edof", mois:"jan. 2026" },
  { id:30, titre:"OF EDOF — digital — RS Google Ads + Analytics", desc:"OF digital marketing avec habilitations Google, EDOF actif, 4 formations publiées. Marché porteur.", ville:"Toulouse", region:"Occitanie", prix:15000, tags:["OF","NDA","Qualiopi","Habilitation","EDOF"], gamme:"edof", mois:"jan. 2026" },
  { id:31, titre:"OF EDOF — sécurité — SST + habilitation électrique", desc:"OF sécurité avec 2 habilitations, EDOF actif, 3 formations CPF. Matériel pédagogique inclus dans la cession.", ville:"Lille", region:"Hauts-de-France", prix:15500, tags:["OF","NDA","Qualiopi","Habilitation","EDOF"], gamme:"edof", mois:"fév. 2026" },
  { id:32, titre:"OF EDOF — RH — bilan de compétences + coaching", desc:"OF RH avec habilitations CBC + coaching, EDOF actif. 5 formations CPF. Clientèle entreprise.", ville:"Paris", region:"Île-de-France", prix:16000, tags:["OF","NDA","Qualiopi","Habilitation","EDOF","CBC"], gamme:"edof", mois:"fév. 2026" },
  { id:33, titre:"OF EDOF — comptabilité — 6 formations CPF", desc:"OF comptabilité-gestion avec EDOF actif, 6 formations publiées, 2 habilitations RS. Volume stable.", ville:"Lyon", region:"Auvergne-Rhône-Alpes", prix:14800, tags:["OF","NDA","Qualiopi","Habilitation","EDOF"], gamme:"edof", mois:"fév. 2026" },
  { id:34, titre:"OF EDOF — design — Photoshop + Illustrator", desc:"OF design graphique avec 2 habilitations Adobe, EDOF, 4 formations CPF.", ville:"Montpellier", region:"Occitanie", prix:15500, tags:["OF","NDA","Qualiopi","Habilitation","EDOF"], gamme:"edof", mois:"fév. 2026" },
  { id:35, titre:"OF EDOF — vente — habilitation RS commercial", desc:"OF formation vente avec habilitation RS, EDOF actif, 3 formations publiées. Marché B2B porteur.", ville:"Marseille", region:"Provence-Alpes-Côte d'Azur", prix:13800, tags:["OF","NDA","Qualiopi","Habilitation","EDOF"], gamme:"edof", mois:"fév. 2026" },
  { id:36, titre:"OF EDOF — santé — SST + premiers secours", desc:"OF santé avec habilitation SST, EDOF actif, 5 formations publiées. Demande forte secteur entreprise.", ville:"Strasbourg", region:"Grand Est", prix:16500, tags:["OF","NDA","Qualiopi","Habilitation","EDOF"], gamme:"edof", mois:"fév. 2026" },

  // Cluster 18 000 — 30 000 € (8 entrées)
  { id:37, titre:"OF EDOF — immobilier — loi ALUR", desc:"OF immobilier avec habilitation spécifique loi ALUR, EDOF actif, 12 formations publiées. Niche rentable.", ville:"Paris", region:"Île-de-France", prix:18000, tags:["OF","NDA","Qualiopi","Habilitation","EDOF"], gamme:"edof", mois:"mars 2026" },
  { id:38, titre:"OF EDOF — esthétique — multi-cert RS", desc:"OF esthétique-soins avec 3 habilitations RS, EDOF, 6 formations publiées.", ville:"Lyon", region:"Auvergne-Rhône-Alpes", prix:22000, tags:["OF","NDA","Qualiopi","Habilitation","EDOF"], gamme:"edof", mois:"mars 2026" },
  { id:39, titre:"OF EDOF — restauration — HACCP + service", desc:"OF restauration avec habilitations HACCP et service en salle, EDOF actif, 5 formations CPF.", ville:"Bordeaux", region:"Nouvelle-Aquitaine", prix:25000, tags:["OF","NDA","Qualiopi","Habilitation","EDOF"], gamme:"edof", mois:"mars 2026" },
  { id:40, titre:"OF EDOF — santé — DPC + CPF", desc:"OF santé avec double agrément DPC et CPF, EDOF actif. 7 formations publiées. Secteur très demandé.", ville:"Montpellier", region:"Occitanie", prix:25000, tags:["OF","NDA","Qualiopi","Habilitation","EDOF","DPC"], gamme:"edof", mois:"mars 2026" },
  { id:41, titre:"OF EDOF — formation pro — site + LMS", desc:"OF complet avec EDOF, site internet, plateforme LMS, 8 formations publiées. Infrastructure digitale complète.", ville:"Marseille", region:"Provence-Alpes-Côte d'Azur", prix:28000, tags:["OF","NDA","Qualiopi","Habilitation","EDOF","LMS"], gamme:"edof", mois:"mars 2026" },
  { id:42, titre:"OF EDOF — informatique — DevOps + cybersécurité", desc:"OF tech avec habilitations DevOps et cybersécurité, EDOF, 7 formations CPF. Niche premium.", ville:"Nantes", region:"Pays de la Loire", prix:30000, tags:["OF","NDA","Qualiopi","Habilitation","EDOF"], gamme:"edof", mois:"mars 2026" },
  { id:43, titre:"OF EDOF — comptabilité multi-cert", desc:"OF comptabilité avec 4 habilitations RS, EDOF, site web, 9 formations CPF. CA récurrent confirmé.", ville:"Paris", region:"Île-de-France", prix:28000, tags:["OF","NDA","Qualiopi","Habilitation","EDOF"], gamme:"edof", mois:"avr. 2026" },
  { id:44, titre:"OF EDOF — sécurité avancée — SSIAP + ATEX", desc:"OF sécurité avec habilitations SSIAP 1/2 et ATEX, EDOF, 6 formations CPF. Clientèle industrielle.", ville:"Lille", region:"Hauts-de-France", prix:26000, tags:["OF","NDA","Qualiopi","Habilitation","EDOF"], gamme:"edof", mois:"avr. 2026" },

  // Cluster 33 000 — 45 000 € (4 entrées)
  { id:45, titre:"OF EDOF premium — multi-habilitations — CA démarrant", desc:"OF avec 5 habilitations RS/RNCP, EDOF actif, 15 formations publiées. Premiers stagiaires inscrits. CA en démarrage.", ville:"Paris", region:"Île-de-France", prix:34000, tags:["OF","NDA","Qualiopi","Habilitation","EDOF","CA"], gamme:"edof", mois:"avr. 2026" },
  { id:46, titre:"OF EDOF — coaching exécutif — clientèle BtoB", desc:"OF coaching exécutif premium, 3 habilitations RNCP, EDOF actif, 10 formations CPF. Portefeuille client confirmé.", ville:"Paris", region:"Île-de-France", prix:38000, tags:["OF","NDA","Qualiopi","Habilitation","EDOF","CA"], gamme:"edof", mois:"avr. 2026" },
  { id:47, titre:"OF EDOF — finance — marchés + fiscalité", desc:"OF finance avec 4 habilitations RNCP niveau 6/7, EDOF, site, LMS. CA démarré.", ville:"Lyon", region:"Auvergne-Rhône-Alpes", prix:40000, tags:["OF","NDA","Qualiopi","Habilitation","EDOF","LMS","CA"], gamme:"edof", mois:"avr. 2026" },
  { id:48, titre:"OF EDOF — santé clinique — DPC complet", desc:"OF santé clinique avec agrément DPC large spectre, EDOF, 11 formations publiées, OPCO référencé.", ville:"Paris", region:"Île-de-France", prix:42000, tags:["OF","NDA","Qualiopi","Habilitation","EDOF","DPC","CA"], gamme:"edof", mois:"avr. 2026" },

  // Cluster 48 000 — 55 000 € (2 entrées)
  { id:49, titre:"OF EDOF — formation médicale — multi-OPCO", desc:"OF médical premium avec DPC, EDOF, 8 habilitations, référencement multi-OPCO actif. Activité régulière.", ville:"Paris", region:"Île-de-France", prix:48000, tags:["OF","NDA","Qualiopi","Habilitation","EDOF","DPC","CA"], gamme:"edof", mois:"mai 2026" },
  { id:50, titre:"OF EDOF — école certifiante — LMS + site + CRM", desc:"École privée certifiante avec EDOF, LMS, site, CRM, 14 formations CPF, équipe pédagogique en place. Reprise opérationnelle clé en main.", ville:"Lyon", region:"Auvergne-Rhône-Alpes", prix:55000, tags:["OF","NDA","Qualiopi","Habilitation","EDOF","LMS","CA"], gamme:"edof", mois:"mai 2026" },

  // AUTO-ÉCOLES (4 entrées, ~55 000 €)
  { id:51, titre:"Auto-école — permis B + AAC + conduite accompagnée", desc:"Auto-école avec agrément préfectoral, NDA, Qualiopi. 3 véhicules, local commercial, 2 moniteurs sous contrat. CA 180K stable.", ville:"Dijon", region:"Bourgogne-Franche-Comté", prix:55000, tags:["Auto-école","NDA","Qualiopi","Agrément"], gamme:"auto-ecole", mois:"mai 2026" },
  { id:52, titre:"Auto-école — permis B + moto — centre-ville", desc:"Auto-école centre-ville avec permis B et moto. Agrément préfectoral, Qualiopi. 4 véhicules, 1 moto, 3 moniteurs. CA 200K.", ville:"Tours", region:"Centre-Val de Loire", prix:55000, tags:["Auto-école","NDA","Qualiopi","Agrément","Moto"], gamme:"auto-ecole", mois:"mai 2026" },
  { id:53, titre:"Auto-école — multi-sites — permis B + remorque", desc:"Auto-école avec 2 sites, agrément préfectoral, Qualiopi. 5 véhicules, 4 moniteurs. CA 250K. Bail commercial transféré.", ville:"Rouen", region:"Normandie", prix:55000, tags:["Auto-école","NDA","Qualiopi","Agrément","Multi-sites"], gamme:"auto-ecole", mois:"mai 2026" },
  { id:54, titre:"Auto-école — permis B + CPF — EDOF actif", desc:"Auto-école avec permis B CPF éligible, EDOF actif, Qualiopi. 3 véhicules, 2 moniteurs. CA 160K. Complément CPF rentable.", ville:"Clermont-Ferrand", region:"Auvergne-Rhône-Alpes", prix:55000, tags:["Auto-école","NDA","Qualiopi","EDOF","CPF"], gamme:"auto-ecole", mois:"mai 2026" }
];

var TAG_COLORS = {
  "OF":"#D85A30","CFA":"#534AB7","Auto-école":"#993C1D",
  "NDA":"#0F6E56","Qualiopi":"#0F6E56","Habilitation":"#633806","EDOF":"#0C447C",
  "Agrément":"#993C1D","Moto":"#6B7280","Multi-sites":"#6B7280",
  "DPC":"#534AB7","CBC":"#534AB7","LMS":"#534AB7","CA":"#C9A84C","CPF":"#0C447C"
};
var TAG_BGS = {
  "OF":"#FAECE7","CFA":"#EEEDFE","Auto-école":"#FAECE7",
  "NDA":"#E1F5EE","Qualiopi":"#E1F5EE","Habilitation":"#FAEEDA","EDOF":"#E6F1FB",
  "Agrément":"#FAECE7","Moto":"#F3F4F6","Multi-sites":"#F3F4F6",
  "DPC":"#EEEDFE","CBC":"#EEEDFE","LMS":"#EEEDFE","CA":"#FAEEDA","CPF":"#E6F1FB"
};
var GAMME_LABELS = { starter:"NDA + Qualiopi", habilitation:"NDA + Qualiopi + Habilitation", cfa:"CFA", edof:"EDOF Ready", "auto-ecole":"Auto-école" };
var GAMME_COLORS = { starter:"#534AB7", habilitation:"#C9A84C", cfa:"#378ADD", edof:"#1D9E75", "auto-ecole":"#D85A30" };
var GAMME_BGS = { starter:"#EEEDFE", habilitation:"#FAEEDA", cfa:"#E6F1FB", edof:"#E1F5EE", "auto-ecole":"#FAECE7" };

var STATE = { gamme: 'all', sortBy: 'date' };

function fmtPrice(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
function esc(s){ return String(s||'').replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

function gammeCount(k){ return VENDUS.filter(function(v){return v.gamme===k;}).length; }

function setHtml(el, h){ el.replaceChildren(); el.insertAdjacentHTML('afterbegin', h); }

function buildCard(v){
  var tagsHtml = v.tags.map(function(t){
    var bg = TAG_BGS[t] || '#F3F4F6';
    var col = TAG_COLORS[t] || '#6B7280';
    return '<span class="mpv-tag" style="background:'+bg+';color:'+col+';">'+esc(t)+'</span>';
  }).join('');
  var venduTag = '<span class="mpv-tag" style="background:'+GAMME_BGS[v.gamme]+';color:'+GAMME_COLORS[v.gamme]+';font-weight:600;">VENDU</span>';
  return '<div class="mpv-card">'
    +'<div class="mpv-card-left">'
      +'<div class="mpv-tags">'+tagsHtml+venduTag+'</div>'
      +'<h3 class="mpv-titre">'+esc(v.titre)+'</h3>'
      +'<p class="mpv-desc">'+esc(v.desc)+'</p>'
      +'<div class="mpv-infos">'
        +'<div><p class="mpv-info-lbl">Ville</p><p class="mpv-info-val" style="font-weight:600">'+esc(v.ville)+'</p></div>'
        +'<div><p class="mpv-info-lbl">Région</p><p class="mpv-info-val">'+esc(v.region)+'</p></div>'
        +'<div><p class="mpv-info-lbl">Vendu</p><p class="mpv-info-val">'+esc(v.mois)+'</p></div>'
      +'</div>'
    +'</div>'
    +'<div class="mpv-card-right">'
      +'<p class="mpv-prix-lbl">Prix de vente</p>'
      +'<p class="mpv-prix">'+fmtPrice(v.prix)+' €</p>'
      +'<div class="mpv-gamme-pill" style="background:'+GAMME_BGS[v.gamme]+';color:'+GAMME_COLORS[v.gamme]+';">'+esc(GAMME_LABELS[v.gamme]||'')+'</div>'
    +'</div>'
  +'</div>';
}

function render(){
  var filtered = STATE.gamme==='all' ? VENDUS : VENDUS.filter(function(v){return v.gamme===STATE.gamme;});
  var sorted = filtered.slice().sort(function(a,b){
    if (STATE.sortBy==='prix-asc') return a.prix - b.prix;
    if (STATE.sortBy==='prix-desc') return b.prix - a.prix;
    return b.id - a.id;
  });
  var listEl = document.getElementById('mpv-list');
  if (listEl) setHtml(listEl, sorted.map(buildCard).join(''));
  // update active filter button
  document.querySelectorAll('.mpv-filter').forEach(function(btn){
    var k = btn.getAttribute('data-gamme');
    if (k === STATE.gamme){
      btn.style.background = '#D85A30'; btn.style.color = 'white'; btn.style.boxShadow = 'none';
    } else {
      btn.style.background = 'white'; btn.style.color = '#6B7280'; btn.style.boxShadow = 'inset 0 0 0 1px #E5E7EB';
    }
  });
}

window.mpvSetGamme = function(g){ STATE.gamme = g; render(); };
window.mpvSetSort = function(s){ STATE.sortBy = s; render(); };

function init(){
  var section = document.getElementById('mp-vendus');
  if (!section) return;
  var totalVendu = VENDUS.reduce(function(s,v){return s+v.prix;}, 0);
  var prixMoyen = Math.round(totalVendu / VENDUS.length);
  var regions = {}; VENDUS.forEach(function(v){regions[v.region]=1;});
  var nbRegions = Object.keys(regions).length;

  var html = ''
    +'<style>'
      +'.mpv-wrap{max-width:1000px;margin:0 auto;padding:8px 0 32px;}'
      +'.mpv-head{text-align:center;margin-bottom:32px;}'
      +'.mpv-eyebrow{font-size:10px;letter-spacing:3px;color:#D85A30;font-weight:600;margin-bottom:8px;}'
      +'.mpv-h1{font-size:32px;font-weight:800;margin-bottom:8px;letter-spacing:-1px;}'
      +'.mpv-sub{font-size:14px;color:#6B7280;max-width:500px;margin:0 auto;}'
      +'.mpv-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:32px;}'
      +'.mpv-stat{background:white;border:1px solid #E5E7EB;border-radius:12px;padding:14px 16px;text-align:center;}'
      +'.mpv-stat-num{font-size:24px;font-weight:700;}'
      +'.mpv-stat-lbl{font-size:10px;color:#9CA3AF;}'
      +'.mpv-filters{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px;}'
      +'.mpv-filters-l{display:flex;gap:6px;flex-wrap:wrap;}'
      +'.mpv-filter{padding:6px 14px;border-radius:20px;font-size:11px;font-weight:500;cursor:pointer;font-family:inherit;border:none;background:white;color:#6B7280;box-shadow:inset 0 0 0 1px #E5E7EB;}'
      +'.mpv-filter .cnt{opacity:.7;margin-left:4px;}'
      +'.mpv-sort{padding:6px 12px;border-radius:8px;border:1px solid #E5E7EB;font-size:11px;font-family:inherit;color:#6B7280;background:white;cursor:pointer;}'
      +'.mpv-list{display:flex;flex-direction:column;gap:10px;}'
      +'.mpv-card{display:grid;grid-template-columns:1fr auto;background:white;border:1px solid #E5E7EB;border-radius:14px;overflow:hidden;}'
      +'.mpv-card-left{padding:18px 20px;}'
      +'.mpv-tags{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;}'
      +'.mpv-tag{font-size:10px;font-weight:500;padding:2px 8px;border-radius:6px;}'
      +'.mpv-titre{font-size:16px;font-weight:700;margin:0 0 4px;}'
      +'.mpv-desc{font-size:12px;color:#6B7280;line-height:1.6;margin:0 0 12px;}'
      +'.mpv-infos{display:flex;gap:24px;flex-wrap:wrap;}'
      +'.mpv-info-lbl{font-size:9px;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;margin:0;}'
      +'.mpv-info-val{font-size:13px;font-weight:500;margin:0;}'
      +'.mpv-card-right{width:180px;padding:18px 20px;border-left:1px solid #E5E7EB;display:flex;flex-direction:column;justify-content:center;align-items:center;background:#FAFAFA;}'
      +'.mpv-prix-lbl{font-size:10px;color:#9CA3AF;margin:0 0 4px;}'
      +'.mpv-prix{font-size:26px;font-weight:800;color:#D85A30;margin:0;}'
      +'.mpv-gamme-pill{margin-top:10px;padding:6px 16px;border-radius:8px;font-size:11px;font-weight:600;text-align:center;}'
      +'.mpv-fourchettes{margin-top:32px;margin-bottom:32px;}'
      +'.mpv-fourchettes-lbl{font-size:10px;letter-spacing:3px;color:#9CA3AF;font-weight:600;margin-bottom:14px;}'
      +'.mpv-f-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;}'
      +'@media(max-width:1000px){.mpv-f-grid{grid-template-columns:repeat(3,1fr);}}'
      +'.mpv-f-card{background:white;border:1px solid #E5E7EB;border-radius:12px;padding:16px;}'
      +'.mpv-f-eyebrow{font-size:9px;letter-spacing:2px;font-weight:600;margin-bottom:4px;}'
      +'.mpv-f-prix{font-size:20px;font-weight:700;color:#1a1a1a;margin-bottom:2px;}'
      +'.mpv-f-sub{font-size:10px;color:#9CA3AF;}'
      +'.mpv-cta{background:white;border:2px solid #D85A30;border-radius:14px;padding:32px;text-align:center;position:relative;overflow:hidden;margin-bottom:32px;}'
      +'.mpv-cta::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#D85A30,#C9A84C,#1D9E75);}'
      +'.mpv-cta h2{font-size:20px;font-weight:800;margin:0 0 6px;}'
      +'.mpv-cta p{font-size:13px;color:#6B7280;margin:0 0 16px;}'
      +'.mpv-cta-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;}'
      +'.mpv-cta-pri{padding:12px 32px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;border:none;background:#D85A30;color:white;}'
      +'.mpv-cta-sec{padding:12px 32px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;border:1px solid #E5E7EB;background:white;color:#1a1a1a;}'
      +'@media(max-width:768px){.mpv-stats,.mpv-f-grid{grid-template-columns:repeat(2,1fr);}.mpv-card{grid-template-columns:1fr;}.mpv-card-right{width:100%;border-left:none;border-top:1px solid #E5E7EB;}.mpv-h1{font-size:24px;}.mpv-infos{gap:14px;}}'
      +'@media(max-width:420px){.mpv-stats,.mpv-f-grid{grid-template-columns:1fr;}.mpv-cta{padding:24px 18px;}.mpv-cta-btns{flex-direction:column;}.mpv-cta-pri,.mpv-cta-sec{width:100%;}}'
    +'</style>'
    +'<div class="mpv-wrap">'
      +'<div class="mpv-head">'
        +'<p class="mpv-eyebrow">MARKETPLACE FORMATION</p>'
        +'<h1 class="mpv-h1">Centres vendus — sept. 2025 à mai 2026</h1>'
        +'<p class="mpv-sub">'+VENDUS.length+' organismes de formation cédés sur les 9 derniers mois via notre plateforme.</p>'
      +'</div>'
      +'<div class="mpv-stats">'
        +'<div class="mpv-stat"><p class="mpv-stat-num" style="color:#D85A30;">'+VENDUS.length+'</p><p class="mpv-stat-lbl">Centres vendus</p></div>'
        +'<div class="mpv-stat"><p class="mpv-stat-num" style="color:#1D9E75;">'+fmtPrice(totalVendu)+' €</p><p class="mpv-stat-lbl">Volume total</p></div>'
        +'<div class="mpv-stat"><p class="mpv-stat-num">'+fmtPrice(prixMoyen)+' €</p><p class="mpv-stat-lbl">Prix moyen</p></div>'
        +'<div class="mpv-stat"><p class="mpv-stat-num" style="color:#534AB7;">'+nbRegions+'</p><p class="mpv-stat-lbl">Régions couvertes</p></div>'
      +'</div>'
      +'<div class="mpv-filters">'
        +'<div class="mpv-filters-l">'
          +'<button class="mpv-filter" data-gamme="all" onclick="mpvSetGamme(\'all\')">Tous <span class="cnt">'+VENDUS.length+'</span></button>'
          +'<button class="mpv-filter" data-gamme="starter" onclick="mpvSetGamme(\'starter\')">NDA + Qualiopi <span class="cnt">'+gammeCount('starter')+'</span></button>'
          +'<button class="mpv-filter" data-gamme="habilitation" onclick="mpvSetGamme(\'habilitation\')">+ Habilitation <span class="cnt">'+gammeCount('habilitation')+'</span></button>'
          +'<button class="mpv-filter" data-gamme="cfa" onclick="mpvSetGamme(\'cfa\')">CFA <span class="cnt">'+gammeCount('cfa')+'</span></button>'
          +'<button class="mpv-filter" data-gamme="edof" onclick="mpvSetGamme(\'edof\')">+ EDOF <span class="cnt">'+gammeCount('edof')+'</span></button>'
          +'<button class="mpv-filter" data-gamme="auto-ecole" onclick="mpvSetGamme(\'auto-ecole\')">Auto-écoles <span class="cnt">'+gammeCount('auto-ecole')+'</span></button>'
        +'</div>'
        +'<select class="mpv-sort" onchange="mpvSetSort(this.value)">'
          +'<option value="date">Plus récents</option>'
          +'<option value="prix-asc">Prix croissant</option>'
          +'<option value="prix-desc">Prix décroissant</option>'
        +'</select>'
      +'</div>'
      +'<div class="mpv-list" id="mpv-list"></div>'
      +'<div class="mpv-fourchettes">'
        +'<p class="mpv-fourchettes-lbl">FOURCHETTES DE PRIX 2026</p>'
        +'<div class="mpv-f-grid">'
          +'<div class="mpv-f-card"><p class="mpv-f-eyebrow" style="color:#534AB7;">NDA + QUALIOPI</p><p class="mpv-f-prix">4 500 — 5 500 €</p><p class="mpv-f-sub">Sans habilitation ni EDOF</p></div>'
          +'<div class="mpv-f-card"><p class="mpv-f-eyebrow" style="color:#C9A84C;">+ HABILITATION</p><p class="mpv-f-prix">5 500 — 8 000 €</p><p class="mpv-f-sub">NDA + Qualiopi + RS/RNCP</p></div>'
          +'<div class="mpv-f-card"><p class="mpv-f-eyebrow" style="color:#378ADD;">CFA</p><p class="mpv-f-prix">15 000 — 24 000 €</p><p class="mpv-f-sub">Mention apprentissage</p></div>'
          +'<div class="mpv-f-card"><p class="mpv-f-eyebrow" style="color:#1D9E75;">+ EDOF</p><p class="mpv-f-prix">12 000 — 55 000 €</p><p class="mpv-f-sub">Majorité autour de 15 000 €</p></div>'
          +'<div class="mpv-f-card"><p class="mpv-f-eyebrow" style="color:#D85A30;">AUTO-ÉCOLES</p><p class="mpv-f-prix">55 000 €</p><p class="mpv-f-sub">Avec agrément et véhicules</p></div>'
        +'</div>'
      +'</div>'
      +'<div class="mpv-cta">'
        +'<h2>Vous souhaitez vendre votre organisme ?</h2>'
        +'<p>Transaction sécurisée, contrat de cession et séquestre inclus. Commission à partir de 7%.</p>'
        +'<div class="mpv-cta-btns">'
          +'<button class="mpv-cta-pri" onclick="if(typeof showPopupVendeur===\'function\')showPopupVendeur();">Publier mon annonce</button>'
          +'<button class="mpv-cta-sec" onclick="if(typeof showPopupVendeur===\'function\')showPopupVendeur();">Estimer la valeur de mon OF</button>'
        +'</div>'
      +'</div>'
    +'</div>';

  setHtml(section, html);
  render();
}

if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
