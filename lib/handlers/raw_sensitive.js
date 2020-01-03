const raw = require("hast-util-raw");
const visit = require("unist-util-visit");

/**
 * NOTE:
 *  This could probably be done better, I was just looking for a quick hack in the time being
 */

/**
 * Represents the types of `Node` values used for visiting
 */
const NODE_TYPES = {
    /**
     * Represents a HTML element `Node` type
     */
    element: "element",

    /**
     * Represents a raw value `Node` type
     */
    raw: "raw"
};

/**
 *
 * @param {*} node
 */
function get_lookup_hash(node) {
    const {start} = node.position;

    return `${start.line}-${start.column}-${start.offset}`;
}

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
function cache_raw_value(tag_map) {
    return () => {
        return (ast) => {
            visit(ast, NODE_TYPES.raw, (node) => {
                const raw_parsed = raw(node);
                if (!raw_parsed) return;

                const lookup_hash = get_lookup_hash(node);
                const tag_name = get_tagname(node.value);
                tag_map[lookup_hash] = tag_name;
            });
        };
    };
}

/**
 * Returns a Unified handler for converting "raw" `Node` types into HTML "element" types
 */
function preserve_raw_value(tag_map) {
    return () => {
        return (ast) => {
            visit(ast, NODE_TYPES.element, (node) => {
                const lookup_hash = get_lookup_hash(node);
                const tag_name = tag_map[lookup_hash];
                if (!tag_name) return;

                node.tagName = tag_name;
            });
        };
    };
}

/**
 *
 * @param {*} processor
 */
function raw_sensitive(processor) {
    const tag_map = {};

    processor.use(cache_raw_value(tag_map));
    processor.use(() => raw);
    processor.use(preserve_raw_value(tag_map));
}

module.exports = {
    cache_raw_value,
    preserve_raw_value,
    raw_sensitive
};
