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
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import { NS } from './locales.ts';
/** Injected business face from the plugin apply closure. */
export interface TurnRailInjected {
    /** Pull one older history page for the current session. */
    loadOlder: () => void;
}
/** Full props for the session-header utilities entry. */
export type TurnRailProps = PropsRuntime<'conversation.session.header.utilities'> & PropsLocale<typeof NS> & TurnRailInjected;
/**
 * Renders the official-style right-side turn navigation rail.
 * @param props - session standard kit plus the namespace translator.
 * @returns a portal into document.body, or null when the session has fewer
 * than two user turns.
 */
export declare function TurnRail({ sessionId, useSession, loadOlder, t }: TurnRailProps): import("react").ReactPortal | null;
//# sourceMappingURL=TurnRail.d.ts.map