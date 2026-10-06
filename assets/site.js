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
    "/schemes/": {
      key: "tools", icon: "🧮", title: "Free scheme calculators",
      text: "Find your APY pension contribution or SSY maturity amount in seconds.",
      href: "/tools/", cta: "Try the calculators"
    },
    "/": {
      key: "tools", icon: "🧮", title: "Free scheme calculators",
      text: "Find your APY pension contribution or SSY maturity amount in seconds.",
      href: "/tools/", cta: "Try the calculators"
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
