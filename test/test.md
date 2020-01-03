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
    export const sup = "hello";
</script>

<script>
    import {HorizontalRepl} from "svelte-simple-repl";
</script>

<HorizontalRepl value={FRONTMATTER.repl.test_script} />
