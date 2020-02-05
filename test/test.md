+++
title = "Test"

[repl]
    test_script = """<script>
    let count = 0;

    function on_click(event) {
        event.preventDefault();

        count += 1;
    }

</script>

Previously, we counted <b>{count}</b> times!
<button on:click={on_click}>+1</button>"""
+++

<script context="module">
    export let thing = "world";
</script>

<script>
    import {HorizontalRepl} from "svelte-simple-repl";

    const things = ["hello", "hi", "waddup!"];
</script>

# Hello, {thing}!

<HorizontalRepl value={FRONTMATTER.repl.test_script}></HorizontalRepl>

<h2>sup</h2>

I am also text!

```html but also
<body>
    {CONTENT_HERE}
</body>
```

{@html things.join("<br />")}
