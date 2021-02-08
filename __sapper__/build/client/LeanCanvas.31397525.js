import{S as e,i as t,s as n,e as a,t as s,j as r,D as i,c as o,a as l,b as c,d as f,k as u,f as g,g as m,h as p,x as d,r as h,u as y,v,n as b,y as $,z as w,F as P,G as k,E as x}from"./client.54612f3c.js";import{L as N,l as A}from"./Link.c629bc78.js";import{V as C}from"./ViewTitle.140a44da.js";import{D as S}from"./DescriptionCard.323e8e82.js";function E(e,t,n){const a=e.slice();return a[1]=t[n],a}function T(e,t,n){const a=e.slice();return a[4]=t[n],a}function M(e){let t,n;return t=new S({props:{descriptionCardContract:e[4]}}),{c(){h(t.$$.fragment)},l(e){y(t.$$.fragment,e)},m(e,a){v(t,e,a),n=!0},p:b,i(e){n||(d(t.$$.fragment,e),n=!0)},o(e){$(t.$$.fragment,e),n=!1},d(e){w(t,e)}}}function O(e){let t,n,h,y,v,b=e[1].partName+"",w=e[1].sections,N=[];for(let t=0;t<w.length;t+=1)N[t]=M(T(e,w,t));const A=e=>$(N[e],1,1,(()=>{N[e]=null}));return{c(){t=a("h1"),n=s(b),h=r();for(let e=0;e<N.length;e+=1)N[e].c();y=i(),this.h()},l(e){t=o(e,"H1",{class:!0});var a=l(t);n=c(a,b),a.forEach(f),h=u(e);for(let t=0;t<N.length;t+=1)N[t].l(e);y=i(),this.h()},h(){g(t,"class","text-xl mt-4 text-bangarang-dark font-semibold text-center")},m(e,a){m(e,t,a),p(t,n),m(e,h,a);for(let t=0;t<N.length;t+=1)N[t].m(e,a);m(e,y,a),v=!0},p(e,t){if(1&t){let n;for(w=e[1].sections,n=0;n<w.length;n+=1){const a=T(e,w,n);N[n]?(N[n].p(a,t),d(N[n],1)):(N[n]=M(a),N[n].c(),d(N[n],1),N[n].m(y.parentNode,y))}for(x(),n=w.length;n<N.length;n+=1)A(n);P()}},i(e){if(!v){for(let e=0;e<w.length;e+=1)d(N[e]);v=!0}},o(e){N=N.filter(Boolean);for(let e=0;e<N.length;e+=1)$(N[e]);v=!1},d(e){e&&f(t),e&&f(h),k(N,e),e&&f(y)}}}function j(e){let t,n,s,i,c,b,S,T,M,j;n=new C({props:{title:"Bangarang Lean Canvas"}});let D=e[0],B=[];for(let t=0;t<D.length;t+=1)B[t]=O(E(e,D,t));const I=e=>$(B[e],1,1,(()=>{B[e]=null}));return S=new N({props:{size:"small",linkName:"The Business Model",linkHref:A.businessModel}}),M=new N({props:{size:"small",linkName:"Use Bangarang!",linkHref:A.mainMenu}}),{c(){t=a("header"),h(n.$$.fragment),s=r(),i=a("main");for(let e=0;e<B.length;e+=1)B[e].c();c=r(),b=a("footer"),h(S.$$.fragment),T=r(),h(M.$$.fragment),this.h()},l(e){t=o(e,"HEADER",{class:!0});var a=l(t);y(n.$$.fragment,a),a.forEach(f),s=u(e),i=o(e,"MAIN",{class:!0});var r=l(i);for(let e=0;e<B.length;e+=1)B[e].l(r);r.forEach(f),c=u(e),b=o(e,"FOOTER",{class:!0});var g=l(b);y(S.$$.fragment,g),T=u(g),y(M.$$.fragment,g),g.forEach(f),this.h()},h(){g(t,"class","flex flex-col"),g(i,"class","flex-grow overflow-y-auto"),g(b,"class","flex flex-col")},m(e,a){m(e,t,a),v(n,t,null),m(e,s,a),m(e,i,a);for(let e=0;e<B.length;e+=1)B[e].m(i,null);m(e,c,a),m(e,b,a),v(S,b,null),p(b,T),v(M,b,null),j=!0},p(e,[t]){if(1&t){let n;for(D=e[0],n=0;n<D.length;n+=1){const a=E(e,D,n);B[n]?(B[n].p(a,t),d(B[n],1)):(B[n]=O(a),B[n].c(),d(B[n],1),B[n].m(i,null))}for(x(),n=D.length;n<B.length;n+=1)I(n);P()}},i(e){if(!j){d(n.$$.fragment,e);for(let e=0;e<D.length;e+=1)d(B[e]);d(S.$$.fragment,e),d(M.$$.fragment,e),j=!0}},o(e){$(n.$$.fragment,e),B=B.filter(Boolean);for(let e=0;e<B.length;e+=1)$(B[e]);$(S.$$.fragment,e),$(M.$$.fragment,e),j=!1},d(e){e&&f(t),w(n),e&&f(s),e&&f(i),k(B,e),e&&f(c),e&&f(b),w(S),w(M)}}}function D(e){return[[{partName:"Customers",sections:[{title:"Customer Segments",description:"List of target customers and users.",bulletPoints:["Anyone that want to give his opinion about a subject."]},{title:"Early Adopters",description:"Characteristics list of ideal customers.",bulletPoints:["Syndicates","Activits","Team members where there is lot of control"],links:[{name:"Are your a syndicalist?",href:A.syndicalistEarlyAdopters},{name:"Are your an activist?",href:A.activistEarlyAdopters},{name:"Are your an agile team member?",href:A.agileTeamMemberEarlyAdopters}]}]},{partName:"Problem",sections:[{title:"",description:"List your customer's top 3 problems",bulletPoints:["Individuals can't give their opinion anonymously.","Individuals can't give their opinion for subjects that matters to them.","Individuals can't pay for giving their opinion.","Individuals don't want to move for giving their opinion."]}]},{partName:"Unique Value Proposition",sections:[{title:"",description:"Single, clear, compelling message that states why Bangarang is different and worth paying attention.",bulletPoints:["Provide people sovereignty.","Improve human rights: freedom, equality & justice for all.","Remove power & authority.","Solution with energy efficiency by design."]}]},{partName:"Solution",sections:[{title:"",description:"Top features.",bulletPoints:["Users can interact with Claims.","User actions are only tracked at the user level.","Anyone can subscribe.","Free."]}]},{partName:"Channels",sections:[{title:"",description:"Path list to customers.",bulletPoints:["YouTube - Daily Marketing Videos.","Responce to daily news.","Dev/Marketing Transparant Streaming."]}]},{partName:"Revenue Streams",sections:[{title:"",description:"Sources of revenue list.",bulletPoints:["++ User Support in exchange of being part of credits","-- Organisation Support in exchange of being part of credits","---- Paid features (money give advantage / power)"]}]},{partName:"Cost Structure",sections:[{title:"",description:"Fixed and variable costs list.",bulletPoints:["One producter > Me > self financing for 7 months 2 days per week > full time 80k/yr and decreasing.","Additionnal producters > bonus or maybe free help > not needed on early stage.","Infrastructure cost > not needed on early stage.","Organizations financial/political/marketing aggressivity."]}]},{partName:"Key Metrics",sections:[{title:"",description:"Key activities Bangarang measure.",bulletPoints:["Daily votes/ballot.","HOT votes/ballot.","Organisations that are not supporting us :).","People not already registered/voting for HOT vote :)."]}]},{partName:"Unfair Advantage",sections:[{title:"",description:"Can't be easily copied or bought.",bulletPoints:["Open Source / Transparancy.","Free of use.","Not fully skilled but can do it.","Crazy Dude with crazy ideas :).","Cost effective."]}]}]]}export default class extends e{constructor(e){super(),t(this,e,D,j,n,{})}}