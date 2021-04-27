'use strict';

var sirv = require('sirv');
var express = require('express');
var cors = require('cors');
var compression = require('compression');
var fs = require('fs');
var path = require('path');
var axios = require('axios');
var Stream = require('stream');
var http = require('http');
var Url = require('url');
var https = require('https');
var zlib = require('zlib');
var bodyParser = require('body-parser');
var datastore = require('@google-cloud/datastore');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var sirv__default = /*#__PURE__*/_interopDefaultLegacy(sirv);
var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var cors__default = /*#__PURE__*/_interopDefaultLegacy(cors);
var compression__default = /*#__PURE__*/_interopDefaultLegacy(compression);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
var Stream__default = /*#__PURE__*/_interopDefaultLegacy(Stream);
var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
var Url__default = /*#__PURE__*/_interopDefaultLegacy(Url);
var https__default = /*#__PURE__*/_interopDefaultLegacy(https);
var zlib__default = /*#__PURE__*/_interopDefaultLegacy(zlib);

function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function validate_store(store, name) {
    if (store != null && typeof store.subscribe !== 'function') {
        throw new Error(`'${name}' is not a store with a 'subscribe' method`);
    }
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function set_store_value(store, ret, value = ret) {
    store.set(value);
    return ret;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
    get_current_component().$$.after_update.push(fn);
}
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
}
const escaped = {
    '"': '&quot;',
    "'": '&#39;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
function escape(html) {
    return String(html).replace(/["'&<>]/g, match => escaped[match]);
}
function each(items, fn) {
    let str = '';
    for (let i = 0; i < items.length; i += 1) {
        str += fn(items[i], i);
    }
    return str;
}
const missing_component = {
    $$render: () => ''
};
function validate_component(component, name) {
    if (!component || !component.$$render) {
        if (name === 'svelte:component')
            name += ' this={...}';
        throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
    }
    return component;
}
let on_destroy;
function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots) {
        const parent_component = current_component;
        const $$ = {
            on_destroy,
            context: new Map(parent_component ? parent_component.$$.context : []),
            // these will be immediately discarded
            on_mount: [],
            before_update: [],
            after_update: [],
            callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
    }
    return {
        render: (props = {}, options = {}) => {
            on_destroy = [];
            const result = { title: '', head: '', css: new Set() };
            const html = $$render(result, props, {}, options);
            run_all(on_destroy);
            return {
                html,
                css: {
                    code: Array.from(result.css).map(css => css.code).join('\n'),
                    map: null // TODO
                },
                head: result.title + result.head
            };
        },
        $$render
    };
}
function add_attribute(name, value, boolean) {
    if (value == null || (boolean && !value))
        return '';
    return ` ${name}${value === true ? '' : `=${typeof value === 'string' ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}

var StaticView;
(function (StaticView) {
    StaticView["SigningInMenu"] = "SigningInMenu";
    StaticView["LanguageSelect"] = "LanguageSelect";
    StaticView["MainMenu"] = "MainMenu";
    StaticView["DeclareClaim"] = "DeclareClaim";
    StaticView["BusinessModel"] = "BusinessModel";
    StaticView["LeanCanvas"] = "LeanCanvas";
    StaticView["Register"] = "Register";
})(StaticView || (StaticView = {}));

const subscriber_queue = [];
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (let i = 0; i < subscribers.length; i += 1) {
                    const s = subscribers[i];
                    s[1]();
                    subscriber_queue.push(s, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}

const languageStore = writable("en");

const CONTEXT_KEY = {};

/* src\node_modules\@sapper\internal\layout.svelte generated by Svelte v3.34.0 */

const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `${slots.default ? slots.default({}) : ``}`;
});

var root_comp = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': Layout
});

/* src\node_modules\@sapper\internal\error.svelte generated by Svelte v3.34.0 */

const Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { error } = $$props;
	let { status } = $$props;
	if ($$props.error === void 0 && $$bindings.error && error !== void 0) $$bindings.error(error);
	if ($$props.status === void 0 && $$bindings.status && status !== void 0) $$bindings.status(status);

	return `<h1>${escape(status)}</h1>

<p>${escape(error.message)}</p>

${`<pre>${escape(error.stack)}</pre>`
	}`;
});

/* src\node_modules\@sapper\internal\App.svelte generated by Svelte v3.34.0 */

const App = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { stores } = $$props;
	let { error } = $$props;
	let { status } = $$props;
	let { segments } = $$props;
	let { level0 } = $$props;
	let { level1 = null } = $$props;
	let { notify } = $$props;
	afterUpdate(notify);
	setContext(CONTEXT_KEY, stores);
	if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0) $$bindings.stores(stores);
	if ($$props.error === void 0 && $$bindings.error && error !== void 0) $$bindings.error(error);
	if ($$props.status === void 0 && $$bindings.status && status !== void 0) $$bindings.status(status);
	if ($$props.segments === void 0 && $$bindings.segments && segments !== void 0) $$bindings.segments(segments);
	if ($$props.level0 === void 0 && $$bindings.level0 && level0 !== void 0) $$bindings.level0(level0);
	if ($$props.level1 === void 0 && $$bindings.level1 && level1 !== void 0) $$bindings.level1(level1);
	if ($$props.notify === void 0 && $$bindings.notify && notify !== void 0) $$bindings.notify(notify);

	return `


${validate_component(Layout, "Layout").$$render($$result, Object.assign({ segment: segments[0] }, level0.props), {}, {
		default: () => `${error
		? `${validate_component(Error$1, "Error").$$render($$result, { error, status }, {}, {})}`
		: `${validate_component(level1.component || missing_component, "svelte:component").$$render($$result, Object.assign(level1.props), {}, {})}`}`
	})}`;
});

// This file is generated by Sapper — do not edit it!

const ignore = [];

const routes = (d => [
	{
		// index.svelte
		pattern: /^\/$/,
		parts: [
			{ i: 0 }
		]
	},

	{
		// LanguageSelect.svelte
		pattern: /^\/LanguageSelect\/?$/,
		parts: [
			{ i: 1 }
		]
	},

	{
		// [language]/index.svelte
		pattern: /^\/([^/]+?)\/?$/,
		parts: [
			{ i: 2, params: match => ({ language: d(match[1]) }) }
		]
	},

	{
		// [language]/valuePropositions/[valuePropositionPageLink].svelte
		pattern: /^\/([^/]+?)\/valuePropositions\/([^/]+?)\/?$/,
		parts: [
			null,
			null,
			{ i: 3, params: match => ({ language: d(match[1]), valuePropositionPageLink: d(match[2]) }) }
		]
	},

	{
		// [language]/BusinessModel.svelte
		pattern: /^\/([^/]+?)\/BusinessModel\/?$/,
		parts: [
			null,
			{ i: 4, params: match => ({ language: d(match[1]) }) }
		]
	},

	{
		// [language]/SigningInMenu.svelte
		pattern: /^\/([^/]+?)\/SigningInMenu\/?$/,
		parts: [
			null,
			{ i: 5, params: match => ({ language: d(match[1]) }) }
		]
	},

	{
		// [language]/DeclareClaim.svelte
		pattern: /^\/([^/]+?)\/DeclareClaim\/?$/,
		parts: [
			null,
			{ i: 6, params: match => ({ language: d(match[1]) }) }
		]
	},

	{
		// [language]/landingPages/[audience]/[landingPageId].svelte
		pattern: /^\/([^/]+?)\/landingPages\/([^/]+?)\/([^/]+?)\/?$/,
		parts: [
			null,
			null,
			null,
			{ i: 7, params: match => ({ language: d(match[1]), audience: d(match[2]), landingPageId: d(match[3]) }) }
		]
	},

	{
		// [language]/LeanCanvas.svelte
		pattern: /^\/([^/]+?)\/LeanCanvas\/?$/,
		parts: [
			null,
			{ i: 8, params: match => ({ language: d(match[1]) }) }
		]
	},

	{
		// [language]/MainMenu.svelte
		pattern: /^\/([^/]+?)\/MainMenu\/?$/,
		parts: [
			null,
			{ i: 9, params: match => ({ language: d(match[1]) }) }
		]
	},

	{
		// [language]/Register.svelte
		pattern: /^\/([^/]+?)\/Register\/?$/,
		parts: [
			null,
			{ i: 10, params: match => ({ language: d(match[1]) }) }
		]
	},

	{
		// [language]/claims/[claimId].svelte
		pattern: /^\/([^/]+?)\/claims\/([^/]+?)\/?$/,
		parts: [
			null,
			null,
			{ i: 11, params: match => ({ language: d(match[1]), claimId: d(match[2]) }) }
		]
	}
])(decodeURIComponent);

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
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

let uid = 1;
let cid;
const _history = typeof history !== 'undefined' ? history : {
    pushState: () => { },
    replaceState: () => { },
    scrollRestoration: 'auto'
};
const scroll_history = {};
let base_url;
let handle_target;
function extract_query(search) {
    const query = Object.create(null);
    if (search.length > 0) {
        search.slice(1).split('&').forEach(searchParam => {
            const [, key, value = ''] = /([^=]*)(?:=(.*))?/.exec(decodeURIComponent(searchParam.replace(/\+/g, ' ')));
            if (typeof query[key] === 'string')
                query[key] = [query[key]];
            if (typeof query[key] === 'object')
                query[key].push(value);
            else
                query[key] = value;
        });
    }
    return query;
}
function select_target(url) {
    if (url.origin !== location.origin)
        return null;
    if (!url.pathname.startsWith(base_url))
        return null;
    let path = url.pathname.slice(base_url.length);
    if (path === '') {
        path = '/';
    }
    // avoid accidental clashes between server routes and page routes
    if (ignore.some(pattern => pattern.test(path)))
        return;
    for (let i = 0; i < routes.length; i += 1) {
        const route = routes[i];
        const match = route.pattern.exec(path);
        if (match) {
            const query = extract_query(url.search);
            const part = route.parts[route.parts.length - 1];
            const params = part.params ? part.params(match) : {};
            const page = { host: location.host, path, query, params };
            return { href: url.href, route, match, page };
        }
    }
}
function scroll_state() {
    return {
        x: pageXOffset,
        y: pageYOffset
    };
}
function navigate(dest, id, noscroll, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        const popstate = !!id;
        if (popstate) {
            cid = id;
        }
        else {
            const current_scroll = scroll_state();
            // clicked on a link. preserve scroll state
            scroll_history[cid] = current_scroll;
            cid = id = ++uid;
            scroll_history[cid] = noscroll ? current_scroll : { x: 0, y: 0 };
        }
        yield handle_target();
        if (document.activeElement && (document.activeElement instanceof HTMLElement))
            document.activeElement.blur();
        if (!noscroll) {
            let scroll = scroll_history[id];
            let deep_linked;
            if (hash) {
                // scroll is an element id (from a hash), we need to compute y.
                deep_linked = document.getElementById(hash.slice(1));
                if (deep_linked) {
                    scroll = {
                        x: 0,
                        y: deep_linked.getBoundingClientRect().top + scrollY
                    };
                }
            }
            scroll_history[cid] = scroll;
            if (popstate || deep_linked) {
                scrollTo(scroll.x, scroll.y);
            }
            else {
                scrollTo(0, 0);
            }
        }
    });
}

function get_base_uri(window_document) {
    let baseURI = window_document.baseURI;
    if (!baseURI) {
        const baseTags = window_document.getElementsByTagName('base');
        baseURI = baseTags.length ? baseTags[0].href : window_document.URL;
    }
    return baseURI;
}

function goto(href, opts = { noscroll: false, replaceState: false }) {
    const target = select_target(new URL(href, get_base_uri(document)));
    if (target) {
        _history[opts.replaceState ? 'replaceState' : 'pushState']({ id: cid }, '', href);
        return navigate(target, null, opts.noscroll);
    }
    location.href = href;
    return new Promise(() => {
        /* never resolves */
    });
}

function page_store(value) {
    const store = writable(value);
    let ready = true;
    function notify() {
        ready = true;
        store.update(val => val);
    }
    function set(new_value) {
        ready = false;
        store.set(new_value);
    }
    function subscribe(run) {
        let old_value;
        return store.subscribe((new_value) => {
            if (old_value === undefined || (ready && new_value !== old_value)) {
                run(old_value = new_value);
            }
        });
    }
    return { notify, set, subscribe };
}

const initial_data = typeof __SAPPER__ !== 'undefined' && __SAPPER__;
const stores = {
    page: page_store({}),
    preloading: writable(null),
    session: writable(initial_data && initial_data.session)
};
stores.session.subscribe((value) => __awaiter(void 0, void 0, void 0, function* () {
    return;
}));

const SUPPORTED_LANGUAGES = ['en', 'fr'];
const isSupportedLanguage = (language) => SUPPORTED_LANGUAGES.includes(language);
class Message {
    constructor(messageContract) {
        this.messageContract = messageContract;
    }
    getMessage(language) {
        return this.messageContract[language];
    }
}
function assignLanguage(language) {
    if (isSupportedLanguage(language))
        languageStore.set(language);
}
function redirectOnUnknownLanguage(language) {
    if (!isSupportedLanguage(language)) {
        const url = `/${StaticView.LanguageSelect}`;
        goto(url);
    }
}

const linkPrefixes = {
    claimLinkPrefix: "claims/",
    valuePropositionLinkPrefix: "valuePropositions/"
};

const valuePropositionsDesignCanvas = [
    {
        title: {
            en: "Activist Value Proposition",
            fr: `Proposition de Valeur des Activistes`
        },
        audience: {
            en: "Activist",
            fr: `Activiste`
        },
        customerJobs: [
            {
                en: "You revendicate your ideas.",
                fr: `Tu revendiques tes idées.`
            },
            {
                en: "You collectively commit to a cause.",
                fr: `Tu t'engages collectivement pour une cause.`
            },
            {
                en: "Your are pacifist.",
                fr: `Tu es pacifiste.`
            }
        ],
        pains: [
            {
                en: "You suffer too much violence during protest.",
                fr: `Tu subis trop de violences quand tu manifestes.`
            },
            {
                en: "You have to be disobedient.",
                fr: `Tu es obligé de faire de la désobéissance.`
            },
            {
                en: "You die or you are hurt while you protest.",
                fr: `Tu meurts ou tu es blessé lorsque du manifestes.`
            }
        ],
        painRelievers: [
            {
                en: "You will claim from anyware.",
                fr: `Est-ce qu'on va venir t'aggresser chez toi parceque tu as revendiqué sur Bangarang?`
            },
            {
                en: "Does claiming from home is a disobedience?",
                fr: `Est-ce que revendiquer depuis chez toi c'est de la désobéissance?`
            },
            {
                en: "You will not claim by protesting anymore.",
                fr: `Tu n'as plus besoin de manifester pour revendiquer.`
            }
        ],
        productAndServices: [
            {
                en: "Bangarang is an open source and free direct democratic claim system. It allows anybody to declare or search for claim and claiming for them anonymously.",
                fr: `Bangarang est système Open Source et gratuit de démocratie directe à base de revendications permettant à chacun de déclarer ou rechercher une revendication et de revendiquer anonymement.`
            }
        ],
        gainCreators: [
            {
                en: "You can claim whatever you want.",
                fr: `Tu peux revendiquer où tu veux.`
            },
            {
                en: "You can change your mind.",
                fr: `Tu peux changer d'avis.`
            },
            {
                en: "You have as much power as the others.",
                fr: `Tu as autant de pouvoir que les autres.`
            }
        ],
        gains: [
            {
                en: "You can claim on what makes sense to you.",
                fr: `Tu peux revendiquer sur les sujets qui font sens pour toi.`
            },
            {
                en: "You have the right like everyone else to make mistakes.",
                fr: `Tu as le droit de faire des erreurs comme tout le monde et donc tu dois pouvoir changer d'avis.`
            },
            {
                en: "You do direct democracy.",
                fr: `Tu fais de la démocratie directe. Tu décides comme tout le monde.`
            }
        ],
        linkName: {
            en: "Are you an activist?",
            fr: `Es-tu un activiste?`
        },
        pageLink: "activist"
    },
    {
        title: {
            en: "Syndicalist Value Proposition",
            fr: `Proposition de Valeur pour les Syndicalistes`
        },
        audience: {
            en: "Syndicalist",
            fr: `Syndicaliste`
        },
        customerJobs: [
            {
                en: "You defend your interests as a worker.",
                fr: `Tu défends tes intérets en tant que travailleur.`
            },
            {
                en: "You show solidarity with your colleagues.",
                fr: `Tu es solidaire avec tes collègues.`
            },
            {
                en: "You struggle daily for immediate improvements in work but also for the disappearance of salaried workers and employers.",
                fr: `Tu agis tout les jours pour l'amélioration de tes conditions de travail mais aussi contre les inégalités entre les salariés et les employeurs.`
            }
        ],
        pains: [
            {
                en: "You are often divided.",
                fr: `Tu es souvent divisé.`
            },
            {
                en: "You are individualist.",
                fr: `Chaque organisation syndicale est très souvent individualiste.`
            },
            {
                en: "You die at work.",
                fr: `Tu meurs encore au travail.`
            }
        ],
        painRelievers: [
            {
                en: "You will claim on common causes.",
                fr: `Tu vas revendiquer sur des causes communes.`
            },
            {
                en: "You will be free to claim without being unionized.",
                fr: `Tu seras libre de revendiquer quand être forcément avoir les mêmes avis uniques.`
            },
            {
                en: "We will make a strong claim on workplace safety.",
                fr: `Tu pourras revendiquer sur la sécurité au travail.`
            }
        ],
        productAndServices: [
            {
                en: "Bangarang is an open source and free direct democratic claim system. It allows anybody to declare or search for claim and claiming for them anonymously.",
                fr: `Bangarang est système Open Source et gratuit de démocratie directe à base de revendications permettant à chacun de déclarer ou rechercher une revendication et de revendiquer anonymement.`
            }
        ],
        gainCreators: [
            {
                en: "You are unified by the number but independent by your choices.",
                fr: `Tu es unis par le nombre mais tu reste indépendant sur tes propres choix.`
            },
            {
                en: "You can change your mind.",
                fr: `Tu peux changer d'avis.`
            },
            {
                en: "You can claim as much as your employer.",
                fr: `Tu peux revendiquer autant que ton employeur.`
            }
        ],
        gains: [
            {
                en: "You and your colleagues will be more united.",
                fr: `Toi et tes collègues, vous serez plus unis.`
            },
            {
                en: "You have the right like everyone else to make mistakes.",
                fr: `Tu as le droits comme tout le monde de faire des erreures.`
            },
            {
                en: "You greatly reduce the disparities between employers and employees.",
                fr: `Tu peux réduire drastiquement les disparités entre les salariés et les employeurs.`
            }
        ],
        linkName: {
            en: "Are you a syndicalist?",
            fr: `Es-tu syndicaliste?`
        },
        pageLink: "syndicalist"
    },
    {
        title: {
            en: "Agile Team Member Value Proposition",
            fr: `Proposition de Valeur des Equipes Agiles`
        },
        audience: {
            en: "Agile Team Member",
            fr: `Membre d'Equipe Agile`
        },
        customerJobs: [
            {
                en: "Tu are uncovering better ways of developing software by doing it and helping others do it.",
                fr: `Tu découvres comment mieux développer des logiciels par la pratique et en aidant les autres à le faire.`
            }
        ],
        pains: [
            {
                en: "You have more process and tools instead of individuals and interactions.",
                fr: `Tu dois focus plus sur les processus et d'outils que les individus et des intéractions entre eux.`
            },
            {
                en: "You have focus documentation instead of working software.",
                fr: `Tu dois focus la documentation au lieu de créer du logiciel opérationnel.`
            },
            {
                en: "You take lot of time on contract negotiation over customer collaboration.",
                fr: `Tu passes beaucoup de temps sur la négociation contractuelle au lieu de collaborer avec les parties prennantes.`
            },
            {
                en: "You have to follow THE PLAN instead of responding to change.",
                fr: `Tu dois suivre LE PLAN au lieu de t'adapter au changement.`
            }
        ],
        painRelievers: [
            {
                en: "You claim how the software should be.",
                fr: `Tu revendiques comment le logiciel doit être.`
            },
            {
                en: "You claim the rule that documentation is optionnal but working software is mandatory.",
                fr: `Tu revendiques comme règle d'équipe qu'une documentation est optionnelle mais qu'un logiciel fonctionnel est indispensable.`
            },
            {
                en: "You claim NO ESTIMATE.",
                fr: `Tu revendiques le NO ESTIMATE.`
            },
            {
                en: "You claim that customer feedback drive what must be done.",
                fr: `Tu revendiques que l'utilisateur final est la source de décision sur ce qui doit être fait.`
            }
        ],
        productAndServices: [
            {
                en: "Bangarang is an open source and free direct democratic claim system. It allows anybody to declare or search for claim and claiming for them anonymously.",
                fr: `Bangarang est système Open Source et gratuit de démocratie directe à base de revendications permettant à chacun de déclarer ou rechercher une revendication et de revendiquer anonymement.`
            }
        ],
        gainCreators: [
            {
                en: "Your software will be more focused on adding value for customers.",
                fr: `Ton logiciel sera plus focus sur l'apport de valeur pour ses utilisateurs.`
            },
            {
                en: "Your business objectives will be reach with better results.",
                fr: `Tes objectifs métiers seront atteints avec de meilleurs résultats.`
            },
            {
                en: "You are owners of the product.",
                fr: `Tu es propriétaire et souverain du produit.`
            },
            {
                en: "Your customers satisfaction will be enhanced.",
                fr: `La satisfaction de tes utilisateurs sera améliorée.`
            }
        ],
        gains: [
            {
                en: "You value individuals and interactions over processes and tools.",
                fr: `Tu mets en valeur les individus et leurs intéractions plus que les processus et les outils.`
            },
            {
                en: "You value a working software over comprehensive documentation.",
                fr: `Tu mets en valeur un logiciel opérationnel plus qu'une documentation exhaustive.`
            },
            {
                en: "You value customer collaboration over contract negotiation.",
                fr: `Tu mets en valeur la collaboration avec les parties prennantes plus que la négociation contractuelle.`
            },
            {
                en: "You value responding to change over following a plan.",
                fr: `Tu mets en valeur l'adaptation au changement plus que le suivi d'un plan.`
            }
        ],
        linkName: {
            en: "Are you an agile team member?",
            fr: `Es-tu membre d'équipe agile?`
        },
        pageLink: "agileTeamMember"
    }
];
const painRelieversToSupportingHeadLine = (language, supportingHeadLine) => new Message({
    en: `Use Bangarang and ${supportingHeadLine.toLocaleLowerCase()}`,
    fr: `Utilisez Bangarang et ${supportingHeadLine.toLocaleLowerCase()}`
}).getMessage(language);

const welcomeMessage = {
    en: "Welcome to",
    fr: "Bienvenue sur"
};
const bangarang = {
    en: "BANGARANG",
    fr: "BANGARANG"
};
const leanCanvasTitleMessage = {
    en: `Bangarang Lean Canvas`,
    fr: `Le Lean Canvas de Bangarang`
};
const bangarangDescriptionMessage = {
    en: "Bangarang is an open source and free direct democratic claim system. It allows anybody to declare or search for claim and claiming for them anonymously.",
    fr: "Bangarang est un systeme de démocratie directe Open Source et gratuit basé sur les revendication. Il permet à chacun de déclarer ou de rechercher une revendication et de revendiquer dessus anonymement."
};
const stage = "pre-alpha";
const demoWarningMessage = {
    en: `Bangarang is currently on <b>${stage}</b> stage. If you want to be informed about the next stages, you can provide your email on the following Google Form.<br>Thanks.`,
    fr: `Bangarang est actuellement en stage <b>${stage}</b>. Si vous souhaitez être informé à propos des prochaines étapes du développement, vous pouvez transmettre votre email sur le formulaire Google Form suivant.<br>Merci.`
};
const leanCanvasCustomerPartNameMessage = {
    en: `Customers`,
    fr: `Audiences`
};
const leanCanvasProblemPartNameMessage = {
    en: `Problem`,
    fr: `Problème`
};
const leanCanvasSolutionPartNameMessage = {
    en: `Solution`,
    fr: `Solution`
};
const leanCanvasChannelsPartNameMessage = {
    en: `Channels`,
    fr: `Cannaux`
};
const leanCanvasRevenueStreamsPartNameMessage = {
    en: `Revenue Streams`,
    fr: `Sources de Revenus`
};
const leanCanvasCostStructurePartNameMessage = {
    en: `Cost Structure`,
    fr: `Structure de Coût`
};
const leanCanvasKeyMetricsPartNameMessage = {
    en: `Key Metrics`,
    fr: `Indicateurs clés`
};
const leanCanvasUnfairAdvantagePartNameMessage = {
    en: `Unfair Advantage`,
    fr: `Avantage Compétitif`
};
const leanCanvasUniqueValuePropositionPartNameMessage = {
    en: `Unique Value Proposition`,
    fr: `Proposition de Valeur Unique`
};
const leanCanvasUnfairAdvantageMessages = {
    title: {
        en: ``,
        fr: ``
    },
    description: {
        en: `Can't be easily copied or bought.`,
        fr: `Ce qui ne peut pas être copié ou achetté ailleurs.`
    },
    bulletPoints: [
        {
            en: `Open Source / Transparancy.`,
            fr: `Open Source / Transparence.`
        },
        {
            en: `Free of use.`,
            fr: `Gratuit à l'usage.`
        },
        {
            en: `Not fully skilled but can do it 🙂.`,
            fr: `Pas compétent sur tout mais on s'éxécute 🙂.`
        },
        {
            en: `Crazy Dude with crazy ideas 🙃.`,
            fr: `Contributeur fou avec des idées folles 🙃.`
        },
        {
            en: `Cost effective.`,
            fr: `Faibles coûts.`
        }
    ]
};
const leanCanvasKeyMetricsMessages = {
    title: {
        en: ``,
        fr: ``
    },
    description: {
        en: `Key activities Bangarang measure.`,
        fr: `Les indicateurs clés de Bangarang.`
    },
    bulletPoints: [
        {
            en: `Quantity of claims.`,
            fr: `Nombre de revendications / acte de revendiquer.`
        },
        {
            en: `HOT claims of the day.`,
            fr: `Les revendications chaudes du moment.`
        },
        {
            en: `Organisations that are not supporting us 🙂.`,
            fr: `Organisations qui ne nous supportent pas 🙂.`
        },
        {
            en: `People not already registered/voting for HOT vote 🙂.`,
            fr: `Personnes qui ne sont pas encore enregistrées ou qui n'ont pas encore votées sur les votes chauds 🙂.`
        }
    ]
};
const leanCanvasCostStructureMessages = {
    title: {
        en: ``,
        fr: ``
    },
    description: {
        en: `Fixed and variable costs list.`,
        fr: `Centres de cout fixes et variables.`
    },
    bulletPoints: [
        {
            en: `One producter > Me > self financing for 7 months 2 days per week > full time 80k/yr and decreasing.`,
            fr: `Un contributeur de Bangarang > moi > auto financement pendant 7 mois sur 2 jours par semaines > temps plein 80k/an et prévu en baisse.`
        },
        {
            en: `Additionnal producters > bonus or maybe free help > not needed on early stage.`,
            fr: `Contributeurs additionnels > bonus ou peut être pour de l'aide bénévole > pas nécéssaire en premier lieu.`
        },
        {
            en: `Infrastructure cost > not needed on early stage.`,
            fr: `Couts d'infrastructure > pas nécéssaire ou minime en premier lieu`
        },
        {
            en: `Organizations financial/political/marketing aggressivity.`,
            fr: `Aggréssivité financières/politiques/marketing de certaines organisations.`
        }
    ]
};
const leanCanvasRevenueStreamsMessages = {
    title: {
        en: ``,
        fr: ``
    },
    description: {
        en: `Sources of revenue list.`,
        fr: `Liste des sources de financement.`
    },
    bulletPoints: [
        {
            en: `👍👍 User Support in exchange of being part of credits / goodies.`,
            fr: `👍👍 Support des utilisateurs en échange de faire partie des crédits / goodies.`
        },
        {
            en: `👎👎 Organisation Support in exchange of being part of credits`,
            fr: `👎👎 Support des organisations en échange de faire partie des crédits / sponsors.`
        },
        {
            en: `👎👎👎👎 Paid features (money give advantage / power)`,
            fr: `👎👎👎👎 Fonctionnalités payantes (l'argent apporte des avantages / du pouvoir)`
        }
    ]
};
const leanCanvasChannelsMessages = {
    title: {
        en: ``,
        fr: ``
    },
    description: {
        en: `Path list to customers.`,
        fr: `Comment informer les utilisateurs au sujet de Bangarang?`
    },
    bulletPoints: [
        {
            en: `YouTube - Daily Marketing Videos.`,
            fr: `YouTube - Vidéos Marketing Journalières.`
        },
        {
            en: `Responce to daily news.`,
            fr: `Revendications basées sur l'actualité journalière.`
        },
        {
            en: `Dev/Marketing Transparant Streaming.`,
            fr: `Streaming transparant sur les actions de développement et de marketing.`
        }
    ]
};
const leanCanvasSolutionMessages = {
    title: {
        en: ``,
        fr: ``
    },
    description: {
        en: `Top features.`,
        fr: `Les fonctionnalités importantes.`
    },
    bulletPoints: [
        {
            en: `Users can interact with Claims.`,
            fr: `Les utilisateurs peuvent intéragir avec l'ensemble des revendications.`
        },
        {
            en: `User actions are only tracked at the user level.`,
            fr: `Les actions de chaque utilisateur ne sont suivies qu'au niveau de l'utilisateur lui-même.`
        },
        {
            en: `Anyone can subscribe.`,
            fr: `Tout le monde peut s'inscrire.`
        },
        {
            en: `Bangarang is free.`,
            fr: `Bangarang est gratuit.`
        }
    ]
};
const leanCanvasUniqueValuePropositionMessages = {
    title: {
        en: ``,
        fr: ``
    },
    description: {
        en: `Single, clear, compelling message that states why Bangarang is different and worth paying attention.`,
        fr: `Message unique, clair et convaincant qui explique pourquoi Bangarang est différent et mérite une attention particulière.`
    },
    bulletPoints: [
        {
            en: `Provide people sovereignty.`,
            fr: `Rendre le peuple souverain.`
        },
        {
            en: `Improve human rights: freedom, equality & justice for all.`,
            fr: `Améliorer les droits de l'homme: liberté, égalité et justice pour tous.`
        },
        {
            en: `Remove power & authority.`,
            fr: `Réduire les abus de pouvoir et d'autorité.`
        },
        {
            en: `Solution with energy efficiency by design.`,
            fr: `Solution optimale énergiquement de par sa conception.`
        }
    ]
};
const leanCanvasProblemMessages = {
    title: {
        en: ``,
        fr: ``
    },
    description: {
        en: `List your customer's top 3 problems.`,
        fr: `Liste des 3 principaux problèmes des utilisateurs.`
    },
    bulletPoints: [
        {
            en: `Individuals can't give their opinion anonymously.`,
            fr: `Les individus ne peuvent pas donner leurs opinions annonymement.`
        },
        {
            en: `Individuals can't give their opinion for subjects that matters to them.`,
            fr: `Les individus ne peuvent pas donner leurs opinnions sur des sujets qui font sens pour eux.`
        },
        {
            en: `Individuals can't pay for giving their opinion.`,
            fr: `Les individus ne peuvent pas payer pour donner leurs opinions.`
        },
        {
            en: `Individuals don't want to move for giving their opinion.`,
            fr: `Les individues ne veulent pas se déplacer pour donner leurs opinions.`
        }
    ]
};
const leanCanvasCustomerEarlyAdoptersMessages = {
    title: {
        en: `Early Adopters`,
        fr: `Premières audiences`
    },
    description: {
        en: `Characteristics list of ideal customers.`,
        fr: `Les caractéristiques de notre utilisateur idéal.`
    },
    bulletPoints: [
        {
            en: `Syndicates`,
            fr: `Syndicats`
        },
        {
            en: `Activits`,
            fr: `Activistes`
        },
        {
            en: `Team members where there is lot of control`,
            fr: `Membres d'équipe agile`
        }
    ]
};
const leanCanvasCustomerSegmentsMessages = {
    title: {
        en: `Customer Segments`,
        fr: `Audiences`
    },
    description: {
        en: `List of target customers and users.`,
        fr: `Liste des principaux groupes et utilisateurs cibles`
    },
    bulletPoints: [
        {
            en: `Anyone that want to give his opinion about a subject.`,
            fr: `Toute personne qui souhaite donner son opinion à propos d'un sujet.`
        }
    ]
};
const whatIsBangarangMessages = {
    title: {
        en: "What is Bangarang?",
        fr: `C'est quoi Bangarang?`
    },
    description: {
        en: `Bangarang is an open source and free democratic claim system that allow anybody to:`,
        fr: `Bangarang est système Open Source et gratuit de démocratie directe à base de revendications permettant à chacun de:`
    },
    bulletPoints: [
        {
            en: `create a claim`,
            fr: `créer une revendication`
        },
        {
            en: `search for claims`,
            fr: `rechercher une revendication`
        },
        {
            en: `claiming anonymously`,
            fr: `revendiquer anonymement`
        }
    ]
};
const definitionOfBangarangMessages = {
    title: {
        en: "Definition of Bangarang",
        fr: `Définition de Bangarang`
    },
    description: {
        en: `According to Urban Dictionary:`,
        fr: `D'après Urban Dictionary:`
    },
    bulletPoints: [
        {
            en: `Battle cry of the Lost Boys in the movie Hook.`,
            fr: `Cri de bataille des Enfants Perdus dans le film Hook.`
        },
        {
            en: `Jamaican slang defined as a hubbub, uproar, disorder, or disturbance.`,
            fr: `Argot jamaïcain définissant un brouhaha, un tollé, un désordre ou une perturbation.`
        },
        {
            en: `General exclamation meant to signify approval or amazement.`,
            fr: `Exclamation générale destinée à signifier l'approbation ou la stupéfaction.`
        }
    ]
};
const whyThisNameMessages = {
    title: {
        en: `Why this name?`,
        fr: `Pourquoi ce nom?`
    },
    description: {
        en: ``,
        fr: ``
    },
    bulletPoints: [
        {
            en: `Individuals act like Lost Boys. They are a family within each other. They also have strong spiritual and social beliefs. Furthermore, they are hard workers and want to help not only themselves but the others.`,
            fr: `Les individus agissent comme des Enfants Perdus. Ils sont une famille. Ils ont de fortes croyances spirituelles et sociales. De plus, ils travailent beaucoup et veulent aussi bien s'aider aux même que les autres.`
        },
        {
            en: `Organizations and leaders act like Pirates. They are looking for power and profit. They also have strong growth and control main beliefs. Not only that, but they are delegating work and want to help themselves and their partners.`,
            fr: `Les organisations et les leaders agissent comme des Pirates. Ils sont à la recherche de pouvoir et de profit. Ils ont des croyances fortes pour la croissance et le control. De plus, ils délèguent le travail et veulent s'aider entre eux ainsi que leurs partenaires.`
        },
        {
            en: `Bangarang act as a disturbance of current systems by providing lead to individuals. But individuals must not have more lead each other.`,
            fr: `Bangarang agit comme une perturbation pour les systèmes actuels en fournissant plus de pouvoir pour chaque individus. Mais chaque individus ne dois pas avoir plus de pouvoir qu'un autre.`
        },
        {
            en: `By providing lead to individuals and guarantee this lead with equality, this should provide global amazement and systemic breakthrough`,
            fr: `En redonnant du pouvoir à chaque individu et en garantissant un pouvoir équitable, cela pourra fournir une révolution systémique et une stimulation des individus pour le bien commun.`
        }
    ]
};
const useBangarangLinkMessage = {
    en: "Use Bangarang!",
    fr: "Revendiquez sur Bangarang!"
};
const leanCanvasLinkMessage = {
    en: "The Lean Canvas",
    fr: "Le Lean Canvas"
};
const bangarangContactFormMessage = {
    en: `Bangarang contact form.`,
    fr: `Formulaire de contact Bangarang.`
};
const declareClaimTextButtonMessage = {
    en: `Declare claim`,
    fr: `Déclarer une revendication`
};
const bangarangBusinessModelTitleMessage = {
    en: `Bangarang Business Model`,
    fr: `Le Business Model de Bangarang`
};
const faqLinkNameMessage = {
    en: `FAQ`,
    fr: `Questions fréquentes`
};
const claimSearchBarPlaceholderMessage = {
    en: `Find ...`,
    fr: "Rechercher ..."
};
const backToMainMenuLinkMessage = {
    en: `Main menu`,
    fr: `Menu principal`
};
const selectLanguages = {
    en: {
        languageText: "English",
        selectYourLanguageMessage: "Select your language.",
        linkToMainMenuWithLanguage: `en/${StaticView.MainMenu}`
    },
    fr: {
        languageText: "Français",
        selectYourLanguageMessage: "Veuillez selectionner votre langue.",
        linkToMainMenuWithLanguage: `fr/${StaticView.MainMenu}`
    }
};
const leanCanvas = (language) => ([
    {
        partName: new Message(leanCanvasCustomerPartNameMessage).getMessage(language),
        sections: [
            {
                title: new Message(leanCanvasCustomerSegmentsMessages.title).getMessage(language),
                description: new Message(leanCanvasCustomerSegmentsMessages.description).getMessage(language),
                bulletPoints: leanCanvasCustomerSegmentsMessages.bulletPoints.map(bulletPoint => new Message(bulletPoint).getMessage(language))
            },
            {
                title: new Message(leanCanvasCustomerEarlyAdoptersMessages.title).getMessage(language),
                description: new Message(leanCanvasCustomerEarlyAdoptersMessages.description).getMessage(language),
                bulletPoints: leanCanvasCustomerEarlyAdoptersMessages.bulletPoints.map(bulletPoint => new Message(bulletPoint).getMessage(language)),
                links: valuePropositionsDesignCanvas.map(valuePropositionDesignCanvas => ({
                    name: new Message(valuePropositionDesignCanvas.linkName).getMessage(language),
                    href: `/${language}/${linkPrefixes.valuePropositionLinkPrefix}${valuePropositionDesignCanvas.pageLink}`
                }))
            }
        ]
    },
    {
        partName: new Message(leanCanvasProblemPartNameMessage).getMessage(language),
        sections: [
            {
                title: new Message(leanCanvasProblemMessages.title).getMessage(language),
                description: new Message(leanCanvasProblemMessages.description).getMessage(language),
                bulletPoints: leanCanvasProblemMessages.bulletPoints.map(bulletPoint => new Message(bulletPoint).getMessage(language))
            }
        ]
    },
    {
        partName: new Message(leanCanvasUniqueValuePropositionPartNameMessage).getMessage(language),
        sections: [
            {
                title: new Message(leanCanvasUniqueValuePropositionMessages.title).getMessage(language),
                description: new Message(leanCanvasUniqueValuePropositionMessages.description).getMessage(language),
                bulletPoints: leanCanvasUniqueValuePropositionMessages.bulletPoints.map(bulletPoint => new Message(bulletPoint).getMessage(language))
            }
        ]
    },
    {
        partName: new Message(leanCanvasSolutionPartNameMessage).getMessage(language),
        sections: [
            {
                title: new Message(leanCanvasSolutionMessages.title).getMessage(language),
                description: new Message(leanCanvasSolutionMessages.description).getMessage(language),
                bulletPoints: leanCanvasSolutionMessages.bulletPoints.map(bulletPoint => new Message(bulletPoint).getMessage(language))
            }
        ]
    },
    {
        partName: new Message(leanCanvasChannelsPartNameMessage).getMessage(language),
        sections: [
            {
                title: new Message(leanCanvasChannelsMessages.title).getMessage(language),
                description: new Message(leanCanvasChannelsMessages.description).getMessage(language),
                bulletPoints: leanCanvasChannelsMessages.bulletPoints.map(bulletPoint => new Message(bulletPoint).getMessage(language))
            }
        ]
    },
    {
        partName: new Message(leanCanvasRevenueStreamsPartNameMessage).getMessage(language),
        sections: [
            {
                title: new Message(leanCanvasRevenueStreamsMessages.title).getMessage(language),
                description: new Message(leanCanvasRevenueStreamsMessages.description).getMessage(language),
                bulletPoints: leanCanvasRevenueStreamsMessages.bulletPoints.map(bulletPoint => new Message(bulletPoint).getMessage(language))
            }
        ]
    },
    {
        partName: new Message(leanCanvasCostStructurePartNameMessage).getMessage(language),
        sections: [
            {
                title: new Message(leanCanvasCostStructureMessages.title).getMessage(language),
                description: new Message(leanCanvasCostStructureMessages.description).getMessage(language),
                bulletPoints: leanCanvasCostStructureMessages.bulletPoints.map(bulletPoint => new Message(bulletPoint).getMessage(language))
            }
        ]
    },
    {
        partName: new Message(leanCanvasKeyMetricsPartNameMessage).getMessage(language),
        sections: [
            {
                title: new Message(leanCanvasKeyMetricsMessages.title).getMessage(language),
                description: new Message(leanCanvasKeyMetricsMessages.description).getMessage(language),
                bulletPoints: leanCanvasKeyMetricsMessages.bulletPoints.map(bulletPoint => new Message(bulletPoint).getMessage(language))
            }
        ]
    },
    {
        partName: new Message(leanCanvasUnfairAdvantagePartNameMessage).getMessage(language),
        sections: [
            {
                title: new Message(leanCanvasUnfairAdvantageMessages.title).getMessage(language),
                description: new Message(leanCanvasUnfairAdvantageMessages.description).getMessage(language),
                bulletPoints: leanCanvasUnfairAdvantageMessages.bulletPoints.map(bulletPoint => new Message(bulletPoint).getMessage(language))
            }
        ]
    }
]);
const retrieveSubTitleFromType = (type) => {
    if (type === 'customerJobs')
        return { en: `You have activities`, fr: `Tu fais des actions au quotidien` };
    if (type === 'pains')
        return { en: `But you have pains`, fr: `Mais tu rencontres des douleurs` };
    if (type === 'painRelievers')
        return { en: `We want to help you`, fr: `Nous voulons t'aider` };
    if (type === 'productAndServices')
        return { en: `We have a solution`, fr: `Nous avons une solution` };
    if (type === 'gainCreators')
        return { en: `We provide additionnal capabilities`, fr: `Nous apportons encore plus` };
    if (type === 'gains')
        return { en: `You can acheive more`, fr: `Tu pourras ainsi aller au delà` };
    return { en: `!!!ERROR UNKNOWN TYPE!!!`, fr: `!!!ERREUR TYPE INCONU!!!` };
};
const callToActionMessage = {
    en: `I claim!`,
    fr: `Je revendique!`
};
const claimTypeMessage = {
    en: `Claim type`,
    fr: `Type de revendication`
};
const claimTitlePlaceholderMessage = {
    en: `Describe the claim ...`,
    fr: `Décris la revendication...`
};
const claimTitleFieldNameMessage = {
    en: `Claim Title`,
    fr: `Titre de la Revendication.`
};
const declareClaimSubmitMessage = {
    en: `Declare`,
    fr: `Déclarer`
};
const simpleClaimTypeMessage = {
    en: `Claim as a proposal.`,
    fr: `Revendication considérée comme unique proposition.`
};
const signOutMessage = {
    en: `SignOut`,
    fr: `Déconnexion`
};
const signInFormTitleMessage = {
    en: `Your account credentials`,
    fr: `Tes identifiants`
};
const signInFormUsernameMessage = {
    en: `Username:`,
    fr: `Nom du compte:`
};
const signInFormPasswordMessage = {
    en: `Password:`,
    fr: `Mot de passe:`
};
const signInFormSubmitMessage = {
    en: `Sign In`,
    fr: `Connexion`
};
const signInRegisterMessage = {
    en: `Would you like to register on Bangarang?`,
    fr: `Veux-tu t'enregistrer sur Bangarang?`
};
const backToTheClaimMessage = {
    en: `Back to the claim.`,
    fr: `Retourner sur la revendication.`
};
const backToSignInMenuMessage = {
    en: `Sign In`,
    fr: `Connexion`
};
const registerOnBangarangTitleMessage = {
    en: `Register on`,
    fr: `Enregistres-toi sur`
};
const registerSecurityMessage = {
    en: `The current stage of development of Bangarang implies that the security of the accounts is not guaranteed. Please only create accounts with credentials that can be used for testing and demonstration purposes.`,
    fr: `Le stage actuel de développement de Bangarang implique que la sécurité des comptes n'est pas garantie. Ne crées un compte qu'avec des identifiants qui peuvent être utilisées à des fins de test ou de démo.`
};
const registerFormTitleMessage = {
    en: `Create your account.`,
    fr: `Crées ton compte.`
};
const registerFormUsernameMessage = {
    en: `Username:`,
    fr: `Nom d'utilisateur:`
};
const registerFormFullnameMessage = {
    en: `Fullname:`,
    fr: `Nom/Prénom:`
};
const registerFormEmailMessage = {
    en: `E-mail:`,
    fr: `E-mail:`
};
const registerFormPasswordMessage = {
    en: `Password:`,
    fr: `Mot de passe:`
};
const registerFormSubmitMessage = {
    en: `Register`,
    fr: `S'inscrire`
};
const peopleClaimedMessage = {
    en: `people claimed`,
    fr: `personnes ont revendiqués`
};
const claimAgainstMessage = {
    en: `Against`,
    fr: `Contre`
};
const claimForMessage = {
    en: `For`,
    fr: `Pour`
};
const shareClaimMessage = {
    en: `Share claim`,
    fr: `Partager la revendication`
};
const claimCopiedSuccessMessage = {
    en: `Claim address copied to clipboard.`,
    fr: `Lien de partage de la revendication copié dans le presse-papier.`
};
const claimCopiedErrorMessage = {
    en: `Failed to copy claim address to clipboard`,
    fr: `Erreur lors de la copie de la revendication dans le presse-papier`
};

