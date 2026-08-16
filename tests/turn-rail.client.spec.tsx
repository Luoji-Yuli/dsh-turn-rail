// @vitest-environment jsdom
// TurnRail: right-side session turn navigation strip behavior.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import type { ConversationSnapshot, SessionId } from '@deepseek-ai/dsh-client-runtime/client'
import { TurnRail } from '../src/client/TurnRail.tsx'
import type { TurnRailProps } from '../src/client/TurnRail.tsx'

const sid = (id: string) => id as SessionId

interface RailUser {
  readonly key: string
  readonly preview: string
}

function snapshotWithUsers(users: readonly RailUser[]): ConversationSnapshot {
  const order = users.map(user => user.key)
  const nodes = {
    get: (key: string) => {
      const user = users.find(item => item.key === key)
      if (user === undefined) return undefined
      return {
        kind: 'user',
        data: { kind: 'user', content: [{ type: 'text', text: user.preview }] },
      }
    },
  }
  return {
    chat: { order, nodes },
    hasMore: false,
    loadingOlder: false,
  } as unknown as ConversationSnapshot
}

function staticUseSession(snapshot: ConversationSnapshot): TurnRailProps['useSession'] {
  return selector => selector(snapshot)
}

function makeProps(snapshot: ConversationSnapshot, loadOlder = vi.fn()) {
  return {
    sessionId: sid('s1'),
    useSession: staticUseSession(snapshot),
    loadOlder,
    t: t as TurnRailProps['t'],
  }
}

function makeScrollport(users: readonly RailUser[]): {
  scrollport: HTMLDivElement
  rows: HTMLDivElement[]
} {
  const scrollport = document.createElement('div')
  scrollport.setAttribute('data-conversation-scroll', '')
  const rows = users.map((user) => {
    const row = document.createElement('div')
    row.dataset.chatFlowKey = user.key
    row.dataset.chatFlowKind = 'user'
    scrollport.appendChild(row)
    return row
  })
  document.body.appendChild(scrollport)
  return { scrollport, rows }
}

function t(key: string): string {
  if (key === 'label') return 'Conversation turn navigation'
  if (key === 'preview.image') return '[Image]'
  return key
}

afterEach(() => {
  cleanup()
  document.body.innerHTML = ''
})

describe('TurnRail', () => {
  it('renders nothing while the session has fewer than two user turns', () => {
    const users = [{ key: 'k1', preview: 'only one' }]
    makeScrollport(users)
    const view = render(
      <TurnRail
        {...makeProps(snapshotWithUsers(users))}
      />,
    )
    expect(document.querySelector('nav[aria-label="Conversation turn navigation"]')).toBeNull()
    expect(view.container.querySelector('nav')).toBeNull()
  })

  it('auto-pages older history while the session has more and is not already loading', () => {
    const users = [
      { key: 'k1', preview: 'first question' },
      { key: 'k2', preview: 'second question' },
    ]
    const loadOlder = vi.fn()
    const snapshot = {
      ...snapshotWithUsers(users),
      hasMore: true,
      loadingOlder: false,
    } as unknown as ConversationSnapshot
    makeScrollport(users)
    render(<TurnRail {...makeProps(snapshot, loadOlder)} />)
    expect(loadOlder).toHaveBeenCalled()
  })

  it('renders one row per user turn and jumps to the clicked row', () => {
    const users = [
      { key: 'k1', preview: 'first question' },
      { key: 'k2', preview: 'second question' },
    ]
    const { scrollport, rows } = makeScrollport(users)
    const firstScrollIntoView = vi.fn()
    const secondScrollIntoView = vi.fn()
    rows[0]!.scrollIntoView = firstScrollIntoView
    rows[1]!.scrollIntoView = secondScrollIntoView

    render(
      <TurnRail
        {...makeProps(snapshotWithUsers(users))}
      />,
    )

    const nav = document.querySelector('nav[aria-label="Conversation turn navigation"]')
    expect(nav).not.toBeNull()
    expect(nav?.querySelectorAll('[data-turn-key]')).toHaveLength(2)
    expect(nav?.textContent).toContain('first question')
    expect(nav?.textContent).toContain('second question')

    fireEvent.click(nav!.querySelector('[data-turn-key="k2"]') as HTMLElement)
    expect(secondScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
    expect(firstScrollIntoView).not.toHaveBeenCalled()
    expect(scrollport.querySelector('[data-chat-flow-key="k2"]')).not.toBeNull()
  })
})
