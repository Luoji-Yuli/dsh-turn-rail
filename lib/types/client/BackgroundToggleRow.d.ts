/** General Settings row for the turn-rail collapsed frosted background. */
import type { SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import { NS } from './locales.ts';
/** Registration-side preference face (module-internal; not part of the client entry API). */
interface BackgroundToggleRowInjected {
    hooks: {
        /** Persisted collapsed-background preference bound as useBackground. */
        background: SnapshotStore<boolean>;
    };
    /** Persist a new collapsed-background preference. */
    setBackground: (enabled: boolean) => void;
}
/** Full Settings-row props. */
export type BackgroundToggleRowProps = PropsRuntime<'settings.general.item'> & PropsLocale<typeof NS> & InjectFace<BackgroundToggleRowInjected>;
/**
 * Render the collapsed-background toggle row.
 * @param props - composed Settings slot props.
 * @returns the preference row.
 */
export declare function BackgroundToggleRow({ useBackground, setBackground, t }: BackgroundToggleRowProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=BackgroundToggleRow.d.ts.map