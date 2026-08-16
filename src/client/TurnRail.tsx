/**
 * TurnRail: the right-side session turn navigation strip. One row per user
 * message; the row closest to the top of the chat viewport is the active row,
 * and clicking a row scrolls the chat flow to that message. The visual design
 * follows the official DeepSeek page's `_189b4a0` rail:
 * - collapsed: a 34px frosted pill at the viewport right edge, vertically
 *   centered, showing one small horizontal marker per user turn;
 * - expanded (hover / focus-within): a 240px floating panel with one text row
 *   per user turn, the active marker blue and stretched, with the panel
 *   scrolling internally when the turn list outgrows the rail height.
 */

import { createPortal } from 'react-dom'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ConversationSnapshot } from '@deepseek-ai/dsh-client-runtime/client'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import { NS } from './locales.ts'
import css from './TurnRail.module.css'

/** Injected business face from the plugin apply closure. */
export interface TurnRailInjected {
  /** Pull one older history page for the current session. */
  loadOlder: () => void
}

/** Full props for the session-header utilities entry. */
export type TurnRailProps =
  PropsRuntime<'conversation.session.header.utilities'> & PropsLocale<typeof NS> & TurnRailInjected

interface TurnEntry {
  readonly key: string
  readonly preview: string
}

interface UserNodeShape {
  readonly kind?: string
  readonly data?: {
    readonly content?: readonly { type?: string; text?: string }[]
  }
}

const EMPTY_ENTRIES: readonly TurnEntry[] = []

/** First non-empty text block of a user message. */
function extractUserText(content: readonly { type?: string; text?: string }[]): string {
  for (const block of content) {
    if (block.type === 'text' && typeof block.text === 'string') {
      const text = block.text.trim()
      if (text !== '') return text
    }
  }
  return ''
}

function containsImage(content: readonly { type?: string; text?: string }[]): boolean {
  return content.some(block => block.type === 'image')
}

/** User turns in chat flow order; one row per user message with a preview. */
function buildTurnEntries(snapshot: ConversationSnapshot, imageLabel: string): TurnEntry[] {
  const entries: TurnEntry[] = []
  for (const key of snapshot.chat.order) {
    const node = snapshot.chat.nodes.get(key) as unknown as UserNodeShape | undefined
    if (node?.kind !== 'user') continue
    const content = node.data?.content ?? []
    let preview = extractUserText(content)
    if (preview === '' && containsImage(content)) preview = imageLabel
    if (preview === '') continue
    entries.push({ key, preview })
  }
  return entries
}

function sameTurnEntries(left: TurnEntry[] | undefined, right: TurnEntry[] | undefined): boolean {
  if (left === undefined || right === undefined) return left === right
  return left.length === right.length
    && left.every((entry, index) => {
      const other = right[index]
      return other !== undefined && entry.key === other.key && entry.preview === other.preview
    })
}

/**
 * Resolve the active turn key. A turn owns the flow from its user message to
 * the next user message, so the active turn is the last user row whose top
 * sits at or above the reading line (near the top of the viewport). While
 * reading a long assistant answer below its user message, that turn stays
 * active until the next user message crosses the line. If no row is above the
 * line (scrolled above the first turn), the first row owns the view.
 */
function computeCurrentKey(scrollport: HTMLElement, keySet: Set<string>): string | null {
  const viewport = scrollport.getBoundingClientRect()
  const readingLine = viewport.top + Math.min(48, Math.max(24, viewport.height * 0.25))
  let bestKey: string | null = null
  let bestTop = Number.NEGATIVE_INFINITY
  let firstKey: string | null = null
  let firstTop = Number.POSITIVE_INFINITY
  let lastKey: string | null = null
  let lastTop = Number.NEGATIVE_INFINITY
  for (const row of scrollport.querySelectorAll<HTMLElement>('[data-chat-flow-kind="user"]')) {
    const key = row.dataset.chatFlowKey
    if (key === undefined || !keySet.has(key)) continue
    const rect = row.getBoundingClientRect()
    if (rect.top < firstTop) {
      firstTop = rect.top
      firstKey = key
    }
    if (rect.top > lastTop) {
      lastTop = rect.top
      lastKey = key
    }
    if (rect.top <= readingLine && rect.top > bestTop) {
      bestTop = rect.top
      bestKey = key
    }
  }
  // At the bottom of the scrollport the latest turn owns the view even when
  // its user message has not crossed the reading line yet.
  const maxScroll = scrollport.scrollHeight - scrollport.clientHeight
  if (maxScroll > 0 && scrollport.scrollTop >= maxScroll - 24 && lastKey !== null) {
    return lastKey
  }
  return bestKey ?? firstKey
}

function findTurnRow(scrollport: HTMLElement, key: string): HTMLElement | null {
  for (const row of scrollport.querySelectorAll<HTMLElement>('[data-chat-flow-key]')) {
    if (row.dataset.chatFlowKey === key) return row
  }
  return null
}

/**
 * Renders the official-style right-side turn navigation rail.
 * @param props - session standard kit plus the namespace translator.
 * @returns a portal into document.body, or null when the session has fewer
 * than two user turns.
 */
