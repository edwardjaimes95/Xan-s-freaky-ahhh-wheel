const CACHE='xans-wheel-v4-4-inventory';
const FILES=["./", "./index.html", "./manifest.webmanifest","./wheel-options.json", "./icons/icon-192.png", "./icons/icon-512.png", "./assets/rewards/cuddle.png", "./assets/rewards/snack.png", "./assets/rewards/movie.png", "./assets/rewards/massage.png", "./assets/rewards/date.png", "./assets/rewards/mystery.png"];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{if(e.request.method==='GET')e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});