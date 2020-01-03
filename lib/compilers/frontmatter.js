const _ = require("lodash");
const matter = require("gray-matter");
const toml = require("toml");

/**
 * Returns the standardized options for configuring `graymatter`
 * @param {*} options
 */
function get_graymatter_options(options = {}) {
    return _.merge(
        {
            // NOTE: We want `+++` to be the default for TOML syntax highlighting
            delimiters: "+++",
            language: "toml",
            engines: {
                // NOTE: `json` and `yaml` engines are already built-in
                toml: (text) => toml.parse(text)
            }
        },
        options
    );
}

/**
 * Returns the parsed frontmatter and the raw trailing Markdown
 * @param {*} source
 * @param {*} options
 */
function compile_frontmatter(source, options = {}) {
    options = get_graymatter_options(options);

    const results = matter(source, options);

    return {
        frontmatter: results.data,
        markdown: results.content
    };
}

module.exports = {
    compile_frontmatter
};
