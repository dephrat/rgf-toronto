/*
 * Demo site only (not part of the client install): picks which popup version
 * to show and draws a small version switch in the corner.
 *   ?v=original  v1: the popup before the skyline and hotel frame
 *   ?v=skyline   v2: gold skyline, Ritz tower and hotel frame
 *   ?v=v3        v3: Ritz-Carlton / Toronto photo, bokeh, slower reveal
 *   ?v=v4        v4: v3 matched to the reference video
 *   ?v=v5        v5: v4 tightened to fit the longer statement (default)
 * Opening a link with ?v= always shows that popup again.
 */
(function () {
  var VERSIONS = {
    original: { src: "/toronto/toronto-popup-original.js", label: "V1 Original" },
    skyline: { src: "/toronto/toronto-popup.js", label: "V2 Skyline" },
    v3: { src: "/toronto/toronto-popup-v3.js", label: "V3 Photo" },
    v4: { src: "/toronto/toronto-popup-v4.js", label: "V4 Matched" },
    v5: { src: "/toronto/toronto-popup-v5.js", label: "V5 Fitted" }
  };
  var params = new URLSearchParams(location.search);
  var v = params.get("v");
  try {
    if (VERSIONS[v]) {
      sessionStorage.setItem("rgfDemoVersion", v);
      sessionStorage.removeItem("rgfTorontoPopupClosed");
      sessionStorage.removeItem("rgfTorontoPopupClosedOriginal");
      sessionStorage.removeItem("rgfTorontoPopupClosedV3");
      sessionStorage.removeItem("rgfTorontoPopupClosedV4");
      sessionStorage.removeItem("rgfTorontoPopupClosedV5");
    } else {
      v = sessionStorage.getItem("rgfDemoVersion");
    }
  } catch (e) {}
  if (!VERSIONS[v]) v = "v5";

  var s = document.createElement("script");
  s.src = VERSIONS[v].src + "?b=20261101e";   // bump with each deploy so phones skip stale cached copies
  document.body.appendChild(s);

  var bar = document.createElement("div");
  bar.className = "demo-switch";
  bar.innerHTML = "<span>Popup version</span>" + Object.keys(VERSIONS).map(function (k) {
    var parts = VERSIONS[k].label.split(" ");   // "V4 Matched" -> short "V4" + long " Matched"
    return '<a href="/?v=' + k + '"' + (k === v ? ' aria-current="true"' : "") + ">" + parts[0] +
      '<span class="long"> ' + parts.slice(1).join(" ") + "</span></a>";
  }).join("");
  document.body.appendChild(bar);

  // Plain copy in the page under the menu, in case a phone hides the floating bar
  var row = document.createElement("div");
  row.className = "demo-row";
  row.innerHTML = "Popup version: " + Object.keys(VERSIONS).map(function (k) {
    return '<a href="/?v=' + k + '"' + (k === v ? ' aria-current="true"' : "") + ">" + VERSIONS[k].label + "</a>";
  }).join("");
  var header = document.querySelector("header");
  if (header) header.insertAdjacentElement("afterend", row);
})();
