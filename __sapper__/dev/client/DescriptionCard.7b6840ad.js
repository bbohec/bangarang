import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, v as validate_slots, H as validate_each_argument, e as element, c as claim_element, a as children, f as detach_dev, g as attr_dev, h as add_location, j as insert_dev, L as destroy_each, t as text, b as claim_text, k as append_dev, G as set_data_dev, I as empty, B as transition_in, J as group_outros, C as transition_out, K as check_outros, y as create_component, l as space, z as claim_component, m as claim_space, A as mount_component, D as destroy_component } from './client.2fdb028b.js';
import { L as Link } from './Link.cbb58840.js';

/* src\components\unit\Cards\DescriptionCard.svelte generated by Svelte v3.31.2 */
const file = "src\\components\\unit\\Cards\\DescriptionCard.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[1] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[4] = list[i];
	return child_ctx;
}

// (8:4) {#if descriptionCardContract.bulletPoints?.length > 0}
function create_if_block_1(ctx) {
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
			add_location(ul, file, 8, 8, 463);
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
		id: create_if_block_1.name,
		type: "if",
		source: "(8:4) {#if descriptionCardContract.bulletPoints?.length > 0}",
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
			add_location(li, file, 10, 16, 589);
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

// (15:4) {#if descriptionCardContract.links?.length > 0}
function create_if_block(ctx) {
	let each_1_anchor;
	let current;
	let each_value = /*descriptionCardContract*/ ctx[0].links;
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
		p: function update(ctx, dirty) {
			if (dirty & /*descriptionCardContract*/ 1) {
				each_value = /*descriptionCardContract*/ ctx[0].links;
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
		id: create_if_block.name,
		type: "if",
		source: "(15:4) {#if descriptionCardContract.links?.length > 0}",
		ctx
	});

	return block;
}

// (16:8) {#each descriptionCardContract.links as link}
function create_each_block(ctx) {
	let span;
	let link;
	let t;
	let current;

	link = new Link({
			props: {
				linkHref: /*link*/ ctx[1].href,
				linkName: /*link*/ ctx[1].name,
				size: "medium"
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			span = element("span");
			create_component(link.$$.fragment);
			t = space();
			this.h();
		},
		l: function claim(nodes) {
			span = claim_element(nodes, "SPAN", {});
			var span_nodes = children(span);
			claim_component(link.$$.fragment, span_nodes);
			t = claim_space(span_nodes);
			span_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			add_location(span, file, 16, 12, 826);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			mount_component(link, span, null);
			append_dev(span, t);
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
			if (detaching) detach_dev(span);
			destroy_component(link);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(16:8) {#each descriptionCardContract.links as link}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
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
	let if_block0 = /*descriptionCardContract*/ ctx[0].bulletPoints?.length > 0 && create_if_block_1(ctx);
	let if_block1 = /*descriptionCardContract*/ ctx[0].links?.length > 0 && create_if_block(ctx);

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
			attr_dev(h2, "class", "text-bangarang-dark text-center font-semibold");
			add_location(h2, file, 5, 4, 193);
			attr_dev(p, "class", "text-bangarang-darkEmphasis text-center text-sm");
			add_location(p, file, 6, 4, 293);
			attr_dev(section, "class", "mb-2 p-1");
			add_location(section, file, 4, 0, 161);
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

			if (/*descriptionCardContract*/ ctx[0].bulletPoints?.length > 0) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_1(ctx);
					if_block0.c();
					if_block0.m(section, t4);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*descriptionCardContract*/ ctx[0].links?.length > 0) {
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty & /*descriptionCardContract*/ 1) {
						transition_in(if_block1, 1);
					}
				} else {
					if_block1 = create_if_block(ctx);
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
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
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
		init(this, options, instance, create_fragment, safe_not_equal, { descriptionCardContract: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "DescriptionCard",
			options,
			id: create_fragment.name
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

export { DescriptionCard as D };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVzY3JpcHRpb25DYXJkLjdiNjg0MGFkLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy91bml0L0NhcmRzL0Rlc2NyaXB0aW9uQ2FyZC5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdCBsYW5nPVwidHNcIj5cclxuICAgIGltcG9ydCB0eXBlIHsgRGVzY3JpcHRpb25DYXJkQ29udHJhY3QgfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9EZXNjcmlwdGlvbkNhcmRDb250cmFjdFwiO1xyXG4gICAgaW1wb3J0IExpbmsgZnJvbSBcIi4uL0xpbmtzL0xpbmsuc3ZlbHRlXCJcclxuICAgIGV4cG9ydCBsZXQgZGVzY3JpcHRpb25DYXJkQ29udHJhY3Q6RGVzY3JpcHRpb25DYXJkQ29udHJhY3RcclxuPC9zY3JpcHQ+XHJcbjxzZWN0aW9uIGNsYXNzPVwibWItMiBwLTFcIj5cclxuICAgIDxoMiBjbGFzcz1cInRleHQtYmFuZ2FyYW5nLWRhcmsgdGV4dC1jZW50ZXIgZm9udC1zZW1pYm9sZFwiPntkZXNjcmlwdGlvbkNhcmRDb250cmFjdC50aXRsZX08L2gyPlxyXG4gICAgPHAgY2xhc3M9XCJ0ZXh0LWJhbmdhcmFuZy1kYXJrRW1waGFzaXMgdGV4dC1jZW50ZXIgdGV4dC1zbVwiPntkZXNjcmlwdGlvbkNhcmRDb250cmFjdC5kZXNjcmlwdGlvbn08L3A+XHJcbiAgICB7I2lmIGRlc2NyaXB0aW9uQ2FyZENvbnRyYWN0LmJ1bGxldFBvaW50cz8ubGVuZ3RoID4gMH1cclxuICAgICAgICA8dWwgY2xhc3M9XCJsaXN0LWRpc2MgbGlzdC1pbnNpZGVcIj5cclxuICAgICAgICAgICAgeyNlYWNoIGRlc2NyaXB0aW9uQ2FyZENvbnRyYWN0LmJ1bGxldFBvaW50cyBhcyBidWxsZXRQb2ludCB9XHJcbiAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJ0ZXh0LWJhbmdhcmFuZy1kYXJrRW1waGFzaXMgdGV4dC1zbVwiPntidWxsZXRQb2ludH08L2xpPlxyXG4gICAgICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgPC91bD4gIFxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgZGVzY3JpcHRpb25DYXJkQ29udHJhY3QubGlua3M/Lmxlbmd0aCA+IDB9XHJcbiAgICAgICAgeyNlYWNoIGRlc2NyaXB0aW9uQ2FyZENvbnRyYWN0LmxpbmtzIGFzIGxpbmt9XHJcbiAgICAgICAgICAgIDxzcGFuPlxyXG4gICAgICAgICAgICAgICAgPExpbmsgbGlua0hyZWY9e2xpbmsuaHJlZn0gbGlua05hbWU9e2xpbmsubmFtZX0gc2l6ZT1cIm1lZGl1bVwiIC8+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICB7L2VhY2h9XHJcbiAgICB7L2lmfVxyXG48L3NlY3Rpb24+Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnREFVbUIsR0FBdUIsSUFBQyxZQUFZOzs7O2tDQUF6QyxNQUFJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrQ0FBQyxHQUF1QixJQUFDLFlBQVk7Ozs7aUNBQXpDLE1BQUk7Ozs7Ozs7Ozs7Ozs7Ozs7c0NBQUosTUFBSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7K0JBQytDLEdBQVc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7dUZBQVgsR0FBVzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs4Q0FLN0QsR0FBdUIsSUFBQyxLQUFLOzs7O2dDQUFsQyxNQUFJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7NkNBQUMsR0FBdUIsSUFBQyxLQUFLOzs7OytCQUFsQyxNQUFJOzs7Ozs7Ozs7Ozs7Ozs7O3dCQUFKLE1BQUk7Ozs7Ozs7Ozs7a0NBQUosTUFBSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7dUJBRWtCLEdBQUksSUFBQyxJQUFJO3VCQUFZLEdBQUksSUFBQyxJQUFJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrRUFBOUIsR0FBSSxJQUFDLElBQUk7K0VBQVksR0FBSSxJQUFDLElBQUk7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRDQVpDLEdBQXVCLElBQUMsS0FBSzs7Ozs0Q0FDNUIsR0FBdUIsSUFBQyxXQUFXOzs7Ozs2Q0FDMUYsR0FBdUIsSUFBQyxZQUFZLEVBQUUsTUFBTSxHQUFHLENBQUM7NkNBT2hELEdBQXVCLElBQUMsS0FBSyxFQUFFLE1BQU0sR0FBRyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7bUhBVGEsR0FBdUIsSUFBQyxLQUFLO21IQUM1QixHQUF1QixJQUFDLFdBQVc7O21DQUMxRixHQUF1QixJQUFDLFlBQVksRUFBRSxNQUFNLEdBQUcsQ0FBQzs7Ozs7Ozs7Ozs7OzttQ0FPaEQsR0FBdUIsSUFBQyxLQUFLLEVBQUUsTUFBTSxHQUFHLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQVpuQyx1QkFBK0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=