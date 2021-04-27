(function () {
	'use strict';

	// This file is generated by Sapper — do not edit it!
	const timestamp = 1619512661968;

	const files = [
		"/service-worker-index.html",
		"/favicon.png",
		"/global.css",
		"/logo-192.png",
		"/logo-512.png",
		"/manifest.json"
	];

	const shell = [
		"/client/client.3facbb79.js",
		"/client/index.940c46ad.js",
		"/client/MainMenu.fd6574f7.js",
		"/client/messages.b960b51f.js",
		"/client/WelcomeTitle.276f48df.js",
		"/client/NavigateToBusinessModel.6685d6bd.js",
		"/client/GenericTaskNotification.a5435f50.js",
		"/client/GenericDestination.167ce69c.js",
		"/client/LanguageSelect.5b145da5.js",
		"/client/MainTitle.d6d0d9cc.js",
		"/client/Link.e1ccc300.js",
		"/client/index.8222db49.js",
		"/client/[valuePropositionPageLink].14640a98.js",
		"/client/retreiveValuePropositionFromValuePropositionPageLink.e44342b8.js",
		"/client/HeaderTitle.88d32fad.js",
		"/client/BusinessModel.4c2f3745.js",
		"/client/DescriptionCard.93942b1a.js",
		"/client/NavigateBackToMainMenu.f07bdcc4.js",
		"/client/SigningInMenu.21c613cd.js",
		"/client/currentClaimIdStore.d10eaefa.js",
		"/client/GenericPasswordField.855f0e6f.js",
		"/client/GenericSubmitField.dc1f62e6.js",
		"/client/DeclareClaim.5762dd44.js",
		"/client/DeclaringInformation.01213a43.js",
		"/client/[landingPageId].9957bbfb.js",
		"/client/GenericButton.c2fe8317.js",
		"/client/LeanCanvas.f56ce348.js",
		"/client/Register.fb377bc0.js",
		"/client/[claimId].5da1ec2d.js"
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
