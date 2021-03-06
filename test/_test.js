"use strict";
const {SvelteComponent, create_component, destroy_component, detach, element, init, insert, mount_component, noop, safe_not_equal, space, transition_in, transition_out} = require("svelte/internal");
const {HorizontalRepl} = require("svelte-simple-repl");
function create_fragment(ctx) {
  let h1;
  let t3;
  let t4;
  let h2;
  let t6;
  let p0;
  let t8;
  let pre;
  let t10;
  let p1;
  let raw_value = ctx[0].join("<br>") + "";
  let current;
  const horizontalrepl = new HorizontalRepl({
    props: {
      value: FRONTMATTER.repl.test_script
    }
  });
  return {
    c() {
      h1 = element("h1");
      h1.textContent = `Hello, ${thing}!`;
      t3 = space();
      create_component(horizontalrepl.$$.fragment);
      t4 = space();
      h2 = element("h2");
      h2.textContent = "sup";
      t6 = space();
      p0 = element("p");
      p0.textContent = "I am also text!";
      t8 = space();
      pre = element("pre");
      pre.innerHTML = `<code class="language-html" data-meta="but also">&lt;body&gt;
    {...CONTENT HERE...}
&lt;/body&gt;
</code>`;
      t10 = space();
      p1 = element("p");
    },
    m(target, anchor) {
      insert(target, h1, anchor);
      insert(target, t3, anchor);
      mount_component(horizontalrepl, target, anchor);
      insert(target, t4, anchor);
      insert(target, h2, anchor);
      insert(target, t6, anchor);
      insert(target, p0, anchor);
      insert(target, t8, anchor);
      insert(target, pre, anchor);
      insert(target, t10, anchor);
      insert(target, p1, anchor);
      p1.innerHTML = raw_value;
      current = true;
    },
    p: noop,
    i(local) {
      if (current) return;
      transition_in(horizontalrepl.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(horizontalrepl.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) detach(h1);
      if (detaching) detach(t3);
      destroy_component(horizontalrepl, detaching);
      if (detaching) detach(t4);
      if (detaching) detach(h2);
      if (detaching) detach(t6);
      if (detaching) detach(p0);
      if (detaching) detach(t8);
      if (detaching) detach(pre);
      if (detaching) detach(t10);
      if (detaching) detach(p1);
    }
  };
}
let thing = "world";
function instance($$self) {
  const things = ["hello", "hi", "waddup!"];
  return [things];
}
class Component extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {});
  }
}
exports.default = Component;
exports.thing = thing;
const FRONTMATTER = {
  "title": "Test",
  "repl": {
    "test_script": "<script>\n    let count = 0;\n\n    function on_click(event) {\n        event.preventDefault();\n\n        count += 1;\n    }\n\n</script>\n\nPreviously, we counted <b>{count}</b> times!\n<button on:click={on_click}>+1</button>"
  }
};
exports.FRONTMATTER = FRONTMATTER;
const SOURCE_MARKDOWN = "+++\ntitle = \"Test\"\n\n[repl]\n    test_script = \"\"\"<script>\n    let count = 0;\n\n    function on_click(event) {\n        event.preventDefault();\n\n        count += 1;\n    }\n\n</script>\n\nPreviously, we counted <b>{count}</b> times!\n<button on:click={on_click}>+1</button>\"\"\"\n+++\n\n<script context=\"module\">\n    export let thing = \"world\";\n</script>\n\n<script>\n    import {HorizontalRepl} from \"svelte-simple-repl\";\n\n    const things = [\"hello\", \"hi\", \"waddup!\"];\n</script>\n\n# Hello, {thing}!\n\n<HorizontalRepl value={FRONTMATTER.repl.test_script}></HorizontalRepl>\n\n<h2>sup</h2>\n\nI am also text!\n\n```html but also\n<body>\n    {...CONTENT HERE...}\n</body>\n```\n\n{@html things.join(\"<br />\")}\n";
exports.SOURCE_MARKDOWN = SOURCE_MARKDOWN;
const SOURCE_HTML = "<script context=\"module\">\n    export let thing = \"world\";\n</script>\n<script>\n    import {HorizontalRepl} from \"svelte-simple-repl\";\n\n    const things = [\"hello\", \"hi\", \"waddup!\"];\n</script>\n<h1>Hello, {thing}!</h1>\n<HorizontalRepl value=\"{FRONTMATTER.repl.test_script}\"></HorizontalRepl>\n<h2>sup</h2>\n<p>I am also text!</p>\n<pre><code class=\"language-html\" data-meta=\"but also\">&lt;body&gt;\n    &lcub;...CONTENT HERE...&rcub;\n&lt;/body&gt;\n</code></pre>\n<p>{@html things.join(\"<br>\")}</p>";
exports.SOURCE_HTML = SOURCE_HTML;
