// ═══════════════════════════════════════
//  refs-carousel.js — Homepage references carousel
//  8 fictional client sites with Higgsfield-generated mock images.
//  Renders pairs (×2) for seamless auto-scroll loop.
//  All rendered fields come from this static SITES array — no user input.
// ═══════════════════════════════════════

const IMG = {
  excellence: "https://d8j0ntlcm91z4.cloudfront.net/user_35RL2R7AKOZRr095YAopoorDX7B/hf_20260513_122403_e02660aa-31bf-4752-a604-0d9908074cdc.png",
  digiform:   "https://d8j0ntlcm91z4.cloudfront.net/user_35RL2R7AKOZRr095YAopoorDX7B/hf_20260513_122414_1b944b5d-75df-4103-b06b-47623c6bf2a0.png",
  securiform: "https://d8j0ntlcm91z4.cloudfront.net/user_35RL2R7AKOZRr095YAopoorDX7B/hf_20260513_122424_da15f263-073a-4fbe-9b70-9228099f5385.png",
  lingua:     "https://d8j0ntlcm91z4.cloudfront.net/user_35RL2R7AKOZRr095YAopoorDX7B/hf_20260513_122434_26b69bad-6d9f-4771-b3ca-791c9632d298.png",
  btp:        "https://d8j0ntlcm91z4.cloudfront.net/user_35RL2R7AKOZRr095YAopoorDX7B/hf_20260513_122445_59a6ce1c-2d49-4b3e-a95f-35b6d4353d9c.png",
  medlearn:   "https://d8j0ntlcm91z4.cloudfront.net/user_35RL2R7AKOZRr095YAopoorDX7B/hf_20260513_122455_76bc0e41-5a01-4835-8e78-b536c3da9364.png",
  cyber:      "https://d8j0ntlcm91z4.cloudfront.net/user_35RL2R7AKOZRr095YAopoorDX7B/hf_20260513_122506_f3b4bf5a-5c0f-4b62-9a66-4cf5f8d529c0.png",
  culinaire:  "https://d8j0ntlcm91z4.cloudfront.net/user_35RL2R7AKOZRr095YAopoorDX7B/hf_20260513_122516_ec665235-1307-4a46-89f2-7c9f45995eb8.png",
};

const cover = (src, op) =>
  '<img class="rm-cover" src="' + src + '" alt="" loading="lazy"' + (op != null ? ' style="opacity:' + op + ';"' : '') + '>';

const overlay = grad =>
  '<div class="rm-overlay" style="background:' + grad + ';"></div>';

// ─── Mock-card builders (1–8) ─────────────────────────────
function mock1(img) {
  return '' +
    '<div class="rm" style="background:#fff;display:flex;font-family:system-ui,sans-serif;">' +
      '<div style="flex:1;padding:14px 12px;display:flex;flex-direction:column;justify-content:center;background:#F8FAFC;z-index:2;">' +
        '<div style="font-size:5px;font-weight:600;color:#1B4D8C;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px;">Organisme certifié Qualiopi</div>' +
        '<div style="font-size:13px;font-weight:700;line-height:1.15;color:#0F172A;margin-bottom:5px;">Développez vos<br>compétences<br>managériales</div>' +
        '<div style="font-size:5.5px;color:#64748B;line-height:1.5;margin-bottom:8px;">+200 managers formés en 2025<br>Parcours certifiants CPF &amp; OPCO</div>' +
        '<div style="display:flex;gap:4px;">' +
          '<div style="background:#1B4D8C;color:#fff;padding:4px 10px;border-radius:4px;font-size:5.5px;font-weight:600;">Voir les formations</div>' +
          '<div style="color:#1B4D8C;padding:4px 10px;border-radius:4px;font-size:5.5px;font-weight:600;border:1px solid #1B4D8C;">Devis gratuit</div>' +
        '</div>' +
      '</div>' +
      '<div style="width:48%;position:relative;overflow:hidden;">' + cover(img) + '</div>' +
    '</div>';
}

