// ============================================
// lesformateurs.online — Maintenance Check
// ============================================
// Requires js/supabase-config.js (var sb)
(function(){
  if(typeof sb === 'undefined' || !sb){ console.log('[maintenance] sb client missing'); return; }

  function formatFR(iso){
    try {
      var d = new Date(iso);
      if(isNaN(d.getTime())) return '';
      var date = d.toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' });
      var heure = d.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
      return date + ' à ' + heure;
    } catch(e){ return ''; }
  }

  function showMaintenancePopup(endIso){
    if(document.getElementById('lfo-maintenance-overlay')) return;
    var ov = document.createElement('div');
    ov.id = 'lfo-maintenance-overlay';
    ov.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#FEFEFE;display:flex;align-items:center;justify-content:center;padding:24px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;';
    var endText = '';
    if(endIso){
      var f = formatFR(endIso);
      if(f) endText = '<p style="font-size:14px;color:#888;margin-top:16px;">Maintenance prévue jusqu\'au ' + f + '</p>';
    }
    ov.innerHTML =
      '<div style="max-width:520px;width:100%;text-align:center;border:0.5px solid #f0f0f0;background:#fff;padding:48px 32px;border-radius:12px;">' +
        '<div style="font-size:26px;font-weight:700;color:#1a1a1a;margin-bottom:24px;letter-spacing:-0.5px;">les<span style="color:#D85A30">formateurs</span>.online</div>' +
        '<div style="width:48px;height:0.5px;background:#f0f0f0;margin:0 auto 24px;"></div>' +
        '<h1 style="font-size:18px;font-weight:600;color:#1a1a1a;margin:0 0 12px;">Site en maintenance</h1>' +
        '<p style="font-size:15px;color:#555;line-height:1.6;margin:0;">Désolé, le site est en maintenance.<br>Nous revenons très vite.</p>' +
        endText +
      '</div>';
    try { document.documentElement.style.overflow = 'hidden'; } catch(e){}
    (document.body || document.documentElement).appendChild(ov);
  }

  // Expose for reuse (dashboard.html)
  window.LFO_showMaintenancePopup = showMaintenancePopup;

  // Compute maintenance state from site_settings rows. Returns:
  // { active: bool, endIso: string|null, scopes: {public, dashboard_user, dashboard_expert} }
  function computeMaintenanceState(rows){
    var data = rows || [];
    var map = {};
    data.forEach(function(r){ map[r.key] = r.value; });

    var mode = (map.maintenance_mode || '').toString().toLowerCase() === 'true';
    var now = Date.now();

    var slots = {};
    data.forEach(function(r){
      var m = /^maintenance_(\d+)_start$/.exec(r.key);
      if(m){ var i = m[1]; slots[i] = slots[i] || {}; slots[i].start = r.value || ''; return; }
      m = /^maintenance_(\d+)_end$/.exec(r.key);
      if(m){ var i2 = m[1]; slots[i2] = slots[i2] || {}; slots[i2].end = r.value || ''; return; }
    });
    if(map.maintenance_start && map.maintenance_end){
      slots['legacy'] = { start: map.maintenance_start, end: map.maintenance_end };
    }

    var activeEnd = null;
    Object.keys(slots).forEach(function(k){
      var s = slots[k];
      if(!s.start || !s.end) return;
      var sM = new Date(s.start).getTime();
      var eM = new Date(s.end).getTime();
      if(isNaN(sM) || isNaN(eM)) return;
      if(now >= sM && now <= eM){
        if(!activeEnd || eM > new Date(activeEnd).getTime()) activeEnd = s.end;
      }
    });

    var active = mode || !!activeEnd;

    // Scope flags — rétrocompat : si aucune des 3 clés n'existe, défaut = public bloqué
    var hasAnyScope = ('maintenance_scope_public' in map) ||
                      ('maintenance_scope_dashboard_user' in map) ||
                      ('maintenance_scope_dashboard_expert' in map);
    var toBool = function(v){ return (v || '').toString().toLowerCase() === 'true'; };
    var scopes = {
      public: hasAnyScope ? toBool(map.maintenance_scope_public) : true,
      dashboard_user: hasAnyScope ? toBool(map.maintenance_scope_dashboard_user) : false,
      dashboard_expert: hasAnyScope ? toBool(map.maintenance_scope_dashboard_expert) : false
    };

    return { active: active, endIso: activeEnd || map.maintenance_end || null, scopes: scopes };
  }

  window.LFO_computeMaintenanceState = computeMaintenanceState;

  async function check(){
    try {
      var res = await sb.from('site_settings').select('key,value');
      if(res.error){ console.log('[maintenance] fetch error:', res.error.message); return; }
      var data = res.data || [];
      console.log('[maintenance] loaded', data.length, 'settings rows');

      var state = computeMaintenanceState(data);
      console.log('[maintenance] active=' + state.active + ' scopes=', state.scopes);

      if(!state.active) return;

      // Ce fichier n'est inclus que sur les pages publiques => contexte = public
      if(!state.scopes.public){
        console.log('[maintenance] public scope disabled — no block');
        return;
      }

      // Bypass admin only
      try {
        var userRes = await sb.auth.getUser();
        var user = userRes && userRes.data ? userRes.data.user : null;
        if(user){
          var profRes = await sb.from('profiles').select('is_admin').eq('id', user.id).single();
          if(profRes && profRes.data && profRes.data.is_admin === true){
            console.log('[maintenance] admin detected — bypass');
            return;
          }
          console.log('[maintenance] user connected but not admin — show popup');
        } else {
          console.log('[maintenance] no user (anon visitor) — show popup');
        }
      } catch(e){ console.log('[maintenance] auth/profile check failed (non-blocking):', e && e.message); }

      showMaintenancePopup(state.endIso || '');
    } catch(e){ console.log('[maintenance] unexpected error:', e && e.message); }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', check);
  } else {
    check();
  }
})();
