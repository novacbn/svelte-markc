const raw = require("hast-util-raw");
const visit = require("unist-util-visit");

const {NODE_TYPES, get_node_lookup} = require("./util");

/**
 * NOTE:
 *  This could probably be done better, I was just looking for a quick hack in the time being
 */

/**
 *
 * @param {*} markup
 */
function get_tagname(markup) {
    // source: https://stackoverflow.com/a/46064683

    const pattern = /<([^\s>]+)(\s|>)+/;

    return markup.match(pattern)[1];
}

/**
 *
 * @param {*} tag_map
 */
function pre_sensitivity_handler(tag_map) {
    return () => {
        return (ast) => {
            visit(ast, NODE_TYPES.raw, (node) => {
                const raw_parsed = raw(node);
                if (!raw_parsed) return;

                const identifier = get_node_lookup(node);
                const tag_name = get_tagname(node.value);

                tag_map[identifier] = tag_name;
            });
        };
    };
}

/**
 *
 * @param {*} tag_map
 */
function post_sensitivity_handler(tag_map) {
    return () => {
        return (ast) => {
            visit(ast, NODE_TYPES.element, (node) => {
                const identifier = get_node_lookup(node);
                const tag_name = tag_map[identifier];
                if (!tag_name || tag_name.toLowerCase() !== node.tagName) return;

                node.tagName = tag_name;
            });
        };
    };
}

/**
 * Returns two Unified handlers for preserving HTML tag name case sensitivity
 */
function tag_sensitivity_handlers() {
    const tag_map = {};

    const pre_handler = pre_sensitivity_handler(tag_map);
    const post_handler = post_sensitivity_handler(tag_map);

    return [pre_handler, post_handler];
}

module.exports = {
    tag_sensitivity_handlers
};
