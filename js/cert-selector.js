/**
 * LFO Cert Selector — composant réutilisable
 * Usage: CertSelector.init(containerId, options)
 *
 * Options:
 *   mode: 'habilitation' | 'centre_examen' | 'centre_certifie' | 'edof' | 'uai'
 *   onlyHabil: true → n'affiche que les RS/RNCP qui acceptent des habilitations
 *   multi: true → permet la multi-sélection
 *   showPricing: true → affiche et ajoute les prix au panier
 *   pricingType: 'habil' | 'centre' → quel tarif utiliser
 *   onUpdate: function(selectedCerts, totalPrice) → callback
 */

window.CertSelector = (function(){
  var data = null;
  var instances = {};

  function init(containerId, opts) {
    if (!window.LFO_CERTS) { console.warn('certifications-data.js not loaded'); return; }
    data = window.LFO_CERTS;
    opts = opts || {};
    var mode = opts.mode || 'habilitation';
    var onlyHabil = opts.onlyHabil !== false && (mode === 'habilitation');
    var multi = opts.multi !== false;
    var showPricing = opts.showPricing !== false && mode !== 'uai';
    var pricingType = opts.pricingType || (mode === 'centre_certifie' ? 'centre' : 'habil');

    var state = { selected: [], searchResults: [] };
    instances[containerId] = state;

    var container = document.getElementById(containerId);
    if (!container) return;

    // Filter certs
    var certs = data.certs;
    if (onlyHabil) certs = certs.filter(function(c){ return c.h; });

    // Group by domain
    var byDomain = {};
    certs.forEach(function(c){
      var d = c.d || 'Autre';
      if (!byDomain[d]) byDomain[d] = [];
      byDomain[d].push(c);
    });
    var domainKeys = Object.keys(byDomain).sort(function(a,b){ return byDomain[b].length - byDomain[a].length; });

    // Render
    var html = '';

    // Info block
    if (mode === 'habilitation') {
      html += '<div style="background:#EFF6FF;border-left:3px solid #3B82F6;padding:12px 14px;margin-bottom:16px;font-size:12px;color:#1E40AF;border-radius:6px;line-height:1.5;">';
      html += '<b>Habilitation</b> = vous formez sur une certification existante (le certificateur vous autorise).<br>';
      html += '<b>Seules les RS/RNCP acceptant des habilitations</b> sont affichees ci-dessous.';
      html += '</div>';
    } else if (mode === 'centre_examen') {
      html += '<div style="background:#EFF6FF;border-left:3px solid #3B82F6;padding:12px 14px;margin-bottom:16px;font-size:12px;color:#1E40AF;border-radius:6px;line-height:1.5;">';
      html += '<b>Centre d\'examen</b> = vous faites passer les examens d\'une certification existante.<br>';
      html += 'Indiquez la certification pour laquelle vous souhaitez devenir centre d\'examen.';
      html += '</div>';
    } else if (mode === 'centre_certifie') {
      html += '<div style="background:#EFF6FF;border-left:3px solid #3B82F6;padding:12px 14px;margin-bottom:16px;font-size:12px;color:#1E40AF;border-radius:6px;line-height:1.5;">';
      html += '<b>RS</b> (Repertoire Specifique) = certification de competences transversales ou complementaires.<br>';
      html += '<b>RNCP</b> (Repertoire National) = certification de qualification professionnelle (niveaux 3 a 8).<br>';
      html += 'Le prix depend du type et du niveau.';
      html += '</div>';
    } else if (mode === 'uai') {
      html += '<div style="background:#FEF3C7;border-left:3px solid #F59E0B;padding:12px 14px;margin-bottom:16px;font-size:12px;color:#92400E;border-radius:6px;line-height:1.5;">';
      html += 'Citez les RS/RNCP pour lesquelles vous demandez le numero UAI. <b>Aucun frais supplementaire</b> pour cette selection.';
      html += '</div>';
    }

    // Search
    html += '<div style="position:relative;margin-bottom:16px;">';
    html += '<input type="text" id="' + containerId + '-search" placeholder="Rechercher par code (RS1234, RNCP5678) ou intitule..." style="width:100%;padding:11px 14px;border:1px solid #E5E7EB;border-radius:10px;font-family:inherit;font-size:13px;" oninput="CertSelector.search(\'' + containerId + '\',this.value)">';
    html += '<div id="' + containerId + '-results" style="display:none;position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid #E5E7EB;border-radius:0 0 10px 10px;max-height:250px;overflow-y:auto;z-index:20;box-shadow:0 4px 12px rgba(0,0,0,.06);"></div>';
    html += '</div>';

    // Selected tags
    html += '<div id="' + containerId + '-selected" style="margin-bottom:16px;"></div>';

    // Domain accordion
    html += '<div style="font-size:11px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Parcourir par domaine (' + domainKeys.length + ' domaines, ' + certs.length + ' certifications)</div>';
    html += '<div id="' + containerId + '-accordion" style="display:flex;flex-direction:column;gap:6px;max-height:400px;overflow-y:auto;border:1px solid #E5E7EB;border-radius:10px;padding:8px;">';

    domainKeys.forEach(function(d, di){
      var items = byDomain[d];
      html += '<div class="cs-domain" data-domain="' + di + '">';
      html += '<div class="cs-domain-head" onclick="CertSelector.toggleDomain(\'' + containerId + '\',' + di + ')" style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;cursor:pointer;border-radius:8px;transition:background .12s;background:' + (di === 0 ? '#FFF8F3' : '#fff') + ';">';
      html += '<div><b style="font-size:13px;">' + escH(d) + '</b><span style="font-size:11px;color:#9CA3AF;margin-left:8px;">' + items.length + ' certif.</span></div>';
      html += '<span style="font-size:10px;color:#9CA3AF;">&#9660;</span>';
      html += '</div>';
      html += '<div class="cs-domain-body" style="display:' + (di === 0 ? 'block' : 'none') + ';padding:4px 8px 8px;">';
      items.forEach(function(c){
        var prix = showPricing ? (pricingType === 'centre' ? c.pc : c.ph) : 0;
        var prixStr = prix ? prix.toLocaleString('fr-FR') + ' EUR' : '';
        var typeLabel = c.t === 'RS' ? 'RS' : 'RNCP';
        var badge = c.h ? '<span style="font-size:9px;background:#E1F5EE;color:#0F6E56;padding:2px 6px;border-radius:8px;margin-left:6px;">Habilitable</span>' : '';
        html += '<div class="cs-cert-row" onclick="CertSelector.toggle(\'' + containerId + '\',\'' + escH(c.c) + '\')" style="display:flex;align-items:center;gap:8px;padding:8px 10px;cursor:pointer;border-bottom:1px solid #F3F4F6;transition:background .1s;" onmouseenter="this.style.background=\'#FFF8F3\'" onmouseleave="this.style.background=\'transparent\'">';
        html += '<input type="checkbox" id="' + containerId + '-cb-' + c.c + '" style="accent-color:#D85A30;width:16px;height:16px;pointer-events:none;">';
        html += '<span style="font-size:11px;font-weight:700;color:#D85A30;min-width:70px;">' + c.c + '</span>';
        html += '<span style="flex:1;font-size:12px;color:#1a1a1a;">' + escH(c.n) + badge + '</span>';
        if (c.nv) html += '<span style="font-size:10px;color:#9CA3AF;white-space:nowrap;">' + escH(c.nv) + '</span>';
        if (prixStr) html += '<span style="font-size:11px;font-weight:700;color:#D85A30;white-space:nowrap;">' + prixStr + '</span>';
        html += '</div>';
      });
      html += '</div></div>';
    });
    html += '</div>';

    container.innerHTML = html;

    // Store state
    state.certs = certs;
    state.byDomain = byDomain;
    state.domainKeys = domainKeys;
    state.opts = opts;
    state.onUpdate = opts.onUpdate || function(){};
  }

  function escH(s) {
    var d = document.createElement('div'); d.textContent = s; return d.innerHTML;
  }

  function search(cid, q) {
    var st = instances[cid]; if (!st) return;
    var box = document.getElementById(cid + '-results');
    if (!q || q.length < 2) { box.style.display = 'none'; return; }
    var ql = q.toLowerCase();
    var matches = st.certs.filter(function(c){ return c.c.toLowerCase().indexOf(ql) !== -1 || c.n.toLowerCase().indexOf(ql) !== -1; }).slice(0, 8);
    if (!matches.length) { box.innerHTML = '<div style="padding:12px;color:#999;font-size:12px;">Aucun resultat</div>'; box.style.display = 'block'; return; }
    var showP = st.opts.showPricing !== false && st.opts.mode !== 'uai';
    var pt = st.opts.pricingType || 'habil';
    box.innerHTML = matches.map(function(c){
      var prix = showP ? (pt === 'centre' ? c.pc : c.ph) : 0;
      var badge = c.h ? ' <span style="font-size:9px;background:#E1F5EE;color:#0F6E56;padding:1px 5px;border-radius:6px;">Habilitable</span>' : '';
      return '<div onclick="CertSelector.toggle(\'' + cid + '\',\'' + c.c + '\');document.getElementById(\'' + cid + '-search\').value=\'\';document.getElementById(\'' + cid + '-results\').style.display=\'none\';" style="padding:10px 14px;cursor:pointer;border-bottom:1px solid #F3F4F6;font-size:12px;" onmouseenter="this.style.background=\'#FFF8F3\'" onmouseleave="this.style.background=\'#fff\'">' +
        '<span style="font-weight:700;color:#D85A30;">' + c.c + '</span> — ' + escH(c.n) + badge +
        (prix ? '<span style="float:right;font-weight:700;color:#D85A30;">' + prix.toLocaleString('fr-FR') + ' EUR</span>' : '') +
        '</div>';
    }).join('');
    box.style.display = 'block';
  }

  function toggle(cid, code) {
    var st = instances[cid]; if (!st) return;
    var multi = st.opts.multi !== false;
    var idx = st.selected.findIndex(function(s){ return s.c === code; });
    if (idx >= 0) {
      st.selected.splice(idx, 1);
    } else {
      var cert = st.certs.find(function(c){ return c.c === code; });
      if (!cert) return;
      if (!multi) st.selected = [];
      st.selected.push(cert);
    }
    renderSelected(cid);
    updateCheckboxes(cid);
    fireUpdate(cid);
  }

  function renderSelected(cid) {
    var st = instances[cid]; if (!st) return;
    var el = document.getElementById(cid + '-selected');
    if (!st.selected.length) { el.innerHTML = ''; return; }
    var showP = st.opts.showPricing !== false && st.opts.mode !== 'uai';
    var pt = st.opts.pricingType || 'habil';
    el.innerHTML = st.selected.map(function(c, i){
      var prix = showP ? (pt === 'centre' ? c.pc : c.ph) : 0;
      return '<div style="display:flex;align-items:center;gap:8px;padding:10px 14px;border:1px solid #E5E7EB;border-radius:10px;background:#FFF8F3;margin-bottom:6px;">' +
        '<span style="font-weight:700;color:#D85A30;font-size:12px;">' + c.c + '</span>' +
        '<span style="flex:1;font-size:12px;">' + escH(c.n) + '</span>' +
        (c.nv ? '<span style="font-size:10px;color:#9CA3AF;">' + escH(c.nv) + '</span>' : '') +
        (prix ? '<span style="font-size:12px;font-weight:700;color:#D85A30;">' + prix.toLocaleString('fr-FR') + ' EUR</span>' : '') +
        '<span onclick="CertSelector.toggle(\'' + cid + '\',\'' + c.c + '\')" style="cursor:pointer;color:#E24B4A;font-size:16px;font-weight:700;">×</span>' +
        '</div>';
    }).join('');
  }

  function updateCheckboxes(cid) {
    var st = instances[cid]; if (!st) return;
    var codes = st.selected.map(function(s){ return s.c; });
    st.certs.forEach(function(c){
      var cb = document.getElementById(cid + '-cb-' + c.c);
      if (cb) cb.checked = codes.indexOf(c.c) >= 0;
    });
  }

  function fireUpdate(cid) {
    var st = instances[cid]; if (!st) return;
    var showP = st.opts.showPricing !== false && st.opts.mode !== 'uai';
    var pt = st.opts.pricingType || 'habil';
    var total = 0;
    if (showP) {
      st.selected.forEach(function(c){ total += (pt === 'centre' ? c.pc : c.ph); });
    }
    st.onUpdate(st.selected, total);
  }

  function toggleDomain(cid, di) {
    var container = document.getElementById(cid);
    var domains = container.querySelectorAll('.cs-domain');
    var d = domains[di];
    if (!d) return;
    var body = d.querySelector('.cs-domain-body');
    var head = d.querySelector('.cs-domain-head');
    if (body.style.display === 'none') {
      body.style.display = 'block';
      head.style.background = '#FFF8F3';
    } else {
      body.style.display = 'none';
      head.style.background = '#fff';
    }
  }

  function getSelected(cid) {
    var st = instances[cid];
    return st ? st.selected : [];
  }

  function getTotal(cid) {
    var st = instances[cid]; if (!st) return 0;
    var pt = st.opts.pricingType || 'habil';
    var total = 0;
    st.selected.forEach(function(c){ total += (pt === 'centre' ? c.pc : c.ph); });
    return total;
  }

  // Close search results on outside click
  document.addEventListener('click', function(e){
    Object.keys(instances).forEach(function(cid){
      if (!e.target.closest('#' + cid)) {
        var r = document.getElementById(cid + '-results');
        if (r) r.style.display = 'none';
      }
    });
  });

  return { init: init, search: search, toggle: toggle, toggleDomain: toggleDomain, getSelected: getSelected, getTotal: getTotal };
})();
