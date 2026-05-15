/**
 * LFO Expert Popup — showExpertPopup()
 * Affiche la liste des conseillers avec RDV / LinkedIn
 * Utilise window.sb (Supabase client)
 */

window.LFO_PHONE = '01 84 80 69 22';
window.LFO_PHONE_TEL = '+33184806922';
window.LFO_CAL_MARIE = 'https://cal.eu/formation2024-fubqzo/15min';

window.showExpertPopup = async function() {
  // Remove existing popup if any
  var existing = document.getElementById('expert-popup-overlay');
  if (existing) existing.remove();

  // Fetch conseillers from profiles
  var conseillers = [];
  try {
    var client = window.sb || window.__lfoSupabase;
    if (!client) { alert('Erreur: Supabase non initialisé'); return; }
    var r = await client.from('profiles').select('id, first_name, last_name, photo_url, poste, linkedin_url, cal_url, is_available, is_conseiller').eq('is_conseiller', true).order('first_name');
    if (r.data) conseillers = r.data;
  } catch(e) {
    console.warn('Expert popup error:', e);
  }

  if (!conseillers.length) {
    // Fallback hardcoded
    conseillers = [
      { first_name: 'Yohan', poste: 'Expert Tech & IA', photo_url: '/team/yohan.png', is_available: true, cal_url: null, linkedin_url: null },
      { first_name: 'Philippe', poste: 'Ancien directeur OPCO', photo_url: '/team/philippe.png', is_available: true, cal_url: null, linkedin_url: null },
      { first_name: 'Amina', poste: 'Experte Pédagogique', photo_url: '/team/amina.png', is_available: true, cal_url: null, linkedin_url: null },
      { first_name: 'Karim', poste: 'Expert conformité', photo_url: '/team/karim.png', is_available: true, cal_url: null, linkedin_url: null },
      { first_name: 'Marie', poste: 'Assistante pédagogique', photo_url: '/team/marie.png', is_available: true, cal_url: null, linkedin_url: null },
      { first_name: 'Josh', poste: 'Auditeur Qualiopi', photo_url: '/team/josh.png', is_available: false, cal_url: null, linkedin_url: null },
      { first_name: 'Laurent', poste: 'Expert Achat / Revente', photo_url: '/team/laurent.png', is_available: true, cal_url: null, linkedin_url: null },
    ];
  }

  // Détection mobile (sur PC : tel: ouvre FaceTime/Skype, on préfère afficher le numéro)
  var isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches);

  // Build conseillers list — sans bouton RDV individuel, juste avatar + nom + poste + LinkedIn + dot dispo
  var listHtml = conseillers.map(function(c) {
    var photoSrc = c.photo_url || '/team/default.png';
    var name = (c.first_name || '') + (c.last_name ? ' ' + c.last_name.charAt(0) + '.' : '');
    var poste = c.poste || 'Conseiller LFO';
    var linkedinSvg = '<svg viewBox="0 0 20 20" fill="#0A66C2" style="width:14px;height:14px;vertical-align:middle;"><path d="M17.04 17.04h-2.96v-4.64c0-1.11-.02-2.53-1.54-2.53-1.54 0-1.78 1.2-1.78 2.45v4.72H7.8V7.5h2.84v1.3h.04c.4-.75 1.36-1.54 2.8-1.54 3 0 3.56 1.97 3.56 4.54v5.24zM4.45 6.2a1.72 1.72 0 110-3.44 1.72 1.72 0 010 3.44zM5.93 17.04H2.97V7.5h2.96v9.54z"/></svg>';
    var linkedinHtml = (c.linkedin_url && c.linkedin_url.trim()) ? ' <a href="' + c.linkedin_url + '" target="_blank" rel="noopener" style="display:inline-block;margin-left:4px;">' + linkedinSvg + '</a>' : '';

    return '<div style="display:flex;align-items:center;gap:14px;padding:11px 0;border-bottom:1px solid #F3F4F6;">' +
      '<img src="' + photoSrc + '" style="width:44px;height:44px;border-radius:50%;object-fit:cover;border:2px solid #E5E7EB;flex-shrink:0;" onerror="this.style.background=\'#F3F4F6\';this.src=\'\';this.outerHTML=\'<div style=\\\'width:44px;height:44px;border-radius:50%;background:#FAECE7;display:flex;align-items:center;justify-content:center;font-weight:700;color:#993C1D;font-size:16px;flex-shrink:0;\\\'>' + (c.first_name || 'E').charAt(0) + '</div>\'">' +
      '<div style="flex:1;min-width:0;">' +
      '<div style="font-size:14px;font-weight:700;color:#1a1a1a;line-height:1.2;">' + name + linkedinHtml + '</div>' +
      '<div style="font-size:11px;color:#6B7280;margin-top:2px;">' + poste + '</div>' +
      '</div>' +
      '</div>';
  }).join('');

  // Bouton "Appeler" : mobile = tel:, PC = vue numéro en gros
  var phoneAttr = isMobile ? 'href="tel:' + window.LFO_PHONE_TEL + '"' : 'href="#" onclick="showLfoPhoneView();return false;"';
  var phoneLabel = isMobile ? 'Appeler maintenant' : 'Voir le numéro';

  var quickActionsHtml = '<div style="padding:18px 24px 4px;">' +
    '<p style="font-size:12px;color:#6B7280;margin:0 0 12px;text-align:center;">Parlez à un conseiller dès maintenant</p>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">' +
    '<a href="' + window.LFO_CAL_MARIE + '" target="_blank" rel="noopener" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:16px 12px;background:#FFF8F3;border:1.5px solid #D85A30;border-radius:12px;text-decoration:none;color:#993C1D;transition:all .15s;" onmouseover="this.style.background=\'#D85A30\';this.style.color=\'white\';" onmouseout="this.style.background=\'#FFF8F3\';this.style.color=\'#993C1D\';">' +
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' +
    '<div style="font-size:12px;font-weight:700;text-align:center;line-height:1.2;">Réserver en ligne</div>' +
    '<div style="font-size:10px;opacity:.75;text-align:center;">RDV gratuit · 15 min</div>' +
    '</a>' +
    '<a ' + phoneAttr + ' style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:16px 12px;background:#E1F5EE;border:1.5px solid #1D9E75;border-radius:12px;text-decoration:none;color:#0F6E56;transition:all .15s;cursor:pointer;" onmouseover="this.style.background=\'#1D9E75\';this.style.color=\'white\';" onmouseout="this.style.background=\'#E1F5EE\';this.style.color=\'#0F6E56\';">' +
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
    '<div style="font-size:12px;font-weight:700;text-align:center;line-height:1.2;">' + phoneLabel + '</div>' +
    '<div style="font-size:11px;font-weight:600;text-align:center;letter-spacing:.5px;">' + window.LFO_PHONE + '</div>' +
    '</a>' +
    '</div>' +
    '<div style="display:flex;align-items:center;gap:12px;margin:18px 0 4px;">' +
    '<div style="flex:1;height:1px;background:#E5E7EB;"></div>' +
    '<span style="font-size:10px;font-weight:600;letter-spacing:1.5px;color:#9CA3AF;text-transform:uppercase;">Notre équipe</span>' +
    '<div style="flex:1;height:1px;background:#E5E7EB;"></div>' +
    '</div>' +
    '</div>';

  // CTA principal "Réserver un appel" affiché en haut de la liste des conseillers
  var listTopCtaHtml = '<div style="padding:0 24px 14px;">' +
    '<a href="' + window.LFO_CAL_MARIE + '" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:13px 18px;background:#D85A30;color:white;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;text-decoration:none;transition:background .15s;box-sizing:border-box;" onmouseover="this.style.background=\'#c04e28\';" onmouseout="this.style.background=\'#D85A30\';">' +
    '<img src="/team/marie.png" alt="Marie" style="width:28px;height:28px;border-radius:50%;border:2px solid white;object-fit:cover;" onerror="this.style.display=\'none\';">' +
    '<span>Réserver un appel avec un expert</span>' +
    '</a>' +
    '<p style="font-size:11px;color:#9CA3AF;text-align:center;margin:8px 0 0;">15 minutes · gratuit · sans engagement</p>' +
    '</div>';

  var popupHtml = '<div id="expert-popup-overlay" onclick="if(event.target===this)this.remove();" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;">' +
    '<div id="expert-popup-content" style="background:white;border-radius:18px;max-width:480px;width:100%;max-height:88vh;overflow-y:auto;box-shadow:0 24px 80px rgba(0,0,0,0.15);">' +
    '<div style="padding:20px 24px;border-bottom:1px solid #E5E7EB;display:flex;justify-content:space-between;align-items:center;">' +
    '<h2 style="font-size:18px;font-weight:800;margin:0;">Parler à un expert</h2>' +
    '<button onclick="document.getElementById(\'expert-popup-overlay\').remove();" style="background:#F3F4F6;border:none;width:32px;height:32px;border-radius:50%;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#666;">&times;</button>' +
    '</div>' +
    quickActionsHtml +
    listTopCtaHtml +
    '<div style="padding:0 24px 20px;">' + listHtml + '</div>' +
    '</div></div>';

  document.body.insertAdjacentHTML('beforeend', popupHtml);
};

