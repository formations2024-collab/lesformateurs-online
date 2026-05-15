/**
 * LFO Marketplace Popups v2 — Acheteur + Vendeur
 */

var MP_TYPES_ACHAT = ['OF', 'CFA', 'Auto-école'];
var MP_TYPES_VENTE = ['OF', 'CFA', 'Auto-école', "Centre d'examen"];
var MP_ATTRIBUTS = ['Qualiopi', 'NDA', 'BPF déposé', "Centre d'examen", 'UAI', 'Bilan de compétences', 'VAE'];
var MP_FINANCEMENTS = ['EDOF / CPF', 'OPCO', 'France Travail', 'Marché public', 'Autre'];
var MP_OPCOS = ['AFDAS', 'AKTO', 'Atlas', 'Constructys', 'OCAPIAT', 'OPCO 2i', 'OPCO Commerce', 'OPCO EP', 'OPCO Mobilités', 'OPCO Santé', 'Uniformation'];
var MP_SERVICES = ['Site internet', 'LMS', 'App mobile', 'Agent IA', 'Formations créées', 'Formateurs inclus', 'Funnel de vente'];
var MP_REGIONS = ['Toute France','Ile-de-France','PACA','Auvergne-Rhône-Alpes','Nouvelle-Aquitaine','Occitanie','Hauts-de-France','Grand Est','Bretagne','Normandie','Pays de la Loire','Centre-Val de Loire','Bourgogne-Franche-Comté','DOM-TOM'];

function _mpE(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML;}

function _mpChip(items, selected, color, gid){
  return items.map(function(it){
    var sel=selected.indexOf(it)>=0;
    return '<span onclick="mpChip(\''+gid+'\',\''+_mpE(it)+'\')" style="font-size:11px;padding:6px 12px;border-radius:8px;border:1px solid '+(sel?'transparent':'#E5E7EB')+';background:'+(sel?(color==='green'?'#1D9E75':'#D85A30'):'white')+';color:'+(sel?'white':'#6B7280')+';cursor:pointer;display:inline-block;margin:2px;font-weight:'+(sel?'600':'400')+';transition:all .15s;">'+_mpE(it)+'</span>';
  }).join('');
}

// ═══════ AUTH CHECK ═══════
async function _mpCheckAuth(){
  var client=window.sb||window.__lfoSupabase;
  if(!client) return null;
  var r=await client.auth.getSession();
  return (r.data&&r.data.session)?r.data.session:null;
}

function _mpShowLoginPopup(action){
  action = action || 'vente';
  var existing=document.getElementById('mp-popup-overlay');
  if(existing)existing.remove();
  var titre = action==='achat' ? 'Acheter un organisme' : 'Vendre mon organisme';
  var sub = action==='achat'
    ? 'Indiquez votre email pour décrire l\'organisme que vous recherchez.'
    : 'Indiquez votre email pour commencer la publication de votre annonce.';

  var h='<div id="mp-popup-overlay" onclick="if(event.target===this)this.remove();" style="position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;">'
    +'<div style="position:absolute;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);"></div>'
    +'<div style="position:relative;background:white;border-radius:18px;max-width:460px;width:100%;padding:36px 32px;box-shadow:0 24px 80px rgba(0,0,0,.15);font-family:inherit;">'
    +'<button onclick="document.getElementById(\'mp-popup-overlay\').remove();" style="position:absolute;top:16px;right:16px;background:#F3F4F6;border:none;width:32px;height:32px;border-radius:50%;font-size:14px;cursor:pointer;color:#6B7280;">✕</button>'
    +'<div style="font-size:11px;font-weight:700;letter-spacing:1.5px;color:#D85A30;text-transform:uppercase;margin-bottom:8px;">Marketplace · '+(action==='achat'?'Acheter':'Vendre')+'</div>'
    +'<div style="font-size:20px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em;">'+titre+'</div>'
    +'<div style="font-size:13px;color:#6B7280;margin-bottom:22px;line-height:1.5;">'+sub+'</div>'
    +'<div style="display:flex;flex-direction:column;gap:10px;">'
    +'<input id="mp-gate-email" type="email" placeholder="votre@email.com" autofocus style="padding:13px 14px;border:1px solid #E5E7EB;border-radius:10px;font-size:14px;font-family:inherit;outline:none;">'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">'
    +'<input id="mp-gate-first" type="text" placeholder="Prénom" style="padding:13px 14px;border:1px solid #E5E7EB;border-radius:10px;font-size:14px;font-family:inherit;outline:none;">'
    +'<input id="mp-gate-last" type="text" placeholder="Nom" style="padding:13px 14px;border:1px solid #E5E7EB;border-radius:10px;font-size:14px;font-family:inherit;outline:none;">'
    +'</div>'
    +'<button id="mp-gate-btn" onclick="_mpGateSubmit(\''+action+'\')" style="padding:13px;background:#D85A30;color:white;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;margin-top:6px;">Continuer →</button>'
    +'<div id="mp-gate-err" style="font-size:12px;color:#E24B4A;min-height:16px;"></div>'
    +'</div>'
    +'<div style="font-size:11px;color:#9CA3AF;margin-top:14px;line-height:1.6;text-align:center;">Un compte vous sera créé automatiquement.<br>Vos identifiants vous seront envoyés par email.<br>Déjà inscrit ? <a href="dashboard.html" style="color:#D85A30;text-decoration:none;font-weight:600;">Se connecter</a></div>'
    +'</div></div>';
  document.body.insertAdjacentHTML('beforeend',h);
}

async function _mpGateSubmit(action){
  var btn=document.getElementById('mp-gate-btn');
  var errEl=document.getElementById('mp-gate-err');
  if(errEl) errEl.textContent='';
  var email=(document.getElementById('mp-gate-email').value||'').trim().toLowerCase();
  var fn=(document.getElementById('mp-gate-first').value||'').trim();
  var ln=(document.getElementById('mp-gate-last').value||'').trim();
  if(!email || email.indexOf('@')<0 || email.indexOf('.')<0){
    if(errEl) errEl.textContent='Email invalide';
    return;
  }
  if(btn){ btn.disabled=true; btn.textContent='Création du compte…'; btn.style.opacity='.7'; }

  var client=window.sb||window.__lfoSupabase;
  if(!client){ if(errEl) errEl.textContent='Erreur technique'; if(btn) btn.disabled=false; return; }

  try{
    var existChk=await client.from('profiles').select('id,email').ilike('email',email).maybeSingle();
    if(existChk && existChk.data){
      if(errEl){
        while(errEl.firstChild) errEl.removeChild(errEl.firstChild);
        errEl.appendChild(document.createTextNode('Cet email existe déjà. '));
        var link=document.createElement('a');
        link.href='dashboard.html';
        link.style.color='#D85A30';
        link.style.textDecoration='underline';
        link.textContent='Se connecter';
        errEl.appendChild(link);
      }
      if(btn){ btn.disabled=false; btn.textContent='Continuer →'; btn.style.opacity=''; }
      return;
    }

    var pw='lfo_'+Math.random().toString(36).slice(2,10)+Math.random().toString(36).slice(2,6);

    var su=await client.auth.signUp({
      email:email, password:pw,
      options:{ data:{ first_name:fn, last_name:ln, source:'marketplace_'+action } }
    });
    if(su.error) throw su.error;

    try{
      fetch('https://webhook.lesformateurs.online/send-new-user-email',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          user_email:email, first_name:fn, last_name:ln,
          password:pw, source:'marketplace_'+action
        })
      });
    }catch(e){}

    var ov=document.getElementById('mp-popup-overlay');
    if(ov) ov.remove();
    if(action==='achat') showPopupAcheteur();
    else showPopupVendeur();
  }catch(e){
    if(errEl) errEl.textContent='Erreur : '+(e.message||e);
    if(btn){ btn.disabled=false; btn.textContent='Continuer →'; btn.style.opacity=''; }
  }
}
window._mpGateSubmit=_mpGateSubmit;