/* src\client\components\Titles\WelcomeTitle.svelte generated by Svelte v3.34.0 */

const WelcomeTitle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	$$unsubscribe_languageStore();

	return `<p class="${"text-2xl text-bangarang-darkEmphasis my-1"}">${escape(new Message(welcomeMessage).getMessage($languageStore))}</p>
<h1 class="${"text-4xl text-bangarang-darkEmphasis my-1"}">${escape(new Message(bangarang).getMessage($languageStore))}</h1>`;
});

/* src\client\components\Descriptions\BangarangDescription.svelte generated by Svelte v3.34.0 */

const BangarangDescription = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	$$unsubscribe_languageStore();
	return `<p class="${"text-sm text-center text-bangarang-lightEmphasis my-1"}">${escape(new Message(bangarangDescriptionMessage).getMessage($languageStore))}</p>`;
});

/* src\client\components\Cards\DemoPreviewCard.svelte generated by Svelte v3.34.0 */
const googleFormUrl = "https://forms.gle/H7FWYyG4HcHYthy99";

const DemoPreviewCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	$$unsubscribe_languageStore();

	return `<div class="${"border rounded my-6 border-bangarang-failed bg-bangarang-light flex flex-col items-center"}"><p class="${"m-1 text-bangarang-lightEmphasis flex-grow text-center text-xs"}">${new Message(demoWarningMessage).getMessage($languageStore)}</p>
    <a${add_attribute("href", googleFormUrl, 0)} target="${"_blank"}" class="${" m-1 underline text-bangarang-darkEmphasis text-sm"}">${escape(new Message(bangarangContactFormMessage).getMessage($languageStore))}</a></div>`;
});

/* src\client\components\Mains\MainMenuMain.svelte generated by Svelte v3.34.0 */

const MainMenuMain = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<main${add_attribute("class", "flex flex-col flex-grow m-auto p-1 justify-center items-center max-w-screen-md", 0)}>${validate_component(WelcomeTitle, "WelcomeTitle").$$render($$result, {}, {}, {})}
    ${validate_component(BangarangDescription, "BangarangDescription").$$render($$result, {}, {}, {})}
    ${validate_component(DemoPreviewCard, "DemoPreviewCard").$$render($$result, {}, {}, {})}</main>`;
});

const idleSigningInNotification = { status: "Idle", message: { en: "Waiting for SigningIn Event.", fr: `En attente d'un événément de connexion.` }, type: "Signing In" };
const successSigningInNotification = { status: "Success", message: { en: "Signed In.", fr: `Connecté.` }, type: "Signing In" };
const alreadySignedInSigningInNotification = { status: "Failed", message: { en: "Already signed in.", fr: `Déjà connecté.` }, type: "Signing In" };
const badCredentialsSigningInNotification = { status: "Failed", message: { en: "Bad credentials. Verify credentials or register to Bangarang.", fr: `Mauvais identifiants. Vérifier les identifiants ou s'enregistrer sur Bangarang.` }, type: "Signing In" };

const idleDeclaringClaimUserNotification = { status: "Idle", message: { en: "Waiting for claim declaration event.", fr: `En attente d'événement de déclaration.` }, type: "Declaring claim." };
const successDeclaringClaimUserNotification = { status: "Success", message: { en: "Declared.", fr: `Déclaré.` }, type: "Declaring claim." };
const claimWithoutTitleDeclaringClaimUserNotification = { status: "Failed", message: { en: "A claim must have a title.", fr: `Une revendication doit avoir un titre.` }, type: "Declaring claim." };
const claimAlreadyExistDeclaringClaimUserNotification = (claimTitle) => ({ status: "Failed", message: { en: `The claim "${claimTitle}" already exist.`, fr: `La revendication "${claimTitle}" existe déjà.` }, type: "Declaring claim." });

const idleRetrievingClaimUserNotification = { status: "Idle", message: { en: "Waiting for retrieving claim event.", fr: `En attente d'événement de récupération de revendication.` }, type: "Retrieving claim." };
const executingRetrievingClaimUserNotification = { status: "Executing", message: { en: "Retrieving claim...", fr: `Récupération de revendication en cours...` }, type: "Retrieving claim." };
const successRetrievingClaimUserNotification = (claim) => ({ status: "Success", message: { en: "Claim retrieved.", fr: `Revendication récupérée.` }, type: "Retrieving claim.", claimWithMemberPreviousClaimChoice: claim });
const claimNotDeclaredRetrievingClaimUserNotification = ({ status: "Failed", message: { en: "The claim is not declared on Bangarang.", fr: `La revendication n'est pas déclarée sur Bangarang.` }, type: "Retrieving claim." });
const unexpectedErrorRetrievingClaimUserNotification = (error) => ({ status: "Failed", message: { en: `Unexpected Error: '${error.message}'.`, fr: `Erreur inatendue: '${error.message}'` }, type: "Retrieving claim." });

const executingSearchingClaimsUserNotification = { status: "Executing", message: { en: `Searching claims...`, fr: `Recherche de revendications en cours...` }, type: "Searching Claims" };
const idleSearchingClaimsUserNotification = { status: "Idle", message: { en: `Waiting for searching claims event.`, fr: `En attente d'événement de recherche de revendication.` }, type: "Searching Claims" };
const successSearchingClaimsUserNotification = (retreivedClaims) => ({ status: "Success", message: { en: `${retreivedClaims.length} claims found.`, fr: `${retreivedClaims.length} revendications trouvées.` }, type: "Searching Claims", retreivedClaims });
const unexpectedErrorSearchingClaimsUserNotification = (error) => ({ status: "Failed", message: { en: `Unexpected error '${error.message}'.`, fr: `Erreur innatendue: '${error.message}'` }, type: "Searching Claims" });
/*
export const claimNotDeclaredRetrievingClaimUserNotification:RetrievingClaimUserNotificationContract = ({status:"Failed", message:"The claim is not declared on Bangarang.",type:"Retrieving claim."})
*/

const idleClaimingUserNotification = { status: "Idle", message: { en: `Waiting for claiming event.`, fr: `En attente de l'événementer revendiquer.` }, type: "Claiming." };
const executingClaimingUserNotification = { status: "Executing", message: { en: `Executing claiming event.`, fr: `Revendication en cours.` }, type: "Claiming." };
const successClaimingUserNotification = { status: "Success", message: { en: `Claimed.`, fr: `Revendiqué.` }, type: "Claiming." };
const claimNotDeclaredClaimingUserNotification = (claimId) => ({ status: "Failed", message: { en: `The claim '${claimId}' is not declared on Bangarang.`, fr: `La revendication '${claimId}' n'est pas déclarée dans Bangarang.` }, type: "Claiming." });
const mustBeSignedInClaimingUserNotification = { status: "Failed", message: { en: `You must be signed in in order to claim.`, fr: `Tu dois être connecté afin de pouvoir revendiquer.` }, type: "Claiming." };
const multipleTimesClaimingUserNotification = (claimChoice) => ({ status: "Failed", message: { en: `Claiming '${claimChoice}' multiple times on a claim is forbidden.`, fr: `Revendiquer '${claimChoice}' plusieurs fois sur une revendication est interdit.` }, type: "Claiming." });
const unexpectedErrorClaimingUserNotification = (error) => ({ status: "Failed", message: { en: `Unexpected Error: '${error.message}'.`, fr: `Erreur inatendue: '${error.message}'.` }, type: "Claiming." });

class Claim {
    constructor(claimContract) {
        this.title = claimContract.title;
        this.type = claimContract.type;
        this.peopleClaimed = claimContract.peopleClaimed;
        this.peopleClaimedFor = claimContract.peopleClaimedFor;
        this.peopleClaimedAgainst = claimContract.peopleClaimedAgainst;
        this.id = claimContract.id;
    }
    increasePeopleClaimedWhenNoPreviousClaimChoice(previousClaimChoice) {
        if (!previousClaimChoice)
            this.peopleClaimed++;
        return this;
    }
    increaseClaimChoiseFromClaimChoice(claimChoice) {
        (claimChoice === "For") ? this.peopleClaimedFor++ : this.peopleClaimedAgainst++;
        return this;
    }
    removePreviousClaimOnClaim(previousClaimChoice) {
        if (previousClaimChoice)
            (previousClaimChoice === "For") ? this.peopleClaimedFor-- : this.peopleClaimedAgainst--;
        return this;
    }
    save(bangarangClaimInteractor) {
        return bangarangClaimInteractor.saveClaim(this);
    }
    claiming(bangarangClaimInteractor, bangarangMembersInteractor, username, claimChoice) {
        return Promise.all([
            bangarangClaimInteractor.saveClaim(this),
            bangarangMembersInteractor.saveMemberClaim({ claimId: this.id, memberUsername: username, claimChoice })
        ])
            .then(([saveClaimResult, saveMemberClaimResult]) => {
            if (saveClaimResult instanceof Error || saveMemberClaimResult instanceof Error)
                return new Error("Error while claiming.");
        });
    }
}

const successRegisteringUserNotification = { status: "Success", message: { en: "Registered.", fr: `Enregistré.` }, type: "Registering." };
const badEmailRegisteringUserNotification = { status: "Failed", message: { en: "Email invalid.", fr: `Email invalide.` }, type: "Registering." };
const unsecurePasswordRegisteringUserNotification = { status: "Failed", message: { en: "Unsecure password.", fr: `Mot de passe pas sécurisé.` }, type: "Registering." };
const alreadyMemberRegisteringUserNotification = { status: "Failed", message: { en: "Already member of Bangarang.", fr: `Déjà membre de Bangarang.` }, type: "Registering." };
const idleMemberRegisteringUserNotification = { status: "Idle", message: { en: "Waiting for Registering Event.", fr: `En attente d'événement d'enregistrement.` }, type: "Registering." };

class User {
    constructor(bangarangAdapters) {
        this.bangarangAdapters = bangarangAdapters;
    }
    registering(userContract, password) {
        return this.bangarangAdapters.bangarangMembersInteractor.isMemberExistWithUsername(userContract.username)
            .then(isMemberExistWithUsername => {
            if (isMemberExistWithUsername instanceof Error)
                throw new Error("NOT IMPLEMENTED");
            if (isMemberExistWithUsername)
                throw alreadyMemberRegisteringUserNotification;
            if (!this.bangarangAdapters.passwordInteractor.isPasswordSecure(password))
                throw unsecurePasswordRegisteringUserNotification;
            if (!this.bangarangAdapters.emailInteractor.isEmailValid(userContract.email))
                throw badEmailRegisteringUserNotification;
            return this.bangarangAdapters.bangarangMembersInteractor.saveMember(userContract);
        })
            .then(result => {
            if (result instanceof Error)
                throw result;
            return this.bangarangAdapters.bangarangMembersInteractor.saveCredentials({ username: userContract.username, password });
        })
            .then(result => {
            if (result instanceof Error)
                throw result;
            this.bangarangAdapters.registeringUserNotificationInteractor.notify(successRegisteringUserNotification);
        })
            .catch((result) => {
            if (result instanceof Error)
                console.warn(`Unhandled error : ${result}`);
            else
                this.bangarangAdapters.registeringUserNotificationInteractor.notify(result);
        });
    }
    claiming(claimId, claimChoice) {
        if (this.userContract === undefined) {
            this.bangarangAdapters.bangarangUserInterfaceInteractor.goToSigningInMenu();
            this.bangarangAdapters.claimingUserNotificationInteractor.notify(mustBeSignedInClaimingUserNotification);
            return Promise.resolve();
        }
        else {
            const userContract = this.userContract;
            return Promise.all([
                this.bangarangAdapters.bangarangClaimInteractor.claimById(claimId),
                this.bangarangAdapters.bangarangMembersInteractor.retrievePreviousMemberClaimChoiceOnClaim(userContract.username, claimId)
            ])
                .then(([retreivedClaim, previousClaimChoice]) => {
                const isUserHasPreviouslyMadeTheSameClaimChoice = (previousClaimChoice, claimChoice) => previousClaimChoice !== undefined && previousClaimChoice === claimChoice;
                if (retreivedClaim instanceof Error)
                    throw claimNotDeclaredClaimingUserNotification(claimId);
                if (previousClaimChoice instanceof Error)
                    throw unexpectedErrorClaimingUserNotification(previousClaimChoice);
                else if (isUserHasPreviouslyMadeTheSameClaimChoice(previousClaimChoice, claimChoice))
                    throw multipleTimesClaimingUserNotification(claimChoice);
                return new Claim(retreivedClaim)
                    .increasePeopleClaimedWhenNoPreviousClaimChoice(previousClaimChoice)
                    .removePreviousClaimOnClaim(previousClaimChoice)
                    .increaseClaimChoiseFromClaimChoice(claimChoice)
                    .claiming(this.bangarangAdapters.bangarangClaimInteractor, this.bangarangAdapters.bangarangMembersInteractor, userContract.username, claimChoice);
            })
                .then(claimingResult => {
                if (claimingResult instanceof Error)
                    throw unexpectedErrorClaimingUserNotification(claimingResult);
                this.bangarangAdapters.claimingUserNotificationInteractor.notify(successClaimingUserNotification);
            })
                .catch((notification) => this.bangarangAdapters.claimingUserNotificationInteractor.notify(notification));
        }
    }
    searchingClaims(searchCriteria) {
        let Order;
        (function (Order) {
            Order[Order["keep"] = 0] = "keep";
            Order[Order["change"] = -1] = "change";
        })(Order || (Order = {}));
        const wordSeparator = " ";
        const sentenceIntoWords = (sentence, wordSeparator) => sentence.split(wordSeparator);
        function claimSortEngine(nextClaim, currentClaim, searchCriteria) {
            const sentenceWordsNotInOtherSentence = (sentence, otherSentence) => sentenceIntoWords(sentence, wordSeparator)
                .filter(titleWord => !sentenceIntoWords(otherSentence, wordSeparator).includes(titleWord));
            const sentenceWordsInOtherSentence = (sentence, otherSentence) => sentenceIntoWords(sentence, wordSeparator)
                .filter(titleWord => sentenceIntoWords(otherSentence, wordSeparator).includes(titleWord));
            const titlesMatchSearchCriteria = (currentClaimTitle, nextClaimTitle, searchCriteria) => {
                const claimTitleWithoutWordsThatAreNotInSearchCriteria = (claimTitle, searchCriteria) => sentenceWordsNotInOtherSentence(claimTitle, sentenceWordsNotInOtherSentence(claimTitle, searchCriteria).join(wordSeparator)).join(wordSeparator);
                return claimTitleWithoutWordsThatAreNotInSearchCriteria(currentClaimTitle, searchCriteria) === claimTitleWithoutWordsThatAreNotInSearchCriteria(nextClaimTitle, searchCriteria);
            };
            const isNextClaimHaveMoreSearchCriteriaWordsThanCurrentClaim = () => sentenceWordsInOtherSentence(searchCriteria.toLowerCase(), currentClaim.title.toLowerCase()).length < sentenceWordsInOtherSentence(searchCriteria.toLowerCase(), nextClaim.title.toLowerCase()).length;
            if (isNextClaimHaveMoreSearchCriteriaWordsThanCurrentClaim())
                return Order.change;
            if (currentClaim.title.includes(searchCriteria))
                return Order.keep;
            if (titlesMatchSearchCriteria(currentClaim.title.toLowerCase(), nextClaim.title.toLowerCase(), searchCriteria.toLowerCase()))
                return Order.keep;
            if (sentenceWordsNotInOtherSentence(currentClaim.title, searchCriteria).length > 0)
                return Order.change;
            return Order.keep;
        }
        return this.bangarangAdapters.bangarangClaimInteractor
            .retrieveClaimsThatContainInIncensitiveCaseTitleOneOrMoreIncencitiveCaseSearchCriteriaWords(searchCriteria)
            .then(retreivedClaims => {
            if (retreivedClaims instanceof Error) {
                this.bangarangAdapters.searchingClaimsUserNotificationInteractor.notify(unexpectedErrorSearchingClaimsUserNotification(retreivedClaims));
            }
            else {
                retreivedClaims.sort((nextClaim, previousClaim) => claimSortEngine(nextClaim, previousClaim, searchCriteria));
                this.bangarangAdapters.searchingClaimsUserNotificationInteractor.notify(successSearchingClaimsUserNotification(retreivedClaims));
            }
        });
    }
    retrievingClaimById(claimId) {
        let claim;
        return this.bangarangAdapters.bangarangClaimInteractor.claimById(claimId)
            .then(claimById => {
            if (claimById instanceof Error)
                throw (claimNotDeclaredRetrievingClaimUserNotification);
            claim = claimById;
            return (this.userContract === undefined) ? undefined : this.bangarangAdapters.bangarangMembersInteractor.retrievePreviousMemberClaimChoiceOnClaim(this.userContract.username, claimId);
        })
            .then(previousMemberClaimChoiceOnClaim => {
            if (previousMemberClaimChoiceOnClaim instanceof Error)
                throw unexpectedErrorRetrievingClaimUserNotification(previousMemberClaimChoiceOnClaim);
            else {
                const claimWithMemberPreviousClaimChoice = {
                    title: claim.title,
                    type: claim.type,
                    peopleClaimed: claim.peopleClaimed,
                    peopleClaimedAgainst: claim.peopleClaimedAgainst,
                    peopleClaimedFor: claim.peopleClaimedFor,
                    previousUserClaimChoice: previousMemberClaimChoiceOnClaim,
                    id: claim.id
                };
                this.bangarangAdapters.retrievingClaimUserNotificationInteractor.notify(successRetrievingClaimUserNotification(claimWithMemberPreviousClaimChoice));
            }
        })
            .catch((notification) => this.bangarangAdapters.retrievingClaimUserNotificationInteractor.notify(notification));
    }
    declaringClaim(claimTitle, claimType, claimId) {
        const shouldSaveClaimWhenClaimDontExistByTitleUpperCase = (isClaimExistByTitleUpperCase) => {
            if (!isClaimExistByTitleUpperCase)
                return new Claim({ title: claimTitle, type: claimType, peopleClaimed: 0, peopleClaimedFor: 0, peopleClaimedAgainst: 0, id: claimId })
                    .save(this.bangarangAdapters.bangarangClaimInteractor)
                    .then(result => {
                    if (result instanceof Error)
                        throw new Error(`MISSIGN SPECS : ${result}`);
                    this.bangarangAdapters.declaringClaimUserNotificationInteractor.notify(successDeclaringClaimUserNotification);
                    return isClaimExistByTitleUpperCase;
                });
            this.bangarangAdapters.declaringClaimUserNotificationInteractor.notify(claimAlreadyExistDeclaringClaimUserNotification(claimTitle));
            return Promise.resolve(isClaimExistByTitleUpperCase);
        };
        if (claimTitle === "") {
            this.bangarangAdapters.declaringClaimUserNotificationInteractor.notify(claimWithoutTitleDeclaringClaimUserNotification);
            return Promise.resolve();
        }
        else
            return this.bangarangAdapters.bangarangClaimInteractor.isClaimExistByTitleIncensitiveCase(claimTitle)
                .then(isClaimExistByTitleUpperCase => {
                if (isClaimExistByTitleUpperCase instanceof Error)
                    throw isClaimExistByTitleUpperCase;
                return shouldSaveClaimWhenClaimDontExistByTitleUpperCase(isClaimExistByTitleUpperCase);
            })
                .then(isClaimExistByTitleUpperCase => (isClaimExistByTitleUpperCase) ?
                this.bangarangAdapters.bangarangClaimInteractor.claimByTitleIncencitiveCase(claimTitle) :
                this.bangarangAdapters.bangarangClaimInteractor.claimById(claimId))
                .then(claim => {
                if (claim instanceof Error)
                    this.bangarangAdapters.retrievingClaimUserNotificationInteractor.notify(claimNotDeclaredRetrievingClaimUserNotification);
                else
                    this.bangarangAdapters.bangarangUserInterfaceInteractor.goToClaim(claim.id);
            })
                .catch(error => {
                console.warn(`Unhandled error : ${error}`);
            });
    }
    signingIn(username, password) {
        if (this.userContract !== undefined) {
            this.bangarangAdapters.signingInUserNotificationInteractor.notify(alreadySignedInSigningInNotification);
            return Promise.resolve();
        }
        else {
            return this.bangarangAdapters.bangarangMembersInteractor.isCredentialsValid({ username: username, password })
                .then(isCredentialsValid => {
                if (isCredentialsValid instanceof Error)
                    throw isCredentialsValid;
                if (isCredentialsValid === false)
                    throw (badCredentialsSigningInNotification);
                return this.bangarangAdapters.bangarangMembersInteractor.retrieveUserContract(username);
            })
                .then(userContract => {
                if (userContract instanceof Error)
                    throw userContract;
                this.userContract = userContract;
                if (userContract === undefined)
                    this.bangarangAdapters.signingInUserNotificationInteractor.notify(badCredentialsSigningInNotification);
                else
                    this.bangarangAdapters.signingInUserNotificationInteractor.notify(successSigningInNotification);
            })
                .catch((notification) => {
                if (notification instanceof Error)
                    console.warn(`Unhandled error : ${notification}`);
                else
                    this.bangarangAdapters.signingInUserNotificationInteractor.notify(notification);
            });
        }
    }
    retrieveUserContract() {
        return this.userContract;
    }
}

const bangarangClaimNotFoundById = (id) => `Claim with id ${id} not found.`;
const bangarangClaimNotFoundByTittleUpperCase = (claimTitle) => `Claim with title like '${claimTitle}' not found.`;

class FakeBangarangClaimInteractor {
    constructor(forceErrorKeyword) {
        this.forceErrorKeyword = forceErrorKeyword;
        this.declaredClaims = [];
    }
    reset() {
        this.removeAllClaims();
        return Promise.resolve();
    }
    claimByTitleIncencitiveCase(claimTitle) {
        const claimFound = this.declaredClaims.find(declaredClaim => declaredClaim.title.toLowerCase() === claimTitle.toLowerCase());
        if (claimFound)
            return Promise.resolve(claimFound);
        return Promise.resolve(new Error(bangarangClaimNotFoundByTittleUpperCase(claimTitle.toLowerCase())));
    }
    isClaimExistByTitleIncensitiveCase(claimTitle) {
        if (this.forceErrorKeyword && this.forceErrorKeyword === claimTitle)
            return Promise.resolve(new Error(`Error, claim with title '${claimTitle}' not supported.`));
        return Promise.resolve((this.findClaimByTitleIncencitiveCase(claimTitle)) ? true : false);
    }
    saveClaim(claimToSave) {
        if (this.forceErrorKeyword && this.forceErrorKeyword === claimToSave.title)
            return Promise.resolve(new Error(`Error, claim with title '${claimToSave.title}' not supported.`));
        const existingClaimIndex = this.declaredClaims.findIndex(claim => claim.title === claimToSave.title);
        if (existingClaimIndex > -1)
            this.declaredClaims[existingClaimIndex] = claimToSave;
        else
            this.declaredClaims.push(claimToSave);
        return Promise.resolve();
    }
    retrieveClaimsThatContainInIncensitiveCaseTitleOneOrMoreIncencitiveCaseSearchCriteriaWords(searchCriteria) {
        if (this.forceErrorKeyword && searchCriteria.includes(this.forceErrorKeyword))
            return Promise.resolve(new Error(`Error, search criteria containing '${searchCriteria}' not supported.`));
        return Promise.resolve(this.declaredClaims.filter(claim => searchCriteria.split(" ").some(searchCriteriaWord => claim.title.toLowerCase().includes(searchCriteriaWord.toLowerCase()))));
    }
    claimById(id) {
        const claimFound = this.declaredClaims.find(declaredClaim => declaredClaim.id === id);
        if (claimFound)
            return Promise.resolve(claimFound);
        return Promise.resolve(new Error(bangarangClaimNotFoundById(id)));
    }
    declareClaim(claim) {
        this.declaredClaims.push(claim);
    }
    findClaimByTitleIncencitiveCase(claimTitle) {
        return this.declaredClaims.find(declaredClaim => declaredClaim.title.toLowerCase() === claimTitle.toLowerCase());
    }
    removeAllClaims() {
        this.declaredClaims = [];
    }
}

const bangarangMemberNotFoundError = (username) => `Bangarang member with username '${username}' not found`;

const credentialsMissing = (username) => `Credentials missing for username ${username}`;

class FakeBangarangMembersInteractor {
    constructor() {
        this.membersCredentials = [];
        this.members = [];
        this.membersClaims = [];
    }
    retrieveUserContract(username) {
        if (username === "error")
            return Promise.resolve(new Error(`${username} error!`));
        const userContract = this.members.find(user => user.username === username);
        return Promise.resolve(userContract);
    }
    isMemberExistWithUsername(username) {
        const result = this.members.some(member => member.username === username);
        return Promise.resolve(result);
    }
    retrievePreviousMemberClaimChoiceOnClaim(username, claimId) {
        var _a;
        if (username === "error")
            return Promise.resolve(new Error(`Error, user with username ${username} not supported.`));
        const result = (_a = this.membersClaims
            .find(memberClaim => memberClaim.memberUsername === username && memberClaim.claimId === claimId)) === null || _a === void 0 ? void 0 : _a.claimChoice;
        return Promise.resolve(result);
    }
    saveCredentials(credentials) {
        if (credentials.username === "error")
            return Promise.resolve(new Error(`Error, user with username ${credentials.username} not supported.`));
        return this.saveOnDatabasePattern(credentials, this.membersCredentials, credentialOnDatabase => credentialOnDatabase.username === credentials.username);
    }
    saveMember(userContract) {
        if (userContract.username === "error")
            return Promise.resolve(new Error(`Error, user with username ${userContract.username} not supported.`));
        return this.saveOnDatabasePattern(userContract, this.members, bangarangMember => bangarangMember.username === userContract.username);
    }
    saveMemberClaim(memberClaim) {
        return this.saveOnDatabasePattern(memberClaim, this.membersClaims, bangarangMemberClaim => bangarangMemberClaim.claimId === memberClaim.claimId);
    }
    isCredentialsValid(credentials) {
        const validCredentials = this.membersCredentials.find(credentialOnDatabase => credentialOnDatabase.username === credentials.username && credentialOnDatabase.password === credentials.password);
        if (validCredentials === undefined)
            return Promise.resolve(false);
        return Promise.resolve(true);
    }
    specificFindMemberFromUsername(username) {
        const bangarangMember = this.members.find(member => member.username === username);
        if (bangarangMember)
            return bangarangMember;
        throw new Error(bangarangMemberNotFoundError(username));
    }
    specificFindMemberPasswordFromUsername(username) {
        const credentials = this.membersCredentials.find(credentials => credentials.username === username);
        if (credentials)
            return credentials.password;
        throw new Error(credentialsMissing(username));
    }
    specificWithMembersClaims(membersClaims) {
        this.membersClaims = membersClaims;
    }
    specificWithMembers(members) {
        this.members = members;
    }
    specificWithCredentials(credentials) {
        this.membersCredentials = credentials;
    }
    reset() {
        this.specificWithCredentials([]);
        this.specificWithMembers([]);
        this.specificWithMembersClaims([]);
        return Promise.resolve();
    }
    saveOnDatabasePattern(toSave, database, finder) {
        const databaseElementIndex = database.findIndex(finder);
        (databaseElementIndex > -1) ? database[databaseElementIndex] = toSave : database.push(toSave);
        return Promise.resolve();
    }
}

class FakeBangarangUserInterfaceInteractor {
    constructor() {
        this.currentView = "";
    }
    goToSigningInMenu() {
        this.currentView = StaticView.SigningInMenu;
    }
    goToClaim(claimId) {
        this.currentView = claimId;
    }
}

class FakeDeclaringClaimUserNotificationInteractor {
    resetNotification() {
        this.currentUserNotification = undefined;
    }
    notify(userNotification) {
        this.currentUserNotification = userNotification;
    }
}

class FakeSigningInUserNotificationInteractor {
    constructor() { }
    notify(userNotification) {
        this.currentUserNotification = userNotification;
    }
}

class FakeSearchingClaimsUserNotificationInteractor {
    notify(userNotification) {
        this.currentNotification = userNotification;
    }
}

class FakeRetrievingClaimUserNotificationInteractor {
    resetNotification() {
        this.currentUserNotification = undefined;
    }
    notify(userNotification) {
        this.currentUserNotification = userNotification;
    }
}

class FakeClaimingUserNotificationInteractor {
    notify(userNotification) {
        this.currentUserNotification = userNotification;
    }
}

class FakeRegisteringUserNotificationInteractor {
    constructor() { }
    notify(userNotification) {
        this.currentUserNotification = userNotification;
    }
}

class FakePasswordInteractor {
    isPasswordSecure(password) {
        return password !== "password";
    }
}

