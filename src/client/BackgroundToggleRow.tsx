/** General Settings row for the turn-rail collapsed frosted background. */

import type { SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { NS } from './locales.ts'
import css from './BackgroundToggleRow.module.css'

/** Registration-side preference face (module-internal; not part of the client entry API). */
interface BackgroundToggleRowInjected {
  hooks: {
    /** Persisted collapsed-background preference bound as useBackground. */
    background: SnapshotStore<boolean>
  }
  /** Persist a new collapsed-background preference. */
  setBackground: (enabled: boolean) => void
}

/** Full Settings-row props. */
export type BackgroundToggleRowProps =
  PropsRuntime<'settings.general.item'>
  & PropsLocale<typeof NS>
  & InjectFace<BackgroundToggleRowInjected>

/**
 * Render the collapsed-background toggle row.
 * @param props - composed Settings slot props.
 * @returns the preference row.
 */
export function BackgroundToggleRow({ useBackground, setBackground, t }: BackgroundToggleRowProps) {
  const enabled = useBackground(value => value)

  return (
    <div className={css.row}>
      <div className={css.rowText}>
        <div className={css.title}>{t('settings.background.title')}</div>
        <div className={css.desc}>{t('settings.background.description')}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        className={css.switch}
        onClick={() => { setBackground(!enabled) }}
      >
        <span className={css.thumb} aria-hidden />
      </button>
    </div>
  )
}
