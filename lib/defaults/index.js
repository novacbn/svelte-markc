const {get_rehype_settings, use_rehype_plugins} = require("./rehype");
const {get_remark_settings, use_remark_plugins} = require("./remark");
const {get_reecma_settings, use_reecma_plugins} = require("./reecma");
const {get_svelte_settings} = require("./svelte");

module.exports = {
    get_rehype_settings,
    get_remark_settings,
    get_reecma_settings,
    get_svelte_settings,
    use_rehype_plugins,
    use_remark_plugins,
    use_reecma_plugins
};
