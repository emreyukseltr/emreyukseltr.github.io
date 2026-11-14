/* EY Studios service worker: bağlantı dalgalanmasında sayfaların ve görsellerin bozulmaması için.
   - Sayfalar: önce ağdan (her zaman en güncel hali), olmazsa 4 sn boyunca saniyede bir tekrar dene,
     yine olmazsa son kaydedilen hali, o da yoksa "bağlantı yok" sayfası.
   - Görsel, yazı tipi, betik: kayıtlıysa hemen kayıttan ver, arkada ağdan tazele.
   - Video ve dış servisler (WhatsApp, harita, ödeme) hiç ellenmez.
   Acil kapatma: bu dosyanın tamamını şu satırla değiştirip yayınlamak yeterli:
   self.addEventListener('install',()=>self.skipWaiting());self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.map(x=>caches.delete(x)))).then(()=>self.registration.unregister())));
*/
var VER = 'ey-v2';
var PAGES = VER + '-pages', ASSETS = VER + '-assets';
var FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.jsdelivr.net'];

self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf(VER) !== 0; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
function fetchRetry(req, tries, gap) {
  return fetch(req).catch(function (err) {
    if (tries <= 1) throw err;
    return wait(gap).then(function () { return fetchRetry(req, tries - 1, gap); });
  });
}
function trim(name, max) {
  caches.open(name).then(function (c) {
    c.keys().then(function (keys) { if (keys.length > max) Promise.all(keys.slice(0, keys.length - max).map(function (k) { return c.delete(k); })); });
  });
}

var OFFLINE = '<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bağlantı bekleniyor</title>' +
  '<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0B1220;color:#E8ECF4;font:16px/1.6 system-ui,-apple-system,Segoe UI,sans-serif;text-align:center;padding:24px}' +
  'h1{font-size:1.4rem;margin:0 0 .5rem}p{color:#9AA6BB;margin:0 0 1.4rem}button{font:600 1rem system-ui,sans-serif;padding:.9rem 1.6rem;border:0;border-radius:12px;background:#38D6FF;color:#06121F;cursor:pointer}</style></head>' +
  '<body><main><h1>İnternet bağlantısı bekleniyor</h1><p>Bağlantınız geri gelince sayfa kendiliğinden açılacak.</p><button onclick="location.reload()">Tekrar dene</button></main>' +
  '<script>addEventListener("online",function(){location.reload()});setInterval(function(){if(navigator.onLine)fetch(location.href,{cache:"no-store"}).then(function(r){if(r.ok)location.reload()}).catch(function(){})},5000)</script></body></html>';

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  var same = url.origin === self.location.origin;

  /* Sayfalar */
  if (req.mode === 'navigate' && same) {
    e.respondWith(fetchRetry(req, 5, 1000).then(function (res) {
      if (res.ok) { var copy = res.clone(); caches.open(PAGES).then(function (c) { c.put(req, copy); trim(PAGES, 60); }); }
      return res;
    }).catch(function () {
      return caches.open(PAGES).then(function (c) {
        return c.match(req).then(function (hit) { return hit || c.match(req, { ignoreSearch: true }); });
      }).then(function (hit) {
        return hit || new Response(OFFLINE, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
      });
    }));
    return;
  }

  /* Videolar ve parça parça istenen dosyalar: dokunma */
  if (req.headers.get('range') || /\.(mp4|webm|mov)$/i.test(url.pathname)) return;

  /* Kendi görsellerimiz, yazı tiplerimiz, betiklerimiz + Google yazı tipleri */
  var font = FONT_HOSTS.indexOf(url.hostname) >= 0;
  if (!(same || font)) return;
  if (same && /\.(html?|json|txt|xml)$/i.test(url.pathname)) return; /* veri dosyaları her zaman ağdan */
  e.respondWith(caches.open(ASSETS).then(function (c) {
    return c.match(req).then(function (hit) {
      var net = fetchRetry(req, 2, 1200).then(function (res) {
        if (res.ok && (res.type === 'basic' || res.type === 'cors')) { c.put(req, res.clone()); trim(ASSETS, 250); }
        return res;
      });
      /* Yazı tipleri değişmez: kayıttan ver. Kendi dosyalarımız: önce ağ (güncel kalsın),
         ağ hata verir ya da 4 sn'de cevap gelmezse kayıttaki kopya. */
      if (hit && font) { e.waitUntil(net.catch(function () {})); return hit; }
      if (!hit) return net;
      e.waitUntil(net.catch(function () {}));
      return Promise.race([net.then(function (res) { return res.ok ? res : hit; }, function () { return hit; }), wait(4000).then(function () { return hit; })]);
    });
  }));
});
