import {SvelteComponent, detach, element, init, insert, noop, safe_not_equal, space} from "svelte/internal";
function create_fragment(ctx) {
  let h1;
  let t3;
  let p0;
  let t4;
  let p1;
  let t6;
  let pre;
  let t8;
  let p2;
  let raw_value = things.join("") + "";
  return {
    c() {
      h1 = element("h1");
      h1.textContent = `Hello, ${thing}!`;
      t3 = space();
      p0 = element("p");
      t4 = space();
      p1 = element("p");
      p1.textContent = "I am also text!";
      t6 = space();
      pre = element("pre");
      pre.innerHTML = `<code class="language-html" data-meta="but also">&lt;body&gt;
    &amp;#123;CONTENT_HERE&amp;#125;
&lt;/body&gt;
</code>`;
      t8 = space();
      p2 = element("p");
    },
    m(target, anchor) {
      insert(target, h1, anchor);
      insert(target, t3, anchor);
      insert(target, p0, anchor);
      insert(target, t4, anchor);
      insert(target, p1, anchor);
      insert(target, t6, anchor);
      insert(target, pre, anchor);
      insert(target, t8, anchor);
      insert(target, p2, anchor);
      p2.innerHTML = raw_value;
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) detach(h1);
      if (detaching) detach(t3);
      if (detaching) detach(p0);
      if (detaching) detach(t4);
      if (detaching) detach(p1);
      if (detaching) detach(t6);
      if (detaching) detach(pre);
      if (detaching) detach(t8);
      if (detaching) detach(p2);
    }
  };
}
class Component extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, null, create_fragment, safe_not_equal, {});
  }
}
export default Component;
export const FRONTMATTER = {
  "title": "Test",
  "repl": {
    "test_script": "<script>\n    let count = 0;\n\n    function on_click(event) {\n        event.preventDefault();\n\n        count += 1;\n    }\n\n</script>\n\nPreviously, we counted <b>{count}</b> times!\n<button on:click={on_click}>+1</button>"
  }
};
export const SOURCE_MARKDOWN = "+++\ntitle = \"Test\"\n\n[repl]\n    test_script = \"\"\"<script>\n    let count = 0;\n\n    function on_click(event) {\n        event.preventDefault();\n\n        count += 1;\n    }\n\n</script>\n\nPreviously, we counted <b>{count}</b> times!\n<button on:click={on_click}>+1</button>\"\"\"\n+++\n\n<script context=\"module\">\n    export let thing = \"world\";\n</script>\n\n<script>\n    import {HorizontalRepl} from \"svelte-simple-repl\";\n\n    const things = [\"hello\", \"hi\", \"waddup!\"];\n</script>\n\n# Hello, {thing}!\n\n<HorizontalRepl value={FRONTMATTER.repl.test_script}></HorizontalRepl>\n\n<h2>sup</h2>\n\nI am also text!\n\n```html but also\n<body>\n    {CONTENT_HERE}\n</body>\n```\n\n{@html things.join(\"<br />\")}\n";
export const SOURCE_HTML = "<h1>Hello, {thing}!</h1>\n<p></p>\n<p>I am also text!</p>\n<pre><code class=\"language-html\" data-meta=\"but also\">&#x3C;body>\n    &#x26;#123;CONTENT_HERE&#x26;#125;\n&#x3C;/body>\n</code></pre>\n<p>{@html things.join(\"\")}</p>";
export const SOURCE_JAVASCRIPT = "import {SvelteComponent, detach, element, init, insert, noop, safe_not_equal, space} from \"svelte/internal\";\nfunction create_fragment(ctx) {\n  let h1;\n  let t3;\n  let p0;\n  let t4;\n  let p1;\n  let t6;\n  let pre;\n  let t8;\n  let p2;\n  let raw_value = things.join(\"\") + \"\";\n  return {\n    c() {\n      h1 = element(\"h1\");\n      h1.textContent = `Hello, ${thing}!`;\n      t3 = space();\n      p0 = element(\"p\");\n      t4 = space();\n      p1 = element(\"p\");\n      p1.textContent = \"I am also text!\";\n      t6 = space();\n      pre = element(\"pre\");\n      pre.innerHTML = `<code class=\"language-html\" data-meta=\"but also\">&lt;body&gt;\n    &amp;#123;CONTENT_HERE&amp;#125;\n&lt;/body&gt;\n</code>`;\n      t8 = space();\n      p2 = element(\"p\");\n    },\n    m(target, anchor) {\n      insert(target, h1, anchor);\n      insert(target, t3, anchor);\n      insert(target, p0, anchor);\n      insert(target, t4, anchor);\n      insert(target, p1, anchor);\n      insert(target, t6, anchor);\n      insert(target, pre, anchor);\n      insert(target, t8, anchor);\n      insert(target, p2, anchor);\n      p2.innerHTML = raw_value;\n    },\n    p: noop,\n    i: noop,\n    o: noop,\n    d(detaching) {\n      if (detaching) detach(h1);\n      if (detaching) detach(t3);\n      if (detaching) detach(p0);\n      if (detaching) detach(t4);\n      if (detaching) detach(p1);\n      if (detaching) detach(t6);\n      if (detaching) detach(pre);\n      if (detaching) detach(t8);\n      if (detaching) detach(p2);\n    }\n  };\n}\nclass Component extends SvelteComponent {\n  constructor(options) {\n    super();\n    init(this, options, null, create_fragment, safe_not_equal, {});\n  }\n}\nexport default Component;\n";
