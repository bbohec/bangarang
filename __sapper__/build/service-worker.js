(function () {
	'use strict';

	// This file is generated by Sapper — do not edit it!
	const timestamp = 1618158735416;

	const files = [
		"/service-worker-index.html",
		"/favicon.png",
		"/global.css",
		"/logo-192.png",
		"/logo-512.png",
		"/manifest.json"
	];

	const shell = [
		"/client/client.6b50c6c6.js",
		"/client/index.babc8a07.js",
		"/client/MainMenu.a96ec570.js",
		"/client/WelcomeTitle.e7efe93b.js",
		"/client/GenericButton.78d55fe7.js",
		"/client/Link.5ff131f8.js",
		"/client/links.755f0175.js",
		"/client/linkPrefixes.05019212.js",
		"/client/uiPrimaryAdapter.6369b149.js",
		"/client/GenericTaskNotification.10c71647.js",
		"/client/[valuePropositionPageLink].65424313.js",
		"/client/retreiveValuePropositionFromValuePropositionPageLink.fe1397da.js",
		"/client/valuePropositions.30979aea.js",
		"/client/HeaderTitle.15612b62.js",
		"/client/BusinessModel.fc41cc23.js",
		"/client/DescriptionCard.310837fe.js",
		"/client/SigningInMenu.d1a391b7.js",
		"/client/currentClaimIdStore.51b8328f.js",
		"/client/DeclareClaim.e383ea52.js",
		"/client/[landingPageId].c89384d4.js",
		"/client/MainTitle.c586ef69.js",
		"/client/LeanCanvas.48186e1f.js",
		"/client/[claimId].63c0b5c2.js"
	];

	const ASSETS = `cache${timestamp}`;
	// `shell` is an array of all the files generated by the bundler,
	// `files` is an array of everything in the `static` directory
	const to_cache = shell.concat(files);
	const staticAssets = new Set(to_cache);
	// @ts-ignore
	self.addEventListener('install', (event) => {
	    event.waitUntil(caches
	        .open(ASSETS)
	        .then(cache => cache.addAll(to_cache))
	        .then(() => {
	        self.skipWaiting();
	    }));
	});
	// @ts-ignore
	self.addEventListener('activate', (event) => {
	    event.waitUntil(caches.keys().then(async (keys) => {
	        // delete old caches
	        for (const key of keys) {
	            if (key !== ASSETS)
	                await caches.delete(key);
	        }
	        self.clients.claim();
	    }));
	});
	/**
	 * Fetch the asset from the network and store it in the cache.
	 * Fall back to the cache if the user is offline.
	 */
	async function fetchAndCache(request) {
	    const cache = await caches.open(`offline${timestamp}`);
	    try {
	        const response = await fetch(request);
	        cache.put(request, response.clone());
	        return response;
	    }
	    catch (err) {
	        const response = await cache.match(request);
	        if (response)
	            return response;
	        throw err;
	    }
	}
	// @ts-ignore
	self.addEventListener('fetch', (event) => {
	    if (event.request.method !== 'GET' || event.request.headers.has('range'))
	        return;
	    const url = new URL(event.request.url);
	    // don't try to handle e.g. data: URIs
	    const isHttp = url.protocol.startsWith('http');
	    const isDevServerRequest = url.hostname === self.location.hostname && url.port !== self.location.port;
	    const isStaticAsset = url.host === self.location.host && staticAssets.has(url.pathname);
	    const skipBecauseUncached = event.request.cache === 'only-if-cached' && !isStaticAsset;
	    if (isHttp && !isDevServerRequest && !skipBecauseUncached) {
	        event.respondWith((async () => {
	            // always serve static files and bundler-generated assets from cache.
	            // if your application has other URLs with data that will never change,
	            // set this variable to true for them and they will only be fetched once.
	            const cachedAsset = isStaticAsset && await caches.match(event.request);
	            // for pages, you might want to serve a shell `service-worker-index.html` file,
	            // which Sapper has generated for you. It's not right for every
	            // app, but if it's right for yours then uncomment this section
	            /*
	            if (!cachedAsset && url.origin === self.origin && routes.find(route => route.pattern.test(url.pathname))) {
	                return caches.match('/service-worker-index.html');
	            }
	            */
	            return cachedAsset || fetchAndCache(event.request);
	        })());
	    }
	});

}());
