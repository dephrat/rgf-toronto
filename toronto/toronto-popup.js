/*
 * Toronto announcement popup for ryangordyfoundation.org
 *
 * Install: add this one line before </body> on the site (or in the
 * platform's "custom code / footer scripts" setting):
 *   <script src="/toronto/toronto-popup.js" defer></script>
 *
 * Behaviour: shows once per visit. Closing it (X, "Maybe later", clicking
 * outside, or Esc) hides it for the rest of the visit. sessionStorage is
 * cleared when the browser tab closes, so the next visit shows it again.
 */
(function () {
  var PAGE_URL = "/toronto/";
  var LOGO_URL = "/toronto/rgf-logo.png";
  var PHOTO_URL = "/toronto/wes-hall.jpg";
  var KEY = "rgfTorontoPopupClosed";

  // Don't show on the announcement page itself
  if (location.pathname.indexOf("/toronto") === 0) return;
  try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}

  var font = document.createElement("link");
  font.rel = "stylesheet";
  font.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,500&family=Montserrat:wght@600;700&display=swap";
  document.head.appendChild(font);

  var css = document.createElement("style");
  css.textContent = [
    ".rgf-pop-overlay{position:fixed;inset:0;z-index:2147483000;background:rgba(17,22,38,.62);display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;transition:opacity .35s}",
    ".rgf-pop-overlay.rgf-in{opacity:1}",
    ".rgf-pop{position:relative;width:100%;max-width:480px;max-height:calc(100vh - 32px);overflow:auto;background:radial-gradient(ellipse at 50% 30%,#fffaf0,#fbf5e9 50%,#f3e8d2);border-radius:14px;box-shadow:0 30px 80px rgba(0,0,0,.45);padding:40px 28px 30px;text-align:center;font-family:'Playfair Display',Georgia,serif;color:#2b2f3a;transform:translateY(16px);transition:transform .35s}",
    ".rgf-pop-overlay.rgf-in .rgf-pop{transform:none}",
    ".rgf-pop::before{content:'';position:absolute;inset:8px;border:1px solid rgba(201,164,92,.55);border-radius:10px;pointer-events:none}",
    ".rgf-pop-x{position:absolute;top:12px;right:12px;width:44px;height:44px;border:0;background:transparent;font-size:26px;line-height:1;color:#1d2a4b;cursor:pointer;border-radius:50%;z-index:1}",
    ".rgf-pop-x:hover,.rgf-pop-x:focus-visible{background:rgba(29,42,75,.08);outline:none}",
    ".rgf-pop-logo{width:200px;max-width:70%;height:auto}",
    ".rgf-pop-kicker{margin:18px 0 0;font-family:Montserrat,sans-serif;font-weight:700;font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:#1d2a4b}",
    ".rgf-pop-title{margin:8px 0 0;font-weight:800;font-size:clamp(26px,7vw,36px);line-height:1.08;text-transform:uppercase;color:#a07e46}",
    ".rgf-pop-rule{width:120px;height:2px;margin:16px auto;background:linear-gradient(90deg,transparent,#c9a45c,transparent)}",
    ".rgf-pop-hon{margin:0;font-style:italic;font-weight:500;font-size:17px;color:#8a6a35}",
    ".rgf-pop-who{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:8px}",
    ".rgf-pop-photo{width:64px;height:64px;border-radius:50%;object-fit:cover;border:3px solid #c9a45c;flex:none}",
    ".rgf-pop-name{margin:0;font-weight:800;font-size:32px;letter-spacing:.04em;color:#1d2a4b}",
    ".rgf-pop-when{margin:16px 0 0;font-family:Montserrat,sans-serif;font-weight:700;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#1d2a4b}",
    ".rgf-pop-venue{margin:4px 0 0;font-weight:700;font-size:17px;color:#1d2a4b}",
    ".rgf-pop-stay{margin:14px 0 0;font-style:italic;font-size:15px;color:#5d5a52}",
    ".rgf-pop-cta{display:inline-block;margin-top:22px;padding:13px 28px;border-radius:999px;background:#1d2a4b;color:#fbf5e9;font-family:Montserrat,sans-serif;font-weight:700;font-size:12px;letter-spacing:.2em;text-transform:uppercase;text-decoration:none;box-shadow:0 8px 20px rgba(29,42,75,.3)}",
    ".rgf-pop-cta:hover,.rgf-pop-cta:focus-visible{filter:brightness(1.08);outline:none}",
    ".rgf-pop-later{display:block;min-height:44px;padding:0 16px;margin:6px auto 0;border:0;background:none;font-family:Montserrat,sans-serif;font-weight:600;font-size:12px;letter-spacing:.08em;color:#5d5a52;cursor:pointer;text-decoration:underline}"
  ].join("");
  document.head.appendChild(css);

  var overlay = document.createElement("div");
  overlay.className = "rgf-pop-overlay";
  overlay.innerHTML =
    '<div class="rgf-pop" role="dialog" aria-modal="true" aria-labelledby="rgf-pop-title">' +
      '<button class="rgf-pop-x" type="button" aria-label="Close">&times;</button>' +
      '<img class="rgf-pop-logo" src="' + LOGO_URL + '" alt="Ryan Gordy Foundation">' +
      '<p class="rgf-pop-kicker">Announcing our Toronto debut</p>' +
      '<p class="rgf-pop-title" id="rgf-pop-title">The Power of Love Gala</p>' +
      '<div class="rgf-pop-rule"></div>' +
      '<p class="rgf-pop-hon">An Evening Honouring</p>' +
      '<div class="rgf-pop-who"><img class="rgf-pop-photo" src="' + PHOTO_URL + '" alt=""><p class="rgf-pop-name">WES HALL</p></div>' +
      '<p class="rgf-pop-when">Saturday, November 7, 2026</p>' +
      '<p class="rgf-pop-venue">The Ritz-Carlton, Toronto</p>' +
      '<p class="rgf-pop-stay">All funds raised in Toronto stay in the Toronto community.</p>' +
      '<a class="rgf-pop-cta" href="' + PAGE_URL + '">See the announcement</a>' +
      '<button class="rgf-pop-later" type="button">Maybe later</button>' +
    '</div>';

  function close() {
    try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
    overlay.classList.remove("rgf-in");
    document.removeEventListener("keydown", onKey);
    setTimeout(function () { overlay.remove(); }, 350);
  }
  function onKey(e) { if (e.key === "Escape") close(); }

  overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
  overlay.querySelector(".rgf-pop-x").addEventListener("click", close);
  overlay.querySelector(".rgf-pop-later").addEventListener("click", close);
  // Going to the announcement also counts as "seen"
  overlay.querySelector(".rgf-pop-cta").addEventListener("click", function () {
    try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
  });
  document.addEventListener("keydown", onKey);

  function show() {
    document.body.appendChild(overlay);
    requestAnimationFrame(function () { overlay.classList.add("rgf-in"); });
    overlay.querySelector(".rgf-pop-x").focus();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", show);
  else show();
})();