// ═══════ POPUP ACHETEUR ═══════
var _mpA={section:'type',types:[],isNeuf:false,certifs:[],financements:[],opcos:[],finAutre:'',services:[],bMin:'',bMax:'',urgency:'normal',acceptControle:true,wantsEscrow:false,acceptDettes:false,region:'Toute France',desc:''};

async function showPopupAcheteur(){
  var sess=await _mpCheckAuth();
  if(!sess){_mpShowLoginPopup('achat');return;}
  _mpA={section:'type',types:[],isNeuf:false,certifs:[],financements:[],opcos:[],finAutre:'',services:[],bMin:'',bMax:'',urgency:'normal',acceptDettes:false,acceptControle:true,region:'Toute France',desc:''};
  _mpRA();
}

// Validation acheteur
function _mpValA(secId){
  var s=_mpA;
  if(secId==='type') return s.types.length>0;
  if(secId==='budget') return s.bMin&&s.bMax;
  if(secId==='loc') return s.region!=='Toute France'||s.desc.length>0;
  return true; // certifs, fin, svc = optional
}
function _mpMaxSecA(){
  var secs=['type','certifs','fin','svc','budget','loc'];
  for(var i=0;i<secs.length;i++){if(!_mpValA(secs[i]))return i;}
  return secs.length;
}

// Validation vendeur
function _mpValV(secId){
  var s=_mpV;
  if(secId==='org') return s.found&&s.type&&s.titre.length>0;
  if(secId==='chiffres') return s.ca.length>0;
  if(secId==='prix') return (parseInt(s.prix)||0)>0;
  return true; // certifs, transp = optional
}
function _mpMaxSecV(){
  var secs=['org','certifs','chiffres','transp','prix'];
  for(var i=0;i<secs.length;i++){if(!_mpValV(secs[i]))return i;}
  return secs.length;
}

var _mpErr='';

function _mpRA(){
  var ex=document.getElementById('mp-popup-overlay');if(ex)ex.remove();
  var s=_mpA;
  var secs=[{id:'type',l:"Type d'organisme"},{id:'certifs',l:'Attributs'},{id:'fin',l:'Financements'},{id:'svc',l:'Services inclus'},{id:'budget',l:'Budget et urgence'},{id:'loc',l:'Localisation'}];
  var idx=secs.findIndex(function(x){return x.id===s.section;});
  var recap=[];
  if(s.types.length)recap.push(s.types.join(', '));
  if(s.certifs.length)recap.push(s.certifs.join(', '));
  if(s.bMin||s.bMax)recap.push((s.bMin||'?')+' — '+(s.bMax||'?')+' €');
  if(s.region!=='Toute France')recap.push(s.region);
  if(s.isNeuf)recap.push('Centre neuf');

  var side='<div style="font-size:10px;font-weight:700;color:#085041;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;">Recherche</div>'
    +'<div style="font-size:16px;font-weight:800;color:#04342C;margin-bottom:20px;">Je cherche un organisme</div>'
    +'<div style="display:flex;flex-direction:column;gap:2px;">'+secs.map(function(sc,i){var act=s.section===sc.id;var maxI=_mpMaxSecA();var locked=i>maxI;return '<div onclick="'+(locked?'':'_mpA.section=\''+sc.id+'\';_mpErr=\'\';_mpRA();')+'" style="padding:8px 12px;border-radius:8px;font-size:12px;font-weight:'+(act?'600':'400')+';cursor:'+(locked?'not-allowed':'pointer')+';background:'+(act?'#1D9E75':'transparent')+';color:'+(act?'white':'#085041')+';opacity:'+(locked?'0.4':'1')+';">'+(i+1)+'. '+sc.l+'</div>';}).join('')+'</div>'
    +'<div style="background:rgba(29,158,117,.15);border-radius:10px;padding:14px;margin-top:16px;"><div style="font-size:11px;font-weight:700;color:#085041;margin-bottom:6px;">Récapitulatif</div>'
    +(recap.length?recap.map(function(r){return '<div style="font-size:11px;color:#0F6E56;line-height:1.5;">'+_mpE(r)+'</div>';}).join(''):'<div style="font-size:11px;color:#0F6E56;">Aucun critère</div>')+'</div>';

  var ct='';
  if(s.section==='type'){
    ct='<div style="font-size:13px;color:#6B7280;margin-bottom:12px;">Sélectionnez un ou plusieurs types (multi-sélection)</div>'
      +'<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:16px;">'+_mpChip(MP_TYPES_ACHAT,s.types,'green','a_types')+'</div>'
      +'<label style="display:flex;align-items:center;gap:8px;padding:12px 14px;border:1px solid #E5E7EB;border-radius:10px;cursor:pointer;font-size:13px;"><input type="checkbox" '+(s.isNeuf?'checked':'')+' onchange="_mpA.isNeuf=this.checked;_mpRA();" style="accent-color:#1D9E75;width:18px;height:18px;"> Centre tout neuf uniquement</label>';
  } else if(s.section==='certifs'){
    ct='<div style="font-size:13px;color:#6B7280;margin-bottom:12px;">Quels attributs l\'organisme doit-il avoir ?</div><div style="display:flex;flex-wrap:wrap;gap:4px;">'+_mpChip(MP_ATTRIBUTS,s.certifs,'green','a_certifs')+'</div>';
  } else if(s.section==='fin'){
    var showOpcos=s.financements.indexOf('OPCO')>=0;
    var showAutre=s.financements.indexOf('Autre')>=0;
    ct='<div style="font-size:13px;color:#6B7280;margin-bottom:12px;">Quels financements ?</div><div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:12px;">'+_mpChip(MP_FINANCEMENTS,s.financements,'green','a_fin')+'</div>';
    if(showOpcos) ct+='<div style="margin-bottom:12px;padding:12px;background:#F9FAFB;border-radius:10px;"><div style="font-size:12px;font-weight:600;margin-bottom:8px;">OPCOs souhaités</div><div style="display:flex;flex-wrap:wrap;gap:4px;">'+_mpChip(MP_OPCOS,s.opcos,'green','a_opcos')+'</div></div>';
    if(showAutre) ct+='<div><label style="font-size:11px;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Précisez le financement</label><input id="mp-fin-autre" value="'+_mpE(s.finAutre)+'" oninput="_mpA.finAutre=this.value" style="width:100%;padding:10px 14px;border:1px solid #E5E7EB;border-radius:8px;font-family:inherit;font-size:13px;"></div>';
  } else if(s.section==='svc'){
    ct='<div style="font-size:13px;color:#6B7280;margin-bottom:12px;">Quels services doivent être inclus ?</div><div style="display:flex;flex-wrap:wrap;gap:4px;">'+_mpChip(MP_SERVICES,s.services,'green','a_svc')+'</div>';
  } else if(s.section==='budget'){
    ct='<div style="font-size:13px;color:#6B7280;margin-bottom:12px;">Quel est votre budget ?</div>'
      +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">'
      +'<div><label style="font-size:11px;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Minimum (€)</label><input type="number" placeholder="5 000" value="'+s.bMin+'" oninput="_mpA.bMin=this.value" style="width:100%;padding:12px 14px;border:1px solid #E5E7EB;border-radius:8px;font-family:inherit;font-size:14px;font-weight:600;"></div>'
      +'<div><label style="font-size:11px;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Maximum (€)</label><input type="number" placeholder="25 000" value="'+s.bMax+'" oninput="_mpA.bMax=this.value" style="width:100%;padding:12px 14px;border:1px solid #E5E7EB;border-radius:8px;font-family:inherit;font-size:14px;font-weight:600;"></div></div>'
      +'<div style="font-size:13px;font-weight:600;margin-bottom:8px;">Urgence</div><div style="display:flex;gap:8px;margin-bottom:20px;">'
      +['normal:Pas pressé','1mois:Sous 1 mois','urgent:Urgent < 2 sem.'].map(function(u){var p=u.split(':');var sel=s.urgency===p[0];return '<div onclick="_mpA.urgency=\''+p[0]+'\';_mpRA();" style="padding:10px 16px;border-radius:8px;border:'+(sel?'1.5px solid #D85A30':'1px solid #E5E7EB')+';background:'+(sel?'#FAECE7':'white')+';color:'+(sel?'#D85A30':'#6B7280')+';font-size:12px;cursor:pointer;font-weight:'+(sel?'600':'400')+';">'+p[1]+'</div>';}).join('')+'</div>'
      +'<div style="display:flex;flex-direction:column;gap:8px;">'
      +'<label style="display:flex;align-items:center;gap:8px;padding:10px 14px;border:1px solid #E5E7EB;border-radius:10px;cursor:pointer;font-size:12px;margin-bottom:8px;"><input type="checkbox" '+(s.acceptControle?'checked':'')+' onchange="_mpA.acceptControle=this.checked;" style="accent-color:#1D9E75;"> Je ne veux pas de centre en contrôle DREETS</label>'
      +'<label style="display:flex;align-items:flex-start;gap:10px;padding:12px 16px;border:1px solid #E5E7EB;border-radius:8px;cursor:pointer;margin-bottom:8px;"><input type="checkbox" '+(s.wantsEscrow?'checked':'')+' onchange="_mpA.wantsEscrow=this.checked;" style="margin-top:2px;accent-color:#1D9E75;"><div><div style="font-size:13px;font-weight:600;">Compte séquestre souhaité</div><div style="font-size:11px;color:#6B7280;line-height:1.5;margin-top:2px;">Lors du paiement, vos fonds sont conservés par un avocat pour sécuriser la transaction. +4% du montant à prévoir.</div></div></label>'
      +'<label style="display:flex;align-items:center;gap:8px;padding:10px 14px;border:1px solid #E5E7EB;border-radius:10px;cursor:pointer;font-size:12px;"><input type="checkbox" '+(s.acceptDettes?'checked':'')+' onchange="_mpA.acceptDettes=this.checked;" style="accent-color:#1D9E75;"> J\'accepte un centre avec des dettes dans la mesure de l\'acceptable</label></div>';
  } else if(s.section==='loc'){
    ct='<div style="font-size:13px;color:#6B7280;margin-bottom:12px;">Où recherchez-vous ?</div>'
      +'<select onchange="_mpA.region=this.value" style="width:100%;padding:10px 14px;border:1px solid #E5E7EB;border-radius:8px;font-family:inherit;font-size:13px;margin-bottom:16px;">'+MP_REGIONS.map(function(r){return '<option'+(s.region===r?' selected':'')+'>'+_mpE(r)+'</option>';}).join('')+'</select>'
      +'<div style="font-size:13px;font-weight:600;margin-bottom:8px;">Description libre</div>'
      +'<textarea placeholder="Décrivez ce que vous recherchez..." oninput="_mpA.desc=this.value" style="width:100%;padding:10px 14px;border:1px solid #E5E7EB;border-radius:8px;font-family:inherit;font-size:13px;min-height:100px;resize:vertical;">'+_mpE(s.desc)+'</textarea>';
  }

  var errHtml=_mpErr?'<div style="color:#E24B4A;font-size:12px;margin-top:8px;">'+_mpErr+'</div>':'';
  var fl=idx>0?'<button onclick="_mpErr=\'\';_mpA.section=\''+secs[idx-1].id+'\';_mpRA();" style="padding:10px 18px;background:white;border:1px solid #E5E7EB;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;">Retour</button>':'<div></div>';
  var nextFn=idx<secs.length-1?'mpNextA(\''+secs[idx].id+'\',\''+secs[idx+1].id+'\')':'mpPubAchat()';
  var lastBtnLabel=_mpEditId?(idx<secs.length-1?'Suivant':'Enregistrer'):(idx<secs.length-1?'Suivant':'Publier ma recherche');
  var fr='<div><button onclick="'+nextFn+'" style="padding:10px 22px;background:#1D9E75;color:white;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;">'+lastBtnLabel+'</button>'+errHtml+'</div>';

  document.body.insertAdjacentHTML('beforeend','<div id="mp-popup-overlay" onclick="if(event.target===this)this.remove();" style="position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;"><div style="position:absolute;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);"></div><div style="position:relative;background:white;border-radius:18px;width:90%;max-width:680px;max-height:90vh;display:grid;grid-template-columns:200px 1fr;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.15);"><div style="background:#E1F5EE;padding:24px 16px;display:flex;flex-direction:column;justify-content:space-between;overflow-y:auto;">'+side+'</div><div style="display:flex;flex-direction:column;"><div style="padding:20px 24px;border-bottom:1px solid #E5E7EB;display:flex;justify-content:space-between;align-items:center;"><div><div style="font-size:16px;font-weight:700;">'+secs[idx].l+'</div><div style="font-size:12px;color:#6B7280;">Étape '+(idx+1)+' / '+secs.length+'</div></div><button onclick="document.getElementById(\'mp-popup-overlay\').remove();" style="background:#F3F4F6;border:none;width:32px;height:32px;border-radius:50%;font-size:14px;cursor:pointer;color:#6B7280;">✕</button></div><div style="padding:20px 24px;flex:1;overflow-y:auto;max-height:420px;">'+ct+'</div><div style="padding:16px 24px;border-top:1px solid #E5E7EB;display:flex;justify-content:space-between;align-items:center;">'+fl+fr+'</div></div></div></div>');
}

