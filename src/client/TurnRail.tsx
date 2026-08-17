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
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ConversationSnapshot, SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import { NS } from './locales.ts'
import css from './TurnRail.module.css'

/** Injected business face from the plugin apply closure. */
export interface TurnRailInjected {
  hooks: {
    /** Persisted collapsed-background preference bound as useRailBackground. */
    railBackground: SnapshotStore<boolean>
  }
  /** Pull one older history page for the current session. */
  loadOlder: () => void
}

/** Full props for the session-header utilities entry. */
export type TurnRailProps =
  PropsRuntime<'conversation.session.header.utilities'>
  & PropsLocale<typeof NS>
  & InjectFace<TurnRailInjected>

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

/** One cached user row: content-coordinate top, so the scroll path needs no layout reads. */
interface TurnRowMeasure {
  readonly key: string
  readonly top: number
}

const EMPTY_ENTRIES: readonly TurnEntry[] = []
const EMPTY_ROWS: readonly TurnRowMeasure[] = []

/** First non-empty text block of a user message; falls back to the image label. */
function previewOf(node: UserNodeShape, imageLabel: string): string {
  let text = ''
  let hasImage = false
  for (const block of node.data?.content ?? []) {
    if (block.type === 'text' && typeof block.text === 'string') {
      const trimmed = block.text.trim()
      if (text === '' && trimmed !== '') text = trimmed
    } else if (block.type === 'image') {
      hasImage = true
    }
  }
  return text !== '' ? text : (hasImage ? imageLabel : '')
}

