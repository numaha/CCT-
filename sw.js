var V='cct-v1',FILES=['./','./index.html'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(FILES);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==V;}).map(function(x){return caches.delete(x);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  var u=new URL(e.request.url);
  if(u.origin===location.origin){
    e.respondWith(fetch(e.request).then(function(r){var c=r.clone();caches.open(V).then(function(ch){ch.put(e.request,c);});return r;}).catch(function(){return caches.match(e.request).then(function(m){return m||caches.match('./index.html');});}));
  }else if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.match(e.request).then(function(m){return m||fetch(e.request).then(function(r){var c=r.clone();caches.open(V).then(function(ch){ch.put(e.request,c);});return r;}).catch(function(){return m;});}));
  }
});
