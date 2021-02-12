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
    ***************************************************************************** */function e(e,n,t,i){return new(t||(t=Promise))((function(c,s){function o(e){try{l(i.next(e))}catch(e){s(e)}}function a(e){try{l(i.throw(e))}catch(e){s(e)}}function l(e){var n;e.done?c(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(o,a)}l((i=i.apply(e,n||[])).next())}))}const n=1613142414984,t=`cache${n}`,i=["/client/client.252bc812.js","/client/index.bcf6a14b.js","/client/MainMenu.54f86d5e.js","/client/links.e56aeae5.js","/client/Link.0fec73c0.js","/client/claims.b9913f08.js","/client/[valuePropositionPageLink].14174d85.js","/client/HeaderTitle.8155b64b.js","/client/retreiveValuePropositionFromValuePropositionPageLink.15972755.js","/client/valuePropositions.30979aea.js","/client/BusinessModel.2b4bc9fa.js","/client/DescriptionCard.60a304b4.js","/client/LandingPageModel.bfa9305e.js","/client/MainTitle.caf56c75.js","/client/MainSubTitle.59a35f97.js","/client/GenericButton.d1f62b58.js","/client/[landingPageId].3a9c3545.js","/client/LeanCanvas.f8dcb512.js","/client/[claimId].cc60b34f.js"].concat(["/service-worker-index.html","/favicon.png","/global.css","/logo-192.png","/logo-512.png","/manifest.json"]),c=new Set(i);self.addEventListener("install",(e=>{e.waitUntil(caches.open(t).then((e=>e.addAll(i))).then((()=>{self.skipWaiting()})))})),self.addEventListener("activate",(n=>{n.waitUntil(caches.keys().then((n=>e(void 0,void 0,void 0,(function*(){for(const e of n)e!==t&&(yield caches.delete(e));self.clients.claim()})))))})),self.addEventListener("fetch",(t=>{if("GET"!==t.request.method||t.request.headers.has("range"))return;const i=new URL(t.request.url),s=i.protocol.startsWith("http"),o=i.hostname===self.location.hostname&&i.port!==self.location.port,a=i.host===self.location.host&&c.has(i.pathname),l="only-if-cached"===t.request.cache&&!a;!s||o||l||t.respondWith(e(void 0,void 0,void 0,(function*(){return a&&(yield caches.match(t.request))||function(t){return e(this,void 0,void 0,(function*(){const e=yield caches.open(`offline${n}`);try{const n=yield fetch(t);return e.put(t,n.clone()),n}catch(n){const i=yield e.match(t);if(i)return i;throw n}}))}(t.request)})))}))}();
