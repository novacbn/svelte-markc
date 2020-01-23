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

    const is_vfile_object = typeof source === "object";

    let frontmatter;
    let html;
    if (is_vfile_object) {
        frontmatter = compile_frontmatter(source.contents, graymatter);

        html = await compile_markdown({...source, contents: frontmatter.markdown}, rehype, remark);
    } else {
        frontmatter = compile_frontmatter(source, graymatter);

        html = await compile_markdown(frontmatter.markdown, rehype, remark);
    }

    html = html.toString();

    if (is_vfile_object) {
        return {
            ...compile_svelte(html, source.contents, frontmatter.frontmatter, svelte),
            source: source.contents,
            frontmatter
        };
    } else {
        return {
            ...compile_svelte(html, source, frontmatter.frontmatter, svelte),
            frontmatter,
            source
        };
    }
}

module.exports = {
    compile_frontmatter,
    compile_markdown,
    compile_source,
    compile_svelte
};
