const _ = require("lodash");

/**
 * Returns the standardized settings for configuring the Svelte compiler
 * @param {*} settings
 */
function get_svelte_settings(settings = {}) {
    return _.merge(
        {
            filename: null,
            name: "Component",
            format: "esm",
            generate: "dom",
            dev: false,
            immutable: false,
            hydratable: false,
            legacy: false,
            accessors: false,
            customElement: false,
            tag: null,
            css: true,
            loopGuardTimeout: 0,
            preserveComments: false,
            preserveWhitespace: false,
            outputFilename: null,
            cssOutputFilename: null,
            sveltePath: "svelte"
        },
        settings
    );
}

module.exports = {
    get_svelte_settings
};
