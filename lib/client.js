window.__ModuleLoader__.load({
	id: "@deepseek-ai/dsh-turn-rail",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let _deepseek_ai_dsh_client_runtime_client = require("@deepseek-ai/dsh-client-runtime/client");
		let react_jsx_runtime = require("react/jsx-runtime");
		let react_dom = require("react-dom");
		let react = require("react");
		//#region \0dsh-css:/home/zen/deepseek-harness/packages/client/ui-turn-rail/src/client/BackgroundToggleRow.module.css.mjs
		const css$1 = ".IBZUcq_row{border-bottom:1px solid var(--dsw-alias-border-l2);align-items:center;gap:8px;padding:16px 0;display:flex}.IBZUcq_rowText{flex-direction:column;flex:1;gap:4px;min-width:0;padding-right:48px;display:flex}.IBZUcq_title{color:var(--dsw-alias-label-primary);font-size:14px;font-weight:400;line-height:22px}.IBZUcq_desc{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}.IBZUcq_switch{background:var(--dsw-alias-bg-module-platform);cursor:pointer;border:none;border-radius:11px;flex:none;width:36px;height:22px;padding:0;transition:background .2s;position:relative}.IBZUcq_switch[aria-checked=true]{background:var(--dsw-alias-state-business-primary)}.IBZUcq_thumb{background:var(--dsw-alias-bg-layer-1);width:18px;height:18px;box-shadow:var(--dsw-shadow-lv1,0 0 1px #0003);border-radius:50%;transition:left .2s;position:absolute;top:2px;left:2px}.IBZUcq_switch[aria-checked=true] .IBZUcq_thumb{left:16px}";
		const tagId$1 = "@deepseek-ai/dsh-turn-rail/BackgroundToggleRow.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-turn-rail";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var BackgroundToggleRow_module_css_default = {
			"rowText": "IBZUcq_rowText",
			"desc": "IBZUcq_desc",
			"row": "IBZUcq_row",
			"title": "IBZUcq_title",
			"switch": "IBZUcq_switch",
			"thumb": "IBZUcq_thumb"
		};
		//#endregion
		//#region src/client/BackgroundToggleRow.tsx
		/**
		* Render the collapsed-background toggle row.
		* @param props - composed Settings slot props.
		* @returns the preference row.
		*/
		function BackgroundToggleRow({ useBackground, setBackground, t }) {
			const enabled = useBackground((value) => value);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: BackgroundToggleRow_module_css_default.row,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: BackgroundToggleRow_module_css_default.rowText,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: BackgroundToggleRow_module_css_default.title,
						children: t("settings.background.title")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: BackgroundToggleRow_module_css_default.desc,
						children: t("settings.background.description")
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					role: "switch",
					"aria-checked": enabled,
					className: BackgroundToggleRow_module_css_default.switch,
					onClick: () => {
						setBackground(!enabled);
					},
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: BackgroundToggleRow_module_css_default.thumb,
						"aria-hidden": true
					})
				})]
			});
		}
		//#endregion
		//#region \0dsh-css:/home/zen/deepseek-harness/packages/client/ui-turn-rail/src/client/TurnRail.module.css.mjs
		const css = "@media not all and (width>=768px){.QM_LoG_rail{display:none}}.QM_LoG_rail{z-index:5;user-select:none;border-radius:8px;justify-content:center;align-items:center;width:34px;height:300px;max-height:calc(100vh - 32px);display:flex;position:fixed;top:50%;right:16px;transform:translateY(-50%)}.QM_LoG_background{z-index:-1;background:var(--dsw-alias-bg-layer-1);opacity:.8;-webkit-backdrop-filter:blur(5px);border-radius:16px;width:34px;height:calc(100% - 8px);position:absolute;top:50%;right:0;transform:translateY(-50%)}.QM_LoG_wrapper{pointer-events:none;border:1px solid #0000;border-radius:16px;flex-direction:column;align-items:stretch;width:fit-content;max-width:240px;max-height:100%;transition:background .2s,box-shadow .2s;display:flex;position:absolute;top:50%;right:0;overflow:hidden;transform:translateY(-50%)}.QM_LoG_rail:hover .QM_LoG_wrapper,.QM_LoG_rail:focus-within .QM_LoG_wrapper{pointer-events:auto;background:var(--dsw-alias-bg-layer-1);border-color:var(--dsw-alias-border-inverted);box-shadow:var(--dsw-shadow-lv3)}.QM_LoG_wrapper:before,.QM_LoG_wrapper:after{content:\"\";z-index:2;opacity:0;pointer-events:none;background:linear-gradient(var(--dsw-alias-bg-layer-1) 20.19%, transparent 100%);height:32px;transition:opacity .2s;position:absolute;left:0;right:0}.QM_LoG_rail:hover .QM_LoG_wrapper.QM_LoG_overflowing:before,.QM_LoG_rail:focus-within .QM_LoG_wrapper.QM_LoG_overflowing:before,.QM_LoG_rail:hover .QM_LoG_wrapper.QM_LoG_overflowing:after,.QM_LoG_rail:focus-within .QM_LoG_wrapper.QM_LoG_overflowing:after{opacity:1;transition:none}.QM_LoG_wrapper:before{top:0}.QM_LoG_wrapper:after{bottom:0;transform:rotate(180deg)}.QM_LoG_list{box-sizing:border-box;scrollbar-width:none;width:240px;max-height:100%;padding:15px 0 15px 24px;overflow:hidden auto}.QM_LoG_list::-webkit-scrollbar{display:none}.QM_LoG_item{width:calc(100% - 6px);height:30px;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:0;justify-content:flex-end;align-items:center;margin:0 8px 0 0;padding:0;font-size:13px;line-height:20px;display:flex}.QM_LoG_item:hover,.QM_LoG_item:hover .QM_LoG_title{color:var(--dsw-alias-label-primary)}.QM_LoG_item:hover .QM_LoG_marker{background-color:var(--dsw-alias-label-primary)}.QM_LoG_item:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:-2px;border-radius:6px}.QM_LoG_title{text-overflow:ellipsis;white-space:nowrap;opacity:0;flex:1;min-width:0;margin-right:12px;transition:opacity .1s,color .2s;overflow:hidden}.QM_LoG_rail:hover .QM_LoG_title,.QM_LoG_rail:focus-within .QM_LoG_title{opacity:1}.QM_LoG_markerWrap{flex:none;justify-content:center;align-items:center;width:16px;height:20px;display:flex}.QM_LoG_marker{background-color:var(--dsw-alias-border-l4);border-radius:4px;flex:none;width:8px;height:2px;transition:background-color .2s}.QM_LoG_itemActive .QM_LoG_title{color:var(--dsw-alias-state-business-primary);font-weight:500}.QM_LoG_itemActive .QM_LoG_marker{background-color:var(--dsw-alias-state-business-primary);transform-origin:50%;transform:scale(1.5)}";
		const tagId = "@deepseek-ai/dsh-turn-rail/TurnRail.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-turn-rail";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var TurnRail_module_css_default = {
			"overflowing": "QM_LoG_overflowing",
			"marker": "QM_LoG_marker",
			"itemActive": "QM_LoG_itemActive",
			"background": "QM_LoG_background",
			"title": "QM_LoG_title",
			"list": "QM_LoG_list",
			"markerWrap": "QM_LoG_markerWrap",
			"rail": "QM_LoG_rail",
			"wrapper": "QM_LoG_wrapper",
			"item": "QM_LoG_item"
		};
		//#endregion
		//#region src/client/TurnRail.tsx
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
		const EMPTY_ENTRIES = [];
		const EMPTY_ROWS = [];
		/** First non-empty text block of a user message; falls back to the image label. */
		function previewOf(node, imageLabel) {
			let text = "";
			let hasImage = false;
			for (const block of node.data?.content ?? []) if (block.type === "text" && typeof block.text === "string") {
				const trimmed = block.text.trim();
				if (text === "" && trimmed !== "") text = trimmed;
			} else if (block.type === "image") hasImage = true;
			return text !== "" ? text : hasImage ? imageLabel : "";
		}
		/** User turns in chat flow order; one row per user message with a preview. */
		function buildTurnEntries(snapshot, imageLabel) {
			const entries = [];
			for (const key of snapshot.chat.order) {
				const node = snapshot.chat.nodes.get(key);
				if (node?.kind !== "user") continue;
				const preview = previewOf(node, imageLabel);
				if (preview === "") continue;
				entries.push({
					key,
					preview
				});
			}
			return entries;
		}
		function sameTurnEntries(left, right) {
			if (left === void 0 || right === void 0) return left === right;
			return left.length === right.length && left.every((entry, index) => {
				const other = right[index];
				return other !== void 0 && entry.key === other.key && entry.preview === other.preview;
			});
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
		function computeCurrentKey(scrollport, rows) {
			if (rows.length === 0) return null;
			const lineOffset = Math.min(48, Math.max(24, scrollport.clientHeight * .25));
			const line = scrollport.scrollTop + lineOffset;
			let bestIndex = -1;
			for (let index = 0; index < rows.length; index += 1) if (rows[index].top <= line) bestIndex = index;
			else break;
			const maxScroll = scrollport.scrollHeight - scrollport.clientHeight;
			if (maxScroll > 0 && scrollport.scrollTop >= maxScroll - 24) return rows[rows.length - 1].key;
			return bestIndex >= 0 ? rows[bestIndex].key : rows[0].key;
		}
		/** Measure user rows into content coordinates; runs only when the flow changes. */
		function measureTurnRows(scrollport, keySet) {
			const scrollportRect = scrollport.getBoundingClientRect();
			const rows = [];
			for (const row of scrollport.querySelectorAll("[data-chat-flow-kind=\"user\"]")) {
				const key = row.dataset.chatFlowKey;
				if (key === void 0 || !keySet.has(key)) continue;
				rows.push({
					key,
					top: row.getBoundingClientRect().top - scrollportRect.top + scrollport.scrollTop
				});
			}
			return rows;
		}
		function findTurnRow(scrollport, key) {
			for (const row of scrollport.querySelectorAll("[data-chat-flow-key]")) if (row.dataset.chatFlowKey === key) return row;
			return null;
		}
		/** Scroll the rail list by the delta that brings the active item into view. */
		function keepItemVisible(list, activeItem) {
			const listRect = list.getBoundingClientRect();
			const itemRect = activeItem.getBoundingClientRect();
			if (itemRect.top < listRect.top) list.scrollTop += itemRect.top - listRect.top;
			else if (itemRect.bottom > listRect.bottom) list.scrollTop += itemRect.bottom - listRect.bottom;
		}
		/** The conversation scrollport mounts with ConversationRoot, after the header entry. */
		function findConversationScrollport() {
			return document.querySelector("[data-conversation-scroll]");
		}
		/** One rail row; memoized so a scroll crossing re-renders only the changed rows. */
		const TurnRow = (0, react.memo)(function TurnRow({ entry, active, onJump }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				className: `${TurnRail_module_css_default.item}${active ? ` ${TurnRail_module_css_default.itemActive}` : ""}`,
				"data-turn-key": entry.key,
				"aria-current": active ? "true" : void 0,
				title: entry.preview,
				onClick: () => {
					onJump(entry.key);
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: TurnRail_module_css_default.title,
					children: entry.preview
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: TurnRail_module_css_default.markerWrap,
					"aria-hidden": true,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: TurnRail_module_css_default.marker })
				})]
			});
		}, (previous, next) => previous.entry.preview === next.entry.preview && previous.active === next.active && previous.onJump === next.onJump);
		/**
		* Renders the official-style right-side turn navigation rail.
		* @param props - session standard kit plus the namespace translator.
		* @returns a portal into document.body, or null when the session has fewer
		* than two user turns.
		*/
		function TurnRail({ sessionId, useSession, useRailBackground, loadOlder, t }) {
			const entries = useSession((snapshot) => buildTurnEntries(snapshot, t("preview.image")), sameTurnEntries) ?? EMPTY_ENTRIES;
			const backgroundEnabled = useRailBackground((value) => value);
			const [currentKey, setCurrentKey] = (0, react.useState)(null);
			const [overflowing, setOverflowing] = (0, react.useState)(false);
			const navRef = (0, react.useRef)(null);
			const listRef = (0, react.useRef)(null);
			const rowsRef = (0, react.useRef)(EMPTY_ROWS);
			const keySet = (0, react.useMemo)(() => new Set(entries.map((entry) => entry.key)), [entries]);
			const hasMore = useSession((s) => s.hasMore);
			const loadingOlder = useSession((s) => s.loadingOlder);
			const autoPageCount = (0, react.useRef)(0);
			(0, react.useEffect)(() => {
				autoPageCount.current = 0;
			}, [sessionId]);
			(0, react.useEffect)(() => {
				if (!hasMore || loadingOlder) return;
				autoPageCount.current += 1;
				if (autoPageCount.current > 200) return;
				loadOlder();
			}, [
				hasMore,
				loadingOlder,
				loadOlder
			]);
			(0, react.useEffect)(() => {
				const list = listRef.current;
				if (list === null || currentKey === null) return;
				let activeItem = null;
				for (const item of list.querySelectorAll("[data-turn-key]")) if (item.dataset.turnKey === currentKey) {
					activeItem = item;
					break;
				}
				if (activeItem === null) return;
				keepItemVisible(list, activeItem);
			}, [currentKey]);
			(0, react.useEffect)(() => {
				const scrollport = findConversationScrollport();
				if (scrollport === null) return;
				let frame = null;
				const run = (remap) => {
					frame = null;
					if (remap) rowsRef.current = measureTurnRows(scrollport, keySet);
					setCurrentKey(computeCurrentKey(scrollport, rowsRef.current));
				};
				const schedule = (remap) => {
					if (frame !== null) return;
					frame = requestAnimationFrame(() => run(remap));
				};
				const onScroll = () => {
					schedule(false);
				};
				rowsRef.current = measureTurnRows(scrollport, keySet);
				schedule(false);
				scrollport.addEventListener("scroll", onScroll, { passive: true });
				let resizeObserver = null;
				const flow = scrollport.querySelector("[data-chat-flow]");
				if (flow !== null && typeof ResizeObserver !== "undefined") {
					resizeObserver = new ResizeObserver(() => schedule(true));
					resizeObserver.observe(flow);
					resizeObserver.observe(scrollport);
				}
				return () => {
					scrollport.removeEventListener("scroll", onScroll);
					if (frame !== null) cancelAnimationFrame(frame);
					resizeObserver?.disconnect();
				};
			}, [keySet, sessionId]);
			(0, react.useEffect)(() => {
				const nav = navRef.current;
				const list = listRef.current;
				if (nav === null || list === null) return;
				const update = () => {
					const chatHeight = findConversationScrollport()?.clientHeight;
					const maxHeight = Math.round((chatHeight !== void 0 && chatHeight > 0 ? chatHeight : window.innerHeight) * .8);
					const contentHeight = list.scrollHeight;
					const height = Math.min(maxHeight, Math.max(300, contentHeight));
					nav.style.height = `${height}px`;
					setOverflowing(contentHeight > height + 1);
				};
				update();
				if (typeof ResizeObserver === "undefined") return;
				const observer = new ResizeObserver(update);
				observer.observe(list);
				const scrollport = findConversationScrollport();
				if (scrollport !== null) observer.observe(scrollport);
				return () => {
					observer.disconnect();
				};
			}, [entries]);
			const jumpTo = (0, react.useCallback)((key) => {
				setCurrentKey(key);
				const scrollport = findConversationScrollport();
				if (scrollport === null) return;
				const row = findTurnRow(scrollport, key);
				if (row !== null && typeof row.scrollIntoView === "function") row.scrollIntoView({
					behavior: "smooth",
					block: "start"
				});
			}, []);
			if (sessionId === void 0 || entries.length < 2) return null;
			return (0, react_dom.createPortal)(/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("nav", {
				ref: navRef,
				className: TurnRail_module_css_default.rail,
				"aria-label": t("label"),
				onMouseEnter: () => {
					const list = listRef.current;
					if (list !== null) setOverflowing(list.scrollHeight > list.clientHeight + 1);
				},
				children: [backgroundEnabled && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: TurnRail_module_css_default.background,
					"aria-hidden": true
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: `${TurnRail_module_css_default.wrapper}${overflowing ? ` ${TurnRail_module_css_default.overflowing}` : ""}`,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						ref: listRef,
						className: TurnRail_module_css_default.list,
						children: entries.map((entry) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TurnRow, {
							entry,
							active: entry.key === currentKey,
							onJump: jumpTo
						}, entry.key))
					})
				})]
			}), document.body);
		}
		//#endregion
		//#region src/turn-rail-settings.ts
		/** Shared settings contract for the turn-rail plugin (host and browser). */
		/** Settings namespace owned by the turn-rail plugin. */
		const TURN_RAIL_SETTINGS_NAMESPACE = "turn-rail";
		/** Field carrying the collapsed frosted-background preference. */
		const TURN_RAIL_BACKGROUND_FIELD = "background";
		//#endregion
		//#region src/client/locales.ts
		/** `turnRail` namespace dictionaries. */
		/** Dictionary namespace owned by this plugin. */
		const NS = "turnRail";
		/** Simplified Chinese dictionary (the key-set source of truth). */
		const zh = {
			"label": "会话轮次导航",
			"preview.image": "[图片]",
			"settings.background.title": "导航条毛玻璃底条",
			"settings.background.description": "开启后，浅色和深色模式下收起状态的右侧导航条都会显示圆角毛玻璃底条；默认关闭。"
		};
		/** English dictionary, key-identical to the Chinese source of truth. */
		const en = {
			"label": "Conversation turn navigation",
			"preview.image": "[Image]",
			"settings.background.title": "Turn rail frosted background",
			"settings.background.description": "When enabled, the collapsed right-side turn rail shows its rounded frosted background in both light and dark themes. Off by default."
		};
		//#endregion
		//#region src/client/index.ts
		/**
		* Right-side session turn rail plugin, browser half: contributes one entry to
		* `conversation.session.header.utilities` that renders a fixed rail over the
		* chat viewport, in the style of the official DeepSeek page's session turn
		* navigation strip.
		*/
		/** Required services for locale registration and utilities-slot contribution. */
		const inject = [
			"sessions",
			"slots",
			"locale",
			"settingsScope"
		];
		/**
		* Browser plugin body: register the dictionaries and the turn-rail utility.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "dsh-turn-rail: dictionaries");
			const railSettings = ctx.settingsScope.bind({ namespace: TURN_RAIL_SETTINGS_NAMESPACE });
			const backgroundStore = (0, _deepseek_ai_dsh_client_runtime_client.createSnapshotStore)(false);
			const adoptBackground = () => {
				const value = railSettings.getSnapshot().value?.background;
				if (value !== void 0 && backgroundStore.getSnapshot() !== value) backgroundStore.set(value);
			};
			railSettings.subscribe(adoptBackground);
			adoptBackground();
			const setBackground = (enabled) => {
				if (backgroundStore.getSnapshot() !== enabled) backgroundStore.set(enabled);
				railSettings.set(TURN_RAIL_BACKGROUND_FIELD, enabled);
			};
			ctx.slots.inject("settings.general.item", () => ctx.slots.register({
				name: "settings.general.item",
				id: "turn-rail-background",
				order: 40,
				locale: NS,
				inject: () => ({
					hooks: { background: backgroundStore },
					setBackground
				})
			}, BackgroundToggleRow));
			ctx.slots.inject("conversation.session.header.utilities", () => ctx.slots.register({
				name: "conversation.session.header.utilities",
				id: "turn-rail",
				order: 20,
				locale: NS,
				inject: (sessionId) => ({
					hooks: { railBackground: backgroundStore },
					loadOlder: () => {
						(ctx.sessions.scope(sessionId)?.get("conversation"))?.loadOlder();
					}
				})
			}, TurnRail));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map