// ═══════ POPUP VENDEUR ═══════
var _mpV={section:'org',siret:'',found:null,type:'OF',titre:'',isNeuf:false,certifs:[],ca:'',form:'',appr:'',nbf:'',desc:'',transp:[],rienASignaler:true,hasDettes:false,dettesDetails:'',prix:'',nego:false,escrow:false};

async function showPopupVendeur(){
  var sess=await _mpCheckAuth();
  if(!sess){_mpShowLoginPopup('vente');return;}
  _mpV={section:'org',siret:'',found:null,type:'OF',titre:'',isNeuf:false,certifs:[],ca:'',form:'',appr:'',nbf:'',desc:'',transp:[],hasDettes:false,dettesDetails:'',prix:'',nego:false,escrow:false};
  _mpRV();
}

function _mpRV(){
  var ex=document.getElementById('mp-popup-overlay');if(ex)ex.remove();
  var s=_mpV;
  var secs=[{id:'org',l:'Mon organisme'},{id:'certifs',l:'Attributs'},{id:'chiffres',l:'Chiffres et équipe'},{id:'transp',l:'Transparence'},{id:'prix',l:'Prix de vente'}];
  var idx=secs.findIndex(function(x){return x.id===s.section;});
  var pn=parseInt(s.prix)||0;
  var comm=Math.max(800,Math.round(pn*0.10));
  var commM=Math.max(800,Math.round(pn*0.07));
  var net=pn-comm;

  var side='<div style="font-size:10px;font-weight:700;color:#993C1D;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;">Vente</div>'
    +'<div style="font-size:16px;font-weight:800;color:#4A1B0C;margin-bottom:20px;">Vendre mon organisme</div>'
    +'<div style="display:flex;flex-direction:column;gap:2px;">'+secs.map(function(sc,i){var act=s.section===sc.id;var maxI=_mpMaxSecV();var locked=i>maxI;return '<div onclick="'+(locked?'':'_mpV.section=\''+sc.id+'\';_mpErr=\'\';_mpRV();')+'" style="padding:8px 12px;border-radius:8px;font-size:12px;font-weight:'+(act?'600':'400')+';cursor:'+(locked?'not-allowed':'pointer')+';background:'+(act?'#D85A30':'transparent')+';color:'+(act?'white':'#993C1D')+';opacity:'+(locked?'0.4':'1')+';">'+(i+1)+'. '+sc.l+'</div>';}).join('')+'</div>'
    +'<div style="background:rgba(216,90,48,.12);border-radius:10px;padding:14px;margin-top:16px;"><div style="font-size:11px;font-weight:700;color:#993C1D;margin-bottom:6px;">Récapitulatif</div>'
    +(s.found?'<div style="font-size:11px;color:#712B13;">'+_mpE(s.found.rs||'')+'</div>':'')
    +'<div style="font-size:11px;color:#712B13;">'+_mpE(s.type)+' · '+s.certifs.length+' attributs'+(s.isNeuf?' · Neuf':'')+'</div>'
    +(pn>0?'<div style="font-size:14px;font-weight:800;color:#D85A30;margin-top:4px;">'+pn.toLocaleString('fr-FR')+' €</div><div style="font-size:10px;color:#993C1D;">Net : '+net.toLocaleString('fr-FR')+' €</div>':'')+'</div>';

  var ct='';
  if(s.section==='org'){
    var fh=s.found?'<div style="background:#FAECE7;border-radius:10px;padding:16px;margin-bottom:16px;"><div style="font-size:14px;font-weight:700;margin-bottom:4px;">'+_mpE(s.found.rs||'')+'</div><div style="font-size:12px;color:#6B7280;">'+_mpE((s.found.fj||'')+' · '+(s.found.siren||'')+' · '+(s.found.adr||''))+'</div></div>':'';
    ct='<div style="font-size:13px;color:#6B7280;margin-bottom:12px;">Recherchez votre organisme par SIRET</div>'
      +'<div style="display:flex;gap:8px;margin-bottom:16px;"><input id="mp-siret" placeholder="SIRET (14 chiffres)" value="'+_mpE(s.siret)+'" oninput="_mpV.siret=this.value" style="flex:1;padding:10px 14px;border:1px solid #E5E7EB;border-radius:8px;font-family:inherit;font-size:14px;font-weight:600;letter-spacing:1px;"><button onclick="mpSiret()" style="padding:10px 18px;background:#D85A30;color:white;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;">Rechercher</button></div>'
      +fh
      +'<div style="font-size:13px;font-weight:600;margin-bottom:8px;">Type d\'organisme</div><select onchange="_mpV.type=this.value" style="width:100%;padding:10px 14px;border:1px solid #E5E7EB;border-radius:8px;font-family:inherit;font-size:13px;margin-bottom:12px;">'+MP_TYPES_VENTE.map(function(t){return '<option'+(s.type===t?' selected':'')+'>'+_mpE(t)+'</option>';}).join('')+'</select>'
      +'<div style="font-size:13px;font-weight:600;margin-bottom:8px;">Titre de l\'annonce</div><input placeholder="Ex: OF Qualiopi + EDOF — 3 formateurs" value="'+_mpE(s.titre)+'" oninput="_mpV.titre=this.value" style="width:100%;padding:10px 14px;border:1px solid #E5E7EB;border-radius:8px;font-family:inherit;font-size:13px;margin-bottom:12px;">'
      +'<label style="display:flex;align-items:center;gap:8px;padding:12px 14px;border:1px solid #E5E7EB;border-radius:10px;cursor:pointer;font-size:13px;"><input type="checkbox" '+(s.isNeuf?'checked':'')+' onchange="_mpV.isNeuf=this.checked;_mpRV();" style="accent-color:#1D9E75;width:18px;height:18px;"> Centre tout neuf</label>';
  } else if(s.section==='certifs'){
    ct='<div style="font-size:13px;color:#6B7280;margin-bottom:12px;">Quels attributs possède votre organisme ?</div><div style="display:flex;flex-wrap:wrap;gap:4px;">'+_mpChip(MP_ATTRIBUTS,s.certifs,'orange','v_certifs')+'</div>';
  } else if(s.section==='chiffres'){
    ct='<div style="font-size:13px;color:#6B7280;margin-bottom:12px;">Chiffres clés</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">'
      +'<div><label style="font-size:11px;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">CA annuel</label><input placeholder="120 000 €" value="'+_mpE(s.ca)+'" oninput="_mpV.ca=this.value" style="width:100%;padding:10px;border:1px solid #E5E7EB;border-radius:8px;font-family:inherit;font-size:13px;"></div>'
      +'<div><label style="font-size:11px;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Formateurs</label><input type="number" placeholder="3" value="'+s.form+'" oninput="_mpV.form=this.value" style="width:100%;padding:10px;border:1px solid #E5E7EB;border-radius:8px;font-family:inherit;font-size:13px;"></div>'
      +'<div><label style="font-size:11px;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Apprenants</label><input type="number" placeholder="45" value="'+s.appr+'" oninput="_mpV.appr=this.value" style="width:100%;padding:10px;border:1px solid #E5E7EB;border-radius:8px;font-family:inherit;font-size:13px;"></div>'
      +'<div><label style="font-size:11px;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Formations</label><input type="number" placeholder="8" value="'+s.nbf+'" oninput="_mpV.nbf=this.value" style="width:100%;padding:10px;border:1px solid #E5E7EB;border-radius:8px;font-family:inherit;font-size:13px;"></div></div>'
      +'<div style="font-size:13px;font-weight:600;margin-bottom:8px;">Description</div><textarea placeholder="Historique, points forts..." oninput="_mpV.desc=this.value" style="width:100%;padding:10px 14px;border:1px solid #E5E7EB;border-radius:8px;font-family:inherit;font-size:13px;min-height:80px;resize:vertical;">'+_mpE(s.desc)+'</textarea>';
  } else if(s.section==='transp'){
    var decls=['Contrôle DREETS en cours ou passé','Dettes ou impayés','Crédit en cours','Contentieux ou litige','Procédure de cessation ou radiation','Autre situation à signaler'];
    ct='<div style="background:#FFF9E6;border:1px solid rgba(186,117,23,.25);border-radius:10px;padding:16px;margin-bottom:16px;"><div style="font-size:13px;font-weight:700;color:#BA7517;margin-bottom:4px;">Déclarations obligatoires</div><div style="font-size:12px;color:#854F0B;margin-bottom:12px;">Ces infos seront révélées à l\'acheteur après engagement.</div>'
      +decls.map(function(d){var chk=s.transp.indexOf(d)>=0;return '<label style="display:flex;align-items:center;gap:10px;padding:6px 0;font-size:12px;color:#633806;cursor:pointer;"><input type="checkbox" '+(chk?'checked':'')+' onchange="mpToggleTransp(\''+_mpE(d)+'\')" style="accent-color:#BA7517;"> '+_mpE(d)+'</label>';}).join('')
      +'</div>'
      +'<label style="display:flex;align-items:center;gap:8px;padding:12px 14px;border:1px solid '+(s.rienASignaler?'#1D9E75':'#E5E7EB')+';border-radius:10px;cursor:pointer;font-size:13px;background:'+(s.rienASignaler?'#E1F5EE':'white')+';"><input type="checkbox" '+(s.rienASignaler?'checked':'')+' onchange="mpToggleRien(this.checked)" style="accent-color:#1D9E75;width:18px;height:18px;"> L\'organisme n\'a rien à signaler</label>';
  } else if(s.section==='prix'){
    ct='<div style="font-size:13px;color:#6B7280;margin-bottom:12px;">Fixez votre prix de vente</div>'
      +'<input type="number" placeholder="15 000" value="'+s.prix+'" oninput="_mpV.prix=this.value;_mpRV();" style="width:100%;padding:14px;border:1px solid #E5E7EB;border-radius:8px;font-family:inherit;font-size:22px;font-weight:800;margin-bottom:12px;">'
      +'<div style="display:flex;gap:12px;margin-bottom:16px;">'
      +'<label style="display:flex;align-items:center;gap:6px;padding:8px 14px;border:1px solid #E5E7EB;border-radius:8px;font-size:12px;cursor:pointer;"><input type="checkbox" '+(s.nego?'checked':'')+' onchange="_mpV.nego=this.checked;"> Prix négociable</label></div>';
    if(pn>0){
      ct+='<div style="background:#F9FAFB;border-radius:10px;padding:16px;"><div style="font-size:11px;font-weight:700;color:#9CA3AF;margin-bottom:10px;">SIMULATION COMMISSION</div>'
        +'<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;"><span style="color:#6B7280;">Commission (10%)</span><span style="font-weight:700;color:#D85A30;">'+comm.toLocaleString('fr-FR')+' €</span></div>'
        +'<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;"><span style="color:#6B7280;">Membre (7%)</span><span style="font-weight:700;color:#1D9E75;">'+commM.toLocaleString('fr-FR')+' €</span></div>'
        +'<div style="border-top:1px solid #E5E7EB;padding-top:8px;margin-top:8px;display:flex;justify-content:space-between;font-size:14px;"><span style="font-weight:700;">Vous recevez</span><span style="font-weight:800;font-size:18px;">'+net.toLocaleString('fr-FR')+' €</span></div>'
        +'<div style="font-size:10px;color:#9CA3AF;margin-top:4px;">Minimum : 800 €</div></div>';
    }
  }

  var errHtml=_mpErr?'<div style="color:#E24B4A;font-size:12px;margin-top:8px;">'+_mpErr+'</div>':'';
  var fl=idx>0?'<button onclick="_mpErr=\'\';_mpV.section=\''+secs[idx-1].id+'\';_mpRV();" style="padding:10px 18px;background:white;border:1px solid #E5E7EB;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;">Retour</button>':'<div></div>';
  var nextFnV=idx<secs.length-1?'mpNextV(\''+secs[idx].id+'\',\''+secs[idx+1].id+'\')':'mpPubVente()';
  var lastBtnLabelV=_mpEditId?(idx<secs.length-1?'Suivant':'Enregistrer'):(idx<secs.length-1?'Suivant':'Publier l\'annonce');
  var fr='<div><button onclick="'+nextFnV+'" style="padding:10px 22px;background:#D85A30;color:white;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;">'+lastBtnLabelV+'</button>'+errHtml+'</div>';

  document.body.insertAdjacentHTML('beforeend','<div id="mp-popup-overlay" onclick="if(event.target===this)this.remove();" style="position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;"><div style="position:absolute;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);"></div><div style="position:relative;background:white;border-radius:18px;width:90%;max-width:680px;max-height:90vh;display:grid;grid-template-columns:200px 1fr;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.15);"><div style="background:#FAECE7;padding:24px 16px;display:flex;flex-direction:column;justify-content:space-between;overflow-y:auto;">'+side+'</div><div style="display:flex;flex-direction:column;"><div style="padding:20px 24px;border-bottom:1px solid #E5E7EB;display:flex;justify-content:space-between;align-items:center;"><div><div style="font-size:16px;font-weight:700;">'+secs[idx].l+'</div><div style="font-size:12px;color:#6B7280;">Étape '+(idx+1)+' / '+secs.length+'</div></div><button onclick="document.getElementById(\'mp-popup-overlay\').remove();" style="background:#F3F4F6;border:none;width:32px;height:32px;border-radius:50%;font-size:14px;cursor:pointer;color:#6B7280;">✕</button></div><div style="padding:20px 24px;flex:1;overflow-y:auto;max-height:420px;">'+ct+'</div><div style="padding:16px 24px;border-top:1px solid #E5E7EB;display:flex;justify-content:space-between;align-items:center;">'+fl+fr+'</div></div></div></div>');
}

