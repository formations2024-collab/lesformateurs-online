// ============================================
// lesformateurs.online — Supabase Configuration
// ============================================

const SUPABASE_URL = 'https://bxijjjbxsevnudienvbv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4aWpqamJ4c2V2bnVkaWVudmJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MjU0MjcsImV4cCI6MjA4OTUwMTQyN30.9YNffsFuGv7at2nUviuCUMA469z0FuskYHJtkOAaTn8';

// Init Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ====== AUTH HELPERS ======

async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

async function getProfile() {
  const user = await getUser();
  if (!user) return null;
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return data;
}

async function signUp(email, password, fullName, phone, profileType) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  });
  if (error) throw error;

  // Create profile
  if (data.user) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: fullName,
      email: email,
      phone: phone || null,
      profile_type: profileType || 'formateur'
    });
  }
  return data;
}

async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function signOut() {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
}

// ====== UI HELPERS ======

function showAuthError(msg) {
  const el = document.getElementById('auth-error');
  if (el) {
    el.textContent = msg;
    el.style.display = 'block';
  } else {
    alert(msg);
  }
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

  const { data, error } = await supabase.storage
    .from('documents')
    .upload(path, file, { contentType: file.type });

  if (error) throw error;
  return path;
}

async function getDocumentUrl(path) {
  const { data } = await supabase.storage
    .from('documents')
    .createSignedUrl(path, 3600); // 1h
  return data?.signedUrl;
}

// ====== PAYMENT TRACKING ======

async function recordPayment(amountCents, paymentType, referenceId, metadata) {
  const user = await getUser();
  const { data, error } = await supabase.from('payments').insert({
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
supabase.auth.onAuthStateChange(function(event, session) {
  if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
    updateAuthUI();
  }
});
