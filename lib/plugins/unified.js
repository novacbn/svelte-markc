/**
 * Represents a generic `unified.Processor` plugin to Javascript export the current `VFile` contents / `compiler` output as a variable
 * @param {*} export_name
 * @param {*} compiler
 */
function source_export(export_name, compiler) {
    const processor = this;
    export_name = "SOURCE_" + export_name.toUpperCase();

    return (ast, vfile) => {
        // If the `javascript_exports` plugin was never loaded, we can't do anything
        const javascript_exports = processor.data("javascript_exports");
        if (!javascript_exports) return;

        // If there was a `(ast: Node) => string` compiler function passed, use it
        // for contents source. Otherwise just use `VFile` instead
        let contents;
        if (compiler) contents = compiler(ast);
        else contents = vfile.contents;

        javascript_exports.set(export_name, contents);
    };
}

module.exports = {
    source_export
};
