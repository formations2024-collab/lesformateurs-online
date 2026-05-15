// LFO — Icône panier dans le top nav (visible si ≥ 1 article)
(function(){
  var ID = 'lfo-cart-nav';
  var STYLE_ID = 'lfo-cart-nav-style';

  function injectStyleOnce(){
    if (document.getElementById(STYLE_ID)) return;
    var css =
'.lfo-cn{position:relative;display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:10px;background:#FFF8F5;color:#D85A30;text-decoration:none;border:1px solid rgba(216,90,48,.15);transition:all .15s ease;cursor:pointer;margin-left:4px;}' +
'.lfo-cn:hover{background:#D85A30;color:#fff;border-color:#D85A30;transform:translateY(-1px);box-shadow:0 4px 12px rgba(216,90,48,.25);}' +
'.lfo-cn:hover .lfo-cn-badge{background:#fff;color:#D85A30;}' +
'.lfo-cn svg{display:block;}' +
'.lfo-cn-badge{position:absolute;top:-4px;right:-4px;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:#D85A30;color:#fff;font-size:10px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;border:2px solid #fff;line-height:1;font-family:inherit;animation:lfoCnPop .25s ease-out;}' +
'@keyframes lfoCnPop{0%{transform:scale(0)}60%{transform:scale(1.15)}100%{transform:scale(1)}}' +
'@media(max-width:760px){.lfo-cn{width:38px;height:38px;}}';
    var st = document.createElement('style');
    st.id = STYLE_ID;
    st.appendChild(document.createTextNode(css));
    document.head.appendChild(st);
  }

  function findNavTarget(){
    // Liste de sélecteurs ciblant le conteneur de menu (ordre de priorité)
    var candidates = [
      '.ml-nav-links',
      '.lfo-nav',
      '.nav-r',
      '.navbar-links',
      '.nl',
      'nav.navbar .navbar-links',
      'header.lfo-head .lfo-head-left + *',
      'header .nav'
    ];
    for (var i = 0; i < candidates.length; i++){
      var el = document.querySelector(candidates[i]);
      if (el) return el;
    }
    return null;
  }

  function findInsertReference(nav){
    // On insère juste avant le bouton connexion / mon compte / espace si présent
    return nav.querySelector('.ml-nav-cta, .btn-login, .btn-dashboard, .btn-espace, .nb.d, .lfo-head-cta, [onclick*="openAuthModal"], [href="/dashboard"], [href="dashboard.html"]');
  }

  function buildIcon(count){
    var svg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>';
    var badge = '<span class="lfo-cn-badge">' + count + '</span>';
    return '<a id="' + ID + '" class="lfo-cn" href="/panier" aria-label="Voir mon panier (' + count + ' article' + (count > 1 ? 's' : '') + ')" title="Mon panier (' + count + ')">' + svg + badge + '</a>';
  }

  function render(){
    var count = 0;
    try { count = (window.LFOCart && window.LFOCart.count && window.LFOCart.count()) || 0; } catch(e){}
    var existing = document.getElementById(ID);

    if (count === 0){
      if (existing) existing.remove();
      return;
    }

    injectStyleOnce();

    if (existing){
      var badge = existing.querySelector('.lfo-cn-badge');
      if (badge && badge.textContent !== String(count)){
        badge.textContent = String(count);
      }
      existing.setAttribute('aria-label', 'Voir mon panier (' + count + ' article' + (count > 1 ? 's' : '') + ')');
      existing.setAttribute('title', 'Mon panier (' + count + ')');
      return;
    }

    var nav = findNavTarget();
    if (!nav) return;
    var ref = findInsertReference(nav);
    if (ref){
      ref.insertAdjacentHTML('beforebegin', buildIcon(count));
    } else {
      nav.insertAdjacentHTML('beforeend', buildIcon(count));
    }
  }

  function init(){
    render();
    window.addEventListener('lfo-cart-change', render);
    window.addEventListener('storage', function(e){ if (e.key === 'lfo_cart_v1') render(); });
    window.addEventListener('pageshow', render);
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
