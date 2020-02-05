# Changelog

## **(UNRELEASED)** 0.1.0 - 2020/02/05

-   Refactor of codebase for deeper integration into the [`unified`](https://github.com/unifiedjs/unified) ecosystem
-   Changed `compile_source` -> `compile_markc`
-   Added `type MarkCResults.exports: {[key: string]: any}` when using `compile_markc` for all the module-level exports outputted by `unified` plugins
-   Added `type MarkCResults.frontmatter: {[key: string]: any}` when using `compile_markc` for all the frontmatter outputted by `unified` plugins
-   Added `Processor.data("javascript_exports"): Map<string, unknown>` for `unified` plugins to output module-level exports during `compile_markc` pipeline
-   Added `Processor.data("markdown_frontmatter"): Map<string, unknown>` for `unified` plugins to output module-level exports during `compile_markc` pipeline
-   Changed export `SOURCE.html` -> `SOURCE_HTML`
-   Changed export `SOURCE.markdown` -> `SOURCE_MARKDOWN`
-   Changed `compile_markdown` to return `Promise<{frontmatter: {[key: string]: unknown}, html: string}>`
-   Updated supported NodeJS engine to `>= 12.0.0`

## 0.0.3 - 2020/01/23

-   Added support for [VFile](https://github.com/vfile/vfile#vfileoptions) options input to `compile_source`

## 0.0.2 - 2020/01/20

-   Slight refactor of code organization.
-   Added escaping of curly braces, { and }, into their respective HTML entities in Markdown inline code / code blocks.
-   Added parsing of language meta text into data-meta HTML attribute.

````markdown
```javascript some other meta text
console.log("some javascript");
```
````

renders as:

```html
<pre><code class="language-javascript" data-meta="some other meta text">
console.log("some javascript");
</code></pre>
```

## 0.0.1 - 2020/01/03

-   Initial Release