// ═══════ HELPERS ═══════
function mpChip(gid,val){
  var map={'a_types':_mpA.types,'a_certifs':_mpA.certifs,'a_fin':_mpA.financements,'a_opcos':_mpA.opcos,'a_svc':_mpA.services,'v_certifs':_mpV.certifs,'v_transp':_mpV.transp};
  var arr=map[gid];if(!arr)return;
  var i=arr.indexOf(val);if(i>=0)arr.splice(i,1);else arr.push(val);
  if(gid.indexOf('a_')===0)_mpRA();else _mpRV();
}

function mpToggleTransp(val){
  var arr=_mpV.transp;
  var i=arr.indexOf(val);if(i>=0)arr.splice(i,1);else arr.push(val);
  // Si on coche une déclaration → décocher "rien à signaler"
  if(arr.length>0) _mpV.rienASignaler=false;
  _mpRV();
}

function mpToggleRien(checked){
  _mpV.rienASignaler=checked;
  if(checked){
    // Décocher toutes les déclarations
    _mpV.transp=[];
    _mpV.hasDettes=false;
    _mpV.dettesDetails='';
  }
  _mpRV();
}

function mpNextA(curId,nextId){
  if(!_mpValA(curId)){_mpErr='Veuillez remplir les champs obligatoires';_mpRA();return;}
  _mpErr='';_mpA.section=nextId;_mpRA();
}
function mpNextV(curId,nextId){
  if(!_mpValV(curId)){_mpErr='Veuillez remplir les champs obligatoires';_mpRV();return;}
  _mpErr='';_mpV.section=nextId;_mpRV();
}

