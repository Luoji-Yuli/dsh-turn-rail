/** Host settings-schema registration for the turn-rail plugin. */

import z from '@deepseek-ai/schemastery'
import {
  DEFAULT_TURN_RAIL_BACKGROUND, TURN_RAIL_BACKGROUND_FIELD, type TurnRailSettings,
} from './turn-rail-settings.ts'

/** Durable turn-rail schema; the browser scope validates against this wire schema. */
export const TurnRailSettingsSchema: z<TurnRailSettings> = z.object({
  [TURN_RAIL_BACKGROUND_FIELD]: z.boolean().default(DEFAULT_TURN_RAIL_BACKGROUND),
})
