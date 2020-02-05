const markdown_parse = require("remark-parse");
const mdast_to_hast = require("remark-rehype");
const unified = require("unified");

const {
    get_reecma_settings,
    get_rehype_settings,
    get_remark_settings,
    get_svelte_settings,
    use_reecma_plugins,
    use_rehype_plugins,
    use_remark_plugins
} = require("./defaults");

const {
    html_stringify,
    javascript_stringify,
    markdown_frontmatter,
    svelte_compile_hast
} = require("./plugins");

/**
 * Returns a `Promise<{[key: string]: unknown}>` of frontmatter key-values parsed from the given contents
 * @param {*} file
 * @param {*} settings
 */
async function compile_frontmatter(file, settings = {}) {
    const processor = unified();
    settings = get_remark_settings(settings);

    processor.use(markdown_parse, settings.parse).use(markdown_frontmatter, settings.frontmatter);

    const ast = processor.parse(file);
    await processor.run(ast);

    const frontmatter = processor.data("markdown_frontmatter");
    return Object.fromEntries(frontmatter.entries());
}

/**
 * Returns a `Promise<string>` of the parsed Markdown converted into HTML, running through `svelte-markc`'s pipeline of plugins
 * @param {*} file
 * @param {*} settings
 */
async function compile_markdown(file, settings = {}) {
    const processor = unified();

    let {rehype, remark} = settings;
    rehype = get_rehype_settings(rehype);
    remark = get_remark_settings(remark);

    // Configuring the `unified.Processor` to run through:
    // `Parse Markdown` -> `remark plugins` -> `Convert remark AST to rehype AST` -> `rehype plugins` -> `Stringify to HTML`
    processor.use(markdown_parse, remark.parse).use(html_stringify, rehype.stringify);

    use_remark_plugins(processor, remark, false);
    processor.use(mdast_to_hast, rehype.mdast2hast);

    use_rehype_plugins(processor, rehype, false);

    const vfile = await processor.process(file);

    let frontmatter = processor.data("markdown_frontmatter");
    frontmatter = Object.fromEntries(frontmatter.entries());

    const html = vfile.toString();

    return {
        frontmatter,
        html
    };
}

/**
 * Returns a `Promise<string>` of the parsed Markdown converted in Svelte-compiled Javascript, running through `svelte-markc`'s pipeline of plugins
 * @param {*} file
 * @param {*} settings
 */
async function compile_markc(file, settings = {}) {
    const processor = unified();

    let {reecma, rehype, remark, svelte} = settings;

    rehype = get_rehype_settings(rehype);
    remark = get_remark_settings(remark);
    svelte = get_svelte_settings(svelte);

    reecma = get_reecma_settings({...reecma, exports: {format: svelte.format}});

    // Configuring the `unified.Processor` to run through:
    // `Parse Markdown` -> `remark plugins` -> `Convert remark AST to rehype AST`
    // -> `rehype plugins` -> `Compile rehype AST to ESTree AST via Svelte` -> `Stringify to Javascript`
    processor.use(markdown_parse, remark.parse).use(javascript_stringify, reecma.stringify);

    use_remark_plugins(processor, remark, false);
    processor.use(mdast_to_hast, rehype.mdast2hast);

    use_rehype_plugins(processor, rehype, false);
    processor.use(svelte_compile_hast, {svelte, reecma: reecma.parse, rehype: rehype.stringify});

    use_reecma_plugins(processor, reecma, false);

    const vfile = await processor.process(file);
    const code = vfile.toString();

    const svelte_results = processor.data("svelte_results");

    let exports = processor.data("javascript_exports");
    exports = Object.fromEntries(exports.entries());

    let frontmatter = processor.data("markdown_frontmatter");
    frontmatter = Object.fromEntries(frontmatter.entries());

    // We need to return the entire Svelte compilation results for CSS, warnings, etc...
    return {
        ...svelte_results,
        exports,
        frontmatter,

        js: {
            ...svelte_results.js,
            code
        }
    };
}

module.exports = {
    compile_frontmatter,
    compile_markc,
    compile_markdown
};
