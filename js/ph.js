// Explicit store-click analytics only. No SDK, cookies, local storage, page-view
// capture, session recording, or person profile is used on the website.
var POSTHOG_KEY = 'phc_wRz5xJg9EYqBMPUZ7NzUMVeUs9aVGrCJLVAVeLXWHPG9';
var analyticsPageId = window.crypto && window.crypto.randomUUID
  ? window.crypto.randomUUID()
  : String(Date.now()) + '-' + Math.random().toString(36).slice(2);

function captureStoreClick(eventName) {
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;

  // PostHog's public API accepts anonymous events directly. keepalive lets the
  // request finish while the browser follows the store link.
  fetch('https://eu.i.posthog.com/i/v0/e/', {
    method: 'POST',
    keepalive: true,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      api_key: POSTHOG_KEY,
      distinct_id: analyticsPageId,
      event: eventName,
      properties: {
        '$process_person_profile': false,
        '$current_url': window.location.href
      }
    })
  }).catch(function () {});
}

function attachStoreAnalytics(selector, goatPath, posthogEvent) {
  document.querySelectorAll(selector).forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.goatcounter && window.goatcounter.count) {
        window.goatcounter.count({path: goatPath, event: true});
      }
      captureStoreClick(posthogEvent);
    });
  });
}

attachStoreAnalytics('.play-link', 'play-store-click', 'play_store_click');
attachStoreAnalytics('.app-store-link', 'app-store-click', 'app_store_click');
