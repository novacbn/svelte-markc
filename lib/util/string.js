/**
 * Represents strings for identifiying character expressions by common names
 */
const EXPRESSION_CHARACTERS = {
    arrow_left: /</g,
    arrow_right: />/g,

    brace_left: /{/g,
    brace_right: /}/g
};

/**
 * Represents strings for identifiying entity codes by common names
 */
const ENTITY_CODES = {
    arrow_left: "&lt;",
    arrow_right: "&gt;",

    brace_left: "&lcub;",
    brace_right: "&rcub;"
};

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
 * Replaces curly braces "<" / ">" with their HTML entity code counterparts
 * @param {*} text
 */
function replace_arrow_characters(text) {
    return text
        .replace(EXPRESSION_CHARACTERS.arrow_left, ENTITY_CODES.arrow_left)
        .replace(EXPRESSION_CHARACTERS.arrow_right, ENTITY_CODES.arrow_right);
}

/**
 * Replaces curly braces "{" / "}" with their HTML entity code counterparts
 * @param {*} text
 */
function replace_brace_characters(text) {
    return text
        .replace(EXPRESSION_CHARACTERS.brace_left, ENTITY_CODES.brace_left)
        .replace(EXPRESSION_CHARACTERS.brace_right, ENTITY_CODES.brace_right);
}

module.exports = {
    get_tagname,
    replace_arrow_characters,
    replace_brace_characters
};
