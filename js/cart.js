// LFO — utilitaires panier client (localStorage)
(function(){
  var KEY = 'lfo_cart_v1';

  function read(){
    try { var v = localStorage.getItem(KEY); return v ? JSON.parse(v) : []; }
    catch(e){ return []; }
  }
  function write(items){
    try { localStorage.setItem(KEY, JSON.stringify(items)); }
    catch(e){}
    try { window.dispatchEvent(new CustomEvent('lfo-cart-change', {detail:{items:items}})); } catch(e){}
  }

  function get(){ return read(); }
  function set(items){ write(Array.isArray(items)?items:[]); }
  function count(){ return read().length; }
  function clear(){ write([]); }

  function exists(predicate){ return read().some(predicate); }

  function add(item){
    var items = read();
    item = Object.assign({}, item);
    if (!item.id) item.id = 'i_' + Date.now() + '_' + Math.floor(Math.random()*1e6);
    if (!item.qty) item.qty = 1;
    // Empêcher doublon strict pour les services (clé identique)
    if (item.type === 'service' && item.key){
      if (items.some(function(x){ return x.type==='service' && x.key===item.key; })) return items;
    }
    // Empêcher doublon d'habilitation (même code)
    if (item.type === 'habilitation' && item.certCode){
      if (items.some(function(x){ return x.type==='habilitation' && x.certCode===item.certCode; })) return items;
    }
    items.push(item);
    write(items);
    return items;
  }

  function remove(id){
    var items = read().filter(function(x){ return x.id !== id; });
    write(items);
    return items;
  }

  function updateQty(id, delta){
    var items = read().map(function(x){
      if (x.id === id){ var n = Math.max(1, (x.qty||1) + delta); return Object.assign({}, x, {qty:n}); }
      return x;
    });
    write(items);
    return items;
  }

  window.LFOCart = { get:get, set:set, add:add, remove:remove, count:count, clear:clear, updateQty:updateQty, exists:exists };
})();
