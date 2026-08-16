/** `turnRail` namespace dictionaries. */

/** Dictionary namespace owned by this plugin. */
export const NS = 'turnRail'

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'label': '会话轮次导航',
  'preview.image': '[图片]',
  'settings.background.title': '导航条毛玻璃底条',
  'settings.background.description': '开启后，浅色和深色模式下收起状态的右侧导航条都会显示圆角毛玻璃底条；默认关闭。',
} as const

/** English dictionary, key-identical to the Chinese source of truth. */
export const en: Record<TurnRailKey, string> = {
  'label': 'Conversation turn navigation',
  'preview.image': '[Image]',
  'settings.background.title': 'Turn rail frosted background',
  'settings.background.description': 'When enabled, the collapsed right-side turn rail shows its rounded frosted background in both light and dark themes. Off by default.',
}

/** Key domain of the `turnRail` namespace (zh is the source of truth). */
export type TurnRailKey = keyof typeof zh
