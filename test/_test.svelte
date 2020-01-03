<script context="module">
    export let thing = "world";
</script>
<script>
    import {HorizontalRepl} from "svelte-simple-repl";
</script>
<h1>Hello, {thing}!</h1>
<HorizontalRepl value="{FRONTMATTER.repl.test_script}"></HorizontalRepl>