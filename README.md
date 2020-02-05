# svelte-markc

> NOTE: Current README is for not-published in-development version, see [v0.0.3 README.md](https://github.com/novacbn/svelte-markc/blob/f54703e3f182b800587bb8905a1cb89fa988e5f2/README.md)

## Description

Simple naive package that utilizes [unifiedjs](https://unifiedjs.com/) to transform Markdown to working compiled Svelte Components (e.g. MDX)

## Why?

Wanting to use Markdown to document my other projects instead of straight HTML, but also keeping integrated custom Svelte Components working. I looked at other previous-art such as MDX, and created this package.

## Caveats

-   Like the the description, very **NAIVE** Markdown -> Svelte Component transformer. Probably a lot of edge-cases.
-   Unlike normal rehypejs / remarkjs build-chains, `svelte-markc` **PRESERVES** the case sensitivity of HTML elements in the end result, to support custom Svelte Components. e.g. `<P>...content...</P>` doesn't get lower-cased to `<p>...content...</p>`.
-   All HTML elements **ARE TREATED** as a block element, not wrapped in paragraph tags _(`<p>`)_.
-   This package **ONLY** compiles the Svelte Markdown Component, you still have to run `svelte/preprocess` yourself!
-   This package **BASICALLY** just converts you Markdown content into proper HTML elements before passing into the Svelte Compiler. It doesn't do anything fancy, like in MDX with inline imports.
-   All inline code texts and code blocks have their left curly brace _`{`_ and right curly brace _`}`_ characters **REPLACED**, with their `&#123;` and `&#125;` HTML entity codes respectively.
-   Using void tags _(e.g. `<HorizontalRepl />`)_ with imported Svelte Components most of the time malforms the Markdown output.
-   Svelte block-level directives _(e.g. `{#if}`, `{#await}`)_ currently break the Markdown output most of the time.

## Features

### Code Block Meta

Every Markdown code block has all the text after their language inserted as `data-meta` string attribute, for later usage. Such as runtime injection of REPLs or enabling UI features:

e.g.

````md
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

### Frontmatter

> **SEE ALSO**: [Supported Frontmatter](#supported-frontmatter) for default markups and how to define more

Every Markdown file can define what's known as "frontmatter", that is, extra metadata define as a configuration markup at the top of your file's code:

```markdown
---
title: My Example Blog Post
date: 2019/08/17
---

# My Example Blog Post

> Published On: {FRONTMATTER.date}

So today I was walking down the street...
```

### Exports

> **SEE ALSO**: [Supported Exports](#supported-exports) for default exports and how to define more

Every Markdown file has exports that are define by the compilation pipeline's plugins, that can be imported by other Javascript files or used within the Markdown file:

```javascript
// Importing the previous example...
import MarkdownComponent, {FRONTMATTER} from "./my_markdown_file.md";

console.log(FRONTMATTER.date); // logs: `2019/08/17`
```

## Developer

### Installation

Open your terminal and install via `npm`:

```sh
npm install git+https://github.com/novacbn/svelte-markc#0.1.0
```

### Compilers

When using the `svelte-markc` package you have three compilers to choose from, each ending at different pipeline stages. Every compiler takes the same options as passed to [`VFile(options: VFileOptions)`](https://github.com/vfile/vfile#vfileoptions).

#### `compile_frontmatter`

```typescript
interface FrontmatterResults {
    [key: string]: unknown;
}

export function compile_frontmatter(
    contents: VFileOptions,
    options: Partial<CompilerSettings>
): Promise<FrontmatterResults> {}
```

To compile just the frontmatter of any given Svelte Markdown file, just utilize `compile_frontmatter`:

```javascript
const {compile_frontmatter} = require("svelte-markc");

const MARKDOWN = `---
my_yaml_string: some yaml string
---`;

async function main() {
    const frontmatter = await compile_frontmatter(MARKDOWN);

    /*
        logs:
        {
            "my_yaml_string": "some yaml string"
        }
    */
    console.log(frontmatter);
}

main();
```

#### `compile_markdown`

```typescript
interface FrontmatterResults {
    [key: string]: unknown;
}

interface MarkdownResults {
    /**
     * Represents the Frontmatter parsed from the file's Markdown
     */
    frontmatter: FrontmatterResults;

    /**
     * Represents the final HTML generated from the file's Markdown
     */
    html: string;
}

export function compile_markdown(
    contents: VFileOptions,
    options: Partial<CompilerSettings>
): Promise<MarkdownResults> {}
```

If you just want to run your Svelte Markdown file through the pipeline into HTML without being compiled via Svelte, you can use `compile_markdown`:

```javascript
const {compile_markdown} = require("svelte-markc");

const MARKDOWN = `# This is a Markdown File
And I am in a paragraph!`;

async function main() {
    const results = await compile_markdown(MARKDOWN);

    /*
        logs:
        `<h1>This is a Markdown File
        <p>And I am in a paragraph!</p>`
    */
    console.log(results.html);
}

main();
```

#### `compile_markc`

```typescript
/**
 * Represents unknown value results mapped as key-values
 */
interface MappedResults {
    [key: string]: unknown;
}

interface MarkCResults {
    /**
     * Represents the Javascript module exports added to the output by plugins
     */
    exports: MappedResults;

    /**
     * Represents the Frontmatter parsed from the file's Markdown
     */
    frontmatter: MappedResults;

    /**
     * Represents the CSS stylesheet generated from the Svelte Markdown file
     *
     * See: https://svelte.dev/docs#svelte_compile
     */
    css: SvelteCodeResults;

    /**
     * Represents the generated Javascript from the Svelte Markdown file
     *
     * See: https://svelte.dev/docs#svelte_compile
     */
    js: SvelteCodeResults;

    /**
     * Represents the Abstract Syntax Tree of the Svelte Template
     *
     * See: https://svelte.dev/docs#svelte_compile
     */
    ast: SvelteSyntaxTree;

    /**
     * Represents the variables declared in the Svelte Template
     *
     * See: https://svelte.dev/docs#svelte_compile
     */
    vars: SvelteVars;

    /**
     * Represents warning emitted during compilation by the Svelte Compiler (e.g. ARIA)
     *
     * See: https://svelte.dev/docs#svelte_compile
     */
    warnings: SvelteWarnings;
}

export function compile_markc(
    contents: VFileOptions,
    options: Partial<CompilerSettings>
): MarkCResults {}
```

To fully compile your file as a Svelte Markdown file, simply call `compile_markc`:

```javascript
import {compile_markc} from "svelte-markc";

const MARKDOWN = `# My Header
This is **markdown** code!`;

async function main() {
    const results = await compile_markc(MARKDOWN);

    console.log(results.js.code); // logs the Javascript output of `svelte/compiler`
}

main();
```

### `CompilerSettings`

Below is the options and their defaults, that you can pass partial objects of into [`compile_frontmatter`](#compile_frontmatter), [`compile_markdown`](#compile_markdown), [`compile_markc`](#compile_markc):

````typescript
/**
 * Represents the plugin handler pipeline, used by `unified`
 *
 * some examples:
 *
 * ```typescript
 * const plugins: UnifiedPlugin[] = ["remark-slug"];
 *
 * const plugins: UnifiedPlugin[] = [require("remark-slug")];
 *
 * const plugins: UnifiedPlugin[] = ["remark-slug", {...some options...}];
 * ```
 */
type UnifiedPlugin = [() => (ast: AbstractSyntaxTree) => void | string, Object<string, any>];

/**
 * Represents a parser for a specific frontmatter markup
 */
interface FrontmatterParser {
    /**
     * Represents the marker used for fencing frontmatter markup, which will be repeated x3
     *
     * e.g. `.marker = "*"` will parse:
     *
     * ```markdown
     * ***
     * ...some markup here...
     * ***
     *
     * # I am Markdown!
     * ```
     */
    marker?: string;

    /**
     * Represents custom opening / closing fencing for frontmatter markup, which will not be repeated instead
     *
     * e.g. `.fence = {open: "{", close: "}"}` will parse:
     *
     * ```markdown
     * {
     * ...some markup here...
     * }
     *
     * # I am Markdown!
     * ```
     */
    fence?: {close: string, open: string},

    /**
     * Represents the parser function of the specific markup, which takes text and outputs an object
     */
    parser: (text: string) => {[key: string]: unknown};

    /**
     * Represents the shortname of the type of markup, e.g. `json`, `yaml`, `toml`, etc...
     */
    type: string;
}

/**
 * Represents the options for configuring the Markdown manipulation phase of the pipeline
 */
interface RemarkSettings {
    /**
     * Represents the `unified` plugins ran during the Javascript manipulation phase of the pipeline
     */
    plugins: UnifiedPlugin[] = [];

    /**
     * Represents options passed into `remark-parse` or similar plugins
     *
     * See: https://github.com/remarkjs/remark/tree/master/packages/remark-parse#options
     */
    parse: {[key: string]: unknown} = {
        // Represents HTML patterns that are treated as block-level elements,
        // by-default, all HTML tags are treated as such
        blocks: (string | RegularExpression)[] = ["[\\w\\-]+"]
    };

    /**
     * Represents options passed into `remark-stringify` or similar plugins
     *
     * See: https://github.com/remarkjs/remark/tree/master/packages/remark-stringify#options
     */
    stringify: {[key: string]: unknown} = {};

    /**
     * Represents the options passed into `remark-frontmatter`
     *
     * NOTE: Each parser listed below is already defined!
     *
     * See: https://github.com/remarkjs/remark-frontmatter#options
     */
    frontmatter: FrontmatterParser[] = [
        {type: "json", fence: {open: "{", close: "}"}, parser},
        {type: "toml", marker: "+", parser},
        {type: "yaml", marker: "-", parser}
    ]
}

/**
 * Represents the options for configuring the HTML manipulation phase of the pipeline
 */
interface RehypeSettings {
    /**
     * Represents the `unified` plugins ran during the HTML manipulation phase of the pipeline
     */
    plugins: UnifiedPlugin[] = [];

    /**
     * Represents options passed into `rehype-parse` or similar plugins
     *
     * See: https://github.com/rehypejs/rehype/tree/master/packages/rehype-parse#options
     */
    parse: {[key: string]: unknown} = {};

    /**
     * Represents options passed into `rehype-stringify` or similar plugins
     *
     * See: https://github.com/syntax-tree/hast-util-to-html#tohtmltree-options
     */
    stringify: {[key: string]: unknown} = {};

    /**
     * Represents options passed into `remark-rehype` or similar plugins
     *
     * See: https://github.com/syntax-tree/mdast-util-to-hast#options
     */
    mdast2hast: {[key: string]: unknown} = {
        // `.allowDangerousHTML` lets raw HTML be passed, rather than escaped
        allowDangerousHTML: true;
    };
}

/**
 * Represents the options for configuring the Javascript manipulation phase of the pipeline
 */
interface ReecmaSettings {
    /**
     * Represents the `unified` plugins ran during the Javascript manipulation phase of the pipeline
     */
    plugins: UnifiedPlugin[] = [];

    /**
     * Represents options passed into `acorn`-based parser plugins or similar
     *
     * See: https://github.com/acornjs/acorn/tree/master/acorn#interface
     */
    parse: {[key: string]: unknown} = {};

    /**
     * Represents options passed into `astring`-based generator plugins or similar
     *
     * See: https://github.com/davidbonnet/astring#generatenode-object-options-object-string--object
     */
    stringify: {[key: string]: unknown} = {
        /**
         * Represents if comments should be generated in the source code
         */
        comments: boolean = true
    };
}

/**
 * Represents options passed into the Svelte compiler
 *
 * See: https://svelte.dev/docs#svelte_compile
 */
interface SvelteSettings {
    /**
     * Represents the name used for debugging hints and sourcemaps. Your bundler plugin normally sets it automatically
     */
    filename: string = null,

    /**
     * Represents the class name the resulting JavaScript export. Usually inferred from `SvelteSettings.filename` and handled by your bundler plugin
     */
    name: string = "Component",

    /**
     * Represents the export format type generated by the compiler, e.g. `module.exports` (cjs) or `export default` (esm)
     */
    format: "cjs" | "esm" = "esm",

    generate: "dom" | "ssr" = "dom",

    dev: boolean = false,

    immutable: boolean = false,

    hydratable: boolean = false,

    legacy: boolean = false,

    accessors: boolean = false,

    customElement: boolean = false,

    tag: string = null,

    css: boolean = true,

    loopGuardTimeout: number = 0,

    preserveComments: boolean = false,

    preserveWhitespace: boolean = false,

    outputFilename: string = null,

    cssOutputFilename: string = null,

    sveltePath: boolean = "svelte"
}

/**
 * Represents the options passed to `compile_source`
 */
interface CompilerSettings {
    /**
     * Represents options passed into pipelines that handle Javascript manipulation
     */
    reecma: ReecmaSettings;

    /**
     * Represents options passed into pipelines that handle HTML manipulation
     */
    rehype: RehypeSettings;

    /**
     * Represents options passed into pipelines that handle Markdown manipulation
     */
    remark: RemarkSettings;

    /**
     * Represents options passed into the Svelte compiler
     *
     * See: https://svelte.dev/docs#svelte_compile
     */
    svelte: SvelteSettings;
}
````

### Supported Frontmatter

By default, `svelte-markc` supports three different frontmatter types prepended to your source.

#### JSON

The most basic frontmatter markup, JSON, is parsed by [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse):

```markdown
{
"title": "My Example Blog Post",
"date": "2019/08/17"
}

# My Example Blog Post

So today I was walking down the street...
```

#### YAML

Next is the ever popular markup, YAML, which is parsed by [`js-yaml.safeLoad`](https://github.com/nodeca/js-yaml)

```markdown
---
title: My Example Blog Post
date: 2019/08/17
---

# My Example Blog Post

So today I was walking down the street...
```

#### TOML

Finally is the other popular markup, TOML, which is parsed by [`toml.parse`](https://github.com/BinaryMuse/toml-node):

```markdown
+++
title = "My Example Blog Post"
date = "2019/08/17"
+++

# My Example Blog Post

So today I was walking down the street...
```

#### Defining Other Frontmatter Markups

You can define other frontmatter markups via [`CompilerSettings.remark.frontmatter`](#compilersettings). For example, if you wanted to specify [`HJSON`](https://hjson.github.io/) with `###` as the fencing:

```javascript
const {parse} = require("hjson");
const {compile_frontmatter} = require("svelte-markc");

const MARKDOWN = `###
title: My Example Blog Post
date: 2019/08/17
###`;

const OPTIONS = {
    remark: {
        frontmatter: [
            {
                type: "hjson",
                marker: "#",
                parser: (s) => parse(s)
            }
        ]
    }
};

async function main() {
    const frontmatter = await compile_frontmatter(MARKDOWN, OPTIONS);

    /*
        logs:
        {
            "date": "2019/08/17", 
            "title": "My Example Blog Post"
        }
    */
    console.log(frontmatter);
}

main();
```

### Supported Exports

In `svelte-markc` there are a few exports that are already defined by the pipeline, that can be used within the Svelte Markdown file **_or_** imported in other Javascript code.

#### `FRONTMATTER`

If the Svelte Markdown file has frontmatter defined, it'll be available as `FRONTMATTER`:

```javascript
// Importing the earlier Markdown file
import MarkdownComponent, {FRONTMATTER} from "./my_markdown_file.md";

console.log(FRONTMATTER.title); // logs: "My Example Blog Post"
```

And inside the Svelte Markdown file its self:

```markdown
---
title: My Example Blog Post
date: 2019/08/17
---

# {FRONTMATTER.title}

This blog post was made in {FRONTMATTER.date}
```

#### `SOURCE_MARKDOWN`

The original source of the Markdown file is available as `SOURCE_MARKDOWN`:

```javascript
import MarkdownComponent, {SOURCE_MARKDOWN} from "./my_markdown_file.md";

console.log(SOURCE_MARKDOWN);
```

Or within the Svelte Markdown file its self:

```markdown
# Trippy, recursive source code!

##### _as text_

{SOURCE_MARKDOWN}
```

#### `SOURCE_HTML`

The generated HTML of the file's Markdown is available as `SOURCE_HTML`:

```javascript
import MarkdownComponent, {SOURCE_HTML} from "./my_markdown_file.md";

console.log(SOURCE_HTML);
```

Or within the Svelte Markdown file its self:

```markdown
# Trippy, recursive source code!

##### _as html_

{@html SOURCE_HTML}
```

#### Defining Other Javascript Exports

Via a [unified plugin](https://github.com/unifiedjs/unified#plugin), you can define any JSON-compatible value as a named export like so:

```javascript
import {compile_markc} from "svelte-markc";

const MARKDOWN = `# Oh cool, a custom export!
{MY_COOL_EXPORT}`;

function my_plugin() {
    const processor = this;

    return (ast) => {
        // Some times the export map is not available, e.g. in `compile_frontmatter` or `compile_markdown` calls
        const javascript_exports = processor.data("javascript_exports");
        if (!javascript_exports) return;

        // The export map is just a `Map`, so we can use `Map.set`
        javascript_exports.set("MY_COOL_EXPORT", 42);
    };
}

// NOTE: You can define exports at _ANY_ stage of the pipeline, not just HTML stage
const OPTIONS = {
    rehype: {
        plugins: [my_plugin]
    }
};

async function main() {
    const results = await compile_markc(MARKDOWN, OPTIONS);

    // NOTE: This can be used in the Svelte Template and imported like the other exports
    console.log("The answer to life is: " + results.exports.MY_COOL_EXPORT); // logs: `The answer to life is 42`
}
```
