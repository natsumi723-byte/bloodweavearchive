(function (window, document, measurementId) {
  "use strict";

  // Keep this initializer safe if it is included more than once.
  if (window.__bloodweaveAnalyticsLoaded) return;
  window.__bloodweaveAnalyticsLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", measurementId);

  var script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
  document.head.appendChild(script);
})(window, document, "G-DLK3D1XYYM");
