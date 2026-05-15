/* dashboard.html — rubrique Achat / Revente (mes annonces) */
(function(){
var STATUTS = {
  traitement: { label:'En traitement', desc:'Votre annonce est en cours de vérification par nos services', color:'#C9A84C', bg:'#FAEEDA', bgLight:'#FDF8EE', borderColor:'#F0E0C0' },
  active:     { label:'Active', desc:'Votre annonce est publiée et visible par les acheteurs', color:'#1D9E75', bg:'#E1F5EE', bgLight:'#F0FDF9', borderColor:'#D1FAE5' },
  cloturee:   { label:'Clôturée — sans acquéreur', desc:'Aucun acheteur ou vendeur trouvé. Vous pouvez republier.', color:'#9CA3AF', bg:'#F3F4F6', bgLight:'#FAFAFA', borderColor:'#E5E7EB' }
};
var TAG_COLORS = { 'OF':'#D85A30','CFA':'#534AB7','Auto-école':'#993C1D','NDA':'#0F6E56','Qualiopi':'#0F6E56','Habilitation':'#633806','EDOF':'#0C447C','Agrément':'#993C1D','Coaching':'#534AB7','NEUF':'#1D9E75','OPCO':'#0C447C','France Travail':'#D85A30','CPF':'#0C447C','Site internet':'#D85A30','LMS':'#534AB7' };
var TAG_BGS    = { 'OF':'#FAECE7','CFA':'#EEEDFE','Auto-école':'#FAECE7','NDA':'#E1F5EE','Qualiopi':'#E1F5EE','Habilitation':'#FAEEDA','EDOF':'#E6F1FB','Agrément':'#FAECE7','Coaching':'#EEEDFE','NEUF':'#E1F5EE','OPCO':'#E6F1FB','France Travail':'#FAECE7','CPF':'#E6F1FB','Site internet':'#FAECE7','LMS':'#EEEDFE' };

window.LFO_AR_FILTER = window.LFO_AR_FILTER || 'all';

function mapStatus(s){
  if (!s) return 'traitement';
  s = String(s).toLowerCase();
  if (s === 'active' || s === 'published' || s === 'open') return 'active';
  if (s === 'closed' || s === 'cancelled' || s === 'canceled' || s === 'expired' || s === 'archived') return 'cloturee';
  return 'traitement';
}
function fmtPrice(n){ return String(n||0).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
function escHtml(s){ return String(s||'').replace(/[&<>"']/g, function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
function dateFr(iso){ if(!iso) return ''; try{ return new Date(iso).toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'}); }catch(e){return '';}}

function svgAnim(statut){
  if (statut === 'traitement'){
    return '<svg width="48" height="48" viewBox="0 0 48 48">' +
      '<circle cx="24" cy="24" r="20" fill="none" stroke="#FAEEDA" stroke-width="3"/>' +
      '<circle cx="24" cy="24" r="20" fill="none" stroke="#C9A84C" stroke-width="3" stroke-dasharray="40 86" stroke-linecap="round">' +
        '<animateTransform attributeName="transform" type="rotate" from="0 24 24" to="360 24 24" dur="1.5s" repeatCount="indefinite"/>' +
      '</circle>' +
      '<circle cx="24" cy="24" r="3" fill="#C9A84C">' +
        '<animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>' +
      '</circle>' +
    '</svg>';
  }
  if (statut === 'active'){
    return '<svg width="48" height="48" viewBox="0 0 48 48">' +
      '<circle cx="24" cy="24" r="20" fill="none" stroke="#E1F5EE" stroke-width="3"/>' +
      '<circle cx="24" cy="24" r="20" fill="none" stroke="#1D9E75" stroke-width="3" stroke-dasharray="126" stroke-dashoffset="0" stroke-linecap="round"/>' +
      '<circle cx="24" cy="24" r="8" fill="#1D9E75" opacity="0.15">' +
        '<animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite"/>' +
        '<animate attributeName="opacity" values="0.2;0.05;0.2" dur="2s" repeatCount="indefinite"/>' +
      '</circle>' +
      '<circle cx="24" cy="24" r="4" fill="#1D9E75">' +
        '<animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite"/>' +
      '</circle>' +
    '</svg>';
  }
  return '<svg width="48" height="48" viewBox="0 0 48 48">' +
    '<circle cx="24" cy="24" r="20" fill="none" stroke="#F3F4F6" stroke-width="3"/>' +
    '<circle cx="24" cy="24" r="20" fill="none" stroke="#D1D5DB" stroke-width="3" stroke-dasharray="126" stroke-dashoffset="30" stroke-linecap="round"/>' +
    '<line x1="18" y1="18" x2="30" y2="30" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round">' +
      '<animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite"/>' +
    '</line>' +
    '<line x1="30" y1="18" x2="18" y2="30" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round">' +
      '<animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite"/>' +
    '</line>' +
  '</svg>';
}

function extractTags(a){
  var tags = [];
  var ot = a.organisme_type;
  if (typeof ot === 'string'){
    if (ot.charAt(0) === '['){ try { ot = JSON.parse(ot); } catch(e){ ot = [ot]; } } else { ot = [ot]; }
  }
  if (Array.isArray(ot)) ot.forEach(function(t){ if (t) tags.push(t); });
  var certs = a.certifications;
  if (typeof certs === 'string'){ try { certs = JSON.parse(certs); } catch(e){ certs = []; } }
  if (Array.isArray(certs)) certs.forEach(function(t){ if (t) tags.push(t); });
  if (a.is_neuf) tags.push('NEUF');
  var seen = {}, out = [];
  tags.forEach(function(t){ if (!seen[t]){ seen[t]=1; out.push(t); }});
  return out.slice(0, 6);
}

function getCity(a){
  if (a.adresse){
    var m = String(a.adresse).match(/\d{5}\s+(.+)/);
    if (m) return m[1].trim();
  }
  return null;
}

function buildAnnonceCard(a){
  var statut = mapStatus(a.status);
  var st = STATUTS[statut];
  var anim = svgAnim(statut);
  var tags = extractTags(a);
  var ville = getCity(a);
  var region = a.region || 'Toute France';
  var date = dateFr(a.created_at);
  var prix = a.listing_price_cents ? Math.round(a.listing_price_cents / 100) : null;
  var prixMin = a.budget_min ? Math.round(a.budget_min / 100) : null;
  var prixMax = a.budget_max ? Math.round(a.budget_max / 100) : null;
  var typeBg = a.type === 'vente' ? '#FAECE7' : '#E6F1FB';
  var typeColor = a.type === 'vente' ? '#D85A30' : '#0C447C';
  var typeLabel = a.type === 'vente' ? 'Vente' : 'Achat';
  var barBg = statut === 'active' ? 'linear-gradient(90deg,#1D9E75,#34D399)' : statut === 'traitement' ? 'linear-gradient(90deg,#C9A84C,#F0D78C)' : '#E5E7EB';

  var tagsHtml = tags.map(function(t){
    var bg = TAG_BGS[t] || '#F3F4F6';
    var col = TAG_COLORS[t] || '#6B7280';
    return '<span style="font-size:9px;font-weight:500;padding:2px 7px;border-radius:4px;background:'+bg+';color:'+col+';">'+escHtml(t)+'</span>';
  }).join('');

  var prixBlock = prix ? '<p style="font-size:24px;font-weight:800;color:#D85A30;margin:0 0 2px;">'+fmtPrice(prix)+' €</p>'
    : (prixMin || prixMax) ? '<p style="font-size:18px;font-weight:700;color:#D85A30;margin:0 0 2px;">'+fmtPrice(prixMin||0)+' — '+fmtPrice(prixMax||0)+' €</p>'
    : '<p style="font-size:14px;font-weight:600;color:#9CA3AF;margin:0;">—</p>';

  var actionsHtml = '';
  if (statut === 'active' || statut === 'cloturee'){
    actionsHtml += '<button onclick="if(typeof mpEditAnnonce===\'function\')mpEditAnnonce(\''+a.id+'\')" style="padding:6px 14px;border-radius:6px;font-size:10px;font-weight:500;cursor:pointer;font-family:inherit;border:1px solid #E5E7EB;background:white;color:#1a1a1a;">Modifier</button>';
  }
  if (statut === 'cloturee'){
    actionsHtml += '<button onclick="lfoRepublishAnnonce(\''+a.id+'\')" style="padding:6px 14px;border-radius:6px;font-size:10px;font-weight:500;cursor:pointer;font-family:inherit;border:none;background:#D85A30;color:white;">Republier</button>';
  }
  if (statut === 'traitement'){
    actionsHtml += '<span style="font-size:10px;color:#C9A84C;font-weight:500;">Vérification en cours…</span>';
  }

  return '<div style="background:'+st.bgLight+';border:1px solid '+st.borderColor+';border-radius:14px;overflow:hidden;">' +
    '<div style="height:3px;background:'+barBg+';"></div>' +
    '<div style="display:grid;grid-template-columns:auto 1fr auto;gap:16px;padding:16px 20px;align-items:center;">' +
      '<div style="width:48px;height:48px;flex-shrink:0;">'+anim+'</div>' +
      '<div style="min-width:0;">' +
        '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;flex-wrap:wrap;">' +
          '<span style="font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px;background:'+typeBg+';color:'+typeColor+';">'+typeLabel+'</span>' +
          '<span style="font-size:10px;font-weight:500;padding:2px 8px;border-radius:4px;background:'+st.bg+';color:'+st.color+';">'+st.label+'</span>' +
          '<span style="font-size:10px;color:#9CA3AF;">'+date+'</span>' +
        '</div>' +
        '<p style="font-size:15px;font-weight:600;margin:0 0 4px;">'+escHtml(a.title || 'Annonce')+'</p>' +
        (a.description ? '<p style="font-size:11px;color:#6B7280;line-height:1.5;margin:0 0 8px;">'+escHtml(String(a.description).substring(0,200))+'</p>' : '') +
        (tagsHtml ? '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px;">'+tagsHtml+'</div>' : '') +
        '<div style="display:flex;gap:16px;flex-wrap:wrap;">' +
          (ville ? '<div><span style="font-size:9px;color:#9CA3AF;">Ville : </span><span style="font-size:11px;font-weight:500;">'+escHtml(ville)+'</span></div>' : '') +
          '<div><span style="font-size:9px;color:#9CA3AF;">Région : </span><span style="font-size:11px;font-weight:500;">'+escHtml(region)+'</span></div>' +
        '</div>' +
      '</div>' +
      '<div style="text-align:right;min-width:160px;">' +
        prixBlock +
        '<p style="font-size:10px;color:#9CA3AF;margin:0 0 12px;">'+(a.type === 'vente' ? 'Prix demandé' : 'Budget')+'</p>' +
        '<div style="display:flex;gap:6px;justify-content:flex-end;align-items:center;flex-wrap:wrap;">'+actionsHtml+'</div>' +
      '</div>' +
    '</div>' +
    '<div style="padding:8px 20px;border-top:1px solid '+st.borderColor+';background:'+st.bg+';">' +
      '<p style="font-size:10px;color:'+st.color+';margin:0;">'+st.desc+'</p>' +
    '</div>' +
  '</div>';
}

function buildEmptyState(type){
  var isAchat = type === 'achat';
  var title = isAchat ? "Aucune demande d'achat pour le moment" : 'Aucune annonce de vente pour le moment';
  var sub = isAchat
    ? "Vous n'avez pas encore publié de demande d'achat. Trouvez l'organisme de formation qui correspond à vos besoins sur la marketplace."
    : "Vous n'avez pas encore publié d'annonce de vente. Mettez votre organisme sur le marché en quelques minutes via la marketplace.";
  var ctaLabel = isAchat ? 'Publier ma demande d\'achat' : 'Publier mon annonce de vente';
  return '<div style="text-align:center;padding:60px 24px;">' +
    '<svg width="64" height="64" viewBox="0 0 64 64" style="margin-bottom:16px;">' +
      '<rect x="8" y="16" width="48" height="36" rx="6" fill="none" stroke="#E5E7EB" stroke-width="2"/>' +
      '<line x1="8" y1="28" x2="56" y2="28" stroke="#E5E7EB" stroke-width="2"/>' +
      '<circle cx="20" cy="22" r="2" fill="#E5E7EB"/>' +
      '<circle cx="28" cy="22" r="2" fill="#E5E7EB"/>' +
      '<circle cx="36" cy="22" r="2" fill="#E5E7EB"/>' +
    '</svg>' +
    '<p style="font-size:16px;font-weight:600;margin:0 0 6px;">'+title+'</p>' +
    '<p style="font-size:13px;color:#6B7280;max-width:420px;margin:0 auto 24px;line-height:1.6;">'+sub+'</p>' +
    '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">' +
      '<a href="/marketplace" style="padding:12px 24px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;border:none;background:#D85A30;color:white;text-decoration:none;display:inline-block;">'+ctaLabel+'</a>' +
      '<a href="/marketplace" style="padding:12px 24px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;border:1px solid #E5E7EB;background:white;color:#1a1a1a;text-decoration:none;display:inline-block;">Voir la marketplace</a>' +
    '</div>' +
  '</div>';
}

function buildStats(c, type){
  var totalLbl = type === 'achat' ? 'Mes demandes' : 'Mes annonces';
  return '<div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;">' +
    '<div style="flex:1;min-width:140px;background:#FFF8F3;border:1px solid #FAECE7;border-radius:10px;padding:10px 14px;text-align:center;">' +
      '<p style="font-size:20px;font-weight:700;color:#D85A30;margin:0;">'+c.all+'</p><p style="font-size:10px;color:#9CA3AF;margin:0;">'+totalLbl+'</p>' +
    '</div>' +
    '<div style="flex:1;min-width:140px;background:#FAEEDA;border:1px solid #F0E0C0;border-radius:10px;padding:10px 14px;text-align:center;">' +
      '<p style="font-size:20px;font-weight:700;color:#C9A84C;margin:0;">'+c.traitement+'</p><p style="font-size:10px;color:#9CA3AF;margin:0;">En traitement</p>' +
    '</div>' +
    '<div style="flex:1;min-width:140px;background:#E1F5EE;border:1px solid #D1FAE5;border-radius:10px;padding:10px 14px;text-align:center;">' +
      '<p style="font-size:20px;font-weight:700;color:#1D9E75;margin:0;">'+c.active+'</p><p style="font-size:10px;color:#9CA3AF;margin:0;">Actives</p>' +
    '</div>' +
    '<div style="flex:1;min-width:140px;background:#F3F4F6;border:1px solid #E5E7EB;border-radius:10px;padding:10px 14px;text-align:center;">' +
      '<p style="font-size:20px;font-weight:700;color:#9CA3AF;margin:0;">'+c.cloturee+'</p><p style="font-size:10px;color:#9CA3AF;margin:0;">Sans acquéreur</p>' +
    '</div>' +
  '</div>';
}

function buildFilters(c){
  var f = window.LFO_AR_FILTER;
  function btn(key, label, count){
    var act = f === key;
    return '<button onclick="lfoSetArFilter(\''+key+'\')" style="padding:6px 14px;border-radius:20px;font-size:11px;font-weight:500;cursor:pointer;font-family:inherit;border:none;background:'+(act?'#1a1a1a':'white')+';color:'+(act?'white':'#6B7280')+';box-shadow:'+(act?'none':'inset 0 0 0 1px #E5E7EB')+';">'+label+(count>0?' <span style="opacity:.6;margin-left:3px;">'+count+'</span>':'')+'</button>';
  }
  return '<div style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap;">' +
    btn('all','Toutes',c.all) +
    btn('traitement','En traitement',c.traitement) +
    btn('active','Actives',c.active) +
    btn('cloturee','Sans acquéreur',c.cloturee) +
  '</div>';
}

window.lfoSetArFilter = function(f){
  window.LFO_AR_FILTER = f;
  if (typeof pageUserMarketplace === 'function') pageUserMarketplace();
};

window.lfoRepublishAnnonce = async function(id){
  if (!confirm('Republier cette annonce sur la marketplace ?')) return;
  try {
    await sb.from('marketplace_requests').update({ status:'pending', updated_at: new Date().toISOString() }).eq('id', id);
    if (typeof toast === 'function') toast('Annonce remise en traitement.');
    if (typeof pageUserMarketplace === 'function') pageUserMarketplace();
  } catch(e){ alert('Erreur: '+(e && e.message || e)); }
};

window.lfoBuildAnnoncesUI = function(annonces, opts){
  annonces = annonces || [];
  opts = opts || {};
  var type = opts.type || 'vente';
  if (!annonces.length) return buildEmptyState(type);
  var counts = { all: annonces.length, traitement:0, active:0, cloturee:0 };
  annonces.forEach(function(a){ var s = mapStatus(a.status); counts[s] = (counts[s]||0)+1; });
  var f = window.LFO_AR_FILTER;
  var filtered = f === 'all' ? annonces : annonces.filter(function(a){ return mapStatus(a.status) === f; });
  var listHtml = filtered.length
    ? '<div style="display:flex;flex-direction:column;gap:12px;">'+filtered.map(buildAnnonceCard).join('')+'</div>'
    : '<div style="text-align:center;padding:40px;color:#9CA3AF;"><p style="font-size:14px;font-weight:500;margin:0 0 4px;">Aucun élément dans cette catégorie</p><p style="font-size:12px;margin:0;">Changez le filtre pour voir vos autres annonces.</p></div>';
  return buildStats(counts, type) + buildFilters(counts) + listHtml;
};

})();
