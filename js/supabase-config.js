// ============================================
// lesformateurs.online — Supabase Configuration
// ============================================

const SUPABASE_URL = 'https://bxijjjbxsevnudienvbv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4aWpqamJ4c2V2bnVkaWVudmJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MjU0MjcsImV4cCI6MjA4OTUwMTQyN30.9YNffsFuGv7at2nUviuCUMA469z0FuskYHJtkOAaTn8';

// Init Supabase client
var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    storageKey: 'lfo-auth',
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// ====== AUTH HELPERS ======

async function getUser() {
  const { data: { user } } = await sb.auth.getUser();
  return user;
}

async function getProfile() {
  const user = await getUser();
  if (!user) return null;
  const { data } = await sb.from('profiles').select('*').eq('id', user.id).single();
  
  // Check if account is blocked
  if(data && data.is_blocked){
    showBlockedModal();
    return data; // Still return data but the modal blocks interaction
  }
  return data;
}

function showBlockedModal(){
  // Only show once
  if(document.getElementById('blocked-overlay')) return;
  
  var overlay = document.createElement('div');
  overlay.id = 'blocked-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;';
  overlay.innerHTML = '<div style="background:#fff;border-radius:16px;padding:40px;max-width:480px;width:100%;text-align:center;">' +
    '<div style="font-size:64px;margin-bottom:16px;">🚫</div>' +
    '<h2 style="font-size:22px;font-weight:800;color:#1a1a2e;margin-bottom:12px;">Compte bloqué</h2>' +
    '<p style="font-size:15px;color:#666;line-height:1.6;margin-bottom:24px;">Ce compte a été bloqué par les services administratifs de lesformateurs.online.<br><br>Si vous pensez qu\'il s\'agit d\'une erreur, veuillez nous contacter à <a href="mailto:contact@lesformateurs.online" style="color:#e94560;">contact@lesformateurs.online</a></p>' +
    '<button onclick="signOut()" style="background:#e94560;color:#fff;border:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:16px;cursor:pointer;width:100%;">Se déconnecter</button>' +
    '</div>';
  document.body.appendChild(overlay);
}

async function signUp(email, password, meta) {
  // meta can be an object {first_name, last_name, full_name, phone, profile_type}
  // or individual params (legacy): signUp(email, pass, firstName, lastName, phone, type)
  var userData = {};
  if(typeof meta === 'object' && meta !== null){
    userData = meta;
  } else {
    // Legacy call: signUp(email, pass, firstName, lastName, phone, profileType)
    userData = {
      first_name: meta || '',
      last_name: arguments[3] || '',
      full_name: (meta || '') + ' ' + (arguments[3] || ''),
      phone: arguments[4] || '',
      profile_type: arguments[5] || ''
    };
  }
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: { data: userData }
  });
  return { data, error };
}

async function signIn(email, password) {
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  return { data, error };
}

async function signOut() {
  await sb.auth.signOut();
  window.location.href = 'index.html';
}

// ====== UI HELPERS ======

function showAuthError(msg) {
  // Show on both error divs (login + signup)
  ['auth-error', 'signup-error'].forEach(function(id) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = msg;
      el.style.display = 'block';
    }
  });
}

// Update nav buttons based on auth state
async function updateAuthUI() {
  const user = await getUser();
  const loginBtns = document.querySelectorAll('.btn-login');
  const dashBtns = document.querySelectorAll('.btn-dashboard');
  const logoutBtns = document.querySelectorAll('.btn-logout');
  const userNameEls = document.querySelectorAll('.user-name');

  if (user) {
    const profile = await getProfile();
    loginBtns.forEach(b => b.style.display = 'none');
    dashBtns.forEach(b => b.style.display = '');
    logoutBtns.forEach(b => b.style.display = '');
    userNameEls.forEach(el => {
      if (profile) el.textContent = profile.full_name;
    });
  } else {
    loginBtns.forEach(b => b.style.display = '');
    dashBtns.forEach(b => b.style.display = 'none');
    logoutBtns.forEach(b => b.style.display = 'none');
  }
}

// ====== DOCUMENT UPLOAD ======

async function uploadDocument(file, folder) {
  const user = await getUser();
  if (!user) throw new Error('Non connecté');

  const ext = file.name.split('.').pop();
  const path = `${folder}/${user.id}/${Date.now()}.${ext}`;

  const { data, error } = await sb.storage
    .from('documents')
    .upload(path, file, { contentType: file.type });

  if (error) throw error;
  return path;
}

async function getDocumentUrl(path) {
  const { data } = await sb.storage
    .from('documents')
    .createSignedUrl(path, 3600); // 1h
  return data?.signedUrl;
}

