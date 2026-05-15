// Auth Modal — shared across all public pages
(function(){

// Inject self-contained styles (no dependency on page CSS)
var styleEl = document.createElement('style');
styleEl.textContent = `
#auth-modal{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10000;display:none;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);}
#auth-modal.open{display:flex;}
#auth-modal .modal-box{position:relative;background:#FEFEFE;border:0.5px solid #f0f0f0;border-radius:12px;padding:32px 28px;max-width:420px;width:90%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.15);box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',sans-serif;color:#1a1a1a;}
#auth-modal .modal-close{position:absolute;top:12px;right:12px;width:32px;height:32px;border-radius:50%;border:none;background:transparent;font-size:18px;line-height:1;cursor:pointer;color:#888;display:flex;align-items:center;justify-content:center;transition:background .15s,color .15s;}
#auth-modal .modal-close:hover{background:#f0f0f0;color:#1a1a1a;}
#auth-modal .form-group{margin-bottom:14px;}
#auth-modal .form-group label{display:block;margin-bottom:6px;color:#1a1a1a;}
#auth-modal input,#auth-modal select{font-family:inherit;outline:none;transition:border-color .15s;}
#auth-modal input:focus,#auth-modal select:focus{border-color:#D85A30;}
#auth-modal .btn-primary{background:#D85A30;color:#fff;border:none;cursor:pointer;transition:opacity .15s;}
#auth-modal .btn-primary:hover{opacity:.88;}
#auth-modal .btn-primary:disabled{opacity:.6;cursor:not-allowed;}
#auth-modal h3{color:#1a1a1a;letter-spacing:-0.3px;}
`;
document.head.appendChild(styleEl);

var modalHTML = `
<div class="modal" id="auth-modal">
  <div class="modal-box" style="max-width:460px;">
    <button class="modal-close" onclick="closeAuthModal()">✕</button>

    <!-- LOGIN VIEW -->
    <div id="auth-login-view">
      <h3 style="font-size:22px;font-weight:800;margin-bottom:4px;">Connectez-vous</h3>
      <p style="font-size:13px;color:var(--muted);margin-bottom:20px;">Accédez à votre espace et gérez vos démarches.</p>
      <form onsubmit="doAuthLogin();return false;">
        <div class="form-group">
          <label style="font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.5px;">Email</label>
          <input type="email" id="auth-email" placeholder="votre@email.fr" required style="padding:14px;border-radius:10px;border:1px solid #e0e0e0;font-size:14px;width:100%;box-sizing:border-box;">
        </div>
        <div class="form-group" style="position:relative;">
          <label style="font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.5px;">Mot de passe</label>
          <input type="password" id="auth-password" placeholder="••••••••" required style="padding:14px;border-radius:10px;border:1px solid #e0e0e0;font-size:14px;width:100%;box-sizing:border-box;">
          <span onclick="toggleAuthPwd('auth-password')" style="position:absolute;right:14px;top:38px;cursor:pointer;font-size:18px;opacity:.5;">👁</span>
        </div>
        <div id="auth-login-error" style="display:none;color:#e94560;font-size:12px;margin-bottom:10px;"></div>
        <button type="submit" id="auth-login-btn" class="btn btn-primary" style="width:100%;padding:14px;font-size:15px;font-weight:700;border-radius:10px;margin-top:4px;">Se connecter</button>
      </form>
      <p style="text-align:center;margin-top:16px;font-size:13px;color:var(--muted);">
        Pas encore de compte ? <a href="#" onclick="showAuthSignup();return false;" style="color:var(--accent);font-weight:700;">Créer un compte</a>
      </p>
      <p style="text-align:center;margin-top:8px;font-size:12px;">
        <a href="#" onclick="showAuthForgot();return false;" style="color:var(--muted);">Mot de passe oublié ?</a>
      </p>
    </div>

    <!-- FORGOT PASSWORD VIEW -->
    <div id="auth-forgot-view" style="display:none;">
      <h3 style="font-size:22px;font-weight:800;margin-bottom:4px;">Mot de passe oublié</h3>
      <p style="font-size:13px;color:var(--muted);margin-bottom:20px;">Entrez votre email, nous vous enverrons un lien de réinitialisation.</p>
      <form onsubmit="doAuthForgot();return false;">
        <div class="form-group">
          <label style="font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.5px;">Email</label>
          <input type="email" id="auth-forgot-email" placeholder="votre@email.fr" required style="padding:14px;border-radius:10px;border:1px solid #e0e0e0;font-size:14px;width:100%;box-sizing:border-box;">
        </div>
        <div id="auth-forgot-error" style="display:none;color:#e94560;font-size:12px;margin-bottom:10px;"></div>
        <div id="auth-forgot-success" style="display:none;color:#10b981;font-size:13px;margin-bottom:10px;font-weight:600;"></div>
        <button type="submit" id="auth-forgot-btn" class="btn btn-primary" style="width:100%;padding:14px;font-size:15px;font-weight:700;border-radius:10px;margin-top:4px;">Envoyer le lien</button>
      </form>
      <p style="text-align:center;margin-top:16px;font-size:13px;color:var(--muted);">
        <a href="#" onclick="showAuthLogin();return false;" style="color:var(--accent);font-weight:700;">← Retour à la connexion</a>
      </p>
    </div>

    <!-- SIGNUP VIEW -->
    <div id="auth-signup-view" style="display:none;">
      <h3 style="font-size:22px;font-weight:800;margin-bottom:4px;">Créer un compte</h3>
      <p style="font-size:13px;color:var(--muted);margin-bottom:20px;">Rejoignez la communauté des formateurs.</p>
      <form onsubmit="doAuthSignup();return false;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div class="form-group">
            <label style="font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.5px;">Prénom</label>
            <input type="text" id="auth-prenom" placeholder="Prénom" required style="padding:12px;border-radius:10px;border:1px solid #e0e0e0;font-size:14px;width:100%;box-sizing:border-box;">
          </div>
          <div class="form-group">
            <label style="font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.5px;">Nom</label>
            <input type="text" id="auth-nom" placeholder="Nom" required style="padding:12px;border-radius:10px;border:1px solid #e0e0e0;font-size:14px;width:100%;box-sizing:border-box;">
          </div>
        </div>
        <div class="form-group">
          <label style="font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.5px;">Email</label>
          <input type="email" id="auth-signup-email" placeholder="votre@email.fr" required style="padding:12px;border-radius:10px;border:1px solid #e0e0e0;font-size:14px;width:100%;box-sizing:border-box;">
        </div>
        <div class="form-group">
          <label style="font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.5px;">Téléphone</label>
          <input type="tel" id="auth-phone" placeholder="06 12 34 56 78" style="padding:12px;border-radius:10px;border:1px solid #e0e0e0;font-size:14px;width:100%;box-sizing:border-box;">
        </div>
        <div class="form-group" style="position:relative;">
          <label style="font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.5px;">Mot de passe</label>
          <input type="password" id="auth-signup-password" placeholder="Minimum 8 caractères" required minlength="8" style="padding:12px;border-radius:10px;border:1px solid #e0e0e0;font-size:14px;width:100%;box-sizing:border-box;">
          <span onclick="toggleAuthPwd('auth-signup-password')" style="position:absolute;right:14px;top:38px;cursor:pointer;font-size:18px;opacity:.5;">👁</span>
        </div>
        <div class="form-group">
          <label style="font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.5px;">Vous êtes</label>
          <select id="auth-type" style="padding:12px;border-radius:10px;border:1px solid #e0e0e0;font-size:14px;width:100%;box-sizing:border-box;">
            <option value="formateur">Formateur indépendant</option>
            <option value="gerant_of">Organisme de formation</option>
            <option value="creation_of">Porteur de projet</option>
            <option value="demandeur_emploi">Demandeur d'emploi</option>
          </select>
        </div>
        <div id="auth-signup-error" style="display:none;color:#e94560;font-size:12px;margin-bottom:10px;"></div>
        <button type="submit" id="auth-signup-btn" class="btn btn-primary" style="width:100%;padding:14px;font-size:15px;font-weight:700;border-radius:10px;margin-top:4px;">Créer mon compte</button>
      </form>
      <p style="text-align:center;margin-top:16px;font-size:13px;color:var(--muted);">
        Déjà un compte ? <a href="#" onclick="showAuthLogin();return false;" style="color:var(--accent);font-weight:700;">Se connecter</a>
      </p>
    </div>
  </div>
</div>`;

// Inject modal into page
document.body.insertAdjacentHTML('beforeend', modalHTML);

// Open / Close
var _prevBodyOverflow = '';
window.openAuthModal = function(){
  showAuthLogin();
  document.getElementById('auth-modal').classList.add('open');
  _prevBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
};
window.closeAuthModal = function(){
  document.getElementById('auth-modal').classList.remove('open');
  document.body.style.overflow = _prevBodyOverflow || '';
};

// Close on Escape
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape'){
    var m = document.getElementById('auth-modal');
    if(m && m.classList.contains('open')) closeAuthModal();
  }
});