export function TurnRail({ sessionId, useSession, loadOlder, t }: TurnRailProps) {
  const entries = useSession(
    snapshot => buildTurnEntries(snapshot, t('preview.image')),
    sameTurnEntries,
  ) ?? EMPTY_ENTRIES
  const [currentKey, setCurrentKey] = useState<string | null>(null)
  const [overflowing, setOverflowing] = useState(false)
  const navRef = useRef<HTMLElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  const keySet = useMemo(() => new Set(entries.map(entry => entry.key)), [entries])

  // Auto-page older history until the whole session is in the chat window, so
  // the rail can list every user turn without the user scrolling up first.
  const hasMore = useSession(s => s.hasMore)
  const loadingOlder = useSession(s => s.loadingOlder)
  const autoPageCount = useRef(0)
  useEffect(() => {
    autoPageCount.current = 0
  }, [sessionId])
  useEffect(() => {
    if (!hasMore || loadingOlder) return
    autoPageCount.current += 1
    if (autoPageCount.current > 200) return
    loadOlder()
  }, [hasMore, loadingOlder, loadOlder])

  // Follow the active row inside the rail's own scrollport once the current
  // turn changes (scrollspy), so a keyboard or click-driven jump keeps the
  // active marker visible without scrolling the page.
  useEffect(() => {
    const list = listRef.current
    if (list === null || currentKey === null) return
    let activeItem: HTMLElement | null = null
    for (const item of list.querySelectorAll<HTMLElement>('[data-turn-key]')) {
      if (item.dataset.turnKey === currentKey) {
        activeItem = item
        break
      }
    }
    if (activeItem === null) return
    const listRect = list.getBoundingClientRect()
    const itemRect = activeItem.getBoundingClientRect()
    if (itemRect.top < listRect.top) list.scrollTop += itemRect.top - listRect.top
    else if (itemRect.bottom > listRect.bottom) list.scrollTop += itemRect.bottom - listRect.bottom
  }, [currentKey])

  // Scrollspy: recompute the active turn from the chat viewport on scroll and
  // on flow size changes (streaming, image loading, older-page prepend).
  useEffect(() => {
    // Resolve at effect time: the session header (where this entry mounts)
    // renders before ConversationRoot's scroll body, so a render-time query
    // would miss the scrollport on the first commit.
    const scrollport = typeof document === 'undefined'
      ? null
      : document.querySelector<HTMLElement>('[data-conversation-scroll]')
    if (scrollport === null) return
    let frame: number | null = null
    const schedule = (): void => {
      if (frame !== null) return
      if (typeof requestAnimationFrame !== 'function') {
        setCurrentKey(computeCurrentKey(scrollport, keySet))
        return
      }
      frame = requestAnimationFrame(() => {
        frame = null
        setCurrentKey(computeCurrentKey(scrollport, keySet))
      })
    }
    schedule()
    scrollport.addEventListener('scroll', schedule, { passive: true })
    let resizeObserver: ResizeObserver | null = null
    const flow = scrollport.querySelector<HTMLElement>('[data-chat-flow]')
    if (flow !== null && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(schedule)
      resizeObserver.observe(flow)
    }
    return () => {
      scrollport.removeEventListener('scroll', schedule)
      if (frame !== null && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(frame)
      resizeObserver?.disconnect()
    }
  }, [keySet, sessionId])

  // Size the rail to its content, capped at 80% of the conversation viewport
  // height (the user-visible chat area). A short session keeps the official
  // 300px minimum so the frosted pill does not collapse to a stub; a long
  // session grows until the cap, then the list scrolls internally. The fade
  // masks only make sense once that internal scroll exists.
  useEffect(() => {
    const nav = navRef.current
    const list = listRef.current
    if (nav === null || list === null) return
    const update = (): void => {
      const scrollport = typeof document === 'undefined'
        ? null
        : document.querySelector<HTMLElement>('[data-conversation-scroll]')
      const chatHeight = scrollport?.clientHeight
      const viewportFallback = typeof window === 'undefined' ? 600 : window.innerHeight
      const maxHeight = Math.round((chatHeight && chatHeight > 0 ? chatHeight : viewportFallback) * 0.8)
      const contentHeight = list.scrollHeight
      const height = Math.min(maxHeight, Math.max(300, contentHeight))
      nav.style.height = `${height}px`
      setOverflowing(contentHeight > height + 1)
    }
    update()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(update)
    observer.observe(list)
    const scrollport = typeof document === 'undefined'
      ? null
      : document.querySelector<HTMLElement>('[data-conversation-scroll]')
    if (scrollport !== null) observer.observe(scrollport)
    return () => { observer.disconnect() }
  }, [entries, currentKey])

  const jumpTo = useCallback((key: string): void => {
    setCurrentKey(key)
    const scrollport = typeof document === 'undefined'
      ? null
      : document.querySelector<HTMLElement>('[data-conversation-scroll]')
    if (scrollport === null) return
    const row = findTurnRow(scrollport, key)
    if (row !== null && typeof row.scrollIntoView === 'function') {
      row.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  if (sessionId === undefined || entries.length < 2) return null

  const rail = (
    <nav
      ref={navRef}
      className={css.rail}
      aria-label={t('label')}
      onMouseEnter={() => {
        // Re-check overflow once the hover expands the panel (clientHeight is
        // not meaningful while collapsed).
        const list = listRef.current
        if (list !== null) setOverflowing(list.scrollHeight > list.clientHeight + 1)
      }}
    >
      <span className={css.background} aria-hidden />
      <div
        ref={wrapperRef}
        className={`${css.wrapper}${overflowing ? ` ${css.overflowing}` : ''}`}
      >
        <div ref={listRef} className={css.list}>
          {entries.map((entry) => {
            const active = entry.key === currentKey
            return (
              <button
                key={entry.key}
                type="button"
                className={`${css.item}${active ? ` ${css.itemActive}` : ''}`}
                data-turn-key={entry.key}
                aria-current={active ? 'true' : undefined}
                title={entry.preview}
                onClick={() => { jumpTo(entry.key) }}
              >
                <span className={css.title}>{entry.preview}</span>
                <span className={css.markerWrap} aria-hidden>
                  <span className={css.marker} />
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )

  return createPortal(rail, document.body)
}
