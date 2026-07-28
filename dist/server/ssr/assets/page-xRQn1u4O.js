import { C as __toESM, S as stripBasePath, _ as isDangerousScheme, a as getPrefetchedUrls, b as VINEXT_MOUNTED_SLOTS_HEADER, d as createRscRequestUrl, g as withBasePath, h as toSameOriginAppPath, i as getMountedSlotsHeader, m as toBrowserNavigationHref, n as getCurrentInterceptionContext, o as navigateClientSide, p as resolveRelativeHref, s as prefetchRscResponse, t as require_jsx_runtime, u as createRscRequestHeaders, v as AppElementsWire, x as hasBasePath, y as require_react } from "../index.js";
import { a as getDomainLocaleUrl, i as addLocalePrefix, n as appendSearchParamsToUrl, r as urlQueryToSearchParams } from "./query-Cv2-FWPe.js";
//#region node_modules/.pnpm/vinext@0.0.50_@vitejs+plugin-react@6.0.2_vite@8.0.13_@types+node@22.19.19_esbuild@0.28._6558342ba0b940cbd621b36b626ca262/node_modules/vinext/dist/routing/utils.js
var PATH_DELIMITER_REGEX = /([/#?\\]|%(2f|23|3f|5c))/gi;
function encodePathDelimiters(segment) {
	return segment.replace(PATH_DELIMITER_REGEX, (char) => encodeURIComponent(char));
}
/**
* Decode a filesystem or URL path segment while preserving encoded path delimiters.
* Mirrors Next.js segment-wise decoding so "%5F" becomes "_" but "%2F" stays "%2F".
*/
function decodeRouteSegment(segment) {
	try {
		return encodePathDelimiters(decodeURIComponent(segment));
	} catch {
		return segment;
	}
}
/**
* Normalize a pathname for route matching by decoding each segment independently.
* This prevents encoded slashes from turning into real path separators.
*/
function normalizePathnameForRouteMatch(pathname) {
	return pathname.split("/").map((segment) => decodeRouteSegment(segment)).join("/");
}
function decodeMatchedParam(value) {
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}
/**
* Decode captured route params with `decodeURIComponent`, mirroring Next.js
* route-matcher.ts:25-27. Mutates the params object in place. Catch-all
* arrays are decoded element-wise. Malformed escapes are preserved (the
* strict normalization layer rejects them at the request boundary).
*/
function decodeMatchedParams(params) {
	for (const key of Object.keys(params)) {
		const value = params[key];
		if (Array.isArray(value)) params[key] = value.map(decodeMatchedParam);
		else params[key] = decodeMatchedParam(value);
	}
}
//#endregion
//#region node_modules/.pnpm/vinext@0.0.50_@vitejs+plugin-react@6.0.2_vite@8.0.13_@types+node@22.19.19_esbuild@0.28._6558342ba0b940cbd621b36b626ca262/node_modules/vinext/dist/routing/route-trie.js
function createNode() {
	return {
		staticChildren: /* @__PURE__ */ new Map(),
		dynamicChild: null,
		catchAllChild: null,
		optionalCatchAllChild: null,
		route: null
	};
}
/**
* Build a trie from pre-sorted routes.
*
* Routes must have a `patternParts` property (string[] of URL segments).
* Pattern segment conventions:
*   - `:name`  — dynamic segment
*   - `:name+` — catch-all (1+ segments)
*   - `:name*` — optional catch-all (0+ segments)
*   - anything else — static segment
*
* First route to claim a terminal position wins (routes are pre-sorted
* by precedence, so insertion order preserves correct priority).
*/
function buildRouteTrie(routes) {
	const root = createNode();
	for (const route of routes) {
		const parts = route.patternParts;
		if (parts.length === 0) {
			if (root.route === null) root.route = route;
			continue;
		}
		let node = root;
		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			if (part.endsWith("+") && part.startsWith(":")) {
				if (i !== parts.length - 1) break;
				const paramName = part.slice(1, -1);
				if (node.catchAllChild === null) node.catchAllChild = {
					paramName,
					route
				};
				break;
			}
			if (part.endsWith("*") && part.startsWith(":")) {
				if (i !== parts.length - 1) break;
				const paramName = part.slice(1, -1);
				if (node.optionalCatchAllChild === null) node.optionalCatchAllChild = {
					paramName,
					route
				};
				break;
			}
			if (part.startsWith(":")) {
				const paramName = part.slice(1);
				if (node.dynamicChild === null) node.dynamicChild = {
					paramName,
					node: createNode()
				};
				node = node.dynamicChild.node;
				if (i === parts.length - 1) {
					if (node.route === null) node.route = route;
				}
				continue;
			}
			let child = node.staticChildren.get(part);
			if (!child) {
				child = createNode();
				node.staticChildren.set(part, child);
			}
			node = child;
			if (i === parts.length - 1) {
				if (node.route === null) node.route = route;
			}
		}
	}
	return root;
}
/**
* Match a URL against the trie.
*
* Returns decoded param values — `decodeURIComponent` is applied to
* individual param entries so that `%2F` → `/`, `%23` → `#`, etc.
* Segment boundaries (the original `/` splits) are preserved by the
* upstream normalization layer; this step only decodes the captured
* param strings the caller sees.
*
* Mirrors Next.js route-matcher.ts:25-27.
*
* @param root - Trie root built by `buildRouteTrie`
* @param urlParts - Pre-split URL segments (no empty strings)
* @returns Match result with route and extracted params, or null
*/
function trieMatch(root, urlParts) {
	const result = match(root, urlParts, 0);
	if (result) decodeMatchedParams(result.params);
	return result;
}
function createParams() {
	return Object.create(null);
}
function match(node, urlParts, index) {
	if (index === urlParts.length) {
		if (node.route !== null) return {
			route: node.route,
			params: createParams()
		};
		if (node.optionalCatchAllChild !== null) return {
			route: node.optionalCatchAllChild.route,
			params: createParams()
		};
		return null;
	}
	const segment = urlParts[index];
	const staticChild = node.staticChildren.get(segment);
	if (staticChild) {
		const result = match(staticChild, urlParts, index + 1);
		if (result !== null) return result;
	}
	if (node.dynamicChild !== null) {
		const result = match(node.dynamicChild.node, urlParts, index + 1);
		if (result !== null) {
			result.params[node.dynamicChild.paramName] = segment;
			return result;
		}
	}
	if (node.catchAllChild !== null) {
		const remaining = urlParts.slice(index);
		const params = createParams();
		params[node.catchAllChild.paramName] = remaining;
		return {
			route: node.catchAllChild.route,
			params
		};
	}
	if (node.optionalCatchAllChild !== null) {
		const remaining = urlParts.slice(index);
		const params = createParams();
		params[node.optionalCatchAllChild.paramName] = remaining;
		return {
			route: node.optionalCatchAllChild.route,
			params
		};
	}
	return null;
}
//#endregion
//#region node_modules/.pnpm/vinext@0.0.50_@vitejs+plugin-react@6.0.2_vite@8.0.13_@types+node@22.19.19_esbuild@0.28._6558342ba0b940cbd621b36b626ca262/node_modules/vinext/dist/routing/route-matching.js
/**
* Shared route-match preamble used by both Pages Router and App Router.
*
* Both routers normalize URLs and call `trieMatch` with nearly-identical
* preamble: strip query, trailing-slash normalize, run
* `normalizePathnameForRouteMatch`, split into url parts, then look up via a
* per-routes-array trie cache. This module factors that out so each router
* just calls `matchRouteWithTrie(url, routes)`.
*/
function createRouteTrieCache() {
	return /* @__PURE__ */ new WeakMap();
}
function getOrBuildTrie(cache, routes) {
	let trie = cache.get(routes);
	if (!trie) {
		trie = buildRouteTrie(routes);
		cache.set(routes, trie);
	}
	return trie;
}
/**
* Match a URL path against a list of routes via the shared preamble:
*   1. strip query string
*   2. trailing-slash normalize (preserving root "/")
*   3. run `normalizePathnameForRouteMatch`
*   4. split into url parts and look up via the (cached) trie
*
* Generic over the route shape; both Pages `Route` and App `AppRoute`
* satisfy `{ patternParts: string[] }`.
*/
function matchRouteWithTrie(url, routes, cache) {
	const pathname = url.split("?")[0];
	let normalizedUrl = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
	normalizedUrl = normalizePathnameForRouteMatch(normalizedUrl);
	const urlParts = normalizedUrl.split("/").filter(Boolean);
	return trieMatch(getOrBuildTrie(cache, routes), urlParts);
}
//#endregion
//#region node_modules/.pnpm/vinext@0.0.50_@vitejs+plugin-react@6.0.2_vite@8.0.13_@types+node@22.19.19_esbuild@0.28._6558342ba0b940cbd621b36b626ca262/node_modules/vinext/dist/shims/i18n-context.js
var _getI18nContext = () => {
	if (globalThis.__VINEXT_DEFAULT_LOCALE__ == null && globalThis.__VINEXT_LOCALE__ == null) return null;
	return {
		locale: globalThis.__VINEXT_LOCALE__,
		locales: globalThis.__VINEXT_LOCALES__,
		defaultLocale: globalThis.__VINEXT_DEFAULT_LOCALE__,
		domainLocales: globalThis.__VINEXT_DOMAIN_LOCALES__,
		hostname: globalThis.__VINEXT_HOSTNAME__
	};
};
function getI18nContext() {
	return _getI18nContext();
}
//#endregion
//#region node_modules/.pnpm/vinext@0.0.50_@vitejs+plugin-react@6.0.2_vite@8.0.13_@types+node@22.19.19_esbuild@0.28._6558342ba0b940cbd621b36b626ca262/node_modules/vinext/dist/shims/link-prefetch.js
function canLinkPrefetch(input) {
	return input.nodeEnv === "production" && input.prefetch !== false && !input.isDangerous;
}
/**
* Normalize absolute and protocol-relative Link hrefs to app-relative paths
* that are eligible for prefetching. Non-absolute relative hrefs are returned
* unchanged; callers must resolve them against the current browser URL before
* constructing a concrete fetch target.
*/
function getLinkPrefetchHref(input) {
	const { href, basePath, currentOrigin } = input;
	if (!isAbsoluteOrProtocolRelative(href)) return href;
	if (currentOrigin === void 0) return null;
	try {
		const current = new URL(currentOrigin);
		const parsed = href.startsWith("//") ? new URL(href, current.origin) : new URL(href);
		if (parsed.origin !== current.origin) return null;
		if (!basePath) return parsed.pathname + parsed.search + parsed.hash;
		if (!hasBasePath(parsed.pathname, basePath)) return null;
		return stripBasePath(parsed.pathname, basePath) + parsed.search + parsed.hash;
	} catch {
		return null;
	}
}
function isAbsoluteOrProtocolRelative(href) {
	return href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//");
}
//#endregion
//#region node_modules/.pnpm/vinext@0.0.50_@vitejs+plugin-react@6.0.2_vite@8.0.13_@types+node@22.19.19_esbuild@0.28._6558342ba0b940cbd621b36b626ca262/node_modules/vinext/dist/shims/link.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
/**
* next/link shim
*
* Renders an <a> tag with client-side navigation support.
* On click, prevents full page reload and triggers client-side
* page swap via the router's navigation system.
*/
var LinkStatusContext = (0, import_react.createContext)({ pending: false });
/** basePath from next.config.js, injected by the plugin at build time */
var __basePath = "";
var linkPrefetchRouteTrieCache = createRouteTrieCache();
function resolveHref(href) {
	if (typeof href === "string") return href;
	let url = href.pathname ?? "/";
	if (href.query) {
		const params = urlQueryToSearchParams(href.query);
		url = appendSearchParamsToUrl(url, params);
	}
	return url;
}
function resolveLinkPrefetchMode(prefetchProp, isDangerous) {
	if (isDangerous || prefetchProp === false) return "disabled";
	if (prefetchProp === true) return "full";
	return "auto";
}
function toSameOriginRouteHref(href) {
	if (typeof window === "undefined") return null;
	let url;
	try {
		url = new URL(href, window.location.href);
	} catch {
		return null;
	}
	if (url.origin !== window.location.origin) return null;
	return `${stripBasePath(url.pathname, __basePath)}${url.search}`;
}
function canAutoPrefetchFullAppRoute(href) {
	if (typeof window === "undefined") return false;
	const routes = window.__VINEXT_LINK_PREFETCH_ROUTES__;
	if (!routes) return false;
	const routeHref = toSameOriginRouteHref(href);
	if (routeHref === null) return false;
	const match = matchRouteWithTrie(routeHref, routes, linkPrefetchRouteTrieCache);
	if (!match) return false;
	return !match.route.isDynamic;
}
/**
* Prefetch a URL for faster navigation.
*
* For App Router (RSC): fetches the .rsc payload in the background and
* stores it in an in-memory cache for instant use during navigation.
* For Pages Router: injects a <link rel="prefetch"> for the page module.
*
* Uses `requestIdleCallback` (or `setTimeout` fallback) to avoid blocking
* the main thread during initial page load.
*/
function prefetchUrl(href, mode, priority = "low") {
	if (typeof window === "undefined") return;
	const prefetchHref = getLinkPrefetchHref({
		href,
		basePath: __basePath,
		currentOrigin: window.location.origin
	});
	if (prefetchHref == null) return;
	const fullHref = toBrowserNavigationHref(prefetchHref, window.location.href, __basePath);
	(window.requestIdleCallback ?? ((fn) => setTimeout(fn, 100)))(() => {
		(async () => {
			if (typeof window.__VINEXT_RSC_NAVIGATE__ === "function") {
				if (mode === "auto" && !canAutoPrefetchFullAppRoute(prefetchHref)) return;
				const interceptionContext = getCurrentInterceptionContext();
				const mountedSlotsHeader = getMountedSlotsHeader();
				const headers = createRscRequestHeaders({ interceptionContext });
				if (mountedSlotsHeader) headers.set(VINEXT_MOUNTED_SLOTS_HEADER, mountedSlotsHeader);
				const rscUrl = await createRscRequestUrl(fullHref, headers);
				const cacheKey = AppElementsWire.encodeCacheKey(rscUrl, interceptionContext);
				const prefetched = getPrefetchedUrls();
				if (prefetched.has(cacheKey)) return;
				prefetched.add(cacheKey);
				prefetchRscResponse(rscUrl, fetch(rscUrl, {
					headers,
					credentials: "include",
					priority,
					purpose: "prefetch"
				}), interceptionContext, mountedSlotsHeader);
			} else if (window.__NEXT_DATA__?.__vinext?.pageModuleUrl) {
				const link = document.createElement("link");
				link.rel = "prefetch";
				link.href = fullHref;
				link.as = "document";
				document.head.appendChild(link);
			}
		})().catch((error) => {
			console.error("[vinext] RSC prefetch setup error:", error);
		});
	});
}
/**
* Shared IntersectionObserver for viewport-based prefetching.
* All Link elements use the same observer to minimize resource usage.
*/
var sharedObserver = null;
var observerCallbacks = /* @__PURE__ */ new WeakMap();
function getSharedObserver() {
	if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return null;
	if (sharedObserver) return sharedObserver;
	sharedObserver = new IntersectionObserver((entries) => {
		for (const entry of entries) if (entry.isIntersecting) {
			const callback = observerCallbacks.get(entry.target);
			if (callback) {
				callback();
				sharedObserver?.unobserve(entry.target);
				observerCallbacks.delete(entry.target);
			}
		}
	}, { rootMargin: "250px" });
	return sharedObserver;
}
function getDefaultLocale() {
	if (typeof window !== "undefined") return window.__VINEXT_DEFAULT_LOCALE__;
	return getI18nContext()?.defaultLocale;
}
function getDomainLocales() {
	if (typeof window !== "undefined") return window.__NEXT_DATA__?.domainLocales;
	return getI18nContext()?.domainLocales;
}
function getCurrentHostname() {
	if (typeof window !== "undefined") return window.location.hostname;
	return getI18nContext()?.hostname;
}
function getDomainLocaleHref(href, locale) {
	return getDomainLocaleUrl(href, locale, {
		basePath: __basePath,
		currentHostname: getCurrentHostname(),
		domainItems: getDomainLocales()
	});
}
/**
* Apply locale prefix to a URL path based on the locale prop.
* - locale="fr" → prepend /fr (unless it already has a locale prefix)
* - locale={false} → use the href as-is (no locale prefix, link to default)
* - locale=undefined → use current locale (href as-is in most cases)
*/
function applyLocaleToHref(href, locale) {
	if (locale === false) return href;
	if (locale === void 0) return href;
	if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//")) return href;
	const domainLocaleHref = getDomainLocaleHref(href, locale);
	if (domainLocaleHref) return domainLocaleHref;
	return addLocalePrefix(href, locale, getDefaultLocale() ?? "");
}
var Link = (0, import_react.forwardRef)(function Link({ href, as, replace = false, prefetch: prefetchProp, scroll = true, children, onClick, onMouseEnter, onTouchStart, onNavigate, ...rest }, forwardedRef) {
	const { locale, ...restWithoutLocale } = rest;
	const resolvedHref = as ?? resolveHref(href);
	const isDangerous = typeof resolvedHref === "string" && isDangerousScheme(resolvedHref);
	const localizedHref = applyLocaleToHref(isDangerous ? "/" : resolvedHref, locale);
	const fullHref = withBasePath(localizedHref, __basePath);
	const [pending, setPending] = (0, import_react.useState)(false);
	const mountedRef = (0, import_react.useRef)(true);
	(0, import_react.useEffect)(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);
	const internalRef = (0, import_react.useRef)(null);
	const prefetchMode = resolveLinkPrefetchMode(prefetchProp, isDangerous);
	const shouldPrefetch = canLinkPrefetch({
		nodeEnv: "production",
		prefetch: prefetchProp,
		isDangerous
	});
	const setRefs = (0, import_react.useCallback)((node) => {
		internalRef.current = node;
		if (typeof forwardedRef === "function") forwardedRef(node);
		else if (forwardedRef) forwardedRef.current = node;
	}, [forwardedRef]);
	(0, import_react.useEffect)(() => {
		if (!shouldPrefetch || typeof window === "undefined") return;
		const node = internalRef.current;
		if (!node) return;
		const hrefToPrefetch = getLinkPrefetchHref({
			href: localizedHref,
			basePath: __basePath,
			currentOrigin: window.location.origin
		});
		if (hrefToPrefetch == null) return;
		const observer = getSharedObserver();
		if (!observer) return;
		observerCallbacks.set(node, () => prefetchUrl(hrefToPrefetch, prefetchMode, "low"));
		observer.observe(node);
		return () => {
			observer.unobserve(node);
			observerCallbacks.delete(node);
		};
	}, [
		shouldPrefetch,
		prefetchMode,
		localizedHref
	]);
	const prefetchOnIntent = (0, import_react.useCallback)(() => {
		if (!shouldPrefetch) return;
		prefetchUrl(localizedHref, prefetchMode, "high");
	}, [
		shouldPrefetch,
		prefetchMode,
		localizedHref
	]);
	const handleMouseEnter = (0, import_react.useCallback)((e) => {
		onMouseEnter?.(e);
		prefetchOnIntent();
	}, [onMouseEnter, prefetchOnIntent]);
	const handleTouchStart = (0, import_react.useCallback)((e) => {
		onTouchStart?.(e);
		prefetchOnIntent();
	}, [onTouchStart, prefetchOnIntent]);
	const handleClick = async (e) => {
		if (onClick) onClick(e);
		if (e.defaultPrevented) return;
		if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		if (e.currentTarget.target && e.currentTarget.target !== "_self") return;
		let navigateHref = localizedHref;
		if (resolvedHref.startsWith("http://") || resolvedHref.startsWith("https://") || resolvedHref.startsWith("//")) {
			const localPath = toSameOriginAppPath(resolvedHref, __basePath);
			if (localPath == null) return;
			navigateHref = localPath;
		}
		e.preventDefault();
		const absoluteHref = resolveRelativeHref(navigateHref, window.location.href, __basePath);
		const absoluteFullHref = toBrowserNavigationHref(navigateHref, window.location.href, __basePath);
		if (onNavigate) try {
			const navUrl = new URL(absoluteFullHref, window.location.origin);
			let prevented = false;
			const navEvent = {
				url: navUrl,
				preventDefault() {
					prevented = true;
				},
				get defaultPrevented() {
					return prevented;
				}
			};
			onNavigate(navEvent);
			if (navEvent.defaultPrevented) return;
		} catch {}
		if (typeof window.__VINEXT_RSC_NAVIGATE__ === "function") {
			setPending(true);
			import_react.startTransition(() => {
				navigateClientSide(navigateHref, replace ? "replace" : "push", scroll, true).finally(() => {
					if (mountedRef.current) setPending(false);
				});
			});
			return;
		} else try {
			const Router = (await import("./router-Cboig7mw.js")).default;
			if (replace) await Router.replace(absoluteHref, void 0, { scroll });
			else await Router.push(absoluteHref, void 0, { scroll });
		} catch {
			if (replace) window.history.replaceState({}, "", absoluteFullHref);
			else window.history.pushState({}, "", absoluteFullHref);
			window.dispatchEvent(new PopStateEvent("popstate"));
		}
	};
	const { passHref: _p, ...anchorProps } = restWithoutLocale;
	const linkStatusValue = import_react.useMemo(() => ({ pending }), [pending]);
	if (isDangerous) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		...anchorProps,
		onMouseEnter: handleMouseEnter,
		onTouchStart: handleTouchStart,
		children
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkStatusContext.Provider, {
		value: linkStatusValue,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			ref: setRefs,
			href: fullHref,
			onClick: (event) => {
				handleClick(event);
			},
			onMouseEnter: handleMouseEnter,
			onTouchStart: handleTouchStart,
			...anchorProps,
			children
		})
	});
});
//#endregion
//#region app/advisor/review/page.tsx
function AdvisorReviewPage() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [notice, setNotice] = (0, import_react.useState)("正在连接审核工作台…");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const pending = (0, import_react.useMemo)(() => items.filter((item) => item.reviewStatus === "pending_review"), [items]);
	const approved = items.filter((item) => item.reviewStatus === "verified").length;
	async function load() {
		setLoading(true);
		try {
			const response = await fetch("/api/advisor/intelligence");
			if (!response.ok) throw new Error(response.status === 401 ? "请先使用顾问账号登录，再访问审核工作台。" : "审核数据暂时不可用。");
			const payload = await response.json();
			setItems(payload.items);
			setSelected(payload.items.find((item) => item.reviewStatus === "pending_review") ?? null);
			setNotice("");
		} catch (error) {
			setNotice(error instanceof Error ? error.message : "审核工作台暂时不可用。");
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	async function review(item, decision) {
		const response = await fetch(`/api/advisor/intelligence/${item.id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ decision })
		});
		if (!response.ok) {
			setNotice("审核未保存，请稍后重试。");
			return;
		}
		const { item: updated } = await response.json();
		const nextItems = items.map((current) => current.id === updated.id ? updated : current);
		setItems(nextItems);
		setSelected(nextItems.find((current) => current.reviewStatus === "pending_review") ?? null);
		setNotice(decision === "verified" ? "已核验并发布给学生端。" : "已退回，学生端不会看到这条信息。");
	}
	async function monitor() {
		setNotice("正在检查 5 所学校的官方页面…");
		const response = await fetch("/api/advisor/monitor", { method: "POST" });
		const payload = await response.json();
		if (!response.ok) {
			setNotice(payload.error ?? "监测未能启动。");
			return;
		}
		setNotice(`监测完成：新增基线 ${payload.initialized ?? 0} 个，发现变化 ${payload.changed ?? 0} 个。`);
		await load();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "advisor-shell",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "advisor-sidebar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "advisor-brand",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "A" }),
							" Atlas ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "顾问端" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { children: "⌂ 概览" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "active",
							children: ["◌ 情报审核 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: pending.length })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { children: "◫ 学生进度" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { children: "▤ 申请计划" })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "advisor-side-note",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "审核原则" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "先证据，后建议" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "学生端只读取已核验的官方情报。" })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "advisor-workspace",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "advisor-topbar",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "顾问工作台" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "学校情报审核" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "advisor-actions",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => void monitor(),
							children: "检查官方来源"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							href: "/",
							className: "student-link",
							children: "查看学生端 ↗"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "advisor-content",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "advisor-summary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "待审核" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: pending.length }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "确认后才会影响学生任务" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "已发布" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: approved }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "学生端可见" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "监测学校" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Cornell、UC Davis、NYU、CMU、Stanford" })
							] })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "review-layout",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "review-queue",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "advisor-section-title",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "审核队列" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "待确认的学校变化" })]
							}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "empty-state",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "正在加载" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "读取审核队列。" })]
							}) : pending.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "empty-state",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "当前没有待审核项目" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "点击“检查官方来源”建立或更新监测基线。" })]
							}) : pending.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: `review-queue-item ${selected?.id === item.id ? "selected" : ""}`,
								onClick: () => setSelected(item),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "review-school-mark",
										style: { background: item.schoolAccent },
										children: item.schoolCode
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.schoolName }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [item.category, " · 待核验"] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.title })
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "待审核" })
								]
							}, item.id))]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
							className: "review-detail",
							children: selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "detail-header",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "detail-tag",
											children: "待审核"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: selected.title }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
											selected.schoolName,
											" · ",
											selected.category
										] })
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "confidence",
										children: ["状态 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "需人工确认" })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "review-block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "检测到的事实" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: selected.fact })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "review-block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "面向学生的影响判断" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: selected.impact })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "review-block action",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "建议下一步" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: selected.action })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "source-list",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "官方监测来源" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: selected.sourceUrl,
										target: "_blank",
										rel: "noreferrer",
										children: [
											selected.sourceLabel,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "↗" })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "review-actions",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "return",
										onClick: () => void review(selected, "returned"),
										children: "退回补充"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "approve",
										onClick: () => void review(selected, "verified"),
										children: "确认并发布给学生"
									})]
								})
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "empty-state",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "审核队列为空" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: notice || "官方来源的变化将在这里等待确认。" })]
							})
						})]
					})]
				})]
			}),
			notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "advisor-toast",
				children: notice
			})
		]
	});
}
//#endregion
export { AdvisorReviewPage as default };
