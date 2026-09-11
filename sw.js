const CACHE='judo-timer-v5';
const CORE=['./manifest.webmanifest','./icon.svg','./audio/three.mp3','./audio/two.mp3','./audio/one.mp3'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  if(e.request.mode==='navigate'){
    e.respondWith(
      fetch(e.request).then(res=>{
        const copy=res.clone();
        caches.open(CACHE).then(c=>c.put('./index.html',copy));
        return res;
      }).catch(()=>caches.match('./index.html'))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached=>cached||fetch(e.request).then(res=>{
      const copy=res.clone();
      caches.open(CACHE).then(c=>c.put(e.request,copy));
      return res;
    }))
  );
});