/**
 * Represents the character that replaces the left curly brace `{` entity code
 */
const CHARACTER_BRACE_LEFT = "{";

/**
 * Represents the character that replaces the right curly brace `}` entity code
 */
const CHARACTER_BRACE_RIGHT = "}";

/**
 * Represents the HTML entity code for a curly left brace "{"
 */
const ENTITY_BRACE_LEFT = "&#123;";

/**
 * Represents the HTML entity code for a curly right brace "}"
 */
const ENTITY_BRACE_RIGHT = "&#125;";

/**
 * Represents a Regular Expression for finding all curly left braces "{"
 */
const EXPRESSION_BRACE_LEFT = /{/g;

/**
 * Represents a Regular Expression for finding all curly right braces "}"
 */
const EXPRESSION_BRACE_RIGHT = /}/g;

/**
 * Represents a Regular Expression for finding all left curly brace `{` entity codes
 */
const EXPRESSION_ENTITY_LEFT = /&#123;/g;

/**
 * Represents a Regular Expression for finding all right curly brace `}` entity codes
 */
const EXPRESSION_ENTITY_RIGHT = /&#125;/g;

/**
 * Represents a Regular Expression for finding a HTML tag name
 */
const EXPRESSION_HTML_TAG = /<([^\s>]+)(\s|>)+/;

/**
 * Returns the first tag name found, in the given `text`
 * @param {*} text
 */
function get_tagname(text) {
    // source: https://stackoverflow.com/a/46064683
    return text.match(EXPRESSION_HTML_TAG)[1];
}

/**
 * Replaces curly braces "{" / "}" with their HTML entity code counterparts
 * @param {*} str
 */
function replace_brace_characters(str) {
    return str
        .replace(EXPRESSION_BRACE_LEFT, ENTITY_BRACE_LEFT)
        .replace(EXPRESSION_BRACE_RIGHT, ENTITY_BRACE_RIGHT);
}

/**
 * Replaces curly braces entity codes "&#123;" / "&#125;" with their character counterparts
 * @param {*} str
 */
function replace_brace_entities(str) {
    return str
        .replace(EXPRESSION_ENTITY_LEFT, CHARACTER_BRACE_LEFT)
        .replace(EXPRESSION_ENTITY_RIGHT, CHARACTER_BRACE_RIGHT);
}

module.exports = {
    get_tagname,
    replace_brace_characters,
    replace_brace_entities
};
