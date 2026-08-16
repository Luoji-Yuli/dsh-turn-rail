//#region lib/types/index.js
/**
* Right-side session turn rail plugin, node half. Pure UI plugin: the empty
* apply exists so the plugin row can live in the host loader tree; the
* browser half ships via exports["./client"], discovered through the
* package.json `dsh.client` declaration.
*/
/** Host plugin body — no host-side behavior for this UI plugin. */
function apply() {}
//#endregion
export { apply };
