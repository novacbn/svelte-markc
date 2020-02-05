const _ = require("lodash");
const toHTML = require("hast-util-to-html");

const {use_html_raw, source_export} = require("../plugins");
const {use_plugins} = require("../util");

/**
 * Returns the standardized settings for configuring `rehype-parse` / `rehype-stringify` and rehype-based plugins
 * @param {*} settings
 */
function get_rehype_settings(settings = {}) {
    return _.merge(
        {
            parse: {},
            plugins: [],
            stringify: {},

            mdast2hast: {
                // `.allowDangerousHTML` lets raw HTML be passed, rather than escaped
                allowDangerousHTML: true
            }
        },
        settings
    );
}

/**
 * Configures a `unified.Processor` with the `svelte-markc` rehype plugins
 * @param {*} processor
 * @param {*} settings
 * @param {*} validate_settings
 */
function use_rehype_plugins(processor, settings, validate_settings = true) {
    if (validate_settings) settings = get_rehype_settings(settings);

    // HACK: Technically this is wasteful since we'll be compiling the AST twice in the end...
    const compiler = (ast) => toHTML(ast, settings.stringify);
    const _source_export = source_export.bind(processor, "HTML", compiler);

    use_html_raw(processor, {persist_tag_sensitivity: true});

    processor.use(_source_export);

    return use_plugins(processor, settings.plugins);
}

module.exports = {
    get_rehype_settings,
    use_rehype_plugins
};
