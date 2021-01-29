
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
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
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
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
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.31.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\ui\components\Styles\tailwindcss.svelte generated by Svelte v3.31.2 */

    function create_fragment(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Tailwindcss", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tailwindcss> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Tailwindcss extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tailwindcss",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src\ui\components\Buttons\DeclareNewClaimButton.svelte generated by Svelte v3.31.2 */

    const file = "src\\ui\\components\\Buttons\\DeclareNewClaimButton.svelte";

    function create_fragment$1(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Declare a new claim";
    			attr_dev(button, "class", "text-xl mx-5 my-1 min-w-max text-bangarang-dark border border-bangarang-darkEmphasis rounded bg-bangarang-lightEmphasis");
    			button.disabled = true;
    			add_location(button, file, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("DeclareNewClaimButton", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<DeclareNewClaimButton> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class DeclareNewClaimButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DeclareNewClaimButton",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\ui\components\Links\LinkToBangarangLeanCanvas.svelte generated by Svelte v3.31.2 */

    const file$1 = "src\\ui\\components\\Links\\LinkToBangarangLeanCanvas.svelte";

    function create_fragment$2(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "What is Bangarang?";
    			attr_dev(a, "class", "text-xs text-bangarang-darkEmphasis underline ");
    			attr_dev(a, "href", "/");
    			add_location(a, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("LinkToBangarangLeanCanvas", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LinkToBangarangLeanCanvas> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class LinkToBangarangLeanCanvas extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LinkToBangarangLeanCanvas",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\ui\components\Titles\WelcomeTitle.svelte generated by Svelte v3.31.2 */

    const file$2 = "src\\ui\\components\\Titles\\WelcomeTitle.svelte";

    function create_fragment$3(ctx) {
    	let p;
    	let t1;
    	let h1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Welcome to";
    			t1 = space();
    			h1 = element("h1");
    			h1.textContent = "BANGARANG";
    			attr_dev(p, "class", "text-2xl text-bangarang-darkEmphasis my-1");
    			add_location(p, file$2, 0, 0, 0);
    			attr_dev(h1, "class", "text-4xl text-bangarang-darkEmphasis my-1");
    			add_location(h1, file$2, 1, 0, 69);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("WelcomeTitle", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<WelcomeTitle> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class WelcomeTitle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WelcomeTitle",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\ui\components\Descriptions\BangarangDescription.svelte generated by Svelte v3.31.2 */

    const file$3 = "src\\ui\\components\\Descriptions\\BangarangDescription.svelte";

    function create_fragment$4(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Bangarang is an open source and free direct democratic claim system. It allows anybody to declare or search for claim and claiming for them anonymously.";
    			attr_dev(p, "class", "text-xs text-bangarang-darkEmphasis my-1");
    			add_location(p, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("BangarangDescription", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BangarangDescription> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class BangarangDescription extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BangarangDescription",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

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

    const initialClaimSearchValue = '';
    const claimSearchStore = writable(initialClaimSearchValue);

    /* src\ui\components\SearchBars\ClaimSearchBar.svelte generated by Svelte v3.31.2 */
    const file$4 = "src\\ui\\components\\SearchBars\\ClaimSearchBar.svelte";

    function create_fragment$5(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "class", "text-xl text-center mx-5 my-1 text-bangarang-dark placeholder-bangarang-darkEmphasis border-bangarang-lightEmphasis border rounded ");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Find a claim...");
    			add_location(input, file$4, 6, 0, 236);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*$claimSearchStore*/ ctx[1]);
    			/*input_binding*/ ctx[3](input);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$claimSearchStore*/ 2 && input.value !== /*$claimSearchStore*/ ctx[1]) {
    				set_input_value(input, /*$claimSearchStore*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding*/ ctx[3](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $claimSearchStore;
    	validate_store(claimSearchStore, "claimSearchStore");
    	component_subscribe($$self, claimSearchStore, $$value => $$invalidate(1, $claimSearchStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ClaimSearchBar", slots, []);
    	let searchBar;

    	afterUpdate(() => {
    		if ($claimSearchStore.length === 1) searchBar.focus();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ClaimSearchBar> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		$claimSearchStore = this.value;
    		claimSearchStore.set($claimSearchStore);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			searchBar = $$value;
    			$$invalidate(0, searchBar);
    		});
    	}

    	$$self.$capture_state = () => ({
    		afterUpdate,
    		claimSearchStore,
    		searchBar,
    		$claimSearchStore
    	});

    	$$self.$inject_state = $$props => {
    		if ("searchBar" in $$props) $$invalidate(0, searchBar = $$props.searchBar);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [searchBar, $claimSearchStore, input_input_handler, input_binding];
    }

    class ClaimSearchBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ClaimSearchBar",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\ui\views\MainMenu\WelcomePageView.svelte generated by Svelte v3.31.2 */
    const file$5 = "src\\ui\\views\\MainMenu\\WelcomePageView.svelte";

    function create_fragment$6(ctx) {
    	let div0;
    	let welcometitle;
    	let t0;
    	let bangarangdescription;
    	let t1;
    	let div1;
    	let claimsearchbar;
    	let t2;
    	let declarenewclaimbutton;
    	let t3;
    	let linktobangarangleancanvas;
    	let current;
    	welcometitle = new WelcomeTitle({ $$inline: true });
    	bangarangdescription = new BangarangDescription({ $$inline: true });
    	claimsearchbar = new ClaimSearchBar({ $$inline: true });
    	declarenewclaimbutton = new DeclareNewClaimButton({ $$inline: true });
    	linktobangarangleancanvas = new LinkToBangarangLeanCanvas({ $$inline: true });

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(welcometitle.$$.fragment);
    			t0 = space();
    			create_component(bangarangdescription.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			create_component(claimsearchbar.$$.fragment);
    			t2 = space();
    			create_component(declarenewclaimbutton.$$.fragment);
    			t3 = space();
    			create_component(linktobangarangleancanvas.$$.fragment);
    			attr_dev(div0, "class", "row-span-5 grid content-center");
    			add_location(div0, file$5, 6, 0, 468);
    			attr_dev(div1, "class", "row-span-1 grid content-evenly");
    			add_location(div1, file$5, 10, 0, 572);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(welcometitle, div0, null);
    			append_dev(div0, t0);
    			mount_component(bangarangdescription, div0, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(claimsearchbar, div1, null);
    			append_dev(div1, t2);
    			mount_component(declarenewclaimbutton, div1, null);
    			append_dev(div1, t3);
    			mount_component(linktobangarangleancanvas, div1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(welcometitle.$$.fragment, local);
    			transition_in(bangarangdescription.$$.fragment, local);
    			transition_in(claimsearchbar.$$.fragment, local);
    			transition_in(declarenewclaimbutton.$$.fragment, local);
    			transition_in(linktobangarangleancanvas.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(welcometitle.$$.fragment, local);
    			transition_out(bangarangdescription.$$.fragment, local);
    			transition_out(claimsearchbar.$$.fragment, local);
    			transition_out(declarenewclaimbutton.$$.fragment, local);
    			transition_out(linktobangarangleancanvas.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(welcometitle);
    			destroy_component(bangarangdescription);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			destroy_component(claimsearchbar);
    			destroy_component(declarenewclaimbutton);
    			destroy_component(linktobangarangleancanvas);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("WelcomePageView", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<WelcomePageView> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		DeclareNewClaimButton,
    		LinkToBangarangLeanCanvas,
    		WelcomeTitle,
    		BangarangDescription,
    		ClaimSearchBar
    	});

    	return [];
    }

    class WelcomePageView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WelcomePageView",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\ui\components\Icons\BackIcon.svelte generated by Svelte v3.31.2 */

    const file$6 = "src\\ui\\components\\Icons\\BackIcon.svelte";

    function create_fragment$7(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M10 19l-7-7m0 0l7-7m-7 7h18");
    			add_location(path, file$6, 1, 4, 164);
    			attr_dev(svg, "class", "w-4 h-4 mr-1 stroke-current text-bangarang-darkEmphasis");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			add_location(svg, file$6, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("BackIcon", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BackIcon> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class BackIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BackIcon",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\ui\components\Links\BackToMainMenuLink.svelte generated by Svelte v3.31.2 */
    const file$7 = "src\\ui\\components\\Links\\BackToMainMenuLink.svelte";

    function create_fragment$8(ctx) {
    	let span;
    	let backicon;
    	let p;
    	let current;
    	let mounted;
    	let dispose;
    	backicon = new BackIcon({ $$inline: true });

    	const block = {
    		c: function create() {
    			span = element("span");
    			create_component(backicon.$$.fragment);
    			p = element("p");
    			p.textContent = "Back to main menu.";
    			attr_dev(p, "class", "text-xs text-bangarang-darkEmphasis underline");
    			add_location(p, file$7, 5, 56, 274);
    			attr_dev(span, "class", "inline-flex items-center px-3");
    			add_location(span, file$7, 5, 0, 218);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			mount_component(backicon, span, null);
    			append_dev(span, p);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(p, "click", /*resetClaimSearch*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(backicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(backicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			destroy_component(backicon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $claimSearchStore;
    	validate_store(claimSearchStore, "claimSearchStore");
    	component_subscribe($$self, claimSearchStore, $$value => $$invalidate(1, $claimSearchStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("BackToMainMenuLink", slots, []);
    	const resetClaimSearch = () => set_store_value(claimSearchStore, $claimSearchStore = "", $claimSearchStore);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BackToMainMenuLink> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		BackIcon,
    		claimSearchStore,
    		resetClaimSearch,
    		$claimSearchStore
    	});

    	return [resetClaimSearch];
    }

    class BackToMainMenuLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BackToMainMenuLink",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\ui\views\MainMenu\ClaimSearchView.svelte generated by Svelte v3.31.2 */
    const file$8 = "src\\ui\\views\\MainMenu\\ClaimSearchView.svelte";

    function create_fragment$9(ctx) {
    	let div0;
    	let t0;
    	let p;
    	let t1;
    	let t2;
    	let div1;
    	let claimsearchbar;
    	let t3;
    	let backtomainmenulink;
    	let current;
    	claimsearchbar = new ClaimSearchBar({ $$inline: true });
    	backtomainmenulink = new BackToMainMenuLink({ $$inline: true });

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text("TODO\r\n    ");
    			p = element("p");
    			t1 = text(/*$claimSearchStore*/ ctx[0]);
    			t2 = space();
    			div1 = element("div");
    			create_component(claimsearchbar.$$.fragment);
    			t3 = space();
    			create_component(backtomainmenulink.$$.fragment);
    			add_location(p, file$8, 6, 4, 318);
    			attr_dev(div0, "class", "row-span-5 grid content-end");
    			add_location(div0, file$8, 4, 0, 261);
    			attr_dev(div1, "class", "row-span-1 grid content-end");
    			add_location(div1, file$8, 8, 0, 354);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			append_dev(div0, p);
    			append_dev(p, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(claimsearchbar, div1, null);
    			append_dev(div1, t3);
    			mount_component(backtomainmenulink, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$claimSearchStore*/ 1) set_data_dev(t1, /*$claimSearchStore*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(claimsearchbar.$$.fragment, local);
    			transition_in(backtomainmenulink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(claimsearchbar.$$.fragment, local);
    			transition_out(backtomainmenulink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			destroy_component(claimsearchbar);
    			destroy_component(backtomainmenulink);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $claimSearchStore;
    	validate_store(claimSearchStore, "claimSearchStore");
    	component_subscribe($$self, claimSearchStore, $$value => $$invalidate(0, $claimSearchStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ClaimSearchView", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ClaimSearchView> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		ClaimSearchBar,
    		BackToMainMenuLink,
    		claimSearchStore,
    		$claimSearchStore
    	});

    	return [$claimSearchStore];
    }

    class ClaimSearchView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ClaimSearchView",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\ui\pages\MainMenu.svelte generated by Svelte v3.31.2 */
    const file$9 = "src\\ui\\pages\\MainMenu.svelte";

    // (11:1) {:else}
    function create_else_block(ctx) {
    	let claimsearchview;
    	let current;
    	claimsearchview = new ClaimSearchView({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(claimsearchview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(claimsearchview, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(claimsearchview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(claimsearchview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(claimsearchview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(11:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (9:1) {#if $claimSearchStore === ''}
    function create_if_block(ctx) {
    	let welcomepageview;
    	let current;
    	welcomepageview = new WelcomePageView({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(welcomepageview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(welcomepageview, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(welcomepageview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(welcomepageview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(welcomepageview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(9:1) {#if $claimSearchStore === ''}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let tailwindcss;
    	let t;
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	tailwindcss = new Tailwindcss({ $$inline: true });
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$claimSearchStore*/ ctx[0] === "") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			create_component(tailwindcss.$$.fragment);
    			t = space();
    			main = element("main");
    			if_block.c();
    			attr_dev(main, "class", "text-center p-1 min-w-screen min-h-screen grid grid-cols-1 items-stretch grid-rows-6 bg-white");
    			add_location(main, file$9, 7, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(tailwindcss, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, main, anchor);
    			if_blocks[current_block_type_index].m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tailwindcss.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tailwindcss.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tailwindcss, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $claimSearchStore;
    	validate_store(claimSearchStore, "claimSearchStore");
    	component_subscribe($$self, claimSearchStore, $$value => $$invalidate(0, $claimSearchStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("MainMenu", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MainMenu> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Tailwindcss,
    		WelcomePageView,
    		ClaimSearchView,
    		claimSearchStore,
    		$claimSearchStore
    	});

    	return [$claimSearchStore];
    }

    class MainMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainMenu",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    const app = new MainMenu({
        target: document.body,
        props: {}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
