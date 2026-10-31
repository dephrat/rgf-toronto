/*
 * Demo site only (not part of the client install): picks which popup version
 * to show and draws a small version switch in the corner.
 *   ?v=original  the popup before the skyline and hotel frame
 *   ?v=skyline   the current popup (default)
 * Opening a link with ?v= always shows that popup again.
 */
(function () {
  var VERSIONS = {
    original: { src: "/toronto/toronto-popup-original.js", label: "Original" },
    skyline: { src: "/toronto/toronto-popup.js", label: "Toronto + Ritz" }
  };
  var params = new URLSearchParams(location.search);
  var v = params.get("v");
  try {
    if (VERSIONS[v]) {
      sessionStorage.setItem("rgfDemoVersion", v);
      sessionStorage.removeItem("rgfTorontoPopupClosed");
      sessionStorage.removeItem("rgfTorontoPopupClosedOriginal");
    } else {
      v = sessionStorage.getItem("rgfDemoVersion");
    }
  } catch (e) {}
  if (!VERSIONS[v]) v = "skyline";

  var s = document.createElement("script");
  s.src = VERSIONS[v].src;
  document.body.appendChild(s);

  var bar = document.createElement("div");
  bar.className = "demo-switch";
  bar.innerHTML = "<span>Popup version</span>" + Object.keys(VERSIONS).map(function (k) {
    return '<a href="/?v=' + k + '"' + (k === v ? ' aria-current="true"' : "") + ">" + VERSIONS[k].label + "</a>";
  }).join("");
  document.body.appendChild(bar);
})();