// ====== PAYMENT TRACKING ======

async function recordPayment(amountCents, paymentType, referenceId, metadata) {
  const user = await getUser();
  const { data, error } = await sb.from('payments').insert({
    user_id: user?.id,
    amount_cents: amountCents,
    payment_type: paymentType,
    reference_id: referenceId,
    metadata: metadata || {},
    status: 'pending'
  }).select().single();

  if (error) throw error;
  return data;
}

// ====== REFERRAL TRACKING ======

function getReferralCode() {
  const params = new URLSearchParams(window.location.search);
  return params.get('ref');
}

function storeReferralCode() {
  const code = getReferralCode();
  if (code) {
    localStorage.setItem('lfo_ref', code);
  }
}

function getStoredReferral() {
  return localStorage.getItem('lfo_ref');
}

// ====== INIT ======

// Store referral on every page load
storeReferralCode();

// Update UI when ready
document.addEventListener('DOMContentLoaded', function() {
  updateAuthUI();
});

// Listen for auth changes
sb.auth.onAuthStateChange(function(event, session) {
  if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
    updateAuthUI();
  }
});

// ====== FONT SIZE ACCESSIBILITY ======

function setFontSize(size){
  // Find the layout container
  var layout = document.querySelector('.dash-layout') || document.querySelector('.admin-layout') || document.querySelector('.expert-layout');
  if(!layout) layout = document.body;
  
  layout.classList.remove('fs-large', 'fs-xlarge');
  if(size === 'large') layout.classList.add('fs-large');
  if(size === 'xlarge') layout.classList.add('fs-xlarge');
  
  // Update active button
  document.querySelectorAll('.fst-btn').forEach(function(b){ b.classList.remove('active'); });
  var idx = size === 'normal' ? 0 : size === 'large' ? 1 : 2;
  var btns = document.querySelectorAll('.fst-btn');
  if(btns[idx]) btns[idx].classList.add('active');
  
  // Persist
  try { localStorage.setItem('lfo-fontsize', size); } catch(e){}
}

// Restore on load
(function(){
  try {
    var saved = localStorage.getItem('lfo-fontsize');
    if(saved && saved !== 'normal') setFontSize(saved);
  } catch(e){}
})();

// ====== REFERRAL TRACKING ======
// Detects ?ref=CODE in URL and persists it for the entire session
(function(){
  try {
    var params = new URLSearchParams(window.location.search);
    var ref = params.get('ref');
    if(ref && ref.length > 3){
      localStorage.setItem('lfo_referral', ref);
      localStorage.setItem('lfo_referral_ts', Date.now().toString());
    }
    // Clean URL without reload (remove ref param)
    if(ref && window.history.replaceState){
      params.delete('ref');
      var clean = window.location.pathname + (params.toString() ? '?' + params.toString() : '') + window.location.hash;
      window.history.replaceState({}, '', clean);
    }
  } catch(e){}
})();

function getActiveReferral(){
  try {
    var code = localStorage.getItem('lfo_referral');
    var ts = parseInt(localStorage.getItem('lfo_referral_ts') || '0');
    // Referral valid for 30 days
    if(code && ts && (Date.now() - ts) < 30 * 24 * 60 * 60 * 1000){
      return code;
    }
    return null;
  } catch(e){ return null; }
}

async function recordReferralCommission(buyerId, productType, productLabel, saleAmountCents){
  var refCode = getActiveReferral();
  if(!refCode) return null;
  
  try {
    // Find the referrer by code
    var { data: referrer } = await sb.from('profiles').select('id, is_premium').eq('referral_code', refCode).single();
    if(!referrer || referrer.id === buyerId) return null; // Can't refer yourself
    
    var commissionCents = Math.round(saleAmountCents * 0.10);
    var isRecurring = productType === 'premium_subscription';
    
    // Record in referrals table
    var { data: ref } = await sb.from('referrals').insert({
      referrer_id: referrer.id,
      buyer_id: buyerId,
      product_type: productType,
      product_label: productLabel,
      sale_amount_cents: saleAmountCents,
      commission_cents: commissionCents,
      is_recurring: isRecurring,
      commission_status: 'pending'
    }).select().single();
    
    // Record in achats table
    await sb.from('achats').insert({
      user_id: buyerId,
      product_type: productType,
      product_label: productLabel,
      amount_cents: saleAmountCents,
      referrer_id: referrer.id,
      referral_code: refCode,
      commission_cents: commissionCents
    });
    
    return ref;
  } catch(e){ console.log('Referral error:', e); return null; }
}
