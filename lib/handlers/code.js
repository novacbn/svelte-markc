const visit = require("unist-util-visit");

const {NODE_TYPES, get_node_lookup, replace_braces} = require("./util");

/**
 *
 * @param {*} tag_map
 */
function markdown_meta_handler(tag_map) {
    return () => {
        return (ast) => {
            visit(ast, NODE_TYPES.code, (node) => {
                const identifier = get_node_lookup(node);

                tag_map[identifier] = node.meta;
            });
        };
    };
}

/**
 *
 * @param {*} tag_map
 */
function html_meta_handler(tag_map) {
    return () => {
        return (ast) => {
            visit(ast, NODE_TYPES.element, (node) => {
                if (node.tagName !== "code") return;

                const identifier = get_node_lookup(node);
                const meta = tag_map[identifier];

                if (meta) node.properties["data-meta"] = meta;
            });
        };
    };
}

/**
 * Returns a Unified handler for escaping curly braces in Markdown codeblocks
 */
function code_braces_handler() {
    return (ast) => {
        visit(ast, NODE_TYPES.code, (node) => {
            node.value = replace_braces(node.value);
        });
    };
}

/**
 * Returns two Unified handlers for preserving Markdown codeblock metadata as a `data-meta` HTML attribute
 */
function code_meta_handlers() {
    const tag_map = {};

    const html_handler = html_meta_handler(tag_map);
    const markdown_handler = markdown_meta_handler(tag_map);

    return [markdown_handler, html_handler];
}

module.exports = {
    code_braces_handler,
    code_meta_handlers
};
