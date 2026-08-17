/**
 * Right-side session turn rail plugin, host half: registers the durable
 * settings namespace consumed by the browser half, then stays out of the way.
 */

import type { Context } from '@deepseek-ai/cordis'
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import z from '@deepseek-ai/schemastery'
import {
  DEFAULT_TURN_RAIL_BACKGROUND, TURN_RAIL_BACKGROUND_FIELD, TURN_RAIL_SETTINGS_NAMESPACE,
  type TurnRailSettings,
} from './turn-rail-settings.ts'

export {
  DEFAULT_TURN_RAIL_BACKGROUND, TURN_RAIL_BACKGROUND_FIELD, TURN_RAIL_SETTINGS_NAMESPACE,
  type TurnRailSettings,
} from './turn-rail-settings.ts'

/** Durable turn-rail schema; the browser scope validates against this wire schema. */
const TurnRailSettingsSchema: z<TurnRailSettings> = z.object({
  [TURN_RAIL_BACKGROUND_FIELD]: z.boolean().default(DEFAULT_TURN_RAIL_BACKGROUND),
})

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
