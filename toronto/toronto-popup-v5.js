/*
 * Toronto announcement popup for ryangordyfoundation.org (v5: v4 that shrinks its spacing just enough to fit the screen)
 *
 * Install: add this one line before </body> on the site (or in the
 * platform's "custom code / footer scripts" setting):
 *   <script src="https://rgf.onenewerax.com/toronto/toronto-popup-v5.js" defer></script>
 * The logo, Wes Hall photo and background load from the same folder as the script.
 *
 * Behaviour: shows the full announcement once per visit. Closing it (X,
 * "Continue to site", clicking outside, or Esc) hides it for the rest of the
 * visit. sessionStorage is cleared when the browser tab closes, so the next
 * visit shows it again.
 */
(function () {
  // Images load from the same folder as this script, so it works on any site that includes it
  var BASE = (document.currentScript && document.currentScript.src || "/toronto/").replace(/[^\/]*$/, "");
  var LOGO_URL = BASE + "rgf-logo.png";
  var PHOTO_URL = BASE + "wes-hall.jpg";
  var KEY = "rgfTorontoPopupClosedV5";
  var BG_URL = BASE + "ritz-toronto-bg.jpg";
  // Bokeh, measured from the reference video: out-of-focus discs (and a few pinpoint
  // sparkles) float in front of everything, glide mostly sideways (~5% of the card
  // width per second) while fading in and out, then reappear somewhere else.
  // The brightest cluster near the bottom around the RSVP box and button; fainter
  // ones land over the building on the left. Sizes, speed, lifetime and brightness
  // were checked by recording this popup and measuring it with the same tracker.
  // [size in % of card width, seconds per cycle, start offset seconds]
  var ORBS = [[9.5,2.4,0],[8,2.7,0.8],[10.5,2.2,1.7],[7,2.9,0.4],[9,2.6,2.2],[10,2.8,1.3],[8.5,2.5,2.9]];
  var SPARKS = [[1.2,2.6,0.4],[1,2.4,1.6],[1.4,2.9,2.4],[1,2.5,0.9]];
  function spot() {
    var r = Math.random();
    if (r < 0.45) return [10 + Math.random() * 80, "calc(100% - " + (4 + Math.random() * 26).toFixed(1) + "cqw)"]; // bottom, around RSVP and button
    if (r < 0.8) return [2 + Math.random() * 26, (12 + Math.random() * 110).toFixed(1) + "cqw"];                   // left, over the building
    return [30 + Math.random() * 65, (12 + Math.random() * 110).toFixed(1) + "cqw"];                               // middle and right
  }

  // Don't show on the announcement page itself
  if (location.pathname.indexOf("/toronto") === 0) return;
  try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}

  var font = document.createElement("link");
  font.rel = "stylesheet";
  font.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,800;1,400;1,500&family=Montserrat:wght@600;700&display=swap";
  document.head.appendChild(font);

  // Letter-spaced caps get matching left padding so the trailing space
  // after the last letter doesn't pull them off-centre.
  // Full V4 size at --k:1, tightest spacing at --k:0; fit() below picks the largest that fits the screen
  function L(full, tight) { return "calc(" + tight + " + (" + full + " - " + tight + ") * var(--k))"; }
  var css = document.createElement("style");
  css.textContent = [
    ".rgf-pop-overlay{position:fixed;inset:0;z-index:2147483000;background:rgba(17,22,38,.62);display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;-webkit-backdrop-filter:blur(0);backdrop-filter:blur(0);transition:opacity .9s ease,-webkit-backdrop-filter 1.4s ease,backdrop-filter 1.4s ease}",
    ".rgf-pop-overlay.rgf-in{opacity:1;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}",
    ".rgf-pop-overlay.rgf-out{opacity:0;transition:opacity .4s ease}",
    ".rgf-pop{--k:1;position:relative;container-type:inline-size;width:min(100%,600px,max(320px,calc((100dvh - 32px) * .6)));max-height:calc(100vh - 32px);max-height:calc(100dvh - 32px);overflow:auto;overscroll-behavior:contain;background:radial-gradient(ellipse 58% 46% at 50% 47%,rgba(248,246,250,.66),rgba(248,246,250,0) 72%),linear-gradient(rgba(240,236,238,.56),rgba(240,236,238,.56)),url("+BG_URL+") 50% 0/cover no-repeat,#ebe2dd;background-attachment:local;border-radius:14px;box-shadow:0 30px 80px rgba(0,0,0,.45);text-align:center;font-family:'Playfair Display',Georgia,serif;color:#2b2f3a;opacity:0}",
    ".rgf-pop-overlay.rgf-in .rgf-pop{animation:rgfCard 1.5s cubic-bezier(.16,1,.3,1) .1s both}",
    ".rgf-pop-frame{position:relative;margin:8px;border:1px solid rgba(201,164,92,.55);border-radius:10px;padding:"+L("5.5cqw","4cqw")+" 4cqw "+L("3.8cqw","3cqw")+";container-type:inline-size}",
    ".rgf-pop p{margin:0}",
    ".rgf-pop-frame>*{position:relative;z-index:1}",
    ".rgf-pop-bokeh{position:absolute!important;z-index:2!important;mix-blend-mode:screen;inset:-9px;overflow:hidden;border-radius:14px;pointer-events:none}",
    ".rgf-pop-bokeh span{position:absolute;aspect-ratio:1;border-radius:50%;transform:translate(-50%,-50%);opacity:0;animation:rgfTwinkle var(--d) ease-in-out var(--o) infinite}",
    ".rgf-pop-orb{background:radial-gradient(circle,rgba(255,255,255,.78) 0 56%,rgba(255,255,255,.98) 66%,rgba(255,255,255,0) 71%);filter:blur(1.5px);box-shadow:0 0 18px rgba(255,255,255,.35)}",
    ".rgf-pop-spark{background:radial-gradient(circle,#fff 0 30%,rgba(255,255,255,0) 70%)}",
    ".rgf-in .rgf-pop-bokeh{animation:rgfFade 3s ease 1.6s both}",
    ".rgf-pop-xwrap{position:sticky;top:0;height:0;z-index:2}",
    ".rgf-pop-x{position:absolute;top:-3cqw;right:-1.5cqw;width:max(32px,7cqw);height:max(32px,7cqw);border:0;background:rgba(29,42,75,.08);font-size:max(20px,4.6cqw);line-height:1;color:#1d2a4b;cursor:pointer;border-radius:50%;z-index:1}",
    ".rgf-pop-x:hover,.rgf-pop-x:focus-visible{background:rgba(29,42,75,.16);outline:none}",
    ".rgf-pop-logo{display:block;width:max("+L("150px","132px")+","+L("37.7cqw","33cqw")+");height:auto;margin:0 auto}",
    ".rgf-pop-kicker{margin-top:"+L("3.8cqw","2.4cqw")+"!important;font-family:Montserrat,sans-serif;font-weight:700;font-size:max(9px,2.02cqw);white-space:nowrap;letter-spacing:.28em;padding-left:.28em;text-transform:uppercase;color:#1d2a4b}",
    ".rgf-pop-title{margin-top:1.2cqw!important;font-weight:800;font-size:max(17px,4.9cqw);line-height:1.1;white-space:nowrap;text-transform:uppercase;color:#a07e46;background:linear-gradient(110deg,#a07e46 0 40%,#f6e3a8 50%,#a07e46 60% 100%);background-size:300% 100%;background-position:100% 0;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}",
    ".rgf-pop-rule{width:24cqw;height:2px;margin:"+L("2.6cqw","1.8cqw")+" auto "+L("3cqw","2cqw")+";background:linear-gradient(90deg,transparent,#c9a45c,transparent)}",
    ".rgf-pop-hon{font-style:italic;font-weight:500;font-size:max(12px,3.06cqw);color:#8a6a35}",
    ".rgf-pop-photo{display:block;width:max("+L("84px","66px")+","+L("21.6cqw","16.5cqw")+");height:max("+L("84px","66px")+","+L("21.6cqw","16.5cqw")+");margin:"+L("3cqw","2cqw")+" auto 0;border-radius:50%;object-fit:cover;border:max(3px,.8cqw) solid #c9a45c;box-shadow:0 10px 24px rgba(29,42,75,.2)}",
    ".rgf-pop-name{margin-top:"+L("3cqw","2cqw")+"!important;font-weight:800;font-size:max(26px,8.1cqw);line-height:1.05;letter-spacing:.04em;padding-left:.04em;color:#1d2a4b}",
    ".rgf-pop-award{margin-top:.6cqw!important;font-style:italic;font-size:max(11px,2.5cqw);color:#5d5a52}",
    ".rgf-pop-host{margin-top:.3cqw!important;font-style:italic;font-weight:500;font-size:max(11.5px,2.6cqw);color:#8a6a35}",
    ".rgf-pop-when{margin:"+L("4cqw","2.4cqw")+" auto 0;padding:"+L("2.7cqw","1.8cqw")+" 0 "+L("3cqw","2cqw")+";max-width:78cqw;border-top:1px solid rgba(160,126,70,.45);border-bottom:1px solid rgba(160,126,70,.45)}",
    ".rgf-pop-date{font-family:Montserrat,sans-serif;font-weight:700;font-size:max(11px,2.7cqw);white-space:nowrap;letter-spacing:.08em;padding-left:.08em;text-transform:uppercase;color:#1d2a4b}",
    ".rgf-pop-venue{margin-top:1cqw!important;font-weight:700;font-size:max(13px,3.2cqw);color:#1d2a4b}",
    ".rgf-pop-times{display:flex;justify-content:center;margin-top:"+L("2.2cqw","1.6cqw")+"}",
    ".rgf-pop-times div{flex:1 1 0;max-width:37cqw;padding:0 2cqw}",
    ".rgf-pop-times div+div{border-left:1px solid rgba(160,126,70,.6)}",
    ".rgf-pop-times b{display:block;font-size:max(14px,3.4cqw);font-weight:700;color:#a07e46}",
    ".rgf-pop-times span{display:inline-block;font-size:max(10.5px,2.35cqw);line-height:1.3;color:#2b2f3a}",
    ".rgf-pop-mission{margin:"+L("3cqw","2.2cqw")+" auto 0!important;max-width:"+L("74cqw","92cqw")+";font-size:max(11px,"+L("2.53cqw","2.45cqw")+");line-height:"+L("1.5","1.36")+";text-wrap:balance}",
    ".rgf-pop-mission strong{color:#1d2a4b}",
    ".rgf-pop-mission p{margin:"+L(".7em",".45em")+" 0 0!important}",
    ".rgf-pop-mission .rgf-pop-mission-h{margin:0!important;font-weight:700;color:#1d2a4b}",
    ".rgf-pop-stay{margin:"+L("3cqw","2cqw")+" auto 0!important;max-width:84cqw;font-style:italic;font-weight:500;font-size:max(12px,3.1cqw);line-height:1.35;color:#8a6a35;text-wrap:balance}",
    ".rgf-pop-rsvp{margin:"+L("3cqw","2.2cqw")+" auto 0;width:max(230px,55cqw);max-width:100%;box-sizing:border-box;padding:"+L("2.4cqw","1.8cqw")+" 3cqw;border:2px solid #c9a45c;border-radius:14px;background:rgba(255,255,255,.45)}",
    ".rgf-pop-rsvp-label{font-family:Montserrat,sans-serif;font-weight:700;font-size:max(9px,2cqw);letter-spacing:.28em;padding-left:.28em;color:#8a6a35}",
    ".rgf-pop-rsvp a{display:inline-block;margin-top:1cqw;font-size:max(12px,2.7cqw);font-weight:700;color:#1d2a4b;text-decoration:none;word-break:break-word}",
    ".rgf-pop-rsvp a:hover{text-decoration:underline}",
    ".rgf-pop-only{margin-top:.6cqw!important;font-style:italic;font-size:max(10.5px,2.35cqw);color:#5d5a52}",
    ".rgf-pop-continue{display:block;min-height:max("+L("36px","34px")+","+L("7.5cqw","7cqw")+");margin:"+L("3.5cqw","2.2cqw")+" auto 0;padding:0 6cqw;border:0;border-radius:999px;background:#1d2a4b;color:#fbf5e9;font-family:Montserrat,sans-serif;font-weight:700;font-size:max(9.5px,2cqw);letter-spacing:.2em;text-indent:.2em;text-transform:uppercase;cursor:pointer;box-shadow:0 8px 20px rgba(29,42,75,.3)}",
    ".rgf-pop-continue:hover,.rgf-pop-continue:focus-visible{filter:brightness(1.15);outline:none}",
    "@container (max-width:360px){.rgf-pop-mission,.rgf-pop-stay{max-width:none}}",
    // Reveal: card rises in, then each line follows in turn (--i is set per child below)
    "@keyframes rgfCard{from{opacity:0;transform:translateY(48px) scale(.92)}to{opacity:1;transform:none}}",
    "@keyframes rgfUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}",
    "@keyframes rgfDraw{from{opacity:0;transform:scaleX(0)}to{opacity:1;transform:scaleX(1)}}",
    "@keyframes rgfPhoto{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}",
    "@keyframes rgfGlow{0%,100%{box-shadow:0 10px 24px rgba(29,42,75,.2),0 0 0 0 rgba(201,164,92,0),0 0 0 0 rgba(255,236,190,0)}50%{box-shadow:0 10px 24px rgba(29,42,75,.2),0 0 0 9px rgba(201,164,92,.22),0 0 40px 14px rgba(255,236,190,.45)}}",
    "@keyframes rgfShine{from{background-position:100% 0}to{background-position:0 0}}",
    "@keyframes rgfFade{from{opacity:0}to{opacity:1}}",
    "@keyframes rgfTwinkle{0%{opacity:0;transform:translate(-50%,-50%) scale(.92)}25%,60%{opacity:.7}90%,100%{opacity:0;transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(1)}}",
    "@keyframes rgfFrame{from{border-color:rgba(201,164,92,0)}to{border-color:rgba(201,164,92,.55)}}",
    ".rgf-in .rgf-pop-frame{animation:rgfFrame 1.8s ease .6s both}",
    ".rgf-in .rgf-pop-frame>*{animation:rgfUp 1.1s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(.6s + var(--i) * 90ms)}",
    ".rgf-in .rgf-pop-frame>.rgf-pop-rule{animation-name:rgfDraw;animation-duration:1.5s}",
    ".rgf-in .rgf-pop-frame>.rgf-pop-photo{animation:rgfPhoto 1.3s cubic-bezier(.34,1.3,.64,1) both,rgfGlow 6s ease-in-out 2.2s infinite;animation-delay:calc(.6s + var(--i) * 90ms),2.2s}",
    ".rgf-in .rgf-pop-frame>.rgf-pop-title{animation:rgfUp 1.1s cubic-bezier(.16,1,.3,1) both,rgfShine 2.6s ease-in-out both;animation-delay:calc(.6s + var(--i) * 90ms),1.6s}",
    "@media (prefers-reduced-motion:reduce){.rgf-pop-overlay,.rgf-pop-overlay.rgf-in{transition:opacity .2s;-webkit-backdrop-filter:none;backdrop-filter:none}.rgf-in .rgf-pop,.rgf-in .rgf-pop-frame,.rgf-in .rgf-pop-frame>*{animation:none!important;opacity:1}.rgf-pop-bokeh{display:none}}"
  ].join("");
  document.head.appendChild(css);

  function drift() {
    var dx = (Math.random() < 0.5 ? -1 : 1) * (7 + Math.random() * 7);
    var dy = (Math.random() - 0.5) * 12;
    return "--dx:" + dx.toFixed(1) + "cqw;--dy:" + dy.toFixed(1) + "cqw";
  }
  function dot(cls, b) {
    var p = spot();
    return '<span class="' + cls + '" style="left:' + p[0] + '%;top:' + p[1] + ';width:' + b[0] + 'cqw;--d:' + b[1] + 's;--o:' + b[2] + 's;' + drift() + '"></span>';
  }

  var overlay = document.createElement("div");
  overlay.className = "rgf-pop-overlay";
  overlay.innerHTML =
    '<div class="rgf-pop" role="dialog" aria-modal="true" aria-labelledby="rgf-pop-title">' +
    '<div class="rgf-pop-frame">' +
      '<div class="rgf-pop-bokeh" aria-hidden="true">' +
        ORBS.map(function (b) { return dot("rgf-pop-orb", b); }).join("") +
        SPARKS.map(function (b) { return dot("rgf-pop-spark", b); }).join("") +
      '</div>' +
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
  for (var i = 0, n = 0; i < kids.length; i++) {
    if (!kids[i].classList.contains("rgf-pop-bokeh")) kids[i].style.setProperty("--i", n++);
  }

  // Each time a light finishes fading out, move it to a new spot
  overlay.querySelector(".rgf-pop-bokeh").addEventListener("animationiteration", function (e) {
    var p = spot();
    e.target.style.left = p[0] + "%";
    e.target.style.top = p[1];
    var d = drift().split(";");
    e.target.style.setProperty("--dx", d[0].split(":")[1]);
    e.target.style.setProperty("--dy", d[1].split(":")[1]);
  });

  function close() {
    try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
    overlay.classList.add("rgf-out");
    document.removeEventListener("keydown", onKey);
    window.removeEventListener("resize", fit);
    setTimeout(function () { overlay.remove(); }, 400);
  }
  function onKey(e) { if (e.key === "Escape") close(); }

  overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
  overlay.querySelector(".rgf-pop-x").addEventListener("click", close);
  overlay.querySelector(".rgf-pop-continue").addEventListener("click", close);
  document.addEventListener("keydown", onKey);

  // Largest spacing (--k between 0 and 1) at which the card needs no scrolling
  var pop = overlay.querySelector(".rgf-pop");
  function fits(k) { pop.style.setProperty("--k", k); return pop.scrollHeight <= pop.clientHeight + 1; }
  function fit() {
    if (fits(1)) return;
    var lo = 0, hi = 1;
    for (var i = 0; i < 7; i++) { var mid = (lo + hi) / 2; if (fits(mid)) lo = mid; else hi = mid; }
    fits(lo);
  }

  function show() {
    document.body.appendChild(overlay);
    fit();
    window.addEventListener("resize", fit);
    // Measure again once the fonts and images arrive (the logo has no height until it loads)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    [].forEach.call(overlay.querySelectorAll("img"), function (img) { img.addEventListener("load", fit); });
    requestAnimationFrame(function () { overlay.classList.add("rgf-in"); });
    overlay.querySelector(".rgf-pop-x").focus();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", show);
  else show();
})();
