!function(){"use strict";
/*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */function e(e,n,t,i){return new(t||(t=Promise))((function(c,s){function o(e){try{l(i.next(e))}catch(e){s(e)}}function a(e){try{l(i.throw(e))}catch(e){s(e)}}function l(e){var n;e.done?c(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(o,a)}l((i=i.apply(e,n||[])).next())}))}const n=1613123332183,t=`cache${n}`,i=["/client/client.41b5c719.js","/client/index.4e54cd59.js","/client/MainMenu.2d2bdcfe.js","/client/links.e56aeae5.js","/client/Link.d7969823.js","/client/claims.b4780f82.js","/client/[valuePropositionPageLink].11744351.js","/client/HeaderTitle.195bc548.js","/client/retreiveValuePropositionFromValuePropositionPageLink.64de19e0.js","/client/valuePropositions.f31230f0.js","/client/BusinessModel.3f82a5c7.js","/client/DescriptionCard.e625904b.js","/client/LandingPageModel.dbba6e17.js","/client/MainTitle.49d8846e.js","/client/MainSubTitle.55b4abd9.js","/client/GenericButton.eeb38898.js","/client/[landingPageId].04a91891.js","/client/LeanCanvas.25e58c4e.js","/client/[claimId].440dd03c.js"].concat(["/service-worker-index.html","/favicon.png","/global.css","/logo-192.png","/logo-512.png","/manifest.json"]),c=new Set(i);self.addEventListener("install",(e=>{e.waitUntil(caches.open(t).then((e=>e.addAll(i))).then((()=>{self.skipWaiting()})))})),self.addEventListener("activate",(n=>{n.waitUntil(caches.keys().then((n=>e(void 0,void 0,void 0,(function*(){for(const e of n)e!==t&&(yield caches.delete(e));self.clients.claim()})))))})),self.addEventListener("fetch",(t=>{if("GET"!==t.request.method||t.request.headers.has("range"))return;const i=new URL(t.request.url),s=i.protocol.startsWith("http"),o=i.hostname===self.location.hostname&&i.port!==self.location.port,a=i.host===self.location.host&&c.has(i.pathname),l="only-if-cached"===t.request.cache&&!a;!s||o||l||t.respondWith(e(void 0,void 0,void 0,(function*(){return a&&(yield caches.match(t.request))||function(t){return e(this,void 0,void 0,(function*(){const e=yield caches.open(`offline${n}`);try{const n=yield fetch(t);return e.put(t,n.clone()),n}catch(n){const i=yield e.match(t);if(i)return i;throw n}}))}(t.request)})))}))}();