async function mpSiret(){
  var si=_mpV.siret.replace(/\s/g,'');
  if(si.length!==14){alert('14 chiffres');return;}
  try{var r=await fetch('https://recherche-entreprises.api.gouv.fr/search?q='+si);var d=await r.json();var e=d.results&&d.results[0];
    if(!e){alert('Introuvable');return;}
    var sg=e.siege||{};
    _mpV.found={rs:e.nom_complet||'',siren:e.siren||'',fj:e.nature_juridique||'',adr:(sg.adresse||'')+' '+(sg.code_postal||'')+' '+(sg.commune||'')};
    _mpRV();
  }catch(er){alert('Erreur');}
}

async function mpPubAchat(){
  var client=window.sb||window.__lfoSupabase;
  var sess=await _mpCheckAuth();if(!sess){alert('Connectez-vous');return;}
  var s=_mpA;
  var {error}=await client.from('marketplace_requests').insert({
    user_id:sess.user.id,type:'achat',organisme_type:JSON.stringify(s.types),
    title:s.types.join(', ')+' — '+s.region,description:s.desc,region:s.region,
    budget_min:s.bMin?parseInt(s.bMin)*100:null,budget_max:s.bMax?parseInt(s.bMax)*100:null,
    certifications:JSON.stringify(s.certifs),financements:JSON.stringify(s.financements),
    opcos:JSON.stringify(s.opcos),services_inclus:JSON.stringify(s.services),
    urgency:s.urgency,is_neuf:s.isNeuf,accept_dettes:s.acceptDettes,accept_controle:s.acceptControle,wants_escrow:s.wantsEscrow,
    status:'active'
  });
  if(error){alert('Erreur : '+error.message);return;}
  document.getElementById('mp-popup-overlay').remove();
  if(typeof mpLoadAnnonces==='function')mpLoadAnnonces();
  alert('Votre recherche a été publiée !');
}

async function mpPubVente(){
  var client=window.sb||window.__lfoSupabase;
  var sess=await _mpCheckAuth();if(!sess){alert('Connectez-vous');return;}
  var s=_mpV;var pn=parseInt(s.prix)||0;
  var {error}=await client.from('marketplace_requests').insert({
    user_id:sess.user.id,type:'vente',organisme_type:JSON.stringify([s.type]),
    title:s.titre||s.type,description:s.desc,
    siren:s.siret,raison_sociale:s.found?s.found.rs:'',forme_juridique:s.found?s.found.fj:'',
    adresse:s.found?s.found.adr:'',region:s.found?s.found.adr:'',
    certifications:JSON.stringify(s.certifs),ca_annual:s.ca,
    nb_formateurs:parseInt(s.form)||0,nb_apprenants:parseInt(s.appr)||0,nb_formations:parseInt(s.nbf)||0,
    transparency:JSON.stringify(s.transp),listing_price_cents:pn*100,
    is_negotiable:s.nego,is_neuf:s.isNeuf,
    has_dettes:s.hasDettes,dettes_details:s.dettesDetails||null,
    status:'active'
  });
  if(error){alert('Erreur : '+error.message);return;}
  document.getElementById('mp-popup-overlay').remove();
  if(typeof mpLoadAnnonces==='function')mpLoadAnnonces();
  alert('Votre annonce a été publiée !');
}

// ═══════ POPUP OFFRE / PROPOSITION ═══════

var _mpProposalSiret={found:null,siret:''};

