/**
 * LFO Team Loader — charge dynamiquement les conseillers depuis Supabase
 * Cible : <div id="team-container">
 */
(async function loadTeam() {
  var container = document.getElementById('team-container');
  if (!container) return;

  var client = window.sb || window.__lfoSupabase;
  if (!client) return;

  try {
    var { data, error } = await client.from('profiles').select('first_name, last_name, photo_url, poste, linkedin_url, is_available, is_conseiller').eq('is_conseiller', true).order('first_name');
    if (error || !data || data.length === 0) return;

    container.innerHTML = data.map(function(c) {
      var linkedinSvg = '<svg viewBox="0 0 20 20" fill="#0A66C2" style="width:16px;height:16px;"><path d="M17.04 17.04h-2.96v-4.64c0-1.11-.02-2.53-1.54-2.53-1.54 0-1.78 1.2-1.78 2.45v4.72H7.8V7.5h2.84v1.3h.04c.4-.75 1.36-1.54 2.8-1.54 3 0 3.56 1.97 3.56 4.54v5.24zM4.45 6.2a1.72 1.72 0 110-3.44 1.72 1.72 0 010 3.44zM5.93 17.04H2.97V7.5h2.96v9.54z"/></svg>';
      var linkedinHtml = '';
      if (c.linkedin_url && c.linkedin_url.trim() !== '') {
        linkedinHtml = '<a href="' + c.linkedin_url + '" target="_blank" rel="noopener" style="display:inline-block;margin-top:4px;">' + linkedinSvg + '</a>';
      } else {
        linkedinHtml = '<a href="#" onclick="event.preventDefault();" style="display:inline-block;margin-top:4px;opacity:0.4;" title="LinkedIn non renseigné">' + linkedinSvg + '</a>';
      }

      var photoSrc = c.photo_url || '';
      var initial = (c.first_name || '?').charAt(0);
      var photoHtml = photoSrc
        ? '<img src="' + photoSrc + '" alt="' + (c.first_name || '') + '" style="width:100%;height:100%;object-fit:cover;" loading="lazy" onerror="this.style.display=\'none\';this.parentNode.style.display=\'flex\';this.parentNode.style.alignItems=\'center\';this.parentNode.style.justifyContent=\'center\';this.parentNode.innerHTML=\'<span style=font-weight:700;color:#9CA3AF;font-size:24px>' + initial + '</span>\'">'
        : '<span style="font-weight:700;color:#9CA3AF;font-size:24px;display:flex;align-items:center;justify-content:center;height:100%;">' + initial + '</span>';

      return '<div style="text-align:center;flex-shrink:0;min-width:120px;">'
        + '<div style="width:100px;height:100px;border-radius:50%;overflow:hidden;margin:0 auto 8px;border:2px solid #E5E7EB;background:#F3F4F6;">'
        + photoHtml
        + '</div>'
        + '<div style="font-size:14px;font-weight:700;">' + (c.first_name || '') + '</div>'
        + '<div style="font-size:12px;color:#D85A30;">' + (c.poste || '') + '</div>'
        + linkedinHtml
        + '</div>';
    }).join('');
  } catch(e) {
    console.error('Erreur chargement équipe:', e);
  }
})();
