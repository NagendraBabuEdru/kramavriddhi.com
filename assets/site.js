/* Kramavriddhi — calculator suggestion card.
   A small, non-blocking card that points readers to the matching calculator.
   Closing it hides it for 7 days on this device. */
(function () {
  var NUDGES = {
    "/schemes/atal-pension-yojana/": {
      key: "apy", icon: "👴", title: "How much will you pay for APY?",
      text: "Enter your age and see your exact monthly amount for a ₹1,000–₹5,000 pension.",
      href: "/tools/atal-pension-calculator/", cta: "Open APY calculator"
    },
    "/schemes/sukanya-samriddhi-yojana/": {
      key: "ssy", icon: "👧", title: "See your daughter's SSY grow",
      text: "Try your own yearly deposit and see the maturity amount, year by year.",
      href: "/tools/sukanya-samriddhi-calculator/", cta: "Open SSY calculator"
    },
    "/schemes/pm-jan-dhan-yojana/": {
      key: "jdy", icon: "🧮", title: "Planning your savings?",
      text: "Use our free Atal Pension and Sukanya Samriddhi calculators.",
      href: "/tools/", cta: "See calculators"
    },
    "/te/schemes/": {
      key: "checker-te", icon: "✅", title: "మీకు ఏ పథకాలు వర్తిస్తాయి?",
      text: "కొన్ని సులభమైన ప్రశ్నలకు సమాధానం ఇచ్చి మీకు సరిపోయే ప్రభుత్వ పథకాలు చూడండి.",
      href: "/te/tools/scheme-eligibility-checker/", cta: "ఒక నిమిషంలో చూడండి"
    },
    "/schemes/": {
      key: "checker", icon: "✅", title: "Which schemes are for you?",
      text: "Answer a few simple questions and see the government schemes that may suit you.",
      href: "/tools/scheme-eligibility-checker/", cta: "Check in 1 minute"
    },
    "/": {
      key: "checker", icon: "✅", title: "Which schemes are for you?",
      text: "Answer a few simple questions and see the government schemes that may suit you.",
      href: "/tools/scheme-eligibility-checker/", cta: "Check in 1 minute"
    }
  };

  var path = location.pathname.replace(/index\.html$/, "");
  var n = NUDGES[path];
  if (!n) return;

  var STORE = "kv-nudge-closed-" + n.key, WEEK = 7 * 24 * 60 * 60 * 1000;
  try {
    var closedAt = parseInt(localStorage.getItem(STORE) || "0", 10);
    if (Date.now() - closedAt < WEEK) return;
  } catch (e) { /* storage blocked: just show it */ }

  var shown = false, el;
  function close(remember) {
    if (!el) return;
    el.classList.remove("show");
    setTimeout(function () { if (el && el.parentNode) el.parentNode.removeChild(el); }, 300);
    if (remember) { try { localStorage.setItem(STORE, String(Date.now())); } catch (e) {} }
    document.removeEventListener("keydown", onKey);
  }
  function onKey(e) { if (e.key === "Escape") close(true); }

  function show() {
    if (shown) return;
    shown = true;
    window.removeEventListener("scroll", onScroll);
    el = document.createElement("aside");
    el.className = "nudge";
    el.setAttribute("aria-label", "Calculator suggestion");
    el.innerHTML =
      '<button class="nudge-x" type="button" aria-label="Close">×</button>' +
      '<div class="nudge-icon" aria-hidden="true">' + n.icon + '</div>' +
      '<div class="nudge-body"><strong>' + n.title + '</strong><p>' + n.text + '</p>' +
      '<a class="btn primary" href="' + n.href + '">' + n.cta + ' →</a></div>';
    document.body.appendChild(el);
    el.querySelector(".nudge-x").addEventListener("click", function () { close(true); });
    el.querySelector("a").addEventListener("click", function () {
      try { localStorage.setItem(STORE, String(Date.now())); } catch (e) {}
    });
    document.addEventListener("keydown", onKey);
    requestAnimationFrame(function () { el.classList.add("show"); });
  }
  function onScroll() {
    var h = document.documentElement;
    if ((h.scrollTop + h.clientHeight) / h.scrollHeight > 0.35) show();
  }

  // Appear after the reader has scrolled a bit, or after 8 seconds.
  window.addEventListener("scroll", onScroll, { passive: true });
  setTimeout(show, 8000);
})();

/* Kramavriddhi — share bar.
   WhatsApp works as a plain link. Here we show "Copy link" and the phone's own share sheet
   when the browser supports them, and count shares in Google Analytics. */
(function () {
  function oldCopy(text) {
    var t = document.createElement("textarea"), ok = false;
    t.value = text; t.setAttribute("readonly", ""); t.style.position = "fixed"; t.style.opacity = "0";
    document.body.appendChild(t); t.select();
    try { ok = document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(t);
    return ok;
  }
  document.querySelectorAll(".share").forEach(function (bar) {
    var copy = bar.querySelector('[data-share="copy"]');
    var more = bar.querySelector('[data-share="native"]');
    if (copy) copy.hidden = false;
    if (more && navigator.share) more.hidden = false;
    bar.addEventListener("click", function (e) {
      var b = e.target.closest("[data-share]");
      if (!b) return;
      var method = b.getAttribute("data-share");
      if (window.gtag) gtag("event", "share", { method: method, content_type: "page", item_id: location.pathname });
      if (method === "copy") {
        var url = bar.getAttribute("data-url");
        var done = function () {
          var s = b.querySelector("span"), old = s.textContent;
          s.textContent = b.getAttribute("data-done");
          setTimeout(function () { s.textContent = old; }, 2000);
        };
        // Some in-app browsers block the clipboard API: try the older copy command, then show the link.
        var fallback = function () { if (oldCopy(url)) done(); else window.prompt("", url); };
        if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, fallback); else fallback();
      } else if (method === "native") {
        navigator.share({ title: document.title, text: bar.getAttribute("data-text"), url: bar.getAttribute("data-url") }).catch(function () {});
      }
    });
  });
})();
