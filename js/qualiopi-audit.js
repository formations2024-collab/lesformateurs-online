/* ============================================================
   qualiopi-audit.js
   Planification audit Qualiopi — LesFormateurs.online
   Vanilla JS — aucune dependance externe
   ============================================================ */

(function () {
  "use strict";

  var ORANGE = "#D85A30";
  var ORANGE_DARK = "#B8421C";
  var ORANGE_LIGHT = "#FFF8F3";
  var ORANGE_SOFT = "#FFEDE3";
  var BORDER = "#D1D5DB";
  var TEXT = "#1a1a1a";
  var TEXT_MUTED = "#6B7280";
  var GREEN = "#10B981";
  var RED = "#EF4444";
  var WHITE = "#FFFFFF";

  // ── CERTIFICATEURS DATA ──────────────────────────────────

  var CERTIFICATEURS = [
    {id:"ab",nom:"AB Certification",ville:"Paris",rep:3,prix:2},
    {id:"activcert",nom:"Activcert",ville:"France",rep:3,prix:2},
    {id:"afnor",nom:"AFNOR Certification",ville:"Saint-Denis",rep:5,prix:4},
    {id:"alpha",nom:"Alpha Certif 12",ville:"Goussainville",rep:3,prix:1},
    {id:"alticert",nom:"Alticert",ville:"France",rep:3,prix:2},
    {id:"ani",nom:"ANI Certifications",ville:"France",rep:3,prix:2},
    {id:"apave",nom:"Apave Certification",ville:"Paris",rep:4,prix:3},
    {id:"atalia",nom:"Atalia Certification",ville:"Vern-sur-Seiche",rep:3,prix:2},
    {id:"bcs",nom:"BCS Certification",ville:"Nice",rep:3,prix:2},
    {id:"bci",nom:"Bureau de Certification International France",ville:"Paris",rep:3,prix:2},
    {id:"bv",nom:"Bureau Veritas Certification",ville:"Puteaux",rep:5,prix:4},
    {id:"capcert",nom:"Capcert",ville:"France",rep:3,prix:2},
    {id:"ccta",nom:"CCTA Certification",ville:"France",rep:3,prix:2},
    {id:"certifopac",nom:"Certifopac",ville:"Paris",rep:5,prix:2},
    {id:"certikontrol",nom:"Certi. Kontrol",ville:"France",rep:3,prix:1},
    {id:"certup",nom:"CertUp Maieutika",ville:"France",rep:3,prix:2},
    {id:"ceva",nom:"Ceva Solution",ville:"France",rep:3,prix:2},
    {id:"cidees",nom:"Cidees Certification",ville:"France",rep:3,prix:2},
    {id:"dekra",nom:"DEKRA Certification",ville:"Limonest",rep:4,prix:3},
    {id:"evolve",nom:"Evolve",ville:"France",rep:3,prix:2},
    {id:"global",nom:"Global Certification",ville:"France",rep:3,prix:2},
    {id:"gqc",nom:"GQC-Global Quality Cert",ville:"France",rep:3,prix:2},
    {id:"hofi",nom:"HOFI Cert",ville:"France",rep:3,prix:2},
    {id:"icert",nom:"I.Cert",ville:"France",rep:3,prix:2},
    {id:"icpf",nom:"ICPF & PSI",ville:"Paris",rep:5,prix:3},
    {id:"isq",nom:"ISQ",ville:"France",rep:4,prix:3},
    {id:"lqs",nom:"Label Qualite Systeme",ville:"France",rep:3,prix:2},
    {id:"lrqa",nom:"LRQA France SAS",ville:"Paris",rep:4,prix:4},
    {id:"ogs",nom:"OGS Certification",ville:"France",rep:3,prix:2},
    {id:"proneo",nom:"Proneo Certification",ville:"France",rep:4,prix:2},
    {id:"qoanix",nom:"QOANIX",ville:"France",rep:3,prix:1},
    {id:"qualianor",nom:"Qualianor Certification",ville:"Rouen",rep:4,prix:2},
    {id:"qualibat",nom:"Qualibat",ville:"Paris",rep:4,prix:3},
    {id:"qualinow",nom:"Qualinow",ville:"France",rep:3,prix:1},
    {id:"qualitia",nom:"Qualitia Certification",ville:"France",rep:4,prix:2},
    {id:"sgs",nom:"SGS ICS",ville:"Arcueil",rep:4,prix:4},
    {id:"socotec",nom:"Socotec Certification",ville:"Guyancourt",rep:4,prix:3},
    {id:"wecert",nom:"WECERT - Qualit Competences",ville:"France",rep:3,prix:2}
  ];

  // ── ACTION MAP ───────────────────────────────────────────

  var ACTION_MAP = {
    "Action de formation": { code: "AF",  jours: 1 },
    "Apprentissage":       { code: "CFA", jours: 1.5 },
    "VAE":                 { code: "VAE", jours: 0.5 },
    "Bilan de comp\u00e9tences": { code: "CBC", jours: 0.5 }
  };

  // priority order for "longest base"
  var PRIORITY = ["CFA", "AF", "VAE", "CBC"];

  // ── LOCAL STATE ──────────────────────────────────────────

  var local = {
    selectedDate: null,
    selectedCerts: [],   // array of cert ids, max 3
    referentChecked: false,
    sortMode: "rep",     // "rep", "prix", "az"
    calYear: null,
    calMonth: null
  };

  // ── HELPERS ──────────────────────────────────────────────

  function el(tag, styles, attrs) {
    var node = document.createElement(tag);
    if (styles) Object.assign(node.style, styles);
    if (attrs) {
      for (var k in attrs) {
        if (k === "textContent") node.textContent = attrs[k];
        else if (k === "innerHTML") node.innerHTML = attrs[k];
        else node.setAttribute(k, attrs[k]);
      }
    }
    return node;
  }

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function sectionCard() {
    return el("div", {
      background: WHITE,
      border: "1.5px dashed " + BORDER,
      borderRadius: "12px",
      padding: "24px",
      marginBottom: "16px"
    });
  }

  function sectionHeader(letter, color, title, subtitle) {
    var wrap = el("div", { display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "18px" });
    var circle = el("div", {
      width: "32px", height: "32px", borderRadius: "50%", background: color,
      color: WHITE, display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: "700", fontSize: "14px", flexShrink: "0", fontFamily: "'DM Sans',sans-serif"
    }, { textContent: letter });
    var textWrap = el("div", {});
    var h = el("h3", { fontSize: "16px", fontWeight: "700", color: TEXT, margin: "0", fontFamily: "'DM Sans',sans-serif" }, { textContent: title });
    var p = el("p", { fontSize: "13px", color: TEXT_MUTED, marginTop: "2px", fontFamily: "'DM Sans',sans-serif" }, { textContent: subtitle });
    textWrap.appendChild(h);
    textWrap.appendChild(p);
    wrap.appendChild(circle);
    wrap.appendChild(textWrap);
    return wrap;
  }

  function chip(text, removable, onRemove) {
    var c = el("span", {
      display: "inline-flex", alignItems: "center", gap: "6px",
      padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
      background: ORANGE_SOFT, color: ORANGE_DARK, fontFamily: "'DM Sans',sans-serif"
    }, { textContent: text });
    if (removable && onRemove) {
      var x = el("span", { cursor: "pointer", fontWeight: "700", fontSize: "14px", lineHeight: "1" }, { textContent: "\u00d7" });
      x.addEventListener("click", function (e) { e.stopPropagation(); onRemove(); });
      c.appendChild(x);
    }
    return c;
  }

  // ── DURATION CALC ────────────────────────────────────────

  function getSelectedActions() {
    var types = (window.STATE && STATE.msValues && STATE.msValues.type_qualiopi) || [];
    var actions = [];
    for (var i = 0; i < types.length; i++) {
      if (ACTION_MAP[types[i]]) {
        actions.push({ label: types[i], code: ACTION_MAP[types[i]].code, jours: ACTION_MAP[types[i]].jours });
      }
    }
    return actions;
  }

  function calcDuration(actions) {
    if (actions.length === 0) return 0;
    // find the one with highest priority (longest base)
    var sorted = actions.slice().sort(function (a, b) {
      return PRIORITY.indexOf(a.code) - PRIORITY.indexOf(b.code);
    });
    var base = sorted[0].jours;
    var additional = actions.length - 1;
    return base + additional * 0.5;
  }

  // ── DATE HELPERS ─────────────────────────────────────────

  function today() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function addDays(d, n) {
    var r = new Date(d);
    r.setDate(r.getDate() + n);
    return r;
  }

  function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function isPast(d) {
    return d < today();
  }

  function isWeekend(d) {
    return d.getDay() === 0 || d.getDay() === 6;
  }

  function isExpress(d) {
    return d < addDays(today(), 14) && !isPast(d);
  }

  function formatDateFr(d) {
    var jours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    var mois = ["janvier", "f\u00e9vrier", "mars", "avril", "mai", "juin", "juillet", "ao\u00fbt", "septembre", "octobre", "novembre", "d\u00e9cembre"];
    return jours[d.getDay()] + " " + d.getDate() + " " + mois[d.getMonth()] + " " + d.getFullYear();
  }

  var MOIS_NOMS = ["Janvier", "F\u00e9vrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Ao\u00fbt", "Septembre", "Octobre", "Novembre", "D\u00e9cembre"];

  // ── STARS / PRICE DISPLAY ────────────────────────────────

  function starsHtml(n, max) {
    var s = "";
    for (var i = 0; i < max; i++) {
      s += i < n ? '<span style="color:#F59E0B;">\u2605</span>' : '<span style="color:#E5E7EB;">\u2605</span>';
    }
    return s;
  }

  function priceSymbol(n) {
    var s = "";
    for (var i = 0; i < n; i++) s += "\u20ac";
    return s;
  }

  // ── RENDER HOST REF ──────────────────────────────────────

  var _host = null;

  // ── RENDER ALL ───────────────────────────────────────────

  function render() {
    if (!_host) return;
    _host.innerHTML = "";

    _host.appendChild(renderSectionA());
    _host.appendChild(renderSectionB());
    _host.appendChild(renderSectionC());
    _host.appendChild(renderSectionD());
    _host.appendChild(renderSectionE());
  }

  // ── A. ACTIONS A CERTIFIER ───────────────────────────────

  function renderSectionA() {
    var card = sectionCard();
    card.appendChild(sectionHeader("A", "#3B82F6", "Actions \u00e0 certifier", "Types d\u2019actions s\u00e9lectionn\u00e9s dans la configuration"));

    var actions = getSelectedActions();
    if (actions.length === 0) {
      var empty = el("p", { fontSize: "13px", color: TEXT_MUTED, fontStyle: "italic", fontFamily: "'DM Sans',sans-serif" },
        { textContent: "Aucune action s\u00e9lectionn\u00e9e. Retournez \u00e0 l\u2019\u00e9tape Configuration pour choisir vos actions." });
      card.appendChild(empty);
      return card;
    }

    var chipsWrap = el("div", { display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" });
    for (var i = 0; i < actions.length; i++) {
      var c = chip(actions[i].code + " \u2014 " + actions[i].label);
      chipsWrap.appendChild(c);
    }
    card.appendChild(chipsWrap);

    var duration = calcDuration(actions);
    var durBox = el("div", {
      background: ORANGE_LIGHT, border: "1px solid " + ORANGE_SOFT, borderRadius: "10px",
      padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px"
    });
    var durLeft = el("div", {});
    var durLabel = el("div", { fontSize: "12px", color: TEXT_MUTED, fontWeight: "500", fontFamily: "'DM Sans',sans-serif" }, { textContent: "Dur\u00e9e de l\u2019audit" });
    var durVal = el("div", { fontSize: "28px", fontWeight: "800", color: ORANGE, fontFamily: "'DM Sans',sans-serif" },
      { textContent: duration + (duration > 1 ? " jours" : " jour") });
    durLeft.appendChild(durLabel);
    durLeft.appendChild(durVal);
    durBox.appendChild(durLeft);

    // type audit
    var auditType = (window.STATE && STATE.radioValues && STATE.radioValues.type_audit) || "Non d\u00e9fini";
    var typeBadge = el("span", {
      display: "inline-block", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
      background: "#EFF6FF", color: "#1E40AF", fontFamily: "'DM Sans',sans-serif"
    }, { textContent: "Audit " + auditType });
    durBox.appendChild(typeBadge);

    card.appendChild(durBox);
    return card;
  }

  // ── B. CALENDRIER ────────────────────────────────────────

  function renderSectionB() {
    var card = sectionCard();
    card.appendChild(sectionHeader("B", GREEN, "Calendrier / Date de l\u2019audit", "S\u00e9lectionnez la date souhait\u00e9e pour votre audit"));

    // init cal month
    if (local.calYear === null) {
      var t = today();
      local.calYear = t.getFullYear();
      local.calMonth = t.getMonth();
    }

    // nav
    var nav = el("div", { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" });
    var btnPrev = el("button", {
      border: "1px solid " + BORDER, background: WHITE, borderRadius: "8px", padding: "8px 14px",
      cursor: "pointer", fontSize: "14px", fontWeight: "600", fontFamily: "'DM Sans',sans-serif", color: TEXT
    }, { textContent: "\u2190" });
    btnPrev.addEventListener("click", function () {
      local.calMonth--;
      if (local.calMonth < 0) { local.calMonth = 11; local.calYear--; }
      render();
    });
    var btnNext = el("button", {
      border: "1px solid " + BORDER, background: WHITE, borderRadius: "8px", padding: "8px 14px",
      cursor: "pointer", fontSize: "14px", fontWeight: "600", fontFamily: "'DM Sans',sans-serif", color: TEXT
    }, { textContent: "\u2192" });
    btnNext.addEventListener("click", function () {
      local.calMonth++;
      if (local.calMonth > 11) { local.calMonth = 0; local.calYear++; }
      render();
    });
    var monthLabel = el("span", { fontSize: "16px", fontWeight: "700", fontFamily: "'DM Sans',sans-serif", color: TEXT },
      { textContent: MOIS_NOMS[local.calMonth] + " " + local.calYear });
    nav.appendChild(btnPrev);
    nav.appendChild(monthLabel);
    nav.appendChild(btnNext);
    card.appendChild(nav);

    // calendar grid
    var grid = el("div", {
      display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "16px"
    });

    // headers
    var dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    for (var h = 0; h < 7; h++) {
      var hdr = el("div", {
        textAlign: "center", fontSize: "11px", fontWeight: "700", color: TEXT_MUTED, padding: "6px 0",
        fontFamily: "'DM Sans',sans-serif"
      }, { textContent: dayNames[h] });
      grid.appendChild(hdr);
    }

    // first day of month
    var first = new Date(local.calYear, local.calMonth, 1);
    var startDay = first.getDay(); // 0=dim
    var daysInMonth = new Date(local.calYear, local.calMonth + 1, 0).getDate();

    // empty cells before first
    for (var e = 0; e < startDay; e++) {
      grid.appendChild(el("div", {}));
    }

    var twoWeeks = addDays(today(), 14);

    for (var d = 1; d <= daysInMonth; d++) {
      var date = new Date(local.calYear, local.calMonth, d);
      var cell = el("div", {
        textAlign: "center", padding: "10px 4px", borderRadius: "8px", fontSize: "13px",
        fontWeight: "500", fontFamily: "'DM Sans',sans-serif", cursor: "pointer",
        transition: "all .12s", minHeight: "38px", display: "flex", alignItems: "center", justifyContent: "center"
      }, { textContent: String(d) });

      var past = isPast(date);
      var weekend = isWeekend(date);
      var selected = local.selectedDate && sameDay(local.selectedDate, date);
      var express = isExpress(date) && !past && !weekend;
      var reduced = !past && !weekend && date >= twoWeeks;

      if (selected) {
        cell.style.background = ORANGE;
        cell.style.color = WHITE;
        cell.style.fontWeight = "700";
        cell.style.cursor = "pointer";
      } else if (past || weekend) {
        cell.style.background = "#F3F4F6";
        cell.style.color = "#C0C0C0";
        cell.style.cursor = "default";
      } else if (express) {
        cell.style.background = "#FEE2E2";
        cell.style.color = RED;
        cell.style.fontWeight = "600";
      } else if (reduced) {
        cell.style.background = "#D1FAE5";
        cell.style.color = "#065F46";
        cell.style.fontWeight = "600";
      }

      if (!past && !weekend) {
        (function (dd) {
          cell.addEventListener("click", function () {
            local.selectedDate = dd;
            render();
          });
          cell.addEventListener("mouseenter", function () {
            if (!local.selectedDate || !sameDay(local.selectedDate, dd)) {
              cell.style.boxShadow = "inset 0 0 0 2px " + ORANGE;
            }
          });
          cell.addEventListener("mouseleave", function () {
            if (!local.selectedDate || !sameDay(local.selectedDate, dd)) {
              cell.style.boxShadow = "none";
            }
          });
        })(date);
      }

      grid.appendChild(cell);
    }

    card.appendChild(grid);

    // legend
    var legend = el("div", { display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "14px" });
    var items = [
      { color: "#FEE2E2", border: RED, label: "Express (+550\u20ac)" },
      { color: "#D1FAE5", border: "#065F46", label: "Tarif r\u00e9duit (-550\u20ac)" },
      { color: "#F3F4F6", border: "#C0C0C0", label: "Indisponible" }
    ];
    for (var li = 0; li < items.length; li++) {
      var lw = el("div", { display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: TEXT_MUTED, fontFamily: "'DM Sans',sans-serif" });
      var dot = el("span", { width: "12px", height: "12px", borderRadius: "3px", background: items[li].color, border: "1px solid " + items[li].border, display: "inline-block" });
      lw.appendChild(dot);
      lw.appendChild(document.createTextNode(items[li].label));
      legend.appendChild(lw);
    }
    card.appendChild(legend);

    // summary if date selected
    if (local.selectedDate) {
      var expr = isExpress(local.selectedDate);
      var summBox = el("div", {
        padding: "14px", borderRadius: "10px", fontSize: "13px", fontFamily: "'DM Sans',sans-serif",
        background: expr ? "#FEF2F2" : "#ECFDF5",
        border: "1px solid " + (expr ? "#FECACA" : "#A7F3D0"),
        color: expr ? "#991B1B" : "#065F46"
      });
      var actions = getSelectedActions();
      var dur = calcDuration(actions);
      summBox.innerHTML =
        "<b>" + esc(formatDateFr(local.selectedDate)) + "</b><br>" +
        "Dur\u00e9e : " + dur + (dur > 1 ? " jours" : " jour") + "<br>" +
        (expr
          ? '<span style="font-weight:700;color:' + RED + ';">Express : +550\u20ac</span>'
          : '<span style="font-weight:700;color:' + GREEN + ';">Tarif r\u00e9duit : -550\u20ac</span>');
      card.appendChild(summBox);
    }

    return card;
  }

  // ── C. CERTIFICATEURS ────────────────────────────────────

  function getSortedCerts() {
    var list = CERTIFICATEURS.slice();
    if (local.sortMode === "rep") {
      list.sort(function (a, b) { return b.rep - a.rep || a.nom.localeCompare(b.nom); });
    } else if (local.sortMode === "prix") {
      list.sort(function (a, b) { return a.prix - b.prix || a.nom.localeCompare(b.nom); });
    } else {
      list.sort(function (a, b) { return a.nom.localeCompare(b.nom); });
    }
    return list;
  }

  function renderSectionC() {
    var card = sectionCard();
    card.appendChild(sectionHeader("C", "#8B5CF6", "Choix des certificateurs", "S\u00e9lectionnez jusqu\u2019\u00e0 3 organismes certificateurs"));

    // selected chips
    if (local.selectedCerts.length > 0) {
      var chipsWrap = el("div", { display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" });
      for (var sc = 0; sc < local.selectedCerts.length; sc++) {
        var cert = findCert(local.selectedCerts[sc]);
        if (!cert) continue;
        (function (cid, idx) {
          var c = chip((idx + 1) + ". " + cert.nom, true, function () {
            local.selectedCerts = local.selectedCerts.filter(function (x) { return x !== cid; });
            render();
          });
          chipsWrap.appendChild(c);
        })(local.selectedCerts[sc], sc);
      }
      card.appendChild(chipsWrap);
    }

    // sort buttons
    var sortWrap = el("div", { display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" });
    var sorts = [
      { key: "rep", label: "Meilleure r\u00e9putation" },
      { key: "prix", label: "Moins cher" },
      { key: "az", label: "A\u2192Z" }
    ];
    for (var si = 0; si < sorts.length; si++) {
      (function (s) {
        var active = local.sortMode === s.key;
        var btn = el("button", {
          padding: "7px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
          border: active ? "1.5px solid " + ORANGE : "1px solid " + BORDER,
          background: active ? ORANGE_LIGHT : WHITE,
          color: active ? ORANGE : TEXT_MUTED,
          cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .12s"
        }, { textContent: s.label });
        btn.addEventListener("click", function () {
          local.sortMode = s.key;
          render();
        });
        sortWrap.appendChild(btn);
      })(sorts[si]);
    }
    card.appendChild(sortWrap);

    // scrollable list
    var list = el("div", {
      maxHeight: "400px", overflowY: "auto", border: "1px solid " + BORDER, borderRadius: "10px"
    });

    var certs = getSortedCerts();
    for (var ci = 0; ci < certs.length; ci++) {
      (function (cert) {
        var selIdx = local.selectedCerts.indexOf(cert.id);
        var isSelected = selIdx >= 0;

        var row = el("div", {
          display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px",
          borderBottom: "1px solid #F3F4F6", cursor: "pointer", transition: "all .12s",
          background: isSelected ? ORANGE_LIGHT : WHITE, fontFamily: "'DM Sans',sans-serif"
        });

        row.addEventListener("mouseenter", function () {
          if (!isSelected) row.style.background = "#FAFAFA";
        });
        row.addEventListener("mouseleave", function () {
          if (!isSelected) row.style.background = WHITE;
        });

        row.addEventListener("click", function () {
          if (isSelected) {
            local.selectedCerts = local.selectedCerts.filter(function (x) { return x !== cert.id; });
          } else {
            if (local.selectedCerts.length >= 3) return;
            local.selectedCerts.push(cert.id);
          }
          render();
        });

        // number circle or empty
        if (isSelected) {
          var numCircle = el("div", {
            width: "26px", height: "26px", borderRadius: "50%", background: ORANGE, color: WHITE,
            display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700",
            fontSize: "12px", flexShrink: "0"
          }, { textContent: String(selIdx + 1) });
          row.appendChild(numCircle);
        } else {
          var emptyCircle = el("div", {
            width: "26px", height: "26px", borderRadius: "50%", border: "2px solid " + BORDER,
            flexShrink: "0", background: WHITE
          });
          row.appendChild(emptyCircle);
        }

        // info
        var info = el("div", { flex: "1", minWidth: "0" });
        var nameEl = el("div", {
          fontSize: "14px", fontWeight: "600", color: isSelected ? ORANGE : TEXT,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
        }, { textContent: cert.nom });
        var villeEl = el("div", { fontSize: "11px", color: TEXT_MUTED, marginTop: "2px" }, { textContent: cert.ville });
        info.appendChild(nameEl);
        info.appendChild(villeEl);
        row.appendChild(info);

        // reputation
        var repWrap = el("div", { textAlign: "center", flexShrink: "0" });
        var starsEl = el("div", { fontSize: "13px", letterSpacing: "1px" });
        starsEl.innerHTML = starsHtml(cert.rep, 5);
        var repLabel = el("div", { fontSize: "10px", color: TEXT_MUTED, marginTop: "2px" }, { textContent: "R\u00e9putation" });
        repWrap.appendChild(starsEl);
        repWrap.appendChild(repLabel);
        row.appendChild(repWrap);

        // price
        var prixEl = el("div", {
          fontSize: "16px", fontWeight: "700", color: cert.prix <= 2 ? GREEN : (cert.prix >= 4 ? RED : "#F59E0B"),
          flexShrink: "0", minWidth: "50px", textAlign: "center"
        }, { textContent: priceSymbol(cert.prix) });
        row.appendChild(prixEl);

        list.appendChild(row);
      })(certs[ci]);
    }

    card.appendChild(list);
    return card;
  }

  function findCert(id) {
    for (var i = 0; i < CERTIFICATEURS.length; i++) {
      if (CERTIFICATEURS[i].id === id) return CERTIFICATEURS[i];
    }
    return null;
  }

  // ── D. REFERENT QUALITE ──────────────────────────────────

  function renderSectionD() {
    var card = sectionCard();
    card.appendChild(sectionHeader("D", "#F59E0B", "R\u00e9f\u00e9rent qualit\u00e9 le jour de l\u2019audit", "Option d\u2019accompagnement le jour J"));

    var alreadyPaid = window.STATE && STATE.selectedOptions && STATE.selectedOptions.referent_audit;

    var row = el("div", {
      display: "flex", alignItems: "flex-start", gap: "12px", padding: "16px",
      border: "1px solid " + (alreadyPaid ? "#A7F3D0" : (local.referentChecked ? ORANGE : BORDER)),
      borderRadius: "10px", cursor: alreadyPaid ? "default" : "pointer", transition: "all .12s",
      background: alreadyPaid ? "#ECFDF5" : (local.referentChecked ? ORANGE_LIGHT : WHITE),
      fontFamily: "'DM Sans',sans-serif"
    });

    if (!alreadyPaid) {
      row.addEventListener("click", function () {
        local.referentChecked = !local.referentChecked;
        render();
      });
    }

    // checkbox
    var cb = el("div", {
      width: "20px", height: "20px", borderRadius: "6px", flexShrink: "0",
      border: "2px solid " + (alreadyPaid ? GREEN : (local.referentChecked ? ORANGE : BORDER)),
      background: alreadyPaid ? GREEN : (local.referentChecked ? ORANGE : WHITE),
      display: "flex", alignItems: "center", justifyContent: "center",
      color: WHITE, fontSize: "12px", fontWeight: "700", transition: "all .12s"
    });
    if (alreadyPaid || local.referentChecked) {
      cb.textContent = "\u2713";
    }
    row.appendChild(cb);

    var textWrap = el("div", { flex: "1" });
    var title = el("div", { fontSize: "14px", fontWeight: "600", color: TEXT }, { textContent: "R\u00e9f\u00e9rent qualit\u00e9 pr\u00e9sent le jour de l\u2019audit" });
    var desc = el("div", { fontSize: "12px", color: TEXT_MUTED, marginTop: "4px", lineHeight: "1.5" },
      { textContent: "Un expert LFO passera l\u2019audit \u00e0 votre place" });
    textWrap.appendChild(title);
    textWrap.appendChild(desc);
    row.appendChild(textWrap);

    var prixWrap = el("div", { textAlign: "right", flexShrink: "0" });
    if (alreadyPaid) {
      var inclus = el("div", { fontSize: "14px", fontWeight: "700", color: GREEN }, { textContent: "Inclus \u2713" });
      prixWrap.appendChild(inclus);
    } else {
      var prix = el("div", { fontSize: "16px", fontWeight: "700", color: local.referentChecked ? ORANGE : TEXT },
        { textContent: "490\u20ac" });
      prixWrap.appendChild(prix);
    }
    row.appendChild(prixWrap);

    card.appendChild(row);
    return card;
  }

  // ── E. RECAPITULATIF ─────────────────────────────────────

  function renderSectionE() {
    var card = sectionCard();
    card.appendChild(sectionHeader("E", ORANGE, "R\u00e9capitulatif", "V\u00e9rifiez vos choix avant de confirmer"));

    var lines = el("div", { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" });

    // actions
    var actions = getSelectedActions();
    var dur = calcDuration(actions);
    addRecapLine(lines, "Actions \u00e0 certifier", actions.length > 0 ? actions.map(function (a) { return a.code; }).join(", ") : "\u2014");
    addRecapLine(lines, "Dur\u00e9e de l\u2019audit", dur > 0 ? dur + (dur > 1 ? " jours" : " jour") : "\u2014");

    // audit type
    var auditType = (window.STATE && STATE.radioValues && STATE.radioValues.type_audit) || "\u2014";
    addRecapLine(lines, "Type d\u2019audit", auditType);

    // date
    if (local.selectedDate) {
      addRecapLine(lines, "Date de l\u2019audit", formatDateFr(local.selectedDate));
      var expr = isExpress(local.selectedDate);
      addRecapLine(lines, "Tarification", expr ? "Express (+550\u20ac)" : "Tarif r\u00e9duit (-550\u20ac)", expr ? RED : GREEN);
    } else {
      addRecapLine(lines, "Date de l\u2019audit", "\u2014");
    }

    // certs
    if (local.selectedCerts.length > 0) {
      var certNames = local.selectedCerts.map(function (id) {
        var c = findCert(id);
        return c ? c.nom : id;
      }).join(", ");
      addRecapLine(lines, "Certificateurs (" + local.selectedCerts.length + "/3)", certNames);
    } else {
      addRecapLine(lines, "Certificateurs", "\u2014");
    }

    // referent
    var alreadyPaid = window.STATE && STATE.selectedOptions && STATE.selectedOptions.referent_audit;
    if (alreadyPaid) {
      addRecapLine(lines, "R\u00e9f\u00e9rent qualit\u00e9", "Inclus (d\u00e9j\u00e0 souscrit)", GREEN);
    } else if (local.referentChecked) {
      addRecapLine(lines, "R\u00e9f\u00e9rent qualit\u00e9", "Oui (+490\u20ac)", ORANGE);
    } else {
      addRecapLine(lines, "R\u00e9f\u00e9rent qualit\u00e9", "Non");
    }

    card.appendChild(lines);

    // confirm button
    var btn = el("button", {
      width: "100%", padding: "16px", background: ORANGE, color: WHITE, border: "none",
      borderRadius: "10px", fontFamily: "'DM Sans',sans-serif", fontSize: "15px", fontWeight: "700",
      cursor: "pointer", transition: "all .15s", boxShadow: "0 4px 12px rgba(216,90,48,.2)"
    }, { textContent: "Confirmer la planification" });

    btn.addEventListener("mouseenter", function () { btn.style.background = ORANGE_DARK; btn.style.transform = "translateY(-1px)"; });
    btn.addEventListener("mouseleave", function () { btn.style.background = ORANGE; btn.style.transform = "none"; });

    btn.addEventListener("click", function () {
      // save to STATE
      if (window.STATE) {
        if (!STATE.auditPlanning) STATE.auditPlanning = {};
        STATE.auditPlanning.date = local.selectedDate ? local.selectedDate.toISOString() : null;
        STATE.auditPlanning.express = local.selectedDate ? isExpress(local.selectedDate) : false;
        STATE.auditPlanning.certificateurs = local.selectedCerts.slice();
        STATE.auditPlanning.referentQualite = local.referentChecked;
        STATE.auditPlanning.duration = calcDuration(getSelectedActions());
      }
      // toast
      if (typeof window.showToast === "function") {
        window.showToast("Planification de l\u2019audit enregistr\u00e9e !");
      } else {
        var toast = document.getElementById("toast");
        if (toast) {
          toast.textContent = "Planification de l\u2019audit enregistr\u00e9e !";
          toast.classList.add("show");
          setTimeout(function () { toast.classList.remove("show"); }, 3000);
        }
      }
    });

    card.appendChild(btn);
    return card;
  }

  function addRecapLine(container, label, value, color) {
    var row = el("div", {
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "10px 0", borderBottom: "1px dashed rgba(209,213,219,.5)", fontSize: "13px",
      fontFamily: "'DM Sans',sans-serif"
    });
    var lbl = el("span", { color: TEXT_MUTED, fontWeight: "500" }, { textContent: label });
    var val = el("span", { fontWeight: "600", color: color || TEXT, textAlign: "right", maxWidth: "60%", wordBreak: "break-word" }, { textContent: value });
    row.appendChild(lbl);
    row.appendChild(val);
    container.appendChild(row);
  }

  // ── PUBLIC API ───────────────────────────────────────────

  window.initQualiopiAudit = function (hostId) {
    var hostEl = document.getElementById(hostId);
    if (!hostEl) return;
    _host = hostEl;

    // set initial cal month
    var t = today();
    local.calYear = t.getFullYear();
    local.calMonth = t.getMonth();

    render();
  };

})();