class InternalEmailInteractor {
    isEmailValid(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

class UserBuilder {
    constructor() {
        this.bangarangAdapters = {
            bangarangClaimInteractor: new FakeBangarangClaimInteractor(),
            bangarangMembersInteractor: new FakeBangarangMembersInteractor(),
            bangarangUserInterfaceInteractor: new FakeBangarangUserInterfaceInteractor(),
            declaringClaimUserNotificationInteractor: new FakeDeclaringClaimUserNotificationInteractor(),
            signingInUserNotificationInteractor: new FakeSigningInUserNotificationInteractor(),
            retrievingClaimUserNotificationInteractor: new FakeRetrievingClaimUserNotificationInteractor(),
            searchingClaimsUserNotificationInteractor: new FakeSearchingClaimsUserNotificationInteractor(),
            claimingUserNotificationInteractor: new FakeClaimingUserNotificationInteractor(),
            registeringUserNotificationInteractor: new FakeRegisteringUserNotificationInteractor(),
            emailInteractor: new InternalEmailInteractor(),
            passwordInteractor: new FakePasswordInteractor()
        };
    }
    withDeclaringClaimUserNotificationInteractor(declaringClaimUserNotificationInteractor) {
        this.bangarangAdapters.declaringClaimUserNotificationInteractor = declaringClaimUserNotificationInteractor;
        return this;
    }
    withRetrievingClaimUserNotificationInteractor(retrievingClaimUserNotificationInteractor) {
        this.bangarangAdapters.retrievingClaimUserNotificationInteractor = retrievingClaimUserNotificationInteractor;
        return this;
    }
    withSigningInUserNotificationInteractor(signingInUserNotificationInteractor) {
        this.bangarangAdapters.signingInUserNotificationInteractor = signingInUserNotificationInteractor;
        return this;
    }
    withClaimingUserNotificationInteractor(claimingUserNotificationInteractor) {
        this.bangarangAdapters.claimingUserNotificationInteractor = claimingUserNotificationInteractor;
        return this;
    }
    withBangarangUserInterfaceInteractor(bangarangUserInterfaceInteractor) {
        this.bangarangAdapters.bangarangUserInterfaceInteractor = bangarangUserInterfaceInteractor;
        return this;
    }
    withSearchingClaimsUserNotificationInteractor(searchingClaimsUserNotificationInteractor) {
        this.bangarangAdapters.searchingClaimsUserNotificationInteractor = searchingClaimsUserNotificationInteractor;
        return this;
    }
    withBangarangClaimInteractor(bangarangClaimInteractor) {
        this.bangarangAdapters.bangarangClaimInteractor = bangarangClaimInteractor;
        return this;
    }
    getUser() {
        if (!this.user)
            this.user = new User(this.bangarangAdapters);
        return this.user;
    }
    resetUser() {
        this.user = new User(this.bangarangAdapters);
        return this;
    }
    withBangarangMembersInteractor(bangarangMembersInteractor) {
        this.bangarangAdapters.bangarangMembersInteractor = bangarangMembersInteractor;
        return this;
    }
    withRegisteringUserNotificationInteractor(registeringUserNotificationInteractor) {
        this.bangarangAdapters.registeringUserNotificationInteractor = registeringUserNotificationInteractor;
        return this;
    }
}

class RestInteractor {
    constructor(restEndpointConfiguration) {
        if (!(restEndpointConfiguration.scheme === "http" || restEndpointConfiguration.scheme === "https") ||
            restEndpointConfiguration.endpointFullyQualifiedDomainName === undefined)
            throw new Error(`restEndpointConfiguration not supported: ${JSON.stringify(restEndpointConfiguration)} `);
        const ressourceName = `${restEndpointConfiguration.endpointFullyQualifiedDomainName}${(restEndpointConfiguration.port) ? `:${restEndpointConfiguration.port}` : ``}`;
        this.baseUrl = `${restEndpointConfiguration.scheme}://${ressourceName}/${restEndpointConfiguration.apiPrefix}`;
    }
    get(request, queryParams) {
        const axiosRequestConfig = {
            params: new URLSearchParams(queryParams),
            headers: { 'Access-Control-Allow-Origin': '*' }
        };
        return axios__default['default'].get(`${this.baseUrl}${request}`, axiosRequestConfig)
            .then(response => (response.status === 200) ? response.data : new Error(response.statusText))
            .catch((error) => this.axiosErrorToError(error));
    }
    post(request, data) {
        const axiosRequestConfig = {
            url: `${this.baseUrl}${request}`,
            method: 'POST',
            headers: { 'Access-Control-Allow-Origin': '*' },
            data
        };
        return axios__default['default'](axiosRequestConfig)
            .then(response => { if (response.status !== 200)
            throw new Error(response.statusText); })
            .catch((error) => this.axiosErrorToError(error));
    }
    axiosErrorToError(axiosError) {
        var _a, _b, _c, _d, _e;
        if (((_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.status) === 500 && ((_c = (_b = axiosError.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.error))
            return new Error((_e = (_d = axiosError.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.error);
        return axiosError;
    }
}

class RestBangarangClaimInteractor {
    constructor(restInteractor) {
        this.restInteractor = restInteractor;
    }
    specificReset() {
        return this.restInteractor.post(`/reset`, {})
            .then(result => { if (result instanceof Error)
            throw result; });
    }
    claimById(id) {
        return this.restInteractor.get(`/claims`, { id });
    }
    claimByTitleIncencitiveCase(claimTitle) {
        return this.restInteractor.get(`/claims`, { claimTitle });
    }
    isClaimExistByTitleIncensitiveCase(claimTitle) {
        return this.restInteractor.get(`/isClaimExistByTitleUpperCase`, { claimTitle })
            .then(data => (data instanceof Error)
            ? data :
            (data.isClaimExistByTitleUpperCase !== undefined)
                ? data.isClaimExistByTitleUpperCase :
                new Error("isMemberExistWithUsername missing on body."));
    }
    retrieveClaimsThatContainInIncensitiveCaseTitleOneOrMoreIncencitiveCaseSearchCriteriaWords(searchCriteria) {
        return this.restInteractor.get(`/claims`, { searchCriteria });
    }
    saveClaim(claimToSave) {
        return this.restInteractor.post(`/saveClaim`, claimToSave);
    }
}

class RestBangarangMembersInteractor {
    constructor(restInteractor) {
        this.restInteractor = restInteractor;
    }
    retrieveUserContract(username) {
        return this.restInteractor.get(`/retrieveUserContract`, { username })
            .then(userContract => {
            if (typeof userContract === "string")
                return undefined;
            return userContract;
        });
    }
    isMemberExistWithUsername(username) {
        return this.restInteractor.get(`/isMemberExistWithUsername/${username}`)
            .then(data => (data instanceof Error)
            ? data : (data.isMemberExistWithUsername !== undefined)
            ? data.isMemberExistWithUsername : new Error("isMemberExistWithUsername missing on body."));
    }
    isSignedIn(username) {
        return this.restInteractor.get(`/isSignedIn/${username}`)
            .then(data => (data instanceof Error)
            ? data : (data.isSignedIn !== undefined)
            ? data.isSignedIn : new Error("isSignedIn missing on body."));
    }
    retrievePreviousMemberClaimChoiceOnClaim(username, claimId) {
        return this.restInteractor.get(`/retrievePreviousMemberClaimChoiceOnClaim/${username}/${claimId}`)
            .then(data => (data instanceof Error) ? data : data.retrievePreviousMemberClaimChoiceOnClaim);
    }
    saveCredentials(credentials) {
        return this.restInteractor.post(`/saveCredentials`, credentials);
    }
    saveMember(userContract) {
        return this.restInteractor.post(`/saveMember`, userContract);
    }
    saveMemberClaim(memberClaim) {
        return this.restInteractor.post(`/saveMemberClaim`, memberClaim);
    }
    isCredentialsValid(credentials) {
        return this.restInteractor.get(`/isCredentialsValid`, { username: credentials.username, password: credentials.password })
            .then(data => (data instanceof Error) ? data : data.isCredentialsValid);
    }
    specificReset() {
        return this.restInteractor.post(`/reset`, {})
            .then(result => { if (result instanceof Error)
            throw result; });
    }
}

class SvelteBangarangUserInterfaceInteractor {
    goToSigningInMenu() {
        let url = "/";
        const unsubscribeLanguageStore = languageStore.subscribe(language => url = `/${language}/${StaticView.SigningInMenu}`);
        goto(url);
        unsubscribeLanguageStore();
    }
    goToClaim(claimId) {
        let url = "/";
        const unsubscribeLanguageStore = languageStore.subscribe(language => url = `/${language}/${linkPrefixes.claimLinkPrefix}${claimId}`);
        goto(url);
        unsubscribeLanguageStore();
    }
}

const claimingUserNotificationStore = writable(idleClaimingUserNotification);

class SvelteClaimingUserNotificationInteractor {
    notify(userNotification) {
        const timeOfClaimedNotification = 1500;
        claimingUserNotificationStore.set(userNotification);
        setTimeout(() => claimingUserNotificationStore.set(idleClaimingUserNotification), timeOfClaimedNotification);
    }
}

const declaringClaimUserNotificationStore = writable(idleDeclaringClaimUserNotification);

class SvelteDeclaringClaimUserNotificationInteractor {
    notify(userNotification) {
        const timeOfClaimDeclaredNotification = 1500;
        declaringClaimUserNotificationStore.set(userNotification);
        setTimeout(() => declaringClaimUserNotificationStore.set(idleDeclaringClaimUserNotification), timeOfClaimDeclaredNotification);
    }
}

const retrievingClaimUserNotificationStore = writable(idleRetrievingClaimUserNotification);

class SvelteRetrievingClaimUserNotificationInteractor {
    notify(userNotification) {
        const timeOfClaimRetrievingNotification = 1500;
        retrievingClaimUserNotificationStore.set(userNotification);
        setTimeout(() => retrievingClaimUserNotificationStore.set(idleRetrievingClaimUserNotification), timeOfClaimRetrievingNotification);
    }
}

const searchingClaimsUserNotificationStore = writable(idleSearchingClaimsUserNotification);

class SvelteSearchingClaimsUserNotificationInteractor {
    notify(userNotification) {
        const timeOfSearchingClaimsNotification = 1500;
        searchingClaimsUserNotificationStore.set(userNotification);
        setTimeout(() => searchingClaimsUserNotificationStore.set(idleSearchingClaimsUserNotification), timeOfSearchingClaimsNotification);
    }
}

const signingInNotificationStore = writable(idleSigningInNotification);

class SvelteSigningInUserNotificationInteractor {
    notify(userNotification) {
        const timeOfSignedNotification = 1500;
        signingInNotificationStore.set(userNotification);
        setTimeout(() => signingInNotificationStore.set(idleSigningInNotification), timeOfSignedNotification);
    }
}

const registeringUserNotificationStore = writable(idleMemberRegisteringUserNotification);

class SvelteRegisteringUserNotificationInteractor {
    notify(userNotification) {
        const timeOfClaimDeclaredNotification = 1500;
        registeringUserNotificationStore.set(userNotification);
        setTimeout(() => registeringUserNotificationStore.set(idleMemberRegisteringUserNotification), timeOfClaimDeclaredNotification);
    }
}

const bangarangMembersInteractor = new RestBangarangMembersInteractor(new RestInteractor({
    endpointFullyQualifiedDomainName: "localhost",
    port: (process.env.PORT) ? process.env.PORT : "3000" ,
    apiPrefix: "restGcpDatastoreMemberInteractor",
    scheme: "http"
}));
const bangarangClaimInteractor = new RestBangarangClaimInteractor(new RestInteractor({
    endpointFullyQualifiedDomainName: "localhost",
    port: (process.env.PORT) ? process.env.PORT : "3000" ,
    apiPrefix: "restGcpDatastoreClaimInteractor",
    scheme: "http"
}));
const fakeBangarangClaimInteractor = new FakeBangarangClaimInteractor();
const uiBangarangUserBuilder = new UserBuilder()
    .withBangarangClaimInteractor(bangarangClaimInteractor)
    .withBangarangMembersInteractor(bangarangMembersInteractor)
    .withBangarangUserInterfaceInteractor(new SvelteBangarangUserInterfaceInteractor())
    .withClaimingUserNotificationInteractor(new SvelteClaimingUserNotificationInteractor())
    .withDeclaringClaimUserNotificationInteractor(new SvelteDeclaringClaimUserNotificationInteractor())
    .withRetrievingClaimUserNotificationInteractor(new SvelteRetrievingClaimUserNotificationInteractor())
    .withSearchingClaimsUserNotificationInteractor(new SvelteSearchingClaimsUserNotificationInteractor())
    .withSigningInUserNotificationInteractor(new SvelteSigningInUserNotificationInteractor())
    .withRegisteringUserNotificationInteractor(new SvelteRegisteringUserNotificationInteractor());
demoClaims().forEach(claim => fakeBangarangClaimInteractor.saveClaim(claim));
function demoClaims() {
    const claims = new Array();
    claims.push({
        peopleClaimed: 10,
        peopleClaimedAgainst: 9,
        peopleClaimedFor: 1,
        title: "MonResto only offers meat in its menus, he needs at least one menu with only Vegan ingredients.",
        id: "claim1",
        type: "Simple"
    });
    claims.push({
        peopleClaimed: 3215575,
        peopleClaimedAgainst: 1227755,
        peopleClaimedFor: 1987820,
        title: "Does MonResto offer too much meat in its menus?",
        id: "claim2",
        type: "Simple"
    });
    claims.push({
        peopleClaimed: 10,
        peopleClaimedAgainst: 9,
        peopleClaimedFor: 1,
        title: "PasMonResto does not offer meat.",
        id: "claim3",
        type: "Simple"
    });
    claims.push({
        peopleClaimed: 10,
        peopleClaimedAgainst: 9,
        peopleClaimedFor: 1,
        title: "What are the conditions of validity of an article of the constitution of the Awesome App team?",
        id: "claim4",
        type: "Simple"
    });
    claims.push({
        peopleClaimed: 10,
        peopleClaimedAgainst: 9,
        peopleClaimedFor: 1,
        title: "Thundercats are on the move, Thundercats are loose. Feel the magic, hear the roar, Thundercats are loose. Thunder, thunder, thunder, Thundercats! Thunder, thunder, thunder, Thundercats! Thunder, thunder, thunder, Thundercats! Thunder, thunder, thunder, Thundercats! Thundercats! ",
        id: "claim5",
        type: "Simple"
    });
    claims.push({
        peopleClaimed: 10,
        peopleClaimedAgainst: 9,
        peopleClaimedFor: 1,
        title: "Top Cat! The most effectual Top Cat! Who’s intellectual close friends get to call him T.C., providing it’s with dignity. Top Cat! The indisputable leader of the gang. He’s the boss, he’s a pip, he’s the championship. He’s the most tip top, Top Cat. ",
        id: "claim6",
        type: "Simple"
    });
    claims.push({
        peopleClaimed: 10,
        peopleClaimedAgainst: 9,
        peopleClaimedFor: 1,
        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque a lorem vitae sem viverra consequat. Nam a nisl volutpat, suscipit ipsum vitae, feugiat tellus. Vivamus in facilisis dolor. Proin id euismod nisl. Vestibulum a ligula arcu. Ut nec urna convallis, facilisis sem vel, viverra magna. Curabitur vitae augue non urna cursus iaculis.",
        id: "claim7",
        type: "Simple"
    });
    claims.push({
        peopleClaimed: 10,
        peopleClaimedAgainst: 9,
        peopleClaimedFor: 1,
        title: "In eu nulla quam. Vestibulum vulputate vestibulum dolor, nec bibendum urna interdum nec. Nulla dapibus auctor odio eu finibus. Cras finibus ante ac leo suscipit, eget pulvinar libero dignissim. Cras pulvinar aliquet est. Etiam a facilisis augue. Donec sit amet nisl diam. Phasellus sed vehicula metus. Suspendisse magna purus, finibus et aliquet eget, mattis id velit. Aenean tincidunt nec neque nec semper. Integer rutrum ac sem vitae lobortis. Etiam vitae iaculis dui. Phasellus fringilla elit quis metus fringilla, vitae mollis neque finibus.",
        id: "claim8",
        type: "Simple"
    });
    claims.push({
        peopleClaimed: 10,
        peopleClaimedAgainst: 9,
        type: "Simple",
        peopleClaimedFor: 1,
        title: "Curabitur pulvinar pretium ex et accumsan. Nam fringilla ultrices sagittis. Suspendisse elementum nisi sed eros aliquet, ut congue nibh ornare. Nullam tincidunt eleifend libero, et iaculis libero pellentesque id. Integer sit amet urna vel leo malesuada ultrices. Aliquam vulputate, eros vel vestibulum mollis, tortor nulla laoreet purus, nec aliquam velit nunc vel quam. Cras vel ex dui. Duis ut nulla gravida, sodales lorem vitae, ornare enim. Cras sodales ligula sed eleifend ullamcorper. Aliquam tempus, libero eget consectetur laoreet, est purus facilisis sem, sit amet venenatis lorem massa vitae lorem. Etiam sit amet aliquet odio. Nulla et eros id nibh eleifend vestibulum nec vel dolor. Nulla commodo nulla vitae sem interdum, sit amet blandit velit elementum.", id: "claim9"
    });
    claims.push({
        peopleClaimed: 10,
        peopleClaimedAgainst: 9,
        type: "Simple",
        peopleClaimedFor: 1,
        id: "claim11", title: "Etiam enim ligula, blandit in congue at, vulputate quis metus. Donec eu ullamcorper quam. Donec vitae lectus ac dolor finibus aliquet vel ac est. Quisque orci nibh, dictum in interdum ut, faucibus eu justo. Donec lobortis mauris id tellus ullamcorper, et porta mi varius. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer sodales felis a neque rutrum, sit amet pharetra nisl luctus. In vehicula iaculis risus nec tempus. Nunc interdum congue condimentum. Nulla sodales porta lectus nec pretium."
    });
    claims.push({
        peopleClaimed: 10,
        peopleClaimedAgainst: 9,
        type: "Simple",
        peopleClaimedFor: 1,
        id: "claim12", title: "Sed lacinia nulla sed sapien mollis consequat. Nulla finibus eleifend metus, in dictum justo iaculis semper. Praesent sed est pellentesque, vulputate mi ut, vehicula leo. Aenean tempus egestas laoreet. Aenean rutrum placerat urna, non luctus est commodo sed. Mauris nec tristique ipsum. Nulla facilisi. Etiam a tristique quam, eu sagittis elit."
    });
    claims.push({
        peopleClaimed: 10,
        peopleClaimedAgainst: 9,
        type: "Simple",
        peopleClaimedFor: 1,
        id: "claim13", title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel leo quam. Integer sit amet tempor turpis. Aenean quis ex mollis, vulputate nunc quis, pulvinar ligula. Morbi luctus sem ac tortor mattis, sed semper magna rhoncus. Proin aliquam nisi eu mi feugiat blandit. Maecenas interdum eros tortor, sit amet posuere turpis dictum a. In ac arcu tincidunt, bibendum odio rutrum, mattis libero. Curabitur euismod, ipsum id tincidunt vehicula, justo metus lacinia dui, vel sodales tellus mi a leo."
    });
    claims.push({
        peopleClaimed: 10,
        peopleClaimedAgainst: 9,
        type: "Simple",
        peopleClaimedFor: 1,
        id: "claim14", title: "Quisque porttitor, metus quis tincidunt convallis, mi dui tristique urna, eu ornare neque lorem nec libero. Nullam ut pharetra dui, eget sollicitudin arcu. Donec sollicitudin arcu eu faucibus fringilla. Integer vitae pellentesque nulla, eget feugiat turpis. Aliquam id porttitor ex, ut vulputate nibh. Morbi quam ante, aliquet a tellus in, molestie tempus massa. Integer mollis turpis quis felis fringilla, ut dapibus orci aliquam. Nullam faucibus, erat eu vehicula bibendum, est ipsum scelerisque magna, posuere tempor libero mauris ac purus. Vestibulum pulvinar ante lectus, sollicitudin congue mauris sodales id. Duis porttitor ultricies lorem at tincidunt. Sed iaculis aliquet consectetur."
    });
    claims.push({
        peopleClaimed: 10,
        peopleClaimedAgainst: 9,
        type: "Simple",
        peopleClaimedFor: 1,
        id: "claim15", title: "Nulla eu magna augue. In mattis diam non felis efficitur, id semper libero aliquet. Nunc at ex nec orci pretium fringilla sed sit amet nibh. Duis id lobortis nulla. Aenean vitae purus tempus, tristique justo et, semper felis. Vestibulum in pretium dolor. Curabitur accumsan, nisi nec pretium dignissim, tellus augue luctus arcu, nec ultricies ligula lorem bibendum mauris. Phasellus at massa ante. Phasellus tincidunt placerat nisi, et accumsan dui consectetur aliquam. Etiam ultrices, velit ac euismod consectetur, ligula nunc imperdiet leo, ut laoreet erat velit ultrices ipsum. Proin non augue sapien. Phasellus sagittis ut elit at dictum. Nam malesuada eleifend cursus. Curabitur iaculis dolor vitae massa molestie, sed convallis velit dictum."
    });
    claims.push({
        peopleClaimed: 10,
        peopleClaimedAgainst: 9,
        type: "Simple",
        peopleClaimedFor: 1,
        id: "claim16", title: "Donec ullamcorper ut arcu eget rutrum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus nec ipsum pretium, sagittis nisi ut, volutpat sem. Integer rhoncus, leo eu feugiat hendrerit, massa purus varius lectus, id pharetra augue purus id justo. Suspendisse est diam, scelerisque ut commodo et, sollicitudin quis elit. Donec vestibulum tristique consectetur. Suspendisse eleifend pellentesque ipsum, vel mollis lacus luctus in."
    });
    claims.push({
        peopleClaimed: 10,
        peopleClaimedAgainst: 9,
        type: "Simple",
        peopleClaimedFor: 1,
        id: "claim17", title: "Donec ac euismod justo. Cras consequat, orci non pellentesque gravida, dolor urna porta nisi, ut luctus odio enim nec nibh. Phasellus vestibulum sapien non arcu porta suscipit. Duis consequat est dui, in rutrum diam varius vel. Cras iaculis, augue vel feugiat mollis, elit nulla imperdiet arcu, quis sagittis diam metus et lorem. Aenean sit amet finibus quam, ut sagittis dolor. Nulla ac hendrerit turpis, at lobortis risus. Phasellus nec magna ut sapien faucibus consequat. Interdum et malesuada fames ac ante ipsum primis in faucibus."
    });
    claims.push({
        peopleClaimed: 10,
        peopleClaimedAgainst: 9,
        type: "Simple",
        peopleClaimedFor: 1,
        id: "claim18", title: "Sed ultrices, lorem eleifend sagittis ultrices, purus lorem fringilla neque, at vulputate magna augue id erat. Ut pulvinar lacus vel dui mattis eleifend. Donec sit amet arcu mattis, sagittis purus quis, consequat augue. Curabitur risus orci, malesuada id gravida et, maximus id arcu. Nullam tristique euismod diam non imperdiet. Donec congue auctor erat, sit amet blandit tortor condimentum at. Curabitur lacinia purus a libero laoreet tristique. Donec aliquam, augue sed efficitur porttitor, mauris massa blandit quam, id venenatis tortor massa ac lectus. Ut tempus rhoncus urna vitae pharetra. Sed ullamcorper pretium nibh, eget pharetra neque cursus nec. Aliquam quis nibh id orci euismod accumsan. Maecenas dictum neque odio. Morbi eget ante feugiat, rutrum metus nec, lacinia metus. Suspendisse mollis, libero quis placerat luctus, erat libero dapibus ante, sed fringilla nulla felis eu purus. Vivamus non consectetur ipsum, in ullamcorper est. Nunc odio arcu, auctor ut elit sed, suscipit vehicula nulla."
    });
    return claims;
}

const searchingClaims = (searchCriteria) => {
    searchingClaimsUserNotificationStore.set(executingSearchingClaimsUserNotification);
    uiBangarangUserBuilder.getUser().searchingClaims(searchCriteria);
};

const initialClaimSearchValue = '';
const claimSearchCriteriaStore = writable(initialClaimSearchValue);

/* src\client\components\SearchBars\ClaimSearchBar.svelte generated by Svelte v3.34.0 */
const waitBeforeSearchingClaims = 1000;

const ClaimSearchBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $claimSearchCriteriaStore, $$unsubscribe_claimSearchCriteriaStore;
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(claimSearchCriteriaStore, "claimSearchCriteriaStore");
	$$unsubscribe_claimSearchCriteriaStore = subscribe(claimSearchCriteriaStore, value => $claimSearchCriteriaStore = value);
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	let searchBar;
	let previousSearchCriteria = "";

	afterUpdate(() => {
		if ($claimSearchCriteriaStore.length === 1) searchBar.focus();
	});

	let timer;

	const debounce = currentSearchCriteria => {
		clearTimeout(timer);
		timer = setTimeout(() => shouldExecuteSearchingClaims(currentSearchCriteria), waitBeforeSearchingClaims);
	};

	claimSearchCriteriaStore.subscribe(searchCriteria => debounce(searchCriteria));

	function shouldExecuteSearchingClaims(currentSearchCriteria) {
		if (currentSearchCriteria !== previousSearchCriteria) {
			previousSearchCriteria = currentSearchCriteria;
			searchingClaims(previousSearchCriteria);
		}
	}

	$$unsubscribe_claimSearchCriteriaStore();
	$$unsubscribe_languageStore();
	return `<input class="${"text-center px-1 mx-1 text-bangarang-dark placeholder-bangarang-darkEmphasis border-bangarang-lightEmphasis border shadow rounded-md"}" type="${"text"}"${add_attribute("placeholder", new Message(claimSearchBarPlaceholderMessage).getMessage($languageStore), 0)}${add_attribute("value", $claimSearchCriteriaStore, 1)}${add_attribute("this", searchBar, 1)}>`;
});

const documentAddSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
</svg>`;
const informationCircle = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>`;
const chevronDoubleLeft = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
</svg>`;
const library = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
</svg>`;
const share = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
</svg>`;
const home = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
</svg>`;
const logIn = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
</svg>`;

/* src\client\components\Destination\GenericDestination.svelte generated by Svelte v3.34.0 */

const GenericDestination = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	

	let { destinationMessage = {
		en: "Missing Message!",
		fr: "Message manquant!"
	} } = $$props;

	let { onClickAction } = $$props;
	let { svgHtml = "Missing SVG" } = $$props;
	if ($$props.destinationMessage === void 0 && $$bindings.destinationMessage && destinationMessage !== void 0) $$bindings.destinationMessage(destinationMessage);
	if ($$props.onClickAction === void 0 && $$bindings.onClickAction && onClickAction !== void 0) $$bindings.onClickAction(onClickAction);
	if ($$props.svgHtml === void 0 && $$bindings.svgHtml && svgHtml !== void 0) $$bindings.svgHtml(svgHtml);
	$$unsubscribe_languageStore();

	return `<button class="${"flex flex-col items-center px-1 w-20 text-bangarang-lightEmphasis"}">${svgHtml}
    <p class="${"text-xs"}">${escape(new Message(destinationMessage).getMessage($languageStore))}</p></button>`;
});

/* src\client\components\Destination\NavigateToDeclareClaim.svelte generated by Svelte v3.34.0 */

const NavigateToDeclareClaim = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	const navigateToUrl = url => goto(url);
	const navigateToDeclareClaim = () => navigateToUrl(`/${$languageStore}/${StaticView.DeclareClaim}`);
	$$unsubscribe_languageStore();

	return `${validate_component(GenericDestination, "GenericDestination").$$render(
		$$result,
		{
			destinationMessage: declareClaimTextButtonMessage,
			onClickAction: navigateToDeclareClaim,
			svgHtml: documentAddSvg
		},
		{},
		{}
	)}`;
});

/* src\client\components\Destination\NavigateToBusinessModel.svelte generated by Svelte v3.34.0 */

const NavigateToBusinessModel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	const navigateToUrl = url => goto(url);
	const navigateToBusinessModel = () => navigateToUrl(`/${$languageStore}/${StaticView.BusinessModel}`);
	$$unsubscribe_languageStore();

	return `${validate_component(GenericDestination, "GenericDestination").$$render(
		$$result,
		{
			destinationMessage: faqLinkNameMessage,
			onClickAction: navigateToBusinessModel,
			svgHtml: informationCircle
		},
		{},
		{}
	)}`;
});

/* src\client\components\Footers\MainMenuFooter.svelte generated by Svelte v3.34.0 */

const MainMenuFooter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<footer${add_attribute("class", `${"flex flex-col pt-2 pb-16 lg:pb-1 bg-bangarang-veryLightEmphasis"} `, 0)}><section${add_attribute("class", "flex w-full max-w-screen-md justify-between m-auto", 0)}>${validate_component(NavigateToBusinessModel, "NavigateToBusinessModel").$$render($$result, {}, {}, {})}
        ${validate_component(ClaimSearchBar, "ClaimSearchBar").$$render($$result, {}, {}, {})}
        ${validate_component(NavigateToDeclareClaim, "NavigateToDeclareClaim").$$render($$result, {}, {}, {})}</section></footer>`;
});

/* src\client\views\MainMenuView.svelte generated by Svelte v3.34.0 */

const MainMenuView = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `${validate_component(MainMenuMain, "MainMenuMain").$$render($$result, {}, {}, {})}
${validate_component(MainMenuFooter, "MainMenuFooter").$$render($$result, {}, {}, {})}`;
});

/* src\client\components\Cards\SearchedClaim.svelte generated by Svelte v3.34.0 */

const SearchedClaim = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { title } = $$props;
	let { claimLink } = $$props;
	if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
	if ($$props.claimLink === void 0 && $$bindings.claimLink && claimLink !== void 0) $$bindings.claimLink(claimLink);
	return `<div class="${"self-stretch border rounded shadow my-2 p-2 border-bangarang-lightEmphasis flex items-center"}"><a${add_attribute("href", claimLink, 0)} class="${" text-bangarang-dark flex-grow text-justify"}">${escape(title)}</a></div>`;
});

/* src\client\components\Lists\SearchedClaims.svelte generated by Svelte v3.34.0 */

const SearchedClaims = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	
	let searchedClaims = new Array();

	searchingClaimsUserNotificationStore.subscribe(searchingClaimsUserNotification => {
		if (searchingClaimsUserNotification.status === "Success" && searchingClaimsUserNotification.retreivedClaims) searchedClaims = searchingClaimsUserNotification.retreivedClaims;
	});

	$$unsubscribe_languageStore();

	return `${each(searchedClaims, searchedClaim => `${validate_component(SearchedClaim, "SearchedClaim").$$render(
		$$result,
		{
			title: searchedClaim.title,
			claimLink: `/${$languageStore}/${linkPrefixes.claimLinkPrefix}${searchedClaim.id}`
		},
		{},
		{}
	)}`)}`;
});

/* src\client\components\Mains\SearchedClaimsMain.svelte generated by Svelte v3.34.0 */

const SearchedClaimsMain = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<main${add_attribute("class", "flex flex-col flex-grow m-auto p-1 justify-center items-center max-w-screen-md", 0)}>${validate_component(SearchedClaims, "SearchedClaims").$$render($$result, {}, {}, {})}</main>`;
});

/* src\client\components\Icons\Spinner.svelte generated by Svelte v3.34.0 */

const Spinner = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `
<svg class="${"stroke-current text-bangarang-lightEmphasis w-10 h-10"}" width="${"45"}" height="${"45"}" viewBox="${"0 0 45 45"}" xmlns="${"http://www.w3.org/2000/svg"}"><g fill="${"none"}" fill-rule="${"evenodd"}" transform="${"translate(1 1)"}" stroke-width="${"2"}"><circle cx="${"22"}" cy="${"22"}" r="${"6"}" stroke-opacity="${"0"}"><animate attributeName="${"r"}" begin="${"1.5s"}" dur="${"3s"}" values="${"6;22"}" calcMode="${"linear"}" repeatCount="${"indefinite"}"></animate><animate attributeName="${"stroke-opacity"}" begin="${"1.5s"}" dur="${"3s"}" values="${"1;0"}" calcMode="${"linear"}" repeatCount="${"indefinite"}"></animate><animate attributeName="${"stroke-width"}" begin="${"1.5s"}" dur="${"3s"}" values="${"2;0"}" calcMode="${"linear"}" repeatCount="${"indefinite"}"></animate></circle><circle cx="${"22"}" cy="${"22"}" r="${"6"}" stroke-opacity="${"0"}"><animate attributeName="${"r"}" begin="${"3s"}" dur="${"3s"}" values="${"6;22"}" calcMode="${"linear"}" repeatCount="${"indefinite"}"></animate><animate attributeName="${"stroke-opacity"}" begin="${"3s"}" dur="${"3s"}" values="${"1;0"}" calcMode="${"linear"}" repeatCount="${"indefinite"}"></animate><animate attributeName="${"stroke-width"}" begin="${"3s"}" dur="${"3s"}" values="${"2;0"}" calcMode="${"linear"}" repeatCount="${"indefinite"}"></animate></circle><circle cx="${"22"}" cy="${"22"}" r="${"8"}"><animate attributeName="${"r"}" begin="${"0s"}" dur="${"1.5s"}" values="${"6;1;2;3;4;5;6"}" calcMode="${"linear"}" repeatCount="${"indefinite"}"></animate></circle></g></svg>`;
});

/* src\client\components\Icons\Success.svelte generated by Svelte v3.34.0 */

const Success = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<svg class="${"w-6 h-6 stroke-current text-bangarang-success"}" fill="${"currentColor"}" viewBox="${"0 0 20 20"}" xmlns="${"http://www.w3.org/2000/svg"}"><path fill-rule="${"evenodd"}" d="${"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"}" clip-rule="${"evenodd"}"></path></svg>`;
});

/* src\client\components\Icons\Failed.svelte generated by Svelte v3.34.0 */

const Failed = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<svg class="${"w-6 h-6 stroke-current text-bangarang-failed"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 20 20"}" fill="${"currentColor"}"><path fill-rule="${"evenodd"}" d="${"M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"}" clip-rule="${"evenodd"}"></path></svg>`;
});

/* src\client\components\Notification\GenericTaskNotification.svelte generated by Svelte v3.34.0 */

const GenericTaskNotification = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	
	let { taskNotification } = $$props;
	if ($$props.taskNotification === void 0 && $$bindings.taskNotification && taskNotification !== void 0) $$bindings.taskNotification(taskNotification);
	$$unsubscribe_languageStore();

	return `<p class="${"text-right text-bangarang-lightEmphasis flex items-center justify-end"}">${escape(new Message(taskNotification.message).getMessage($languageStore))}
    ${taskNotification.status === "Executing"
	? `${validate_component(Spinner, "Spinner").$$render($$result, {}, {}, {})}`
	: `${taskNotification.status === "Success"
		? `${validate_component(Success, "Success").$$render($$result, {}, {}, {})}`
		: `${taskNotification.status === "Failed"
			? `${validate_component(Failed, "Failed").$$render($$result, {}, {}, {})}`
			: ``}`}`}</p>`;
});

/* src\client\components\Notification\SearchingClaimsInformation.svelte generated by Svelte v3.34.0 */

const SearchingClaimsInformation = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $searchingClaimsUserNotificationStore,
		$$unsubscribe_searchingClaimsUserNotificationStore;

	validate_store(searchingClaimsUserNotificationStore, "searchingClaimsUserNotificationStore");
	$$unsubscribe_searchingClaimsUserNotificationStore = subscribe(searchingClaimsUserNotificationStore, value => $searchingClaimsUserNotificationStore = value);
	$$unsubscribe_searchingClaimsUserNotificationStore();

	return `${validate_component(GenericTaskNotification, "GenericTaskNotification").$$render(
		$$result,
		{
			taskNotification: $searchingClaimsUserNotificationStore
		},
		{},
		{}
	)}`;
});

/* src\client\components\Destination\ResetClaimSearch.svelte generated by Svelte v3.34.0 */

const ResetClaimSearch = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $claimSearchCriteriaStore, $$unsubscribe_claimSearchCriteriaStore;
	validate_store(claimSearchCriteriaStore, "claimSearchCriteriaStore");
	$$unsubscribe_claimSearchCriteriaStore = subscribe(claimSearchCriteriaStore, value => $claimSearchCriteriaStore = value);
	const resetClaimSearch = () => set_store_value(claimSearchCriteriaStore, $claimSearchCriteriaStore = "", $claimSearchCriteriaStore);
	$$unsubscribe_claimSearchCriteriaStore();

	return `${validate_component(GenericDestination, "GenericDestination").$$render(
		$$result,
		{
			destinationMessage: backToMainMenuLinkMessage,
			onClickAction: resetClaimSearch,
			svgHtml: home
		},
		{},
		{}
	)}`;
});

/* src\client\components\Footers\SearchedClaimsFooter.svelte generated by Svelte v3.34.0 */

const SearchedClaimsFooter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $searchingClaimsUserNotificationStore,
		$$unsubscribe_searchingClaimsUserNotificationStore;

	validate_store(searchingClaimsUserNotificationStore, "searchingClaimsUserNotificationStore");
	$$unsubscribe_searchingClaimsUserNotificationStore = subscribe(searchingClaimsUserNotificationStore, value => $searchingClaimsUserNotificationStore = value);
	$$unsubscribe_searchingClaimsUserNotificationStore();

	return `<footer${add_attribute("class", "flex flex-col pt-2 pb-16 lg:pb-1 bg-bangarang-veryLightEmphasis", 0)}><section${add_attribute("class", "flex w-full max-w-screen-md justify-between m-auto", 0)}>${validate_component(ResetClaimSearch, "ResetClaimSearch").$$render($$result, {}, {}, {})}
        ${validate_component(ClaimSearchBar, "ClaimSearchBar").$$render($$result, {}, {}, {})}</section> 
    ${$searchingClaimsUserNotificationStore.status !== "Idle"
	? `${validate_component(SearchingClaimsInformation, "SearchingClaimsInformation").$$render($$result, {}, {}, {})}`
	: ``}</footer>`;
});

/* src\client\views\SearchClaimsView.svelte generated by Svelte v3.34.0 */

const SearchClaimsView = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `${validate_component(SearchedClaimsMain, "SearchedClaimsMain").$$render($$result, {}, {}, {})}
${validate_component(SearchedClaimsFooter, "SearchedClaimsFooter").$$render($$result, {}, {}, {})}`;
});

/* src\routes\[language]\MainMenu.svelte generated by Svelte v3.34.0 */

var __awaiter$1 = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P
		? value
		: new P(function (resolve) {
					resolve(value);
				});
	}

	return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch(e) {
					reject(e);
				}
			}

			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch(e) {
					reject(e);
				}
			}

			function step(result) {
				result.done
				? resolve(result.value)
				: adopt(result.value).then(fulfilled, rejected);
			}

			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
};

function preload(page, session) {
	return __awaiter$1(this, void 0, void 0, function* () {
		const { language } = page.params;
		const selectedLanguage = language;
		return { selectedLanguage };
	});
}

const MainMenu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $claimSearchCriteriaStore, $$unsubscribe_claimSearchCriteriaStore;
	validate_store(claimSearchCriteriaStore, "claimSearchCriteriaStore");
	$$unsubscribe_claimSearchCriteriaStore = subscribe(claimSearchCriteriaStore, value => $claimSearchCriteriaStore = value);
	let { selectedLanguage } = $$props;
	assignLanguage(selectedLanguage);
	onMount(() => redirectOnUnknownLanguage(selectedLanguage));
	if ($$props.selectedLanguage === void 0 && $$bindings.selectedLanguage && selectedLanguage !== void 0) $$bindings.selectedLanguage(selectedLanguage);
	$$unsubscribe_claimSearchCriteriaStore();

	return `${$claimSearchCriteriaStore === ""
	? `${validate_component(MainMenuView, "MainMenuView").$$render($$result, {}, {}, {})}`
	: `${validate_component(SearchClaimsView, "SearchClaimsView").$$render($$result, {}, {}, {})}`}`;
});

