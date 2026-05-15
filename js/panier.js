(function(){
  var fmt = function(n){ return new Intl.NumberFormat('fr-FR').format(n) + ' €'; };
  var esc = function(s){ return String(s||'').replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };

  var ALL_SERVICES = [
    {key:'nda',name:'Déclaration NDA',price:290,cat:'Procédures'},
    {key:'creation_of',name:'Création OF complète',price:1490,cat:'Procédures'},
    {key:'edof',name:'Ouverture EDOF',price:490,cat:'Procédures'},
    {key:'qualiopi',name:'Certification Qualiopi',price:990,cat:'Procédures'},
    {key:'opco',name:'Agrément OPCO',price:490,cat:'Procédures',unit:'OPCO'},
    {key:'france_travail',name:'France Travail (KAIROS)',price:290,cat:'Procédures'},
    {key:'controle',name:'Contrôle DREETS',price:890,cat:'Spécialisées'},
    {key:'uai',name:'Numéro UAI',price:149,cat:'Spécialisées'},
    {key:'centre_examen',name:"Centre d'examen",price:1990,cat:'Spécialisées'},
    {key:'agrement_prefectoral',name:'Agrément préfectoral',price:690,cat:'Spécialisées'},
    {key:'formation_elus',name:'Formation des élus',price:3490,cat:'Spécialisées'},
    {key:'centre_certifie',name:'Centre certifié France Compétences',price:5990,cat:'Spécialisées',label:'À partir de'},
    {key:'site',name:'Site internet',price:990,cat:'Digital'},
    {key:'app',name:'Application mobile',price:4990,cat:'Digital'},
    {key:'lms',name:'Plateforme LMS',price:2900,cat:'Digital'},
    {key:'agent_ia',name:'Agent IA',price:390,cat:'Digital',unit:'agent'},
    {key:'pack_presence',name:'Pack Présence',price:990,cat:'Packs'},
    {key:'pack_digital',name:'Pack Digital',price:2990,cat:'Packs'},
    {key:'pack_premium',name:'Pack Premium',price:4990,cat:'Packs'},
    {key:'pack_enterprise',name:'Pack Enterprise',price:7990,cat:'Packs'}
  ];

  var SVG = {
    plus: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    check: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>',
    check2: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    checkBig: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>',
    trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    pack: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="8" width="18" height="4" rx="1"/><rect x="3" y="12" width="18" height="8" rx="1"/><line x1="12" y1="8" x2="12" y2="20"/><path d="M12 8c-2-3-6-3-6 0s4 0 6 0c2-3 6-3 6 0s-4 0-6 0"/></svg>',
    pack14: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="8" width="18" height="4" rx="1"/><rect x="3" y="12" width="18" height="8" rx="1"/><line x1="12" y1="8" x2="12" y2="20"/><path d="M12 8c-2-3-6-3-6 0s4 0 6 0c2-3 6-3 6 0s-4 0-6 0"/></svg>',
    svc: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    cart: '<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    lock: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    arrow: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>'
  };

  function readEdofDeclined(){
    try { return localStorage.getItem('lfo_edof_declined') === '1'; } catch(e){ return false; }
  }
  function writeEdofDeclined(v){
    try {
      if (v) localStorage.setItem('lfo_edof_declined','1');
      else localStorage.removeItem('lfo_edof_declined');
    } catch(e){}
  }

  var state = {
    cart: window.LFOCart.get(),
    payMode: 'comptant',
    promoCode: '',
    promoApplied: false,
    edofDeclined: readEdofDeclined(),
    step: 'panier'
  };

  function itemOptionsTotal(it){
    if (!it.options) return 0;
    var s = 0;
    for (var k in it.options){
      if (it.options.hasOwnProperty(k) && it.options[k] && typeof it.options[k].price === 'number') s += it.options[k].price;
    }
    return s;
  }
  function itemFullPrice(it){
    return it.price * (it.qty||1) + itemOptionsTotal(it);
  }

  function recalc(){
    var subtotal = state.cart.reduce(function(s,c){ return s + itemFullPrice(c); }, 0);
    var hasHab = state.cart.some(function(c){ return c.type === 'habilitation' || c.packId; });
    var edofInCart = state.cart.some(function(c){ return c.type === 'service' && c.key === 'edof'; });
    // Si plus aucune habilitation → réinitialiser la décision EDOF
    if (!hasHab && state.edofDeclined){ state.edofDeclined = false; writeEdofDeclined(false); }
    var edofEligible = hasHab && !edofInCart;
    var edofOffered = edofEligible && !state.edofDeclined;
    var edofDiscount = edofOffered ? 490 : 0;
    var promoDiscount = state.promoApplied ? Math.round(subtotal * 0.1) : 0;
    var total = Math.max(0, subtotal - promoDiscount);
    return {subtotal:subtotal,edofEligible:edofEligible,edofOffered:edofOffered,edofDeclined:state.edofDeclined,edofDiscount:edofDiscount,promoDiscount:promoDiscount,total:total};
  }

  function setHTML(el, html){
    while (el.firstChild) el.removeChild(el.firstChild);
    el.insertAdjacentHTML('afterbegin', html);
  }

  var app = document.getElementById('app');

  function render(){
    if (state.step === 'confirmation'){ renderConfirmation(); return; }
    var r = recalc();
    if (state.cart.length === 0){ renderEmpty(); return; }

    var html = '<div class="page">';
    html += '<div class="bc"><a href="/">Accueil</a><span class="sep">›</span><a href="/recherche-habilitation">Habilitation</a><span class="sep">›</span><span class="cur">Panier</span></div>';
    html += '<div class="hd"><div><h1>Votre panier</h1><p class="hd-sub">'+state.cart.length+' article'+(state.cart.length!==1?'s':'')+' · '+fmt(r.subtotal)+'</p></div>';
    html += '<button class="lfo-btn btn-add" data-act="open-add">'+SVG.plus+' Ajouter un service</button></div>';
    html += '<div class="grid"><div class="items">';
    state.cart.forEach(function(it,i){ html += renderItem(it,i); });
    if (r.edofOffered) html += renderEdofBanner();
    else if (r.edofEligible && r.edofDeclined) html += renderEdofDeclinedNote();
    html += '</div>';
    html += renderSidebar(r);
    html += '</div></div>';
    setHTML(app, html);
    bind();
  }

  function renderItem(item, idx){
    var qty = item.qty || 1;
    var ic = '', tag = '', foot = '';
    if (item.type === 'habilitation'){
      ic = '<div class="item-ic hab"><span class="t">'+esc(item.certType||'RS')+'</span><span class="c">'+esc(item.certCode||'')+'</span></div>';
      tag = '<span class="badge" style="background:var(--v-bg);color:var(--v-dk)">Habilitation</span>';
      foot = 'Constitution du dossier + convention certificateur';
    } else if (item.type === 'pack'){
      ic = '<div class="item-ic pack">'+SVG.pack+'</div>';
      tag = '<span class="badge" style="background:var(--o);color:#fff">Pack</span>';
      if (item.packId === 'pro_ia') tag += ' <span class="badge" style="background:var(--dk);color:#fff">Meilleure offre</span>';
      foot = ((item.items && item.items.length) || 0) + ' services inclus';
    } else {
      ic = '<div class="item-ic svc">'+SVG.svc+'</div>';
      tag = '<span class="badge" style="background:#f5f5f5;color:#666">Service</span>';
      foot = 'Traitement par un expert dédié';
    }
    var fins = '';
    if (item.badges && item.badges.length){
      fins = '<div class="item-fins">' + item.badges.map(function(b){
        var bg = b==='CPF'?'var(--b-bg)':b==='OPCO'?'var(--g-bg)':b==='FT'?'var(--b-bg)':'#f5f5f5';
        var co = b==='CPF'?'var(--b-dk)':b==='OPCO'?'var(--g-lt)':b==='FT'?'var(--b-dk)':'#666';
        return '<span class="badge" style="background:'+bg+';color:'+co+';font-size:10px">'+esc(b)+'</span>';
      }).join('') + '</div>';
    }
    var packList = '';
    if (item.items && item.items.length){
      packList = '<div class="item-pack-list">' + item.items.map(function(it){
        return '<div>'+SVG.check+esc(it)+'</div>';
      }).join('') + '</div>';
    }
    var qtyBox = '';
    if (item.unit){
      qtyBox = '<div class="item-qty"><span>Nombre de '+esc(item.unit)+'(s) :</span><div class="qty-box">'+
        '<button data-act="qty-dec" data-id="'+esc(item.id)+'">−</button>'+
        '<span class="qv">'+qty+'</span>'+
        '<button data-act="qty-inc" data-id="'+esc(item.id)+'">+</button>'+
      '</div></div>';
    }
    // Options disponibles (services uniquement)
    var optsBlock = '';
    var av = item.available_options;
    if (item.type === 'service' && av && av.length){
      var selected = item.options || {};
      var rows = av.map(function(o){
        var on = !!selected[o.key];
        var price = (o.price || 0);
        return '<button class="opt-row '+(on?'on':'')+'" data-act="toggle-opt" data-id="'+esc(item.id)+'" data-key="'+esc(o.key)+'">'+
          '<span class="opt-cb">'+(on?SVG.check2:'')+'</span>'+
          '<span class="opt-main"><b>'+esc(o.label||o.key)+'</b>'+(o.desc?'<small>'+esc(o.desc)+'</small>':'')+'</span>'+
          '<span class="opt-price">+'+fmt(price)+'</span>'+
        '</button>';
      }).join('');
      var anySelected = Object.keys(selected).length > 0;
      optsBlock = '<div class="opt-block"><div class="opt-title">Options disponibles '+(anySelected?'<span class="opt-sum">+'+fmt(itemOptionsTotal(item))+'</span>':'')+'</div><div class="opt-list">'+rows+'</div></div>';
    }

    var basePrice = item.price * qty;
    var fullPrice = itemFullPrice(item);
    var priceHtml = item.oldPrice
      ? '<div class="old">'+fmt(item.oldPrice)+'</div><div class="now">'+fmt(fullPrice)+'</div><div class="save">−'+fmt(item.oldPrice - item.price)+'</div>'
      : '<div class="now">'+fmt(fullPrice)+'</div>' + (itemOptionsTotal(item) > 0 ? '<div style="font-size:11px;color:var(--gy);margin-top:2px">dont +'+fmt(itemOptionsTotal(item))+' option'+(Object.keys(item.options||{}).length>1?'s':'')+'</div>' : '');
    var sub = item.subtitle
      ? '<p>'+esc(item.subtitle)+'</p>'
      : (item.org ? '<p>'+esc(item.org)+(item.domain?' — '+esc(item.domain):'')+'</p>' : '');

    return '<div class="item" style="animation-delay:'+(idx*60)+'ms">'+
      '<div class="item-main">'+ic+
        '<div class="item-body">'+
          '<div class="item-tags">'+tag+'</div>'+
          '<h3>'+esc(item.name||'')+'</h3>'+
          sub+fins+packList+qtyBox+optsBlock+
        '</div>'+
        '<div class="item-price">'+priceHtml+'</div>'+
      '</div>'+
      '<div class="item-foot"><span class="item-foot-l">'+esc(foot)+'</span>'+
        '<button class="btn-rm" data-act="remove" data-id="'+esc(item.id)+'">'+SVG.trash+'Retirer</button>'+
      '</div>'+
    '</div>';
  }

  function renderEdofBanner(){
    return '<div class="edof">'+
      '<div class="edof-ic">'+SVG.pack14+'</div>'+
      '<div class="edof-txt"><b>Ouverture EDOF offerte</b><span>Votre accès Mon Compte Formation configuré et prêt à recevoir des inscriptions</span></div>'+
      '<div class="edof-actions">'+
        '<div class="edof-tag"><span class="old">490 €</span><span class="gift">OFFERT</span></div>'+
        '<button class="edof-decline" data-act="decline-edof" type="button">Je n\'en ai pas besoin</button>'+
      '</div>'+
    '</div>';
  }
  function renderEdofDeclinedNote(){
    return '<div class="edof-declined">'+
      '<span>Ouverture EDOF non incluse (vous l\'avez refusée).</span>'+
      '<button class="edof-restore" data-act="restore-edof" type="button">Réactiver l\'offre EDOF</button>'+
    '</div>';
  }

  function renderSidebar(r){
    var lines = state.cart.map(function(it){
      var n = it.name + (it.qty>1?' ×'+it.qty:'');
      var base = '<div class="side-line"><span class="n">'+esc(n)+'</span><span class="v">'+fmt(it.price * (it.qty||1))+'</span></div>';
      var opts = '';
      if (it.options){
        for (var k in it.options){
          if (it.options.hasOwnProperty(k)){
            var o = it.options[k];
            opts += '<div class="side-line side-line-opt"><span class="n">└ '+esc(o.label||k)+'</span><span class="v">+'+fmt(o.price||0)+'</span></div>';
          }
        }
      }
      return base + opts;
    }).join('');
    if (r.edofOffered) lines += '<div class="side-line g"><span class="n">EDOF offert</span><span class="v">−490 €</span></div>';
    if (state.promoApplied) lines += '<div class="side-line o"><span class="n">Code promo LFO10</span><span class="v">−'+fmt(r.promoDiscount)+'</span></div>';

    var totalSave = r.edofDiscount + r.promoDiscount;
    state.cart.forEach(function(it){ if (it.oldPrice) totalSave += (it.oldPrice - it.price); });

    var promoBtn = state.promoApplied
      ? '<button class="applied" disabled>✓ Appliqué</button>'
      : '<button data-act="apply-promo" '+(state.promoCode?'':'disabled')+'>Appliquer</button>';

    var payAmount = state.payMode === '3x' ? Math.ceil(r.total/3) : r.total;
    var payExtra = state.payMode === '3x' ? ' <span style="font-weight:400;font-size:12px;opacity:.8">(1ère échéance)</span>' : '';

    return '<div class="side"><div class="side-card">'+
      '<div class="side-sec">'+
        '<h3>Récapitulatif</h3>'+
        '<div class="side-lines">'+lines+'</div>'+
        '<div class="promo-row">'+
          '<input id="promo-i" type="text" placeholder="Code promo" '+(state.promoApplied?'disabled':'')+' value="'+esc(state.promoCode)+'">'+
          promoBtn+
        '</div>'+
        '<div class="side-div"></div>'+
        '<div class="side-total"><span class="lbl">Total</span><span class="amt">'+fmt(r.total)+'</span></div>'+
        (totalSave>0?'<div class="side-save">Vous économisez '+fmt(totalSave)+'</div>':'')+
      '</div>'+
      '<div class="side-sec">'+
        '<div style="font-size:13px;font-weight:600;margin-bottom:10px">Mode de paiement</div>'+
        '<div class="pay-modes">'+
          '<label class="pay-mode '+(state.payMode==='comptant'?'sel':'')+'" data-act="set-pay" data-mode="comptant"><div class="dot"></div><div><b>Paiement comptant</b><small>'+fmt(r.total)+' en une fois</small></div></label>'+
          '<label class="pay-mode '+(state.payMode==='3x'?'sel':'')+'" data-act="set-pay" data-mode="3x"><div class="dot"></div><div><b>Paiement en 3×</b><small>3 × '+fmt(Math.ceil(r.total/3))+' sans frais</small></div></label>'+
        '</div>'+
      '</div>'+
      '<div class="side-sec">'+
        '<button class="btn-pay" data-act="pay">'+SVG.lock+' Payer '+fmt(payAmount)+payExtra+'</button>'+
        '<div class="pay-info">Paiement sécurisé par Stripe<br>Vous serez redirigé vers la page de paiement</div>'+
        '<div class="trust">'+
          '<div>'+SVG.check+'Sécurisé</div>'+
          '<div>'+SVG.check+'Expert dédié</div>'+
          '<div>'+SVG.check+'97% réussite</div>'+
        '</div>'+
      '</div>'+
    '</div></div>';
  }

  function renderEmpty(){
    var html = '<div class="page">'+
      '<div class="empty">'+
        '<div class="empty-ic">'+SVG.cart+'</div>'+
        '<h2>Votre panier est vide</h2>'+
        '<p>Parcourez nos services et ajoutez-les à votre panier</p>'+
        '<a href="/formation" class="lfo-btn" style="background:var(--o);color:#fff">Voir les services</a>'+
      '</div>'+
    '</div>';
    setHTML(app, html);
  }

  function renderConfirmation(){
    var r = recalc();
    var msg = state.payMode === '3x'
      ? 'Première échéance de '+fmt(Math.ceil(r.total/3))+' à régler maintenant.'
      : 'Montant total : '+fmt(r.total)+'.';
    var html = '<div class="conf">'+
      '<div class="conf-ic">'+SVG.checkBig+'</div>'+
      '<h1>Commande confirmée</h1>'+
      '<p>Vous allez être redirigé vers la page de paiement sécurisé Stripe.</p>'+
      '<p>'+msg+'<br>Un expert vous contactera sous 24h pour démarrer vos démarches.</p>'+
      '<div class="actions">'+
        '<a href="/" class="lfo-btn" style="background:var(--o);color:#fff">Retour à l\'accueil</a>'+
        '<button class="lfo-btn" data-act="goto-pay" style="background:var(--dk);color:#fff">Payer maintenant '+SVG.arrow+'</button>'+
      '</div>'+
    '</div>';
    setHTML(app, html);
    bind();
  }

  async function startPayment(btn){
    var r = recalc();
    if (state.cart.length === 0 || r.total <= 0){ alert('Votre panier est vide'); return; }
    var prev;
    if (btn){
      btn.disabled = true;
      btn.style.opacity = .7;
      prev = btn.cloneNode(true);
      while (btn.firstChild) btn.removeChild(btn.firstChild);
      btn.insertAdjacentHTML('afterbegin', '<span style="display:inline-block;width:14px;height:14px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:rhSpin .8s linear infinite;margin-right:8px;vertical-align:-2px"></span>Préparation du paiement...');
    }
    function reset(){
      if (!btn || !prev) return;
      btn.disabled = false;
      btn.style.opacity = '';
      while (btn.firstChild) btn.removeChild(btn.firstChild);
      while (prev.firstChild) btn.appendChild(prev.firstChild);
    }

    var user = null;
    try { user = await window.getUser(); } catch(e){}
    if (!user){
      reset();
      try { localStorage.setItem('lfo_resume_pay', '1'); } catch(e){}
      if (typeof window.openAuthModal === 'function'){ window.openAuthModal(); return; }
      alert('Vous devez être connecté pour finaliser le paiement.');
      return;
    }

    var orgId = null;
    try {
      var prof = await sb.from('profiles').select('id,organisme_id,email').eq('id', user.id).maybeSingle();
      if (prof && prof.data) orgId = prof.data.organisme_id || null;
    } catch(e){}

    var totalCents = r.total * 100;
    var installmentsTotal = state.payMode === '3x' ? 3 : 1;
    var installmentCents = state.payMode === '3x' ? Math.ceil(totalCents / 3) : totalCents;
    var pm = state.payMode === '3x' ? '3x' : 'comptant';
    var label_dem = 'Panier LFO — ' + state.cart.length + ' article' + (state.cart.length>1?'s':'');

    var demRes;
    try {
      demRes = await sb.from('demarches').insert({
        user_id: user.id,
        organisme_id: orgId,
        type: 'panier',
        category: 'demarche',
        status: 'en_attente_paiement',
        current_step: 1,
        total_steps: 1,
        amount_cents: totalCents,
        payment_mode: pm,
        installment_amount_cents: installmentCents,
        installments_paid: 0,
        installments_total: installmentsTotal,
        paid: false,
        config: {
          cart_items: state.cart,
          cart_subtotal_cents: r.subtotal * 100,
          edof_offered: r.edofOffered,
          promo_applied: state.promoApplied,
          promo_discount_cents: r.promoDiscount * 100,
          promo_code: state.promoApplied ? state.promoCode : null
        }
      }).select().single();
      if (demRes.error) throw demRes.error;
    } catch(e){
      console.error('Erreur création démarche panier:', e);
      reset();
      alert('Erreur lors de la préparation du paiement. Réessayez ou contactez le support.');
      return;
    }
    var dem = demRes.data;

    try {
      localStorage.setItem('lfo_pending_order', JSON.stringify({
        demarche_id: dem.id,
        payment_mode: pm,
        amount_cents: totalCents,
        cart_size: state.cart.length,
        clear_cart: true
      }));
    } catch(e){}

    try {
      var sr = await fetch('https://webhook.lesformateurs.online/create-stripe-link', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          entity: 'demarche',
          entity_id: dem.id,
          amount_cents: totalCents,
          payment_mode: pm,
          installment_cents: installmentCents,
          installments_total: installmentsTotal,
          label: label_dem,
          type: 'panier',
          user_email: user.email
        })
      });
      var j = await sr.json();
      if (j && j.url){
        // Pré-remplir l'email sur le Stripe Payment Link (toujours collecté côté Stripe)
        var stripeUrl = j.url;
        if (user.email && stripeUrl.indexOf('prefilled_email') === -1){
          stripeUrl += (stripeUrl.indexOf('?') === -1 ? '?' : '&') + 'prefilled_email=' + encodeURIComponent(user.email);
        }
        window.location.href = stripeUrl;
        return;
      }
      throw new Error('Pas d\'URL Stripe');
    } catch(e){
      console.error('Erreur Stripe:', e);
      reset();
      alert('Impossible de générer le lien de paiement. Réessayez dans un instant.');
    }
  }

  function openAddModal(){ renderAddModal(''); }
  function closeAddModal(){ var ov = document.getElementById('add-modal-ov'); if (ov) ov.remove(); }

  function renderAddModal(searchVal){
    closeAddModal();
    var q = (searchVal||'').toLowerCase();
    var filtered = ALL_SERVICES.filter(function(s){ return !q || s.name.toLowerCase().indexOf(q) !== -1; });
    var cats = ['Procédures','Spécialisées','Digital','Packs'];
    var body = '';
    cats.forEach(function(cat){
      var items = filtered.filter(function(s){ return s.cat === cat; });
      if (!items.length) return;
      body += '<div class="cat-title">'+esc(cat)+'</div>';
      items.forEach(function(svc){
        var inCart = state.cart.some(function(c){ return c.type==='service' && c.key === svc.key; });
        body += '<div class="svc-row">'+
          '<div><div class="n">'+esc(svc.name)+'</div><div class="p">'+(svc.label?esc(svc.label)+' ':'')+fmt(svc.price)+(svc.unit?' / '+esc(svc.unit):'')+'</div></div>'+
          (inCart ? '<span class="svc-in">✓ Ajouté</span>' : '<button class="svc-add" data-act="add-svc" data-key="'+esc(svc.key)+'">Ajouter</button>')+
        '</div>';
      });
    });
    var html = '<div class="modal-ov" id="add-modal-ov">'+
      '<div class="modal" id="add-modal">'+
        '<div class="modal-head"><h3>Ajouter un service</h3><button class="modal-close" data-act="close-add">'+SVG.close+'</button></div>'+
        '<div class="modal-search"><input id="addq" type="text" placeholder="Rechercher un service..." value="'+esc(searchVal||'')+'"></div>'+
        '<div class="modal-body" id="add-modal-body">'+(body||'<div style="text-align:center;color:#888;padding:20px;font-size:13px">Aucun résultat</div>')+'</div>'+
      '</div>'+
    '</div>';
    document.body.insertAdjacentHTML('beforeend', html);

    var inp = document.getElementById('addq');
    if (inp){
      inp.addEventListener('input', function(e){
        var v = e.target.value;
        renderAddModal(v);
        var i2 = document.getElementById('addq'); if (i2){ i2.focus(); i2.setSelectionRange(v.length, v.length); }
      });
      setTimeout(function(){ inp.focus(); }, 60);
    }
    document.getElementById('add-modal-ov').addEventListener('click', function(e){
      if (e.target.id === 'add-modal-ov') closeAddModal();
    });
  }

  function addService(key){
    var svc = ALL_SERVICES.find(function(s){ return s.key === key; });
    if (!svc) return;
    window.LFOCart.add({type:'service', key:svc.key, name:svc.name, price:svc.price, unit:svc.unit, qty:1});
    state.cart = window.LFOCart.get();
    closeAddModal();
    render();
  }

  function bind(){
    app.querySelectorAll('[data-act]').forEach(function(el){
      var a = el.getAttribute('data-act');
      if (a === 'open-add') el.addEventListener('click', openAddModal);
      else if (a === 'remove'){
        el.addEventListener('click', function(){
          var id = el.getAttribute('data-id');
          state.cart = window.LFOCart.remove(id);
          render();
        });
      }
      else if (a === 'qty-inc' || a === 'qty-dec'){
        el.addEventListener('click', function(){
          var id = el.getAttribute('data-id');
          state.cart = window.LFOCart.updateQty(id, a==='qty-inc'?1:-1);
          render();
        });
      }
      else if (a === 'decline-edof'){
        el.addEventListener('click', function(){ state.edofDeclined = true; writeEdofDeclined(true); render(); });
      }
      else if (a === 'restore-edof'){
        el.addEventListener('click', function(){ state.edofDeclined = false; writeEdofDeclined(false); render(); });
      }
      else if (a === 'toggle-opt'){
        el.addEventListener('click', function(){
          var id = el.getAttribute('data-id');
          var key = el.getAttribute('data-key');
          var items = window.LFOCart.get();
          var found = items.find(function(x){ return x.id === id; });
          if (!found) return;
          var av = (found.available_options || []).find(function(o){ return o.key === key; });
          if (!av) return;
          if (!found.options) found.options = {};
          // groupes mutuellement exclusifs : formateur_diplome ↔ formateur_enregistre
          var FORMATEUR_GROUP = ['formateur_diplome','formateur_enregistre'];
          if (FORMATEUR_GROUP.indexOf(key) !== -1){
            FORMATEUR_GROUP.forEach(function(fk){ if (fk !== key) delete found.options[fk]; });
          }
          if (found.options[key]) delete found.options[key];
          else found.options[key] = { key: av.key, label: av.label, price: av.price || 0, desc: av.desc };
          window.LFOCart.set(items);
          state.cart = window.LFOCart.get();
          render();
        });
      }
      else if (a === 'set-pay'){
        el.addEventListener('click', function(){
          state.payMode = el.getAttribute('data-mode'); render();
        });
      }
      else if (a === 'apply-promo'){
        el.addEventListener('click', function(){
          var inp = document.getElementById('promo-i');
          var v = inp ? inp.value.trim() : '';
          state.promoCode = v;
          if (v.toLowerCase() === 'lfo10') state.promoApplied = true;
          render();
        });
      }
      else if (a === 'pay'){
        el.addEventListener('click', function(){ startPayment(el); });
      }
      else if (a === 'goto-pay'){
        el.addEventListener('click', function(){ startPayment(el); });
      }
    });
    var pi = document.getElementById('promo-i');
    if (pi) pi.addEventListener('input', function(e){ state.promoCode = e.target.value; });
  }

  document.addEventListener('click', function(e){
    var t = e.target.closest('[data-act]');
    if (!t) return;
    var a = t.getAttribute('data-act');
    if (a === 'close-add') closeAddModal();
    else if (a === 'add-svc') addService(t.getAttribute('data-key'));
  });

  window.addEventListener('lfo-cart-change', function(){ state.cart = window.LFOCart.get(); render(); });

  render();
})();
