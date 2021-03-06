const {readFileSync, writeFileSync} = require("fs");

const {compile_frontmatter, compile_markc, compile_markdown} = require("../lib");

const stringify = (v) => JSON.stringify(v, null, 4);

(async () => {
    const text = readFileSync("./test.md").toString();

    const frontmatter = await compile_frontmatter(text);
    const markdown_results = await compile_markdown(text);
    const {exports, js} = await compile_markc(text, {svelte: {format: "cjs"}});

    writeFileSync("_test.frontmatter.json", stringify(frontmatter));

    writeFileSync("_test.html_frontmatter.json", stringify(markdown_results.frontmatter));
    writeFileSync("_test.html.svelte", markdown_results.html);

    writeFileSync("_test.exports.json", stringify(exports));
    writeFileSync("_test.js", js.code);
})();