var component_9 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': MainMenu,
    preload: preload
});

/* src\routes\index.svelte generated by Svelte v3.34.0 */

const Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `${validate_component(MainMenu, "MainMenu").$$render($$result, { selectedLanguage: "unknown" }, {}, {})}`;
});

var component_0 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': Routes
});

/* src\client\components\Titles\MainTitle.svelte generated by Svelte v3.34.0 */

const MainTitle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { title } = $$props;
	let { size = "medium" } = $$props;
	let { theme = "light" } = $$props;
	let { position = "left" } = $$props;

	const headingTextSizeFromSize = size => {
		if (size === "large") return "text-3xl";
		return "text-xl";
	};

	const colorFromTheme = theme => {
		if (theme === "dark") return "text-bangarang-light";
		return "text-bangarang-dark";
	};

	if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.theme === void 0 && $$bindings.theme && theme !== void 0) $$bindings.theme(theme);
	if ($$props.position === void 0 && $$bindings.position && position !== void 0) $$bindings.position(position);
	return `<h1 class="${escape(headingTextSizeFromSize(size)) + " m-5 " + escape(colorFromTheme(theme)) + " font-semibold text-" + escape(position)}">${escape(title)}</h1>`;
});

/* src\client\components\Headers\SelectLanguageHeader.svelte generated by Svelte v3.34.0 */

const SelectLanguageHeader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { currentSelectYourLanguageMessage } = $$props;
	if ($$props.currentSelectYourLanguageMessage === void 0 && $$bindings.currentSelectYourLanguageMessage && currentSelectYourLanguageMessage !== void 0) $$bindings.currentSelectYourLanguageMessage(currentSelectYourLanguageMessage);

	return `<header${add_attribute("class", "flex flex-col flex-grow mx-auto px-1 justify-center items-center max-w-screen-md", 0)}>${validate_component(MainTitle, "MainTitle").$$render(
		$$result,
		{
			title: currentSelectYourLanguageMessage,
			position: "center",
			size: "large"
		},
		{},
		{}
	)}</header>`;
});

/* src\client\components\Links\Link.svelte generated by Svelte v3.34.0 */

const Link = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { linkName = "link name not provided to component!" } = $$props;
	let { linkHref = "missing" } = $$props;
	let { size } = $$props;
	let { textAlign = "text-center" } = $$props;

	const textSizeFromSize = size => {
		if (size === "small") return "text-xs";
		if (size === "large") return "text-2xl";
		return "";
	};

	if ($$props.linkName === void 0 && $$bindings.linkName && linkName !== void 0) $$bindings.linkName(linkName);
	if ($$props.linkHref === void 0 && $$bindings.linkHref && linkHref !== void 0) $$bindings.linkHref(linkHref);
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.textAlign === void 0 && $$bindings.textAlign && textAlign !== void 0) $$bindings.textAlign(textAlign);
	return `<a class="${escape(textSizeFromSize(size)) + " " + escape(textAlign) + " text-bangarang-darkEmphasis underline mb-1"}"${add_attribute("href", linkHref, 0)}>${escape(linkName)}</a>`;
});

/* src\client\components\Mains\SelectLanguageMain.svelte generated by Svelte v3.34.0 */

const SelectLanguageMain = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	
	let { selectLanguages } = $$props;
	if ($$props.selectLanguages === void 0 && $$bindings.selectLanguages && selectLanguages !== void 0) $$bindings.selectLanguages(selectLanguages);

	return `<main${add_attribute("class", "flex flex-col flex-grow m-auto p-1 justify-center items-center max-w-screen-md", 0)}>${each(SUPPORTED_LANGUAGES, supportedLanguage => `${validate_component(Link, "Link").$$render(
		$$result,
		{
			linkName: selectLanguages[supportedLanguage].languageText,
			linkHref: selectLanguages[supportedLanguage].linkToMainMenuWithLanguage,
			size: "medium"
		},
		{},
		{}
	)}`)}</main>`;
});

/* src\client\views\SelectLanguageView.svelte generated by Svelte v3.34.0 */

const SelectLanguageView = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let currentIndex = 0;
	let currentSelectYourLanguageMessage = selectLanguages[SUPPORTED_LANGUAGES[currentIndex]].selectYourLanguageMessage;

	setInterval(
		() => {
			currentIndex++;
			if (currentIndex === SUPPORTED_LANGUAGES.length) currentIndex = 0;
			currentSelectYourLanguageMessage = selectLanguages[SUPPORTED_LANGUAGES[currentIndex]].selectYourLanguageMessage;
		},
		2000
	);

	return `${validate_component(SelectLanguageHeader, "SelectLanguageHeader").$$render($$result, { currentSelectYourLanguageMessage }, {}, {})}
${validate_component(SelectLanguageMain, "SelectLanguageMain").$$render($$result, { selectLanguages }, {}, {})}`;
});

/* src\routes\LanguageSelect.svelte generated by Svelte v3.34.0 */

const LanguageSelect = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `${validate_component(SelectLanguageView, "SelectLanguageView").$$render($$result, {}, {}, {})}`;
});

var component_1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': LanguageSelect
});

/* src\routes\[language]\index.svelte generated by Svelte v3.34.0 */

var __awaiter$2 = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P
		? value
		: new P(function (resolve) {
					resolve(value);
				});
	}

	return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch(e) {
					reject(e);
				}
			}

			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch(e) {
					reject(e);
				}
			}

			function step(result) {
				result.done
				? resolve(result.value)
				: adopt(result.value).then(fulfilled, rejected);
			}

			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
};

function preload$1(page, session) {
	return __awaiter$2(this, void 0, void 0, function* () {
		const { language } = page.params;
		const selectedLanguage = language;
		return { selectedLanguage };
	});
}

const U5Blanguageu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { selectedLanguage } = $$props;
	if ($$props.selectedLanguage === void 0 && $$bindings.selectedLanguage && selectedLanguage !== void 0) $$bindings.selectedLanguage(selectedLanguage);
	return `${validate_component(MainMenu, "MainMenu").$$render($$result, { selectedLanguage }, {}, {})}`;
});

var component_2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': U5Blanguageu5D,
    preload: preload$1
});

/* src\client\components\Titles\HeaderTitle.svelte generated by Svelte v3.34.0 */

const HeaderTitle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { title } = $$props;
	if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
	return `<h1 class="${"text-center my-1 text-2xl text-bangarang-darkEmphasis"}">${escape(title)}</h1>`;
});

/* src\client\components\Headers\ValuePropositionHeader.svelte generated by Svelte v3.34.0 */

const ValuePropositionHeader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	
	let { valuePropositionDesignCanvas } = $$props;
	if ($$props.valuePropositionDesignCanvas === void 0 && $$bindings.valuePropositionDesignCanvas && valuePropositionDesignCanvas !== void 0) $$bindings.valuePropositionDesignCanvas(valuePropositionDesignCanvas);
	$$unsubscribe_languageStore();

	return `<header${add_attribute("class", "flex flex-col flex-grow mx-auto px-1 justify-center items-center max-w-screen-md", 0)}>${validate_component(HeaderTitle, "HeaderTitle").$$render(
		$$result,
		{
			title: new Message(valuePropositionDesignCanvas.title).getMessage($languageStore)
		},
		{},
		{}
	)}</header>`;
});

/* src\client\components\Lists\ValuePropositionDesignCanvasList.svelte generated by Svelte v3.34.0 */

const ValuePropositionDesignCanvasList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	
	
	let { valuePropositionDesignCanvas } = $$props;
	const sections = Object.entries(valuePropositionDesignCanvas);
	if ($$props.valuePropositionDesignCanvas === void 0 && $$bindings.valuePropositionDesignCanvas && valuePropositionDesignCanvas !== void 0) $$bindings.valuePropositionDesignCanvas(valuePropositionDesignCanvas);
	$$unsubscribe_languageStore();

	return `${each(sections, ([type, contents]) => `${type !== "audience" && type !== "pageLink" && Array.isArray(contents) && contents.length > 0
	? `<section class="${"self-stretch"}"><h1 class="${"text-sm mt-4 mb-1 text-bangarang-darkEmphasis font-semibold text-center"}">${escape(new Message(retrieveSubTitleFromType(type)).getMessage($languageStore).toLocaleUpperCase())}</h1>
            ${contents.length > 1
		? `<ul class="${"list-disc list-inside"}">${each(contents, content => `<li class="${"text-bangarang-darkEmphasis text-sm"}">${escape(new Message(content).getMessage($languageStore))}</li>`)}
                </ul>`
		: `<p class="${"text-bangarang-darkEmphasis text-sm text-center"}">${escape(new Message(contents[0]).getMessage($languageStore))}</p>`}
        </section>`
	: ``}`)}`;
});

/* src\client\components\Mains\ValuePropositionMain.svelte generated by Svelte v3.34.0 */

const ValuePropositionMain = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	
	let { valuePropositionDesignCanvas } = $$props;
	if ($$props.valuePropositionDesignCanvas === void 0 && $$bindings.valuePropositionDesignCanvas && valuePropositionDesignCanvas !== void 0) $$bindings.valuePropositionDesignCanvas(valuePropositionDesignCanvas);
	return `<main${add_attribute("class", "flex flex-col flex-grow m-auto p-1 items-center max-w-screen-md overflow-y-auto", 0)}>${validate_component(ValuePropositionDesignCanvasList, "ValuePropositionDesignCanvasList").$$render($$result, { valuePropositionDesignCanvas }, {}, {})}</main>`;
});

/* src\client\components\Footers\ValuePropositionFooter.svelte generated by Svelte v3.34.0 */

const ValuePropositionFooter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	$$unsubscribe_languageStore();

	return `<footer${add_attribute("class", "flex flex-col pt-2 pb-16 lg:pb-1 bg-bangarang-veryLightEmphasis", 0)}>${validate_component(Link, "Link").$$render(
		$$result,
		{
			linkName: new Message(leanCanvasLinkMessage).getMessage($languageStore),
			linkHref: `/${$languageStore}/${StaticView.LeanCanvas}`,
			size: "small"
		},
		{},
		{}
	)}
    ${validate_component(Link, "Link").$$render(
		$$result,
		{
			linkName: new Message(useBangarangLinkMessage).getMessage($languageStore),
			linkHref: `/${$languageStore}/${StaticView.MainMenu}`,
			size: "small"
		},
		{},
		{}
	)}</footer>`;
});

/* src\client\views\ValuePropositionView.svelte generated by Svelte v3.34.0 */

const ValuePropositionView = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	
	let { valuePropositionDesignCanvas } = $$props;
	if ($$props.valuePropositionDesignCanvas === void 0 && $$bindings.valuePropositionDesignCanvas && valuePropositionDesignCanvas !== void 0) $$bindings.valuePropositionDesignCanvas(valuePropositionDesignCanvas);

	return `${validate_component(ValuePropositionHeader, "ValuePropositionHeader").$$render($$result, { valuePropositionDesignCanvas }, {}, {})}
${validate_component(ValuePropositionMain, "ValuePropositionMain").$$render($$result, { valuePropositionDesignCanvas }, {}, {})}
${validate_component(ValuePropositionFooter, "ValuePropositionFooter").$$render($$result, {}, {}, {})}`;
});

const retreiveValuePropositionFromValuePropositionPageLink = (valuePropositionPageLink) => {
    const valueProposition = valuePropositionsDesignCanvas.find(valuePropositionDesignCanvas => valuePropositionPageLink.startsWith(valuePropositionDesignCanvas.pageLink));
    if (valueProposition)
        return valueProposition;
    throw new Error(`No value proposition has a valid prefix for the page link '${valuePropositionPageLink}'`);
};

/* src\routes\[language]\valuePropositions\[valuePropositionPageLink].svelte generated by Svelte v3.34.0 */

var __awaiter$3 = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P
		? value
		: new P(function (resolve) {
					resolve(value);
				});
	}

	return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch(e) {
					reject(e);
				}
			}

			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch(e) {
					reject(e);
				}
			}

			function step(result) {
				result.done
				? resolve(result.value)
				: adopt(result.value).then(fulfilled, rejected);
			}

			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
};

function preload$2(page, session) {
	return __awaiter$3(this, void 0, void 0, function* () {
		const { valuePropositionPageLink, language } = page.params;
		const selectedLanguage = language;
		const valuePropositionDesignCanvas = retreiveValuePropositionFromValuePropositionPageLink(valuePropositionPageLink);

		return {
			valuePropositionDesignCanvas,
			selectedLanguage
		};
	});
}

const U5BvaluePropositionPageLinku5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	
	let { valuePropositionDesignCanvas } = $$props;
	let { selectedLanguage } = $$props;
	assignLanguage(selectedLanguage);
	onMount(() => redirectOnUnknownLanguage(selectedLanguage));
	if ($$props.valuePropositionDesignCanvas === void 0 && $$bindings.valuePropositionDesignCanvas && valuePropositionDesignCanvas !== void 0) $$bindings.valuePropositionDesignCanvas(valuePropositionDesignCanvas);
	if ($$props.selectedLanguage === void 0 && $$bindings.selectedLanguage && selectedLanguage !== void 0) $$bindings.selectedLanguage(selectedLanguage);
	return `${validate_component(ValuePropositionView, "ValuePropositionView").$$render($$result, { valuePropositionDesignCanvas }, {}, {})}`;
});

var component_3 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': U5BvaluePropositionPageLinku5D,
    preload: preload$2
});

/* src\client\components\Headers\BusinessModelHeader.svelte generated by Svelte v3.34.0 */

const BusinessModelHeader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	$$unsubscribe_languageStore();

	return `<header${add_attribute("class", "flex flex-col flex-grow mx-auto px-1 justify-center items-center max-w-screen-md", 0)}>${validate_component(HeaderTitle, "HeaderTitle").$$render(
		$$result,
		{
			title: new Message(bangarangBusinessModelTitleMessage).getMessage($languageStore)
		},
		{},
		{}
	)}</header>`;
});

/* src\client\components\Cards\DescriptionCard.svelte generated by Svelte v3.34.0 */

const DescriptionCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	
	let { descriptionCardContract } = $$props;
	if ($$props.descriptionCardContract === void 0 && $$bindings.descriptionCardContract && descriptionCardContract !== void 0) $$bindings.descriptionCardContract(descriptionCardContract);

	return `<section class="${"self-stretch mb-2 p-1 border-bangarang-lightEmphasis border rounded shadow"}"><h2 class="${"text-bangarang-dark text-center"}">${escape(descriptionCardContract.title)}</h2>
    <p class="${"text-bangarang-darkEmphasis text-center font-light italic text-sm"}">${escape(descriptionCardContract.description)}</p>
    ${descriptionCardContract.bulletPoints !== undefined && descriptionCardContract.bulletPoints.length > 1
	? `<ul class="${"list-disc list-inside"}">${each(descriptionCardContract.bulletPoints, bulletPoint => `<li class="${"text-bangarang-darkEmphasis text-sm"}">${escape(bulletPoint)}</li>`)}</ul>`
	: `${descriptionCardContract.bulletPoints !== undefined && descriptionCardContract.bulletPoints.length === 1
		? `<p class="${"text-bangarang-darkEmphasis text-sm text-center"}">${escape(descriptionCardContract.bulletPoints[0])}</p>`
		: ``}`}
    ${descriptionCardContract.links !== undefined && descriptionCardContract.links.length > 0
	? `${each(descriptionCardContract.links, link => `<p class="${"text-center"}">${validate_component(Link, "Link").$$render(
			$$result,
			{
				linkHref: link.href,
				linkName: link.name,
				size: "small"
			},
			{},
			{}
		)}</p>`)}`
	: ``}</section>`;
});

/* src\client\components\Mains\BusinessModelMain.svelte generated by Svelte v3.34.0 */

const BusinessModelMain = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	

	const BusinessModelValues = [
		{
			title: new Message(whatIsBangarangMessages.title).getMessage($languageStore),
			description: new Message(whatIsBangarangMessages.description).getMessage($languageStore),
			bulletPoints: whatIsBangarangMessages.bulletPoints.map(bulletPoint => new Message(bulletPoint).getMessage($languageStore))
		},
		{
			title: new Message(definitionOfBangarangMessages.title).getMessage($languageStore),
			description: new Message(definitionOfBangarangMessages.description).getMessage($languageStore),
			bulletPoints: definitionOfBangarangMessages.bulletPoints.map(bulletPoint => new Message(bulletPoint).getMessage($languageStore))
		},
		{
			title: new Message(whyThisNameMessages.title).getMessage($languageStore),
			description: new Message(whyThisNameMessages.description).getMessage($languageStore),
			bulletPoints: whyThisNameMessages.bulletPoints.map(bulletPoint => new Message(bulletPoint).getMessage($languageStore))
		}
	];

	$$unsubscribe_languageStore();

	return `<main${add_attribute("class", "flex flex-col flex-grow m-auto p-1 items-center max-w-screen-md overflow-y-auto", 0)}>${each(BusinessModelValues, businessModelValue => `${validate_component(DescriptionCard, "DescriptionCard").$$render(
		$$result,
		{
			descriptionCardContract: businessModelValue
		},
		{},
		{}
	)}`)}</main>`;
});

/* src\client\components\Destination\NavigateBackToMainMenu.svelte generated by Svelte v3.34.0 */

const NavigateBackToMainMenu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	const navigateToUrl = url => goto(url);
	const navigateToDeclareClaim = () => navigateToUrl(`/${$languageStore}/${StaticView.MainMenu}`);
	$$unsubscribe_languageStore();

	return `${validate_component(GenericDestination, "GenericDestination").$$render(
		$$result,
		{
			destinationMessage: backToMainMenuLinkMessage,
			onClickAction: navigateToDeclareClaim,
			svgHtml: chevronDoubleLeft
		},
		{},
		{}
	)}`;
});

/* src\client\components\Destination\NavigateToLeanCanvas.svelte generated by Svelte v3.34.0 */

const NavigateToLeanCanvas = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	const navigateToUrl = url => goto(url);
	const navigateToBusinessModel = () => navigateToUrl(`/${$languageStore}/${StaticView.LeanCanvas}`);
	$$unsubscribe_languageStore();

	return `${validate_component(GenericDestination, "GenericDestination").$$render(
		$$result,
		{
			destinationMessage: leanCanvasLinkMessage,
			onClickAction: navigateToBusinessModel,
			svgHtml: library
		},
		{},
		{}
	)}`;
});

/* src\client\components\Footers\BusinessModelFooter.svelte generated by Svelte v3.34.0 */

const BusinessModelFooter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<footer${add_attribute("class", "flex flex-col pt-2 pb-16 lg:pb-1 bg-bangarang-veryLightEmphasis", 0)}><section${add_attribute("class", "flex w-full max-w-screen-md justify-between m-auto", 0)}>${validate_component(NavigateBackToMainMenu, "NavigateBackToMainMenu").$$render($$result, {}, {}, {})}
        ${validate_component(NavigateToLeanCanvas, "NagivateToLeanCanvas").$$render($$result, {}, {}, {})}</section></footer>`;
});

/* src\client\views\BusinessModelView.svelte generated by Svelte v3.34.0 */

const BusinessModelView = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `${validate_component(BusinessModelHeader, "BusinessModelHeader").$$render($$result, {}, {}, {})}
${validate_component(BusinessModelMain, "BusinessModelMain").$$render($$result, {}, {}, {})}
${validate_component(BusinessModelFooter, "BusinessModelFooter").$$render($$result, {}, {}, {})}`;
});

/* src\routes\[language]\BusinessModel.svelte generated by Svelte v3.34.0 */

var __awaiter$4 = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P
		? value
		: new P(function (resolve) {
					resolve(value);
				});
	}

	return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch(e) {
					reject(e);
				}
			}

			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch(e) {
					reject(e);
				}
			}

			function step(result) {
				result.done
				? resolve(result.value)
				: adopt(result.value).then(fulfilled, rejected);
			}

			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
};

function preload$3(page, session) {
	return __awaiter$4(this, void 0, void 0, function* () {
		const { language } = page.params;
		const selectedLanguage = language;
		return { selectedLanguage };
	});
}

const BusinessModel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { selectedLanguage } = $$props;
	assignLanguage(selectedLanguage);
	onMount(() => redirectOnUnknownLanguage(selectedLanguage));
	if ($$props.selectedLanguage === void 0 && $$bindings.selectedLanguage && selectedLanguage !== void 0) $$bindings.selectedLanguage(selectedLanguage);
	return `${validate_component(BusinessModelView, "BusinessModelView").$$render($$result, {}, {}, {})}`;
});

var component_4 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': BusinessModel,
    preload: preload$3
});

const currentUserContractStore = writable(uiBangarangUserBuilder.getUser().retrieveUserContract());

/* src\client\components\Headers\SignInHeader.svelte generated by Svelte v3.34.0 */

const SignInHeader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $currentUserContractStore, $$unsubscribe_currentUserContractStore;
	validate_store(currentUserContractStore, "currentUserContractStore");
	$$unsubscribe_currentUserContractStore = subscribe(currentUserContractStore, value => $currentUserContractStore = value);
	$$unsubscribe_currentUserContractStore();

	return `<header${add_attribute("class", "flex flex-col flex-grow mx-auto px-1 justify-end items-center max-w-screen-md", 0)}>${validate_component(WelcomeTitle, "WelcomeTitle").$$render($$result, {}, {}, {})}
    ${$currentUserContractStore !== undefined
	? `<h2 class="${"text-2xl text-bangarang-darkEmphasis my-1"}">${escape($currentUserContractStore.username)}</h2>`
	: ``}</header>`;
});

/* src\client\components\Form\Fields\GenericTextField.svelte generated by Svelte v3.34.0 */

const GenericTextField = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { isReadOnly } = $$props;
	let { fieldName } = $$props;
	let { fieldId } = $$props;
	let { isRequired } = $$props;
	if ($$props.isReadOnly === void 0 && $$bindings.isReadOnly && isReadOnly !== void 0) $$bindings.isReadOnly(isReadOnly);
	if ($$props.fieldName === void 0 && $$bindings.fieldName && fieldName !== void 0) $$bindings.fieldName(fieldName);
	if ($$props.fieldId === void 0 && $$bindings.fieldId && fieldId !== void 0) $$bindings.fieldId(fieldId);
	if ($$props.isRequired === void 0 && $$bindings.isRequired && isRequired !== void 0) $$bindings.isRequired(isRequired);

	return `<label${add_attribute("for", fieldId, 0)} class="${"text-xs text-bangarang-lightEmphasis"}">${escape(fieldName)}</label>
<input ${isReadOnly ? "readonly" : ""} type="${"text"}"${add_attribute("name", fieldName, 0)}${add_attribute("id", fieldId, 0)} ${isRequired ? "required" : ""} class="${"text-xl text-center mx-5 my-1 text-bangarang-dark placeholder-bangarang-darkEmphasis border-bangarang-lightEmphasis border rounded-md"}">`;
});

/* src\client\components\Form\Fields\GenericPasswordField.svelte generated by Svelte v3.34.0 */

const GenericPasswordField = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { isReadOnly } = $$props;
	let { fieldName } = $$props;
	let { fieldId } = $$props;
	let { isRequired } = $$props;
	if ($$props.isReadOnly === void 0 && $$bindings.isReadOnly && isReadOnly !== void 0) $$bindings.isReadOnly(isReadOnly);
	if ($$props.fieldName === void 0 && $$bindings.fieldName && fieldName !== void 0) $$bindings.fieldName(fieldName);
	if ($$props.fieldId === void 0 && $$bindings.fieldId && fieldId !== void 0) $$bindings.fieldId(fieldId);
	if ($$props.isRequired === void 0 && $$bindings.isRequired && isRequired !== void 0) $$bindings.isRequired(isRequired);

	return `<label${add_attribute("for", fieldId, 0)} class="${"text-xs text-bangarang-lightEmphasis"}">${escape(fieldName)}</label>
<input ${isReadOnly ? "readonly" : ""} type="${"password"}"${add_attribute("name", fieldName, 0)}${add_attribute("id", fieldId, 0)} ${isRequired ? "required" : ""} class="${"text-xl text-center mx-5 my-1 text-bangarang-dark placeholder-bangarang-darkEmphasis border-bangarang-lightEmphasis border rounded-md"}">`;
});

/* src\client\components\Form\Fields\GenericSubmitField.svelte generated by Svelte v3.34.0 */

const GenericSubmitField = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { fieldName } = $$props;
	let { fieldId } = $$props;
	let { isReadOnly } = $$props;
	if ($$props.fieldName === void 0 && $$bindings.fieldName && fieldName !== void 0) $$bindings.fieldName(fieldName);
	if ($$props.fieldId === void 0 && $$bindings.fieldId && fieldId !== void 0) $$bindings.fieldId(fieldId);
	if ($$props.isReadOnly === void 0 && $$bindings.isReadOnly && isReadOnly !== void 0) $$bindings.isReadOnly(isReadOnly);

	return `<label${add_attribute("for", fieldId, 0)} class="${"text-xs text-bangarang-lightEmphasis sr-only"}">${escape(fieldName)}</label>
<input type="${"submit"}"${add_attribute("id", fieldId, 0)} ${isReadOnly ? "disabled" : ""}${add_attribute("value", fieldName, 0)} class="${"text-xl text-bangarang-dark border-bangarang-dark bg-bangarang-light my-1 px-1 pb-1 border rounded-md"}">`;
});

/* src\client\components\Form\SignInForm.svelte generated by Svelte v3.34.0 */

const SignInForm = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	let $signingInNotificationStore, $$unsubscribe_signingInNotificationStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	validate_store(signingInNotificationStore, "signingInNotificationStore");
	$$unsubscribe_signingInNotificationStore = subscribe(signingInNotificationStore, value => $signingInNotificationStore = value);

	$$unsubscribe_languageStore();
	$$unsubscribe_signingInNotificationStore();

	return `<form class="${"form-example flex flex-col"}">${validate_component(GenericTextField, "GenericTextField").$$render(
		$$result,
		{
			fieldId: "username",
			fieldName: new Message(signInFormUsernameMessage).getMessage($languageStore),
			isRequired: true,
			isReadOnly: $signingInNotificationStore.status !== "Idle"
		},
		{},
		{}
	)}
    ${validate_component(GenericPasswordField, "GenericPasswordField").$$render(
		$$result,
		{
			fieldId: "password",
			fieldName: new Message(signInFormPasswordMessage).getMessage($languageStore),
			isRequired: true,
			isReadOnly: $signingInNotificationStore.status !== "Idle"
		},
		{},
		{}
	)}
    ${validate_component(GenericSubmitField, "GenericSubmitField").$$render(
		$$result,
		{
			fieldId: "signin",
			fieldName: new Message(signInFormSubmitMessage).getMessage($languageStore),
			isReadOnly: $signingInNotificationStore.status !== "Idle"
		},
		{},
		{}
	)}</form>`;
});

/* src\client\components\Sections\SignInSection.svelte generated by Svelte v3.34.0 */

const SignInSection = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	$$unsubscribe_languageStore();

	return `<p class="${"text-bangarang-lightEmphasis"}">${escape(new Message(signInFormTitleMessage).getMessage($languageStore))}</p>
${validate_component(SignInForm, "SignInForm").$$render($$result, {}, {}, {})}`;
});

/* src\client\components\Mains\SignInMain.svelte generated by Svelte v3.34.0 */

const SignInMain = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $currentUserContractStore, $$unsubscribe_currentUserContractStore;
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(currentUserContractStore, "currentUserContractStore");
	$$unsubscribe_currentUserContractStore = subscribe(currentUserContractStore, value => $currentUserContractStore = value);
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	$$unsubscribe_currentUserContractStore();
	$$unsubscribe_languageStore();

	return `<main${add_attribute("class", "flex flex-col flex-grow m-auto p-1 justify-center items-center max-w-screen-md", 0)}>${$currentUserContractStore === undefined
	? `${validate_component(SignInSection, "SignInSection").$$render($$result, {}, {}, {})}`
	: `<p class="${"invisible"}">${escape(new Message(signOutMessage).getMessage($languageStore))}</p>`}</main>`;
});

/* src\client\components\Notification\SignInInformation.svelte generated by Svelte v3.34.0 */

const SignInInformation = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $signingInNotificationStore, $$unsubscribe_signingInNotificationStore;
	validate_store(signingInNotificationStore, "signingInNotificationStore");
	$$unsubscribe_signingInNotificationStore = subscribe(signingInNotificationStore, value => $signingInNotificationStore = value);
	$$unsubscribe_signingInNotificationStore();

	return `${validate_component(GenericTaskNotification, "GenericTaskNotification").$$render(
		$$result,
		{
			taskNotification: $signingInNotificationStore
		},
		{},
		{}
	)}`;
});

const currentClaimIdStore = writable(undefined);

/* src\client\components\Footers\SignInFooter.svelte generated by Svelte v3.34.0 */

const SignInFooter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	let $signingInNotificationStore, $$unsubscribe_signingInNotificationStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	validate_store(signingInNotificationStore, "signingInNotificationStore");
	$$unsubscribe_signingInNotificationStore = subscribe(signingInNotificationStore, value => $signingInNotificationStore = value);
	let currentClaimId = undefined;
	currentClaimIdStore.subscribe(currentClaimIdFromStore => currentClaimId = currentClaimIdFromStore);

	const linkFromCurrentClaimId = currentClaimId => {
		return currentClaimId === undefined
		? {
				href: `/${$languageStore}/${StaticView.MainMenu}`,
				name: new Message(backToMainMenuLinkMessage).getMessage($languageStore)
			}
		: {
				href: `/${$languageStore}/${linkPrefixes.claimLinkPrefix}${currentClaimId}`,
				name: new Message(backToTheClaimMessage).getMessage($languageStore)
			};
	};

	$$unsubscribe_languageStore();
	$$unsubscribe_signingInNotificationStore();

	return `<footer${add_attribute("class", "flex flex-col pt-2 pb-16 lg:pb-1 bg-bangarang-veryLightEmphasis", 0)}>${$signingInNotificationStore.status === "Executing"
	? `${validate_component(SignInInformation, "SignInInformation").$$render($$result, {}, {}, {})}`
	: `<section class="${"flex justify-center items-center"}">${validate_component(Link, "Link").$$render(
			$$result,
			{
				size: "small",
				linkHref: `/${$languageStore}/${StaticView.Register}`,
				linkName: new Message(signInRegisterMessage).getMessage($languageStore),
				textAlign: "text-center"
			},
			{},
			{}
		)}</section>
        <section class="${"flex justify-between items-center"}">${validate_component(Link, "Link").$$render(
			$$result,
			{
				size: "small",
				linkHref: linkFromCurrentClaimId(currentClaimId).href,
				linkName: linkFromCurrentClaimId(currentClaimId).name,
				textAlign: "text-left"
			},
			{},
			{}
		)}
            ${$signingInNotificationStore.status !== "Idle"
		? `${validate_component(SignInInformation, "SignInInformation").$$render($$result, {}, {}, {})}`
		: ``}</section>`}</footer>`;
});

/* src\client\views\SignInView.svelte generated by Svelte v3.34.0 */

const SignInView = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `${validate_component(SignInHeader, "SignInHeader").$$render($$result, {}, {}, {})}
${validate_component(SignInMain, "SignInMain").$$render($$result, {}, {}, {})}
${validate_component(SignInFooter, "SignInFooter").$$render($$result, {}, {}, {})}`;
});

/* src\routes\[language]\SigningInMenu.svelte generated by Svelte v3.34.0 */

var __awaiter$5 = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P
		? value
		: new P(function (resolve) {
					resolve(value);
				});
	}

	return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch(e) {
					reject(e);
				}
			}

			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch(e) {
					reject(e);
				}
			}

			function step(result) {
				result.done
				? resolve(result.value)
				: adopt(result.value).then(fulfilled, rejected);
			}

			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
};

function preload$4(page, session) {
	return __awaiter$5(this, void 0, void 0, function* () {
		const { language } = page.params;
		const selectedLanguage = language;
		return { selectedLanguage };
	});
}

const SigningInMenu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { selectedLanguage } = $$props;
	assignLanguage(selectedLanguage);
	onMount(() => redirectOnUnknownLanguage(selectedLanguage));
	if ($$props.selectedLanguage === void 0 && $$bindings.selectedLanguage && selectedLanguage !== void 0) $$bindings.selectedLanguage(selectedLanguage);
	return `${validate_component(SignInView, "SignInView").$$render($$result, {}, {}, {})}`;
});

var component_5 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': SigningInMenu,
    preload: preload$4
});

/* src\client\components\Inputs\ClaimAsProposalRadioButton.svelte generated by Svelte v3.34.0 */

const ClaimAsProposalRadioButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	$$unsubscribe_languageStore();

	return `<input id="${"claimType"}" type="${"radio"}" name="${"claimType"}" checked>
<label for="${"claimType"}" class="${"text-bangarang-lightEmphasis"}">${escape(new Message(simpleClaimTypeMessage).getMessage($languageStore))}</label>`;
});

/* src\client\components\Form\Fields\GenericTextAreaField.svelte generated by Svelte v3.34.0 */

const rows = 10;

const GenericTextAreaField = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { fieldId } = $$props;
	let { fieldName } = $$props;
	let { placeholder } = $$props;
	let { isRequired } = $$props;
	let { isReadOnly } = $$props;
	if ($$props.fieldId === void 0 && $$bindings.fieldId && fieldId !== void 0) $$bindings.fieldId(fieldId);
	if ($$props.fieldName === void 0 && $$bindings.fieldName && fieldName !== void 0) $$bindings.fieldName(fieldName);
	if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0) $$bindings.placeholder(placeholder);
	if ($$props.isRequired === void 0 && $$bindings.isRequired && isRequired !== void 0) $$bindings.isRequired(isRequired);
	if ($$props.isReadOnly === void 0 && $$bindings.isReadOnly && isReadOnly !== void 0) $$bindings.isReadOnly(isReadOnly);

	return `<label${add_attribute("for", fieldId, 0)} class="${"text-xs text-bangarang-lightEmphasis"}">${escape(fieldName)}</label>
<textarea ${isReadOnly ? "readonly" : ""}${add_attribute("name", fieldName, 0)}${add_attribute("id", fieldId, 0)} ${isRequired ? "required" : ""}${add_attribute("placeholder", placeholder, 0)}${add_attribute("rows", rows, 0)} class="${"text-xl w-full text-center mx-5 my-1 text-bangarang-dark placeholder-bangarang-darkEmphasis border-bangarang-lightEmphasis border rounded-md"}"></textarea>`;
});

/* src\client\components\Form\NewClaimForm.svelte generated by Svelte v3.34.0 */

const NewClaimForm = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;

	let $declaringClaimUserNotificationStore,
		$$unsubscribe_declaringClaimUserNotificationStore;

	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	validate_store(declaringClaimUserNotificationStore, "declaringClaimUserNotificationStore");
	$$unsubscribe_declaringClaimUserNotificationStore = subscribe(declaringClaimUserNotificationStore, value => $declaringClaimUserNotificationStore = value);

	$$unsubscribe_languageStore();
	$$unsubscribe_declaringClaimUserNotificationStore();

	return `<form class="${"w-full flex flex-col items-center"}">${validate_component(GenericTextAreaField, "GenericTextAreaField").$$render(
		$$result,
		{
			fieldId: "claimTitle",
			fieldName: new Message(claimTitleFieldNameMessage).getMessage($languageStore),
			placeholder: new Message(claimTitlePlaceholderMessage).getMessage($languageStore),
			isRequired: true,
			isReadOnly: $declaringClaimUserNotificationStore.status !== "Idle"
		},
		{},
		{}
	)}
    <fieldset><legend class="${"text-bangarang-lightEmphasis"}">${escape(new Message(claimTypeMessage).getMessage($languageStore))}</legend>
        ${validate_component(ClaimAsProposalRadioButton, "ClaimAsProposalRadioButton").$$render($$result, {}, {}, {})}</fieldset>
    ${validate_component(GenericSubmitField, "GenericSubmitField").$$render(
		$$result,
		{
			fieldId: "declare",
			fieldName: new Message(declareClaimSubmitMessage).getMessage($languageStore),
			isReadOnly: $declaringClaimUserNotificationStore.status !== "Idle"
		},
		{},
		{}
	)}</form>`;
});

/* src\client\components\Mains\DeclareClaimMain.svelte generated by Svelte v3.34.0 */

const DeclareClaimMain = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<main${add_attribute("class", "flex flex-col flex-grow m-auto p-1 justify-center items-center max-w-screen-md", 0)}>${validate_component(NewClaimForm, "NewClaimForm").$$render($$result, {}, {}, {})}</main>`;
});

/* src\client\components\Notification\DeclaringInformation.svelte generated by Svelte v3.34.0 */

const DeclaringInformation = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $declaringClaimUserNotificationStore,
		$$unsubscribe_declaringClaimUserNotificationStore;

	validate_store(declaringClaimUserNotificationStore, "declaringClaimUserNotificationStore");
	$$unsubscribe_declaringClaimUserNotificationStore = subscribe(declaringClaimUserNotificationStore, value => $declaringClaimUserNotificationStore = value);
	$$unsubscribe_declaringClaimUserNotificationStore();

	return `${validate_component(GenericTaskNotification, "GenericTaskNotification").$$render(
		$$result,
		{
			taskNotification: $declaringClaimUserNotificationStore
		},
		{},
		{}
	)}`;
});

/* src\client\components\Footers\DeclareClaimFooter.svelte generated by Svelte v3.34.0 */

const DeclareClaimFooter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $declaringClaimUserNotificationStore,
		$$unsubscribe_declaringClaimUserNotificationStore;

	validate_store(declaringClaimUserNotificationStore, "declaringClaimUserNotificationStore");
	$$unsubscribe_declaringClaimUserNotificationStore = subscribe(declaringClaimUserNotificationStore, value => $declaringClaimUserNotificationStore = value);
	$$unsubscribe_declaringClaimUserNotificationStore();

	return `<footer${add_attribute("class", "flex flex-col pt-2 pb-16 lg:pb-1 bg-bangarang-veryLightEmphasis", 0)}>${$declaringClaimUserNotificationStore.status !== "Executing"
	? `<section${add_attribute("class", "flex w-full max-w-screen-md justify-between m-auto", 0)}>${validate_component(NavigateBackToMainMenu, "NavigateBackToMainMenu").$$render($$result, {}, {}, {})}</section>
        ${$declaringClaimUserNotificationStore.status !== "Idle"
		? `${validate_component(DeclaringInformation, "DeclaringInformation").$$render($$result, {}, {}, {})}`
		: ``}`
	: `${validate_component(DeclaringInformation, "DeclaringInformation").$$render($$result, {}, {}, {})}`}</footer>`;
});