async function showOffrePopup(annonce, mode){
  var sess=await _mpCheckAuth();
  if(!sess){_mpShowLoginPopup(mode==='proposition'?'vente':'achat');return;}
  _mpProposalSiret={found:null,siret:''};
  _mpRenderOffrePopup(annonce,mode);
}

function _mpRenderOffrePopup(annonce,mode){
  var ex=document.getElementById('mp-popup-overlay');if(ex)ex.remove();
  var isVente=mode==='offre';
  var color=isVente?'#D85A30':'#1D9E75';
  var title=isVente?'Faire une offre':'Proposer un organisme';
  var btnLabel=isVente?'Envoyer mon offre':'Envoyer ma proposition';
  var pricePlaceholder=annonce.listing_price_cents?Math.round(annonce.listing_price_cents/100):'';
  var certs=annonce.certifications||[];if(typeof certs==='string'){try{certs=JSON.parse(certs);}catch(e){certs=[];}}
  var typeLabel=annonce.organisme_type||'OF';if(typeof typeLabel==='string'&&typeLabel.charAt(0)==='['){try{typeLabel=JSON.parse(typeLabel).join(', ');}catch(e){}}

  var rappel='<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"><span style="font-size:10px;font-weight:700;padding:3px 10px;border-radius:10px;color:'+color+';background:'+(isVente?'#FFF8F3':'#E1F5EE')+';">'+_mpE(typeLabel)+'</span>'
    +certs.slice(0,3).map(function(c){return '<span style="font-size:10px;padding:3px 10px;border-radius:10px;background:#F3F4F6;color:#6B7280;">'+_mpE(c)+'</span>';}).join('')+'</div>';
  if(isVente&&annonce.listing_price_cents) rappel+='<div style="font-size:12px;color:#9CA3AF;margin-bottom:12px;">Prix demandé : <span style="text-decoration:line-through;">'+Math.round(annonce.listing_price_cents/100).toLocaleString('fr-FR')+' €</span></div>';
  if(!isVente&&(annonce.budget_min||annonce.budget_max)) rappel+='<div style="font-size:12px;color:#9CA3AF;margin-bottom:12px;">Budget : '+(annonce.budget_min?Math.round(annonce.budget_min/100).toLocaleString('fr-FR'):'?')+' — '+(annonce.budget_max?Math.round(annonce.budget_max/100).toLocaleString('fr-FR'):'?')+' €</div>';

  var content='';

  if(!isVente){
    // Proposition mode: SIRET search
    var foundHtml='';
    if(_mpProposalSiret.found){
      var f=_mpProposalSiret.found;
      foundHtml='<div style="border:1px solid #c0dd97;border-radius:10px;padding:14px;background:#f8fdf6;margin-bottom:14px;"><div style="font-size:11px;color:#1D9E75;font-weight:500;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Organisme trouvé</div><div style="font-size:14px;font-weight:700;">'+_mpE(f.rs)+'</div><div style="font-size:12px;color:#6B7280;">'+_mpE(f.fj+' · '+f.adr)+'</div></div>';
    }
    content+='<div style="margin-bottom:14px;"><label style="font-size:12px;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">SIRET de votre organisme</label><div style="display:flex;gap:8px;"><input id="mp-prop-siret" placeholder="14 chiffres" value="'+_mpE(_mpProposalSiret.siret)+'" oninput="_mpProposalSiret.siret=this.value" style="flex:1;padding:10px 14px;border:1px solid #E5E7EB;border-radius:8px;font-family:inherit;font-size:14px;font-weight:600;letter-spacing:1px;"><button onclick="mpSearchPropSiret(\''+annonce.id+'\')" style="padding:10px 18px;background:#1D9E75;color:white;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;">Rechercher</button></div></div>'
      +foundHtml;
  }

  content+='<div style="margin-bottom:14px;"><label style="font-size:12px;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">'+(isVente?'Votre offre (€)':'Votre prix de vente (€)')+'</label><input type="number" id="mp-offre-montant" placeholder="'+pricePlaceholder+'" style="width:100%;padding:14px;border:1px solid #E5E7EB;border-radius:8px;font-family:inherit;font-size:20px;font-weight:700;"></div>'
    +'<div style="margin-bottom:14px;"><label style="font-size:12px;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">'+(isVente?'Message au vendeur':'Décrivez votre organisme')+'</label><textarea id="mp-offre-msg" placeholder="'+(isVente?'Présentez-vous et expliquez votre projet...':'Certifications, CA, nombre de formateurs, points forts...')+'" style="width:100%;padding:10px 14px;border:1px solid #E5E7EB;border-radius:8px;font-family:inherit;font-size:13px;min-height:80px;resize:vertical;"></textarea></div>'
    +'<div style="padding:10px 14px;background:#F9FAFB;border-radius:8px;font-size:11px;color:#9CA3AF;line-height:1.5;">'+(isVente?'Votre offre sera envoyée au vendeur.':'Votre proposition sera envoyée à l\'acheteur. Le SIRET et les détails seront visibles après acceptation.')+'</div>';

  var h='<div id="mp-popup-overlay" onclick="if(event.target===this)this.remove();" style="position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;">'
    +'<div style="position:absolute;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);"></div>'
    +'<div style="position:relative;background:white;border-radius:18px;max-width:480px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 24px 80px rgba(0,0,0,.15);">'
    +'<div style="padding:20px 24px;border-bottom:1px solid #E5E7EB;"><div style="font-size:18px;font-weight:800;">'+title+'</div><div style="font-size:13px;color:#6B7280;margin-top:4px;">'+_mpE(annonce.title||'')+'</div></div>'
    +'<div style="padding:20px 24px;">'+rappel+content+'</div>'
    +'<div style="padding:16px 24px;border-top:1px solid #E5E7EB;display:flex;justify-content:space-between;">'
    +'<button onclick="document.getElementById(\'mp-popup-overlay\').remove();" style="padding:10px 18px;background:white;border:1px solid #E5E7EB;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;">Annuler</button>'
    +'<button onclick="mpSubmitOffre(\''+annonce.id+'\',\''+mode+'\')" style="padding:10px 22px;background:'+color+';color:white;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;">'+btnLabel+'</button>'
    +'</div></div></div>';
  document.body.insertAdjacentHTML('beforeend',h);
}

async function mpSearchPropSiret(annonceId){
  var si=_mpProposalSiret.siret.replace(/\s/g,'');
  if(si.length!==14){alert('14 chiffres');return;}
  try{
    var r=await fetch('https://recherche-entreprises.api.gouv.fr/search?q='+si);var d=await r.json();var e=d.results&&d.results[0];
    if(!e){alert('SIRET non trouvé');return;}
    var sg=e.siege||{};
    _mpProposalSiret.found={rs:e.nom_complet||'',siren:e.siren||'',fj:e.nature_juridique||'',adr:(sg.adresse||'')+' '+(sg.code_postal||'')+' '+(sg.commune||'')};
    var a=window._mpAnnonces&&window._mpAnnonces[annonceId];
    if(a)_mpRenderOffrePopup(a,'proposition');
  }catch(er){alert('Erreur recherche');}
}

async function mpSubmitOffre(requestId,mode){
  var client=window.sb||window.__lfoSupabase;
  var sess=await _mpCheckAuth();if(!sess){alert('Connectez-vous');return;}
  var montant=parseInt(document.getElementById('mp-offre-montant').value)||0;
  if(montant<=0){alert('Saisissez un montant');return;}
  var isProposition=mode==='proposition';
  if(isProposition&&!_mpProposalSiret.found){alert('Recherchez votre SIRET d\'abord');return;}
  var msg=document.getElementById('mp-offre-msg').value.trim();
  var payload={request_id:requestId,user_id:sess.user.id,amount_cents:montant*100,price_cents:montant*100,message:msg||null,status:'pending'};
  if(isProposition&&_mpProposalSiret.found){
    payload.metadata=JSON.stringify({siren:_mpProposalSiret.siret,raison_sociale:_mpProposalSiret.found.rs,forme_juridique:_mpProposalSiret.found.fj,adresse:_mpProposalSiret.found.adr});
  }
  var {error}=await client.from('marketplace_proposals').insert(payload);
  if(error){alert('Erreur : '+error.message);return;}
  document.getElementById('mp-popup-overlay').remove();
  alert(isProposition?'Proposition envoyée !':'Offre envoyée !');
  if(typeof mpLoadAnnonces==='function')mpLoadAnnonces();
}

