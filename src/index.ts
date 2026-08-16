/**
 * Right-side session turn rail plugin, host half: registers the durable
 * settings namespace consumed by the browser half, then stays out of the way.
 */

import type { Context } from '@deepseek-ai/cordis'
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import { TurnRailSettingsSchema } from './settings-schema.ts'
import { TURN_RAIL_SETTINGS_NAMESPACE } from './turn-rail-settings.ts'

export {
  DEFAULT_TURN_RAIL_BACKGROUND, TURN_RAIL_BACKGROUND_FIELD, TURN_RAIL_SETTINGS_NAMESPACE,
  type TurnRailSettings,
} from './turn-rail-settings.ts'

/**
 * Register the durable turn-rail section when a settings provider exists.
 * @param ctx - Host context whose optional settings service owns the section.
 */
export function apply(ctx: Context): void {
  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.settings.register(
      settingsNamespace(TURN_RAIL_SETTINGS_NAMESPACE),
      TurnRailSettingsSchema,
    )
  })
}