/* src\client\views\DeclareClaimView.svelte generated by Svelte v3.34.0 */

const DeclareClaimView = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `${validate_component(DeclareClaimMain, "DeclareClaimMain").$$render($$result, {}, {}, {})}
${validate_component(DeclareClaimFooter, "DeclareClaimFooter").$$render($$result, {}, {}, {})}`;
});

/* src\routes\[language]\DeclareClaim.svelte generated by Svelte v3.34.0 */

var __awaiter$6 = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P
		? value
		: new P(function (resolve) {
					resolve(value);
				});
	}

	return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch(e) {
					reject(e);
				}
			}

			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch(e) {
					reject(e);
				}
			}

			function step(result) {
				result.done
				? resolve(result.value)
				: adopt(result.value).then(fulfilled, rejected);
			}

			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
};

function preload$5(page, session) {
	return __awaiter$6(this, void 0, void 0, function* () {
		const { language } = page.params;
		const selectedLanguage = language;
		return { selectedLanguage };
	});
}

const DeclareClaim = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { selectedLanguage } = $$props;
	assignLanguage(selectedLanguage);
	onMount(() => redirectOnUnknownLanguage(selectedLanguage));
	if ($$props.selectedLanguage === void 0 && $$bindings.selectedLanguage && selectedLanguage !== void 0) $$bindings.selectedLanguage(selectedLanguage);
	return `${validate_component(DeclareClaimView, "DeclareClaimView").$$render($$result, {}, {}, {})}`;
});

var component_6 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': DeclareClaim,
    preload: preload$5
});

/* src\client\components\Titles\MainSubTitle.svelte generated by Svelte v3.34.0 */

const MainSubTitle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { title } = $$props;
	let { theme = "light" } = $$props;

	const colorFromTheme = theme => {
		if (theme === "dark") return "text-bangarang-lightEmphasis";
		return "text-bangarang-darkEmphasis";
	};

	if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
	if ($$props.theme === void 0 && $$bindings.theme && theme !== void 0) $$bindings.theme(theme);
	return `<h2 class="${"text-xl m-4 " + escape(colorFromTheme(theme)) + " font-medium text-right"}">${escape(title)}</h2>`;
});

/* src\client\components\Buttons\GenericButton.svelte generated by Svelte v3.34.0 */

const GenericButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { textbutton = "CLICK ME!" } = $$props;
	let { size = "medium" } = $$props;
	let { onClickAction } = $$props;
	let { customClasses = "" } = $$props;
	let { color = "light" } = $$props;
	let { disabled = false } = $$props;

	const textSizeFromSize = size => {
		if (size === "large") return "text-2xl";
		return "text-xl";
	};

	const marginTopFromSize = size => {
		if (size === "large") return "mt-4";
		return "";
	};

	const borderFromSize = size => {
		if (size === "large") return "border-2";
		return "border";
	};

	const buttonThemeFromColorAndDisabled = (color, disabled) => {
		if (color === "dark" && !disabled) return "text-bangarang-light border-bangarang-light bg-bangarang-dark";
		if (color === "dark" && disabled) return "text-bangarang-darkEmphasis border-bangarang-darkEmphasis bg-bangarang-darkEmphasis";
		if (color === "light" && disabled) return "text-bangarang-lightEmphasis border-bangarang-lightEmphasis bg-bangarang-light";
		return "text-bangarang-dark border-bangarang-dark bg-bangarang-light";
	};

	if ($$props.textbutton === void 0 && $$bindings.textbutton && textbutton !== void 0) $$bindings.textbutton(textbutton);
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.onClickAction === void 0 && $$bindings.onClickAction && onClickAction !== void 0) $$bindings.onClickAction(onClickAction);
	if ($$props.customClasses === void 0 && $$bindings.customClasses && customClasses !== void 0) $$bindings.customClasses(customClasses);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);

	return `${disabled
	? `<button class="${escape(textSizeFromSize(size)) + " " + escape(marginTopFromSize(size)) + " " + escape(customClasses) + " " + escape(buttonThemeFromColorAndDisabled(color, disabled)) + " my-1 px-1 pb-1  " + escape(borderFromSize(size)) + " rounded-md"}" disabled>${escape(textbutton)}</button>`
	: `<button class="${escape(textSizeFromSize(size)) + " " + escape(marginTopFromSize(size)) + " " + escape(customClasses) + " " + escape(buttonThemeFromColorAndDisabled(color, disabled)) + " my-1 px-1 pb-1  " + escape(borderFromSize(size)) + " rounded-md"}">${escape(textbutton)}</button>`}`;
});

/* src\client\components\Mains\LandingPageMain.svelte generated by Svelte v3.34.0 */
const theme = "dark";

const LandingPageMain = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	let { mainHeadLine } = $$props;
	let { supportingHeadLine } = $$props;

	const navigateToBangarang = () => {
		window.location.href = `/${$languageStore}/${StaticView.MainMenu}`;
	};

	if ($$props.mainHeadLine === void 0 && $$bindings.mainHeadLine && mainHeadLine !== void 0) $$bindings.mainHeadLine(mainHeadLine);
	if ($$props.supportingHeadLine === void 0 && $$bindings.supportingHeadLine && supportingHeadLine !== void 0) $$bindings.supportingHeadLine(supportingHeadLine);
	$$unsubscribe_languageStore();

	return `<main${add_attribute("class", "flex flex-col flex-grow m-auto p-1 justify-center items-center max-w-screen-md", 0)}><section>${mainHeadLine
	? `${validate_component(MainTitle, "MainTitle").$$render(
			$$result,
			{
				title: mainHeadLine,
				size: "large",
				theme
			},
			{},
			{}
		)}`
	: ``}
        ${supportingHeadLine
	? `${validate_component(MainSubTitle, "MainSubTitle").$$render(
			$$result,
			{
				title: painRelieversToSupportingHeadLine($languageStore, supportingHeadLine),
				theme
			},
			{},
			{}
		)}`
	: ``}</section>
    ${validate_component(GenericButton, "GenericButton").$$render(
		$$result,
		{
			textbutton: new Message(callToActionMessage).getMessage($languageStore),
			customClasses: "w-11/12",
			size: "large",
			color: "dark",
			onClickAction: navigateToBangarang
		},
		{},
		{}
	)}</main>`;
});

/* src\client\views\LandingPageView.svelte generated by Svelte v3.34.0 */

const LandingPageView = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { mainHeadLine } = $$props;
	let { supportingHeadLine } = $$props;
	if ($$props.mainHeadLine === void 0 && $$bindings.mainHeadLine && mainHeadLine !== void 0) $$bindings.mainHeadLine(mainHeadLine);
	if ($$props.supportingHeadLine === void 0 && $$bindings.supportingHeadLine && supportingHeadLine !== void 0) $$bindings.supportingHeadLine(supportingHeadLine);
	return `${validate_component(LandingPageMain, "LandingPageMain").$$render($$result, { mainHeadLine, supportingHeadLine }, {}, {})}`;
});

/* src\routes\[language]\landingPages\[audience]\[landingPageId].svelte generated by Svelte v3.34.0 */

var __awaiter$7 = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P
		? value
		: new P(function (resolve) {
					resolve(value);
				});
	}

	return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch(e) {
					reject(e);
				}
			}

			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch(e) {
					reject(e);
				}
			}

			function step(result) {
				result.done
				? resolve(result.value)
				: adopt(result.value).then(fulfilled, rejected);
			}

			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
};

function preload$6(page, session) {
	return __awaiter$7(this, void 0, void 0, function* () {
		const { audience, landingPageId, language } = page.params;
		const valueProposition = retreiveValuePropositionFromValuePropositionPageLink(audience);
		const mainHeadLine = valueProposition.pains[landingPageId - 1];
		const supportingHeadLine = valueProposition.painRelievers[landingPageId - 1];
		const selectedLanguage = language;

		if (!mainHeadLine || !supportingHeadLine) throw new Error("Value Proposition not found"); else return {
			mainHeadLine,
			supportingHeadLine,
			selectedLanguage
		};
	});
}

const U5BlandingPageIdu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	
	let { mainHeadLine } = $$props;
	let { supportingHeadLine } = $$props;
	let { selectedLanguage } = $$props;
	assignLanguage(selectedLanguage);
	onMount(() => redirectOnUnknownLanguage(selectedLanguage));
	if ($$props.mainHeadLine === void 0 && $$bindings.mainHeadLine && mainHeadLine !== void 0) $$bindings.mainHeadLine(mainHeadLine);
	if ($$props.supportingHeadLine === void 0 && $$bindings.supportingHeadLine && supportingHeadLine !== void 0) $$bindings.supportingHeadLine(supportingHeadLine);
	if ($$props.selectedLanguage === void 0 && $$bindings.selectedLanguage && selectedLanguage !== void 0) $$bindings.selectedLanguage(selectedLanguage);
	$$unsubscribe_languageStore();

	return `${validate_component(LandingPageView, "LandingPageView").$$render(
		$$result,
		{
			mainHeadLine: new Message(mainHeadLine).getMessage($languageStore),
			supportingHeadLine: new Message(supportingHeadLine).getMessage($languageStore)
		},
		{},
		{}
	)}`;
});

var component_7 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': U5BlandingPageIdu5D,
    preload: preload$6
});

/* src\client\components\Headers\LeanCanvasHeader.svelte generated by Svelte v3.34.0 */

const LeanCanvasHeader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	$$unsubscribe_languageStore();

	return `<header${add_attribute("class", "flex flex-col flex-grow mx-auto px-1 justify-center items-center max-w-screen-md", 0)}>${validate_component(HeaderTitle, "HeaderTitle").$$render(
		$$result,
		{
			title: new Message(leanCanvasTitleMessage).getMessage($languageStore)
		},
		{},
		{}
	)}</header>`;
});

/* src\client\components\Mains\LeanCanvasMain.svelte generated by Svelte v3.34.0 */

const LeanCanvasMain = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	$$unsubscribe_languageStore();

	return `<main${add_attribute("class", "flex flex-col flex-grow m-auto p-1 items-center max-w-screen-md overflow-y-auto", 0)}>${each(leanCanvas($languageStore), leanCanvasPart => `${validate_component(MainTitle, "MainTitle").$$render(
		$$result,
		{
			title: leanCanvasPart.partName,
			position: "center"
		},
		{},
		{}
	)}
        ${each(leanCanvasPart.sections, section => `${validate_component(DescriptionCard, "DescriptionCard").$$render($$result, { descriptionCardContract: section }, {}, {})}`)}`)}</main>`;
});

/* src\client\components\Destination\NavigateToMainMenu.svelte generated by Svelte v3.34.0 */

const NavigateToMainMenu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	const navigateToUrl = url => goto(url);
	const navigateToDeclareClaim = () => navigateToUrl(`/${$languageStore}/${StaticView.MainMenu}`);
	$$unsubscribe_languageStore();

	return `${validate_component(GenericDestination, "GenericDestination").$$render(
		$$result,
		{
			destinationMessage: backToMainMenuLinkMessage,
			onClickAction: navigateToDeclareClaim,
			svgHtml: home
		},
		{},
		{}
	)}`;
});

/* src\client\components\Footers\LeanCanvasFooter.svelte generated by Svelte v3.34.0 */

const LeanCanvasFooter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<footer${add_attribute("class", "flex flex-col pt-2 pb-16 lg:pb-1 bg-bangarang-veryLightEmphasis", 0)}><section${add_attribute("class", "flex w-full max-w-screen-md justify-between m-auto", 0)}>${validate_component(NavigateToBusinessModel, "NavigateToBusinessModel").$$render($$result, {}, {}, {})}
        ${validate_component(NavigateToMainMenu, "NavigateToMainMenu").$$render($$result, {}, {}, {})}</section></footer>`;
});

/* src\client\views\LeanCanvasView.svelte generated by Svelte v3.34.0 */

const LeanCanvasView = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `${validate_component(LeanCanvasHeader, "LeanCanvasHeader").$$render($$result, {}, {}, {})}
${validate_component(LeanCanvasMain, "LeanCanvasMain").$$render($$result, {}, {}, {})}
${validate_component(LeanCanvasFooter, "LeanCanvasFooter").$$render($$result, {}, {}, {})}`;
});

/* src\routes\[language]\LeanCanvas.svelte generated by Svelte v3.34.0 */

var __awaiter$8 = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P
		? value
		: new P(function (resolve) {
					resolve(value);
				});
	}

	return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch(e) {
					reject(e);
				}
			}

			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch(e) {
					reject(e);
				}
			}

			function step(result) {
				result.done
				? resolve(result.value)
				: adopt(result.value).then(fulfilled, rejected);
			}

			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
};

function preload$7(page, session) {
	return __awaiter$8(this, void 0, void 0, function* () {
		const { language } = page.params;
		const selectedLanguage = language;
		return { selectedLanguage };
	});
}

const LeanCanvas = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { selectedLanguage } = $$props;
	assignLanguage(selectedLanguage);
	onMount(() => redirectOnUnknownLanguage(selectedLanguage));
	if ($$props.selectedLanguage === void 0 && $$bindings.selectedLanguage && selectedLanguage !== void 0) $$bindings.selectedLanguage(selectedLanguage);
	return `${validate_component(LeanCanvasView, "LeanCanvasView").$$render($$result, {}, {}, {})}`;
});

var component_8 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': LeanCanvas,
    preload: preload$7
});

/* src\client\components\Titles\RegisterTitle.svelte generated by Svelte v3.34.0 */

const RegisterTitle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	$$unsubscribe_languageStore();

	return `<p class="${"text-2xl text-bangarang-darkEmphasis my-1"}">${escape(new Message(registerOnBangarangTitleMessage).getMessage($languageStore))}</p>
<h1 class="${"text-4xl text-bangarang-darkEmphasis my-1"}">${escape(new Message(bangarang).getMessage($languageStore))}</h1>`;
});

/* src\client\components\Headers\RegisterHeader.svelte generated by Svelte v3.34.0 */

const RegisterHeader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<header${add_attribute("class", "flex flex-col flex-grow mx-auto px-1 justify-end items-center max-w-screen-md", 0)}>${validate_component(RegisterTitle, "RegisterTitle").$$render($$result, {}, {}, {})}</header>`;
});

/* src\client\components\Cards\SecurityUserCard.svelte generated by Svelte v3.34.0 */

const SecurityUserCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	const message = new Message(registerSecurityMessage).getMessage($languageStore);
	$$unsubscribe_languageStore();
	return `<div class="${"border rounded my-6 border-bangarang-failed bg-bangarang-light flex flex-col items-center"}"><p class="${"m-1 text-bangarang-lightEmphasis flex-grow text-center text-xs"}">${message}</p></div>`;
});

/* src\client\components\Form\RegisterForm.svelte generated by Svelte v3.34.0 */

const RegisterForm = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;

	let $registeringUserNotificationStore,
		$$unsubscribe_registeringUserNotificationStore;

	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	validate_store(registeringUserNotificationStore, "registeringUserNotificationStore");
	$$unsubscribe_registeringUserNotificationStore = subscribe(registeringUserNotificationStore, value => $registeringUserNotificationStore = value);

	$$unsubscribe_languageStore();
	$$unsubscribe_registeringUserNotificationStore();

	return `<form class="${"form-example flex flex-col"}">${validate_component(GenericTextField, "GenericTextField").$$render(
		$$result,
		{
			fieldId: "username",
			fieldName: new Message(registerFormUsernameMessage).getMessage($languageStore),
			isReadOnly: $registeringUserNotificationStore.status !== "Idle",
			isRequired: true
		},
		{},
		{}
	)}
    ${validate_component(GenericTextField, "GenericTextField").$$render(
		$$result,
		{
			fieldId: "fullname",
			fieldName: new Message(registerFormFullnameMessage).getMessage($languageStore),
			isReadOnly: $registeringUserNotificationStore.status !== "Idle",
			isRequired: true
		},
		{},
		{}
	)}
    ${validate_component(GenericTextField, "GenericTextField").$$render(
		$$result,
		{
			fieldId: "email",
			fieldName: new Message(registerFormEmailMessage).getMessage($languageStore),
			isReadOnly: $registeringUserNotificationStore.status !== "Idle",
			isRequired: true
		},
		{},
		{}
	)}
    ${validate_component(GenericPasswordField, "GenericPasswordField").$$render(
		$$result,
		{
			fieldId: "password",
			fieldName: new Message(registerFormPasswordMessage).getMessage($languageStore),
			isReadOnly: $registeringUserNotificationStore.status !== "Idle",
			isRequired: true
		},
		{},
		{}
	)}
    ${validate_component(GenericSubmitField, "GenericSubmitField").$$render(
		$$result,
		{
			fieldId: "register",
			fieldName: new Message(registerFormSubmitMessage).getMessage($languageStore),
			isReadOnly: $registeringUserNotificationStore.status !== "Idle"
		},
		{},
		{}
	)}</form>`;
});

/* src\client\components\Sections\RegisterSection.svelte generated by Svelte v3.34.0 */

const RegisterSection = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	$$unsubscribe_languageStore();

	return `${validate_component(SecurityUserCard, "SecurityUserCard").$$render($$result, {}, {}, {})}
<p class="${"text-bangarang-lightEmphasis"}">${escape(new Message(registerFormTitleMessage).getMessage($languageStore))}</p>
${validate_component(RegisterForm, "RegisterForm").$$render($$result, {}, {}, {})}`;
});

/* src\client\components\Mains\RegisterMain.svelte generated by Svelte v3.34.0 */

const RegisterMain = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<main${add_attribute("class", "flex flex-col flex-grow m-auto p-1 justify-center items-center max-w-screen-md", 0)}>${validate_component(RegisterSection, "RegisterSection").$$render($$result, {}, {}, {})}</main>`;
});

/* src\client\components\Notification\RegisteringInformation.svelte generated by Svelte v3.34.0 */

const RegisteringInformation = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $registeringUserNotificationStore,
		$$unsubscribe_registeringUserNotificationStore;

	validate_store(registeringUserNotificationStore, "registeringUserNotificationStore");
	$$unsubscribe_registeringUserNotificationStore = subscribe(registeringUserNotificationStore, value => $registeringUserNotificationStore = value);
	$$unsubscribe_registeringUserNotificationStore();

	return `${validate_component(GenericTaskNotification, "GenericTaskNotification").$$render(
		$$result,
		{
			taskNotification: $registeringUserNotificationStore
		},
		{},
		{}
	)}`;
});

/* src\client\components\Destination\NavigateToSignInMenu.svelte generated by Svelte v3.34.0 */

const NavigateToSignInMenu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	const navigateToUrl = url => goto(url);
	const navigateToDeclareClaim = () => navigateToUrl(`/${$languageStore}/${StaticView.SigningInMenu}`);
	$$unsubscribe_languageStore();

	return `${validate_component(GenericDestination, "GenericDestination").$$render(
		$$result,
		{
			destinationMessage: backToSignInMenuMessage,
			onClickAction: navigateToDeclareClaim,
			svgHtml: logIn
		},
		{},
		{}
	)}`;
});

/* src\client\components\Footers\RegisterFooter.svelte generated by Svelte v3.34.0 */

const RegisterFooter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $registeringUserNotificationStore,
		$$unsubscribe_registeringUserNotificationStore;

	validate_store(registeringUserNotificationStore, "registeringUserNotificationStore");
	$$unsubscribe_registeringUserNotificationStore = subscribe(registeringUserNotificationStore, value => $registeringUserNotificationStore = value);
	$$unsubscribe_registeringUserNotificationStore();

	return `<footer${add_attribute("class", "flex flex-col pt-2 pb-16 lg:pb-1 bg-bangarang-veryLightEmphasis", 0)}>${$registeringUserNotificationStore.status !== "Executing"
	? `<section${add_attribute("class", "flex w-full max-w-screen-md justify-between m-auto", 0)}>${validate_component(NavigateToSignInMenu, "NavigateToSignInMenu").$$render($$result, {}, {}, {})}</section> 
        ${$registeringUserNotificationStore.status !== "Idle"
		? `${validate_component(RegisteringInformation, "RegisteringInformation").$$render($$result, {}, {}, {})}`
		: ``}`
	: `${validate_component(RegisteringInformation, "RegisteringInformation").$$render($$result, {}, {}, {})}`}</footer>`;
});

/* src\client\views\RegisterView.svelte generated by Svelte v3.34.0 */

const RegisterView = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `${validate_component(RegisterHeader, "RegisterHeader").$$render($$result, {}, {}, {})}
${validate_component(RegisterMain, "RegisterMain").$$render($$result, {}, {}, {})}
${validate_component(RegisterFooter, "RegisterFooter").$$render($$result, {}, {}, {})}`;
});

/* src\routes\[language]\Register.svelte generated by Svelte v3.34.0 */

var __awaiter$9 = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P
		? value
		: new P(function (resolve) {
					resolve(value);
				});
	}

	return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch(e) {
					reject(e);
				}
			}

			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch(e) {
					reject(e);
				}
			}

			function step(result) {
				result.done
				? resolve(result.value)
				: adopt(result.value).then(fulfilled, rejected);
			}

			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
};

function preload$8(page, session) {
	return __awaiter$9(this, void 0, void 0, function* () {
		const { language } = page.params;
		const selectedLanguage = language;
		return { selectedLanguage };
	});
}

const Register = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { selectedLanguage } = $$props;
	assignLanguage(selectedLanguage);
	onMount(() => redirectOnUnknownLanguage(selectedLanguage));
	if ($$props.selectedLanguage === void 0 && $$bindings.selectedLanguage && selectedLanguage !== void 0) $$bindings.selectedLanguage(selectedLanguage);
	return `${validate_component(RegisterView, "RegisterView").$$render($$result, {}, {}, {})}`;
});

var component_10 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': Register,
    preload: preload$8
});

/* src\client\components\Destination\ClaimShare.svelte generated by Svelte v3.34.0 */

const ClaimShare = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { copyUriToClipboard } = $$props;
	if ($$props.copyUriToClipboard === void 0 && $$bindings.copyUriToClipboard && copyUriToClipboard !== void 0) $$bindings.copyUriToClipboard(copyUriToClipboard);

	return `${validate_component(GenericDestination, "GenericDestination").$$render(
		$$result,
		{
			onClickAction: copyUriToClipboard,
			destinationMessage: shareClaimMessage,
			svgHtml: share
		},
		{},
		{}
	)}`;
});

/* src\client\components\Notification\ClaimingInformation.svelte generated by Svelte v3.34.0 */

const ClaimingInformation = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $claimingUserNotificationStore, $$unsubscribe_claimingUserNotificationStore;
	validate_store(claimingUserNotificationStore, "claimingUserNotificationStore");
	$$unsubscribe_claimingUserNotificationStore = subscribe(claimingUserNotificationStore, value => $claimingUserNotificationStore = value);
	$$unsubscribe_claimingUserNotificationStore();

	return `${validate_component(GenericTaskNotification, "GenericTaskNotification").$$render(
		$$result,
		{
			taskNotification: $claimingUserNotificationStore
		},
		{},
		{}
	)}`;
});

/* src\client\components\Footers\ClaimFooter.svelte generated by Svelte v3.34.0 */

const ClaimFooter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $claimingUserNotificationStore, $$unsubscribe_claimingUserNotificationStore;

	let $declaringClaimUserNotificationStore,
		$$unsubscribe_declaringClaimUserNotificationStore;

	let $languageStore, $$unsubscribe_languageStore;
	validate_store(claimingUserNotificationStore, "claimingUserNotificationStore");
	$$unsubscribe_claimingUserNotificationStore = subscribe(claimingUserNotificationStore, value => $claimingUserNotificationStore = value);
	validate_store(declaringClaimUserNotificationStore, "declaringClaimUserNotificationStore");
	$$unsubscribe_declaringClaimUserNotificationStore = subscribe(declaringClaimUserNotificationStore, value => $declaringClaimUserNotificationStore = value);
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	let URICopiedToClipboard = false;
	let URICopyToClipboardError = undefined;

	const copyUriToClipboard = () => {
		navigator.clipboard.writeText(window.location.href).then(() => {
			URICopiedToClipboard = true;
		}).catch(error => {
			URICopiedToClipboard = false;
			URICopyToClipboardError = error;
		});
	};

	$$unsubscribe_claimingUserNotificationStore();
	$$unsubscribe_declaringClaimUserNotificationStore();
	$$unsubscribe_languageStore();

	return `<footer${add_attribute("class", "flex flex-col pt-2 pb-16 lg:pb-1 bg-bangarang-veryLightEmphasis", 0)}>${$claimingUserNotificationStore.status !== "Executing" && $declaringClaimUserNotificationStore.status !== "Executing"
	? `<section${add_attribute("class", "flex w-full max-w-screen-md justify-between m-auto", 0)}>${validate_component(NavigateBackToMainMenu, "NavigateBackToMainMenu").$$render($$result, {}, {}, {})}
            ${URICopiedToClipboard
		? `<p class="${"text-center w-1/2 text-xs text-bangarang-success"}">${escape(new Message(claimCopiedSuccessMessage).getMessage($languageStore))}</p>`
		: `${URICopyToClipboardError !== undefined
			? `<p class="${"text-center w-1/2 text-xs text-bangarang-failed"}">${escape(`${new Message(claimCopiedErrorMessage).getMessage($languageStore)}: ${URICopyToClipboardError.message}`)}</p>`
			: ``}`}
            ${validate_component(ClaimShare, "ClaimShare").$$render($$result, { copyUriToClipboard }, {}, {})}</section>
        ${$claimingUserNotificationStore.status !== "Idle"
		? `${validate_component(ClaimingInformation, "ClaimingInformation").$$render($$result, {}, {}, {})}`
		: `${$declaringClaimUserNotificationStore.status !== "Idle"
			? `${validate_component(DeclaringInformation, "DeclaringInformation").$$render($$result, {}, {}, {})}`
			: ``}`}`
	: `${$declaringClaimUserNotificationStore.status === "Executing"
		? `${validate_component(DeclaringInformation, "DeclaringInformation").$$render($$result, {}, {}, {})}`
		: `${$claimingUserNotificationStore.status === "Executing"
			? `${validate_component(ClaimingInformation, "ClaimingInformation").$$render($$result, {}, {}, {})}`
			: ``}`}`}</footer>`;
});

/* src\client\components\Headers\ClaimHeader.svelte generated by Svelte v3.34.0 */

const ClaimHeader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { title } = $$props;
	if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
	return `<header${add_attribute("class", "flex flex-col flex-grow mx-auto px-1 justify-center items-center max-w-screen-md", 0)}><p class="${" self-center text-lg text-center text-bangarang-lightEmphasis"}">${escape(title)}</p></header>`;
});

const claiming = (claimTitle, claimChoice) => {
    claimingUserNotificationStore.set(executingClaimingUserNotification);
    uiBangarangUserBuilder.getUser().claiming(claimTitle, claimChoice);
};

/* src\client\components\Buttons\ClaimButton.svelte generated by Svelte v3.34.0 */

const ClaimButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $claimingUserNotificationStore, $$unsubscribe_claimingUserNotificationStore;

	let $declaringClaimUserNotificationStore,
		$$unsubscribe_declaringClaimUserNotificationStore;

	validate_store(claimingUserNotificationStore, "claimingUserNotificationStore");
	$$unsubscribe_claimingUserNotificationStore = subscribe(claimingUserNotificationStore, value => $claimingUserNotificationStore = value);
	validate_store(declaringClaimUserNotificationStore, "declaringClaimUserNotificationStore");
	$$unsubscribe_declaringClaimUserNotificationStore = subscribe(declaringClaimUserNotificationStore, value => $declaringClaimUserNotificationStore = value);
	
	let { claimId } = $$props;
	let { claimingChoice } = $$props;
	let { claimingChoiceMessage } = $$props;
	let { userClaimingChoice } = $$props;
	const onClickAction = () => claiming(claimId, claimingChoice);
	if ($$props.claimId === void 0 && $$bindings.claimId && claimId !== void 0) $$bindings.claimId(claimId);
	if ($$props.claimingChoice === void 0 && $$bindings.claimingChoice && claimingChoice !== void 0) $$bindings.claimingChoice(claimingChoice);
	if ($$props.claimingChoiceMessage === void 0 && $$bindings.claimingChoiceMessage && claimingChoiceMessage !== void 0) $$bindings.claimingChoiceMessage(claimingChoiceMessage);
	if ($$props.userClaimingChoice === void 0 && $$bindings.userClaimingChoice && userClaimingChoice !== void 0) $$bindings.userClaimingChoice(userClaimingChoice);
	$$unsubscribe_claimingUserNotificationStore();
	$$unsubscribe_declaringClaimUserNotificationStore();

	return `${$claimingUserNotificationStore.status === "Idle" && $declaringClaimUserNotificationStore.status === "Idle"
	? `${userClaimingChoice === claimingChoice
		? `${validate_component(GenericButton, "GenericButton").$$render(
				$$result,
				{
					textbutton: claimingChoiceMessage,
					onClickAction,
					disabled: true
				},
				{},
				{}
			)}`
		: `${validate_component(GenericButton, "GenericButton").$$render(
				$$result,
				{
					textbutton: claimingChoiceMessage,
					onClickAction,
					disabled: false
				},
				{},
				{}
			)}`}`
	: `${validate_component(GenericButton, "GenericButton").$$render(
			$$result,
			{
				textbutton: claimingChoiceMessage,
				onClickAction,
				disabled: true
			},
			{},
			{}
		)}`}`;
});

/* src\client\components\Mains\ClaimMain.svelte generated by Svelte v3.34.0 */

const ClaimMain = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $languageStore, $$unsubscribe_languageStore;
	validate_store(languageStore, "languageStore");
	$$unsubscribe_languageStore = subscribe(languageStore, value => $languageStore = value);
	
	let { peopleClaimed = 0 } = $$props;
	let { peopleFor = 0 } = $$props;
	let { peopleAgainst = 0 } = $$props;
	let { claimId = "" } = $$props;
	let { userClaimingChoice = undefined } = $$props;
	const retreivePercentage = (total, part) => total > 0 ? part / total * 100 : 0;
	if ($$props.peopleClaimed === void 0 && $$bindings.peopleClaimed && peopleClaimed !== void 0) $$bindings.peopleClaimed(peopleClaimed);
	if ($$props.peopleFor === void 0 && $$bindings.peopleFor && peopleFor !== void 0) $$bindings.peopleFor(peopleFor);
	if ($$props.peopleAgainst === void 0 && $$bindings.peopleAgainst && peopleAgainst !== void 0) $$bindings.peopleAgainst(peopleAgainst);
	if ($$props.claimId === void 0 && $$bindings.claimId && claimId !== void 0) $$bindings.claimId(claimId);
	if ($$props.userClaimingChoice === void 0 && $$bindings.userClaimingChoice && userClaimingChoice !== void 0) $$bindings.userClaimingChoice(userClaimingChoice);
	$$unsubscribe_languageStore();

	return `<main${add_attribute("class", "flex flex-col flex-grow m-auto p-1 justify-center items-center max-w-screen-md", 0)}><p class="${"text-center text-bangarang-lightEmphasis my-2"}">${escape(peopleClaimed)}<br>${escape(new Message(peopleClaimedMessage).getMessage($languageStore))}</p>
    <section class="${"flex justify-between my-1 mx-4"}"><section class="${"flex flex-col w-1/3"}">${validate_component(ClaimButton, "ClaimButton").$$render(
		$$result,
		{
			claimId,
			userClaimingChoice,
			claimingChoice: "Against",
			claimingChoiceMessage: new Message(claimAgainstMessage).getMessage($languageStore)
		},
		{},
		{}
	)}
            <p class="${"text-center text-bangarang-lightEmphasis"}">${escape(retreivePercentage(peopleClaimed, peopleAgainst).toFixed(2))}%</p></section>
        <section class="${"flex flex-col w-1/3"}">${validate_component(ClaimButton, "ClaimButton").$$render(
		$$result,
		{
			claimId,
			userClaimingChoice,
			claimingChoice: "For",
			claimingChoiceMessage: new Message(claimForMessage).getMessage($languageStore)
		},
		{},
		{}
	)}
            <p class="${"text-center text-bangarang-lightEmphasis"}">${escape(retreivePercentage(peopleClaimed, peopleFor).toFixed(2))}%</p></section></section></main>`;
});

/* src\client\views\ClaimView.svelte generated by Svelte v3.34.0 */

const ClaimView = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { claim } = $$props;
	
	if ($$props.claim === void 0 && $$bindings.claim && claim !== void 0) $$bindings.claim(claim);

	return `${validate_component(ClaimHeader, "ClaimHeader").$$render($$result, { title: claim.title }, {}, {})}
${validate_component(ClaimMain, "ClaimMain").$$render(
		$$result,
		{
			peopleClaimed: claim.peopleClaimed,
			peopleFor: claim.peopleClaimedFor,
			peopleAgainst: claim.peopleClaimedAgainst,
			claimId: claim.id,
			userClaimingChoice: claim.previousUserClaimChoice
		},
		{},
		{}
	)}
