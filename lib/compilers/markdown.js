const _ = require("lodash");

const raw = require("hast-util-raw");

const markdown = require("remark-parse");
const remark2rehype = require("remark-rehype");
const stringify = require("rehype-stringify");
const unified = require("unified");

const {code_braces_handler, code_meta_handlers, tag_sensitivity_handlers} = require("../handlers");

/**
 * Returns the standardized options for configuring `rehype` and `remark-rehype`
 * @param {*} options
 */
function get_rehype_options(options = {}) {
    return _.merge(
        {
            options: {
                // `.allowDangerousHTML` lets raw HTML be passed, rather than escaped
                allowDangerousHTML: true
            },
            plugins: []
        },
        options
    );
}

/**
 * Returns the standardized options for configuring `remark` and `remark-parse`
 * @param {*} options
 */
function get_remark_options(options = {}) {
    return _.merge(
        {
            options: {
                // `.blocks` controls which HTML tags are treated are block-level elements
                // rather than paragraph wrapped texts, we're making it any tag below
                blocks: ["[\\w\\-]+"]
            },
            plugins: []
        },
        options
    );
}

/**
 * Returns a configured `unified.Processor` based on the passed `options`
 * @param {*} options
 */
function get_processor(options) {
    const {rehype, remark} = options;
    let processor = unified();

    const [pre_meta, post_meta] = code_meta_handlers();
    const [pre_tag, post_tag] = tag_sensitivity_handlers();

    // We need the initialization the pipeline for Markdown parsing and transforms
    processor.use(markdown, remark.options);

    processor.use(code_braces_handler).use(pre_meta);

    for (let plugin of remark.plugins) {
        // Need to support singular package name strings / transformers that have no options
        if (typeof plugin !== "object") plugin = [plugin];

        // Also need to support importing the plugins, if provided a string. That
        // way, we can support text-only configurations. e.g. JSON
        let [transformer, transformer_options] = plugin;
        if (typeof transformer === "string") transformer = require(transformer);

        processor.use(transformer, transformer_options);
    }

    // Again here, but we to initialization the pipeline for HTML parsing and transforms
    processor.use(remark2rehype, rehype.options);

    processor
        .use(pre_tag)
        .use(() => raw)
        .use(post_tag)
        .use(post_meta);

    for (let plugin of rehype.plugins) {
        if (typeof plugin !== "object") plugin = [plugin];

        let [transformer, transformer_options] = plugin;
        if (typeof transformer === "string") transformer = require(transformer);

        processor.use(transformer, transformer_options);
    }

    // Finally, we need to render back out into a HTML string
    processor.use(stringify);

    return processor;
}

/**
 * Returns a `Promise` containing the processed HTML string of the Markdown source
 * @param {*} source
 * @param {*} rehype
 * @param {*} remark
 */
async function compile_markdown(source, rehype = {}, remark = {}) {
    rehype = get_rehype_options(rehype);
    remark = get_remark_options(remark);

    const processor = get_processor({rehype, remark});

    let processed = await processor.process(source);
    processed = processed.toString();

    return processed;
}

module.exports = {
    compile_markdown
};
