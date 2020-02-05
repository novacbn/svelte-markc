const _ = require("lodash");

const {javascript_exports} = require("../plugins");
const {use_plugins} = require("../util");

/**
 * Returns the standardized settings for configuring reecma-based plugins
 * @param {*} settings
 */
function get_reecma_settings(settings = {}) {
    return _.merge(
        {
            parse: {},
            plugins: [],

            exports: {
                format: "esm"
            },

            stringify: {
                comments: true
            }
        },
        settings
    );
}

/**
 * Configures a `unified.Processor` with the `svelte-markc` reecma plugins
 * @param {*} processor
 * @param {*} settings
 * @param {*} validate_settings
 */
function use_reecma_plugins(processor, settings, validate_settings = true) {
    if (validate_settings) settings = get_reecma_settings(settings);

    processor.use(javascript_exports, settings.exports);

    return use_plugins(processor, settings.plugins);
}

module.exports = {
    get_reecma_settings,
    use_reecma_plugins
};
