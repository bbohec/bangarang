
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
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
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
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
    function empty() {
        return text('');
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
    function claim_element(nodes, name, attributes, svg) {
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            if (node.nodeName === name) {
                let j = 0;
                const remove = [];
                while (j < node.attributes.length) {
                    const attribute = node.attributes[j++];
                    if (!attributes[attribute.name]) {
                        remove.push(attribute.name);
                    }
                }
                for (let k = 0; k < remove.length; k++) {
                    node.removeAttribute(remove[k]);
                }
                return nodes.splice(i, 1)[0];
            }
        }
        return svg ? svg_element(name) : element(name);
    }
    function claim_text(nodes, data) {
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            if (node.nodeType === 3) {
                node.data = '' + data;
                return nodes.splice(i, 1)[0];
            }
        }
        return text(data);
    }
    function claim_space(nodes) {
        return claim_text(nodes, ' ');
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
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
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

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function claim_component(block, parent_nodes) {
        block && block.l(parent_nodes);
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
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
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

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
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
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());
    const { navigate } = globalHistory;

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
      return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      );
    }

    function hostMatches(anchor) {
      const host = location.host;
      return (
        anchor.host == host ||
        // svelte seems to kill anchor.host value in ie11, so fall back to checking href
        anchor.href.indexOf(`https://${host}`) === 0 ||
        anchor.href.indexOf(`http://${host}`) === 0
      )
    }

    /* node_modules\svelte-routing\src\Router.svelte generated by Svelte v3.31.2 */

    function create_fragment(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(nodes);
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 256) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
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

    function instance($$self, $$props, $$invalidate) {
    	let $base;
    	let $location;
    	let $routes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Router", slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, "routes");
    	component_subscribe($$self, routes, value => $$invalidate(7, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(6, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, "base");
    	component_subscribe($$self, base, value => $$invalidate(5, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ["basepath", "url"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("basepath" in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(4, url = $$props.url);
    		if ("$$scope" in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		derived,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$base,
    		$location,
    		$routes
    	});

    	$$self.$inject_state = $$props => {
    		if ("basepath" in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(4, url = $$props.url);
    		if ("hasActiveRoute" in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 32) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			 {
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 192) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			 {
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		$base,
    		$location,
    		$routes,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Route.svelte generated by Svelte v3.31.2 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 4,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[2],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			if_block.l(nodes);
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(nodes);
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope, routeParams, $location*/ 532) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[9], dirty, get_default_slot_changes, get_default_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[2],
    		/*routeProps*/ ctx[3]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			if (switch_instance) claim_component(switch_instance.$$.fragment, nodes);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 28)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			if (if_block) if_block.l(nodes);
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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

    function instance$1($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Route", slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, "activeRoute");
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));
    	const location = getContext(LOCATION);
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("path" in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ("component" in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ("$$scope" in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ("path" in $$props) $$invalidate(8, path = $$new_props.path);
    		if ("component" in $$props) $$invalidate(0, component = $$new_props.component);
    		if ("routeParams" in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ("routeProps" in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 2) {
    			 if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(2, routeParams = $activeRoute.params);
    			}
    		}

    		 {
    			const { path, component, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * A link action that can be added to <a href=""> tags rather
     * than using the <Link> component.
     *
     * Example:
     * ```html
     * <a href="/post/{postId}" use:link>{post.title}</a>
     * ```
     */
    function link(node) {
      function onClick(event) {
        const anchor = event.currentTarget;

        if (
          anchor.target === "" &&
          hostMatches(anchor) &&
          shouldNavigate(event)
        ) {
          event.preventDefault();
          navigate(anchor.pathname + anchor.search, { replace: anchor.hasAttribute("replace") });
        }
      }

      node.addEventListener("click", onClick);

      return {
        destroy() {
          node.removeEventListener("click", onClick);
        }
      };
    }

    const links = {
        mainMenu: "/mainMenu",
        businessModel: "/businessModel",
        leanCanvas: "/leanCanvas"
    };
    const claimLinkPrefix = "claims/";

    /* src\ui\components\Styles\tailwindcss.svelte generated by Svelte v3.31.2 */

    function create_fragment$2(ctx) {
    	const block = {
    		c: noop,
    		l: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
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
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tailwindcss",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\ui\components\Buttons\DeclareNewClaimButton.svelte generated by Svelte v3.31.2 */

    const file = "src\\ui\\components\\Buttons\\DeclareNewClaimButton.svelte";

    function create_fragment$3(ctx) {
    	let button;
    	let t;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text("Declare a new claim");
    			this.h();
    		},
    		l: function claim(nodes) {
    			button = claim_element(nodes, "BUTTON", { class: true, disabled: true });
    			var button_nodes = children(button);
    			t = claim_text(button_nodes, "Declare a new claim");
    			button_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(button, "class", "text-xl mx-5 my-1 px-1 text-bangarang-dark border border-bangarang-darkEmphasis rounded-md bg-bangarang-lightEmphasis");
    			button.disabled = true;
    			add_location(button, file, 0, 0, 0);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
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
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DeclareNewClaimButton",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\ui\components\Links\Link.svelte generated by Svelte v3.31.2 */
    const file$1 = "src\\ui\\components\\Links\\Link.svelte";

    function create_fragment$4(ctx) {
    	let a;
    	let t;
    	let a_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(/*linkName*/ ctx[0]);
    			this.h();
    		},
    		l: function claim(nodes) {
    			a = claim_element(nodes, "A", { class: true, href: true });
    			var a_nodes = children(a);
    			t = claim_text(a_nodes, /*linkName*/ ctx[0]);
    			a_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(a, "class", a_class_value = "" + (/*textSizeFromSize*/ ctx[4](/*size*/ ctx[2]) + " " + /*textAlign*/ ctx[3] + " text-bangarang-darkEmphasis underline mb-1"));
    			attr_dev(a, "href", /*linkHref*/ ctx[1]);
    			add_location(a, file$1, 13, 0, 390);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);

    			if (!mounted) {
    				dispose = action_destroyer(link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*linkName*/ 1) set_data_dev(t, /*linkName*/ ctx[0]);

    			if (dirty & /*size, textAlign*/ 12 && a_class_value !== (a_class_value = "" + (/*textSizeFromSize*/ ctx[4](/*size*/ ctx[2]) + " " + /*textAlign*/ ctx[3] + " text-bangarang-darkEmphasis underline mb-1"))) {
    				attr_dev(a, "class", a_class_value);
    			}

    			if (dirty & /*linkHref*/ 2) {
    				attr_dev(a, "href", /*linkHref*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
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

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Link", slots, []);
    	let { linkName = "link name not provided to component!" } = $$props;
    	let { linkHref = "missing" } = $$props;
    	let { size } = $$props;
    	let { textAlign = "text-center" } = $$props;

    	const textSizeFromSize = size => {
    		if (size === "small") return "text-xs";
    		if (size === "large") return "text-2xl";
    		return "";
    	};

    	const writable_props = ["linkName", "linkHref", "size", "textAlign"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Link> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("linkName" in $$props) $$invalidate(0, linkName = $$props.linkName);
    		if ("linkHref" in $$props) $$invalidate(1, linkHref = $$props.linkHref);
    		if ("size" in $$props) $$invalidate(2, size = $$props.size);
    		if ("textAlign" in $$props) $$invalidate(3, textAlign = $$props.textAlign);
    	};

    	$$self.$capture_state = () => ({
    		link,
    		linkName,
    		linkHref,
    		size,
    		textAlign,
    		textSizeFromSize
    	});

    	$$self.$inject_state = $$props => {
    		if ("linkName" in $$props) $$invalidate(0, linkName = $$props.linkName);
    		if ("linkHref" in $$props) $$invalidate(1, linkHref = $$props.linkHref);
    		if ("size" in $$props) $$invalidate(2, size = $$props.size);
    		if ("textAlign" in $$props) $$invalidate(3, textAlign = $$props.textAlign);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [linkName, linkHref, size, textAlign, textSizeFromSize];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			linkName: 0,
    			linkHref: 1,
    			size: 2,
    			textAlign: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*size*/ ctx[2] === undefined && !("size" in props)) {
    			console.warn("<Link> was created without expected prop 'size'");
    		}
    	}

    	get linkName() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set linkName(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get linkHref() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set linkHref(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get textAlign() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set textAlign(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\ui\components\Titles\WelcomeTitle.svelte generated by Svelte v3.31.2 */

    const file$2 = "src\\ui\\components\\Titles\\WelcomeTitle.svelte";

    function create_fragment$5(ctx) {
    	let p;
    	let t0;
    	let t1;
    	let h1;
    	let t2;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Welcome to");
    			t1 = space();
    			h1 = element("h1");
    			t2 = text("BANGARANG");
    			this.h();
    		},
    		l: function claim(nodes) {
    			p = claim_element(nodes, "P", { class: true });
    			var p_nodes = children(p);
    			t0 = claim_text(p_nodes, "Welcome to");
    			p_nodes.forEach(detach_dev);
    			t1 = claim_space(nodes);
    			h1 = claim_element(nodes, "H1", { class: true });
    			var h1_nodes = children(h1);
    			t2 = claim_text(h1_nodes, "BANGARANG");
    			h1_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(p, "class", "text-2xl text-bangarang-darkEmphasis my-1");
    			add_location(p, file$2, 0, 0, 0);
    			attr_dev(h1, "class", "text-4xl text-bangarang-darkEmphasis my-1");
    			add_location(h1, file$2, 1, 0, 69);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t2);
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
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
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
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WelcomeTitle",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\ui\components\Descriptions\BangarangDescription.svelte generated by Svelte v3.31.2 */

    const file$3 = "src\\ui\\components\\Descriptions\\BangarangDescription.svelte";

    function create_fragment$6(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text("Bangarang is an open source and free direct democratic claim system. It allows anybody to declare or search for claim and claiming for them anonymously.");
    			this.h();
    		},
    		l: function claim(nodes) {
    			p = claim_element(nodes, "P", { class: true });
    			var p_nodes = children(p);
    			t = claim_text(p_nodes, "Bangarang is an open source and free direct democratic claim system. It allows anybody to declare or search for claim and claiming for them anonymously.");
    			p_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(p, "class", "text-xs text-center text-bangarang-darkEmphasis my-1");
    			add_location(p, file$3, 0, 0, 0);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
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
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props) {
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
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BangarangDescription",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    const initialClaimSearchValue = '';
    const claimSearchStore = writable(initialClaimSearchValue);

    /* src\ui\components\SearchBars\ClaimSearchBar.svelte generated by Svelte v3.31.2 */
    const file$4 = "src\\ui\\components\\SearchBars\\ClaimSearchBar.svelte";

    function create_fragment$7(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			this.h();
    		},
    		l: function claim(nodes) {
    			input = claim_element(nodes, "INPUT", {
    				class: true,
    				type: true,
    				placeholder: true
    			});

    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(input, "class", "text-xl text-center mx-5 my-1 text-bangarang-dark placeholder-bangarang-darkEmphasis border-bangarang-lightEmphasis border rounded-md");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Find a claim...");
    			add_location(input, file$4, 6, 0, 236);
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ClaimSearchBar",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\ui\components\Cards\PreviewCard.svelte generated by Svelte v3.31.2 */

    const file$5 = "src\\ui\\components\\Cards\\PreviewCard.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let p;
    	let t0;
    	let a;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = space();
    			a = element("a");
    			t1 = text("Bangarang contact form.");
    			this.h();
    		},
    		l: function claim(nodes) {
    			div = claim_element(nodes, "DIV", { class: true });
    			var div_nodes = children(div);
    			p = claim_element(div_nodes, "P", { class: true });
    			var p_nodes = children(p);
    			p_nodes.forEach(detach_dev);
    			t0 = claim_space(div_nodes);
    			a = claim_element(div_nodes, "A", { href: true, target: true, class: true });
    			var a_nodes = children(a);
    			t1 = claim_text(a_nodes, "Bangarang contact form.");
    			a_nodes.forEach(detach_dev);
    			div_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(p, "class", "m-1 text-bangarang-dark flex-grow text-center text-xs");
    			add_location(p, file$5, 5, 4, 426);
    			attr_dev(a, "href", googleFormUrl);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", " m-1 underline text-bangarang-dark text-sm");
    			add_location(a, file$5, 6, 4, 516);
    			attr_dev(div, "class", "border rounded m-4 p-1 border-bangarang-failed bg-bangarang-lightEmphasis flex flex-col items-center");
    			add_location(div, file$5, 4, 0, 306);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			p.innerHTML = /*message*/ ctx[0];
    			append_dev(div, t0);
    			append_dev(div, a);
    			append_dev(a, t1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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

    const stage = "pre-alpha";
    const googleFormUrl = "https://forms.gle/H7FWYyG4HcHYthy99";

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("PreviewCard", slots, []);
    	const message = `Bangarang is currently on <b>${stage}</b> stage. If you want to be informed about the next stages, you can provide your email on the following Google Form.<br>Thanks.`;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PreviewCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ stage, message, googleFormUrl });
    	return [message];
    }

    class PreviewCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PreviewCard",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\ui\views\MainMenu\WelcomePageView.svelte generated by Svelte v3.31.2 */
    const file$6 = "src\\ui\\views\\MainMenu\\WelcomePageView.svelte";

    function create_fragment$9(ctx) {
    	let main;
    	let welcometitle;
    	let t0;
    	let bangarangdescription;
    	let t1;
    	let previewcard;
    	let t2;
    	let footer;
    	let claimsearchbar;
    	let t3;
    	let declarenewclaimbutton;
    	let t4;
    	let link;
    	let current;
    	welcometitle = new WelcomeTitle({ $$inline: true });
    	bangarangdescription = new BangarangDescription({ $$inline: true });
    	previewcard = new PreviewCard({ $$inline: true });
    	claimsearchbar = new ClaimSearchBar({ $$inline: true });
    	declarenewclaimbutton = new DeclareNewClaimButton({ $$inline: true });

    	link = new Link({
    			props: {
    				size: "small",
    				linkName: "What is Bangarang?",
    				linkHref: links.businessModel
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(welcometitle.$$.fragment);
    			t0 = space();
    			create_component(bangarangdescription.$$.fragment);
    			t1 = space();
    			create_component(previewcard.$$.fragment);
    			t2 = space();
    			footer = element("footer");
    			create_component(claimsearchbar.$$.fragment);
    			t3 = space();
    			create_component(declarenewclaimbutton.$$.fragment);
    			t4 = space();
    			create_component(link.$$.fragment);
    			this.h();
    		},
    		l: function claim(nodes) {
    			main = claim_element(nodes, "MAIN", { class: true });
    			var main_nodes = children(main);
    			claim_component(welcometitle.$$.fragment, main_nodes);
    			t0 = claim_space(main_nodes);
    			claim_component(bangarangdescription.$$.fragment, main_nodes);
    			t1 = claim_space(main_nodes);
    			claim_component(previewcard.$$.fragment, main_nodes);
    			main_nodes.forEach(detach_dev);
    			t2 = claim_space(nodes);
    			footer = claim_element(nodes, "FOOTER", { class: true });
    			var footer_nodes = children(footer);
    			claim_component(claimsearchbar.$$.fragment, footer_nodes);
    			t3 = claim_space(footer_nodes);
    			claim_component(declarenewclaimbutton.$$.fragment, footer_nodes);
    			t4 = claim_space(footer_nodes);
    			claim_component(link.$$.fragment, footer_nodes);
    			footer_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(main, "class", "flex-grow overflow-y-auto flex flex-col items-center justify-center");
    			add_location(main, file$6, 8, 0, 542);
    			attr_dev(footer, "class", "flex flex-col mb-1");
    			add_location(footer, file$6, 13, 0, 705);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(welcometitle, main, null);
    			append_dev(main, t0);
    			mount_component(bangarangdescription, main, null);
    			append_dev(main, t1);
    			mount_component(previewcard, main, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, footer, anchor);
    			mount_component(claimsearchbar, footer, null);
    			append_dev(footer, t3);
    			mount_component(declarenewclaimbutton, footer, null);
    			append_dev(footer, t4);
    			mount_component(link, footer, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(welcometitle.$$.fragment, local);
    			transition_in(bangarangdescription.$$.fragment, local);
    			transition_in(previewcard.$$.fragment, local);
    			transition_in(claimsearchbar.$$.fragment, local);
    			transition_in(declarenewclaimbutton.$$.fragment, local);
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(welcometitle.$$.fragment, local);
    			transition_out(bangarangdescription.$$.fragment, local);
    			transition_out(previewcard.$$.fragment, local);
    			transition_out(claimsearchbar.$$.fragment, local);
    			transition_out(declarenewclaimbutton.$$.fragment, local);
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(welcometitle);
    			destroy_component(bangarangdescription);
    			destroy_component(previewcard);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(footer);
    			destroy_component(claimsearchbar);
    			destroy_component(declarenewclaimbutton);
    			destroy_component(link);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("WelcomePageView", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<WelcomePageView> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		DeclareNewClaimButton,
    		links,
    		Link,
    		WelcomeTitle,
    		BangarangDescription,
    		ClaimSearchBar,
    		PreviewCard
    	});

    	return [];
    }

    class WelcomePageView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WelcomePageView",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\ui\components\Icons\BackIcon.svelte generated by Svelte v3.31.2 */

    const file$7 = "src\\ui\\components\\Icons\\BackIcon.svelte";

    function create_fragment$a(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			this.h();
    		},
    		l: function claim(nodes) {
    			svg = claim_element(
    				nodes,
    				"svg",
    				{
    					class: true,
    					xmlns: true,
    					fill: true,
    					viewBox: true,
    					stroke: true
    				},
    				1
    			);

    			var svg_nodes = children(svg);

    			path = claim_element(
    				svg_nodes,
    				"path",
    				{
    					"stroke-linecap": true,
    					"stroke-linejoin": true,
    					"stroke-width": true,
    					d: true
    				},
    				1
    			);

    			children(path).forEach(detach_dev);
    			svg_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M10 19l-7-7m0 0l7-7m-7 7h18");
    			add_location(path, file$7, 1, 4, 164);
    			attr_dev(svg, "class", "w-4 h-4 mr-1 stroke-current text-bangarang-darkEmphasis");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			add_location(svg, file$7, 0, 0, 0);
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
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props) {
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
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BackIcon",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\ui\components\Links\BackToMainMenuLink.svelte generated by Svelte v3.31.2 */
    const file$8 = "src\\ui\\components\\Links\\BackToMainMenuLink.svelte";

    function create_fragment$b(ctx) {
    	let span;
    	let backicon;
    	let p;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	backicon = new BackIcon({ $$inline: true });

    	const block = {
    		c: function create() {
    			span = element("span");
    			create_component(backicon.$$.fragment);
    			p = element("p");
    			t = text("Back to main menu.");
    			this.h();
    		},
    		l: function claim(nodes) {
    			span = claim_element(nodes, "SPAN", { class: true });
    			var span_nodes = children(span);
    			claim_component(backicon.$$.fragment, span_nodes);
    			p = claim_element(span_nodes, "P", { class: true });
    			var p_nodes = children(p);
    			t = claim_text(p_nodes, "Back to main menu.");
    			p_nodes.forEach(detach_dev);
    			span_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(p, "class", "text-xs text-bangarang-darkEmphasis underline");
    			add_location(p, file$8, 4, 49, 265);
    			attr_dev(span, "class", "flex items-center px-2");
    			add_location(span, file$8, 4, 0, 216);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			mount_component(backicon, span, null);
    			append_dev(span, p);
    			append_dev(p, t);
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
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BackToMainMenuLink",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    const claims = new Array();
    claims.push({
        peopleClaimed: 10,
        peopleAgainst: 9,
        peopleFor: 1,
        title: "MonResto only offers meat in its menus, he needs at least one menu with only Vegan ingredients.",
        id: "claim1"
    });
    claims.push({
        peopleClaimed: 3215575,
        peopleAgainst: 1227755,
        peopleFor: 1987820,
        title: "Does MonResto offer too much meat in its menus?",
        id: "claim2"
    });
    claims.push({
        peopleClaimed: 10,
        peopleAgainst: 9,
        peopleFor: 1,
        title: "PasMonResto does not offer meat.",
        id: "claim3"
    });
    claims.push({
        peopleClaimed: 10,
        peopleAgainst: 9,
        peopleFor: 1,
        title: "What are the conditions of validity of an article of the constitution of the Awesome App team?", id: "claim4"
    });
    claims.push({
        peopleClaimed: 10,
        peopleAgainst: 9,
        peopleFor: 1,
        title: "Thundercats are on the move, Thundercats are loose. Feel the magic, hear the roar, Thundercats are loose. Thunder, thunder, thunder, Thundercats! Thunder, thunder, thunder, Thundercats! Thunder, thunder, thunder, Thundercats! Thunder, thunder, thunder, Thundercats! Thundercats! ", id: "claim5"
    });
    claims.push({
        peopleClaimed: 10,
        peopleAgainst: 9,
        peopleFor: 1,
        title: "Top Cat! The most effectual Top Cat! Who’s intellectual close friends get to call him T.C., providing it’s with dignity. Top Cat! The indisputable leader of the gang. He’s the boss, he’s a pip, he’s the championship. He’s the most tip top, Top Cat. ", id: "claim6"
    });
    claims.push({
        peopleClaimed: 10,
        peopleAgainst: 9,
        peopleFor: 1,
        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque a lorem vitae sem viverra consequat. Nam a nisl volutpat, suscipit ipsum vitae, feugiat tellus. Vivamus in facilisis dolor. Proin id euismod nisl. Vestibulum a ligula arcu. Ut nec urna convallis, facilisis sem vel, viverra magna. Curabitur vitae augue non urna cursus iaculis.", id: "claim7"
    });
    claims.push({
        peopleClaimed: 10,
        peopleAgainst: 9,
        peopleFor: 1,
        title: "In eu nulla quam. Vestibulum vulputate vestibulum dolor, nec bibendum urna interdum nec. Nulla dapibus auctor odio eu finibus. Cras finibus ante ac leo suscipit, eget pulvinar libero dignissim. Cras pulvinar aliquet est. Etiam a facilisis augue. Donec sit amet nisl diam. Phasellus sed vehicula metus. Suspendisse magna purus, finibus et aliquet eget, mattis id velit. Aenean tincidunt nec neque nec semper. Integer rutrum ac sem vitae lobortis. Etiam vitae iaculis dui. Phasellus fringilla elit quis metus fringilla, vitae mollis neque finibus.", id: "claim8"
    });
    claims.push({
        peopleClaimed: 10,
        peopleAgainst: 9,
        peopleFor: 1,
        title: "Curabitur pulvinar pretium ex et accumsan. Nam fringilla ultrices sagittis. Suspendisse elementum nisi sed eros aliquet, ut congue nibh ornare. Nullam tincidunt eleifend libero, et iaculis libero pellentesque id. Integer sit amet urna vel leo malesuada ultrices. Aliquam vulputate, eros vel vestibulum mollis, tortor nulla laoreet purus, nec aliquam velit nunc vel quam. Cras vel ex dui. Duis ut nulla gravida, sodales lorem vitae, ornare enim. Cras sodales ligula sed eleifend ullamcorper. Aliquam tempus, libero eget consectetur laoreet, est purus facilisis sem, sit amet venenatis lorem massa vitae lorem. Etiam sit amet aliquet odio. Nulla et eros id nibh eleifend vestibulum nec vel dolor. Nulla commodo nulla vitae sem interdum, sit amet blandit velit elementum.", id: "claim9"
    });
    claims.push({
        peopleClaimed: 10,
        peopleAgainst: 9,
        peopleFor: 1,
        id: "claim11", title: "Etiam enim ligula, blandit in congue at, vulputate quis metus. Donec eu ullamcorper quam. Donec vitae lectus ac dolor finibus aliquet vel ac est. Quisque orci nibh, dictum in interdum ut, faucibus eu justo. Donec lobortis mauris id tellus ullamcorper, et porta mi varius. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer sodales felis a neque rutrum, sit amet pharetra nisl luctus. In vehicula iaculis risus nec tempus. Nunc interdum congue condimentum. Nulla sodales porta lectus nec pretium."
    });
    claims.push({
        peopleClaimed: 10,
        peopleAgainst: 9,
        peopleFor: 1,
        id: "claim12", title: "Sed lacinia nulla sed sapien mollis consequat. Nulla finibus eleifend metus, in dictum justo iaculis semper. Praesent sed est pellentesque, vulputate mi ut, vehicula leo. Aenean tempus egestas laoreet. Aenean rutrum placerat urna, non luctus est commodo sed. Mauris nec tristique ipsum. Nulla facilisi. Etiam a tristique quam, eu sagittis elit."
    });
    claims.push({
        peopleClaimed: 10,
        peopleAgainst: 9,
        peopleFor: 1,
        id: "claim13", title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel leo quam. Integer sit amet tempor turpis. Aenean quis ex mollis, vulputate nunc quis, pulvinar ligula. Morbi luctus sem ac tortor mattis, sed semper magna rhoncus. Proin aliquam nisi eu mi feugiat blandit. Maecenas interdum eros tortor, sit amet posuere turpis dictum a. In ac arcu tincidunt, bibendum odio rutrum, mattis libero. Curabitur euismod, ipsum id tincidunt vehicula, justo metus lacinia dui, vel sodales tellus mi a leo."
    });
    claims.push({
        peopleClaimed: 10,
        peopleAgainst: 9,
        peopleFor: 1,
        id: "claim14", title: "Quisque porttitor, metus quis tincidunt convallis, mi dui tristique urna, eu ornare neque lorem nec libero. Nullam ut pharetra dui, eget sollicitudin arcu. Donec sollicitudin arcu eu faucibus fringilla. Integer vitae pellentesque nulla, eget feugiat turpis. Aliquam id porttitor ex, ut vulputate nibh. Morbi quam ante, aliquet a tellus in, molestie tempus massa. Integer mollis turpis quis felis fringilla, ut dapibus orci aliquam. Nullam faucibus, erat eu vehicula bibendum, est ipsum scelerisque magna, posuere tempor libero mauris ac purus. Vestibulum pulvinar ante lectus, sollicitudin congue mauris sodales id. Duis porttitor ultricies lorem at tincidunt. Sed iaculis aliquet consectetur."
    });
    claims.push({
        peopleClaimed: 10,
        peopleAgainst: 9,
        peopleFor: 1,
        id: "claim15", title: "Nulla eu magna augue. In mattis diam non felis efficitur, id semper libero aliquet. Nunc at ex nec orci pretium fringilla sed sit amet nibh. Duis id lobortis nulla. Aenean vitae purus tempus, tristique justo et, semper felis. Vestibulum in pretium dolor. Curabitur accumsan, nisi nec pretium dignissim, tellus augue luctus arcu, nec ultricies ligula lorem bibendum mauris. Phasellus at massa ante. Phasellus tincidunt placerat nisi, et accumsan dui consectetur aliquam. Etiam ultrices, velit ac euismod consectetur, ligula nunc imperdiet leo, ut laoreet erat velit ultrices ipsum. Proin non augue sapien. Phasellus sagittis ut elit at dictum. Nam malesuada eleifend cursus. Curabitur iaculis dolor vitae massa molestie, sed convallis velit dictum."
    });
    claims.push({
        peopleClaimed: 10,
        peopleAgainst: 9,
        peopleFor: 1,
        id: "claim16", title: "Donec ullamcorper ut arcu eget rutrum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus nec ipsum pretium, sagittis nisi ut, volutpat sem. Integer rhoncus, leo eu feugiat hendrerit, massa purus varius lectus, id pharetra augue purus id justo. Suspendisse est diam, scelerisque ut commodo et, sollicitudin quis elit. Donec vestibulum tristique consectetur. Suspendisse eleifend pellentesque ipsum, vel mollis lacus luctus in."
    });
    claims.push({
        peopleClaimed: 10,
        peopleAgainst: 9,
        peopleFor: 1,
        id: "claim17", title: "Donec ac euismod justo. Cras consequat, orci non pellentesque gravida, dolor urna porta nisi, ut luctus odio enim nec nibh. Phasellus vestibulum sapien non arcu porta suscipit. Duis consequat est dui, in rutrum diam varius vel. Cras iaculis, augue vel feugiat mollis, elit nulla imperdiet arcu, quis sagittis diam metus et lorem. Aenean sit amet finibus quam, ut sagittis dolor. Nulla ac hendrerit turpis, at lobortis risus. Phasellus nec magna ut sapien faucibus consequat. Interdum et malesuada fames ac ante ipsum primis in faucibus."
    });
    claims.push({
        peopleClaimed: 10,
        peopleAgainst: 9,
        peopleFor: 1,
        id: "claim18", title: "Sed ultrices, lorem eleifend sagittis ultrices, purus lorem fringilla neque, at vulputate magna augue id erat. Ut pulvinar lacus vel dui mattis eleifend. Donec sit amet arcu mattis, sagittis purus quis, consequat augue. Curabitur risus orci, malesuada id gravida et, maximus id arcu. Nullam tristique euismod diam non imperdiet. Donec congue auctor erat, sit amet blandit tortor condimentum at. Curabitur lacinia purus a libero laoreet tristique. Donec aliquam, augue sed efficitur porttitor, mauris massa blandit quam, id venenatis tortor massa ac lectus. Ut tempus rhoncus urna vitae pharetra. Sed ullamcorper pretium nibh, eget pharetra neque cursus nec. Aliquam quis nibh id orci euismod accumsan. Maecenas dictum neque odio. Morbi eget ante feugiat, rutrum metus nec, lacinia metus. Suspendisse mollis, libero quis placerat luctus, erat libero dapibus ante, sed fringilla nulla felis eu purus. Vivamus non consectetur ipsum, in ullamcorper est. Nunc odio arcu, auctor ut elit sed, suscipit vehicula nulla."
    });

    const retreiveClaimsByClaimSearchValue = (claimSearchValue) => {
        return claims.filter(claim => claim.title.includes(claimSearchValue));
    };

    /* src\ui\components\Cards\SearchedClaim.svelte generated by Svelte v3.31.2 */
    const file$9 = "src\\ui\\components\\Cards\\SearchedClaim.svelte";

    function create_fragment$c(ctx) {
    	let div;
    	let a;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			t = text(/*title*/ ctx[0]);
    			this.h();
    		},
    		l: function claim(nodes) {
    			div = claim_element(nodes, "DIV", { class: true });
    			var div_nodes = children(div);
    			a = claim_element(div_nodes, "A", { href: true, class: true });
    			var a_nodes = children(a);
    			t = claim_text(a_nodes, /*title*/ ctx[0]);
    			a_nodes.forEach(detach_dev);
    			div_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(a, "href", /*claimLink*/ ctx[1]);
    			attr_dev(a, "class", " text-bangarang-dark flex-grow");
    			add_location(a, file$9, 5, 4, 203);
    			attr_dev(div, "class", "border rounded my-1 p-1 border-bangarang-lightEmphasis flex items-center");
    			add_location(div, file$9, 4, 0, 111);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, t);

    			if (!mounted) {
    				dispose = action_destroyer(link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);

    			if (dirty & /*claimLink*/ 2) {
    				attr_dev(a, "href", /*claimLink*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SearchedClaim", slots, []);
    	let { title } = $$props;
    	let { claimLink } = $$props;
    	const writable_props = ["title", "claimLink"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SearchedClaim> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("claimLink" in $$props) $$invalidate(1, claimLink = $$props.claimLink);
    	};

    	$$self.$capture_state = () => ({ link, title, claimLink });

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("claimLink" in $$props) $$invalidate(1, claimLink = $$props.claimLink);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, claimLink];
    }

    class SearchedClaim extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { title: 0, claimLink: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchedClaim",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !("title" in props)) {
    			console.warn("<SearchedClaim> was created without expected prop 'title'");
    		}

    		if (/*claimLink*/ ctx[1] === undefined && !("claimLink" in props)) {
    			console.warn("<SearchedClaim> was created without expected prop 'claimLink'");
    		}
    	}

    	get title() {
    		throw new Error("<SearchedClaim>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<SearchedClaim>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get claimLink() {
    		throw new Error("<SearchedClaim>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set claimLink(value) {
    		throw new Error("<SearchedClaim>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\ui\components\Lists\SearchedClaims.svelte generated by Svelte v3.31.2 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (9:0) {#each searchedClaims as searchedClaim}
    function create_each_block(ctx) {
    	let searchedclaim;
    	let current;

    	searchedclaim = new SearchedClaim({
    			props: {
    				title: /*searchedClaim*/ ctx[1].title,
    				claimLink: "/" + claimLinkPrefix + /*searchedClaim*/ ctx[1].id
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(searchedclaim.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(searchedclaim.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(searchedclaim, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const searchedclaim_changes = {};
    			if (dirty & /*searchedClaims*/ 1) searchedclaim_changes.title = /*searchedClaim*/ ctx[1].title;
    			if (dirty & /*searchedClaims*/ 1) searchedclaim_changes.claimLink = "/" + claimLinkPrefix + /*searchedClaim*/ ctx[1].id;
    			searchedclaim.$set(searchedclaim_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchedclaim.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchedclaim.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(searchedclaim, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(9:0) {#each searchedClaims as searchedClaim}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*searchedClaims*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(nodes);
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*searchedClaims, claimLinkPrefix*/ 1) {
    				each_value = /*searchedClaims*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SearchedClaims", slots, []);
    	
    	let searchedClaims = new Array();

    	claimSearchStore.subscribe(claimSearchValue => {
    		$$invalidate(0, searchedClaims = retreiveClaimsByClaimSearchValue(claimSearchValue));
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SearchedClaims> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		retreiveClaimsByClaimSearchValue,
    		claimSearchStore,
    		SearchedClaim,
    		claimLinkPrefix,
    		searchedClaims
    	});

    	$$self.$inject_state = $$props => {
    		if ("searchedClaims" in $$props) $$invalidate(0, searchedClaims = $$props.searchedClaims);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [searchedClaims];
    }

    class SearchedClaims extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchedClaims",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\ui\views\MainMenu\ClaimSearchView.svelte generated by Svelte v3.31.2 */
    const file$a = "src\\ui\\views\\MainMenu\\ClaimSearchView.svelte";

    function create_fragment$e(ctx) {
    	let main;
    	let searchedclaims;
    	let t0;
    	let footer;
    	let claimsearchbar;
    	let t1;
    	let backtomainmenulink;
    	let current;
    	searchedclaims = new SearchedClaims({ $$inline: true });
    	claimsearchbar = new ClaimSearchBar({ $$inline: true });
    	backtomainmenulink = new BackToMainMenuLink({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(searchedclaims.$$.fragment);
    			t0 = space();
    			footer = element("footer");
    			create_component(claimsearchbar.$$.fragment);
    			t1 = space();
    			create_component(backtomainmenulink.$$.fragment);
    			this.h();
    		},
    		l: function claim(nodes) {
    			main = claim_element(nodes, "MAIN", { class: true });
    			var main_nodes = children(main);
    			claim_component(searchedclaims.$$.fragment, main_nodes);
    			main_nodes.forEach(detach_dev);
    			t0 = claim_space(nodes);
    			footer = claim_element(nodes, "FOOTER", { class: true });
    			var footer_nodes = children(footer);
    			claim_component(claimsearchbar.$$.fragment, footer_nodes);
    			t1 = claim_space(footer_nodes);
    			claim_component(backtomainmenulink.$$.fragment, footer_nodes);
    			footer_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(main, "class", "flex-grow overflow-y-auto");
    			add_location(main, file$a, 4, 0, 270);
    			attr_dev(footer, "class", "flex flex-col mb-1");
    			add_location(footer, file$a, 7, 0, 344);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(searchedclaims, main, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, footer, anchor);
    			mount_component(claimsearchbar, footer, null);
    			append_dev(footer, t1);
    			mount_component(backtomainmenulink, footer, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchedclaims.$$.fragment, local);
    			transition_in(claimsearchbar.$$.fragment, local);
    			transition_in(backtomainmenulink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchedclaims.$$.fragment, local);
    			transition_out(claimsearchbar.$$.fragment, local);
    			transition_out(backtomainmenulink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(searchedclaims);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(footer);
    			destroy_component(claimsearchbar);
    			destroy_component(backtomainmenulink);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ClaimSearchView", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ClaimSearchView> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		ClaimSearchBar,
    		BackToMainMenuLink,
    		SearchedClaims
    	});

    	return [];
    }

    class ClaimSearchView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ClaimSearchView",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\ui\pages\MainMenu.svelte generated by Svelte v3.31.2 */

    // (10:0) {:else}
    function create_else_block$1(ctx) {
    	let claimsearchview;
    	let current;
    	claimsearchview = new ClaimSearchView({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(claimsearchview.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(claimsearchview.$$.fragment, nodes);
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
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(10:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (8:0) {#if $claimSearchStore === ''}
    function create_if_block$1(ctx) {
    	let welcomepageview;
    	let current;
    	welcomepageview = new WelcomePageView({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(welcomepageview.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(welcomepageview.$$.fragment, nodes);
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
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(8:0) {#if $claimSearchStore === ''}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let tailwindcss;
    	let t;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	tailwindcss = new Tailwindcss({ $$inline: true });
    	const if_block_creators = [create_if_block$1, create_else_block$1];
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
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			claim_component(tailwindcss.$$.fragment, nodes);
    			t = claim_space(nodes);
    			if_block.l(nodes);
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(tailwindcss, target, anchor);
    			insert_dev(target, t, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
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
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainMenu",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\ui\components\Titles\HeaderTitle.svelte generated by Svelte v3.31.2 */

    const file$b = "src\\ui\\components\\Titles\\HeaderTitle.svelte";

    function create_fragment$g(ctx) {
    	let h1;
    	let t;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t = text(/*title*/ ctx[0]);
    			this.h();
    		},
    		l: function claim(nodes) {
    			h1 = claim_element(nodes, "H1", { class: true });
    			var h1_nodes = children(h1);
    			t = claim_text(h1_nodes, /*title*/ ctx[0]);
    			h1_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h1, "class", "text-center my-1 text-2xl text-bangarang-darkEmphasis");
    			add_location(h1, file$b, 2, 0, 48);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("HeaderTitle", slots, []);
    	let { title } = $$props;
    	const writable_props = ["title"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<HeaderTitle> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    	};

    	$$self.$capture_state = () => ({ title });

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title];
    }

    class HeaderTitle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HeaderTitle",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !("title" in props)) {
    			console.warn("<HeaderTitle> was created without expected prop 'title'");
    		}
    	}

    	get title() {
    		throw new Error("<HeaderTitle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<HeaderTitle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\ui\components\Cards\DescriptionCard.svelte generated by Svelte v3.31.2 */
    const file$c = "src\\ui\\components\\Cards\\DescriptionCard.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (14:65) 
    function create_if_block_2(ctx) {
    	let p;
    	let t_value = /*descriptionCardContract*/ ctx[0].bulletPoints[0] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			this.h();
    		},
    		l: function claim(nodes) {
    			p = claim_element(nodes, "P", { class: true });
    			var p_nodes = children(p);
    			t = claim_text(p_nodes, t_value);
    			p_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(p, "class", "text-bangarang-darkEmphasis text-sm text-center");
    			add_location(p, file$c, 14, 4, 720);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*descriptionCardContract*/ 1 && t_value !== (t_value = /*descriptionCardContract*/ ctx[0].bulletPoints[0] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(14:65) ",
    		ctx
    	});

    	return block;
    }

    // (8:4) {#if descriptionCardContract.bulletPoints?.length > 1}
    function create_if_block_1$1(ctx) {
    	let ul;
    	let each_value_1 = /*descriptionCardContract*/ ctx[0].bulletPoints;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			this.h();
    		},
    		l: function claim(nodes) {
    			ul = claim_element(nodes, "UL", { class: true });
    			var ul_nodes = children(ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(ul_nodes);
    			}

    			ul_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(ul, "class", "list-disc list-inside");
    			add_location(ul, file$c, 8, 8, 417);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*descriptionCardContract*/ 1) {
    				each_value_1 = /*descriptionCardContract*/ ctx[0].bulletPoints;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(8:4) {#if descriptionCardContract.bulletPoints?.length > 1}",
    		ctx
    	});

    	return block;
    }

    // (10:12) {#each descriptionCardContract.bulletPoints as bulletPoint }
    function create_each_block_1(ctx) {
    	let li;
    	let t_value = /*bulletPoint*/ ctx[4] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			this.h();
    		},
    		l: function claim(nodes) {
    			li = claim_element(nodes, "LI", { class: true });
    			var li_nodes = children(li);
    			t = claim_text(li_nodes, t_value);
    			li_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(li, "class", "text-bangarang-darkEmphasis text-sm");
    			add_location(li, file$c, 10, 16, 543);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*descriptionCardContract*/ 1 && t_value !== (t_value = /*bulletPoint*/ ctx[4] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(10:12) {#each descriptionCardContract.bulletPoints as bulletPoint }",
    		ctx
    	});

    	return block;
    }

    // (17:4) {#if descriptionCardContract.links?.length > 0}
    function create_if_block$2(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*descriptionCardContract*/ ctx[0].links;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(nodes);
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*descriptionCardContract*/ 1) {
    				each_value = /*descriptionCardContract*/ ctx[0].links;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(17:4) {#if descriptionCardContract.links?.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (18:8) {#each descriptionCardContract.links as link}
    function create_each_block$1(ctx) {
    	let p;
    	let link;
    	let current;

    	link = new Link({
    			props: {
    				linkHref: /*link*/ ctx[1].href,
    				linkName: /*link*/ ctx[1].name,
    				size: "small"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			p = element("p");
    			create_component(link.$$.fragment);
    			this.h();
    		},
    		l: function claim(nodes) {
    			p = claim_element(nodes, "P", { class: true });
    			var p_nodes = children(p);
    			claim_component(link.$$.fragment, p_nodes);
    			p_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(p, "class", "text-center");
    			add_location(p, file$c, 18, 12, 957);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			mount_component(link, p, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};
    			if (dirty & /*descriptionCardContract*/ 1) link_changes.linkHref = /*link*/ ctx[1].href;
    			if (dirty & /*descriptionCardContract*/ 1) link_changes.linkName = /*link*/ ctx[1].name;
    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			destroy_component(link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(18:8) {#each descriptionCardContract.links as link}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let section;
    	let h2;
    	let t0_value = /*descriptionCardContract*/ ctx[0].title + "";
    	let t0;
    	let t1;
    	let p;
    	let t2_value = /*descriptionCardContract*/ ctx[0].description + "";
    	let t2;
    	let t3;
    	let t4;
    	let current;

    	function select_block_type(ctx, dirty) {
    		if (/*descriptionCardContract*/ ctx[0].bulletPoints?.length > 1) return create_if_block_1$1;
    		if (/*descriptionCardContract*/ ctx[0].bulletPoints?.length === 1) return create_if_block_2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type && current_block_type(ctx);
    	let if_block1 = /*descriptionCardContract*/ ctx[0].links?.length > 0 && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			p = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			if (if_block0) if_block0.c();
    			t4 = space();
    			if (if_block1) if_block1.c();
    			this.h();
    		},
    		l: function claim(nodes) {
    			section = claim_element(nodes, "SECTION", { class: true });
    			var section_nodes = children(section);
    			h2 = claim_element(section_nodes, "H2", { class: true });
    			var h2_nodes = children(h2);
    			t0 = claim_text(h2_nodes, t0_value);
    			h2_nodes.forEach(detach_dev);
    			t1 = claim_space(section_nodes);
    			p = claim_element(section_nodes, "P", { class: true });
    			var p_nodes = children(p);
    			t2 = claim_text(p_nodes, t2_value);
    			p_nodes.forEach(detach_dev);
    			t3 = claim_space(section_nodes);
    			if (if_block0) if_block0.l(section_nodes);
    			t4 = claim_space(section_nodes);
    			if (if_block1) if_block1.l(section_nodes);
    			section_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h2, "class", "text-bangarang-dark text-center");
    			add_location(h2, file$c, 5, 4, 143);
    			attr_dev(p, "class", "text-bangarang-darkEmphasis text-center font-light italic text-sm");
    			add_location(p, file$c, 6, 4, 229);
    			attr_dev(section, "class", "mb-2 p-1");
    			add_location(section, file$c, 4, 0, 111);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h2);
    			append_dev(h2, t0);
    			append_dev(section, t1);
    			append_dev(section, p);
    			append_dev(p, t2);
    			append_dev(section, t3);
    			if (if_block0) if_block0.m(section, null);
    			append_dev(section, t4);
    			if (if_block1) if_block1.m(section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*descriptionCardContract*/ 1) && t0_value !== (t0_value = /*descriptionCardContract*/ ctx[0].title + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*descriptionCardContract*/ 1) && t2_value !== (t2_value = /*descriptionCardContract*/ ctx[0].description + "")) set_data_dev(t2, t2_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if (if_block0) if_block0.d(1);
    				if_block0 = current_block_type && current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(section, t4);
    				}
    			}

    			if (/*descriptionCardContract*/ ctx[0].links?.length > 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*descriptionCardContract*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(section, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);

    			if (if_block0) {
    				if_block0.d();
    			}

    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("DescriptionCard", slots, []);
    	
    	let { descriptionCardContract } = $$props;
    	const writable_props = ["descriptionCardContract"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<DescriptionCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("descriptionCardContract" in $$props) $$invalidate(0, descriptionCardContract = $$props.descriptionCardContract);
    	};

    	$$self.$capture_state = () => ({ Link, descriptionCardContract });

    	$$self.$inject_state = $$props => {
    		if ("descriptionCardContract" in $$props) $$invalidate(0, descriptionCardContract = $$props.descriptionCardContract);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [descriptionCardContract];
    }

    class DescriptionCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { descriptionCardContract: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DescriptionCard",
    			options,
    			id: create_fragment$h.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*descriptionCardContract*/ ctx[0] === undefined && !("descriptionCardContract" in props)) {
    			console.warn("<DescriptionCard> was created without expected prop 'descriptionCardContract'");
    		}
    	}

    	get descriptionCardContract() {
    		throw new Error("<DescriptionCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set descriptionCardContract(value) {
    		throw new Error("<DescriptionCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\ui\pages\BusinessModel.svelte generated by Svelte v3.31.2 */
    const file$d = "src\\ui\\pages\\BusinessModel.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (33:4) {#each BusinessModelValues as businessModelValue }
    function create_each_block$2(ctx) {
    	let businessvaluesection;
    	let current;

    	businessvaluesection = new DescriptionCard({
    			props: {
    				descriptionCardContract: /*businessModelValue*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(businessvaluesection.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(businessvaluesection.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(businessvaluesection, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(businessvaluesection.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(businessvaluesection.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(businessvaluesection, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(33:4) {#each BusinessModelValues as businessModelValue }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let header;
    	let headertitle;
    	let t0;
    	let main;
    	let t1;
    	let footer;
    	let link0;
    	let t2;
    	let link1;
    	let current;

    	headertitle = new HeaderTitle({
    			props: { title: "Bangarang Business Model" },
    			$$inline: true
    		});

    	let each_value = /*BusinessModelValues*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	link0 = new Link({
    			props: {
    				size: "small",
    				linkName: "The Lean Canvas",
    				linkHref: links.leanCanvas
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				size: "small",
    				linkName: "Use Bangarang!",
    				linkHref: links.mainMenu
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			header = element("header");
    			create_component(headertitle.$$.fragment);
    			t0 = space();
    			main = element("main");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			footer = element("footer");
    			create_component(link0.$$.fragment);
    			t2 = space();
    			create_component(link1.$$.fragment);
    			this.h();
    		},
    		l: function claim(nodes) {
    			header = claim_element(nodes, "HEADER", { class: true });
    			var header_nodes = children(header);
    			claim_component(headertitle.$$.fragment, header_nodes);
    			header_nodes.forEach(detach_dev);
    			t0 = claim_space(nodes);
    			main = claim_element(nodes, "MAIN", { class: true });
    			var main_nodes = children(main);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(main_nodes);
    			}

    			main_nodes.forEach(detach_dev);
    			t1 = claim_space(nodes);
    			footer = claim_element(nodes, "FOOTER", { class: true });
    			var footer_nodes = children(footer);
    			claim_component(link0.$$.fragment, footer_nodes);
    			t2 = claim_space(footer_nodes);
    			claim_component(link1.$$.fragment, footer_nodes);
    			footer_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(header, "class", "flex flex-col");
    			add_location(header, file$d, 28, 0, 1748);
    			attr_dev(main, "class", "flex-grow overflow-y-auto");
    			add_location(main, file$d, 31, 0, 1844);
    			attr_dev(footer, "class", "flex flex-col mb-1");
    			add_location(footer, file$d, 36, 0, 2042);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			mount_component(headertitle, header, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			insert_dev(target, t1, anchor);
    			insert_dev(target, footer, anchor);
    			mount_component(link0, footer, null);
    			append_dev(footer, t2);
    			mount_component(link1, footer, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*BusinessModelValues*/ 1) {
    				each_value = /*BusinessModelValues*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(main, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(headertitle.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(headertitle.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(headertitle);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(footer);
    			destroy_component(link0);
    			destroy_component(link1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("BusinessModel", slots, []);
    	

    	const BusinessModelValues = [
    		{
    			title: "What is Banagang?",
    			description: "Bangarang is an open source and free democratic claim system that allow anybody to:",
    			bulletPoints: ["create a claim", "search for claims", "claiming anonymously"]
    		},
    		{
    			title: "Definition of Bangarang",
    			description: "",
    			bulletPoints: [
    				"Battle cry of the Lost Boys in the movie Hook.",
    				"Jamaican slang defined as a hubbub, uproar, disorder, or disturbance.",
    				"General exclamation meant to signify approval or amazement."
    			]
    		},
    		{
    			title: "Why this name?",
    			description: "",
    			bulletPoints: [
    				"Individuals act like Lost Boys. They are a family within each other. They also have strong spiritual and social beliefs. Furthermore, they are hard workers and want to help not only themselves but each other.",
    				"Organizations and leaders act like Pirates. They are looking for power and profit. They also have strong growth and control main beliefs. Not only that, but they are delegating work and want to help themselves and their partners.",
    				"The solution must act as a disturbance of current systems by providing lead to insectioniduals. But individuals must not have more lead each other.",
    				"By providing lead to individuals and guarantee this lead with equality, this should provide global amazement and systemic breakthrough"
    			]
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BusinessModel> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Link,
    		links,
    		HeaderTitle,
    		BusinessValueSection: DescriptionCard,
    		BusinessModelValues
    	});

    	return [BusinessModelValues];
    }

    class BusinessModel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BusinessModel",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src\ui\components\Titles\MainTitle.svelte generated by Svelte v3.31.2 */

    const file$e = "src\\ui\\components\\Titles\\MainTitle.svelte";

    function create_fragment$j(ctx) {
    	let h1;
    	let t;
    	let h1_class_value;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t = text(/*title*/ ctx[0]);
    			this.h();
    		},
    		l: function claim(nodes) {
    			h1 = claim_element(nodes, "H1", { class: true });
    			var h1_nodes = children(h1);
    			t = claim_text(h1_nodes, /*title*/ ctx[0]);
    			h1_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h1, "class", h1_class_value = "" + (/*headingTextSizeFromSize*/ ctx[2](/*size*/ ctx[1]) + " mt-4 text-bangarang-dark font-semibold text-center"));
    			add_location(h1, file$e, 8, 0, 204);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);

    			if (dirty & /*size*/ 2 && h1_class_value !== (h1_class_value = "" + (/*headingTextSizeFromSize*/ ctx[2](/*size*/ ctx[1]) + " mt-4 text-bangarang-dark font-semibold text-center"))) {
    				attr_dev(h1, "class", h1_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("MainTitle", slots, []);
    	let { title } = $$props;
    	let { size = "medium" } = $$props;

    	const headingTextSizeFromSize = size => {
    		if (size === "large") return "text-3xl";
    		return "text-xl";
    	};

    	const writable_props = ["title", "size"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MainTitle> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("size" in $$props) $$invalidate(1, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ title, size, headingTextSizeFromSize });

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("size" in $$props) $$invalidate(1, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, size, headingTextSizeFromSize];
    }

    class MainTitle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { title: 0, size: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainTitle",
    			options,
    			id: create_fragment$j.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !("title" in props)) {
    			console.warn("<MainTitle> was created without expected prop 'title'");
    		}
    	}

    	get title() {
    		throw new Error("<MainTitle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<MainTitle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<MainTitle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<MainTitle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const valuePropositionsDesignCanvas = [
        {
            audience: "Activist",
            customerJobs: [
                "You revendicate your ideas.",
                "You collectively commit to a cause.",
                "Your are pacifist."
            ],
            pains: [
                "You suffer too much violence during protest.",
                "You have to be disobedient.",
                "You die or you are hurt while you protest."
            ],
            painRelievers: [
                "You will claim from anyware.",
                "Does claiming from home is a disobedience?",
                "You will not claim by protesting anymore."
            ],
            productAndServices: ["Bangarang is an open source and free direct democratic claim system. It allows anybody to declare or search for claim and claiming for them anonymously."],
            gainCreators: [
                "You can claim whatever you want.",
                "You can change your mind.",
                "You have as much power as the others."
            ],
            gains: [
                "You can claim on what makes sense to you.",
                "You have the right like everyone else to make mistakes.",
                "You do direct democracy."
            ],
            pageLink: "activistValueProposition"
        },
        {
            audience: "Syndicalist",
            customerJobs: [
                "You defend your interests as a worker.",
                "You show solidarity with your colleagues.",
                "You struggle daily for immediate improvements in work but also for the disappearance of salaried workers and employers."
            ],
            pains: [
                "You are often divided.",
                "You are individualist.",
                "You die at work."
            ],
            painRelievers: [
                "You will claim on common causes.",
                "You will be free to claim without being unionized.",
                "We will make a strong claim on workplace safety."
            ],
            productAndServices: ["Bangarang is an open source and free direct democratic claim system. It allows anybody to declare or search for claim and claiming for them anonymously."],
            gainCreators: [
                "You are unified by the number but independent by your choices.",
                "You can change your mind.",
                "You can claim as much as your employer."
            ],
            gains: [
                "You and your colleagues will be more united.",
                "You have the right like everyone else to make mistakes.",
                "You greatly reduce the disparities between employers and employees."
            ],
            pageLink: "syndicalistValueProposition"
        },
        {
            audience: "Agile Team Member",
            customerJobs: [
                "We are uncovering better ways of developing software by doing it and helping others do it."
            ],
            pains: [
                "You have more process and tools instead of individuals and interactions.",
                "You have focus documentation instead of working software.",
                "You take lot of time on contract negotiation over customer collaboration.",
                "You have to follow THE PLAN instead of responding to change."
            ],
            painRelievers: [
                "You claim how the software should be.",
                "You claim the rule that documentation is optionnal but working software is mandatory.",
                "You claim NO ESTIMATE.",
                "You claim that customer feedback drive what must be done."
            ],
            productAndServices: ["Bangarang is an open source and free direct democratic claim system. It allows anybody to declare or search for claim and claiming for them anonymously."],
            gainCreators: [
                "Your software will be more focused on customer needs.",
                "Your business objectives will be reach with better results.",
                "You are owners of the product.",
                "Your customers satisfaction will be enhanced."
            ],
            gains: [
                "You value individuals and interactions over processes and tools",
                "You value a working software over comprehensive documentation",
                "You value customer collaboration over contract negotiation",
                "You value responding to change over following a plan"
            ],
            pageLink: "agileTeamMemberValueProposition"
        }
    ];

    /* src\ui\pages\LeanCanvas.svelte generated by Svelte v3.31.2 */
    const file$f = "src\\ui\\pages\\LeanCanvas.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (156:8) {#each leanCanvasPart.sections as section}
    function create_each_block_1$1(ctx) {
    	let descriptioncard;
    	let current;

    	descriptioncard = new DescriptionCard({
    			props: {
    				descriptionCardContract: /*section*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(descriptioncard.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(descriptioncard.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(descriptioncard, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(descriptioncard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(descriptioncard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(descriptioncard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(156:8) {#each leanCanvasPart.sections as section}",
    		ctx
    	});

    	return block;
    }

    // (154:4) {#each leanCanvas as leanCanvasPart}
    function create_each_block$3(ctx) {
    	let maintitle;
    	let t;
    	let each_1_anchor;
    	let current;

    	maintitle = new MainTitle({
    			props: {
    				title: /*leanCanvasPart*/ ctx[1].partName
    			},
    			$$inline: true
    		});

    	let each_value_1 = /*leanCanvasPart*/ ctx[1].sections;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			create_component(maintitle.$$.fragment);
    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			claim_component(maintitle.$$.fragment, nodes);
    			t = claim_space(nodes);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(nodes);
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(maintitle, target, anchor);
    			insert_dev(target, t, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*leanCanvas*/ 1) {
    				each_value_1 = /*leanCanvasPart*/ ctx[1].sections;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(maintitle.$$.fragment, local);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(maintitle.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(maintitle, detaching);
    			if (detaching) detach_dev(t);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(154:4) {#each leanCanvas as leanCanvasPart}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let header;
    	let headertitle;
    	let t0;
    	let main;
    	let t1;
    	let footer;
    	let link0;
    	let t2;
    	let link1;
    	let current;

    	headertitle = new HeaderTitle({
    			props: { title: "Bangarang Lean Canvas" },
    			$$inline: true
    		});

    	let each_value = /*leanCanvas*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	link0 = new Link({
    			props: {
    				size: "small",
    				linkName: "The Business Model",
    				linkHref: links.businessModel
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				size: "small",
    				linkName: "Use Bangarang!",
    				linkHref: links.mainMenu
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			header = element("header");
    			create_component(headertitle.$$.fragment);
    			t0 = space();
    			main = element("main");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			footer = element("footer");
    			create_component(link0.$$.fragment);
    			t2 = space();
    			create_component(link1.$$.fragment);
    			this.h();
    		},
    		l: function claim(nodes) {
    			header = claim_element(nodes, "HEADER", { class: true });
    			var header_nodes = children(header);
    			claim_component(headertitle.$$.fragment, header_nodes);
    			header_nodes.forEach(detach_dev);
    			t0 = claim_space(nodes);
    			main = claim_element(nodes, "MAIN", { class: true });
    			var main_nodes = children(main);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(main_nodes);
    			}

    			main_nodes.forEach(detach_dev);
    			t1 = claim_space(nodes);
    			footer = claim_element(nodes, "FOOTER", { class: true });
    			var footer_nodes = children(footer);
    			claim_component(link0.$$.fragment, footer_nodes);
    			t2 = claim_space(footer_nodes);
    			claim_component(link1.$$.fragment, footer_nodes);
    			footer_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(header, "class", "flex flex-col");
    			add_location(header, file$f, 149, 0, 5423);
    			attr_dev(main, "class", "flex-grow overflow-y-auto");
    			add_location(main, file$f, 152, 0, 5516);
    			attr_dev(footer, "class", "flex flex-col");
    			add_location(footer, file$f, 160, 0, 5811);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			mount_component(headertitle, header, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			insert_dev(target, t1, anchor);
    			insert_dev(target, footer, anchor);
    			mount_component(link0, footer, null);
    			append_dev(footer, t2);
    			mount_component(link1, footer, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*leanCanvas*/ 1) {
    				each_value = /*leanCanvas*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(main, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(headertitle.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(headertitle.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(headertitle);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(footer);
    			destroy_component(link0);
    			destroy_component(link1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("LeanCanvas", slots, []);
    	

    	const leanCanvas = [
    		{
    			partName: "Customers",
    			sections: [
    				{
    					title: "Customer Segments",
    					description: "List of target customers and users.",
    					bulletPoints: ["Anyone that want to give his opinion about a subject."]
    				},
    				{
    					title: "Early Adopters",
    					description: "Characteristics list of ideal customers.",
    					bulletPoints: ["Syndicates", "Activits", "Team members where there is lot of control"],
    					links: valuePropositionsDesignCanvas.map(valuePropositionDesignCanvas => ({
    						name: `Are you a ${valuePropositionDesignCanvas.audience.toLocaleLowerCase()}?`,
    						href: valuePropositionDesignCanvas.pageLink
    					}))
    				}
    			]
    		},
    		{
    			partName: "Problem",
    			sections: [
    				{
    					title: "",
    					description: "List your customer's top 3 problems",
    					bulletPoints: [
    						"Individuals can't give their opinion anonymously.",
    						"Individuals can't give their opinion for subjects that matters to them.",
    						"Individuals can't pay for giving their opinion.",
    						"Individuals don't want to move for giving their opinion."
    					]
    				}
    			]
    		},
    		{
    			partName: "Unique Value Proposition",
    			sections: [
    				{
    					title: "",
    					description: "Single, clear, compelling message that states why Bangarang is different and worth paying attention.",
    					bulletPoints: [
    						"Provide people sovereignty.",
    						"Improve human rights: freedom, equality & justice for all.",
    						"Remove power & authority.",
    						"Solution with energy efficiency by design."
    					]
    				}
    			]
    		},
    		{
    			partName: "Solution",
    			sections: [
    				{
    					title: "",
    					description: "Top features.",
    					bulletPoints: [
    						"Users can interact with Claims.",
    						"User actions are only tracked at the user level.",
    						"Anyone can subscribe.",
    						"Free."
    					]
    				}
    			]
    		},
    		{
    			partName: "Channels",
    			sections: [
    				{
    					title: "",
    					description: "Path list to customers.",
    					bulletPoints: [
    						"YouTube - Daily Marketing Videos.",
    						"Responce to daily news.",
    						"Dev/Marketing Transparant Streaming."
    					]
    				}
    			]
    		},
    		{
    			partName: "Revenue Streams",
    			sections: [
    				{
    					title: "",
    					description: "Sources of revenue list.",
    					bulletPoints: [
    						"++ User Support in exchange of being part of credits",
    						"-- Organisation Support in exchange of being part of credits",
    						"---- Paid features (money give advantage / power)"
    					]
    				}
    			]
    		},
    		{
    			partName: "Cost Structure",
    			sections: [
    				{
    					title: "",
    					description: "Fixed and variable costs list.",
    					bulletPoints: [
    						"One producter > Me > self financing for 7 months 2 days per week > full time 80k/yr and decreasing.",
    						"Additionnal producters > bonus or maybe free help > not needed on early stage.",
    						"Infrastructure cost > not needed on early stage.",
    						"Organizations financial/political/marketing aggressivity."
    					]
    				}
    			]
    		},
    		{
    			partName: "Key Metrics",
    			sections: [
    				{
    					title: "",
    					description: "Key activities Bangarang measure.",
    					bulletPoints: [
    						"Daily votes/ballot.",
    						"HOT votes/ballot.",
    						"Organisations that are not supporting us :).",
    						"People not already registered/voting for HOT vote :)."
    					]
    				}
    			]
    		},
    		{
    			partName: "Unfair Advantage",
    			sections: [
    				{
    					title: "",
    					description: "Can't be easily copied or bought.",
    					bulletPoints: [
    						"Open Source / Transparancy.",
    						"Free of use.",
    						"Not fully skilled but can do it.",
    						"Crazy Dude with crazy ideas :).",
    						"Cost effective."
    					]
    				}
    			]
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LeanCanvas> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Link,
    		links,
    		HeaderTitle,
    		MainTitle,
    		DescriptionCard,
    		valuePropositionsDesignCanvas,
    		leanCanvas
    	});

    	return [leanCanvas];
    }

    class LeanCanvas extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LeanCanvas",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src\ui\components\Lists\ValuePropositionDesignCanvasList.svelte generated by Svelte v3.31.2 */

    const { Object: Object_1 } = globals;
    const file$g = "src\\ui\\components\\Lists\\ValuePropositionDesignCanvasList.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i][0];
    	child_ctx[4] = list[i][1];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (22:4) {#if type !== "audience" && type !== "pageLink" && Array.isArray(contents) && contents.length > 0}
    function create_if_block$3(ctx) {
    	let section;
    	let h1;
    	let t0_value = /*retrieveSubTitleFromType*/ ctx[1](/*type*/ ctx[3]).toLocaleUpperCase() + "";
    	let t0;
    	let t1;
    	let t2;

    	function select_block_type(ctx, dirty) {
    		if (/*contents*/ ctx[4].length > 1) return create_if_block_1$2;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			if_block.c();
    			t2 = space();
    			this.h();
    		},
    		l: function claim(nodes) {
    			section = claim_element(nodes, "SECTION", {});
    			var section_nodes = children(section);
    			h1 = claim_element(section_nodes, "H1", { class: true });
    			var h1_nodes = children(h1);
    			t0 = claim_text(h1_nodes, t0_value);
    			h1_nodes.forEach(detach_dev);
    			t1 = claim_space(section_nodes);
    			if_block.l(section_nodes);
    			t2 = claim_space(section_nodes);
    			section_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h1, "class", "text-sm mt-4 mb-1 text-bangarang-darkEmphasis font-semibold text-center");
    			add_location(h1, file$g, 23, 12, 849);
    			add_location(section, file$g, 22, 8, 826);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(h1, t0);
    			append_dev(section, t1);
    			if_block.m(section, null);
    			append_dev(section, t2);
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(22:4) {#if type !== \\\"audience\\\" && type !== \\\"pageLink\\\" && Array.isArray(contents) && contents.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (31:12) {:else}
    function create_else_block$2(ctx) {
    	let p;
    	let t_value = /*contents*/ ctx[4][0] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			this.h();
    		},
    		l: function claim(nodes) {
    			p = claim_element(nodes, "P", { class: true });
    			var p_nodes = children(p);
    			t = claim_text(p_nodes, t_value);
    			p_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(p, "class", "text-bangarang-darkEmphasis text-sm text-center");
    			add_location(p, file$g, 31, 16, 1310);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(31:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (25:12) {#if contents.length > 1 }
    function create_if_block_1$2(ctx) {
    	let ul;
    	let each_value_1 = /*contents*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			this.h();
    		},
    		l: function claim(nodes) {
    			ul = claim_element(nodes, "UL", { class: true });
    			var ul_nodes = children(ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(ul_nodes);
    			}

    			ul_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(ul, "class", "list-disc list-inside");
    			add_location(ul, file$g, 25, 16, 1048);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sections*/ 1) {
    				each_value_1 = /*contents*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(25:12) {#if contents.length > 1 }",
    		ctx
    	});

    	return block;
    }

    // (27:20) {#each contents as content}
    function create_each_block_1$2(ctx) {
    	let li;
    	let t_value = /*content*/ ctx[7] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			this.h();
    		},
    		l: function claim(nodes) {
    			li = claim_element(nodes, "LI", { class: true });
    			var li_nodes = children(li);
    			t = claim_text(li_nodes, t_value);
    			li_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(li, "class", "text-bangarang-darkEmphasis text-sm");
    			add_location(li, file$g, 27, 24, 1157);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(27:20) {#each contents as content}",
    		ctx
    	});

    	return block;
    }

    // (21:0) {#each sections as [type,contents] }
    function create_each_block$4(ctx) {
    	let show_if = /*type*/ ctx[3] !== "audience" && /*type*/ ctx[3] !== "pageLink" && Array.isArray(/*contents*/ ctx[4]) && /*contents*/ ctx[4].length > 0;
    	let if_block_anchor;
    	let if_block = show_if && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			if (if_block) if_block.l(nodes);
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (show_if) if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(21:0) {#each sections as [type,contents] }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let each_1_anchor;
    	let each_value = /*sections*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(nodes);
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*sections, retrieveSubTitleFromType, Array*/ 3) {
    				each_value = /*sections*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ValuePropositionDesignCanvasList", slots, []);
    	
    	let { valuePropositionDesignCanvas } = $$props;
    	const sections = Object.entries(valuePropositionDesignCanvas);

    	const retrieveSubTitleFromType = type => {
    		if (type === "customerJobs") return `You have activities`;
    		if (type === "pains") return `But you have pains`;
    		if (type === "painRelievers") return `We want to help you`;
    		if (type === "productAndServices") return `We have a solution`;
    		if (type === "gainCreators") return `We provide additionnal capabilities`;
    		if (type === "gains") return `You can acheive more`;
    		return `!!!ERROR UNKNOWN TYPE!!!`;
    	};

    	const writable_props = ["valuePropositionDesignCanvas"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ValuePropositionDesignCanvasList> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("valuePropositionDesignCanvas" in $$props) $$invalidate(2, valuePropositionDesignCanvas = $$props.valuePropositionDesignCanvas);
    	};

    	$$self.$capture_state = () => ({
    		valuePropositionDesignCanvas,
    		sections,
    		retrieveSubTitleFromType
    	});

    	$$self.$inject_state = $$props => {
    		if ("valuePropositionDesignCanvas" in $$props) $$invalidate(2, valuePropositionDesignCanvas = $$props.valuePropositionDesignCanvas);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [sections, retrieveSubTitleFromType, valuePropositionDesignCanvas];
    }

    class ValuePropositionDesignCanvasList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { valuePropositionDesignCanvas: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ValuePropositionDesignCanvasList",
    			options,
    			id: create_fragment$l.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*valuePropositionDesignCanvas*/ ctx[2] === undefined && !("valuePropositionDesignCanvas" in props)) {
    			console.warn("<ValuePropositionDesignCanvasList> was created without expected prop 'valuePropositionDesignCanvas'");
    		}
    	}

    	get valuePropositionDesignCanvas() {
    		throw new Error("<ValuePropositionDesignCanvasList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valuePropositionDesignCanvas(value) {
    		throw new Error("<ValuePropositionDesignCanvasList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\ui\pages\ValuePropositionModel.svelte generated by Svelte v3.31.2 */
    const file$h = "src\\ui\\pages\\ValuePropositionModel.svelte";

    function create_fragment$m(ctx) {
    	let header;
    	let headertitle;
    	let t0;
    	let main;
    	let valuepropositiondesigncanvas;
    	let t1;
    	let footer;
    	let link0;
    	let t2;
    	let link1;
    	let current;

    	headertitle = new HeaderTitle({
    			props: {
    				title: "" + (/*valuePropositionDesignCanvas*/ ctx[0].audience + " Value Proposition")
    			},
    			$$inline: true
    		});

    	valuepropositiondesigncanvas = new ValuePropositionDesignCanvasList({
    			props: {
    				valuePropositionDesignCanvas: /*valuePropositionDesignCanvas*/ ctx[0]
    			},
    			$$inline: true
    		});

    	link0 = new Link({
    			props: {
    				size: "small",
    				linkName: "The Lean Canvas",
    				linkHref: links.leanCanvas
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				size: "small",
    				linkName: "Use Bangarang!",
    				linkHref: links.mainMenu
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			header = element("header");
    			create_component(headertitle.$$.fragment);
    			t0 = space();
    			main = element("main");
    			create_component(valuepropositiondesigncanvas.$$.fragment);
    			t1 = space();
    			footer = element("footer");
    			create_component(link0.$$.fragment);
    			t2 = space();
    			create_component(link1.$$.fragment);
    			this.h();
    		},
    		l: function claim(nodes) {
    			header = claim_element(nodes, "HEADER", { class: true });
    			var header_nodes = children(header);
    			claim_component(headertitle.$$.fragment, header_nodes);
    			header_nodes.forEach(detach_dev);
    			t0 = claim_space(nodes);
    			main = claim_element(nodes, "MAIN", { class: true });
    			var main_nodes = children(main);
    			claim_component(valuepropositiondesigncanvas.$$.fragment, main_nodes);
    			main_nodes.forEach(detach_dev);
    			t1 = claim_space(nodes);
    			footer = claim_element(nodes, "FOOTER", { class: true });
    			var footer_nodes = children(footer);
    			claim_component(link0.$$.fragment, footer_nodes);
    			t2 = claim_space(footer_nodes);
    			claim_component(link1.$$.fragment, footer_nodes);
    			footer_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(header, "class", "flex flex-col");
    			add_location(header, file$h, 7, 0, 343);
    			attr_dev(main, "class", "flex-grow overflow-y-auto");
    			add_location(main, file$h, 10, 0, 472);
    			attr_dev(footer, "class", "flex flex-col");
    			add_location(footer, file$h, 13, 0, 592);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			mount_component(headertitle, header, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(valuepropositiondesigncanvas, main, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, footer, anchor);
    			mount_component(link0, footer, null);
    			append_dev(footer, t2);
    			mount_component(link1, footer, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const headertitle_changes = {};
    			if (dirty & /*valuePropositionDesignCanvas*/ 1) headertitle_changes.title = "" + (/*valuePropositionDesignCanvas*/ ctx[0].audience + " Value Proposition");
    			headertitle.$set(headertitle_changes);
    			const valuepropositiondesigncanvas_changes = {};
    			if (dirty & /*valuePropositionDesignCanvas*/ 1) valuepropositiondesigncanvas_changes.valuePropositionDesignCanvas = /*valuePropositionDesignCanvas*/ ctx[0];
    			valuepropositiondesigncanvas.$set(valuepropositiondesigncanvas_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(headertitle.$$.fragment, local);
    			transition_in(valuepropositiondesigncanvas.$$.fragment, local);
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(headertitle.$$.fragment, local);
    			transition_out(valuepropositiondesigncanvas.$$.fragment, local);
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(headertitle);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(valuepropositiondesigncanvas);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(footer);
    			destroy_component(link0);
    			destroy_component(link1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ValuePropositionModel", slots, []);
    	
    	let { valuePropositionDesignCanvas } = $$props;
    	const writable_props = ["valuePropositionDesignCanvas"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ValuePropositionModel> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("valuePropositionDesignCanvas" in $$props) $$invalidate(0, valuePropositionDesignCanvas = $$props.valuePropositionDesignCanvas);
    	};

    	$$self.$capture_state = () => ({
    		Link,
    		links,
    		HeaderTitle,
    		ValuePropositionDesignCanvas: ValuePropositionDesignCanvasList,
    		valuePropositionDesignCanvas
    	});

    	$$self.$inject_state = $$props => {
    		if ("valuePropositionDesignCanvas" in $$props) $$invalidate(0, valuePropositionDesignCanvas = $$props.valuePropositionDesignCanvas);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [valuePropositionDesignCanvas];
    }

    class ValuePropositionModel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { valuePropositionDesignCanvas: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ValuePropositionModel",
    			options,
    			id: create_fragment$m.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*valuePropositionDesignCanvas*/ ctx[0] === undefined && !("valuePropositionDesignCanvas" in props)) {
    			console.warn("<ValuePropositionModel> was created without expected prop 'valuePropositionDesignCanvas'");
    		}
    	}

    	get valuePropositionDesignCanvas() {
    		throw new Error("<ValuePropositionModel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valuePropositionDesignCanvas(value) {
    		throw new Error("<ValuePropositionModel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\ui\components\Titles\MainSubTitle.svelte generated by Svelte v3.31.2 */

    const file$i = "src\\ui\\components\\Titles\\MainSubTitle.svelte";

    function create_fragment$n(ctx) {
    	let h1;
    	let t;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t = text(/*title*/ ctx[0]);
    			this.h();
    		},
    		l: function claim(nodes) {
    			h1 = claim_element(nodes, "H1", { class: true });
    			var h1_nodes = children(h1);
    			t = claim_text(h1_nodes, /*title*/ ctx[0]);
    			h1_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h1, "class", "text-xl mt-4 text-bangarang-darkEmphasis font-semibold text-center");
    			add_location(h1, file$i, 2, 0, 48);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("MainSubTitle", slots, []);
    	let { title } = $$props;
    	const writable_props = ["title"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MainSubTitle> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    	};

    	$$self.$capture_state = () => ({ title });

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title];
    }

    class MainSubTitle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainSubTitle",
    			options,
    			id: create_fragment$n.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !("title" in props)) {
    			console.warn("<MainSubTitle> was created without expected prop 'title'");
    		}
    	}

    	get title() {
    		throw new Error("<MainSubTitle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<MainSubTitle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\ui\components\Buttons\GenericButton.svelte generated by Svelte v3.31.2 */

    const file$j = "src\\ui\\components\\Buttons\\GenericButton.svelte";

    function create_fragment$o(ctx) {
    	let button;
    	let t;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(/*textbutton*/ ctx[0]);
    			this.h();
    		},
    		l: function claim(nodes) {
    			button = claim_element(nodes, "BUTTON", { class: true });
    			var button_nodes = children(button);
    			t = claim_text(button_nodes, /*textbutton*/ ctx[0]);
    			button_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(button, "class", button_class_value = "" + (/*textSizeFromSize*/ ctx[4](/*size*/ ctx[1]) + " " + /*marginTopFromSize*/ ctx[5](/*size*/ ctx[1]) + " " + /*width*/ ctx[3] + "  my-1 px-1 pb-1 text-bangarang-dark border border-bangarang-darkEmphasis rounded-md bg-bangarang-lightEmphasis"));
    			add_location(button, file$j, 15, 0, 377);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*onClickAction*/ ctx[2])) /*onClickAction*/ ctx[2].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (dirty & /*textbutton*/ 1) set_data_dev(t, /*textbutton*/ ctx[0]);

    			if (dirty & /*size, width*/ 10 && button_class_value !== (button_class_value = "" + (/*textSizeFromSize*/ ctx[4](/*size*/ ctx[1]) + " " + /*marginTopFromSize*/ ctx[5](/*size*/ ctx[1]) + " " + /*width*/ ctx[3] + "  my-1 px-1 pb-1 text-bangarang-dark border border-bangarang-darkEmphasis rounded-md bg-bangarang-lightEmphasis"))) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("GenericButton", slots, []);
    	let { textbutton = "CLICK ME!" } = $$props;
    	let { size = "medium" } = $$props;
    	let { onClickAction } = $$props;
    	let { width = "" } = $$props;

    	const textSizeFromSize = size => {
    		if (size === "large") return "text-3xl";
    		return "text-xl";
    	};

    	const marginTopFromSize = size => {
    		if (size === "large") return "mt-4";
    		return "";
    	};

    	const writable_props = ["textbutton", "size", "onClickAction", "width"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<GenericButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("textbutton" in $$props) $$invalidate(0, textbutton = $$props.textbutton);
    		if ("size" in $$props) $$invalidate(1, size = $$props.size);
    		if ("onClickAction" in $$props) $$invalidate(2, onClickAction = $$props.onClickAction);
    		if ("width" in $$props) $$invalidate(3, width = $$props.width);
    	};

    	$$self.$capture_state = () => ({
    		textbutton,
    		size,
    		onClickAction,
    		width,
    		textSizeFromSize,
    		marginTopFromSize
    	});

    	$$self.$inject_state = $$props => {
    		if ("textbutton" in $$props) $$invalidate(0, textbutton = $$props.textbutton);
    		if ("size" in $$props) $$invalidate(1, size = $$props.size);
    		if ("onClickAction" in $$props) $$invalidate(2, onClickAction = $$props.onClickAction);
    		if ("width" in $$props) $$invalidate(3, width = $$props.width);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [textbutton, size, onClickAction, width, textSizeFromSize, marginTopFromSize];
    }

    class GenericButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {
    			textbutton: 0,
    			size: 1,
    			onClickAction: 2,
    			width: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GenericButton",
    			options,
    			id: create_fragment$o.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onClickAction*/ ctx[2] === undefined && !("onClickAction" in props)) {
    			console.warn("<GenericButton> was created without expected prop 'onClickAction'");
    		}
    	}

    	get textbutton() {
    		throw new Error("<GenericButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set textbutton(value) {
    		throw new Error("<GenericButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<GenericButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<GenericButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClickAction() {
    		throw new Error("<GenericButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClickAction(value) {
    		throw new Error("<GenericButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<GenericButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<GenericButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\ui\pages\LandingPageModel.svelte generated by Svelte v3.31.2 */
    const file$k = "src\\ui\\pages\\LandingPageModel.svelte";

    // (11:4) {#if mainHeadLine}
    function create_if_block_1$3(ctx) {
    	let maintitle;
    	let current;

    	maintitle = new MainTitle({
    			props: {
    				title: /*mainHeadLine*/ ctx[0],
    				size: "large"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(maintitle.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(maintitle.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(maintitle, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const maintitle_changes = {};
    			if (dirty & /*mainHeadLine*/ 1) maintitle_changes.title = /*mainHeadLine*/ ctx[0];
    			maintitle.$set(maintitle_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(maintitle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(maintitle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(maintitle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(11:4) {#if mainHeadLine}",
    		ctx
    	});

    	return block;
    }

    // (14:4) {#if supportingHeadline}
    function create_if_block$4(ctx) {
    	let mainsubtitle;
    	let current;

    	mainsubtitle = new MainSubTitle({
    			props: {
    				title: `Try Bangarang and ${/*supportingHeadline*/ ctx[1].toLocaleLowerCase()}`
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(mainsubtitle.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(mainsubtitle.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(mainsubtitle, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const mainsubtitle_changes = {};
    			if (dirty & /*supportingHeadline*/ 2) mainsubtitle_changes.title = `Try Bangarang and ${/*supportingHeadline*/ ctx[1].toLocaleLowerCase()}`;
    			mainsubtitle.$set(mainsubtitle_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mainsubtitle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mainsubtitle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mainsubtitle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(14:4) {#if supportingHeadline}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let main;
    	let t0;
    	let t1;
    	let genericbutton;
    	let current;
    	let if_block0 = /*mainHeadLine*/ ctx[0] && create_if_block_1$3(ctx);
    	let if_block1 = /*supportingHeadline*/ ctx[1] && create_if_block$4(ctx);

    	genericbutton = new GenericButton({
    			props: {
    				textbutton: "Try Now!",
    				size: "large",
    				onClickAction: /*navigateToBangarang*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			create_component(genericbutton.$$.fragment);
    			this.h();
    		},
    		l: function claim(nodes) {
    			main = claim_element(nodes, "MAIN", { class: true });
    			var main_nodes = children(main);
    			if (if_block0) if_block0.l(main_nodes);
    			t0 = claim_space(main_nodes);
    			if (if_block1) if_block1.l(main_nodes);
    			t1 = claim_space(main_nodes);
    			claim_component(genericbutton.$$.fragment, main_nodes);
    			main_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(main, "class", "flex-grow overflow-y-auto flex flex-col items-center justify-center");
    			add_location(main, file$k, 9, 0, 442);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t0);
    			if (if_block1) if_block1.m(main, null);
    			append_dev(main, t1);
    			mount_component(genericbutton, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*mainHeadLine*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*mainHeadLine*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(main, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*supportingHeadline*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*supportingHeadline*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$4(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(main, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(genericbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(genericbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(genericbutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("LandingPageModel", slots, []);
    	let { mainHeadLine } = $$props;
    	let { supportingHeadline } = $$props;
    	const navigateToBangarang = () => navigate(links.mainMenu);
    	const writable_props = ["mainHeadLine", "supportingHeadline"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LandingPageModel> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("mainHeadLine" in $$props) $$invalidate(0, mainHeadLine = $$props.mainHeadLine);
    		if ("supportingHeadline" in $$props) $$invalidate(1, supportingHeadline = $$props.supportingHeadline);
    	};

    	$$self.$capture_state = () => ({
    		MainTitle,
    		MainSubTitle,
    		GenericButton,
    		navigate,
    		links,
    		mainHeadLine,
    		supportingHeadline,
    		navigateToBangarang
    	});

    	$$self.$inject_state = $$props => {
    		if ("mainHeadLine" in $$props) $$invalidate(0, mainHeadLine = $$props.mainHeadLine);
    		if ("supportingHeadline" in $$props) $$invalidate(1, supportingHeadline = $$props.supportingHeadline);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [mainHeadLine, supportingHeadline, navigateToBangarang];
    }

    class LandingPageModel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { mainHeadLine: 0, supportingHeadline: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LandingPageModel",
    			options,
    			id: create_fragment$p.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*mainHeadLine*/ ctx[0] === undefined && !("mainHeadLine" in props)) {
    			console.warn("<LandingPageModel> was created without expected prop 'mainHeadLine'");
    		}

    		if (/*supportingHeadline*/ ctx[1] === undefined && !("supportingHeadline" in props)) {
    			console.warn("<LandingPageModel> was created without expected prop 'supportingHeadline'");
    		}
    	}

    	get mainHeadLine() {
    		throw new Error("<LandingPageModel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mainHeadLine(value) {
    		throw new Error("<LandingPageModel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get supportingHeadline() {
    		throw new Error("<LandingPageModel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set supportingHeadline(value) {
    		throw new Error("<LandingPageModel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\ui\components\Links\ClaimShare.svelte generated by Svelte v3.31.2 */

    const file$l = "src\\ui\\components\\Links\\ClaimShare.svelte";

    // (17:8) {#if URICopyToClipboardError !== undefined}
    function create_if_block_1$4(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*URICopyToClipboardError*/ ctx[1].message + "";
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Failed to copy claim address to clipboard: ");
    			t1 = text(t1_value);
    			this.h();
    		},
    		l: function claim(nodes) {
    			p = claim_element(nodes, "P", { class: true });
    			var p_nodes = children(p);
    			t0 = claim_text(p_nodes, "Failed to copy claim address to clipboard: ");
    			t1 = claim_text(p_nodes, t1_value);
    			p_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(p, "class", "text-center text-xs text-bangarang-failed");
    			add_location(p, file$l, 17, 8, 768);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*URICopyToClipboardError*/ 2 && t1_value !== (t1_value = /*URICopyToClipboardError*/ ctx[1].message + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(17:8) {#if URICopyToClipboardError !== undefined}",
    		ctx
    	});

    	return block;
    }

    // (14:4) {#if URICopiedToClipboard}
    function create_if_block$5(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text("Claim address copied to clipboard.");
    			this.h();
    		},
    		l: function claim(nodes) {
    			p = claim_element(nodes, "P", { class: true });
    			var p_nodes = children(p);
    			t = claim_text(p_nodes, "Claim address copied to clipboard.");
    			p_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(p, "class", "text-center text-xs text-bangarang-success");
    			add_location(p, file$l, 14, 8, 600);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(14:4) {#if URICopiedToClipboard}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
    	let section;
    	let p;
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*URICopiedToClipboard*/ ctx[0]) return create_if_block$5;
    		if (/*URICopyToClipboardError*/ ctx[1] !== undefined) return create_if_block_1$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			p = element("p");
    			t0 = text("Would you like to share this claim?");
    			t1 = space();
    			if (if_block) if_block.c();
    			this.h();
    		},
    		l: function claim(nodes) {
    			section = claim_element(nodes, "SECTION", { class: true });
    			var section_nodes = children(section);
    			p = claim_element(section_nodes, "P", { class: true });
    			var p_nodes = children(p);
    			t0 = claim_text(p_nodes, "Would you like to share this claim?");
    			p_nodes.forEach(detach_dev);
    			t1 = claim_space(section_nodes);
    			if (if_block) if_block.l(section_nodes);
    			section_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(p, "class", "text-center underline text-sm text-bangarang-darkEmphasis cursor-pointer");
    			add_location(p, file$l, 12, 4, 405);
    			attr_dev(section, "class", "mb-2");
    			add_location(section, file$l, 11, 0, 377);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, p);
    			append_dev(p, t0);
    			append_dev(section, t1);
    			if (if_block) if_block.m(section, null);

    			if (!mounted) {
    				dispose = listen_dev(p, "click", /*copyUriToClipboard*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(section, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);

    			if (if_block) {
    				if_block.d();
    			}

    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ClaimShare", slots, []);

    	const copyUriToClipboard = () => {
    		navigator.clipboard.writeText(window.location.href).then(() => {
    			$$invalidate(0, URICopiedToClipboard = true);
    		}).catch(error => {
    			$$invalidate(0, URICopiedToClipboard = false);
    			$$invalidate(1, URICopyToClipboardError = error);
    		});
    	};

    	let URICopiedToClipboard = false;
    	let URICopyToClipboardError = undefined;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ClaimShare> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		copyUriToClipboard,
    		URICopiedToClipboard,
    		URICopyToClipboardError
    	});

    	$$self.$inject_state = $$props => {
    		if ("URICopiedToClipboard" in $$props) $$invalidate(0, URICopiedToClipboard = $$props.URICopiedToClipboard);
    		if ("URICopyToClipboardError" in $$props) $$invalidate(1, URICopyToClipboardError = $$props.URICopyToClipboardError);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [URICopiedToClipboard, URICopyToClipboardError, copyUriToClipboard];
    }

    class ClaimShare extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ClaimShare",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    }

    /* src\ui\components\Footers\ClaimFooter.svelte generated by Svelte v3.31.2 */
    const file$m = "src\\ui\\components\\Footers\\ClaimFooter.svelte";

    function create_fragment$r(ctx) {
    	let footer;
    	let claimshare;
    	let t;
    	let link;
    	let current;
    	claimshare = new ClaimShare({ $$inline: true });

    	link = new Link({
    			props: {
    				size: "small",
    				linkHref: links.mainMenu,
    				linkName: "<< Back to main menu.",
    				textAlign: "text-left"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			create_component(claimshare.$$.fragment);
    			t = space();
    			create_component(link.$$.fragment);
    			this.h();
    		},
    		l: function claim(nodes) {
    			footer = claim_element(nodes, "FOOTER", { class: true });
    			var footer_nodes = children(footer);
    			claim_component(claimshare.$$.fragment, footer_nodes);
    			t = claim_space(footer_nodes);
    			claim_component(link.$$.fragment, footer_nodes);
    			footer_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(footer, "class", "flex flex-col");
    			add_location(footer, file$m, 4, 0, 171);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			mount_component(claimshare, footer, null);
    			append_dev(footer, t);
    			mount_component(link, footer, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(claimshare.$$.fragment, local);
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(claimshare.$$.fragment, local);
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			destroy_component(claimshare);
    			destroy_component(link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ClaimFooter", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ClaimFooter> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link, links, ClaimShare });
    	return [];
    }

    class ClaimFooter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ClaimFooter",
    			options,
    			id: create_fragment$r.name
    		});
    	}
    }

    /* src\ui\components\Headers\ClaimHeader.svelte generated by Svelte v3.31.2 */

    const file$n = "src\\ui\\components\\Headers\\ClaimHeader.svelte";

    function create_fragment$s(ctx) {
    	let header;
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			header = element("header");
    			p = element("p");
    			t = text(/*title*/ ctx[0]);
    			this.h();
    		},
    		l: function claim(nodes) {
    			header = claim_element(nodes, "HEADER", { class: true });
    			var header_nodes = children(header);
    			p = claim_element(header_nodes, "P", { class: true });
    			var p_nodes = children(p);
    			t = claim_text(p_nodes, /*title*/ ctx[0]);
    			p_nodes.forEach(detach_dev);
    			header_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(p, "class", " self-center text-center text-bangarang-darkEmphasis");
    			add_location(p, file$n, 3, 4, 131);
    			attr_dev(header, "class", "flex-grow overflow-y-auto flex flex-col place-content-center");
    			add_location(header, file$n, 2, 0, 48);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, p);
    			append_dev(p, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ClaimHeader", slots, []);
    	let { title } = $$props;
    	const writable_props = ["title"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ClaimHeader> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    	};

    	$$self.$capture_state = () => ({ title });

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title];
    }

    class ClaimHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ClaimHeader",
    			options,
    			id: create_fragment$s.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !("title" in props)) {
    			console.warn("<ClaimHeader> was created without expected prop 'title'");
    		}
    	}

    	get title() {
    		throw new Error("<ClaimHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ClaimHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\ui\components\Buttons\ClaimAgainstButton.svelte generated by Svelte v3.31.2 */

    const { console: console_1 } = globals;

    function create_fragment$t(ctx) {
    	let genericbutton;
    	let current;

    	genericbutton = new GenericButton({
    			props: {
    				textbutton: "Against",
    				onClickAction: /*againstClaimButtonClicked*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(genericbutton.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(genericbutton.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(genericbutton, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(genericbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(genericbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(genericbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ClaimAgainstButton", slots, []);

    	const againstClaimButtonClicked = () => {
    		console.log("CLAIMED AGAINST!");
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<ClaimAgainstButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ GenericButton, againstClaimButtonClicked });
    	return [againstClaimButtonClicked];
    }

    class ClaimAgainstButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ClaimAgainstButton",
    			options,
    			id: create_fragment$t.name
    		});
    	}
    }

    /* src\ui\components\Buttons\ClaimForButton.svelte generated by Svelte v3.31.2 */

    const { console: console_1$1 } = globals;

    function create_fragment$u(ctx) {
    	let genericbutton;
    	let current;

    	genericbutton = new GenericButton({
    			props: {
    				textbutton: "For",
    				onClickAction: /*forClaimButtonClicked*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(genericbutton.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(genericbutton.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(genericbutton, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(genericbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(genericbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(genericbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ClaimForButton", slots, []);

    	const forClaimButtonClicked = () => {
    		console.log("CLAIMED FOR!");
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<ClaimForButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ GenericButton, forClaimButtonClicked });
    	return [forClaimButtonClicked];
    }

    class ClaimForButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ClaimForButton",
    			options,
    			id: create_fragment$u.name
    		});
    	}
    }

    /* src\ui\components\Mains\ClaimMain.svelte generated by Svelte v3.31.2 */
    const file$o = "src\\ui\\components\\Mains\\ClaimMain.svelte";

    function create_fragment$v(ctx) {
    	let main;
    	let p0;
    	let t0;
    	let br;
    	let t1;
    	let t2;
    	let section2;
    	let section0;
    	let claimagainstbutton;
    	let t3;
    	let p1;
    	let t4_value = /*retreivePercentage*/ ctx[3](/*peopleClaimed*/ ctx[0], /*peopleAgainst*/ ctx[2]).toFixed(2) + "";
    	let t4;
    	let t5;
    	let t6;
    	let section1;
    	let claimforbutton;
    	let t7;
    	let p2;
    	let t8_value = /*retreivePercentage*/ ctx[3](/*peopleClaimed*/ ctx[0], /*peopleFor*/ ctx[1]).toFixed(2) + "";
    	let t8;
    	let t9;
    	let current;
    	claimagainstbutton = new ClaimAgainstButton({ $$inline: true });
    	claimforbutton = new ClaimForButton({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			p0 = element("p");
    			t0 = text(/*peopleClaimed*/ ctx[0]);
    			br = element("br");
    			t1 = text("people claimed");
    			t2 = space();
    			section2 = element("section");
    			section0 = element("section");
    			create_component(claimagainstbutton.$$.fragment);
    			t3 = space();
    			p1 = element("p");
    			t4 = text(t4_value);
    			t5 = text("%");
    			t6 = space();
    			section1 = element("section");
    			create_component(claimforbutton.$$.fragment);
    			t7 = space();
    			p2 = element("p");
    			t8 = text(t8_value);
    			t9 = text("%");
    			this.h();
    		},
    		l: function claim(nodes) {
    			main = claim_element(nodes, "MAIN", { class: true });
    			var main_nodes = children(main);
    			p0 = claim_element(main_nodes, "P", { class: true });
    			var p0_nodes = children(p0);
    			t0 = claim_text(p0_nodes, /*peopleClaimed*/ ctx[0]);
    			br = claim_element(p0_nodes, "BR", {});
    			t1 = claim_text(p0_nodes, "people claimed");
    			p0_nodes.forEach(detach_dev);
    			t2 = claim_space(main_nodes);
    			section2 = claim_element(main_nodes, "SECTION", { class: true });
    			var section2_nodes = children(section2);
    			section0 = claim_element(section2_nodes, "SECTION", { class: true });
    			var section0_nodes = children(section0);
    			claim_component(claimagainstbutton.$$.fragment, section0_nodes);
    			t3 = claim_space(section0_nodes);
    			p1 = claim_element(section0_nodes, "P", { class: true });
    			var p1_nodes = children(p1);
    			t4 = claim_text(p1_nodes, t4_value);
    			t5 = claim_text(p1_nodes, "%");
    			p1_nodes.forEach(detach_dev);
    			section0_nodes.forEach(detach_dev);
    			t6 = claim_space(section2_nodes);
    			section1 = claim_element(section2_nodes, "SECTION", { class: true });
    			var section1_nodes = children(section1);
    			claim_component(claimforbutton.$$.fragment, section1_nodes);
    			t7 = claim_space(section1_nodes);
    			p2 = claim_element(section1_nodes, "P", { class: true });
    			var p2_nodes = children(p2);
    			t8 = claim_text(p2_nodes, t8_value);
    			t9 = claim_text(p2_nodes, "%");
    			p2_nodes.forEach(detach_dev);
    			section1_nodes.forEach(detach_dev);
    			section2_nodes.forEach(detach_dev);
    			main_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			add_location(br, file$o, 8, 75, 447);
    			attr_dev(p0, "class", "text-center text-bangarang-darkEmphasis my-2");
    			add_location(p0, file$o, 8, 4, 376);
    			attr_dev(p1, "class", "text-center text-bangarang-darkEmphasis");
    			add_location(p1, file$o, 12, 12, 619);
    			attr_dev(section0, "class", "flex flex-col w-1/3");
    			add_location(section0, file$o, 10, 8, 533);
    			attr_dev(p2, "class", "text-center text-bangarang-darkEmphasis");
    			add_location(p2, file$o, 16, 12, 847);
    			attr_dev(section1, "class", "flex flex-col w-1/3");
    			add_location(section1, file$o, 14, 8, 765);
    			attr_dev(section2, "class", "flex justify-between my-1 mx-4");
    			add_location(section2, file$o, 9, 4, 475);
    			attr_dev(main, "class", "flex flex-col my-2");
    			add_location(main, file$o, 7, 0, 337);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, p0);
    			append_dev(p0, t0);
    			append_dev(p0, br);
    			append_dev(p0, t1);
    			append_dev(main, t2);
    			append_dev(main, section2);
    			append_dev(section2, section0);
    			mount_component(claimagainstbutton, section0, null);
    			append_dev(section0, t3);
    			append_dev(section0, p1);
    			append_dev(p1, t4);
    			append_dev(p1, t5);
    			append_dev(section2, t6);
    			append_dev(section2, section1);
    			mount_component(claimforbutton, section1, null);
    			append_dev(section1, t7);
    			append_dev(section1, p2);
    			append_dev(p2, t8);
    			append_dev(p2, t9);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*peopleClaimed*/ 1) set_data_dev(t0, /*peopleClaimed*/ ctx[0]);
    			if ((!current || dirty & /*peopleClaimed, peopleAgainst*/ 5) && t4_value !== (t4_value = /*retreivePercentage*/ ctx[3](/*peopleClaimed*/ ctx[0], /*peopleAgainst*/ ctx[2]).toFixed(2) + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*peopleClaimed, peopleFor*/ 3) && t8_value !== (t8_value = /*retreivePercentage*/ ctx[3](/*peopleClaimed*/ ctx[0], /*peopleFor*/ ctx[1]).toFixed(2) + "")) set_data_dev(t8, t8_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(claimagainstbutton.$$.fragment, local);
    			transition_in(claimforbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(claimagainstbutton.$$.fragment, local);
    			transition_out(claimforbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(claimagainstbutton);
    			destroy_component(claimforbutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ClaimMain", slots, []);
    	let { peopleClaimed = 0 } = $$props;
    	let { peopleFor = 0 } = $$props;
    	let { peopleAgainst = 0 } = $$props;
    	const retreivePercentage = (total, part) => total > 0 ? part / total * 100 : 0;
    	const writable_props = ["peopleClaimed", "peopleFor", "peopleAgainst"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ClaimMain> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("peopleClaimed" in $$props) $$invalidate(0, peopleClaimed = $$props.peopleClaimed);
    		if ("peopleFor" in $$props) $$invalidate(1, peopleFor = $$props.peopleFor);
    		if ("peopleAgainst" in $$props) $$invalidate(2, peopleAgainst = $$props.peopleAgainst);
    	};

    	$$self.$capture_state = () => ({
    		ClaimAgainstButton,
    		ClaimForButton,
    		peopleClaimed,
    		peopleFor,
    		peopleAgainst,
    		retreivePercentage
    	});

    	$$self.$inject_state = $$props => {
    		if ("peopleClaimed" in $$props) $$invalidate(0, peopleClaimed = $$props.peopleClaimed);
    		if ("peopleFor" in $$props) $$invalidate(1, peopleFor = $$props.peopleFor);
    		if ("peopleAgainst" in $$props) $$invalidate(2, peopleAgainst = $$props.peopleAgainst);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [peopleClaimed, peopleFor, peopleAgainst, retreivePercentage];
    }

    class ClaimMain extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {
    			peopleClaimed: 0,
    			peopleFor: 1,
    			peopleAgainst: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ClaimMain",
    			options,
    			id: create_fragment$v.name
    		});
    	}

    	get peopleClaimed() {
    		throw new Error("<ClaimMain>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set peopleClaimed(value) {
    		throw new Error("<ClaimMain>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get peopleFor() {
    		throw new Error("<ClaimMain>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set peopleFor(value) {
    		throw new Error("<ClaimMain>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get peopleAgainst() {
    		throw new Error("<ClaimMain>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set peopleAgainst(value) {
    		throw new Error("<ClaimMain>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const retreiveClaimById = (id) => claims.find(claim => claim.id === id);

    /* src\ui\pages\ClaimModel.svelte generated by Svelte v3.31.2 */

    function create_fragment$w(ctx) {
    	let claimheader;
    	let t0;
    	let claimmain;
    	let t1;
    	let claimfooter;
    	let current;

    	claimheader = new ClaimHeader({
    			props: { title: /*claim*/ ctx[0].title },
    			$$inline: true
    		});

    	claimmain = new ClaimMain({
    			props: {
    				peopleClaimed: /*claim*/ ctx[0].peopleClaimed,
    				peopleFor: /*claim*/ ctx[0].peopleFor,
    				peopleAgainst: /*claim*/ ctx[0].peopleAgainst
    			},
    			$$inline: true
    		});

    	claimfooter = new ClaimFooter({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(claimheader.$$.fragment);
    			t0 = space();
    			create_component(claimmain.$$.fragment);
    			t1 = space();
    			create_component(claimfooter.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(claimheader.$$.fragment, nodes);
    			t0 = claim_space(nodes);
    			claim_component(claimmain.$$.fragment, nodes);
    			t1 = claim_space(nodes);
    			claim_component(claimfooter.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(claimheader, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(claimmain, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(claimfooter, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const claimheader_changes = {};
    			if (dirty & /*claim*/ 1) claimheader_changes.title = /*claim*/ ctx[0].title;
    			claimheader.$set(claimheader_changes);
    			const claimmain_changes = {};
    			if (dirty & /*claim*/ 1) claimmain_changes.peopleClaimed = /*claim*/ ctx[0].peopleClaimed;
    			if (dirty & /*claim*/ 1) claimmain_changes.peopleFor = /*claim*/ ctx[0].peopleFor;
    			if (dirty & /*claim*/ 1) claimmain_changes.peopleAgainst = /*claim*/ ctx[0].peopleAgainst;
    			claimmain.$set(claimmain_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(claimheader.$$.fragment, local);
    			transition_in(claimmain.$$.fragment, local);
    			transition_in(claimfooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(claimheader.$$.fragment, local);
    			transition_out(claimmain.$$.fragment, local);
    			transition_out(claimfooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(claimheader, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(claimmain, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(claimfooter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ClaimModel", slots, []);
    	
    	let { id } = $$props;
    	let claim;
    	beforeUpdate(() => $$invalidate(0, claim = retreiveClaimById(id)));
    	const writable_props = ["id"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ClaimModel> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("id" in $$props) $$invalidate(1, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		ClaimFooter,
    		ClaimHeader,
    		ClaimMain,
    		beforeUpdate,
    		retreiveClaimById,
    		id,
    		claim
    	});

    	$$self.$inject_state = $$props => {
    		if ("id" in $$props) $$invalidate(1, id = $$props.id);
    		if ("claim" in $$props) $$invalidate(0, claim = $$props.claim);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [claim, id];
    }

    class ClaimModel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, { id: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ClaimModel",
    			options,
    			id: create_fragment$w.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[1] === undefined && !("id" in props)) {
    			console.warn("<ClaimModel> was created without expected prop 'id'");
    		}
    	}

    	get id() {
    		throw new Error("<ClaimModel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<ClaimModel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\ui\routing\Router.svelte generated by Svelte v3.31.2 */

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[8] = i;
    	return child_ctx;
    }

    // (12:4) <Route path={links.mainMenu}>
    function create_default_slot_7(ctx) {
    	let mainmenu;
    	let current;
    	mainmenu = new MainMenu({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(mainmenu.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(mainmenu.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(mainmenu, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mainmenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mainmenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mainmenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(12:4) <Route path={links.mainMenu}>",
    		ctx
    	});

    	return block;
    }

    // (13:4) <Route path={links.businessModel}>
    function create_default_slot_6(ctx) {
    	let businessmodel;
    	let current;
    	businessmodel = new BusinessModel({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(businessmodel.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(businessmodel.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(businessmodel, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(businessmodel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(businessmodel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(businessmodel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(13:4) <Route path={links.businessModel}>",
    		ctx
    	});

    	return block;
    }

    // (14:4) <Route path={links.leanCanvas}>
    function create_default_slot_5(ctx) {
    	let leancanvas;
    	let current;
    	leancanvas = new LeanCanvas({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(leancanvas.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(leancanvas.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(leancanvas, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(leancanvas.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(leancanvas.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(leancanvas, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(14:4) <Route path={links.leanCanvas}>",
    		ctx
    	});

    	return block;
    }

    // (17:12) <Route path={`${valuePropositionDesignCanvas.audience}Landing${index}`}>
    function create_default_slot_4(ctx) {
    	let landingpagemodel;
    	let current;

    	landingpagemodel = new LandingPageModel({
    			props: {
    				mainHeadLine: /*pain*/ ctx[6],
    				supportingHeadline: /*valuePropositionDesignCanvas*/ ctx[1].painRelievers[/*index*/ ctx[8]]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(landingpagemodel.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(landingpagemodel.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(landingpagemodel, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(landingpagemodel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(landingpagemodel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(landingpagemodel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(17:12) <Route path={`${valuePropositionDesignCanvas.audience}Landing${index}`}>",
    		ctx
    	});

    	return block;
    }

    // (16:8) {#each valuePropositionDesignCanvas.pains as pain,index }
    function create_each_block_2(ctx) {
    	let route;
    	let current;

    	route = new Route({
    			props: {
    				path: `${/*valuePropositionDesignCanvas*/ ctx[1].audience}Landing${/*index*/ ctx[8]}`,
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(route.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				route_changes.$$scope = { dirty, ctx };
    			}

    			route.$set(route_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(16:8) {#each valuePropositionDesignCanvas.pains as pain,index }",
    		ctx
    	});

    	return block;
    }

    // (15:4) {#each valuePropositionsDesignCanvas as valuePropositionDesignCanvas}
    function create_each_block_1$3(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_2 = /*valuePropositionDesignCanvas*/ ctx[1].pains;
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(nodes);
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*valuePropositionsDesignCanvas*/ 0) {
    				each_value_2 = /*valuePropositionDesignCanvas*/ ctx[1].pains;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(15:4) {#each valuePropositionsDesignCanvas as valuePropositionDesignCanvas}",
    		ctx
    	});

    	return block;
    }

    // (21:8) <Route path={valuePropositionDesignCanvas.pageLink}>
    function create_default_slot_3(ctx) {
    	let valuepropositionmodel;
    	let current;

    	valuepropositionmodel = new ValuePropositionModel({
    			props: {
    				valuePropositionDesignCanvas: /*valuePropositionDesignCanvas*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(valuepropositionmodel.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(valuepropositionmodel.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(valuepropositionmodel, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(valuepropositionmodel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(valuepropositionmodel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(valuepropositionmodel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(21:8) <Route path={valuePropositionDesignCanvas.pageLink}>",
    		ctx
    	});

    	return block;
    }

    // (20:4) {#each valuePropositionsDesignCanvas as valuePropositionDesignCanvas}
    function create_each_block$5(ctx) {
    	let route;
    	let current;

    	route = new Route({
    			props: {
    				path: /*valuePropositionDesignCanvas*/ ctx[1].pageLink,
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(route.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				route_changes.$$scope = { dirty, ctx };
    			}

    			route.$set(route_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(20:4) {#each valuePropositionsDesignCanvas as valuePropositionDesignCanvas}",
    		ctx
    	});

    	return block;
    }

    // (23:4) <Route path="{claimLinkPrefix}:id" let:params>
    function create_default_slot_2(ctx) {
    	let claimmodel;
    	let current;

    	claimmodel = new ClaimModel({
    			props: { id: /*params*/ ctx[0].id },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(claimmodel.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(claimmodel.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(claimmodel, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const claimmodel_changes = {};
    			if (dirty & /*params*/ 1) claimmodel_changes.id = /*params*/ ctx[0].id;
    			claimmodel.$set(claimmodel_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(claimmodel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(claimmodel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(claimmodel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(23:4) <Route path=\\\"{claimLinkPrefix}:id\\\" let:params>",
    		ctx
    	});

    	return block;
    }

    // (26:4) <Route path={"/"}>
    function create_default_slot_1(ctx) {
    	let mainmenu;
    	let current;
    	mainmenu = new MainMenu({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(mainmenu.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(mainmenu.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(mainmenu, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mainmenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mainmenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mainmenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(26:4) <Route path={\\\"/\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (11:0) <Router url={"/"}>
    function create_default_slot(ctx) {
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let t2;
    	let t3;
    	let t4;
    	let route3;
    	let t5;
    	let route4;
    	let current;

    	route0 = new Route({
    			props: {
    				path: links.mainMenu,
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: links.businessModel,
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route({
    			props: {
    				path: links.leanCanvas,
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value_1 = valuePropositionsDesignCanvas;
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = valuePropositionsDesignCanvas;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	route3 = new Route({
    			props: {
    				path: "" + (claimLinkPrefix + ":id"),
    				$$slots: {
    					default: [
    						create_default_slot_2,
    						({ params }) => ({ 0: params }),
    						({ params }) => params ? 1 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route4 = new Route({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    			t2 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			create_component(route3.$$.fragment);
    			t5 = space();
    			create_component(route4.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(route0.$$.fragment, nodes);
    			t0 = claim_space(nodes);
    			claim_component(route1.$$.fragment, nodes);
    			t1 = claim_space(nodes);
    			claim_component(route2.$$.fragment, nodes);
    			t2 = claim_space(nodes);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].l(nodes);
    			}

    			t3 = claim_space(nodes);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(nodes);
    			}

    			t4 = claim_space(nodes);
    			claim_component(route3.$$.fragment, nodes);
    			t5 = claim_space(nodes);
    			claim_component(route4.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(route1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(route2, target, anchor);
    			insert_dev(target, t2, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(target, anchor);
    			}

    			insert_dev(target, t3, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t4, anchor);
    			mount_component(route3, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(route4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);

    			if (dirty & /*valuePropositionsDesignCanvas*/ 0) {
    				each_value_1 = valuePropositionsDesignCanvas;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1$3(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(t3.parentNode, t3);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*valuePropositionsDesignCanvas*/ 0) {
    				each_value = valuePropositionsDesignCanvas;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t4.parentNode, t4);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}

    			const route3_changes = {};

    			if (dirty & /*$$scope, params*/ 513) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    			const route4_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				route4_changes.$$scope = { dirty, ctx };
    			}

    			route4.$set(route4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(route1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(route2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(route3, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(route4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(11:0) <Router url={\\\"/\\\"}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$x(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				url: "/",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(router.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Router", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router,
    		Route,
    		links,
    		claimLinkPrefix,
    		MainMenu,
    		BusinessModel,
    		LeanCanvas,
    		ValuePropositionModel,
    		LandingPageModel,
    		valuePropositionsDesignCanvas,
    		ClaimModel
    	});

    	return [];
    }

    class Router_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router_1",
    			options,
    			id: create_fragment$x.name
    		});
    	}
    }

    //import MainMenu from './pages/MainMenu.svelte';
    const app = new Router_1({
        target: document.body,
        props: {},
        hydrate: true
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
