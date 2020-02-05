<script context="module">
    export let thing = "world";
</script>
<script>
    import {HorizontalRepl} from "svelte-simple-repl";

    const things = ["hello", "hi", "waddup!"];
</script>
<h1>Hello, {thing}!</h1>
<HorizontalRepl value="{FRONTMATTER.repl.test_script}"></HorizontalRepl>
<h2>sup</h2>
<p>I am also text!</p>
<pre><code class="language-html" data-meta="but also">&lt;body&gt;
    &lcub;...CONTENT HERE...&rcub;
&lt;/body&gt;
</code></pre>
<p>{@html things.join("<br>")}</p>