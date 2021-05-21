(function () {
	'use strict';

	// This file is generated by Sapper — do not edit it!
	const timestamp = 1621603499605;

	const files = [
		"/service-worker-index.html",
		"/favicon.png",
		"/global.css",
		"/logo-192.png",
		"/logo-512.png",
		"/manifest.json"
	];

	const shell = [
		"/client/client.e1e72227.js",
		"/client/index.6bec249d.js",
		"/client/MainMenu.32013b86.js",
		"/client/messages.faeedc32.js",
		"/client/WelcomeTitle.110c64e4.js",
		"/client/NavigateToBusinessModel.846abb08.js",
		"/client/GenericTaskNotification.7a0c0d03.js",
		"/client/GenericInteractiveAction.d16bf3ce.js",
		"/client/LanguageSelect.d9dc4cb3.js",
		"/client/MainTitle.e91ccb54.js",
		"/client/Link.2cb40d65.js",
		"/client/index.f03a4aa1.js",
		"/client/[valuePropositionPageLink].dee3de8f.js",
		"/client/retreiveValuePropositionFromValuePropositionPageLink.bb9445a6.js",
		"/client/HeaderTitle.082f43c1.js",
		"/client/NavigateToLeanCanvas.04785c45.js",
		"/client/NavigateToMainMenu.eda30e2d.js",
		"/client/BusinessModel.6421eb63.js",
		"/client/DescriptionCard.9934b399.js",
		"/client/NavigateBackToMainMenu.68a678bd.js",
		"/client/SigningInMenu.09bbddba.js",
		"/client/currentClaimIdStore.f05ab720.js",
		"/client/GenericPasswordField.7a1e4012.js",
		"/client/GenericSubmitField.2e0c8204.js",
		"/client/DeclareClaim.3049dde1.js",
		"/client/DeclaringInformation.7c22fa8c.js",
		"/client/[landingPageId].2f561fdb.js",
		"/client/GenericButton.ce41de11.js",
		"/client/LeanCanvas.b8767800.js",
		"/client/Register.4f568aaa.js",
		"/client/[claimId].0ff43ef1.js"
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
