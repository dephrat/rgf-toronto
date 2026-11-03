/*
 * Toronto announcement popup for ryangordyfoundation.org (original version, before the skyline and hotel frame)
 *
 * Install: add this one line before </body> on the site (or in the
 * platform's "custom code / footer scripts" setting):
 *   <script src="/toronto/toronto-popup.js" defer></script>
 *
 * Behaviour: shows the full announcement once per visit. Closing it (X,
 * "Continue to site", clicking outside, or Esc) hides it for the rest of the
 * visit. sessionStorage is cleared when the browser tab closes, so the next
 * visit shows it again.
 */
(function () {
  var LOGO_URL = "/toronto/rgf-logo.png";
  var PHOTO_URL = "/toronto/wes-hall.jpg";
  var KEY = "rgfTorontoPopupClosedOriginal";

  // Don't show on the announcement page itself
  if (location.pathname.indexOf("/toronto") === 0) return;
  try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}

  var font = document.createElement("link");
  font.rel = "stylesheet";
  font.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,800;1,400;1,500&family=Montserrat:wght@600;700&display=swap";
  document.head.appendChild(font);

  // Letter-spaced caps get matching left padding so the trailing space
  // after the last letter doesn't pull them off-centre.
  var css = document.createElement("style");
  css.textContent = [
    ".rgf-pop-overlay{position:fixed;inset:0;z-index:2147483000;background:rgba(17,22,38,.62);display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;-webkit-backdrop-filter:blur(0);backdrop-filter:blur(0);transition:opacity .45s ease,-webkit-backdrop-filter .8s ease,backdrop-filter .8s ease}",
    ".rgf-pop-overlay.rgf-in{opacity:1;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}",
    ".rgf-pop-overlay.rgf-out{opacity:0;transition:opacity .3s ease}",
    ".rgf-pop{position:relative;width:100%;max-width:620px;max-height:calc(100vh - 32px);max-height:calc(100dvh - 32px);overflow:auto;overscroll-behavior:contain;background:radial-gradient(ellipse at 50% 30%,#fffaf0,#fbf5e9 50%,#f3e8d2);border-radius:14px;box-shadow:0 30px 80px rgba(0,0,0,.45);text-align:center;font-family:'Playfair Display',Georgia,serif;color:#2b2f3a;opacity:0}",
    ".rgf-pop-overlay.rgf-in .rgf-pop{animation:rgfCard .9s cubic-bezier(.16,1,.3,1) .05s both}",
    ".rgf-pop-frame{position:relative;margin:8px;border:1px solid rgba(201,164,92,.55);border-radius:10px;padding:36px 24px 28px;container-type:inline-size}",
    ".rgf-pop p{margin:0}",
    ".rgf-pop-xwrap{position:sticky;top:0;height:0;z-index:2}",
    ".rgf-pop-x{position:absolute;top:-28px;right:-16px;width:44px;height:44px;border:0;background:transparent;font-size:28px;line-height:1;color:#1d2a4b;cursor:pointer;border-radius:50%;z-index:1}",
    ".rgf-pop-x:hover,.rgf-pop-x:focus-visible{background:rgba(29,42,75,.08);outline:none}",
    ".rgf-pop-logo{display:block;width:230px;max-width:70%;height:auto;margin:0 auto}",
    ".rgf-pop-kicker{margin-top:20px!important;font-family:Montserrat,sans-serif;font-weight:700;font-size:min(12px,3cqw);white-space:nowrap;letter-spacing:.28em;padding-left:.28em;text-transform:uppercase;color:#1d2a4b}",
    ".rgf-pop-title{margin-top:8px!important;font-weight:800;font-size:min(38px,5.6cqw);line-height:1.1;white-space:nowrap;text-transform:uppercase;color:#a07e46;background:linear-gradient(110deg,#a07e46 0 40%,#f6e3a8 50%,#a07e46 60% 100%);background-size:300% 100%;background-position:100% 0;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}",
    ".rgf-pop-rule{width:140px;height:2px;margin:16px auto;background:linear-gradient(90deg,transparent,#c9a45c,transparent)}",
    ".rgf-pop-hon{font-style:italic;font-weight:500;font-size:18px;color:#8a6a35}",
    ".rgf-pop-photo{display:block;width:132px;height:132px;margin:14px auto 0;border-radius:50%;object-fit:cover;border:4px solid #c9a45c;box-shadow:0 10px 24px rgba(29,42,75,.2)}",
    ".rgf-pop-name{margin-top:14px!important;font-weight:800;font-size:min(46px,10cqw);line-height:1.05;letter-spacing:.04em;padding-left:.04em;color:#1d2a4b}",
    ".rgf-pop-award{margin-top:4px!important;font-style:italic;font-size:15px;color:#5d5a52}",
    ".rgf-pop-host{margin-top:2px!important;font-style:italic;font-weight:500;font-size:16px;color:#8a6a35}",
    ".rgf-pop-when{margin:20px auto 0;padding:16px 0;max-width:460px;border-top:1px solid rgba(160,126,70,.45);border-bottom:1px solid rgba(160,126,70,.45)}",
    ".rgf-pop-date{font-family:Montserrat,sans-serif;font-weight:700;font-size:min(16px,4.4cqw);white-space:nowrap;letter-spacing:.08em;padding-left:.08em;text-transform:uppercase;color:#1d2a4b}",
    ".rgf-pop-venue{margin-top:6px!important;font-weight:700;font-size:19px;color:#1d2a4b}",
    ".rgf-pop-times{display:flex;justify-content:center;margin-top:12px}",
    ".rgf-pop-times div{flex:1 1 0;max-width:180px;padding:0 10px}",
    ".rgf-pop-times div+div{border-left:1px solid rgba(160,126,70,.6)}",
    ".rgf-pop-times b{display:block;font-size:20px;font-weight:700;color:#a07e46}",
    ".rgf-pop-times span{font-size:14px;color:#2b2f3a}",
    ".rgf-pop-mission{margin:18px auto 0!important;max-width:470px;font-size:15px;line-height:1.5;text-wrap:balance}",
    ".rgf-pop-mission strong{color:#1d2a4b}",
    ".rgf-pop-mission p{margin:.7em 0 0!important}",
    ".rgf-pop-mission .rgf-pop-mission-h{margin:0!important;font-weight:700;color:#1d2a4b}",
    ".rgf-pop-stay{margin:14px auto 0!important;max-width:470px;font-style:italic;font-weight:500;font-size:18px;line-height:1.35;color:#8a6a35;text-wrap:balance}",
    ".rgf-pop-rsvp{margin:18px auto 0;max-width:330px;padding:14px 16px;border:2px solid #c9a45c;border-radius:14px;background:rgba(255,255,255,.45)}",
    ".rgf-pop-rsvp-label{font-family:Montserrat,sans-serif;font-weight:700;font-size:12px;letter-spacing:.28em;padding-left:.28em;color:#8a6a35}",
    ".rgf-pop-rsvp a{display:inline-block;margin-top:6px;font-size:16px;font-weight:700;color:#1d2a4b;text-decoration:none;word-break:break-word}",
    ".rgf-pop-rsvp a:hover{text-decoration:underline}",
    ".rgf-pop-only{margin-top:4px!important;font-style:italic;font-size:14px;color:#5d5a52}",
    ".rgf-pop-continue{display:block;min-height:44px;margin:20px auto 0;padding:0 28px;border:0;border-radius:999px;background:#1d2a4b;color:#fbf5e9;font-family:Montserrat,sans-serif;font-weight:700;font-size:12px;letter-spacing:.2em;text-indent:.2em;text-transform:uppercase;cursor:pointer;box-shadow:0 8px 20px rgba(29,42,75,.3)}",
    ".rgf-pop-continue:hover,.rgf-pop-continue:focus-visible{filter:brightness(1.15);outline:none}",
    // Reveal: card rises in, then each line follows in turn (--i is set per child below)
    "@keyframes rgfCard{from{opacity:0;transform:translateY(48px) scale(.92)}to{opacity:1;transform:none}}",
    "@keyframes rgfUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}",
    "@keyframes rgfDraw{from{opacity:0;transform:scaleX(0)}to{opacity:1;transform:scaleX(1)}}",
    "@keyframes rgfPhoto{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}",
    "@keyframes rgfGlow{0%,100%{box-shadow:0 10px 24px rgba(29,42,75,.2),0 0 0 0 rgba(201,164,92,0)}50%{box-shadow:0 10px 24px rgba(29,42,75,.2),0 0 0 10px rgba(201,164,92,.28)}}",
    "@keyframes rgfShine{from{background-position:100% 0}to{background-position:0 0}}",
    "@keyframes rgfFrame{from{border-color:rgba(201,164,92,0)}to{border-color:rgba(201,164,92,.55)}}",
    ".rgf-in .rgf-pop-frame{animation:rgfFrame 1.2s ease .4s both}",
    ".rgf-in .rgf-pop-frame>*{animation:rgfUp .7s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(.35s + var(--i) * 60ms)}",
    ".rgf-in .rgf-pop-frame>.rgf-pop-rule{animation-name:rgfDraw;animation-duration:.9s}",
    ".rgf-in .rgf-pop-frame>.rgf-pop-photo{animation:rgfPhoto .8s cubic-bezier(.34,1.56,.64,1) both,rgfGlow 1.4s ease-in-out both;animation-delay:calc(.35s + var(--i) * 60ms),1.3s}",
    ".rgf-in .rgf-pop-frame>.rgf-pop-title{animation:rgfUp .7s cubic-bezier(.16,1,.3,1) both,rgfShine 1.6s ease-in-out both;animation-delay:calc(.35s + var(--i) * 60ms),1s}",
    "@media (prefers-reduced-motion:reduce){.rgf-pop-overlay,.rgf-pop-overlay.rgf-in{transition:opacity .2s;-webkit-backdrop-filter:none;backdrop-filter:none}.rgf-in .rgf-pop,.rgf-in .rgf-pop-frame,.rgf-in .rgf-pop-frame>*{animation:none!important;opacity:1}}"
  ].join("");
  document.head.appendChild(css);

  var overlay = document.createElement("div");
  overlay.className = "rgf-pop-overlay";
  overlay.innerHTML =
    '<div class="rgf-pop" role="dialog" aria-modal="true" aria-labelledby="rgf-pop-title">' +
    '<div class="rgf-pop-frame">' +
      '<div class="rgf-pop-xwrap"><button class="rgf-pop-x" type="button" aria-label="Close">&times;</button></div>' +
      '<img class="rgf-pop-logo" src="' + LOGO_URL + '" alt="Ryan Gordy Foundation">' +
      '<p class="rgf-pop-kicker">Announcing our Toronto debut</p>' +
      '<p class="rgf-pop-title" id="rgf-pop-title">The Power of Love Gala</p>' +
      '<div class="rgf-pop-rule"></div>' +
      '<p class="rgf-pop-hon">An Evening Honouring</p>' +
      '<img class="rgf-pop-photo" src="' + PHOTO_URL + '" alt="Wes Hall">' +
      '<p class="rgf-pop-name">WES HALL</p>' +
      '<p class="rgf-pop-award">Honoured with the Power of Love Award</p>' +
      '<p class="rgf-pop-host">Hosted by Ben Mulroney</p>' +
      '<div class="rgf-pop-when">' +
        '<p class="rgf-pop-date">Saturday, November 7, 2026</p>' +
        '<p class="rgf-pop-venue">The Ritz-Carlton, Toronto</p>' +
        '<div class="rgf-pop-times">' +
          '<div><b>6:00 PM</b><span>Cocktails</span></div>' +
          '<div><b>7:00 PM</b><span>Dinner &amp; Celebration</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="rgf-pop-mission"><p class="rgf-pop-mission-h">Continuing Ryan’s Legacy. Inspiring Hope.</p>' +
      '<p>Founded in honour of <strong>Ryan Gordy</strong>, whose life and spirit continue to inspire our purpose, the Ryan Gordy Foundation is dedicated to supporting young adults navigating cancer treatment.</p>' +
      '<p>In partnership with <strong>Princess Margaret Cancer Centre’s Adolescent and Young Adult (AYA) Oncology Program</strong>, we provide meaningful support through financial assistance, wellness, and mental health initiatives — bringing comfort, strength, and hope to young adults and their families.</p></div>' +
      '<p class="rgf-pop-stay">All funds raised in Toronto stay in the Toronto community.</p>' +
      '<div class="rgf-pop-rsvp">' +
        '<p class="rgf-pop-rsvp-label">FOR MORE INFORMATION</p>' +
        '<a href="mailto:Anita@ryangordyfoundation.org?subject=Power%20of%20Love%20Gala%20Toronto%20RSVP">Anita@ryangordyfoundation.org</a>' +
        '<p class="rgf-pop-only">By invitation only</p>' +
      '</div>' +
      '<button class="rgf-pop-continue" type="button">Continue to site</button>' +
    '</div>' +
    '</div>';

  var kids = overlay.querySelector(".rgf-pop-frame").children;
  for (var i = 0; i < kids.length; i++) kids[i].style.setProperty("--i", i);

  function close() {
    try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
    overlay.classList.add("rgf-out");
    document.removeEventListener("keydown", onKey);
    setTimeout(function () { overlay.remove(); }, 300);
  }
  function onKey(e) { if (e.key === "Escape") close(); }

  overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
  overlay.querySelector(".rgf-pop-x").addEventListener("click", close);
  overlay.querySelector(".rgf-pop-continue").addEventListener("click", close);
  document.addEventListener("keydown", onKey);

  function show() {
    document.body.appendChild(overlay);
    requestAnimationFrame(function () { overlay.classList.add("rgf-in"); });
    overlay.querySelector(".rgf-pop-x").focus();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", show);
  else show();
})();
