const toHTML = require("hast-util-to-html");
const {compile} = require("svelte/compiler");
const {Parser} = require("acorn");

const {estree_to_unist} = require("../util");

/**
 * Represents Javascript `unified.Processor` plugin for converting HAST to Svelte compiled Javascript ESTree
 *
 * **NOTE**: The pipeline of this plugin is as follows: `Stringify HAST -> Compile HTML as Svelte -> Parse into ESTree AST`
 * @param {*} settings
 */
function svelte_compile_hast(settings = {}) {
    const {reecma, rehype, svelte} = settings;
    const processor = this;

    const results = {};
    processor.data("svelte_results", results);

    return (ast) => {
        // First we need to convert the HAST (HTML Abstract Syntax Tree) into a HTML string,
        // then use the Svelte Compiler on it
        const html = toHTML(ast, rehype);
        const _results = compile(html, svelte);

        // Next we clone all the compiled values into `Processor.data("svelte_results")`, so
        // any other portion of the pipeline can access all compilation results
        for (const key in _results) {
            results[key] = _results;
        }

        // Then we need to parse the Javascript compilation code into an ESTree (EcmaScript Abstract Syntax Tree),
        // so the rest of the pipeline can manipulate like MDAST and HAST
        const source_type = svelte.format === "esm" ? "module" : "script";
        const estree = Parser.parse(_results.js.code, {
            ...reecma,
            locations: true,
            sourceType: source_type
        });

        // Finally, we need to process the ESTree to support some unist-standard Node properties
        return estree_to_unist(estree);
    };
}

module.exports = {
    svelte_compile_hast
};
