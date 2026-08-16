/** Shared settings contract for the turn-rail plugin (host and browser). */
/** Settings namespace owned by the turn-rail plugin. */
export declare const TURN_RAIL_SETTINGS_NAMESPACE = "turn-rail";
/** Field carrying the collapsed frosted-background preference. */
export declare const TURN_RAIL_BACKGROUND_FIELD = "background";
/** Collapsed frosted pill is opt-in: default OFF (no background in any theme). */
export declare const DEFAULT_TURN_RAIL_BACKGROUND = false;
/** Durable turn-rail section shared by the Host schema and the browser scope. */
export interface TurnRailSettings {
    /** When true, the collapsed rail shows the frosted rounded pill in light and dark themes. */
    background: boolean;
}
//# sourceMappingURL=turn-rail-settings.d.ts.map