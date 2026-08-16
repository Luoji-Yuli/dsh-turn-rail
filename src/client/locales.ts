/** `turnRail` namespace dictionaries. */

/** Dictionary namespace owned by this plugin. */
export const NS = 'turnRail'

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'label': '会话轮次导航',
  'preview.image': '[图片]',
} as const

/** English dictionary, key-identical to the Chinese source of truth. */
export const en: Record<TurnRailKey, string> = {
  'label': 'Conversation turn navigation',
  'preview.image': '[Image]',
}

/** Key domain of the `turnRail` namespace (zh is the source of truth). */
export type TurnRailKey = keyof typeof zh
