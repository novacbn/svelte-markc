/**
 * Returns a simple string lookup-able identifier for finding nodes from Markdown source
 * via their rendered HTML counterpart
 * @param {*} node
 */
function get_node_lookup(node) {
    const {position} = node;
    if (!position) return null;

    const {start} = position;

    return `${start.line}-${start.column}-${start.offset}`;
}

/**
 * Configures a `unified.Processor` to utilize a plugin array
 * @param {*} processor
 * @param {*} plugins
 */
function use_plugins(processor, plugins = []) {
    for (let plugin of plugins) {
        // Need to support singular package name strings / transformers that have no options
        if (typeof plugin !== "object") plugin = [plugin];

        // Also need to support importing the plugins, if provided a string. That
        // way, we can support text-only configurations. e.g. JSON
        let [transformer, transformer_options] = plugin;
        if (typeof transformer === "string") transformer = require(transformer);

        processor.use(transformer, transformer_options);
    }

    return processor;
}

module.exports = {
    get_node_lookup,
    use_plugins
};
