var app=function(){"use strict";function t(){}function n(t){return t()}function e(){return Object.create(null)}function r(t){t.forEach(n)}function o(t){return"function"==typeof t}function s(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function c(n,e,r){n.$$.on_destroy.push(function(n,...e){if(null==n)return t;const r=n.subscribe(...e);return r.unsubscribe?()=>r.unsubscribe():r}(e,r))}function a(t,n){t.appendChild(n)}function u(t,n,e){t.insertBefore(n,e||null)}function i(t){t.parentNode.removeChild(t)}function l(t){return document.createElement(t)}function f(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function d(t){return document.createTextNode(t)}function m(){return d(" ")}function g(t,n,e,r){return t.addEventListener(n,e,r),()=>t.removeEventListener(n,e,r)}function $(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function p(t,n){t.value=null==n?"":n}let h;function x(t){h=t}function b(t){(function(){if(!h)throw new Error("Function called outside component initialization");return h})().$$.after_update.push(t)}const w=[],y=[],k=[],v=[],_=Promise.resolve();let E=!1;function C(t){k.push(t)}let A=!1;const B=new Set;function N(){if(!A){A=!0;do{for(let t=0;t<w.length;t+=1){const n=w[t];x(n),O(n.$$)}for(x(null),w.length=0;y.length;)y.pop()();for(let t=0;t<k.length;t+=1){const n=k[t];B.has(n)||(B.add(n),n())}k.length=0}while(w.length);for(;v.length;)v.pop()();E=!1,A=!1,B.clear()}}function O(t){if(null!==t.fragment){t.update(),r(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(C)}}const j=new Set;let S;function T(t,n){t&&t.i&&(j.delete(t),t.i(n))}function D(t,n,e,r){if(t&&t.o){if(j.has(t))return;j.add(t),S.c.push((()=>{j.delete(t),r&&(e&&t.d(1),r())})),t.o(n)}}function F(t){t&&t.c()}function G(t,e,s){const{fragment:c,on_mount:a,on_destroy:u,after_update:i}=t.$$;c&&c.m(e,s),C((()=>{const e=a.map(n).filter(o);u?u.push(...e):r(e),t.$$.on_mount=[]})),i.forEach(C)}function L(t,n){const e=t.$$;null!==e.fragment&&(r(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function M(t,n){-1===t.$$.dirty[0]&&(w.push(t),E||(E=!0,_.then(N)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function W(n,o,s,c,a,u,l=[-1]){const f=h;x(n);const d=o.props||{},m=n.$$={fragment:null,ctx:null,props:u,update:t,not_equal:a,bound:e(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(f?f.$$.context:[]),callbacks:e(),dirty:l,skip_bound:!1};let g=!1;if(m.ctx=s?s(n,d,((t,e,...r)=>{const o=r.length?r[0]:e;return m.ctx&&a(m.ctx[t],m.ctx[t]=o)&&(!m.skip_bound&&m.bound[t]&&m.bound[t](o),g&&M(n,t)),e})):[],m.update(),g=!0,r(m.before_update),m.fragment=!!c&&c(m.ctx),o.target){if(o.hydrate){const t=function(t){return Array.from(t.childNodes)}(o.target);m.fragment&&m.fragment.l(t),t.forEach(i)}else m.fragment&&m.fragment.c();o.intro&&T(n.$$.fragment),G(n,o.target,o.anchor),N()}x(f)}class q{$destroy(){L(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(t){var n;this.$$set&&(n=t,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}class z extends q{constructor(t){super(),W(this,t,null,null,s,{})}}function I(n){let e;return{c(){e=l("button"),e.textContent="Declare a new claim",$(e,"class","text-xl mx-5 my-1 min-w-max text-bangarang-dark border border-bangarang-darkEmphasis rounded bg-bangarang-lightEmphasis"),e.disabled=!0},m(t,n){u(t,e,n)},p:t,i:t,o:t,d(t){t&&i(e)}}}class P extends q{constructor(t){super(),W(this,t,null,I,s,{})}}function R(n){let e;return{c(){e=l("a"),e.textContent="What is Bangarang?",$(e,"class","text-xs text-bangarang-darkEmphasis underline "),$(e,"href","/")},m(t,n){u(t,e,n)},p:t,i:t,o:t,d(t){t&&i(e)}}}class H extends q{constructor(t){super(),W(this,t,null,R,s,{})}}function J(n){let e,r,o;return{c(){e=l("p"),e.textContent="Welcome to",r=m(),o=l("h1"),o.textContent="BANGARANG",$(e,"class","text-2xl text-bangarang-darkEmphasis my-1"),$(o,"class","text-4xl text-bangarang-darkEmphasis my-1")},m(t,n){u(t,e,n),u(t,r,n),u(t,o,n)},p:t,i:t,o:t,d(t){t&&i(e),t&&i(r),t&&i(o)}}}class K extends q{constructor(t){super(),W(this,t,null,J,s,{})}}function Q(n){let e;return{c(){e=l("p"),e.textContent="Bangarang is an open source and free direct democratic claim system. It allows anybody to declare or search for claim and claiming for them anonymously.",$(e,"class","text-xs text-bangarang-darkEmphasis my-1")},m(t,n){u(t,e,n)},p:t,i:t,o:t,d(t){t&&i(e)}}}class U extends q{constructor(t){super(),W(this,t,null,Q,s,{})}}const V=[];const X=function(n,e=t){let r;const o=[];function c(t){if(s(n,t)&&(n=t,r)){const t=!V.length;for(let t=0;t<o.length;t+=1){const e=o[t];e[1](),V.push(e,n)}if(t){for(let t=0;t<V.length;t+=2)V[t][0](V[t+1]);V.length=0}}}return{set:c,update:function(t){c(t(n))},subscribe:function(s,a=t){const u=[s,a];return o.push(u),1===o.length&&(r=e(c)||t),s(n),()=>{const t=o.indexOf(u);-1!==t&&o.splice(t,1),0===o.length&&(r(),r=null)}}}}("");function Y(n){let e,r,o;return{c(){e=l("input"),$(e,"class","text-xl text-center mx-5 my-1 text-bangarang-dark placeholder-bangarang-darkEmphasis border-bangarang-lightEmphasis border rounded "),$(e,"type","text"),$(e,"placeholder","Find a claim...")},m(t,s){u(t,e,s),p(e,n[1]),n[3](e),r||(o=g(e,"input",n[2]),r=!0)},p(t,[n]){2&n&&e.value!==t[1]&&p(e,t[1])},i:t,o:t,d(t){t&&i(e),n[3](null),r=!1,o()}}}function Z(t,n,e){let r,o;return c(t,X,(t=>e(1,r=t))),b((()=>{1===r.length&&o.focus()})),[o,r,function(){r=this.value,X.set(r)},function(t){y[t?"unshift":"push"]((()=>{o=t,e(0,o)}))}]}class tt extends q{constructor(t){super(),W(this,t,Z,Y,s,{})}}function nt(n){let e,r,o,s,c,f,d,g,p,h,x,b;return r=new K({}),s=new U({}),d=new tt({}),p=new P({}),x=new H({}),{c(){e=l("div"),F(r.$$.fragment),o=m(),F(s.$$.fragment),c=m(),f=l("div"),F(d.$$.fragment),g=m(),F(p.$$.fragment),h=m(),F(x.$$.fragment),$(e,"class","row-span-5 grid content-center"),$(f,"class","row-span-1 grid content-evenly")},m(t,n){u(t,e,n),G(r,e,null),a(e,o),G(s,e,null),u(t,c,n),u(t,f,n),G(d,f,null),a(f,g),G(p,f,null),a(f,h),G(x,f,null),b=!0},p:t,i(t){b||(T(r.$$.fragment,t),T(s.$$.fragment,t),T(d.$$.fragment,t),T(p.$$.fragment,t),T(x.$$.fragment,t),b=!0)},o(t){D(r.$$.fragment,t),D(s.$$.fragment,t),D(d.$$.fragment,t),D(p.$$.fragment,t),D(x.$$.fragment,t),b=!1},d(t){t&&i(e),L(r),L(s),t&&i(c),t&&i(f),L(d),L(p),L(x)}}}class et extends q{constructor(t){super(),W(this,t,null,nt,s,{})}}function rt(n){let e,r;return{c(){e=f("svg"),r=f("path"),$(r,"stroke-linecap","round"),$(r,"stroke-linejoin","round"),$(r,"stroke-width","2"),$(r,"d","M10 19l-7-7m0 0l7-7m-7 7h18"),$(e,"class","w-4 h-4 mr-1 stroke-current text-bangarang-darkEmphasis"),$(e,"xmlns","http://www.w3.org/2000/svg"),$(e,"fill","none"),$(e,"viewBox","0 0 24 24"),$(e,"stroke","currentColor")},m(t,n){u(t,e,n),a(e,r)},p:t,i:t,o:t,d(t){t&&i(e)}}}class ot extends q{constructor(t){super(),W(this,t,null,rt,s,{})}}function st(n){let e,r,o,s,c,f;return r=new ot({}),{c(){e=l("span"),F(r.$$.fragment),o=l("p"),o.textContent="Back to main menu.",$(o,"class","text-xs text-bangarang-darkEmphasis underline"),$(e,"class","inline-flex items-center px-3")},m(t,i){u(t,e,i),G(r,e,null),a(e,o),s=!0,c||(f=g(o,"click",n[0]),c=!0)},p:t,i(t){s||(T(r.$$.fragment,t),s=!0)},o(t){D(r.$$.fragment,t),s=!1},d(t){t&&i(e),L(r),c=!1,f()}}}function ct(t,n,e){let r;c(t,X,(t=>e(1,r=t)));return[()=>function(t,n,e=n){return t.set(e),n}(X,r="",r)]}class at extends q{constructor(t){super(),W(this,t,ct,st,s,{})}}function ut(t){let n,e,r,o,s,c,f,g,p,h;return f=new tt({}),p=new at({}),{c(){n=l("div"),e=d("TODO\r\n    "),r=l("p"),o=d(t[0]),s=m(),c=l("div"),F(f.$$.fragment),g=m(),F(p.$$.fragment),$(n,"class","row-span-5 grid content-end"),$(c,"class","row-span-1 grid content-end")},m(t,i){u(t,n,i),a(n,e),a(n,r),a(r,o),u(t,s,i),u(t,c,i),G(f,c,null),a(c,g),G(p,c,null),h=!0},p(t,[n]){(!h||1&n)&&function(t,n){n=""+n,t.wholeText!==n&&(t.data=n)}(o,t[0])},i(t){h||(T(f.$$.fragment,t),T(p.$$.fragment,t),h=!0)},o(t){D(f.$$.fragment,t),D(p.$$.fragment,t),h=!1},d(t){t&&i(n),t&&i(s),t&&i(c),L(f),L(p)}}}function it(t,n,e){let r;return c(t,X,(t=>e(0,r=t))),[r]}class lt extends q{constructor(t){super(),W(this,t,it,ut,s,{})}}function ft(t){let n,e;return n=new lt({}),{c(){F(n.$$.fragment)},m(t,r){G(n,t,r),e=!0},i(t){e||(T(n.$$.fragment,t),e=!0)},o(t){D(n.$$.fragment,t),e=!1},d(t){L(n,t)}}}function dt(t){let n,e;return n=new et({}),{c(){F(n.$$.fragment)},m(t,r){G(n,t,r),e=!0},i(t){e||(T(n.$$.fragment,t),e=!0)},o(t){D(n.$$.fragment,t),e=!1},d(t){L(n,t)}}}function mt(t){let n,e,o,s,c,a;n=new z({});const f=[dt,ft],d=[];function g(t,n){return""===t[0]?0:1}return s=g(t),c=d[s]=f[s](t),{c(){F(n.$$.fragment),e=m(),o=l("main"),c.c(),$(o,"class","text-center p-1 min-w-screen min-h-screen grid grid-cols-1 items-stretch grid-rows-6 bg-white")},m(t,r){G(n,t,r),u(t,e,r),u(t,o,r),d[s].m(o,null),a=!0},p(t,[n]){let e=s;s=g(t),s!==e&&(S={r:0,c:[],p:S},D(d[e],1,1,(()=>{d[e]=null})),S.r||r(S.c),S=S.p,c=d[s],c||(c=d[s]=f[s](t),c.c()),T(c,1),c.m(o,null))},i(t){a||(T(n.$$.fragment,t),T(c),a=!0)},o(t){D(n.$$.fragment,t),D(c),a=!1},d(t){L(n,t),t&&i(e),t&&i(o),d[s].d()}}}function gt(t,n,e){let r;return c(t,X,(t=>e(0,r=t))),[r]}return new class extends q{constructor(t){super(),W(this,t,gt,mt,s,{})}}({target:document.body,props:{}})}();
