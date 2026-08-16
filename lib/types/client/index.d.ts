/**
 * Right-side session turn rail plugin, browser half: contributes one entry to
 * `conversation.session.header.utilities` that renders a fixed rail over the
 * chat viewport, in the style of the official DeepSeek page's session turn
 * navigation strip.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
import { type TurnRailKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Right-side turn rail copy. */
        turnRail: TurnRailKey;
    }
}
export type { TurnRailInjected, TurnRailProps } from './TurnRail.tsx';
/** Required services for locale registration and utilities-slot contribution. */
export declare const inject: string[];
/**
 * Browser plugin body: register the dictionaries and the turn-rail utility.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map