# svelte-mark

## Description

Simple naive package that utilizes rehypejs / remarkjs to transform Markdown to working compiled Svelte Components (e.g. MDX)

## Why?

Wanting to use Markdown to document my other projects instead of straight HTML, but also keeping integrated custom Svelte Components working. I looked at other previous-art such as MDX, and created this package.

## Caveats

-   Like the the description, very naive Markdown -> Svelte Component transformer. Probably a lot of edge-cases.
-   Unlike normal rehypejs / remarkjs build-chains, `svelte-mark` preserves the case sensitivity of HTML elements in the end result, to support custom Svelte Components. e.g. `<P>...content...</P>` doesn't get lower-cased to `<p>...content...</p>`.
-   This package **ONLY** compiles the Svelte Markdown Component, you still have to run `svelte/preprocess` yourself!
-   This package **BASICALLY** just converts you Markdown content into proper HTML elements before passing into the Svelte Compiler. It doesn't do anything fancy, like in MDX with inline imports.

## Developer

### Installation

Open your terminal and install via `npm`:

```sh
npm install git+https://github.com/novacbn/svelte-mark
```

### Usage

```typescript
export function compile_source(source: string, options: CompileOptions): CompileResults {}
```

To compile a Svelte Markdown Component, simple use `compile_source` like you would with [`compile` from `svelte/compiler`](https://svelte.dev/docs#svelte_compile):

```javascript
import {compile_source} from "svelte-mark";

const MARKDOWN_EXAMPLE_SOURCE = `# My Header
This is **markdown** code!`;

const results = compile_source(MARKDOWN_EXAMPLE_SOURCE);

console.log(results.js.code);
```

The options however are slightly different than `compile`, see [`CompileOptions`](#options) below:

```javascript
import {compile_source} from "svelte-mark";

const MARKDOWN_EXAMPLE_SOURCE = `# My Header
This is **markdown** code!`;

const OPTIONS = {
    svelte: {
        format: "cjs"
    }
};

const results = compile_source(MARKDOWN_EXAMPLE_SOURCE, OPTIONS);

console.log(results.js.code);
```

Along with the normal results returned from `compile`, you can also access the parsed frontmatter. See [Utilizing Frontmatter](#utilizing-frontmatter) for more information:

```javascript
import {compile_source} from "svelte-mark";

const MARKDOWN_EXAMPLE_SOURCE = `+++
title = "I am a title!"
+++

# My Header
This is **markdown** code!`;

const results = compile_source(MARKDOWN_EXAMPLE_SOURCE);

console.log(results.frontmatter.title);
```

### Options

```typescript
/**
 * Represents the markup parsing engines
 */
type GraymatterEngines = Object<string, (text: string) => Object<string, any>>;

/**
 * Represents the options passed to `matter`
 * See also: https://github.com/jonschlinkert/gray-matter#options
 */
interface GraymatterOptions {
    /**
     * Represents the delimiters for fencing the frontmatter
     */
    delimiters: string = "+++";

    /**
     * Represents the default markup language to parse as
     */
    language: string = "toml";

    /**
     * Represents the default supported markup languages
     */
    engines: GraymatterEngines = {
        json: (text: string) => Object<string, any>,
        toml: (text: string) => Object<string, any>,
        yaml: (text: string) => Object<string, any>
    };
}

/**
 * Represents the plugin handler pipeline, used by `unified`
 */
type UnifiedPlugin = () => (ast: AbstractSyntaxTree) => void


/**
 * Represents the options for configuring `rehype`
 */
interface RehypeOptions {
    /**
     * Represents the options passed into `remark-rehype`
     */
    options: Object<string, any> = {
        /**
         * Represents if HTML strings should be escaped, by default is `true` for HTML and custom Svelte Component support
         */
        allowDangerousHTML: boolean = true
    };

    /**
     * Represents the `unified` plugins ran after `remark-rehype` processes its pipeline
     */
    plugins: UnifiedPlugin[] = [];
}

/**
 * Represents the options for configuring `remark`
 */
interface RemarkOptions {
    /**
     * Represents the options passed into `remark-parse`
     */
    options: Object<string, any> = {};

    /**
     * Represents the `unified` plugins ran after `remark-parse` processes its pipeline
     */
    plugins: UnifiedPlugin[] = [];
}

/**
 * Represents the options passed to `compile_source`
 */
interface CompileOptions {
    graymatter: GrayMatterOptions;

    rehype: RehypeOptions;

    remark: RemarkOptions;

    svelte: SvelteOptions;
}
```

#### Compiling Components

...

#### Utilizing Frontmatter

By default, `svelte-mark` supports TOML frontmatter via a `+++...toml markup...+++` header in your Svelte Markdown Component. e.g.

```markdown
+++
title = "My Example Blog Post"
date = "2019/08/17"
+++

# My Example Blog Post

So today I was walking down the street...
```

You can also change the supported markup via add your language, like in code fencing. Which can be changed via [`GraymatterOptions.delimiters`](#options), if desired:

```markdown
+++yaml
title: My Example Blog Post
date: 2019/08/17
+++

# My Example Blog Post

So today I was walking down the street...
```

Once you specify some frontmatter, you can use it within your Svelte Markdown Component as a variable via `type FRONTMATTER = Object<string, any>`, e.g.:

```markdown
+++
title = "My Example Blog Post"
date = "2019/08/17"
animal = "Doggo"
+++

# My Example Blog Post

So today I was walking down the street when I saw a {FRONTMATTER.animal}
```

It is also exported as a `<script context="module"></script>` variable. So you can import it in other scripts, if using `svelte-mark` in a build-chain:

```javascript
import MarkdownComponent, {FRONTMATTER} from "./example.md";

console.log(FRONTMATTER.animal);
```

#### Utilizing Raw Source

And lastly, you can access the original Markdown source via the same way as frontmatter, if using `svelte-mark` in a build-chain:

```javascript
import MarkdownComponent, {SOURCE} from "./example.md";

console.log(SOURCE);
```
