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

// --- 2. Estratégia de Cache (Network Falling Back to Cache) ---
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
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
    const hotelId = event.tag.split(':')[1];
    event.waitUntil(syncNoteToServer(hotelId));
  }
});

async function syncNoteToServer(hotelId) {
    console.log(`[Background Sync] Sincronizando nota para o hotel ${hotelId}...`);
    // Em um app real, você leria a nota do IndexedDB e enviaria para o servidor.
    // Aqui, apenas simulamos o sucesso.
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    console.log(`[Background Sync] Nota para ${hotelId} sincronizada com sucesso!`);
    
    self.registration.showNotification('Sincronização Completa', {
        body: `Sua anotação para o hotel foi salva.`,
        icon: 'https://placehold.co/192x192/4f46e5/ffffff?text=H'
    });
}


// --- 6. Manipulador de Periodic Background Sync ---
self.addEventListener('periodicsync', event => {
  if (event.tag === 'fetch-hotels-periodically') {
    console.log('[Periodic Sync] Buscando hotéis em segundo plano...');
    // Aqui você poderia buscar novos dados e atualizar o cache.
    event.waitUntil(
        console.log('[Periodic Sync] Tarefa concluída.')
    );
  }
});