// Toggle views
window.showAuthLogin = function(){
  document.getElementById('auth-login-view').style.display = '';
  document.getElementById('auth-signup-view').style.display = 'none';
  document.getElementById('auth-forgot-view').style.display = 'none';
  document.getElementById('auth-login-error').style.display = 'none';
};
window.showAuthSignup = function(){
  document.getElementById('auth-login-view').style.display = 'none';
  document.getElementById('auth-signup-view').style.display = '';
  document.getElementById('auth-forgot-view').style.display = 'none';
  document.getElementById('auth-signup-error').style.display = 'none';
};
window.showAuthForgot = function(){
  document.getElementById('auth-login-view').style.display = 'none';
  document.getElementById('auth-signup-view').style.display = 'none';
  document.getElementById('auth-forgot-view').style.display = '';
  document.getElementById('auth-forgot-error').style.display = 'none';
  document.getElementById('auth-forgot-success').style.display = 'none';
};

// Forgot password
window.doAuthForgot = async function(){
  var email = document.getElementById('auth-forgot-email').value.trim();
  var errDiv = document.getElementById('auth-forgot-error');
  var successDiv = document.getElementById('auth-forgot-success');
  var btn = document.getElementById('auth-forgot-btn');
  errDiv.style.display = 'none';
  successDiv.style.display = 'none';
  
  if(!email){ errDiv.textContent = 'Veuillez entrer votre email.'; errDiv.style.display = ''; return; }
  btn.textContent = 'Envoi...';
  btn.disabled = true;
  
  var { error } = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/dashboard.html'
  });
  
  if(error){
    errDiv.textContent = 'Erreur : ' + error.message;
    errDiv.style.display = '';
  } else {
    successDiv.textContent = '✅ Un email de réinitialisation a été envoyé à ' + email + '. Vérifiez votre boîte de réception.';
    successDiv.style.display = '';
  }
  btn.textContent = 'Envoyer le lien';
  btn.disabled = false;
};