${validate_component(ClaimFooter, "ClaimFooter").$$render($$result, {}, {}, {})}`;
});

const retrievingClaimById = (claimId) => {
    retrievingClaimUserNotificationStore.set(executingRetrievingClaimUserNotification);
    return uiBangarangUserBuilder.getUser().retrievingClaimById(claimId);
};

/* src\routes\[language]\claims\[claimId].svelte generated by Svelte v3.34.0 */

var __awaiter$a = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P
		? value
		: new P(function (resolve) {
					resolve(value);
				});
	}

	return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch(e) {
					reject(e);
				}
			}

			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch(e) {
					reject(e);
				}
			}

			function step(result) {
				result.done
				? resolve(result.value)
				: adopt(result.value).then(fulfilled, rejected);
			}

			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
};

function preload$9(page, session) {
	return __awaiter$a(this, void 0, void 0, function* () {
		const { language, claimId } = page.params;
		return { language, claimId };
	});
}

const U5BclaimIdu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { language } = $$props;
	let { claimId } = $$props;
	
	
	
	assignLanguage(language);
	onMount(() => redirectOnUnknownLanguage(language));
	let claim;
	currentClaimIdStore.set(claimId);

	const shouldRetrieveClaimOnSuccessClaimingNotification = claimingUserNotification => {
		if (claimingUserNotification.status === "Success") retrievingClaimById(claimId);
	};

	retrievingClaimById(claimId);
	claimingUserNotificationStore.subscribe(claimingUserNotification => shouldRetrieveClaimOnSuccessClaimingNotification(claimingUserNotification));

	const shouldAffectClaim = retrievingClaimUserNotification => {
		if (retrievingClaimUserNotification.status === "Success" && retrievingClaimUserNotification.claimWithMemberPreviousClaimChoice) {
			claim = retrievingClaimUserNotification.claimWithMemberPreviousClaimChoice;
		}
	};

	retrievingClaimUserNotificationStore.subscribe(retrievingClaimUserNotification => shouldAffectClaim(retrievingClaimUserNotification));
	if ($$props.language === void 0 && $$bindings.language && language !== void 0) $$bindings.language(language);
	if ($$props.claimId === void 0 && $$bindings.claimId && claimId !== void 0) $$bindings.claimId(claimId);

	return `${claim
	? `${validate_component(ClaimView, "ClaimView").$$render($$result, { claim }, {}, {})}`
	: ``}`;
});

var component_11 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': U5BclaimIdu5D,
    preload: preload$9
});

// This file is generated by Sapper — do not edit it!

const d = decodeURIComponent;

const manifest = {
	server_routes: [
		
	],

	pages: [
		{
			// index.svelte
			pattern: /^\/$/,
			parts: [
				{ name: "index", file: "index.svelte", component: component_0 }
			]
		},

		{
			// LanguageSelect.svelte
			pattern: /^\/LanguageSelect\/?$/,
			parts: [
				{ name: "LanguageSelect", file: "LanguageSelect.svelte", component: component_1 }
			]
		},

		{
			// [language]/index.svelte
			pattern: /^\/([^/]+?)\/?$/,
			parts: [
				{ name: "$language", file: "[language]/index.svelte", component: component_2, params: match => ({ language: d(match[1]) }) }
			]
		},

		{
			// [language]/valuePropositions/[valuePropositionPageLink].svelte
			pattern: /^\/([^/]+?)\/valuePropositions\/([^/]+?)\/?$/,
			parts: [
				null,
				null,
				{ name: "$language$93_valuePropositions_$91valuePropositionPageLink", file: "[language]/valuePropositions/[valuePropositionPageLink].svelte", component: component_3, params: match => ({ language: d(match[1]), valuePropositionPageLink: d(match[2]) }) }
			]
		},

		{
			// [language]/BusinessModel.svelte
			pattern: /^\/([^/]+?)\/BusinessModel\/?$/,
			parts: [
				null,
				{ name: "$language_BusinessModel", file: "[language]/BusinessModel.svelte", component: component_4, params: match => ({ language: d(match[1]) }) }
			]
		},

		{
			// [language]/SigningInMenu.svelte
			pattern: /^\/([^/]+?)\/SigningInMenu\/?$/,
			parts: [
				null,
				{ name: "$language_SigningInMenu", file: "[language]/SigningInMenu.svelte", component: component_5, params: match => ({ language: d(match[1]) }) }
			]
		},

		{
			// [language]/DeclareClaim.svelte
			pattern: /^\/([^/]+?)\/DeclareClaim\/?$/,
			parts: [
				null,
				{ name: "$language_DeclareClaim", file: "[language]/DeclareClaim.svelte", component: component_6, params: match => ({ language: d(match[1]) }) }
			]
		},

		{
			// [language]/landingPages/[audience]/[landingPageId].svelte
			pattern: /^\/([^/]+?)\/landingPages\/([^/]+?)\/([^/]+?)\/?$/,
			parts: [
				null,
				null,
				null,
				{ name: "$language$93_landingPages_$91audience$93_$91landingPageId", file: "[language]/landingPages/[audience]/[landingPageId].svelte", component: component_7, params: match => ({ language: d(match[1]), audience: d(match[2]), landingPageId: d(match[3]) }) }
			]
		},

		{
			// [language]/LeanCanvas.svelte
			pattern: /^\/([^/]+?)\/LeanCanvas\/?$/,
			parts: [
				null,
				{ name: "$language_LeanCanvas", file: "[language]/LeanCanvas.svelte", component: component_8, params: match => ({ language: d(match[1]) }) }
			]
		},

		{
			// [language]/MainMenu.svelte
			pattern: /^\/([^/]+?)\/MainMenu\/?$/,
			parts: [
				null,
				{ name: "$language_MainMenu", file: "[language]/MainMenu.svelte", component: component_9, params: match => ({ language: d(match[1]) }) }
			]
		},

		{
			// [language]/Register.svelte
			pattern: /^\/([^/]+?)\/Register\/?$/,
			parts: [
				null,
				{ name: "$language_Register", file: "[language]/Register.svelte", component: component_10, params: match => ({ language: d(match[1]) }) }
			]
		},

		{
			// [language]/claims/[claimId].svelte
			pattern: /^\/([^/]+?)\/claims\/([^/]+?)\/?$/,
			parts: [
				null,
				null,
				{ name: "$language$93_claims_$91claimId", file: "[language]/claims/[claimId].svelte", component: component_11, params: match => ({ language: d(match[1]), claimId: d(match[2]) }) }
			]
		}
	],

	root_comp,
	error: Error$1
};

const build_dir = "__sapper__/build";

/**
 * @param typeMap [Object] Map of MIME type -> Array[extensions]
 * @param ...
 */
function Mime() {
  this._types = Object.create(null);
  this._extensions = Object.create(null);

  for (var i = 0; i < arguments.length; i++) {
    this.define(arguments[i]);
  }

  this.define = this.define.bind(this);
  this.getType = this.getType.bind(this);
  this.getExtension = this.getExtension.bind(this);
}

/**
 * Define mimetype -> extension mappings.  Each key is a mime-type that maps
 * to an array of extensions associated with the type.  The first extension is
 * used as the default extension for the type.
 *
 * e.g. mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});
 *
 * If a type declares an extension that has already been defined, an error will
 * be thrown.  To suppress this error and force the extension to be associated
 * with the new type, pass `force`=true.  Alternatively, you may prefix the
 * extension with "*" to map the type to extension, without mapping the
 * extension to the type.
 *
 * e.g. mime.define({'audio/wav', ['wav']}, {'audio/x-wav', ['*wav']});
 *
 *
 * @param map (Object) type definitions
 * @param force (Boolean) if true, force overriding of existing definitions
 */
Mime.prototype.define = function(typeMap, force) {
  for (var type in typeMap) {
    var extensions = typeMap[type].map(function(t) {return t.toLowerCase()});
    type = type.toLowerCase();

    for (var i = 0; i < extensions.length; i++) {
      var ext = extensions[i];

      // '*' prefix = not the preferred type for this extension.  So fixup the
      // extension, and skip it.
      if (ext[0] == '*') {
        continue;
      }

      if (!force && (ext in this._types)) {
        throw new Error(
          'Attempt to change mapping for "' + ext +
          '" extension from "' + this._types[ext] + '" to "' + type +
          '". Pass `force=true` to allow this, otherwise remove "' + ext +
          '" from the list of extensions for "' + type + '".'
        );
      }

      this._types[ext] = type;
    }

    // Use first extension as default
    if (force || !this._extensions[type]) {
      var ext = extensions[0];
      this._extensions[type] = (ext[0] != '*') ? ext : ext.substr(1);
    }
  }
};

/**
 * Lookup a mime type based on extension
 */
Mime.prototype.getType = function(path) {
  path = String(path);
  var last = path.replace(/^.*[/\\]/, '').toLowerCase();
  var ext = last.replace(/^.*\./, '').toLowerCase();

  var hasPath = last.length < path.length;
  var hasDot = ext.length < last.length - 1;

  return (hasDot || !hasPath) && this._types[ext] || null;
};

/**
 * Return file extension associated with a mime type
 */
Mime.prototype.getExtension = function(type) {
  type = /^\s*([^;\s]*)/.test(type) && RegExp.$1;
  return type && this._extensions[type.toLowerCase()] || null;
};

var Mime_1 = Mime;

var standard = {"application/andrew-inset":["ez"],"application/applixware":["aw"],"application/atom+xml":["atom"],"application/atomcat+xml":["atomcat"],"application/atomdeleted+xml":["atomdeleted"],"application/atomsvc+xml":["atomsvc"],"application/atsc-dwd+xml":["dwd"],"application/atsc-held+xml":["held"],"application/atsc-rsat+xml":["rsat"],"application/bdoc":["bdoc"],"application/calendar+xml":["xcs"],"application/ccxml+xml":["ccxml"],"application/cdfx+xml":["cdfx"],"application/cdmi-capability":["cdmia"],"application/cdmi-container":["cdmic"],"application/cdmi-domain":["cdmid"],"application/cdmi-object":["cdmio"],"application/cdmi-queue":["cdmiq"],"application/cu-seeme":["cu"],"application/dash+xml":["mpd"],"application/davmount+xml":["davmount"],"application/docbook+xml":["dbk"],"application/dssc+der":["dssc"],"application/dssc+xml":["xdssc"],"application/ecmascript":["ecma","es"],"application/emma+xml":["emma"],"application/emotionml+xml":["emotionml"],"application/epub+zip":["epub"],"application/exi":["exi"],"application/fdt+xml":["fdt"],"application/font-tdpfr":["pfr"],"application/geo+json":["geojson"],"application/gml+xml":["gml"],"application/gpx+xml":["gpx"],"application/gxf":["gxf"],"application/gzip":["gz"],"application/hjson":["hjson"],"application/hyperstudio":["stk"],"application/inkml+xml":["ink","inkml"],"application/ipfix":["ipfix"],"application/its+xml":["its"],"application/java-archive":["jar","war","ear"],"application/java-serialized-object":["ser"],"application/java-vm":["class"],"application/javascript":["js","mjs"],"application/json":["json","map"],"application/json5":["json5"],"application/jsonml+json":["jsonml"],"application/ld+json":["jsonld"],"application/lgr+xml":["lgr"],"application/lost+xml":["lostxml"],"application/mac-binhex40":["hqx"],"application/mac-compactpro":["cpt"],"application/mads+xml":["mads"],"application/manifest+json":["webmanifest"],"application/marc":["mrc"],"application/marcxml+xml":["mrcx"],"application/mathematica":["ma","nb","mb"],"application/mathml+xml":["mathml"],"application/mbox":["mbox"],"application/mediaservercontrol+xml":["mscml"],"application/metalink+xml":["metalink"],"application/metalink4+xml":["meta4"],"application/mets+xml":["mets"],"application/mmt-aei+xml":["maei"],"application/mmt-usd+xml":["musd"],"application/mods+xml":["mods"],"application/mp21":["m21","mp21"],"application/mp4":["mp4s","m4p"],"application/mrb-consumer+xml":["*xdf"],"application/mrb-publish+xml":["*xdf"],"application/msword":["doc","dot"],"application/mxf":["mxf"],"application/n-quads":["nq"],"application/n-triples":["nt"],"application/node":["cjs"],"application/octet-stream":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"],"application/oda":["oda"],"application/oebps-package+xml":["opf"],"application/ogg":["ogx"],"application/omdoc+xml":["omdoc"],"application/onenote":["onetoc","onetoc2","onetmp","onepkg"],"application/oxps":["oxps"],"application/p2p-overlay+xml":["relo"],"application/patch-ops-error+xml":["*xer"],"application/pdf":["pdf"],"application/pgp-encrypted":["pgp"],"application/pgp-signature":["asc","sig"],"application/pics-rules":["prf"],"application/pkcs10":["p10"],"application/pkcs7-mime":["p7m","p7c"],"application/pkcs7-signature":["p7s"],"application/pkcs8":["p8"],"application/pkix-attr-cert":["ac"],"application/pkix-cert":["cer"],"application/pkix-crl":["crl"],"application/pkix-pkipath":["pkipath"],"application/pkixcmp":["pki"],"application/pls+xml":["pls"],"application/postscript":["ai","eps","ps"],"application/provenance+xml":["provx"],"application/pskc+xml":["pskcxml"],"application/raml+yaml":["raml"],"application/rdf+xml":["rdf","owl"],"application/reginfo+xml":["rif"],"application/relax-ng-compact-syntax":["rnc"],"application/resource-lists+xml":["rl"],"application/resource-lists-diff+xml":["rld"],"application/rls-services+xml":["rs"],"application/route-apd+xml":["rapd"],"application/route-s-tsid+xml":["sls"],"application/route-usd+xml":["rusd"],"application/rpki-ghostbusters":["gbr"],"application/rpki-manifest":["mft"],"application/rpki-roa":["roa"],"application/rsd+xml":["rsd"],"application/rss+xml":["rss"],"application/rtf":["rtf"],"application/sbml+xml":["sbml"],"application/scvp-cv-request":["scq"],"application/scvp-cv-response":["scs"],"application/scvp-vp-request":["spq"],"application/scvp-vp-response":["spp"],"application/sdp":["sdp"],"application/senml+xml":["senmlx"],"application/sensml+xml":["sensmlx"],"application/set-payment-initiation":["setpay"],"application/set-registration-initiation":["setreg"],"application/shf+xml":["shf"],"application/sieve":["siv","sieve"],"application/smil+xml":["smi","smil"],"application/sparql-query":["rq"],"application/sparql-results+xml":["srx"],"application/srgs":["gram"],"application/srgs+xml":["grxml"],"application/sru+xml":["sru"],"application/ssdl+xml":["ssdl"],"application/ssml+xml":["ssml"],"application/swid+xml":["swidtag"],"application/tei+xml":["tei","teicorpus"],"application/thraud+xml":["tfi"],"application/timestamped-data":["tsd"],"application/toml":["toml"],"application/ttml+xml":["ttml"],"application/urc-ressheet+xml":["rsheet"],"application/voicexml+xml":["vxml"],"application/wasm":["wasm"],"application/widget":["wgt"],"application/winhlp":["hlp"],"application/wsdl+xml":["wsdl"],"application/wspolicy+xml":["wspolicy"],"application/xaml+xml":["xaml"],"application/xcap-att+xml":["xav"],"application/xcap-caps+xml":["xca"],"application/xcap-diff+xml":["xdf"],"application/xcap-el+xml":["xel"],"application/xcap-error+xml":["xer"],"application/xcap-ns+xml":["xns"],"application/xenc+xml":["xenc"],"application/xhtml+xml":["xhtml","xht"],"application/xliff+xml":["xlf"],"application/xml":["xml","xsl","xsd","rng"],"application/xml-dtd":["dtd"],"application/xop+xml":["xop"],"application/xproc+xml":["xpl"],"application/xslt+xml":["xslt"],"application/xspf+xml":["xspf"],"application/xv+xml":["mxml","xhvml","xvml","xvm"],"application/yang":["yang"],"application/yin+xml":["yin"],"application/zip":["zip"],"audio/3gpp":["*3gpp"],"audio/adpcm":["adp"],"audio/basic":["au","snd"],"audio/midi":["mid","midi","kar","rmi"],"audio/mobile-xmf":["mxmf"],"audio/mp3":["*mp3"],"audio/mp4":["m4a","mp4a"],"audio/mpeg":["mpga","mp2","mp2a","mp3","m2a","m3a"],"audio/ogg":["oga","ogg","spx"],"audio/s3m":["s3m"],"audio/silk":["sil"],"audio/wav":["wav"],"audio/wave":["*wav"],"audio/webm":["weba"],"audio/xm":["xm"],"font/collection":["ttc"],"font/otf":["otf"],"font/ttf":["ttf"],"font/woff":["woff"],"font/woff2":["woff2"],"image/aces":["exr"],"image/apng":["apng"],"image/bmp":["bmp"],"image/cgm":["cgm"],"image/dicom-rle":["drle"],"image/emf":["emf"],"image/fits":["fits"],"image/g3fax":["g3"],"image/gif":["gif"],"image/heic":["heic"],"image/heic-sequence":["heics"],"image/heif":["heif"],"image/heif-sequence":["heifs"],"image/hej2k":["hej2"],"image/hsj2":["hsj2"],"image/ief":["ief"],"image/jls":["jls"],"image/jp2":["jp2","jpg2"],"image/jpeg":["jpeg","jpg","jpe"],"image/jph":["jph"],"image/jphc":["jhc"],"image/jpm":["jpm"],"image/jpx":["jpx","jpf"],"image/jxr":["jxr"],"image/jxra":["jxra"],"image/jxrs":["jxrs"],"image/jxs":["jxs"],"image/jxsc":["jxsc"],"image/jxsi":["jxsi"],"image/jxss":["jxss"],"image/ktx":["ktx"],"image/png":["png"],"image/sgi":["sgi"],"image/svg+xml":["svg","svgz"],"image/t38":["t38"],"image/tiff":["tif","tiff"],"image/tiff-fx":["tfx"],"image/webp":["webp"],"image/wmf":["wmf"],"message/disposition-notification":["disposition-notification"],"message/global":["u8msg"],"message/global-delivery-status":["u8dsn"],"message/global-disposition-notification":["u8mdn"],"message/global-headers":["u8hdr"],"message/rfc822":["eml","mime"],"model/3mf":["3mf"],"model/gltf+json":["gltf"],"model/gltf-binary":["glb"],"model/iges":["igs","iges"],"model/mesh":["msh","mesh","silo"],"model/mtl":["mtl"],"model/obj":["obj"],"model/stl":["stl"],"model/vrml":["wrl","vrml"],"model/x3d+binary":["*x3db","x3dbz"],"model/x3d+fastinfoset":["x3db"],"model/x3d+vrml":["*x3dv","x3dvz"],"model/x3d+xml":["x3d","x3dz"],"model/x3d-vrml":["x3dv"],"text/cache-manifest":["appcache","manifest"],"text/calendar":["ics","ifb"],"text/coffeescript":["coffee","litcoffee"],"text/css":["css"],"text/csv":["csv"],"text/html":["html","htm","shtml"],"text/jade":["jade"],"text/jsx":["jsx"],"text/less":["less"],"text/markdown":["markdown","md"],"text/mathml":["mml"],"text/mdx":["mdx"],"text/n3":["n3"],"text/plain":["txt","text","conf","def","list","log","in","ini"],"text/richtext":["rtx"],"text/rtf":["*rtf"],"text/sgml":["sgml","sgm"],"text/shex":["shex"],"text/slim":["slim","slm"],"text/stylus":["stylus","styl"],"text/tab-separated-values":["tsv"],"text/troff":["t","tr","roff","man","me","ms"],"text/turtle":["ttl"],"text/uri-list":["uri","uris","urls"],"text/vcard":["vcard"],"text/vtt":["vtt"],"text/xml":["*xml"],"text/yaml":["yaml","yml"],"video/3gpp":["3gp","3gpp"],"video/3gpp2":["3g2"],"video/h261":["h261"],"video/h263":["h263"],"video/h264":["h264"],"video/jpeg":["jpgv"],"video/jpm":["*jpm","jpgm"],"video/mj2":["mj2","mjp2"],"video/mp2t":["ts"],"video/mp4":["mp4","mp4v","mpg4"],"video/mpeg":["mpeg","mpg","mpe","m1v","m2v"],"video/ogg":["ogv"],"video/quicktime":["qt","mov"],"video/webm":["webm"]};

var lite = new Mime_1(standard);

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
***************************************************************************** */

function __awaiter$b(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function get_server_route_handler(routes) {
    function handle_route(route, req, res, next) {
        return __awaiter$b(this, void 0, void 0, function* () {
            req.params = route.params(route.pattern.exec(req.path));
            const method = req.method.toLowerCase();
            // 'delete' cannot be exported from a module because it is a keyword,
            // so check for 'del' instead
            const method_export = method === 'delete' ? 'del' : method;
            const handle_method = route.handlers[method_export];
            if (handle_method) {
                if (process.env.SAPPER_EXPORT) {
                    const { write, end, setHeader } = res;
                    const chunks = [];
                    const headers = {};
                    // intercept data so that it can be exported
                    res.write = function (chunk) {
                        chunks.push(Buffer.from(chunk));
                        return write.apply(res, [chunk]);
                    };
                    res.setHeader = function (name, value) {
                        headers[name.toLowerCase()] = value;
                        setHeader.apply(res, [name, value]);
                    };
                    res.end = function (chunk) {
                        if (chunk)
                            chunks.push(Buffer.from(chunk));
                        end.apply(res, [chunk]);
                        process.send({
                            __sapper__: true,
                            event: 'file',
                            url: req.url,
                            method: req.method,
                            status: res.statusCode,
                            type: headers['content-type'],
                            body: Buffer.concat(chunks)
                        });
                    };
                }
                const handle_next = (err) => {
                    if (err) {
                        res.statusCode = 500;
                        res.end(err.message);
                    }
                    else {
                        process.nextTick(next);
                    }
                };
                try {
                    yield handle_method(req, res, handle_next);
                }
                catch (err) {
                    console.error(err);
                    handle_next(err);
                }
            }
            else {
                // no matching handler for method
                process.nextTick(next);
            }
        });
    }
    return function find_route(req, res, next) {
        for (const route of routes) {
            if (route.pattern.test(req.path)) {
                handle_route(route, req, res, next);
                return;
            }
        }
        next();
    };
}

/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module exports.
 * @public
 */

var parse_1 = parse;

/**
 * Module variables.
 * @private
 */

var decode = decodeURIComponent;
var pairSplitRegExp = /; */;

/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [options]
 * @return {object}
 * @public
 */

function parse(str, options) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string');
  }

  var obj = {};
  var opt = options || {};
  var pairs = str.split(pairSplitRegExp);
  var dec = opt.decode || decode;

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    var eq_idx = pair.indexOf('=');

    // skip things that don't look like key=value
    if (eq_idx < 0) {
      continue;
    }

    var key = pair.substr(0, eq_idx).trim();
    var val = pair.substr(++eq_idx, pair.length).trim();

    // quoted values
    if ('"' == val[0]) {
      val = val.slice(1, -1);
    }

    // only assign once
    if (undefined == obj[key]) {
      obj[key] = tryDecode(val, dec);
    }
  }

  return obj;
}

/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {function} decode
 * @private
 */

function tryDecode(str, decode) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}

var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$';
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
    '<': '\\u003C',
    '>': '\\u003E',
    '/': '\\u002F',
    '\\': '\\\\',
    '\b': '\\b',
    '\f': '\\f',
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t',
    '\0': '\\0',
    '\u2028': '\\u2028',
    '\u2029': '\\u2029'
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join('\0');
function devalue(value) {
    var counts = new Map();
    function walk(thing) {
        if (typeof thing === 'function') {
            throw new Error("Cannot stringify a function");
        }
        if (counts.has(thing)) {
            counts.set(thing, counts.get(thing) + 1);
            return;
        }
        counts.set(thing, 1);
        if (!isPrimitive(thing)) {
            var type = getType(thing);
            switch (type) {
                case 'Number':
                case 'String':
                case 'Boolean':
                case 'Date':
                case 'RegExp':
                    return;
                case 'Array':
                    thing.forEach(walk);
                    break;
                case 'Set':
                case 'Map':
                    Array.from(thing).forEach(walk);
                    break;
                default:
                    var proto = Object.getPrototypeOf(thing);
                    if (proto !== Object.prototype &&
                        proto !== null &&
                        Object.getOwnPropertyNames(proto).sort().join('\0') !== objectProtoOwnPropertyNames) {
                        throw new Error("Cannot stringify arbitrary non-POJOs");
                    }
                    if (Object.getOwnPropertySymbols(thing).length > 0) {
                        throw new Error("Cannot stringify POJOs with symbolic keys");
                    }
                    Object.keys(thing).forEach(function (key) { return walk(thing[key]); });
            }
        }
    }
    walk(value);
    var names = new Map();
    Array.from(counts)
        .filter(function (entry) { return entry[1] > 1; })
        .sort(function (a, b) { return b[1] - a[1]; })
        .forEach(function (entry, i) {
        names.set(entry[0], getName(i));
    });
    function stringify(thing) {
        if (names.has(thing)) {
            return names.get(thing);
        }
        if (isPrimitive(thing)) {
            return stringifyPrimitive(thing);
        }
        var type = getType(thing);
        switch (type) {
            case 'Number':
            case 'String':
            case 'Boolean':
                return "Object(" + stringify(thing.valueOf()) + ")";
            case 'RegExp':
                return "new RegExp(" + stringifyString(thing.source) + ", \"" + thing.flags + "\")";
            case 'Date':
                return "new Date(" + thing.getTime() + ")";
            case 'Array':
                var members = thing.map(function (v, i) { return i in thing ? stringify(v) : ''; });
                var tail = thing.length === 0 || (thing.length - 1 in thing) ? '' : ',';
                return "[" + members.join(',') + tail + "]";
            case 'Set':
            case 'Map':
                return "new " + type + "([" + Array.from(thing).map(stringify).join(',') + "])";
            default:
                var obj = "{" + Object.keys(thing).map(function (key) { return safeKey(key) + ":" + stringify(thing[key]); }).join(',') + "}";
                var proto = Object.getPrototypeOf(thing);
                if (proto === null) {
                    return Object.keys(thing).length > 0
                        ? "Object.assign(Object.create(null)," + obj + ")"
                        : "Object.create(null)";
                }
                return obj;
        }
    }
    var str = stringify(value);
    if (names.size) {
        var params_1 = [];
        var statements_1 = [];
        var values_1 = [];
        names.forEach(function (name, thing) {
            params_1.push(name);
            if (isPrimitive(thing)) {
                values_1.push(stringifyPrimitive(thing));
                return;
            }
            var type = getType(thing);
            switch (type) {
                case 'Number':
                case 'String':
                case 'Boolean':
                    values_1.push("Object(" + stringify(thing.valueOf()) + ")");
                    break;
                case 'RegExp':
                    values_1.push(thing.toString());
                    break;
                case 'Date':
                    values_1.push("new Date(" + thing.getTime() + ")");
                    break;
                case 'Array':
                    values_1.push("Array(" + thing.length + ")");
                    thing.forEach(function (v, i) {
                        statements_1.push(name + "[" + i + "]=" + stringify(v));
                    });
                    break;
                case 'Set':
                    values_1.push("new Set");
                    statements_1.push(name + "." + Array.from(thing).map(function (v) { return "add(" + stringify(v) + ")"; }).join('.'));
                    break;
                case 'Map':
                    values_1.push("new Map");
                    statements_1.push(name + "." + Array.from(thing).map(function (_a) {
                        var k = _a[0], v = _a[1];
                        return "set(" + stringify(k) + ", " + stringify(v) + ")";
                    }).join('.'));
                    break;
                default:
                    values_1.push(Object.getPrototypeOf(thing) === null ? 'Object.create(null)' : '{}');
                    Object.keys(thing).forEach(function (key) {
                        statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
                    });
            }
        });
        statements_1.push("return " + str);
        return "(function(" + params_1.join(',') + "){" + statements_1.join(';') + "}(" + values_1.join(',') + "))";
    }
    else {
        return str;
    }
}
function getName(num) {
    var name = '';
    do {
        name = chars[num % chars.length] + name;
        num = ~~(num / chars.length) - 1;
    } while (num >= 0);
    return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
    return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
    if (typeof thing === 'string')
        return stringifyString(thing);
    if (thing === void 0)
        return 'void 0';
    if (thing === 0 && 1 / thing < 0)
        return '-0';
    var str = String(thing);
    if (typeof thing === 'number')
        return str.replace(/^(-)?0\./, '$1.');
    return str;
}
function getType(thing) {
    return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
    return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
    return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
    return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
    return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
    var result = '"';
    for (var i = 0; i < str.length; i += 1) {
        var char = str.charAt(i);
        var code = char.charCodeAt(0);
        if (char === '"') {
            result += '\\"';
        }
        else if (char in escaped$1) {
            result += escaped$1[char];
        }
        else if (code >= 0xd800 && code <= 0xdfff) {
            var next = str.charCodeAt(i + 1);
            // If this is the beginning of a [high, low] surrogate pair,
            // add the next two characters, otherwise escape
            if (code <= 0xdbff && (next >= 0xdc00 && next <= 0xdfff)) {
                result += char + str[++i];
            }
            else {
                result += "\\u" + code.toString(16).toUpperCase();
            }
        }
        else {
            result += char;
        }
    }
    result += '"';
    return result;
}

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream__default['default'].Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = require('encoding').convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream__default['default'].PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream__default['default']) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream__default['default']) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream__default['default'])) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
		if (!res) {
			res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
			if (res) {
				res.pop(); // drop last quote
			}
		}

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream__default['default'] && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream__default['default']) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http__default['default'].STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url__default['default'].parse;
const format_url = Url__default['default'].format;

const streamDestructionSupported = 'destroy' in Stream__default['default'].Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream__default['default'].Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream__default['default'].PassThrough;
const resolve_url = Url__default['default'].resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https__default['default'] : http__default['default']).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream__default['default'].Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout,
							size: request.size
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib__default['default'].Z_SYNC_FLUSH,
				finishFlush: zlib__default['default'].Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib__default['default'].createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib__default['default'].createInflate());
					} else {
						body = body.pipe(zlib__default['default'].createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib__default['default'].createBrotliDecompress === 'function') {
				body = body.pipe(zlib__default['default'].createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
 */
var encode = function (number) {
  if (0 <= number && number < intToCharMap.length) {
    return intToCharMap[number];
  }
  throw new TypeError("Must be between 0 and 63: " + number);
};

/**
 * Decode a single base 64 character code digit to an integer. Returns -1 on
 * failure.
 */
var decode$1 = function (charCode) {
  var bigA = 65;     // 'A'
  var bigZ = 90;     // 'Z'

  var littleA = 97;  // 'a'
  var littleZ = 122; // 'z'

  var zero = 48;     // '0'
  var nine = 57;     // '9'

  var plus = 43;     // '+'
  var slash = 47;    // '/'

  var littleOffset = 26;
  var numberOffset = 52;

  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
  if (bigA <= charCode && charCode <= bigZ) {
    return (charCode - bigA);
  }

  // 26 - 51: abcdefghijklmnopqrstuvwxyz
  if (littleA <= charCode && charCode <= littleZ) {
    return (charCode - littleA + littleOffset);
  }

  // 52 - 61: 0123456789
  if (zero <= charCode && charCode <= nine) {
    return (charCode - zero + numberOffset);
  }

  // 62: +
  if (charCode == plus) {
    return 62;
  }

  // 63: /
  if (charCode == slash) {
    return 63;
  }

  // Invalid base64 digit.
  return -1;
};

var base64 = {
	encode: encode,
	decode: decode$1
};

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */



// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// length quantities we use in the source map spec, the first bit is the sign,
// the next four bits are the actual value, and the 6th bit is the
// continuation bit. The continuation bit tells us whether there are more
// digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

var VLQ_BASE_SHIFT = 5;

// binary: 100000
var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

// binary: 011111
var VLQ_BASE_MASK = VLQ_BASE - 1;

// binary: 100000
var VLQ_CONTINUATION_BIT = VLQ_BASE;

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
function toVLQSigned(aValue) {
  return aValue < 0
    ? ((-aValue) << 1) + 1
    : (aValue << 1) + 0;
}

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
function fromVLQSigned(aValue) {
  var isNegative = (aValue & 1) === 1;
  var shifted = aValue >> 1;
  return isNegative
    ? -shifted
    : shifted;
}

/**
 * Returns the base 64 VLQ encoded value.
 */
var encode$1 = function base64VLQ_encode(aValue) {
  var encoded = "";
  var digit;

  var vlq = toVLQSigned(aValue);

  do {
    digit = vlq & VLQ_BASE_MASK;
    vlq >>>= VLQ_BASE_SHIFT;
    if (vlq > 0) {
      // There are still more digits in this value, so we must make sure the
      // continuation bit is marked.
      digit |= VLQ_CONTINUATION_BIT;
    }
    encoded += base64.encode(digit);
  } while (vlq > 0);

  return encoded;
};

/**
 * Decodes the next base 64 VLQ value from the given string and returns the
 * value and the rest of the string via the out parameter.
 */
var decode$2 = function base64VLQ_decode(aStr, aIndex, aOutParam) {
  var strLen = aStr.length;
  var result = 0;
  var shift = 0;
  var continuation, digit;

  do {
    if (aIndex >= strLen) {
      throw new Error("Expected more digits in base 64 VLQ value.");
    }

    digit = base64.decode(aStr.charCodeAt(aIndex++));
    if (digit === -1) {
      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
    }

    continuation = !!(digit & VLQ_CONTINUATION_BIT);
    digit &= VLQ_BASE_MASK;
    result = result + (digit << shift);
    shift += VLQ_BASE_SHIFT;
  } while (continuation);

  aOutParam.value = fromVLQSigned(result);
  aOutParam.rest = aIndex;
};

var base64Vlq = {
	encode: encode$1,
	decode: decode$2
};

function createCommonjsModule(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    }
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var util = createCommonjsModule(function (module, exports) {
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * This is a helper function for getting values from parameter/options
 * objects.
 *
 * @param args The object we are extracting values from
 * @param name The name of the property we are getting.
 * @param defaultValue An optional value to return if the property is missing
 * from the object. If this is not specified and the property is missing, an
 * error will be thrown.
 */
function getArg(aArgs, aName, aDefaultValue) {
  if (aName in aArgs) {
    return aArgs[aName];
  } else if (arguments.length === 3) {
    return aDefaultValue;
  } else {
    throw new Error('"' + aName + '" is a required argument.');
  }
}
exports.getArg = getArg;

var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
var dataUrlRegexp = /^data:.+\,.+$/;

function urlParse(aUrl) {
  var match = aUrl.match(urlRegexp);
  if (!match) {
    return null;
  }
  return {
    scheme: match[1],
    auth: match[2],
    host: match[3],
    port: match[4],
    path: match[5]
  };
}
exports.urlParse = urlParse;

function urlGenerate(aParsedUrl) {
  var url = '';
  if (aParsedUrl.scheme) {
    url += aParsedUrl.scheme + ':';
  }
  url += '//';
  if (aParsedUrl.auth) {
    url += aParsedUrl.auth + '@';
  }
  if (aParsedUrl.host) {
    url += aParsedUrl.host;
  }
  if (aParsedUrl.port) {
    url += ":" + aParsedUrl.port;
  }
  if (aParsedUrl.path) {
    url += aParsedUrl.path;
  }
  return url;
}
exports.urlGenerate = urlGenerate;

/**
 * Normalizes a path, or the path portion of a URL:
 *
 * - Replaces consecutive slashes with one slash.
 * - Removes unnecessary '.' parts.
 * - Removes unnecessary '<dir>/..' parts.
 *
 * Based on code in the Node.js 'path' core module.
 *
 * @param aPath The path or url to normalize.
 */
function normalize(aPath) {
  var path = aPath;
  var url = urlParse(aPath);
  if (url) {
    if (!url.path) {
      return aPath;
    }
    path = url.path;
  }
  var isAbsolute = exports.isAbsolute(path);

  var parts = path.split(/\/+/);
  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
    part = parts[i];
    if (part === '.') {
      parts.splice(i, 1);
    } else if (part === '..') {
      up++;
    } else if (up > 0) {
      if (part === '') {
        // The first part is blank if the path is absolute. Trying to go
        // above the root is a no-op. Therefore we can remove all '..' parts
        // directly after the root.
        parts.splice(i + 1, up);
        up = 0;
      } else {
        parts.splice(i, 2);
        up--;
      }
    }
  }
  path = parts.join('/');

  if (path === '') {
    path = isAbsolute ? '/' : '.';
  }

  if (url) {
    url.path = path;
    return urlGenerate(url);
  }
  return path;
}
exports.normalize = normalize;

/**
 * Joins two paths/URLs.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be joined with the root.
 *
 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
 *   first.
 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
 *   is updated with the result and aRoot is returned. Otherwise the result
 *   is returned.
 *   - If aPath is absolute, the result is aPath.
 *   - Otherwise the two paths are joined with a slash.
 * - Joining for example 'http://' and 'www.example.com' is also supported.
 */
function join(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }
  if (aPath === "") {
    aPath = ".";
  }
  var aPathUrl = urlParse(aPath);
  var aRootUrl = urlParse(aRoot);
  if (aRootUrl) {
    aRoot = aRootUrl.path || '/';
  }

  // `join(foo, '//www.example.org')`
  if (aPathUrl && !aPathUrl.scheme) {
    if (aRootUrl) {
      aPathUrl.scheme = aRootUrl.scheme;
    }
    return urlGenerate(aPathUrl);
  }

  if (aPathUrl || aPath.match(dataUrlRegexp)) {
    return aPath;
  }

  // `join('http://', 'www.example.com')`
  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
    aRootUrl.host = aPath;
    return urlGenerate(aRootUrl);
  }

  var joined = aPath.charAt(0) === '/'
    ? aPath
    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

  if (aRootUrl) {
    aRootUrl.path = joined;
    return urlGenerate(aRootUrl);
  }
  return joined;
}
exports.join = join;

exports.isAbsolute = function (aPath) {
  return aPath.charAt(0) === '/' || urlRegexp.test(aPath);
};

/**
 * Make a path relative to a URL or another path.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be made relative to aRoot.
 */
function relative(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }

  aRoot = aRoot.replace(/\/$/, '');

  // It is possible for the path to be above the root. In this case, simply
  // checking whether the root is a prefix of the path won't work. Instead, we
  // need to remove components from the root one by one, until either we find
  // a prefix that fits, or we run out of components to remove.
  var level = 0;
  while (aPath.indexOf(aRoot + '/') !== 0) {
    var index = aRoot.lastIndexOf("/");
    if (index < 0) {
      return aPath;
    }

    // If the only part of the root that is left is the scheme (i.e. http://,
    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
    // have exhausted all components, so the path is not relative to the root.
    aRoot = aRoot.slice(0, index);
    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
      return aPath;
    }

    ++level;
  }

  // Make sure we add a "../" for each component we removed from the root.
  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
}
exports.relative = relative;

var supportsNullProto = (function () {
  var obj = Object.create(null);
  return !('__proto__' in obj);
}());

function identity (s) {
  return s;
}

/**
 * Because behavior goes wacky when you set `__proto__` on objects, we
 * have to prefix all the strings in our set with an arbitrary character.
 *
 * See https://github.com/mozilla/source-map/pull/31 and
 * https://github.com/mozilla/source-map/issues/30
 *
 * @param String aStr
 */
function toSetString(aStr) {
  if (isProtoString(aStr)) {
    return '$' + aStr;
  }

  return aStr;
}
exports.toSetString = supportsNullProto ? identity : toSetString;

function fromSetString(aStr) {
  if (isProtoString(aStr)) {
    return aStr.slice(1);
  }

  return aStr;
}
exports.fromSetString = supportsNullProto ? identity : fromSetString;

function isProtoString(s) {
  if (!s) {
    return false;
  }

  var length = s.length;

  if (length < 9 /* "__proto__".length */) {
    return false;
  }

  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
      s.charCodeAt(length - 9) !== 95  /* '_' */) {
    return false;
  }

  for (var i = length - 10; i >= 0; i--) {
    if (s.charCodeAt(i) !== 36 /* '$' */) {
      return false;
    }
  }

  return true;
}

/**
 * Comparator between two mappings where the original positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same original source/line/column, but different generated
 * line and column the same. Useful when searching for a mapping with a
 * stubbed out mapping.
 */
function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
  var cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0 || onlyCompareOriginal) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByOriginalPositions = compareByOriginalPositions;

/**
 * Comparator between two mappings with deflated source and name indices where
 * the generated positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same generated line and column, but different
 * source/name/original line and column the same. Useful when searching for a
 * mapping with a stubbed out mapping.
 */
function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0 || onlyCompareGenerated) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

function strcmp(aStr1, aStr2) {
  if (aStr1 === aStr2) {
    return 0;
  }

  if (aStr1 === null) {
    return 1; // aStr2 !== null
  }

  if (aStr2 === null) {
    return -1; // aStr1 !== null
  }

  if (aStr1 > aStr2) {
    return 1;
  }

  return -1;
}

/**
 * Comparator between two mappings with inflated source and name strings where
 * the generated positions are compared.
 */
function compareByGeneratedPositionsInflated(mappingA, mappingB) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

/**
 * Strip any JSON XSSI avoidance prefix from the string (as documented
 * in the source maps specification), and then parse the string as
 * JSON.
 */
function parseSourceMapInput(str) {
  return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
}
exports.parseSourceMapInput = parseSourceMapInput;

/**
 * Compute the URL of a source given the the source root, the source's
 * URL, and the source map's URL.
 */
function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
  sourceURL = sourceURL || '';

  if (sourceRoot) {
    // This follows what Chrome does.
    if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
      sourceRoot += '/';
    }
    // The spec says:
    //   Line 4: An optional source root, useful for relocating source
    //   files on a server or removing repeated values in the
    //   “sources” entry.  This value is prepended to the individual
    //   entries in the “source” field.
    sourceURL = sourceRoot + sourceURL;
  }

  // Historically, SourceMapConsumer did not take the sourceMapURL as
  // a parameter.  This mode is still somewhat supported, which is why
  // this code block is conditional.  However, it's preferable to pass
  // the source map URL to SourceMapConsumer, so that this function
  // can implement the source URL resolution algorithm as outlined in
  // the spec.  This block is basically the equivalent of:
  //    new URL(sourceURL, sourceMapURL).toString()
  // ... except it avoids using URL, which wasn't available in the
  // older releases of node still supported by this library.
  //
  // The spec says:
  //   If the sources are not absolute URLs after prepending of the
  //   “sourceRoot”, the sources are resolved relative to the
  //   SourceMap (like resolving script src in a html document).
  if (sourceMapURL) {
    var parsed = urlParse(sourceMapURL);
    if (!parsed) {
      throw new Error("sourceMapURL could not be parsed");
    }
    if (parsed.path) {
      // Strip the last path component, but keep the "/".
      var index = parsed.path.lastIndexOf('/');
      if (index >= 0) {
        parsed.path = parsed.path.substring(0, index + 1);
      }
    }
    sourceURL = join(urlGenerate(parsed), sourceURL);
  }

  return normalize(sourceURL);
}
exports.computeSourceURL = computeSourceURL;
});

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */


var has = Object.prototype.hasOwnProperty;
var hasNativeMap = typeof Map !== "undefined";

/**
 * A data structure which is a combination of an array and a set. Adding a new
 * member is O(1), testing for membership is O(1), and finding the index of an
 * element is O(1). Removing elements from the set is not supported. Only
 * strings are supported for membership.
 */
function ArraySet() {
  this._array = [];
  this._set = hasNativeMap ? new Map() : Object.create(null);
}

/**
 * Static method for creating ArraySet instances from an existing array.
 */
ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
  var set = new ArraySet();
  for (var i = 0, len = aArray.length; i < len; i++) {
    set.add(aArray[i], aAllowDuplicates);
  }
  return set;
};

/**
 * Return how many unique items are in this ArraySet. If duplicates have been
 * added, than those do not count towards the size.
 *
 * @returns Number
 */
ArraySet.prototype.size = function ArraySet_size() {
  return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
};

/**
 * Add the given string to this set.
 *
 * @param String aStr
 */
ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
  var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
  var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
  var idx = this._array.length;
  if (!isDuplicate || aAllowDuplicates) {
    this._array.push(aStr);
  }
  if (!isDuplicate) {
    if (hasNativeMap) {
      this._set.set(aStr, idx);
    } else {
      this._set[sStr] = idx;
    }
  }
};

/**
 * Is the given string a member of this set?
 *
 * @param String aStr
 */
ArraySet.prototype.has = function ArraySet_has(aStr) {
  if (hasNativeMap) {
    return this._set.has(aStr);
  } else {
    var sStr = util.toSetString(aStr);
    return has.call(this._set, sStr);
  }
};

/**
 * What is the index of the given string in the array?
 *
 * @param String aStr
 */
ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
  if (hasNativeMap) {
    var idx = this._set.get(aStr);
    if (idx >= 0) {
        return idx;
    }
  } else {
    var sStr = util.toSetString(aStr);
    if (has.call(this._set, sStr)) {
      return this._set[sStr];
    }
  }

  throw new Error('"' + aStr + '" is not in the set.');
};

/**
 * What is the element at the given index?
 *
 * @param Number aIdx
 */
ArraySet.prototype.at = function ArraySet_at(aIdx) {
  if (aIdx >= 0 && aIdx < this._array.length) {
    return this._array[aIdx];
  }
  throw new Error('No element indexed by ' + aIdx);
};

/**
 * Returns the array representation of this set (which has the proper indices
 * indicated by indexOf). Note that this is a copy of the internal array used
 * for storing the members so that no one can mess with internal state.
 */
ArraySet.prototype.toArray = function ArraySet_toArray() {
  return this._array.slice();
};

var ArraySet_1 = ArraySet;

var arraySet = {
	ArraySet: ArraySet_1
};

var binarySearch = createCommonjsModule(function (module, exports) {
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

exports.GREATEST_LOWER_BOUND = 1;
exports.LEAST_UPPER_BOUND = 2;

/**
 * Recursive implementation of binary search.
 *
 * @param aLow Indices here and lower do not contain the needle.
 * @param aHigh Indices here and higher do not contain the needle.
 * @param aNeedle The element being searched for.
 * @param aHaystack The non-empty array being searched.
 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 */
function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
  // This function terminates when one of the following is true:
  //
  //   1. We find the exact element we are looking for.
  //
  //   2. We did not find the exact element, but we can return the index of
  //      the next-closest element.
  //
  //   3. We did not find the exact element, and there is no next-closest
  //      element than the one we are searching for, so we return -1.
  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
  var cmp = aCompare(aNeedle, aHaystack[mid], true);
  if (cmp === 0) {
    // Found the element we are looking for.
    return mid;
  }
  else if (cmp > 0) {
    // Our needle is greater than aHaystack[mid].
    if (aHigh - mid > 1) {
      // The element is in the upper half.
      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
    }

    // The exact needle element was not found in this haystack. Determine if
    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return aHigh < aHaystack.length ? aHigh : -1;
    } else {
      return mid;
    }
  }
  else {
    // Our needle is less than aHaystack[mid].
    if (mid - aLow > 1) {
      // The element is in the lower half.
      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
    }

    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return mid;
    } else {
      return aLow < 0 ? -1 : aLow;
    }
  }
}

/**
 * This is an implementation of binary search which will always try and return
 * the index of the closest element if there is no exact hit. This is because
 * mappings between original and generated line/col pairs are single points,
 * and there is an implicit region between each of them, so a miss just means
 * that you aren't on the very start of a region.
 *
 * @param aNeedle The element you are looking for.
 * @param aHaystack The array that is being searched.
 * @param aCompare A function which takes the needle and an element in the
 *     array and returns -1, 0, or 1 depending on whether the needle is less
 *     than, equal to, or greater than the element, respectively.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
 */
exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
  if (aHaystack.length === 0) {
    return -1;
  }

  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
  if (index < 0) {
    return -1;
  }

  // We have found either the exact element, or the next-closest element than
  // the one we are searching for. However, there may be more than one such
  // element. Make sure we always return the smallest of these.
  while (index - 1 >= 0) {
    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
      break;
    }
    --index;
  }

  return index;
};
});

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// It turns out that some (most?) JavaScript engines don't self-host
// `Array.prototype.sort`. This makes sense because C++ will likely remain
// faster than JS when doing raw CPU-intensive sorting. However, when using a
// custom comparator function, calling back and forth between the VM's C++ and
// JIT'd JS is rather slow *and* loses JIT type information, resulting in
// worse generated code for the comparator function than would be optimal. In
// fact, when sorting with a comparator, these costs outweigh the benefits of
// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
// a ~3500ms mean speed-up in `bench/bench.html`.

/**
 * Swap the elements indexed by `x` and `y` in the array `ary`.
 *
 * @param {Array} ary
 *        The array.
 * @param {Number} x
 *        The index of the first item.
 * @param {Number} y
 *        The index of the second item.
 */
function swap(ary, x, y) {
  var temp = ary[x];
  ary[x] = ary[y];
  ary[y] = temp;
}

/**
 * Returns a random integer within the range `low .. high` inclusive.
 *
 * @param {Number} low
 *        The lower bound on the range.
 * @param {Number} high
 *        The upper bound on the range.
 */
function randomIntInRange(low, high) {
  return Math.round(low + (Math.random() * (high - low)));
}

/**
 * The Quick Sort algorithm.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 * @param {Number} p
 *        Start index of the array
 * @param {Number} r
 *        End index of the array
 */
function doQuickSort(ary, comparator, p, r) {
  // If our lower bound is less than our upper bound, we (1) partition the
  // array into two pieces and (2) recurse on each half. If it is not, this is
  // the empty array and our base case.

  if (p < r) {
    // (1) Partitioning.
    //
    // The partitioning chooses a pivot between `p` and `r` and moves all
    // elements that are less than or equal to the pivot to the before it, and
    // all the elements that are greater than it after it. The effect is that
    // once partition is done, the pivot is in the exact place it will be when
    // the array is put in sorted order, and it will not need to be moved
    // again. This runs in O(n) time.

    // Always choose a random pivot so that an input array which is reverse
    // sorted does not cause O(n^2) running time.
    var pivotIndex = randomIntInRange(p, r);
    var i = p - 1;

    swap(ary, pivotIndex, r);
    var pivot = ary[r];

    // Immediately after `j` is incremented in this loop, the following hold
    // true:
    //
    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
    //
    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
    for (var j = p; j < r; j++) {
      if (comparator(ary[j], pivot) <= 0) {
        i += 1;
        swap(ary, i, j);
      }
    }

    swap(ary, i + 1, j);
    var q = i + 1;

    // (2) Recurse on each half.

    doQuickSort(ary, comparator, p, q - 1);
    doQuickSort(ary, comparator, q + 1, r);
  }
}

/**
 * Sort the given array in-place with the given comparator function.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 */
var quickSort_1 = function (ary, comparator) {
  doQuickSort(ary, comparator, 0, ary.length - 1);
};

var quickSort = {
	quickSort: quickSort_1
};

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */



var ArraySet$1 = arraySet.ArraySet;

var quickSort$1 = quickSort.quickSort;

function SourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  return sourceMap.sections != null
    ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
    : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
}

SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
  return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
};

/**
 * The version of the source mapping spec that we are consuming.
 */
SourceMapConsumer.prototype._version = 3;

// `__generatedMappings` and `__originalMappings` are arrays that hold the
// parsed mapping coordinates from the source map's "mappings" attribute. They
// are lazily instantiated, accessed via the `_generatedMappings` and
// `_originalMappings` getters respectively, and we only parse the mappings
// and create these arrays once queried for a source location. We jump through
// these hoops because there can be many thousands of mappings, and parsing
// them is expensive, so we only want to do it if we must.
//
// Each object in the arrays is of the form:
//
//     {
//       generatedLine: The line number in the generated code,
//       generatedColumn: The column number in the generated code,
//       source: The path to the original source file that generated this
//               chunk of code,
//       originalLine: The line number in the original source that
//                     corresponds to this chunk of generated code,
//       originalColumn: The column number in the original source that
//                       corresponds to this chunk of generated code,
//       name: The name of the original symbol which generated this chunk of
//             code.
//     }
//
// All properties except for `generatedLine` and `generatedColumn` can be
// `null`.
//
// `_generatedMappings` is ordered by the generated positions.
//
// `_originalMappings` is ordered by the original positions.

SourceMapConsumer.prototype.__generatedMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__generatedMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__generatedMappings;
  }
});

SourceMapConsumer.prototype.__originalMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__originalMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__originalMappings;
  }
});

SourceMapConsumer.prototype._charIsMappingSeparator =
  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
SourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };

SourceMapConsumer.GENERATED_ORDER = 1;
SourceMapConsumer.ORIGINAL_ORDER = 2;

SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
SourceMapConsumer.LEAST_UPPER_BOUND = 2;

/**
 * Iterate over each mapping between an original source/line/column and a
 * generated line/column in this source map.
 *
 * @param Function aCallback
 *        The function that is called with each mapping.
 * @param Object aContext
 *        Optional. If specified, this object will be the value of `this` every
 *        time that `aCallback` is called.
 * @param aOrder
 *        Either `SourceMapConsumer.GENERATED_ORDER` or
 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
 *        iterate over the mappings sorted by the generated file's line/column
 *        order or the original's source/line/column order, respectively. Defaults to
 *        `SourceMapConsumer.GENERATED_ORDER`.
 */
SourceMapConsumer.prototype.eachMapping =
  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

    var mappings;
    switch (order) {
    case SourceMapConsumer.GENERATED_ORDER:
      mappings = this._generatedMappings;
      break;
    case SourceMapConsumer.ORIGINAL_ORDER:
      mappings = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
    }

    var sourceRoot = this.sourceRoot;
    mappings.map(function (mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
      return {
        source: source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };

/**
 * Returns all generated line and column information for the original source,
 * line, and column provided. If no column is provided, returns all mappings
 * corresponding to a either the line we are searching for or the next
 * closest line that has any mappings. Otherwise, returns all mappings
 * corresponding to the given line and either the column we are searching for
 * or the next closest column that has any offsets.
 *
 * The only argument is an object with the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number is 1-based.
 *   - column: Optional. the column number in the original source.
 *    The column number is 0-based.
 *
 * and an array of objects is returned, each with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *    line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *    The column number is 0-based.
 */
SourceMapConsumer.prototype.allGeneratedPositionsFor =
  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util.getArg(aArgs, 'line');

    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
    // returns the index of the closest mapping less than the needle. By
    // setting needle.originalColumn to 0, we thus find the last mapping for
    // the given line, provided such a mapping exists.
    var needle = {
      source: util.getArg(aArgs, 'source'),
      originalLine: line,
      originalColumn: util.getArg(aArgs, 'column', 0)
    };

    needle.source = this._findSourceIndex(needle.source);
    if (needle.source < 0) {
      return [];
    }

    var mappings = [];

    var index = this._findMapping(needle,
                                  this._originalMappings,
                                  "originalLine",
                                  "originalColumn",
                                  util.compareByOriginalPositions,
                                  binarySearch.LEAST_UPPER_BOUND);
    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (aArgs.column === undefined) {
        var originalLine = mapping.originalLine;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we found. Since
        // mappings are sorted, this is guaranteed to find all mappings for
        // the line we found.
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we were searching for.
        // Since mappings are sorted, this is guaranteed to find all mappings for
        // the line we are searching for.
        while (mapping &&
               mapping.originalLine === line &&
               mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      }
    }

    return mappings;
  };

var SourceMapConsumer_1 = SourceMapConsumer;

/**
 * A BasicSourceMapConsumer instance represents a parsed source map which we can
 * query for information about the original file positions by giving it a file
 * position in the generated source.
 *
 * The first parameter is the raw source map (either as a JSON string, or
 * already parsed to an object). According to the spec, source maps have the
 * following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - sources: An array of URLs to the original source files.
 *   - names: An array of identifiers which can be referrenced by individual mappings.
 *   - sourceRoot: Optional. The URL root from which all sources are relative.
 *   - sourcesContent: Optional. An array of contents of the original source files.
 *   - mappings: A string of base64 VLQs which contain the actual mappings.
 *   - file: Optional. The generated file this source map is associated with.
 *
 * Here is an example source map, taken from the source map spec[0]:
 *
 *     {
 *       version : 3,
 *       file: "out.js",
 *       sourceRoot : "",
 *       sources: ["foo.js", "bar.js"],
 *       names: ["src", "maps", "are", "fun"],
 *       mappings: "AA,AB;;ABCDE;"
 *     }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
 */
function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  var version = util.getArg(sourceMap, 'version');
  var sources = util.getArg(sourceMap, 'sources');
  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
  // requires the array) to play nice here.
  var names = util.getArg(sourceMap, 'names', []);
  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
  var mappings = util.getArg(sourceMap, 'mappings');
  var file = util.getArg(sourceMap, 'file', null);

  // Once again, Sass deviates from the spec and supplies the version as a
  // string rather than a number, so we use loose equality checking here.
  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  if (sourceRoot) {
    sourceRoot = util.normalize(sourceRoot);
  }

  sources = sources
    .map(String)
    // Some source maps produce relative source paths like "./foo.js" instead of
    // "foo.js".  Normalize these first so that future comparisons will succeed.
    // See bugzil.la/1090768.
    .map(util.normalize)
    // Always ensure that absolute sources are internally stored relative to
    // the source root, if the source root is absolute. Not doing this would
    // be particularly problematic when the source root is a prefix of the
    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
    .map(function (source) {
      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
        ? util.relative(sourceRoot, source)
        : source;
    });

  // Pass `true` below to allow duplicate names and sources. While source maps
  // are intended to be compressed and deduplicated, the TypeScript compiler
  // sometimes generates source maps with duplicates in them. See Github issue
  // #72 and bugzil.la/889492.
  this._names = ArraySet$1.fromArray(names.map(String), true);
  this._sources = ArraySet$1.fromArray(sources, true);

  this._absoluteSources = this._sources.toArray().map(function (s) {
    return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
  });

  this.sourceRoot = sourceRoot;
  this.sourcesContent = sourcesContent;
  this._mappings = mappings;
  this._sourceMapURL = aSourceMapURL;
  this.file = file;
}

BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

/**
 * Utility function to find the index of a source.  Returns -1 if not
 * found.
 */
BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
  var relativeSource = aSource;
  if (this.sourceRoot != null) {
    relativeSource = util.relative(this.sourceRoot, relativeSource);
  }

  if (this._sources.has(relativeSource)) {
    return this._sources.indexOf(relativeSource);
  }

  // Maybe aSource is an absolute URL as returned by |sources|.  In
  // this case we can't simply undo the transform.
  var i;
  for (i = 0; i < this._absoluteSources.length; ++i) {
    if (this._absoluteSources[i] == aSource) {
      return i;
    }
  }

  return -1;
};

/**
 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
 *
 * @param SourceMapGenerator aSourceMap
 *        The source map that will be consumed.
 * @param String aSourceMapURL
 *        The URL at which the source map can be found (optional)
 * @returns BasicSourceMapConsumer
 */
BasicSourceMapConsumer.fromSourceMap =
  function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);

    var names = smc._names = ArraySet$1.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet$1.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                            smc.sourceRoot);
    smc.file = aSourceMap._file;
    smc._sourceMapURL = aSourceMapURL;
    smc._absoluteSources = smc._sources.toArray().map(function (s) {
      return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
    });

    // Because we are modifying the entries (by converting string sources and
    // names to indices into the sources and names ArraySets), we have to make
    // a copy of the entry or else bad things happen. Shared mutable state
    // strikes again! See github issue #191.

    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];

    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping;
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;

      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;

        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }

        destOriginalMappings.push(destMapping);
      }

      destGeneratedMappings.push(destMapping);
    }

    quickSort$1(smc.__originalMappings, util.compareByOriginalPositions);

    return smc;
  };

/**
 * The version of the source mapping spec that we are consuming.
 */
BasicSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
  get: function () {
    return this._absoluteSources.slice();
  }
});

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
BasicSourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;

    while (index < length) {
      if (aStr.charAt(index) === ';') {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      }
      else if (aStr.charAt(index) === ',') {
        index++;
      }
      else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;

        // Because each offset is encoded relative to the previous one,
        // many segments often have the same encoding. We can exploit this
        // fact by caching the parsed variable length fields of each segment,
        // allowing us to avoid a second parse if we encounter the same
        // segment again.
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);

        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64Vlq.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }

          if (segment.length === 2) {
            throw new Error('Found a source, but no line and column');
          }

          if (segment.length === 3) {
            throw new Error('Found a source and line, but no column');
          }

          cachedSegments[str] = segment;
        }

        // Generated column.
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;

        if (segment.length > 1) {
          // Original source.
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];

          // Original line.
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          // Lines are stored 0-based
          mapping.originalLine += 1;

          // Original column.
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;

          if (segment.length > 4) {
            // Original name.
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }

        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === 'number') {
          originalMappings.push(mapping);
        }
      }
    }

    quickSort$1(generatedMappings, util.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;

    quickSort$1(originalMappings, util.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };

/**
 * Find the mapping that best matches the hypothetical "needle" mapping that
 * we are searching for in the given "haystack" of mappings.
 */
BasicSourceMapConsumer.prototype._findMapping =
  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                         aColumnName, aComparator, aBias) {
    // To return the position we are searching for, we must first find the
    // mapping for the given position and then return the opposite position it
    // points to. Because the mappings are sorted, we can use binary search to
    // find the best mapping.

    if (aNeedle[aLineName] <= 0) {
      throw new TypeError('Line must be greater than or equal to 1, got '
                          + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError('Column must be greater than or equal to 0, got '
                          + aNeedle[aColumnName]);
    }

    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
  };

/**
 * Compute the last column for each generated mapping. The last column is
 * inclusive.
 */
BasicSourceMapConsumer.prototype.computeColumnSpans =
  function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];

      // Mappings do not contain a field for the last generated columnt. We
      // can come up with an optimistic estimate, however, by assuming that
      // mappings are contiguous (i.e. given two consecutive mappings, the
      // first mapping ends where the second one starts).
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];

        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }

      // The last mapping for each line spans the entire line.
      mapping.lastGeneratedColumn = Infinity;
    }
  };

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
BasicSourceMapConsumer.prototype.originalPositionFor =
  function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      util.compareByGeneratedPositionsDeflated,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._generatedMappings[index];

      if (mapping.generatedLine === needle.generatedLine) {
        var source = util.getArg(mapping, 'source', null);
        if (source !== null) {
          source = this._sources.at(source);
          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
        }
        var name = util.getArg(mapping, 'name', null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source: source,
          line: util.getArg(mapping, 'originalLine', null),
          column: util.getArg(mapping, 'originalColumn', null),
          name: name
        };
      }
    }

    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
  function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() &&
      !this.sourcesContent.some(function (sc) { return sc == null; });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
BasicSourceMapConsumer.prototype.sourceContentFor =
  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }

    var index = this._findSourceIndex(aSource);
    if (index >= 0) {
      return this.sourcesContent[index];
    }

    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util.relative(this.sourceRoot, relativeSource);
    }

    var url;
    if (this.sourceRoot != null
        && (url = util.urlParse(this.sourceRoot))) {
      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
      // many users. We can help them out when they expect file:// URIs to
      // behave like it would if they were running a local HTTP server. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
      if (url.scheme == "file"
          && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
      }

      if ((!url.path || url.path == "/")
          && this._sources.has("/" + relativeSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
      }
    }

    // This function is used recursively from
    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
    // don't want to throw if we can't find the source - we just want to
    // return null, so we provide a flag to exit gracefully.
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
BasicSourceMapConsumer.prototype.generatedPositionFor =
  function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util.getArg(aArgs, 'source');
    source = this._findSourceIndex(source);
    if (source < 0) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }

    var needle = {
      source: source,
      originalLine: util.getArg(aArgs, 'line'),
      originalColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util.compareByOriginalPositions,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (mapping.source === needle.source) {
        return {
          line: util.getArg(mapping, 'generatedLine', null),
          column: util.getArg(mapping, 'generatedColumn', null),
          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
        };
      }
    }

    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };

var BasicSourceMapConsumer_1 = BasicSourceMapConsumer;

/**
 * An IndexedSourceMapConsumer instance represents a parsed source map which
 * we can query for information. It differs from BasicSourceMapConsumer in
 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
 * input.
 *
 * The first parameter is a raw source map (either as a JSON string, or already
 * parsed to an object). According to the spec for indexed source maps, they
 * have the following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - file: Optional. The generated file this source map is associated with.
 *   - sections: A list of section definitions.
 *
 * Each value under the "sections" field has two fields:
 *   - offset: The offset into the original specified at which this section
 *       begins to apply, defined as an object with a "line" and "column"
 *       field.
 *   - map: A source map definition. This source map could also be indexed,
 *       but doesn't have to be.
 *
 * Instead of the "map" field, it's also possible to have a "url" field
 * specifying a URL to retrieve a source map from, but that's currently
 * unsupported.
 *
 * Here's an example source map, taken from the source map spec[0], but
 * modified to omit a section which uses the "url" field.
 *
 *  {
 *    version : 3,
 *    file: "app.js",
 *    sections: [{
 *      offset: {line:100, column:10},
 *      map: {
 *        version : 3,
 *        file: "section.js",
 *        sources: ["foo.js", "bar.js"],
 *        names: ["src", "maps", "are", "fun"],
 *        mappings: "AAAA,E;;ABCDE;"
 *      }
 *    }],
 *  }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
 */
function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  var version = util.getArg(sourceMap, 'version');
  var sections = util.getArg(sourceMap, 'sections');

  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  this._sources = new ArraySet$1();
  this._names = new ArraySet$1();

  var lastOffset = {
    line: -1,
    column: 0
  };
  this._sections = sections.map(function (s) {
    if (s.url) {
      // The url field will require support for asynchronicity.
      // See https://github.com/mozilla/source-map/issues/16
      throw new Error('Support for url field in sections not implemented.');
    }
    var offset = util.getArg(s, 'offset');
    var offsetLine = util.getArg(offset, 'line');
    var offsetColumn = util.getArg(offset, 'column');

    if (offsetLine < lastOffset.line ||
        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
      throw new Error('Section offsets must be ordered and non-overlapping.');
    }
    lastOffset = offset;

    return {
      generatedOffset: {
        // The offset fields are 0-based, but we use 1-based indices when
        // encoding/decoding from VLQ.
        generatedLine: offsetLine + 1,
        generatedColumn: offsetColumn + 1
      },
      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)
    }
  });
}

IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

/**
 * The version of the source mapping spec that we are consuming.
 */
IndexedSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
  get: function () {
    var sources = [];
    for (var i = 0; i < this._sections.length; i++) {
      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
        sources.push(this._sections[i].consumer.sources[j]);
      }
    }
    return sources;
  }
});

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
IndexedSourceMapConsumer.prototype.originalPositionFor =
  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    // Find the section containing the generated position we're trying to map
    // to an original position.
    var sectionIndex = binarySearch.search(needle, this._sections,
      function(needle, section) {
        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }

        return (needle.generatedColumn -
                section.generatedOffset.generatedColumn);
      });
    var section = this._sections[sectionIndex];

    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }

    return section.consumer.originalPositionFor({
      line: needle.generatedLine -
        (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn -
        (section.generatedOffset.generatedLine === needle.generatedLine
         ? section.generatedOffset.generatedColumn - 1
         : 0),
      bias: aArgs.bias
    });
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function (s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
IndexedSourceMapConsumer.prototype.sourceContentFor =
  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      var content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based. 
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
IndexedSourceMapConsumer.prototype.generatedPositionFor =
  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      // Only consider this section if the requested source is in the list of
      // sources of the consumer.
      if (section.consumer._findSourceIndex(util.getArg(aArgs, 'source')) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line +
            (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column +
            (section.generatedOffset.generatedLine === generatedPosition.line
             ? section.generatedOffset.generatedColumn - 1
             : 0)
        };
        return ret;
      }
    }

    return {
      line: null,
      column: null
    };
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
IndexedSourceMapConsumer.prototype._parseMappings =
  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];

        var source = section.consumer._sources.at(mapping.source);
        source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
        this._sources.add(source);
        source = this._sources.indexOf(source);

        var name = null;
        if (mapping.name) {
          name = section.consumer._names.at(mapping.name);
          this._names.add(name);
          name = this._names.indexOf(name);
        }

        // The mappings coming from the consumer for the section have
        // generated positions relative to the start of the section, so we
        // need to offset them to be relative to the start of the concatenated
        // generated file.
        var adjustedMapping = {
          source: source,
          generatedLine: mapping.generatedLine +
            (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn +
            (section.generatedOffset.generatedLine === mapping.generatedLine
            ? section.generatedOffset.generatedColumn - 1
            : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: name
        };

        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === 'number') {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }

    quickSort$1(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
    quickSort$1(this.__originalMappings, util.compareByOriginalPositions);
  };

var IndexedSourceMapConsumer_1 = IndexedSourceMapConsumer;

var sourceMapConsumer = {
	SourceMapConsumer: SourceMapConsumer_1,
	BasicSourceMapConsumer: BasicSourceMapConsumer_1,
	IndexedSourceMapConsumer: IndexedSourceMapConsumer_1
};

var SourceMapConsumer$1 = sourceMapConsumer.SourceMapConsumer;

function get_sourcemap_url(contents) {
    const reversed = contents
        .split('\n')
        .reverse()
        .join('\n');
    const match = /\/[/*]#[ \t]+sourceMappingURL=([^\s'"]+?)(?:[ \t]+|$)/gm.exec(reversed);
    if (match)
        return match[1];
    return undefined;
}
const file_cache = new Map();
function get_file_contents(file_path) {
    if (file_cache.has(file_path)) {
        return file_cache.get(file_path);
    }
    try {
        const data = fs__default['default'].readFileSync(file_path, 'utf8');
        file_cache.set(file_path, data);
        return data;
    }
    catch (_a) {
        return undefined;
    }
}
function sourcemap_stacktrace(stack) {
    const replace = (line) => line.replace(/^ {4}at (?:(.+?)\s+\()?(?:(.+?):(\d+)(?::(\d+))?)\)?/, (input, var_name, file_path, line_num, column) => {
        if (!file_path)
            return input;
        const contents = get_file_contents(file_path);
        if (!contents)
            return input;
        const sourcemap_url = get_sourcemap_url(contents);
        if (!sourcemap_url)
            return input;
        let dir = path__default['default'].dirname(file_path);
        let sourcemap_data;
        if (/^data:application\/json[^,]+base64,/.test(sourcemap_url)) {
            const raw_data = sourcemap_url.slice(sourcemap_url.indexOf(',') + 1);
            try {
                sourcemap_data = Buffer.from(raw_data, 'base64').toString();
            }
            catch (_a) {
                return input;
            }
        }
        else {
            const sourcemap_path = path__default['default'].resolve(dir, sourcemap_url);
            const data = get_file_contents(sourcemap_path);
            if (!data)
                return input;
            sourcemap_data = data;
            dir = path__default['default'].dirname(sourcemap_path);
        }
        let raw_sourcemap;
        try {
            raw_sourcemap = JSON.parse(sourcemap_data);
        }
        catch (_b) {
            return input;
        }
        const consumer = new SourceMapConsumer$1(raw_sourcemap);
        const pos = consumer.originalPositionFor({
            line: Number(line_num),
            column: Number(column),
            bias: SourceMapConsumer$1.LEAST_UPPER_BOUND
        });
        if (!pos.source)
            return input;
        const source_path = path__default['default'].resolve(dir, pos.source);
        const source = `${source_path}:${pos.line || 0}:${pos.column || 0}`;
        if (!var_name)
            return `    at ${source}`;
        return `    at ${var_name} (${source})`;
    });
    file_cache.clear();
    return stack
        .split('\n')
        .map(replace)
        .join('\n');
}

function get_page_handler(manifest, session_getter) {
    const get_build_info = (assets => () => assets)(JSON.parse(fs__default['default'].readFileSync(path__default['default'].join(build_dir, 'build.json'), 'utf-8')));
    const template = (str => () => str)(read_template(build_dir));
    const has_service_worker = fs__default['default'].existsSync(path__default['default'].join(build_dir, 'service-worker.js'));
    const { pages, error: error_route } = manifest;
    function bail(res, err) {
        console.error(err);
        const message = 'Internal server error';
        res.statusCode = 500;
        res.end(`<pre>${message}</pre>`);
    }
    function handle_error(req, res, statusCode, error) {
        handle_page({
            pattern: null,
            parts: [
                { name: null, component: { default: error_route } }
            ]
        }, req, res, statusCode, error || 'Unknown error');
    }
    function handle_page(page, req, res, status = 200, error = null) {
        var _a, _b;
        return __awaiter$b(this, void 0, void 0, function* () {
            const is_service_worker_index = req.path === '/service-worker-index.html';
            const build_info = get_build_info();
            res.setHeader('Content-Type', 'text/html');
            // preload main js and css
            // TODO detect other stuff we can preload like fonts?
            let preload_files = Array.isArray(build_info.assets.main) ? build_info.assets.main : [build_info.assets.main];
            if ((_a = build_info === null || build_info === void 0 ? void 0 : build_info.css) === null || _a === void 0 ? void 0 : _a.main) {
                preload_files = preload_files.concat((_b = build_info === null || build_info === void 0 ? void 0 : build_info.css) === null || _b === void 0 ? void 0 : _b.main);
            }
            let es6_preload = false;
            if (build_info.bundler === 'rollup') {
                es6_preload = true;
                const route = page.parts[page.parts.length - 1].file;
                const deps = build_info.dependencies[route];
                if (deps) {
                    preload_files = preload_files.concat(deps);
                }
            }
            else if (!error && !is_service_worker_index) {
                page.parts.forEach(part => {
                    if (!part)
                        return;
                    // using concat because it could be a string or an array. thanks webpack!
                    preload_files = preload_files.concat(build_info.assets[part.name]);
                });
            }
            const link = preload_files
                .filter((v, i, a) => a.indexOf(v) === i) // remove any duplicates
                .filter(file => file && !file.match(/\.map$/)) // exclude source maps
                .map((file) => {
                const as = /\.css$/.test(file) ? 'style' : 'script';
                const rel = es6_preload && as === 'script' ? 'modulepreload' : 'preload';
                return `<${req.baseUrl}/client/${file}>;rel="${rel}";as="${as}"`;
            })
                .join(', ');
            res.setHeader('Link', link);
            let session;
            try {
                session = yield session_getter(req, res);
            }
            catch (err) {
                return bail(res, err);
            }
            let redirect;
            let preload_error;
            const preload_context = {
                redirect: (statusCode, location) => {
                    if (redirect && (redirect.statusCode !== statusCode || redirect.location !== location)) {
                        throw new Error('Conflicting redirects');
                    }
                    location = location.replace(/^\//g, ''); // leading slash (only)
                    redirect = { statusCode, location };
                },
                error: (statusCode, message) => {
                    preload_error = { statusCode, message };
                },
                fetch: (url, opts) => {
                    const protocol = req.socket.encrypted ? 'https' : 'http';
                    const parsed = new Url__default['default'].URL(url, `${protocol}://127.0.0.1:${process.env.PORT}${req.baseUrl ? req.baseUrl + '/' : ''}`);
                    opts = Object.assign({}, opts);
                    const include_credentials = (opts.credentials === 'include' ||
                        opts.credentials !== 'omit' && parsed.origin === `${protocol}://127.0.0.1:${process.env.PORT}`);
                    if (include_credentials) {
                        opts.headers = Object.assign({}, opts.headers);
                        const cookies = Object.assign({}, parse_1(req.headers.cookie || ''), parse_1(opts.headers.cookie || ''));
                        const set_cookie = res.getHeader('Set-Cookie');
                        (Array.isArray(set_cookie) ? set_cookie : [set_cookie]).forEach((s) => {
                            const m = /([^=]+)=([^;]+)/.exec(s);
                            if (m)
                                cookies[m[1]] = m[2];
                        });
                        const str = Object.keys(cookies)
                            .map(key => `${key}=${cookies[key]}`)
                            .join('; ');
                        opts.headers.cookie = str;
                        if (!opts.headers.authorization && req.headers.authorization) {
                            opts.headers.authorization = req.headers.authorization;
                        }
                    }
                    return fetch(parsed.href, opts);
                }
            };
            let preloaded;
            let match;
            let params;
            try {
                const root_preload = manifest.root_comp.preload || (() => { });
                const root_preloaded = root_preload.call(preload_context, {
                    host: req.headers.host,
                    path: req.path,
                    query: req.query,
                    params: {}
                }, session);
                match = error ? null : page.pattern.exec(req.path);
                let toPreload = [root_preloaded];
                if (!is_service_worker_index) {
                    toPreload = toPreload.concat(page.parts.map(part => {
                        if (!part)
                            return null;
                        // the deepest level is used below, to initialise the store
                        params = part.params ? part.params(match) : {};
                        return part.component.preload
                            ? part.component.preload.call(preload_context, {
                                host: req.headers.host,
                                path: req.path,
                                query: req.query,
                                params
                            }, session)
                            : {};
                    }));
                }
                preloaded = yield Promise.all(toPreload);
            }
            catch (err) {
                if (error) {
                    return bail(res, err);
                }
                preload_error = { statusCode: 500, message: err };
                preloaded = []; // appease TypeScript
            }
            try {
                if (redirect) {
                    const location = Url__default['default'].resolve((req.baseUrl || '') + '/', redirect.location);
                    res.statusCode = redirect.statusCode;
                    res.setHeader('Location', location);
                    res.end();
                    return;
                }
                if (preload_error) {
                    if (!error) {
                        handle_error(req, res, preload_error.statusCode, preload_error.message);
                    }
                    else {
                        bail(res, preload_error.message);
                    }
                    return;
                }
                const segments = req.path.split('/').filter(Boolean);
                // TODO make this less confusing
                const layout_segments = [segments[0]];
                let l = 1;
                page.parts.forEach((part, i) => {
                    layout_segments[l] = segments[i + 1];
                    if (!part)
                        return null;
                    l++;
                });
                if (error instanceof Error && error.stack) {
                    error.stack = sourcemap_stacktrace(error.stack);
                }
                const pageContext = {
                    host: req.headers.host,
                    path: req.path,
                    query: req.query,
                    params,
                    error: error
                        ? error instanceof Error
                            ? error
                            : { message: error, name: 'PreloadError' }
                        : null
                };
                const props = {
                    stores: {
                        page: {
                            subscribe: writable(pageContext).subscribe
                        },
                        preloading: {
                            subscribe: writable(null).subscribe
                        },
                        session: writable(session)
                    },
                    segments: layout_segments,
                    status: error ? status : 200,
                    error: pageContext.error,
                    level0: {
                        props: preloaded[0]
                    },
                    level1: {
                        segment: segments[0],
                        props: {}
                    }
                };
                if (!is_service_worker_index) {
                    let level_index = 1;
                    for (let i = 0; i < page.parts.length; i += 1) {
                        const part = page.parts[i];
                        if (!part)
                            continue;
                        props[`level${level_index++}`] = {
                            component: part.component.default,
                            props: preloaded[i + 1] || {},
                            segment: segments[i]
                        };
                    }
                }
                const { html, head, css } = App.render(props);
                const serialized = {
                    preloaded: `[${preloaded.map(data => try_serialize(data, err => {
                        console.error(`Failed to serialize preloaded data to transmit to the client at the /${segments.join('/')} route: ${err.message}`);
                        console.warn('The client will re-render over the server-rendered page fresh instead of continuing where it left off. See https://sapper.svelte.dev/docs#Return_value for more information');
                    })).join(',')}]`,
                    session: session && try_serialize(session, err => {
                        throw new Error(`Failed to serialize session data: ${err.message}`);
                    }),
                    error: error && serialize_error(props.error)
                };
                let script = `__SAPPER__={${[
                    error && `error:${serialized.error},status:${status}`,
                    `baseUrl:"${req.baseUrl}"`,
                    serialized.preloaded && `preloaded:${serialized.preloaded}`,
                    serialized.session && `session:${serialized.session}`
                ].filter(Boolean).join(',')}};`;
                if (has_service_worker) {
                    script += `if('serviceWorker' in navigator)navigator.serviceWorker.register('${req.baseUrl}/service-worker.js');`;
                }
                const file = [].concat(build_info.assets.main).filter(f => f && /\.js$/.test(f))[0];
                const main = `${req.baseUrl}/client/${file}`;
                // users can set a CSP nonce using res.locals.nonce
                const nonce_value = (res.locals && res.locals.nonce) ? res.locals.nonce : '';
                const nonce_attr = nonce_value ? ` nonce="${nonce_value}"` : '';
                if (build_info.bundler === 'rollup') {
                    if (build_info.legacy_assets) {
                        const legacy_main = `${req.baseUrl}/client/legacy/${build_info.legacy_assets.main}`;
                        script += `(function(){try{eval("async function x(){}");var main="${main}"}catch(e){main="${legacy_main}"};var s=document.createElement("script");try{new Function("if(0)import('')")();s.src=main;s.type="module";s.crossOrigin="use-credentials";}catch(e){s.src="${req.baseUrl}/client/shimport@${build_info.shimport}.js";s.setAttribute("data-main",main);}document.head.appendChild(s);}());`;
                    }
                    else {
                        script += `var s=document.createElement("script");try{new Function("if(0)import('')")();s.src="${main}";s.type="module";s.crossOrigin="use-credentials";}catch(e){s.src="${req.baseUrl}/client/shimport@${build_info.shimport}.js";s.setAttribute("data-main","${main}")}document.head.appendChild(s)`;
                    }
                }
                else {
                    script += `</script><script${nonce_attr} src="${main}" defer>`;
                }
                let styles;
                // TODO make this consistent across apps
                // TODO embed build_info in placeholder.ts
                if (build_info.css && build_info.css.main) {
                    const css_chunks = new Set(build_info.css.main);
                    page.parts.forEach(part => {
                        if (!part || !build_info.dependencies)
                            return;
                        const deps_for_part = build_info.dependencies[part.file];
                        if (deps_for_part) {
                            deps_for_part.filter(d => d.endsWith('.css')).forEach(chunk => {
                                css_chunks.add(chunk);
                            });
                        }
                    });
                    styles = Array.from(css_chunks)
                        .map(href => `<link rel="stylesheet" href="client/${href}">`)
                        .join('');
                }
                else {
                    styles = (css && css.code ? `<style${nonce_attr}>${css.code}</style>` : '');
                }
                const body = template()
                    .replace('%sapper.base%', () => `<base href="${req.baseUrl}/">`)
                    .replace('%sapper.scripts%', () => `<script${nonce_attr}>${script}</script>`)
                    .replace('%sapper.html%', () => html)
                    .replace('%sapper.head%', () => head)
                    .replace('%sapper.styles%', () => styles)
                    .replace(/%sapper\.cspnonce%/g, () => nonce_value);
                res.statusCode = status;
                res.end(body);
            }
            catch (err) {
                if (error) {
                    bail(res, err);
                }
                else {
                    handle_error(req, res, 500, err);
                }
            }
        });
    }
    return function find_route(req, res, next) {
        const path = req.path === '/service-worker-index.html' ? '/' : req.path;
        const page = pages.find(page => page.pattern.test(path));
        if (page) {
            handle_page(page, req, res);
        }
        else {
            handle_error(req, res, 404, 'Not found');
        }
    };
}
function read_template(dir = build_dir) {
    return fs__default['default'].readFileSync(`${dir}/template.html`, 'utf-8');
}
function try_serialize(data, fail) {
    try {
        return devalue(data);
    }
    catch (err) {
        if (fail)
            fail(err);
        return null;
    }
}
// Ensure we return something truthy so the client will not re-render the page over the error
function serialize_error(error) {
    if (!error)
        return null;
    let serialized = try_serialize(error);
    if (!serialized) {
        const { name, message, stack } = error;
        serialized = try_serialize({ name, message, stack });
    }
    if (!serialized) {
        serialized = '{}';
    }
    return serialized;
}

