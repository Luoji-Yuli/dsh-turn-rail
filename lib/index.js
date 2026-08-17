import { settingsNamespace } from "@deepseek-ai/dsh-settings";
import z from "@deepseek-ai/schemastery";
//#region lib/types/turn-rail-settings.js
/** Shared settings contract for the turn-rail plugin (host and browser). */
/** Settings namespace owned by the turn-rail plugin. */
const TURN_RAIL_SETTINGS_NAMESPACE = "turn-rail";
/** Field carrying the collapsed frosted-background preference. */
const TURN_RAIL_BACKGROUND_FIELD = "background";
/** Collapsed frosted pill is opt-in: default OFF (no background in any theme). */
const DEFAULT_TURN_RAIL_BACKGROUND = false;
//#endregion
//#region lib/types/index.js
/**
* Right-side session turn rail plugin, host half: registers the durable
* settings namespace consumed by the browser half, then stays out of the way.
*/
/** Durable turn-rail schema; the browser scope validates against this wire schema. */
const TurnRailSettingsSchema = z.object({ [TURN_RAIL_BACKGROUND_FIELD]: z.boolean().default(false) });
/**
* Register the durable turn-rail section when a settings provider exists.
* @param ctx - Host context whose optional settings service owns the section.
*/
function apply(ctx) {
	ctx.inject(["settings"], (settingsCtx) => {
		settingsCtx.settings.register(settingsNamespace(TURN_RAIL_SETTINGS_NAMESPACE), TurnRailSettingsSchema);
	});
}
//#endregion
export { DEFAULT_TURN_RAIL_BACKGROUND, TURN_RAIL_BACKGROUND_FIELD, TURN_RAIL_SETTINGS_NAMESPACE, apply };
