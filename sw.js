const CACHE_NAME = 'hotel-hunter-cache-v2';
const urlsToCache = [
  '/',
  '/index.html'
];

// --- 1. Instalação e Cache do App Shell ---
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// --- 2. Estratégia de Cache (Cache First) ---
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// --- 3. Ativação e Limpeza de Caches Antigos ---
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// --- 4. Manipulador de Push Notifications ---
self.addEventListener('push', event => {
  const title = 'Hotel Hunter';
  const options = {
    body: event.data ? event.data.text() : 'Você tem uma nova notificação!',
    icon: 'https://placehold.co/192x192/4f46e5/ffffff?text=H',
    badge: 'https://placehold.co/96x96/4f46e5/ffffff?text=H'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});


// --- 5. Manipulador de Background Sync ---
self.addEventListener('sync', event => {
  console.log('Evento de Sync recebido!', event.tag);
  if (event.tag.startsWith('sync-note:')) {
    // Em uma aplicação real, aqui você leria os dados do IndexedDB
    // e os enviaria para o servidor.
    // Como não temos servidor, vamos simular com um log.
    const hotelId = event.tag.split(':')[1];
    event.waitUntil(
        syncNoteToServer(hotelId)
    );
  }
});

async function syncNoteToServer(hotelId) {
    console.log(`[Background Sync] Sincronizando nota para o hotel ${hotelId}...`);
    // Simulação de uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    console.log(`[Background Sync] Nota para ${hotelId} sincronizada com sucesso!`);
    
    // Opcional: mostrar uma notificação de sucesso
    self.registration.showNotification('Sincronização Completa', {
        body: `Sua nota para o hotel ${hotelId} foi salva no servidor.`,
        icon: 'https://placehold.co/192x192/4f46e5/ffffff?text=H'
    });
}


// --- 6. Manipulador de Periodic Background Sync ---
self.addEventListener('periodicsync', event => {
  if (event.tag === 'fetch-hotels-periodically') {
    console.log('[Periodic Sync] Buscando hotéis em segundo plano...');
    // Em uma aplicação real, você faria a chamada à API aqui
    // e atualizaria o cache ou o IndexedDB.
    event.waitUntil(
        // Exemplo: fetchAndUpdateCache()
        console.log('[Periodic Sync] Tarefa concluída.')
    );
  }
});

