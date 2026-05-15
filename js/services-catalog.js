// LFO — Ajout au panier depuis n'importe quelle page service-*
(function(){
  function esc(s){
    return String(s||'').replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function fmt(n){ return new Intl.NumberFormat('fr-FR').format(n) + ' €'; }

  function injectStylesOnce(){
    if (document.getElementById('lfo-add-modal-styles')) return;
    var css =
'#lfo-add-ov{position:fixed;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(4px);z-index:11000;display:flex;align-items:center;justify-content:center;padding:20px;animation:lfoAddFade .2s ease-out;}' +
'.lfo-add-modal{background:#fff;border-radius:18px;max-width:480px;width:100%;padding:32px 28px 28px;text-align:center;box-shadow:0 24px 80px rgba(0,0,0,.2);animation:lfoAddRise .25s ease-out;font-family:inherit;}' +
'.lfo-add-icon{width:64px;height:64px;border-radius:50%;background:#E1F5EE;display:inline-flex;align-items:center;justify-content:center;margin-bottom:18px;}' +
'.lfo-add-modal h3{font-size:19px;font-weight:800;margin:0 0 6px;letter-spacing:-.02em;color:#1a1a1a;}' +
'.lfo-add-name{font-size:14px;color:#1a1a1a;font-weight:500;margin:0 0 8px;font-style:italic;}' +
'.lfo-add-price{display:inline-block;background:#FFF8F5;color:#D85A30;padding:6px 14px;border-radius:8px;font-weight:700;font-size:14px;margin:6px 0 12px;}' +
'.lfo-add-q{font-size:13px;color:#888;margin:0 0 4px;line-height:1.5;}' +
'.lfo-add-actions{display:flex;flex-direction:column;gap:8px;margin-top:22px;}' +
'.lfo-add-btn{padding:13px 18px;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s;display:inline-flex;align-items:center;justify-content:center;}' +
'.lfo-add-btn.p{background:#D85A30;color:#fff;}' +
'.lfo-add-btn.p:hover{background:#c04e28;transform:translateY(-1px);box-shadow:0 6px 18px rgba(216,90,48,.25);}' +
'.lfo-add-btn.s{background:#f5f5f5;color:#1a1a1a;}' +
'.lfo-add-btn.s:hover{background:#eee;}' +
'.lfo-add-already{font-size:13px;color:#085041;background:#E1F5EE;padding:8px 12px;border-radius:8px;margin-bottom:14px;}' +
'@keyframes lfoAddFade{from{opacity:0}to{opacity:1}}' +
'@keyframes lfoAddRise{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}';
    var style = document.createElement('style');
    style.id = 'lfo-add-modal-styles';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  window.addServiceToCart = function(key){
    var catalog = window.LFO_SERVICES || {};
    var svc = catalog[key];
    if (!svc){ console.warn('Service inconnu:', key); return; }
    if (!window.LFOCart){ console.warn('LFOCart manquant'); window.location.href = svc.accesPath || '/'; return; }

    var alreadyIn = window.LFOCart.exists(function(x){ return x.type==='service' && x.key === key; });
    if (!alreadyIn){
      window.LFOCart.add({
        type: 'service',
        key: key,
        name: svc.name,
        price: svc.basePrice,
        qty: 1,
        accesPath: svc.accesPath || null,
        available_options: svc.options || [],
        options: {}
      });
    }
    showAddedConfirm(svc, alreadyIn);
  };

  function showAddedConfirm(svc, already){
    injectStylesOnce();
    var ex = document.getElementById('lfo-add-ov');
    if (ex) ex.remove();
    var count = (window.LFOCart && window.LFOCart.count()) || 1;
    var optsCount = (svc.options || []).length;

    var html =
'<div id="lfo-add-ov" role="dialog" aria-modal="true">' +
  '<div class="lfo-add-modal">' +
    '<div class="lfo-add-icon">' +
      '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>' +
    '</div>' +
    '<h3>' + (already ? 'Déjà dans votre panier' : 'Ajouté à votre panier') + '</h3>' +
    '<p class="lfo-add-name">« ' + esc(svc.name || '') + ' »</p>' +
    '<div class="lfo-add-price">' + fmt(svc.basePrice || 0) + '</div>' +
    (already ? '<div class="lfo-add-already">Ce service est déjà dans votre panier.</div>' : '') +
    (optsCount > 0 ? '<p class="lfo-add-q"><strong>'+optsCount+' option'+(optsCount>1?'s':'')+' payante'+(optsCount>1?'s':'')+'</strong> disponible'+(optsCount>1?'s':'')+' (formateur, etc.) — à choisir dans le panier.</p>' : '') +
    '<p class="lfo-add-q">Souhaitez-vous continuer à parcourir nos services ou passer au paiement&nbsp;?</p>' +
    '<div class="lfo-add-actions">' +
      '<button class="lfo-add-btn p" onclick="window.location.href=\'/panier\'">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="margin-right:6px;vertical-align:-2px"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' +
        'Voir mon panier ('+count+' article'+(count>1?'s':'')+')' +
      '</button>' +
      '<button class="lfo-add-btn s" onclick="lfoCloseAddModal()">Continuer mes achats</button>' +
    '</div>' +
  '</div>' +
'</div>';
    document.body.insertAdjacentHTML('beforeend', html);
    var ov = document.getElementById('lfo-add-ov');
    if (ov) ov.addEventListener('click', function(e){ if (e.target === ov) lfoCloseAddModal(); });
  }

  window.lfoCloseAddModal = function(){
    var ov = document.getElementById('lfo-add-ov');
    if (ov) ov.remove();
  };
})();
