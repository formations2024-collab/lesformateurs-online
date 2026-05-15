// ============================================
// lesformateurs.online — Referral tracker
// ============================================
// Captures ?ref=CODE in the URL and persists it 90 days
// (localStorage key "lfo_ref" + cookie "lfo_ref", SameSite=Lax).
// First referrer wins: never overwrites an existing stored code.
// Silent: no console output, no UI.
(function(){
  try {
    var ref = null;
    // 1) Try URL (if not already cleaned by supabase-config.js)
    try {
      var params = new URLSearchParams(window.location.search);
      var u = params.get('ref');
      if(u && String(u).trim().length >= 3) ref = String(u).trim();
    } catch(_e){}
    // 2) Fallback: supabase-config.js sets "lfo_referral" after cleaning the URL
    if(!ref){
      try {
        var stored = localStorage.getItem('lfo_referral');
        if(stored && String(stored).trim().length >= 3) ref = String(stored).trim();
      } catch(_e){}
    }
    if(!ref) return;

    var existing = null;
    try { existing = localStorage.getItem('lfo_ref'); } catch(_e){}

    if(!existing){
      try { localStorage.setItem('lfo_ref', ref); } catch(_e){}
      try { document.cookie = 'lfo_ref=' + encodeURIComponent(ref) + '; max-age=7776000; path=/; SameSite=Lax'; } catch(_e){}
    }
  } catch(_e){}
})();
