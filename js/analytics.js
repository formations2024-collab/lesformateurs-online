// ============================================
// lesformateurs.online — Home-grown analytics
// Relies on window.sb (initialized by js/supabase-config.js)
// ============================================
(function(){
  try {
    if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;
    var ua = navigator.userAgent || '';
    if (/(bot|crawl|spider|scrap)/i.test(ua)) return;

    // Client: use the already-initialized window.sb. Fallback: re-init with same creds.
    var client = (typeof window !== 'undefined' && window.sb) ? window.sb : null;
    if (!client && window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        client = window.supabase.createClient(
          'https://bxijjjbxsevnudienvbv.supabase.co',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4aWpqamJ4c2V2bnVkaWVudmJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MjU0MjcsImV4cCI6MjA4OTUwMTQyN30.9YNffsFuGv7at2nUviuCUMA469z0FuskYHJtkOAaTn8'
        );
      } catch(e) {}
    }
    if (!client) return;

    // Session id
    var sid;
    try { sid = localStorage.getItem('lfo_sid'); } catch(e){}
    if (!sid) {
      try {
        sid = (window.crypto && typeof crypto.randomUUID === 'function')
          ? crypto.randomUUID()
          : (Date.now() + '-' + Math.random().toString(36).slice(2));
        localStorage.setItem('lfo_sid', sid);
      } catch(e) { sid = Date.now() + '-' + Math.random().toString(36).slice(2); }
    }

    function qp(name){
      try { return new URLSearchParams(window.location.search).get(name) || null; }
      catch(e){ return null; }
    }

    async function logVisit(){
      try {
        await client.from('analytics_visits').insert({
          session_id: sid,
          page: location.pathname,
          referrer: document.referrer || null,
          utm_source: qp('utm_source'),
          utm_medium: qp('utm_medium'),
          utm_campaign: qp('utm_campaign'),
          user_agent: ua,
          screen_width: window.innerWidth
        });
        try { console.log('[analytics] visit logged'); } catch(e){}
      } catch(e) { /* silent */ }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', logVisit);
    } else {
      logVisit();
    }

    // Click tracking with debounce
    var lastClickAt = {};
    document.addEventListener('click', async function(e){
      try {
        var target = e.target && e.target.closest ? e.target.closest('a, button, [data-track]') : null;
        if (!target) return;
        var tag = (target.tagName || '').toLowerCase();
        var cls = (typeof target.className === 'string' ? target.className : '') || '';
        var element = (tag + '.' + cls).slice(0, 80);
        var txt = ((target.innerText || target.textContent || '') + '').trim().slice(0, 100);
        var key = element + '|' + txt;
        var now = Date.now();
        if (lastClickAt[key] && (now - lastClickAt[key]) < 1000) return;
        lastClickAt[key] = now;
        await client.from('analytics_clicks').insert({
          session_id: sid,
          page: location.pathname,
          element: element,
          element_text: txt
        });
        try { console.log('[analytics] click', element); } catch(e){}
      } catch(e) { /* silent */ }
    }, true);
  } catch(err) { /* silent */ }
})();
