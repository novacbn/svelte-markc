/**
 * Represents a Regular Expression for finding curly left braces "{"
 */
const EXPRESSION_BRACE_LEFT = /{/g;

/**
 * Represents a Regular Expression for finding curly right braces "}"
 */
const EXPRESSION_BRACE_RIGHT = /}/g;

/**
 * Represents the HTML entity code for a curly left brace "{"
 */
const ENTITY_BRACE_LEFT = "&#123;";

/**
 * Represents the HTML entity code for a curly right brace "}"
 */
const ENTITY_BRACE_RIGHT = "&#125;";

/**
 * Represents the types of `Node` values used for visiting
 */
const NODE_TYPES = {
    /**
     * Represents a Markdown code segment (code block, inline code, etc) `Node` type
     */
    code: "code",

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
 * Returns a simple string lookup-able identifier for finding nodes from Markdown source
 * via their rendered HTML counterpart
 * @param {*} node
 */
function get_node_lookup(node) {
    const {start} = node.position;

    return `${start.line}-${start.column}-${start.offset}`;
}

/**
 * Replaces curly braces "{" / "}" with their HTML entity code counterparts
 * @param {*} str
 */
function replace_braces(str) {
    return str
        .replace(EXPRESSION_BRACE_LEFT, ENTITY_BRACE_LEFT)
        .replace(EXPRESSION_BRACE_RIGHT, ENTITY_BRACE_RIGHT);
}

module.exports = {
    NODE_TYPES,
    get_node_lookup,
    replace_braces
};