// Toggle password visibility
window.toggleAuthPwd = function(id){
  var input = document.getElementById(id);
  input.type = input.type === 'password' ? 'text' : 'password';
};

// Login
window.doAuthLogin = async function(){
  var email = document.getElementById('auth-email').value.trim();
  var password = document.getElementById('auth-password').value;
  var errDiv = document.getElementById('auth-login-error');
  var btn = document.getElementById('auth-login-btn');
  errDiv.style.display = 'none';
  btn.textContent = 'Connexion...';
  btn.disabled = true;
  try {
    var result = await signIn(email, password);
    if(result.error){
      errDiv.textContent = result.error.message === 'Invalid login credentials' ? 'Email ou mot de passe incorrect.' : result.error.message;
      errDiv.style.display = '';
      btn.textContent = 'Se connecter';
      btn.disabled = false;
      return;
    }
    try {
      var _p = (window.location.pathname || '').toLowerCase();
      if (_p === '/' || _p === '' || _p.endsWith('/index.html')) {
        window.location.href = 'dashboard.html';
      } else {
        window.location.reload();
      }
    } catch(_e){ window.location.reload(); }
  } catch(e){
    errDiv.textContent = 'Erreur de connexion. Réessayez.';
    errDiv.style.display = '';
    btn.textContent = 'Se connecter';
    btn.disabled = false;
  }
};

// Signup
window.doAuthSignup = async function(){
  var prenom = document.getElementById('auth-prenom').value.trim();
  var nom = document.getElementById('auth-nom').value.trim();
  var email = document.getElementById('auth-signup-email').value.trim();
  var phone = document.getElementById('auth-phone').value.trim();
  var password = document.getElementById('auth-signup-password').value;
  var type = document.getElementById('auth-type').value;
  var errDiv = document.getElementById('auth-signup-error');
  var btn = document.getElementById('auth-signup-btn');
  errDiv.style.display = 'none';
  btn.textContent = 'Création en cours...';
  btn.disabled = true;
  try {
    var result = await signUp(email, password, {
      first_name: prenom,
      last_name: nom,
      
      phone: phone,
      profile_type: type
    });
    if(result.error){
      var msg = result.error.message;
      if(msg.includes('already registered')) msg = 'Cet email est déjà utilisé.';
      if(msg.includes('least 8')) msg = 'Le mot de passe doit contenir au moins 8 caractères.';
      errDiv.textContent = msg;
      errDiv.style.display = '';
      btn.textContent = 'Créer mon compte';
      btn.disabled = false;
      return;
    }
    // Link referrer via referral code captured by js/referral.js
    try {
      var _refCode = null;
      try { _refCode = localStorage.getItem('lfo_ref') || localStorage.getItem('lfo_referral'); } catch(_e){}
      var _newUserId = result.data && result.data.user && result.data.user.id;
      if(_refCode && _newUserId){
        var _r = await sb.from('profiles').select('id').eq('referral_code', _refCode).maybeSingle();
        var _parrain = _r && _r.data;
        if(_parrain && _parrain.id && _parrain.id !== _newUserId){
          await sb.from('profiles').update({ referred_by: _parrain.id }).eq('id', _newUserId);
        }
      }
    } catch(_e){}
    try {
      var _p = (window.location.pathname || '').toLowerCase();
      if (_p === '/' || _p === '' || _p.endsWith('/index.html')) {
        window.location.href = 'dashboard.html';
      } else {
        window.location.reload();
      }
    } catch(_e){ window.location.reload(); }
  } catch(e){
    errDiv.textContent = 'Erreur lors de l\'inscription. Réessayez.';
    errDiv.style.display = '';
    btn.textContent = 'Créer mon compte';
    btn.disabled = false;
  }
};

// Close on backdrop click
document.getElementById('auth-modal').addEventListener('click', function(e){
  if(e.target === this) closeAuthModal();
});

})();