function middleware(opts = {}) {
    const { session, ignore } = opts;
    let emitted_basepath = false;
    return compose_handlers(ignore, [
        (req, res, next) => {
            if (req.baseUrl === undefined) {
                let originalUrl = req.originalUrl || req.url;
                if (req.url === '/' && originalUrl[originalUrl.length - 1] !== '/') {
                    originalUrl += '/';
                }
                req.baseUrl = originalUrl
                    ? originalUrl.slice(0, -req.url.length)
                    : '';
            }
            if (!emitted_basepath && process.send) {
                process.send({
                    __sapper__: true,
                    event: 'basepath',
                    basepath: req.baseUrl
                });
                emitted_basepath = true;
            }
            if (req.path === undefined) {
                req.path = req.url.replace(/\?.*/, '');
            }
            next();
        },
        fs__default['default'].existsSync(path__default['default'].join(build_dir, 'service-worker.js')) && serve({
            pathname: '/service-worker.js',
            cache_control: 'no-cache, no-store, must-revalidate'
        }),
        fs__default['default'].existsSync(path__default['default'].join(build_dir, 'service-worker.js.map')) && serve({
            pathname: '/service-worker.js.map',
            cache_control: 'no-cache, no-store, must-revalidate'
        }),
        serve({
            prefix: '/client/',
            cache_control: 'max-age=31536000, immutable'
        }),
        get_server_route_handler(manifest.server_routes),
        get_page_handler(manifest, session || noop$1)
    ].filter(Boolean));
}
function compose_handlers(ignore, handlers) {
    const total = handlers.length;
    function nth_handler(n, req, res, next) {
        if (n >= total) {
            return next();
        }
        handlers[n](req, res, () => nth_handler(n + 1, req, res, next));
    }
    return !ignore
        ? (req, res, next) => nth_handler(0, req, res, next)
        : (req, res, next) => {
            if (should_ignore(req.path, ignore)) {
                next();
            }
            else {
                nth_handler(0, req, res, next);
            }
        };
}
function should_ignore(uri, val) {
    if (Array.isArray(val))
        return val.some(x => should_ignore(uri, x));
    if (val instanceof RegExp)
        return val.test(uri);
    if (typeof val === 'function')
        return val(uri);
    return uri.startsWith(val.charCodeAt(0) === 47 ? val : `/${val}`);
}
function serve({ prefix, pathname, cache_control }) {
    const filter = pathname
        ? (req) => req.path === pathname
        : (req) => req.path.startsWith(prefix);
    const cache = new Map();
    const read = (file) => (cache.has(file) ? cache : cache.set(file, fs__default['default'].readFileSync(path__default['default'].join(build_dir, file)))).get(file);
    return (req, res, next) => {
        if (filter(req)) {
            const type = lite.getType(req.path);
            try {
                const file = path__default['default'].posix.normalize(decodeURIComponent(req.path));
                const data = read(file);
                res.setHeader('Content-Type', type);
                res.setHeader('Cache-Control', cache_control);
                res.end(data);
            }
            catch (err) {
                if (err.code === 'ENOENT') {
                    next();
                }
                else {
                    console.error(err);
                    res.statusCode = 500;
                    res.end('an error occurred while reading a static file from disk');
                }
            }
        }
        else {
            next();
        }
    };
}
function noop$1() { }

