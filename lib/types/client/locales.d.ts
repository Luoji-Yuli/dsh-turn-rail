/** `turnRail` namespace dictionaries. */
/** Dictionary namespace owned by this plugin. */
export declare const NS = "turnRail";
/** Simplified Chinese dictionary (the key-set source of truth). */
export declare const zh: {
    readonly label: "会话轮次导航";
    readonly 'preview.image': "[图片]";
    readonly 'settings.background.title': "导航条毛玻璃底条";
    readonly 'settings.background.description': "开启后，浅色和深色模式下收起状态的右侧导航条都会显示圆角毛玻璃底条；默认关闭。";
};
/** English dictionary, key-identical to the Chinese source of truth. */
export declare const en: Record<TurnRailKey, string>;
/** Key domain of the `turnRail` namespace (zh is the source of truth). */
export type TurnRailKey = keyof typeof zh;
//# sourceMappingURL=locales.d.ts.map