// Store annonces globally for popup access
window._mpAnnonces=[];

// ═══════ POPUP DETAIL ANNONCE ═══════
async function showAnnonceDetail(id){
  var a=window._mpAnnonces&&window._mpAnnonces[id];
  if(!a)return;
  var ex=document.getElementById('mp-popup-overlay');if(ex)ex.remove();
  var isV=a.type==='vente';var color=isV?'#D85A30':'#1D9E75';var bg=isV?'#FAECE7':'#E1F5EE';
  var certs=a.certifications||[];if(typeof certs==='string'){try{certs=JSON.parse(certs);}catch(e){certs=[];}}
  var fins=a.financements||[];if(typeof fins==='string'){try{fins=JSON.parse(fins);}catch(e){fins=[];}}
  var opcos=a.opcos||[];if(typeof opcos==='string'){try{opcos=JSON.parse(opcos);}catch(e){opcos=[];}}
  var svcs=a.services_inclus||[];if(typeof svcs==='string'){try{svcs=JSON.parse(svcs);}catch(e){svcs=[];}}
  var transp=a.transparency||[];if(typeof transp==='string'){try{transp=JSON.parse(transp);}catch(e){transp=[];}}
  var typeL=a.organisme_type||'';if(typeof typeL==='string'&&typeL.charAt(0)==='['){try{typeL=JSON.parse(typeL).join(', ');}catch(e){}}
  var ville=a.region||'—';if(a.adresse){var m=a.adresse.match(/\d{5}\s+(.+)/);if(m)ville=m[1];}

  var chips=function(arr,c){return arr.map(function(x){return '<span style="font-size:10px;padding:3px 10px;border-radius:10px;background:'+c+';display:inline-block;margin:2px;">'+_mpE(x)+'</span>';}).join('');};
  var dateFmt=function(iso){if(!iso)return'';return new Date(iso).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});};

  var body='<div style="padding:20px 24px;">';

  if(isV){
    if(a.description)body+='<div style="font-size:13px;color:#6B7280;line-height:1.6;margin-bottom:16px;">'+_mpE(a.description)+'</div>';
    body+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">';
    body+='<div style="background:#F9FAFB;padding:10px 14px;border-radius:8px;"><div style="font-size:9px;color:#9CA3AF;text-transform:uppercase;">Ville</div><div style="font-size:13px;font-weight:600;">'+_mpE(ville)+'</div></div>';
    body+='<div style="background:#F9FAFB;padding:10px 14px;border-radius:8px;"><div style="font-size:9px;color:#9CA3AF;text-transform:uppercase;">CA annuel</div><div style="font-size:13px;font-weight:600;">'+_mpE(a.ca_annual||'—')+'</div></div>';
    body+='<div style="background:#F9FAFB;padding:10px 14px;border-radius:8px;"><div style="font-size:9px;color:#9CA3AF;text-transform:uppercase;">Formateurs</div><div style="font-size:13px;font-weight:600;">'+(a.nb_formateurs||'—')+'</div></div>';
    body+='<div style="background:#F9FAFB;padding:10px 14px;border-radius:8px;"><div style="font-size:9px;color:#9CA3AF;text-transform:uppercase;">Apprenants</div><div style="font-size:13px;font-weight:600;">'+(a.nb_apprenants||'—')+'</div></div></div>';
    if(certs.length)body+='<div style="margin-bottom:10px;">'+chips(certs,'#E1F5EE')+'</div>';
    if(a.nb_formations)body+='<div style="font-size:12px;color:#6B7280;margin-bottom:10px;">'+a.nb_formations+' formations actives</div>';
    if(a.listing_price_cents)body+='<div style="font-size:28px;font-weight:800;color:#D85A30;margin:16px 0;">'+Math.round(a.listing_price_cents/100).toLocaleString('fr-FR')+' €</div>';
    if(a.is_negotiable)body+='<div style="font-size:12px;color:#6B7280;margin-bottom:8px;">Prix négociable</div>';
  } else {
    if(a.description)body+='<div style="font-size:13px;color:#6B7280;line-height:1.6;margin-bottom:16px;">'+_mpE(a.description)+'</div>';
    if(a.region)body+='<div style="font-size:12px;margin-bottom:10px;"><b>Région :</b> '+_mpE(a.region)+'</div>';
    if(certs.length)body+='<div style="margin-bottom:8px;"><span style="font-size:11px;font-weight:600;color:#6B7280;">Attributs : </span>'+chips(certs,'#E1F5EE')+'</div>';
    if(fins.length)body+='<div style="margin-bottom:8px;"><span style="font-size:11px;font-weight:600;color:#6B7280;">Financements : </span>'+chips(fins,'#E6F1FB')+'</div>';
    if(opcos.length)body+='<div style="margin-bottom:8px;"><span style="font-size:11px;font-weight:600;color:#6B7280;">OPCO : </span>'+chips(opcos,'#E6F1FB')+'</div>';
    if(svcs.length)body+='<div style="margin-bottom:8px;"><span style="font-size:11px;font-weight:600;color:#6B7280;">Services : </span>'+chips(svcs,'#EEEDFE')+'</div>';
    if(a.budget_min||a.budget_max)body+='<div style="font-size:24px;font-weight:800;color:#1D9E75;margin:16px 0;">'+Math.round((a.budget_min||0)/100).toLocaleString('fr-FR')+' — '+Math.round((a.budget_max||0)/100).toLocaleString('fr-FR')+' €</div>';
    if(a.urgency&&a.urgency!=='normal'){var uc=a.urgency==='urgent'?'#E24B4A':'#BA7517';var ul=a.urgency==='urgent'?'Urgent':'Sous 1 mois';body+='<div style="margin-bottom:8px;"><span style="font-size:10px;font-weight:700;padding:3px 10px;border-radius:10px;color:white;background:'+uc+';">'+ul+'</span></div>';}
    if(a.wants_escrow)body+='<div style="font-size:12px;color:#378ADD;margin-bottom:8px;">Séquestre souhaité</div>';
  }
  body+='<div style="font-size:11px;color:#9CA3AF;margin-top:12px;">Publié le '+dateFmt(a.created_at)+'</div>';
  body+='</div>';

  // Footer buttons based on ownership
  var curUid=null;try{var client=window.sb||window.__lfoSupabase;var ss=await client.auth.getSession();if(ss.data&&ss.data.session)curUid=ss.data.session.user.id;}catch(e){}
  var footer='';
  if(curUid&&a.user_id===curUid){
    footer='<div style="padding:16px 24px;border-top:1px solid #E5E7EB;display:flex;justify-content:space-between;">'
      +'<button onclick="document.getElementById(\'mp-popup-overlay\').remove();mpStartEdit(window._mpAnnonces[\''+a.id+'\']);" style="padding:10px 20px;background:white;border:1px solid #E5E7EB;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;color:#6B7280;">Modifier</button>'
      +'<button onclick="mpDeleteFromDetail(\''+a.id+'\')" style="padding:10px 20px;background:white;border:1px solid #E24B4A;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;color:#E24B4A;">Supprimer</button></div>';
  } else if(curUid){
    var btnTxt=isV?'Faire une offre':'Proposer un organisme';
    var mode=isV?'offre':'proposition';
    footer='<div style="padding:16px 24px;border-top:1px solid #E5E7EB;text-align:right;">'
      +'<button onclick="document.getElementById(\'mp-popup-overlay\').remove();showOffrePopup(window._mpAnnonces[\''+a.id+'\'],\''+mode+'\');" style="padding:10px 22px;background:'+color+';color:white;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;">'+btnTxt+'</button></div>';
  } else {
    footer='<div style="padding:16px 24px;border-top:1px solid #E5E7EB;text-align:center;font-size:12px;color:#9CA3AF;">Connectez-vous pour interagir</div>';
  }

  // Badges header
  var badges='<span style="font-size:10px;font-weight:700;padding:3px 10px;border-radius:10px;color:'+color+';background:white;">'+_mpE(isV?'Vente':'Achat')+'</span>'
    +'<span style="font-size:10px;font-weight:700;padding:3px 10px;border-radius:10px;color:'+color+';background:white;">'+_mpE(typeL)+'</span>'
    +(a.is_neuf?'<svg viewBox="0 0 60 24" style="width:50px;vertical-align:middle;"><rect width="60" height="24" rx="6" fill="#1D9E75"/><text x="30" y="16" text-anchor="middle" fill="white" font-size="11" font-weight="700" font-family="DM Sans,sans-serif">NEUF</text></svg>':'');

  var h='<div id="mp-popup-overlay" onclick="if(event.target===this)this.remove();" style="position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;">'
    +'<div style="position:absolute;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);"></div>'
    +'<div style="position:relative;background:white;border-radius:18px;max-width:560px;width:100%;max-height:85vh;overflow-y:auto;box-shadow:0 24px 80px rgba(0,0,0,.15);">'
    +'<div style="padding:20px 24px;background:'+bg+';border-radius:18px 18px 0 0;"><div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">'+badges+'</div><h2 style="font-size:18px;font-weight:800;color:#1a1a1a;margin:0;">'+_mpE(a.title||'Annonce')+'</h2></div>'
    +body+footer
    +'</div></div>';
  document.body.insertAdjacentHTML('beforeend',h);
}

