/* recherche-habilitation.html — moteur de recherche local + popup avec liste complète */
(function(){
// Codes des habilitations les plus demandées (rubrique en tête de popup)
var RH_POPULAR = [
  'RS6168', // TOSA Excel
  'RS4731', // SST
  'RS5552', // TOEIC anglais
  'RS6204', // Linguaskill
  'RS5186', // CACES R489
  'RS5674', // Habilitation électrique BR/BC
  'RS4495', // HACCP
  'RS6132', // AFGSU 1
  'RNCP37275', // Coach professionnel
  'RS6452', // IA générative
  'RS6054', // Accompagner les transitions pro
  'RS6169'  // TOSA Word
];

// Liste curée de domaines (alignée sur monaccesedof.html)
var RH_DOMAINS = [
  { id:'btp', name:'Bâtiment & Travaux Publics', certs:[
    {code:'RS5186',label:'CACES R489 — Chariots élévateurs',tag:'3 sem.'},
    {code:'RS5674',label:'Habilitation électrique BR/BC',tag:'2 sem.'},
    {code:'RS6219',label:'Travaux en hauteur & port du harnais',tag:'2 sem.'},
    {code:'RS4618',label:'Échafaudage R408',tag:'3 sem.'},
    {code:'RS6398',label:'Amiante sous-section 4',tag:'5 sem.'},
    {code:'RS5187',label:'CACES R482 — Engins de chantier',tag:'3 sem.'},
    {code:'RS5990',label:'CACES R486 — PEMP',tag:'3 sem.'},
    {code:'RS5991',label:'Habilitation électrique H0B0',tag:'1 sem.'},
    {code:'RS6400',label:'Soudure TIG / MIG-MAG',tag:'6 sem.'}
  ]},
  { id:'securite', name:'Sécurité & Prévention', certs:[
    {code:'RS4731',label:'SST — Sauveteur Secouriste du Travail',tag:'2 sem.'},
    {code:'RS2533',label:'SSIAP 1',tag:'4 sem.'},
    {code:'RS2534',label:'SSIAP 2',tag:'4 sem.'},
    {code:'RS2535',label:'SSIAP 3',tag:'5 sem.'},
    {code:'RS5042',label:'PRAP',tag:'3 sem.'},
    {code:'RS2536',label:'CQP APS',tag:'6 sem.'},
    {code:'RS3113',label:'MAC APS',tag:'1 sem.'},
    {code:'RS6120',label:'Gestes et postures',tag:'1 sem.'}
  ]},
  { id:'transport', name:'Transport & Logistique', certs:[
    {code:'RS5617',label:'FIMO Marchandises',tag:'6 sem.'},
    {code:'RS5618',label:'FIMO Voyageurs',tag:'6 sem.'},
    {code:'RS5619',label:'FCO Marchandises',tag:'1 sem.'},
    {code:'RS5620',label:'FCO Voyageurs',tag:'1 sem.'},
    {code:'RS6033',label:'ADR — Matières dangereuses',tag:'4 sem.'},
    {code:'RS6034',label:'Taxi — Examen pro',tag:'5 sem.'},
    {code:'RS6035',label:'VTC — Examen pro',tag:'4 sem.'},
    {code:'RS6036',label:'Ambulancier — DEA',tag:'8 sem.'}
  ]},
  { id:'numerique', name:'Numérique & Bureautique', certs:[
    {code:'RS6168',label:'TOSA Excel',tag:'2 sem.'},
    {code:'RS6169',label:'TOSA Word',tag:'2 sem.'},
    {code:'RS6170',label:'TOSA PowerPoint',tag:'2 sem.'},
    {code:'RS6200',label:'PIX — Compétences numériques',tag:'3 sem.'},
    {code:'RS6452',label:'Outils IA générative',tag:'2 sem.'},
    {code:'RS6500',label:'Dev web HTML/CSS/JS',tag:'5 sem.'},
    {code:'RS6501',label:'Python data',tag:'6 sem.'},
    {code:'RS6502',label:'Cybersécurité',tag:'4 sem.'},
    {code:'RS6503',label:'Gestion projet agile',tag:'3 sem.'}
  ]},
  { id:'langues', name:'Langues', certs:[
    {code:'RS5552',label:'TOEIC (anglais)',tag:'4 sem.'},
    {code:'RS6204',label:'Linguaskill (anglais pro)',tag:'3 sem.'},
    {code:'RS5633',label:'Bright — Anglais',tag:'3 sem.'},
    {code:'RS5608',label:'DCL — Espagnol',tag:'4 sem.'},
    {code:'RS5609',label:'DCL — Allemand',tag:'4 sem.'},
    {code:'RS5610',label:'DCL — Italien',tag:'4 sem.'},
    {code:'RS5611',label:'FLE — Français Langue Étrangère',tag:'6 sem.'}
  ]},
  { id:'sante', name:'Santé & Social', certs:[
    {code:'RS6132',label:'AFGSU niveau 1',tag:'2 sem.'},
    {code:'RS6133',label:'AFGSU niveau 2',tag:'3 sem.'},
    {code:'RS5567',label:'ADVF — Aide aux familles',tag:'8 sem.'},
    {code:'RS4495',label:'HACCP — Hygiène alimentaire',tag:'2 sem.'},
    {code:'RS5300',label:'Aide-soignant DEAS',tag:'8 sem.'},
    {code:'RS5302',label:'CAP AEPE petite enfance',tag:'7 sem.'}
  ]},
  { id:'bien-etre', name:'Bien-être & Massage', certs:[
    {code:'RS6300',label:'Praticien massage bien-être',tag:'4 sem.'},
    {code:'RS6301',label:'Réflexologie plantaire',tag:'5 sem.'},
    {code:'RS6302',label:'Naturopathie',tag:'10 sem.'},
    {code:'RS6303',label:'Sophrologue praticien',tag:'8 sem.'},
    {code:'RS6304',label:'Hypnose Ericksonienne',tag:'6 sem.'}
  ]},
  { id:'commerce', name:'Commerce & Vente', certs:[
    {code:'RS5900',label:'Techniques de vente B2C',tag:'4 sem.'},
    {code:'RS5901',label:'Négociation B2B',tag:'5 sem.'},
    {code:'RS5902',label:'Management équipe commerciale',tag:'6 sem.'},
    {code:'RS5905',label:'Marketing digital SEO/SEA',tag:'5 sem.'},
    {code:'RS5906',label:'E-commerce boutique en ligne',tag:'5 sem.'}
  ]},
  { id:'creatif', name:'Création & Design', certs:[
    {code:'RS6000',label:'Styliste ongulaire',tag:'3 sem.'},
    {code:'RS6001',label:'Maquillage professionnel',tag:'4 sem.'},
    {code:'RS6004',label:'Graphiste identité visuelle',tag:'6 sem.'},
    {code:'RS6005',label:'Décoration intérieur',tag:'7 sem.'}
  ]},
  { id:'sport', name:'Sport & Animation', certs:[
    {code:'RS5800',label:'BPJEPS Activités de la forme',tag:'8 sem.'},
    {code:'RS5802',label:'Coach sportif entreprise',tag:'5 sem.'},
    {code:'RS5804',label:'BAFA — Animateur',tag:'3 sem.'}
  ]},
  { id:'finance', name:'Finance & RH', certs:[
    {code:'RS6100',label:'Comptabilité générale',tag:'6 sem.'},
    {code:'RS6101',label:'Gestion de la paie',tag:'5 sem.'},
    {code:'RS6103',label:'Recrutement et entretiens',tag:'4 sem.'},
    {code:'RS6104',label:'Droit du travail pratique',tag:'5 sem.'}
  ]},
  { id:'coaching', name:'Coaching & Développement perso', certs:[
    {code:'RS6054',label:'Accompagner les transitions professionnelles',tag:'5 sem.'},
    {code:'RNCP37275',label:'Coach professionnel',tag:'8 sem.'},
    {code:'RS6105',label:'Praticien PNL',tag:'4 sem.'},
    {code:'RS6106',label:'Coach de vie',tag:'6 sem.'}
  ]}
];

function rhEsc(s){
  return String(s||'').replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

function rhBaseCerts(){
  if (window.LFO_CERTS && Array.isArray(window.LFO_CERTS.certs)) return window.LFO_CERTS.certs;
  return [];
}

function rhPriceFor(c){
  var grid = (window.LFO_CERTS && window.LFO_CERTS.pricing_habil) || {rs_simple:990, rs_specialisee:1620, rncp_3_4:2290, rncp_5_6:3290, rncp_7_8:5190, secteur_reglemente:1950};
  if (c.ph) return c.ph;
  if (c.p && grid[c.p]) return grid[c.p];
  return 990;
}

function rhSetHtml(el, h){
  el.replaceChildren();
  el.insertAdjacentHTML('afterbegin', h);
}

function rhBuildCard(c, ai){
  var isRS = (c.t||'').toUpperCase() === 'RS';
  var iconBg = isRS ? 'var(--v-bg)' : 'var(--g-bg)';
  var iconType = isRS ? 'var(--v)' : '#0F6E56';
  var iconNum = isRS ? '#3C3489' : '#085041';
  var num = (c.c||'').replace(/^(RS|RNCP)/i,'');
  var sub = [c.ct||'', c.nv||''].filter(Boolean).join(' — ');
  var aiBadge = ai ? '<span class="cert-ai-badge">IA</span>' : '';
  var fts = [];
  if (c.h !== false) fts.push({k:'CPF', bg:'var(--g-bg)', col:'#0F6E56'});
  fts.push({k:'OPCO', bg:'var(--blue-bg)', col:'#0C447C'});
  if (isRS) fts.push({k:'FT', bg:'var(--o-lt)', col:'var(--o)'});
  var ftHtml = fts.map(function(f){
    return '<span class="cert-ftag" style="background:'+f.bg+';color:'+f.col+'">'+f.k+'</span>';
  }).join('');
  var price = rhPriceFor(c);
  var name = rhEsc(c.n || 'Certification');
  var typeLbl = isRS ? 'RS' : 'RNCP';
  return '<div class="cert">' +
    '<div class="cert-left">' +
      '<div class="cert-icon" style="background:'+iconBg+'"><div class="cert-type" style="color:'+iconType+'">'+typeLbl+'</div><div class="cert-num" style="color:'+iconNum+'">'+rhEsc(num)+'</div></div>' +
      '<div><div class="cert-name">'+aiBadge+name+'</div><div class="cert-sub">'+rhEsc(sub)+'</div></div>' +
    '</div>' +
    '<div class="cert-right">' +
      '<div class="cert-ftags">'+ftHtml+'</div>' +
      '<div class="cert-price">'+price.toLocaleString('fr-FR')+' EUR</div>' +
      '<button class="cert-btn" onclick="rhPickHabilitation(\''+rhEsc(c.c||'')+'\')">Choisir</button>' +
    '</div>' +
  '</div>';
}

function rhRender(certs, info){
  info = info || {};
  var box = document.getElementById('rh-results');
  if (!box) return;
  if (!certs || !certs.length){
    rhSetHtml(box, '<div style="text-align:center;padding:40px 20px;color:var(--gy);font-size:13px;">Aucune certification trouvée. Essayez d\'autres mots-clés ou activez la recherche IA.</div>');
  } else {
    var html = certs.map(function(c){ return rhBuildCard(c, !!info.ai); }).join('');
    rhSetHtml(box, html);
  }
  var countEl = document.getElementById('rh-results-count');
  if (countEl){
    var label = certs && certs.length ? (certs.length + ' certification' + (certs.length>1?'s':'')) : 'Aucun résultat';
    countEl.textContent = label + (info.ai ? ' · trouvées par l\'IA' : '');
  }
  var clr = document.getElementById('rh-clear');
  if (clr) clr.style.display = (info.query || info.ai) ? 'inline-block' : 'none';
}

function rhShowLoader(text){
  var loader = document.getElementById('rh-loader');
  var results = document.getElementById('rh-results');
  if (!loader || !results) return;
  var t = document.getElementById('rh-loader-text');
  if (t) t.textContent = text || 'Recherche en cours...';
  loader.style.display = 'block';
  results.style.display = 'none';
}

function rhHideLoader(){
  var loader = document.getElementById('rh-loader');
  var results = document.getElementById('rh-results');
  if (loader) loader.style.display = 'none';
  if (results) results.style.display = '';
}

function rhInitial(){
  var all = rhBaseCerts();
  if (!all.length){
    var box = document.getElementById('rh-results');
    if (box) rhSetHtml(box, '<div style="text-align:center;padding:40px 20px;color:var(--gy);font-size:13px;">Chargement de la base de certifications...</div>');
    return;
  }
  var byCode = {};
  all.forEach(function(c){ byCode[c.c] = c; });
  var picks = RH_POPULAR.map(function(code){ return byCode[code]; }).filter(Boolean);
  if (picks.length < 6){
    var habs = all.filter(function(c){ return c.h !== false; }).slice(0, 6 - picks.length);
    picks = picks.concat(habs);
  }
  rhRender(picks, {});
}

// Stop-words français courants (mots vides à ignorer dans la recherche)
var RH_STOPWORDS = {'je':1,'tu':1,'il':1,'elle':1,'on':1,'nous':1,'vous':1,'ils':1,'elles':1,'le':1,'la':1,'les':1,'un':1,'une':1,'des':1,'du':1,'de':1,'au':1,'aux':1,'a':1,'à':1,'en':1,'et':1,'ou':1,'mais':1,'donc':1,'car':1,'que':1,'qui':1,'quoi':1,'pour':1,'avec':1,'sans':1,'sur':1,'dans':1,'par':1,'mon':1,'ma':1,'mes':1,'ton':1,'ta':1,'tes':1,'son':1,'sa':1,'ses':1,'ce':1,'cette':1,'ces':1,'tout':1,'tous':1,'forme':1,'former':1,'formes':1,'forme':1,'fais':1,'fait':1,'faire':1,'veux':1,'veut':1,'voudrais':1,'cherche':1,'cherchent':1,'aimerais':1,'souhaite':1,'plus':1,'moins':1,'comme':1,'donner':1,'donne':1,'enseigne':1,'enseigner':1};

function rhNormalize(s){
  return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function rhStem(t){
  var s = rhNormalize(t);
  if (s.length >= 4){
    if (s.charAt(s.length-1) === 's' || s.charAt(s.length-1) === 'x') s = s.slice(0,-1);
    if (s.length >= 5 && s.slice(-2) === 'er') s = s.slice(0,-2);
    if (s.length >= 5 && s.slice(-2) === 'es') s = s.slice(0,-2);
  }
  return s;
}

function rhLocalSearch(query, type){
  var all = rhBaseCerts();
  if (!all.length) return [];
  var q = (query || '').toLowerCase().trim();
  if (!q) return [];
  // Match direct sur code (RS6054 / 6054 / RNCP37275)
  var codeMatch = q.replace(/\s/g,'').match(/^(rs|rncp)?(\d{3,6})$/i);
  if (codeMatch){
    var num = codeMatch[2];
    var direct = all.filter(function(c){
      return (c.c||'').toLowerCase().replace(/^(rs|rncp)/,'').indexOf(num) === 0;
    });
    if (direct.length) return direct.slice(0, 30);
  }
  // Tokenisation avec stop-words + stemming
  var rawTokens = q.split(/[\s,'’\.\-/]+/).filter(Boolean);
  var tokens = [];
  for (var ti=0; ti<rawTokens.length; ti++){
    var raw = rawTokens[ti];
    if (raw.length < 3) continue;
    if (RH_STOPWORDS[rhNormalize(raw)]) continue;
    var stem = rhStem(raw);
    if (stem.length < 3) continue;
    tokens.push(stem);
  }
  if (!tokens.length){
    // Pas de tokens utiles → fallback sur la string entière normalisée (longue >=3)
    var bare = rhNormalize(q.replace(/\s+/g,''));
    if (bare.length >= 3) tokens = [bare];
    else return [];
  }
  var scored = [];
  for (var i=0; i<all.length; i++){
    var c = all[i];
    if (type === 'RS' && (c.t||'').toUpperCase() !== 'RS') continue;
    if (type === 'RNCP' && (c.t||'').toUpperCase() !== 'RNCP') continue;
    var nameNorm = rhNormalize(c.n||'');
    var hayNorm = nameNorm + ' ' + rhNormalize(c.ct||'') + ' ' + rhNormalize(c.d||'') + ' ' + rhNormalize(c.__d||'');
    var s = 0;
    for (var tt=0; tt<tokens.length; tt++){
      var t = tokens[tt];
      if (nameNorm.indexOf(t) !== -1) s += 8;     // dans le nom = très pertinent
      else if (hayNorm.indexOf(t) !== -1) s += 3; // ailleurs = moins pertinent
    }
    if (s > 0) scored.push({c:c, s:s});
  }
  scored.sort(function(a,b){ return b.s - a.s; });
  return scored.slice(0, 30).map(function(x){ return x.c; });
}

async function rhSearch(){
  var inp = document.getElementById('rh-q');
  var q = inp ? (inp.value||'').trim() : '';
  // Ouverture immédiate en mode loading
  rhOpenPopup([], {query:q, loading:true});
  var startTime = Date.now();
  // Attendre que la base soit chargée
  while (!rhBaseCerts().length && Date.now() - startTime < 6000){
    await new Promise(function(r){ setTimeout(r, 100); });
  }
  // Garantir au moins 2 secondes de chargement (UX)
  var elapsed = Date.now() - startTime;
  if (elapsed < 2000){
    await new Promise(function(r){ setTimeout(r, 2000 - elapsed); });
  }
  if (!q){
    rhOpenPopup([], {empty:true});
    return;
  }
  var results = rhLocalSearch(q, 'all');
  rhOpenPopup(results, {query:q});
}

function rhPopupCertRow(c){
  var num = (c.c||'').replace(/^(RS|RNCP)/i,'');
  var typeLbl = (c.t||'').toUpperCase();
  var name = rhEsc(c.n || c.label || 'Certification');
  var sub = [c.ct||'', c.nv||''].filter(Boolean).join(' — ');
  var price = rhPriceFor(c);
  var typeBg = typeLbl==='RS' ? 'var(--v-bg)' : 'var(--g-bg)';
  var typeCol = typeLbl==='RS' ? 'var(--v)' : '#0F6E56';
  return '<div class="rhp-row" onclick="rhPickHabilitation(\''+rhEsc(c.c||'')+'\')">' +
    '<div class="rhp-row-icon" style="background:'+typeBg+';color:'+typeCol+';">' +
      '<div style="font-size:8px;font-weight:700;">'+typeLbl+'</div>' +
      '<div style="font-size:11px;font-weight:700;">'+rhEsc(num)+'</div>' +
    '</div>' +
    '<div class="rhp-row-main">' +
      '<div class="rhp-row-name">'+name+'</div>' +
      (sub ? '<div class="rhp-row-sub">'+rhEsc(sub)+'</div>' : '') +
    '</div>' +
    '<div class="rhp-row-price">'+price.toLocaleString('fr-FR')+' €</div>' +
    '<button class="rhp-row-btn" onclick="event.stopPropagation();rhPickHabilitation(\''+rhEsc(c.c||'')+'\')">Choisir</button>' +
  '</div>';
}

function rhDomainShortName(d){
  // "100 : Formations générales" → "Formations générales"
  if (!d) return 'Autre';
  var m = d.match(/^\d+[a-z]?\s*:\s*(.+)$/i);
  return m ? m[1] : d;
}

// Regroupement des codes France Compétences en 12 thèmes lisibles
var RH_THEMES_ORDER = [
  'Numérique & Tech',
  'Commerce & Finance',
  'Bâtiment & Industrie',
  'Transport & Logistique',
  'Santé & Social',
  'Hôtellerie & Restauration',
  'Sport & Animation',
  'Bien-être & Esthétique',
  'Coaching & Développement perso',
  'Langues & Communication',
  'Sécurité & Prévention',
  'Enseignement & Autres'
];

function rhThemeOf(domainStr){
  if (!domainStr) return 'Enseignement & Autres';
  var m = String(domainStr).match(/^(\d+[a-z]?)/i);
  if (!m) return 'Enseignement & Autres';
  var code = m[1].toLowerCase();
  // Cas spécial : 311u (conduite) → Transport
  if (code === '311u' || code === '311') return 'Transport & Logistique';
  var num = parseInt(code, 10);
  if (isNaN(num)) return 'Enseignement & Autres';
  // Numérique, Tech, Communication digitale
  if (num >= 320 && num <= 326) return 'Numérique & Tech';
  // Commerce, finance, RH
  if (num >= 312 && num <= 315) return 'Commerce & Finance';
  // Bâtiment, industrie (200-259)
  if (num >= 200 && num <= 259) return 'Bâtiment & Industrie';
  // Santé & social
  if (num >= 330 && num <= 332) return 'Santé & Social';
  // Hôtellerie / restauration / agro-alimentaire grand public
  if (num === 334 || num === 220 || num === 221) return 'Hôtellerie & Restauration';
  // Sport, animation, arts spectacle
  if (num === 335 || num === 411 || num === 410 || num === 133) return 'Sport & Animation';
  // Bien-être, esthétique, coiffure
  if (num === 336) return 'Bien-être & Esthétique';
  // Coaching, dev perso, psychologie
  if (num === 124 || (num >= 412 && num <= 415)) return 'Coaching & Développement perso';
  // Langues, communication écrite, arts plastiques
  if (num === 136 || num === 125 || num === 126 || num === 130 || num === 132 || num === 134) return 'Langues & Communication';
  // Sécurité, prévention, droit appliqué, nettoyage
  if (num >= 343 && num <= 345) return 'Sécurité & Prévention';
  // Reste : enseignement, formations générales, jardinage, inconnu
  return 'Enseignement & Autres';
}

function rhBuildDomainSection(name, certs, opts){
  opts = opts || {};
  var maxShown = opts.maxShown || 80;
  var displayed = certs.slice(0, maxShown);
  var more = certs.length - displayed.length;
  var rowsHtml = displayed.map(rhPopupCertRow).join('');
  var moreHtml = more > 0 ? '<div class="rhp-more">+ '+more+' autre'+(more>1?'s':'')+' habilitation'+(more>1?'s':'')+' dans ce domaine</div>' : '';
  var openCls = opts.open ? ' open' : '';
  var headExtra = opts.popular ? '<span class="rhp-pop-pill">★ Top demandes</span>' : '';
  return '<div class="rhp-domain'+openCls+'">' +
    '<button class="rhp-domain-head" onclick="this.parentElement.classList.toggle(\'open\')">' +
      '<span>'+headExtra+rhEsc(name)+'</span>' +
      '<span class="rhp-domain-meta">'+certs.length+' habilitation'+(certs.length>1?'s':'')+' <span class="rhp-chev">›</span></span>' +
    '</button>' +
    '<div class="rhp-domain-body">'+rowsHtml+moreHtml+'</div>' +
  '</div>';
}

function rhPopupDomainsHtml(){
  // Utilise la vraie base LFO_CERTS si dispo : groupement par 12 thèmes
  var base = rhBaseCerts();
  if (base.length){
    // 1) Habilitations les plus demandées (en tête)
    var byCode = {};
    for (var i=0; i<base.length; i++){ byCode[base[i].c] = base[i]; }
    var popularCerts = RH_POPULAR.map(function(code){ return byCode[code]; }).filter(function(c){ return c && c.h !== false; });

    // 2) Groupement par thème — exclure les certifs déjà dans "populaires"
    var popularSet = {};
    popularCerts.forEach(function(c){ popularSet[c.c] = 1; });
    var byTheme = {};
    for (var j=0; j<base.length; j++){
      var c = base[j];
      if (c.h === false) continue;
      if (popularSet[c.c]) continue;
      var theme = rhThemeOf(c.d);
      if (!byTheme[theme]) byTheme[theme] = [];
      byTheme[theme].push(c);
    }
    // Trier les certifs DANS chaque thème par ordre alphabétique du nom
    Object.keys(byTheme).forEach(function(t){
      byTheme[t].sort(function(a,b){ return (a.n||'').localeCompare(b.n||'','fr'); });
    });

    var html = '';
    // Section "Populaires" — ouverte par défaut
    if (popularCerts.length){
      html += rhBuildDomainSection('Habilitations les plus demandées', popularCerts, {open:true, popular:true, maxShown:popularCerts.length});
    }
    // 12 thèmes dans l'ordre fixe — affichés seulement si non vides
    RH_THEMES_ORDER.forEach(function(theme){
      var certs = byTheme[theme];
      if (!certs || !certs.length) return;
      html += rhBuildDomainSection(theme, certs, {open:false, maxShown:80});
    });
    return html;
  }
  // Fallback : liste curée si LFO_CERTS pas chargé
  return RH_DOMAINS.map(function(d){
    var rowsHtml = d.certs.map(function(c){
      var isRncp = c.code.indexOf('RNCP') === 0;
      var price = isRncp ? 3290 : 990;
      return '<div class="rhp-row" onclick="location.href=\'/acces-habilitation?cert='+encodeURIComponent(c.code)+'\'">' +
        '<div class="rhp-row-icon" style="background:var(--v-bg);color:var(--v);">' +
          '<div style="font-size:8px;font-weight:700;">'+(isRncp?'RNCP':'RS')+'</div>' +
          '<div style="font-size:11px;font-weight:700;">'+rhEsc(c.code.replace(/^(RS|RNCP)/,''))+'</div>' +
        '</div>' +
        '<div class="rhp-row-main">' +
          '<div class="rhp-row-name">'+rhEsc(c.label)+'</div>' +
          '<div class="rhp-row-sub">'+rhEsc(d.name)+(c.tag?' · '+rhEsc(c.tag):'')+'</div>' +
        '</div>' +
        '<div class="rhp-row-price">'+price.toLocaleString('fr-FR')+' €</div>' +
        '<button class="rhp-row-btn" onclick="event.stopPropagation();location.href=\'/acces-habilitation?cert='+encodeURIComponent(c.code)+'\'">Choisir</button>' +
      '</div>';
    }).join('');
    return '<div class="rhp-domain">' +
      '<button class="rhp-domain-head" onclick="this.parentElement.classList.toggle(\'open\')">' +
        '<span>'+rhEsc(d.name)+'</span>' +
        '<span class="rhp-domain-meta">'+d.certs.length+' habilitation'+(d.certs.length>1?'s':'')+' <span class="rhp-chev">›</span></span>' +
      '</button>' +
      '<div class="rhp-domain-body">'+rowsHtml+'</div>' +
    '</div>';
  }).join('');
}

function rhRenderPopupBody(certs, info){
  info = info || {};
  if (info.loading){
    return '<div class="rhp-loading">' +
      '<div class="rhp-spinner"></div>' +
      '<div class="rhp-loading-txt">'+(info.ai?'Recherche IA en cours...':'Recherche en cours...')+'</div>' +
    '</div>';
  }
  if (certs && certs.length){
    var aiBadge = info.ai ? '<span class="rhp-ai-badge">IA</span> ' : '';
    return '<div class="rhp-results-head">'+aiBadge+'<b>'+certs.length+'</b> habilitation'+(certs.length>1?'s':'')+' trouvée'+(certs.length>1?'s':'')+(info.query?' pour « '+rhEsc(info.query)+' »':'')+'</div>' +
      '<div class="rhp-list">'+certs.map(rhPopupCertRow).join('')+'</div>';
  }
  var noResMsg = info.empty ? '' :
    '<div class="rhp-noresult">'+
      '<div class="rhp-noresult-icon">🔍</div>'+
      '<p class="rhp-noresult-title">Aucune habilitation trouvée pour « '+rhEsc(info.query||'')+' »</p>'+
      '<p class="rhp-noresult-sub">Parcourez nos domaines disponibles ci-dessous</p>'+
    '</div>';
  return noResMsg + '<div class="rhp-domains">'+rhPopupDomainsHtml()+'</div>';
}

function rhUpdatePopupBody(certs, info){
  info = info || {};
  var body = document.getElementById('rhp-body');
  if (body){
    while (body.firstChild) body.removeChild(body.firstChild);
    body.insertAdjacentHTML('afterbegin', rhRenderPopupBody(certs, info));
  }
  var titleEl = document.getElementById('rhp-title');
  if (titleEl){
    titleEl.textContent = info.empty ? 'Trouver mon habilitation'
      : info.loading ? 'Recherche…'
      : (certs && certs.length) ? 'Résultats'
      : 'Aucun résultat';
  }
}

function rhOpenPopup(certs, info){
  info = info || {};
  var existing = document.getElementById('rhp-overlay');
  if (existing){
    rhUpdatePopupBody(certs, info);
    var inpExist = document.getElementById('rhp-input');
    if (inpExist && info.query != null) inpExist.value = info.query;
    return;
  }

  var queryVal = info.query || '';
  var bodyHtml = rhRenderPopupBody(certs, info);
  var titleText = info.empty ? 'Trouver mon habilitation'
    : info.loading ? 'Recherche…'
    : (certs && certs.length) ? 'Résultats'
    : 'Aucun résultat';

  var overlayHtml = '<div id="rhp-overlay" class="rhp-overlay" onclick="if(event.target===this)rhClosePopup()">' +
    '<div class="rhp-modal" role="dialog" aria-label="Recherche d\'habilitation">' +
      '<div class="rhp-head">' +
        '<div><h3 id="rhp-title">'+titleText+'</h3>' +
        '<p class="rhp-head-sub">Tapez le nom de la formation que vous recherchez</p></div>' +
        '<button class="rhp-close" onclick="rhClosePopup()" aria-label="Fermer">&times;</button>' +
      '</div>' +
      '<div class="rhp-searchbar">' +
        '<span class="rhp-search-ic">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
        '</span>' +
        '<input id="rhp-input" type="text" autocomplete="off" placeholder="Ex: coaching, RS6054, Excel, sécurité..." value="'+rhEsc(queryVal)+'" onkeydown="if(event.key===\'Enter\')rhPopupSearch()">' +
        '<button class="rhp-search-btn" onclick="rhPopupSearch()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;vertical-align:-2px"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>Rechercher</button>' +
      '</div>' +
      '<div class="rhp-body" id="rhp-body">'+bodyHtml+'</div>' +
    '</div>' +
  '</div>';

  document.body.insertAdjacentHTML('beforeend', overlayHtml);
  document.body.style.overflow = 'hidden';

  setTimeout(function(){
    var inp = document.getElementById('rhp-input');
    if (inp) inp.focus();
  }, 80);
}

async function rhPopupSearch(){
  var inp = document.getElementById('rhp-input');
  var q = inp ? (inp.value||'').trim() : '';
  var pageInp = document.getElementById('rh-q');
  if (pageInp) pageInp.value = q;

  rhUpdatePopupBody([], {query:q, loading:true, ai:true});
  var startTime = Date.now();
  while (!rhBaseCerts().length && Date.now() - startTime < 6000){
    await new Promise(function(r){ setTimeout(r, 100); });
  }
  var elapsed = Date.now() - startTime;
  if (elapsed < 1200){
    await new Promise(function(r){ setTimeout(r, 1200 - elapsed); });
  }
  if (!q){
    rhUpdatePopupBody([], {empty:true});
    return;
  }
  var results = rhLocalSearch(q, 'all');
  rhUpdatePopupBody(results, {query:q, ai:true});
}

function rhOpenSearchPopup(){
  rhOpenPopup([], {empty:true});
}

function rhClosePopup(){
  var ov = document.getElementById('rhp-overlay');
  if (ov) ov.remove();
  document.body.style.overflow = '';
}

function rhPickHabilitation(code){
  var certs = rhBaseCerts();
  var cert = null;
  for (var i = 0; i < certs.length; i++){ if (certs[i].c === code){ cert = certs[i]; break; } }
  if (!cert){
    // Code introuvable : fallback vers le funnel direct
    location.href = '/acces-habilitation?cert=' + encodeURIComponent(code);
    return;
  }
  var isRS = (cert.t||'').toUpperCase() === 'RS';
  var num = (cert.c||'').replace(/^(RS|RNCP)/i,'');
  var price = rhPriceFor(cert);
  var badges = ['CPF', 'OPCO'];
  if (isRS) badges.push('FT');

  var item = {
    type: 'habilitation',
    certType: isRS ? 'RS' : 'RNCP',
    certCode: num,
    name: cert.n || 'Certification',
    org: cert.ct || '',
    domain: cert.nv || '',
    price: price,
    badges: badges
  };
  if (window.LFOCart) window.LFOCart.add(item);
  rhShowAddedConfirm(item);
}

function rhPickPack(packId, name, price, oldPrice, items){
  if (window.LFOCart){
    window.LFOCart.add({
      type:'pack', packId:packId, name:name, price:price,
      oldPrice: oldPrice || null,
      subtitle: items && items.length ? items.slice(0,3).join(' + ') : '',
      items: items || []
    });
  }
  rhShowAddedConfirm({name:name});
}

function rhShowAddedConfirm(item){
  var ex = document.getElementById('rhp-confirm-ov');
  if (ex) ex.remove();
  var count = (window.LFOCart && window.LFOCart.count()) || 1;
  var html = '<div id="rhp-confirm-ov" class="rhp-confirm-ov">' +
    '<div class="rhp-confirm" role="dialog" aria-label="Ajouté au panier">' +
      '<div class="rhp-confirm-icon">' +
        '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>' +
      '</div>' +
      '<h3>Ajouté à votre panier</h3>' +
      '<p class="rhp-confirm-name">« '+rhEsc(item.name||'')+' »</p>' +
      '<p class="rhp-confirm-q">Souhaitez-vous ajouter d\'autres habilitations ou passer au paiement&nbsp;?</p>' +
      '<div class="rhp-confirm-actions">' +
        '<button class="rhp-confirm-btn p" onclick="window.location.href=\'/panier\'">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="margin-right:6px;vertical-align:-2px"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' +
          'Aller au paiement ('+count+' article'+(count>1?'s':'')+')' +
        '</button>' +
        '<button class="rhp-confirm-btn s" onclick="rhCloseConfirm()">Ajouter d\'autres habilitations</button>' +
      '</div>' +
    '</div>' +
  '</div>';
  document.body.insertAdjacentHTML('beforeend', html);
  var ov = document.getElementById('rhp-confirm-ov');
  ov.addEventListener('click', function(e){ if (e.target === ov) rhCloseConfirm(); });
}

function rhCloseConfirm(){
  var ov = document.getElementById('rhp-confirm-ov');
  if (ov) ov.remove();
}

function rhQuickSearch(q){
  var inp = document.getElementById('rh-q');
  if (inp) inp.value = q;
  rhSearch();
}

function rhClear(){
  var inp = document.getElementById('rh-q');
  if (inp) inp.value = '';
  rhInitial();
}

window.rhSearch = rhSearch;
window.rhQuickSearch = rhQuickSearch;
window.rhClear = rhClear;
window.rhClosePopup = rhClosePopup;
window.rhPopupSearch = rhPopupSearch;
window.rhOpenSearchPopup = rhOpenSearchPopup;
window.rhPickHabilitation = rhPickHabilitation;
window.rhPickPack = rhPickPack;
window.rhCloseConfirm = rhCloseConfirm;

window.addEventListener('DOMContentLoaded', function(){
  rhInitial();
  if (!rhBaseCerts().length){
    var iv = setInterval(function(){
      if (rhBaseCerts().length){ clearInterval(iv); rhInitial(); }
    }, 200);
    setTimeout(function(){ clearInterval(iv); }, 8000);
  }
});
})();
