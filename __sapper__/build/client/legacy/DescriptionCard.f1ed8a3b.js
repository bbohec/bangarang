import{_ as n,a as t,b as r,c as i,i as a,s as o,d as c,S as e,e as s,f as l,g as f,j as u,k as h,l as v,t as d,h as m,m as g,H as p,L as k,I as b,C as $,z as C,o as E,A as x,p as P,B as y,D as L,E as N,J as R,K as D,u as H}from"./client.caffac16.js";import{L as S}from"./Link.85f686bd.js";function j(n){var i=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(n){return!1}}();return function(){var a,o=t(n);if(i){var c=t(this).constructor;a=Reflect.construct(o,arguments,c)}else a=o.apply(this,arguments);return r(this,a)}}function I(n,t,r){var i=n.slice();return i[1]=t[r],i}function z(n,t,r){var i=n.slice();return i[4]=t[r],i}function A(n){for(var t,r=n[0].bulletPoints,i=[],a=0;a<r.length;a+=1)i[a]=B(z(n,r,a));return{c:function(){t=s("ul");for(var n=0;n<i.length;n+=1)i[n].c();this.h()},l:function(n){t=l(n,"UL",{class:!0});for(var r=f(t),a=0;a<i.length;a+=1)i[a].l(r);r.forEach(u),this.h()},h:function(){h(t,"class","list-disc list-inside")},m:function(n,r){v(n,t,r);for(var a=0;a<i.length;a+=1)i[a].m(t,null)},p:function(n,a){if(1&a){var o;for(r=n[0].bulletPoints,o=0;o<r.length;o+=1){var c=z(n,r,o);i[o]?i[o].p(c,a):(i[o]=B(c),i[o].c(),i[o].m(t,null))}for(;o<i.length;o+=1)i[o].d(1);i.length=r.length}},d:function(n){n&&u(t),k(i,n)}}}function B(n){var t,r,i=n[4]+"";return{c:function(){t=s("li"),r=d(i),this.h()},l:function(n){t=l(n,"LI",{class:!0});var a=f(t);r=m(a,i),a.forEach(u),this.h()},h:function(){h(t,"class","text-bangarang-darkEmphasis text-sm")},m:function(n,i){v(n,t,i),g(t,r)},p:function(n,t){1&t&&i!==(i=n[4]+"")&&p(r,i)},d:function(n){n&&u(t)}}}function w(n){for(var t,r,i=n[0].links,a=[],o=0;o<i.length;o+=1)a[o]=J(I(n,i,o));var c=function(n){return L(a[n],1,1,(function(){a[n]=null}))};return{c:function(){for(var n=0;n<a.length;n+=1)a[n].c();t=b()},l:function(n){for(var r=0;r<a.length;r+=1)a[r].l(n);t=b()},m:function(n,i){for(var o=0;o<a.length;o+=1)a[o].m(n,i);v(n,t,i),r=!0},p:function(n,r){if(1&r){var o;for(i=n[0].links,o=0;o<i.length;o+=1){var e=I(n,i,o);a[o]?(a[o].p(e,r),$(a[o],1)):(a[o]=J(e),a[o].c(),$(a[o],1),a[o].m(t.parentNode,t))}for(R(),o=i.length;o<a.length;o+=1)c(o);D()}},i:function(n){if(!r){for(var t=0;t<i.length;t+=1)$(a[t]);r=!0}},o:function(n){a=a.filter(Boolean);for(var t=0;t<a.length;t+=1)L(a[t]);r=!1},d:function(n){k(a,n),n&&u(t)}}}function J(n){var t,r,i,a;return r=new S({props:{linkHref:n[1].href,linkName:n[1].name,size:"medium"}}),{c:function(){t=s("span"),C(r.$$.fragment),i=E()},l:function(n){t=l(n,"SPAN",{});var a=f(t);x(r.$$.fragment,a),i=P(a),a.forEach(u)},m:function(n,o){v(n,t,o),y(r,t,null),g(t,i),a=!0},p:function(n,t){var i={};1&t&&(i.linkHref=n[1].href),1&t&&(i.linkName=n[1].name),r.$set(i)},i:function(n){a||($(r.$$.fragment,n),a=!0)},o:function(n){L(r.$$.fragment,n),a=!1},d:function(n){n&&u(t),N(r)}}}function K(n){var t,r,i,a,o,c,e,k,b,C,x,y=n[0].title+"",N=n[0].description+"",S=(null===(t=n[0].bulletPoints)||void 0===t?void 0:t.length)>0&&A(n),j=(null===(r=n[0].links)||void 0===r?void 0:r.length)>0&&w(n);return{c:function(){i=s("section"),a=s("h2"),o=d(y),c=E(),e=s("p"),k=d(N),b=E(),S&&S.c(),C=E(),j&&j.c(),this.h()},l:function(n){i=l(n,"SECTION",{class:!0});var t=f(i);a=l(t,"H2",{class:!0});var r=f(a);o=m(r,y),r.forEach(u),c=P(t),e=l(t,"P",{class:!0});var s=f(e);k=m(s,N),s.forEach(u),b=P(t),S&&S.l(t),C=P(t),j&&j.l(t),t.forEach(u),this.h()},h:function(){h(a,"class","text-bangarang-dark text-center font-semibold"),h(e,"class","text-bangarang-darkEmphasis text-center text-sm"),h(i,"class","mb-2 p-1")},m:function(n,t){v(n,i,t),g(i,a),g(a,o),g(i,c),g(i,e),g(e,k),g(i,b),S&&S.m(i,null),g(i,C),j&&j.m(i,null),x=!0},p:function(n,t){var r,a,c=H(t,1)[0];(!x||1&c)&&y!==(y=n[0].title+"")&&p(o,y),(!x||1&c)&&N!==(N=n[0].description+"")&&p(k,N),(null===(r=n[0].bulletPoints)||void 0===r?void 0:r.length)>0?S?S.p(n,c):((S=A(n)).c(),S.m(i,C)):S&&(S.d(1),S=null),(null===(a=n[0].links)||void 0===a?void 0:a.length)>0?j?(j.p(n,c),1&c&&$(j,1)):((j=w(n)).c(),$(j,1),j.m(i,null)):j&&(R(),L(j,1,1,(function(){j=null})),D())},i:function(n){x||($(j),x=!0)},o:function(n){L(j),x=!1},d:function(n){n&&u(i),S&&S.d(),j&&j.d()}}}function O(n,t,r){var i=t.descriptionCardContract;return n.$$set=function(n){"descriptionCardContract"in n&&r(0,i=n.descriptionCardContract)},[i]}var T=function(t){n(s,e);var r=j(s);function s(n){var t;return i(this,s),t=r.call(this),a(c(t),n,O,K,o,{descriptionCardContract:0}),t}return s}();export{T as D};