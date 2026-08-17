// @vitest-environment jsdom
// TurnRail: right-side session turn navigation strip behavior.
import { afterEach, afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import type { ConversationSnapshot, SessionId } from '@deepseek-ai/dsh-client-runtime/client'
import { TurnRail, keepItemVisible } from '../src/client/TurnRail.tsx'
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

function makeProps(
  snapshot: ConversationSnapshot,
  loadOlder = vi.fn(),
  railBackground = false,
) {
  return {
    sessionId: sid('s1'),
    useSession: staticUseSession(snapshot),
    useRailBackground: (selector: (value: boolean) => unknown) => selector(railBackground),
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

// vitest's jsdom env provides a real asynchronous requestAnimationFrame
// (pretendToBeVisual). Run it synchronously so scrollspy state lands
// deterministically inside act and no frame outlives the test.
beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback): null => {
    callback(0)
    return null
  })
  vi.stubGlobal('cancelAnimationFrame', () => {})
})
afterEach(() => {
  vi.unstubAllGlobals()
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

  it('renders the frosted background only when the preference is enabled', () => {
    const users = [
      { key: 'k1', preview: 'first question' },
      { key: 'k2', preview: 'second question' },
    ]
    makeScrollport(users)
    render(<TurnRail {...makeProps(snapshotWithUsers(users), vi.fn(), false)} />)
    expect(document.querySelector('nav [class*=background]')).toBeNull()

    cleanup()
    document.body.innerHTML = ''
    makeScrollport(users)
    render(<TurnRail {...makeProps(snapshotWithUsers(users), vi.fn(), true)} />)
    expect(document.querySelector('nav [class*=background]')).not.toBeNull()
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

// --- protective geometry stubs -------------------------------------------------
// jsdom has no layout: everything measures 0 and scrollTop never moves. These
// helpers fake the scrollport/row geometry the rail reads, so scrollspy, sizing
// and list-follow behavior can be asserted deterministically.

function fakeRect(top: number, height: number, bottom = top + height): DOMRect {
  return { top, bottom, left: 0, right: 0, width: 0, height, x: 0, y: top, toJSON: () => ({}) } as DOMRect
}

/**
 * Fake the conversation scrollport layout. The reading line resolves to
 * `top + min(48, max(24, 25% of height))`; the defaults put it at 148.
 */
function fakeScrollportLayout(scrollport: HTMLElement, options: {
  top?: number
  height?: number
  scrollHeight?: number
  scrollTop?: number
} = {}): void {
  const top = options.top ?? 100
  const height = options.height ?? 400
  Object.defineProperty(scrollport, 'clientHeight', { value: height, configurable: true })
  Object.defineProperty(scrollport, 'scrollHeight', { value: options.scrollHeight ?? 800, configurable: true })
  Object.defineProperty(scrollport, 'scrollTop', { value: options.scrollTop ?? 0, configurable: true })
  Object.defineProperty(scrollport, 'getBoundingClientRect', {
    value: () => fakeRect(top, height),
    configurable: true,
  })
}

/** Put one user row at a fixed viewport top. */
function fakeRowTop(row: HTMLElement, top: number): void {
  Object.defineProperty(row, 'getBoundingClientRect', {
    value: () => fakeRect(top, 20),
    configurable: true,
  })
}

/** Change the scroll offset and let the scrollspy listener run. */
function scrollTo(scrollport: HTMLElement, scrollTop: number): void {
  Object.defineProperty(scrollport, 'scrollTop', { value: scrollTop, configurable: true })
  act(() => { scrollport.dispatchEvent(new Event('scroll')) })
}

function activeKey(): string | null {
  const active = document.querySelector('[data-turn-key][aria-current="true"]')
  return active === null ? null : (active as HTMLElement).dataset.turnKey ?? null
}

describe('scrollspy', () => {
  function renderRail(users: readonly RailUser[], options: { scrollTop?: number; rowsBelowLine?: boolean } = {}): HTMLElement {
    const { scrollport } = makeScrollport(users)
    fakeScrollportLayout(scrollport, { scrollTop: options.scrollTop })
    users.forEach((user, index) => {
      const row = scrollport.querySelector(`[data-chat-flow-key="${user.key}"]`)
      expect(row).not.toBeNull()
      fakeRowTop(row as HTMLElement, options.rowsBelowLine === true ? 200 + index * 30 : 110 + index * 20)
    })
    render(<TurnRail {...makeProps(snapshotWithUsers(users))} />)
    return scrollport
  }

  it('activates the last user row at or above the reading line', () => {
    // Rows at 110 / 130 / 150; the reading line sits at 148 → the middle row wins.
    renderRail([
      { key: 'k1', preview: 'first question' },
      { key: 'k2', preview: 'second question' },
      { key: 'k3', preview: 'third question' },
    ])
    expect(activeKey()).toBe('k2')
  })

  it('gives the view to the latest row when scrolled near the bottom', () => {
    const scrollport = renderRail([
      { key: 'k1', preview: 'first question' },
      { key: 'k2', preview: 'second question' },
      { key: 'k3', preview: 'third question' },
    ])
    expect(activeKey()).toBe('k2')
    // maxScroll = 800 - 400 = 400; 390 >= 400 - 24 → the last row owns the view.
    scrollTo(scrollport, 390)
    expect(activeKey()).toBe('k3')
  })

  it('falls back to the first row while nothing has crossed the reading line', () => {
    renderRail([
      { key: 'k1', preview: 'first question' },
      { key: 'k2', preview: 'second question' },
      { key: 'k3', preview: 'third question' },
    ], { rowsBelowLine: true })
    expect(activeKey()).toBe('k1')
  })
})

describe('turn previews', () => {
  function snapshotWithContents(entries: readonly { key: string; content: readonly { type?: string; text?: string }[] }[]): ConversationSnapshot {
    const order = entries.map(entry => entry.key)
    const nodes = {
      get: (key: string) => {
        const entry = entries.find(item => item.key === key)
        if (entry === undefined) return undefined
        return { kind: 'user', data: { kind: 'user', content: entry.content } }
      },
    }
    return { chat: { order, nodes }, hasMore: false, loadingOlder: false } as unknown as ConversationSnapshot
  }

  it('labels image-only turns with the image placeholder', () => {
    const entries = [
      { key: 'img', content: [{ type: 'image', text: 'raw.png' }] },
      { key: 'txt', content: [{ type: 'text', text: 'real question' }] },
    ]
    makeScrollport(entries.map(entry => ({ key: entry.key, preview: '' })))
    render(<TurnRail {...makeProps(snapshotWithContents(entries))} />)
    const rows = document.querySelectorAll('[data-turn-key]')
    expect(rows).toHaveLength(2)
    expect(document.querySelector('[data-turn-key="img"]')?.getAttribute('title')).toBe('[Image]')
    expect(document.querySelector('[data-turn-key="txt"]')?.getAttribute('title')).toBe('real question')
  })

  it('skips user messages without text or image content', () => {
    const entries = [
      { key: 'empty', content: [] },
      { key: 'txt', content: [{ type: 'text', text: 'hello' }] },
      { key: 'img', content: [{ type: 'image' }] },
    ]
    makeScrollport(entries.map(entry => ({ key: entry.key, preview: '' })))
    render(<TurnRail {...makeProps(snapshotWithContents(entries))} />)
    const rows = document.querySelectorAll('[data-turn-key]')
    expect(rows).toHaveLength(2)
    expect(document.querySelector('[data-turn-key="empty"]')).toBeNull()
  })
})

describe('sizing', () => {
  // jsdom reports scrollHeight 0 on every element; the sizing effect caps the
  // rail at 80% of the conversation viewport height. Stub the prototype so the
  // rail's list reports a configurable content height.
  let originalScrollHeight: PropertyDescriptor | undefined
  let fakeScrollHeight: number | null = null

  beforeAll(() => {
    originalScrollHeight = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollHeight')
    Object.defineProperty(Element.prototype, 'scrollHeight', {
      configurable: true,
      get() { return fakeScrollHeight ?? 0 },
    })
  })

  afterAll(() => {
    if (originalScrollHeight !== undefined) {
      Object.defineProperty(Element.prototype, 'scrollHeight', originalScrollHeight)
    }
  })

  function renderWithListHeight(users: readonly RailUser[], listHeight: number): HTMLElement {
    fakeScrollHeight = listHeight
    const { scrollport } = makeScrollport(users)
    // 500px conversation viewport → rail cap at 80% = 400px.
    fakeScrollportLayout(scrollport, { height: 500, scrollHeight: 600 })
    render(<TurnRail {...makeProps(snapshotWithUsers(users))} />)
    return document.querySelector('nav') as HTMLElement
  }

  it('caps the rail height at 80% of the conversation viewport', () => {
    const nav = renderWithListHeight([
      { key: 'k1', preview: 'first question' },
      { key: 'k2', preview: 'second question' },
    ], 1000)
    expect(nav.style.height).toBe('400px')
    const wrapper = nav.querySelector('[class*="wrapper"]')
    expect(wrapper?.className).toContain('overflowing')
  })

  it('keeps the 300px minimum for short sessions and stays non-overflowing', () => {
    const nav = renderWithListHeight([
      { key: 'k1', preview: 'first question' },
      { key: 'k2', preview: 'second question' },
    ], 100)
    expect(nav.style.height).toBe('300px')
    const wrapper = nav.querySelector('[class*="wrapper"]')
    expect(wrapper?.className).not.toContain('overflowing')
  })
})

describe('list follow', () => {
  // The follow math is a pure DOM operation (keepItemVisible); test it
  // directly — React defers passive-effect updates in jsdom, which makes an
  // end-to-end scroll assertion racy.
  it('scrolls the list up when the active item sits below the visible box', () => {
    const list = document.createElement('div')
    const item = document.createElement('button')
    list.appendChild(item)
    Object.defineProperty(list, 'getBoundingClientRect', { value: () => fakeRect(300, 300, 600), configurable: true })
    Object.defineProperty(item, 'getBoundingClientRect', { value: () => fakeRect(650, 50, 700), configurable: true })
    keepItemVisible(list, item)
    expect(list.scrollTop).toBe(100) // 700 - 600
  })

  it('scrolls the list down when the active item sits above the visible box', () => {
    const list = document.createElement('div')
    const item = document.createElement('button')
    list.appendChild(item)
    Object.defineProperty(list, 'getBoundingClientRect', { value: () => fakeRect(300, 300, 600), configurable: true })
    Object.defineProperty(item, 'getBoundingClientRect', { value: () => fakeRect(50, 50, 100), configurable: true })
    keepItemVisible(list, item)
    expect(list.scrollTop).toBe(-250) // 50 - 300
  })

  it('leaves the scroll offset alone while the active item is visible', () => {
    const list = document.createElement('div')
    const item = document.createElement('button')
    list.appendChild(item)
    list.scrollTop = 42
    Object.defineProperty(list, 'getBoundingClientRect', { value: () => fakeRect(300, 300, 600), configurable: true })
    Object.defineProperty(item, 'getBoundingClientRect', { value: () => fakeRect(350, 50, 400), configurable: true })
    keepItemVisible(list, item)
    expect(list.scrollTop).toBe(42)
  })
})