// Vue PC : affiche le numéro en gros (au lieu d'un href tel: qui ouvrirait FaceTime)
window.showLfoPhoneView = function() {
  var content = document.getElementById('expert-popup-content');
  if (!content) return;
  var html = '<div style="padding:20px 24px;border-bottom:1px solid #E5E7EB;display:flex;justify-content:space-between;align-items:center;">' +
    '<button onclick="showExpertPopup();return false;" style="background:none;border:none;font-size:13px;color:#6B7280;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:4px;padding:0;">‹ Retour</button>' +
    '<button onclick="document.getElementById(\'expert-popup-overlay\').remove();" style="background:#F3F4F6;border:none;width:32px;height:32px;border-radius:50%;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#666;">&times;</button>' +
    '</div>' +
    '<div style="padding:48px 28px 40px;text-align:center;">' +
    '<div style="width:72px;height:72px;border-radius:50%;background:#E1F5EE;display:flex;align-items:center;justify-content:center;margin:0 auto 22px;">' +
    '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
    '</div>' +
    '<p style="font-size:13px;color:#6B7280;margin:0 0 14px;">Composez ce numéro depuis votre téléphone</p>' +
    '<div style="font-size:38px;font-weight:800;color:#0F6E56;letter-spacing:2px;font-variant-numeric:tabular-nums;line-height:1.2;margin-bottom:10px;cursor:pointer;user-select:all;" onclick="lfoCopyPhone()" title="Cliquer pour copier">' + window.LFO_PHONE + '</div>' +
    '<p style="font-size:12px;color:#9CA3AF;margin:0 0 28px;">Du lundi au vendredi · 9h - 19h</p>' +
    '<button onclick="lfoCopyPhone()" style="display:inline-flex;align-items:center;gap:8px;padding:11px 22px;background:#1D9E75;color:white;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;transition:background .15s;" onmouseover="this.style.background=\'#0F6E56\';" onmouseout="this.style.background=\'#1D9E75\';">' +
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' +
    '<span id="lfo-copy-label">Copier le numéro</span>' +
    '</button>' +
    '<div style="margin-top:32px;padding-top:24px;border-top:1px solid #E5E7EB;">' +
    '<p style="font-size:12px;color:#6B7280;margin:0 0 12px;">Pas le temps maintenant ?</p>' +
    '<a href="' + window.LFO_CAL_MARIE + '" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;padding:11px 20px;background:white;color:#D85A30;border:1.5px solid #D85A30;border-radius:10px;font-size:13px;font-weight:700;text-decoration:none;font-family:inherit;transition:all .15s;" onmouseover="this.style.background=\'#D85A30\';this.style.color=\'white\';" onmouseout="this.style.background=\'white\';this.style.color=\'#D85A30\';">' +
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' +
    'Prendre RDV en ligne' +
    '</a>' +
    '</div>' +
    '</div>';
  content.innerHTML = html;
};

window.lfoCopyPhone = function() {
  var done = function() {
    var lbl = document.getElementById('lfo-copy-label');
    if (lbl) {
      var prev = lbl.textContent;
      lbl.textContent = 'Copié !';
      setTimeout(function(){ if(lbl) lbl.textContent = prev; }, 1800);
    }
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(window.LFO_PHONE).then(done, function(){});
  } else {
    var input = document.createElement('input');
    input.value = window.LFO_PHONE;
    document.body.appendChild(input);
    input.select();
    try { document.execCommand('copy'); done(); } catch(_) {}
    document.body.removeChild(input);
  }
};