class GcpDatastoreInteractor {
    constructor(gcpDatastoreInteractorConfiguration) {
        this.keyPathSeparator = "/";
        if (gcpDatastoreInteractorConfiguration.gcpClientEmail === undefined ||
            gcpDatastoreInteractorConfiguration.gcpPrivateKey === undefined ||
            gcpDatastoreInteractorConfiguration.gcpProjectId === undefined ||
            gcpDatastoreInteractorConfiguration.gcpKindPrefix === undefined)
            throw new Error(`gcpDatastoreInteractorConfiguration bad configuration : ${JSON.stringify(gcpDatastoreInteractorConfiguration)}`);
        const datastoreOptions = {
            projectId: gcpDatastoreInteractorConfiguration.gcpProjectId,
            credentials: {
                client_email: gcpDatastoreInteractorConfiguration.gcpClientEmail,
                private_key: gcpDatastoreInteractorConfiguration.gcpPrivateKey
            }
        };
        this.kindPrefix = gcpDatastoreInteractorConfiguration.gcpKindPrefix;
        this.gcpDatastore = new datastore.Datastore(datastoreOptions);
    }
    queryRecordsOnGoogleDatastore(kind, filters) {
        kind = this.kindPrefix.concat(kind);
        console.log(`⚙️  queryRecordsOnGoogleDatastore - ${kind} `);
        const query = this.gcpDatastore.createQuery(kind);
        filters.forEach(filter => {
            console.log(`⚙️  ${filter.property}${filter.operator}${filter.value}`);
            query.filter(filter.property, filter.operator, filter.value);
        });
        return query.run()
            .then((queryResponse) => {
            const entities = queryResponse[0];
            filters.forEach(filter => { if (filter.value === "ERROR")
                throw new Error(`Filter ${filter.value} Error`); });
            console.log(`✔️  ${entities.length} entities retrieved on kind ${kind} according to filters.`);
            return entities;
        })
            .catch(error => error);
    }
    retreiveRecordOnGoogleDatastore(keyPath) {
        return new Promise((resolve) => {
            const keyPathString = this.kindPrefix.concat(keyPath.join(this.keyPathSeparator));
            console.log(`⚙️  retreiveRecordOnGoogleDatastore - ${keyPathString}`);
            const keyOption = { path: keyPathString.split(this.keyPathSeparator) };
            const key = this.gcpDatastore.key(keyOption);
            this.gcpDatastore.get(key, (error, entity) => {
                if (error) {
                    console.log(`❌ ${error.message}`);
                    resolve(error);
                }
                else if (!entity) {
                    console.log(`⚠️  ${noEntityWithPathErrorMessage(keyPathString)}`);
                    resolve(undefined);
                }
                else {
                    console.log(`✔️  Entity with key path ${keyPathString} retreived from datastore.`);
                    resolve(entity);
                }
            });
        });
    }
    deleteRecordOnGoogleDatastore(keyPath) {
        return new Promise((resolve) => {
            const keyPathString = this.kindPrefix.concat(keyPath.join(this.keyPathSeparator));
            console.log(`⚙️  deleteRecordOnGoogleDatastore - ${keyPathString}`);
            const keyOption = { path: keyPathString.split(this.keyPathSeparator) };
            const key = this.gcpDatastore.key(keyOption);
            this.gcpDatastore.delete(key, (error) => {
                if (error) {
                    console.log(`❌  ${error.message}`);
                    resolve(error);
                }
                else {
                    console.log(`✔️  Entity with key path ${keyPathString} deleted on datastore.`);
                    resolve();
                }
            });
        });
    }
    saveRecordOnGoogleDatastore(keyPath, entity) {
        return new Promise((resolve) => {
            const keyPathString = this.kindPrefix.concat(keyPath.join(this.keyPathSeparator));
            console.log(`⚙️  saveRecordOnGoogleDatastore - ${keyPathString}`);
            const keyOption = { path: keyPathString.split(this.keyPathSeparator) };
            const key = this.gcpDatastore.key(keyOption);
            const callback = (error) => {
                if (error) {
                    console.log(`❌  ${error.message}`);
                    resolve(error);
                }
                else {
                    console.log(`✔️  Entity with key path ${keyPathString} saved on datastore.`);
                    resolve();
                }
            };
            this.gcpDatastore.save({ key, data: entity }, () => callback());
        });
    }
}
const noEntityWithPathErrorMessage = (keyPath) => `No entity with path ${keyPath}`;

class GcpDatastoreBangarangMembersInteractor {
    constructor(gcpDatastoreInteractor) {
        this.gcpDatastoreInteractor = gcpDatastoreInteractor;
    }
    retrieveUserContract(username) {
        if (username === "error")
            return Promise.resolve(new Error(`${username} error:!`));
        return this.gcpDatastoreInteractor.retreiveRecordOnGoogleDatastore(keyPathFromKindAndIdentifier("Users", username))
            .catch(error => error);
    }
    reset() {
        const googleDatastoreKeys = [
            "MembersClaims/testclaimId",
            "Credentials/test",
            "Users/test",
            "SignedIn_Users/test",
        ];
        return Promise.all(googleDatastoreKeys.map(googleDatastoreKey => this.gcpDatastoreInteractor.deleteRecordOnGoogleDatastore(googleDatastoreKey.split("/"))))
            .then(results => {
            const errors = [];
            results.forEach(result => { if (result instanceof Error)
                errors.push(result); });
            if (errors.length > 0)
                throw new Error(`Errors on reset : ${errors.map(error => error.message)}`);
        })
            .catch(error => error);
    }
    isMemberExistWithUsername(username) {
        return this.retrieveUserContract(username)
            .then(result => {
            if (result === undefined)
                return false;
            else if (result instanceof Error)
                return result;
            return true;
        })
            .catch(error => error);
    }
    isSignedIn(username) {
        return this.gcpDatastoreInteractor.retreiveRecordOnGoogleDatastore(keyPathFromKindAndIdentifier("SignedIn_Users", username))
            .then(result => {
            if (!result)
                return false;
            else if (result instanceof Error)
                return result;
            return true;
        })
            .catch(error => error);
    }
    retrievePreviousMemberClaimChoiceOnClaim(username, claimId) {
        return this.gcpDatastoreInteractor.retreiveRecordOnGoogleDatastore(keyPathFromKindAndIdentifier("MembersClaims", username + claimId))
            .then(result => {
            if (!result || result instanceof Error) {
                if (username === "error" && !result)
                    return new Error(`User ${username} Error`);
                return result;
            }
            return result.claimChoice;
        })
            .catch(error => error);
    }
    saveCredentials(credentials) {
        if (credentials.username === "error")
            return Promise.resolve(new Error("Error with error user"));
        return this.gcpDatastoreInteractor.saveRecordOnGoogleDatastore(keyPathFromKindAndIdentifier("Credentials", credentials.username), credentials)
            .catch(error => error);
    }
    saveMember(userContract) {
        if (userContract.username === "error")
            return Promise.resolve(new Error("Error with error user"));
        return this.gcpDatastoreInteractor.saveRecordOnGoogleDatastore(keyPathFromKindAndIdentifier("Users", userContract.username), userContract)
            .catch(error => error);
    }
    saveMemberClaim(memberClaim) {
        if (memberClaim.memberUsername === "error")
            return Promise.resolve(new Error("Error with error user"));
        return this.gcpDatastoreInteractor.saveRecordOnGoogleDatastore(keyPathFromKindAndIdentifier("MembersClaims", memberClaim.memberUsername + memberClaim.claimId), memberClaim)
            .catch(error => error);
    }
    isCredentialsValid(credentials) {
        return this.gcpDatastoreInteractor.retreiveRecordOnGoogleDatastore(keyPathFromKindAndIdentifier("Credentials", credentials.username))
            .then(result => {
            if (result === undefined)
                return false;
            else if (result instanceof Error)
                return result;
            return (result.password === credentials.password) ? true : false;
        })
            .catch(error => error);
    }
}
const keyPathFromKindAndIdentifier = (kind, identifier) => `${kind}/${identifier}`.split("/");

class GcpDatastoreBangarangClaimInteractor {
    constructor(gcpDatastoreInteractor) {
        this.gcpDatastoreInteractor = gcpDatastoreInteractor;
        this.kind = "Claims";
    }
    reset() {
        const googleDatastoreKeys = [
            "Claims/dsolsdfsldfjsdlfjsdflkjjsf",
        ];
        return Promise.all(googleDatastoreKeys.map(googleDatastoreKey => this.gcpDatastoreInteractor.deleteRecordOnGoogleDatastore(googleDatastoreKey.split("/"))))
            .then(results => {
            const errors = [];
            results.forEach(result => { if (result instanceof Error)
                errors.push(result); });
            if (errors.length > 0)
                throw new Error(`Errors on reset : ${errors.map(error => error.message)}`);
        });
    }
    claimById(id) {
        return this.gcpDatastoreInteractor.retreiveRecordOnGoogleDatastore([this.kind, id])
            .then(result => {
            if (result === undefined)
                return new Error(`Claim with id '${id}' missing on database.`);
            if (result instanceof Error)
                return result;
            const claim = {
                id: result.id,
                title: result.title,
                peopleClaimed: result.peopleClaimed,
                peopleClaimedAgainst: result.peopleClaimedAgainst,
                peopleClaimedFor: result.peopleClaimedFor,
                type: result.type
            };
            return claim;
        });
    }
    claimByTitleIncencitiveCase(claimTitle) {
        if (claimTitle.includes("error"))
            return Promise.resolve(new Error("claimTitle includes 'error'."));
        const filters = this.sentenceIntoUniqueWords(claimTitle)
            .map(word => word.toLocaleLowerCase())
            .map(word => ({ property: incensitiveCaseUniqueWordsPropertyName, operator: "=", value: word }));
        return this.gcpDatastoreInteractor.queryRecordsOnGoogleDatastore(this.kind, filters)
            .then(results => {
            if (results instanceof Error)
                throw results;
            const gcpClaim = results.find(results => results.title === claimTitle);
            if (!gcpClaim)
                throw new Error(`No claims found with exact title ${claimTitle}`);
            const claim = {
                id: gcpClaim.id,
                title: gcpClaim.title,
                peopleClaimed: gcpClaim.peopleClaimed,
                peopleClaimedAgainst: gcpClaim.peopleClaimedAgainst,
                peopleClaimedFor: gcpClaim.peopleClaimedFor,
                type: gcpClaim.type
            };
            return claim;
        })
            .catch(error => error);
    }
    isClaimExistByTitleIncensitiveCase(claimTitle) {
        return this.claimByTitleIncencitiveCase(claimTitle)
            .then(result => (!(result instanceof Error)) ?
            true :
            (result.message === `No claims found with exact title ${claimTitle}`) ? false : result)
            .catch(error => error);
    }
    retrieveClaimsThatContainInIncensitiveCaseTitleOneOrMoreIncencitiveCaseSearchCriteriaWords(searchCriteria) {
        if (searchCriteria.includes("error"))
            return Promise.resolve(new Error("Search criteria includes 'error'."));
        return Promise.all(this.sentenceIntoUniqueWords(searchCriteria)
            .map(word => word.toLowerCase())
            .map(word => {
            const filters = [{ property: incensitiveCaseUniqueWordsPropertyName, operator: "=", value: word }];
            return this.gcpDatastoreInteractor.queryRecordsOnGoogleDatastore(this.kind, filters);
        }))
            .then(resultsOfResults => {
            const claims = [];
            const errors = [];
            resultsOfResults.forEach(resultOfResults => {
                if (resultOfResults instanceof Error)
                    errors.push(resultOfResults);
                else
                    resultOfResults.forEach(result => {
                        if (!claims.some(claim => claim.id === result.id))
                            claims.push({
                                id: result.id,
                                title: result.title,
                                peopleClaimed: result.peopleClaimed,
                                peopleClaimedAgainst: result.peopleClaimedAgainst,
                                peopleClaimedFor: result.peopleClaimedFor,
                                type: result.type
                            });
                    });
            });
            if (errors.length > 0)
                throw new Error(`Errors while queryRecordsOnGoogleDatastore: ${errors.map(error => error.message).join(", ")}`);
            return claims;
        })
            .catch(error => error);
    }
    saveClaim(claimToSave) {
        if (claimToSave.title === "error")
            return Promise.resolve(new Error("Error claim not supported."));
        const path = [this.kind, claimToSave.id];
        const GcpClaimContract = {
            id: claimToSave.id,
            type: claimToSave.type,
            title: claimToSave.title,
            peopleClaimed: claimToSave.peopleClaimed,
            peopleClaimedAgainst: claimToSave.peopleClaimedAgainst,
            peopleClaimedFor: claimToSave.peopleClaimedFor,
            incensitiveCaseUniqueWords: this.sentenceIntoUniqueWords(claimToSave.title).map(word => word.toLowerCase())
        };
        return this.gcpDatastoreInteractor.saveRecordOnGoogleDatastore(path, GcpClaimContract);
    }
    sentenceIntoUniqueWords(sentence) {
        const words = sentence.split(/\W+/);
        return words.filter(onlyUnique);
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
    }
}
const incensitiveCaseUniqueWordsPropertyName = "incensitiveCaseUniqueWords";

const SUPPORTED_API_PREFIXES = ['restFakeMemberInteractor', 'restGcpDatastoreMemberInteractor', 'restFakeClaimInteractor', 'restGcpDatastoreClaimInteractor'];
const isApiPrefix = (apiPrefix) => SUPPORTED_API_PREFIXES.includes(apiPrefix);
const apiPrefixFromString = (string) => {
    if (isApiPrefix(string))
        return string;
    throw new Error(`'${string} is not a supported API Prefix.`);
};
const GCP_DATASTORE_PROJECT_ID = "{\"gcpProjectId\":\"bangarang-309019\"}";
const GCP_DATASTORE_CLIENT_EMAIL = "{\"gcpClientEmail\":\"publicdatastore@bangarang-309019.iam.gserviceaccount.com\"}";
const GCP_DATASTORE_PRIVATE_KEY = "{\"gcpPrivateKey\":\"-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDFn4dnGWOcijgC\\nzesWMOgv8wOUn4OM210bI+IQ3Gh1Wl9RtggiWHtKsKU3cumJKj39o1Z2c11J+tJQ\\nw45gxk3HQoZmczJZ5G8KZkZ9RAMsm9rW7HUcxPC+Z2qePlzWEZXBxhkLVgJU20Yb\\n4PrEkpN1Yuf2dfU9RKQWWIf4od8ufrZR5FLymIU/W+smDCjlxaWlcN3N+vNlkF5H\\n4XLeupj3+lqO/fmpxL4OFA2PDlGJuD00aMhJCQ/l1jpO3g7cYA7tjYZXg77ODuLh\\nx3+syQYHiNJpb/pdi5ELtimc4qNdDb+q3oBiFOu5CVUxBfvcUdurM5/MyJdeGz7q\\nvFVe/MMfAgMBAAECggEAMXtfwmNbizMaki0wG0bUpEjjUR/dpvO4LNb/wDwH1bZy\\nnnmHMN5ZxJpVS/x0WBlhGzR+Ljt1lNP+PCWy7S1KBUX1dAqNBXAKk56HMM9KQi2m\\nDmF3c2QmaW5ohkXUJe+SQUoSNEHtZITg2ZMsBvMyg9ZngVEIvjYFJek15n3VbYTw\\n7F1uzl69yk16drQFeZE4C9nGYdoFFK9AoIq5YuBsuZJ/8cRY++vdZc/d39Hwi8WM\\nd+XIPpacgEzahCPVNnmsJgulyAe2YqIQb70G0kA+L8IE5ccpr2K9ahFwvsFpLKTl\\nE/71cLMwIXCaSOWngPg5gYEUelZpbbE/vTvng4JNqQKBgQDrm2km5Wa9QQzT/QrQ\\nG8ue1AjIwnliLpV+f9f/gW8hSe5svLFxB8zJ8kfOr9+1lmiJuPhtp6Bpx4Z5N54P\\nd9GKi6OsLmbXXIEULvWEE7dMkkNKNrGp7t3fvEeNetWTW1ejc7FgdxTqQQsjIdDj\\n3BkRW+ltavLC5umC4ZivPBFMxwKBgQDWungokV7tXT4w1A1BVPffOOePUkfChISl\\npAZk3qqtVq3XPjpc3lSB9JLRAjVlyAyPRhScnaK6nn9C5Y5mviVH0SxWXOpJ8ux2\\ntKtkvBGFydsCBQRKssTc4NdBL4EUD+Awj4HIcTgD1IpjTZZ7mAtif7yM5BpeF/D6\\nHHle/Z0O6QKBgBI6DaJysMYHWES2GLYM0G3THXLaiKVt0SbeIQmlK8G5hHZpCpkh\\n71fYJHH67SWRIzk0VBO3mhNU2jRadyHfNRiwwNK7LD2Q7HNxRpEXLWEBF6+QF6J7\\n1jJO0IJDdG5X7Km6c4hw7e9JZOEs5ooaJt5O6/oJAgrN7lavuS4lSXlVAoGAJPwJ\\nJjOjvg6JX6+meNJBv1j1yWHKql5Y2o7d6xHPI/wCBUjalJRWyetuPkG7IMTMJQFV\\nG4SrOqmCEeuoE1o84ZnNoTJvyDznLasAumEKQ5j49+gVTShtb/3qFXgxK1twqeyN\\n1hBqLX62N1RtzuvpShXmS/4d7IcDIpE09n+IRcECgYEAkdSraAmC250Bjz+WM3p+\\nCpvQAZwy6KQNJBMMjMWWpA8FUTTKeGPuOkv1PB38Vz+e/3GSmPuOvZ5qJutUTmBL\\n16GRsL96lHizJr1RvoN20JYg9Vzo7agIWbk3p2yvCNQi4zLzWhuSMB8bqVcTkiGk\\nV76c6Sphhk93GhOP1g2JDlA=\\n-----END PRIVATE KEY-----\\n\"}";
let GCP_DATASTORE_KIND_PREFIX = process.env.GCP_DATASTORE_KIND_PREFIX;
if (GCP_DATASTORE_KIND_PREFIX === undefined)
    GCP_DATASTORE_KIND_PREFIX = '{"gcpKindPrefix":""}';
const gcpDatastoreInteractorConfiguration = {
    gcpProjectId: JSON.parse(GCP_DATASTORE_PROJECT_ID).gcpProjectId,
    gcpClientEmail: JSON.parse(GCP_DATASTORE_CLIENT_EMAIL).gcpClientEmail,
    gcpPrivateKey: JSON.parse(GCP_DATASTORE_PRIVATE_KEY).gcpPrivateKey,
    gcpKindPrefix: JSON.parse(GCP_DATASTORE_KIND_PREFIX).gcpKindPrefix
};
const gcpDatastoreInteractor = new GcpDatastoreInteractor(gcpDatastoreInteractorConfiguration);
const fakeBangarangMemberInteractor = new FakeBangarangMembersInteractor();
const gcpDatastoreBangarangMembersInteractor = new GcpDatastoreBangarangMembersInteractor(gcpDatastoreInteractor);
const bangarangMembersInteractors = [
    { apiPrefix: "restFakeMemberInteractor", adapter: fakeBangarangMemberInteractor },
    { apiPrefix: "restGcpDatastoreMemberInteractor", adapter: gcpDatastoreBangarangMembersInteractor }
];
const fakeBangarangClaimInteractor$1 = new FakeBangarangClaimInteractor('error');
const gcpDatastoreBangarangClaimInteractor = new GcpDatastoreBangarangClaimInteractor(gcpDatastoreInteractor);
const bangarangClaimInteractors = [
    { apiPrefix: "restFakeClaimInteractor", adapter: fakeBangarangClaimInteractor$1 },
    { apiPrefix: "restGcpDatastoreClaimInteractor", adapter: gcpDatastoreBangarangClaimInteractor }
];
const selectBangarangMemberInteractor = (apiPrefix) => bangarangMembersInteractors.find(interactor => interactor.apiPrefix === apiPrefixFromString(apiPrefix));
const selectBangarangClaimInteractor = (apiPrefix) => bangarangClaimInteractors.find(interactor => interactor.apiPrefix === apiPrefixFromString(apiPrefix));
const apiPrefix = `:apiPrefix`;
const App$1 = express__default['default']();
App$1.use(bodyParser.json(), cors__default['default']());
var BangarangQueryParameters;
(function (BangarangQueryParameters) {
    BangarangQueryParameters["ClaimTitle"] = "claimTitle";
    BangarangQueryParameters["Username"] = "username";
    BangarangQueryParameters["Password"] = "password";
})(BangarangQueryParameters || (BangarangQueryParameters = {}));
const isQueryStringQuery = (query) => typeof query === 'string';
App$1.get(`/${apiPrefix}/claims`, (request, response) => {
    const bangarangClaimInteractor = selectBangarangClaimInteractor(request.params.apiPrefix);
    const sendErrorResponse = (error) => response.status(500).json({ error: error.message });
    if (!bangarangClaimInteractor)
        sendErrorResponse(new Error(`bangarangMemberInteractor undefined`));
    else {
        const params = ["searchCriteria", "claimTitle", "id"];
        const paramFound = params.find(param => request.query[param] !== undefined);
        if (paramFound === undefined)
            sendErrorResponse(new Error(`No query params supported.'`));
        else {
            const query = request.query[paramFound];
            if (!isQueryStringQuery(query))
                sendErrorResponse(new Error(`Query not supported : '${query}'`));
            else {
                const useCaseFromParamFound = (paramFound) => {
                    if (paramFound === "searchCriteria")
                        return bangarangClaimInteractor.adapter.retrieveClaimsThatContainInIncensitiveCaseTitleOneOrMoreIncencitiveCaseSearchCriteriaWords(query);
                    if (paramFound === "claimTitle")
                        return bangarangClaimInteractor.adapter.claimByTitleIncencitiveCase(query);
                    if (paramFound === "id")
                        return bangarangClaimInteractor.adapter.claimById(query);
                    throw new Error("unsupported param");
                };
                return useCaseFromParamFound(paramFound)
                    .then(result => {
                    if (result instanceof Error)
                        throw result;
                    response.end(JSON.stringify(result));
                })
                    .catch((error) => sendErrorResponse(error));
            }
        }
    }
});
App$1.get(`/${apiPrefix}/isClaimExistByTitleUpperCase`, (request, response) => {
    const bangarangClaimInteractor = selectBangarangClaimInteractor(request.params.apiPrefix);
    const sendErrorResponse = (error) => response.status(500).json({ error: error.message });
    if (!bangarangClaimInteractor)
        sendErrorResponse(new Error(`bangarangMemberInteractor undefined`));
    else {
        const query = request.query[BangarangQueryParameters.ClaimTitle];
        if (!isQueryStringQuery(query))
            sendErrorResponse(new Error(`Query not supported : '${query}'`));
        else
            return bangarangClaimInteractor.adapter
                .isClaimExistByTitleIncensitiveCase(query)
                .then(isClaimExistByTitleUpperCase => {
                if (isClaimExistByTitleUpperCase instanceof Error)
                    throw isClaimExistByTitleUpperCase;
                response.end(JSON.stringify({ isClaimExistByTitleUpperCase }));
            })
                .catch((error) => sendErrorResponse(error));
    }
});
App$1.post(`/${apiPrefix}/saveClaim`, (request, response) => {
    const sendErrorResponse = (error) => response.status(500).json({ error: error.message });
    const bangarangClaimInteractor = selectBangarangClaimInteractor(request.params.apiPrefix);
    const body = request.body;
    if (body.type === undefined ||
        body.title === undefined ||
        body.peopleClaimed === undefined ||
        body.peopleClaimedAgainst === undefined ||
        body.peopleClaimedFor === undefined ||
        body.id === undefined)
        sendErrorResponse(new Error("Missing type or title or peopleClaimed or peopleClaimedAgainst or peopleClaimedFor or id on body."));
    else if (!bangarangClaimInteractor)
        sendErrorResponse(new Error(`bangarangMemberInteractor undefined`));
    else
        bangarangClaimInteractor.adapter
            .saveClaim({
            type: body.type,
            title: body.title,
            peopleClaimed: body.peopleClaimed,
            peopleClaimedAgainst: body.peopleClaimedAgainst,
            peopleClaimedFor: body.peopleClaimedFor,
            id: body.id
        })
            .then(result => {
            if (result instanceof Error)
                throw result;
            response.end();
        })
            .catch((error) => sendErrorResponse(error));
});
App$1.get(`/${apiPrefix}/isMemberExistWithUsername/:username`, (request, response) => {
    const bangarangMemberInteractor = selectBangarangMemberInteractor(request.params.apiPrefix);
    const sendErrorResponse = (error) => response.status(500).json({ error: error.message });
    if (!bangarangMemberInteractor)
        sendErrorResponse(new Error(`bangarangMemberInteractor undefined`));
    else
        bangarangMemberInteractor.adapter
            .isMemberExistWithUsername(request.params.username)
            .then(isMemberExistWithUsername => response.end(JSON.stringify({ isMemberExistWithUsername })))
            .catch((error) => sendErrorResponse(error));
});
App$1.get(`/${apiPrefix}/retrievePreviousMemberClaimChoiceOnClaim/:username/:claimTitle`, (request, response) => {
    const bangarangMemberInteractor = selectBangarangMemberInteractor(request.params.apiPrefix);
    const sendErrorResponse = (error) => response.status(500).json({ error: error.message });
    if (!bangarangMemberInteractor)
        sendErrorResponse(new Error(`bangarangMemberInteractor undefined`));
    else
        bangarangMemberInteractor.adapter
            .retrievePreviousMemberClaimChoiceOnClaim(request.params.username, request.params.claimTitle)
            .then(retrievePreviousMemberClaimChoiceOnClaim => {
            if (retrievePreviousMemberClaimChoiceOnClaim instanceof Error)
                throw retrievePreviousMemberClaimChoiceOnClaim;
            response.end(JSON.stringify({ retrievePreviousMemberClaimChoiceOnClaim }));
        })
            .catch((error) => sendErrorResponse(error));
});
App$1.post(`/${apiPrefix}/saveCredentials`, (request, response) => {
    const sendErrorResponse = (error) => response.status(500).json({ error: error.message });
    const bangarangMemberInteractor = selectBangarangMemberInteractor(request.params.apiPrefix);
    const body = request.body;
    if (body.username === undefined || body.password === undefined)
        sendErrorResponse(new Error("Missing username or password on body."));
    else if (!bangarangMemberInteractor)
        sendErrorResponse(new Error(`bangarangMemberInteractor undefined`));
    else
        bangarangMemberInteractor.adapter
            .saveCredentials({ username: body.username, password: body.password })
            .then(result => {
            if (result instanceof Error)
                throw result;
            response.end();
        })
            .catch((error) => sendErrorResponse(error));
});
App$1.post(`/${apiPrefix}/saveMember`, (request, response) => {
    const sendErrorResponse = (error) => response.status(500).json({ error: error.message });
    const bangarangMemberInteractor = selectBangarangMemberInteractor(request.params.apiPrefix);
    const body = request.body;
    if (body.username === undefined || body.fullname === undefined || body.email === undefined)
        sendErrorResponse(new Error("Missing username or fullname or email on body."));
    else if (!bangarangMemberInteractor)
        sendErrorResponse(new Error(`bangarangMemberInteractor undefined`));
    else
        bangarangMemberInteractor.adapter
            .saveMember({ username: body.username, fullname: body.fullname, email: body.email })
            .then(result => {
            if (result instanceof Error)
                throw result;
            response.end();
        })
            .catch((error) => sendErrorResponse(error));
});
App$1.post(`/${apiPrefix}/saveMemberClaim`, (request, response) => {
    const sendErrorResponse = (error) => response.status(500).json({ error: error.message });
    const body = request.body;
    const bangarangMemberInteractor = selectBangarangMemberInteractor(request.params.apiPrefix);
    if (body.claimId === undefined || body.memberUsername === undefined || body.claimChoice === undefined)
        sendErrorResponse(new Error("Missing claimId or memberUsername or claimChoice on body."));
    else if (!bangarangMemberInteractor)
        sendErrorResponse(new Error(`bangarangMemberInteractor undefined`));
    else
        bangarangMemberInteractor.adapter
            .saveMemberClaim({ claimId: body.claimId, memberUsername: body.memberUsername, claimChoice: body.claimChoice })
            .then(result => {
            if (result instanceof Error)
                throw result;
            response.end();
        })
            .catch((error) => sendErrorResponse(error));
});
App$1.post(`/${apiPrefix}/reset`, (request, response) => {
    const sendErrorResponse = (error) => {
        response.status(500).json({ error: error.message });
    };
    if (apiPrefixFromString(request.params.apiPrefix) === "restFakeMemberInteractor") {
        fakeBangarangMemberInteractor
            .reset()
            .then(() => response.end())
            .catch(error => sendErrorResponse(error));
    }
    else if (apiPrefixFromString(request.params.apiPrefix) === "restGcpDatastoreMemberInteractor") {
        gcpDatastoreBangarangMembersInteractor
            .reset()
            .then(() => response.end())
            .catch(error => sendErrorResponse(error));
    }
    else if (apiPrefixFromString(request.params.apiPrefix) === "restFakeClaimInteractor") {
        fakeBangarangClaimInteractor$1
            .reset()
            .then(() => response.end())
            .catch(error => sendErrorResponse(error));
    }
    else if (apiPrefixFromString(request.params.apiPrefix) === "restGcpDatastoreClaimInteractor") {
        gcpDatastoreBangarangClaimInteractor
            .reset()
            .then(() => response.end())
            .catch(error => sendErrorResponse(error));
    }
    else
        sendErrorResponse(new Error(`Not bangarang member interactor with api prefix '${apiPrefixFromString(request.params.apiPrefix)}'.`));
});
App$1.get(`/${apiPrefix}/isCredentialsValid`, (request, response) => {
    const sendErrorResponse = (error) => response.status(500).json({ error: error.message });
    const bangarangMemberInteractor = selectBangarangMemberInteractor(request.params.apiPrefix);
    if (!bangarangMemberInteractor)
        sendErrorResponse(new Error(`bangarangMemberInteractor undefined`));
    else {
        const queryUsername = request.query[BangarangQueryParameters.Username];
        const queryPassword = request.query[BangarangQueryParameters.Password];
        if (!isQueryStringQuery(queryUsername))
            sendErrorResponse(new Error(`queryUsername not supported : '${queryUsername}'`));
        else if (!isQueryStringQuery(queryPassword))
            sendErrorResponse(new Error(`queryPassword not supported : '${queryPassword}'`));
        else
            return bangarangMemberInteractor.adapter
                .isCredentialsValid({ username: queryUsername, password: queryPassword })
                .then(isCredentialsValid => {
                if (isCredentialsValid instanceof Error)
                    throw isCredentialsValid;
                response.end(JSON.stringify({ isCredentialsValid }));
            })
                .catch((error) => sendErrorResponse(error));
    }
});
App$1.get(`/${apiPrefix}/retrieveUserContract`, (request, response) => {
    const sendErrorResponse = (error) => response.status(500).json({ error: error.message });
    const bangarangMemberInteractor = selectBangarangMemberInteractor(request.params.apiPrefix);
    if (!bangarangMemberInteractor)
        sendErrorResponse(new Error(`bangarangMemberInteractor undefined`));
    else {
        const queryUsername = request.query[BangarangQueryParameters.Username];
        if (!isQueryStringQuery(queryUsername))
            sendErrorResponse(new Error(`queryUsername not supported : '${queryUsername}'`));
        else
            return bangarangMemberInteractor.adapter
                .retrieveUserContract(queryUsername)
                .then(userContract => {
                if (userContract instanceof Error)
                    throw userContract;
                if (userContract === undefined)
                    response.end();
                else
                    response.end(JSON.stringify(userContract));
            })
                .catch((error) => sendErrorResponse(error));
    }
});
App$1.use(compression__default['default']({ threshold: 0 }), sirv__default['default']('static', { dev: "development" === 'development' }), middleware());
App$1.listen(process.env.PORT);
//export default App
module.exports = App$1;
