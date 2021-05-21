(function () {
	'use strict';

	// This file is generated by Sapper — do not edit it!
	const timestamp = 1621600047220;

	const files = [
		"/service-worker-index.html",
		"/favicon.png",
		"/global.css",
		"/logo-192.png",
		"/logo-512.png",
		"/manifest.json"
	];

	const shell = [
		"/client/client.52d226a5.js",
		"/client/index.5fc67446.js",
		"/client/MainMenu.335eb50c.js",
		"/client/messages.75bb8d36.js",
		"/client/WelcomeTitle.150682bd.js",
		"/client/NavigateToBusinessModel.f4f48c4c.js",
		"/client/GenericTaskNotification.c0f781c8.js",
		"/client/GenericInteractiveAction.98afc4d1.js",
		"/client/LanguageSelect.d2aded10.js",
		"/client/MainTitle.bcaee660.js",
		"/client/Link.3494b161.js",
		"/client/index.cb823844.js",
		"/client/[valuePropositionPageLink].12243324.js",
		"/client/retreiveValuePropositionFromValuePropositionPageLink.e70b5825.js",
		"/client/HeaderTitle.81f67bf3.js",
		"/client/NavigateToLeanCanvas.b076c479.js",
		"/client/NavigateToMainMenu.4a9404b2.js",
		"/client/BusinessModel.bf09fb40.js",
		"/client/DescriptionCard.f4f1aea6.js",
		"/client/NavigateBackToMainMenu.515fc761.js",
		"/client/SigningInMenu.65925ac1.js",
		"/client/currentClaimIdStore.1c12a913.js",
		"/client/GenericPasswordField.e27d3f9e.js",
		"/client/GenericSubmitField.91b2bfc9.js",
		"/client/DeclareClaim.5b32ef0a.js",
		"/client/DeclaringInformation.9cf8da3d.js",
		"/client/[landingPageId].6ca82f8a.js",
		"/client/GenericButton.4d547373.js",
		"/client/LeanCanvas.fd1d3861.js",
		"/client/Register.0cc5825d.js",
		"/client/[claimId].2941b613.js"
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