function mock2(img) {
  return '' +
    '<div class="rm" style="font-family:ui-monospace,monospace;color:#fff;background:#0A0A14;">' +
      cover(img, 0.35) +
      overlay('linear-gradient(180deg,rgba(10,10,20,.3) 0%,rgba(10,10,20,.95) 100%)') +
      '<div class="rm-content" style="display:flex;flex-direction:column;padding:8px 14px;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:auto;">' +
          '<div style="display:flex;align-items:center;gap:4px;">' +
            '<div style="width:10px;height:10px;border-radius:50%;background:linear-gradient(135deg,#8B5CF6,#06B6D4);font-size:5px;font-weight:900;color:#fff;display:flex;align-items:center;justify-content:center;">D</div>' +
            '<span style="font-weight:700;font-size:7px;font-family:system-ui;">DigiForm Pro</span>' +
          '</div>' +
          '<div style="background:rgba(139,92,246,.12);border:1px solid rgba(139,92,246,.25);border-radius:10px;padding:2px 6px;font-size:5px;color:#A78BFA;">Beta 2.0</div>' +
        '</div>' +
        '<div style="margin-top:auto;padding-bottom:4px;">' +
          '<div style="font-size:5px;color:#06B6D4;margin-bottom:4px;">&gt; next_gen_learning --mode=adaptive</div>' +
          '<div style="font-size:14px;font-weight:700;font-family:system-ui;line-height:1.1;margin-bottom:5px;">L\'IA qui adapte<br>votre formation</div>' +
          '<div style="font-size:5.5px;color:rgba(255,255,255,.5);font-family:system-ui;margin-bottom:8px;">Parcours personnalisés · SCORM · xAPI · Analytics</div>' +
          '<div style="display:flex;gap:6px;align-items:center;">' +
            '<div style="background:linear-gradient(135deg,#8B5CF6,#06B6D4);padding:4px 12px;border-radius:4px;font-size:5.5px;font-weight:600;font-family:system-ui;">Démo gratuite</div>' +
            '<div style="display:flex;align-items:center;gap:3px;font-size:5px;color:rgba(255,255,255,.4);font-family:system-ui;">' +
              '<div style="width:5px;height:5px;border-radius:50%;background:#10B981;"></div>347 organismes' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
}

function mock3(img) {
  const cards = [{t:'SST',d:'2j'},{t:'SSIAP 1',d:'10j'},{t:'H.Élec',d:'3j'}].map(f =>
    '<div style="flex:1;background:rgba(255,255,255,.1);backdrop-filter:blur(8px);border-radius:5px;padding:5px;text-align:center;border:1px solid rgba(255,255,255,.1);">' +
      '<div style="font-size:7px;font-weight:700;">' + f.t + '</div>' +
      '<div style="font-size:5px;color:rgba(255,255,255,.5);">' + f.d + '</div>' +
    '</div>'
  ).join('');
  return '' +
    '<div class="rm" style="font-family:system-ui,sans-serif;color:#fff;background:#1a1a1a;">' +
      cover(img) +
      overlay('linear-gradient(0deg,rgba(0,0,0,.85) 0%,rgba(0,0,0,.15) 50%,rgba(196,53,53,.25) 100%)') +
      '<div class="rm-content" style="display:flex;flex-direction:column;padding:8px 12px;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;">' +
          '<div style="display:flex;align-items:center;gap:4px;">' +
            '<div style="width:10px;height:10px;border-radius:2px;background:#C43535;display:flex;align-items:center;justify-content:center;">' +
              '<svg width="6" height="6" viewBox="0 0 24 24" fill="white"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' +
            '</div>' +
            '<span style="font-weight:700;font-size:7px;">Sécuri\'Form</span>' +
          '</div>' +
          '<div style="background:#C43535;padding:2px 8px;border-radius:3px;font-size:5px;font-weight:700;">3 places SST</div>' +
        '</div>' +
        '<div style="margin-top:auto;">' +
          '<div style="font-size:14px;font-weight:700;line-height:1.1;margin-bottom:4px;">Formez vos équipes<br>à la sécurité</div>' +
          '<div style="font-size:5.5px;color:rgba(255,255,255,.6);margin-bottom:8px;">SST · SSIAP · Habilitations · Incendie · Prévention</div>' +
          '<div style="display:flex;gap:4px;">' + cards + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
}

