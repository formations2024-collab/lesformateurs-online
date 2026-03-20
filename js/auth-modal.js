// Auth Modal — shared across all public pages
(function(){

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
            <option value="of">Organisme de formation</option>
            <option value="porteur">Porteur de projet</option>
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
window.openAuthModal = function(){
  showAuthLogin();
  document.getElementById('auth-modal').classList.add('open');
};
window.closeAuthModal = function(){
  document.getElementById('auth-modal').classList.remove('open');
};

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
    window.location.href = 'dashboard.html';
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
      full_name: prenom + ' ' + nom,
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
    window.location.href = 'dashboard.html';
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
