// ═══════════════════════════════════════
//  creer-certifier.js — Tariff grid by domain
//  All rendered fields are escaped via escapeHtml().
//  No user-supplied string is ever rendered to the DOM:
//  - DOMAINS, PHASES, STATS, COMPARE_ROWS are static constants
//  - state.search is only used as a filter predicate
// ═══════════════════════════════════════

const SVG = (c, body) => '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="' + c + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + body + '</svg>';
const ICONS = {
  bureautique:   c => SVG(c, '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>'),
  langues:       c => SVG(c, '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'),
  soft_skills:   c => SVG(c, '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),
  commerce:      c => SVG(c, '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>'),
  marketing:     c => SVG(c, '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'),
  rh:            c => SVG(c, '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
  comptabilite:  c => SVG(c, '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'),
  digital:       c => SVG(c, '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>'),
  securite:      c => SVG(c, '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),
  immobilier:    c => SVG(c, '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'),
  coaching:      c => SVG(c, '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>'),
  management:    c => SVG(c, '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>'),
  pedagogie:     c => SVG(c, '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'),
  artisanat:     c => SVG(c, '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'),
  restauration:  c => SVG(c, '<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>'),
  logistique:    c => SVG(c, '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>'),
  agriculture:   c => SVG(c, '<path d="M12 22c4-4 8-7.5 8-12a8 8 0 1 0-16 0c0 4.5 4 8 8 12z"/><circle cx="12" cy="10" r="3"/>'),
  environnement: c => SVG(c, '<path d="M17 8C8 10 5.9 16.17 3.82 21.34L2 21l.65-1.65C4.6 14 8 6 17 4c0 0-1 4 0 4z"/><path d="M20.5 7.5L21 3l-4.5.5"/>'),
  social:        c => SVG(c, '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>'),
  juridique:     c => SVG(c, '<line x1="12" y1="3" x2="12" y2="15"/><line x1="5" y1="7" x2="19" y2="7"/><path d="M5 7l2 8h0"/><path d="M19 7l-2 8h0"/><line x1="2" y1="21" x2="22" y2="21"/><line x1="12" y1="15" x2="12" y2="21"/>'),
  batiment:      c => SVG(c, '<rect x="4" y="2" width="16" height="20" rx="1"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><path d="M9 18h6v4H9z"/>'),
  industrie:     c => SVG(c, '<path d="M2 20h20"/><path d="M5 20V8l5 4V8l5 4V4l5 4v12"/>'),
  sante:         c => SVG(c, '<line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><rect x="7" y="7" width="10" height="10" rx="1"/>'),
  aeronautique:  c => SVG(c, '<path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>'),
};

const DOMAINS = [
  { id:'bureautique', name:'Bureautique & Outils numériques', type:'RS', examples:'Excel, TOSA, ICDL, Google Workspace, LibreOffice', price:6990, priceMax:8900, duration:'6-7 mois', complexity:1, color:'#378ADD', reason:"Référentiels standardisés, compétences transversales bien documentées, peu de données terrain à collecter. Marché très concurrentiel avec beaucoup de certifications existantes — le positionnement doit être précis." },
  { id:'langues', name:'Langues étrangères', type:'RS', examples:'Anglais professionnel, FLE, Espagnol commercial, Allemand technique', price:6990, priceMax:9500, duration:'6-8 mois', complexity:1, color:'#378ADD', reason:"Cadres de référence européens (CECRL) bien établis. Toutefois, France Compétences exige une réelle valeur ajoutée par rapport aux certifications existantes (TOEIC, Bright, etc.) — le positionnement sectoriel est clé." },
  { id:'soft_skills', name:'Soft Skills & Communication', type:'RS', examples:'Prise de parole, leadership, gestion des conflits, intelligence émotionnelle', price:7490, priceMax:9900, duration:'6-8 mois', complexity:2, color:'#378ADD', reason:"Compétences transversales avec référentiels à construire sur mesure. La difficulté réside dans l'objectivation des critères d'évaluation — France Compétences exige des indicateurs mesurables, pas seulement qualitatifs." },
  { id:'commerce', name:'Commerce & Vente', type:'RS', examples:'Techniques de vente B2B, négociation, relation client, e-commerce', price:7490, priceMax:10500, duration:'6-8 mois', complexity:2, color:'#1D9E75', reason:"Domaine bien documenté avec des données d'insertion disponibles. La complexité vient du positionnement face aux nombreux titres RNCP existants en commerce." },
  { id:'marketing', name:'Marketing & Communication digitale', type:'RS', examples:'SEO/SEA, réseaux sociaux, marketing automation, growth hacking, IA marketing', price:7990, priceMax:11000, duration:'7-8 mois', complexity:2, color:'#1D9E75', reason:"Évolution rapide des compétences — le référentiel doit démontrer une veille permanente. Les données d'insertion sont favorables mais les métiers évoluent vite, ce qui impacte la durée d'enregistrement." },
  { id:'rh', name:'Ressources Humaines', type:'RS', examples:'Gestion de la paie, recrutement digital, administration du personnel, GPEC', price:7990, priceMax:11500, duration:'7-9 mois', complexity:2, color:'#1D9E75', reason:"Cadre réglementaire dense (Code du travail, conventions collectives). Les référentiels doivent intégrer les obligations légales et les évolutions sociales. Données d'insertion solides." },
  { id:'comptabilite', name:'Comptabilité & Finance', type:'RS', examples:'Comptabilité analytique, contrôle de gestion, trésorerie, fiscalité PME', price:8500, priceMax:12000, duration:'7-9 mois', complexity:2, color:'#7F77DD', reason:"Normes comptables strictes (PCG, IFRS). Le référentiel doit s'aligner sur un cadre normatif exigeant. Données d'insertion et d'employabilité très bien documentées." },
  { id:'digital', name:'Développement web & Tech', type:'RS', examples:'Développement front/back, DevOps, cloud, cybersécurité, data, IA', price:8900, priceMax:13000, duration:'7-9 mois', complexity:3, color:'#7F77DD', reason:"Compétences techniques en mutation permanente. Nécessite des référentiels modulaires et une veille technologique. Le positionnement RS vs RNCP est stratégique — beaucoup de certifications tech visent le RNCP." },
  { id:'securite', name:'Sécurité & Prévention', type:'RS', examples:'SST, SSIAP, habilitations électriques, sécurité incendie, prévention risques', price:8900, priceMax:13500, duration:'7-10 mois', complexity:3, color:'#7F77DD', reason:"Cadre réglementaire très strict (Code du travail, réglementation ERP). Habilitations préfectorales souvent nécessaires en parallèle. Exigences de conformité matérielle et de suivi des certifiés." },
  { id:'immobilier', name:'Immobilier & Patrimoine', type:'RS', examples:'Transaction immobilière, gestion locative, diagnostics, patrimoine, syndic', price:9500, priceMax:14000, duration:'8-10 mois', complexity:3, color:'#BA7517', reason:"Réglementation loi Hoguet, ALUR, Elan. Les certifications doivent prouver la conformité aux obligations de formation continue des agents immobiliers. Données d'insertion spécifiques au secteur." },
  { id:'coaching', name:'Coaching & Accompagnement', type:'RNCP', examples:'Coach professionnel, bilan de compétences, consultant, mentor, médiateur', price:9900, priceMax:15000, duration:'8-10 mois', complexity:3, color:'#BA7517', reason:"Le RNCP exige la démonstration d'un métier à part entière (pas seulement une compétence). Nécessite des données d'insertion sur au moins 2 promotions, des blocs de compétences structurés, et un cadre d'évaluation avec jury." },
  { id:'management', name:"Management & Gestion d'entreprise", type:'RNCP', examples:"Manager opérationnel, directeur de projet, responsable d'équipe, CEO, DGA", price:10500, priceMax:16000, duration:'8-10 mois', complexity:3, color:'#BA7517', reason:"Certifications RNCP niveau 5 à 7. Concurrence forte avec les titres existants. Nécessite une étude d'opportunité approfondie et un positionnement précis dans la nomenclature ROME." },
  { id:'pedagogie', name:'Pédagogie & Formation', type:'RNCP', examples:'Formateur professionnel, ingénieur pédagogique, responsable de formation', price:10500, priceMax:16500, duration:'8-11 mois', complexity:4, color:'#D85A30', reason:"Domaine directement lié au secteur de la formation — France Compétences examine ces dossiers avec une attention particulière. Le positionnement par rapport au titre FPA est stratégique." },
  { id:'artisanat', name:'Artisanat & Métiers manuels', type:'RNCP', examples:'Boulanger, coiffeur, électricien, plombier, carreleur, ébéniste, mécanicien', price:11000, priceMax:17000, duration:'9-11 mois', complexity:4, color:'#D85A30', reason:"Référentiels très techniques avec exigences matérielles (ateliers, plateaux techniques). L'évaluation nécessite des mises en situation professionnelle. Implication des branches et CPC obligatoire." },
  { id:'restauration', name:'Hôtellerie, Restauration & Tourisme', type:'RNCP', examples:'Chef cuisinier, sommelier, réceptionniste, guide touristique, barman, pâtissier', price:11500, priceMax:17500, duration:'9-11 mois', complexity:4, color:'#D85A30', reason:"Réglementation hygiène (HACCP), normes de service, saisonnalité. Les évaluations pratiques nécessitent des environnements spécifiques. Données d'insertion à collecter sur des bassins d'emploi variés." },
  { id:'logistique', name:'Logistique & Transport', type:'RNCP', examples:'Responsable logistique, gestionnaire de flux, agent de transit, supply chain', price:11500, priceMax:18000, duration:'9-11 mois', complexity:4, color:'#D85A30', reason:"Réglementation transport (Code des transports, ADR matières dangereuses). Habilitations préfectorales souvent requises. Implication obligatoire des OPCO transport et des branches professionnelles." },
  { id:'agriculture', name:'Agriculture & Agroalimentaire', type:'RNCP', examples:'Technicien agricole, responsable qualité agro, viticulture, aquaculture', price:12000, priceMax:18000, duration:'9-11 mois', complexity:4, color:'#D85A30', reason:"Réglementation PAC, normes phytosanitaires, labels qualité (AOP, IGP). Évaluations terrain obligatoires. Implication des chambres d'agriculture et des branches agricoles." },
  { id:'environnement', name:'Environnement & Développement durable', type:'RNCP', examples:'Responsable RSE, auditeur énergie, consultant QHSE, économie circulaire', price:12000, priceMax:18500, duration:'9-12 mois', complexity:4, color:'#D85A30', reason:"Domaine émergent avec réglementation en évolution rapide (loi Climat, CSRD, taxonomie UE). Veille réglementaire permanente. France Compétences vérifie l'adéquation avec les transitions écologiques — axe renforcé Vademecum 2026." },
  { id:'social', name:'Social, Médico-social & Petite enfance', type:'RNCP', examples:'Éducateur, aide à domicile, médiateur social, assistant maternel, animateur EHPAD', price:13500, priceMax:19500, duration:'10-12 mois', complexity:5, color:'#E24B4A', reason:"Réglementation CASF, agrément préfectoral, conventions DREETS. Les référentiels doivent intégrer des situations de vulnérabilité. Jurys avec professionnels du secteur et représentants des usagers." },
  { id:'juridique', name:'Juridique & Conformité', type:'RNCP', examples:"Juriste d'entreprise, DPO/RGPD, compliance officer, médiateur juridique", price:14000, priceMax:20000, duration:'10-12 mois', complexity:5, color:'#E24B4A', reason:"Le droit est un domaine réglementé (professions protégées). Le positionnement doit éviter les chevauchements avec les diplômes d'État (CRFPA, notariat). Exigences de rigueur des référentiels maximales." },
  { id:'batiment', name:'BTP & Construction', type:'RNCP', examples:'Conducteur de travaux, chef de chantier, diagnostiqueur, BIM manager, géomètre', price:14500, priceMax:21000, duration:'10-12 mois', complexity:5, color:'#E24B4A', reason:"Réglementation technique dense (DTU, Eurocodes, RE2020). Exigences de sécurité et de conformité matérielle. Implication des branches BTP et des CPC. Plateaux techniques pour les évaluations pratiques." },
  { id:'industrie', name:'Industrie & Production', type:'RNCP', examples:'Technicien maintenance, opérateur CNC, responsable qualité, ingénieur process', price:15000, priceMax:22000, duration:'10-12 mois', complexity:5, color:'#E24B4A', reason:"Normes industrielles strictes (ISO 9001, ISO 14001, IATF 16949). Évaluations sur plateaux techniques spécialisés. Implication obligatoire des branches (UIMM, chimie). Coûts d'infrastructure élevés." },
  { id:'sante', name:'Santé & Paramédical', type:'RNCP', examples:'Praticien bien-être, naturopathe, préparateur pharmacie, aide-soignant, ergothérapeute', price:16500, priceMax:25000, duration:'10-12 mois', complexity:5, color:'#E24B4A', reason:"Domaine le plus réglementé. Code de la santé publique, ARS, ordres professionnels. Certaines professions protégées — positionnement chirurgical. Données d'insertion et suivi des certifiés maximum. Jurys avec professionnels de santé." },
  { id:'aeronautique', name:'Aéronautique, Défense & Spatial', type:'RNCP', examples:'Technicien aéronautique, pilote de drone, ingénieur systèmes embarqués, spatial', price:18000, priceMax:25000, duration:'10-12 mois', complexity:5, color:'#E24B4A', reason:"Normes EN 9100, réglementation DGAC/EASA, habilitations de sécurité. Plus haut niveau d'exigence technique et réglementaire. Processus de validation impliquant des organismes d'État. Coûts de certification et audits externes inclus." },
];

const COMPLEXITY_LABELS = ['', 'Accessible', 'Modéré', 'Intermédiaire', 'Complexe', 'Très complexe'];
const TYPE_INFO = {
  RS:   { label: 'Répertoire Spécifique', color: '#378ADD', bg: '#E6F1FB' },
  RNCP: { label: 'RNCP',                  color: '#D85A30', bg: '#FAECE7' },
};

const PHASES = [
  { id:1, title:"Cadrage & Étude d'opportunité", duration:'Mois 1-2', weeks:'Sem. 1 à 8', color:'#378ADD', barW:30, desc:"Analyse du marché, identification du besoin en compétences, positionnement par rapport aux certifications existantes.", tasks:['Étude de marché sectorielle','Identification métiers / compétences','Positionnement RS ou RNCP','Vérification doublons',"Note d'opportunité"], deliverable:"Note d'opportunité validée" },
  { id:2, title:'Construction des référentiels', duration:'Mois 2-4', weeks:'Sem. 5 à 16', color:'#7F77DD', barW:45, desc:"Rédaction des référentiels conformes au Vademecum 2026 de France Compétences.", tasks:['Analyse situations de travail',"Référentiel d'activités",'Référentiel compétences / blocs',"Référentiel d'évaluation",'Prérequis et public visé'], deliverable:'3 référentiels conformes' },
  { id:3, title:'Constitution du dossier', duration:'Mois 4-6', weeks:'Sem. 16 à 24', color:'#D85A30', barW:35, desc:"Assemblage du dossier CERTIF PRO avec toutes les pièces justificatives.", tasks:['Rédaction dossier CERTIF PRO',"Données d'insertion",'Tableurs parcours','Pièces juridiques','Contrôle qualité'], deliverable:'Dossier prêt au dépôt' },
  { id:4, title:'Dépôt France Compétences', duration:'Mois 6-7', weeks:'Sem. 24 à 28', color:'#1D9E75', barW:18, desc:"Soumission sur CERTIF PRO et vérification de complétude administrative.", tasks:['Dépôt CERTIF PRO','Complétude administrative','Demandes complémentaires','Suivi instruction'], deliverable:'Accusé de réception' },
  { id:5, title:'Instruction & Commission', duration:'Mois 7-10', weeks:'Sem. 28 à 40', color:'#BA7517', barW:50, desc:"Instruction par France Compétences, rapport de supervision, passage en Commission CCP.", tasks:['Instruction critères','Rapport de supervision','Échanges instructeur','Commission CCP','Avis conforme'], deliverable:'Avis Commission CCP' },
  { id:6, title:'Décision & Publication', duration:'Mois 10-12', weeks:'Sem. 40 à 48', color:'#1D9E75', barW:30, desc:"Décision d'enregistrement, publication au Journal Officiel, activation RNCP/RS.", tasks:['Décision enregistrement','Publication JO','Activation répertoire','Éligibilité CPF','Habilitations partenaires'], deliverable:'Certification enregistrée' },
];

const STATS = [
  { label:'Durée moyenne', value:'8 mois' },
  { label:'Taux de réussite LFO', value:'72%' },
  { label:'Enregistrement', value:'5 ans' },
  { label:'Domaines couverts', value:'24' },
];

const COMPARE_ROWS = [
  ['Objet','Compétences complémentaires','Certification métier complète'],
  ['Niveaux','Pas de niveau','Niveaux 2 à 8'],
  ['Blocs de compétences','Non obligatoires','Obligatoires'],
  ['CPF 2026','Plafonné à 1 500 €','Sans plafond'],
  ['Critères France Compétences','6 critères','9 critères'],
  ["Données d'insertion",'Non exigées (1er dépôt)','2 promotions minimum'],
  ["Durée enregistrement",'5 ans max','5 ans max'],
  ['Tarif LFO','6 990 – 14 000 €','9 900 – 25 000 €'],
  ['Durée moyenne','6 à 9 mois','8 à 12 mois'],
  ['Taux acceptation (marché)','10-15%','30-40%'],
  ['Taux acceptation LFO','72%','72%'],
];

const fmt = n => new Intl.NumberFormat('fr-FR').format(n) + ' €';
const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

const state = {
  filter: 'all',
  search: '',
  sortBy: 'price',
  expandedDomain: null,
  expandedPhase: 1,
};

function setHTML(el, html) { el.innerHTML = html; }

function renderTimeline() {
  const rows = PHASES.map(p =>
    '<div class="cc-tl-row">' +
      '<div class="cc-tl-num" style="background:' + p.color + '15;color:' + p.color + ';">' + p.id + '</div>' +
      '<div style="flex:1">' +
        '<div class="cc-tl-title">' + escapeHtml(p.title) + '</div>' +
        '<div class="cc-tl-sub">' + escapeHtml(p.duration) + '</div>' +
      '</div>' +
      '<div class="cc-tl-bar" style="width:' + p.barW + '%;background:' + p.color + ';"></div>' +
    '</div>'
  ).join('');
  setHTML(document.getElementById('ccTimelineRows'), rows);
}

function renderStats() {
  const html = STATS.map(s =>
    '<div class="cc-stat">' +
      '<div class="cc-stat-val">' + escapeHtml(s.value) + '</div>' +
      '<div class="cc-stat-lab">' + escapeHtml(s.label) + '</div>' +
      (s.value === '72%' ? '<div class="cc-stat-note">2× la moyenne du marché</div>' : '') +
    '</div>'
  ).join('');
  setHTML(document.getElementById('ccStats'), html);
}

function renderPills() {
  const pills = document.getElementById('ccPills');
  const rsCount = DOMAINS.filter(d => d.type === 'RS').length;
  const rncpCount = DOMAINS.filter(d => d.type === 'RNCP').length;
  pills.querySelector('[data-filter="all"]').textContent = 'Tous (' + DOMAINS.length + ')';
  pills.querySelector('[data-filter="RS"]').textContent = 'RS (' + rsCount + ')';
  pills.querySelector('[data-filter="RNCP"]').textContent = 'RNCP (' + rncpCount + ')';
  pills.querySelectorAll('[data-filter]').forEach(b => {
    b.classList.remove('on', 'on-rs', 'on-rncp');
    if (b.dataset.filter === state.filter) {
      if (state.filter === 'RS') b.classList.add('on-rs');
      else if (state.filter === 'RNCP') b.classList.add('on-rncp');
      else b.classList.add('on');
    }
  });
}

function getFiltered() {
  let list = DOMAINS.slice();
  if (state.filter !== 'all') list = list.filter(d => d.type === state.filter);
  if (state.search) {
    const q = state.search.toLowerCase();
    list = list.filter(d => d.name.toLowerCase().includes(q) || d.examples.toLowerCase().includes(q));
  }
  if (state.sortBy === 'price') list.sort((a, b) => a.price - b.price);
  else if (state.sortBy === 'complexity') list.sort((a, b) => a.complexity - b.complexity);
  else list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}

function renderDomains() {
  const root = document.getElementById('ccDomains');
  const list = getFiltered();
  document.getElementById('ccSecSub').textContent = DOMAINS.length + ' domaines · De ' + fmt(6990) + ' à ' + fmt(25000);

  if (list.length === 0) {
    setHTML(root,
      '<div class="cc-empty">' +
        '<div style="font-size:15px;margin-bottom:8px;">Aucun domaine trouvé</div>' +
        '<button onclick="resetFilters()">Réinitialiser</button>' +
      '</div>'
    );
    return;
  }

  const html = list.map((d, i) => {
    const ti = TYPE_INFO[d.type];
    const isOpen = state.expandedDomain === d.id;
    const icon = ICONS[d.id] ? ICONS[d.id](d.color) : '';
    const dotsCplx = [1,2,3,4,5].map(n =>
      '<div class="cc-dom-cplx-dot" style="background:' + (n<=d.complexity ? d.color : '#eee') + ';"></div>'
    ).join('');
    const dotsCplxSmall = [1,2,3,4,5].map(n =>
      '<div style="width:4px;height:12px;border-radius:2px;background:' + (n<=d.complexity ? d.color : '#ddd') + ';"></div>'
    ).join('');
    const fillLeft = (d.price - 6990) / (25000 - 6990) * 100;
    const fillWidth = (d.priceMax - d.price) / (25000 - 6990) * 100;
    const cardStyle = isOpen ? 'border:1.5px solid ' + d.color + ';background:' + d.color + '03;' : '';

    return '' +
      '<div class="cc-dom ' + (isOpen ? 'open' : '') + '" data-id="' + escapeHtml(d.id) + '" style="animation-delay:' + (i*25) + 'ms;' + cardStyle + '">' +
        '<div class="cc-dom-head" onclick="toggleDomain(\'' + escapeHtml(d.id) + '\')">' +
          '<div class="cc-dom-icon" style="background:' + d.color + '10;">' + icon + '</div>' +
          '<div class="cc-dom-info">' +
            '<div class="cc-dom-titlerow">' +
              '<span class="cc-dom-name">' + escapeHtml(d.name) + '</span>' +
              '<span class="cc-dom-badge" style="background:' + ti.bg + ';color:' + ti.color + ';">' + escapeHtml(d.type) + '</span>' +
            '</div>' +
            '<div class="cc-dom-ex">' + escapeHtml(d.examples) + '</div>' +
          '</div>' +
          '<div class="cc-dom-cplx">' +
            dotsCplx +
            '<span class="cc-dom-duration">' + escapeHtml(d.duration) + '</span>' +
          '</div>' +
          '<div class="cc-dom-price">' +
            '<div class="cc-dom-price-lab">À partir de</div>' +
            '<div class="cc-dom-price-val">' + fmt(d.price) + '</div>' +
          '</div>' +
          '<svg class="cc-dom-caret" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>' +
        '</div>' +
        '<div class="cc-dom-body">' +
          '<div class="cc-dom-divider"></div>' +
          '<div class="cc-dom-cols">' +
            '<div>' +
              '<div class="cc-dom-h">Pourquoi ce tarif ?</div>' +
              '<p class="cc-dom-p">' + escapeHtml(d.reason) + '</p>' +
              '<div class="cc-dom-h">Exemples de certifications</div>' +
              '<div class="cc-dom-ex-full">' + escapeHtml(d.examples) + '</div>' +
            '</div>' +
            '<div>' +
              '<div class="cc-fork">' +
                '<div class="cc-fork-head">' +
                  '<span class="cc-fork-lab">Fourchette tarifaire</span>' +
                  '<span class="cc-fork-crit">' + (d.type === 'RS' ? '6 critères' : '9 critères') + '</span>' +
                '</div>' +
                '<div class="cc-fork-track">' +
                  '<div class="cc-fork-fill" style="left:' + fillLeft + '%;width:' + fillWidth + '%;background:linear-gradient(90deg,' + d.color + '80,' + d.color + ');"></div>' +
                '</div>' +
                '<div class="cc-fork-vals">' +
                  '<div>' +
                    '<div class="cc-fork-val-lab">Minimum</div>' +
                    '<div class="cc-fork-val">' + fmt(d.price) + '</div>' +
                  '</div>' +
                  '<div style="text-align:right;">' +
                    '<div class="cc-fork-val-lab">Maximum</div>' +
                    '<div class="cc-fork-val">' + fmt(d.priceMax) + '</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<div class="cc-pay-row">' +
                '<div class="cc-pay-box">' +
                  '<div class="cc-pay-lab">Comptant</div>' +
                  '<div class="cc-pay-val">' + fmt(d.price) + '</div>' +
                '</div>' +
                '<div class="cc-pay-box">' +
                  '<div class="cc-pay-lab">En 3×</div>' +
                  '<div class="cc-pay-val">' + fmt(Math.ceil(d.price/3)) + ' <small>×3</small></div>' +
                '</div>' +
              '</div>' +
              '<div class="cc-meta-row">' +
                '<div class="cc-meta-box" style="background:' + d.color + '08;">' +
                  '<div style="display:flex;gap:2px;">' + dotsCplxSmall + '</div>' +
                  '<span class="cc-meta-lab" style="color:' + d.color + ';">' + escapeHtml(COMPLEXITY_LABELS[d.complexity]) + '</span>' +
                '</div>' +
                '<div class="cc-meta-box dur-bg">' +
                  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
                  '<span class="cc-meta-lab" style="color:#666;">' + escapeHtml(d.duration) + '</span>' +
                '</div>' +
              '</div>' +
              '<button class="cc-cta-btn" onclick="orderDomain(\'' + escapeHtml(d.id) + '\')">Demander un devis</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }).join('');
  setHTML(root, html);
}

function toggleDomain(id) {
  state.expandedDomain = state.expandedDomain === id ? null : id;
  renderDomains();
}

function resetFilters() {
  state.filter = 'all';
  state.search = '';
  document.getElementById('ccSearch').value = '';
  renderPills();
  renderDomains();
}

function orderDomain(id) {
  const d = DOMAINS.find(x => x.id === id);
  if (!d) return;
  if (window.gtag) {
    window.gtag('event', 'certification_quote_request', { domain: id, type: d.type, price: d.price });
  }
  if (window.showExpertPopup) {
    try { window.showExpertPopup({ subject: 'Certification ' + d.name + ' (' + d.type + ')', domain: id }); }
    catch (e) { window.showExpertPopup(); }
  } else {
    window.location.href = 'service-centre-certifie.html?domain=' + encodeURIComponent(id);
  }
}

function renderCompare() {
  const html = COMPARE_ROWS.map((row, i) => {
    const isLFO = row[0].indexOf('LFO') !== -1 && i === 10;
    const cls = isLFO ? 'highlight' : '';
    const note = isLFO ? '<span class="highlight-note">2× le marché</span>' : '';
    return '<tr class="' + cls + '">' +
      '<td>' + escapeHtml(row[0]) + note + '</td>' +
      '<td class="center">' + escapeHtml(row[1]) + '</td>' +
      '<td class="center">' + escapeHtml(row[2]) + '</td>' +
    '</tr>';
  }).join('');
  setHTML(document.getElementById('ccCompareBody'), html);
}

function renderPhases() {
  const html = PHASES.map(p => {
    const isOpen = state.expandedPhase === p.id;
    const numStyle = isOpen
      ? 'background:' + p.color + ';color:#fff;'
      : 'background:' + p.color + '12;color:' + p.color + ';';
    const cardStyle = isOpen ? 'border:1.5px solid ' + p.color + ';background:' + p.color + '04;' : '';
    const tasks = p.tasks.map(t =>
      '<div class="cc-phase-task">' +
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="' + p.color + '" stroke-width="2.5" style="margin-top:1px;flex-shrink:0;"><polyline points="20 6 9 17 4 12"/></svg>' +
        escapeHtml(t) +
      '</div>'
    ).join('');
    return '<div class="cc-phase ' + (isOpen ? 'open' : '') + '" data-pid="' + p.id + '" style="' + cardStyle + '">' +
      '<div class="cc-phase-head" onclick="togglePhase(' + p.id + ')">' +
        '<div class="cc-phase-num" style="' + numStyle + '">0' + p.id + '</div>' +
        '<div class="cc-phase-info">' +
          '<div class="cc-phase-title">' + escapeHtml(p.title) + '</div>' +
          '<div class="cc-phase-sub">' + escapeHtml(p.duration) + ' · ' + escapeHtml(p.weeks) + '</div>' +
        '</div>' +
        '<div class="cc-phase-bar">' +
          '<div class="cc-phase-bar-fill" style="width:' + p.barW + '%;background:' + p.color + ';"></div>' +
        '</div>' +
        '<svg class="caret" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2" style="transition:transform .2s;"><polyline points="6 9 12 15 18 9"/></svg>' +
      '</div>' +
      '<div class="cc-phase-body">' +
        '<div class="cc-phase-divider"></div>' +
        '<p class="cc-phase-desc">' + escapeHtml(p.desc) + '</p>' +
        '<div class="cc-phase-tasks">' + tasks + '</div>' +
        '<div class="cc-phase-deliv" style="border:1px solid ' + p.color + '20;">' +
          '<div class="cc-phase-deliv-l">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' +
            '<span>Livrable : ' + escapeHtml(p.deliverable) + '</span>' +
          '</div>' +
          '<span class="cc-phase-deliv-r">' + escapeHtml(p.weeks) + '</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
  setHTML(document.getElementById('ccPhases'), html);
}

function togglePhase(id) {
  state.expandedPhase = state.expandedPhase === id ? null : id;
  renderPhases();
}

document.getElementById('ccPills').addEventListener('click', e => {
  const btn = e.target.closest('[data-filter]');
  if (!btn) return;
  state.filter = btn.dataset.filter;
  renderPills();
  renderDomains();
});
document.getElementById('ccSearch').addEventListener('input', e => {
  state.search = e.target.value;
  renderDomains();
});
document.getElementById('ccSort').addEventListener('change', e => {
  state.sortBy = e.target.value;
  renderDomains();
});

window.toggleDomain = toggleDomain;
window.togglePhase = togglePhase;
window.resetFilters = resetFilters;
window.orderDomain = orderDomain;

renderTimeline();
renderStats();
renderPills();
renderDomains();
renderCompare();
renderPhases();
