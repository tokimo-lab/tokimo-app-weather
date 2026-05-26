import * as e from "react";
import { StrictMode as t, createContext as n, createElement as r, forwardRef as i, useCallback as a, useContext as o, useEffect as s, useRef as c, useState as l } from "react";
import { Fragment as u, jsx as d, jsxs as f } from "react/jsx-runtime";
import { defineApp as p, makeTranslator as m } from "@tokimo/sdk";
import { ConfigProvider as h, ScrollArea as g, ToastProvider as _, enUS as v, zhCN as y } from "@tokimo/ui";
import { createRoot as b } from "react-dom/client";
//#region node_modules/.pnpm/@tanstack+query-core@5.100.14/node_modules/@tanstack/query-core/build/modern/subscribable.js
var x = class {
	constructor() {
		this.listeners = /* @__PURE__ */ new Set(), this.subscribe = this.subscribe.bind(this);
	}
	subscribe(e) {
		return this.listeners.add(e), this.onSubscribe(), () => {
			this.listeners.delete(e), this.onUnsubscribe();
		};
	}
	hasListeners() {
		return this.listeners.size > 0;
	}
	onSubscribe() {}
	onUnsubscribe() {}
}, S = new class extends x {
	#e;
	#t;
	#n;
	constructor() {
		super(), this.#n = (e) => {
			if (typeof window < "u" && window.addEventListener) {
				let t = () => e();
				return window.addEventListener("visibilitychange", t, !1), () => {
					window.removeEventListener("visibilitychange", t);
				};
			}
		};
	}
	onSubscribe() {
		this.#t || this.setEventListener(this.#n);
	}
	onUnsubscribe() {
		this.hasListeners() || (this.#t?.(), this.#t = void 0);
	}
	setEventListener(e) {
		this.#n = e, this.#t?.(), this.#t = e((e) => {
			typeof e == "boolean" ? this.setFocused(e) : this.onFocus();
		});
	}
	setFocused(e) {
		this.#e !== e && (this.#e = e, this.onFocus());
	}
	onFocus() {
		let e = this.isFocused();
		this.listeners.forEach((t) => {
			t(e);
		});
	}
	isFocused() {
		return typeof this.#e == "boolean" ? this.#e : globalThis.document?.visibilityState !== "hidden";
	}
}(), C = {
	setTimeout: (e, t) => setTimeout(e, t),
	clearTimeout: (e) => clearTimeout(e),
	setInterval: (e, t) => setInterval(e, t),
	clearInterval: (e) => clearInterval(e)
}, w = new class {
	#e = C;
	setTimeoutProvider(e) {
		this.#e = e;
	}
	setTimeout(e, t) {
		return this.#e.setTimeout(e, t);
	}
	clearTimeout(e) {
		this.#e.clearTimeout(e);
	}
	setInterval(e, t) {
		return this.#e.setInterval(e, t);
	}
	clearInterval(e) {
		this.#e.clearInterval(e);
	}
}();
function ee(e) {
	setTimeout(e, 0);
}
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.14/node_modules/@tanstack/query-core/build/modern/utils.js
var te = typeof window > "u" || "Deno" in globalThis;
function T() {}
function ne(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function E(e) {
	return typeof e == "number" && e >= 0 && e !== Infinity;
}
function D(e, t) {
	return Math.max(e + (t || 0) - Date.now(), 0);
}
function O(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function k(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function re(e, t) {
	let { type: n = "all", exact: r, fetchStatus: i, predicate: a, queryKey: o, stale: s } = e;
	if (o) {
		if (r) {
			if (t.queryHash !== A(o, t.options)) return !1;
		} else if (!M(t.queryKey, o)) return !1;
	}
	if (n !== "all") {
		let e = t.isActive();
		if (n === "active" && !e || n === "inactive" && e) return !1;
	}
	return !(typeof s == "boolean" && t.isStale() !== s || i && i !== t.state.fetchStatus || a && !a(t));
}
function ie(e, t) {
	let { exact: n, status: r, predicate: i, mutationKey: a } = e;
	if (a) {
		if (!t.options.mutationKey) return !1;
		if (n) {
			if (j(t.options.mutationKey) !== j(a)) return !1;
		} else if (!M(t.options.mutationKey, a)) return !1;
	}
	return !(r && t.state.status !== r || i && !i(t));
}
function A(e, t) {
	return (t?.queryKeyHashFn || j)(e);
}
function j(e) {
	return JSON.stringify(e, (e, t) => F(t) ? Object.keys(t).sort().reduce((e, n) => (e[n] = t[n], e), {}) : t);
}
function M(e, t) {
	return e === t ? !0 : typeof e == typeof t && e && t && typeof e == "object" && typeof t == "object" ? Object.keys(t).every((n) => M(e[n], t[n])) : !1;
}
var ae = Object.prototype.hasOwnProperty;
function N(e, t, n = 0) {
	if (e === t) return e;
	if (n > 500) return t;
	let r = oe(e) && oe(t);
	if (!r && !(F(e) && F(t))) return t;
	let i = (r ? e : Object.keys(e)).length, a = r ? t : Object.keys(t), o = a.length, s = r ? Array(o) : {}, c = 0;
	for (let l = 0; l < o; l++) {
		let o = r ? l : a[l], u = e[o], d = t[o];
		if (u === d) {
			s[o] = u, (r ? l < i : ae.call(e, o)) && c++;
			continue;
		}
		if (u === null || d === null || typeof u != "object" || typeof d != "object") {
			s[o] = d;
			continue;
		}
		let f = N(u, d, n + 1);
		s[o] = f, f === u && c++;
	}
	return i === o && c === i ? e : s;
}
function P(e, t) {
	if (!t || Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let n in e) if (e[n] !== t[n]) return !1;
	return !0;
}
function oe(e) {
	return Array.isArray(e) && e.length === Object.keys(e).length;
}
function F(e) {
	if (!se(e)) return !1;
	let t = e.constructor;
	if (t === void 0) return !0;
	let n = t.prototype;
	return !(!se(n) || !n.hasOwnProperty("isPrototypeOf") || Object.getPrototypeOf(e) !== Object.prototype);
}
function se(e) {
	return Object.prototype.toString.call(e) === "[object Object]";
}
function ce(e) {
	return new Promise((t) => {
		w.setTimeout(t, e);
	});
}
function I(e, t, n) {
	return typeof n.structuralSharing == "function" ? n.structuralSharing(e, t) : n.structuralSharing === !1 ? t : N(e, t);
}
function le(e, t, n = 0) {
	let r = [...e, t];
	return n && r.length > n ? r.slice(1) : r;
}
function ue(e, t, n = 0) {
	let r = [t, ...e];
	return n && r.length > n ? r.slice(0, -1) : r;
}
var L = /* @__PURE__ */ Symbol();
function de(e, t) {
	return !e.queryFn && t?.initialPromise ? () => t.initialPromise : !e.queryFn || e.queryFn === L ? () => Promise.reject(/* @__PURE__ */ Error(`Missing queryFn: '${e.queryHash}'`)) : e.queryFn;
}
function fe(e, t) {
	return typeof e == "function" ? e(...t) : !!e;
}
function pe(e, t, n) {
	let r = !1, i;
	return Object.defineProperty(e, "signal", {
		enumerable: !0,
		get: () => (i ??= t(), r ? i : (r = !0, i.aborted ? n() : i.addEventListener("abort", n, { once: !0 }), i))
	}), e;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.14/node_modules/@tanstack/query-core/build/modern/environmentManager.js
var R = /* @__PURE__ */ (() => {
	let e = () => te;
	return {
		isServer() {
			return e();
		},
		setIsServer(t) {
			e = t;
		}
	};
})();
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.14/node_modules/@tanstack/query-core/build/modern/thenable.js
function z() {
	let e, t, n = new Promise((n, r) => {
		e = n, t = r;
	});
	n.status = "pending", n.catch(() => {});
	function r(e) {
		Object.assign(n, e), delete n.resolve, delete n.reject;
	}
	return n.resolve = (t) => {
		r({
			status: "fulfilled",
			value: t
		}), e(t);
	}, n.reject = (e) => {
		r({
			status: "rejected",
			reason: e
		}), t(e);
	}, n;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.14/node_modules/@tanstack/query-core/build/modern/notifyManager.js
var me = ee;
function he() {
	let e = [], t = 0, n = (e) => {
		e();
	}, r = (e) => {
		e();
	}, i = me, a = (r) => {
		t ? e.push(r) : i(() => {
			n(r);
		});
	}, o = () => {
		let t = e;
		e = [], t.length && i(() => {
			r(() => {
				t.forEach((e) => {
					n(e);
				});
			});
		});
	};
	return {
		batch: (e) => {
			let n;
			t++;
			try {
				n = e();
			} finally {
				t--, t || o();
			}
			return n;
		},
		batchCalls: (e) => (...t) => {
			a(() => {
				e(...t);
			});
		},
		schedule: a,
		setNotifyFunction: (e) => {
			n = e;
		},
		setBatchNotifyFunction: (e) => {
			r = e;
		},
		setScheduler: (e) => {
			i = e;
		}
	};
}
var B = he(), V = new class extends x {
	#e = !0;
	#t;
	#n;
	constructor() {
		super(), this.#n = (e) => {
			if (typeof window < "u" && window.addEventListener) {
				let t = () => e(!0), n = () => e(!1);
				return window.addEventListener("online", t, !1), window.addEventListener("offline", n, !1), () => {
					window.removeEventListener("online", t), window.removeEventListener("offline", n);
				};
			}
		};
	}
	onSubscribe() {
		this.#t || this.setEventListener(this.#n);
	}
	onUnsubscribe() {
		this.hasListeners() || (this.#t?.(), this.#t = void 0);
	}
	setEventListener(e) {
		this.#n = e, this.#t?.(), this.#t = e(this.setOnline.bind(this));
	}
	setOnline(e) {
		this.#e !== e && (this.#e = e, this.listeners.forEach((t) => {
			t(e);
		}));
	}
	isOnline() {
		return this.#e;
	}
}();
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.14/node_modules/@tanstack/query-core/build/modern/retryer.js
function ge(e) {
	return Math.min(1e3 * 2 ** e, 3e4);
}
function H(e) {
	return (e ?? "online") === "online" ? V.isOnline() : !0;
}
var U = class extends Error {
	constructor(e) {
		super("CancelledError"), this.revert = e?.revert, this.silent = e?.silent;
	}
};
function _e(e) {
	let t = !1, n = 0, r, i = z(), a = () => i.status !== "pending", o = (t) => {
		if (!a()) {
			let n = new U(t);
			f(n), e.onCancel?.(n);
		}
	}, s = () => {
		t = !0;
	}, c = () => {
		t = !1;
	}, l = () => S.isFocused() && (e.networkMode === "always" || V.isOnline()) && e.canRun(), u = () => H(e.networkMode) && e.canRun(), d = (e) => {
		a() || (r?.(), i.resolve(e));
	}, f = (e) => {
		a() || (r?.(), i.reject(e));
	}, p = () => new Promise((t) => {
		r = (e) => {
			(a() || l()) && t(e);
		}, e.onPause?.();
	}).then(() => {
		r = void 0, a() || e.onContinue?.();
	}), m = () => {
		if (a()) return;
		let r, i = n === 0 ? e.initialPromise : void 0;
		try {
			r = i ?? e.fn();
		} catch (e) {
			r = Promise.reject(e);
		}
		Promise.resolve(r).then(d).catch((r) => {
			if (a()) return;
			let i = e.retry ?? (R.isServer() ? 0 : 3), o = e.retryDelay ?? ge, s = typeof o == "function" ? o(n, r) : o, c = i === !0 || typeof i == "number" && n < i || typeof i == "function" && i(n, r);
			if (t || !c) {
				f(r);
				return;
			}
			n++, e.onFail?.(n, r), ce(s).then(() => l() ? void 0 : p()).then(() => {
				t ? f(r) : m();
			});
		});
	};
	return {
		promise: i,
		status: () => i.status,
		cancel: o,
		continue: () => (r?.(), i),
		cancelRetry: s,
		continueRetry: c,
		canStart: u,
		start: () => (u() ? m() : p().then(m), i)
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.14/node_modules/@tanstack/query-core/build/modern/removable.js
var ve = class {
	#e;
	destroy() {
		this.clearGcTimeout();
	}
	scheduleGc() {
		this.clearGcTimeout(), E(this.gcTime) && (this.#e = w.setTimeout(() => {
			this.optionalRemove();
		}, this.gcTime));
	}
	updateGcTime(e) {
		this.gcTime = Math.max(this.gcTime || 0, e ?? (R.isServer() ? Infinity : 300 * 1e3));
	}
	clearGcTimeout() {
		this.#e !== void 0 && (w.clearTimeout(this.#e), this.#e = void 0);
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.14/node_modules/@tanstack/query-core/build/modern/infiniteQueryBehavior.js
function ye(e) {
	return { onFetch: (t, n) => {
		let r = t.options, i = t.fetchOptions?.meta?.fetchMore?.direction, a = t.state.data?.pages || [], o = t.state.data?.pageParams || [], s = {
			pages: [],
			pageParams: []
		}, c = 0, l = async () => {
			let n = !1, l = (e) => {
				pe(e, () => t.signal, () => n = !0);
			}, u = de(t.options, t.fetchOptions), d = async (e, r, i) => {
				if (n) return Promise.reject(t.signal.reason);
				if (r == null && e.pages.length) return Promise.resolve(e);
				let a = await u((() => {
					let e = {
						client: t.client,
						queryKey: t.queryKey,
						pageParam: r,
						direction: i ? "backward" : "forward",
						meta: t.options.meta
					};
					return l(e), e;
				})()), { maxPages: o } = t.options, s = i ? ue : le;
				return {
					pages: s(e.pages, a, o),
					pageParams: s(e.pageParams, r, o)
				};
			};
			if (i && a.length) {
				let e = i === "backward", t = e ? xe : be, n = {
					pages: a,
					pageParams: o
				};
				s = await d(n, t(r, n), e);
			} else {
				let t = e ?? a.length;
				do {
					let e = c === 0 ? o[0] ?? r.initialPageParam : be(r, s);
					if (c > 0 && e == null) break;
					s = await d(s, e), c++;
				} while (c < t);
			}
			return s;
		};
		t.options.persister ? t.fetchFn = () => t.options.persister?.(l, {
			client: t.client,
			queryKey: t.queryKey,
			meta: t.options.meta,
			signal: t.signal
		}, n) : t.fetchFn = l;
	} };
}
function be(e, { pages: t, pageParams: n }) {
	let r = t.length - 1;
	return t.length > 0 ? e.getNextPageParam(t[r], t, n[r], n) : void 0;
}
function xe(e, { pages: t, pageParams: n }) {
	return t.length > 0 ? e.getPreviousPageParam?.(t[0], t, n[0], n) : void 0;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.14/node_modules/@tanstack/query-core/build/modern/query.js
var Se = class extends ve {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	#s;
	constructor(e) {
		super(), this.#s = !1, this.#o = e.defaultOptions, this.setOptions(e.options), this.observers = [], this.#i = e.client, this.#r = this.#i.getQueryCache(), this.queryKey = e.queryKey, this.queryHash = e.queryHash, this.#t = Te(this.options), this.state = e.state ?? this.#t, this.scheduleGc();
	}
	get meta() {
		return this.options.meta;
	}
	get queryType() {
		return this.#e;
	}
	get promise() {
		return this.#a?.promise;
	}
	setOptions(e) {
		if (this.options = {
			...this.#o,
			...e
		}, e?._type && (this.#e = e._type), this.updateGcTime(this.options.gcTime), this.state && this.state.data === void 0) {
			let e = Te(this.options);
			e.data !== void 0 && (this.setState(we(e.data, e.dataUpdatedAt)), this.#t = e);
		}
	}
	optionalRemove() {
		!this.observers.length && this.state.fetchStatus === "idle" && this.#r.remove(this);
	}
	setData(e, t) {
		let n = I(this.state.data, e, this.options);
		return this.#l({
			data: n,
			type: "success",
			dataUpdatedAt: t?.updatedAt,
			manual: t?.manual
		}), n;
	}
	setState(e) {
		this.#l({
			type: "setState",
			state: e
		});
	}
	cancel(e) {
		let t = this.#a?.promise;
		return this.#a?.cancel(e), t ? t.then(T).catch(T) : Promise.resolve();
	}
	destroy() {
		super.destroy(), this.cancel({ silent: !0 });
	}
	get resetState() {
		return this.#t;
	}
	reset() {
		this.destroy(), this.setState(this.resetState);
	}
	isActive() {
		return this.observers.some((e) => k(e.options.enabled, this) !== !1);
	}
	isDisabled() {
		return this.getObserversCount() > 0 ? !this.isActive() : this.options.queryFn === L || !this.isFetched();
	}
	isFetched() {
		return this.state.dataUpdateCount + this.state.errorUpdateCount > 0;
	}
	isStatic() {
		return this.getObserversCount() > 0 ? this.observers.some((e) => O(e.options.staleTime, this) === "static") : !1;
	}
	isStale() {
		return this.getObserversCount() > 0 ? this.observers.some((e) => e.getCurrentResult().isStale) : this.state.data === void 0 || this.state.isInvalidated;
	}
	isStaleByTime(e = 0) {
		return this.state.data === void 0 ? !0 : e === "static" ? !1 : this.state.isInvalidated ? !0 : !D(this.state.dataUpdatedAt, e);
	}
	onFocus() {
		this.observers.find((e) => e.shouldFetchOnWindowFocus())?.refetch({ cancelRefetch: !1 }), this.#a?.continue();
	}
	onOnline() {
		this.observers.find((e) => e.shouldFetchOnReconnect())?.refetch({ cancelRefetch: !1 }), this.#a?.continue();
	}
	addObserver(e) {
		this.observers.includes(e) || (this.observers.push(e), this.clearGcTimeout(), this.#r.notify({
			type: "observerAdded",
			query: this,
			observer: e
		}));
	}
	removeObserver(e) {
		this.observers.includes(e) && (this.observers = this.observers.filter((t) => t !== e), this.observers.length || (this.#a && (this.#s || this.#c() ? this.#a.cancel({ revert: !0 }) : this.#a.cancelRetry()), this.scheduleGc()), this.#r.notify({
			type: "observerRemoved",
			query: this,
			observer: e
		}));
	}
	getObserversCount() {
		return this.observers.length;
	}
	#c() {
		return this.state.fetchStatus === "paused" && this.state.status === "pending";
	}
	invalidate() {
		this.state.isInvalidated || this.#l({ type: "invalidate" });
	}
	async fetch(e, t) {
		if (this.state.fetchStatus !== "idle" && this.#a?.status() !== "rejected") {
			if (this.state.data !== void 0 && t?.cancelRefetch) this.cancel({ silent: !0 });
			else if (this.#a) return this.#a.continueRetry(), this.#a.promise;
		}
		if (e && this.setOptions(e), !this.options.queryFn) {
			let e = this.observers.find((e) => e.options.queryFn);
			e && this.setOptions(e.options);
		}
		let n = new AbortController(), r = (e) => {
			Object.defineProperty(e, "signal", {
				enumerable: !0,
				get: () => (this.#s = !0, n.signal)
			});
		}, i = () => {
			let e = de(this.options, t), n = (() => {
				let e = {
					client: this.#i,
					queryKey: this.queryKey,
					meta: this.meta
				};
				return r(e), e;
			})();
			return this.#s = !1, this.options.persister ? this.options.persister(e, n, this) : e(n);
		}, a = (() => {
			let e = {
				fetchOptions: t,
				options: this.options,
				queryKey: this.queryKey,
				client: this.#i,
				state: this.state,
				fetchFn: i
			};
			return r(e), e;
		})();
		(this.#e === "infinite" ? ye(this.options.pages) : this.options.behavior)?.onFetch(a, this), this.#n = this.state, (this.state.fetchStatus === "idle" || this.state.fetchMeta !== a.fetchOptions?.meta) && this.#l({
			type: "fetch",
			meta: a.fetchOptions?.meta
		}), this.#a = _e({
			initialPromise: t?.initialPromise,
			fn: a.fetchFn,
			onCancel: (e) => {
				e instanceof U && e.revert && this.setState({
					...this.#n,
					fetchStatus: "idle"
				}), n.abort();
			},
			onFail: (e, t) => {
				this.#l({
					type: "failed",
					failureCount: e,
					error: t
				});
			},
			onPause: () => {
				this.#l({ type: "pause" });
			},
			onContinue: () => {
				this.#l({ type: "continue" });
			},
			retry: a.options.retry,
			retryDelay: a.options.retryDelay,
			networkMode: a.options.networkMode,
			canRun: () => !0
		});
		try {
			let e = await this.#a.start();
			if (e === void 0) throw Error(`${this.queryHash} data is undefined`);
			return this.setData(e), this.#r.config.onSuccess?.(e, this), this.#r.config.onSettled?.(e, this.state.error, this), e;
		} catch (e) {
			if (e instanceof U) {
				if (e.silent) return this.#a.promise;
				if (e.revert) {
					if (this.state.data === void 0) throw e;
					return this.state.data;
				}
			}
			throw this.#l({
				type: "error",
				error: e
			}), this.#r.config.onError?.(e, this), this.#r.config.onSettled?.(this.state.data, e, this), e;
		} finally {
			this.scheduleGc();
		}
	}
	#l(e) {
		let t = (t) => {
			switch (e.type) {
				case "failed": return {
					...t,
					fetchFailureCount: e.failureCount,
					fetchFailureReason: e.error
				};
				case "pause": return {
					...t,
					fetchStatus: "paused"
				};
				case "continue": return {
					...t,
					fetchStatus: "fetching"
				};
				case "fetch": return {
					...t,
					...Ce(t.data, this.options),
					fetchMeta: e.meta ?? null
				};
				case "success":
					let n = {
						...t,
						...we(e.data, e.dataUpdatedAt),
						dataUpdateCount: t.dataUpdateCount + 1,
						...!e.manual && {
							fetchStatus: "idle",
							fetchFailureCount: 0,
							fetchFailureReason: null
						}
					};
					return this.#n = e.manual ? n : void 0, n;
				case "error":
					let r = e.error;
					return {
						...t,
						error: r,
						errorUpdateCount: t.errorUpdateCount + 1,
						errorUpdatedAt: Date.now(),
						fetchFailureCount: t.fetchFailureCount + 1,
						fetchFailureReason: r,
						fetchStatus: "idle",
						status: "error",
						isInvalidated: !0
					};
				case "invalidate": return {
					...t,
					isInvalidated: !0
				};
				case "setState": return {
					...t,
					...e.state
				};
			}
		};
		this.state = t(this.state), B.batch(() => {
			this.observers.forEach((e) => {
				e.onQueryUpdate();
			}), this.#r.notify({
				query: this,
				type: "updated",
				action: e
			});
		});
	}
};
function Ce(e, t) {
	return {
		fetchFailureCount: 0,
		fetchFailureReason: null,
		fetchStatus: H(t.networkMode) ? "fetching" : "paused",
		...e === void 0 && {
			error: null,
			status: "pending"
		}
	};
}
function we(e, t) {
	return {
		data: e,
		dataUpdatedAt: t ?? Date.now(),
		error: null,
		isInvalidated: !1,
		status: "success"
	};
}
function Te(e) {
	let t = typeof e.initialData == "function" ? e.initialData() : e.initialData, n = t !== void 0, r = n ? typeof e.initialDataUpdatedAt == "function" ? e.initialDataUpdatedAt() : e.initialDataUpdatedAt : 0;
	return {
		data: t,
		dataUpdateCount: 0,
		dataUpdatedAt: n ? r ?? Date.now() : 0,
		error: null,
		errorUpdateCount: 0,
		errorUpdatedAt: 0,
		fetchFailureCount: 0,
		fetchFailureReason: null,
		fetchMeta: null,
		isInvalidated: !1,
		status: n ? "success" : "pending",
		fetchStatus: "idle"
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.14/node_modules/@tanstack/query-core/build/modern/queryObserver.js
var Ee = class extends x {
	constructor(e, t) {
		super(), this.options = t, this.#e = e, this.#s = null, this.#o = z(), this.bindMethods(), this.setOptions(t);
	}
	#e;
	#t = void 0;
	#n = void 0;
	#r = void 0;
	#i;
	#a;
	#o;
	#s;
	#c;
	#l;
	#u;
	#d;
	#f;
	#p;
	#m = /* @__PURE__ */ new Set();
	bindMethods() {
		this.refetch = this.refetch.bind(this);
	}
	onSubscribe() {
		this.listeners.size === 1 && (this.#t.addObserver(this), Oe(this.#t, this.options) ? this.#h() : this.updateResult(), this.#y());
	}
	onUnsubscribe() {
		this.hasListeners() || this.destroy();
	}
	shouldFetchOnReconnect() {
		return W(this.#t, this.options, this.options.refetchOnReconnect);
	}
	shouldFetchOnWindowFocus() {
		return W(this.#t, this.options, this.options.refetchOnWindowFocus);
	}
	destroy() {
		this.listeners = /* @__PURE__ */ new Set(), this.#b(), this.#x(), this.#t.removeObserver(this);
	}
	setOptions(e) {
		let t = this.options, n = this.#t;
		if (this.options = this.#e.defaultQueryOptions(e), this.options.enabled !== void 0 && typeof this.options.enabled != "boolean" && typeof this.options.enabled != "function" && typeof k(this.options.enabled, this.#t) != "boolean") throw Error("Expected enabled to be a boolean or a callback that returns a boolean");
		this.#S(), this.#t.setOptions(this.options), t._defaulted && !P(this.options, t) && this.#e.getQueryCache().notify({
			type: "observerOptionsUpdated",
			query: this.#t,
			observer: this
		});
		let r = this.hasListeners();
		r && ke(this.#t, n, this.options, t) && this.#h(), this.updateResult(), r && (this.#t !== n || k(this.options.enabled, this.#t) !== k(t.enabled, this.#t) || O(this.options.staleTime, this.#t) !== O(t.staleTime, this.#t)) && this.#g();
		let i = this.#_();
		r && (this.#t !== n || k(this.options.enabled, this.#t) !== k(t.enabled, this.#t) || i !== this.#p) && this.#v(i);
	}
	getOptimisticResult(e) {
		let t = this.#e.getQueryCache().build(this.#e, e), n = this.createResult(t, e);
		return Ae(this, n) && (this.#r = n, this.#a = this.options, this.#i = this.#t.state), n;
	}
	getCurrentResult() {
		return this.#r;
	}
	trackResult(e, t) {
		return new Proxy(e, { get: (e, n) => (this.trackProp(n), t?.(n), n === "promise" && (this.trackProp("data"), !this.options.experimental_prefetchInRender && this.#o.status === "pending" && this.#o.reject(/* @__PURE__ */ Error("experimental_prefetchInRender feature flag is not enabled"))), Reflect.get(e, n)) });
	}
	trackProp(e) {
		this.#m.add(e);
	}
	getCurrentQuery() {
		return this.#t;
	}
	refetch({ ...e } = {}) {
		return this.fetch({ ...e });
	}
	fetchOptimistic(e) {
		let t = this.#e.defaultQueryOptions(e), n = this.#e.getQueryCache().build(this.#e, t);
		return n.fetch().then(() => this.createResult(n, t));
	}
	fetch(e) {
		return this.#h({
			...e,
			cancelRefetch: e.cancelRefetch ?? !0
		}).then(() => (this.updateResult(), this.#r));
	}
	#h(e) {
		this.#S();
		let t = this.#t.fetch(this.options, e);
		return e?.throwOnError || (t = t.catch(T)), t;
	}
	#g() {
		this.#b();
		let e = O(this.options.staleTime, this.#t);
		if (R.isServer() || this.#r.isStale || !E(e)) return;
		let t = D(this.#r.dataUpdatedAt, e) + 1;
		this.#d = w.setTimeout(() => {
			this.#r.isStale || this.updateResult();
		}, t);
	}
	#_() {
		return (typeof this.options.refetchInterval == "function" ? this.options.refetchInterval(this.#t) : this.options.refetchInterval) ?? !1;
	}
	#v(e) {
		this.#x(), this.#p = e, !(R.isServer() || k(this.options.enabled, this.#t) === !1 || !E(this.#p) || this.#p === 0) && (this.#f = w.setInterval(() => {
			(this.options.refetchIntervalInBackground || S.isFocused()) && this.#h();
		}, this.#p));
	}
	#y() {
		this.#g(), this.#v(this.#_());
	}
	#b() {
		this.#d !== void 0 && (w.clearTimeout(this.#d), this.#d = void 0);
	}
	#x() {
		this.#f !== void 0 && (w.clearInterval(this.#f), this.#f = void 0);
	}
	createResult(e, t) {
		let n = this.#t, r = this.options, i = this.#r, a = this.#i, o = this.#a, s = e === n ? this.#n : e.state, { state: c } = e, l = { ...c }, u = !1, d;
		if (t._optimisticResults) {
			let i = this.hasListeners(), a = !i && Oe(e, t), o = i && ke(e, n, t, r);
			(a || o) && (l = {
				...l,
				...Ce(c.data, e.options)
			}), t._optimisticResults === "isRestoring" && (l.fetchStatus = "idle");
		}
		let { error: f, errorUpdatedAt: p, status: m } = l;
		d = l.data;
		let h = !1;
		if (t.placeholderData !== void 0 && d === void 0 && m === "pending") {
			let e;
			i?.isPlaceholderData && t.placeholderData === o?.placeholderData ? (e = i.data, h = !0) : e = typeof t.placeholderData == "function" ? t.placeholderData(this.#u?.state.data, this.#u) : t.placeholderData, e !== void 0 && (m = "success", d = I(i?.data, e, t), u = !0);
		}
		if (t.select && d !== void 0 && !h) if (i && d === a?.data && t.select === this.#c) d = this.#l;
		else try {
			this.#c = t.select, d = t.select(d), d = I(i?.data, d, t), this.#l = d, this.#s = null;
		} catch (e) {
			this.#s = e;
		}
		this.#s && (f = this.#s, d = this.#l, p = Date.now(), m = "error");
		let g = l.fetchStatus === "fetching", _ = m === "pending", v = m === "error", y = _ && g, b = d !== void 0, x = {
			status: m,
			fetchStatus: l.fetchStatus,
			isPending: _,
			isSuccess: m === "success",
			isError: v,
			isInitialLoading: y,
			isLoading: y,
			data: d,
			dataUpdatedAt: l.dataUpdatedAt,
			error: f,
			errorUpdatedAt: p,
			failureCount: l.fetchFailureCount,
			failureReason: l.fetchFailureReason,
			errorUpdateCount: l.errorUpdateCount,
			isFetched: e.isFetched(),
			isFetchedAfterMount: l.dataUpdateCount > s.dataUpdateCount || l.errorUpdateCount > s.errorUpdateCount,
			isFetching: g,
			isRefetching: g && !_,
			isLoadingError: v && !b,
			isPaused: l.fetchStatus === "paused",
			isPlaceholderData: u,
			isRefetchError: v && b,
			isStale: G(e, t),
			refetch: this.refetch,
			promise: this.#o,
			isEnabled: k(t.enabled, e) !== !1
		};
		if (this.options.experimental_prefetchInRender) {
			let t = x.data !== void 0, r = x.status === "error" && !t, i = (e) => {
				r ? e.reject(x.error) : t && e.resolve(x.data);
			}, a = () => {
				i(this.#o = x.promise = z());
			}, o = this.#o;
			switch (o.status) {
				case "pending":
					e.queryHash === n.queryHash && i(o);
					break;
				case "fulfilled":
					(r || x.data !== o.value) && a();
					break;
				case "rejected":
					(!r || x.error !== o.reason) && a();
					break;
			}
		}
		return x;
	}
	updateResult() {
		let e = this.#r, t = this.createResult(this.#t, this.options);
		this.#i = this.#t.state, this.#a = this.options, this.#i.data !== void 0 && (this.#u = this.#t), !P(t, e) && (this.#r = t, this.#C({ listeners: (() => {
			if (!e) return !0;
			let { notifyOnChangeProps: t } = this.options, n = typeof t == "function" ? t() : t;
			if (n === "all" || !n && !this.#m.size) return !0;
			let r = new Set(n ?? this.#m);
			return this.options.throwOnError && r.add("error"), Object.keys(this.#r).some((t) => {
				let n = t;
				return this.#r[n] !== e[n] && r.has(n);
			});
		})() }));
	}
	#S() {
		let e = this.#e.getQueryCache().build(this.#e, this.options);
		if (e === this.#t) return;
		let t = this.#t;
		this.#t = e, this.#n = e.state, this.hasListeners() && (t?.removeObserver(this), e.addObserver(this));
	}
	onQueryUpdate() {
		this.updateResult(), this.hasListeners() && this.#y();
	}
	#C(e) {
		B.batch(() => {
			e.listeners && this.listeners.forEach((e) => {
				e(this.#r);
			}), this.#e.getQueryCache().notify({
				query: this.#t,
				type: "observerResultsUpdated"
			});
		});
	}
};
function De(e, t) {
	return k(t.enabled, e) !== !1 && e.state.data === void 0 && !(e.state.status === "error" && k(t.retryOnMount, e) === !1);
}
function Oe(e, t) {
	return De(e, t) || e.state.data !== void 0 && W(e, t, t.refetchOnMount);
}
function W(e, t, n) {
	if (k(t.enabled, e) !== !1 && O(t.staleTime, e) !== "static") {
		let r = typeof n == "function" ? n(e) : n;
		return r === "always" || r !== !1 && G(e, t);
	}
	return !1;
}
function ke(e, t, n, r) {
	return (e !== t || k(r.enabled, e) === !1) && (!n.suspense || e.state.status !== "error") && G(e, n);
}
function G(e, t) {
	return k(t.enabled, e) !== !1 && e.isStaleByTime(O(t.staleTime, e));
}
function Ae(e, t) {
	return !P(e.getCurrentResult(), t);
}
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.14/node_modules/@tanstack/query-core/build/modern/mutation.js
var je = class extends ve {
	#e;
	#t;
	#n;
	#r;
	constructor(e) {
		super(), this.#e = e.client, this.mutationId = e.mutationId, this.#n = e.mutationCache, this.#t = [], this.state = e.state || Me(), this.setOptions(e.options), this.scheduleGc();
	}
	setOptions(e) {
		this.options = e, this.updateGcTime(this.options.gcTime);
	}
	get meta() {
		return this.options.meta;
	}
	addObserver(e) {
		this.#t.includes(e) || (this.#t.push(e), this.clearGcTimeout(), this.#n.notify({
			type: "observerAdded",
			mutation: this,
			observer: e
		}));
	}
	removeObserver(e) {
		this.#t = this.#t.filter((t) => t !== e), this.scheduleGc(), this.#n.notify({
			type: "observerRemoved",
			mutation: this,
			observer: e
		});
	}
	optionalRemove() {
		this.#t.length || (this.state.status === "pending" ? this.scheduleGc() : this.#n.remove(this));
	}
	continue() {
		return this.#r?.continue() ?? this.execute(this.state.variables);
	}
	async execute(e) {
		let t = () => {
			this.#i({ type: "continue" });
		}, n = {
			client: this.#e,
			meta: this.options.meta,
			mutationKey: this.options.mutationKey
		};
		this.#r = _e({
			fn: () => this.options.mutationFn ? this.options.mutationFn(e, n) : Promise.reject(/* @__PURE__ */ Error("No mutationFn found")),
			onFail: (e, t) => {
				this.#i({
					type: "failed",
					failureCount: e,
					error: t
				});
			},
			onPause: () => {
				this.#i({ type: "pause" });
			},
			onContinue: t,
			retry: this.options.retry ?? 0,
			retryDelay: this.options.retryDelay,
			networkMode: this.options.networkMode,
			canRun: () => this.#n.canRun(this)
		});
		let r = this.state.status === "pending", i = !this.#r.canStart();
		try {
			if (r) t();
			else {
				this.#i({
					type: "pending",
					variables: e,
					isPaused: i
				}), this.#n.config.onMutate && await this.#n.config.onMutate(e, this, n);
				let t = await this.options.onMutate?.(e, n);
				t !== this.state.context && this.#i({
					type: "pending",
					context: t,
					variables: e,
					isPaused: i
				});
			}
			let a = await this.#r.start();
			return await this.#n.config.onSuccess?.(a, e, this.state.context, this, n), await this.options.onSuccess?.(a, e, this.state.context, n), await this.#n.config.onSettled?.(a, null, this.state.variables, this.state.context, this, n), await this.options.onSettled?.(a, null, e, this.state.context, n), this.#i({
				type: "success",
				data: a
			}), a;
		} catch (t) {
			try {
				await this.#n.config.onError?.(t, e, this.state.context, this, n);
			} catch (e) {
				Promise.reject(e);
			}
			try {
				await this.options.onError?.(t, e, this.state.context, n);
			} catch (e) {
				Promise.reject(e);
			}
			try {
				await this.#n.config.onSettled?.(void 0, t, this.state.variables, this.state.context, this, n);
			} catch (e) {
				Promise.reject(e);
			}
			try {
				await this.options.onSettled?.(void 0, t, e, this.state.context, n);
			} catch (e) {
				Promise.reject(e);
			}
			throw this.#i({
				type: "error",
				error: t
			}), t;
		} finally {
			this.#n.runNext(this);
		}
	}
	#i(e) {
		let t = (t) => {
			switch (e.type) {
				case "failed": return {
					...t,
					failureCount: e.failureCount,
					failureReason: e.error
				};
				case "pause": return {
					...t,
					isPaused: !0
				};
				case "continue": return {
					...t,
					isPaused: !1
				};
				case "pending": return {
					...t,
					context: e.context,
					data: void 0,
					failureCount: 0,
					failureReason: null,
					error: null,
					isPaused: e.isPaused,
					status: "pending",
					variables: e.variables,
					submittedAt: Date.now()
				};
				case "success": return {
					...t,
					data: e.data,
					failureCount: 0,
					failureReason: null,
					error: null,
					status: "success",
					isPaused: !1
				};
				case "error": return {
					...t,
					data: void 0,
					error: e.error,
					failureCount: t.failureCount + 1,
					failureReason: e.error,
					isPaused: !1,
					status: "error"
				};
			}
		};
		this.state = t(this.state), B.batch(() => {
			this.#t.forEach((t) => {
				t.onMutationUpdate(e);
			}), this.#n.notify({
				mutation: this,
				type: "updated",
				action: e
			});
		});
	}
};
function Me() {
	return {
		context: void 0,
		data: void 0,
		error: null,
		failureCount: 0,
		failureReason: null,
		isPaused: !1,
		status: "idle",
		variables: void 0,
		submittedAt: 0
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.14/node_modules/@tanstack/query-core/build/modern/mutationCache.js
var Ne = class extends x {
	constructor(e = {}) {
		super(), this.config = e, this.#e = /* @__PURE__ */ new Set(), this.#t = /* @__PURE__ */ new Map(), this.#n = 0;
	}
	#e;
	#t;
	#n;
	build(e, t, n) {
		let r = new je({
			client: e,
			mutationCache: this,
			mutationId: ++this.#n,
			options: e.defaultMutationOptions(t),
			state: n
		});
		return this.add(r), r;
	}
	add(e) {
		this.#e.add(e);
		let t = K(e);
		if (typeof t == "string") {
			let n = this.#t.get(t);
			n ? n.push(e) : this.#t.set(t, [e]);
		}
		this.notify({
			type: "added",
			mutation: e
		});
	}
	remove(e) {
		if (this.#e.delete(e)) {
			let t = K(e);
			if (typeof t == "string") {
				let n = this.#t.get(t);
				if (n) if (n.length > 1) {
					let t = n.indexOf(e);
					t !== -1 && n.splice(t, 1);
				} else n[0] === e && this.#t.delete(t);
			}
		}
		this.notify({
			type: "removed",
			mutation: e
		});
	}
	canRun(e) {
		let t = K(e);
		if (typeof t == "string") {
			let n = this.#t.get(t)?.find((e) => e.state.status === "pending");
			return !n || n === e;
		} else return !0;
	}
	runNext(e) {
		let t = K(e);
		return typeof t == "string" ? (this.#t.get(t)?.find((t) => t !== e && t.state.isPaused))?.continue() ?? Promise.resolve() : Promise.resolve();
	}
	clear() {
		B.batch(() => {
			this.#e.forEach((e) => {
				this.notify({
					type: "removed",
					mutation: e
				});
			}), this.#e.clear(), this.#t.clear();
		});
	}
	getAll() {
		return Array.from(this.#e);
	}
	find(e) {
		let t = {
			exact: !0,
			...e
		};
		return this.getAll().find((e) => ie(t, e));
	}
	findAll(e = {}) {
		return this.getAll().filter((t) => ie(e, t));
	}
	notify(e) {
		B.batch(() => {
			this.listeners.forEach((t) => {
				t(e);
			});
		});
	}
	resumePausedMutations() {
		let e = this.getAll().filter((e) => e.state.isPaused);
		return B.batch(() => Promise.all(e.map((e) => e.continue().catch(T))));
	}
};
function K(e) {
	return e.options.scope?.id;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.14/node_modules/@tanstack/query-core/build/modern/queryCache.js
var Pe = class extends x {
	constructor(e = {}) {
		super(), this.config = e, this.#e = /* @__PURE__ */ new Map();
	}
	#e;
	build(e, t, n) {
		let r = t.queryKey, i = t.queryHash ?? A(r, t), a = this.get(i);
		return a || (a = new Se({
			client: e,
			queryKey: r,
			queryHash: i,
			options: e.defaultQueryOptions(t),
			state: n,
			defaultOptions: e.getQueryDefaults(r)
		}), this.add(a)), a;
	}
	add(e) {
		this.#e.has(e.queryHash) || (this.#e.set(e.queryHash, e), this.notify({
			type: "added",
			query: e
		}));
	}
	remove(e) {
		let t = this.#e.get(e.queryHash);
		t && (e.destroy(), t === e && this.#e.delete(e.queryHash), this.notify({
			type: "removed",
			query: e
		}));
	}
	clear() {
		B.batch(() => {
			this.getAll().forEach((e) => {
				this.remove(e);
			});
		});
	}
	get(e) {
		return this.#e.get(e);
	}
	getAll() {
		return [...this.#e.values()];
	}
	find(e) {
		let t = {
			exact: !0,
			...e
		};
		return this.getAll().find((e) => re(t, e));
	}
	findAll(e = {}) {
		let t = this.getAll();
		return Object.keys(e).length > 0 ? t.filter((t) => re(e, t)) : t;
	}
	notify(e) {
		B.batch(() => {
			this.listeners.forEach((t) => {
				t(e);
			});
		});
	}
	onFocus() {
		B.batch(() => {
			this.getAll().forEach((e) => {
				e.onFocus();
			});
		});
	}
	onOnline() {
		B.batch(() => {
			this.getAll().forEach((e) => {
				e.onOnline();
			});
		});
	}
}, Fe = class {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	#s;
	constructor(e = {}) {
		this.#e = e.queryCache || new Pe(), this.#t = e.mutationCache || new Ne(), this.#n = e.defaultOptions || {}, this.#r = /* @__PURE__ */ new Map(), this.#i = /* @__PURE__ */ new Map(), this.#a = 0;
	}
	mount() {
		this.#a++, this.#a === 1 && (this.#o = S.subscribe(async (e) => {
			e && (await this.resumePausedMutations(), this.#e.onFocus());
		}), this.#s = V.subscribe(async (e) => {
			e && (await this.resumePausedMutations(), this.#e.onOnline());
		}));
	}
	unmount() {
		this.#a--, this.#a === 0 && (this.#o?.(), this.#o = void 0, this.#s?.(), this.#s = void 0);
	}
	isFetching(e) {
		return this.#e.findAll({
			...e,
			fetchStatus: "fetching"
		}).length;
	}
	isMutating(e) {
		return this.#t.findAll({
			...e,
			status: "pending"
		}).length;
	}
	getQueryData(e) {
		let t = this.defaultQueryOptions({ queryKey: e });
		return this.#e.get(t.queryHash)?.state.data;
	}
	ensureQueryData(e) {
		let t = this.defaultQueryOptions(e), n = this.#e.build(this, t), r = n.state.data;
		return r === void 0 ? this.fetchQuery(e) : (e.revalidateIfStale && n.isStaleByTime(O(t.staleTime, n)) && this.prefetchQuery(t), Promise.resolve(r));
	}
	getQueriesData(e) {
		return this.#e.findAll(e).map(({ queryKey: e, state: t }) => [e, t.data]);
	}
	setQueryData(e, t, n) {
		let r = this.defaultQueryOptions({ queryKey: e }), i = this.#e.get(r.queryHash)?.state.data, a = ne(t, i);
		if (a !== void 0) return this.#e.build(this, r).setData(a, {
			...n,
			manual: !0
		});
	}
	setQueriesData(e, t, n) {
		return B.batch(() => this.#e.findAll(e).map(({ queryKey: e }) => [e, this.setQueryData(e, t, n)]));
	}
	getQueryState(e) {
		let t = this.defaultQueryOptions({ queryKey: e });
		return this.#e.get(t.queryHash)?.state;
	}
	removeQueries(e) {
		let t = this.#e;
		B.batch(() => {
			t.findAll(e).forEach((e) => {
				t.remove(e);
			});
		});
	}
	resetQueries(e, t) {
		let n = this.#e;
		return B.batch(() => (n.findAll(e).forEach((e) => {
			e.reset();
		}), this.refetchQueries({
			type: "active",
			...e
		}, t)));
	}
	cancelQueries(e, t = {}) {
		let n = {
			revert: !0,
			...t
		}, r = B.batch(() => this.#e.findAll(e).map((e) => e.cancel(n)));
		return Promise.all(r).then(T).catch(T);
	}
	invalidateQueries(e, t = {}) {
		return B.batch(() => (this.#e.findAll(e).forEach((e) => {
			e.invalidate();
		}), e?.refetchType === "none" ? Promise.resolve() : this.refetchQueries({
			...e,
			type: e?.refetchType ?? e?.type ?? "active"
		}, t)));
	}
	refetchQueries(e, t = {}) {
		let n = {
			...t,
			cancelRefetch: t.cancelRefetch ?? !0
		}, r = B.batch(() => this.#e.findAll(e).filter((e) => !e.isDisabled() && !e.isStatic()).map((e) => {
			let t = e.fetch(void 0, n);
			return n.throwOnError || (t = t.catch(T)), e.state.fetchStatus === "paused" ? Promise.resolve() : t;
		}));
		return Promise.all(r).then(T);
	}
	fetchQuery(e) {
		let t = this.defaultQueryOptions(e);
		t.retry === void 0 && (t.retry = !1);
		let n = this.#e.build(this, t);
		return n.isStaleByTime(O(t.staleTime, n)) ? n.fetch(t) : Promise.resolve(n.state.data);
	}
	prefetchQuery(e) {
		return this.fetchQuery(e).then(T).catch(T);
	}
	fetchInfiniteQuery(e) {
		return e._type = "infinite", this.fetchQuery(e);
	}
	prefetchInfiniteQuery(e) {
		return this.fetchInfiniteQuery(e).then(T).catch(T);
	}
	ensureInfiniteQueryData(e) {
		return e._type = "infinite", this.ensureQueryData(e);
	}
	resumePausedMutations() {
		return V.isOnline() ? this.#t.resumePausedMutations() : Promise.resolve();
	}
	getQueryCache() {
		return this.#e;
	}
	getMutationCache() {
		return this.#t;
	}
	getDefaultOptions() {
		return this.#n;
	}
	setDefaultOptions(e) {
		this.#n = e;
	}
	setQueryDefaults(e, t) {
		this.#r.set(j(e), {
			queryKey: e,
			defaultOptions: t
		});
	}
	getQueryDefaults(e) {
		let t = [...this.#r.values()], n = {};
		return t.forEach((t) => {
			M(e, t.queryKey) && Object.assign(n, t.defaultOptions);
		}), n;
	}
	setMutationDefaults(e, t) {
		this.#i.set(j(e), {
			mutationKey: e,
			defaultOptions: t
		});
	}
	getMutationDefaults(e) {
		let t = [...this.#i.values()], n = {};
		return t.forEach((t) => {
			M(e, t.mutationKey) && Object.assign(n, t.defaultOptions);
		}), n;
	}
	defaultQueryOptions(e) {
		if (e._defaulted) return e;
		let t = {
			...this.#n.queries,
			...this.getQueryDefaults(e.queryKey),
			...e,
			_defaulted: !0
		};
		return t.queryHash ||= A(t.queryKey, t), t.refetchOnReconnect === void 0 && (t.refetchOnReconnect = t.networkMode !== "always"), t.throwOnError === void 0 && (t.throwOnError = !!t.suspense), !t.networkMode && t.persister && (t.networkMode = "offlineFirst"), t.queryFn === L && (t.enabled = !1), t;
	}
	defaultMutationOptions(e) {
		return e?._defaulted ? e : {
			...this.#n.mutations,
			...e?.mutationKey && this.getMutationDefaults(e.mutationKey),
			...e,
			_defaulted: !0
		};
	}
	clear() {
		this.#e.clear(), this.#t.clear();
	}
}, Ie = e.createContext(void 0), Le = (t) => {
	let n = e.useContext(Ie);
	if (t) return t;
	if (!n) throw Error("No QueryClient set, use QueryClientProvider to set one");
	return n;
}, Re = ({ client: t, children: n }) => (e.useEffect(() => (t.mount(), () => {
	t.unmount();
}), [t]), /* @__PURE__ */ d(Ie.Provider, {
	value: t,
	children: n
})), ze = e.createContext(!1), Be = () => e.useContext(ze);
ze.Provider;
//#endregion
//#region node_modules/.pnpm/@tanstack+react-query@5.100.14_react@19.2.6/node_modules/@tanstack/react-query/build/modern/QueryErrorResetBoundary.js
function Ve() {
	let e = !1;
	return {
		clearReset: () => {
			e = !1;
		},
		reset: () => {
			e = !0;
		},
		isReset: () => e
	};
}
var He = e.createContext(Ve()), Ue = () => e.useContext(He), We = (e, t, n) => {
	let r = n?.state.error && typeof e.throwOnError == "function" ? fe(e.throwOnError, [n.state.error, n]) : e.throwOnError;
	(e.suspense || e.experimental_prefetchInRender || r) && (t.isReset() || (e.retryOnMount = !1));
}, Ge = (t) => {
	e.useEffect(() => {
		t.clearReset();
	}, [t]);
}, Ke = ({ result: e, errorResetBoundary: t, throwOnError: n, query: r, suspense: i }) => e.isError && !t.isReset() && !e.isFetching && r && (i && e.data === void 0 || fe(n, [e.error, r])), qe = (e) => {
	if (e.suspense) {
		let t = 1e3, n = (e) => e === "static" ? e : Math.max(e ?? t, t), r = e.staleTime;
		e.staleTime = typeof r == "function" ? (...e) => n(r(...e)) : n(r), typeof e.gcTime == "number" && (e.gcTime = Math.max(e.gcTime, t));
	}
}, Je = (e, t) => e.isLoading && e.isFetching && !t, Ye = (e, t) => e?.suspense && t.isPending, Xe = (e, t, n) => t.fetchOptimistic(e).catch(() => {
	n.clearReset();
});
//#endregion
//#region node_modules/.pnpm/@tanstack+react-query@5.100.14_react@19.2.6/node_modules/@tanstack/react-query/build/modern/useBaseQuery.js
function Ze(t, n, r) {
	let i = Be(), a = Ue(), o = Le(r), s = o.defaultQueryOptions(t);
	o.getDefaultOptions().queries?._experimental_beforeQuery?.(s);
	let c = o.getQueryCache().get(s.queryHash), l = t.subscribed !== !1;
	s._optimisticResults = i ? "isRestoring" : l ? "optimistic" : void 0, qe(s), We(s, a, c), Ge(a);
	let u = !o.getQueryCache().get(s.queryHash), [d] = e.useState(() => new n(o, s)), f = d.getOptimisticResult(s), p = !i && l;
	if (e.useSyncExternalStore(e.useCallback((e) => {
		let t = p ? d.subscribe(B.batchCalls(e)) : T;
		return d.updateResult(), t;
	}, [d, p]), () => d.getCurrentResult(), () => d.getCurrentResult()), e.useEffect(() => {
		d.setOptions(s);
	}, [s, d]), Ye(s, f)) throw Xe(s, d, a);
	if (Ke({
		result: f,
		errorResetBoundary: a,
		throwOnError: s.throwOnError,
		query: c,
		suspense: s.suspense
	})) throw f.error;
	return o.getDefaultOptions().queries?._experimental_afterQuery?.(s, f), s.experimental_prefetchInRender && !R.isServer() && Je(f, i) && (u ? Xe(s, d, a) : c?.promise)?.catch(T).finally(() => {
		d.updateResult();
	}), s.notifyOnChangeProps ? f : d.trackResult(f);
}
//#endregion
//#region node_modules/.pnpm/@tanstack+react-query@5.100.14_react@19.2.6/node_modules/@tanstack/react-query/build/modern/useQuery.js
function Qe(e, t) {
	return Ze(e, Ee, t);
}
//#endregion
//#region src/i18n.ts
var $e = {
	"settings.weather.addCity": "Add City",
	"settings.weather.searchPlaceholder": "Search for a city...",
	"settings.weather.added": "Added",
	"settings.weather.noResults": "No results found",
	"settings.weather.useCurrentLocation": "Use Current Location",
	"settings.weather.yourCities": "Your Cities",
	"settings.weather.noCities": "No cities added yet",
	"settings.weather.default": "Default",
	"settings.weather.setAsDefault": "Set as default",
	"settings.weather.removeCity": "Remove city",
	"settings.weather.description": "Weather data provided by Open-Meteo. Add multiple cities and swipe between them on the main screen."
}, et = {
	"settings.weather.addCity": "添加城市",
	"settings.weather.searchPlaceholder": "搜索城市...",
	"settings.weather.added": "已添加",
	"settings.weather.noResults": "未找到结果",
	"settings.weather.useCurrentLocation": "使用当前位置",
	"settings.weather.yourCities": "你的城市",
	"settings.weather.noCities": "尚未添加城市",
	"settings.weather.default": "默认",
	"settings.weather.setAsDefault": "设为默认",
	"settings.weather.removeCity": "删除城市",
	"settings.weather.description": "天气数据由 Open-Meteo 提供。添加多个城市，在主屏幕上滑动切换。"
}, tt = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), nt = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), rt = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => n ? n.toUpperCase() : t.toLowerCase()), it = (e) => {
	let t = rt(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, q = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round"
}, at = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, ot = n({}), st = () => o(ot), ct = i(({ color: e, size: t, strokeWidth: n, absoluteStrokeWidth: i, className: a = "", children: o, iconNode: s, ...c }, l) => {
	let { size: u = 24, strokeWidth: d = 2, absoluteStrokeWidth: f = !1, color: p = "currentColor", className: m = "" } = st() ?? {}, h = i ?? f ? Number(n ?? d) * 24 / Number(t ?? u) : n ?? d;
	return r("svg", {
		ref: l,
		...q,
		width: t ?? u ?? q.width,
		height: t ?? u ?? q.height,
		stroke: e ?? p,
		strokeWidth: h,
		className: tt("lucide", m, a),
		...!o && !at(c) && { "aria-hidden": "true" },
		...c
	}, [...s.map(([e, t]) => r(e, t)), ...Array.isArray(o) ? o : [o]]);
}), J = (e, t) => {
	let n = i(({ className: n, ...i }, a) => r(ct, {
		ref: a,
		iconNode: t,
		className: tt(`lucide-${nt(it(e))}`, `lucide-${e}`, n),
		...i
	}));
	return n.displayName = it(e), n;
}, lt = J("compass", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",
	key: "9ktpf1"
}]]), ut = J("droplets", [["path", {
	d: "M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z",
	key: "1ptgy4"
}], ["path", {
	d: "M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97",
	key: "1sl1rz"
}]]), dt = J("eye", [["path", {
	d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
	key: "1nclc0"
}], ["circle", {
	cx: "12",
	cy: "12",
	r: "3",
	key: "1v7zrd"
}]]), ft = J("gauge", [["path", {
	d: "m12 14 4-4",
	key: "9kzdfg"
}], ["path", {
	d: "M3.34 19a10 10 0 1 1 17.32 0",
	key: "19p75a"
}]]), pt = J("loader-circle", [["path", {
	d: "M21 12a9 9 0 1 1-6.219-8.56",
	key: "13zald"
}]]), Y = J("map-pin", [["path", {
	d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
	key: "1r0f0z"
}], ["circle", {
	cx: "12",
	cy: "10",
	r: "3",
	key: "ilqhr7"
}]]), mt = J("navigation", [["polygon", {
	points: "3 11 22 2 13 21 11 13 3 11",
	key: "1ltx0t"
}]]), ht = J("search", [["path", {
	d: "m21 21-4.34-4.34",
	key: "14j7rj"
}], ["circle", {
	cx: "11",
	cy: "11",
	r: "8",
	key: "4ej97u"
}]]), gt = J("settings", [["path", {
	d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
	key: "1i5ecw"
}], ["circle", {
	cx: "12",
	cy: "12",
	r: "3",
	key: "1v7zrd"
}]]), _t = J("star", [["path", {
	d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
	key: "r04s7s"
}]]), vt = J("sunset", [
	["path", {
		d: "M12 10V2",
		key: "16sf7g"
	}],
	["path", {
		d: "m4.93 10.93 1.41 1.41",
		key: "2a7f42"
	}],
	["path", {
		d: "M2 18h2",
		key: "j10viu"
	}],
	["path", {
		d: "M20 18h2",
		key: "wocana"
	}],
	["path", {
		d: "m19.07 10.93-1.41 1.41",
		key: "15zs5n"
	}],
	["path", {
		d: "M22 22H2",
		key: "19qnx5"
	}],
	["path", {
		d: "m16 6-4 4-4-4",
		key: "6wukr"
	}],
	["path", {
		d: "M16 18a4 4 0 0 0-8 0",
		key: "1lzouq"
	}]
]), yt = J("sunrise", [
	["path", {
		d: "M12 2v8",
		key: "1q4o3n"
	}],
	["path", {
		d: "m4.93 10.93 1.41 1.41",
		key: "2a7f42"
	}],
	["path", {
		d: "M2 18h2",
		key: "j10viu"
	}],
	["path", {
		d: "M20 18h2",
		key: "wocana"
	}],
	["path", {
		d: "m19.07 10.93-1.41 1.41",
		key: "15zs5n"
	}],
	["path", {
		d: "M22 22H2",
		key: "19qnx5"
	}],
	["path", {
		d: "m8 6 4-4 4 4",
		key: "ybng9g"
	}],
	["path", {
		d: "M16 18a4 4 0 0 0-8 0",
		key: "1lzouq"
	}]
]), bt = J("thermometer", [["path", {
	d: "M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z",
	key: "17jzev"
}]]), xt = J("trash-2", [
	["path", {
		d: "M10 11v6",
		key: "nco0om"
	}],
	["path", {
		d: "M14 11v6",
		key: "outv1u"
	}],
	["path", {
		d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
		key: "miytrc"
	}],
	["path", {
		d: "M3 6h18",
		key: "d0wm0j"
	}],
	["path", {
		d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
		key: "e791ji"
	}]
]), St = J("wind", [
	["path", {
		d: "M12.8 19.6A2 2 0 1 0 14 16H2",
		key: "148xed"
	}],
	["path", {
		d: "M17.5 8a2.5 2.5 0 1 1 2 4H2",
		key: "1u4tom"
	}],
	["path", {
		d: "M9.8 4.4A2 2 0 1 1 11 8H2",
		key: "75valh"
	}]
]), Ct = J("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]);
//#endregion
//#region src/components/WeatherAirQuality.tsx
function wt({ aq: e }) {
	let t = e.europeanAqi ?? e.usAqi, n = e.europeanAqi == null ? "US AQI" : "EU AQI", { level: r, color: i } = Tt(t);
	return /* @__PURE__ */ f("div", {
		className: "mt-3 rounded-2xl bg-black/30 p-3 backdrop-blur-md",
		children: [
			/* @__PURE__ */ f("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ f("div", {
					className: "flex items-center gap-1.5 text-white/50",
					children: [/* @__PURE__ */ d(St, { className: "size-3" }), /* @__PURE__ */ d("span", {
						className: "text-[10px] font-medium uppercase tracking-wider",
						children: "Air Quality"
					})]
				}), t != null && /* @__PURE__ */ d("span", {
					className: `rounded-full px-2 py-0.5 text-[10px] font-semibold ${i}`,
					children: r
				})]
			}),
			t != null && /* @__PURE__ */ f("div", {
				className: "mt-1 flex items-baseline gap-1.5",
				children: [/* @__PURE__ */ d("span", {
					className: "text-3xl font-light text-white",
					children: Math.round(t)
				}), /* @__PURE__ */ d("span", {
					className: "text-xs text-white/50",
					children: n
				})]
			}),
			/* @__PURE__ */ f("div", {
				className: "mt-2 grid grid-cols-3 gap-x-2 gap-y-1.5",
				children: [
					/* @__PURE__ */ d(X, {
						label: "PM2.5",
						value: e.pm25,
						unit: "µg/m³"
					}),
					/* @__PURE__ */ d(X, {
						label: "PM10",
						value: e.pm10,
						unit: "µg/m³"
					}),
					/* @__PURE__ */ d(X, {
						label: "O₃",
						value: e.ozone,
						unit: "µg/m³"
					}),
					/* @__PURE__ */ d(X, {
						label: "NO₂",
						value: e.nitrogenDioxide,
						unit: "µg/m³"
					}),
					/* @__PURE__ */ d(X, {
						label: "SO₂",
						value: e.sulphurDioxide,
						unit: "µg/m³"
					}),
					/* @__PURE__ */ d(X, {
						label: "CO",
						value: e.carbonMonoxide,
						unit: "µg/m³"
					}),
					e.dust != null && /* @__PURE__ */ d(X, {
						label: "Dust",
						value: e.dust,
						unit: "µg/m³"
					}),
					e.uvIndex != null && /* @__PURE__ */ d(X, {
						label: "UV",
						value: e.uvIndex,
						unit: ""
					})
				]
			})
		]
	});
}
function X({ label: e, value: t, unit: n }) {
	return t == null ? null : /* @__PURE__ */ f("div", {
		className: "flex flex-col",
		children: [/* @__PURE__ */ d("span", {
			className: "text-[10px] text-white/40",
			children: e
		}), /* @__PURE__ */ f("span", {
			className: "text-xs font-medium text-white/80",
			children: [t < 10 ? t.toFixed(1) : Math.round(t), n && /* @__PURE__ */ d("span", {
				className: "ml-0.5 text-[9px] text-white/30",
				children: n
			})]
		})]
	});
}
function Tt(e) {
	return e == null ? {
		level: "—",
		color: "bg-white/20 text-white/60"
	} : e <= 20 ? {
		level: "Good",
		color: "bg-green-500/30 text-green-300"
	} : e <= 40 ? {
		level: "Fair",
		color: "bg-lime-500/30 text-lime-300"
	} : e <= 60 ? {
		level: "Moderate",
		color: "bg-yellow-500/30 text-yellow-300"
	} : e <= 80 ? {
		level: "Poor",
		color: "bg-orange-500/30 text-orange-300"
	} : e <= 100 ? {
		level: "Very Poor",
		color: "bg-red-500/30 text-red-300"
	} : {
		level: "Hazardous",
		color: "bg-purple-500/30 text-purple-300"
	};
}
//#endregion
//#region src/components/webgl-weather.ts
function Et(e) {
	return e >= 95 ? "thunderstorm" : e >= 85 ? "snow" : e >= 80 ? "rain" : e >= 71 && e <= 77 ? "snow" : e >= 61 && e <= 67 ? "rain" : e >= 51 && e <= 57 ? "drizzle" : e === 45 || e === 48 ? "atmosphere" : e >= 1 && e <= 3 ? "clouds" : "clear";
}
function Dt(e = /* @__PURE__ */ new Date()) {
	let t = Date.UTC(2e3, 0, 6, 18, 14, 0);
	return ((e.getTime() - t) / 864e5 / 29.53058770576 % 1 + 1) % 1;
}
var Ot = "#version 100\nattribute vec2 a_pos;\nvoid main() { gl_Position = vec4(a_pos, 0.0, 1.0); }\n", kt = "#version 100\nprecision highp float;\n\nuniform vec2 u_res;\nuniform float u_time;\nuniform float u_kind;   // 0=clear 1=clouds 2=rain 3=drizzle 4=snow 5=thunder 6=fog\nuniform float u_night;  // 0.0=day, 1.0=night\nuniform float u_moon;   // moon phase 0..1 (0=new, 0.5=full, 1=new)\nuniform float u_tod;    // time of day 0..1 (0=midnight, 0.5=noon)\n\n// ── Hash / noise ─────────────────────────────────────────────────────────────\n\nfloat hash(vec2 p) {\n  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);\n}\n\nfloat hash1(float n) {\n  return fract(sin(n) * 43758.5453123);\n}\n\nfloat noise(vec2 p) {\n  vec2 i = floor(p);\n  vec2 f = fract(p);\n  f = f * f * (3.0 - 2.0 * f);\n  float a = hash(i);\n  float b = hash(i + vec2(1.0, 0.0));\n  float c = hash(i + vec2(0.0, 1.0));\n  float d = hash(i + vec2(1.0, 1.0));\n  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);\n}\n\nfloat fbm(vec2 p) {\n  float v = 0.0, a = 0.5;\n  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);\n  for (int i = 0; i < 5; i++) {\n    v += a * noise(p);\n    p = rot * p * 2.0;\n    a *= 0.5;\n  }\n  return v;\n}\n\n// ── Time-of-day helpers ───────────────────────────────────────────────────────\n// Returns 0 at dawn/dusk edges, 1 at solar noon (sun is up ~0.21=5am to ~0.79=7pm)\nfloat sunPhase() {\n  float frac = clamp((u_tod - 0.21) / 0.58, 0.0, 1.0);\n  return 1.0 - abs(frac * 2.0 - 1.0);\n}\n\n// Sun disc color: deep orange at dawn/dusk → warm white-yellow at noon\nvec3 sunTodColor() {\n  float e = sunPhase(); e = e * e;\n  return mix(vec3(1.00, 0.35, 0.04), vec3(1.00, 0.93, 0.52), e);\n}\n\n// Outer glow color: warmer / more diffuse than disc\nvec3 glowTodColor() {\n  float e = sunPhase(); e = e * e;\n  return mix(vec3(1.00, 0.50, 0.12), vec3(1.00, 0.96, 0.72), e);\n}\n\n// ── Sky gradient ─────────────────────────────────────────────────────────────\n\nvec3 skyDay(float y, float kind) {\n  if (kind < 0.5) {           // clear - rich atmospheric 3-stop gradient\n    vec3 zenith  = vec3(0.06, 0.22, 0.72);\n    vec3 midsky  = vec3(0.22, 0.48, 0.86);\n    vec3 horiz   = vec3(0.48, 0.72, 0.98);\n    float t1 = smoothstep(0.0, 0.42, y);\n    float t2 = smoothstep(0.38, 1.0, y);\n    vec3 base = mix(mix(horiz, midsky, t1), zenith, t2);\n    // Dawn/dusk: warm the lower sky with sun color\n    float golden = 1.0 - sunPhase() * sunPhase();\n    base = mix(base, base * mix(vec3(1.0), sunTodColor() * 1.3, 0.55), golden * exp(-y * 2.5));\n    return base;\n  }\n  // Base sky colours per weather type\n  vec3 top, bot;\n  if (kind < 1.5) {    // clouds\n    top = vec3(0.35, 0.50, 0.63);\n    bot = vec3(0.69, 0.77, 0.85);\n  } else if (kind < 2.5) {    // rain\n    top = vec3(0.23, 0.31, 0.41);\n    bot = vec3(0.44, 0.53, 0.60);\n  } else if (kind < 3.5) {    // drizzle\n    top = vec3(0.29, 0.42, 0.53);\n    bot = vec3(0.54, 0.66, 0.74);\n  } else if (kind < 4.5) {    // snow\n    top = vec3(0.56, 0.67, 0.74);\n    bot = vec3(0.84, 0.89, 0.93);\n  } else if (kind < 5.5) {    // thunderstorm\n    top = vec3(0.10, 0.12, 0.18);\n    bot = vec3(0.22, 0.27, 0.33);\n  } else {                    // atmosphere / fog\n    top = vec3(0.48, 0.54, 0.60);\n    bot = vec3(0.69, 0.74, 0.78);\n  }\n  return mix(bot, top, y);\n}\n\nvec3 skyNight(float y, float kind) {\n  if (kind < 0.5) {           // clear night - deep starry sky\n    vec3 zenith  = vec3(0.02, 0.04, 0.10);\n    vec3 midsky  = vec3(0.04, 0.08, 0.16);\n    vec3 horiz   = vec3(0.07, 0.13, 0.24);\n    float t1 = smoothstep(0.0, 0.5, y);\n    float t2 = smoothstep(0.45, 1.0, y);\n    return mix(mix(horiz, midsky, t1), zenith, t2);\n  }\n  vec3 top, bot;\n  if (kind < 1.5) {    // clouds\n    top = vec3(0.08, 0.12, 0.18);\n    bot = vec3(0.16, 0.21, 0.28);\n  } else if (kind < 5.5) {    // rain / drizzle / snow / thunder\n    top = vec3(0.04, 0.06, 0.10);\n    bot = vec3(0.10, 0.14, 0.20);\n  } else {                    // fog\n    top = vec3(0.10, 0.12, 0.15);\n    bot = vec3(0.18, 0.19, 0.22);\n  }\n  return mix(bot, top, y);\n}\n\n// ── Sun / Moon glow ──────────────────────────────────────────────────────────\n\nvec3 celestialGlow(vec2 uv, float night, float time) {\n  float aspect = u_res.x / u_res.y;\n  if (night < 0.5) {\n    // Soft sun: layered glow + bright disc\n    vec2 sunPos = vec2(0.72, 0.82);\n    vec2 d = (uv - sunPos) * vec2(aspect, 1.0);\n    float dist = length(d);\n    float outerGlow = exp(-dist * 6.5) * 0.14;\n    float midGlow   = exp(-dist * 10.0) * 0.26;\n    float innerGlow = exp(-dist * 14.0) * 0.50;\n    float disc      = smoothstep(0.055, 0.025, dist);\n\n    vec3 sunCol  = sunTodColor();\n    vec3 glowCol = glowTodColor();\n    return sunCol * (disc * 0.85 + innerGlow + midGlow * 0.38)\n         + glowCol * outerGlow;\n  } else {\n    // iOS-style moon: small disc + subtle atmospheric glow\n    vec2 moonPos = vec2(0.3, 0.85);\n    vec2 d = (uv - moonPos) * vec2(aspect, 1.0);\n    float dist = length(d);\n\n    // Subtle atmospheric glow — colors close to night sky, just a hint brighter\n    float glow1 = exp(-dist * 2.0) * 0.04;\n    float glow2 = exp(-dist * 5.0) * 0.07;\n    float glow3 = exp(-dist * 14.0) * 0.12;\n    vec3 glow = vec3(0.08, 0.12, 0.22) * glow1\n              + vec3(0.12, 0.17, 0.30) * glow2\n              + vec3(0.20, 0.25, 0.38) * glow3;\n\n    // Small moon disc with soft edge\n    float r = 0.022;\n    float moonDisc = smoothstep(r, r - 0.004, dist);\n\n    // Phase crescent\n    float phase = u_moon;\n    float illum = 0.5 - 0.5 * cos(phase * 6.28318);\n    float shadowDir = phase < 0.5 ? 1.0 : -1.0;\n    float offset = shadowDir * (1.0 - illum) * r * 2.0;\n    vec2 shadowCenter = d + vec2(offset, 0.0);\n    float shadowDisc = smoothstep(r * 0.92, r * 0.92 - 0.004, length(shadowCenter));\n    float crescent = moonDisc * max(1.0 - shadowDisc, illum);\n\n    vec3 moonCol = vec3(0.65, 0.68, 0.75);\n    return moonCol * crescent * 0.55 + glow;\n  }\n}\n\n// ── Rain ─────────────────────────────────────────────────────────────────────\n\nfloat rain(vec2 uv, float time, float intensity) {\n  float v = 0.0;\n\n  // Dynamic wind: slow base drift + occasional gusts\n  float windBase = sin(time * 0.19) * 0.10 + sin(time * 0.67 + 2.0) * 0.05;\n  float gust = 0.72 + 0.28 * sin(time * 0.37) * sin(time * 0.13 + 1.7);\n  float eff = intensity * gust;\n\n  // 5 depth layers: 0 = nearest (big, fast), 4 = farthest (small, slow)\n  for (int layer = 0; layer < 5; layer++) {\n    float fl = float(layer);\n    float depth = fl * 0.25;\n\n    // Cull distant layers for light rain\n    if (depth > 0.55 && intensity < 0.4) continue;\n    if (depth > 0.8 && intensity < 0.7) continue;\n\n    // Near: fewer wider columns, far: many narrow columns\n    float cols = mix(6.0, 26.0, depth) * mix(0.75, 1.0, eff);\n    float rowAspect = mix(6.5, 3.2, depth);\n    float rows = cols * rowAspect;\n\n    // Near drops fall faster\n    float speed = mix(2.0, 0.65, depth) * gust * rows;\n\n    // Wind slant (near drops deflect more)\n    float wind = windBase * mix(1.3, 0.45, depth) + fl * 0.015;\n\n    // Near = bright, far = dim\n    float alpha = mix(0.30, 0.04, depth) * eff;\n\n    vec2 p = vec2(\n      uv.x * cols + uv.y * cols * wind,\n      uv.y * rows + time * speed\n    );\n    // Stagger each layer to prevent grid alignment\n    p += vec2(hash1(fl * 17.3) * 137.0, hash1(fl * 31.7) * 241.0);\n\n    vec2 cell = floor(p);\n    vec2 f = fract(p);\n    float h = hash(cell + fl * 113.0);\n\n    // Density: more drops when intensity is higher\n    float sparsity = mix(0.88, 0.15, eff);\n    if (h < sparsity) continue;\n\n    // Random horizontal position in cell (break grid)\n    float cx = 0.12 + hash(cell + 11.0) * 0.76;\n    float dx = abs(f.x - cx);\n\n    // Streak thickness: near = thick, far = thin, per-drop variation\n    float thick = mix(0.04, 0.010, depth) * (0.7 + hash(cell + 23.0) * 0.6);\n    float streak = smoothstep(thick, thick * 0.06, dx);\n\n    // Streak length + vertical taper for motion-blur look\n    float len = mix(0.55, 0.18, depth) + hash(cell + 77.0) * 0.25;\n    float fy = fract(f.y + h * 7.7);\n\n    // Sharp leading edge (bottom), soft trailing fade (top = motion blur)\n    float headEdge = smoothstep(0.0, 0.012, fy);\n    float tailEdge = smoothstep(len, len * 0.22, fy);\n    streak *= headEdge * tailEdge;\n\n    float bright = 0.4 + hash(cell + 33.0) * 0.6;\n    v += streak * alpha * bright;\n  }\n\n  // ── Splash particles along bottom ──\n  if (eff > 0.25) {\n    for (int s = 0; s < 16; s++) {\n      float fs = float(s);\n      if (fs >= 4.0 + eff * 12.0) break;\n\n      float period = 0.3 + hash1(fs * 5.1) * 0.4;\n      float cycle = floor(time / period + fs * 0.73);\n      float life = fract(time / period + fs * 0.73);\n\n      float sx = hash(vec2(fs + 1.0, cycle + 7.0));\n      float sy = 0.05 * hash(vec2(cycle + 3.0, fs + 11.0)) * 0.5;\n\n      // Tiny upward arc\n      float arc = life * (1.0 - life) * 4.0;\n      sy += arc * 0.025 * eff;\n\n      vec2 dd = uv - vec2(sx, sy);\n      float dist = length(dd * vec2(u_res.x / u_res.y, 1.0));\n      float splashDot = smoothstep(0.006, 0.0, dist);\n\n      float fadein = smoothstep(0.0, 0.1, life);\n      float fadeout = 1.0 - smoothstep(0.5, 1.0, life);\n      v += splashDot * fadein * fadeout * eff * 0.25;\n    }\n  }\n\n  return v;\n}\n\n// ── Raindrops on screen glass ───────────────────────────────────────────────\n\nvec3 glassDrops(vec2 uv, float time, float density) {\n  vec3 result = vec3(0.0);\n  float aspect = u_res.x / u_res.y;\n\n  // ── Large sliding drops ──\n  float numLarge = 3.0 + density * 8.0;\n  for (int i = 0; i < 12; i++) {\n    if (float(i) >= numLarge) break;\n    float fi = float(i);\n\n    float period = 3.5 + hash1(fi * 7.3) * 4.0;\n    float phase = hash1(fi * 13.1 + 0.5) * period;\n    float cycle = floor((time + phase) / period);\n    float life = fract((time + phase) / period);\n\n    // Start position: upper portion\n    float baseX = 0.06 + hash(vec2(fi + 1.0, cycle + 3.0)) * 0.88;\n    float baseY = 0.75 + hash(vec2(cycle + 7.0, fi + 11.0)) * 0.20;\n\n    // Brief pause then accelerating descent\n    float slideT = smoothstep(0.08, 0.9, life);\n    float slideY = slideT * slideT * (0.12 + density * 0.25);\n\n    // Subtle horizontal wander\n    float sway = sin(time * (0.25 + fi * 0.015) + fi * 2.1) * 0.005\n               + sin(life * 3.14159 + fi) * 0.003;\n\n    vec2 pos = vec2(baseX + sway, baseY - slideY);\n    float radius = (0.013 + hash1(fi * 4.7 + cycle) * 0.013) * mix(0.6, 1.0, density);\n\n    vec2 d = (uv - pos) * vec2(aspect, 1.0);\n\n    // Teardrop head: soft ellipse slightly squished vertically\n    vec2 headD = vec2(d.x * 1.05, (d.y + radius * 0.12) * 0.88);\n    float head = smoothstep(radius, radius * 0.12, length(headD));\n\n    // Neck connecting head to trail\n    float neckW = radius * mix(0.38, 0.08, life);\n    float neck = smoothstep(neckW, neckW * 0.15, abs(d.x));\n    neck *= smoothstep(-radius * 0.12, radius * 1.6, d.y);\n    neck *= 1.0 - smoothstep(radius * 0.6, radius * 2.2, d.y);\n\n    // Trail: tapers from neck width to thin line\n    float trailLen = radius * (1.8 + density * 2.2 + life * 2.0);\n    float trailProgress = clamp((d.y - radius * 0.4) / max(trailLen, 0.001), 0.0, 1.0);\n    float trailW = radius * mix(0.22, 0.02, trailProgress);\n    float trail = smoothstep(trailW, trailW * 0.08, abs(d.x));\n    trail *= smoothstep(radius * 0.25, radius * 0.8, d.y);\n    trail *= 1.0 - smoothstep(radius * 0.6, radius * 0.6 + trailLen, d.y);\n\n    float body = max(head, neck * 0.82);\n    body = max(body, trail * 0.45);\n\n    // Rim light (edge refraction)\n    float edgeDist = length(d);\n    float rim = smoothstep(radius * 1.05, radius * 0.48, edgeDist);\n    rim -= smoothstep(radius * 0.55, radius * 0.1, edgeDist);\n    rim = max(rim, 0.0) * (0.35 + life * 0.15);\n\n    // Specular highlights: upper-left glint\n    float spec = smoothstep(\n      radius * 0.24, 0.0,\n      length(vec2((d.x + radius * 0.26) * 2.0, (d.y - radius * 0.20) * 1.5))\n    );\n    // Thin line along trail center\n    spec += trail * smoothstep(radius * 0.04, 0.0, abs(d.x + trailW * 0.3)) * 0.4;\n\n    float fade = 0.65 + 0.35 * sin(fi * 8.1 + cycle);\n    result.x += body * fade;\n    result.y += spec * fade;\n    result.z += rim * fade;\n  }\n\n  // ── Small static beaded droplets ──\n  float numSmall = 6.0 + density * 14.0;\n  for (int j = 0; j < 24; j++) {\n    if (float(j) >= numSmall) break;\n    float fj = float(j);\n\n    float cx = hash1(fj * 3.7 + 100.0);\n    float cy = hash1(fj * 5.3 + 200.0);\n    float r = 0.002 + hash1(fj * 2.1 + 300.0) * 0.005;\n\n    vec2 dd = (uv - vec2(cx, cy)) * vec2(aspect, 1.0);\n    float dist = length(dd);\n    float bead = smoothstep(r, r * 0.15, dist);\n    float glint = smoothstep(r * 0.45, 0.0, length(dd - vec2(r * 0.3, -r * 0.3)));\n\n    result.x += bead * 0.12;\n    result.y += glint * 0.18;\n  }\n\n  return result;\n}\n\n// ── Snow ─────────────────────────────────────────────────────────────────────\n\nfloat snow(vec2 uv, float time) {\n  float v = 0.0;\n  for (int layer = 0; layer < 4; layer++) {\n    float fl = float(layer);\n    float scale = 8.0 + fl * 6.0;\n    float speed = 0.3 + fl * 0.15;\n    float alpha = 0.5 - fl * 0.08;\n    float size = 0.04 - fl * 0.006;\n    vec2 p = uv * scale;\n    p.y -= time * speed;\n    // Horizontal sway\n    p.x += sin(time * 0.5 + p.y * 0.8 + fl * 1.7) * 0.5;\n    vec2 cell = floor(p);\n    vec2 f = fract(p);\n    float h = hash(cell);\n    vec2 center = vec2(0.3 + h * 0.4, 0.3 + hash(cell + 99.0) * 0.4);\n    float d = length(f - center);\n    // Soft bokeh circle\n    float flake = smoothstep(size, size * 0.2, d);\n    v += flake * alpha;\n  }\n  return v;\n}\n\n// ── Stars ────────────────────────────────────────────────────────────────────\n\nfloat stars(vec2 uv, float time) {\n  float v = 0.0;\n  vec2 p = uv * 60.0;\n  vec2 cell = floor(p);\n  vec2 f = fract(p);\n  float h = hash(cell);\n  if (h > 0.92) {\n    vec2 center = vec2(hash(cell + 1.0), hash(cell + 2.0));\n    float d = length(f - center);\n    float twinkle = 0.5 + 0.5 * sin(time * (2.0 + h * 3.0) + h * 50.0);\n    float star = smoothstep(0.06, 0.0, d) * twinkle;\n    v += star * (0.4 + h * 0.6);\n  }\n  return v;\n}\n\n// ── Lightning ────────────────────────────────────────────────────────────────\n\nfloat lightning(vec2 uv, float time) {\n  // Periodic flash\n  float cycle = mod(time, 6.0 + hash1(floor(time / 6.0)) * 8.0);\n  float flash = 0.0;\n  if (cycle < 0.08) {\n    flash = 1.0;\n  } else if (cycle < 0.15) {\n    flash = 0.0;\n  } else if (cycle < 0.22) {\n    flash = 0.7;\n  }\n\n  // Bolt\n  if (flash > 0.1) {\n    float x = 0.4 + hash1(floor(time / 6.0)) * 0.2;\n    float boltx = x;\n    float d = 1.0;\n    float y = uv.y;\n    if (y > 0.3 && y < 0.95) {\n      float ny = (y - 0.3) / 0.65;\n      // Jagged path\n      boltx += sin(ny * 12.0 + time * 2.0) * 0.03;\n      boltx += sin(ny * 25.0) * 0.015;\n      d = abs(uv.x - boltx);\n      float glow = smoothstep(0.08, 0.0, d) * 0.5;\n      float core = smoothstep(0.008, 0.0, d);\n      return (core + glow) * flash * smoothstep(0.95, 0.6, ny);\n    }\n  }\n  return flash * 0.15; // ambient flash\n}\n\n// ── Cloud layer ──────────────────────────────────────────────────────────────\n\nfloat clouds(vec2 uv, float time, float density) {\n  vec2 p = uv * vec2(3.0, 5.0);\n  p.x += time * 0.04;\n  float n = fbm(p);\n  // Threshold for cloud coverage\n  float threshold = 0.4 - density * 0.2;\n  float c = smoothstep(threshold, threshold + 0.25, n);\n  return c;\n}\n\n// ── Fog ──────────────────────────────────────────────────────────────────────\n\nfloat fog(vec2 uv, float time) {\n  vec2 p = uv * vec2(2.0, 4.0);\n  p.x += time * 0.02;\n  p.y += sin(time * 0.1) * 0.1;\n  float n = fbm(p + fbm(p + time * 0.01));\n  return n * 0.6;\n}\n\n// ── Main ─────────────────────────────────────────────────────────────────────\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / u_res;\n  float kind = u_kind;\n  float night = u_night;\n  float t = u_time;\n\n  // Sky\n  vec3 col = mix(skyDay(uv.y, kind), skyNight(uv.y, kind), night);\n\n  // Cloud layers (for cloudy / rain / thunder)\n  if (kind > 0.5 && kind < 6.5) {\n    float density = 0.3;\n    if (kind > 1.5 && kind < 5.5) density = 0.6;  // rain/drizzle/snow\n    if (kind > 4.5 && kind < 5.5) density = 0.9;  // thunder\n    float c = clouds(uv, t, density);\n    vec3 cloudCol = mix(vec3(0.85, 0.88, 0.92), vec3(0.35, 0.38, 0.42), night);\n    if (kind > 4.5 && kind < 5.5) cloudCol *= 0.4; // dark thunder clouds\n    col = mix(col, cloudCol, c * 0.7);\n  }\n\n  // Sun / moon (only for clear / partly cloudy)\n  if (kind < 1.5) {\n    col += celestialGlow(uv, night, t);\n  }\n\n  // Golden hour ambient — tint the lower sky with sun color at dawn/dusk\n  // Affects all weather types (even cloudy skies glow warm at sunset)\n  if (night < 0.5) {\n    float golden = 1.0 - sunPhase() * sunPhase();\n    col += glowTodColor() * golden * exp(-uv.y * 3.2) * 0.12;\n  }\n\n  // Clear day: warm golden horizon + sun-area atmospheric scatter\n  if (kind < 0.5 && night < 0.5) {\n    float horizGlow = exp(-uv.y * 13.0) * 0.14;\n    vec3 horizTint = mix(vec3(1.38, 1.10, 0.62), sunTodColor() * vec3(1.5, 1.2, 1.0), 1.0 - sunPhase() * sunPhase());\n    col = mix(col, col * horizTint, horizGlow);\n    float sunScatter = exp(-abs(uv.y - 0.82) * 5.5) * exp(-abs(uv.x - 0.72) * 4.0) * 0.06;\n    col += sunTodColor() * sunScatter * 0.7;\n  }\n\n  // Clear night: subtle milky way band\n  if (kind < 0.5 && night > 0.5) {\n    float mwY    = uv.x * 0.28 + 0.38;\n    float diff   = uv.y - mwY;\n    float mwBand = exp(-diff * diff * 55.0);\n    float mwDens = fbm(uv * vec2(9.0, 3.5) + t * 0.003);\n    col += vec3(0.45, 0.55, 0.85) * mwBand * mwDens * 0.16;\n  }\n\n  // Stars (night + clear/partly)\n  if (night > 0.5 && kind < 1.5) {\n    float s = stars(uv, t);\n    col += vec3(0.8, 0.85, 1.0) * s;\n  }\n\n  // Rain + drops on glass\n  if (kind > 1.5 && kind < 3.5) {\n    float intensity = kind < 2.5 ? 1.0 : 0.25; // rain vs drizzle\n    float r = rain(uv, t, intensity);\n    col += vec3(0.7, 0.78, 0.9) * r;\n    vec3 drops = glassDrops(uv, t, intensity);\n    col = mix(col, col * vec3(1.05, 1.06, 1.08), drops.x * 0.12);\n    col += vec3(0.95, 0.98, 1.0) * drops.y * 0.22;\n    col += vec3(0.7, 0.78, 0.9) * drops.z * 0.1;\n  }\n\n  // Thunderstorm — rain + lightning + drops on glass\n  if (kind > 4.5 && kind < 5.5) {\n    float r = rain(uv, t, 1.3);\n    col += vec3(0.6, 0.65, 0.8) * r;\n    vec3 drops = glassDrops(uv, t, 1.0);\n    col = mix(col, col * vec3(1.04, 1.05, 1.07), drops.x * 0.14);\n    col += vec3(0.9, 0.94, 1.0) * drops.y * 0.18;\n    col += vec3(0.65, 0.72, 0.86) * drops.z * 0.12;\n    float l = lightning(uv, t);\n    col += vec3(0.9, 0.9, 1.0) * l;\n  }\n\n  // Snow\n  if (kind > 3.5 && kind < 4.5) {\n    float s = snow(uv, t);\n    col += vec3(1.0) * s;\n  }\n\n  // Fog / atmosphere\n  if (kind > 5.5) {\n    float f = fog(uv, t);\n    vec3 fogCol = mix(vec3(0.75, 0.78, 0.8), vec3(0.3, 0.32, 0.35), night);\n    col = mix(col, fogCol, f);\n  }\n\n  // Vignette\n  float vig = 1.0 - 0.3 * length((uv - 0.5) * vec2(1.0, 0.6));\n  col *= vig;\n\n  gl_FragColor = vec4(col, 1.0);\n}\n", At = class {
	gl;
	program;
	uRes;
	uTime;
	uKind;
	uNight;
	uMoon;
	uTod;
	startTime;
	raf = 0;
	canvas;
	ro;
	destroyed = !1;
	constructor(e) {
		this.canvas = e;
		let t = e.getContext("webgl", {
			alpha: !1,
			antialias: !1,
			premultipliedAlpha: !1
		});
		if (!t) throw Error("WebGL not supported");
		this.gl = t, this.startTime = performance.now() / 1e3;
		let n = this.compileShader(t.VERTEX_SHADER, Ot), r = this.compileShader(t.FRAGMENT_SHADER, kt), i = t.createProgram();
		if (t.attachShader(i, n), t.attachShader(i, r), t.linkProgram(i), !t.getProgramParameter(i, t.LINK_STATUS)) {
			let e = t.getProgramInfoLog(i);
			throw t.deleteProgram(i), Error(`Shader link error: ${e}`);
		}
		this.program = i, t.useProgram(i), this.uRes = t.getUniformLocation(i, "u_res"), this.uTime = t.getUniformLocation(i, "u_time"), this.uKind = t.getUniformLocation(i, "u_kind"), this.uNight = t.getUniformLocation(i, "u_night"), this.uMoon = t.getUniformLocation(i, "u_moon"), this.uTod = t.getUniformLocation(i, "u_tod");
		let a = t.createBuffer();
		t.bindBuffer(t.ARRAY_BUFFER, a), t.bufferData(t.ARRAY_BUFFER, new Float32Array([
			-1,
			-1,
			1,
			-1,
			-1,
			1,
			1,
			1
		]), t.STATIC_DRAW);
		let o = t.getAttribLocation(i, "a_pos");
		t.enableVertexAttribArray(o), t.vertexAttribPointer(o, 2, t.FLOAT, !1, 0, 0), this.ro = new ResizeObserver(() => this.resize()), this.ro.observe(e), this.resize();
	}
	compileShader(e, t) {
		let n = this.gl, r = n.createShader(e);
		if (n.shaderSource(r, t), n.compileShader(r), !n.getShaderParameter(r, n.COMPILE_STATUS)) {
			let e = n.getShaderInfoLog(r);
			throw n.deleteShader(r), Error(`Shader compile error: ${e}`);
		}
		return r;
	}
	resize() {
		let e = Math.min(devicePixelRatio, 2), t = this.canvas.clientWidth * e, n = this.canvas.clientHeight * e;
		(this.canvas.width !== t || this.canvas.height !== n) && (this.canvas.width = t, this.canvas.height = n);
	}
	start(e, t, n) {
		this.setWeather(e, t, n);
		let r = () => {
			this.destroyed || (this.draw(), this.raf = requestAnimationFrame(r));
		};
		this.raf = requestAnimationFrame(r);
	}
	setWeather(e, t, n) {
		let r = this.gl;
		r.useProgram(this.program), r.uniform1f(this.uKind, jt(e)), r.uniform1f(this.uNight, +!!t), r.uniform1f(this.uMoon, n);
	}
	draw() {
		let e = this.gl;
		e.viewport(0, 0, this.canvas.width, this.canvas.height), e.useProgram(this.program), e.uniform2f(this.uRes, this.canvas.width, this.canvas.height), e.uniform1f(this.uTime, performance.now() / 1e3 - this.startTime);
		let t = /* @__PURE__ */ new Date(), n = (t.getHours() * 3600 + t.getMinutes() * 60 + t.getSeconds()) / 86400;
		e.uniform1f(this.uTod, n), e.drawArrays(e.TRIANGLE_STRIP, 0, 4);
	}
	destroy() {
		this.destroyed = !0, cancelAnimationFrame(this.raf), this.ro.disconnect(), this.gl.deleteProgram(this.program);
	}
};
function jt(e) {
	switch (e) {
		case "clear": return 0;
		case "clouds": return 1;
		case "rain": return 2;
		case "drizzle": return 3;
		case "snow": return 4;
		case "thunderstorm": return 5;
		case "atmosphere": return 6;
	}
}
//#endregion
//#region src/components/WeatherBackground.tsx
function Mt({ weatherCode: e, isNight: t }) {
	let n = c(null), r = c(null), i = Et(e), a = Dt();
	return s(() => {
		let e = n.current;
		if (e) {
			try {
				let n = new At(e);
				r.current = n, n.start(i, t, a);
			} catch {}
			return () => {
				r.current?.destroy(), r.current = null;
			};
		}
	}, [
		t,
		i,
		a
	]), s(() => {
		r.current?.setWeather(i, t, a);
	}, [
		i,
		t,
		a
	]), /* @__PURE__ */ d("canvas", {
		ref: n,
		className: "pointer-events-none absolute inset-0 size-full"
	});
}
//#endregion
//#region src/components/WeatherCurrent.tsx
function Nt({ current: e, location: t }) {
	return /* @__PURE__ */ f("div", {
		className: "flex flex-col items-center pt-2 pb-4 text-white",
		children: [
			/* @__PURE__ */ d("p", {
				className: "text-sm font-medium tracking-wide text-white/90",
				children: t.name
			}),
			/* @__PURE__ */ f("p", {
				className: "mt-1 text-7xl font-extralight tabular-nums leading-none tracking-tighter",
				children: [Math.round(e.temp), "°"]
			}),
			/* @__PURE__ */ d("p", {
				className: "mt-1 text-sm capitalize text-white/80",
				children: e.weatherDescription
			}),
			/* @__PURE__ */ f("p", {
				className: "mt-0.5 text-sm text-white/60",
				children: [
					"H:",
					Math.round(e.tempMax),
					"° L:",
					Math.round(e.tempMin),
					"°"
				]
			})
		]
	});
}
//#endregion
//#region src/components/WeatherIcon.tsx
function Pt(e, t) {
	let n = t ? "day" : "night";
	return e === 0 ? `clear-${n}` : e <= 2 ? `partly-cloudy-${n}` : e === 3 ? `overcast-${n}` : e === 45 || e === 48 ? `fog-${n}` : e >= 51 && e <= 55 ? `partly-cloudy-${n}-drizzle` : e === 56 || e === 57 ? "drizzle" : e >= 61 && e <= 65 ? `partly-cloudy-${n}-rain` : e === 66 || e === 67 ? "sleet" : e >= 71 && e <= 77 ? "snow" : e >= 80 && e <= 82 ? "rain" : e >= 85 && e <= 86 ? "snow" : e === 95 ? `thunderstorms-${n}` : e >= 96 ? `thunderstorms-${n}-rain` : `partly-cloudy-${n}`;
}
function Z({ code: e, isDay: t, className: n = "size-7" }) {
	return /* @__PURE__ */ d("img", {
		src: `/weather-icons/${Pt(e, t)}.svg`,
		alt: "",
		draggable: !1,
		className: n
	});
}
//#endregion
//#region src/components/WeatherDaily.tsx
var Ft = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
];
function It({ daily: e }) {
	if (e.length === 0) return null;
	let t = Math.min(...e.map((e) => e.tempMin)), n = Math.max(...e.map((e) => e.tempMax)) - t || 1;
	return /* @__PURE__ */ f("div", {
		className: "mt-3 rounded-2xl bg-black/30 p-4 backdrop-blur-md",
		children: [/* @__PURE__ */ f("p", {
			className: "mb-3 text-xs font-medium uppercase tracking-wider text-white/50",
			children: [e.length, "-Day Forecast"]
		}), /* @__PURE__ */ d("div", {
			className: "space-y-2",
			children: e.map((e, r) => {
				let i = (e.tempMin - t) / n * 100, a = (e.tempMax - e.tempMin) / n * 100;
				return /* @__PURE__ */ f("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ d("span", {
							className: "w-10 shrink-0 text-sm text-white/80",
							children: r === 0 ? "Today" : Lt(e.dt)
						}),
						/* @__PURE__ */ d(Z, {
							code: e.weatherCode,
							isDay: !0,
							className: "size-5 shrink-0"
						}),
						/* @__PURE__ */ f("span", {
							className: `w-8 shrink-0 text-right text-[10px] ${e.pop > .05 ? "text-sky-300" : "text-white/30"}`,
							children: [Math.round(e.pop * 100), "%"]
						}),
						/* @__PURE__ */ f("span", {
							className: "w-8 shrink-0 text-right text-sm text-white/50",
							children: [Math.round(e.tempMin), "°"]
						}),
						/* @__PURE__ */ d("div", {
							className: "relative h-1 flex-1 overflow-hidden rounded-full bg-white/15",
							children: /* @__PURE__ */ d("div", {
								className: "absolute h-full rounded-full",
								style: {
									left: `${i}%`,
									width: `${Math.max(a, 4)}%`,
									background: Rt(e.tempMin, e.tempMax)
								}
							})
						}),
						/* @__PURE__ */ f("span", {
							className: "w-8 shrink-0 text-sm text-white",
							children: [Math.round(e.tempMax), "°"]
						})
					]
				}, e.dt);
			})
		})]
	});
}
function Lt(e) {
	return Ft[(/* @__PURE__ */ new Date(e * 1e3)).getDay()];
}
function Rt(e, t) {
	return `linear-gradient(90deg, ${zt(e)}, ${zt(t)})`;
}
function zt(e) {
	return e <= -10 ? "#6ea8fe" : e <= 0 ? "#8ec5fc" : e <= 10 ? "#a5d6a7" : e <= 20 ? "#fff176" : e <= 30 ? "#ffab40" : "#ef5350";
}
//#endregion
//#region src/components/WeatherDetails.tsx
function Bt({ current: e, sunrise: t, sunset: n, timezoneOffset: r }) {
	return /* @__PURE__ */ f("div", {
		className: "mt-3 grid grid-cols-2 gap-3 pb-4",
		children: [
			/* @__PURE__ */ d(Q, {
				icon: bt,
				label: "Feels Like",
				value: `${Math.round(e.feelsLike)}°`,
				sub: Wt(e.temp, e.feelsLike)
			}),
			/* @__PURE__ */ d(Q, {
				icon: ut,
				label: "Humidity",
				value: `${e.humidity}%`,
				sub: Gt(e.humidity)
			}),
			/* @__PURE__ */ d(Q, {
				icon: St,
				label: "Wind",
				value: `${e.windSpeed.toFixed(1)} m/s`,
				sub: Ut(e.windDeg)
			}),
			/* @__PURE__ */ d(Q, {
				icon: dt,
				label: "Visibility",
				value: Ht(e.visibility),
				sub: Kt(e.visibility)
			}),
			/* @__PURE__ */ d(Q, {
				icon: ft,
				label: "Pressure",
				value: `${e.pressure} hPa`,
				sub: qt(e.pressure)
			}),
			/* @__PURE__ */ d(Q, {
				icon: lt,
				label: "Wind Dir",
				value: `${e.windDeg}°`,
				sub: Ut(e.windDeg)
			}),
			/* @__PURE__ */ d(Q, {
				icon: yt,
				label: "Sunrise",
				value: Vt(t, r)
			}),
			/* @__PURE__ */ d(Q, {
				icon: vt,
				label: "Sunset",
				value: Vt(n, r)
			})
		]
	});
}
function Q({ icon: e, label: t, value: n, sub: r }) {
	return /* @__PURE__ */ f("div", {
		className: "rounded-2xl bg-black/30 p-3 backdrop-blur-md",
		children: [
			/* @__PURE__ */ f("div", {
				className: "flex items-center gap-1.5 text-white/50",
				children: [/* @__PURE__ */ d(e, { className: "size-3" }), /* @__PURE__ */ d("span", {
					className: "text-[10px] font-medium uppercase tracking-wider",
					children: t
				})]
			}),
			/* @__PURE__ */ d("p", {
				className: "mt-1 text-xl font-light text-white",
				children: n
			}),
			r && /* @__PURE__ */ d("p", {
				className: "mt-0.5 text-xs text-white/50",
				children: r
			})
		]
	});
}
function Vt(e, t) {
	let n = /* @__PURE__ */ new Date((e + t) * 1e3), r = n.getUTCHours(), i = n.getUTCMinutes().toString().padStart(2, "0"), a = r >= 12 ? "PM" : "AM";
	return `${r % 12 || 12}:${i} ${a}`;
}
function Ht(e) {
	return e >= 1e3 ? `${(e / 1e3).toFixed(1)} km` : `${e} m`;
}
function Ut(e) {
	return [
		"N",
		"NE",
		"E",
		"SE",
		"S",
		"SW",
		"W",
		"NW"
	][Math.round(e / 45) % 8];
}
function Wt(e, t) {
	let n = t - e;
	return Math.abs(n) < 2 ? "Similar to actual" : n > 0 ? "Feels warmer" : "Feels cooler";
}
function Gt(e) {
	return e < 30 ? "Low" : e < 60 ? "Comfortable" : e < 80 ? "Moderate" : "High";
}
function Kt(e) {
	return e >= 1e4 ? "Excellent" : e >= 5e3 ? "Good" : e >= 1e3 ? "Moderate" : "Poor";
}
function qt(e) {
	return e < 1e3 ? "Low" : e < 1015 ? "Normal" : "High";
}
//#endregion
//#region src/components/WeatherHourly.tsx
function Jt({ hourly: e, timezoneOffset: t }) {
	let n = e.slice(0, 24), r = c(null), i = c(null), a = Math.floor(Date.now() / 1e3) + t, o = n.findIndex((e, t) => {
		let r = n[t + 1];
		return r ? a >= e.dt && a < r.dt : a >= e.dt;
	});
	return s(() => {
		if (!r.current || !i.current) return;
		let e = i.current, t = e.offsetParent;
		if (!t) return;
		let n = e.offsetLeft - t.clientWidth / 2 + e.offsetWidth / 2;
		r.current.scrollTo(Math.max(0, n), 0);
	}, []), /* @__PURE__ */ f("div", {
		className: "mt-2 rounded-2xl bg-black/30 p-4 backdrop-blur-md",
		children: [/* @__PURE__ */ d("p", {
			className: "mb-3 text-xs font-medium uppercase tracking-wider text-white/50",
			children: "Forecast"
		}), /* @__PURE__ */ d(g, {
			ref: r,
			direction: "horizontal",
			hideScrollbar: !0,
			children: /* @__PURE__ */ d("div", {
				className: "-mx-1 flex gap-4 px-1",
				children: n.map((e, n) => {
					let r = n === o;
					return /* @__PURE__ */ f("div", {
						ref: r ? i : void 0,
						className: `flex shrink-0 flex-col items-center gap-1 rounded-xl px-2 py-1.5 ${r ? "bg-white/20 ring-1 ring-white/30" : ""}`,
						children: [
							/* @__PURE__ */ d("span", {
								className: `text-xs ${r ? "font-bold text-white" : "text-white/70"}`,
								children: r ? "Now" : Yt(e.dt, t)
							}),
							/* @__PURE__ */ d(Z, {
								code: e.weatherCode,
								isDay: e.isDay,
								className: "size-8"
							}),
							/* @__PURE__ */ f("span", {
								className: `text-[10px] ${e.pop > .05 ? "text-sky-300" : "text-white/30"}`,
								children: [Math.round(e.pop * 100), "%"]
							}),
							/* @__PURE__ */ f("span", {
								className: "text-sm font-medium text-white",
								children: [Math.round(e.temp), "°"]
							})
						]
					}, e.dt);
				})
			})
		})]
	});
}
function Yt(e, t) {
	let n = (/* @__PURE__ */ new Date(e * 1e3)).getUTCHours();
	return n === 0 ? "12AM" : n < 12 ? `${n}AM` : n === 12 ? "12PM" : `${n - 12}PM`;
}
//#endregion
//#region src/TranslatorContext.tsx
var Xt = n((e) => e);
function Zt({ children: e, value: t }) {
	return /* @__PURE__ */ d(Xt.Provider, {
		value: t,
		children: e
	});
}
function Qt() {
	return { t: o(Xt) };
}
//#endregion
//#region src/use-weather-settings.ts
var $ = "tokimo-weather-settings";
function $t(e) {
	if (!e) return {
		cities: [],
		primaryIndex: 0
	};
	try {
		let t = JSON.parse(e);
		if (typeof t != "object" || !t) return {
			cities: [],
			primaryIndex: 0
		};
		let n = t, r = Array.isArray(n.cities) ? n.cities.filter((e) => {
			if (typeof e != "object" || !e) return !1;
			let t = e;
			return typeof t.lat == "number" && typeof t.lon == "number" && typeof t.name == "string" && typeof t.country == "string";
		}) : [], i = typeof n.primaryIndex == "number" ? n.primaryIndex : 0;
		return {
			cities: r,
			primaryIndex: Math.max(0, Math.min(i, r.length - 1))
		};
	} catch {
		return {
			cities: [],
			primaryIndex: 0
		};
	}
}
function en() {
	let [e, t] = l(() => $t(localStorage.getItem($))), n = a((e) => {
		t(e), localStorage.setItem($, JSON.stringify(e));
	}, []);
	return s(() => {
		let e = (e) => {
			e.key === $ && t($t(e.newValue));
		};
		return window.addEventListener("storage", e), () => window.removeEventListener("storage", e);
	}, []), {
		settings: e,
		save: n
	};
}
//#endregion
//#region src/components/WeatherSettingsPage.tsx
function tn() {
	let { t: e } = Qt(), { settings: t, save: n } = en(), [r, i] = l(""), [o, u] = l([]), [p, m] = l(!1), [h, g] = l(!1), _ = c(null), v = c(void 0);
	s(() => {
		let e = r.trim();
		if (!e) {
			u([]);
			return;
		}
		return v.current = setTimeout(async () => {
			m(!0);
			try {
				let t = await fetch(`/api/apps/weather/geocode?q=${encodeURIComponent(e)}&limit=8`);
				if (!t.ok) throw Error("Geocode failed");
				u((await t.json()).map((e) => ({
					name: e.name,
					lat: e.lat,
					lon: e.lon,
					country: e.country,
					state: e.state ?? void 0
				})));
			} catch {
				u([]);
			} finally {
				m(!1);
			}
		}, 350), () => clearTimeout(v.current);
	}, [r]);
	let y = a((e) => {
		t.cities.some((t) => Math.abs(t.lat - e.lat) < .01 && Math.abs(t.lon - e.lon) < .01) || n({
			...t,
			cities: [...t.cities, e]
		}), i(""), u([]);
	}, [t, n]), b = a((e) => {
		let r = {
			...t,
			cities: t.cities.filter((t, n) => n !== e)
		};
		r.primaryIndex >= r.cities.length && (r.primaryIndex = Math.max(0, r.cities.length - 1)), n(r);
	}, [t, n]), x = a((e) => {
		n({
			...t,
			primaryIndex: e
		});
	}, [t, n]), S = a(() => {
		g(!0), navigator.geolocation.getCurrentPosition(async (e) => {
			let t = {
				lat: e.coords.latitude,
				lon: e.coords.longitude,
				name: "",
				country: ""
			};
			try {
				let e = await fetch(`/api/apps/weather/geocode?q=${t.lat.toFixed(2)},${t.lon.toFixed(2)}&limit=1`);
				if (e.ok) {
					let n = await e.json();
					n.length > 0 && (t.name = n[0].name, t.country = n[0].country);
				}
			} catch {}
			t.name && y(t), g(!1);
		}, () => g(!1), {
			enableHighAccuracy: !1,
			timeout: 1e4
		});
	}, [y]), C = c(null);
	return s(() => {
		function e(e) {
			C.current && !C.current.contains(e.target) && u([]);
		}
		return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
	}, []), /* @__PURE__ */ f("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ f("div", { children: [/* @__PURE__ */ d("h3", {
				className: "text-[13px] font-semibold text-fg-primary mb-2",
				children: e("settings.weather.addCity")
			}), /* @__PURE__ */ f("div", {
				className: "rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.03]",
				children: [/* @__PURE__ */ d("div", {
					className: "px-4 py-3.5",
					ref: C,
					children: /* @__PURE__ */ f("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ f("div", {
								className: "flex items-center gap-2 rounded-lg border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-white/[0.05] px-2.5 py-1.5 focus-within:border-[var(--accent)] focus-within:ring-1 focus-within:ring-[var(--accent)]/30 transition-colors",
								children: [
									/* @__PURE__ */ d(ht, { className: "size-4 shrink-0 text-fg-muted" }),
									/* @__PURE__ */ d("input", {
										ref: _,
										value: r,
										onChange: (e) => i(e.target.value),
										placeholder: e("settings.weather.searchPlaceholder"),
										className: "flex-1 bg-transparent text-sm text-fg-primary outline-none placeholder:text-fg-muted"
									}),
									p && /* @__PURE__ */ d(pt, { className: "size-4 shrink-0 animate-spin text-fg-muted" })
								]
							}),
							r.trim() && o.length > 0 && /* @__PURE__ */ d("div", {
								className: "absolute top-full left-0 right-0 z-10 mt-1 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1c1c1e] shadow-lg",
								children: /* @__PURE__ */ d("div", {
									className: "divide-y divide-black/[0.04] dark:divide-white/[0.06]",
									children: o.map((n) => {
										let r = t.cities.some((e) => Math.abs(e.lat - n.lat) < .01 && Math.abs(e.lon - n.lon) < .01);
										return /* @__PURE__ */ f("button", {
											type: "button",
											onClick: () => {
												r || y({
													lat: n.lat,
													lon: n.lon,
													name: n.name,
													country: n.country
												});
											},
											disabled: r,
											className: "flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.05] first:rounded-t-xl last:rounded-b-xl disabled:cursor-default disabled:opacity-50",
											children: [
												/* @__PURE__ */ d(Y, { className: "size-4 shrink-0 text-fg-muted" }),
												/* @__PURE__ */ f("div", {
													className: "flex-1 min-w-0",
													children: [/* @__PURE__ */ f("span", {
														className: "text-sm font-medium text-fg-primary",
														children: [n.name, n.state ? `, ${n.state}` : ""]
													}), /* @__PURE__ */ d("span", {
														className: "ml-2 text-xs text-fg-muted",
														children: n.country
													})]
												}),
												r ? /* @__PURE__ */ d("span", {
													className: "text-xs text-fg-muted",
													children: e("settings.weather.added")
												}) : /* @__PURE__ */ d("span", {
													className: "size-4 text-fg-muted",
													children: "+"
												})
											]
										}, `${n.lat}-${n.lon}`);
									})
								})
							}),
							r.trim() && !p && o.length === 0 && r.trim().length >= 2 && /* @__PURE__ */ d("div", {
								className: "absolute top-full left-0 right-0 z-10 mt-1 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1c1c1e] shadow-lg px-4 py-3 text-sm text-fg-muted",
								children: e("settings.weather.noResults")
							})
						]
					})
				}), /* @__PURE__ */ d("div", {
					className: "border-t border-black/[0.04] dark:border-white/[0.06] px-4 py-3",
					children: /* @__PURE__ */ f("button", {
						type: "button",
						onClick: S,
						disabled: h,
						className: "flex cursor-pointer items-center gap-2 text-sm text-[var(--accent)] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50",
						children: [h ? /* @__PURE__ */ d(pt, { className: "size-4 animate-spin" }) : /* @__PURE__ */ d(mt, { className: "size-4" }), e("settings.weather.useCurrentLocation")]
					})
				})]
			})] }),
			/* @__PURE__ */ f("div", { children: [/* @__PURE__ */ d("h3", {
				className: "text-[13px] font-semibold text-fg-primary mb-2",
				children: e("settings.weather.yourCities")
			}), /* @__PURE__ */ d("div", {
				className: "rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.03]",
				children: t.cities.length === 0 ? /* @__PURE__ */ d("div", {
					className: "px-4 py-8 text-center text-sm text-fg-muted",
					children: e("settings.weather.noCities")
				}) : /* @__PURE__ */ d("div", {
					className: "divide-y divide-black/[0.04] dark:divide-white/[0.06]",
					children: t.cities.map((n, r) => /* @__PURE__ */ f("div", {
						className: "flex items-center gap-3 px-4 py-3.5",
						children: [
							/* @__PURE__ */ d(Y, { className: "size-4 shrink-0 text-fg-muted" }),
							/* @__PURE__ */ f("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ d("div", {
									className: "truncate text-sm font-medium text-fg-primary leading-tight",
									children: n.name || `${n.lat.toFixed(2)}, ${n.lon.toFixed(2)}`
								}), /* @__PURE__ */ d("div", {
									className: "text-xs text-fg-muted mt-0.5",
									children: n.country
								})]
							}),
							/* @__PURE__ */ f("div", {
								className: "flex items-center gap-1 shrink-0",
								children: [r === t.primaryIndex ? /* @__PURE__ */ f("span", {
									className: "flex items-center gap-1 rounded-full bg-[var(--accent)]/10 px-2 py-0.5 text-xs font-medium text-[var(--accent)]",
									children: [/* @__PURE__ */ d(_t, { className: "size-3 fill-current" }), e("settings.weather.default")]
								}) : /* @__PURE__ */ d("button", {
									type: "button",
									onClick: () => x(r),
									title: e("settings.weather.setAsDefault"),
									className: "cursor-pointer rounded-full p-1.5 text-fg-muted transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-fg-primary",
									children: /* @__PURE__ */ d(_t, { className: "size-3.5" })
								}), /* @__PURE__ */ d("button", {
									type: "button",
									onClick: () => b(r),
									title: e("settings.weather.removeCity"),
									className: "cursor-pointer rounded-full p-1.5 text-fg-muted transition-colors hover:bg-red-500/10 hover:text-red-500",
									children: /* @__PURE__ */ d(xt, { className: "size-3.5" })
								})]
							})
						]
					}, `${n.lat}-${n.lon}`))
				})
			})] }),
			/* @__PURE__ */ d("p", {
				className: "text-xs text-fg-muted leading-relaxed",
				children: e("settings.weather.description")
			})
		]
	});
}
//#endregion
//#region src/pages/index.tsx
function nn() {
	let { settings: e } = en(), [t, n] = l(e.primaryIndex), [r, i] = l(!1);
	s(() => {
		e.cities.length > 0 && t >= e.cities.length && n(Math.max(0, e.cities.length - 1));
	}, [e.cities.length, t]), s(() => {
		n(e.primaryIndex);
	}, [e.primaryIndex]);
	let a = e.cities[t] ?? null, o = e.cities.length > 0, { data: c, isLoading: p, error: m, refetch: h } = Qe({
		queryKey: [
			"weather",
			a?.lat,
			a?.lon
		],
		queryFn: async () => {
			if (!a) throw Error("No city selected");
			let e = await fetch(`/api/apps/weather/weather?lat=${a.lat}&lon=${a.lon}`);
			if (!e.ok) throw Error("Failed to fetch weather");
			return e.json();
		},
		enabled: !!a,
		refetchInterval: 3e5,
		retry: 1
	}), _ = a?.name || c?.location.name || "", v = c?.current.weatherCode ?? 0, y = c ? !c.current.isDay : !1;
	return r ? /* @__PURE__ */ f("div", {
		className: "relative flex h-full flex-col overflow-hidden bg-[#1c1c1e]",
		children: [/* @__PURE__ */ f("div", {
			className: "flex items-center gap-2 px-4 pt-12 pb-2",
			children: [/* @__PURE__ */ d("button", {
				type: "button",
				onClick: () => i(!1),
				className: "cursor-pointer rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white",
				children: /* @__PURE__ */ d(Ct, { className: "size-4" })
			}), /* @__PURE__ */ d("h2", {
				className: "text-sm font-semibold text-white",
				children: "Weather Settings"
			})]
		}), /* @__PURE__ */ d(g, {
			direction: "vertical",
			className: "flex-1 px-4 pb-4",
			children: /* @__PURE__ */ d(tn, {})
		})]
	}) : /* @__PURE__ */ f("div", {
		className: "relative flex h-full select-none flex-col overflow-hidden",
		children: [
			/* @__PURE__ */ d(Mt, {
				weatherCode: v,
				isNight: y
			}),
			/* @__PURE__ */ d("div", {
				className: "relative z-20 flex items-center px-4 pt-12 pb-1",
				children: /* @__PURE__ */ d("button", {
					type: "button",
					onClick: () => i(!0),
					className: "cursor-pointer rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white",
					title: "Weather Settings",
					children: /* @__PURE__ */ d(gt, { className: "size-4" })
				})
			}),
			/* @__PURE__ */ d(g, {
				direction: "vertical",
				hideScrollbar: !0,
				className: "relative z-10 flex-1 px-4 pb-16",
				children: p ? /* @__PURE__ */ d("div", {
					className: "flex h-60 items-center justify-center",
					children: /* @__PURE__ */ d("div", { className: "size-6 animate-spin rounded-full border-2 border-white/40 border-t-white" })
				}) : m ? /* @__PURE__ */ f("div", {
					className: "mt-20 text-center text-white/80",
					children: [/* @__PURE__ */ d("p", {
						className: "text-sm",
						children: m instanceof Error ? m.message : "Failed to load weather"
					}), /* @__PURE__ */ d("button", {
						type: "button",
						onClick: () => h(),
						className: "mt-3 cursor-pointer rounded-lg bg-white/20 px-4 py-1.5 text-sm text-white transition-colors hover:bg-white/30",
						children: "Retry"
					})]
				}) : c ? /* @__PURE__ */ f(u, { children: [
					/* @__PURE__ */ d(Nt, {
						current: c.current,
						location: {
							...c.location,
							name: _
						}
					}),
					/* @__PURE__ */ d(Jt, {
						hourly: c.hourly,
						timezoneOffset: c.location.timezoneOffset
					}),
					/* @__PURE__ */ d(It, { daily: c.daily }),
					/* @__PURE__ */ d(Bt, {
						current: c.current,
						sunrise: c.current.sunrise,
						sunset: c.current.sunset,
						timezoneOffset: c.location.timezoneOffset
					}),
					c.airQuality && /* @__PURE__ */ d(wt, { aq: c.airQuality })
				] }) : /* @__PURE__ */ d("div", {
					className: "flex h-60 flex-col items-center justify-center gap-3 text-white/60",
					children: !o && /* @__PURE__ */ f(u, { children: [
						/* @__PURE__ */ d(Y, { className: "size-8 text-white/30" }),
						/* @__PURE__ */ d("p", {
							className: "text-sm",
							children: "Add a city to see weather"
						}),
						/* @__PURE__ */ d("button", {
							type: "button",
							onClick: () => i(!0),
							className: "cursor-pointer rounded-lg bg-white/20 px-4 py-2 text-sm text-white transition-colors hover:bg-white/30",
							children: "Open Settings"
						})
					] })
				})
			}),
			o && /* @__PURE__ */ d("div", {
				className: "absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-1",
				children: e.cities.map((e, r) => /* @__PURE__ */ d("button", {
					type: "button",
					onClick: () => n(r),
					className: "cursor-pointer p-1.5",
					title: e.name,
					children: /* @__PURE__ */ d("span", { className: `block rounded-full transition-all duration-200 ${r === t ? "size-2 bg-white" : "size-1.5 bg-white/40 hover:bg-white/60"}` })
				}, `${e.lat}-${e.lon}`))
			})
		]
	});
}
//#endregion
//#region src/index.tsx
var rn = p({
	id: "weather",
	manifest: {
		id: "weather",
		appName: "Weather",
		icon: "CloudSun",
		color: "#38bdf8",
		windowType: "weather",
		defaultSize: {
			width: 420,
			height: 740
		},
		category: "app",
		fullBleed: !0,
		titleBarStyle: "overlay",
		singleton: !0
	},
	mount(e, n) {
		let r = new Fe({ defaultOptions: { queries: {
			retry: 1,
			staleTime: 3e4
		} } }), i = n.locale.startsWith("zh") ? y : v, a = m({
			"zh-CN": et,
			"en-US": $e
		}, n.locale), o = b(e);
		return o.render(/* @__PURE__ */ d(t, { children: /* @__PURE__ */ d(Zt, {
			value: a,
			children: /* @__PURE__ */ d(Re, {
				client: r,
				children: /* @__PURE__ */ d(h, {
					locale: i,
					children: /* @__PURE__ */ d(_, { children: /* @__PURE__ */ d(nn, {}) })
				})
			})
		}) })), () => o.unmount();
	}
});
//#endregion
export { rn as default };
