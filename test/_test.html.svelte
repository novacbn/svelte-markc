<script context="module">
    export let thing = "world";
</script>
<script>
    import {HorizontalRepl} from "svelte-simple-repl";

    const things = ["hello", "hi", "waddup!"];
</script>
<h1>Hello, {thing}!</h1>
<p><HorizontalRepl value="{FRONTMATTER.repl.test_script}"></HorizontalRepl></p>
<h2>sup</h2>
<p>I am also text!</p>
<pre><code class="language-html" data-meta="but also">&#x3C;body>
    &#x26;#123;CONTENT_HERE&#x26;#125;
&#x3C;/body>
</code></pre>
<p>{@html things.join("<br>")}</p>