function mock4(img) {
  return '' +
    '<div class="rm" style="font-family:Georgia,serif;background:#FDFAF7;">' +
      '<div style="height:55%;position:relative;overflow:hidden;">' +
        cover(img) +
        '<div style="position:absolute;bottom:0;left:0;right:0;height:50%;background:linear-gradient(transparent,#FDFAF7);z-index:1;"></div>' +
      '</div>' +
      '<div style="padding:0 14px;position:relative;z-index:2;margin-top:-16px;">' +
        '<div style="font-size:5px;font-weight:600;color:#0A8F6C;text-transform:uppercase;letter-spacing:.15em;margin-bottom:3px;font-family:system-ui;">Apprendre autrement</div>' +
        '<div style="font-size:13px;font-weight:700;line-height:1.15;font-style:italic;margin-bottom:4px;">Les langues ouvrent<br>des mondes</div>' +
        '<div style="font-size:5.5px;color:#888;font-family:system-ui;line-height:1.5;">Immersion · Conversation · CECRL A1→C2 · Éligible CPF</div>' +
      '</div>' +
    '</div>';
}

function mock5(img) {
  const tabs = ['Catalogue','CACES','Simulateur'].map(t =>
    '<span style="font-size:5px;color:rgba(255,255,255,.6);">' + t + '</span>'
  ).join('');
  return '' +
    '<div class="rm" style="font-family:system-ui,sans-serif;color:#fff;background:#1a1a1a;">' +
      cover(img) +
      overlay('linear-gradient(135deg,rgba(212,130,10,.65) 0%,rgba(26,26,26,.9) 55%)') +
      '<div class="rm-content" style="display:flex;flex-direction:column;padding:8px 14px;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;">' +
          '<span style="font-weight:800;font-size:8px;letter-spacing:-.02em;">BTP<span style="color:#F5A623;"> Compétences</span></span>' +
          '<div style="display:flex;gap:5px;">' + tabs + '</div>' +
        '</div>' +
        '<div style="margin-top:auto;padding-bottom:4px;">' +
          '<div style="font-size:32px;font-weight:900;line-height:.85;letter-spacing:-.04em;margin-bottom:2px;">156</div>' +
          '<div style="font-size:10px;font-weight:700;line-height:1.2;margin-bottom:4px;">formations BTP<br>certifiantes</div>' +
          '<div style="font-size:5.5px;color:rgba(255,255,255,.5);margin-bottom:8px;">CACES · Habilitations · Sécurité chantier · Chef de chantier</div>' +
          '<div style="display:flex;gap:4px;align-items:center;">' +
            '<div style="background:#F5A623;color:#1a1a1a;padding:4px 10px;border-radius:4px;font-size:5.5px;font-weight:700;">Simulateur OPCO</div>' +
            '<div style="font-size:5px;color:rgba(255,255,255,.4);">Calculez votre prise en charge</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
}

function mock6(img) {
  const stats = [{n:'850+',l:'médecins',c:'#2563EB'},{n:'94%',l:'satisfaits',c:'#10B981'},{n:'21h',l:'DPC/an',c:'#888'}].map(s =>
    '<div style="flex:1;background:#EFF6FF;border-radius:4px;padding:5px 4px;text-align:center;">' +
      '<div style="font-size:9px;font-weight:700;color:' + s.c + ';">' + s.n + '</div>' +
      '<div style="font-size:4.5px;color:#64748B;">' + s.l + '</div>' +
    '</div>'
  ).join('');
  return '' +
    '<div class="rm" style="font-family:system-ui,sans-serif;display:flex;background:#fff;">' +
      '<div style="width:45%;position:relative;overflow:hidden;">' + cover(img) + '</div>' +
      '<div style="flex:1;padding:12px 14px;display:flex;flex-direction:column;justify-content:center;">' +
        '<div style="display:flex;align-items:center;gap:4px;margin-bottom:6px;">' +
          '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="3"><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>' +
          '<span style="font-weight:700;font-size:8px;color:#2563EB;">MedLearn</span>' +
        '</div>' +
        '<div style="font-size:5px;font-weight:600;color:#2563EB;text-transform:uppercase;letter-spacing:.08em;margin-bottom:3px;">Formation continue DPC</div>' +
        '<div style="font-size:12px;font-weight:700;line-height:1.15;color:#0F172A;margin-bottom:6px;">Formez-vous<br>en ligne</div>' +
        '<div style="display:flex;gap:3px;margin-bottom:6px;">' + stats + '</div>' +
        '<div style="background:#2563EB;color:#fff;padding:4px 10px;border-radius:4px;font-size:5.5px;font-weight:600;text-align:center;">Accéder au catalogue DPC</div>' +
      '</div>' +
    '</div>';
}

