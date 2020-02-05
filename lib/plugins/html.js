const toHTML = require("@starptech/prettyhtml-hast-to-html");
const raw = require("hast-util-raw");
const visit = require("unist-util-visit");

const {get_node_lookup, get_tagname} = require("../util");

/**
 * Represents a HTML `unified.Processor` plugin for converting `.type = "raw"` AST Nodes into HTML elements
 * @param {*} options
 */
function use_html_raw(processor, options = {}) {
    const {persist_tag_sensitivity} = options;

    const tag_map = new Map();

    if (persist_tag_sensitivity) {
        processor.use(() => {
            return (ast) => {
                visit(ast, "raw", (node) => {
                    const parsed = raw(node);
                    if (!parsed) return;

                    const identifier = get_node_lookup(node);
                    const tag_name = get_tagname(node.value);

                    tag_map.set(identifier, tag_name);
                });
            };
        });
    }

    processor.use(() => raw);

    if (persist_tag_sensitivity) {
        processor.use(() => {
            return (ast) => {
                visit(ast, "element", (node) => {
                    // First we need to check if the Node exists in the lookup map
                    const identifier = get_node_lookup(node);
                    if (!tag_map.has(identifier)) return;

                    // If it does, we need to check that it is the same lower-cased tag name, before remapping
                    const tag_name = tag_map.get(identifier);
                    if (tag_name.toLowerCase() !== node.tagName) return;

                    node.tagName = tag_name;
                });
            };
        });
    }
}

/**
 * Represents HTML `unified.Processor` plugin for compiling a HAST abstract syntax tree into HTML code
 * @param {*} settings
 */
function html_stringify(settings = {}) {
    const processor = this;

    function compiler(ast) {
        return toHTML(ast, settings);
    }

    processor.Compiler = compiler;
}

module.exports = {
    html_stringify,
    use_html_raw
};
