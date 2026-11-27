// Piksel Lig service worker — ÇEVRİMDIŞI MOD: ilk açılışta oyun dosyaları önbelleğe alınır; internet yoksa önbellekten açılır.
// Sayfa: önce ağ (3 sn zaman aşımı) → yoksa önbellek. Diğer dosyalar ve yazı tipleri: önce önbellek → yoksa ağ (ve kaydet).
const C='pikselig-v1016k';
const D=["./", "./index.html", "./PikselLig_Legacy.html", "./manifest.json", "./icon-192.png", "./icon-512.png", "./logo.svg"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(D.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
function kaydet(req,res){if(res&&res.ok&&!res.redirected){const k=res.clone();caches.open(C).then(c=>c.put(req,k)).catch(()=>{});}return res;}
// Yönlendirilmiş yanıt (depo adı değişince GitHub yönlendirir) sayfaya doğrudan verilemez → temiz kopya
function temiz(res){if(!res||!res.redirected)return res;return res.blob().then(b=>new Response(b,{status:res.status,statusText:res.statusText,headers:res.headers}));}
async function onbellek(r){const c=await caches.open(C);return (await c.match(r,{ignoreSearch:true}))||(await c.match('./index.html'))||(await c.match('./'))||(await caches.match(r,{ignoreSearch:true}))||(await caches.match('./index.html',{ignoreSearch:true}));}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin&&!/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname))return;
 const sayfa=r.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname.endsWith('/')||u.pathname.endsWith('version.json');
 if(sayfa){e.respondWith((async()=>{
   const ag=fetch(r).then(res=>{kaydet(r,res);return temiz(res);});
   // 4 sn içinde ağ gelmezse önbellekten aç; önbellek boşsa ağı beklemeye devam et
   const yarisan=new Promise(ok=>setTimeout(async()=>{const x=await onbellek(r);if(x)ok(x);},4000));
   try{return await Promise.race([ag,yarisan]);}catch(err){const x=await onbellek(r);if(x)return x;try{return await fetch(r.url,{cache:'reload'});}catch(e2){return new Response('<meta charset=utf-8><body style="background:#111;color:#eee;font-family:sans-serif;padding:24px">İnternet bağlantısı yok ve oyun henüz önbellekte değil.<br>Bağlanıp sayfayı yenile.<br><br><button onclick="location.reload()">Yenile</button></body>',{status:503,headers:{'Content-Type':'text/html; charset=utf-8'}});}}
 })());return;}
 e.respondWith(caches.match(r).then(x=>x||fetch(r).then(res=>kaydet(r,res)).catch(()=>new Response('',{status:504}))));});