function mock7(img) {
  const certs = ['ISO 27001','OSCP','SOC Analyst'].map(t =>
    '<div style="background:rgba(34,211,238,.1);border:1px solid rgba(34,211,238,.3);border-radius:3px;padding:3px 6px;font-size:5px;color:#22D3EE;font-family:system-ui;">' + t + '</div>'
  ).join('');
  return '' +
    '<div class="rm" style="font-family:ui-monospace,monospace;color:#E2E8F0;background:#0B0E14;">' +
      cover(img, 0.5) +
      overlay('linear-gradient(180deg,rgba(11,14,20,.2) 0%,rgba(11,14,20,.95) 65%)') +
      '<div class="rm-content" style="display:flex;flex-direction:column;padding:8px 12px;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;">' +
          '<div style="display:flex;align-items:center;gap:4px;">' +
            '<span style="color:#22D3EE;font-size:8px;">&gt;</span>' +
            '<span style="font-weight:700;font-size:7px;font-family:system-ui;">CyberForm Institute</span>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:3px;">' +
            '<div style="width:5px;height:5px;border-radius:50%;background:#22D3EE;"></div>' +
            '<span style="font-size:5px;color:#22D3EE;">Live CTF</span>' +
          '</div>' +
        '</div>' +
        '<div style="margin-top:auto;padding-bottom:4px;">' +
          '<div style="font-size:5px;color:#22D3EE;margin-bottom:3px;">root@cyberform:~$ ./start_training.sh</div>' +
          '<div style="font-size:14px;font-weight:700;font-family:system-ui;line-height:1.1;margin-bottom:6px;">Devenez expert en<br>cybersécurité</div>' +
          '<div style="display:flex;gap:3px;">' + certs + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
}

function mock8(img) {
  const tabs = ['CAP','Ateliers',"L'école"].map(t =>
    '<span style="font-size:5px;color:rgba(255,255,255,.6);font-family:system-ui;">' + t + '</span>'
  ).join('');
  return '' +
    '<div class="rm" style="font-family:Georgia,\'Times New Roman\',serif;color:#fff;background:#1a1a1a;">' +
      cover(img) +
      overlay('linear-gradient(0deg,rgba(0,0,0,.8) 0%,rgba(0,0,0,.05) 45%,rgba(124,45,18,.15) 100%)') +
      '<div class="rm-content" style="display:flex;flex-direction:column;padding:10px 14px;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;">' +
          '<span style="font-weight:400;font-size:9px;font-style:italic;color:#FBBF24;">Culinaire Pro</span>' +
          '<div style="display:flex;gap:5px;">' + tabs + '</div>' +
        '</div>' +
        '<div style="margin-top:auto;">' +
          '<div style="font-size:5px;letter-spacing:.2em;text-transform:uppercase;color:#FBBF24;margin-bottom:4px;font-family:system-ui;font-weight:600;">École professionnelle</div>' +
          '<div style="font-size:16px;font-weight:400;font-style:italic;line-height:1.1;margin-bottom:5px;">L\'art culinaire,<br>votre passion,<br>votre métier</div>' +
          '<div style="width:30px;height:1px;background:#FBBF24;margin-bottom:5px;"></div>' +
          '<div style="font-size:5.5px;color:rgba(255,255,255,.5);font-family:system-ui;">CAP Cuisine · CAP Pâtisserie · Reconversion · RNCP</div>' +
        '</div>' +
      '</div>' +
    '</div>';
}

