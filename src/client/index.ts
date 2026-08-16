/**
 * Right-side session turn rail plugin, browser half: contributes one entry to
 * `conversation.session.header.utilities` that renders a fixed rail over the
 * chat viewport, in the style of the official DeepSeek page's session turn
 * navigation strip.
 */
import type { ClientContext, SessionId } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import { TurnRail } from './TurnRail.tsx'
import { en, NS, zh, type TurnRailKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Right-side turn rail copy. */
    turnRail: TurnRailKey
  }
}

export type { TurnRailInjected, TurnRailProps } from './TurnRail.tsx'

/** Required services for locale registration and utilities-slot contribution. */
export const inject = ['sessions', 'slots', 'locale']

/**
 * Browser plugin body: register the dictionaries and the turn-rail utility.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-turn-rail: dictionaries')
  ctx.slots.inject(
    'conversation.session.header.utilities',
    () => ctx.slots.register({
      name: 'conversation.session.header.utilities',
      id: 'turn-rail',
      // After the shipped header utilities so the rail never reorders session context.
      order: 20,
      locale: NS,
      inject: (sessionId: SessionId) => ({
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
