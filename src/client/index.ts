/**
 * Right-side session turn rail plugin, browser half: contributes one entry to
 * `conversation.session.header.utilities` that renders a fixed rail over the
 * chat viewport, in the style of the official DeepSeek page's session turn
 * navigation strip.
 */
import { createSnapshotStore, type ClientContext, type SessionId } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { BackgroundToggleRow } from './BackgroundToggleRow.tsx'
import { TurnRail } from './TurnRail.tsx'
import {
  DEFAULT_TURN_RAIL_BACKGROUND, TURN_RAIL_BACKGROUND_FIELD, TURN_RAIL_SETTINGS_NAMESPACE,
  type TurnRailSettings,
} from '../turn-rail-settings.ts'
import { en, NS, zh, type TurnRailKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Right-side turn rail copy. */
    turnRail: TurnRailKey
  }
}

export type { TurnRailInjected, TurnRailProps } from './TurnRail.tsx'

/** Required services for locale registration and utilities-slot contribution. */
export const inject = ['sessions', 'slots', 'locale', 'settingsScope']

/**
 * Browser plugin body: register the dictionaries and the turn-rail utility.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-turn-rail: dictionaries')

  // Durable opt-in preference for the collapsed frosted background. The
  // settings scope publishes Host state asynchronously; a local snapshot store
  // keeps both the settings row and the rail itself reactive.
  const railSettings = ctx.settingsScope.bind<TurnRailSettings>({ namespace: TURN_RAIL_SETTINGS_NAMESPACE })
  const backgroundStore = createSnapshotStore(DEFAULT_TURN_RAIL_BACKGROUND)
  const adoptBackground = (): void => {
    const value = railSettings.getSnapshot().value?.background
    if (value !== undefined && backgroundStore.getSnapshot() !== value) backgroundStore.set(value)
  }
  railSettings.subscribe(adoptBackground)
  adoptBackground()
  const setBackground = (enabled: boolean): void => {
    if (backgroundStore.getSnapshot() !== enabled) backgroundStore.set(enabled)
    void railSettings.set(TURN_RAIL_BACKGROUND_FIELD, enabled)
  }

  ctx.slots.inject(
    'settings.general.item',
    () => ctx.slots.register({
      name: 'settings.general.item',
      id: 'turn-rail-background',
      order: 40,
      locale: NS,
      inject: () => ({
        hooks: { background: backgroundStore },
        setBackground,
      }),
    }, BackgroundToggleRow),
  )

  ctx.slots.inject(
    'conversation.session.header.utilities',
    () => ctx.slots.register({
      name: 'conversation.session.header.utilities',
      id: 'turn-rail',
      // After the shipped header utilities so the rail never reorders session context.
      order: 20,
      locale: NS,
      inject: (sessionId: SessionId) => ({
        hooks: { railBackground: backgroundStore },
        loadOlder: () => {
          // Scope-addressed service read (same pattern as ui-conversation's
          // own scopedConversation helper): the conversation service owns
          // history paging. Never import the service class cross-package.
          const conversation = ctx.sessions.scope(sessionId)?.get('conversation') as
            | { loadOlder(): Promise<void> }
            | undefined
          void conversation?.loadOlder()
        },
      }),
    }, TurnRail),
  )
}
