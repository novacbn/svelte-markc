const {generate} = require("astring");

const {make_export_nodes} = require("../util");

/**
 * Represents Javascript `unified.Processor` plugin for converting the `Map<string, unknown>`
 * from `Processor.data("javascript_exports")` into Javascript AST of exports
 * @param {*} settings
 */
function javascript_exports(settings = {}) {
    const processor = this;

    const javascript_exports = new Map();
    processor.data("javascript_exports", javascript_exports);

    return (ast) => {
        // We don't need to do anything if there are no exports
        if (javascript_exports.size < 1) return;

        const body = ast.body ? ast.body : (ast.body = []);
        const nodes = make_export_nodes(javascript_exports, settings.format);

        body.push(...nodes);
    };
}

/**
 * Represents Javascript `unified.Processor` plugin for compiling an ESTree-compatible abstract syntax tree into Javascript code
 * @param {*} settings
 */
function javascript_stringify(settings = {}) {
    const processor = this;

    function compiler(ast) {
        return generate(ast, settings);
    }

    processor.Compiler = compiler;
}

module.exports = {
    javascript_exports,
    javascript_stringify
};