const SITES = [
  { build: mock1, img: IMG.excellence, name:'Formation Excellence', type:'Site vitrine',    url:'formation-excellence.fr', color:'#1B4D8C', desc:'Management et leadership certifiant',  tags:['Qualiopi','CPF','OPCO'] },
  { build: mock2, img: IMG.digiform,   name:'DigiForm Pro',         type:'Plateforme LMS',   url:'digiform-pro.com',       color:'#8B5CF6', desc:"E-learning adaptatif propulsé par l'IA", tags:['LMS','IA','SCORM'] },
  { build: mock3, img: IMG.securiform, name:"Sécuri'Form",          type:'Site + Booking',   url:'securiform.fr',          color:'#C43535', desc:'Centre SST, SSIAP et habilitations',     tags:['SST','SSIAP','Planning'] },
  { build: mock4, img: IMG.lingua,     name:'Lingua Academy',       type:'Site éditorial',   url:'lingua-academy.io',      color:'#0A8F6C', desc:'École de langues immersive',             tags:['CECRL','CPF','Immersion'] },
  { build: mock5, img: IMG.btp,        name:'BTP Compétences',      type:'Portail formation',url:'btp-competences.fr',     color:'#D4820A', desc:'Catalogue BTP avec simulateur OPCO',     tags:['OPCO','CACES','Sécurité'] },
  { build: mock6, img: IMG.medlearn,   name:'MedLearn',             type:'LMS Santé',        url:'medlearn.fr',            color:'#2563EB', desc:'DPC et formation continue santé',        tags:['DPC','Santé','En ligne'] },
  { build: mock7, img: IMG.cyber,      name:'CyberForm Institute',  type:'Site + Labs',      url:'cyberform-institute.com',color:'#22D3EE', desc:'Cybersécurité et certifications ISO',    tags:['ISO','OSCP','CTF'] },
  { build: mock8, img: IMG.culinaire,  name:'Culinaire Pro',        type:'Site premium',     url:'culinaire-pro.fr',       color:'#FBBF24', desc:'École de cuisine professionnelle',       tags:['CAP','RNCP','HACCP'] },
];

function escAttr(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

function renderCarousel() {
  const track = document.getElementById('refTrack');
  if (!track) return;
  // Render the 8 sites twice for the seamless scroll loop
  const all = SITES.concat(SITES);
  const html = all.map(s => {
    const tags = s.tags.map(t => '<span class="ref-tag">' + escAttr(t) + '</span>').join('');
    return '' +
      '<div class="ref-card">' +
        '<div class="ref-chrome">' +
          '<div class="ref-dots">' +
            '<div class="ref-dot" style="background:#FF5F57;"></div>' +
            '<div class="ref-dot" style="background:#FEBC2E;"></div>' +
            '<div class="ref-dot" style="background:#28C840;"></div>' +
          '</div>' +
          '<div class="ref-url">' +
            '<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' +
            escAttr(s.url) +
          '</div>' +
        '</div>' +
        '<div class="ref-mock">' + s.build(s.img) + '</div>' +
        '<div class="ref-info">' +
          '<div class="ref-info-top">' +
            '<span class="ref-type" style="color:' + s.color + ';">' + escAttr(s.type) + '</span>' +
            '<div class="ref-live"></div>' +
          '</div>' +
          '<h3 class="ref-name">' + escAttr(s.name) + '</h3>' +
          '<p class="ref-desc">' + escAttr(s.desc) + '</p>' +
          '<div class="ref-info-bot">' +
            '<div class="ref-tags">' + tags + '</div>' +
            '<div class="ref-link" style="background:' + s.color + '20;">' +
              '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="' + s.color + '" stroke-width="2">' +
                '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>' +
                '<polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>' +
              '</svg>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }).join('');
  track.innerHTML = html;

  // Seamless auto-scroll loop, paused on hover or touch
  let paused = false;
  let touchActive = false;
  track.addEventListener('mouseenter', () => { paused = true; });
  track.addEventListener('mouseleave', () => { paused = false; });
  track.addEventListener('touchstart', () => { touchActive = true; paused = true; }, { passive: true });
  track.addEventListener('touchend',   () => { touchActive = false; paused = false; });

  function loop() {
    if (!paused) {
      track.scrollLeft += 0.5;
      if (track.scrollLeft >= track.scrollWidth / 2) track.scrollLeft = 0;
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderCarousel);
} else {
  renderCarousel();
}