async function mpDeleteFromDetail(id){
  if(!confirm('Supprimer cette annonce ?'))return;
  var client=window.sb||window.__lfoSupabase;
  await client.from('marketplace_requests').update({status:'deleted'}).eq('id',id);
  document.getElementById('mp-popup-overlay').remove();
  alert('Annonce supprimée');
  if(typeof mpLoadAnnonces==='function')mpLoadAnnonces();
}

// ═══════ EDIT MODE ═══════
var _mpEditId=null;

function mpStartEdit(annonce){
  _mpEditId=annonce.id;
  if(annonce.type==='vente'){
    var certs=annonce.certifications||[];if(typeof certs==='string'){try{certs=JSON.parse(certs);}catch(e){certs=[];}}
    var typeL=annonce.organisme_type||'OF';if(typeof typeL==='string'&&typeL.charAt(0)==='['){try{typeL=JSON.parse(typeL)[0]||'OF';}catch(e){}}
    _mpV={section:'org',siret:annonce.siren||'',found:annonce.raison_sociale?{rs:annonce.raison_sociale,siren:annonce.siren||'',fj:annonce.forme_juridique||'',adr:annonce.adresse||''}:null,type:typeL,titre:annonce.title||'',isNeuf:!!annonce.is_neuf,certifs:certs,ca:annonce.ca_annual||'',form:''+(annonce.nb_formateurs||''),appr:''+(annonce.nb_apprenants||''),nbf:''+(annonce.nb_formations||''),desc:annonce.description||'',transp:annonce.transparency||[],rienASignaler:false,hasDettes:!!annonce.has_dettes,dettesDetails:annonce.dettes_details||'',prix:annonce.listing_price_cents?''+Math.round(annonce.listing_price_cents/100):'',nego:!!annonce.is_negotiable,escrow:false};
    if(typeof _mpV.transp==='string'){try{_mpV.transp=JSON.parse(_mpV.transp);}catch(e){_mpV.transp=[];}}
    if(!_mpV.transp.length&&!_mpV.hasDettes)_mpV.rienASignaler=true;
    _mpRV();
  } else {
    var certs2=annonce.certifications||[];if(typeof certs2==='string'){try{certs2=JSON.parse(certs2);}catch(e){certs2=[];}}
    var fins=annonce.financements||[];if(typeof fins==='string'){try{fins=JSON.parse(fins);}catch(e){fins=[];}}
    var opcos=annonce.opcos||[];if(typeof opcos==='string'){try{opcos=JSON.parse(opcos);}catch(e){opcos=[];}}
    var svcs=annonce.services_inclus||[];if(typeof svcs==='string'){try{svcs=JSON.parse(svcs);}catch(e){svcs=[];}}
    var types=annonce.organisme_type||[];if(typeof types==='string'){try{types=JSON.parse(types);}catch(e){types=[];}}
    _mpA={section:'type',types:types,isNeuf:!!annonce.is_neuf,certifs:certs2,financements:fins,opcos:opcos,finAutre:'',services:svcs,bMin:annonce.budget_min?''+Math.round(annonce.budget_min/100):'',bMax:annonce.budget_max?''+Math.round(annonce.budget_max/100):'',urgency:annonce.urgency||'normal',acceptControle:!!annonce.accept_controle,wantsEscrow:!!annonce.wants_escrow,acceptDettes:!!annonce.accept_dettes,region:annonce.region||'Toute France',desc:annonce.description||''};
    _mpRA();
  }
}

// Override publish functions to handle edit mode
var _origPubAchat=mpPubAchat;
mpPubAchat=async function(){
  if(_mpEditId){
    var client=window.sb||window.__lfoSupabase;var s=_mpA;
    var {error}=await client.from('marketplace_requests').update({
      organisme_type:JSON.stringify(s.types),title:s.types.join(', ')+' — '+s.region,
      description:s.desc,region:s.region,budget_min:s.bMin?parseInt(s.bMin)*100:null,
      budget_max:s.bMax?parseInt(s.bMax)*100:null,certifications:JSON.stringify(s.certifs),
      financements:JSON.stringify(s.financements),opcos:JSON.stringify(s.opcos),
      services_inclus:JSON.stringify(s.services),urgency:s.urgency,
      is_neuf:s.isNeuf,accept_dettes:s.acceptDettes,accept_controle:s.acceptControle,wants_escrow:s.wantsEscrow
    }).eq('id',_mpEditId);
    if(error){alert('Erreur : '+error.message);return;}
    document.getElementById('mp-popup-overlay').remove();
    _mpEditId=null;
    alert('Annonce mise à jour !');
    if(typeof window._mpAfterEdit==='function'){window._mpAfterEdit();window._mpAfterEdit=null;}
    else if(typeof mpLoadAnnonces==='function')mpLoadAnnonces();
    return;
  }
  return _origPubAchat();
};

var _origPubVente=mpPubVente;
mpPubVente=async function(){
  if(_mpEditId){
    var client=window.sb||window.__lfoSupabase;var s=_mpV;var pn=parseInt(s.prix)||0;
    var {error}=await client.from('marketplace_requests').update({
      organisme_type:JSON.stringify([s.type]),title:s.titre||s.type,description:s.desc,
      certifications:JSON.stringify(s.certifs),ca_annual:s.ca,
      nb_formateurs:parseInt(s.form)||0,nb_apprenants:parseInt(s.appr)||0,nb_formations:parseInt(s.nbf)||0,
      transparency:JSON.stringify(s.transp),listing_price_cents:pn*100,
      is_negotiable:s.nego,is_neuf:s.isNeuf,has_dettes:s.hasDettes,dettes_details:s.dettesDetails||null
    }).eq('id',_mpEditId);
    if(error){alert('Erreur : '+error.message);return;}
    document.getElementById('mp-popup-overlay').remove();
    _mpEditId=null;
    alert('Annonce mise à jour !');
    if(typeof window._mpAfterEdit==='function'){window._mpAfterEdit();window._mpAfterEdit=null;}
    else if(typeof mpLoadAnnonces==='function')mpLoadAnnonces();
    return;
  }
  return _origPubVente();
};

// Check for edit on page load (from dashboard redirect)
document.addEventListener('DOMContentLoaded',function(){
  if(window.location.hash==='#edit'){
    var raw=sessionStorage.getItem('mp_edit');
    if(raw){
      sessionStorage.removeItem('mp_edit');
      try{var a=JSON.parse(raw);setTimeout(function(){mpStartEdit(a);},500);}catch(e){}
    }
  }
});
