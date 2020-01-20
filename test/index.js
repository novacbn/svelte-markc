const {readFileSync, writeFileSync} = require("fs");

const {compile_frontmatter, compile_markdown, compile_source, compile_svelte} = require("../lib");

(async () => {
    const text = readFileSync("./test.md").toString();

    const frontmatter = compile_frontmatter(text);
    const html = await compile_markdown(frontmatter.markdown);

    writeFileSync("_test.frontmatter.json", JSON.stringify(frontmatter.frontmatter, null, 4));
    writeFileSync("_test.svelte", html);

    const compiled = compile_svelte(html, text, frontmatter.frontmatter);
    const source_c = await compile_source(text);

    writeFileSync("_test.compiled.js", compiled.js.code);
    writeFileSync("_test.source_c.js", source_c.js.code);
})();