/** User turns in chat flow order; one row per user message with a preview. */
function buildTurnEntries(snapshot: ConversationSnapshot, imageLabel: string): TurnEntry[] {
  const entries: TurnEntry[] = []
  for (const key of snapshot.chat.order) {
    const node = snapshot.chat.nodes.get(key) as unknown as UserNodeShape | undefined
    if (node?.kind !== 'user') continue
    const preview = previewOf(node, imageLabel)
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
 * Resolve the active turn key from cached measurements. A turn owns the flow
 * from its user message to the next user message, so the active turn is the
 * last user row whose top sits at or above the reading line (near the top of
 * the viewport). While reading a long assistant answer below its user message,
 * that turn stays active until the next user message crosses the line. If no
 * row is above the line (scrolled above the first turn), the first row owns
 * the view. Pure arithmetic on content coordinates — no DOM query, no layout
 * read on the scroll path.
 */
function computeCurrentKey(scrollport: HTMLElement, rows: readonly TurnRowMeasure[]): string | null {
  if (rows.length === 0) return null
  const lineOffset = Math.min(48, Math.max(24, scrollport.clientHeight * 0.25))
  const line = scrollport.scrollTop + lineOffset
  let bestIndex = -1
  for (let index = 0; index < rows.length; index += 1) {
    if (rows[index]!.top <= line) bestIndex = index
    else break // DOM order = content order: rows below the line can't become active.
  }
  // At the bottom of the scrollport the latest turn owns the view even when
  // its user message has not crossed the reading line yet.
  const maxScroll = scrollport.scrollHeight - scrollport.clientHeight
  if (maxScroll > 0 && scrollport.scrollTop >= maxScroll - 24) return rows[rows.length - 1]!.key
  // Scrolled above the first turn: the first row owns the view.
  return bestIndex >= 0 ? rows[bestIndex]!.key : rows[0]!.key
}

/** Measure user rows into content coordinates; runs only when the flow changes. */
function measureTurnRows(scrollport: HTMLElement, keySet: Set<string>): TurnRowMeasure[] {
  const scrollportRect = scrollport.getBoundingClientRect()
  const rows: TurnRowMeasure[] = []
  for (const row of scrollport.querySelectorAll<HTMLElement>('[data-chat-flow-kind="user"]')) {
    const key = row.dataset.chatFlowKey
    if (key === undefined || !keySet.has(key)) continue
    rows.push({ key, top: row.getBoundingClientRect().top - scrollportRect.top + scrollport.scrollTop })
  }
  return rows
}

function findTurnRow(scrollport: HTMLElement, key: string): HTMLElement | null {
  for (const row of scrollport.querySelectorAll<HTMLElement>('[data-chat-flow-key]')) {
    if (row.dataset.chatFlowKey === key) return row
  }
  return null
}

/** Scroll the rail list by the delta that brings the active item into view. */
export function keepItemVisible(list: HTMLElement, activeItem: HTMLElement): void {
  const listRect = list.getBoundingClientRect()
  const itemRect = activeItem.getBoundingClientRect()
  if (itemRect.top < listRect.top) list.scrollTop += itemRect.top - listRect.top
  else if (itemRect.bottom > listRect.bottom) list.scrollTop += itemRect.bottom - listRect.bottom
}

/** The conversation scrollport mounts with ConversationRoot, after the header entry. */
function findConversationScrollport(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-conversation-scroll]')
}

interface TurnRowProps {
  readonly entry: TurnEntry
  readonly active: boolean
  readonly onJump: (key: string) => void
}

/** One rail row; memoized so a scroll crossing re-renders only the changed rows. */
const TurnRow = memo(function TurnRow({ entry, active, onJump }: TurnRowProps) {
  return (
    <button
      type="button"
      className={`${css.item}${active ? ` ${css.itemActive}` : ''}`}
      data-turn-key={entry.key}
      aria-current={active ? 'true' : undefined}
      title={entry.preview}
      onClick={() => { onJump(entry.key) }}
    >
      <span className={css.title}>{entry.preview}</span>
      <span className={css.markerWrap} aria-hidden>
        <span className={css.marker} />
      </span>
    </button>
  )
}, (previous, next) =>
  previous.entry.preview === next.entry.preview
  && previous.active === next.active
  && previous.onJump === next.onJump)

/**
 * Renders the official-style right-side turn navigation rail.
 * @param props - session standard kit plus the namespace translator.
 * @returns a portal into document.body, or null when the session has fewer
 * than two user turns.
 */
export function TurnRail({ sessionId, useSession, useRailBackground, loadOlder, t }: TurnRailProps) {
  const entries = useSession(
    snapshot => buildTurnEntries(snapshot, t('preview.image')),
    sameTurnEntries,
  ) ?? EMPTY_ENTRIES
  const backgroundEnabled = useRailBackground(value => value)
  const [currentKey, setCurrentKey] = useState<string | null>(null)
  const [overflowing, setOverflowing] = useState(false)
  const navRef = useRef<HTMLElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const rowsRef = useRef<readonly TurnRowMeasure[]>(EMPTY_ROWS)

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
    keepItemVisible(list, activeItem)
  }, [currentKey])

  // Scrollspy: resolve the active turn on scroll and on flow changes. Row
  // positions are measured into a content-coordinate cache only when the flow
  // structurally changes (turn set or size), so the scroll path itself stays
  // free of DOM queries and layout reads.
  useEffect(() => {
    // Resolve at effect time: the session header (where this entry mounts)
    // renders before ConversationRoot's scroll body, so a render-time query
    // would miss the scrollport on the first commit.
    const scrollport = findConversationScrollport()
    if (scrollport === null) return
    let frame: number | null = null
    const run = (remap: boolean): void => {
      frame = null
      if (remap) rowsRef.current = measureTurnRows(scrollport, keySet)
      setCurrentKey(computeCurrentKey(scrollport, rowsRef.current))
    }
    const schedule = (remap: boolean): void => {
      if (frame !== null) return
      frame = requestAnimationFrame(() => run(remap))
    }
    const onScroll = (): void => { schedule(false) }
    rowsRef.current = measureTurnRows(scrollport, keySet)
    schedule(false)
    scrollport.addEventListener('scroll', onScroll, { passive: true })
    let resizeObserver: ResizeObserver | null = null
    const flow = scrollport.querySelector<HTMLElement>('[data-chat-flow]')
    if (flow !== null && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => schedule(true))
      resizeObserver.observe(flow)
      // The reading-line offset follows the conversation viewport height.
      resizeObserver.observe(scrollport)
    }
    return () => {
      scrollport.removeEventListener('scroll', onScroll)
      if (frame !== null) cancelAnimationFrame(frame)
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
      const scrollport = findConversationScrollport()
      const chatHeight = scrollport?.clientHeight
      const maxHeight = Math.round((chatHeight !== undefined && chatHeight > 0 ? chatHeight : window.innerHeight) * 0.8)
      const contentHeight = list.scrollHeight
      const height = Math.min(maxHeight, Math.max(300, contentHeight))
      nav.style.height = `${height}px`
      setOverflowing(contentHeight > height + 1)
    }
    update()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(update)
    observer.observe(list)
    const scrollport = findConversationScrollport()
    if (scrollport !== null) observer.observe(scrollport)
    return () => { observer.disconnect() }
  }, [entries])

  const jumpTo = useCallback((key: string): void => {
    setCurrentKey(key)
    const scrollport = findConversationScrollport()
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
      {backgroundEnabled && <span className={css.background} aria-hidden />}
      <div
        className={`${css.wrapper}${overflowing ? ` ${css.overflowing}` : ''}`}
      >
        <div ref={listRef} className={css.list}>
          {entries.map(entry => (
            <TurnRow
              key={entry.key}
              entry={entry}
              active={entry.key === currentKey}
              onJump={jumpTo}
            />
          ))}
        </div>
      </div>
    </nav>
  )

  return createPortal(rail, document.body)
}
