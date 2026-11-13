// Piksel Lig service worker — ÇEVRİMDIŞI MOD: ilk açılışta oyun dosyaları önbelleğe alınır; internet yoksa önbellekten açılır.
// Sayfa: önce ağ (3 sn zaman aşımı) → yoksa önbellek. Diğer dosyalar ve yazı tipleri: önce önbellek → yoksa ağ (ve kaydet).
const C='pikselig-v9c5';
const D=["./", "./index.html", "./PikselLig_Legacy.html", "./manifest.json", "./icon-192.png", "./icon-512.png", "./logo.svg"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(D.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
function kaydet(req,res){if(res&&(res.ok||res.type==='opaque')){const k=res.clone();caches.open(C).then(c=>c.put(req,k));}return res;}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 const sayfa=r.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname.endsWith('/')||u.pathname.endsWith('version.json');
 if(sayfa){e.respondWith(new Promise(ok=>{let bitti=false;const yedek=()=>caches.match(r,{ignoreSearch:true}).then(x=>x||caches.match('./index.html')||caches.match('./'));
   const t=setTimeout(()=>{if(!bitti){bitti=true;yedek().then(ok);}},3000);
   fetch(r).then(res=>{clearTimeout(t);kaydet(r,res);if(!bitti){bitti=true;ok(res);}}).catch(()=>{clearTimeout(t);if(!bitti){bitti=true;yedek().then(x=>ok(x||new Response('Çevrimdışı',{status:503})));}});}));return;}
 e.respondWith(caches.match(r).then(x=>x||fetch(r).then(res=>kaydet(r,res)).catch(()=>new Response('',{status:504}))));});
