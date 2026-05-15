/**
 * LFO Service Check — vérifie si un service est actif
 * Grise les boutons de commande si le service est désactivé
 */
(async function checkServiceActive() {
  var client = window.sb || window.__lfoSupabase;
  if (!client) return;

  var path = window.location.pathname.replace('.html', '').replace(/\/$/, '');

  // Mapping URL → slug(s)
  var SLUG_MAP = {
    '/service-nda': 'nda', '/service-creation-of': 'creation-of', '/service-creation-formation': 'creation-formation',
    '/service-edof': 'edof', '/service-qualiopi': 'qualiopi', '/service-opco': 'opco',
    '/service-france-travail': 'france-travail', '/service-controle': 'controle', '/service-uai': 'uai',
    '/service-centre-examen': 'centre-examen', '/service-agrement-prefectoral': 'agrement-prefectoral',
    '/service-formation-elus': 'formation-elus', '/service-habilitation': 'habilitation',
    '/service-centre-certifie': 'centre-certifie',
    '/service-pack-presence': 'pack-presence', '/service-pack-digital': 'pack-digital',
    '/service-pack-premium': 'pack-premium', '/service-pack-enterprise': 'pack-enterprise',
    '/service-site': 'site', '/service-app': 'app', '/service-lms': 'lms', '/service-agent-ia': 'agent-ia',
  };

  // creer-of has multiple types
  if (path === '/creer-of') {
    try {
      var { data } = await client.from('service_settings').select('slug, is_active')
        .in('slug', ['creation-of','cfa','bilan','vae','vae-bilan','formation-elus','centre-en-ligne']);
      if (!data) return;
      var inactive = {};
      data.forEach(function(s) { if (!s.is_active) inactive[s.slug] = true; });
      if (Object.keys(inactive).length === 0) return;
      // Map slug to selectType argument
      var CARD_MAP = {
        'creation-of': 'action_formation', 'cfa': 'cfa', 'bilan': 'bilan',
        'vae': 'vae', 'vae-bilan': 'vae_bilan', 'formation-elus': 'formation_elus',
        'centre-en-ligne': 'centre_online'
      };
      document.querySelectorAll('.of-card').forEach(function(card) {
        var onclick = card.getAttribute('onclick') || '';
        Object.keys(CARD_MAP).forEach(function(slug) {
          if (inactive[slug] && onclick.indexOf(CARD_MAP[slug]) >= 0) {
            card.style.opacity = '0.4';
            card.style.pointerEvents = 'none';
            card.style.position = 'relative';
            var badge = document.createElement('span');
            badge.textContent = 'Indisponible';
            badge.style.cssText = 'position:absolute;top:8px;right:8px;background:#F3F4F6;color:#9CA3AF;font-size:10px;font-weight:700;padding:3px 8px;border-radius:6px;z-index:2;';
            card.appendChild(badge);
          }
        });
      });
    } catch(e) { console.warn('service-check creer-of err', e); }
    return;
  }

  // Standard service pages
  var slug = SLUG_MAP[path];
  if (!slug) return;

  try {
    var { data, error } = await client.from('service_settings').select('is_active').eq('slug', slug).single();
    if (error || !data) return;
    if (data.is_active) return; // Active — nothing to do

    // Service disabled — grey out command buttons
    document.querySelectorAll('a, button').forEach(function(el) {
      var txt = (el.textContent || '').toLowerCase().trim();
      var href = (el.getAttribute('href') || '').toLowerCase();
      if (txt.includes('commander') || txt.includes('créer mon of') || txt.includes('démarrer') ||
          txt.includes('commencer') || txt.includes('souscrire') || txt.includes('choisir') ||
          txt.includes('découvrir') || href.includes('acces-') || href.includes('monaccesedof')) {
        el.style.background = '#F3F4F6';
        el.style.color = '#9CA3AF';
        el.style.cursor = 'not-allowed';
        el.style.border = '1px solid #E5E7EB';
        el.style.pointerEvents = 'auto';
        el.removeAttribute('href');
        el.onclick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          alert('Ce service n\'est pas disponible actuellement.');
        };
      }
    });
  } catch(e) { console.warn('service-check err', e); }
})();
