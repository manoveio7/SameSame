// Nombre del caché (puedes dejarlo vacío o con un nombre genérico)
const CACHE_NAME = 'FutbolBoton';

// No listamos assets porque quieres que cargue online
const ASSETS_TO_CACHE = [];

// Instalación: Solo se activa para cumplir el requisito de PWA
self.addEventListener('install', (event) => {
    self.skipWaiting();
    console.log('SW: Instalado (Modo Online)');
});

// Activación: Toma el control de la página inmediatamente
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Interceptamos las peticiones pero las mandamos directo a la RED
self.addEventListener('fetch', (event) => {
    // No busca en caché, va directo a internet
    event.respondWith(fetch(event.request));
});
