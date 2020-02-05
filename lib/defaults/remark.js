const _ = require("lodash");
const toml = require("toml");
const yaml = require("js-yaml");

const {markdown_code_metadata, markdown_frontmatter, source_export} = require("../plugins");
const {use_plugins} = require("../util");

/**
 * Returns the standardized settings for configuring `remark-parse` / `remark-stringify` and remark-based plugins
 * @param {*} settings
 */
function get_remark_settings(settings = {}) {
    return _.merge(
        {
            plugins: [],
            stringify: {},

            frontmatter: [
                {
                    type: "json",
                    fence: {open: "{", close: "}"},
                    parser: (s) => JSON.parse("{" + s + "}")
                },
                {type: "toml", marker: "+", parser: (s) => toml.parse(s)},
                {type: "yaml", marker: "-", parser: (s) => yaml.safeLoad(s)}
            ],

            parse: {
                // `.blocks` controls which HTML tags are treated are block-level elements
                // rather than paragraph wrapped texts, we're making it any tag below
                blocks: ["[\\w\\-]+"]
            }
        },
        settings
    );
}

/**
 * Configures a `unified.Processor` with the `svelte-markc` remark plugins
 * @param {*} processor
 * @param {*} settings
 * @param {*} validate_settings
 */
function use_remark_plugins(processor, settings, validate_settings = true) {
    if (validate_settings) settings = get_remark_settings(settings);

    const _source_export = source_export.bind(processor, "MARKDOWN");

    processor
        .use(markdown_frontmatter, settings.frontmatter)
        .use(markdown_code_metadata)
        .use(_source_export);

    return use_plugins(processor, settings.plugins);
}

module.exports = {
    get_remark_settings,
    use_remark_plugins
};
