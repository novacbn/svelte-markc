const {compile_frontmatter} = require("./frontmatter");
const {compile_markdown} = require("./markdown");
const {compile_svelte} = require("./svelte");

/**
 * Returns the compiled version of a Markdown Svelte Component
 * @param {*} source
 * @param {*} options
 */
async function compile_source(source, options = {}) {
    const {graymatter, rehype, remark, svelte} = options;

    const frontmatter = compile_frontmatter(source, graymatter);
    let html = await compile_markdown(frontmatter.markdown, rehype, remark);
    html = html.toString();

    return {...compile_svelte(html, source, frontmatter.frontmatter, svelte), frontmatter, source};
}

module.exports = {
    compile_frontmatter,
    compile_markdown,
    compile_source,
    compile_svelte
};
