const frontmatter = require("remark-frontmatter");
const visit = require("unist-util-visit");

/**
 * Represents a Markdown `unified.Processor` plugin for adding any detected frontmatter to the Javascript exports / `unified.Processor` state
 * @param {*} options
 */
function markdown_frontmatter(options = []) {
    const processor = this;
    const matter_map = new Map();

    let matter_types = options.map((matter) => [matter.type, matter]);
    matter_types = new Map(matter_types);

    processor.data("markdown_frontmatter", matter_map);
    processor.use(frontmatter, options);

    return (ast) => {
        const javascript_exports = processor.data("javascript_exports");

        // First, we need to find the first Node that matches a registered frontmatter parser. If
        // there isn't one, skip processing this syntax tree
        const node = ast.children.find((node) => matter_types.has(node.type));
        if (!node) return;

        // Next, we need to retrieve the matching frontmatter parser, and then parse
        // our found Node's text value into an Object
        const {parser} = matter_types.get(node.type);
        const parsed = parser(node.value);

        // Finally, we want to export the frontmatter data to other plugins via the
        // `Processor.data("markdown_frontmatter")` key, and then module export if available
        for (const key in parsed) matter_map.set(key, parsed[key]);
        if (javascript_exports) javascript_exports.set("FRONTMATTER", parsed);
    };
}

/**
 * Represents a Markdown `unified.Processor` plugin for persisting Markdown code blocks metadata as `data-meta`
 *
 * e.g.
 *
 * ```markdown
 * \`\`\`javascript my meta string
 * console.log("some console log");
 * \`\`\`
 * ```
 *
 * becomes:
 *
 * <pre>
 *     <code data-meta="my meta string">
 *         ...
 *     </code>
 * </pre>
 */
function markdown_code_metadata() {
    return (ast) => {
        visit(ast, "code", (node) => {
            if (!node.meta) return;

            const data = node.data ? node.data : (node.data = {});
            const properties = data.hProperties ? data.hProperties : (data.hProperties = {});

            properties["data-meta"] = node.meta;
        });
    };
}

module.exports = {
    markdown_code_metadata,
    markdown_frontmatter
};
