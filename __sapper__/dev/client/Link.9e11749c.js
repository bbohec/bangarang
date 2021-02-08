import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, v as validate_slots, e as element, t as text, c as claim_element, a as children, b as claim_text, f as detach_dev, g as attr_dev, h as add_location, j as insert_dev, k as append_dev, G as set_data_dev, n as noop } from './client.e7f4e8c3.js';

const links = {
    mainMenu: "/",
    businessModel: "/BusinessModel",
    leanCanvas: "/LeanCanvas",
    syndicalistEarlyAdopters: "/EarlyAdoptersSyndicalist",
    activistEarlyAdopters: "/EarlyAdoptersActivist",
    agileTeamMemberEarlyAdopters: "/EarlyAdoptersAgileTeamMember"
};

/* src\components\unit\Links\Link.svelte generated by Svelte v3.31.2 */

const file = "src\\components\\unit\\Links\\Link.svelte";

function create_fragment(ctx) {
	let a;
	let t;
	let a_class_value;

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
			attr_dev(a, "class", a_class_value = "" + ((/*size*/ ctx[2] === "small" ? "text-xs" : "") + " text-bangarang-darkEmphasis underline text-center mb-1"));
			attr_dev(a, "href", /*linkHref*/ ctx[1]);
			add_location(a, file, 4, 0, 183);
		},
		m: function mount(target, anchor) {
			insert_dev(target, a, anchor);
			append_dev(a, t);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*linkName*/ 1) set_data_dev(t, /*linkName*/ ctx[0]);

			if (dirty & /*size*/ 4 && a_class_value !== (a_class_value = "" + ((/*size*/ ctx[2] === "small" ? "text-xs" : "") + " text-bangarang-darkEmphasis underline text-center mb-1"))) {
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
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Link", slots, []);
	let { linkName = "link name not provided to component!" } = $$props;
	let { linkHref = "missing" } = $$props;
	let { size } = $$props;
	const writable_props = ["linkName", "linkHref", "size"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Link> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ("linkName" in $$props) $$invalidate(0, linkName = $$props.linkName);
		if ("linkHref" in $$props) $$invalidate(1, linkHref = $$props.linkHref);
		if ("size" in $$props) $$invalidate(2, size = $$props.size);
	};

	$$self.$capture_state = () => ({ linkName, linkHref, size });

	$$self.$inject_state = $$props => {
		if ("linkName" in $$props) $$invalidate(0, linkName = $$props.linkName);
		if ("linkHref" in $$props) $$invalidate(1, linkHref = $$props.linkHref);
		if ("size" in $$props) $$invalidate(2, size = $$props.size);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [linkName, linkHref, size];
}

class Link extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, { linkName: 0, linkHref: 1, size: 2 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Link",
			options,
			id: create_fragment.name
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
}

export { Link as L, links as l };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGluay45ZTExNzQ5Yy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvcm91dGluZy9saW5rcy50cyIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3VuaXQvTGlua3MvTGluay5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOltudWxsLCI8c2NyaXB0IGxhbmc9XCJ0c1wiPlxyXG4gICAgZXhwb3J0IGxldCBsaW5rTmFtZTpzdHJpbmcgPSBcImxpbmsgbmFtZSBub3QgcHJvdmlkZWQgdG8gY29tcG9uZW50IVwiXHJcbiAgICBleHBvcnQgbGV0IGxpbmtIcmVmOnN0cmluZyA9IFwibWlzc2luZ1wiXHJcbiAgICBleHBvcnQgbGV0IHNpemU6J3NtYWxsJ3wnbWVkaXVtJ1xyXG48L3NjcmlwdD5cclxuPGEgXHJcbiAgICBjbGFzcz1cInsoc2l6ZSA9PT0gXCJzbWFsbFwiKT9cInRleHQteHNcIjpcIlwifSB0ZXh0LWJhbmdhcmFuZy1kYXJrRW1waGFzaXMgdW5kZXJsaW5lIHRleHQtY2VudGVyIG1iLTFcIiBcclxuICAgIGhyZWY9e2xpbmtIcmVmfVxyXG4+e2xpbmtOYW1lfTwvYT4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7TUFBYSxLQUFLLEdBQUc7SUFDakIsUUFBUSxFQUFDLEdBQUc7SUFDWixhQUFhLEVBQUMsZ0JBQWdCO0lBQzlCLFVBQVUsRUFBQyxhQUFhO0lBQ3hCLHdCQUF3QixFQUFDLDJCQUEyQjtJQUNwRCxxQkFBcUIsRUFBQyx3QkFBd0I7SUFDOUMsNEJBQTRCLEVBQUMsK0JBQStCOzs7Ozs7Ozs7Ozs7Ozs7eUJDRTlELEdBQVE7Ozs7Ozt3Q0FBUixHQUFROzs7Ozt3REFGRyxHQUFJLFFBQUssT0FBTyxHQUFFLFNBQVMsR0FBQyxFQUFFO29DQUNqQyxHQUFROzs7Ozs7Ozs0REFDaEIsR0FBUTs7Z0ZBRkcsR0FBSSxRQUFLLE9BQU8sR0FBRSxTQUFTLEdBQUMsRUFBRTs7Ozs7cUNBQ2pDLEdBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQU5ILFFBQVEsR0FBVSxzQ0FBc0M7T0FDeEQsUUFBUSxHQUFVLFNBQVM7T0FDM0IsSUFBcUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==