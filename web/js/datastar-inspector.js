function Fa(e) {
  return e instanceof HTMLElement || e instanceof SVGElement ? e : null;
}
function Qt() {
  throw new Error("Cycle detected");
}
function Ci() {
  throw new Error("Computed cannot have side-effects");
}
const Ni = Symbol.for("preact-signals"), le = 1, $e = 2, ct = 4, Ve = 8, Je = 16, Ae = 32;
function jt() {
  et++;
}
function Xt() {
  if (et > 1) {
    et--;
    return;
  }
  let e, t = !1;
  for (; Ze !== void 0; ) {
    let n = Ze;
    for (Ze = void 0, Rn++; n !== void 0; ) {
      const r = n._nextBatchedEffect;
      if (n._nextBatchedEffect = void 0, n._flags &= ~$e, !(n._flags & Ve) && qa(n))
        try {
          n._callback();
        } catch (s) {
          t || (e = s, t = !0);
        }
      n = r;
    }
  }
  if (Rn = 0, et--, t)
    throw e;
}
function Ii(e) {
  if (et > 0)
    return e();
  jt();
  try {
    return e();
  } finally {
    Xt();
  }
}
let M, Ze, et = 0, Rn = 0, Yt = 0;
function $a(e) {
  if (M === void 0)
    return;
  let t = e._node;
  if (t === void 0 || t._target !== M)
    return t = {
      _version: 0,
      _source: e,
      _prevSource: M._sources,
      _nextSource: void 0,
      _target: M,
      _prevTarget: void 0,
      _nextTarget: void 0,
      _rollbackNode: t
    }, M._sources !== void 0 && (M._sources._nextSource = t), M._sources = t, e._node = t, M._flags & Ae && e._subscribe(t), t;
  if (t._version === -1)
    return t._version = 0, t._nextSource !== void 0 && (t._nextSource._prevSource = t._prevSource, t._prevSource !== void 0 && (t._prevSource._nextSource = t._nextSource), t._prevSource = M._sources, t._nextSource = void 0, M._sources._nextSource = t, M._sources = t), t;
}
function Y(e) {
  this._value = e, this._version = 0, this._node = void 0, this._targets = void 0;
}
Y.prototype.brand = Ni;
Y.prototype._refresh = function() {
  return !0;
};
Y.prototype._subscribe = function(e) {
  this._targets !== e && e._prevTarget === void 0 && (e._nextTarget = this._targets, this._targets !== void 0 && (this._targets._prevTarget = e), this._targets = e);
};
Y.prototype._unsubscribe = function(e) {
  if (this._targets !== void 0) {
    const t = e._prevTarget, n = e._nextTarget;
    t !== void 0 && (t._nextTarget = n, e._prevTarget = void 0), n !== void 0 && (n._prevTarget = t, e._nextTarget = void 0), e === this._targets && (this._targets = n);
  }
};
Y.prototype.subscribe = function(e) {
  const t = this;
  return Ga(function() {
    const n = t.value, r = this._flags & Ae;
    this._flags &= ~Ae;
    try {
      e(n);
    } finally {
      this._flags |= r;
    }
  });
};
Y.prototype.valueOf = function() {
  return this.value;
};
Y.prototype.toString = function() {
  return this.value + "";
};
Y.prototype.toJSON = function() {
  return this.value;
};
Y.prototype.peek = function() {
  return this._value;
};
Object.defineProperty(Y.prototype, "value", {
  get() {
    const e = $a(this);
    return e !== void 0 && (e._version = this._version), this._value;
  },
  set(e) {
    if (M instanceof me && Ci(), e !== this._value) {
      Rn > 100 && Qt(), this._value = e, this._version++, Yt++, jt();
      try {
        for (let t = this._targets; t !== void 0; t = t._nextTarget)
          t._target._notify();
      } finally {
        Xt();
      }
    }
  }
});
function Ya(e) {
  return new Y(e);
}
function qa(e) {
  for (let t = e._sources; t !== void 0; t = t._nextSource)
    if (t._source._version !== t._version || !t._source._refresh() || t._source._version !== t._version)
      return !0;
  return !1;
}
function za(e) {
  for (let t = e._sources; t !== void 0; t = t._nextSource) {
    const n = t._source._node;
    if (n !== void 0 && (t._rollbackNode = n), t._source._node = t, t._version = -1, t._nextSource === void 0) {
      e._sources = t;
      break;
    }
  }
}
function Wa(e) {
  let t = e._sources, n;
  for (; t !== void 0; ) {
    const r = t._prevSource;
    t._version === -1 ? (t._source._unsubscribe(t), r !== void 0 && (r._nextSource = t._nextSource), t._nextSource !== void 0 && (t._nextSource._prevSource = r)) : n = t, t._source._node = t._rollbackNode, t._rollbackNode !== void 0 && (t._rollbackNode = void 0), t = r;
  }
  e._sources = n;
}
function me(e) {
  Y.call(this, void 0), this._compute = e, this._sources = void 0, this._globalVersion = Yt - 1, this._flags = ct;
}
me.prototype = new Y();
me.prototype._refresh = function() {
  if (this._flags &= ~$e, this._flags & le)
    return !1;
  if ((this._flags & (ct | Ae)) === Ae || (this._flags &= ~ct, this._globalVersion === Yt))
    return !0;
  if (this._globalVersion = Yt, this._flags |= le, this._version > 0 && !qa(this))
    return this._flags &= ~le, !0;
  const e = M;
  try {
    za(this), M = this;
    const t = this._compute();
    (this._flags & Je || this._value !== t || this._version === 0) && (this._value = t, this._flags &= ~Je, this._version++);
  } catch (t) {
    this._value = t, this._flags |= Je, this._version++;
  }
  return M = e, Wa(this), this._flags &= ~le, !0;
};
me.prototype._subscribe = function(e) {
  if (this._targets === void 0) {
    this._flags |= ct | Ae;
    for (let t = this._sources; t !== void 0; t = t._nextSource)
      t._source._subscribe(t);
  }
  Y.prototype._subscribe.call(this, e);
};
me.prototype._unsubscribe = function(e) {
  if (this._targets !== void 0 && (Y.prototype._unsubscribe.call(this, e), this._targets === void 0)) {
    this._flags &= ~Ae;
    for (let t = this._sources; t !== void 0; t = t._nextSource)
      t._source._unsubscribe(t);
  }
};
me.prototype._notify = function() {
  if (!(this._flags & $e)) {
    this._flags |= ct | $e;
    for (let e = this._targets; e !== void 0; e = e._nextTarget)
      e._target._notify();
  }
};
me.prototype.peek = function() {
  if (this._refresh() || Qt(), this._flags & Je)
    throw this._value;
  return this._value;
};
Object.defineProperty(me.prototype, "value", {
  get() {
    this._flags & le && Qt();
    const e = $a(this);
    if (this._refresh(), e !== void 0 && (e._version = this._version), this._flags & Je)
      throw this._value;
    return this._value;
  }
});
function xi(e) {
  return new me(e);
}
function Va(e) {
  const t = e._cleanup;
  if (e._cleanup = void 0, typeof t == "function") {
    jt();
    const n = M;
    M = void 0;
    try {
      t();
    } catch (r) {
      throw e._flags &= ~le, e._flags |= Ve, jn(e), r;
    } finally {
      M = n, Xt();
    }
  }
}
function jn(e) {
  for (let t = e._sources; t !== void 0; t = t._nextSource)
    t._source._unsubscribe(t);
  e._compute = void 0, e._sources = void 0, Va(e);
}
function Si(e) {
  if (M !== this)
    throw new Error("Out-of-order effect");
  Wa(this), M = e, this._flags &= ~le, this._flags & Ve && jn(this), Xt();
}
function Et(e) {
  this._compute = e, this._cleanup = void 0, this._sources = void 0, this._nextBatchedEffect = void 0, this._flags = Ae;
}
Et.prototype._callback = function() {
  const e = this._start();
  try {
    if (this._flags & Ve || this._compute === void 0)
      return;
    const t = this._compute();
    typeof t == "function" && (this._cleanup = t);
  } finally {
    e();
  }
};
Et.prototype._start = function() {
  this._flags & le && Qt(), this._flags |= le, this._flags &= ~Ve, Va(this), za(this), jt();
  const e = M;
  return M = this, Si.bind(this, e);
};
Et.prototype._notify = function() {
  this._flags & $e || (this._flags |= $e, this._nextBatchedEffect = Ze, Ze = this);
};
Et.prototype._dispose = function() {
  this._flags |= Ve, this._flags & le || jn(this);
};
function Ga(e) {
  const t = new Et(e);
  try {
    t._callback();
  } catch (n) {
    throw t._dispose(), n;
  }
  return t._dispose.bind(t);
}
class Qa {
  get value() {
    return Ln(this);
  }
  set value(t) {
    Ii(() => wi(this, t));
  }
  peek() {
    return Ln(this, { peek: !0 });
  }
}
const Dt = (e) => Object.assign(
  new Qa(),
  Object.entries(e).reduce(
    (t, [n, r]) => {
      if (["value", "peek"].some((s) => s === n))
        throw new Error(`${n} is a reserved property name`);
      return typeof r != "object" || r === null || Array.isArray(r) ? t[n] = Ya(r) : t[n] = Dt(r), t;
    },
    {}
  )
), wi = (e, t) => Object.keys(t).forEach((n) => e[n].value = t[n]), Ln = (e, { peek: t = !1 } = {}) => Object.entries(e).reduce(
  (n, [r, s]) => (s instanceof Y ? n[r] = t ? s.peek() : s.value : s instanceof Qa && (n[r] = Ln(s, { peek: t })), n),
  {}
);
function ja(e, t) {
  if (typeof t != "object" || Array.isArray(t) || !t)
    return t;
  if (typeof t == "object" && t.toJSON !== void 0 && typeof t.toJSON == "function")
    return t.toJSON();
  let n = e;
  return typeof e != "object" && (n = { ...t }), Object.keys(t).forEach((r) => {
    n.hasOwnProperty(r) || (n[r] = t[r]), t[r] === null ? delete n[r] : n[r] = ja(n[r], t[r]);
  }), n;
}
const Me = "datastar-event", Xa = "[a-zA-Z_$]+", Ri = Xa + "[0-9a-zA-Z_$.]*";
function Xn(e, t, n, r = !0) {
  const s = r ? Ri : Xa;
  return new RegExp(`(?<whole>\\${e}(?<${t}>${s})${n})`, "g");
}
const Li = {
  regexp: Xn("$", "signal", "(?<method>\\([^\\)]*\\))?"),
  replacer: (e) => {
    const { signal: t, method: n } = e, r = "ctx.store()";
    if (!n?.length)
      return `${r}.${t}.value`;
    const s = t.split("."), i = s.pop(), u = s.join(".");
    return `${r}.${u}.value.${i}${n}`;
  }
}, vi = {
  regexp: Xn("$\\$", "action", "(?<call>\\((?<args>.*)\\))?"),
  replacer: ({ action: e, args: t }) => {
    const n = ["ctx"];
    t && n.push(...t.split(",").map((s) => s.trim()));
    const r = n.join(",");
    return `ctx.actions.${e}(${r})`;
  }
}, Oi = {
  regexp: Xn("~", "ref", "", !1),
  replacer({ ref: e }) {
    return `document.querySelector(ctx.store()._dsPlugins.refs.${e})`;
  }
}, ki = [vi, Li, Oi], Di = {
  prefix: "store",
  removeNewLines: !0,
  preprocessors: {
    pre: [
      {
        regexp: /(?<whole>.+)/g,
        replacer: (e) => {
          const { whole: t } = e;
          return `Object.assign({...ctx.store()}, ${t})`;
        }
      }
    ]
  },
  allowedModifiers: /* @__PURE__ */ new Set(["local", "session", "ifmissing"]),
  onLoad: (e) => {
    let t = "";
    const n = (d) => {
      const f = e.store(), p = JSON.stringify(f);
      p !== t && (window.localStorage.setItem(Ue, p), t = p);
    }, r = e.modifiers.has("local");
    if (r) {
      window.addEventListener(Me, n);
      const d = window.localStorage.getItem(Ue) || "{}", f = JSON.parse(d);
      e.mergeStore(f);
    }
    const s = e.modifiers.has("session"), i = (d) => {
      const f = e.store(), p = JSON.stringify(f);
      window.sessionStorage.setItem(Ue, p);
    };
    if (s) {
      window.addEventListener(Me, i);
      const d = window.sessionStorage.getItem(Ue) || "{}", f = JSON.parse(d);
      e.mergeStore(f);
    }
    const u = e.expressionFn(e), c = Ja(e.store(), u, e.modifiers.has("ifmissing"));
    return e.mergeStore(c), delete e.el.dataset[e.rawKey], () => {
      r && window.removeEventListener(Me, n), s && window.removeEventListener(Me, i);
    };
  }
}, Pi = {
  prefix: "computed",
  mustNotEmptyKey: !0,
  onLoad: (e) => {
    const t = e.store();
    return t[e.key] = e.reactivity.computed(() => e.expressionFn(e)), () => {
      const n = e.store();
      delete n[e.key];
    };
  }
}, Mi = {
  prefix: "ref",
  mustHaveEmptyKey: !0,
  mustNotEmptyExpression: !0,
  bypassExpressionFunctionCreation: () => !0,
  onLoad: (e) => {
    e.upsertIfMissingFromStore("_dsPlugins.refs", {});
    const { el: t, expression: n } = e, r = {
      _dsPlugins: {
        refs: {
          ...e.store()._dsPlugins.refs.value,
          [n]: Ka(t)
        }
      }
    };
    return e.mergeStore(r), () => {
      const s = e.store(), i = { ...s._dsPlugins.refs.value };
      delete i[n], s._dsPlugins.refs = i;
    };
  }
}, Ui = [Di, Pi, Mi];
function Ka(e) {
  if (!e)
    return "null";
  if (typeof e == "string")
    return e;
  if (e instanceof Window)
    return "Window";
  if (e instanceof Document)
    return "Document";
  if (e.tagName === "BODY")
    return "BODY";
  const t = [];
  for (; e.parentElement && e.tagName !== "BODY"; ) {
    if (e.id) {
      t.unshift("#" + e.getAttribute("id"));
      break;
    } else {
      let n = 1, r = e;
      for (; r.previousElementSibling; r = r.previousElementSibling, n++)
        ;
      t.unshift(e.tagName + ":nth-child(" + n + ")");
    }
    e = e.parentElement;
  }
  return t.join(">");
}
function Ja(e, t, n) {
  const r = {};
  if (!n)
    Object.assign(r, t);
  else
    for (const s in t)
      e[s]?.value == null && (r[s] = t[s]);
  return r;
}
const Ue = "datastar", ne = `${Ue}-`;
class Bi {
  constructor(t = {}, ...n) {
    if (this.plugins = [], this.store = Dt({ _dsPlugins: {} }), this.actions = {}, this.refs = {}, this.reactivity = {
      signal: Ya,
      computed: xi,
      effect: Ga
    }, this.parentID = "", this.missingIDNext = 0, this.removals = /* @__PURE__ */ new Map(), this.mergeRemovals = new Array(), this.actions = Object.assign(this.actions, t), n = [...Ui, ...n], !n.length)
      throw new Error("No plugins provided");
    const r = /* @__PURE__ */ new Set();
    for (const s of n) {
      if (s.requiredPluginPrefixes) {
        for (const i of s.requiredPluginPrefixes)
          if (!r.has(i))
            throw new Error(`${s.prefix} requires ${i}`);
      }
      this.plugins.push(s), r.add(s.prefix);
    }
  }
  run() {
    new MutationObserver((t, n) => {
      Z("core", "dom", "mutation", document.body, document.body.outerHTML);
    }).observe(document.body, {
      attributes: !0,
      childList: !0,
      subtree: !0
    }), this.plugins.forEach((t) => {
      t.onGlobalInit && (t.onGlobalInit({
        actions: this.actions,
        reactivity: this.reactivity,
        mergeStore: this.mergeStore.bind(this),
        store: this.store
      }), Z("core", "plugins", "registration", "BODY", `On prefix ${t.prefix}`));
    }), this.applyPlugins(document.body);
  }
  cleanupElementRemovals(t) {
    const n = this.removals.get(t);
    if (n) {
      for (const r of n.set)
        r();
      this.removals.delete(t);
    }
  }
  mergeStore(t) {
    this.mergeRemovals.forEach((r) => r()), this.mergeRemovals = this.mergeRemovals.slice(0);
    const n = ja(this.store.value, t);
    this.store = Dt(n), this.mergeRemovals.push(
      this.reactivity.effect(() => {
        Z("core", "store", "merged", "STORE", JSON.stringify(this.store.value));
      })
    );
  }
  removeFromStore(...t) {
    const n = { ...this.store.value };
    for (const r of t) {
      const s = r.split(".");
      let i = s[0], u = n;
      for (let c = 1; c < s.length; c++) {
        const d = s[c];
        u[i] || (u[i] = {}), u = u[i], i = d;
      }
      delete u[i];
    }
    this.store = Dt(n), this.applyPlugins(document.body);
  }
  upsertIfMissingFromStore(t, n) {
    const r = t.split(".");
    let s = this.store;
    for (let u = 0; u < r.length - 1; u++) {
      const c = r[u];
      s[c] || (s[c] = {}), s = s[c];
    }
    const i = r[r.length - 1];
    s[i] || (s[i] = this.reactivity.signal(n), Z("core", "store", "upsert", t, n));
  }
  signalByName(t) {
    return this.store[t];
  }
  applyPlugins(t) {
    const n = /* @__PURE__ */ new Set();
    this.plugins.forEach((r, s) => {
      this.walkDownDOM(t, (i) => {
        s || this.cleanupElementRemovals(i);
        for (const u in i.dataset) {
          const c = i.dataset[u] || "";
          let d = c;
          if (!u.startsWith(r.prefix))
            continue;
          if (i.id.length === 0 && (i.id = `ds-${this.parentID}-${this.missingIDNext++}`), n.clear(), r.allowedTagRegexps) {
            const S = i.tagName.toLowerCase();
            if (![...r.allowedTagRegexps].some((v) => S.match(v)))
              throw new Error(
                `'${i.tagName}' not allowed for '${u}', allowed ${[
                  [...r.allowedTagRegexps].map((v) => `'${v}'`)
                ].join(", ")}`
              );
          }
          let f = u.slice(r.prefix.length), [p, ...b] = f.split(".");
          if (r.mustHaveEmptyKey && p.length > 0)
            throw new Error(`'${u}' must have empty key`);
          if (r.mustNotEmptyKey && p.length === 0)
            throw new Error(`'${u}' must have non-empty key`);
          p.length && (p = p[0].toLowerCase() + p.slice(1));
          const y = b.map((S) => {
            const [v, ...w] = S.split("_");
            return { label: v, args: w };
          });
          if (r.allowedModifiers) {
            for (const S of y)
              if (!r.allowedModifiers.has(S.label))
                throw new Error(`'${S.label}' is not allowed`);
          }
          const T = /* @__PURE__ */ new Map();
          for (const S of y)
            T.set(S.label, S.args);
          if (r.mustHaveEmptyExpression && d.length)
            throw new Error(`'${u}' must have empty expression`);
          if (r.mustNotEmptyExpression && !d.length)
            throw new Error(`'${u}' must have non-empty expression`);
          const C = /;|\n/;
          r.removeNewLines && (d = d.split(`
`).map((S) => S.trim()).join(" "));
          const N = [...r.preprocessors?.pre || [], ...ki, ...r.preprocessors?.post || []];
          for (const S of N) {
            if (n.has(S))
              continue;
            n.add(S);
            const v = d.split(C), w = [];
            v.forEach((R) => {
              let k = R;
              const q = [...k.matchAll(S.regexp)];
              if (q.length)
                for (const te of q) {
                  if (!te.groups)
                    continue;
                  const { groups: ae } = te, { whole: he } = ae;
                  k = k.replace(he, S.replacer(ae));
                }
              w.push(k);
            }), d = w.join("; ");
          }
          const I = {
            store: () => this.store,
            mergeStore: this.mergeStore.bind(this),
            upsertIfMissingFromStore: this.upsertIfMissingFromStore.bind(this),
            removeFromStore: this.removeFromStore.bind(this),
            applyPlugins: this.applyPlugins.bind(this),
            cleanupElementRemovals: this.cleanupElementRemovals.bind(this),
            walkSignals: this.walkSignals.bind(this),
            actions: this.actions,
            reactivity: this.reactivity,
            el: i,
            rawKey: u,
            key: p,
            rawExpression: c,
            expression: d,
            expressionFn: () => {
              throw new Error("Expression function not created");
            },
            modifiers: T,
            sendDatastarEvent: Z
          };
          if (!r.bypassExpressionFunctionCreation?.(I) && !r.mustHaveEmptyExpression && d.length) {
            const S = d.split(C).map((R) => R.trim()).filter((R) => R.length);
            S[S.length - 1] = `return ${S[S.length - 1]}`;
            const v = S.map((R) => `  ${R}`).join(`;
`), w = `
try {
  const _datastarExpression = () => {
${v}
  }
  const _datastarReturnVal = _datastarExpression()
  ctx.sendDatastarEvent('core', 'attributes', 'expr_eval', ctx.el, '${u} equals ' + JSON.stringify(_datastarReturnVal))
  return _datastarReturnVal
} catch (e) {
 const msg = \`
Error evaluating Datastar expression:
${v.replaceAll("`", "\\`")}

Error: \${e.message}

Check if the expression is valid before raising an issue.
\`.trim()
 ctx.sendDatastarEvent('core', 'attributes', 'expr_eval_err', ctx.el, msg)
 console.error(msg)
 debugger
}
            `;
            try {
              const R = r.argumentNames || [], k = new Function("ctx", ...R, w);
              I.expressionFn = k;
            } catch (R) {
              const k = new Error(`Error creating expression function for '${w}', error: ${R}`);
              Z("core", "attributes", "expr_construction_err", I.el, String(k)), console.error(k);
              debugger;
            }
          }
          const x = r.onLoad(I);
          x && (this.removals.has(i) || this.removals.set(i, { id: i.id, set: /* @__PURE__ */ new Set() }), this.removals.get(i).set.add(x));
        }
      });
    });
  }
  walkSignalsStore(t, n) {
    const r = Object.keys(t);
    for (let s = 0; s < r.length; s++) {
      const i = r[s], u = t[i], c = u instanceof Y, d = typeof u == "object" && Object.keys(u).length > 0;
      if (c) {
        n(i, u);
        continue;
      }
      d && this.walkSignalsStore(u, n);
    }
  }
  walkSignals(t) {
    this.walkSignalsStore(this.store, t);
  }
  walkDownDOM(t, n, r = 0) {
    if (!t)
      return;
    const s = Fa(t);
    if (s)
      for (n(s), r = 0, t = t.firstElementChild; t; )
        this.walkDownDOM(t, n, r++), t = t.nextElementSibling;
  }
}
const Za = (e) => e.replace(/[A-Z]+(?![a-z])|[A-Z]/g, (t, n) => (n ? "-" : "") + t.toLowerCase()), Hi = {
  prefix: "bind",
  mustNotEmptyKey: !0,
  mustNotEmptyExpression: !0,
  onLoad: (e) => e.reactivity.effect(async () => {
    const t = Za(e.key), n = e.expressionFn(e);
    let r;
    typeof n == "string" ? r = n : r = JSON.stringify(n), !r || r === "false" || r === "null" || r === "undefined" ? e.el.removeAttribute(t) : e.el.setAttribute(t, r);
  })
}, Fi = /^data:(?<mime>[^;]+);base64,(?<contents>.*)$/, It = ["change", "input", "keydown"], $i = {
  prefix: "model",
  mustHaveEmptyKey: !0,
  preprocessors: {
    post: [
      {
        regexp: /(?<whole>.+)/g,
        replacer: (e) => {
          const { whole: t } = e;
          return `ctx.store().${t}`;
        }
      }
    ]
  },
  // bypassExpressionFunctionCreation: () => true,
  onLoad: (e) => {
    const { el: t, expression: n } = e, r = e.expressionFn(e), s = t.tagName.toLowerCase();
    if (n.startsWith("ctx.store().ctx.store()"))
      throw new Error(`Model attribute on #${t.id} must have a signal name, you probably prefixed with $ by accident`);
    const i = s.includes("input"), u = t.getAttribute("type"), c = s.includes("checkbox") || i && u === "checkbox", d = s.includes("select"), f = s.includes("radio") || i && u === "radio", p = i && u === "file", b = n.replaceAll("ctx.store().", "");
    f && (t.getAttribute("name")?.length || t.setAttribute("name", b));
    const y = () => {
      if (!r)
        throw new Error(`Signal ${b} not found`);
      const I = "value" in t, x = r.value;
      if (c || f) {
        const S = t;
        c ? S.checked = x : f && (S.checked = `${x}` === S.value);
      } else if (!p)
        if (d) {
          const S = t;
          if (S.multiple) {
            const v = r.value;
            Array.from(S.options).forEach((w) => {
              w?.disabled || (w.selected = v.includes(w.value));
            });
          } else
            S.value = `${x}`;
        } else
          I ? t.value = `${x}` : t.setAttribute("value", `${x}`);
    }, T = e.reactivity.effect(y), C = async () => {
      if (p) {
        const S = [...t?.files || []], v = [], w = [], R = [];
        await Promise.all(
          S.map((ae) => new Promise((he) => {
            const oe = new FileReader();
            oe.onload = () => {
              if (typeof oe.result != "string")
                throw new Error(`Invalid result type: ${typeof oe.result}`);
              const ke = oe.result.match(Fi);
              if (!ke?.groups)
                throw new Error(`Invalid data URI: ${oe.result}`);
              v.push(ke.groups.contents), w.push(ke.groups.mime), R.push(ae.name);
            }, oe.onloadend = () => he(void 0), oe.readAsDataURL(ae);
          }))
        ), r.value = v;
        const k = e.store(), q = `${b}Mimes`, te = `${b}Names`;
        q in k && (k[`${q}`].value = w), te in k && (k[`${te}`].value = R);
        return;
      }
      const I = r.value, x = t || t;
      if (typeof I == "number")
        r.value = Number(x.value || x.getAttribute("value"));
      else if (typeof I == "string")
        r.value = x.value || x.getAttribute("value") || "";
      else if (typeof I == "boolean")
        c ? r.value = x.checked || x.getAttribute("checked") === "true" : r.value = !!(x.value || x.getAttribute("value"));
      else if (!(typeof I > "u"))
        if (typeof I == "bigint")
          r.value = BigInt(x.value || x.getAttribute("value") || "0");
        else if (Array.isArray(I)) {
          if (d) {
            const S = [...t.selectedOptions].map((v) => v.value);
            r.value = S;
          } else
            r.value = JSON.parse(x.value).split(",");
          console.log(x.value);
        } else
          throw console.log(typeof I), new Error(`Unsupported type ${typeof I} for signal ${b}`);
    }, N = t.tagName.split("-");
    if (N.length > 1) {
      const I = N[0].toLowerCase();
      It.forEach((x) => {
        It.push(`${I}-${x}`);
      });
    }
    return It.forEach((I) => t.addEventListener(I, C)), () => {
      T(), It.forEach((I) => t.removeEventListener(I, C));
    };
  }
}, Yi = {
  prefix: "text",
  mustHaveEmptyKey: !0,
  onLoad: (e) => {
    const { el: t, expressionFn: n } = e;
    if (!(t instanceof HTMLElement))
      throw new Error("Element is not HTMLElement");
    return e.reactivity.effect(() => {
      const r = n(e);
      t.textContent = `${r}`;
    });
  }
};
let Ar = "";
const qi = /* @__PURE__ */ new Set(["window", "once", "passive", "capture", "debounce", "throttle", "remote", "outside"]), zi = {
  prefix: "on",
  mustNotEmptyKey: !0,
  mustNotEmptyExpression: !0,
  argumentNames: ["evt"],
  onLoad: (e) => {
    const { el: t, key: n, expressionFn: r } = e;
    let s = e.el;
    e.modifiers.get("window") && (s = window);
    let i = (p) => {
      Z("plugin", "event", n, s, "triggered"), r(e, p);
    };
    const u = e.modifiers.get("debounce");
    if (u) {
      const p = vn(u), b = xt(u, "leading", !1), y = xt(u, "noTrail", !0);
      i = Qi(i, p, b, y);
    }
    const c = e.modifiers.get("throttle");
    if (c) {
      const p = vn(c), b = xt(c, "noLead", !0), y = xt(c, "noTrail", !1);
      i = ji(i, p, b, y);
    }
    const d = {
      capture: !0,
      passive: !1,
      once: !1
    };
    e.modifiers.has("capture") || (d.capture = !1), e.modifiers.has("passive") && (d.passive = !0), e.modifiers.has("once") && (d.once = !0), [...e.modifiers.keys()].filter((p) => !qi.has(p)).forEach((p) => {
      const b = e.modifiers.get(p) || [], y = i;
      i = () => {
        const T = event, C = T[p];
        let N;
        if (typeof C == "function")
          N = C(...b);
        else if (typeof C == "boolean")
          N = C;
        else if (typeof C == "string") {
          const I = C.toLowerCase().trim(), x = b.join("").toLowerCase().trim();
          N = I === x;
        } else {
          const I = `Invalid value for ${p} modifier on ${n} on ${t}`;
          console.error(I);
          debugger;
          throw new Error(I);
        }
        N && y(T);
      };
    });
    const f = Za(n).toLowerCase();
    switch (f) {
      case "load":
        return i(), delete e.el.dataset.onLoad, () => {
        };
      case "raf":
        let p;
        const b = () => {
          i(), p = requestAnimationFrame(b);
        };
        return p = requestAnimationFrame(b), () => {
          p && cancelAnimationFrame(p);
        };
      case "store-change":
        return e.reactivity.effect(() => {
          let y = e.store().value;
          e.modifiers.has("remote") && (y = gt(y));
          const T = JSON.stringify(y);
          Ar !== T && (Ar = T, i());
        });
      default:
        if (e.modifiers.has("outside")) {
          s = document;
          const y = i;
          let T = !1;
          i = (C) => {
            const N = C?.target;
            if (!N)
              return;
            const I = t.id === N.id;
            I && T && (T = !1), !I && !T && (y(C), T = !0);
          };
        }
        return s.addEventListener(f, i, d), () => {
          s.removeEventListener(f, i);
        };
    }
  }
};
function gt(e) {
  const t = {};
  for (const [n, r] of Object.entries(e))
    n.startsWith("_") || (typeof r == "object" && !Array.isArray(r) ? t[n] = gt(r) : t[n] = r);
  return t;
}
const Wi = {
  prefix: "class",
  mustHaveEmptyKey: !0,
  mustNotEmptyExpression: !0,
  onLoad: (e) => e.reactivity.effect(() => {
    const t = e.expressionFn(e);
    for (const [n, r] of Object.entries(t))
      r ? e.el.classList.add(n) : e.el.classList.remove(n);
    return () => {
      e.el.classList.remove(...Object.keys(t));
    };
  })
}, Vi = [
  Hi,
  $i,
  Yi,
  zi,
  Wi
], Gi = {
  remote: async (e) => gt(e.store().value)
};
function vn(e) {
  if (!e || e?.length === 0)
    return 0;
  for (const t of e) {
    if (t.endsWith("ms"))
      return Number(t.replace("ms", ""));
    if (t.endsWith("s"))
      return Number(t.replace("s", "")) * 1e3;
    try {
      return parseFloat(t);
    } catch {
    }
  }
  return 0;
}
function xt(e, t, n = !1) {
  return e ? e.includes(t) || n : !1;
}
function Qi(e, t, n = !1, r = !0) {
  let s;
  const i = () => s && clearTimeout(s);
  return function(...u) {
    i(), n && !s && e(...u), s = setTimeout(() => {
      r && e(...u), i();
    }, t);
  };
}
function ji(e, t, n = !0, r = !1) {
  let s = !1;
  return function(...i) {
    s || (n && e(...i), s = !0, setTimeout(() => {
      s = !1, r && e(...i);
    }, t));
  };
}
function Xi(e, {
  signal: t,
  headers: n,
  onopen: r,
  onmessage: s,
  onclose: i,
  onerror: u,
  openWhenHidden: c,
  ...d
}) {
  return new Promise((f, p) => {
    let b = 0;
    const y = { ...n };
    y.accept || (y.accept = On);
    let T;
    function C() {
      T.abort(), document.hidden || v();
    }
    c || document.addEventListener("visibilitychange", C);
    let N = yr, I = 0;
    function x() {
      document.removeEventListener("visibilitychange", C), window.clearTimeout(I), T.abort();
    }
    t?.addEventListener("abort", () => {
      x(), f();
    });
    const S = r ?? Zi;
    async function v() {
      T = new AbortController();
      try {
        const w = await fetch(e, {
          ...d,
          headers: y,
          signal: T.signal
        });
        await S(w), await eu(
          w.body,
          tu(
            nu(
              (R) => {
                R ? y[Cr] = R : delete y[Cr];
              },
              (R) => {
                N = R;
              },
              s
            )
          )
        ), i?.(), x(), f();
      } catch (w) {
        if (!T.signal.aborted)
          try {
            const R = u?.(w) ?? N;
            window.clearTimeout(I), I = window.setTimeout(v, R), N *= 1.5, N = Math.min(N, Ki), b++, b >= Ji ? (x(), p(new Error("Max retries hit, check your server or network connection."))) : console.error(`Error fetching event source, retrying in ${R}ms`);
          } catch (R) {
            x(), p(R);
          }
      }
    }
    N = yr, v();
  });
}
const On = "text/event-stream", yr = 100, Ki = 1e4, Ji = 10, Cr = "last-event-id";
function Zi(e) {
  const t = e.headers.get("content-type");
  if (!t?.startsWith(On))
    throw new Error(`Expected content-type to be ${On}, Actual: ${t}`);
}
async function eu(e, t) {
  const n = e.getReader();
  for (; ; ) {
    const r = await n.read();
    if (r.done)
      break;
    t(r.value);
  }
}
function tu(e) {
  let t, n, r, s = !1;
  return function(i) {
    t === void 0 ? (t = i, n = 0, r = -1) : t = ru(t, i);
    const u = t.length;
    let c = 0;
    for (; n < u; ) {
      s && (t[n] === 10 && (c = ++n), s = !1);
      let d = -1;
      for (; n < u && d === -1; ++n)
        switch (t[n]) {
          case 58:
            r === -1 && (r = n - c);
            break;
          case 13:
            s = !0;
          case 10:
            d = n;
            break;
        }
      if (d === -1)
        break;
      e(t.subarray(c, d), r), c = n, r = -1;
    }
    c === u ? t = void 0 : c !== 0 && (t = t.subarray(c), n -= c);
  };
}
function nu(e, t, n) {
  let r = Nr();
  const s = new TextDecoder();
  return function(i, u) {
    if (i.length === 0)
      n?.(r), r = Nr();
    else if (u > 0) {
      const c = s.decode(i.subarray(0, u)), d = u + (i[u + 1] === 32 ? 2 : 1), f = s.decode(i.subarray(d));
      switch (c) {
        case "data":
          r.data = r.data ? r.data + `
` + f : f;
          break;
        case "event":
          r.event = f;
          break;
        case "id":
          e(r.id = f);
          break;
        case "retry":
          const p = parseInt(f, 10);
          isNaN(p) || t(r.retry = p);
          break;
      }
    }
  };
}
function ru(e, t) {
  const n = new Uint8Array(e.length + t.length);
  return n.set(e), n.set(t, e.length), n;
}
function Nr() {
  return {
    data: "",
    event: "",
    id: "",
    retry: void 0
  };
}
const Pt = /* @__PURE__ */ new WeakSet();
function au(e, t, n = {}) {
  e instanceof Document && (e = e.documentElement);
  let r;
  typeof t == "string" ? r = cu(t) : r = t;
  const s = lu(r), i = iu(e, s, n);
  return es(e, s, i);
}
function es(e, t, n) {
  if (n.head.block) {
    const r = e.querySelector("head"), s = t.querySelector("head");
    if (r && s) {
      const i = ns(s, r, n);
      Promise.all(i).then(() => {
        es(
          e,
          t,
          Object.assign(n, {
            head: {
              block: !1,
              ignore: !0
            }
          })
        );
      });
      return;
    }
  }
  if (n.morphStyle === "innerHTML")
    return ts(t, e, n), e.children;
  if (n.morphStyle === "outerHTML" || n.morphStyle == null) {
    const r = hu(t, e, n);
    if (!r)
      throw new Error("Could not find best match");
    const s = r?.previousSibling, i = r?.nextSibling, u = Mt(e, r, n);
    return r ? du(s, u, i) : [];
  } else
    throw "Do not understand how to morph style " + n.morphStyle;
}
function Mt(e, t, n) {
  if (!(n.ignoreActive && e === document.activeElement))
    if (t == null) {
      if (n.callbacks.beforeNodeRemoved(e) === !1)
        return;
      e.remove(), n.callbacks.afterNodeRemoved(e);
      return;
    } else {
      if (qt(e, t))
        return n.callbacks.beforeNodeMorphed(e, t) === !1 ? void 0 : (e instanceof HTMLHeadElement && n.head.ignore || (t instanceof HTMLHeadElement && e instanceof HTMLHeadElement && n.head.style !== "morph" ? ns(t, e, n) : (su(t, e), ts(t, e, n))), n.callbacks.afterNodeMorphed(e, t), e);
      if (n.callbacks.beforeNodeRemoved(e) === !1 || n.callbacks.beforeNodeAdded(t) === !1)
        return;
      if (!e.parentElement)
        throw new Error("oldNode has no parentElement");
      return e.parentElement.replaceChild(t, e), n.callbacks.afterNodeAdded(t), n.callbacks.afterNodeRemoved(e), t;
    }
}
function ts(e, t, n) {
  let r = e.firstChild, s = t.firstChild, i;
  for (; r; ) {
    if (i = r, r = i.nextSibling, s == null) {
      if (n.callbacks.beforeNodeAdded(i) === !1)
        return;
      t.appendChild(i), n.callbacks.afterNodeAdded(i), Ne(n, i);
      continue;
    }
    if (rs(i, s, n)) {
      Mt(s, i, n), s = s.nextSibling, Ne(n, i);
      continue;
    }
    let u = uu(e, t, i, s, n);
    if (u) {
      s = Ir(s, u, n), Mt(u, i, n), Ne(n, i);
      continue;
    }
    let c = ou(e, i, s, n);
    if (c) {
      s = Ir(s, c, n), Mt(c, i, n), Ne(n, i);
      continue;
    }
    if (n.callbacks.beforeNodeAdded(i) === !1)
      return;
    t.insertBefore(i, s), n.callbacks.afterNodeAdded(i), Ne(n, i);
  }
  for (; s !== null; ) {
    let u = s;
    s = s.nextSibling, as(u, n);
  }
}
function su(e, t) {
  let n = e.nodeType;
  if (n === 1) {
    for (const r of e.attributes)
      t.getAttribute(r.name) !== r.value && t.setAttribute(r.name, r.value);
    for (const r of t.attributes)
      e.hasAttribute(r.name) || t.removeAttribute(r.name);
  }
  if ((n === Node.COMMENT_NODE || n === Node.TEXT_NODE) && t.nodeValue !== e.nodeValue && (t.nodeValue = e.nodeValue), e instanceof HTMLInputElement && t instanceof HTMLInputElement && e.type !== "file")
    t.value = e.value || "", St(e, t, "value"), St(e, t, "checked"), St(e, t, "disabled");
  else if (e instanceof HTMLOptionElement)
    St(e, t, "selected");
  else if (e instanceof HTMLTextAreaElement && t instanceof HTMLTextAreaElement) {
    const r = e.value, s = t.value;
    r !== s && (t.value = r), t.firstChild && t.firstChild.nodeValue !== r && (t.firstChild.nodeValue = r);
  }
}
function St(e, t, n) {
  const r = e.getAttribute(n), s = t.getAttribute(n);
  r !== s && (r ? t.setAttribute(n, r) : t.removeAttribute(n));
}
function ns(e, t, n) {
  const r = [], s = [], i = [], u = [], c = n.head.style, d = /* @__PURE__ */ new Map();
  for (const p of e.children)
    d.set(p.outerHTML, p);
  for (const p of t.children) {
    let b = d.has(p.outerHTML), y = n.head.shouldReAppend(p), T = n.head.shouldPreserve(p);
    b || T ? y ? s.push(p) : (d.delete(p.outerHTML), i.push(p)) : c === "append" ? y && (s.push(p), u.push(p)) : n.head.shouldRemove(p) !== !1 && s.push(p);
  }
  u.push(...d.values());
  const f = [];
  for (const p of u) {
    const b = document.createRange().createContextualFragment(p.outerHTML).firstChild;
    if (!b)
      throw new Error("could not create new element from: " + p.outerHTML);
    if (n.callbacks.beforeNodeAdded(b)) {
      if (b.hasAttribute("href") || b.hasAttribute("src")) {
        let y;
        const T = new Promise((C) => {
          y = C;
        });
        b.addEventListener("load", function() {
          y(void 0);
        }), f.push(T);
      }
      t.appendChild(b), n.callbacks.afterNodeAdded(b), r.push(b);
    }
  }
  for (const p of s)
    n.callbacks.beforeNodeRemoved(p) !== !1 && (t.removeChild(p), n.callbacks.afterNodeRemoved(p));
  return n.head.afterHeadMorphed(t, {
    added: r,
    kept: i,
    removed: s
  }), f;
}
function be() {
}
function iu(e, t, n) {
  return {
    target: e,
    newContent: t,
    config: n,
    morphStyle: n.morphStyle,
    ignoreActive: n.ignoreActive,
    idMap: bu(e, t),
    deadIds: /* @__PURE__ */ new Set(),
    callbacks: Object.assign(
      {
        beforeNodeAdded: be,
        afterNodeAdded: be,
        beforeNodeMorphed: be,
        afterNodeMorphed: be,
        beforeNodeRemoved: be,
        afterNodeRemoved: be
      },
      n.callbacks
    ),
    head: Object.assign(
      {
        style: "merge",
        shouldPreserve: (r) => r.getAttribute("im-preserve") === "true",
        shouldReAppend: (r) => r.getAttribute("im-re-append") === "true",
        shouldRemove: be,
        afterHeadMorphed: be
      },
      n.head
    )
  };
}
function rs(e, t, n) {
  return !e || !t ? !1 : e.nodeType === t.nodeType && e.tagName === t.tagName ? e?.id?.length && e.id === t.id ? !0 : lt(n, e, t) > 0 : !1;
}
function qt(e, t) {
  return !e || !t ? !1 : e.nodeType === t.nodeType && e.tagName === t.tagName;
}
function Ir(e, t, n) {
  for (; e !== t; ) {
    const r = e;
    if (e = e?.nextSibling, !r)
      throw new Error("tempNode is null");
    as(r, n);
  }
  return Ne(n, t), t.nextSibling;
}
function uu(e, t, n, r, s) {
  const i = lt(s, n, t);
  let u = null;
  if (i > 0) {
    u = r;
    let c = 0;
    for (; u != null; ) {
      if (rs(n, u, s))
        return u;
      if (c += lt(s, u, e), c > i)
        return null;
      u = u.nextSibling;
    }
  }
  return u;
}
function ou(e, t, n, r) {
  let s = n, i = t.nextSibling, u = 0;
  for (; s && i; ) {
    if (lt(r, s, e) > 0)
      return null;
    if (qt(t, s))
      return s;
    if (qt(i, s) && (u++, i = i.nextSibling, u >= 2))
      return null;
    s = s.nextSibling;
  }
  return s;
}
const xr = new DOMParser();
function cu(e) {
  const t = e.replace(/<svg(\s[^>]*>|>)([\s\S]*?)<\/svg>/gim, "");
  if (t.match(/<\/html>/) || t.match(/<\/head>/) || t.match(/<\/body>/)) {
    const n = xr.parseFromString(e, "text/html");
    if (t.match(/<\/html>/))
      return Pt.add(n), n;
    {
      let r = n.firstChild;
      return r ? (Pt.add(r), r) : null;
    }
  } else {
    const n = xr.parseFromString(`<body><template>${e}</template></body>`, "text/html").body.querySelector("template")?.content;
    if (!n)
      throw new Error("content is null");
    return Pt.add(n), n;
  }
}
function lu(e) {
  if (e == null)
    return document.createElement("div");
  if (Pt.has(e))
    return e;
  if (e instanceof Node) {
    const t = document.createElement("div");
    return t.append(e), t;
  } else {
    const t = document.createElement("div");
    for (const n of [...e])
      t.append(n);
    return t;
  }
}
function du(e, t, n) {
  const r = [], s = [];
  for (; e; )
    r.push(e), e = e.previousSibling;
  for (; r.length > 0; ) {
    const i = r.pop();
    s.push(i), t?.parentElement?.insertBefore(i, t);
  }
  for (s.push(t); n; )
    r.push(n), s.push(n), n = n.nextSibling;
  for (; r.length; )
    t?.parentElement?.insertBefore(r.pop(), t.nextSibling);
  return s;
}
function hu(e, t, n) {
  let r = e.firstChild, s = r, i = 0;
  for (; r; ) {
    let u = fu(r, t, n);
    u > i && (s = r, i = u), r = r.nextSibling;
  }
  return s;
}
function fu(e, t, n) {
  return qt(e, t) ? 0.5 + lt(n, e, t) : 0;
}
function as(e, t) {
  Ne(t, e), t.callbacks.beforeNodeRemoved(e) !== !1 && (e.remove(), t.callbacks.afterNodeRemoved(e));
}
function pu(e, t) {
  return !e.deadIds.has(t);
}
function mu(e, t, n) {
  return e.idMap.get(n)?.has(t) || !1;
}
function Ne(e, t) {
  const n = e.idMap.get(t);
  if (n)
    for (const r of n)
      e.deadIds.add(r);
}
function lt(e, t, n) {
  const r = e.idMap.get(t);
  if (!r)
    return 0;
  let s = 0;
  for (const i of r)
    pu(e, i) && mu(e, i, n) && ++s;
  return s;
}
function Sr(e, t) {
  const n = e.parentElement, r = e.querySelectorAll("[id]");
  for (const s of r) {
    let i = s;
    for (; i !== n && i; ) {
      let u = t.get(i);
      u == null && (u = /* @__PURE__ */ new Set(), t.set(i, u)), u.add(s.id), i = i.parentElement;
    }
  }
}
function bu(e, t) {
  const n = /* @__PURE__ */ new Map();
  return Sr(e, n), Sr(t, n), n;
}
const cn = "display", wr = "none", ln = "important", Rr = "duration", Eu = "show", dn = `${ne}showing`, hn = `${ne}hiding`, Lr = `${ne}show-transition-style`, gu = {
  prefix: Eu,
  allowedModifiers: /* @__PURE__ */ new Set([ln, Rr]),
  onLoad: (e) => {
    const { el: t, modifiers: n, expressionFn: r, reactivity: s } = e, i = n.has(ln) ? ln : void 0;
    let u, c;
    const d = e.modifiers.get(Rr);
    if (d) {
      let f = document.getElementById(Lr);
      if (!f) {
        f = document.createElement("style"), f.id = Lr, document.head.appendChild(f);
        const b = vn(d) || "300";
        f.innerHTML = `
          .${dn} {
            visibility: visible;
            transition: opacity ${b}ms linear;
          }
          .${hn} {
            visibility: hidden;
            transition: visibility 0s ${b}ms, opacity ${b}ms linear;
          }
        `;
      }
      const p = (b) => (y) => {
        y.target === t && (t.classList.remove(b), t.removeEventListener("transitionend", p(b)));
      };
      u = () => {
        t.addEventListener("transitionend", p(dn)), t.classList.add(dn), requestAnimationFrame(() => {
          t.style.setProperty("opacity", "1", i);
        });
      }, c = () => {
        t.addEventListener("transitionend", p(hn)), t.classList.add(hn), requestAnimationFrame(() => {
          t.style.setProperty("opacity", "0", i);
        });
      };
    } else
      u = () => {
        t.style.length === 1 && t.style.display === wr ? t.style.removeProperty(cn) : t.style.setProperty(cn, "", i);
      }, c = () => {
        t.style.setProperty(cn, wr, i);
      };
    return s.effect(async () => {
      await r(e) ? u() : c();
    });
  }
}, Tu = "intersects", vr = "once", Or = "half", kr = "full", _u = {
  prefix: Tu,
  allowedModifiers: /* @__PURE__ */ new Set([vr, Or, kr]),
  mustHaveEmptyKey: !0,
  onLoad: (e) => {
    const { modifiers: t } = e, n = { threshold: 0 };
    t.has(kr) ? n.threshold = 1 : t.has(Or) && (n.threshold = 0.5);
    const r = new IntersectionObserver((s) => {
      s.forEach((i) => {
        i.isIntersecting && (e.expressionFn(e), t.has(vr) && (r.disconnect(), delete e.el.dataset[e.rawKey]));
      });
    }, n);
    return r.observe(e.el), () => r.disconnect();
  }
}, Dr = "prepend", Pr = "append", Mr = new Error("Target element must have a parent if using prepend or append"), Au = {
  prefix: "teleport",
  allowedModifiers: /* @__PURE__ */ new Set([Dr, Pr]),
  allowedTagRegexps: /* @__PURE__ */ new Set(["template"]),
  bypassExpressionFunctionCreation: () => !0,
  onLoad: (e) => {
    const { el: t, modifiers: n, expression: r } = e;
    if (!(t instanceof HTMLTemplateElement))
      throw new Error("el must be a template element");
    const s = document.querySelector(r);
    if (!s)
      throw new Error(`Target element not found: ${r}`);
    if (!t.content)
      throw new Error("Template element must have content");
    const i = t.content.cloneNode(!0);
    if (Fa(i)?.firstElementChild)
      throw new Error("Empty template");
    if (n.has(Dr)) {
      if (!s.parentNode)
        throw Mr;
      s.parentNode.insertBefore(i, s);
    } else if (n.has(Pr)) {
      if (!s.parentNode)
        throw Mr;
      s.parentNode.insertBefore(i, s.nextSibling);
    } else
      s.appendChild(i);
  }
}, yu = {
  prefix: "scrollIntoView",
  mustHaveEmptyKey: !0,
  mustHaveEmptyExpression: !0,
  allowedModifiers: /* @__PURE__ */ new Set([
    "smooth",
    "instant",
    "auto",
    "hstart",
    "hcenter",
    "hend",
    "hnearest",
    "vstart",
    "vcenter",
    "vend",
    "vnearest",
    "focus"
  ]),
  onLoad: ({ el: e, modifiers: t, rawKey: n }) => {
    e.tabIndex || e.setAttribute("tabindex", "0");
    const r = {
      behavior: "smooth",
      block: "center",
      inline: "center"
    };
    return t.has("smooth") && (r.behavior = "smooth"), t.has("instant") && (r.behavior = "instant"), t.has("auto") && (r.behavior = "auto"), t.has("hstart") && (r.inline = "start"), t.has("hcenter") && (r.inline = "center"), t.has("hend") && (r.inline = "end"), t.has("hnearest") && (r.inline = "nearest"), t.has("vstart") && (r.block = "start"), t.has("vcenter") && (r.block = "center"), t.has("vend") && (r.block = "end"), t.has("vnearest") && (r.block = "nearest"), us(e, r, t.has("focus")), delete e.dataset[n], () => {
    };
  }
}, ss = document, is = !!ss.startViewTransition, Cu = {
  prefix: "viewTransition",
  onGlobalInit() {
    let e = !1;
    if (document.head.childNodes.forEach((t) => {
      t instanceof HTMLMetaElement && t.name === "view-transition" && (e = !0);
    }), !e) {
      const t = document.createElement("meta");
      t.name = "view-transition", t.content = "same-origin", document.head.appendChild(t);
    }
  },
  onLoad: (e) => {
    if (!is) {
      console.error("Browser does not support view transitions");
      return;
    }
    return e.reactivity.effect(() => {
      const { el: t, expressionFn: n } = e;
      let r = n(e);
      if (!r)
        return;
      const s = t.style;
      s.viewTransitionName = r;
    });
  }
}, Nu = [
  gu,
  _u,
  Au,
  yu,
  Cu
], Iu = {
  scroll: async (e, t, n) => {
    const r = Object.assign(
      { behavior: "smooth", vertical: "center", horizontal: "center", shouldFocus: !0 },
      n
    ), s = document.querySelector(t);
    us(s, r);
  }
};
function us(e, t, n = !0) {
  if (!(e instanceof HTMLElement || e instanceof SVGElement))
    throw new Error("Element not found");
  e.tabIndex || e.setAttribute("tabindex", "0"), e.scrollIntoView(t), n && e.focus();
}
const xu = 500, Su = !0, wu = "morph", Ru = "Content-Type", Lu = `${Ue}-request`, vu = "application/json", Ou = "true", ku = `${ne}fragment`, Du = `${ne}signal`, Pu = `${ne}delete`, Mu = `${ne}redirect`, Uu = `${ne}console`, dt = `${ne}indicator`, kn = `${dt}-loading`, Ur = `${ne}settling`, wt = `${ne}swapping`, Bu = "self", Hu = "get", Fu = "post", $u = "put", Yu = "patch", qu = "delete", pe = {
  MorphElement: "morph",
  InnerElement: "inner",
  OuterElement: "outer",
  PrependElement: "prepend",
  AppendElement: "append",
  BeforeElement: "before",
  AfterElement: "after",
  UpsertAttributes: "upsert_attributes"
}, zu = {
  prefix: "fetchIndicator",
  mustHaveEmptyKey: !0,
  mustNotEmptyExpression: !0,
  onGlobalInit: () => {
    const e = document.createElement("style");
    e.innerHTML = `
.${dt}{
 opacity:0;
 transition: opacity 300ms ease-out;
}
.${kn} {
 opacity:1;
 transition: opacity 300ms ease-in;
}
`, document.head.appendChild(e);
  },
  onLoad: (e) => e.reactivity.effect(() => {
    e.upsertIfMissingFromStore("_dsPlugins.fetch.indicatorElements", {}), e.upsertIfMissingFromStore("_dsPlugins.fetch.indicatorsVisible", []);
    const t = e.reactivity.computed(() => `${e.expressionFn(e)}`), n = e.store(), r = document.querySelectorAll(t.value);
    if (r.length === 0)
      throw new Error("No indicator found");
    return r.forEach((s) => {
      s.classList.add(dt);
    }), n._dsPlugins.fetch.indicatorElements[e.el.id] = e.reactivity.signal(r), () => {
      delete n._dsPlugins.fetch.indicatorElements[e.el.id];
    };
  })
}, Wu = {
  prefix: "header",
  mustNotEmptyKey: !0,
  mustNotEmptyExpression: !0,
  preprocessors: {
    post: [
      {
        regexp: /(?<whole>.+)/g,
        replacer: (e) => {
          const { whole: t } = e;
          return `'${t}'`;
        }
      }
    ]
  },
  onLoad: (e) => {
    e.upsertIfMissingFromStore("_dsPlugins.fetch.headers", {});
    const t = e.key.replace(/([a-z](?=[A-Z]))/g, "$1-").toUpperCase(), n = e.expressionFn(e);
    return e.store()._dsPlugins.fetch.headers[t] = n, () => {
      delete e.store()._dsPlugins.fetch.headers[t];
    };
  }
}, Vu = [zu, Wu];
async function Gu(e, t, n, r = !0) {
  const s = n.store();
  if (!t)
    throw new Error(`No signal for ${e} on ${t}`);
  let i = { ...s.value };
  r && (i = gt(i));
  const u = JSON.stringify(i), c = n.el;
  Z(
    "plugin",
    "backend",
    "fetch_start",
    c,
    JSON.stringify({ method: e, urlExpression: t, onlyRemote: r, storeJSON: u })
  );
  const d = s?._dsPlugins?.fetch?.indicatorElements ? s._dsPlugins.fetch.indicatorElements[c.id]?.value || [] : [], f = s?._dsPlugins.fetch?.indicatorsVisible;
  d?.forEach && d.forEach((T) => {
    if (!T || !f)
      return;
    const C = f.value.findIndex((N) => N ? T.isSameNode(N.el) : !1);
    if (C > -1) {
      const N = f.value[C], I = [...f.value];
      delete I[C], f.value = [
        ...I.filter((x) => !!x),
        { el: T, count: N.count + 1 }
      ];
    } else
      T.classList.remove(dt), T.classList.add(kn), f.value = [
        ...f.value,
        {
          el: T,
          count: 1
        }
      ];
  });
  const p = new URL(t, window.location.origin);
  e = e.toUpperCase();
  const b = {
    method: e,
    headers: {
      [Ru]: vu,
      [Lu]: Ou
    },
    onmessage: (T) => {
      if (T.event) {
        if (!T.event.startsWith(ne)) {
          console.log(`Unknown event: ${T.event}`);
          debugger;
        }
      } else
        return;
      switch (T.event) {
        case ku:
          const C = T.data.trim().split(`
`), N = ["selector", "merge", "settle", "fragment", "vt"];
          let I = "", x = wu, S = xu, v = Su, w = !1, R = "", k = "";
          for (let X = 0; X < C.length; X++) {
            let W = C[X];
            if (!W?.length)
              continue;
            const fe = W.split(" ", 1)[0];
            if (N.includes(fe) && fe !== k)
              switch (k = fe, W = W.slice(fe.length + 1), k) {
                case "selector":
                  R = W;
                  break;
                case "merge":
                  if (x = W, w = Object.values(pe).includes(x), !w)
                    throw new Error(`Unknown merge option: ${x}`);
                  break;
                case "settle":
                  S = parseInt(W);
                  break;
                case "fragment":
                  break;
                case "vt":
                  v = W === "true";
                  break;
                default:
                  throw new Error("Unknown data type");
              }
            k === "fragment" && (I += W + `
`);
          }
          I?.length || (I = "<div></div>"), Qu(n, R, x, I, S, v), Z(
            "plugin",
            "backend",
            "merge",
            R,
            JSON.stringify({ fragment: I, settleTime: S, useViewTransition: v })
          );
          break;
        case Du:
          let q = !1, te = "";
          const ae = T.data.trim().split(`
`);
          for (let X = 0; X < ae.length; X++) {
            const W = ae[X], [fe, ...yi] = W.split(" "), _r = yi.join(" ");
            switch (fe) {
              case "onlyIfMissing":
                q = _r.trim() === "true";
                break;
              case "store":
                te += `${_r}
`;
                break;
              default:
                throw new Error(`Unknown signal type: ${fe}`);
            }
          }
          const he = ` return Object.assign({...ctx.store()}, ${te})`;
          try {
            const X = new Function("ctx", he)(n), W = Ja(n.store(), X, q);
            n.mergeStore(W), n.applyPlugins(document.body);
          } catch (X) {
            console.log(he), console.error(X);
            debugger;
          }
          break;
        case Pu:
          const [oe, ...ke] = T.data.trim().split(" ");
          switch (oe) {
            case "selector":
              const X = ke.join(" ");
              document.querySelectorAll(X).forEach((fe) => fe.remove());
              break;
            case "paths":
              const W = ke.join(" ").split(" ");
              n.removeFromStore(...W);
              break;
            default:
              throw new Error(`Unknown delete prefix: ${oe}`);
          }
          break;
        case Mu:
          const [Er, ..._i] = T.data.trim().split(" ");
          if (Er !== "url")
            throw new Error(`Unknown redirect selector: ${Er}`);
          const gr = _i.join(" ");
          Z("plugin", "backend", "redirect", "WINDOW", gr), window.location.href = gr;
          break;
        case Uu:
          const [on, ...Ai] = T.data.trim().split(" "), Tr = Ai.join(" ");
          switch (on) {
            case "debug":
            case "error":
            case "info":
            case "group":
            case "groupEnd":
            case "log":
            case "warn":
              console[on](Tr);
              break;
            default:
              throw new Error(`Unknown console mode: '${on}', message: '${Tr}'`);
          }
      }
    },
    onerror: (T) => {
      console.error(T);
    },
    onclose: () => {
      try {
        const T = n.store(), C = T?._dsPlugins?.fetch?.indicatorsVisible || [], N = T?._dsPlugins?.fetch?.indicatorElements ? T._dsPlugins.fetch.indicatorElements[c.id]?.value || [] : [], I = [];
        N?.forEach && N.forEach((x) => {
          if (!x || !C)
            return;
          const S = C.value, v = S.findIndex((R) => R ? x.isSameNode(R.el) : !1), w = S[v];
          w && (w.count < 2 ? (I.push(
            new Promise(
              () => setTimeout(() => {
                x.classList.remove(kn), x.classList.add(dt);
              }, 300)
            )
          ), delete S[v]) : v > -1 && (S[v].count = S[v].count - 1), C.value = S.filter((R) => !!R));
        }), Promise.all(I);
      } catch (T) {
        console.error(T);
        debugger;
      } finally {
        Z("plugin", "backend", "fetch_end", c, JSON.stringify({ method: e, urlExpression: t }));
      }
    }
  };
  if (e === "GET") {
    const T = new URLSearchParams(p.search);
    T.append("datastar", u), p.search = T.toString();
  } else
    b.body = u;
  const y = s?._dsPlugins?.fetch?.headers || {};
  if (b.headers)
    for (const [T, C] of Object.entries(y))
      T.startsWith("_") || (b.headers[T] = `${C}`);
  Xi(p, b);
}
const Br = document.createElement("template");
function Qu(e, t, n, r, s, i) {
  const { el: u } = e;
  Br.innerHTML = r.trim(), [...Br.content.children].forEach((c) => {
    if (!(c instanceof Element))
      throw new Error("No fragment found");
    const d = (y) => {
      for (const T of y) {
        T.classList.add(wt);
        const C = T.outerHTML;
        let N = T;
        switch (n) {
          case pe.MorphElement:
            const x = au(N, c, {
              callbacks: {
                beforeNodeRemoved: (S, v) => (e.cleanupElementRemovals(S), !0)
              }
            });
            if (!x?.length)
              throw new Error("No morph result");
            N = x[0];
            break;
          case pe.InnerElement:
            N.innerHTML = c.innerHTML;
            break;
          case pe.OuterElement:
            N.replaceWith(c);
            break;
          case pe.PrependElement:
            N.prepend(c);
            break;
          case pe.AppendElement:
            N.append(c);
            break;
          case pe.BeforeElement:
            N.before(c);
            break;
          case pe.AfterElement:
            N.after(c);
            break;
          case pe.UpsertAttributes:
            c.getAttributeNames().forEach((S) => {
              const v = c.getAttribute(S);
              N.setAttribute(S, v);
            });
            break;
          default:
            throw new Error(`Unknown merge type: ${n}`);
        }
        e.cleanupElementRemovals(N), N.classList.add(wt), e.applyPlugins(document.body), setTimeout(() => {
          T.classList.remove(wt), N.classList.remove(wt);
        }, s);
        const I = N.outerHTML;
        C !== I && (N.classList.add(Ur), setTimeout(() => {
          N.classList.remove(Ur);
        }, s));
      }
    }, f = t === Bu;
    let p;
    if (f)
      p = [u];
    else {
      const y = t || `#${c.getAttribute("id")}`;
      if (p = document.querySelectorAll(y) || [], !p)
        throw new Error(`No targets found for ${y}`);
    }
    const b = [...p];
    if (!b.length)
      throw new Error(`No targets found for ${t}`);
    is && i ? ss.startViewTransition(() => d(b)) : d(b);
  });
}
const ju = [Hu, Fu, $u, Yu, qu].reduce(
  (e, t) => (e[t] = (n, r, s) => {
    const i = ["true", !0, void 0].includes(s);
    Gu(t, r, n, i);
  }, e),
  {
    isFetching: (e, t) => {
      const n = [...document.querySelectorAll(t)], r = e.store()?._dsPlugins?.fetch.indicatorsVisible?.value || [];
      return n.length ? n.some((s) => r.filter((i) => !!i).some((i) => i.el.isSameNode(s) && i.count > 0)) : !1;
    }
  }
), Hr = "0.19.9", Kn = (e, t, n, r, s, i) => (t - n) / (r - n) * (i - s) + s, Xu = (e, t, n, r, s, i) => Math.round(Kn(e, t, n, r, s, i)), os = (e, t, n, r, s, i) => Math.max(s, Math.min(i, Kn(e, t, n, r, s, i))), Ku = (e, t, n, r, s, i) => Math.round(os(e, t, n, r, s, i)), Ju = {
  setAll: (e, t, n) => {
    const r = new RegExp(t);
    e.walkSignals((s, i) => r.test(s) && (i.value = n));
  },
  toggleAll: (e, t) => {
    const n = new RegExp(t);
    e.walkSignals((r, s) => n.test(r) && (s.value = !s.value));
  },
  clipboard: (e, t) => {
    if (!navigator.clipboard)
      throw new Error("Clipboard API not available");
    navigator.clipboard.writeText(t);
  },
  fit: Kn,
  fitInt: Xu,
  clampFit: os,
  clampFitInt: Ku
};
function Zu(e = {}, ...t) {
  const n = new Bi(e, ...t);
  return n.run(), n;
}
function eo(e = {}, ...t) {
  const n = Object.assign(
    {},
    Ju,
    Gi,
    ju,
    Iu,
    e
  ), r = [...Vu, ...Nu, ...Vi, ...t];
  return Zu(n, ...r);
}
const to = {
  bubbles: !0,
  cancelable: !0,
  composed: !0
}, Dn = window, Z = (e, t, n, r, s, i = to) => {
  Dn.dispatchEvent(
    new CustomEvent(
      Me,
      Object.assign(
        {
          detail: {
            time: /* @__PURE__ */ new Date(),
            category: e,
            subcategory: t,
            type: n,
            target: Ka(r),
            message: s
          }
        },
        i
      )
    )
  );
};
Dn.ds || setTimeout(() => {
  Z("core", "init", "start", document.body, `Datastar v${Hr} loading`);
  const e = performance.now();
  Dn.ds = eo();
  const t = performance.now();
  Z(
    "core",
    "init",
    "end",
    document.body,
    `Datastar v${Hr} loaded and attached to all DOM elements in ${(t - e).toFixed(2)}ms`
  );
  const n = document.createElement("style");
  n.innerHTML = `
.datastar-inspector-highlight {
 border: 2px solid blue;
}
`, document.head.appendChild(n), window.addEventListener("datastar-inspector-event", (r) => {
    if ("detail" in r && typeof r.detail == "object" && r.detail) {
      const { detail: s } = r;
      if ("script" in s && typeof s.script == "string")
        try {
          new Function(s.script)();
        } catch (i) {
          console.error(i);
        }
    }
  });
}, 0);
function ye() {
}
ye.prototype = {
  diff: function(t, n) {
    var r, s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, i = s.callback;
    typeof s == "function" && (i = s, s = {}), this.options = s;
    var u = this;
    function c(w) {
      return i ? (setTimeout(function() {
        i(void 0, w);
      }, 0), !0) : w;
    }
    t = this.castInput(t), n = this.castInput(n), t = this.removeEmpty(this.tokenize(t)), n = this.removeEmpty(this.tokenize(n));
    var d = n.length, f = t.length, p = 1, b = d + f;
    s.maxEditLength && (b = Math.min(b, s.maxEditLength));
    var y = (r = s.timeout) !== null && r !== void 0 ? r : 1 / 0, T = Date.now() + y, C = [{
      oldPos: -1,
      lastComponent: void 0
    }], N = this.extractCommon(C[0], n, t, 0);
    if (C[0].oldPos + 1 >= f && N + 1 >= d)
      return c([{
        value: this.join(n),
        count: n.length
      }]);
    var I = -1 / 0, x = 1 / 0;
    function S() {
      for (var w = Math.max(I, -p); w <= Math.min(x, p); w += 2) {
        var R = void 0, k = C[w - 1], q = C[w + 1];
        k && (C[w - 1] = void 0);
        var te = !1;
        if (q) {
          var ae = q.oldPos - w;
          te = q && 0 <= ae && ae < d;
        }
        var he = k && k.oldPos + 1 < f;
        if (!te && !he) {
          C[w] = void 0;
          continue;
        }
        if (!he || te && k.oldPos + 1 < q.oldPos ? R = u.addToPath(q, !0, void 0, 0) : R = u.addToPath(k, void 0, !0, 1), N = u.extractCommon(R, n, t, w), R.oldPos + 1 >= f && N + 1 >= d)
          return c(no(u, R.lastComponent, n, t, u.useLongestToken));
        C[w] = R, R.oldPos + 1 >= f && (x = Math.min(x, w - 1)), N + 1 >= d && (I = Math.max(I, w + 1));
      }
      p++;
    }
    if (i)
      (function w() {
        setTimeout(function() {
          if (p > b || Date.now() > T)
            return i();
          S() || w();
        }, 0);
      })();
    else
      for (; p <= b && Date.now() <= T; ) {
        var v = S();
        if (v)
          return v;
      }
  },
  addToPath: function(t, n, r, s) {
    var i = t.lastComponent;
    return i && i.added === n && i.removed === r ? {
      oldPos: t.oldPos + s,
      lastComponent: {
        count: i.count + 1,
        added: n,
        removed: r,
        previousComponent: i.previousComponent
      }
    } : {
      oldPos: t.oldPos + s,
      lastComponent: {
        count: 1,
        added: n,
        removed: r,
        previousComponent: i
      }
    };
  },
  extractCommon: function(t, n, r, s) {
    for (var i = n.length, u = r.length, c = t.oldPos, d = c - s, f = 0; d + 1 < i && c + 1 < u && this.equals(n[d + 1], r[c + 1]); )
      d++, c++, f++;
    return f && (t.lastComponent = {
      count: f,
      previousComponent: t.lastComponent
    }), t.oldPos = c, d;
  },
  equals: function(t, n) {
    return this.options.comparator ? this.options.comparator(t, n) : t === n || this.options.ignoreCase && t.toLowerCase() === n.toLowerCase();
  },
  removeEmpty: function(t) {
    for (var n = [], r = 0; r < t.length; r++)
      t[r] && n.push(t[r]);
    return n;
  },
  castInput: function(t) {
    return t;
  },
  tokenize: function(t) {
    return t.split("");
  },
  join: function(t) {
    return t.join("");
  }
};
function no(e, t, n, r, s) {
  for (var i = [], u; t; )
    i.push(t), u = t.previousComponent, delete t.previousComponent, t = u;
  i.reverse();
  for (var c = 0, d = i.length, f = 0, p = 0; c < d; c++) {
    var b = i[c];
    if (b.removed) {
      if (b.value = e.join(r.slice(p, p + b.count)), p += b.count, c && i[c - 1].added) {
        var T = i[c - 1];
        i[c - 1] = i[c], i[c] = T;
      }
    } else {
      if (!b.added && s) {
        var y = n.slice(f, f + b.count);
        y = y.map(function(N, I) {
          var x = r[p + I];
          return x.length > N.length ? x : N;
        }), b.value = e.join(y);
      } else
        b.value = e.join(n.slice(f, f + b.count));
      f += b.count, b.added || (p += b.count);
    }
  }
  var C = i[d - 1];
  return d > 1 && typeof C.value == "string" && (C.added || C.removed) && e.equals("", C.value) && (i[d - 2].value += C.value, i.pop()), i;
}
var Fr = /^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/, $r = /\S/, cs = new ye();
cs.equals = function(e, t) {
  return this.options.ignoreCase && (e = e.toLowerCase(), t = t.toLowerCase()), e === t || this.options.ignoreWhitespace && !$r.test(e) && !$r.test(t);
};
cs.tokenize = function(e) {
  for (var t = e.split(/([^\S\r\n]+|[()[\]{}'"\r\n]|\b)/), n = 0; n < t.length - 1; n++)
    !t[n + 1] && t[n + 2] && Fr.test(t[n]) && Fr.test(t[n + 2]) && (t[n] += t[n + 2], t.splice(n + 1, 2), n--);
  return t;
};
var Jn = new ye();
Jn.tokenize = function(e) {
  this.options.stripTrailingCr && (e = e.replace(/\r\n/g, `
`));
  var t = [], n = e.split(/(\n|\r\n)/);
  n[n.length - 1] || n.pop();
  for (var r = 0; r < n.length; r++) {
    var s = n[r];
    r % 2 && !this.options.newlineIsToken ? t[t.length - 1] += s : (this.options.ignoreWhitespace && (s = s.trim()), t.push(s));
  }
  return t;
};
function ro(e, t, n) {
  return Jn.diff(e, t, n);
}
var ao = new ye();
ao.tokenize = function(e) {
  return e.split(/(\S.+?[.!?])(?=\s+|$)/);
};
var so = new ye();
so.tokenize = function(e) {
  return e.split(/([{}:;,]|\s+)/);
};
function Ut(e) {
  "@babel/helpers - typeof";
  return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? Ut = function(t) {
    return typeof t;
  } : Ut = function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ut(e);
}
var io = Object.prototype.toString, Ye = new ye();
Ye.useLongestToken = !0;
Ye.tokenize = Jn.tokenize;
Ye.castInput = function(e) {
  var t = this.options, n = t.undefinedReplacement, r = t.stringifyReplacer, s = r === void 0 ? function(i, u) {
    return typeof u > "u" ? n : u;
  } : r;
  return typeof e == "string" ? e : JSON.stringify(Pn(e, null, null, s), s, "  ");
};
Ye.equals = function(e, t) {
  return ye.prototype.equals.call(Ye, e.replace(/,([\r\n])/g, "$1"), t.replace(/,([\r\n])/g, "$1"));
};
function uo(e, t, n) {
  return Ye.diff(e, t, n);
}
function Pn(e, t, n, r, s) {
  t = t || [], n = n || [], r && (e = r(s, e));
  var i;
  for (i = 0; i < t.length; i += 1)
    if (t[i] === e)
      return n[i];
  var u;
  if (io.call(e) === "[object Array]") {
    for (t.push(e), u = new Array(e.length), n.push(u), i = 0; i < e.length; i += 1)
      u[i] = Pn(e[i], t, n, r, s);
    return t.pop(), n.pop(), u;
  }
  if (e && e.toJSON && (e = e.toJSON()), Ut(e) === "object" && e !== null) {
    t.push(e), u = {}, n.push(u);
    var c = [], d;
    for (d in e)
      e.hasOwnProperty(d) && c.push(d);
    for (c.sort(), i = 0; i < c.length; i += 1)
      d = c[i], u[d] = Pn(e[d], t, n, r, d);
    t.pop(), n.pop();
  } else
    u = e;
  return u;
}
var Mn = new ye();
Mn.tokenize = function(e) {
  return e.slice();
};
Mn.join = Mn.removeEmpty = function(e) {
  return e;
};
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Bt = globalThis, Zn = Bt.ShadowRoot && (Bt.ShadyCSS === void 0 || Bt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, er = Symbol(), Yr = /* @__PURE__ */ new WeakMap();
let ls = class {
  constructor(t, n, r) {
    if (this._$cssResult$ = !0, r !== er)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = n;
  }
  get styleSheet() {
    let t = this.o;
    const n = this.t;
    if (Zn && t === void 0) {
      const r = n !== void 0 && n.length === 1;
      r && (t = Yr.get(n)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && Yr.set(n, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const oo = (e) => new ls(typeof e == "string" ? e : e + "", void 0, er), co = (e, ...t) => {
  const n = e.length === 1 ? e[0] : t.reduce((r, s, i) => r + ((u) => {
    if (u._$cssResult$ === !0)
      return u.cssText;
    if (typeof u == "number")
      return u;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + u + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + e[i + 1], e[0]);
  return new ls(n, e, er);
}, lo = (e, t) => {
  if (Zn)
    e.adoptedStyleSheets = t.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else
    for (const n of t) {
      const r = document.createElement("style"), s = Bt.litNonce;
      s !== void 0 && r.setAttribute("nonce", s), r.textContent = n.cssText, e.appendChild(r);
    }
}, qr = Zn ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let n = "";
  for (const r of t.cssRules)
    n += r.cssText;
  return oo(n);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ho, defineProperty: fo, getOwnPropertyDescriptor: po, getOwnPropertyNames: mo, getOwnPropertySymbols: bo, getPrototypeOf: Eo } = Object, Kt = globalThis, zr = Kt.trustedTypes, go = zr ? zr.emptyScript : "", To = Kt.reactiveElementPolyfillSupport, tt = (e, t) => e, zt = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? go : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let n = e;
  switch (t) {
    case Boolean:
      n = e !== null;
      break;
    case Number:
      n = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        n = JSON.parse(e);
      } catch {
        n = null;
      }
  }
  return n;
} }, tr = (e, t) => !ho(e, t), Wr = { attribute: !0, type: String, converter: zt, reflect: !1, hasChanged: tr };
Symbol.metadata ??= Symbol("metadata"), Kt.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
class De extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, n = Wr) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.elementProperties.set(t, n), !n.noAccessor) {
      const r = Symbol(), s = this.getPropertyDescriptor(t, r, n);
      s !== void 0 && fo(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, n, r) {
    const { get: s, set: i } = po(this.prototype, t) ?? { get() {
      return this[n];
    }, set(u) {
      this[n] = u;
    } };
    return { get() {
      return s?.call(this);
    }, set(u) {
      const c = s?.call(this);
      i.call(this, u), this.requestUpdate(t, c, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Wr;
  }
  static _$Ei() {
    if (this.hasOwnProperty(tt("elementProperties")))
      return;
    const t = Eo(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(tt("finalized")))
      return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(tt("properties"))) {
      const n = this.properties, r = [...mo(n), ...bo(n)];
      for (const s of r)
        this.createProperty(s, n[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const n = litPropertyMetadata.get(t);
      if (n !== void 0)
        for (const [r, s] of n)
          this.elementProperties.set(r, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [n, r] of this.elementProperties) {
      const s = this._$Eu(n, r);
      s !== void 0 && this._$Eh.set(s, n);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const n = [];
    if (Array.isArray(t)) {
      const r = new Set(t.flat(1 / 0).reverse());
      for (const s of r)
        n.unshift(qr(s));
    } else
      t !== void 0 && n.push(qr(t));
    return n;
  }
  static _$Eu(t, n) {
    const r = n.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), n = this.constructor.elementProperties;
    for (const r of n.keys())
      this.hasOwnProperty(r) && (t.set(r, this[r]), delete this[r]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return lo(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, n, r) {
    this._$AK(t, r);
  }
  _$EC(t, n) {
    const r = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, r);
    if (s !== void 0 && r.reflect === !0) {
      const i = (r.converter?.toAttribute !== void 0 ? r.converter : zt).toAttribute(n, r.type);
      this._$Em = t, i == null ? this.removeAttribute(s) : this.setAttribute(s, i), this._$Em = null;
    }
  }
  _$AK(t, n) {
    const r = this.constructor, s = r._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const i = r.getPropertyOptions(s), u = typeof i.converter == "function" ? { fromAttribute: i.converter } : i.converter?.fromAttribute !== void 0 ? i.converter : zt;
      this._$Em = s, this[s] = u.fromAttribute(n, i.type), this._$Em = null;
    }
  }
  requestUpdate(t, n, r) {
    if (t !== void 0) {
      if (r ??= this.constructor.getPropertyOptions(t), !(r.hasChanged ?? tr)(this[t], n))
        return;
      this.P(t, n, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$ET());
  }
  P(t, n, r) {
    this._$AL.has(t) || this._$AL.set(t, n), r.reflect === !0 && this._$Em !== t && (this._$Ej ??= /* @__PURE__ */ new Set()).add(t);
  }
  async _$ET() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (n) {
      Promise.reject(n);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending)
      return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [s, i] of this._$Ep)
          this[s] = i;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0)
        for (const [s, i] of r)
          i.wrapped !== !0 || this._$AL.has(s) || this[s] === void 0 || this.P(s, this[s], i);
    }
    let t = !1;
    const n = this._$AL;
    try {
      t = this.shouldUpdate(n), t ? (this.willUpdate(n), this._$EO?.forEach((r) => r.hostUpdate?.()), this.update(n)) : this._$EU();
    } catch (r) {
      throw t = !1, this._$EU(), r;
    }
    t && this._$AE(n);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((n) => n.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EU() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Ej &&= this._$Ej.forEach((n) => this._$EC(n, this[n])), this._$EU();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
}
De.elementStyles = [], De.shadowRootOptions = { mode: "open" }, De[tt("elementProperties")] = /* @__PURE__ */ new Map(), De[tt("finalized")] = /* @__PURE__ */ new Map(), To?.({ ReactiveElement: De }), (Kt.reactiveElementVersions ??= []).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const nr = globalThis, Wt = nr.trustedTypes, Vr = Wt ? Wt.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ds = "$lit$", Te = `lit$${Math.random().toFixed(9).slice(2)}$`, hs = "?" + Te, _o = `<${hs}>`, Re = document, ht = () => Re.createComment(""), ft = (e) => e === null || typeof e != "object" && typeof e != "function", fs = Array.isArray, Ao = (e) => fs(e) || typeof e?.[Symbol.iterator] == "function", fn = `[ 	
\f\r]`, Qe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Gr = /-->/g, Qr = />/g, Ce = RegExp(`>|${fn}(?:([^\\s"'>=/]+)(${fn}*=${fn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), jr = /'/g, Xr = /"/g, ps = /^(?:script|style|textarea|title)$/i, yo = (e) => (t, ...n) => ({ _$litType$: e, strings: t, values: n }), K = yo(1), qe = Symbol.for("lit-noChange"), F = Symbol.for("lit-nothing"), Kr = /* @__PURE__ */ new WeakMap(), xe = Re.createTreeWalker(Re, 129);
function ms(e, t) {
  if (!Array.isArray(e) || !e.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return Vr !== void 0 ? Vr.createHTML(t) : t;
}
const Co = (e, t) => {
  const n = e.length - 1, r = [];
  let s, i = t === 2 ? "<svg>" : "", u = Qe;
  for (let c = 0; c < n; c++) {
    const d = e[c];
    let f, p, b = -1, y = 0;
    for (; y < d.length && (u.lastIndex = y, p = u.exec(d), p !== null); )
      y = u.lastIndex, u === Qe ? p[1] === "!--" ? u = Gr : p[1] !== void 0 ? u = Qr : p[2] !== void 0 ? (ps.test(p[2]) && (s = RegExp("</" + p[2], "g")), u = Ce) : p[3] !== void 0 && (u = Ce) : u === Ce ? p[0] === ">" ? (u = s ?? Qe, b = -1) : p[1] === void 0 ? b = -2 : (b = u.lastIndex - p[2].length, f = p[1], u = p[3] === void 0 ? Ce : p[3] === '"' ? Xr : jr) : u === Xr || u === jr ? u = Ce : u === Gr || u === Qr ? u = Qe : (u = Ce, s = void 0);
    const T = u === Ce && e[c + 1].startsWith("/>") ? " " : "";
    i += u === Qe ? d + _o : b >= 0 ? (r.push(f), d.slice(0, b) + ds + d.slice(b) + Te + T) : d + Te + (b === -2 ? c : T);
  }
  return [ms(e, i + (e[n] || "<?>") + (t === 2 ? "</svg>" : "")), r];
};
class pt {
  constructor({ strings: t, _$litType$: n }, r) {
    let s;
    this.parts = [];
    let i = 0, u = 0;
    const c = t.length - 1, d = this.parts, [f, p] = Co(t, n);
    if (this.el = pt.createElement(f, r), xe.currentNode = this.el.content, n === 2) {
      const b = this.el.content.firstChild;
      b.replaceWith(...b.childNodes);
    }
    for (; (s = xe.nextNode()) !== null && d.length < c; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes())
          for (const b of s.getAttributeNames())
            if (b.endsWith(ds)) {
              const y = p[u++], T = s.getAttribute(b).split(Te), C = /([.?@])?(.*)/.exec(y);
              d.push({ type: 1, index: i, name: C[2], strings: T, ctor: C[1] === "." ? Io : C[1] === "?" ? xo : C[1] === "@" ? So : Jt }), s.removeAttribute(b);
            } else
              b.startsWith(Te) && (d.push({ type: 6, index: i }), s.removeAttribute(b));
        if (ps.test(s.tagName)) {
          const b = s.textContent.split(Te), y = b.length - 1;
          if (y > 0) {
            s.textContent = Wt ? Wt.emptyScript : "";
            for (let T = 0; T < y; T++)
              s.append(b[T], ht()), xe.nextNode(), d.push({ type: 2, index: ++i });
            s.append(b[y], ht());
          }
        }
      } else if (s.nodeType === 8)
        if (s.data === hs)
          d.push({ type: 2, index: i });
        else {
          let b = -1;
          for (; (b = s.data.indexOf(Te, b + 1)) !== -1; )
            d.push({ type: 7, index: i }), b += Te.length - 1;
        }
      i++;
    }
  }
  static createElement(t, n) {
    const r = Re.createElement("template");
    return r.innerHTML = t, r;
  }
}
function ze(e, t, n = e, r) {
  if (t === qe)
    return t;
  let s = r !== void 0 ? n._$Co?.[r] : n._$Cl;
  const i = ft(t) ? void 0 : t._$litDirective$;
  return s?.constructor !== i && (s?._$AO?.(!1), i === void 0 ? s = void 0 : (s = new i(e), s._$AT(e, n, r)), r !== void 0 ? (n._$Co ??= [])[r] = s : n._$Cl = s), s !== void 0 && (t = ze(e, s._$AS(e, t.values), s, r)), t;
}
class No {
  constructor(t, n) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = n;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: n }, parts: r } = this._$AD, s = (t?.creationScope ?? Re).importNode(n, !0);
    xe.currentNode = s;
    let i = xe.nextNode(), u = 0, c = 0, d = r[0];
    for (; d !== void 0; ) {
      if (u === d.index) {
        let f;
        d.type === 2 ? f = new Tt(i, i.nextSibling, this, t) : d.type === 1 ? f = new d.ctor(i, d.name, d.strings, this, t) : d.type === 6 && (f = new wo(i, this, t)), this._$AV.push(f), d = r[++c];
      }
      u !== d?.index && (i = xe.nextNode(), u++);
    }
    return xe.currentNode = Re, s;
  }
  p(t) {
    let n = 0;
    for (const r of this._$AV)
      r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, n), n += r.strings.length - 2) : r._$AI(t[n])), n++;
  }
}
class Tt {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, n, r, s) {
    this.type = 2, this._$AH = F, this._$AN = void 0, this._$AA = t, this._$AB = n, this._$AM = r, this.options = s, this._$Cv = s?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const n = this._$AM;
    return n !== void 0 && t?.nodeType === 11 && (t = n.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, n = this) {
    t = ze(this, t, n), ft(t) ? t === F || t == null || t === "" ? (this._$AH !== F && this._$AR(), this._$AH = F) : t !== this._$AH && t !== qe && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ao(t) ? this.k(t) : this._(t);
  }
  S(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.S(t));
  }
  _(t) {
    this._$AH !== F && ft(this._$AH) ? this._$AA.nextSibling.data = t : this.T(Re.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: n, _$litType$: r } = t, s = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = pt.createElement(ms(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === s)
      this._$AH.p(n);
    else {
      const i = new No(s, this), u = i.u(this.options);
      i.p(n), this.T(u), this._$AH = i;
    }
  }
  _$AC(t) {
    let n = Kr.get(t.strings);
    return n === void 0 && Kr.set(t.strings, n = new pt(t)), n;
  }
  k(t) {
    fs(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let r, s = 0;
    for (const i of t)
      s === n.length ? n.push(r = new Tt(this.S(ht()), this.S(ht()), this, this.options)) : r = n[s], r._$AI(i), s++;
    s < n.length && (this._$AR(r && r._$AB.nextSibling, s), n.length = s);
  }
  _$AR(t = this._$AA.nextSibling, n) {
    for (this._$AP?.(!1, !0, n); t && t !== this._$AB; ) {
      const r = t.nextSibling;
      t.remove(), t = r;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class Jt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, n, r, s, i) {
    this.type = 1, this._$AH = F, this._$AN = void 0, this.element = t, this.name = n, this._$AM = s, this.options = i, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = F;
  }
  _$AI(t, n = this, r, s) {
    const i = this.strings;
    let u = !1;
    if (i === void 0)
      t = ze(this, t, n, 0), u = !ft(t) || t !== this._$AH && t !== qe, u && (this._$AH = t);
    else {
      const c = t;
      let d, f;
      for (t = i[0], d = 0; d < i.length - 1; d++)
        f = ze(this, c[r + d], n, d), f === qe && (f = this._$AH[d]), u ||= !ft(f) || f !== this._$AH[d], f === F ? t = F : t !== F && (t += (f ?? "") + i[d + 1]), this._$AH[d] = f;
    }
    u && !s && this.j(t);
  }
  j(t) {
    t === F ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Io extends Jt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === F ? void 0 : t;
  }
}
class xo extends Jt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== F);
  }
}
class So extends Jt {
  constructor(t, n, r, s, i) {
    super(t, n, r, s, i), this.type = 5;
  }
  _$AI(t, n = this) {
    if ((t = ze(this, t, n, 0) ?? F) === qe)
      return;
    const r = this._$AH, s = t === F && r !== F || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, i = t !== F && (r === F || s);
    s && this.element.removeEventListener(this.name, this, r), i && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class wo {
  constructor(t, n, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    ze(this, t);
  }
}
const Ro = nr.litHtmlPolyfillSupport;
Ro?.(pt, Tt), (nr.litHtmlVersions ??= []).push("3.1.4");
const Lo = (e, t, n) => {
  const r = n?.renderBefore ?? t;
  let s = r._$litPart$;
  if (s === void 0) {
    const i = n?.renderBefore ?? null;
    r._$litPart$ = s = new Tt(t.insertBefore(ht(), i), i, void 0, n ?? {});
  }
  return s._$AI(e), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let nt = class extends De {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const n = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Lo(n, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return qe;
  }
};
nt._$litElement$ = !0, nt.finalized = !0, globalThis.litElementHydrateSupport?.({ LitElement: nt });
const vo = globalThis.litElementPolyfillSupport;
vo?.({ LitElement: nt });
(globalThis.litElementVersions ??= []).push("4.0.6");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Oo = (e) => (t, n) => {
  n !== void 0 ? n.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ko = { attribute: !0, type: String, converter: zt, reflect: !1, hasChanged: tr }, Do = (e = ko, t, n) => {
  const { kind: r, metadata: s } = n;
  let i = globalThis.litPropertyMetadata.get(s);
  if (i === void 0 && globalThis.litPropertyMetadata.set(s, i = /* @__PURE__ */ new Map()), i.set(n.name, e), r === "accessor") {
    const { name: u } = n;
    return { set(c) {
      const d = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(u, d, e);
    }, init(c) {
      return c !== void 0 && this.P(u, void 0, e), c;
    } };
  }
  if (r === "setter") {
    const { name: u } = n;
    return function(c) {
      const d = this[u];
      t.call(this, c), this.requestUpdate(u, d, e);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function Le(e) {
  return (t, n) => typeof n == "object" ? Do(e, t, n) : ((r, s, i) => {
    const u = s.hasOwnProperty(i);
    return s.constructor.createProperty(i, u ? { ...r, wrapped: !0 } : r), u ? Object.getOwnPropertyDescriptor(s, i) : void 0;
  })(e, t, n);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Zt(e) {
  return Le({ ...e, state: !0, attribute: !1 });
}
class _t {
  /**
   * @constructor
   * @param {Properties} property
   * @param {Normal} normal
   * @param {string} [space]
   */
  constructor(t, n, r) {
    this.property = t, this.normal = n, r && (this.space = r);
  }
}
_t.prototype.property = {};
_t.prototype.normal = {};
_t.prototype.space = null;
function bs(e, t) {
  const n = {}, r = {};
  let s = -1;
  for (; ++s < e.length; )
    Object.assign(n, e[s].property), Object.assign(r, e[s].normal);
  return new _t(n, r, t);
}
function mt(e) {
  return e.toLowerCase();
}
class re {
  /**
   * @constructor
   * @param {string} property
   * @param {string} attribute
   */
  constructor(t, n) {
    this.property = t, this.attribute = n;
  }
}
re.prototype.space = null;
re.prototype.boolean = !1;
re.prototype.booleanish = !1;
re.prototype.overloadedBoolean = !1;
re.prototype.number = !1;
re.prototype.commaSeparated = !1;
re.prototype.spaceSeparated = !1;
re.prototype.commaOrSpaceSeparated = !1;
re.prototype.mustUseProperty = !1;
re.prototype.defined = !1;
let Po = 0;
const L = ve(), U = ve(), Es = ve(), A = ve(), D = ve(), He = ve(), J = ve();
function ve() {
  return 2 ** ++Po;
}
const Un = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  boolean: L,
  booleanish: U,
  commaOrSpaceSeparated: J,
  commaSeparated: He,
  number: A,
  overloadedBoolean: Es,
  spaceSeparated: D
}, Symbol.toStringTag, { value: "Module" })), pn = Object.keys(Un);
class rr extends re {
  /**
   * @constructor
   * @param {string} property
   * @param {string} attribute
   * @param {number|null} [mask]
   * @param {string} [space]
   */
  constructor(t, n, r, s) {
    let i = -1;
    if (super(t, n), Jr(this, "space", s), typeof r == "number")
      for (; ++i < pn.length; ) {
        const u = pn[i];
        Jr(this, pn[i], (r & Un[u]) === Un[u]);
      }
  }
}
rr.prototype.defined = !0;
function Jr(e, t, n) {
  n && (e[t] = n);
}
const Mo = {}.hasOwnProperty;
function Ge(e) {
  const t = {}, n = {};
  let r;
  for (r in e.properties)
    if (Mo.call(e.properties, r)) {
      const s = e.properties[r], i = new rr(
        r,
        e.transform(e.attributes || {}, r),
        s,
        e.space
      );
      e.mustUseProperty && e.mustUseProperty.includes(r) && (i.mustUseProperty = !0), t[r] = i, n[mt(r)] = r, n[mt(i.attribute)] = r;
    }
  return new _t(t, n, e.space);
}
const gs = Ge({
  space: "xlink",
  transform(e, t) {
    return "xlink:" + t.slice(5).toLowerCase();
  },
  properties: {
    xLinkActuate: null,
    xLinkArcRole: null,
    xLinkHref: null,
    xLinkRole: null,
    xLinkShow: null,
    xLinkTitle: null,
    xLinkType: null
  }
}), Ts = Ge({
  space: "xml",
  transform(e, t) {
    return "xml:" + t.slice(3).toLowerCase();
  },
  properties: { xmlLang: null, xmlBase: null, xmlSpace: null }
});
function _s(e, t) {
  return t in e ? e[t] : t;
}
function As(e, t) {
  return _s(e, t.toLowerCase());
}
const ys = Ge({
  space: "xmlns",
  attributes: { xmlnsxlink: "xmlns:xlink" },
  transform: As,
  properties: { xmlns: null, xmlnsXLink: null }
}), Cs = Ge({
  transform(e, t) {
    return t === "role" ? t : "aria-" + t.slice(4).toLowerCase();
  },
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: U,
    ariaAutoComplete: null,
    ariaBusy: U,
    ariaChecked: U,
    ariaColCount: A,
    ariaColIndex: A,
    ariaColSpan: A,
    ariaControls: D,
    ariaCurrent: null,
    ariaDescribedBy: D,
    ariaDetails: null,
    ariaDisabled: U,
    ariaDropEffect: D,
    ariaErrorMessage: null,
    ariaExpanded: U,
    ariaFlowTo: D,
    ariaGrabbed: U,
    ariaHasPopup: null,
    ariaHidden: U,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: D,
    ariaLevel: A,
    ariaLive: null,
    ariaModal: U,
    ariaMultiLine: U,
    ariaMultiSelectable: U,
    ariaOrientation: null,
    ariaOwns: D,
    ariaPlaceholder: null,
    ariaPosInSet: A,
    ariaPressed: U,
    ariaReadOnly: U,
    ariaRelevant: null,
    ariaRequired: U,
    ariaRoleDescription: D,
    ariaRowCount: A,
    ariaRowIndex: A,
    ariaRowSpan: A,
    ariaSelected: U,
    ariaSetSize: A,
    ariaSort: null,
    ariaValueMax: A,
    ariaValueMin: A,
    ariaValueNow: A,
    ariaValueText: null,
    role: null
  }
}), Uo = Ge({
  space: "html",
  attributes: {
    acceptcharset: "accept-charset",
    classname: "class",
    htmlfor: "for",
    httpequiv: "http-equiv"
  },
  transform: As,
  mustUseProperty: ["checked", "multiple", "muted", "selected"],
  properties: {
    // Standard Properties.
    abbr: null,
    accept: He,
    acceptCharset: D,
    accessKey: D,
    action: null,
    allow: null,
    allowFullScreen: L,
    allowPaymentRequest: L,
    allowUserMedia: L,
    alt: null,
    as: null,
    async: L,
    autoCapitalize: null,
    autoComplete: D,
    autoFocus: L,
    autoPlay: L,
    blocking: D,
    capture: null,
    charSet: null,
    checked: L,
    cite: null,
    className: D,
    cols: A,
    colSpan: null,
    content: null,
    contentEditable: U,
    controls: L,
    controlsList: D,
    coords: A | He,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: L,
    defer: L,
    dir: null,
    dirName: null,
    disabled: L,
    download: Es,
    draggable: U,
    encType: null,
    enterKeyHint: null,
    fetchPriority: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: L,
    formTarget: null,
    headers: D,
    height: A,
    hidden: L,
    high: A,
    href: null,
    hrefLang: null,
    htmlFor: D,
    httpEquiv: D,
    id: null,
    imageSizes: null,
    imageSrcSet: null,
    inert: L,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: L,
    itemId: null,
    itemProp: D,
    itemRef: D,
    itemScope: L,
    itemType: D,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: L,
    low: A,
    manifest: null,
    max: null,
    maxLength: A,
    media: null,
    method: null,
    min: null,
    minLength: A,
    multiple: L,
    muted: L,
    name: null,
    nonce: null,
    noModule: L,
    noValidate: L,
    onAbort: null,
    onAfterPrint: null,
    onAuxClick: null,
    onBeforeMatch: null,
    onBeforePrint: null,
    onBeforeToggle: null,
    onBeforeUnload: null,
    onBlur: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onContextLost: null,
    onContextMenu: null,
    onContextRestored: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFormData: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLanguageChange: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadEnd: null,
    onLoadStart: null,
    onMessage: null,
    onMessageError: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRejectionHandled: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onScrollEnd: null,
    onSecurityPolicyViolation: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onSlotChange: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnhandledRejection: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onWheel: null,
    open: L,
    optimum: A,
    pattern: null,
    ping: D,
    placeholder: null,
    playsInline: L,
    popover: null,
    popoverTarget: null,
    popoverTargetAction: null,
    poster: null,
    preload: null,
    readOnly: L,
    referrerPolicy: null,
    rel: D,
    required: L,
    reversed: L,
    rows: A,
    rowSpan: A,
    sandbox: D,
    scope: null,
    scoped: L,
    seamless: L,
    selected: L,
    shadowRootClonable: L,
    shadowRootDelegatesFocus: L,
    shadowRootMode: null,
    shape: null,
    size: A,
    sizes: null,
    slot: null,
    span: A,
    spellCheck: U,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: null,
    start: A,
    step: null,
    style: null,
    tabIndex: A,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: L,
    useMap: null,
    value: U,
    width: A,
    wrap: null,
    writingSuggestions: null,
    // Legacy.
    // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
    align: null,
    // Several. Use CSS `text-align` instead,
    aLink: null,
    // `<body>`. Use CSS `a:active {color}` instead
    archive: D,
    // `<object>`. List of URIs to archives
    axis: null,
    // `<td>` and `<th>`. Use `scope` on `<th>`
    background: null,
    // `<body>`. Use CSS `background-image` instead
    bgColor: null,
    // `<body>` and table elements. Use CSS `background-color` instead
    border: A,
    // `<table>`. Use CSS `border-width` instead,
    borderColor: null,
    // `<table>`. Use CSS `border-color` instead,
    bottomMargin: A,
    // `<body>`
    cellPadding: null,
    // `<table>`
    cellSpacing: null,
    // `<table>`
    char: null,
    // Several table elements. When `align=char`, sets the character to align on
    charOff: null,
    // Several table elements. When `char`, offsets the alignment
    classId: null,
    // `<object>`
    clear: null,
    // `<br>`. Use CSS `clear` instead
    code: null,
    // `<object>`
    codeBase: null,
    // `<object>`
    codeType: null,
    // `<object>`
    color: null,
    // `<font>` and `<hr>`. Use CSS instead
    compact: L,
    // Lists. Use CSS to reduce space between items instead
    declare: L,
    // `<object>`
    event: null,
    // `<script>`
    face: null,
    // `<font>`. Use CSS instead
    frame: null,
    // `<table>`
    frameBorder: null,
    // `<iframe>`. Use CSS `border` instead
    hSpace: A,
    // `<img>` and `<object>`
    leftMargin: A,
    // `<body>`
    link: null,
    // `<body>`. Use CSS `a:link {color: *}` instead
    longDesc: null,
    // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
    lowSrc: null,
    // `<img>`. Use a `<picture>`
    marginHeight: A,
    // `<body>`
    marginWidth: A,
    // `<body>`
    noResize: L,
    // `<frame>`
    noHref: L,
    // `<area>`. Use no href instead of an explicit `nohref`
    noShade: L,
    // `<hr>`. Use background-color and height instead of borders
    noWrap: L,
    // `<td>` and `<th>`
    object: null,
    // `<applet>`
    profile: null,
    // `<head>`
    prompt: null,
    // `<isindex>`
    rev: null,
    // `<link>`
    rightMargin: A,
    // `<body>`
    rules: null,
    // `<table>`
    scheme: null,
    // `<meta>`
    scrolling: U,
    // `<frame>`. Use overflow in the child context
    standby: null,
    // `<object>`
    summary: null,
    // `<table>`
    text: null,
    // `<body>`. Use CSS `color` instead
    topMargin: A,
    // `<body>`
    valueType: null,
    // `<param>`
    version: null,
    // `<html>`. Use a doctype.
    vAlign: null,
    // Several. Use CSS `vertical-align` instead
    vLink: null,
    // `<body>`. Use CSS `a:visited {color}` instead
    vSpace: A,
    // `<img>` and `<object>`
    // Non-standard Properties.
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    disablePictureInPicture: L,
    disableRemotePlayback: L,
    prefix: null,
    property: null,
    results: A,
    security: null,
    unselectable: null
  }
}), Bo = Ge({
  space: "svg",
  attributes: {
    accentHeight: "accent-height",
    alignmentBaseline: "alignment-baseline",
    arabicForm: "arabic-form",
    baselineShift: "baseline-shift",
    capHeight: "cap-height",
    className: "class",
    clipPath: "clip-path",
    clipRule: "clip-rule",
    colorInterpolation: "color-interpolation",
    colorInterpolationFilters: "color-interpolation-filters",
    colorProfile: "color-profile",
    colorRendering: "color-rendering",
    crossOrigin: "crossorigin",
    dataType: "datatype",
    dominantBaseline: "dominant-baseline",
    enableBackground: "enable-background",
    fillOpacity: "fill-opacity",
    fillRule: "fill-rule",
    floodColor: "flood-color",
    floodOpacity: "flood-opacity",
    fontFamily: "font-family",
    fontSize: "font-size",
    fontSizeAdjust: "font-size-adjust",
    fontStretch: "font-stretch",
    fontStyle: "font-style",
    fontVariant: "font-variant",
    fontWeight: "font-weight",
    glyphName: "glyph-name",
    glyphOrientationHorizontal: "glyph-orientation-horizontal",
    glyphOrientationVertical: "glyph-orientation-vertical",
    hrefLang: "hreflang",
    horizAdvX: "horiz-adv-x",
    horizOriginX: "horiz-origin-x",
    horizOriginY: "horiz-origin-y",
    imageRendering: "image-rendering",
    letterSpacing: "letter-spacing",
    lightingColor: "lighting-color",
    markerEnd: "marker-end",
    markerMid: "marker-mid",
    markerStart: "marker-start",
    navDown: "nav-down",
    navDownLeft: "nav-down-left",
    navDownRight: "nav-down-right",
    navLeft: "nav-left",
    navNext: "nav-next",
    navPrev: "nav-prev",
    navRight: "nav-right",
    navUp: "nav-up",
    navUpLeft: "nav-up-left",
    navUpRight: "nav-up-right",
    onAbort: "onabort",
    onActivate: "onactivate",
    onAfterPrint: "onafterprint",
    onBeforePrint: "onbeforeprint",
    onBegin: "onbegin",
    onCancel: "oncancel",
    onCanPlay: "oncanplay",
    onCanPlayThrough: "oncanplaythrough",
    onChange: "onchange",
    onClick: "onclick",
    onClose: "onclose",
    onCopy: "oncopy",
    onCueChange: "oncuechange",
    onCut: "oncut",
    onDblClick: "ondblclick",
    onDrag: "ondrag",
    onDragEnd: "ondragend",
    onDragEnter: "ondragenter",
    onDragExit: "ondragexit",
    onDragLeave: "ondragleave",
    onDragOver: "ondragover",
    onDragStart: "ondragstart",
    onDrop: "ondrop",
    onDurationChange: "ondurationchange",
    onEmptied: "onemptied",
    onEnd: "onend",
    onEnded: "onended",
    onError: "onerror",
    onFocus: "onfocus",
    onFocusIn: "onfocusin",
    onFocusOut: "onfocusout",
    onHashChange: "onhashchange",
    onInput: "oninput",
    onInvalid: "oninvalid",
    onKeyDown: "onkeydown",
    onKeyPress: "onkeypress",
    onKeyUp: "onkeyup",
    onLoad: "onload",
    onLoadedData: "onloadeddata",
    onLoadedMetadata: "onloadedmetadata",
    onLoadStart: "onloadstart",
    onMessage: "onmessage",
    onMouseDown: "onmousedown",
    onMouseEnter: "onmouseenter",
    onMouseLeave: "onmouseleave",
    onMouseMove: "onmousemove",
    onMouseOut: "onmouseout",
    onMouseOver: "onmouseover",
    onMouseUp: "onmouseup",
    onMouseWheel: "onmousewheel",
    onOffline: "onoffline",
    onOnline: "ononline",
    onPageHide: "onpagehide",
    onPageShow: "onpageshow",
    onPaste: "onpaste",
    onPause: "onpause",
    onPlay: "onplay",
    onPlaying: "onplaying",
    onPopState: "onpopstate",
    onProgress: "onprogress",
    onRateChange: "onratechange",
    onRepeat: "onrepeat",
    onReset: "onreset",
    onResize: "onresize",
    onScroll: "onscroll",
    onSeeked: "onseeked",
    onSeeking: "onseeking",
    onSelect: "onselect",
    onShow: "onshow",
    onStalled: "onstalled",
    onStorage: "onstorage",
    onSubmit: "onsubmit",
    onSuspend: "onsuspend",
    onTimeUpdate: "ontimeupdate",
    onToggle: "ontoggle",
    onUnload: "onunload",
    onVolumeChange: "onvolumechange",
    onWaiting: "onwaiting",
    onZoom: "onzoom",
    overlinePosition: "overline-position",
    overlineThickness: "overline-thickness",
    paintOrder: "paint-order",
    panose1: "panose-1",
    pointerEvents: "pointer-events",
    referrerPolicy: "referrerpolicy",
    renderingIntent: "rendering-intent",
    shapeRendering: "shape-rendering",
    stopColor: "stop-color",
    stopOpacity: "stop-opacity",
    strikethroughPosition: "strikethrough-position",
    strikethroughThickness: "strikethrough-thickness",
    strokeDashArray: "stroke-dasharray",
    strokeDashOffset: "stroke-dashoffset",
    strokeLineCap: "stroke-linecap",
    strokeLineJoin: "stroke-linejoin",
    strokeMiterLimit: "stroke-miterlimit",
    strokeOpacity: "stroke-opacity",
    strokeWidth: "stroke-width",
    tabIndex: "tabindex",
    textAnchor: "text-anchor",
    textDecoration: "text-decoration",
    textRendering: "text-rendering",
    transformOrigin: "transform-origin",
    typeOf: "typeof",
    underlinePosition: "underline-position",
    underlineThickness: "underline-thickness",
    unicodeBidi: "unicode-bidi",
    unicodeRange: "unicode-range",
    unitsPerEm: "units-per-em",
    vAlphabetic: "v-alphabetic",
    vHanging: "v-hanging",
    vIdeographic: "v-ideographic",
    vMathematical: "v-mathematical",
    vectorEffect: "vector-effect",
    vertAdvY: "vert-adv-y",
    vertOriginX: "vert-origin-x",
    vertOriginY: "vert-origin-y",
    wordSpacing: "word-spacing",
    writingMode: "writing-mode",
    xHeight: "x-height",
    // These were camelcased in Tiny. Now lowercased in SVG 2
    playbackOrder: "playbackorder",
    timelineBegin: "timelinebegin"
  },
  transform: _s,
  properties: {
    about: J,
    accentHeight: A,
    accumulate: null,
    additive: null,
    alignmentBaseline: null,
    alphabetic: A,
    amplitude: A,
    arabicForm: null,
    ascent: A,
    attributeName: null,
    attributeType: null,
    azimuth: A,
    bandwidth: null,
    baselineShift: null,
    baseFrequency: null,
    baseProfile: null,
    bbox: null,
    begin: null,
    bias: A,
    by: null,
    calcMode: null,
    capHeight: A,
    className: D,
    clip: null,
    clipPath: null,
    clipPathUnits: null,
    clipRule: null,
    color: null,
    colorInterpolation: null,
    colorInterpolationFilters: null,
    colorProfile: null,
    colorRendering: null,
    content: null,
    contentScriptType: null,
    contentStyleType: null,
    crossOrigin: null,
    cursor: null,
    cx: null,
    cy: null,
    d: null,
    dataType: null,
    defaultAction: null,
    descent: A,
    diffuseConstant: A,
    direction: null,
    display: null,
    dur: null,
    divisor: A,
    dominantBaseline: null,
    download: L,
    dx: null,
    dy: null,
    edgeMode: null,
    editable: null,
    elevation: A,
    enableBackground: null,
    end: null,
    event: null,
    exponent: A,
    externalResourcesRequired: null,
    fill: null,
    fillOpacity: A,
    fillRule: null,
    filter: null,
    filterRes: null,
    filterUnits: null,
    floodColor: null,
    floodOpacity: null,
    focusable: null,
    focusHighlight: null,
    fontFamily: null,
    fontSize: null,
    fontSizeAdjust: null,
    fontStretch: null,
    fontStyle: null,
    fontVariant: null,
    fontWeight: null,
    format: null,
    fr: null,
    from: null,
    fx: null,
    fy: null,
    g1: He,
    g2: He,
    glyphName: He,
    glyphOrientationHorizontal: null,
    glyphOrientationVertical: null,
    glyphRef: null,
    gradientTransform: null,
    gradientUnits: null,
    handler: null,
    hanging: A,
    hatchContentUnits: null,
    hatchUnits: null,
    height: null,
    href: null,
    hrefLang: null,
    horizAdvX: A,
    horizOriginX: A,
    horizOriginY: A,
    id: null,
    ideographic: A,
    imageRendering: null,
    initialVisibility: null,
    in: null,
    in2: null,
    intercept: A,
    k: A,
    k1: A,
    k2: A,
    k3: A,
    k4: A,
    kernelMatrix: J,
    kernelUnitLength: null,
    keyPoints: null,
    // SEMI_COLON_SEPARATED
    keySplines: null,
    // SEMI_COLON_SEPARATED
    keyTimes: null,
    // SEMI_COLON_SEPARATED
    kerning: null,
    lang: null,
    lengthAdjust: null,
    letterSpacing: null,
    lightingColor: null,
    limitingConeAngle: A,
    local: null,
    markerEnd: null,
    markerMid: null,
    markerStart: null,
    markerHeight: null,
    markerUnits: null,
    markerWidth: null,
    mask: null,
    maskContentUnits: null,
    maskUnits: null,
    mathematical: null,
    max: null,
    media: null,
    mediaCharacterEncoding: null,
    mediaContentEncodings: null,
    mediaSize: A,
    mediaTime: null,
    method: null,
    min: null,
    mode: null,
    name: null,
    navDown: null,
    navDownLeft: null,
    navDownRight: null,
    navLeft: null,
    navNext: null,
    navPrev: null,
    navRight: null,
    navUp: null,
    navUpLeft: null,
    navUpRight: null,
    numOctaves: null,
    observer: null,
    offset: null,
    onAbort: null,
    onActivate: null,
    onAfterPrint: null,
    onBeforePrint: null,
    onBegin: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnd: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFocusIn: null,
    onFocusOut: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadStart: null,
    onMessage: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onMouseWheel: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRepeat: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onShow: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onZoom: null,
    opacity: null,
    operator: null,
    order: null,
    orient: null,
    orientation: null,
    origin: null,
    overflow: null,
    overlay: null,
    overlinePosition: A,
    overlineThickness: A,
    paintOrder: null,
    panose1: null,
    path: null,
    pathLength: A,
    patternContentUnits: null,
    patternTransform: null,
    patternUnits: null,
    phase: null,
    ping: D,
    pitch: null,
    playbackOrder: null,
    pointerEvents: null,
    points: null,
    pointsAtX: A,
    pointsAtY: A,
    pointsAtZ: A,
    preserveAlpha: null,
    preserveAspectRatio: null,
    primitiveUnits: null,
    propagate: null,
    property: J,
    r: null,
    radius: null,
    referrerPolicy: null,
    refX: null,
    refY: null,
    rel: J,
    rev: J,
    renderingIntent: null,
    repeatCount: null,
    repeatDur: null,
    requiredExtensions: J,
    requiredFeatures: J,
    requiredFonts: J,
    requiredFormats: J,
    resource: null,
    restart: null,
    result: null,
    rotate: null,
    rx: null,
    ry: null,
    scale: null,
    seed: null,
    shapeRendering: null,
    side: null,
    slope: null,
    snapshotTime: null,
    specularConstant: A,
    specularExponent: A,
    spreadMethod: null,
    spacing: null,
    startOffset: null,
    stdDeviation: null,
    stemh: null,
    stemv: null,
    stitchTiles: null,
    stopColor: null,
    stopOpacity: null,
    strikethroughPosition: A,
    strikethroughThickness: A,
    string: null,
    stroke: null,
    strokeDashArray: J,
    strokeDashOffset: null,
    strokeLineCap: null,
    strokeLineJoin: null,
    strokeMiterLimit: A,
    strokeOpacity: A,
    strokeWidth: null,
    style: null,
    surfaceScale: A,
    syncBehavior: null,
    syncBehaviorDefault: null,
    syncMaster: null,
    syncTolerance: null,
    syncToleranceDefault: null,
    systemLanguage: J,
    tabIndex: A,
    tableValues: null,
    target: null,
    targetX: A,
    targetY: A,
    textAnchor: null,
    textDecoration: null,
    textRendering: null,
    textLength: null,
    timelineBegin: null,
    title: null,
    transformBehavior: null,
    type: null,
    typeOf: J,
    to: null,
    transform: null,
    transformOrigin: null,
    u1: null,
    u2: null,
    underlinePosition: A,
    underlineThickness: A,
    unicode: null,
    unicodeBidi: null,
    unicodeRange: null,
    unitsPerEm: A,
    values: null,
    vAlphabetic: A,
    vMathematical: A,
    vectorEffect: null,
    vHanging: A,
    vIdeographic: A,
    version: null,
    vertAdvY: A,
    vertOriginX: A,
    vertOriginY: A,
    viewBox: null,
    viewTarget: null,
    visibility: null,
    width: null,
    widths: null,
    wordSpacing: null,
    writingMode: null,
    x: null,
    x1: null,
    x2: null,
    xChannelSelector: null,
    xHeight: A,
    y: null,
    y1: null,
    y2: null,
    yChannelSelector: null,
    z: null,
    zoomAndPan: null
  }
}), Ho = /^data[-\w.:]+$/i, Zr = /-[a-z]/g, Fo = /[A-Z]/g;
function ar(e, t) {
  const n = mt(t);
  let r = t, s = re;
  if (n in e.normal)
    return e.property[e.normal[n]];
  if (n.length > 4 && n.slice(0, 4) === "data" && Ho.test(t)) {
    if (t.charAt(4) === "-") {
      const i = t.slice(5).replace(Zr, Yo);
      r = "data" + i.charAt(0).toUpperCase() + i.slice(1);
    } else {
      const i = t.slice(4);
      if (!Zr.test(i)) {
        let u = i.replace(Fo, $o);
        u.charAt(0) !== "-" && (u = "-" + u), t = "data" + u;
      }
    }
    s = rr;
  }
  return new s(r, t);
}
function $o(e) {
  return "-" + e.toLowerCase();
}
function Yo(e) {
  return e.charAt(1).toUpperCase();
}
const en = bs([Ts, gs, ys, Cs, Uo], "html"), At = bs([Ts, gs, ys, Cs, Bo], "svg");
function ea(e) {
  const t = [], n = String(e || "");
  let r = n.indexOf(","), s = 0, i = !1;
  for (; !i; ) {
    r === -1 && (r = n.length, i = !0);
    const u = n.slice(s, r).trim();
    (u || !i) && t.push(u), s = r + 1, r = n.indexOf(",", s);
  }
  return t;
}
function qo(e, t) {
  const n = t || {};
  return (e[e.length - 1] === "" ? [...e, ""] : e).join(
    (n.padRight ? " " : "") + "," + (n.padLeft === !1 ? "" : " ")
  ).trim();
}
const ta = /[#.]/g;
function zo(e, t) {
  const n = e || "", r = {};
  let s = 0, i, u;
  for (; s < n.length; ) {
    ta.lastIndex = s;
    const c = ta.exec(n), d = n.slice(s, c ? c.index : n.length);
    d && (i ? i === "#" ? r.id = d : Array.isArray(r.className) ? r.className.push(d) : r.className = [d] : u = d, s += d.length), c && (i = c[0], s++);
  }
  return {
    type: "element",
    // @ts-expect-error: tag name is parsed.
    tagName: u || t || "div",
    properties: r,
    children: []
  };
}
function na(e) {
  const t = String(e || "").trim();
  return t ? t.split(/[ \t\n\r\f]+/g) : [];
}
function Wo(e) {
  return e.join(" ").trim();
}
const Vo = /* @__PURE__ */ new Set(["button", "menu", "reset", "submit"]), Bn = {}.hasOwnProperty;
function Ns(e, t, n) {
  const r = n && Xo(n);
  function s(i, u, ...c) {
    let d = -1, f;
    if (i == null) {
      f = { type: "root", children: [] };
      const p = (
        /** @type {Child} */
        u
      );
      c.unshift(p);
    } else if (f = zo(i, t), f.tagName = f.tagName.toLowerCase(), r && Bn.call(r, f.tagName) && (f.tagName = r[f.tagName]), Go(u, f.tagName)) {
      let p;
      for (p in u)
        Bn.call(u, p) && Qo(e, f.properties, p, u[p]);
    } else
      c.unshift(u);
    for (; ++d < c.length; )
      Hn(f.children, c[d]);
    return f.type === "element" && f.tagName === "template" && (f.content = { type: "root", children: f.children }, f.children = []), f;
  }
  return s;
}
function Go(e, t) {
  return e == null || typeof e != "object" || Array.isArray(e) ? !1 : t === "input" || !e.type || typeof e.type != "string" ? !0 : "children" in e && Array.isArray(e.children) ? !1 : t === "button" ? Vo.has(e.type.toLowerCase()) : !("value" in e);
}
function Qo(e, t, n, r) {
  const s = ar(e, n);
  let i = -1, u;
  if (r != null) {
    if (typeof r == "number") {
      if (Number.isNaN(r))
        return;
      u = r;
    } else
      typeof r == "boolean" ? u = r : typeof r == "string" ? s.spaceSeparated ? u = na(r) : s.commaSeparated ? u = ea(r) : s.commaOrSpaceSeparated ? u = na(ea(r).join(" ")) : u = ra(s, s.property, r) : Array.isArray(r) ? u = r.concat() : u = s.property === "style" ? jo(r) : String(r);
    if (Array.isArray(u)) {
      const c = [];
      for (; ++i < u.length; ) {
        const d = (
          /** @type {number | string} */
          ra(s, s.property, u[i])
        );
        c[i] = d;
      }
      u = c;
    }
    if (s.property === "className" && Array.isArray(t.className)) {
      const c = (
        /** @type {number | string} */
        u
      );
      u = t.className.concat(c);
    }
    t[s.property] = u;
  }
}
function Hn(e, t) {
  let n = -1;
  if (t != null)
    if (typeof t == "string" || typeof t == "number")
      e.push({ type: "text", value: String(t) });
    else if (Array.isArray(t))
      for (; ++n < t.length; )
        Hn(e, t[n]);
    else if (typeof t == "object" && "type" in t)
      t.type === "root" ? Hn(e, t.children) : e.push(t);
    else
      throw new Error("Expected node, nodes, or string, got `" + t + "`");
}
function ra(e, t, n) {
  if (typeof n == "string") {
    if (e.number && n && !Number.isNaN(Number(n)))
      return Number(n);
    if ((e.boolean || e.overloadedBoolean) && (n === "" || mt(n) === mt(t)))
      return !0;
  }
  return n;
}
function jo(e) {
  const t = [];
  let n;
  for (n in e)
    Bn.call(e, n) && t.push([n, e[n]].join(": "));
  return t.join("; ");
}
function Xo(e) {
  const t = {};
  let n = -1;
  for (; ++n < e.length; )
    t[e[n].toLowerCase()] = e[n];
  return t;
}
const Ko = [
  "altGlyph",
  "altGlyphDef",
  "altGlyphItem",
  "animateColor",
  "animateMotion",
  "animateTransform",
  "clipPath",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "foreignObject",
  "glyphRef",
  "linearGradient",
  "radialGradient",
  "solidColor",
  "textArea",
  "textPath"
], Jo = Ns(en, "div"), Zo = Ns(At, "g", Ko);
function ec(e) {
  const t = String(e), n = [];
  return { toOffset: s, toPoint: r };
  function r(i) {
    if (typeof i == "number" && i > -1 && i <= t.length) {
      let u = 0;
      for (; ; ) {
        let c = n[u];
        if (c === void 0) {
          const d = aa(t, n[u - 1]);
          c = d === -1 ? t.length + 1 : d + 1, n[u] = c;
        }
        if (c > i)
          return {
            line: u + 1,
            column: i - (u > 0 ? n[u - 1] : 0) + 1,
            offset: i
          };
        u++;
      }
    }
  }
  function s(i) {
    if (i && typeof i.line == "number" && typeof i.column == "number" && !Number.isNaN(i.line) && !Number.isNaN(i.column)) {
      for (; n.length < i.line; ) {
        const c = n[n.length - 1], d = aa(t, c), f = d === -1 ? t.length + 1 : d + 1;
        if (c === f)
          break;
        n.push(f);
      }
      const u = (i.line > 1 ? n[i.line - 2] : 0) + i.column - 1;
      if (u < n[i.line - 1])
        return u;
    }
  }
}
function aa(e, t) {
  const n = e.indexOf("\r", t), r = e.indexOf(`
`, t);
  return r === -1 ? n : n === -1 || n + 1 === r ? r : n < r ? n : r;
}
const tc = {
  html: "http://www.w3.org/1999/xhtml",
  mathml: "http://www.w3.org/1998/Math/MathML",
  svg: "http://www.w3.org/2000/svg",
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
}, Is = {}.hasOwnProperty, nc = Object.prototype;
function rc(e, t) {
  const n = t || {};
  return sr(
    {
      file: n.file || void 0,
      location: !1,
      schema: n.space === "svg" ? At : en,
      verbose: n.verbose || !1
    },
    e
  );
}
function sr(e, t) {
  let n;
  switch (t.nodeName) {
    case "#comment": {
      const r = (
        /** @type {P5Comment} */
        t
      );
      return n = { type: "comment", value: r.data }, Ht(e, r, n), n;
    }
    case "#document":
    case "#document-fragment": {
      const r = (
        /** @type {P5Document | P5DocumentFragment} */
        t
      ), s = "mode" in r ? r.mode === "quirks" || r.mode === "limited-quirks" : !1;
      if (n = {
        type: "root",
        children: xs(e, t.childNodes),
        data: { quirksMode: s }
      }, e.file && e.location) {
        const i = String(e.file), u = ec(i), c = u.toPoint(0), d = u.toPoint(i.length);
        n.position = { start: c, end: d };
      }
      return n;
    }
    case "#documentType": {
      const r = (
        /** @type {P5DocumentType} */
        t
      );
      return n = { type: "doctype" }, Ht(e, r, n), n;
    }
    case "#text": {
      const r = (
        /** @type {P5Text} */
        t
      );
      return n = { type: "text", value: r.value }, Ht(e, r, n), n;
    }
    default:
      return n = ac(
        e,
        /** @type {P5Element} */
        t
      ), n;
  }
}
function xs(e, t) {
  let n = -1;
  const r = [];
  for (; ++n < t.length; ) {
    const s = (
      /** @type {RootContent} */
      sr(e, t[n])
    );
    r.push(s);
  }
  return r;
}
function ac(e, t) {
  const n = e.schema;
  e.schema = t.namespaceURI === tc.svg ? At : en;
  let r = -1;
  const s = {};
  for (; ++r < t.attrs.length; ) {
    const c = t.attrs[r], d = (c.prefix ? c.prefix + ":" : "") + c.name;
    Is.call(nc, d) || (s[d] = c.value);
  }
  const u = (e.schema.space === "svg" ? Zo : Jo)(t.tagName, s, xs(e, t.childNodes));
  if (Ht(e, t, u), u.tagName === "template") {
    const c = (
      /** @type {P5Template} */
      t
    ), d = c.sourceCodeLocation, f = d && d.startTag && Be(d.startTag), p = d && d.endTag && Be(d.endTag), b = (
      /** @type {Root} */
      sr(e, c.content)
    );
    f && p && e.file && (b.position = { start: f.end, end: p.start }), u.content = b;
  }
  return e.schema = n, u;
}
function Ht(e, t, n) {
  if ("sourceCodeLocation" in t && t.sourceCodeLocation && e.file) {
    const r = sc(e, n, t.sourceCodeLocation);
    r && (e.location = !0, n.position = r);
  }
}
function sc(e, t, n) {
  const r = Be(n);
  if (t.type === "element") {
    const s = t.children[t.children.length - 1];
    if (r && !n.endTag && s && s.position && s.position.end && (r.end = Object.assign({}, s.position.end)), e.verbose) {
      const i = {};
      let u;
      if (n.attrs)
        for (u in n.attrs)
          Is.call(n.attrs, u) && (i[ar(e.schema, u).property] = Be(
            n.attrs[u]
          ));
      n.startTag;
      const c = Be(n.startTag), d = n.endTag ? Be(n.endTag) : void 0, f = { opening: c };
      d && (f.closing = d), f.properties = i, t.data = { position: f };
    }
  }
  return r;
}
function Be(e) {
  const t = sa({
    line: e.startLine,
    column: e.startCol,
    offset: e.startOffset
  }), n = sa({
    line: e.endLine,
    column: e.endCol,
    offset: e.endOffset
  });
  return t || n ? { start: t, end: n } : void 0;
}
function sa(e) {
  return e.line && e.column ? e : void 0;
}
const ic = /* @__PURE__ */ new Set([
  65534,
  65535,
  131070,
  131071,
  196606,
  196607,
  262142,
  262143,
  327678,
  327679,
  393214,
  393215,
  458750,
  458751,
  524286,
  524287,
  589822,
  589823,
  655358,
  655359,
  720894,
  720895,
  786430,
  786431,
  851966,
  851967,
  917502,
  917503,
  983038,
  983039,
  1048574,
  1048575,
  1114110,
  1114111
]), P = "�";
var o;
(function(e) {
  e[e.EOF = -1] = "EOF", e[e.NULL = 0] = "NULL", e[e.TABULATION = 9] = "TABULATION", e[e.CARRIAGE_RETURN = 13] = "CARRIAGE_RETURN", e[e.LINE_FEED = 10] = "LINE_FEED", e[e.FORM_FEED = 12] = "FORM_FEED", e[e.SPACE = 32] = "SPACE", e[e.EXCLAMATION_MARK = 33] = "EXCLAMATION_MARK", e[e.QUOTATION_MARK = 34] = "QUOTATION_MARK", e[e.NUMBER_SIGN = 35] = "NUMBER_SIGN", e[e.AMPERSAND = 38] = "AMPERSAND", e[e.APOSTROPHE = 39] = "APOSTROPHE", e[e.HYPHEN_MINUS = 45] = "HYPHEN_MINUS", e[e.SOLIDUS = 47] = "SOLIDUS", e[e.DIGIT_0 = 48] = "DIGIT_0", e[e.DIGIT_9 = 57] = "DIGIT_9", e[e.SEMICOLON = 59] = "SEMICOLON", e[e.LESS_THAN_SIGN = 60] = "LESS_THAN_SIGN", e[e.EQUALS_SIGN = 61] = "EQUALS_SIGN", e[e.GREATER_THAN_SIGN = 62] = "GREATER_THAN_SIGN", e[e.QUESTION_MARK = 63] = "QUESTION_MARK", e[e.LATIN_CAPITAL_A = 65] = "LATIN_CAPITAL_A", e[e.LATIN_CAPITAL_F = 70] = "LATIN_CAPITAL_F", e[e.LATIN_CAPITAL_X = 88] = "LATIN_CAPITAL_X", e[e.LATIN_CAPITAL_Z = 90] = "LATIN_CAPITAL_Z", e[e.RIGHT_SQUARE_BRACKET = 93] = "RIGHT_SQUARE_BRACKET", e[e.GRAVE_ACCENT = 96] = "GRAVE_ACCENT", e[e.LATIN_SMALL_A = 97] = "LATIN_SMALL_A", e[e.LATIN_SMALL_F = 102] = "LATIN_SMALL_F", e[e.LATIN_SMALL_X = 120] = "LATIN_SMALL_X", e[e.LATIN_SMALL_Z = 122] = "LATIN_SMALL_Z", e[e.REPLACEMENT_CHARACTER = 65533] = "REPLACEMENT_CHARACTER";
})(o = o || (o = {}));
const Q = {
  DASH_DASH: "--",
  CDATA_START: "[CDATA[",
  DOCTYPE: "doctype",
  SCRIPT: "script",
  PUBLIC: "public",
  SYSTEM: "system"
};
function Ss(e) {
  return e >= 55296 && e <= 57343;
}
function uc(e) {
  return e >= 56320 && e <= 57343;
}
function oc(e, t) {
  return (e - 55296) * 1024 + 9216 + t;
}
function ws(e) {
  return e !== 32 && e !== 10 && e !== 13 && e !== 9 && e !== 12 && e >= 1 && e <= 31 || e >= 127 && e <= 159;
}
function Rs(e) {
  return e >= 64976 && e <= 65007 || ic.has(e);
}
var E;
(function(e) {
  e.controlCharacterInInputStream = "control-character-in-input-stream", e.noncharacterInInputStream = "noncharacter-in-input-stream", e.surrogateInInputStream = "surrogate-in-input-stream", e.nonVoidHtmlElementStartTagWithTrailingSolidus = "non-void-html-element-start-tag-with-trailing-solidus", e.endTagWithAttributes = "end-tag-with-attributes", e.endTagWithTrailingSolidus = "end-tag-with-trailing-solidus", e.unexpectedSolidusInTag = "unexpected-solidus-in-tag", e.unexpectedNullCharacter = "unexpected-null-character", e.unexpectedQuestionMarkInsteadOfTagName = "unexpected-question-mark-instead-of-tag-name", e.invalidFirstCharacterOfTagName = "invalid-first-character-of-tag-name", e.unexpectedEqualsSignBeforeAttributeName = "unexpected-equals-sign-before-attribute-name", e.missingEndTagName = "missing-end-tag-name", e.unexpectedCharacterInAttributeName = "unexpected-character-in-attribute-name", e.unknownNamedCharacterReference = "unknown-named-character-reference", e.missingSemicolonAfterCharacterReference = "missing-semicolon-after-character-reference", e.unexpectedCharacterAfterDoctypeSystemIdentifier = "unexpected-character-after-doctype-system-identifier", e.unexpectedCharacterInUnquotedAttributeValue = "unexpected-character-in-unquoted-attribute-value", e.eofBeforeTagName = "eof-before-tag-name", e.eofInTag = "eof-in-tag", e.missingAttributeValue = "missing-attribute-value", e.missingWhitespaceBetweenAttributes = "missing-whitespace-between-attributes", e.missingWhitespaceAfterDoctypePublicKeyword = "missing-whitespace-after-doctype-public-keyword", e.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers = "missing-whitespace-between-doctype-public-and-system-identifiers", e.missingWhitespaceAfterDoctypeSystemKeyword = "missing-whitespace-after-doctype-system-keyword", e.missingQuoteBeforeDoctypePublicIdentifier = "missing-quote-before-doctype-public-identifier", e.missingQuoteBeforeDoctypeSystemIdentifier = "missing-quote-before-doctype-system-identifier", e.missingDoctypePublicIdentifier = "missing-doctype-public-identifier", e.missingDoctypeSystemIdentifier = "missing-doctype-system-identifier", e.abruptDoctypePublicIdentifier = "abrupt-doctype-public-identifier", e.abruptDoctypeSystemIdentifier = "abrupt-doctype-system-identifier", e.cdataInHtmlContent = "cdata-in-html-content", e.incorrectlyOpenedComment = "incorrectly-opened-comment", e.eofInScriptHtmlCommentLikeText = "eof-in-script-html-comment-like-text", e.eofInDoctype = "eof-in-doctype", e.nestedComment = "nested-comment", e.abruptClosingOfEmptyComment = "abrupt-closing-of-empty-comment", e.eofInComment = "eof-in-comment", e.incorrectlyClosedComment = "incorrectly-closed-comment", e.eofInCdata = "eof-in-cdata", e.absenceOfDigitsInNumericCharacterReference = "absence-of-digits-in-numeric-character-reference", e.nullCharacterReference = "null-character-reference", e.surrogateCharacterReference = "surrogate-character-reference", e.characterReferenceOutsideUnicodeRange = "character-reference-outside-unicode-range", e.controlCharacterReference = "control-character-reference", e.noncharacterCharacterReference = "noncharacter-character-reference", e.missingWhitespaceBeforeDoctypeName = "missing-whitespace-before-doctype-name", e.missingDoctypeName = "missing-doctype-name", e.invalidCharacterSequenceAfterDoctypeName = "invalid-character-sequence-after-doctype-name", e.duplicateAttribute = "duplicate-attribute", e.nonConformingDoctype = "non-conforming-doctype", e.missingDoctype = "missing-doctype", e.misplacedDoctype = "misplaced-doctype", e.endTagWithoutMatchingOpenElement = "end-tag-without-matching-open-element", e.closingOfElementWithOpenChildElements = "closing-of-element-with-open-child-elements", e.disallowedContentInNoscriptInHead = "disallowed-content-in-noscript-in-head", e.openElementsLeftAfterEof = "open-elements-left-after-eof", e.abandonedHeadElementChild = "abandoned-head-element-child", e.misplacedStartTagForHeadElement = "misplaced-start-tag-for-head-element", e.nestedNoscriptInHead = "nested-noscript-in-head", e.eofInElementThatCanContainOnlyText = "eof-in-element-that-can-contain-only-text";
})(E = E || (E = {}));
const cc = 65536;
class lc {
  constructor(t) {
    this.handler = t, this.html = "", this.pos = -1, this.lastGapPos = -2, this.gapStack = [], this.skipNextNewLine = !1, this.lastChunkWritten = !1, this.endOfChunkHit = !1, this.bufferWaterline = cc, this.isEol = !1, this.lineStartPos = 0, this.droppedBufferSize = 0, this.line = 1, this.lastErrOffset = -1;
  }
  /** The column on the current line. If we just saw a gap (eg. a surrogate pair), return the index before. */
  get col() {
    return this.pos - this.lineStartPos + +(this.lastGapPos !== this.pos);
  }
  get offset() {
    return this.droppedBufferSize + this.pos;
  }
  getError(t) {
    const { line: n, col: r, offset: s } = this;
    return {
      code: t,
      startLine: n,
      endLine: n,
      startCol: r,
      endCol: r,
      startOffset: s,
      endOffset: s
    };
  }
  _err(t) {
    this.handler.onParseError && this.lastErrOffset !== this.offset && (this.lastErrOffset = this.offset, this.handler.onParseError(this.getError(t)));
  }
  _addGap() {
    this.gapStack.push(this.lastGapPos), this.lastGapPos = this.pos;
  }
  _processSurrogate(t) {
    if (this.pos !== this.html.length - 1) {
      const n = this.html.charCodeAt(this.pos + 1);
      if (uc(n))
        return this.pos++, this._addGap(), oc(t, n);
    } else if (!this.lastChunkWritten)
      return this.endOfChunkHit = !0, o.EOF;
    return this._err(E.surrogateInInputStream), t;
  }
  willDropParsedChunk() {
    return this.pos > this.bufferWaterline;
  }
  dropParsedChunk() {
    this.willDropParsedChunk() && (this.html = this.html.substring(this.pos), this.lineStartPos -= this.pos, this.droppedBufferSize += this.pos, this.pos = 0, this.lastGapPos = -2, this.gapStack.length = 0);
  }
  write(t, n) {
    this.html.length > 0 ? this.html += t : this.html = t, this.endOfChunkHit = !1, this.lastChunkWritten = n;
  }
  insertHtmlAtCurrentPos(t) {
    this.html = this.html.substring(0, this.pos + 1) + t + this.html.substring(this.pos + 1), this.endOfChunkHit = !1;
  }
  startsWith(t, n) {
    if (this.pos + t.length > this.html.length)
      return this.endOfChunkHit = !this.lastChunkWritten, !1;
    if (n)
      return this.html.startsWith(t, this.pos);
    for (let r = 0; r < t.length; r++)
      if ((this.html.charCodeAt(this.pos + r) | 32) !== t.charCodeAt(r))
        return !1;
    return !0;
  }
  peek(t) {
    const n = this.pos + t;
    if (n >= this.html.length)
      return this.endOfChunkHit = !this.lastChunkWritten, o.EOF;
    const r = this.html.charCodeAt(n);
    return r === o.CARRIAGE_RETURN ? o.LINE_FEED : r;
  }
  advance() {
    if (this.pos++, this.isEol && (this.isEol = !1, this.line++, this.lineStartPos = this.pos), this.pos >= this.html.length)
      return this.endOfChunkHit = !this.lastChunkWritten, o.EOF;
    let t = this.html.charCodeAt(this.pos);
    return t === o.CARRIAGE_RETURN ? (this.isEol = !0, this.skipNextNewLine = !0, o.LINE_FEED) : t === o.LINE_FEED && (this.isEol = !0, this.skipNextNewLine) ? (this.line--, this.skipNextNewLine = !1, this._addGap(), this.advance()) : (this.skipNextNewLine = !1, Ss(t) && (t = this._processSurrogate(t)), this.handler.onParseError === null || t > 31 && t < 127 || t === o.LINE_FEED || t === o.CARRIAGE_RETURN || t > 159 && t < 64976 || this._checkForProblematicCharacters(t), t);
  }
  _checkForProblematicCharacters(t) {
    ws(t) ? this._err(E.controlCharacterInInputStream) : Rs(t) && this._err(E.noncharacterInInputStream);
  }
  retreat(t) {
    for (this.pos -= t; this.pos < this.lastGapPos; )
      this.lastGapPos = this.gapStack.pop(), this.pos--;
    this.isEol = !1;
  }
}
var O;
(function(e) {
  e[e.CHARACTER = 0] = "CHARACTER", e[e.NULL_CHARACTER = 1] = "NULL_CHARACTER", e[e.WHITESPACE_CHARACTER = 2] = "WHITESPACE_CHARACTER", e[e.START_TAG = 3] = "START_TAG", e[e.END_TAG = 4] = "END_TAG", e[e.COMMENT = 5] = "COMMENT", e[e.DOCTYPE = 6] = "DOCTYPE", e[e.EOF = 7] = "EOF", e[e.HIBERNATION = 8] = "HIBERNATION";
})(O = O || (O = {}));
function Ls(e, t) {
  for (let n = e.attrs.length - 1; n >= 0; n--)
    if (e.attrs[n].name === t)
      return e.attrs[n].value;
  return null;
}
const Ee = new Uint16Array(
  // prettier-ignore
  'ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻 ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌'.split("").map((e) => e.charCodeAt(0))
), dc = new Uint16Array(
  // prettier-ignore
  "Ȁaglq	\x1Bɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map((e) => e.charCodeAt(0))
);
var mn;
const hc = /* @__PURE__ */ new Map([
  [0, 65533],
  // C1 Unicode control character reference replacements
  [128, 8364],
  [130, 8218],
  [131, 402],
  [132, 8222],
  [133, 8230],
  [134, 8224],
  [135, 8225],
  [136, 710],
  [137, 8240],
  [138, 352],
  [139, 8249],
  [140, 338],
  [142, 381],
  [145, 8216],
  [146, 8217],
  [147, 8220],
  [148, 8221],
  [149, 8226],
  [150, 8211],
  [151, 8212],
  [152, 732],
  [153, 8482],
  [154, 353],
  [155, 8250],
  [156, 339],
  [158, 382],
  [159, 376]
]), fc = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, node/no-unsupported-features/es-builtins
  (mn = String.fromCodePoint) !== null && mn !== void 0 ? mn : function(e) {
    let t = "";
    return e > 65535 && (e -= 65536, t += String.fromCharCode(e >>> 10 & 1023 | 55296), e = 56320 | e & 1023), t += String.fromCharCode(e), t;
  }
);
function pc(e) {
  var t;
  return e >= 55296 && e <= 57343 || e > 1114111 ? 65533 : (t = hc.get(e)) !== null && t !== void 0 ? t : e;
}
var $;
(function(e) {
  e[e.NUM = 35] = "NUM", e[e.SEMI = 59] = "SEMI", e[e.EQUALS = 61] = "EQUALS", e[e.ZERO = 48] = "ZERO", e[e.NINE = 57] = "NINE", e[e.LOWER_A = 97] = "LOWER_A", e[e.LOWER_F = 102] = "LOWER_F", e[e.LOWER_X = 120] = "LOWER_X", e[e.LOWER_Z = 122] = "LOWER_Z", e[e.UPPER_A = 65] = "UPPER_A", e[e.UPPER_F = 70] = "UPPER_F", e[e.UPPER_Z = 90] = "UPPER_Z";
})($ || ($ = {}));
const mc = 32;
var de;
(function(e) {
  e[e.VALUE_LENGTH = 49152] = "VALUE_LENGTH", e[e.BRANCH_LENGTH = 16256] = "BRANCH_LENGTH", e[e.JUMP_TABLE = 127] = "JUMP_TABLE";
})(de || (de = {}));
function Fn(e) {
  return e >= $.ZERO && e <= $.NINE;
}
function bc(e) {
  return e >= $.UPPER_A && e <= $.UPPER_F || e >= $.LOWER_A && e <= $.LOWER_F;
}
function Ec(e) {
  return e >= $.UPPER_A && e <= $.UPPER_Z || e >= $.LOWER_A && e <= $.LOWER_Z || Fn(e);
}
function gc(e) {
  return e === $.EQUALS || Ec(e);
}
var H;
(function(e) {
  e[e.EntityStart = 0] = "EntityStart", e[e.NumericStart = 1] = "NumericStart", e[e.NumericDecimal = 2] = "NumericDecimal", e[e.NumericHex = 3] = "NumericHex", e[e.NamedEntity = 4] = "NamedEntity";
})(H || (H = {}));
var Ie;
(function(e) {
  e[e.Legacy = 0] = "Legacy", e[e.Strict = 1] = "Strict", e[e.Attribute = 2] = "Attribute";
})(Ie || (Ie = {}));
class Tc {
  constructor(t, n, r) {
    this.decodeTree = t, this.emitCodePoint = n, this.errors = r, this.state = H.EntityStart, this.consumed = 1, this.result = 0, this.treeIndex = 0, this.excess = 1, this.decodeMode = Ie.Strict;
  }
  /** Resets the instance to make it reusable. */
  startEntity(t) {
    this.decodeMode = t, this.state = H.EntityStart, this.result = 0, this.treeIndex = 0, this.excess = 1, this.consumed = 1;
  }
  /**
   * Write an entity to the decoder. This can be called multiple times with partial entities.
   * If the entity is incomplete, the decoder will return -1.
   *
   * Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
   * entity is incomplete, and resume when the next string is written.
   *
   * @param string The string containing the entity (or a continuation of the entity).
   * @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  write(t, n) {
    switch (this.state) {
      case H.EntityStart:
        return t.charCodeAt(n) === $.NUM ? (this.state = H.NumericStart, this.consumed += 1, this.stateNumericStart(t, n + 1)) : (this.state = H.NamedEntity, this.stateNamedEntity(t, n));
      case H.NumericStart:
        return this.stateNumericStart(t, n);
      case H.NumericDecimal:
        return this.stateNumericDecimal(t, n);
      case H.NumericHex:
        return this.stateNumericHex(t, n);
      case H.NamedEntity:
        return this.stateNamedEntity(t, n);
    }
  }
  /**
   * Switches between the numeric decimal and hexadecimal states.
   *
   * Equivalent to the `Numeric character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericStart(t, n) {
    return n >= t.length ? -1 : (t.charCodeAt(n) | mc) === $.LOWER_X ? (this.state = H.NumericHex, this.consumed += 1, this.stateNumericHex(t, n + 1)) : (this.state = H.NumericDecimal, this.stateNumericDecimal(t, n));
  }
  addToNumericResult(t, n, r, s) {
    if (n !== r) {
      const i = r - n;
      this.result = this.result * Math.pow(s, i) + parseInt(t.substr(n, i), s), this.consumed += i;
    }
  }
  /**
   * Parses a hexadecimal numeric entity.
   *
   * Equivalent to the `Hexademical character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericHex(t, n) {
    const r = n;
    for (; n < t.length; ) {
      const s = t.charCodeAt(n);
      if (Fn(s) || bc(s))
        n += 1;
      else
        return this.addToNumericResult(t, r, n, 16), this.emitNumericEntity(s, 3);
    }
    return this.addToNumericResult(t, r, n, 16), -1;
  }
  /**
   * Parses a decimal numeric entity.
   *
   * Equivalent to the `Decimal character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericDecimal(t, n) {
    const r = n;
    for (; n < t.length; ) {
      const s = t.charCodeAt(n);
      if (Fn(s))
        n += 1;
      else
        return this.addToNumericResult(t, r, n, 10), this.emitNumericEntity(s, 2);
    }
    return this.addToNumericResult(t, r, n, 10), -1;
  }
  /**
   * Validate and emit a numeric entity.
   *
   * Implements the logic from the `Hexademical character reference start
   * state` and `Numeric character reference end state` in the HTML spec.
   *
   * @param lastCp The last code point of the entity. Used to see if the
   *               entity was terminated with a semicolon.
   * @param expectedLength The minimum number of characters that should be
   *                       consumed. Used to validate that at least one digit
   *                       was consumed.
   * @returns The number of characters that were consumed.
   */
  emitNumericEntity(t, n) {
    var r;
    if (this.consumed <= n)
      return (r = this.errors) === null || r === void 0 || r.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
    if (t === $.SEMI)
      this.consumed += 1;
    else if (this.decodeMode === Ie.Strict)
      return 0;
    return this.emitCodePoint(pc(this.result), this.consumed), this.errors && (t !== $.SEMI && this.errors.missingSemicolonAfterCharacterReference(), this.errors.validateNumericCharacterReference(this.result)), this.consumed;
  }
  /**
   * Parses a named entity.
   *
   * Equivalent to the `Named character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNamedEntity(t, n) {
    const { decodeTree: r } = this;
    let s = r[this.treeIndex], i = (s & de.VALUE_LENGTH) >> 14;
    for (; n < t.length; n++, this.excess++) {
      const u = t.charCodeAt(n);
      if (this.treeIndex = Os(r, s, this.treeIndex + Math.max(1, i), u), this.treeIndex < 0)
        return this.result === 0 || // If we are parsing an attribute
        this.decodeMode === Ie.Attribute && // We shouldn't have consumed any characters after the entity,
        (i === 0 || // And there should be no invalid characters.
        gc(u)) ? 0 : this.emitNotTerminatedNamedEntity();
      if (s = r[this.treeIndex], i = (s & de.VALUE_LENGTH) >> 14, i !== 0) {
        if (u === $.SEMI)
          return this.emitNamedEntityData(this.treeIndex, i, this.consumed + this.excess);
        this.decodeMode !== Ie.Strict && (this.result = this.treeIndex, this.consumed += this.excess, this.excess = 0);
      }
    }
    return -1;
  }
  /**
   * Emit a named entity that was not terminated with a semicolon.
   *
   * @returns The number of characters consumed.
   */
  emitNotTerminatedNamedEntity() {
    var t;
    const { result: n, decodeTree: r } = this, s = (r[n] & de.VALUE_LENGTH) >> 14;
    return this.emitNamedEntityData(n, s, this.consumed), (t = this.errors) === null || t === void 0 || t.missingSemicolonAfterCharacterReference(), this.consumed;
  }
  /**
   * Emit a named entity.
   *
   * @param result The index of the entity in the decode tree.
   * @param valueLength The number of bytes in the entity.
   * @param consumed The number of characters consumed.
   *
   * @returns The number of characters consumed.
   */
  emitNamedEntityData(t, n, r) {
    const { decodeTree: s } = this;
    return this.emitCodePoint(n === 1 ? s[t] & ~de.VALUE_LENGTH : s[t + 1], r), n === 3 && this.emitCodePoint(s[t + 2], r), r;
  }
  /**
   * Signal to the parser that the end of the input was reached.
   *
   * Remaining data will be emitted and relevant errors will be produced.
   *
   * @returns The number of characters consumed.
   */
  end() {
    var t;
    switch (this.state) {
      case H.NamedEntity:
        return this.result !== 0 && (this.decodeMode !== Ie.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
      case H.NumericDecimal:
        return this.emitNumericEntity(0, 2);
      case H.NumericHex:
        return this.emitNumericEntity(0, 3);
      case H.NumericStart:
        return (t = this.errors) === null || t === void 0 || t.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
      case H.EntityStart:
        return 0;
    }
  }
}
function vs(e) {
  let t = "";
  const n = new Tc(e, (r) => t += fc(r));
  return function(s, i) {
    let u = 0, c = 0;
    for (; (c = s.indexOf("&", c)) >= 0; ) {
      t += s.slice(u, c), n.startEntity(i);
      const f = n.write(
        s,
        // Skip the "&"
        c + 1
      );
      if (f < 0) {
        u = c + n.end();
        break;
      }
      u = c + f, c = f === 0 ? u + 1 : u;
    }
    const d = t + s.slice(u);
    return t = "", d;
  };
}
function Os(e, t, n, r) {
  const s = (t & de.BRANCH_LENGTH) >> 7, i = t & de.JUMP_TABLE;
  if (s === 0)
    return i !== 0 && r === i ? n : -1;
  if (i) {
    const d = r - i;
    return d < 0 || d >= s ? -1 : e[n + d] - 1;
  }
  let u = n, c = u + s - 1;
  for (; u <= c; ) {
    const d = u + c >>> 1, f = e[d];
    if (f < r)
      u = d + 1;
    else if (f > r)
      c = d - 1;
    else
      return e[d + s];
  }
  return -1;
}
vs(Ee);
vs(dc);
var g;
(function(e) {
  e.HTML = "http://www.w3.org/1999/xhtml", e.MATHML = "http://www.w3.org/1998/Math/MathML", e.SVG = "http://www.w3.org/2000/svg", e.XLINK = "http://www.w3.org/1999/xlink", e.XML = "http://www.w3.org/XML/1998/namespace", e.XMLNS = "http://www.w3.org/2000/xmlns/";
})(g = g || (g = {}));
var _e;
(function(e) {
  e.TYPE = "type", e.ACTION = "action", e.ENCODING = "encoding", e.PROMPT = "prompt", e.NAME = "name", e.COLOR = "color", e.FACE = "face", e.SIZE = "size";
})(_e = _e || (_e = {}));
var ee;
(function(e) {
  e.NO_QUIRKS = "no-quirks", e.QUIRKS = "quirks", e.LIMITED_QUIRKS = "limited-quirks";
})(ee = ee || (ee = {}));
var m;
(function(e) {
  e.A = "a", e.ADDRESS = "address", e.ANNOTATION_XML = "annotation-xml", e.APPLET = "applet", e.AREA = "area", e.ARTICLE = "article", e.ASIDE = "aside", e.B = "b", e.BASE = "base", e.BASEFONT = "basefont", e.BGSOUND = "bgsound", e.BIG = "big", e.BLOCKQUOTE = "blockquote", e.BODY = "body", e.BR = "br", e.BUTTON = "button", e.CAPTION = "caption", e.CENTER = "center", e.CODE = "code", e.COL = "col", e.COLGROUP = "colgroup", e.DD = "dd", e.DESC = "desc", e.DETAILS = "details", e.DIALOG = "dialog", e.DIR = "dir", e.DIV = "div", e.DL = "dl", e.DT = "dt", e.EM = "em", e.EMBED = "embed", e.FIELDSET = "fieldset", e.FIGCAPTION = "figcaption", e.FIGURE = "figure", e.FONT = "font", e.FOOTER = "footer", e.FOREIGN_OBJECT = "foreignObject", e.FORM = "form", e.FRAME = "frame", e.FRAMESET = "frameset", e.H1 = "h1", e.H2 = "h2", e.H3 = "h3", e.H4 = "h4", e.H5 = "h5", e.H6 = "h6", e.HEAD = "head", e.HEADER = "header", e.HGROUP = "hgroup", e.HR = "hr", e.HTML = "html", e.I = "i", e.IMG = "img", e.IMAGE = "image", e.INPUT = "input", e.IFRAME = "iframe", e.KEYGEN = "keygen", e.LABEL = "label", e.LI = "li", e.LINK = "link", e.LISTING = "listing", e.MAIN = "main", e.MALIGNMARK = "malignmark", e.MARQUEE = "marquee", e.MATH = "math", e.MENU = "menu", e.META = "meta", e.MGLYPH = "mglyph", e.MI = "mi", e.MO = "mo", e.MN = "mn", e.MS = "ms", e.MTEXT = "mtext", e.NAV = "nav", e.NOBR = "nobr", e.NOFRAMES = "noframes", e.NOEMBED = "noembed", e.NOSCRIPT = "noscript", e.OBJECT = "object", e.OL = "ol", e.OPTGROUP = "optgroup", e.OPTION = "option", e.P = "p", e.PARAM = "param", e.PLAINTEXT = "plaintext", e.PRE = "pre", e.RB = "rb", e.RP = "rp", e.RT = "rt", e.RTC = "rtc", e.RUBY = "ruby", e.S = "s", e.SCRIPT = "script", e.SECTION = "section", e.SELECT = "select", e.SOURCE = "source", e.SMALL = "small", e.SPAN = "span", e.STRIKE = "strike", e.STRONG = "strong", e.STYLE = "style", e.SUB = "sub", e.SUMMARY = "summary", e.SUP = "sup", e.TABLE = "table", e.TBODY = "tbody", e.TEMPLATE = "template", e.TEXTAREA = "textarea", e.TFOOT = "tfoot", e.TD = "td", e.TH = "th", e.THEAD = "thead", e.TITLE = "title", e.TR = "tr", e.TRACK = "track", e.TT = "tt", e.U = "u", e.UL = "ul", e.SVG = "svg", e.VAR = "var", e.WBR = "wbr", e.XMP = "xmp";
})(m = m || (m = {}));
var a;
(function(e) {
  e[e.UNKNOWN = 0] = "UNKNOWN", e[e.A = 1] = "A", e[e.ADDRESS = 2] = "ADDRESS", e[e.ANNOTATION_XML = 3] = "ANNOTATION_XML", e[e.APPLET = 4] = "APPLET", e[e.AREA = 5] = "AREA", e[e.ARTICLE = 6] = "ARTICLE", e[e.ASIDE = 7] = "ASIDE", e[e.B = 8] = "B", e[e.BASE = 9] = "BASE", e[e.BASEFONT = 10] = "BASEFONT", e[e.BGSOUND = 11] = "BGSOUND", e[e.BIG = 12] = "BIG", e[e.BLOCKQUOTE = 13] = "BLOCKQUOTE", e[e.BODY = 14] = "BODY", e[e.BR = 15] = "BR", e[e.BUTTON = 16] = "BUTTON", e[e.CAPTION = 17] = "CAPTION", e[e.CENTER = 18] = "CENTER", e[e.CODE = 19] = "CODE", e[e.COL = 20] = "COL", e[e.COLGROUP = 21] = "COLGROUP", e[e.DD = 22] = "DD", e[e.DESC = 23] = "DESC", e[e.DETAILS = 24] = "DETAILS", e[e.DIALOG = 25] = "DIALOG", e[e.DIR = 26] = "DIR", e[e.DIV = 27] = "DIV", e[e.DL = 28] = "DL", e[e.DT = 29] = "DT", e[e.EM = 30] = "EM", e[e.EMBED = 31] = "EMBED", e[e.FIELDSET = 32] = "FIELDSET", e[e.FIGCAPTION = 33] = "FIGCAPTION", e[e.FIGURE = 34] = "FIGURE", e[e.FONT = 35] = "FONT", e[e.FOOTER = 36] = "FOOTER", e[e.FOREIGN_OBJECT = 37] = "FOREIGN_OBJECT", e[e.FORM = 38] = "FORM", e[e.FRAME = 39] = "FRAME", e[e.FRAMESET = 40] = "FRAMESET", e[e.H1 = 41] = "H1", e[e.H2 = 42] = "H2", e[e.H3 = 43] = "H3", e[e.H4 = 44] = "H4", e[e.H5 = 45] = "H5", e[e.H6 = 46] = "H6", e[e.HEAD = 47] = "HEAD", e[e.HEADER = 48] = "HEADER", e[e.HGROUP = 49] = "HGROUP", e[e.HR = 50] = "HR", e[e.HTML = 51] = "HTML", e[e.I = 52] = "I", e[e.IMG = 53] = "IMG", e[e.IMAGE = 54] = "IMAGE", e[e.INPUT = 55] = "INPUT", e[e.IFRAME = 56] = "IFRAME", e[e.KEYGEN = 57] = "KEYGEN", e[e.LABEL = 58] = "LABEL", e[e.LI = 59] = "LI", e[e.LINK = 60] = "LINK", e[e.LISTING = 61] = "LISTING", e[e.MAIN = 62] = "MAIN", e[e.MALIGNMARK = 63] = "MALIGNMARK", e[e.MARQUEE = 64] = "MARQUEE", e[e.MATH = 65] = "MATH", e[e.MENU = 66] = "MENU", e[e.META = 67] = "META", e[e.MGLYPH = 68] = "MGLYPH", e[e.MI = 69] = "MI", e[e.MO = 70] = "MO", e[e.MN = 71] = "MN", e[e.MS = 72] = "MS", e[e.MTEXT = 73] = "MTEXT", e[e.NAV = 74] = "NAV", e[e.NOBR = 75] = "NOBR", e[e.NOFRAMES = 76] = "NOFRAMES", e[e.NOEMBED = 77] = "NOEMBED", e[e.NOSCRIPT = 78] = "NOSCRIPT", e[e.OBJECT = 79] = "OBJECT", e[e.OL = 80] = "OL", e[e.OPTGROUP = 81] = "OPTGROUP", e[e.OPTION = 82] = "OPTION", e[e.P = 83] = "P", e[e.PARAM = 84] = "PARAM", e[e.PLAINTEXT = 85] = "PLAINTEXT", e[e.PRE = 86] = "PRE", e[e.RB = 87] = "RB", e[e.RP = 88] = "RP", e[e.RT = 89] = "RT", e[e.RTC = 90] = "RTC", e[e.RUBY = 91] = "RUBY", e[e.S = 92] = "S", e[e.SCRIPT = 93] = "SCRIPT", e[e.SECTION = 94] = "SECTION", e[e.SELECT = 95] = "SELECT", e[e.SOURCE = 96] = "SOURCE", e[e.SMALL = 97] = "SMALL", e[e.SPAN = 98] = "SPAN", e[e.STRIKE = 99] = "STRIKE", e[e.STRONG = 100] = "STRONG", e[e.STYLE = 101] = "STYLE", e[e.SUB = 102] = "SUB", e[e.SUMMARY = 103] = "SUMMARY", e[e.SUP = 104] = "SUP", e[e.TABLE = 105] = "TABLE", e[e.TBODY = 106] = "TBODY", e[e.TEMPLATE = 107] = "TEMPLATE", e[e.TEXTAREA = 108] = "TEXTAREA", e[e.TFOOT = 109] = "TFOOT", e[e.TD = 110] = "TD", e[e.TH = 111] = "TH", e[e.THEAD = 112] = "THEAD", e[e.TITLE = 113] = "TITLE", e[e.TR = 114] = "TR", e[e.TRACK = 115] = "TRACK", e[e.TT = 116] = "TT", e[e.U = 117] = "U", e[e.UL = 118] = "UL", e[e.SVG = 119] = "SVG", e[e.VAR = 120] = "VAR", e[e.WBR = 121] = "WBR", e[e.XMP = 122] = "XMP";
})(a = a || (a = {}));
const _c = /* @__PURE__ */ new Map([
  [m.A, a.A],
  [m.ADDRESS, a.ADDRESS],
  [m.ANNOTATION_XML, a.ANNOTATION_XML],
  [m.APPLET, a.APPLET],
  [m.AREA, a.AREA],
  [m.ARTICLE, a.ARTICLE],
  [m.ASIDE, a.ASIDE],
  [m.B, a.B],
  [m.BASE, a.BASE],
  [m.BASEFONT, a.BASEFONT],
  [m.BGSOUND, a.BGSOUND],
  [m.BIG, a.BIG],
  [m.BLOCKQUOTE, a.BLOCKQUOTE],
  [m.BODY, a.BODY],
  [m.BR, a.BR],
  [m.BUTTON, a.BUTTON],
  [m.CAPTION, a.CAPTION],
  [m.CENTER, a.CENTER],
  [m.CODE, a.CODE],
  [m.COL, a.COL],
  [m.COLGROUP, a.COLGROUP],
  [m.DD, a.DD],
  [m.DESC, a.DESC],
  [m.DETAILS, a.DETAILS],
  [m.DIALOG, a.DIALOG],
  [m.DIR, a.DIR],
  [m.DIV, a.DIV],
  [m.DL, a.DL],
  [m.DT, a.DT],
  [m.EM, a.EM],
  [m.EMBED, a.EMBED],
  [m.FIELDSET, a.FIELDSET],
  [m.FIGCAPTION, a.FIGCAPTION],
  [m.FIGURE, a.FIGURE],
  [m.FONT, a.FONT],
  [m.FOOTER, a.FOOTER],
  [m.FOREIGN_OBJECT, a.FOREIGN_OBJECT],
  [m.FORM, a.FORM],
  [m.FRAME, a.FRAME],
  [m.FRAMESET, a.FRAMESET],
  [m.H1, a.H1],
  [m.H2, a.H2],
  [m.H3, a.H3],
  [m.H4, a.H4],
  [m.H5, a.H5],
  [m.H6, a.H6],
  [m.HEAD, a.HEAD],
  [m.HEADER, a.HEADER],
  [m.HGROUP, a.HGROUP],
  [m.HR, a.HR],
  [m.HTML, a.HTML],
  [m.I, a.I],
  [m.IMG, a.IMG],
  [m.IMAGE, a.IMAGE],
  [m.INPUT, a.INPUT],
  [m.IFRAME, a.IFRAME],
  [m.KEYGEN, a.KEYGEN],
  [m.LABEL, a.LABEL],
  [m.LI, a.LI],
  [m.LINK, a.LINK],
  [m.LISTING, a.LISTING],
  [m.MAIN, a.MAIN],
  [m.MALIGNMARK, a.MALIGNMARK],
  [m.MARQUEE, a.MARQUEE],
  [m.MATH, a.MATH],
  [m.MENU, a.MENU],
  [m.META, a.META],
  [m.MGLYPH, a.MGLYPH],
  [m.MI, a.MI],
  [m.MO, a.MO],
  [m.MN, a.MN],
  [m.MS, a.MS],
  [m.MTEXT, a.MTEXT],
  [m.NAV, a.NAV],
  [m.NOBR, a.NOBR],
  [m.NOFRAMES, a.NOFRAMES],
  [m.NOEMBED, a.NOEMBED],
  [m.NOSCRIPT, a.NOSCRIPT],
  [m.OBJECT, a.OBJECT],
  [m.OL, a.OL],
  [m.OPTGROUP, a.OPTGROUP],
  [m.OPTION, a.OPTION],
  [m.P, a.P],
  [m.PARAM, a.PARAM],
  [m.PLAINTEXT, a.PLAINTEXT],
  [m.PRE, a.PRE],
  [m.RB, a.RB],
  [m.RP, a.RP],
  [m.RT, a.RT],
  [m.RTC, a.RTC],
  [m.RUBY, a.RUBY],
  [m.S, a.S],
  [m.SCRIPT, a.SCRIPT],
  [m.SECTION, a.SECTION],
  [m.SELECT, a.SELECT],
  [m.SOURCE, a.SOURCE],
  [m.SMALL, a.SMALL],
  [m.SPAN, a.SPAN],
  [m.STRIKE, a.STRIKE],
  [m.STRONG, a.STRONG],
  [m.STYLE, a.STYLE],
  [m.SUB, a.SUB],
  [m.SUMMARY, a.SUMMARY],
  [m.SUP, a.SUP],
  [m.TABLE, a.TABLE],
  [m.TBODY, a.TBODY],
  [m.TEMPLATE, a.TEMPLATE],
  [m.TEXTAREA, a.TEXTAREA],
  [m.TFOOT, a.TFOOT],
  [m.TD, a.TD],
  [m.TH, a.TH],
  [m.THEAD, a.THEAD],
  [m.TITLE, a.TITLE],
  [m.TR, a.TR],
  [m.TRACK, a.TRACK],
  [m.TT, a.TT],
  [m.U, a.U],
  [m.UL, a.UL],
  [m.SVG, a.SVG],
  [m.VAR, a.VAR],
  [m.WBR, a.WBR],
  [m.XMP, a.XMP]
]);
function tn(e) {
  var t;
  return (t = _c.get(e)) !== null && t !== void 0 ? t : a.UNKNOWN;
}
const _ = a, Ac = {
  [g.HTML]: /* @__PURE__ */ new Set([
    _.ADDRESS,
    _.APPLET,
    _.AREA,
    _.ARTICLE,
    _.ASIDE,
    _.BASE,
    _.BASEFONT,
    _.BGSOUND,
    _.BLOCKQUOTE,
    _.BODY,
    _.BR,
    _.BUTTON,
    _.CAPTION,
    _.CENTER,
    _.COL,
    _.COLGROUP,
    _.DD,
    _.DETAILS,
    _.DIR,
    _.DIV,
    _.DL,
    _.DT,
    _.EMBED,
    _.FIELDSET,
    _.FIGCAPTION,
    _.FIGURE,
    _.FOOTER,
    _.FORM,
    _.FRAME,
    _.FRAMESET,
    _.H1,
    _.H2,
    _.H3,
    _.H4,
    _.H5,
    _.H6,
    _.HEAD,
    _.HEADER,
    _.HGROUP,
    _.HR,
    _.HTML,
    _.IFRAME,
    _.IMG,
    _.INPUT,
    _.LI,
    _.LINK,
    _.LISTING,
    _.MAIN,
    _.MARQUEE,
    _.MENU,
    _.META,
    _.NAV,
    _.NOEMBED,
    _.NOFRAMES,
    _.NOSCRIPT,
    _.OBJECT,
    _.OL,
    _.P,
    _.PARAM,
    _.PLAINTEXT,
    _.PRE,
    _.SCRIPT,
    _.SECTION,
    _.SELECT,
    _.SOURCE,
    _.STYLE,
    _.SUMMARY,
    _.TABLE,
    _.TBODY,
    _.TD,
    _.TEMPLATE,
    _.TEXTAREA,
    _.TFOOT,
    _.TH,
    _.THEAD,
    _.TITLE,
    _.TR,
    _.TRACK,
    _.UL,
    _.WBR,
    _.XMP
  ]),
  [g.MATHML]: /* @__PURE__ */ new Set([_.MI, _.MO, _.MN, _.MS, _.MTEXT, _.ANNOTATION_XML]),
  [g.SVG]: /* @__PURE__ */ new Set([_.TITLE, _.FOREIGN_OBJECT, _.DESC]),
  [g.XLINK]: /* @__PURE__ */ new Set(),
  [g.XML]: /* @__PURE__ */ new Set(),
  [g.XMLNS]: /* @__PURE__ */ new Set()
};
function ks(e) {
  return e === _.H1 || e === _.H2 || e === _.H3 || e === _.H4 || e === _.H5 || e === _.H6;
}
m.STYLE, m.SCRIPT, m.XMP, m.IFRAME, m.NOEMBED, m.NOFRAMES, m.PLAINTEXT;
const yc = /* @__PURE__ */ new Map([
  [128, 8364],
  [130, 8218],
  [131, 402],
  [132, 8222],
  [133, 8230],
  [134, 8224],
  [135, 8225],
  [136, 710],
  [137, 8240],
  [138, 352],
  [139, 8249],
  [140, 338],
  [142, 381],
  [145, 8216],
  [146, 8217],
  [147, 8220],
  [148, 8221],
  [149, 8226],
  [150, 8211],
  [151, 8212],
  [152, 732],
  [153, 8482],
  [154, 353],
  [155, 8250],
  [156, 339],
  [158, 382],
  [159, 376]
]);
var l;
(function(e) {
  e[e.DATA = 0] = "DATA", e[e.RCDATA = 1] = "RCDATA", e[e.RAWTEXT = 2] = "RAWTEXT", e[e.SCRIPT_DATA = 3] = "SCRIPT_DATA", e[e.PLAINTEXT = 4] = "PLAINTEXT", e[e.TAG_OPEN = 5] = "TAG_OPEN", e[e.END_TAG_OPEN = 6] = "END_TAG_OPEN", e[e.TAG_NAME = 7] = "TAG_NAME", e[e.RCDATA_LESS_THAN_SIGN = 8] = "RCDATA_LESS_THAN_SIGN", e[e.RCDATA_END_TAG_OPEN = 9] = "RCDATA_END_TAG_OPEN", e[e.RCDATA_END_TAG_NAME = 10] = "RCDATA_END_TAG_NAME", e[e.RAWTEXT_LESS_THAN_SIGN = 11] = "RAWTEXT_LESS_THAN_SIGN", e[e.RAWTEXT_END_TAG_OPEN = 12] = "RAWTEXT_END_TAG_OPEN", e[e.RAWTEXT_END_TAG_NAME = 13] = "RAWTEXT_END_TAG_NAME", e[e.SCRIPT_DATA_LESS_THAN_SIGN = 14] = "SCRIPT_DATA_LESS_THAN_SIGN", e[e.SCRIPT_DATA_END_TAG_OPEN = 15] = "SCRIPT_DATA_END_TAG_OPEN", e[e.SCRIPT_DATA_END_TAG_NAME = 16] = "SCRIPT_DATA_END_TAG_NAME", e[e.SCRIPT_DATA_ESCAPE_START = 17] = "SCRIPT_DATA_ESCAPE_START", e[e.SCRIPT_DATA_ESCAPE_START_DASH = 18] = "SCRIPT_DATA_ESCAPE_START_DASH", e[e.SCRIPT_DATA_ESCAPED = 19] = "SCRIPT_DATA_ESCAPED", e[e.SCRIPT_DATA_ESCAPED_DASH = 20] = "SCRIPT_DATA_ESCAPED_DASH", e[e.SCRIPT_DATA_ESCAPED_DASH_DASH = 21] = "SCRIPT_DATA_ESCAPED_DASH_DASH", e[e.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN = 22] = "SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN", e[e.SCRIPT_DATA_ESCAPED_END_TAG_OPEN = 23] = "SCRIPT_DATA_ESCAPED_END_TAG_OPEN", e[e.SCRIPT_DATA_ESCAPED_END_TAG_NAME = 24] = "SCRIPT_DATA_ESCAPED_END_TAG_NAME", e[e.SCRIPT_DATA_DOUBLE_ESCAPE_START = 25] = "SCRIPT_DATA_DOUBLE_ESCAPE_START", e[e.SCRIPT_DATA_DOUBLE_ESCAPED = 26] = "SCRIPT_DATA_DOUBLE_ESCAPED", e[e.SCRIPT_DATA_DOUBLE_ESCAPED_DASH = 27] = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH", e[e.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH = 28] = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH", e[e.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN = 29] = "SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN", e[e.SCRIPT_DATA_DOUBLE_ESCAPE_END = 30] = "SCRIPT_DATA_DOUBLE_ESCAPE_END", e[e.BEFORE_ATTRIBUTE_NAME = 31] = "BEFORE_ATTRIBUTE_NAME", e[e.ATTRIBUTE_NAME = 32] = "ATTRIBUTE_NAME", e[e.AFTER_ATTRIBUTE_NAME = 33] = "AFTER_ATTRIBUTE_NAME", e[e.BEFORE_ATTRIBUTE_VALUE = 34] = "BEFORE_ATTRIBUTE_VALUE", e[e.ATTRIBUTE_VALUE_DOUBLE_QUOTED = 35] = "ATTRIBUTE_VALUE_DOUBLE_QUOTED", e[e.ATTRIBUTE_VALUE_SINGLE_QUOTED = 36] = "ATTRIBUTE_VALUE_SINGLE_QUOTED", e[e.ATTRIBUTE_VALUE_UNQUOTED = 37] = "ATTRIBUTE_VALUE_UNQUOTED", e[e.AFTER_ATTRIBUTE_VALUE_QUOTED = 38] = "AFTER_ATTRIBUTE_VALUE_QUOTED", e[e.SELF_CLOSING_START_TAG = 39] = "SELF_CLOSING_START_TAG", e[e.BOGUS_COMMENT = 40] = "BOGUS_COMMENT", e[e.MARKUP_DECLARATION_OPEN = 41] = "MARKUP_DECLARATION_OPEN", e[e.COMMENT_START = 42] = "COMMENT_START", e[e.COMMENT_START_DASH = 43] = "COMMENT_START_DASH", e[e.COMMENT = 44] = "COMMENT", e[e.COMMENT_LESS_THAN_SIGN = 45] = "COMMENT_LESS_THAN_SIGN", e[e.COMMENT_LESS_THAN_SIGN_BANG = 46] = "COMMENT_LESS_THAN_SIGN_BANG", e[e.COMMENT_LESS_THAN_SIGN_BANG_DASH = 47] = "COMMENT_LESS_THAN_SIGN_BANG_DASH", e[e.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH = 48] = "COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH", e[e.COMMENT_END_DASH = 49] = "COMMENT_END_DASH", e[e.COMMENT_END = 50] = "COMMENT_END", e[e.COMMENT_END_BANG = 51] = "COMMENT_END_BANG", e[e.DOCTYPE = 52] = "DOCTYPE", e[e.BEFORE_DOCTYPE_NAME = 53] = "BEFORE_DOCTYPE_NAME", e[e.DOCTYPE_NAME = 54] = "DOCTYPE_NAME", e[e.AFTER_DOCTYPE_NAME = 55] = "AFTER_DOCTYPE_NAME", e[e.AFTER_DOCTYPE_PUBLIC_KEYWORD = 56] = "AFTER_DOCTYPE_PUBLIC_KEYWORD", e[e.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER = 57] = "BEFORE_DOCTYPE_PUBLIC_IDENTIFIER", e[e.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED = 58] = "DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED", e[e.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED = 59] = "DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED", e[e.AFTER_DOCTYPE_PUBLIC_IDENTIFIER = 60] = "AFTER_DOCTYPE_PUBLIC_IDENTIFIER", e[e.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS = 61] = "BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS", e[e.AFTER_DOCTYPE_SYSTEM_KEYWORD = 62] = "AFTER_DOCTYPE_SYSTEM_KEYWORD", e[e.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER = 63] = "BEFORE_DOCTYPE_SYSTEM_IDENTIFIER", e[e.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED = 64] = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED", e[e.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED = 65] = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED", e[e.AFTER_DOCTYPE_SYSTEM_IDENTIFIER = 66] = "AFTER_DOCTYPE_SYSTEM_IDENTIFIER", e[e.BOGUS_DOCTYPE = 67] = "BOGUS_DOCTYPE", e[e.CDATA_SECTION = 68] = "CDATA_SECTION", e[e.CDATA_SECTION_BRACKET = 69] = "CDATA_SECTION_BRACKET", e[e.CDATA_SECTION_END = 70] = "CDATA_SECTION_END", e[e.CHARACTER_REFERENCE = 71] = "CHARACTER_REFERENCE", e[e.NAMED_CHARACTER_REFERENCE = 72] = "NAMED_CHARACTER_REFERENCE", e[e.AMBIGUOUS_AMPERSAND = 73] = "AMBIGUOUS_AMPERSAND", e[e.NUMERIC_CHARACTER_REFERENCE = 74] = "NUMERIC_CHARACTER_REFERENCE", e[e.HEXADEMICAL_CHARACTER_REFERENCE_START = 75] = "HEXADEMICAL_CHARACTER_REFERENCE_START", e[e.HEXADEMICAL_CHARACTER_REFERENCE = 76] = "HEXADEMICAL_CHARACTER_REFERENCE", e[e.DECIMAL_CHARACTER_REFERENCE = 77] = "DECIMAL_CHARACTER_REFERENCE", e[e.NUMERIC_CHARACTER_REFERENCE_END = 78] = "NUMERIC_CHARACTER_REFERENCE_END";
})(l || (l = {}));
const j = {
  DATA: l.DATA,
  RCDATA: l.RCDATA,
  RAWTEXT: l.RAWTEXT,
  SCRIPT_DATA: l.SCRIPT_DATA,
  PLAINTEXT: l.PLAINTEXT,
  CDATA_SECTION: l.CDATA_SECTION
};
function rt(e) {
  return e >= o.DIGIT_0 && e <= o.DIGIT_9;
}
function Ke(e) {
  return e >= o.LATIN_CAPITAL_A && e <= o.LATIN_CAPITAL_Z;
}
function Cc(e) {
  return e >= o.LATIN_SMALL_A && e <= o.LATIN_SMALL_Z;
}
function ge(e) {
  return Cc(e) || Ke(e);
}
function $n(e) {
  return ge(e) || rt(e);
}
function Ds(e) {
  return e >= o.LATIN_CAPITAL_A && e <= o.LATIN_CAPITAL_F;
}
function Ps(e) {
  return e >= o.LATIN_SMALL_A && e <= o.LATIN_SMALL_F;
}
function Nc(e) {
  return rt(e) || Ds(e) || Ps(e);
}
function Rt(e) {
  return e + 32;
}
function Ms(e) {
  return e === o.SPACE || e === o.LINE_FEED || e === o.TABULATION || e === o.FORM_FEED;
}
function Ic(e) {
  return e === o.EQUALS_SIGN || $n(e);
}
function ia(e) {
  return Ms(e) || e === o.SOLIDUS || e === o.GREATER_THAN_SIGN;
}
class xc {
  constructor(t, n) {
    this.options = t, this.handler = n, this.paused = !1, this.inLoop = !1, this.inForeignNode = !1, this.lastStartTagName = "", this.active = !1, this.state = l.DATA, this.returnState = l.DATA, this.charRefCode = -1, this.consumedAfterSnapshot = -1, this.currentCharacterToken = null, this.currentToken = null, this.currentAttr = { name: "", value: "" }, this.preprocessor = new lc(n), this.currentLocation = this.getCurrentLocation(-1);
  }
  //Errors
  _err(t) {
    var n, r;
    (r = (n = this.handler).onParseError) === null || r === void 0 || r.call(n, this.preprocessor.getError(t));
  }
  // NOTE: `offset` may never run across line boundaries.
  getCurrentLocation(t) {
    return this.options.sourceCodeLocationInfo ? {
      startLine: this.preprocessor.line,
      startCol: this.preprocessor.col - t,
      startOffset: this.preprocessor.offset - t,
      endLine: -1,
      endCol: -1,
      endOffset: -1
    } : null;
  }
  _runParsingLoop() {
    if (!this.inLoop) {
      for (this.inLoop = !0; this.active && !this.paused; ) {
        this.consumedAfterSnapshot = 0;
        const t = this._consume();
        this._ensureHibernation() || this._callState(t);
      }
      this.inLoop = !1;
    }
  }
  //API
  pause() {
    this.paused = !0;
  }
  resume(t) {
    if (!this.paused)
      throw new Error("Parser was already resumed");
    this.paused = !1, !this.inLoop && (this._runParsingLoop(), this.paused || t?.());
  }
  write(t, n, r) {
    this.active = !0, this.preprocessor.write(t, n), this._runParsingLoop(), this.paused || r?.();
  }
  insertHtmlAtCurrentPos(t) {
    this.active = !0, this.preprocessor.insertHtmlAtCurrentPos(t), this._runParsingLoop();
  }
  //Hibernation
  _ensureHibernation() {
    return this.preprocessor.endOfChunkHit ? (this._unconsume(this.consumedAfterSnapshot), this.active = !1, !0) : !1;
  }
  //Consumption
  _consume() {
    return this.consumedAfterSnapshot++, this.preprocessor.advance();
  }
  _unconsume(t) {
    this.consumedAfterSnapshot -= t, this.preprocessor.retreat(t);
  }
  _reconsumeInState(t, n) {
    this.state = t, this._callState(n);
  }
  _advanceBy(t) {
    this.consumedAfterSnapshot += t;
    for (let n = 0; n < t; n++)
      this.preprocessor.advance();
  }
  _consumeSequenceIfMatch(t, n) {
    return this.preprocessor.startsWith(t, n) ? (this._advanceBy(t.length - 1), !0) : !1;
  }
  //Token creation
  _createStartTagToken() {
    this.currentToken = {
      type: O.START_TAG,
      tagName: "",
      tagID: a.UNKNOWN,
      selfClosing: !1,
      ackSelfClosing: !1,
      attrs: [],
      location: this.getCurrentLocation(1)
    };
  }
  _createEndTagToken() {
    this.currentToken = {
      type: O.END_TAG,
      tagName: "",
      tagID: a.UNKNOWN,
      selfClosing: !1,
      ackSelfClosing: !1,
      attrs: [],
      location: this.getCurrentLocation(2)
    };
  }
  _createCommentToken(t) {
    this.currentToken = {
      type: O.COMMENT,
      data: "",
      location: this.getCurrentLocation(t)
    };
  }
  _createDoctypeToken(t) {
    this.currentToken = {
      type: O.DOCTYPE,
      name: t,
      forceQuirks: !1,
      publicId: null,
      systemId: null,
      location: this.currentLocation
    };
  }
  _createCharacterToken(t, n) {
    this.currentCharacterToken = {
      type: t,
      chars: n,
      location: this.currentLocation
    };
  }
  //Tag attributes
  _createAttr(t) {
    this.currentAttr = {
      name: t,
      value: ""
    }, this.currentLocation = this.getCurrentLocation(0);
  }
  _leaveAttrName() {
    var t, n;
    const r = this.currentToken;
    if (Ls(r, this.currentAttr.name) === null) {
      if (r.attrs.push(this.currentAttr), r.location && this.currentLocation) {
        const s = (t = (n = r.location).attrs) !== null && t !== void 0 ? t : n.attrs = /* @__PURE__ */ Object.create(null);
        s[this.currentAttr.name] = this.currentLocation, this._leaveAttrValue();
      }
    } else
      this._err(E.duplicateAttribute);
  }
  _leaveAttrValue() {
    this.currentLocation && (this.currentLocation.endLine = this.preprocessor.line, this.currentLocation.endCol = this.preprocessor.col, this.currentLocation.endOffset = this.preprocessor.offset);
  }
  //Token emission
  prepareToken(t) {
    this._emitCurrentCharacterToken(t.location), this.currentToken = null, t.location && (t.location.endLine = this.preprocessor.line, t.location.endCol = this.preprocessor.col + 1, t.location.endOffset = this.preprocessor.offset + 1), this.currentLocation = this.getCurrentLocation(-1);
  }
  emitCurrentTagToken() {
    const t = this.currentToken;
    this.prepareToken(t), t.tagID = tn(t.tagName), t.type === O.START_TAG ? (this.lastStartTagName = t.tagName, this.handler.onStartTag(t)) : (t.attrs.length > 0 && this._err(E.endTagWithAttributes), t.selfClosing && this._err(E.endTagWithTrailingSolidus), this.handler.onEndTag(t)), this.preprocessor.dropParsedChunk();
  }
  emitCurrentComment(t) {
    this.prepareToken(t), this.handler.onComment(t), this.preprocessor.dropParsedChunk();
  }
  emitCurrentDoctype(t) {
    this.prepareToken(t), this.handler.onDoctype(t), this.preprocessor.dropParsedChunk();
  }
  _emitCurrentCharacterToken(t) {
    if (this.currentCharacterToken) {
      switch (t && this.currentCharacterToken.location && (this.currentCharacterToken.location.endLine = t.startLine, this.currentCharacterToken.location.endCol = t.startCol, this.currentCharacterToken.location.endOffset = t.startOffset), this.currentCharacterToken.type) {
        case O.CHARACTER: {
          this.handler.onCharacter(this.currentCharacterToken);
          break;
        }
        case O.NULL_CHARACTER: {
          this.handler.onNullCharacter(this.currentCharacterToken);
          break;
        }
        case O.WHITESPACE_CHARACTER: {
          this.handler.onWhitespaceCharacter(this.currentCharacterToken);
          break;
        }
      }
      this.currentCharacterToken = null;
    }
  }
  _emitEOFToken() {
    const t = this.getCurrentLocation(0);
    t && (t.endLine = t.startLine, t.endCol = t.startCol, t.endOffset = t.startOffset), this._emitCurrentCharacterToken(t), this.handler.onEof({ type: O.EOF, location: t }), this.active = !1;
  }
  //Characters emission
  //OPTIMIZATION: specification uses only one type of character tokens (one token per character).
  //This causes a huge memory overhead and a lot of unnecessary parser loops. parse5 uses 3 groups of characters.
  //If we have a sequence of characters that belong to the same group, the parser can process it
  //as a single solid character token.
  //So, there are 3 types of character tokens in parse5:
  //1)TokenType.NULL_CHARACTER - \u0000-character sequences (e.g. '\u0000\u0000\u0000')
  //2)TokenType.WHITESPACE_CHARACTER - any whitespace/new-line character sequences (e.g. '\n  \r\t   \f')
  //3)TokenType.CHARACTER - any character sequence which don't belong to groups 1 and 2 (e.g. 'abcdef1234@@#$%^')
  _appendCharToCurrentCharacterToken(t, n) {
    if (this.currentCharacterToken)
      if (this.currentCharacterToken.type !== t)
        this.currentLocation = this.getCurrentLocation(0), this._emitCurrentCharacterToken(this.currentLocation), this.preprocessor.dropParsedChunk();
      else {
        this.currentCharacterToken.chars += n;
        return;
      }
    this._createCharacterToken(t, n);
  }
  _emitCodePoint(t) {
    const n = Ms(t) ? O.WHITESPACE_CHARACTER : t === o.NULL ? O.NULL_CHARACTER : O.CHARACTER;
    this._appendCharToCurrentCharacterToken(n, String.fromCodePoint(t));
  }
  //NOTE: used when we emit characters explicitly.
  //This is always for non-whitespace and non-null characters, which allows us to avoid additional checks.
  _emitChars(t) {
    this._appendCharToCurrentCharacterToken(O.CHARACTER, t);
  }
  // Character reference helpers
  _matchNamedCharacterReference(t) {
    let n = null, r = 0, s = !1;
    for (let i = 0, u = Ee[0]; i >= 0 && (i = Os(Ee, u, i + 1, t), !(i < 0)); t = this._consume()) {
      r += 1, u = Ee[i];
      const c = u & de.VALUE_LENGTH;
      if (c) {
        const d = (c >> 14) - 1;
        if (t !== o.SEMICOLON && this._isCharacterReferenceInAttribute() && Ic(this.preprocessor.peek(1)) ? (n = [o.AMPERSAND], i += d) : (n = d === 0 ? [Ee[i] & ~de.VALUE_LENGTH] : d === 1 ? [Ee[++i]] : [Ee[++i], Ee[++i]], r = 0, s = t !== o.SEMICOLON), d === 0) {
          this._consume();
          break;
        }
      }
    }
    return this._unconsume(r), s && !this.preprocessor.endOfChunkHit && this._err(E.missingSemicolonAfterCharacterReference), this._unconsume(1), n;
  }
  _isCharacterReferenceInAttribute() {
    return this.returnState === l.ATTRIBUTE_VALUE_DOUBLE_QUOTED || this.returnState === l.ATTRIBUTE_VALUE_SINGLE_QUOTED || this.returnState === l.ATTRIBUTE_VALUE_UNQUOTED;
  }
  _flushCodePointConsumedAsCharacterReference(t) {
    this._isCharacterReferenceInAttribute() ? this.currentAttr.value += String.fromCodePoint(t) : this._emitCodePoint(t);
  }
  // Calling states this way turns out to be much faster than any other approach.
  _callState(t) {
    switch (this.state) {
      case l.DATA: {
        this._stateData(t);
        break;
      }
      case l.RCDATA: {
        this._stateRcdata(t);
        break;
      }
      case l.RAWTEXT: {
        this._stateRawtext(t);
        break;
      }
      case l.SCRIPT_DATA: {
        this._stateScriptData(t);
        break;
      }
      case l.PLAINTEXT: {
        this._statePlaintext(t);
        break;
      }
      case l.TAG_OPEN: {
        this._stateTagOpen(t);
        break;
      }
      case l.END_TAG_OPEN: {
        this._stateEndTagOpen(t);
        break;
      }
      case l.TAG_NAME: {
        this._stateTagName(t);
        break;
      }
      case l.RCDATA_LESS_THAN_SIGN: {
        this._stateRcdataLessThanSign(t);
        break;
      }
      case l.RCDATA_END_TAG_OPEN: {
        this._stateRcdataEndTagOpen(t);
        break;
      }
      case l.RCDATA_END_TAG_NAME: {
        this._stateRcdataEndTagName(t);
        break;
      }
      case l.RAWTEXT_LESS_THAN_SIGN: {
        this._stateRawtextLessThanSign(t);
        break;
      }
      case l.RAWTEXT_END_TAG_OPEN: {
        this._stateRawtextEndTagOpen(t);
        break;
      }
      case l.RAWTEXT_END_TAG_NAME: {
        this._stateRawtextEndTagName(t);
        break;
      }
      case l.SCRIPT_DATA_LESS_THAN_SIGN: {
        this._stateScriptDataLessThanSign(t);
        break;
      }
      case l.SCRIPT_DATA_END_TAG_OPEN: {
        this._stateScriptDataEndTagOpen(t);
        break;
      }
      case l.SCRIPT_DATA_END_TAG_NAME: {
        this._stateScriptDataEndTagName(t);
        break;
      }
      case l.SCRIPT_DATA_ESCAPE_START: {
        this._stateScriptDataEscapeStart(t);
        break;
      }
      case l.SCRIPT_DATA_ESCAPE_START_DASH: {
        this._stateScriptDataEscapeStartDash(t);
        break;
      }
      case l.SCRIPT_DATA_ESCAPED: {
        this._stateScriptDataEscaped(t);
        break;
      }
      case l.SCRIPT_DATA_ESCAPED_DASH: {
        this._stateScriptDataEscapedDash(t);
        break;
      }
      case l.SCRIPT_DATA_ESCAPED_DASH_DASH: {
        this._stateScriptDataEscapedDashDash(t);
        break;
      }
      case l.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN: {
        this._stateScriptDataEscapedLessThanSign(t);
        break;
      }
      case l.SCRIPT_DATA_ESCAPED_END_TAG_OPEN: {
        this._stateScriptDataEscapedEndTagOpen(t);
        break;
      }
      case l.SCRIPT_DATA_ESCAPED_END_TAG_NAME: {
        this._stateScriptDataEscapedEndTagName(t);
        break;
      }
      case l.SCRIPT_DATA_DOUBLE_ESCAPE_START: {
        this._stateScriptDataDoubleEscapeStart(t);
        break;
      }
      case l.SCRIPT_DATA_DOUBLE_ESCAPED: {
        this._stateScriptDataDoubleEscaped(t);
        break;
      }
      case l.SCRIPT_DATA_DOUBLE_ESCAPED_DASH: {
        this._stateScriptDataDoubleEscapedDash(t);
        break;
      }
      case l.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH: {
        this._stateScriptDataDoubleEscapedDashDash(t);
        break;
      }
      case l.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN: {
        this._stateScriptDataDoubleEscapedLessThanSign(t);
        break;
      }
      case l.SCRIPT_DATA_DOUBLE_ESCAPE_END: {
        this._stateScriptDataDoubleEscapeEnd(t);
        break;
      }
      case l.BEFORE_ATTRIBUTE_NAME: {
        this._stateBeforeAttributeName(t);
        break;
      }
      case l.ATTRIBUTE_NAME: {
        this._stateAttributeName(t);
        break;
      }
      case l.AFTER_ATTRIBUTE_NAME: {
        this._stateAfterAttributeName(t);
        break;
      }
      case l.BEFORE_ATTRIBUTE_VALUE: {
        this._stateBeforeAttributeValue(t);
        break;
      }
      case l.ATTRIBUTE_VALUE_DOUBLE_QUOTED: {
        this._stateAttributeValueDoubleQuoted(t);
        break;
      }
      case l.ATTRIBUTE_VALUE_SINGLE_QUOTED: {
        this._stateAttributeValueSingleQuoted(t);
        break;
      }
      case l.ATTRIBUTE_VALUE_UNQUOTED: {
        this._stateAttributeValueUnquoted(t);
        break;
      }
      case l.AFTER_ATTRIBUTE_VALUE_QUOTED: {
        this._stateAfterAttributeValueQuoted(t);
        break;
      }
      case l.SELF_CLOSING_START_TAG: {
        this._stateSelfClosingStartTag(t);
        break;
      }
      case l.BOGUS_COMMENT: {
        this._stateBogusComment(t);
        break;
      }
      case l.MARKUP_DECLARATION_OPEN: {
        this._stateMarkupDeclarationOpen(t);
        break;
      }
      case l.COMMENT_START: {
        this._stateCommentStart(t);
        break;
      }
      case l.COMMENT_START_DASH: {
        this._stateCommentStartDash(t);
        break;
      }
      case l.COMMENT: {
        this._stateComment(t);
        break;
      }
      case l.COMMENT_LESS_THAN_SIGN: {
        this._stateCommentLessThanSign(t);
        break;
      }
      case l.COMMENT_LESS_THAN_SIGN_BANG: {
        this._stateCommentLessThanSignBang(t);
        break;
      }
      case l.COMMENT_LESS_THAN_SIGN_BANG_DASH: {
        this._stateCommentLessThanSignBangDash(t);
        break;
      }
      case l.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH: {
        this._stateCommentLessThanSignBangDashDash(t);
        break;
      }
      case l.COMMENT_END_DASH: {
        this._stateCommentEndDash(t);
        break;
      }
      case l.COMMENT_END: {
        this._stateCommentEnd(t);
        break;
      }
      case l.COMMENT_END_BANG: {
        this._stateCommentEndBang(t);
        break;
      }
      case l.DOCTYPE: {
        this._stateDoctype(t);
        break;
      }
      case l.BEFORE_DOCTYPE_NAME: {
        this._stateBeforeDoctypeName(t);
        break;
      }
      case l.DOCTYPE_NAME: {
        this._stateDoctypeName(t);
        break;
      }
      case l.AFTER_DOCTYPE_NAME: {
        this._stateAfterDoctypeName(t);
        break;
      }
      case l.AFTER_DOCTYPE_PUBLIC_KEYWORD: {
        this._stateAfterDoctypePublicKeyword(t);
        break;
      }
      case l.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER: {
        this._stateBeforeDoctypePublicIdentifier(t);
        break;
      }
      case l.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED: {
        this._stateDoctypePublicIdentifierDoubleQuoted(t);
        break;
      }
      case l.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED: {
        this._stateDoctypePublicIdentifierSingleQuoted(t);
        break;
      }
      case l.AFTER_DOCTYPE_PUBLIC_IDENTIFIER: {
        this._stateAfterDoctypePublicIdentifier(t);
        break;
      }
      case l.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS: {
        this._stateBetweenDoctypePublicAndSystemIdentifiers(t);
        break;
      }
      case l.AFTER_DOCTYPE_SYSTEM_KEYWORD: {
        this._stateAfterDoctypeSystemKeyword(t);
        break;
      }
      case l.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER: {
        this._stateBeforeDoctypeSystemIdentifier(t);
        break;
      }
      case l.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED: {
        this._stateDoctypeSystemIdentifierDoubleQuoted(t);
        break;
      }
      case l.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED: {
        this._stateDoctypeSystemIdentifierSingleQuoted(t);
        break;
      }
      case l.AFTER_DOCTYPE_SYSTEM_IDENTIFIER: {
        this._stateAfterDoctypeSystemIdentifier(t);
        break;
      }
      case l.BOGUS_DOCTYPE: {
        this._stateBogusDoctype(t);
        break;
      }
      case l.CDATA_SECTION: {
        this._stateCdataSection(t);
        break;
      }
      case l.CDATA_SECTION_BRACKET: {
        this._stateCdataSectionBracket(t);
        break;
      }
      case l.CDATA_SECTION_END: {
        this._stateCdataSectionEnd(t);
        break;
      }
      case l.CHARACTER_REFERENCE: {
        this._stateCharacterReference(t);
        break;
      }
      case l.NAMED_CHARACTER_REFERENCE: {
        this._stateNamedCharacterReference(t);
        break;
      }
      case l.AMBIGUOUS_AMPERSAND: {
        this._stateAmbiguousAmpersand(t);
        break;
      }
      case l.NUMERIC_CHARACTER_REFERENCE: {
        this._stateNumericCharacterReference(t);
        break;
      }
      case l.HEXADEMICAL_CHARACTER_REFERENCE_START: {
        this._stateHexademicalCharacterReferenceStart(t);
        break;
      }
      case l.HEXADEMICAL_CHARACTER_REFERENCE: {
        this._stateHexademicalCharacterReference(t);
        break;
      }
      case l.DECIMAL_CHARACTER_REFERENCE: {
        this._stateDecimalCharacterReference(t);
        break;
      }
      case l.NUMERIC_CHARACTER_REFERENCE_END: {
        this._stateNumericCharacterReferenceEnd(t);
        break;
      }
      default:
        throw new Error("Unknown state");
    }
  }
  // State machine
  // Data state
  //------------------------------------------------------------------
  _stateData(t) {
    switch (t) {
      case o.LESS_THAN_SIGN: {
        this.state = l.TAG_OPEN;
        break;
      }
      case o.AMPERSAND: {
        this.returnState = l.DATA, this.state = l.CHARACTER_REFERENCE;
        break;
      }
      case o.NULL: {
        this._err(E.unexpectedNullCharacter), this._emitCodePoint(t);
        break;
      }
      case o.EOF: {
        this._emitEOFToken();
        break;
      }
      default:
        this._emitCodePoint(t);
    }
  }
  //  RCDATA state
  //------------------------------------------------------------------
  _stateRcdata(t) {
    switch (t) {
      case o.AMPERSAND: {
        this.returnState = l.RCDATA, this.state = l.CHARACTER_REFERENCE;
        break;
      }
      case o.LESS_THAN_SIGN: {
        this.state = l.RCDATA_LESS_THAN_SIGN;
        break;
      }
      case o.NULL: {
        this._err(E.unexpectedNullCharacter), this._emitChars(P);
        break;
      }
      case o.EOF: {
        this._emitEOFToken();
        break;
      }
      default:
        this._emitCodePoint(t);
    }
  }
  // RAWTEXT state
  //------------------------------------------------------------------
  _stateRawtext(t) {
    switch (t) {
      case o.LESS_THAN_SIGN: {
        this.state = l.RAWTEXT_LESS_THAN_SIGN;
        break;
      }
      case o.NULL: {
        this._err(E.unexpectedNullCharacter), this._emitChars(P);
        break;
      }
      case o.EOF: {
        this._emitEOFToken();
        break;
      }
      default:
        this._emitCodePoint(t);
    }
  }
  // Script data state
  //------------------------------------------------------------------
  _stateScriptData(t) {
    switch (t) {
      case o.LESS_THAN_SIGN: {
        this.state = l.SCRIPT_DATA_LESS_THAN_SIGN;
        break;
      }
      case o.NULL: {
        this._err(E.unexpectedNullCharacter), this._emitChars(P);
        break;
      }
      case o.EOF: {
        this._emitEOFToken();
        break;
      }
      default:
        this._emitCodePoint(t);
    }
  }
  // PLAINTEXT state
  //------------------------------------------------------------------
  _statePlaintext(t) {
    switch (t) {
      case o.NULL: {
        this._err(E.unexpectedNullCharacter), this._emitChars(P);
        break;
      }
      case o.EOF: {
        this._emitEOFToken();
        break;
      }
      default:
        this._emitCodePoint(t);
    }
  }
  // Tag open state
  //------------------------------------------------------------------
  _stateTagOpen(t) {
    if (ge(t))
      this._createStartTagToken(), this.state = l.TAG_NAME, this._stateTagName(t);
    else
      switch (t) {
        case o.EXCLAMATION_MARK: {
          this.state = l.MARKUP_DECLARATION_OPEN;
          break;
        }
        case o.SOLIDUS: {
          this.state = l.END_TAG_OPEN;
          break;
        }
        case o.QUESTION_MARK: {
          this._err(E.unexpectedQuestionMarkInsteadOfTagName), this._createCommentToken(1), this.state = l.BOGUS_COMMENT, this._stateBogusComment(t);
          break;
        }
        case o.EOF: {
          this._err(E.eofBeforeTagName), this._emitChars("<"), this._emitEOFToken();
          break;
        }
        default:
          this._err(E.invalidFirstCharacterOfTagName), this._emitChars("<"), this.state = l.DATA, this._stateData(t);
      }
  }
  // End tag open state
  //------------------------------------------------------------------
  _stateEndTagOpen(t) {
    if (ge(t))
      this._createEndTagToken(), this.state = l.TAG_NAME, this._stateTagName(t);
    else
      switch (t) {
        case o.GREATER_THAN_SIGN: {
          this._err(E.missingEndTagName), this.state = l.DATA;
          break;
        }
        case o.EOF: {
          this._err(E.eofBeforeTagName), this._emitChars("</"), this._emitEOFToken();
          break;
        }
        default:
          this._err(E.invalidFirstCharacterOfTagName), this._createCommentToken(2), this.state = l.BOGUS_COMMENT, this._stateBogusComment(t);
      }
  }
  // Tag name state
  //------------------------------------------------------------------
  _stateTagName(t) {
    const n = this.currentToken;
    switch (t) {
      case o.SPACE:
      case o.LINE_FEED:
      case o.TABULATION:
      case o.FORM_FEED: {
        this.state = l.BEFORE_ATTRIBUTE_NAME;
        break;
      }
      case o.SOLIDUS: {
        this.state = l.SELF_CLOSING_START_TAG;
        break;
      }
      case o.GREATER_THAN_SIGN: {
        this.state = l.DATA, this.emitCurrentTagToken();
        break;
      }
      case o.NULL: {
        this._err(E.unexpectedNullCharacter), n.tagName += P;
        break;
      }
      case o.EOF: {
        this._err(E.eofInTag), this._emitEOFToken();
        break;
      }
      default:
        n.tagName += String.fromCodePoint(Ke(t) ? Rt(t) : t);
    }
  }
  // RCDATA less-than sign state
  //------------------------------------------------------------------
  _stateRcdataLessThanSign(t) {
    t === o.SOLIDUS ? this.state = l.RCDATA_END_TAG_OPEN : (this._emitChars("<"), this.state = l.RCDATA, this._stateRcdata(t));
  }
  // RCDATA end tag open state
  //------------------------------------------------------------------
  _stateRcdataEndTagOpen(t) {
    ge(t) ? (this.state = l.RCDATA_END_TAG_NAME, this._stateRcdataEndTagName(t)) : (this._emitChars("</"), this.state = l.RCDATA, this._stateRcdata(t));
  }
  handleSpecialEndTag(t) {
    if (!this.preprocessor.startsWith(this.lastStartTagName, !1))
      return !this._ensureHibernation();
    this._createEndTagToken();
    const n = this.currentToken;
    switch (n.tagName = this.lastStartTagName, this.preprocessor.peek(this.lastStartTagName.length)) {
      case o.SPACE:
      case o.LINE_FEED:
      case o.TABULATION:
      case o.FORM_FEED:
        return this._advanceBy(this.lastStartTagName.length), this.state = l.BEFORE_ATTRIBUTE_NAME, !1;
      case o.SOLIDUS:
        return this._advanceBy(this.lastStartTagName.length), this.state = l.SELF_CLOSING_START_TAG, !1;
      case o.GREATER_THAN_SIGN:
        return this._advanceBy(this.lastStartTagName.length), this.emitCurrentTagToken(), this.state = l.DATA, !1;
      default:
        return !this._ensureHibernation();
    }
  }
  // RCDATA end tag name state
  //------------------------------------------------------------------
  _stateRcdataEndTagName(t) {
    this.handleSpecialEndTag(t) && (this._emitChars("</"), this.state = l.RCDATA, this._stateRcdata(t));
  }
  // RAWTEXT less-than sign state
  //------------------------------------------------------------------
  _stateRawtextLessThanSign(t) {
    t === o.SOLIDUS ? this.state = l.RAWTEXT_END_TAG_OPEN : (this._emitChars("<"), this.state = l.RAWTEXT, this._stateRawtext(t));
  }
  // RAWTEXT end tag open state
  //------------------------------------------------------------------
  _stateRawtextEndTagOpen(t) {
    ge(t) ? (this.state = l.RAWTEXT_END_TAG_NAME, this._stateRawtextEndTagName(t)) : (this._emitChars("</"), this.state = l.RAWTEXT, this._stateRawtext(t));
  }
  // RAWTEXT end tag name state
  //------------------------------------------------------------------
  _stateRawtextEndTagName(t) {
    this.handleSpecialEndTag(t) && (this._emitChars("</"), this.state = l.RAWTEXT, this._stateRawtext(t));
  }
  // Script data less-than sign state
  //------------------------------------------------------------------
  _stateScriptDataLessThanSign(t) {
    switch (t) {
      case o.SOLIDUS: {
        this.state = l.SCRIPT_DATA_END_TAG_OPEN;
        break;
      }
      case o.EXCLAMATION_MARK: {
        this.state = l.SCRIPT_DATA_ESCAPE_START, this._emitChars("<!");
        break;
      }
      default:
        this._emitChars("<"), this.state = l.SCRIPT_DATA, this._stateScriptData(t);
    }
  }
  // Script data end tag open state
  //------------------------------------------------------------------
  _stateScriptDataEndTagOpen(t) {
    ge(t) ? (this.state = l.SCRIPT_DATA_END_TAG_NAME, this._stateScriptDataEndTagName(t)) : (this._emitChars("</"), this.state = l.SCRIPT_DATA, this._stateScriptData(t));
  }
  // Script data end tag name state
  //------------------------------------------------------------------
  _stateScriptDataEndTagName(t) {
    this.handleSpecialEndTag(t) && (this._emitChars("</"), this.state = l.SCRIPT_DATA, this._stateScriptData(t));
  }
  // Script data escape start state
  //------------------------------------------------------------------
  _stateScriptDataEscapeStart(t) {
    t === o.HYPHEN_MINUS ? (this.state = l.SCRIPT_DATA_ESCAPE_START_DASH, this._emitChars("-")) : (this.state = l.SCRIPT_DATA, this._stateScriptData(t));
  }
  // Script data escape start dash state
  //------------------------------------------------------------------
  _stateScriptDataEscapeStartDash(t) {
    t === o.HYPHEN_MINUS ? (this.state = l.SCRIPT_DATA_ESCAPED_DASH_DASH, this._emitChars("-")) : (this.state = l.SCRIPT_DATA, this._stateScriptData(t));
  }
  // Script data escaped state
  //------------------------------------------------------------------
  _stateScriptDataEscaped(t) {
    switch (t) {
      case o.HYPHEN_MINUS: {
        this.state = l.SCRIPT_DATA_ESCAPED_DASH, this._emitChars("-");
        break;
      }
      case o.LESS_THAN_SIGN: {
        this.state = l.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
        break;
      }
      case o.NULL: {
        this._err(E.unexpectedNullCharacter), this._emitChars(P);
        break;
      }
      case o.EOF: {
        this._err(E.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
        break;
      }
      default:
        this._emitCodePoint(t);
    }
  }
  // Script data escaped dash state
  //------------------------------------------------------------------
  _stateScriptDataEscapedDash(t) {
    switch (t) {
      case o.HYPHEN_MINUS: {
        this.state = l.SCRIPT_DATA_ESCAPED_DASH_DASH, this._emitChars("-");
        break;
      }
      case o.LESS_THAN_SIGN: {
        this.state = l.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
        break;
      }
      case o.NULL: {
        this._err(E.unexpectedNullCharacter), this.state = l.SCRIPT_DATA_ESCAPED, this._emitChars(P);
        break;
      }
      case o.EOF: {
        this._err(E.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
        break;
      }
      default:
        this.state = l.SCRIPT_DATA_ESCAPED, this._emitCodePoint(t);
    }
  }
  // Script data escaped dash dash state
  //------------------------------------------------------------------
  _stateScriptDataEscapedDashDash(t) {
    switch (t) {
      case o.HYPHEN_MINUS: {
        this._emitChars("-");
        break;
      }
      case o.LESS_THAN_SIGN: {
        this.state = l.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
        break;
      }
      case o.GREATER_THAN_SIGN: {
        this.state = l.SCRIPT_DATA, this._emitChars(">");
        break;
      }
      case o.NULL: {
        this._err(E.unexpectedNullCharacter), this.state = l.SCRIPT_DATA_ESCAPED, this._emitChars(P);
        break;
      }
      case o.EOF: {
        this._err(E.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
        break;
      }
      default:
        this.state = l.SCRIPT_DATA_ESCAPED, this._emitCodePoint(t);
    }
  }
  // Script data escaped less-than sign state
  //------------------------------------------------------------------
  _stateScriptDataEscapedLessThanSign(t) {
    t === o.SOLIDUS ? this.state = l.SCRIPT_DATA_ESCAPED_END_TAG_OPEN : ge(t) ? (this._emitChars("<"), this.state = l.SCRIPT_DATA_DOUBLE_ESCAPE_START, this._stateScriptDataDoubleEscapeStart(t)) : (this._emitChars("<"), this.state = l.SCRIPT_DATA_ESCAPED, this._stateScriptDataEscaped(t));
  }
  // Script data escaped end tag open state
  //------------------------------------------------------------------
  _stateScriptDataEscapedEndTagOpen(t) {
    ge(t) ? (this.state = l.SCRIPT_DATA_ESCAPED_END_TAG_NAME, this._stateScriptDataEscapedEndTagName(t)) : (this._emitChars("</"), this.state = l.SCRIPT_DATA_ESCAPED, this._stateScriptDataEscaped(t));
  }
  // Script data escaped end tag name state
  //------------------------------------------------------------------
  _stateScriptDataEscapedEndTagName(t) {
    this.handleSpecialEndTag(t) && (this._emitChars("</"), this.state = l.SCRIPT_DATA_ESCAPED, this._stateScriptDataEscaped(t));
  }
  // Script data double escape start state
  //------------------------------------------------------------------
  _stateScriptDataDoubleEscapeStart(t) {
    if (this.preprocessor.startsWith(Q.SCRIPT, !1) && ia(this.preprocessor.peek(Q.SCRIPT.length))) {
      this._emitCodePoint(t);
      for (let n = 0; n < Q.SCRIPT.length; n++)
        this._emitCodePoint(this._consume());
      this.state = l.SCRIPT_DATA_DOUBLE_ESCAPED;
    } else
      this._ensureHibernation() || (this.state = l.SCRIPT_DATA_ESCAPED, this._stateScriptDataEscaped(t));
  }
  // Script data double escaped state
  //------------------------------------------------------------------
  _stateScriptDataDoubleEscaped(t) {
    switch (t) {
      case o.HYPHEN_MINUS: {
        this.state = l.SCRIPT_DATA_DOUBLE_ESCAPED_DASH, this._emitChars("-");
        break;
      }
      case o.LESS_THAN_SIGN: {
        this.state = l.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN, this._emitChars("<");
        break;
      }
      case o.NULL: {
        this._err(E.unexpectedNullCharacter), this._emitChars(P);
        break;
      }
      case o.EOF: {
        this._err(E.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
        break;
      }
      default:
        this._emitCodePoint(t);
    }
  }
  // Script data double escaped dash state
  //------------------------------------------------------------------
  _stateScriptDataDoubleEscapedDash(t) {
    switch (t) {
      case o.HYPHEN_MINUS: {
        this.state = l.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH, this._emitChars("-");
        break;
      }
      case o.LESS_THAN_SIGN: {
        this.state = l.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN, this._emitChars("<");
        break;
      }
      case o.NULL: {
        this._err(E.unexpectedNullCharacter), this.state = l.SCRIPT_DATA_DOUBLE_ESCAPED, this._emitChars(P);
        break;
      }
      case o.EOF: {
        this._err(E.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
        break;
      }
      default:
        this.state = l.SCRIPT_DATA_DOUBLE_ESCAPED, this._emitCodePoint(t);
    }
  }
  // Script data double escaped dash dash state
  //------------------------------------------------------------------
  _stateScriptDataDoubleEscapedDashDash(t) {
    switch (t) {
      case o.HYPHEN_MINUS: {
        this._emitChars("-");
        break;
      }
      case o.LESS_THAN_SIGN: {
        this.state = l.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN, this._emitChars("<");
        break;
      }
      case o.GREATER_THAN_SIGN: {
        this.state = l.SCRIPT_DATA, this._emitChars(">");
        break;
      }
      case o.NULL: {
        this._err(E.unexpectedNullCharacter), this.state = l.SCRIPT_DATA_DOUBLE_ESCAPED, this._emitChars(P);
        break;
      }
      case o.EOF: {
        this._err(E.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
        break;
      }
      default:
        this.state = l.SCRIPT_DATA_DOUBLE_ESCAPED, this._emitCodePoint(t);
    }
  }
  // Script data double escaped less-than sign state
  //------------------------------------------------------------------
  _stateScriptDataDoubleEscapedLessThanSign(t) {
    t === o.SOLIDUS ? (this.state = l.SCRIPT_DATA_DOUBLE_ESCAPE_END, this._emitChars("/")) : (this.state = l.SCRIPT_DATA_DOUBLE_ESCAPED, this._stateScriptDataDoubleEscaped(t));
  }
  // Script data double escape end state
  //------------------------------------------------------------------
  _stateScriptDataDoubleEscapeEnd(t) {
    if (this.preprocessor.startsWith(Q.SCRIPT, !1) && ia(this.preprocessor.peek(Q.SCRIPT.length))) {
      this._emitCodePoint(t);
      for (let n = 0; n < Q.SCRIPT.length; n++)
        this._emitCodePoint(this._consume());
      this.state = l.SCRIPT_DATA_ESCAPED;
    } else
      this._ensureHibernation() || (this.state = l.SCRIPT_DATA_DOUBLE_ESCAPED, this._stateScriptDataDoubleEscaped(t));
  }
  // Before attribute name state
  //------------------------------------------------------------------
  _stateBeforeAttributeName(t) {
    switch (t) {
      case o.SPACE:
      case o.LINE_FEED:
      case o.TABULATION:
      case o.FORM_FEED:
        break;
      case o.SOLIDUS:
      case o.GREATER_THAN_SIGN:
      case o.EOF: {
        this.state = l.AFTER_ATTRIBUTE_NAME, this._stateAfterAttributeName(t);
        break;
      }
      case o.EQUALS_SIGN: {
        this._err(E.unexpectedEqualsSignBeforeAttributeName), this._createAttr("="), this.state = l.ATTRIBUTE_NAME;
        break;
      }
      default:
        this._createAttr(""), this.state = l.ATTRIBUTE_NAME, this._stateAttributeName(t);
    }
  }
  // Attribute name state
  //------------------------------------------------------------------
  _stateAttributeName(t) {
    switch (t) {
      case o.SPACE:
      case o.LINE_FEED:
      case o.TABULATION:
      case o.FORM_FEED:
      case o.SOLIDUS:
      case o.GREATER_THAN_SIGN:
      case o.EOF: {
        this._leaveAttrName(), this.state = l.AFTER_ATTRIBUTE_NAME, this._stateAfterAttributeName(t);
        break;
      }
      case o.EQUALS_SIGN: {
        this._leaveAttrName(), this.state = l.BEFORE_ATTRIBUTE_VALUE;
        break;
      }
      case o.QUOTATION_MARK:
      case o.APOSTROPHE:
      case o.LESS_THAN_SIGN: {
        this._err(E.unexpectedCharacterInAttributeName), this.currentAttr.name += String.fromCodePoint(t);
        break;
      }
      case o.NULL: {
        this._err(E.unexpectedNullCharacter), this.currentAttr.name += P;
        break;
      }
      default:
        this.currentAttr.name += String.fromCodePoint(Ke(t) ? Rt(t) : t);
    }
  }
  // After attribute name state
  //------------------------------------------------------------------
  _stateAfterAttributeName(t) {
    switch (t) {
      case o.SPACE:
      case o.LINE_FEED:
      case o.TABULATION:
      case o.FORM_FEED:
        break;
      case o.SOLIDUS: {
        this.state = l.SELF_CLOSING_START_TAG;
        break;
      }
      case o.EQUALS_SIGN: {
        this.state = l.BEFORE_ATTRIBUTE_VALUE;
        break;
      }
      case o.GREATER_THAN_SIGN: {
        this.state = l.DATA, this.emitCurrentTagToken();
        break;
      }
      case o.EOF: {
        this._err(E.eofInTag), this._emitEOFToken();
        break;
      }
      default:
        this._createAttr(""), this.state = l.ATTRIBUTE_NAME, this._stateAttributeName(t);
    }
  }
  // Before attribute value state
  //------------------------------------------------------------------
  _stateBeforeAttributeValue(t) {
    switch (t) {
      case o.SPACE:
      case o.LINE_FEED:
      case o.TABULATION:
      case o.FORM_FEED:
        break;
      case o.QUOTATION_MARK: {
        this.state = l.ATTRIBUTE_VALUE_DOUBLE_QUOTED;
        break;
      }
      case o.APOSTROPHE: {
        this.state = l.ATTRIBUTE_VALUE_SINGLE_QUOTED;
        break;
      }
      case o.GREATER_THAN_SIGN: {
        this._err(E.missingAttributeValue), this.state = l.DATA, this.emitCurrentTagToken();
        break;
      }
      default:
        this.state = l.ATTRIBUTE_VALUE_UNQUOTED, this._stateAttributeValueUnquoted(t);
    }
  }
  // Attribute value (double-quoted) state
  //------------------------------------------------------------------
  _stateAttributeValueDoubleQuoted(t) {
    switch (t) {
      case o.QUOTATION_MARK: {
        this.state = l.AFTER_ATTRIBUTE_VALUE_QUOTED;
        break;
      }
      case o.AMPERSAND: {
        this.returnState = l.ATTRIBUTE_VALUE_DOUBLE_QUOTED, this.state = l.CHARACTER_REFERENCE;
        break;
      }
      case o.NULL: {
        this._err(E.unexpectedNullCharacter), this.currentAttr.value += P;
        break;
      }
      case o.EOF: {
        this._err(E.eofInTag), this._emitEOFToken();
        break;
      }
      default:
        this.currentAttr.value += String.fromCodePoint(t);
    }
  }
  // Attribute value (single-quoted) state
  //------------------------------------------------------------------
  _stateAttributeValueSingleQuoted(t) {
    switch (t) {
      case o.APOSTROPHE: {
        this.state = l.AFTER_ATTRIBUTE_VALUE_QUOTED;
        break;
      }
      case o.AMPERSAND: {
        this.returnState = l.ATTRIBUTE_VALUE_SINGLE_QUOTED, this.state = l.CHARACTER_REFERENCE;
        break;
      }
      case o.NULL: {
        this._err(E.unexpectedNullCharacter), this.currentAttr.value += P;
        break;
      }
      case o.EOF: {
        this._err(E.eofInTag), this._emitEOFToken();
        break;
      }
      default:
        this.currentAttr.value += String.fromCodePoint(t);
    }
  }
  // Attribute value (unquoted) state
  //------------------------------------------------------------------
  _stateAttributeValueUnquoted(t) {
    switch (t) {
      case o.SPACE:
      case o.LINE_FEED:
      case o.TABULATION:
      case o.FORM_FEED: {
        this._leaveAttrValue(), this.state = l.BEFORE_ATTRIBUTE_NAME;
        break;
      }
      case o.AMPERSAND: {
        this.returnState = l.ATTRIBUTE_VALUE_UNQUOTED, this.state = l.CHARACTER_REFERENCE;
        break;
      }
      case o.GREATER_THAN_SIGN: {
        this._leaveAttrValue(), this.state = l.DATA, this.emitCurrentTagToken();
        break;
      }
      case o.NULL: {
        this._err(E.unexpectedNullCharacter), this.currentAttr.value += P;
        break;
      }
      case o.QUOTATION_MARK:
      case o.APOSTROPHE:
      case o.LESS_THAN_SIGN:
      case o.EQUALS_SIGN:
      case o.GRAVE_ACCENT: {
        this._err(E.unexpectedCharacterInUnquotedAttributeValue), this.currentAttr.value += String.fromCodePoint(t);
        break;
      }
      case o.EOF: {
        this._err(E.eofInTag), this._emitEOFToken();
        break;
      }
      default:
        this.currentAttr.value += String.fromCodePoint(t);
    }
  }
  // After attribute value (quoted) state
  //------------------------------------------------------------------
  _stateAfterAttributeValueQuoted(t) {
    switch (t) {
      case o.SPACE:
      case o.LINE_FEED:
      case o.TABULATION:
      case o.FORM_FEED: {
        this._leaveAttrValue(), this.state = l.BEFORE_ATTRIBUTE_NAME;
        break;
      }
      case o.SOLIDUS: {
        this._leaveAttrValue(), this.state = l.SELF_CLOSING_START_TAG;
        break;
      }
      case o.GREATER_THAN_SIGN: {
        this._leaveAttrValue(), this.state = l.DATA, this.emitCurrentTagToken();
        break;
      }
      case o.EOF: {
        this._err(E.eofInTag), this._emitEOFToken();
        break;
      }
      default:
        this._err(E.missingWhitespaceBetweenAttributes), this.state = l.BEFORE_ATTRIBUTE_NAME, this._stateBeforeAttributeName(t);
    }
  }
  // Self-closing start tag state
  //------------------------------------------------------------------
  _stateSelfClosingStartTag(t) {
    switch (t) {
      case o.GREATER_THAN_SIGN: {
        const n = this.currentToken;
        n.selfClosing = !0, this.state = l.DATA, this.emitCurrentTagToken();
        break;
      }
      case o.EOF: {
        this._err(E.eofInTag), this._emitEOFToken();
        break;
      }
      default:
        this._err(E.unexpectedSolidusInTag), this.state = l.BEFORE_ATTRIBUTE_NAME, this._stateBeforeAttributeName(t);
    }
  }
  // Bogus comment state
  //------------------------------------------------------------------
  _stateBogusComment(t) {
    const n = this.currentToken;
    switch (t) {
      case o.GREATER_THAN_SIGN: {
        this.state = l.DATA, this.emitCurrentComment(n);
        break;
      }
      case o.EOF: {
        this.emitCurrentComment(n), this._emitEOFToken();
        break;
      }
      case o.NULL: {
        this._err(E.unexpectedNullCharacter), n.data += P;
        break;
      }
      default:
        n.data += String.fromCodePoint(t);
    }
  }
  // Markup declaration open state
  //------------------------------------------------------------------
  _stateMarkupDeclarationOpen(t) {
    this._consumeSequenceIfMatch(Q.DASH_DASH, !0) ? (this._createCommentToken(Q.DASH_DASH.length + 1), this.state = l.COMMENT_START) : this._consumeSequenceIfMatch(Q.DOCTYPE, !1) ? (this.currentLocation = this.getCurrentLocation(Q.DOCTYPE.length + 1), this.state = l.DOCTYPE) : this._consumeSequenceIfMatch(Q.CDATA_START, !0) ? this.inForeignNode ? this.state = l.CDATA_SECTION : (this._err(E.cdataInHtmlContent), this._createCommentToken(Q.CDATA_START.length + 1), this.currentToken.data = "[CDATA[", this.state = l.BOGUS_COMMENT) : this._ensureHibernation() || (this._err(E.incorrectlyOpenedComment), this._createCommentToken(2), this.state = l.BOGUS_COMMENT, this._stateBogusComment(t));
  }
  // Comment start state
  //------------------------------------------------------------------
  _stateCommentStart(t) {
    switch (t) {
      case o.HYPHEN_MINUS: {
        this.state = l.COMMENT_START_DASH;
        break;
      }
      case o.GREATER_THAN_SIGN: {
        this._err(E.abruptClosingOfEmptyComment), this.state = l.DATA;
        const n = this.currentToken;
        this.emitCurrentComment(n);
        break;
      }
      default:
        this.state = l.COMMENT, this._stateComment(t);
    }
  }
  // Comment start dash state
  //------------------------------------------------------------------
  _stateCommentStartDash(t) {
    const n = this.currentToken;
    switch (t) {
      case o.HYPHEN_MINUS: {
        this.state = l.COMMENT_END;
        break;
      }
      case o.GREATER_THAN_SIGN: {
        this._err(E.abruptClosingOfEmptyComment), this.state = l.DATA, this.emitCurrentComment(n);
        break;
      }
      case o.EOF: {
        this._err(E.eofInComment), this.emitCurrentComment(n), this._emitEOFToken();
        break;
      }
      default:
        n.data += "-", this.state = l.COMMENT, this._stateComment(t);
    }
  }
  // Comment state
  //------------------------------------------------------------------
  _stateComment(t) {
    const n = this.currentToken;
    switch (t) {
      case o.HYPHEN_MINUS: {
        this.state = l.COMMENT_END_DASH;
        break;
      }
      case o.LESS_THAN_SIGN: {
        n.data += "<", this.state = l.COMMENT_LESS_THAN_SIGN;
        break;
      }
      case o.NULL: {
        this._err(E.unexpectedNullCharacter), n.data += P;
        break;
      }
      case o.EOF: {
        this._err(E.eofInComment), this.emitCurrentComment(n), this._emitEOFToken();
        break;
      }
      default:
        n.data += String.fromCodePoint(t);
    }
  }
  // Comment less-than sign state
  //------------------------------------------------------------------
  _stateCommentLessThanSign(t) {
    const n = this.currentToken;
    switch (t) {
      case o.EXCLAMATION_MARK: {
        n.data += "!", this.state = l.COMMENT_LESS_THAN_SIGN_BANG;
        break;
      }
      case o.LESS_THAN_SIGN: {
        n.data += "<";
        break;
      }
      default:
        this.state = l.COMMENT, this._stateComment(t);
    }
  }
  // Comment less-than sign bang state
  //------------------------------------------------------------------
  _stateCommentLessThanSignBang(t) {
    t === o.HYPHEN_MINUS ? this.state = l.COMMENT_LESS_THAN_SIGN_BANG_DASH : (this.state = l.COMMENT, this._stateComment(t));
  }
  // Comment less-than sign bang dash state
  //------------------------------------------------------------------
  _stateCommentLessThanSignBangDash(t) {
    t === o.HYPHEN_MINUS ? this.state = l.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH : (this.state = l.COMMENT_END_DASH, this._stateCommentEndDash(t));
  }
  // Comment less-than sign bang dash dash state
  //------------------------------------------------------------------
  _stateCommentLessThanSignBangDashDash(t) {
    t !== o.GREATER_THAN_SIGN && t !== o.EOF && this._err(E.nestedComment), this.state = l.COMMENT_END, this._stateCommentEnd(t);
  }
  // Comment end dash state
  //------------------------------------------------------------------
  _stateCommentEndDash(t) {
    const n = this.currentToken;
    switch (t) {
      case o.HYPHEN_MINUS: {
        this.state = l.COMMENT_END;
        break;
      }
      case o.EOF: {
        this._err(E.eofInComment), this.emitCurrentComment(n), this._emitEOFToken();
        break;
      }
      default:
        n.data += "-", this.state = l.COMMENT, this._stateComment(t);
    }
  }
  // Comment end state
  //------------------------------------------------------------------
  _stateCommentEnd(t) {
    const n = this.currentToken;
    switch (t) {
      case o.GREATER_THAN_SIGN: {
        this.state = l.DATA, this.emitCurrentComment(n);
        break;
      }
      case o.EXCLAMATION_MARK: {
        this.state = l.COMMENT_END_BANG;
        break;
      }
      case o.HYPHEN_MINUS: {
        n.data += "-";
        break;
      }
      case o.EOF: {
        this._err(E.eofInComment), this.emitCurrentComment(n), this._emitEOFToken();
        break;
      }
      default:
        n.data += "--", this.state = l.COMMENT, this._stateComment(t);
    }
  }
  // Comment end bang state
  //------------------------------------------------------------------
  _stateCommentEndBang(t) {
    const n = this.currentToken;
    switch (t) {
      case o.HYPHEN_MINUS: {
        n.data += "--!", this.state = l.COMMENT_END_DASH;
        break;
      }
      case o.GREATER_THAN_SIGN: {
        this._err(E.incorrectlyClosedComment), this.state = l.DATA, this.emitCurrentComment(n);
        break;
      }
      case o.EOF: {
        this._err(E.eofInComment), this.emitCurrentComment(n), this._emitEOFToken();
        break;
      }
      default:
        n.data += "--!", this.state = l.COMMENT, this._stateComment(t);
    }
  }
  // DOCTYPE state
  //------------------------------------------------------------------
  _stateDoctype(t) {
    switch (t) {
      case o.SPACE:
      case o.LINE_FEED:
      case o.TABULATION:
      case o.FORM_FEED: {
        this.state = l.BEFORE_DOCTYPE_NAME;
        break;
      }
      case o.GREATER_THAN_SIGN: {
        this.state = l.BEFORE_DOCTYPE_NAME, this._stateBeforeDoctypeName(t);
        break;
      }
      case o.EOF: {
        this._err(E.eofInDoctype), this._createDoctypeToken(null);
        const n = this.currentToken;
        n.forceQuirks = !0, this.emitCurrentDoctype(n), this._emitEOFToken();
        break;
      }
      default:
        this._err(E.missingWhitespaceBeforeDoctypeName), this.state = l.BEFORE_DOCTYPE_NAME, this._stateBeforeDoctypeName(t);
    }
  }
  // Before DOCTYPE name state
  //------------------------------------------------------------------
  _stateBeforeDoctypeName(t) {
    if (Ke(t))
      this._createDoctypeToken(String.fromCharCode(Rt(t))), this.state = l.DOCTYPE_NAME;
    else
      switch (t) {
        case o.SPACE:
        case o.LINE_FEED:
        case o.TABULATION:
        case o.FORM_FEED:
          break;
        case o.NULL: {
          this._err(E.unexpectedNullCharacter), this._createDoctypeToken(P), this.state = l.DOCTYPE_NAME;
          break;
        }
        case o.GREATER_THAN_SIGN: {
          this._err(E.missingDoctypeName), this._createDoctypeToken(null);
          const n = this.currentToken;
          n.forceQuirks = !0, this.emitCurrentDoctype(n), this.state = l.DATA;
          break;
        }
        case o.EOF: {
          this._err(E.eofInDoctype), this._createDoctypeToken(null);
          const n = this.currentToken;
          n.forceQuirks = !0, this.emitCurrentDoctype(n), this._emitEOFToken();
          break;
        }
        default:
          this._createDoctypeToken(String.fromCodePoint(t)), this.state = l.DOCTYPE_NAME;
      }
  }
  // DOCTYPE name state
  //------------------------------------------------------------------
  _stateDoctypeName(t) {
    const n = this.currentToken;
    switch (t) {
      case o.SPACE:
      case o.LINE_FEED:
      case o.TABULATION:
      case o.FORM_FEED: {
        this.state = l.AFTER_DOCTYPE_NAME;
        break;
      }
      case o.GREATER_THAN_SIGN: {
        this.state = l.DATA, this.emitCurrentDoctype(n);
        break;
      }
      case o.NULL: {
        this._err(E.unexpectedNullCharacter), n.name += P;
        break;
      }
      case o.EOF: {
        this._err(E.eofInDoctype), n.forceQuirks = !0, this.emitCurrentDoctype(n), this._emitEOFToken();
        break;
      }
      default:
        n.name += String.fromCodePoint(Ke(t) ? Rt(t) : t);
    }
  }
  // After DOCTYPE name state
  //------------------------------------------------------------------
  _stateAfterDoctypeName(t) {
    const n = this.currentToken;
    switch (t) {
      case o.SPACE:
      case o.LINE_FEED:
      case o.TABULATION:
      case o.FORM_FEED:
        break;
      case o.GREATER_THAN_SIGN: {
        this.state = l.DATA, this.emitCurrentDoctype(n);
        break;
      }
      case o.EOF: {
        this._err(E.eofInDoctype), n.forceQuirks = !0, this.emitCurrentDoctype(n), this._emitEOFToken();
        break;
      }
      default:
        this._consumeSequenceIfMatch(Q.PUBLIC, !1) ? this.state = l.AFTER_DOCTYPE_PUBLIC_KEYWORD : this._consumeSequenceIfMatch(Q.SYSTEM, !1) ? this.state = l.AFTER_DOCTYPE_SYSTEM_KEYWORD : this._ensureHibernation() || (this._err(E.invalidCharacterSequenceAfterDoctypeName), n.forceQuirks = !0, this.state = l.BOGUS_DOCTYPE, this._stateBogusDoctype(t));
    }
  }
  // After DOCTYPE public keyword state
  //------------------------------------------------------------------
  _stateAfterDoctypePublicKeyword(t) {
    const n = this.currentToken;
    switch (t) {
      case o.SPACE:
      case o.LINE_FEED:
      case o.TABULATION:
      case o.FORM_FEED: {
        this.state = l.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER;
        break;
      }
      case o.QUOTATION_MARK: {
        this._err(E.missingWhitespaceAfterDoctypePublicKeyword), n.publicId = "", this.state = l.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;
        break;
      }
      case o.APOSTROPHE: {
        this._err(E.missingWhitespaceAfterDoctypePublicKeyword), n.publicId = "", this.state = l.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;
        break;
      }
      case o.GREATER_THAN_SIGN: {
        this._err(E.missingDoctypePublicIdentifier), n.forceQuirks = !0, this.state = l.DATA, this.emitCurrentDoctype(n);
        break;
      }
      case o.EOF: {
        this._err(E.eofInDoctype), n.forceQuirks = !0, this.emitCurrentDoctype(n), this._emitEOFToken();
        break;
      }
      default:
        this._err(E.missingQuoteBeforeDoctypePublicIdentifier), n.forceQuirks = !0, this.state = l.BOGUS_DOCTYPE, this._stateBogusDoctype(t);
    }
  }
  // Before DOCTYPE public identifier state
  //------------------------------------------------------------------
  _stateBeforeDoctypePublicIdentifier(t) {
    const n = this.currentToken;
    switch (t) {
      case o.SPACE:
      case o.LINE_FEED:
      case o.TABULATION:
      case o.FORM_FEED:
        break;
      case o.QUOTATION_MARK: {
        n.publicId = "", this.state = l.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;
        break;
      }
      case o.APOSTROPHE: {
        n.publicId = "", this.state = l.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;
        break;
      }
      case o.GREATER_THAN_SIGN: {
        this._err(E.missingDoctypePublicIdentifier), n.forceQuirks = !0, this.state = l.DATA, this.emitCurrentDoctype(n);
        break;
      }
      case o.EOF: {
        this._err(E.eofInDoctype), n.forceQuirks = !0, this.emitCurrentDoctype(n), this._emitEOFToken();
        break;
      }
      default:
        this._err(E.missingQuoteBeforeDoctypePublicIdentifier), n.forceQuirks = !0, this.state = l.BOGUS_DOCTYPE, this._stateBogusDoctype(t);
    }
  }
  // DOCTYPE public identifier (double-quoted) state
  //------------------------------------------------------------------
  _stateDoctypePublicIdentifierDoubleQuoted(t) {
    const n = this.currentToken;
    switch (t) {
      case o.QUOTATION_MARK: {
        this.state = l.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;
        break;
      }
      case o.NULL: {
        this._err(E.unexpectedNullCharacter), n.publicId += P;
        break;
      }
      case o.GREATER_THAN_SIGN: {
        this._err(E.abruptDoctypePublicIdentifier), n.forceQuirks = !0, this.emitCurrentDoctype(n), this.state = l.DATA;
        break;
      }
      case o.EOF: {
        this._err(E.eofInDoctype), n.forceQuirks = !0, this.emitCurrentDoctype(n), this._emitEOFToken();
        break;
      }
      default:
        n.publicId += String.fromCodePoint(t);
    }
  }
  // DOCTYPE public identifier (single-quoted) state
  //------------------------------------------------------------------
  _stateDoctypePublicIdentifierSingleQuoted(t) {
    const n = this.currentToken;
    switch (t) {
      case o.APOSTROPHE: {
        this.state = l.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;
        break;
      }
      case o.NULL: {
        this._err(E.unexpectedNullCharacter), n.publicId += P;
        break;
      }
      case o.GREATER_THAN_SIGN: {
        this._err(E.abruptDoctypePublicIdentifier), n.forceQuirks = !0, this.emitCurrentDoctype(n), this.state = l.DATA;
        break;
      }
      case o.EOF: {
        this._err(E.eofInDoctype), n.forceQuirks = !0, this.emitCurrentDoctype(n), this._emitEOFToken();
        break;
      }
      default:
        n.publicId += String.fromCodePoint(t);
    }
  }
  // After DOCTYPE public identifier state
  //------------------------------------------------------------------
  _stateAfterDoctypePublicIdentifier(t) {
    const n = this.currentToken;
    switch (t) {
      case o.SPACE:
      case o.LINE_FEED:
      case o.TABULATION:
      case o.FORM_FEED: {
        this.state = l.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS;
        break;
      }
      case o.GREATER_THAN_SIGN: {
        this.state = l.DATA, this.emitCurrentDoctype(n);
        break;
      }
      case o.QUOTATION_MARK: {
        this._err(E.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers), n.systemId = "", this.state = l.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
        break;
      }
      case o.APOSTROPHE: {
        this._err(E.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers), n.systemId = "", this.state = l.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
        break;
      }
      case o.EOF: {
        this._err(E.eofInDoctype), n.forceQuirks = !0, this.emitCurrentDoctype(n), this._emitEOFToken();
        break;
      }
      default:
        this._err(E.missingQuoteBeforeDoctypeSystemIdentifier), n.forceQuirks = !0, this.state = l.BOGUS_DOCTYPE, this._stateBogusDoctype(t);
    }
  }
  // Between DOCTYPE public and system identifiers state
  //------------------------------------------------------------------
  _stateBetweenDoctypePublicAndSystemIdentifiers(t) {
    const n = this.currentToken;
    switch (t) {
      case o.SPACE:
      case o.LINE_FEED:
      case o.TABULATION:
      case o.FORM_FEED:
        break;
      case o.GREATER_THAN_SIGN: {
        this.emitCurrentDoctype(n), this.state = l.DATA;
        break;
      }
      case o.QUOTATION_MARK: {
        n.systemId = "", this.state = l.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
        break;
      }
      case o.APOSTROPHE: {
        n.systemId = "", this.state = l.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
        break;
      }
      case o.EOF: {
        this._err(E.eofInDoctype), n.forceQuirks = !0, this.emitCurrentDoctype(n), this._emitEOFToken();
        break;
      }
      default:
        this._err(E.missingQuoteBeforeDoctypeSystemIdentifier), n.forceQuirks = !0, this.state = l.BOGUS_DOCTYPE, this._stateBogusDoctype(t);
    }
  }
  // After DOCTYPE system keyword state
  //------------------------------------------------------------------
  _stateAfterDoctypeSystemKeyword(t) {
    const n = this.currentToken;
    switch (t) {
      case o.SPACE:
      case o.LINE_FEED:
      case o.TABULATION:
      case o.FORM_FEED: {
        this.state = l.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER;
        break;
      }
      case o.QUOTATION_MARK: {
        this._err(E.missingWhitespaceAfterDoctypeSystemKeyword), n.systemId = "", this.state = l.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
        break;
      }
      case o.APOSTROPHE: {
        this._err(E.missingWhitespaceAfterDoctypeSystemKeyword), n.systemId = "", this.state = l.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
        break;
      }
      case o.GREATER_THAN_SIGN: {
        this._err(E.missingDoctypeSystemIdentifier), n.forceQuirks = !0, this.state = l.DATA, this.emitCurrentDoctype(n);
        break;
      }
      case o.EOF: {
        this._err(E.eofInDoctype), n.forceQuirks = !0, this.emitCurrentDoctype(n), this._emitEOFToken();
        break;
      }
      default:
        this._err(E.missingQuoteBeforeDoctypeSystemIdentifier), n.forceQuirks = !0, this.state = l.BOGUS_DOCTYPE, this._stateBogusDoctype(t);
    }
  }
  // Before DOCTYPE system identifier state
  //------------------------------------------------------------------
  _stateBeforeDoctypeSystemIdentifier(t) {
    const n = this.currentToken;
    switch (t) {
      case o.SPACE:
      case o.LINE_FEED:
      case o.TABULATION:
      case o.FORM_FEED:
        break;
      case o.QUOTATION_MARK: {
        n.systemId = "", this.state = l.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
        break;
      }
      case o.APOSTROPHE: {
        n.systemId = "", this.state = l.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
        break;
      }
      case o.GREATER_THAN_SIGN: {
        this._err(E.missingDoctypeSystemIdentifier), n.forceQuirks = !0, this.state = l.DATA, this.emitCurrentDoctype(n);
        break;
      }
      case o.EOF: {
        this._err(E.eofInDoctype), n.forceQuirks = !0, this.emitCurrentDoctype(n), this._emitEOFToken();
        break;
      }
      default:
        this._err(E.missingQuoteBeforeDoctypeSystemIdentifier), n.forceQuirks = !0, this.state = l.BOGUS_DOCTYPE, this._stateBogusDoctype(t);
    }
  }
  // DOCTYPE system identifier (double-quoted) state
  //------------------------------------------------------------------
  _stateDoctypeSystemIdentifierDoubleQuoted(t) {
    const n = this.currentToken;
    switch (t) {
      case o.QUOTATION_MARK: {
        this.state = l.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;
        break;
      }
      case o.NULL: {
        this._err(E.unexpectedNullCharacter), n.systemId += P;
        break;
      }
      case o.GREATER_THAN_SIGN: {
        this._err(E.abruptDoctypeSystemIdentifier), n.forceQuirks = !0, this.emitCurrentDoctype(n), this.state = l.DATA;
        break;
      }
      case o.EOF: {
        this._err(E.eofInDoctype), n.forceQuirks = !0, this.emitCurrentDoctype(n), this._emitEOFToken();
        break;
      }
      default:
        n.systemId += String.fromCodePoint(t);
    }
  }
  // DOCTYPE system identifier (single-quoted) state
  //------------------------------------------------------------------
  _stateDoctypeSystemIdentifierSingleQuoted(t) {
    const n = this.currentToken;
    switch (t) {
      case o.APOSTROPHE: {
        this.state = l.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;
        break;
      }
      case o.NULL: {
        this._err(E.unexpectedNullCharacter), n.systemId += P;
        break;
      }
      case o.GREATER_THAN_SIGN: {
        this._err(E.abruptDoctypeSystemIdentifier), n.forceQuirks = !0, this.emitCurrentDoctype(n), this.state = l.DATA;
        break;
      }
      case o.EOF: {
        this._err(E.eofInDoctype), n.forceQuirks = !0, this.emitCurrentDoctype(n), this._emitEOFToken();
        break;
      }
      default:
        n.systemId += String.fromCodePoint(t);
    }
  }
  // After DOCTYPE system identifier state
  //------------------------------------------------------------------
  _stateAfterDoctypeSystemIdentifier(t) {
    const n = this.currentToken;
    switch (t) {
      case o.SPACE:
      case o.LINE_FEED:
      case o.TABULATION:
      case o.FORM_FEED:
        break;
      case o.GREATER_THAN_SIGN: {
        this.emitCurrentDoctype(n), this.state = l.DATA;
        break;
      }
      case o.EOF: {
        this._err(E.eofInDoctype), n.forceQuirks = !0, this.emitCurrentDoctype(n), this._emitEOFToken();
        break;
      }
      default:
        this._err(E.unexpectedCharacterAfterDoctypeSystemIdentifier), this.state = l.BOGUS_DOCTYPE, this._stateBogusDoctype(t);
    }
  }
  // Bogus DOCTYPE state
  //------------------------------------------------------------------
  _stateBogusDoctype(t) {
    const n = this.currentToken;
    switch (t) {
      case o.GREATER_THAN_SIGN: {
        this.emitCurrentDoctype(n), this.state = l.DATA;
        break;
      }
      case o.NULL: {
        this._err(E.unexpectedNullCharacter);
        break;
      }
      case o.EOF: {
        this.emitCurrentDoctype(n), this._emitEOFToken();
        break;
      }
    }
  }
  // CDATA section state
  //------------------------------------------------------------------
  _stateCdataSection(t) {
    switch (t) {
      case o.RIGHT_SQUARE_BRACKET: {
        this.state = l.CDATA_SECTION_BRACKET;
        break;
      }
      case o.EOF: {
        this._err(E.eofInCdata), this._emitEOFToken();
        break;
      }
      default:
        this._emitCodePoint(t);
    }
  }
  // CDATA section bracket state
  //------------------------------------------------------------------
  _stateCdataSectionBracket(t) {
    t === o.RIGHT_SQUARE_BRACKET ? this.state = l.CDATA_SECTION_END : (this._emitChars("]"), this.state = l.CDATA_SECTION, this._stateCdataSection(t));
  }
  // CDATA section end state
  //------------------------------------------------------------------
  _stateCdataSectionEnd(t) {
    switch (t) {
      case o.GREATER_THAN_SIGN: {
        this.state = l.DATA;
        break;
      }
      case o.RIGHT_SQUARE_BRACKET: {
        this._emitChars("]");
        break;
      }
      default:
        this._emitChars("]]"), this.state = l.CDATA_SECTION, this._stateCdataSection(t);
    }
  }
  // Character reference state
  //------------------------------------------------------------------
  _stateCharacterReference(t) {
    t === o.NUMBER_SIGN ? this.state = l.NUMERIC_CHARACTER_REFERENCE : $n(t) ? (this.state = l.NAMED_CHARACTER_REFERENCE, this._stateNamedCharacterReference(t)) : (this._flushCodePointConsumedAsCharacterReference(o.AMPERSAND), this._reconsumeInState(this.returnState, t));
  }
  // Named character reference state
  //------------------------------------------------------------------
  _stateNamedCharacterReference(t) {
    const n = this._matchNamedCharacterReference(t);
    if (!this._ensureHibernation())
      if (n) {
        for (let r = 0; r < n.length; r++)
          this._flushCodePointConsumedAsCharacterReference(n[r]);
        this.state = this.returnState;
      } else
        this._flushCodePointConsumedAsCharacterReference(o.AMPERSAND), this.state = l.AMBIGUOUS_AMPERSAND;
  }
  // Ambiguos ampersand state
  //------------------------------------------------------------------
  _stateAmbiguousAmpersand(t) {
    $n(t) ? this._flushCodePointConsumedAsCharacterReference(t) : (t === o.SEMICOLON && this._err(E.unknownNamedCharacterReference), this._reconsumeInState(this.returnState, t));
  }
  // Numeric character reference state
  //------------------------------------------------------------------
  _stateNumericCharacterReference(t) {
    this.charRefCode = 0, t === o.LATIN_SMALL_X || t === o.LATIN_CAPITAL_X ? this.state = l.HEXADEMICAL_CHARACTER_REFERENCE_START : rt(t) ? (this.state = l.DECIMAL_CHARACTER_REFERENCE, this._stateDecimalCharacterReference(t)) : (this._err(E.absenceOfDigitsInNumericCharacterReference), this._flushCodePointConsumedAsCharacterReference(o.AMPERSAND), this._flushCodePointConsumedAsCharacterReference(o.NUMBER_SIGN), this._reconsumeInState(this.returnState, t));
  }
  // Hexademical character reference start state
  //------------------------------------------------------------------
  _stateHexademicalCharacterReferenceStart(t) {
    Nc(t) ? (this.state = l.HEXADEMICAL_CHARACTER_REFERENCE, this._stateHexademicalCharacterReference(t)) : (this._err(E.absenceOfDigitsInNumericCharacterReference), this._flushCodePointConsumedAsCharacterReference(o.AMPERSAND), this._flushCodePointConsumedAsCharacterReference(o.NUMBER_SIGN), this._unconsume(2), this.state = this.returnState);
  }
  // Hexademical character reference state
  //------------------------------------------------------------------
  _stateHexademicalCharacterReference(t) {
    Ds(t) ? this.charRefCode = this.charRefCode * 16 + t - 55 : Ps(t) ? this.charRefCode = this.charRefCode * 16 + t - 87 : rt(t) ? this.charRefCode = this.charRefCode * 16 + t - 48 : t === o.SEMICOLON ? this.state = l.NUMERIC_CHARACTER_REFERENCE_END : (this._err(E.missingSemicolonAfterCharacterReference), this.state = l.NUMERIC_CHARACTER_REFERENCE_END, this._stateNumericCharacterReferenceEnd(t));
  }
  // Decimal character reference state
  //------------------------------------------------------------------
  _stateDecimalCharacterReference(t) {
    rt(t) ? this.charRefCode = this.charRefCode * 10 + t - 48 : t === o.SEMICOLON ? this.state = l.NUMERIC_CHARACTER_REFERENCE_END : (this._err(E.missingSemicolonAfterCharacterReference), this.state = l.NUMERIC_CHARACTER_REFERENCE_END, this._stateNumericCharacterReferenceEnd(t));
  }
  // Numeric character reference end state
  //------------------------------------------------------------------
  _stateNumericCharacterReferenceEnd(t) {
    if (this.charRefCode === o.NULL)
      this._err(E.nullCharacterReference), this.charRefCode = o.REPLACEMENT_CHARACTER;
    else if (this.charRefCode > 1114111)
      this._err(E.characterReferenceOutsideUnicodeRange), this.charRefCode = o.REPLACEMENT_CHARACTER;
    else if (Ss(this.charRefCode))
      this._err(E.surrogateCharacterReference), this.charRefCode = o.REPLACEMENT_CHARACTER;
    else if (Rs(this.charRefCode))
      this._err(E.noncharacterCharacterReference);
    else if (ws(this.charRefCode) || this.charRefCode === o.CARRIAGE_RETURN) {
      this._err(E.controlCharacterReference);
      const n = yc.get(this.charRefCode);
      n !== void 0 && (this.charRefCode = n);
    }
    this._flushCodePointConsumedAsCharacterReference(this.charRefCode), this._reconsumeInState(this.returnState, t);
  }
}
const Us = /* @__PURE__ */ new Set([a.DD, a.DT, a.LI, a.OPTGROUP, a.OPTION, a.P, a.RB, a.RP, a.RT, a.RTC]), ua = /* @__PURE__ */ new Set([
  ...Us,
  a.CAPTION,
  a.COLGROUP,
  a.TBODY,
  a.TD,
  a.TFOOT,
  a.TH,
  a.THEAD,
  a.TR
]), Lt = /* @__PURE__ */ new Map([
  [a.APPLET, g.HTML],
  [a.CAPTION, g.HTML],
  [a.HTML, g.HTML],
  [a.MARQUEE, g.HTML],
  [a.OBJECT, g.HTML],
  [a.TABLE, g.HTML],
  [a.TD, g.HTML],
  [a.TEMPLATE, g.HTML],
  [a.TH, g.HTML],
  [a.ANNOTATION_XML, g.MATHML],
  [a.MI, g.MATHML],
  [a.MN, g.MATHML],
  [a.MO, g.MATHML],
  [a.MS, g.MATHML],
  [a.MTEXT, g.MATHML],
  [a.DESC, g.SVG],
  [a.FOREIGN_OBJECT, g.SVG],
  [a.TITLE, g.SVG]
]), Sc = [a.H1, a.H2, a.H3, a.H4, a.H5, a.H6], wc = [a.TR, a.TEMPLATE, a.HTML], Rc = [a.TBODY, a.TFOOT, a.THEAD, a.TEMPLATE, a.HTML], Lc = [a.TABLE, a.TEMPLATE, a.HTML], vc = [a.TD, a.TH];
class Oc {
  get currentTmplContentOrNode() {
    return this._isInTemplate() ? this.treeAdapter.getTemplateContent(this.current) : this.current;
  }
  constructor(t, n, r) {
    this.treeAdapter = n, this.handler = r, this.items = [], this.tagIDs = [], this.stackTop = -1, this.tmplCount = 0, this.currentTagId = a.UNKNOWN, this.current = t;
  }
  //Index of element
  _indexOf(t) {
    return this.items.lastIndexOf(t, this.stackTop);
  }
  //Update current element
  _isInTemplate() {
    return this.currentTagId === a.TEMPLATE && this.treeAdapter.getNamespaceURI(this.current) === g.HTML;
  }
  _updateCurrentElement() {
    this.current = this.items[this.stackTop], this.currentTagId = this.tagIDs[this.stackTop];
  }
  //Mutations
  push(t, n) {
    this.stackTop++, this.items[this.stackTop] = t, this.current = t, this.tagIDs[this.stackTop] = n, this.currentTagId = n, this._isInTemplate() && this.tmplCount++, this.handler.onItemPush(t, n, !0);
  }
  pop() {
    const t = this.current;
    this.tmplCount > 0 && this._isInTemplate() && this.tmplCount--, this.stackTop--, this._updateCurrentElement(), this.handler.onItemPop(t, !0);
  }
  replace(t, n) {
    const r = this._indexOf(t);
    this.items[r] = n, r === this.stackTop && (this.current = n);
  }
  insertAfter(t, n, r) {
    const s = this._indexOf(t) + 1;
    this.items.splice(s, 0, n), this.tagIDs.splice(s, 0, r), this.stackTop++, s === this.stackTop && this._updateCurrentElement(), this.handler.onItemPush(this.current, this.currentTagId, s === this.stackTop);
  }
  popUntilTagNamePopped(t) {
    let n = this.stackTop + 1;
    do
      n = this.tagIDs.lastIndexOf(t, n - 1);
    while (n > 0 && this.treeAdapter.getNamespaceURI(this.items[n]) !== g.HTML);
    this.shortenToLength(n < 0 ? 0 : n);
  }
  shortenToLength(t) {
    for (; this.stackTop >= t; ) {
      const n = this.current;
      this.tmplCount > 0 && this._isInTemplate() && (this.tmplCount -= 1), this.stackTop--, this._updateCurrentElement(), this.handler.onItemPop(n, this.stackTop < t);
    }
  }
  popUntilElementPopped(t) {
    const n = this._indexOf(t);
    this.shortenToLength(n < 0 ? 0 : n);
  }
  popUntilPopped(t, n) {
    const r = this._indexOfTagNames(t, n);
    this.shortenToLength(r < 0 ? 0 : r);
  }
  popUntilNumberedHeaderPopped() {
    this.popUntilPopped(Sc, g.HTML);
  }
  popUntilTableCellPopped() {
    this.popUntilPopped(vc, g.HTML);
  }
  popAllUpToHtmlElement() {
    this.tmplCount = 0, this.shortenToLength(1);
  }
  _indexOfTagNames(t, n) {
    for (let r = this.stackTop; r >= 0; r--)
      if (t.includes(this.tagIDs[r]) && this.treeAdapter.getNamespaceURI(this.items[r]) === n)
        return r;
    return -1;
  }
  clearBackTo(t, n) {
    const r = this._indexOfTagNames(t, n);
    this.shortenToLength(r + 1);
  }
  clearBackToTableContext() {
    this.clearBackTo(Lc, g.HTML);
  }
  clearBackToTableBodyContext() {
    this.clearBackTo(Rc, g.HTML);
  }
  clearBackToTableRowContext() {
    this.clearBackTo(wc, g.HTML);
  }
  remove(t) {
    const n = this._indexOf(t);
    n >= 0 && (n === this.stackTop ? this.pop() : (this.items.splice(n, 1), this.tagIDs.splice(n, 1), this.stackTop--, this._updateCurrentElement(), this.handler.onItemPop(t, !1)));
  }
  //Search
  tryPeekProperlyNestedBodyElement() {
    return this.stackTop >= 1 && this.tagIDs[1] === a.BODY ? this.items[1] : null;
  }
  contains(t) {
    return this._indexOf(t) > -1;
  }
  getCommonAncestor(t) {
    const n = this._indexOf(t) - 1;
    return n >= 0 ? this.items[n] : null;
  }
  isRootHtmlElementCurrent() {
    return this.stackTop === 0 && this.tagIDs[0] === a.HTML;
  }
  //Element in scope
  hasInScope(t) {
    for (let n = this.stackTop; n >= 0; n--) {
      const r = this.tagIDs[n], s = this.treeAdapter.getNamespaceURI(this.items[n]);
      if (r === t && s === g.HTML)
        return !0;
      if (Lt.get(r) === s)
        return !1;
    }
    return !0;
  }
  hasNumberedHeaderInScope() {
    for (let t = this.stackTop; t >= 0; t--) {
      const n = this.tagIDs[t], r = this.treeAdapter.getNamespaceURI(this.items[t]);
      if (ks(n) && r === g.HTML)
        return !0;
      if (Lt.get(n) === r)
        return !1;
    }
    return !0;
  }
  hasInListItemScope(t) {
    for (let n = this.stackTop; n >= 0; n--) {
      const r = this.tagIDs[n], s = this.treeAdapter.getNamespaceURI(this.items[n]);
      if (r === t && s === g.HTML)
        return !0;
      if ((r === a.UL || r === a.OL) && s === g.HTML || Lt.get(r) === s)
        return !1;
    }
    return !0;
  }
  hasInButtonScope(t) {
    for (let n = this.stackTop; n >= 0; n--) {
      const r = this.tagIDs[n], s = this.treeAdapter.getNamespaceURI(this.items[n]);
      if (r === t && s === g.HTML)
        return !0;
      if (r === a.BUTTON && s === g.HTML || Lt.get(r) === s)
        return !1;
    }
    return !0;
  }
  hasInTableScope(t) {
    for (let n = this.stackTop; n >= 0; n--) {
      const r = this.tagIDs[n];
      if (this.treeAdapter.getNamespaceURI(this.items[n]) === g.HTML) {
        if (r === t)
          return !0;
        if (r === a.TABLE || r === a.TEMPLATE || r === a.HTML)
          return !1;
      }
    }
    return !0;
  }
  hasTableBodyContextInTableScope() {
    for (let t = this.stackTop; t >= 0; t--) {
      const n = this.tagIDs[t];
      if (this.treeAdapter.getNamespaceURI(this.items[t]) === g.HTML) {
        if (n === a.TBODY || n === a.THEAD || n === a.TFOOT)
          return !0;
        if (n === a.TABLE || n === a.HTML)
          return !1;
      }
    }
    return !0;
  }
  hasInSelectScope(t) {
    for (let n = this.stackTop; n >= 0; n--) {
      const r = this.tagIDs[n];
      if (this.treeAdapter.getNamespaceURI(this.items[n]) === g.HTML) {
        if (r === t)
          return !0;
        if (r !== a.OPTION && r !== a.OPTGROUP)
          return !1;
      }
    }
    return !0;
  }
  //Implied end tags
  generateImpliedEndTags() {
    for (; Us.has(this.currentTagId); )
      this.pop();
  }
  generateImpliedEndTagsThoroughly() {
    for (; ua.has(this.currentTagId); )
      this.pop();
  }
  generateImpliedEndTagsWithExclusion(t) {
    for (; this.currentTagId !== t && ua.has(this.currentTagId); )
      this.pop();
  }
}
const bn = 3;
var se;
(function(e) {
  e[e.Marker = 0] = "Marker", e[e.Element = 1] = "Element";
})(se = se || (se = {}));
const oa = { type: se.Marker };
class kc {
  constructor(t) {
    this.treeAdapter = t, this.entries = [], this.bookmark = null;
  }
  //Noah Ark's condition
  //OPTIMIZATION: at first we try to find possible candidates for exclusion using
  //lightweight heuristics without thorough attributes check.
  _getNoahArkConditionCandidates(t, n) {
    const r = [], s = n.length, i = this.treeAdapter.getTagName(t), u = this.treeAdapter.getNamespaceURI(t);
    for (let c = 0; c < this.entries.length; c++) {
      const d = this.entries[c];
      if (d.type === se.Marker)
        break;
      const { element: f } = d;
      if (this.treeAdapter.getTagName(f) === i && this.treeAdapter.getNamespaceURI(f) === u) {
        const p = this.treeAdapter.getAttrList(f);
        p.length === s && r.push({ idx: c, attrs: p });
      }
    }
    return r;
  }
  _ensureNoahArkCondition(t) {
    if (this.entries.length < bn)
      return;
    const n = this.treeAdapter.getAttrList(t), r = this._getNoahArkConditionCandidates(t, n);
    if (r.length < bn)
      return;
    const s = new Map(n.map((u) => [u.name, u.value]));
    let i = 0;
    for (let u = 0; u < r.length; u++) {
      const c = r[u];
      c.attrs.every((d) => s.get(d.name) === d.value) && (i += 1, i >= bn && this.entries.splice(c.idx, 1));
    }
  }
  //Mutations
  insertMarker() {
    this.entries.unshift(oa);
  }
  pushElement(t, n) {
    this._ensureNoahArkCondition(t), this.entries.unshift({
      type: se.Element,
      element: t,
      token: n
    });
  }
  insertElementAfterBookmark(t, n) {
    const r = this.entries.indexOf(this.bookmark);
    this.entries.splice(r, 0, {
      type: se.Element,
      element: t,
      token: n
    });
  }
  removeEntry(t) {
    const n = this.entries.indexOf(t);
    n >= 0 && this.entries.splice(n, 1);
  }
  /**
   * Clears the list of formatting elements up to the last marker.
   *
   * @see https://html.spec.whatwg.org/multipage/parsing.html#clear-the-list-of-active-formatting-elements-up-to-the-last-marker
   */
  clearToLastMarker() {
    const t = this.entries.indexOf(oa);
    t >= 0 ? this.entries.splice(0, t + 1) : this.entries.length = 0;
  }
  //Search
  getElementEntryInScopeWithTagName(t) {
    const n = this.entries.find((r) => r.type === se.Marker || this.treeAdapter.getTagName(r.element) === t);
    return n && n.type === se.Element ? n : null;
  }
  getElementEntry(t) {
    return this.entries.find((n) => n.type === se.Element && n.element === t);
  }
}
function ca(e) {
  return {
    nodeName: "#text",
    value: e,
    parentNode: null
  };
}
const Pe = {
  //Node construction
  createDocument() {
    return {
      nodeName: "#document",
      mode: ee.NO_QUIRKS,
      childNodes: []
    };
  },
  createDocumentFragment() {
    return {
      nodeName: "#document-fragment",
      childNodes: []
    };
  },
  createElement(e, t, n) {
    return {
      nodeName: e,
      tagName: e,
      attrs: n,
      namespaceURI: t,
      childNodes: [],
      parentNode: null
    };
  },
  createCommentNode(e) {
    return {
      nodeName: "#comment",
      data: e,
      parentNode: null
    };
  },
  //Tree mutation
  appendChild(e, t) {
    e.childNodes.push(t), t.parentNode = e;
  },
  insertBefore(e, t, n) {
    const r = e.childNodes.indexOf(n);
    e.childNodes.splice(r, 0, t), t.parentNode = e;
  },
  setTemplateContent(e, t) {
    e.content = t;
  },
  getTemplateContent(e) {
    return e.content;
  },
  setDocumentType(e, t, n, r) {
    const s = e.childNodes.find((i) => i.nodeName === "#documentType");
    if (s)
      s.name = t, s.publicId = n, s.systemId = r;
    else {
      const i = {
        nodeName: "#documentType",
        name: t,
        publicId: n,
        systemId: r,
        parentNode: null
      };
      Pe.appendChild(e, i);
    }
  },
  setDocumentMode(e, t) {
    e.mode = t;
  },
  getDocumentMode(e) {
    return e.mode;
  },
  detachNode(e) {
    if (e.parentNode) {
      const t = e.parentNode.childNodes.indexOf(e);
      e.parentNode.childNodes.splice(t, 1), e.parentNode = null;
    }
  },
  insertText(e, t) {
    if (e.childNodes.length > 0) {
      const n = e.childNodes[e.childNodes.length - 1];
      if (Pe.isTextNode(n)) {
        n.value += t;
        return;
      }
    }
    Pe.appendChild(e, ca(t));
  },
  insertTextBefore(e, t, n) {
    const r = e.childNodes[e.childNodes.indexOf(n) - 1];
    r && Pe.isTextNode(r) ? r.value += t : Pe.insertBefore(e, ca(t), n);
  },
  adoptAttributes(e, t) {
    const n = new Set(e.attrs.map((r) => r.name));
    for (let r = 0; r < t.length; r++)
      n.has(t[r].name) || e.attrs.push(t[r]);
  },
  //Tree traversing
  getFirstChild(e) {
    return e.childNodes[0];
  },
  getChildNodes(e) {
    return e.childNodes;
  },
  getParentNode(e) {
    return e.parentNode;
  },
  getAttrList(e) {
    return e.attrs;
  },
  //Node data
  getTagName(e) {
    return e.tagName;
  },
  getNamespaceURI(e) {
    return e.namespaceURI;
  },
  getTextNodeContent(e) {
    return e.value;
  },
  getCommentNodeContent(e) {
    return e.data;
  },
  getDocumentTypeNodeName(e) {
    return e.name;
  },
  getDocumentTypeNodePublicId(e) {
    return e.publicId;
  },
  getDocumentTypeNodeSystemId(e) {
    return e.systemId;
  },
  //Node types
  isTextNode(e) {
    return e.nodeName === "#text";
  },
  isCommentNode(e) {
    return e.nodeName === "#comment";
  },
  isDocumentTypeNode(e) {
    return e.nodeName === "#documentType";
  },
  isElementNode(e) {
    return Object.prototype.hasOwnProperty.call(e, "tagName");
  },
  // Source code location
  setNodeSourceCodeLocation(e, t) {
    e.sourceCodeLocation = t;
  },
  getNodeSourceCodeLocation(e) {
    return e.sourceCodeLocation;
  },
  updateNodeSourceCodeLocation(e, t) {
    e.sourceCodeLocation = { ...e.sourceCodeLocation, ...t };
  }
}, Bs = "html", Dc = "about:legacy-compat", Pc = "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd", Hs = [
  "+//silmaril//dtd html pro v0r11 19970101//",
  "-//as//dtd html 3.0 aswedit + extensions//",
  "-//advasoft ltd//dtd html 3.0 aswedit + extensions//",
  "-//ietf//dtd html 2.0 level 1//",
  "-//ietf//dtd html 2.0 level 2//",
  "-//ietf//dtd html 2.0 strict level 1//",
  "-//ietf//dtd html 2.0 strict level 2//",
  "-//ietf//dtd html 2.0 strict//",
  "-//ietf//dtd html 2.0//",
  "-//ietf//dtd html 2.1e//",
  "-//ietf//dtd html 3.0//",
  "-//ietf//dtd html 3.2 final//",
  "-//ietf//dtd html 3.2//",
  "-//ietf//dtd html 3//",
  "-//ietf//dtd html level 0//",
  "-//ietf//dtd html level 1//",
  "-//ietf//dtd html level 2//",
  "-//ietf//dtd html level 3//",
  "-//ietf//dtd html strict level 0//",
  "-//ietf//dtd html strict level 1//",
  "-//ietf//dtd html strict level 2//",
  "-//ietf//dtd html strict level 3//",
  "-//ietf//dtd html strict//",
  "-//ietf//dtd html//",
  "-//metrius//dtd metrius presentational//",
  "-//microsoft//dtd internet explorer 2.0 html strict//",
  "-//microsoft//dtd internet explorer 2.0 html//",
  "-//microsoft//dtd internet explorer 2.0 tables//",
  "-//microsoft//dtd internet explorer 3.0 html strict//",
  "-//microsoft//dtd internet explorer 3.0 html//",
  "-//microsoft//dtd internet explorer 3.0 tables//",
  "-//netscape comm. corp.//dtd html//",
  "-//netscape comm. corp.//dtd strict html//",
  "-//o'reilly and associates//dtd html 2.0//",
  "-//o'reilly and associates//dtd html extended 1.0//",
  "-//o'reilly and associates//dtd html extended relaxed 1.0//",
  "-//sq//dtd html 2.0 hotmetal + extensions//",
  "-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//",
  "-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//",
  "-//spyglass//dtd html 2.0 extended//",
  "-//sun microsystems corp.//dtd hotjava html//",
  "-//sun microsystems corp.//dtd hotjava strict html//",
  "-//w3c//dtd html 3 1995-03-24//",
  "-//w3c//dtd html 3.2 draft//",
  "-//w3c//dtd html 3.2 final//",
  "-//w3c//dtd html 3.2//",
  "-//w3c//dtd html 3.2s draft//",
  "-//w3c//dtd html 4.0 frameset//",
  "-//w3c//dtd html 4.0 transitional//",
  "-//w3c//dtd html experimental 19960712//",
  "-//w3c//dtd html experimental 970421//",
  "-//w3c//dtd w3 html//",
  "-//w3o//dtd w3 html 3.0//",
  "-//webtechs//dtd mozilla html 2.0//",
  "-//webtechs//dtd mozilla html//"
], Mc = [
  ...Hs,
  "-//w3c//dtd html 4.01 frameset//",
  "-//w3c//dtd html 4.01 transitional//"
], Uc = /* @__PURE__ */ new Set([
  "-//w3o//dtd w3 html strict 3.0//en//",
  "-/w3c/dtd html 4.0 transitional/en",
  "html"
]), Fs = ["-//w3c//dtd xhtml 1.0 frameset//", "-//w3c//dtd xhtml 1.0 transitional//"], Bc = [
  ...Fs,
  "-//w3c//dtd html 4.01 frameset//",
  "-//w3c//dtd html 4.01 transitional//"
];
function la(e, t) {
  return t.some((n) => e.startsWith(n));
}
function Hc(e) {
  return e.name === Bs && e.publicId === null && (e.systemId === null || e.systemId === Dc);
}
function Fc(e) {
  if (e.name !== Bs)
    return ee.QUIRKS;
  const { systemId: t } = e;
  if (t && t.toLowerCase() === Pc)
    return ee.QUIRKS;
  let { publicId: n } = e;
  if (n !== null) {
    if (n = n.toLowerCase(), Uc.has(n))
      return ee.QUIRKS;
    let r = t === null ? Mc : Hs;
    if (la(n, r))
      return ee.QUIRKS;
    if (r = t === null ? Fs : Bc, la(n, r))
      return ee.LIMITED_QUIRKS;
  }
  return ee.NO_QUIRKS;
}
const da = {
  TEXT_HTML: "text/html",
  APPLICATION_XML: "application/xhtml+xml"
}, $c = "definitionurl", Yc = "definitionURL", qc = new Map([
  "attributeName",
  "attributeType",
  "baseFrequency",
  "baseProfile",
  "calcMode",
  "clipPathUnits",
  "diffuseConstant",
  "edgeMode",
  "filterUnits",
  "glyphRef",
  "gradientTransform",
  "gradientUnits",
  "kernelMatrix",
  "kernelUnitLength",
  "keyPoints",
  "keySplines",
  "keyTimes",
  "lengthAdjust",
  "limitingConeAngle",
  "markerHeight",
  "markerUnits",
  "markerWidth",
  "maskContentUnits",
  "maskUnits",
  "numOctaves",
  "pathLength",
  "patternContentUnits",
  "patternTransform",
  "patternUnits",
  "pointsAtX",
  "pointsAtY",
  "pointsAtZ",
  "preserveAlpha",
  "preserveAspectRatio",
  "primitiveUnits",
  "refX",
  "refY",
  "repeatCount",
  "repeatDur",
  "requiredExtensions",
  "requiredFeatures",
  "specularConstant",
  "specularExponent",
  "spreadMethod",
  "startOffset",
  "stdDeviation",
  "stitchTiles",
  "surfaceScale",
  "systemLanguage",
  "tableValues",
  "targetX",
  "targetY",
  "textLength",
  "viewBox",
  "viewTarget",
  "xChannelSelector",
  "yChannelSelector",
  "zoomAndPan"
].map((e) => [e.toLowerCase(), e])), zc = /* @__PURE__ */ new Map([
  ["xlink:actuate", { prefix: "xlink", name: "actuate", namespace: g.XLINK }],
  ["xlink:arcrole", { prefix: "xlink", name: "arcrole", namespace: g.XLINK }],
  ["xlink:href", { prefix: "xlink", name: "href", namespace: g.XLINK }],
  ["xlink:role", { prefix: "xlink", name: "role", namespace: g.XLINK }],
  ["xlink:show", { prefix: "xlink", name: "show", namespace: g.XLINK }],
  ["xlink:title", { prefix: "xlink", name: "title", namespace: g.XLINK }],
  ["xlink:type", { prefix: "xlink", name: "type", namespace: g.XLINK }],
  ["xml:base", { prefix: "xml", name: "base", namespace: g.XML }],
  ["xml:lang", { prefix: "xml", name: "lang", namespace: g.XML }],
  ["xml:space", { prefix: "xml", name: "space", namespace: g.XML }],
  ["xmlns", { prefix: "", name: "xmlns", namespace: g.XMLNS }],
  ["xmlns:xlink", { prefix: "xmlns", name: "xlink", namespace: g.XMLNS }]
]), Wc = new Map([
  "altGlyph",
  "altGlyphDef",
  "altGlyphItem",
  "animateColor",
  "animateMotion",
  "animateTransform",
  "clipPath",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "foreignObject",
  "glyphRef",
  "linearGradient",
  "radialGradient",
  "textPath"
].map((e) => [e.toLowerCase(), e])), Vc = /* @__PURE__ */ new Set([
  a.B,
  a.BIG,
  a.BLOCKQUOTE,
  a.BODY,
  a.BR,
  a.CENTER,
  a.CODE,
  a.DD,
  a.DIV,
  a.DL,
  a.DT,
  a.EM,
  a.EMBED,
  a.H1,
  a.H2,
  a.H3,
  a.H4,
  a.H5,
  a.H6,
  a.HEAD,
  a.HR,
  a.I,
  a.IMG,
  a.LI,
  a.LISTING,
  a.MENU,
  a.META,
  a.NOBR,
  a.OL,
  a.P,
  a.PRE,
  a.RUBY,
  a.S,
  a.SMALL,
  a.SPAN,
  a.STRONG,
  a.STRIKE,
  a.SUB,
  a.SUP,
  a.TABLE,
  a.TT,
  a.U,
  a.UL,
  a.VAR
]);
function Gc(e) {
  const t = e.tagID;
  return t === a.FONT && e.attrs.some(({ name: r }) => r === _e.COLOR || r === _e.SIZE || r === _e.FACE) || Vc.has(t);
}
function $s(e) {
  for (let t = 0; t < e.attrs.length; t++)
    if (e.attrs[t].name === $c) {
      e.attrs[t].name = Yc;
      break;
    }
}
function Ys(e) {
  for (let t = 0; t < e.attrs.length; t++) {
    const n = qc.get(e.attrs[t].name);
    n != null && (e.attrs[t].name = n);
  }
}
function ir(e) {
  for (let t = 0; t < e.attrs.length; t++) {
    const n = zc.get(e.attrs[t].name);
    n && (e.attrs[t].prefix = n.prefix, e.attrs[t].name = n.name, e.attrs[t].namespace = n.namespace);
  }
}
function Qc(e) {
  const t = Wc.get(e.tagName);
  t != null && (e.tagName = t, e.tagID = tn(e.tagName));
}
function jc(e, t) {
  return t === g.MATHML && (e === a.MI || e === a.MO || e === a.MN || e === a.MS || e === a.MTEXT);
}
function Xc(e, t, n) {
  if (t === g.MATHML && e === a.ANNOTATION_XML) {
    for (let r = 0; r < n.length; r++)
      if (n[r].name === _e.ENCODING) {
        const s = n[r].value.toLowerCase();
        return s === da.TEXT_HTML || s === da.APPLICATION_XML;
      }
  }
  return t === g.SVG && (e === a.FOREIGN_OBJECT || e === a.DESC || e === a.TITLE);
}
function Kc(e, t, n, r) {
  return (!r || r === g.HTML) && Xc(e, t, n) || (!r || r === g.MATHML) && jc(e, t);
}
const Jc = "hidden", Zc = 8, el = 3;
var h;
(function(e) {
  e[e.INITIAL = 0] = "INITIAL", e[e.BEFORE_HTML = 1] = "BEFORE_HTML", e[e.BEFORE_HEAD = 2] = "BEFORE_HEAD", e[e.IN_HEAD = 3] = "IN_HEAD", e[e.IN_HEAD_NO_SCRIPT = 4] = "IN_HEAD_NO_SCRIPT", e[e.AFTER_HEAD = 5] = "AFTER_HEAD", e[e.IN_BODY = 6] = "IN_BODY", e[e.TEXT = 7] = "TEXT", e[e.IN_TABLE = 8] = "IN_TABLE", e[e.IN_TABLE_TEXT = 9] = "IN_TABLE_TEXT", e[e.IN_CAPTION = 10] = "IN_CAPTION", e[e.IN_COLUMN_GROUP = 11] = "IN_COLUMN_GROUP", e[e.IN_TABLE_BODY = 12] = "IN_TABLE_BODY", e[e.IN_ROW = 13] = "IN_ROW", e[e.IN_CELL = 14] = "IN_CELL", e[e.IN_SELECT = 15] = "IN_SELECT", e[e.IN_SELECT_IN_TABLE = 16] = "IN_SELECT_IN_TABLE", e[e.IN_TEMPLATE = 17] = "IN_TEMPLATE", e[e.AFTER_BODY = 18] = "AFTER_BODY", e[e.IN_FRAMESET = 19] = "IN_FRAMESET", e[e.AFTER_FRAMESET = 20] = "AFTER_FRAMESET", e[e.AFTER_AFTER_BODY = 21] = "AFTER_AFTER_BODY", e[e.AFTER_AFTER_FRAMESET = 22] = "AFTER_AFTER_FRAMESET";
})(h || (h = {}));
const tl = {
  startLine: -1,
  startCol: -1,
  startOffset: -1,
  endLine: -1,
  endCol: -1,
  endOffset: -1
}, qs = /* @__PURE__ */ new Set([a.TABLE, a.TBODY, a.TFOOT, a.THEAD, a.TR]), ha = {
  scriptingEnabled: !0,
  sourceCodeLocationInfo: !1,
  treeAdapter: Pe,
  onParseError: null
};
class zs {
  constructor(t, n, r = null, s = null) {
    this.fragmentContext = r, this.scriptHandler = s, this.currentToken = null, this.stopped = !1, this.insertionMode = h.INITIAL, this.originalInsertionMode = h.INITIAL, this.headElement = null, this.formElement = null, this.currentNotInHTML = !1, this.tmplInsertionModeStack = [], this.pendingCharacterTokens = [], this.hasNonWhitespacePendingCharacterToken = !1, this.framesetOk = !0, this.skipNextNewLine = !1, this.fosterParentingEnabled = !1, this.options = {
      ...ha,
      ...t
    }, this.treeAdapter = this.options.treeAdapter, this.onParseError = this.options.onParseError, this.onParseError && (this.options.sourceCodeLocationInfo = !0), this.document = n ?? this.treeAdapter.createDocument(), this.tokenizer = new xc(this.options, this), this.activeFormattingElements = new kc(this.treeAdapter), this.fragmentContextID = r ? tn(this.treeAdapter.getTagName(r)) : a.UNKNOWN, this._setContextModes(r ?? this.document, this.fragmentContextID), this.openElements = new Oc(this.document, this.treeAdapter, this);
  }
  // API
  static parse(t, n) {
    const r = new this(n);
    return r.tokenizer.write(t, !0), r.document;
  }
  static getFragmentParser(t, n) {
    const r = {
      ...ha,
      ...n
    };
    t ?? (t = r.treeAdapter.createElement(m.TEMPLATE, g.HTML, []));
    const s = r.treeAdapter.createElement("documentmock", g.HTML, []), i = new this(r, s, t);
    return i.fragmentContextID === a.TEMPLATE && i.tmplInsertionModeStack.unshift(h.IN_TEMPLATE), i._initTokenizerForFragmentParsing(), i._insertFakeRootElement(), i._resetInsertionMode(), i._findFormInFragmentContext(), i;
  }
  getFragment() {
    const t = this.treeAdapter.getFirstChild(this.document), n = this.treeAdapter.createDocumentFragment();
    return this._adoptNodes(t, n), n;
  }
  //Errors
  _err(t, n, r) {
    var s;
    if (!this.onParseError)
      return;
    const i = (s = t.location) !== null && s !== void 0 ? s : tl, u = {
      code: n,
      startLine: i.startLine,
      startCol: i.startCol,
      startOffset: i.startOffset,
      endLine: r ? i.startLine : i.endLine,
      endCol: r ? i.startCol : i.endCol,
      endOffset: r ? i.startOffset : i.endOffset
    };
    this.onParseError(u);
  }
  //Stack events
  onItemPush(t, n, r) {
    var s, i;
    (i = (s = this.treeAdapter).onItemPush) === null || i === void 0 || i.call(s, t), r && this.openElements.stackTop > 0 && this._setContextModes(t, n);
  }
  onItemPop(t, n) {
    var r, s;
    if (this.options.sourceCodeLocationInfo && this._setEndLocation(t, this.currentToken), (s = (r = this.treeAdapter).onItemPop) === null || s === void 0 || s.call(r, t, this.openElements.current), n) {
      let i, u;
      this.openElements.stackTop === 0 && this.fragmentContext ? (i = this.fragmentContext, u = this.fragmentContextID) : { current: i, currentTagId: u } = this.openElements, this._setContextModes(i, u);
    }
  }
  _setContextModes(t, n) {
    const r = t === this.document || this.treeAdapter.getNamespaceURI(t) === g.HTML;
    this.currentNotInHTML = !r, this.tokenizer.inForeignNode = !r && !this._isIntegrationPoint(n, t);
  }
  _switchToTextParsing(t, n) {
    this._insertElement(t, g.HTML), this.tokenizer.state = n, this.originalInsertionMode = this.insertionMode, this.insertionMode = h.TEXT;
  }
  switchToPlaintextParsing() {
    this.insertionMode = h.TEXT, this.originalInsertionMode = h.IN_BODY, this.tokenizer.state = j.PLAINTEXT;
  }
  //Fragment parsing
  _getAdjustedCurrentElement() {
    return this.openElements.stackTop === 0 && this.fragmentContext ? this.fragmentContext : this.openElements.current;
  }
  _findFormInFragmentContext() {
    let t = this.fragmentContext;
    for (; t; ) {
      if (this.treeAdapter.getTagName(t) === m.FORM) {
        this.formElement = t;
        break;
      }
      t = this.treeAdapter.getParentNode(t);
    }
  }
  _initTokenizerForFragmentParsing() {
    if (!(!this.fragmentContext || this.treeAdapter.getNamespaceURI(this.fragmentContext) !== g.HTML))
      switch (this.fragmentContextID) {
        case a.TITLE:
        case a.TEXTAREA: {
          this.tokenizer.state = j.RCDATA;
          break;
        }
        case a.STYLE:
        case a.XMP:
        case a.IFRAME:
        case a.NOEMBED:
        case a.NOFRAMES:
        case a.NOSCRIPT: {
          this.tokenizer.state = j.RAWTEXT;
          break;
        }
        case a.SCRIPT: {
          this.tokenizer.state = j.SCRIPT_DATA;
          break;
        }
        case a.PLAINTEXT: {
          this.tokenizer.state = j.PLAINTEXT;
          break;
        }
      }
  }
  //Tree mutation
  _setDocumentType(t) {
    const n = t.name || "", r = t.publicId || "", s = t.systemId || "";
    if (this.treeAdapter.setDocumentType(this.document, n, r, s), t.location) {
      const u = this.treeAdapter.getChildNodes(this.document).find((c) => this.treeAdapter.isDocumentTypeNode(c));
      u && this.treeAdapter.setNodeSourceCodeLocation(u, t.location);
    }
  }
  _attachElementToTree(t, n) {
    if (this.options.sourceCodeLocationInfo) {
      const r = n && {
        ...n,
        startTag: n
      };
      this.treeAdapter.setNodeSourceCodeLocation(t, r);
    }
    if (this._shouldFosterParentOnInsertion())
      this._fosterParentElement(t);
    else {
      const r = this.openElements.currentTmplContentOrNode;
      this.treeAdapter.appendChild(r, t);
    }
  }
  _appendElement(t, n) {
    const r = this.treeAdapter.createElement(t.tagName, n, t.attrs);
    this._attachElementToTree(r, t.location);
  }
  _insertElement(t, n) {
    const r = this.treeAdapter.createElement(t.tagName, n, t.attrs);
    this._attachElementToTree(r, t.location), this.openElements.push(r, t.tagID);
  }
  _insertFakeElement(t, n) {
    const r = this.treeAdapter.createElement(t, g.HTML, []);
    this._attachElementToTree(r, null), this.openElements.push(r, n);
  }
  _insertTemplate(t) {
    const n = this.treeAdapter.createElement(t.tagName, g.HTML, t.attrs), r = this.treeAdapter.createDocumentFragment();
    this.treeAdapter.setTemplateContent(n, r), this._attachElementToTree(n, t.location), this.openElements.push(n, t.tagID), this.options.sourceCodeLocationInfo && this.treeAdapter.setNodeSourceCodeLocation(r, null);
  }
  _insertFakeRootElement() {
    const t = this.treeAdapter.createElement(m.HTML, g.HTML, []);
    this.options.sourceCodeLocationInfo && this.treeAdapter.setNodeSourceCodeLocation(t, null), this.treeAdapter.appendChild(this.openElements.current, t), this.openElements.push(t, a.HTML);
  }
  _appendCommentNode(t, n) {
    const r = this.treeAdapter.createCommentNode(t.data);
    this.treeAdapter.appendChild(n, r), this.options.sourceCodeLocationInfo && this.treeAdapter.setNodeSourceCodeLocation(r, t.location);
  }
  _insertCharacters(t) {
    let n, r;
    if (this._shouldFosterParentOnInsertion() ? ({ parent: n, beforeElement: r } = this._findFosterParentingLocation(), r ? this.treeAdapter.insertTextBefore(n, t.chars, r) : this.treeAdapter.insertText(n, t.chars)) : (n = this.openElements.currentTmplContentOrNode, this.treeAdapter.insertText(n, t.chars)), !t.location)
      return;
    const s = this.treeAdapter.getChildNodes(n), i = r ? s.lastIndexOf(r) : s.length, u = s[i - 1];
    if (this.treeAdapter.getNodeSourceCodeLocation(u)) {
      const { endLine: d, endCol: f, endOffset: p } = t.location;
      this.treeAdapter.updateNodeSourceCodeLocation(u, { endLine: d, endCol: f, endOffset: p });
    } else
      this.options.sourceCodeLocationInfo && this.treeAdapter.setNodeSourceCodeLocation(u, t.location);
  }
  _adoptNodes(t, n) {
    for (let r = this.treeAdapter.getFirstChild(t); r; r = this.treeAdapter.getFirstChild(t))
      this.treeAdapter.detachNode(r), this.treeAdapter.appendChild(n, r);
  }
  _setEndLocation(t, n) {
    if (this.treeAdapter.getNodeSourceCodeLocation(t) && n.location) {
      const r = n.location, s = this.treeAdapter.getTagName(t), i = (
        // NOTE: For cases like <p> <p> </p> - First 'p' closes without a closing
        // tag and for cases like <td> <p> </td> - 'p' closes without a closing tag.
        n.type === O.END_TAG && s === n.tagName ? {
          endTag: { ...r },
          endLine: r.endLine,
          endCol: r.endCol,
          endOffset: r.endOffset
        } : {
          endLine: r.startLine,
          endCol: r.startCol,
          endOffset: r.startOffset
        }
      );
      this.treeAdapter.updateNodeSourceCodeLocation(t, i);
    }
  }
  //Token processing
  shouldProcessStartTagTokenInForeignContent(t) {
    if (!this.currentNotInHTML)
      return !1;
    let n, r;
    return this.openElements.stackTop === 0 && this.fragmentContext ? (n = this.fragmentContext, r = this.fragmentContextID) : { current: n, currentTagId: r } = this.openElements, t.tagID === a.SVG && this.treeAdapter.getTagName(n) === m.ANNOTATION_XML && this.treeAdapter.getNamespaceURI(n) === g.MATHML ? !1 : (
      // Check that `current` is not an integration point for HTML or MathML elements.
      this.tokenizer.inForeignNode || // If it _is_ an integration point, then we might have to check that it is not an HTML
      // integration point.
      (t.tagID === a.MGLYPH || t.tagID === a.MALIGNMARK) && !this._isIntegrationPoint(r, n, g.HTML)
    );
  }
  _processToken(t) {
    switch (t.type) {
      case O.CHARACTER: {
        this.onCharacter(t);
        break;
      }
      case O.NULL_CHARACTER: {
        this.onNullCharacter(t);
        break;
      }
      case O.COMMENT: {
        this.onComment(t);
        break;
      }
      case O.DOCTYPE: {
        this.onDoctype(t);
        break;
      }
      case O.START_TAG: {
        this._processStartTag(t);
        break;
      }
      case O.END_TAG: {
        this.onEndTag(t);
        break;
      }
      case O.EOF: {
        this.onEof(t);
        break;
      }
      case O.WHITESPACE_CHARACTER: {
        this.onWhitespaceCharacter(t);
        break;
      }
    }
  }
  //Integration points
  _isIntegrationPoint(t, n, r) {
    const s = this.treeAdapter.getNamespaceURI(n), i = this.treeAdapter.getAttrList(n);
    return Kc(t, s, i, r);
  }
  //Active formatting elements reconstruction
  _reconstructActiveFormattingElements() {
    const t = this.activeFormattingElements.entries.length;
    if (t) {
      const n = this.activeFormattingElements.entries.findIndex((s) => s.type === se.Marker || this.openElements.contains(s.element)), r = n < 0 ? t - 1 : n - 1;
      for (let s = r; s >= 0; s--) {
        const i = this.activeFormattingElements.entries[s];
        this._insertElement(i.token, this.treeAdapter.getNamespaceURI(i.element)), i.element = this.openElements.current;
      }
    }
  }
  //Close elements
  _closeTableCell() {
    this.openElements.generateImpliedEndTags(), this.openElements.popUntilTableCellPopped(), this.activeFormattingElements.clearToLastMarker(), this.insertionMode = h.IN_ROW;
  }
  _closePElement() {
    this.openElements.generateImpliedEndTagsWithExclusion(a.P), this.openElements.popUntilTagNamePopped(a.P);
  }
  //Insertion modes
  _resetInsertionMode() {
    for (let t = this.openElements.stackTop; t >= 0; t--)
      switch (t === 0 && this.fragmentContext ? this.fragmentContextID : this.openElements.tagIDs[t]) {
        case a.TR: {
          this.insertionMode = h.IN_ROW;
          return;
        }
        case a.TBODY:
        case a.THEAD:
        case a.TFOOT: {
          this.insertionMode = h.IN_TABLE_BODY;
          return;
        }
        case a.CAPTION: {
          this.insertionMode = h.IN_CAPTION;
          return;
        }
        case a.COLGROUP: {
          this.insertionMode = h.IN_COLUMN_GROUP;
          return;
        }
        case a.TABLE: {
          this.insertionMode = h.IN_TABLE;
          return;
        }
        case a.BODY: {
          this.insertionMode = h.IN_BODY;
          return;
        }
        case a.FRAMESET: {
          this.insertionMode = h.IN_FRAMESET;
          return;
        }
        case a.SELECT: {
          this._resetInsertionModeForSelect(t);
          return;
        }
        case a.TEMPLATE: {
          this.insertionMode = this.tmplInsertionModeStack[0];
          return;
        }
        case a.HTML: {
          this.insertionMode = this.headElement ? h.AFTER_HEAD : h.BEFORE_HEAD;
          return;
        }
        case a.TD:
        case a.TH: {
          if (t > 0) {
            this.insertionMode = h.IN_CELL;
            return;
          }
          break;
        }
        case a.HEAD: {
          if (t > 0) {
            this.insertionMode = h.IN_HEAD;
            return;
          }
          break;
        }
      }
    this.insertionMode = h.IN_BODY;
  }
  _resetInsertionModeForSelect(t) {
    if (t > 0)
      for (let n = t - 1; n > 0; n--) {
        const r = this.openElements.tagIDs[n];
        if (r === a.TEMPLATE)
          break;
        if (r === a.TABLE) {
          this.insertionMode = h.IN_SELECT_IN_TABLE;
          return;
        }
      }
    this.insertionMode = h.IN_SELECT;
  }
  //Foster parenting
  _isElementCausesFosterParenting(t) {
    return qs.has(t);
  }
  _shouldFosterParentOnInsertion() {
    return this.fosterParentingEnabled && this._isElementCausesFosterParenting(this.openElements.currentTagId);
  }
  _findFosterParentingLocation() {
    for (let t = this.openElements.stackTop; t >= 0; t--) {
      const n = this.openElements.items[t];
      switch (this.openElements.tagIDs[t]) {
        case a.TEMPLATE: {
          if (this.treeAdapter.getNamespaceURI(n) === g.HTML)
            return { parent: this.treeAdapter.getTemplateContent(n), beforeElement: null };
          break;
        }
        case a.TABLE: {
          const r = this.treeAdapter.getParentNode(n);
          return r ? { parent: r, beforeElement: n } : { parent: this.openElements.items[t - 1], beforeElement: null };
        }
      }
    }
    return { parent: this.openElements.items[0], beforeElement: null };
  }
  _fosterParentElement(t) {
    const n = this._findFosterParentingLocation();
    n.beforeElement ? this.treeAdapter.insertBefore(n.parent, t, n.beforeElement) : this.treeAdapter.appendChild(n.parent, t);
  }
  //Special elements
  _isSpecialElement(t, n) {
    const r = this.treeAdapter.getNamespaceURI(t);
    return Ac[r].has(n);
  }
  onCharacter(t) {
    if (this.skipNextNewLine = !1, this.tokenizer.inForeignNode) {
      vd(this, t);
      return;
    }
    switch (this.insertionMode) {
      case h.INITIAL: {
        je(this, t);
        break;
      }
      case h.BEFORE_HTML: {
        at(this, t);
        break;
      }
      case h.BEFORE_HEAD: {
        st(this, t);
        break;
      }
      case h.IN_HEAD: {
        it(this, t);
        break;
      }
      case h.IN_HEAD_NO_SCRIPT: {
        ut(this, t);
        break;
      }
      case h.AFTER_HEAD: {
        ot(this, t);
        break;
      }
      case h.IN_BODY:
      case h.IN_CAPTION:
      case h.IN_CELL:
      case h.IN_TEMPLATE: {
        Vs(this, t);
        break;
      }
      case h.TEXT:
      case h.IN_SELECT:
      case h.IN_SELECT_IN_TABLE: {
        this._insertCharacters(t);
        break;
      }
      case h.IN_TABLE:
      case h.IN_TABLE_BODY:
      case h.IN_ROW: {
        En(this, t);
        break;
      }
      case h.IN_TABLE_TEXT: {
        Js(this, t);
        break;
      }
      case h.IN_COLUMN_GROUP: {
        Vt(this, t);
        break;
      }
      case h.AFTER_BODY: {
        Gt(this, t);
        break;
      }
      case h.AFTER_AFTER_BODY: {
        Ft(this, t);
        break;
      }
    }
  }
  onNullCharacter(t) {
    if (this.skipNextNewLine = !1, this.tokenizer.inForeignNode) {
      Ld(this, t);
      return;
    }
    switch (this.insertionMode) {
      case h.INITIAL: {
        je(this, t);
        break;
      }
      case h.BEFORE_HTML: {
        at(this, t);
        break;
      }
      case h.BEFORE_HEAD: {
        st(this, t);
        break;
      }
      case h.IN_HEAD: {
        it(this, t);
        break;
      }
      case h.IN_HEAD_NO_SCRIPT: {
        ut(this, t);
        break;
      }
      case h.AFTER_HEAD: {
        ot(this, t);
        break;
      }
      case h.TEXT: {
        this._insertCharacters(t);
        break;
      }
      case h.IN_TABLE:
      case h.IN_TABLE_BODY:
      case h.IN_ROW: {
        En(this, t);
        break;
      }
      case h.IN_COLUMN_GROUP: {
        Vt(this, t);
        break;
      }
      case h.AFTER_BODY: {
        Gt(this, t);
        break;
      }
      case h.AFTER_AFTER_BODY: {
        Ft(this, t);
        break;
      }
    }
  }
  onComment(t) {
    if (this.skipNextNewLine = !1, this.currentNotInHTML) {
      Yn(this, t);
      return;
    }
    switch (this.insertionMode) {
      case h.INITIAL:
      case h.BEFORE_HTML:
      case h.BEFORE_HEAD:
      case h.IN_HEAD:
      case h.IN_HEAD_NO_SCRIPT:
      case h.AFTER_HEAD:
      case h.IN_BODY:
      case h.IN_TABLE:
      case h.IN_CAPTION:
      case h.IN_COLUMN_GROUP:
      case h.IN_TABLE_BODY:
      case h.IN_ROW:
      case h.IN_CELL:
      case h.IN_SELECT:
      case h.IN_SELECT_IN_TABLE:
      case h.IN_TEMPLATE:
      case h.IN_FRAMESET:
      case h.AFTER_FRAMESET: {
        Yn(this, t);
        break;
      }
      case h.IN_TABLE_TEXT: {
        Xe(this, t);
        break;
      }
      case h.AFTER_BODY: {
        ol(this, t);
        break;
      }
      case h.AFTER_AFTER_BODY:
      case h.AFTER_AFTER_FRAMESET: {
        cl(this, t);
        break;
      }
    }
  }
  onDoctype(t) {
    switch (this.skipNextNewLine = !1, this.insertionMode) {
      case h.INITIAL: {
        ll(this, t);
        break;
      }
      case h.BEFORE_HEAD:
      case h.IN_HEAD:
      case h.IN_HEAD_NO_SCRIPT:
      case h.AFTER_HEAD: {
        this._err(t, E.misplacedDoctype);
        break;
      }
      case h.IN_TABLE_TEXT: {
        Xe(this, t);
        break;
      }
    }
  }
  onStartTag(t) {
    this.skipNextNewLine = !1, this.currentToken = t, this._processStartTag(t), t.selfClosing && !t.ackSelfClosing && this._err(t, E.nonVoidHtmlElementStartTagWithTrailingSolidus);
  }
  /**
   * Processes a given start tag.
   *
   * `onStartTag` checks if a self-closing tag was recognized. When a token
   * is moved inbetween multiple insertion modes, this check for self-closing
   * could lead to false positives. To avoid this, `_processStartTag` is used
   * for nested calls.
   *
   * @param token The token to process.
   */
  _processStartTag(t) {
    this.shouldProcessStartTagTokenInForeignContent(t) ? Od(this, t) : this._startTagOutsideForeignContent(t);
  }
  _startTagOutsideForeignContent(t) {
    switch (this.insertionMode) {
      case h.INITIAL: {
        je(this, t);
        break;
      }
      case h.BEFORE_HTML: {
        dl(this, t);
        break;
      }
      case h.BEFORE_HEAD: {
        fl(this, t);
        break;
      }
      case h.IN_HEAD: {
        ie(this, t);
        break;
      }
      case h.IN_HEAD_NO_SCRIPT: {
        bl(this, t);
        break;
      }
      case h.AFTER_HEAD: {
        gl(this, t);
        break;
      }
      case h.IN_BODY: {
        z(this, t);
        break;
      }
      case h.IN_TABLE: {
        We(this, t);
        break;
      }
      case h.IN_TABLE_TEXT: {
        Xe(this, t);
        break;
      }
      case h.IN_CAPTION: {
        pd(this, t);
        break;
      }
      case h.IN_COLUMN_GROUP: {
        cr(this, t);
        break;
      }
      case h.IN_TABLE_BODY: {
        an(this, t);
        break;
      }
      case h.IN_ROW: {
        sn(this, t);
        break;
      }
      case h.IN_CELL: {
        Ed(this, t);
        break;
      }
      case h.IN_SELECT: {
        ti(this, t);
        break;
      }
      case h.IN_SELECT_IN_TABLE: {
        Td(this, t);
        break;
      }
      case h.IN_TEMPLATE: {
        Ad(this, t);
        break;
      }
      case h.AFTER_BODY: {
        Cd(this, t);
        break;
      }
      case h.IN_FRAMESET: {
        Nd(this, t);
        break;
      }
      case h.AFTER_FRAMESET: {
        xd(this, t);
        break;
      }
      case h.AFTER_AFTER_BODY: {
        wd(this, t);
        break;
      }
      case h.AFTER_AFTER_FRAMESET: {
        Rd(this, t);
        break;
      }
    }
  }
  onEndTag(t) {
    this.skipNextNewLine = !1, this.currentToken = t, this.currentNotInHTML ? kd(this, t) : this._endTagOutsideForeignContent(t);
  }
  _endTagOutsideForeignContent(t) {
    switch (this.insertionMode) {
      case h.INITIAL: {
        je(this, t);
        break;
      }
      case h.BEFORE_HTML: {
        hl(this, t);
        break;
      }
      case h.BEFORE_HEAD: {
        pl(this, t);
        break;
      }
      case h.IN_HEAD: {
        ml(this, t);
        break;
      }
      case h.IN_HEAD_NO_SCRIPT: {
        El(this, t);
        break;
      }
      case h.AFTER_HEAD: {
        Tl(this, t);
        break;
      }
      case h.IN_BODY: {
        rn(this, t);
        break;
      }
      case h.TEXT: {
        ad(this, t);
        break;
      }
      case h.IN_TABLE: {
        bt(this, t);
        break;
      }
      case h.IN_TABLE_TEXT: {
        Xe(this, t);
        break;
      }
      case h.IN_CAPTION: {
        md(this, t);
        break;
      }
      case h.IN_COLUMN_GROUP: {
        bd(this, t);
        break;
      }
      case h.IN_TABLE_BODY: {
        qn(this, t);
        break;
      }
      case h.IN_ROW: {
        ei(this, t);
        break;
      }
      case h.IN_CELL: {
        gd(this, t);
        break;
      }
      case h.IN_SELECT: {
        ni(this, t);
        break;
      }
      case h.IN_SELECT_IN_TABLE: {
        _d(this, t);
        break;
      }
      case h.IN_TEMPLATE: {
        yd(this, t);
        break;
      }
      case h.AFTER_BODY: {
        ai(this, t);
        break;
      }
      case h.IN_FRAMESET: {
        Id(this, t);
        break;
      }
      case h.AFTER_FRAMESET: {
        Sd(this, t);
        break;
      }
      case h.AFTER_AFTER_BODY: {
        Ft(this, t);
        break;
      }
    }
  }
  onEof(t) {
    switch (this.insertionMode) {
      case h.INITIAL: {
        je(this, t);
        break;
      }
      case h.BEFORE_HTML: {
        at(this, t);
        break;
      }
      case h.BEFORE_HEAD: {
        st(this, t);
        break;
      }
      case h.IN_HEAD: {
        it(this, t);
        break;
      }
      case h.IN_HEAD_NO_SCRIPT: {
        ut(this, t);
        break;
      }
      case h.AFTER_HEAD: {
        ot(this, t);
        break;
      }
      case h.IN_BODY:
      case h.IN_TABLE:
      case h.IN_CAPTION:
      case h.IN_COLUMN_GROUP:
      case h.IN_TABLE_BODY:
      case h.IN_ROW:
      case h.IN_CELL:
      case h.IN_SELECT:
      case h.IN_SELECT_IN_TABLE: {
        Xs(this, t);
        break;
      }
      case h.TEXT: {
        sd(this, t);
        break;
      }
      case h.IN_TABLE_TEXT: {
        Xe(this, t);
        break;
      }
      case h.IN_TEMPLATE: {
        ri(this, t);
        break;
      }
      case h.AFTER_BODY:
      case h.IN_FRAMESET:
      case h.AFTER_FRAMESET:
      case h.AFTER_AFTER_BODY:
      case h.AFTER_AFTER_FRAMESET: {
        or(this, t);
        break;
      }
    }
  }
  onWhitespaceCharacter(t) {
    if (this.skipNextNewLine && (this.skipNextNewLine = !1, t.chars.charCodeAt(0) === o.LINE_FEED)) {
      if (t.chars.length === 1)
        return;
      t.chars = t.chars.substr(1);
    }
    if (this.tokenizer.inForeignNode) {
      this._insertCharacters(t);
      return;
    }
    switch (this.insertionMode) {
      case h.IN_HEAD:
      case h.IN_HEAD_NO_SCRIPT:
      case h.AFTER_HEAD:
      case h.TEXT:
      case h.IN_COLUMN_GROUP:
      case h.IN_SELECT:
      case h.IN_SELECT_IN_TABLE:
      case h.IN_FRAMESET:
      case h.AFTER_FRAMESET: {
        this._insertCharacters(t);
        break;
      }
      case h.IN_BODY:
      case h.IN_CAPTION:
      case h.IN_CELL:
      case h.IN_TEMPLATE:
      case h.AFTER_BODY:
      case h.AFTER_AFTER_BODY:
      case h.AFTER_AFTER_FRAMESET: {
        Ws(this, t);
        break;
      }
      case h.IN_TABLE:
      case h.IN_TABLE_BODY:
      case h.IN_ROW: {
        En(this, t);
        break;
      }
      case h.IN_TABLE_TEXT: {
        Ks(this, t);
        break;
      }
    }
  }
}
function nl(e, t) {
  let n = e.activeFormattingElements.getElementEntryInScopeWithTagName(t.tagName);
  return n ? e.openElements.contains(n.element) ? e.openElements.hasInScope(t.tagID) || (n = null) : (e.activeFormattingElements.removeEntry(n), n = null) : js(e, t), n;
}
function rl(e, t) {
  let n = null, r = e.openElements.stackTop;
  for (; r >= 0; r--) {
    const s = e.openElements.items[r];
    if (s === t.element)
      break;
    e._isSpecialElement(s, e.openElements.tagIDs[r]) && (n = s);
  }
  return n || (e.openElements.shortenToLength(r < 0 ? 0 : r), e.activeFormattingElements.removeEntry(t)), n;
}
function al(e, t, n) {
  let r = t, s = e.openElements.getCommonAncestor(t);
  for (let i = 0, u = s; u !== n; i++, u = s) {
    s = e.openElements.getCommonAncestor(u);
    const c = e.activeFormattingElements.getElementEntry(u), d = c && i >= el;
    !c || d ? (d && e.activeFormattingElements.removeEntry(c), e.openElements.remove(u)) : (u = sl(e, c), r === t && (e.activeFormattingElements.bookmark = c), e.treeAdapter.detachNode(r), e.treeAdapter.appendChild(u, r), r = u);
  }
  return r;
}
function sl(e, t) {
  const n = e.treeAdapter.getNamespaceURI(t.element), r = e.treeAdapter.createElement(t.token.tagName, n, t.token.attrs);
  return e.openElements.replace(t.element, r), t.element = r, r;
}
function il(e, t, n) {
  const r = e.treeAdapter.getTagName(t), s = tn(r);
  if (e._isElementCausesFosterParenting(s))
    e._fosterParentElement(n);
  else {
    const i = e.treeAdapter.getNamespaceURI(t);
    s === a.TEMPLATE && i === g.HTML && (t = e.treeAdapter.getTemplateContent(t)), e.treeAdapter.appendChild(t, n);
  }
}
function ul(e, t, n) {
  const r = e.treeAdapter.getNamespaceURI(n.element), { token: s } = n, i = e.treeAdapter.createElement(s.tagName, r, s.attrs);
  e._adoptNodes(t, i), e.treeAdapter.appendChild(t, i), e.activeFormattingElements.insertElementAfterBookmark(i, s), e.activeFormattingElements.removeEntry(n), e.openElements.remove(n.element), e.openElements.insertAfter(t, i, s.tagID);
}
function ur(e, t) {
  for (let n = 0; n < Zc; n++) {
    const r = nl(e, t);
    if (!r)
      break;
    const s = rl(e, r);
    if (!s)
      break;
    e.activeFormattingElements.bookmark = r;
    const i = al(e, s, r.element), u = e.openElements.getCommonAncestor(r.element);
    e.treeAdapter.detachNode(i), u && il(e, u, i), ul(e, s, r);
  }
}
function Yn(e, t) {
  e._appendCommentNode(t, e.openElements.currentTmplContentOrNode);
}
function ol(e, t) {
  e._appendCommentNode(t, e.openElements.items[0]);
}
function cl(e, t) {
  e._appendCommentNode(t, e.document);
}
function or(e, t) {
  if (e.stopped = !0, t.location) {
    const n = e.fragmentContext ? 0 : 2;
    for (let r = e.openElements.stackTop; r >= n; r--)
      e._setEndLocation(e.openElements.items[r], t);
    if (!e.fragmentContext && e.openElements.stackTop >= 0) {
      const r = e.openElements.items[0], s = e.treeAdapter.getNodeSourceCodeLocation(r);
      if (s && !s.endTag && (e._setEndLocation(r, t), e.openElements.stackTop >= 1)) {
        const i = e.openElements.items[1], u = e.treeAdapter.getNodeSourceCodeLocation(i);
        u && !u.endTag && e._setEndLocation(i, t);
      }
    }
  }
}
function ll(e, t) {
  e._setDocumentType(t);
  const n = t.forceQuirks ? ee.QUIRKS : Fc(t);
  Hc(t) || e._err(t, E.nonConformingDoctype), e.treeAdapter.setDocumentMode(e.document, n), e.insertionMode = h.BEFORE_HTML;
}
function je(e, t) {
  e._err(t, E.missingDoctype, !0), e.treeAdapter.setDocumentMode(e.document, ee.QUIRKS), e.insertionMode = h.BEFORE_HTML, e._processToken(t);
}
function dl(e, t) {
  t.tagID === a.HTML ? (e._insertElement(t, g.HTML), e.insertionMode = h.BEFORE_HEAD) : at(e, t);
}
function hl(e, t) {
  const n = t.tagID;
  (n === a.HTML || n === a.HEAD || n === a.BODY || n === a.BR) && at(e, t);
}
function at(e, t) {
  e._insertFakeRootElement(), e.insertionMode = h.BEFORE_HEAD, e._processToken(t);
}
function fl(e, t) {
  switch (t.tagID) {
    case a.HTML: {
      z(e, t);
      break;
    }
    case a.HEAD: {
      e._insertElement(t, g.HTML), e.headElement = e.openElements.current, e.insertionMode = h.IN_HEAD;
      break;
    }
    default:
      st(e, t);
  }
}
function pl(e, t) {
  const n = t.tagID;
  n === a.HEAD || n === a.BODY || n === a.HTML || n === a.BR ? st(e, t) : e._err(t, E.endTagWithoutMatchingOpenElement);
}
function st(e, t) {
  e._insertFakeElement(m.HEAD, a.HEAD), e.headElement = e.openElements.current, e.insertionMode = h.IN_HEAD, e._processToken(t);
}
function ie(e, t) {
  switch (t.tagID) {
    case a.HTML: {
      z(e, t);
      break;
    }
    case a.BASE:
    case a.BASEFONT:
    case a.BGSOUND:
    case a.LINK:
    case a.META: {
      e._appendElement(t, g.HTML), t.ackSelfClosing = !0;
      break;
    }
    case a.TITLE: {
      e._switchToTextParsing(t, j.RCDATA);
      break;
    }
    case a.NOSCRIPT: {
      e.options.scriptingEnabled ? e._switchToTextParsing(t, j.RAWTEXT) : (e._insertElement(t, g.HTML), e.insertionMode = h.IN_HEAD_NO_SCRIPT);
      break;
    }
    case a.NOFRAMES:
    case a.STYLE: {
      e._switchToTextParsing(t, j.RAWTEXT);
      break;
    }
    case a.SCRIPT: {
      e._switchToTextParsing(t, j.SCRIPT_DATA);
      break;
    }
    case a.TEMPLATE: {
      e._insertTemplate(t), e.activeFormattingElements.insertMarker(), e.framesetOk = !1, e.insertionMode = h.IN_TEMPLATE, e.tmplInsertionModeStack.unshift(h.IN_TEMPLATE);
      break;
    }
    case a.HEAD: {
      e._err(t, E.misplacedStartTagForHeadElement);
      break;
    }
    default:
      it(e, t);
  }
}
function ml(e, t) {
  switch (t.tagID) {
    case a.HEAD: {
      e.openElements.pop(), e.insertionMode = h.AFTER_HEAD;
      break;
    }
    case a.BODY:
    case a.BR:
    case a.HTML: {
      it(e, t);
      break;
    }
    case a.TEMPLATE: {
      Oe(e, t);
      break;
    }
    default:
      e._err(t, E.endTagWithoutMatchingOpenElement);
  }
}
function Oe(e, t) {
  e.openElements.tmplCount > 0 ? (e.openElements.generateImpliedEndTagsThoroughly(), e.openElements.currentTagId !== a.TEMPLATE && e._err(t, E.closingOfElementWithOpenChildElements), e.openElements.popUntilTagNamePopped(a.TEMPLATE), e.activeFormattingElements.clearToLastMarker(), e.tmplInsertionModeStack.shift(), e._resetInsertionMode()) : e._err(t, E.endTagWithoutMatchingOpenElement);
}
function it(e, t) {
  e.openElements.pop(), e.insertionMode = h.AFTER_HEAD, e._processToken(t);
}
function bl(e, t) {
  switch (t.tagID) {
    case a.HTML: {
      z(e, t);
      break;
    }
    case a.BASEFONT:
    case a.BGSOUND:
    case a.HEAD:
    case a.LINK:
    case a.META:
    case a.NOFRAMES:
    case a.STYLE: {
      ie(e, t);
      break;
    }
    case a.NOSCRIPT: {
      e._err(t, E.nestedNoscriptInHead);
      break;
    }
    default:
      ut(e, t);
  }
}
function El(e, t) {
  switch (t.tagID) {
    case a.NOSCRIPT: {
      e.openElements.pop(), e.insertionMode = h.IN_HEAD;
      break;
    }
    case a.BR: {
      ut(e, t);
      break;
    }
    default:
      e._err(t, E.endTagWithoutMatchingOpenElement);
  }
}
function ut(e, t) {
  const n = t.type === O.EOF ? E.openElementsLeftAfterEof : E.disallowedContentInNoscriptInHead;
  e._err(t, n), e.openElements.pop(), e.insertionMode = h.IN_HEAD, e._processToken(t);
}
function gl(e, t) {
  switch (t.tagID) {
    case a.HTML: {
      z(e, t);
      break;
    }
    case a.BODY: {
      e._insertElement(t, g.HTML), e.framesetOk = !1, e.insertionMode = h.IN_BODY;
      break;
    }
    case a.FRAMESET: {
      e._insertElement(t, g.HTML), e.insertionMode = h.IN_FRAMESET;
      break;
    }
    case a.BASE:
    case a.BASEFONT:
    case a.BGSOUND:
    case a.LINK:
    case a.META:
    case a.NOFRAMES:
    case a.SCRIPT:
    case a.STYLE:
    case a.TEMPLATE:
    case a.TITLE: {
      e._err(t, E.abandonedHeadElementChild), e.openElements.push(e.headElement, a.HEAD), ie(e, t), e.openElements.remove(e.headElement);
      break;
    }
    case a.HEAD: {
      e._err(t, E.misplacedStartTagForHeadElement);
      break;
    }
    default:
      ot(e, t);
  }
}
function Tl(e, t) {
  switch (t.tagID) {
    case a.BODY:
    case a.HTML:
    case a.BR: {
      ot(e, t);
      break;
    }
    case a.TEMPLATE: {
      Oe(e, t);
      break;
    }
    default:
      e._err(t, E.endTagWithoutMatchingOpenElement);
  }
}
function ot(e, t) {
  e._insertFakeElement(m.BODY, a.BODY), e.insertionMode = h.IN_BODY, nn(e, t);
}
function nn(e, t) {
  switch (t.type) {
    case O.CHARACTER: {
      Vs(e, t);
      break;
    }
    case O.WHITESPACE_CHARACTER: {
      Ws(e, t);
      break;
    }
    case O.COMMENT: {
      Yn(e, t);
      break;
    }
    case O.START_TAG: {
      z(e, t);
      break;
    }
    case O.END_TAG: {
      rn(e, t);
      break;
    }
    case O.EOF: {
      Xs(e, t);
      break;
    }
  }
}
function Ws(e, t) {
  e._reconstructActiveFormattingElements(), e._insertCharacters(t);
}
function Vs(e, t) {
  e._reconstructActiveFormattingElements(), e._insertCharacters(t), e.framesetOk = !1;
}
function _l(e, t) {
  e.openElements.tmplCount === 0 && e.treeAdapter.adoptAttributes(e.openElements.items[0], t.attrs);
}
function Al(e, t) {
  const n = e.openElements.tryPeekProperlyNestedBodyElement();
  n && e.openElements.tmplCount === 0 && (e.framesetOk = !1, e.treeAdapter.adoptAttributes(n, t.attrs));
}
function yl(e, t) {
  const n = e.openElements.tryPeekProperlyNestedBodyElement();
  e.framesetOk && n && (e.treeAdapter.detachNode(n), e.openElements.popAllUpToHtmlElement(), e._insertElement(t, g.HTML), e.insertionMode = h.IN_FRAMESET);
}
function Cl(e, t) {
  e.openElements.hasInButtonScope(a.P) && e._closePElement(), e._insertElement(t, g.HTML);
}
function Nl(e, t) {
  e.openElements.hasInButtonScope(a.P) && e._closePElement(), ks(e.openElements.currentTagId) && e.openElements.pop(), e._insertElement(t, g.HTML);
}
function Il(e, t) {
  e.openElements.hasInButtonScope(a.P) && e._closePElement(), e._insertElement(t, g.HTML), e.skipNextNewLine = !0, e.framesetOk = !1;
}
function xl(e, t) {
  const n = e.openElements.tmplCount > 0;
  (!e.formElement || n) && (e.openElements.hasInButtonScope(a.P) && e._closePElement(), e._insertElement(t, g.HTML), n || (e.formElement = e.openElements.current));
}
function Sl(e, t) {
  e.framesetOk = !1;
  const n = t.tagID;
  for (let r = e.openElements.stackTop; r >= 0; r--) {
    const s = e.openElements.tagIDs[r];
    if (n === a.LI && s === a.LI || (n === a.DD || n === a.DT) && (s === a.DD || s === a.DT)) {
      e.openElements.generateImpliedEndTagsWithExclusion(s), e.openElements.popUntilTagNamePopped(s);
      break;
    }
    if (s !== a.ADDRESS && s !== a.DIV && s !== a.P && e._isSpecialElement(e.openElements.items[r], s))
      break;
  }
  e.openElements.hasInButtonScope(a.P) && e._closePElement(), e._insertElement(t, g.HTML);
}
function wl(e, t) {
  e.openElements.hasInButtonScope(a.P) && e._closePElement(), e._insertElement(t, g.HTML), e.tokenizer.state = j.PLAINTEXT;
}
function Rl(e, t) {
  e.openElements.hasInScope(a.BUTTON) && (e.openElements.generateImpliedEndTags(), e.openElements.popUntilTagNamePopped(a.BUTTON)), e._reconstructActiveFormattingElements(), e._insertElement(t, g.HTML), e.framesetOk = !1;
}
function Ll(e, t) {
  const n = e.activeFormattingElements.getElementEntryInScopeWithTagName(m.A);
  n && (ur(e, t), e.openElements.remove(n.element), e.activeFormattingElements.removeEntry(n)), e._reconstructActiveFormattingElements(), e._insertElement(t, g.HTML), e.activeFormattingElements.pushElement(e.openElements.current, t);
}
function vl(e, t) {
  e._reconstructActiveFormattingElements(), e._insertElement(t, g.HTML), e.activeFormattingElements.pushElement(e.openElements.current, t);
}
function Ol(e, t) {
  e._reconstructActiveFormattingElements(), e.openElements.hasInScope(a.NOBR) && (ur(e, t), e._reconstructActiveFormattingElements()), e._insertElement(t, g.HTML), e.activeFormattingElements.pushElement(e.openElements.current, t);
}
function kl(e, t) {
  e._reconstructActiveFormattingElements(), e._insertElement(t, g.HTML), e.activeFormattingElements.insertMarker(), e.framesetOk = !1;
}
function Dl(e, t) {
  e.treeAdapter.getDocumentMode(e.document) !== ee.QUIRKS && e.openElements.hasInButtonScope(a.P) && e._closePElement(), e._insertElement(t, g.HTML), e.framesetOk = !1, e.insertionMode = h.IN_TABLE;
}
function Gs(e, t) {
  e._reconstructActiveFormattingElements(), e._appendElement(t, g.HTML), e.framesetOk = !1, t.ackSelfClosing = !0;
}
function Qs(e) {
  const t = Ls(e, _e.TYPE);
  return t != null && t.toLowerCase() === Jc;
}
function Pl(e, t) {
  e._reconstructActiveFormattingElements(), e._appendElement(t, g.HTML), Qs(t) || (e.framesetOk = !1), t.ackSelfClosing = !0;
}
function Ml(e, t) {
  e._appendElement(t, g.HTML), t.ackSelfClosing = !0;
}
function Ul(e, t) {
  e.openElements.hasInButtonScope(a.P) && e._closePElement(), e._appendElement(t, g.HTML), e.framesetOk = !1, t.ackSelfClosing = !0;
}
function Bl(e, t) {
  t.tagName = m.IMG, t.tagID = a.IMG, Gs(e, t);
}
function Hl(e, t) {
  e._insertElement(t, g.HTML), e.skipNextNewLine = !0, e.tokenizer.state = j.RCDATA, e.originalInsertionMode = e.insertionMode, e.framesetOk = !1, e.insertionMode = h.TEXT;
}
function Fl(e, t) {
  e.openElements.hasInButtonScope(a.P) && e._closePElement(), e._reconstructActiveFormattingElements(), e.framesetOk = !1, e._switchToTextParsing(t, j.RAWTEXT);
}
function $l(e, t) {
  e.framesetOk = !1, e._switchToTextParsing(t, j.RAWTEXT);
}
function fa(e, t) {
  e._switchToTextParsing(t, j.RAWTEXT);
}
function Yl(e, t) {
  e._reconstructActiveFormattingElements(), e._insertElement(t, g.HTML), e.framesetOk = !1, e.insertionMode = e.insertionMode === h.IN_TABLE || e.insertionMode === h.IN_CAPTION || e.insertionMode === h.IN_TABLE_BODY || e.insertionMode === h.IN_ROW || e.insertionMode === h.IN_CELL ? h.IN_SELECT_IN_TABLE : h.IN_SELECT;
}
function ql(e, t) {
  e.openElements.currentTagId === a.OPTION && e.openElements.pop(), e._reconstructActiveFormattingElements(), e._insertElement(t, g.HTML);
}
function zl(e, t) {
  e.openElements.hasInScope(a.RUBY) && e.openElements.generateImpliedEndTags(), e._insertElement(t, g.HTML);
}
function Wl(e, t) {
  e.openElements.hasInScope(a.RUBY) && e.openElements.generateImpliedEndTagsWithExclusion(a.RTC), e._insertElement(t, g.HTML);
}
function Vl(e, t) {
  e._reconstructActiveFormattingElements(), $s(t), ir(t), t.selfClosing ? e._appendElement(t, g.MATHML) : e._insertElement(t, g.MATHML), t.ackSelfClosing = !0;
}
function Gl(e, t) {
  e._reconstructActiveFormattingElements(), Ys(t), ir(t), t.selfClosing ? e._appendElement(t, g.SVG) : e._insertElement(t, g.SVG), t.ackSelfClosing = !0;
}
function pa(e, t) {
  e._reconstructActiveFormattingElements(), e._insertElement(t, g.HTML);
}
function z(e, t) {
  switch (t.tagID) {
    case a.I:
    case a.S:
    case a.B:
    case a.U:
    case a.EM:
    case a.TT:
    case a.BIG:
    case a.CODE:
    case a.FONT:
    case a.SMALL:
    case a.STRIKE:
    case a.STRONG: {
      vl(e, t);
      break;
    }
    case a.A: {
      Ll(e, t);
      break;
    }
    case a.H1:
    case a.H2:
    case a.H3:
    case a.H4:
    case a.H5:
    case a.H6: {
      Nl(e, t);
      break;
    }
    case a.P:
    case a.DL:
    case a.OL:
    case a.UL:
    case a.DIV:
    case a.DIR:
    case a.NAV:
    case a.MAIN:
    case a.MENU:
    case a.ASIDE:
    case a.CENTER:
    case a.FIGURE:
    case a.FOOTER:
    case a.HEADER:
    case a.HGROUP:
    case a.DIALOG:
    case a.DETAILS:
    case a.ADDRESS:
    case a.ARTICLE:
    case a.SECTION:
    case a.SUMMARY:
    case a.FIELDSET:
    case a.BLOCKQUOTE:
    case a.FIGCAPTION: {
      Cl(e, t);
      break;
    }
    case a.LI:
    case a.DD:
    case a.DT: {
      Sl(e, t);
      break;
    }
    case a.BR:
    case a.IMG:
    case a.WBR:
    case a.AREA:
    case a.EMBED:
    case a.KEYGEN: {
      Gs(e, t);
      break;
    }
    case a.HR: {
      Ul(e, t);
      break;
    }
    case a.RB:
    case a.RTC: {
      zl(e, t);
      break;
    }
    case a.RT:
    case a.RP: {
      Wl(e, t);
      break;
    }
    case a.PRE:
    case a.LISTING: {
      Il(e, t);
      break;
    }
    case a.XMP: {
      Fl(e, t);
      break;
    }
    case a.SVG: {
      Gl(e, t);
      break;
    }
    case a.HTML: {
      _l(e, t);
      break;
    }
    case a.BASE:
    case a.LINK:
    case a.META:
    case a.STYLE:
    case a.TITLE:
    case a.SCRIPT:
    case a.BGSOUND:
    case a.BASEFONT:
    case a.TEMPLATE: {
      ie(e, t);
      break;
    }
    case a.BODY: {
      Al(e, t);
      break;
    }
    case a.FORM: {
      xl(e, t);
      break;
    }
    case a.NOBR: {
      Ol(e, t);
      break;
    }
    case a.MATH: {
      Vl(e, t);
      break;
    }
    case a.TABLE: {
      Dl(e, t);
      break;
    }
    case a.INPUT: {
      Pl(e, t);
      break;
    }
    case a.PARAM:
    case a.TRACK:
    case a.SOURCE: {
      Ml(e, t);
      break;
    }
    case a.IMAGE: {
      Bl(e, t);
      break;
    }
    case a.BUTTON: {
      Rl(e, t);
      break;
    }
    case a.APPLET:
    case a.OBJECT:
    case a.MARQUEE: {
      kl(e, t);
      break;
    }
    case a.IFRAME: {
      $l(e, t);
      break;
    }
    case a.SELECT: {
      Yl(e, t);
      break;
    }
    case a.OPTION:
    case a.OPTGROUP: {
      ql(e, t);
      break;
    }
    case a.NOEMBED: {
      fa(e, t);
      break;
    }
    case a.FRAMESET: {
      yl(e, t);
      break;
    }
    case a.TEXTAREA: {
      Hl(e, t);
      break;
    }
    case a.NOSCRIPT: {
      e.options.scriptingEnabled ? fa(e, t) : pa(e, t);
      break;
    }
    case a.PLAINTEXT: {
      wl(e, t);
      break;
    }
    case a.COL:
    case a.TH:
    case a.TD:
    case a.TR:
    case a.HEAD:
    case a.FRAME:
    case a.TBODY:
    case a.TFOOT:
    case a.THEAD:
    case a.CAPTION:
    case a.COLGROUP:
      break;
    default:
      pa(e, t);
  }
}
function Ql(e, t) {
  if (e.openElements.hasInScope(a.BODY) && (e.insertionMode = h.AFTER_BODY, e.options.sourceCodeLocationInfo)) {
    const n = e.openElements.tryPeekProperlyNestedBodyElement();
    n && e._setEndLocation(n, t);
  }
}
function jl(e, t) {
  e.openElements.hasInScope(a.BODY) && (e.insertionMode = h.AFTER_BODY, ai(e, t));
}
function Xl(e, t) {
  const n = t.tagID;
  e.openElements.hasInScope(n) && (e.openElements.generateImpliedEndTags(), e.openElements.popUntilTagNamePopped(n));
}
function Kl(e) {
  const t = e.openElements.tmplCount > 0, { formElement: n } = e;
  t || (e.formElement = null), (n || t) && e.openElements.hasInScope(a.FORM) && (e.openElements.generateImpliedEndTags(), t ? e.openElements.popUntilTagNamePopped(a.FORM) : n && e.openElements.remove(n));
}
function Jl(e) {
  e.openElements.hasInButtonScope(a.P) || e._insertFakeElement(m.P, a.P), e._closePElement();
}
function Zl(e) {
  e.openElements.hasInListItemScope(a.LI) && (e.openElements.generateImpliedEndTagsWithExclusion(a.LI), e.openElements.popUntilTagNamePopped(a.LI));
}
function ed(e, t) {
  const n = t.tagID;
  e.openElements.hasInScope(n) && (e.openElements.generateImpliedEndTagsWithExclusion(n), e.openElements.popUntilTagNamePopped(n));
}
function td(e) {
  e.openElements.hasNumberedHeaderInScope() && (e.openElements.generateImpliedEndTags(), e.openElements.popUntilNumberedHeaderPopped());
}
function nd(e, t) {
  const n = t.tagID;
  e.openElements.hasInScope(n) && (e.openElements.generateImpliedEndTags(), e.openElements.popUntilTagNamePopped(n), e.activeFormattingElements.clearToLastMarker());
}
function rd(e) {
  e._reconstructActiveFormattingElements(), e._insertFakeElement(m.BR, a.BR), e.openElements.pop(), e.framesetOk = !1;
}
function js(e, t) {
  const n = t.tagName, r = t.tagID;
  for (let s = e.openElements.stackTop; s > 0; s--) {
    const i = e.openElements.items[s], u = e.openElements.tagIDs[s];
    if (r === u && (r !== a.UNKNOWN || e.treeAdapter.getTagName(i) === n)) {
      e.openElements.generateImpliedEndTagsWithExclusion(r), e.openElements.stackTop >= s && e.openElements.shortenToLength(s);
      break;
    }
    if (e._isSpecialElement(i, u))
      break;
  }
}
function rn(e, t) {
  switch (t.tagID) {
    case a.A:
    case a.B:
    case a.I:
    case a.S:
    case a.U:
    case a.EM:
    case a.TT:
    case a.BIG:
    case a.CODE:
    case a.FONT:
    case a.NOBR:
    case a.SMALL:
    case a.STRIKE:
    case a.STRONG: {
      ur(e, t);
      break;
    }
    case a.P: {
      Jl(e);
      break;
    }
    case a.DL:
    case a.UL:
    case a.OL:
    case a.DIR:
    case a.DIV:
    case a.NAV:
    case a.PRE:
    case a.MAIN:
    case a.MENU:
    case a.ASIDE:
    case a.BUTTON:
    case a.CENTER:
    case a.FIGURE:
    case a.FOOTER:
    case a.HEADER:
    case a.HGROUP:
    case a.DIALOG:
    case a.ADDRESS:
    case a.ARTICLE:
    case a.DETAILS:
    case a.SECTION:
    case a.SUMMARY:
    case a.LISTING:
    case a.FIELDSET:
    case a.BLOCKQUOTE:
    case a.FIGCAPTION: {
      Xl(e, t);
      break;
    }
    case a.LI: {
      Zl(e);
      break;
    }
    case a.DD:
    case a.DT: {
      ed(e, t);
      break;
    }
    case a.H1:
    case a.H2:
    case a.H3:
    case a.H4:
    case a.H5:
    case a.H6: {
      td(e);
      break;
    }
    case a.BR: {
      rd(e);
      break;
    }
    case a.BODY: {
      Ql(e, t);
      break;
    }
    case a.HTML: {
      jl(e, t);
      break;
    }
    case a.FORM: {
      Kl(e);
      break;
    }
    case a.APPLET:
    case a.OBJECT:
    case a.MARQUEE: {
      nd(e, t);
      break;
    }
    case a.TEMPLATE: {
      Oe(e, t);
      break;
    }
    default:
      js(e, t);
  }
}
function Xs(e, t) {
  e.tmplInsertionModeStack.length > 0 ? ri(e, t) : or(e, t);
}
function ad(e, t) {
  var n;
  t.tagID === a.SCRIPT && ((n = e.scriptHandler) === null || n === void 0 || n.call(e, e.openElements.current)), e.openElements.pop(), e.insertionMode = e.originalInsertionMode;
}
function sd(e, t) {
  e._err(t, E.eofInElementThatCanContainOnlyText), e.openElements.pop(), e.insertionMode = e.originalInsertionMode, e.onEof(t);
}
function En(e, t) {
  if (qs.has(e.openElements.currentTagId))
    switch (e.pendingCharacterTokens.length = 0, e.hasNonWhitespacePendingCharacterToken = !1, e.originalInsertionMode = e.insertionMode, e.insertionMode = h.IN_TABLE_TEXT, t.type) {
      case O.CHARACTER: {
        Js(e, t);
        break;
      }
      case O.WHITESPACE_CHARACTER: {
        Ks(e, t);
        break;
      }
    }
  else
    yt(e, t);
}
function id(e, t) {
  e.openElements.clearBackToTableContext(), e.activeFormattingElements.insertMarker(), e._insertElement(t, g.HTML), e.insertionMode = h.IN_CAPTION;
}
function ud(e, t) {
  e.openElements.clearBackToTableContext(), e._insertElement(t, g.HTML), e.insertionMode = h.IN_COLUMN_GROUP;
}
function od(e, t) {
  e.openElements.clearBackToTableContext(), e._insertFakeElement(m.COLGROUP, a.COLGROUP), e.insertionMode = h.IN_COLUMN_GROUP, cr(e, t);
}
function cd(e, t) {
  e.openElements.clearBackToTableContext(), e._insertElement(t, g.HTML), e.insertionMode = h.IN_TABLE_BODY;
}
function ld(e, t) {
  e.openElements.clearBackToTableContext(), e._insertFakeElement(m.TBODY, a.TBODY), e.insertionMode = h.IN_TABLE_BODY, an(e, t);
}
function dd(e, t) {
  e.openElements.hasInTableScope(a.TABLE) && (e.openElements.popUntilTagNamePopped(a.TABLE), e._resetInsertionMode(), e._processStartTag(t));
}
function hd(e, t) {
  Qs(t) ? e._appendElement(t, g.HTML) : yt(e, t), t.ackSelfClosing = !0;
}
function fd(e, t) {
  !e.formElement && e.openElements.tmplCount === 0 && (e._insertElement(t, g.HTML), e.formElement = e.openElements.current, e.openElements.pop());
}
function We(e, t) {
  switch (t.tagID) {
    case a.TD:
    case a.TH:
    case a.TR: {
      ld(e, t);
      break;
    }
    case a.STYLE:
    case a.SCRIPT:
    case a.TEMPLATE: {
      ie(e, t);
      break;
    }
    case a.COL: {
      od(e, t);
      break;
    }
    case a.FORM: {
      fd(e, t);
      break;
    }
    case a.TABLE: {
      dd(e, t);
      break;
    }
    case a.TBODY:
    case a.TFOOT:
    case a.THEAD: {
      cd(e, t);
      break;
    }
    case a.INPUT: {
      hd(e, t);
      break;
    }
    case a.CAPTION: {
      id(e, t);
      break;
    }
    case a.COLGROUP: {
      ud(e, t);
      break;
    }
    default:
      yt(e, t);
  }
}
function bt(e, t) {
  switch (t.tagID) {
    case a.TABLE: {
      e.openElements.hasInTableScope(a.TABLE) && (e.openElements.popUntilTagNamePopped(a.TABLE), e._resetInsertionMode());
      break;
    }
    case a.TEMPLATE: {
      Oe(e, t);
      break;
    }
    case a.BODY:
    case a.CAPTION:
    case a.COL:
    case a.COLGROUP:
    case a.HTML:
    case a.TBODY:
    case a.TD:
    case a.TFOOT:
    case a.TH:
    case a.THEAD:
    case a.TR:
      break;
    default:
      yt(e, t);
  }
}
function yt(e, t) {
  const n = e.fosterParentingEnabled;
  e.fosterParentingEnabled = !0, nn(e, t), e.fosterParentingEnabled = n;
}
function Ks(e, t) {
  e.pendingCharacterTokens.push(t);
}
function Js(e, t) {
  e.pendingCharacterTokens.push(t), e.hasNonWhitespacePendingCharacterToken = !0;
}
function Xe(e, t) {
  let n = 0;
  if (e.hasNonWhitespacePendingCharacterToken)
    for (; n < e.pendingCharacterTokens.length; n++)
      yt(e, e.pendingCharacterTokens[n]);
  else
    for (; n < e.pendingCharacterTokens.length; n++)
      e._insertCharacters(e.pendingCharacterTokens[n]);
  e.insertionMode = e.originalInsertionMode, e._processToken(t);
}
const Zs = /* @__PURE__ */ new Set([a.CAPTION, a.COL, a.COLGROUP, a.TBODY, a.TD, a.TFOOT, a.TH, a.THEAD, a.TR]);
function pd(e, t) {
  const n = t.tagID;
  Zs.has(n) ? e.openElements.hasInTableScope(a.CAPTION) && (e.openElements.generateImpliedEndTags(), e.openElements.popUntilTagNamePopped(a.CAPTION), e.activeFormattingElements.clearToLastMarker(), e.insertionMode = h.IN_TABLE, We(e, t)) : z(e, t);
}
function md(e, t) {
  const n = t.tagID;
  switch (n) {
    case a.CAPTION:
    case a.TABLE: {
      e.openElements.hasInTableScope(a.CAPTION) && (e.openElements.generateImpliedEndTags(), e.openElements.popUntilTagNamePopped(a.CAPTION), e.activeFormattingElements.clearToLastMarker(), e.insertionMode = h.IN_TABLE, n === a.TABLE && bt(e, t));
      break;
    }
    case a.BODY:
    case a.COL:
    case a.COLGROUP:
    case a.HTML:
    case a.TBODY:
    case a.TD:
    case a.TFOOT:
    case a.TH:
    case a.THEAD:
    case a.TR:
      break;
    default:
      rn(e, t);
  }
}
function cr(e, t) {
  switch (t.tagID) {
    case a.HTML: {
      z(e, t);
      break;
    }
    case a.COL: {
      e._appendElement(t, g.HTML), t.ackSelfClosing = !0;
      break;
    }
    case a.TEMPLATE: {
      ie(e, t);
      break;
    }
    default:
      Vt(e, t);
  }
}
function bd(e, t) {
  switch (t.tagID) {
    case a.COLGROUP: {
      e.openElements.currentTagId === a.COLGROUP && (e.openElements.pop(), e.insertionMode = h.IN_TABLE);
      break;
    }
    case a.TEMPLATE: {
      Oe(e, t);
      break;
    }
    case a.COL:
      break;
    default:
      Vt(e, t);
  }
}
function Vt(e, t) {
  e.openElements.currentTagId === a.COLGROUP && (e.openElements.pop(), e.insertionMode = h.IN_TABLE, e._processToken(t));
}
function an(e, t) {
  switch (t.tagID) {
    case a.TR: {
      e.openElements.clearBackToTableBodyContext(), e._insertElement(t, g.HTML), e.insertionMode = h.IN_ROW;
      break;
    }
    case a.TH:
    case a.TD: {
      e.openElements.clearBackToTableBodyContext(), e._insertFakeElement(m.TR, a.TR), e.insertionMode = h.IN_ROW, sn(e, t);
      break;
    }
    case a.CAPTION:
    case a.COL:
    case a.COLGROUP:
    case a.TBODY:
    case a.TFOOT:
    case a.THEAD: {
      e.openElements.hasTableBodyContextInTableScope() && (e.openElements.clearBackToTableBodyContext(), e.openElements.pop(), e.insertionMode = h.IN_TABLE, We(e, t));
      break;
    }
    default:
      We(e, t);
  }
}
function qn(e, t) {
  const n = t.tagID;
  switch (t.tagID) {
    case a.TBODY:
    case a.TFOOT:
    case a.THEAD: {
      e.openElements.hasInTableScope(n) && (e.openElements.clearBackToTableBodyContext(), e.openElements.pop(), e.insertionMode = h.IN_TABLE);
      break;
    }
    case a.TABLE: {
      e.openElements.hasTableBodyContextInTableScope() && (e.openElements.clearBackToTableBodyContext(), e.openElements.pop(), e.insertionMode = h.IN_TABLE, bt(e, t));
      break;
    }
    case a.BODY:
    case a.CAPTION:
    case a.COL:
    case a.COLGROUP:
    case a.HTML:
    case a.TD:
    case a.TH:
    case a.TR:
      break;
    default:
      bt(e, t);
  }
}
function sn(e, t) {
  switch (t.tagID) {
    case a.TH:
    case a.TD: {
      e.openElements.clearBackToTableRowContext(), e._insertElement(t, g.HTML), e.insertionMode = h.IN_CELL, e.activeFormattingElements.insertMarker();
      break;
    }
    case a.CAPTION:
    case a.COL:
    case a.COLGROUP:
    case a.TBODY:
    case a.TFOOT:
    case a.THEAD:
    case a.TR: {
      e.openElements.hasInTableScope(a.TR) && (e.openElements.clearBackToTableRowContext(), e.openElements.pop(), e.insertionMode = h.IN_TABLE_BODY, an(e, t));
      break;
    }
    default:
      We(e, t);
  }
}
function ei(e, t) {
  switch (t.tagID) {
    case a.TR: {
      e.openElements.hasInTableScope(a.TR) && (e.openElements.clearBackToTableRowContext(), e.openElements.pop(), e.insertionMode = h.IN_TABLE_BODY);
      break;
    }
    case a.TABLE: {
      e.openElements.hasInTableScope(a.TR) && (e.openElements.clearBackToTableRowContext(), e.openElements.pop(), e.insertionMode = h.IN_TABLE_BODY, qn(e, t));
      break;
    }
    case a.TBODY:
    case a.TFOOT:
    case a.THEAD: {
      (e.openElements.hasInTableScope(t.tagID) || e.openElements.hasInTableScope(a.TR)) && (e.openElements.clearBackToTableRowContext(), e.openElements.pop(), e.insertionMode = h.IN_TABLE_BODY, qn(e, t));
      break;
    }
    case a.BODY:
    case a.CAPTION:
    case a.COL:
    case a.COLGROUP:
    case a.HTML:
    case a.TD:
    case a.TH:
      break;
    default:
      bt(e, t);
  }
}
function Ed(e, t) {
  const n = t.tagID;
  Zs.has(n) ? (e.openElements.hasInTableScope(a.TD) || e.openElements.hasInTableScope(a.TH)) && (e._closeTableCell(), sn(e, t)) : z(e, t);
}
function gd(e, t) {
  const n = t.tagID;
  switch (n) {
    case a.TD:
    case a.TH: {
      e.openElements.hasInTableScope(n) && (e.openElements.generateImpliedEndTags(), e.openElements.popUntilTagNamePopped(n), e.activeFormattingElements.clearToLastMarker(), e.insertionMode = h.IN_ROW);
      break;
    }
    case a.TABLE:
    case a.TBODY:
    case a.TFOOT:
    case a.THEAD:
    case a.TR: {
      e.openElements.hasInTableScope(n) && (e._closeTableCell(), ei(e, t));
      break;
    }
    case a.BODY:
    case a.CAPTION:
    case a.COL:
    case a.COLGROUP:
    case a.HTML:
      break;
    default:
      rn(e, t);
  }
}
function ti(e, t) {
  switch (t.tagID) {
    case a.HTML: {
      z(e, t);
      break;
    }
    case a.OPTION: {
      e.openElements.currentTagId === a.OPTION && e.openElements.pop(), e._insertElement(t, g.HTML);
      break;
    }
    case a.OPTGROUP: {
      e.openElements.currentTagId === a.OPTION && e.openElements.pop(), e.openElements.currentTagId === a.OPTGROUP && e.openElements.pop(), e._insertElement(t, g.HTML);
      break;
    }
    case a.INPUT:
    case a.KEYGEN:
    case a.TEXTAREA:
    case a.SELECT: {
      e.openElements.hasInSelectScope(a.SELECT) && (e.openElements.popUntilTagNamePopped(a.SELECT), e._resetInsertionMode(), t.tagID !== a.SELECT && e._processStartTag(t));
      break;
    }
    case a.SCRIPT:
    case a.TEMPLATE: {
      ie(e, t);
      break;
    }
  }
}
function ni(e, t) {
  switch (t.tagID) {
    case a.OPTGROUP: {
      e.openElements.stackTop > 0 && e.openElements.currentTagId === a.OPTION && e.openElements.tagIDs[e.openElements.stackTop - 1] === a.OPTGROUP && e.openElements.pop(), e.openElements.currentTagId === a.OPTGROUP && e.openElements.pop();
      break;
    }
    case a.OPTION: {
      e.openElements.currentTagId === a.OPTION && e.openElements.pop();
      break;
    }
    case a.SELECT: {
      e.openElements.hasInSelectScope(a.SELECT) && (e.openElements.popUntilTagNamePopped(a.SELECT), e._resetInsertionMode());
      break;
    }
    case a.TEMPLATE: {
      Oe(e, t);
      break;
    }
  }
}
function Td(e, t) {
  const n = t.tagID;
  n === a.CAPTION || n === a.TABLE || n === a.TBODY || n === a.TFOOT || n === a.THEAD || n === a.TR || n === a.TD || n === a.TH ? (e.openElements.popUntilTagNamePopped(a.SELECT), e._resetInsertionMode(), e._processStartTag(t)) : ti(e, t);
}
function _d(e, t) {
  const n = t.tagID;
  n === a.CAPTION || n === a.TABLE || n === a.TBODY || n === a.TFOOT || n === a.THEAD || n === a.TR || n === a.TD || n === a.TH ? e.openElements.hasInTableScope(n) && (e.openElements.popUntilTagNamePopped(a.SELECT), e._resetInsertionMode(), e.onEndTag(t)) : ni(e, t);
}
function Ad(e, t) {
  switch (t.tagID) {
    case a.BASE:
    case a.BASEFONT:
    case a.BGSOUND:
    case a.LINK:
    case a.META:
    case a.NOFRAMES:
    case a.SCRIPT:
    case a.STYLE:
    case a.TEMPLATE:
    case a.TITLE: {
      ie(e, t);
      break;
    }
    case a.CAPTION:
    case a.COLGROUP:
    case a.TBODY:
    case a.TFOOT:
    case a.THEAD: {
      e.tmplInsertionModeStack[0] = h.IN_TABLE, e.insertionMode = h.IN_TABLE, We(e, t);
      break;
    }
    case a.COL: {
      e.tmplInsertionModeStack[0] = h.IN_COLUMN_GROUP, e.insertionMode = h.IN_COLUMN_GROUP, cr(e, t);
      break;
    }
    case a.TR: {
      e.tmplInsertionModeStack[0] = h.IN_TABLE_BODY, e.insertionMode = h.IN_TABLE_BODY, an(e, t);
      break;
    }
    case a.TD:
    case a.TH: {
      e.tmplInsertionModeStack[0] = h.IN_ROW, e.insertionMode = h.IN_ROW, sn(e, t);
      break;
    }
    default:
      e.tmplInsertionModeStack[0] = h.IN_BODY, e.insertionMode = h.IN_BODY, z(e, t);
  }
}
function yd(e, t) {
  t.tagID === a.TEMPLATE && Oe(e, t);
}
function ri(e, t) {
  e.openElements.tmplCount > 0 ? (e.openElements.popUntilTagNamePopped(a.TEMPLATE), e.activeFormattingElements.clearToLastMarker(), e.tmplInsertionModeStack.shift(), e._resetInsertionMode(), e.onEof(t)) : or(e, t);
}
function Cd(e, t) {
  t.tagID === a.HTML ? z(e, t) : Gt(e, t);
}
function ai(e, t) {
  var n;
  if (t.tagID === a.HTML) {
    if (e.fragmentContext || (e.insertionMode = h.AFTER_AFTER_BODY), e.options.sourceCodeLocationInfo && e.openElements.tagIDs[0] === a.HTML) {
      e._setEndLocation(e.openElements.items[0], t);
      const r = e.openElements.items[1];
      r && !(!((n = e.treeAdapter.getNodeSourceCodeLocation(r)) === null || n === void 0) && n.endTag) && e._setEndLocation(r, t);
    }
  } else
    Gt(e, t);
}
function Gt(e, t) {
  e.insertionMode = h.IN_BODY, nn(e, t);
}
function Nd(e, t) {
  switch (t.tagID) {
    case a.HTML: {
      z(e, t);
      break;
    }
    case a.FRAMESET: {
      e._insertElement(t, g.HTML);
      break;
    }
    case a.FRAME: {
      e._appendElement(t, g.HTML), t.ackSelfClosing = !0;
      break;
    }
    case a.NOFRAMES: {
      ie(e, t);
      break;
    }
  }
}
function Id(e, t) {
  t.tagID === a.FRAMESET && !e.openElements.isRootHtmlElementCurrent() && (e.openElements.pop(), !e.fragmentContext && e.openElements.currentTagId !== a.FRAMESET && (e.insertionMode = h.AFTER_FRAMESET));
}
function xd(e, t) {
  switch (t.tagID) {
    case a.HTML: {
      z(e, t);
      break;
    }
    case a.NOFRAMES: {
      ie(e, t);
      break;
    }
  }
}
function Sd(e, t) {
  t.tagID === a.HTML && (e.insertionMode = h.AFTER_AFTER_FRAMESET);
}
function wd(e, t) {
  t.tagID === a.HTML ? z(e, t) : Ft(e, t);
}
function Ft(e, t) {
  e.insertionMode = h.IN_BODY, nn(e, t);
}
function Rd(e, t) {
  switch (t.tagID) {
    case a.HTML: {
      z(e, t);
      break;
    }
    case a.NOFRAMES: {
      ie(e, t);
      break;
    }
  }
}
function Ld(e, t) {
  t.chars = P, e._insertCharacters(t);
}
function vd(e, t) {
  e._insertCharacters(t), e.framesetOk = !1;
}
function si(e) {
  for (; e.treeAdapter.getNamespaceURI(e.openElements.current) !== g.HTML && !e._isIntegrationPoint(e.openElements.currentTagId, e.openElements.current); )
    e.openElements.pop();
}
function Od(e, t) {
  if (Gc(t))
    si(e), e._startTagOutsideForeignContent(t);
  else {
    const n = e._getAdjustedCurrentElement(), r = e.treeAdapter.getNamespaceURI(n);
    r === g.MATHML ? $s(t) : r === g.SVG && (Qc(t), Ys(t)), ir(t), t.selfClosing ? e._appendElement(t, r) : e._insertElement(t, r), t.ackSelfClosing = !0;
  }
}
function kd(e, t) {
  if (t.tagID === a.P || t.tagID === a.BR) {
    si(e), e._endTagOutsideForeignContent(t);
    return;
  }
  for (let n = e.openElements.stackTop; n > 0; n--) {
    const r = e.openElements.items[n];
    if (e.treeAdapter.getNamespaceURI(r) === g.HTML) {
      e._endTagOutsideForeignContent(t);
      break;
    }
    const s = e.treeAdapter.getTagName(r);
    if (s.toLowerCase() === t.tagName) {
      t.tagName = s, e.openElements.shortenToLength(n);
      break;
    }
  }
}
m.AREA, m.BASE, m.BASEFONT, m.BGSOUND, m.BR, m.COL, m.EMBED, m.FRAME, m.HR, m.IMG, m.INPUT, m.KEYGEN, m.LINK, m.META, m.PARAM, m.SOURCE, m.TRACK, m.WBR;
function Dd(e, t) {
  return zs.parse(e, t);
}
function Pd(e, t, n) {
  typeof e == "string" && (n = t, t = e, e = null);
  const r = zs.getFragmentParser(e, n);
  return r.tokenizer.write(t, !0), r.getFragment();
}
function Md(e) {
  return !e || typeof e != "object" ? "" : "position" in e || "type" in e ? ma(e.position) : "start" in e || "end" in e ? ma(e) : "line" in e || "column" in e ? zn(e) : "";
}
function zn(e) {
  return ba(e && e.line) + ":" + ba(e && e.column);
}
function ma(e) {
  return zn(e && e.start) + "-" + zn(e && e.end);
}
function ba(e) {
  return e && typeof e == "number" ? e : 1;
}
class G extends Error {
  /**
   * Create a message for `reason`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {Options | null | undefined} [options]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | Options | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns
   *   Instance of `VFileMessage`.
   */
  // eslint-disable-next-line complexity
  constructor(t, n, r) {
    super(), typeof n == "string" && (r = n, n = void 0);
    let s = "", i = {}, u = !1;
    if (n && ("line" in n && "column" in n ? i = { place: n } : "start" in n && "end" in n ? i = { place: n } : "type" in n ? i = {
      ancestors: [n],
      place: n.position
    } : i = { ...n }), typeof t == "string" ? s = t : !i.cause && t && (u = !0, s = t.message, i.cause = t), !i.ruleId && !i.source && typeof r == "string") {
      const d = r.indexOf(":");
      d === -1 ? i.ruleId = r : (i.source = r.slice(0, d), i.ruleId = r.slice(d + 1));
    }
    if (!i.place && i.ancestors && i.ancestors) {
      const d = i.ancestors[i.ancestors.length - 1];
      d && (i.place = d.position);
    }
    const c = i.place && "start" in i.place ? i.place.start : i.place;
    this.ancestors = i.ancestors || void 0, this.cause = i.cause || void 0, this.column = c ? c.column : void 0, this.fatal = void 0, this.file, this.message = s, this.line = c ? c.line : void 0, this.name = Md(i.place) || "1:1", this.place = i.place || void 0, this.reason = this.message, this.ruleId = i.ruleId || void 0, this.source = i.source || void 0, this.stack = u && i.cause && typeof i.cause.stack == "string" ? i.cause.stack : "", this.actual, this.expected, this.note, this.url;
  }
}
G.prototype.file = "";
G.prototype.name = "";
G.prototype.reason = "";
G.prototype.message = "";
G.prototype.stack = "";
G.prototype.column = void 0;
G.prototype.line = void 0;
G.prototype.ancestors = void 0;
G.prototype.cause = void 0;
G.prototype.fatal = void 0;
G.prototype.place = void 0;
G.prototype.ruleId = void 0;
G.prototype.source = void 0;
const ce = { basename: Ud, dirname: Bd, extname: Hd, join: Fd, sep: "/" };
function Ud(e, t) {
  if (t !== void 0 && typeof t != "string")
    throw new TypeError('"ext" argument must be a string');
  Ct(e);
  let n = 0, r = -1, s = e.length, i;
  if (t === void 0 || t.length === 0 || t.length > e.length) {
    for (; s--; )
      if (e.codePointAt(s) === 47) {
        if (i) {
          n = s + 1;
          break;
        }
      } else
        r < 0 && (i = !0, r = s + 1);
    return r < 0 ? "" : e.slice(n, r);
  }
  if (t === e)
    return "";
  let u = -1, c = t.length - 1;
  for (; s--; )
    if (e.codePointAt(s) === 47) {
      if (i) {
        n = s + 1;
        break;
      }
    } else
      u < 0 && (i = !0, u = s + 1), c > -1 && (e.codePointAt(s) === t.codePointAt(c--) ? c < 0 && (r = s) : (c = -1, r = u));
  return n === r ? r = u : r < 0 && (r = e.length), e.slice(n, r);
}
function Bd(e) {
  if (Ct(e), e.length === 0)
    return ".";
  let t = -1, n = e.length, r;
  for (; --n; )
    if (e.codePointAt(n) === 47) {
      if (r) {
        t = n;
        break;
      }
    } else
      r || (r = !0);
  return t < 0 ? e.codePointAt(0) === 47 ? "/" : "." : t === 1 && e.codePointAt(0) === 47 ? "//" : e.slice(0, t);
}
function Hd(e) {
  Ct(e);
  let t = e.length, n = -1, r = 0, s = -1, i = 0, u;
  for (; t--; ) {
    const c = e.codePointAt(t);
    if (c === 47) {
      if (u) {
        r = t + 1;
        break;
      }
      continue;
    }
    n < 0 && (u = !0, n = t + 1), c === 46 ? s < 0 ? s = t : i !== 1 && (i = 1) : s > -1 && (i = -1);
  }
  return s < 0 || n < 0 || // We saw a non-dot character immediately before the dot.
  i === 0 || // The (right-most) trimmed path component is exactly `..`.
  i === 1 && s === n - 1 && s === r + 1 ? "" : e.slice(s, n);
}
function Fd(...e) {
  let t = -1, n;
  for (; ++t < e.length; )
    Ct(e[t]), e[t] && (n = n === void 0 ? e[t] : n + "/" + e[t]);
  return n === void 0 ? "." : $d(n);
}
function $d(e) {
  Ct(e);
  const t = e.codePointAt(0) === 47;
  let n = Yd(e, !t);
  return n.length === 0 && !t && (n = "."), n.length > 0 && e.codePointAt(e.length - 1) === 47 && (n += "/"), t ? "/" + n : n;
}
function Yd(e, t) {
  let n = "", r = 0, s = -1, i = 0, u = -1, c, d;
  for (; ++u <= e.length; ) {
    if (u < e.length)
      c = e.codePointAt(u);
    else {
      if (c === 47)
        break;
      c = 47;
    }
    if (c === 47) {
      if (!(s === u - 1 || i === 1))
        if (s !== u - 1 && i === 2) {
          if (n.length < 2 || r !== 2 || n.codePointAt(n.length - 1) !== 46 || n.codePointAt(n.length - 2) !== 46) {
            if (n.length > 2) {
              if (d = n.lastIndexOf("/"), d !== n.length - 1) {
                d < 0 ? (n = "", r = 0) : (n = n.slice(0, d), r = n.length - 1 - n.lastIndexOf("/")), s = u, i = 0;
                continue;
              }
            } else if (n.length > 0) {
              n = "", r = 0, s = u, i = 0;
              continue;
            }
          }
          t && (n = n.length > 0 ? n + "/.." : "..", r = 2);
        } else
          n.length > 0 ? n += "/" + e.slice(s + 1, u) : n = e.slice(s + 1, u), r = u - s - 1;
      s = u, i = 0;
    } else
      c === 46 && i > -1 ? i++ : i = -1;
  }
  return n;
}
function Ct(e) {
  if (typeof e != "string")
    throw new TypeError(
      "Path must be a string. Received " + JSON.stringify(e)
    );
}
const qd = { cwd: zd };
function zd() {
  return "/";
}
function Wn(e) {
  return !!(e !== null && typeof e == "object" && "href" in e && e.href && "protocol" in e && e.protocol && // @ts-expect-error: indexing is fine.
  e.auth === void 0);
}
function Wd(e) {
  if (typeof e == "string")
    e = new URL(e);
  else if (!Wn(e)) {
    const t = new TypeError(
      'The "path" argument must be of type string or an instance of URL. Received `' + e + "`"
    );
    throw t.code = "ERR_INVALID_ARG_TYPE", t;
  }
  if (e.protocol !== "file:") {
    const t = new TypeError("The URL must be of scheme file");
    throw t.code = "ERR_INVALID_URL_SCHEME", t;
  }
  return Vd(e);
}
function Vd(e) {
  if (e.hostname !== "") {
    const r = new TypeError(
      'File URL host must be "localhost" or empty on darwin'
    );
    throw r.code = "ERR_INVALID_FILE_URL_HOST", r;
  }
  const t = e.pathname;
  let n = -1;
  for (; ++n < t.length; )
    if (t.codePointAt(n) === 37 && t.codePointAt(n + 1) === 50) {
      const r = t.codePointAt(n + 2);
      if (r === 70 || r === 102) {
        const s = new TypeError(
          "File URL path must not include encoded / characters"
        );
        throw s.code = "ERR_INVALID_FILE_URL_PATH", s;
      }
    }
  return decodeURIComponent(t);
}
const gn = (
  /** @type {const} */
  [
    "history",
    "path",
    "basename",
    "stem",
    "extname",
    "dirname"
  ]
);
class Vn {
  /**
   * Create a new virtual file.
   *
   * `options` is treated as:
   *
   * *   `string` or `Uint8Array` — `{value: options}`
   * *   `URL` — `{path: options}`
   * *   `VFile` — shallow copies its data over to the new file
   * *   `object` — all fields are shallow copied over to the new file
   *
   * Path related fields are set in the following order (least specific to
   * most specific): `history`, `path`, `basename`, `stem`, `extname`,
   * `dirname`.
   *
   * You cannot set `dirname` or `extname` without setting either `history`,
   * `path`, `basename`, or `stem` too.
   *
   * @param {Compatible | null | undefined} [value]
   *   File value.
   * @returns
   *   New instance.
   */
  constructor(t) {
    let n;
    t ? Wn(t) ? n = { path: t } : typeof t == "string" || Gd(t) ? n = { value: t } : n = t : n = {}, this.cwd = "cwd" in n ? "" : qd.cwd(), this.data = {}, this.history = [], this.messages = [], this.value, this.map, this.result, this.stored;
    let r = -1;
    for (; ++r < gn.length; ) {
      const i = gn[r];
      i in n && n[i] !== void 0 && n[i] !== null && (this[i] = i === "history" ? [...n[i]] : n[i]);
    }
    let s;
    for (s in n)
      gn.includes(s) || (this[s] = n[s]);
  }
  /**
   * Get the basename (including extname) (example: `'index.min.js'`).
   *
   * @returns {string | undefined}
   *   Basename.
   */
  get basename() {
    return typeof this.path == "string" ? ce.basename(this.path) : void 0;
  }
  /**
   * Set basename (including extname) (`'index.min.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   *
   * @param {string} basename
   *   Basename.
   * @returns {undefined}
   *   Nothing.
   */
  set basename(t) {
    _n(t, "basename"), Tn(t, "basename"), this.path = ce.join(this.dirname || "", t);
  }
  /**
   * Get the parent path (example: `'~'`).
   *
   * @returns {string | undefined}
   *   Dirname.
   */
  get dirname() {
    return typeof this.path == "string" ? ce.dirname(this.path) : void 0;
  }
  /**
   * Set the parent path (example: `'~'`).
   *
   * Cannot be set if there’s no `path` yet.
   *
   * @param {string | undefined} dirname
   *   Dirname.
   * @returns {undefined}
   *   Nothing.
   */
  set dirname(t) {
    Ea(this.basename, "dirname"), this.path = ce.join(t || "", this.basename);
  }
  /**
   * Get the extname (including dot) (example: `'.js'`).
   *
   * @returns {string | undefined}
   *   Extname.
   */
  get extname() {
    return typeof this.path == "string" ? ce.extname(this.path) : void 0;
  }
  /**
   * Set the extname (including dot) (example: `'.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be set if there’s no `path` yet.
   *
   * @param {string | undefined} extname
   *   Extname.
   * @returns {undefined}
   *   Nothing.
   */
  set extname(t) {
    if (Tn(t, "extname"), Ea(this.dirname, "extname"), t) {
      if (t.codePointAt(0) !== 46)
        throw new Error("`extname` must start with `.`");
      if (t.includes(".", 1))
        throw new Error("`extname` cannot contain multiple dots");
    }
    this.path = ce.join(this.dirname, this.stem + (t || ""));
  }
  /**
   * Get the full path (example: `'~/index.min.js'`).
   *
   * @returns {string}
   *   Path.
   */
  get path() {
    return this.history[this.history.length - 1];
  }
  /**
   * Set the full path (example: `'~/index.min.js'`).
   *
   * Cannot be nullified.
   * You can set a file URL (a `URL` object with a `file:` protocol) which will
   * be turned into a path with `url.fileURLToPath`.
   *
   * @param {URL | string} path
   *   Path.
   * @returns {undefined}
   *   Nothing.
   */
  set path(t) {
    Wn(t) && (t = Wd(t)), _n(t, "path"), this.path !== t && this.history.push(t);
  }
  /**
   * Get the stem (basename w/o extname) (example: `'index.min'`).
   *
   * @returns {string | undefined}
   *   Stem.
   */
  get stem() {
    return typeof this.path == "string" ? ce.basename(this.path, this.extname) : void 0;
  }
  /**
   * Set the stem (basename w/o extname) (example: `'index.min'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   *
   * @param {string} stem
   *   Stem.
   * @returns {undefined}
   *   Nothing.
   */
  set stem(t) {
    _n(t, "stem"), Tn(t, "stem"), this.path = ce.join(this.dirname || "", t + (this.extname || ""));
  }
  // Normal prototypal methods.
  /**
   * Create a fatal message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `true` (error; file not usable)
   * and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {never}
   *   Never.
   * @throws {VFileMessage}
   *   Message.
   */
  fail(t, n, r) {
    const s = this.message(t, n, r);
    throw s.fatal = !0, s;
  }
  /**
   * Create an info message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `undefined` (info; change
   * likely not needed) and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  info(t, n, r) {
    const s = this.message(t, n, r);
    return s.fatal = void 0, s;
  }
  /**
   * Create a message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `false` (warning; change may be
   * needed) and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  message(t, n, r) {
    const s = new G(
      // @ts-expect-error: the overloads are fine.
      t,
      n,
      r
    );
    return this.path && (s.name = this.path + ":" + s.name, s.file = this.path), s.fatal = !1, this.messages.push(s), s;
  }
  /**
   * Serialize the file.
   *
   * > **Note**: which encodings are supported depends on the engine.
   * > For info on Node.js, see:
   * > <https://nodejs.org/api/util.html#whatwg-supported-encodings>.
   *
   * @param {string | null | undefined} [encoding='utf8']
   *   Character encoding to understand `value` as when it’s a `Uint8Array`
   *   (default: `'utf-8'`).
   * @returns {string}
   *   Serialized file.
   */
  toString(t) {
    return this.value === void 0 ? "" : typeof this.value == "string" ? this.value : new TextDecoder(t || void 0).decode(this.value);
  }
}
function Tn(e, t) {
  if (e && e.includes(ce.sep))
    throw new Error(
      "`" + t + "` cannot be a path: did not expect `" + ce.sep + "`"
    );
}
function _n(e, t) {
  if (!e)
    throw new Error("`" + t + "` cannot be empty");
}
function Ea(e, t) {
  if (!e)
    throw new Error("Setting `" + t + "` requires `path` to be set too");
}
function Gd(e) {
  return !!(e && typeof e == "object" && "byteLength" in e && "byteOffset" in e);
}
const Qd = {
  /** @type {ErrorInfo} */
  abandonedHeadElementChild: {
    reason: "Unexpected metadata element after head",
    description: "Unexpected element after head. Expected the element before `</head>`",
    url: !1
  },
  /** @type {ErrorInfo} */
  abruptClosingOfEmptyComment: {
    reason: "Unexpected abruptly closed empty comment",
    description: "Unexpected `>` or `->`. Expected `-->` to close comments"
  },
  /** @type {ErrorInfo} */
  abruptDoctypePublicIdentifier: {
    reason: "Unexpected abruptly closed public identifier",
    description: "Unexpected `>`. Expected a closing `\"` or `'` after the public identifier"
  },
  /** @type {ErrorInfo} */
  abruptDoctypeSystemIdentifier: {
    reason: "Unexpected abruptly closed system identifier",
    description: "Unexpected `>`. Expected a closing `\"` or `'` after the identifier identifier"
  },
  /** @type {ErrorInfo} */
  absenceOfDigitsInNumericCharacterReference: {
    reason: "Unexpected non-digit at start of numeric character reference",
    description: "Unexpected `%c`. Expected `[0-9]` for decimal references or `[0-9a-fA-F]` for hexadecimal references"
  },
  /** @type {ErrorInfo} */
  cdataInHtmlContent: {
    reason: "Unexpected CDATA section in HTML",
    description: "Unexpected `<![CDATA[` in HTML. Remove it, use a comment, or encode special characters instead"
  },
  /** @type {ErrorInfo} */
  characterReferenceOutsideUnicodeRange: {
    reason: "Unexpected too big numeric character reference",
    description: "Unexpectedly high character reference. Expected character references to be at most hexadecimal 10ffff (or decimal 1114111)"
  },
  /** @type {ErrorInfo} */
  closingOfElementWithOpenChildElements: {
    reason: "Unexpected closing tag with open child elements",
    description: "Unexpectedly closing tag. Expected other tags to be closed first",
    url: !1
  },
  /** @type {ErrorInfo} */
  controlCharacterInInputStream: {
    reason: "Unexpected control character",
    description: "Unexpected control character `%x`. Expected a non-control code point, 0x00, or ASCII whitespace"
  },
  /** @type {ErrorInfo} */
  controlCharacterReference: {
    reason: "Unexpected control character reference",
    description: "Unexpectedly control character in reference. Expected a non-control code point, 0x00, or ASCII whitespace"
  },
  /** @type {ErrorInfo} */
  disallowedContentInNoscriptInHead: {
    reason: "Disallowed content inside `<noscript>` in `<head>`",
    description: "Unexpected text character `%c`. Only use text in `<noscript>`s in `<body>`",
    url: !1
  },
  /** @type {ErrorInfo} */
  duplicateAttribute: {
    reason: "Unexpected duplicate attribute",
    description: "Unexpectedly double attribute. Expected attributes to occur only once"
  },
  /** @type {ErrorInfo} */
  endTagWithAttributes: {
    reason: "Unexpected attribute on closing tag",
    description: "Unexpected attribute. Expected `>` instead"
  },
  /** @type {ErrorInfo} */
  endTagWithTrailingSolidus: {
    reason: "Unexpected slash at end of closing tag",
    description: "Unexpected `%c-1`. Expected `>` instead"
  },
  /** @type {ErrorInfo} */
  endTagWithoutMatchingOpenElement: {
    reason: "Unexpected unopened end tag",
    description: "Unexpected end tag. Expected no end tag or another end tag",
    url: !1
  },
  /** @type {ErrorInfo} */
  eofBeforeTagName: {
    reason: "Unexpected end of file",
    description: "Unexpected end of file. Expected tag name instead"
  },
  /** @type {ErrorInfo} */
  eofInCdata: {
    reason: "Unexpected end of file in CDATA",
    description: "Unexpected end of file. Expected `]]>` to close the CDATA"
  },
  /** @type {ErrorInfo} */
  eofInComment: {
    reason: "Unexpected end of file in comment",
    description: "Unexpected end of file. Expected `-->` to close the comment"
  },
  /** @type {ErrorInfo} */
  eofInDoctype: {
    reason: "Unexpected end of file in doctype",
    description: "Unexpected end of file. Expected a valid doctype (such as `<!doctype html>`)"
  },
  /** @type {ErrorInfo} */
  eofInElementThatCanContainOnlyText: {
    reason: "Unexpected end of file in element that can only contain text",
    description: "Unexpected end of file. Expected text or a closing tag",
    url: !1
  },
  /** @type {ErrorInfo} */
  eofInScriptHtmlCommentLikeText: {
    reason: "Unexpected end of file in comment inside script",
    description: "Unexpected end of file. Expected `-->` to close the comment"
  },
  /** @type {ErrorInfo} */
  eofInTag: {
    reason: "Unexpected end of file in tag",
    description: "Unexpected end of file. Expected `>` to close the tag"
  },
  /** @type {ErrorInfo} */
  incorrectlyClosedComment: {
    reason: "Incorrectly closed comment",
    description: "Unexpected `%c-1`. Expected `-->` to close the comment"
  },
  /** @type {ErrorInfo} */
  incorrectlyOpenedComment: {
    reason: "Incorrectly opened comment",
    description: "Unexpected `%c`. Expected `<!--` to open the comment"
  },
  /** @type {ErrorInfo} */
  invalidCharacterSequenceAfterDoctypeName: {
    reason: "Invalid sequence after doctype name",
    description: "Unexpected sequence at `%c`. Expected `public` or `system`"
  },
  /** @type {ErrorInfo} */
  invalidFirstCharacterOfTagName: {
    reason: "Invalid first character in tag name",
    description: "Unexpected `%c`. Expected an ASCII letter instead"
  },
  /** @type {ErrorInfo} */
  misplacedDoctype: {
    reason: "Misplaced doctype",
    description: "Unexpected doctype. Expected doctype before head",
    url: !1
  },
  /** @type {ErrorInfo} */
  misplacedStartTagForHeadElement: {
    reason: "Misplaced `<head>` start tag",
    description: "Unexpected start tag `<head>`. Expected `<head>` directly after doctype",
    url: !1
  },
  /** @type {ErrorInfo} */
  missingAttributeValue: {
    reason: "Missing attribute value",
    description: "Unexpected `%c-1`. Expected an attribute value or no `%c-1` instead"
  },
  /** @type {ErrorInfo} */
  missingDoctype: {
    reason: "Missing doctype before other content",
    description: "Expected a `<!doctype html>` before anything else",
    url: !1
  },
  /** @type {ErrorInfo} */
  missingDoctypeName: {
    reason: "Missing doctype name",
    description: "Unexpected doctype end at `%c`. Expected `html` instead"
  },
  /** @type {ErrorInfo} */
  missingDoctypePublicIdentifier: {
    reason: "Missing public identifier in doctype",
    description: "Unexpected `%c`. Expected identifier for `public` instead"
  },
  /** @type {ErrorInfo} */
  missingDoctypeSystemIdentifier: {
    reason: "Missing system identifier in doctype",
    description: 'Unexpected `%c`. Expected identifier for `system` instead (suggested: `"about:legacy-compat"`)'
  },
  /** @type {ErrorInfo} */
  missingEndTagName: {
    reason: "Missing name in end tag",
    description: "Unexpected `%c`. Expected an ASCII letter instead"
  },
  /** @type {ErrorInfo} */
  missingQuoteBeforeDoctypePublicIdentifier: {
    reason: "Missing quote before public identifier in doctype",
    description: "Unexpected `%c`. Expected `\"` or `'` instead"
  },
  /** @type {ErrorInfo} */
  missingQuoteBeforeDoctypeSystemIdentifier: {
    reason: "Missing quote before system identifier in doctype",
    description: "Unexpected `%c`. Expected `\"` or `'` instead"
  },
  /** @type {ErrorInfo} */
  missingSemicolonAfterCharacterReference: {
    reason: "Missing semicolon after character reference",
    description: "Unexpected `%c`. Expected `;` instead"
  },
  /** @type {ErrorInfo} */
  missingWhitespaceAfterDoctypePublicKeyword: {
    reason: "Missing whitespace after public identifier in doctype",
    description: "Unexpected `%c`. Expected ASCII whitespace instead"
  },
  /** @type {ErrorInfo} */
  missingWhitespaceAfterDoctypeSystemKeyword: {
    reason: "Missing whitespace after system identifier in doctype",
    description: "Unexpected `%c`. Expected ASCII whitespace instead"
  },
  /** @type {ErrorInfo} */
  missingWhitespaceBeforeDoctypeName: {
    reason: "Missing whitespace before doctype name",
    description: "Unexpected `%c`. Expected ASCII whitespace instead"
  },
  /** @type {ErrorInfo} */
  missingWhitespaceBetweenAttributes: {
    reason: "Missing whitespace between attributes",
    description: "Unexpected `%c`. Expected ASCII whitespace instead"
  },
  /** @type {ErrorInfo} */
  missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers: {
    reason: "Missing whitespace between public and system identifiers in doctype",
    description: "Unexpected `%c`. Expected ASCII whitespace instead"
  },
  /** @type {ErrorInfo} */
  nestedComment: {
    reason: "Unexpected nested comment",
    description: "Unexpected `<!--`. Expected `-->`"
  },
  /** @type {ErrorInfo} */
  nestedNoscriptInHead: {
    reason: "Unexpected nested `<noscript>` in `<head>`",
    description: "Unexpected `<noscript>`. Expected a closing tag or a meta element",
    url: !1
  },
  /** @type {ErrorInfo} */
  nonConformingDoctype: {
    reason: "Unexpected non-conforming doctype declaration",
    description: 'Expected `<!doctype html>` or `<!doctype html system "about:legacy-compat">`',
    url: !1
  },
  /** @type {ErrorInfo} */
  nonVoidHtmlElementStartTagWithTrailingSolidus: {
    reason: "Unexpected trailing slash on start tag of non-void element",
    description: "Unexpected `/`. Expected `>` instead"
  },
  /** @type {ErrorInfo} */
  noncharacterCharacterReference: {
    reason: "Unexpected noncharacter code point referenced by character reference",
    description: "Unexpected code point. Do not use noncharacters in HTML"
  },
  /** @type {ErrorInfo} */
  noncharacterInInputStream: {
    reason: "Unexpected noncharacter character",
    description: "Unexpected code point `%x`. Do not use noncharacters in HTML"
  },
  /** @type {ErrorInfo} */
  nullCharacterReference: {
    reason: "Unexpected NULL character referenced by character reference",
    description: "Unexpected code point. Do not use NULL characters in HTML"
  },
  /** @type {ErrorInfo} */
  openElementsLeftAfterEof: {
    reason: "Unexpected end of file",
    description: "Unexpected end of file. Expected closing tag instead",
    url: !1
  },
  /** @type {ErrorInfo} */
  surrogateCharacterReference: {
    reason: "Unexpected surrogate character referenced by character reference",
    description: "Unexpected code point. Do not use lone surrogate characters in HTML"
  },
  /** @type {ErrorInfo} */
  surrogateInInputStream: {
    reason: "Unexpected surrogate character",
    description: "Unexpected code point `%x`. Do not use lone surrogate characters in HTML"
  },
  /** @type {ErrorInfo} */
  unexpectedCharacterAfterDoctypeSystemIdentifier: {
    reason: "Invalid character after system identifier in doctype",
    description: "Unexpected character at `%c`. Expected `>`"
  },
  /** @type {ErrorInfo} */
  unexpectedCharacterInAttributeName: {
    reason: "Unexpected character in attribute name",
    description: "Unexpected `%c`. Expected whitespace, `/`, `>`, `=`, or probably an ASCII letter"
  },
  /** @type {ErrorInfo} */
  unexpectedCharacterInUnquotedAttributeValue: {
    reason: "Unexpected character in unquoted attribute value",
    description: "Unexpected `%c`. Quote the attribute value to include it"
  },
  /** @type {ErrorInfo} */
  unexpectedEqualsSignBeforeAttributeName: {
    reason: "Unexpected equals sign before attribute name",
    description: "Unexpected `%c`. Add an attribute name before it"
  },
  /** @type {ErrorInfo} */
  unexpectedNullCharacter: {
    reason: "Unexpected NULL character",
    description: "Unexpected code point `%x`. Do not use NULL characters in HTML"
  },
  /** @type {ErrorInfo} */
  unexpectedQuestionMarkInsteadOfTagName: {
    reason: "Unexpected question mark instead of tag name",
    description: "Unexpected `%c`. Expected an ASCII letter instead"
  },
  /** @type {ErrorInfo} */
  unexpectedSolidusInTag: {
    reason: "Unexpected slash in tag",
    description: "Unexpected `%c-1`. Expected it followed by `>` or in a quoted attribute value"
  },
  /** @type {ErrorInfo} */
  unknownNamedCharacterReference: {
    reason: "Unexpected unknown named character reference",
    description: "Unexpected character reference. Expected known named character references"
  }
}, jd = "https://html.spec.whatwg.org/multipage/parsing.html#parse-error-", Xd = /-[a-z]/g, Kd = /%c(?:([-+])(\d+))?/g, Jd = /%x/g, Zd = { 2: !0, 1: !1, 0: null }, e0 = {};
function t0(e, t) {
  const n = t || e0, r = n.onerror, s = e instanceof Vn ? e : new Vn(e), i = n.fragment ? Pd : Dd, u = String(s), c = i(u, {
    sourceCodeLocationInfo: !0,
    // Note `parse5` types currently do not allow `undefined`.
    onParseError: n.onerror ? d : null,
    scriptingEnabled: !1
  });
  return (
    /** @type {Root} */
    rc(c, {
      file: s,
      space: n.space,
      verbose: n.verbose
    })
  );
  function d(f) {
    const p = f.code, b = n0(p), y = n[b], T = y ?? !0, C = typeof T == "number" ? T : T ? 1 : 0;
    if (C) {
      const I = Qd[b], x = new G(N(I.reason), {
        place: {
          start: {
            line: f.startLine,
            column: f.startCol,
            offset: f.startOffset
          },
          end: {
            line: f.endLine,
            column: f.endCol,
            offset: f.endOffset
          }
        },
        ruleId: p,
        source: "hast-util-from-html"
      });
      s.path && (x.file = s.path, x.name = s.path + ":" + x.name), x.fatal = Zd[C], x.note = N(I.description), x.url = I.url === !1 ? void 0 : jd + p, r(x);
    }
    function N(I) {
      return I.replace(Kd, x).replace(Jd, S);
      function x(v, w, R) {
        const k = (R ? Number.parseInt(R, 10) : 0) * (w === "-" ? -1 : 1), q = u.charAt(f.startOffset + k);
        return a0(q);
      }
      function S() {
        return s0(u.charCodeAt(f.startOffset));
      }
    }
  }
}
function n0(e) {
  return (
    /** @type {ErrorCode} */
    e.replace(Xd, r0)
  );
}
function r0(e) {
  return e.charAt(1).toUpperCase();
}
function a0(e) {
  return e === "`" ? "` ` `" : e;
}
function s0(e) {
  return "0x" + e.toString(16).toUpperCase();
}
function i0(e) {
  const t = this, { emitParseErrors: n, ...r } = { ...t.data("settings"), ...e };
  t.parser = s;
  function s(i, u) {
    return t0(i, {
      ...r,
      onerror: n ? function(c) {
        u.path && (c.name = u.path + ":" + c.name, c.file = u.path), u.messages.push(c);
      } : void 0
    });
  }
}
const u0 = [
  "area",
  "base",
  "basefont",
  "bgsound",
  "br",
  "col",
  "command",
  "embed",
  "frame",
  "hr",
  "image",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
], ga = {}.hasOwnProperty;
function o0(e, t) {
  const n = t || {};
  function r(s, ...i) {
    let u = r.invalid;
    const c = r.handlers;
    if (s && ga.call(s, e)) {
      const d = String(s[e]);
      u = ga.call(c, d) ? c[d] : r.unknown;
    }
    if (u)
      return u.call(this, s, ...i);
  }
  return r.handlers = n.handlers || {}, r.invalid = n.invalid, r.unknown = n.unknown, r;
}
const c0 = /["&'<>`]/g, l0 = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g, d0 = (
  // eslint-disable-next-line no-control-regex, unicorn/no-hex-escape
  /[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g
), h0 = /[|\\{}()[\]^$+*?.]/g, Ta = /* @__PURE__ */ new WeakMap();
function f0(e, t) {
  if (e = e.replace(
    t.subset ? p0(t.subset) : c0,
    r
  ), t.subset || t.escapeOnly)
    return e;
  return e.replace(l0, n).replace(d0, r);
  function n(s, i, u) {
    return t.format(
      (s.charCodeAt(0) - 55296) * 1024 + s.charCodeAt(1) - 56320 + 65536,
      u.charCodeAt(i + 2),
      t
    );
  }
  function r(s, i, u) {
    return t.format(
      s.charCodeAt(0),
      u.charCodeAt(i + 1),
      t
    );
  }
}
function p0(e) {
  let t = Ta.get(e);
  return t || (t = m0(e), Ta.set(e, t)), t;
}
function m0(e) {
  const t = [];
  let n = -1;
  for (; ++n < e.length; )
    t.push(e[n].replace(h0, "\\$&"));
  return new RegExp("(?:" + t.join("|") + ")", "g");
}
const b0 = /[\dA-Fa-f]/;
function E0(e, t, n) {
  const r = "&#x" + e.toString(16).toUpperCase();
  return n && t && !b0.test(String.fromCharCode(t)) ? r : r + ";";
}
const g0 = /\d/;
function T0(e, t, n) {
  const r = "&#" + String(e);
  return n && t && !g0.test(String.fromCharCode(t)) ? r : r + ";";
}
const _0 = [
  "AElig",
  "AMP",
  "Aacute",
  "Acirc",
  "Agrave",
  "Aring",
  "Atilde",
  "Auml",
  "COPY",
  "Ccedil",
  "ETH",
  "Eacute",
  "Ecirc",
  "Egrave",
  "Euml",
  "GT",
  "Iacute",
  "Icirc",
  "Igrave",
  "Iuml",
  "LT",
  "Ntilde",
  "Oacute",
  "Ocirc",
  "Ograve",
  "Oslash",
  "Otilde",
  "Ouml",
  "QUOT",
  "REG",
  "THORN",
  "Uacute",
  "Ucirc",
  "Ugrave",
  "Uuml",
  "Yacute",
  "aacute",
  "acirc",
  "acute",
  "aelig",
  "agrave",
  "amp",
  "aring",
  "atilde",
  "auml",
  "brvbar",
  "ccedil",
  "cedil",
  "cent",
  "copy",
  "curren",
  "deg",
  "divide",
  "eacute",
  "ecirc",
  "egrave",
  "eth",
  "euml",
  "frac12",
  "frac14",
  "frac34",
  "gt",
  "iacute",
  "icirc",
  "iexcl",
  "igrave",
  "iquest",
  "iuml",
  "laquo",
  "lt",
  "macr",
  "micro",
  "middot",
  "nbsp",
  "not",
  "ntilde",
  "oacute",
  "ocirc",
  "ograve",
  "ordf",
  "ordm",
  "oslash",
  "otilde",
  "ouml",
  "para",
  "plusmn",
  "pound",
  "quot",
  "raquo",
  "reg",
  "sect",
  "shy",
  "sup1",
  "sup2",
  "sup3",
  "szlig",
  "thorn",
  "times",
  "uacute",
  "ucirc",
  "ugrave",
  "uml",
  "uuml",
  "yacute",
  "yen",
  "yuml"
], An = {
  nbsp: " ",
  iexcl: "¡",
  cent: "¢",
  pound: "£",
  curren: "¤",
  yen: "¥",
  brvbar: "¦",
  sect: "§",
  uml: "¨",
  copy: "©",
  ordf: "ª",
  laquo: "«",
  not: "¬",
  shy: "­",
  reg: "®",
  macr: "¯",
  deg: "°",
  plusmn: "±",
  sup2: "²",
  sup3: "³",
  acute: "´",
  micro: "µ",
  para: "¶",
  middot: "·",
  cedil: "¸",
  sup1: "¹",
  ordm: "º",
  raquo: "»",
  frac14: "¼",
  frac12: "½",
  frac34: "¾",
  iquest: "¿",
  Agrave: "À",
  Aacute: "Á",
  Acirc: "Â",
  Atilde: "Ã",
  Auml: "Ä",
  Aring: "Å",
  AElig: "Æ",
  Ccedil: "Ç",
  Egrave: "È",
  Eacute: "É",
  Ecirc: "Ê",
  Euml: "Ë",
  Igrave: "Ì",
  Iacute: "Í",
  Icirc: "Î",
  Iuml: "Ï",
  ETH: "Ð",
  Ntilde: "Ñ",
  Ograve: "Ò",
  Oacute: "Ó",
  Ocirc: "Ô",
  Otilde: "Õ",
  Ouml: "Ö",
  times: "×",
  Oslash: "Ø",
  Ugrave: "Ù",
  Uacute: "Ú",
  Ucirc: "Û",
  Uuml: "Ü",
  Yacute: "Ý",
  THORN: "Þ",
  szlig: "ß",
  agrave: "à",
  aacute: "á",
  acirc: "â",
  atilde: "ã",
  auml: "ä",
  aring: "å",
  aelig: "æ",
  ccedil: "ç",
  egrave: "è",
  eacute: "é",
  ecirc: "ê",
  euml: "ë",
  igrave: "ì",
  iacute: "í",
  icirc: "î",
  iuml: "ï",
  eth: "ð",
  ntilde: "ñ",
  ograve: "ò",
  oacute: "ó",
  ocirc: "ô",
  otilde: "õ",
  ouml: "ö",
  divide: "÷",
  oslash: "ø",
  ugrave: "ù",
  uacute: "ú",
  ucirc: "û",
  uuml: "ü",
  yacute: "ý",
  thorn: "þ",
  yuml: "ÿ",
  fnof: "ƒ",
  Alpha: "Α",
  Beta: "Β",
  Gamma: "Γ",
  Delta: "Δ",
  Epsilon: "Ε",
  Zeta: "Ζ",
  Eta: "Η",
  Theta: "Θ",
  Iota: "Ι",
  Kappa: "Κ",
  Lambda: "Λ",
  Mu: "Μ",
  Nu: "Ν",
  Xi: "Ξ",
  Omicron: "Ο",
  Pi: "Π",
  Rho: "Ρ",
  Sigma: "Σ",
  Tau: "Τ",
  Upsilon: "Υ",
  Phi: "Φ",
  Chi: "Χ",
  Psi: "Ψ",
  Omega: "Ω",
  alpha: "α",
  beta: "β",
  gamma: "γ",
  delta: "δ",
  epsilon: "ε",
  zeta: "ζ",
  eta: "η",
  theta: "θ",
  iota: "ι",
  kappa: "κ",
  lambda: "λ",
  mu: "μ",
  nu: "ν",
  xi: "ξ",
  omicron: "ο",
  pi: "π",
  rho: "ρ",
  sigmaf: "ς",
  sigma: "σ",
  tau: "τ",
  upsilon: "υ",
  phi: "φ",
  chi: "χ",
  psi: "ψ",
  omega: "ω",
  thetasym: "ϑ",
  upsih: "ϒ",
  piv: "ϖ",
  bull: "•",
  hellip: "…",
  prime: "′",
  Prime: "″",
  oline: "‾",
  frasl: "⁄",
  weierp: "℘",
  image: "ℑ",
  real: "ℜ",
  trade: "™",
  alefsym: "ℵ",
  larr: "←",
  uarr: "↑",
  rarr: "→",
  darr: "↓",
  harr: "↔",
  crarr: "↵",
  lArr: "⇐",
  uArr: "⇑",
  rArr: "⇒",
  dArr: "⇓",
  hArr: "⇔",
  forall: "∀",
  part: "∂",
  exist: "∃",
  empty: "∅",
  nabla: "∇",
  isin: "∈",
  notin: "∉",
  ni: "∋",
  prod: "∏",
  sum: "∑",
  minus: "−",
  lowast: "∗",
  radic: "√",
  prop: "∝",
  infin: "∞",
  ang: "∠",
  and: "∧",
  or: "∨",
  cap: "∩",
  cup: "∪",
  int: "∫",
  there4: "∴",
  sim: "∼",
  cong: "≅",
  asymp: "≈",
  ne: "≠",
  equiv: "≡",
  le: "≤",
  ge: "≥",
  sub: "⊂",
  sup: "⊃",
  nsub: "⊄",
  sube: "⊆",
  supe: "⊇",
  oplus: "⊕",
  otimes: "⊗",
  perp: "⊥",
  sdot: "⋅",
  lceil: "⌈",
  rceil: "⌉",
  lfloor: "⌊",
  rfloor: "⌋",
  lang: "〈",
  rang: "〉",
  loz: "◊",
  spades: "♠",
  clubs: "♣",
  hearts: "♥",
  diams: "♦",
  quot: '"',
  amp: "&",
  lt: "<",
  gt: ">",
  OElig: "Œ",
  oelig: "œ",
  Scaron: "Š",
  scaron: "š",
  Yuml: "Ÿ",
  circ: "ˆ",
  tilde: "˜",
  ensp: " ",
  emsp: " ",
  thinsp: " ",
  zwnj: "‌",
  zwj: "‍",
  lrm: "‎",
  rlm: "‏",
  ndash: "–",
  mdash: "—",
  lsquo: "‘",
  rsquo: "’",
  sbquo: "‚",
  ldquo: "“",
  rdquo: "”",
  bdquo: "„",
  dagger: "†",
  Dagger: "‡",
  permil: "‰",
  lsaquo: "‹",
  rsaquo: "›",
  euro: "€"
}, A0 = [
  "cent",
  "copy",
  "divide",
  "gt",
  "lt",
  "not",
  "para",
  "times"
], ii = {}.hasOwnProperty, Gn = {};
let vt;
for (vt in An)
  ii.call(An, vt) && (Gn[An[vt]] = vt);
const y0 = /[^\dA-Za-z]/;
function C0(e, t, n, r) {
  const s = String.fromCharCode(e);
  if (ii.call(Gn, s)) {
    const i = Gn[s], u = "&" + i;
    return n && _0.includes(i) && !A0.includes(i) && (!r || t && t !== 61 && y0.test(String.fromCharCode(t))) ? u : u + ";";
  }
  return "";
}
function N0(e, t, n) {
  let r = E0(e, t, n.omitOptionalSemicolons), s;
  if ((n.useNamedReferences || n.useShortestReferences) && (s = C0(
    e,
    t,
    n.omitOptionalSemicolons,
    n.attribute
  )), (n.useShortestReferences || !s) && n.useShortestReferences) {
    const i = T0(e, t, n.omitOptionalSemicolons);
    i.length < r.length && (r = i);
  }
  return s && (!n.useShortestReferences || s.length < r.length) ? s : r;
}
function Fe(e, t) {
  return f0(e, Object.assign({ format: N0 }, t));
}
const I0 = /^>|^->|<!--|-->|--!>|<!-$/g, x0 = [">"], S0 = ["<", ">"];
function w0(e, t, n, r) {
  return r.settings.bogusComments ? "<?" + Fe(
    e.value,
    Object.assign({}, r.settings.characterReferences, {
      subset: x0
    })
  ) + ">" : "<!--" + e.value.replace(I0, s) + "-->";
  function s(i) {
    return Fe(
      i,
      Object.assign({}, r.settings.characterReferences, {
        subset: S0
      })
    );
  }
}
function R0(e, t, n, r) {
  return "<!" + (r.settings.upperDoctype ? "DOCTYPE" : "doctype") + (r.settings.tightDoctype ? "" : " ") + "html>";
}
function _a(e, t) {
  const n = String(e);
  if (typeof t != "string")
    throw new TypeError("Expected character");
  let r = 0, s = n.indexOf(t);
  for (; s !== -1; )
    r++, s = n.indexOf(t, s + t.length);
  return r;
}
const L0 = /[ \t\n\f\r]/g;
function Se(e) {
  return typeof e == "object" ? e.type === "text" ? Aa(e.value) : !1 : Aa(e);
}
function Aa(e) {
  return e.replace(L0, "") === "";
}
const B = oi(1), ui = oi(-1), v0 = [];
function oi(e) {
  return t;
  function t(n, r, s) {
    const i = n ? n.children : v0;
    let u = (r || 0) + e, c = i[u];
    if (!s)
      for (; c && Se(c); )
        u += e, c = i[u];
    return c;
  }
}
const O0 = {}.hasOwnProperty;
function ci(e) {
  return t;
  function t(n, r, s) {
    return O0.call(e, n.tagName) && e[n.tagName](n, r, s);
  }
}
const lr = ci({
  body: D0,
  caption: yn,
  colgroup: yn,
  dd: B0,
  dt: U0,
  head: yn,
  html: k0,
  li: M0,
  optgroup: H0,
  option: F0,
  p: P0,
  rp: ya,
  rt: ya,
  tbody: Y0,
  td: Ca,
  tfoot: q0,
  th: Ca,
  thead: $0,
  tr: z0
});
function yn(e, t, n) {
  const r = B(n, t, !0);
  return !r || r.type !== "comment" && !(r.type === "text" && Se(r.value.charAt(0)));
}
function k0(e, t, n) {
  const r = B(n, t);
  return !r || r.type !== "comment";
}
function D0(e, t, n) {
  const r = B(n, t);
  return !r || r.type !== "comment";
}
function P0(e, t, n) {
  const r = B(n, t);
  return r ? r.type === "element" && (r.tagName === "address" || r.tagName === "article" || r.tagName === "aside" || r.tagName === "blockquote" || r.tagName === "details" || r.tagName === "div" || r.tagName === "dl" || r.tagName === "fieldset" || r.tagName === "figcaption" || r.tagName === "figure" || r.tagName === "footer" || r.tagName === "form" || r.tagName === "h1" || r.tagName === "h2" || r.tagName === "h3" || r.tagName === "h4" || r.tagName === "h5" || r.tagName === "h6" || r.tagName === "header" || r.tagName === "hgroup" || r.tagName === "hr" || r.tagName === "main" || r.tagName === "menu" || r.tagName === "nav" || r.tagName === "ol" || r.tagName === "p" || r.tagName === "pre" || r.tagName === "section" || r.tagName === "table" || r.tagName === "ul") : !n || // Confusing parent.
  !(n.type === "element" && (n.tagName === "a" || n.tagName === "audio" || n.tagName === "del" || n.tagName === "ins" || n.tagName === "map" || n.tagName === "noscript" || n.tagName === "video"));
}
function M0(e, t, n) {
  const r = B(n, t);
  return !r || r.type === "element" && r.tagName === "li";
}
function U0(e, t, n) {
  const r = B(n, t);
  return !!(r && r.type === "element" && (r.tagName === "dt" || r.tagName === "dd"));
}
function B0(e, t, n) {
  const r = B(n, t);
  return !r || r.type === "element" && (r.tagName === "dt" || r.tagName === "dd");
}
function ya(e, t, n) {
  const r = B(n, t);
  return !r || r.type === "element" && (r.tagName === "rp" || r.tagName === "rt");
}
function H0(e, t, n) {
  const r = B(n, t);
  return !r || r.type === "element" && r.tagName === "optgroup";
}
function F0(e, t, n) {
  const r = B(n, t);
  return !r || r.type === "element" && (r.tagName === "option" || r.tagName === "optgroup");
}
function $0(e, t, n) {
  const r = B(n, t);
  return !!(r && r.type === "element" && (r.tagName === "tbody" || r.tagName === "tfoot"));
}
function Y0(e, t, n) {
  const r = B(n, t);
  return !r || r.type === "element" && (r.tagName === "tbody" || r.tagName === "tfoot");
}
function q0(e, t, n) {
  return !B(n, t);
}
function z0(e, t, n) {
  const r = B(n, t);
  return !r || r.type === "element" && r.tagName === "tr";
}
function Ca(e, t, n) {
  const r = B(n, t);
  return !r || r.type === "element" && (r.tagName === "td" || r.tagName === "th");
}
const W0 = ci({
  body: Q0,
  colgroup: j0,
  head: G0,
  html: V0,
  tbody: X0
});
function V0(e) {
  const t = B(e, -1);
  return !t || t.type !== "comment";
}
function G0(e) {
  const t = e.children, n = [];
  let r = -1;
  for (; ++r < t.length; ) {
    const s = t[r];
    if (s.type === "element" && (s.tagName === "title" || s.tagName === "base")) {
      if (n.includes(s.tagName))
        return !1;
      n.push(s.tagName);
    }
  }
  return t.length > 0;
}
function Q0(e) {
  const t = B(e, -1, !0);
  return !t || t.type !== "comment" && !(t.type === "text" && Se(t.value.charAt(0))) && !(t.type === "element" && (t.tagName === "meta" || t.tagName === "link" || t.tagName === "script" || t.tagName === "style" || t.tagName === "template"));
}
function j0(e, t, n) {
  const r = ui(n, t), s = B(e, -1, !0);
  return n && r && r.type === "element" && r.tagName === "colgroup" && lr(r, n.children.indexOf(r), n) ? !1 : !!(s && s.type === "element" && s.tagName === "col");
}
function X0(e, t, n) {
  const r = ui(n, t), s = B(e, -1);
  return n && r && r.type === "element" && (r.tagName === "thead" || r.tagName === "tbody") && lr(r, n.children.indexOf(r), n) ? !1 : !!(s && s.type === "element" && s.tagName === "tr");
}
const Ot = {
  // See: <https://html.spec.whatwg.org/#attribute-name-state>.
  name: [
    [`	
\f\r &/=>`.split(""), `	
\f\r "&'/=>\``.split("")],
    [`\0	
\f\r "&'/<=>`.split(""), `\0	
\f\r "&'/<=>\``.split("")]
  ],
  // See: <https://html.spec.whatwg.org/#attribute-value-(unquoted)-state>.
  unquoted: [
    [`	
\f\r &>`.split(""), `\0	
\f\r "&'<=>\``.split("")],
    [`\0	
\f\r "&'<=>\``.split(""), `\0	
\f\r "&'<=>\``.split("")]
  ],
  // See: <https://html.spec.whatwg.org/#attribute-value-(single-quoted)-state>.
  single: [
    ["&'".split(""), "\"&'`".split("")],
    ["\0&'".split(""), "\0\"&'`".split("")]
  ],
  // See: <https://html.spec.whatwg.org/#attribute-value-(double-quoted)-state>.
  double: [
    ['"&'.split(""), "\"&'`".split("")],
    ['\0"&'.split(""), "\0\"&'`".split("")]
  ]
};
function K0(e, t, n, r) {
  const s = r.schema, i = s.space === "svg" ? !1 : r.settings.omitOptionalTags;
  let u = s.space === "svg" ? r.settings.closeEmptyElements : r.settings.voids.includes(e.tagName.toLowerCase());
  const c = [];
  let d;
  s.space === "html" && e.tagName === "svg" && (r.schema = At);
  const f = J0(r, e.properties), p = r.all(
    s.space === "html" && e.tagName === "template" ? e.content : e
  );
  return r.schema = s, p && (u = !1), (f || !i || !W0(e, t, n)) && (c.push("<", e.tagName, f ? " " + f : ""), u && (s.space === "svg" || r.settings.closeSelfClosing) && (d = f.charAt(f.length - 1), (!r.settings.tightSelfClosing || d === "/" || d && d !== '"' && d !== "'") && c.push(" "), c.push("/")), c.push(">")), c.push(p), !u && (!i || !lr(e, t, n)) && c.push("</" + e.tagName + ">"), c.join("");
}
function J0(e, t) {
  const n = [];
  let r = -1, s;
  if (t) {
    for (s in t)
      if (t[s] !== null && t[s] !== void 0) {
        const i = Z0(e, s, t[s]);
        i && n.push(i);
      }
  }
  for (; ++r < n.length; ) {
    const i = e.settings.tightAttributes ? n[r].charAt(n[r].length - 1) : void 0;
    r !== n.length - 1 && i !== '"' && i !== "'" && (n[r] += " ");
  }
  return n.join("");
}
function Z0(e, t, n) {
  const r = ar(e.schema, t), s = e.settings.allowParseErrors && e.schema.space === "html" ? 0 : 1, i = e.settings.allowDangerousCharacters ? 0 : 1;
  let u = e.quote, c;
  if (r.overloadedBoolean && (n === r.attribute || n === "") ? n = !0 : (r.boolean || r.overloadedBoolean && typeof n != "string") && (n = !!n), n == null || n === !1 || typeof n == "number" && Number.isNaN(n))
    return "";
  const d = Fe(
    r.attribute,
    Object.assign({}, e.settings.characterReferences, {
      // Always encode without parse errors in non-HTML.
      subset: Ot.name[s][i]
    })
  );
  return n === !0 || (n = Array.isArray(n) ? (r.commaSeparated ? qo : Wo)(n, {
    padLeft: !e.settings.tightCommaSeparatedLists
  }) : String(n), e.settings.collapseEmptyAttributes && !n) ? d : (e.settings.preferUnquoted && (c = Fe(
    n,
    Object.assign({}, e.settings.characterReferences, {
      attribute: !0,
      subset: Ot.unquoted[s][i]
    })
  )), c !== n && (e.settings.quoteSmart && _a(n, u) > _a(n, e.alternative) && (u = e.alternative), c = u + Fe(
    n,
    Object.assign({}, e.settings.characterReferences, {
      // Always encode without parse errors in non-HTML.
      subset: (u === "'" ? Ot.single : Ot.double)[s][i],
      attribute: !0
    })
  ) + u), d + (c && "=" + c));
}
const eh = ["<", "&"];
function li(e, t, n, r) {
  return n && n.type === "element" && (n.tagName === "script" || n.tagName === "style") ? e.value : Fe(
    e.value,
    Object.assign({}, r.settings.characterReferences, {
      subset: eh
    })
  );
}
function th(e, t, n, r) {
  return r.settings.allowDangerousHtml ? e.value : li(e, t, n, r);
}
function nh(e, t, n, r) {
  return r.all(e);
}
const rh = o0("type", {
  invalid: ah,
  unknown: sh,
  handlers: { comment: w0, doctype: R0, element: K0, raw: th, root: nh, text: li }
});
function ah(e) {
  throw new Error("Expected node, not `" + e + "`");
}
function sh(e) {
  const t = (
    /** @type {Nodes} */
    e
  );
  throw new Error("Cannot compile unknown node `" + t.type + "`");
}
const ih = {}, uh = {}, oh = [];
function ch(e, t) {
  const n = t || ih, r = n.quote || '"', s = r === '"' ? "'" : '"';
  if (r !== '"' && r !== "'")
    throw new Error("Invalid quote `" + r + "`, expected `'` or `\"`");
  return {
    one: lh,
    all: dh,
    settings: {
      omitOptionalTags: n.omitOptionalTags || !1,
      allowParseErrors: n.allowParseErrors || !1,
      allowDangerousCharacters: n.allowDangerousCharacters || !1,
      quoteSmart: n.quoteSmart || !1,
      preferUnquoted: n.preferUnquoted || !1,
      tightAttributes: n.tightAttributes || !1,
      upperDoctype: n.upperDoctype || !1,
      tightDoctype: n.tightDoctype || !1,
      bogusComments: n.bogusComments || !1,
      tightCommaSeparatedLists: n.tightCommaSeparatedLists || !1,
      tightSelfClosing: n.tightSelfClosing || !1,
      collapseEmptyAttributes: n.collapseEmptyAttributes || !1,
      allowDangerousHtml: n.allowDangerousHtml || !1,
      voids: n.voids || u0,
      characterReferences: n.characterReferences || uh,
      closeSelfClosing: n.closeSelfClosing || !1,
      closeEmptyElements: n.closeEmptyElements || !1
    },
    schema: n.space === "svg" ? At : en,
    quote: r,
    alternative: s
  }.one(
    Array.isArray(e) ? { type: "root", children: e } : e,
    void 0,
    void 0
  );
}
function lh(e, t, n) {
  return rh(e, t, n, this);
}
function dh(e) {
  const t = [], n = e && e.children || oh;
  let r = -1;
  for (; ++r < n.length; )
    t[r] = this.one(n[r], r, e);
  return t.join("");
}
function hh(e) {
  const t = this, n = { ...t.data("settings"), ...e };
  t.compiler = r;
  function r(s) {
    return ch(s, n);
  }
}
function Na(e) {
  if (e)
    throw e;
}
function fh(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var $t = Object.prototype.hasOwnProperty, di = Object.prototype.toString, Ia = Object.defineProperty, xa = Object.getOwnPropertyDescriptor, Sa = function(t) {
  return typeof Array.isArray == "function" ? Array.isArray(t) : di.call(t) === "[object Array]";
}, wa = function(t) {
  if (!t || di.call(t) !== "[object Object]")
    return !1;
  var n = $t.call(t, "constructor"), r = t.constructor && t.constructor.prototype && $t.call(t.constructor.prototype, "isPrototypeOf");
  if (t.constructor && !n && !r)
    return !1;
  var s;
  for (s in t)
    ;
  return typeof s > "u" || $t.call(t, s);
}, Ra = function(t, n) {
  Ia && n.name === "__proto__" ? Ia(t, n.name, {
    enumerable: !0,
    configurable: !0,
    value: n.newValue,
    writable: !0
  }) : t[n.name] = n.newValue;
}, La = function(t, n) {
  if (n === "__proto__")
    if ($t.call(t, n)) {
      if (xa)
        return xa(t, n).value;
    } else
      return;
  return t[n];
}, ph = function e() {
  var t, n, r, s, i, u, c = arguments[0], d = 1, f = arguments.length, p = !1;
  for (typeof c == "boolean" && (p = c, c = arguments[1] || {}, d = 2), (c == null || typeof c != "object" && typeof c != "function") && (c = {}); d < f; ++d)
    if (t = arguments[d], t != null)
      for (n in t)
        r = La(c, n), s = La(t, n), c !== s && (p && s && (wa(s) || (i = Sa(s))) ? (i ? (i = !1, u = r && Sa(r) ? r : []) : u = r && wa(r) ? r : {}, Ra(c, { name: n, newValue: e(p, u, s) })) : typeof s < "u" && Ra(c, { name: n, newValue: s }));
  return c;
};
const Cn = /* @__PURE__ */ fh(ph);
function Qn(e) {
  if (typeof e != "object" || e === null)
    return !1;
  const t = Object.getPrototypeOf(e);
  return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e);
}
function mh() {
  const e = [], t = { run: n, use: r };
  return t;
  function n(...s) {
    let i = -1;
    const u = s.pop();
    if (typeof u != "function")
      throw new TypeError("Expected function as last argument, not " + u);
    c(null, ...s);
    function c(d, ...f) {
      const p = e[++i];
      let b = -1;
      if (d) {
        u(d);
        return;
      }
      for (; ++b < s.length; )
        (f[b] === null || f[b] === void 0) && (f[b] = s[b]);
      s = f, p ? bh(p, c)(...f) : u(null, ...f);
    }
  }
  function r(s) {
    if (typeof s != "function")
      throw new TypeError(
        "Expected `middelware` to be a function, not " + s
      );
    return e.push(s), t;
  }
}
function bh(e, t) {
  let n;
  return r;
  function r(...u) {
    const c = e.length > u.length;
    let d;
    c && u.push(s);
    try {
      d = e.apply(this, u);
    } catch (f) {
      const p = (
        /** @type {Error} */
        f
      );
      if (c && n)
        throw p;
      return s(p);
    }
    c || (d && d.then && typeof d.then == "function" ? d.then(i, s) : d instanceof Error ? s(d) : i(d));
  }
  function s(u, ...c) {
    n || (n = !0, t(u, ...c));
  }
  function i(u) {
    s(null, u);
  }
}
const Eh = (
  /**
   * @type {new <Parameters extends Array<unknown>, Result>(property: string | symbol) => (...parameters: Parameters) => Result}
   */
  /** @type {unknown} */
  /**
   * @this {Function}
   * @param {string | symbol} property
   * @returns {(...parameters: Array<unknown>) => unknown}
   */
  function(e) {
    const r = (
      /** @type {Record<string | symbol, Function>} */
      // Prototypes do exist.
      // type-coverage:ignore-next-line
      this.constructor.prototype
    ), s = r[e], i = function() {
      return s.apply(i, arguments);
    };
    return Object.setPrototypeOf(i, r), i;
  }
), gh = {}.hasOwnProperty;
class dr extends Eh {
  /**
   * Create a processor.
   */
  constructor() {
    super("copy"), this.Compiler = void 0, this.Parser = void 0, this.attachers = [], this.compiler = void 0, this.freezeIndex = -1, this.frozen = void 0, this.namespace = {}, this.parser = void 0, this.transformers = mh();
  }
  /**
   * Copy a processor.
   *
   * @deprecated
   *   This is a private internal method and should not be used.
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   New *unfrozen* processor ({@linkcode Processor}) that is
   *   configured to work the same as its ancestor.
   *   When the descendant processor is configured in the future it does not
   *   affect the ancestral processor.
   */
  copy() {
    const t = (
      /** @type {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>} */
      new dr()
    );
    let n = -1;
    for (; ++n < this.attachers.length; ) {
      const r = this.attachers[n];
      t.use(...r);
    }
    return t.data(Cn(!0, {}, this.namespace)), t;
  }
  /**
   * Configure the processor with info available to all plugins.
   * Information is stored in an object.
   *
   * Typically, options can be given to a specific plugin, but sometimes it
   * makes sense to have information shared with several plugins.
   * For example, a list of HTML elements that are self-closing, which is
   * needed during all phases.
   *
   * > **Note**: setting information cannot occur on *frozen* processors.
   * > Call the processor first to create a new unfrozen processor.
   *
   * > **Note**: to register custom data in TypeScript, augment the
   * > {@linkcode Data} interface.
   *
   * @example
   *   This example show how to get and set info:
   *
   *   ```js
   *   import {unified} from 'unified'
   *
   *   const processor = unified().data('alpha', 'bravo')
   *
   *   processor.data('alpha') // => 'bravo'
   *
   *   processor.data() // => {alpha: 'bravo'}
   *
   *   processor.data({charlie: 'delta'})
   *
   *   processor.data() // => {charlie: 'delta'}
   *   ```
   *
   * @template {keyof Data} Key
   *
   * @overload
   * @returns {Data}
   *
   * @overload
   * @param {Data} dataset
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {Key} key
   * @returns {Data[Key]}
   *
   * @overload
   * @param {Key} key
   * @param {Data[Key]} value
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @param {Data | Key} [key]
   *   Key to get or set, or entire dataset to set, or nothing to get the
   *   entire dataset (optional).
   * @param {Data[Key]} [value]
   *   Value to set (optional).
   * @returns {unknown}
   *   The current processor when setting, the value at `key` when getting, or
   *   the entire dataset when getting without key.
   */
  data(t, n) {
    return typeof t == "string" ? arguments.length === 2 ? (xn("data", this.frozen), this.namespace[t] = n, this) : gh.call(this.namespace, t) && this.namespace[t] || void 0 : t ? (xn("data", this.frozen), this.namespace = t, this) : this.namespace;
  }
  /**
   * Freeze a processor.
   *
   * Frozen processors are meant to be extended and not to be configured
   * directly.
   *
   * When a processor is frozen it cannot be unfrozen.
   * New processors working the same way can be created by calling the
   * processor.
   *
   * It’s possible to freeze processors explicitly by calling `.freeze()`.
   * Processors freeze automatically when `.parse()`, `.run()`, `.runSync()`,
   * `.stringify()`, `.process()`, or `.processSync()` are called.
   *
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   The current processor.
   */
  freeze() {
    if (this.frozen)
      return this;
    const t = (
      /** @type {Processor} */
      /** @type {unknown} */
      this
    );
    for (; ++this.freezeIndex < this.attachers.length; ) {
      const [n, ...r] = this.attachers[this.freezeIndex];
      if (r[0] === !1)
        continue;
      r[0] === !0 && (r[0] = void 0);
      const s = n.call(t, ...r);
      typeof s == "function" && this.transformers.use(s);
    }
    return this.frozen = !0, this.freezeIndex = Number.POSITIVE_INFINITY, this;
  }
  /**
   * Parse text to a syntax tree.
   *
   * > **Note**: `parse` freezes the processor if not already *frozen*.
   *
   * > **Note**: `parse` performs the parse phase, not the run phase or other
   * > phases.
   *
   * @param {Compatible | undefined} [file]
   *   file to parse (optional); typically `string` or `VFile`; any value
   *   accepted as `x` in `new VFile(x)`.
   * @returns {ParseTree extends undefined ? Node : ParseTree}
   *   Syntax tree representing `file`.
   */
  parse(t) {
    this.freeze();
    const n = kt(t), r = this.parser || this.Parser;
    return Nn("parse", r), r(String(n), n);
  }
  /**
   * Process the given file as configured on the processor.
   *
   * > **Note**: `process` freezes the processor if not already *frozen*.
   *
   * > **Note**: `process` performs the parse, run, and stringify phases.
   *
   * @overload
   * @param {Compatible | undefined} file
   * @param {ProcessCallback<VFileWithOutput<CompileResult>>} done
   * @returns {undefined}
   *
   * @overload
   * @param {Compatible | undefined} [file]
   * @returns {Promise<VFileWithOutput<CompileResult>>}
   *
   * @param {Compatible | undefined} [file]
   *   File (optional); typically `string` or `VFile`]; any value accepted as
   *   `x` in `new VFile(x)`.
   * @param {ProcessCallback<VFileWithOutput<CompileResult>> | undefined} [done]
   *   Callback (optional).
   * @returns {Promise<VFile> | undefined}
   *   Nothing if `done` is given.
   *   Otherwise a promise, rejected with a fatal error or resolved with the
   *   processed file.
   *
   *   The parsed, transformed, and compiled value is available at
   *   `file.value` (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most
   *   > compilers return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  process(t, n) {
    const r = this;
    return this.freeze(), Nn("process", this.parser || this.Parser), In("process", this.compiler || this.Compiler), n ? s(void 0, n) : new Promise(s);
    function s(i, u) {
      const c = kt(t), d = (
        /** @type {HeadTree extends undefined ? Node : HeadTree} */
        /** @type {unknown} */
        r.parse(c)
      );
      r.run(d, c, function(p, b, y) {
        if (p || !b || !y)
          return f(p);
        const T = (
          /** @type {CompileTree extends undefined ? Node : CompileTree} */
          /** @type {unknown} */
          b
        ), C = r.stringify(T, y);
        Ah(C) ? y.value = C : y.result = C, f(
          p,
          /** @type {VFileWithOutput<CompileResult>} */
          y
        );
      });
      function f(p, b) {
        p || !b ? u(p) : i ? i(b) : n(void 0, b);
      }
    }
  }
  /**
   * Process the given file as configured on the processor.
   *
   * An error is thrown if asynchronous transforms are configured.
   *
   * > **Note**: `processSync` freezes the processor if not already *frozen*.
   *
   * > **Note**: `processSync` performs the parse, run, and stringify phases.
   *
   * @param {Compatible | undefined} [file]
   *   File (optional); typically `string` or `VFile`; any value accepted as
   *   `x` in `new VFile(x)`.
   * @returns {VFileWithOutput<CompileResult>}
   *   The processed file.
   *
   *   The parsed, transformed, and compiled value is available at
   *   `file.value` (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most
   *   > compilers return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  processSync(t) {
    let n = !1, r;
    return this.freeze(), Nn("processSync", this.parser || this.Parser), In("processSync", this.compiler || this.Compiler), this.process(t, s), Oa("processSync", "process", n), r;
    function s(i, u) {
      n = !0, Na(i), r = u;
    }
  }
  /**
   * Run *transformers* on a syntax tree.
   *
   * > **Note**: `run` freezes the processor if not already *frozen*.
   *
   * > **Note**: `run` performs the run phase, not other phases.
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
   * @returns {undefined}
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {Compatible | undefined} file
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
   * @returns {undefined}
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {Compatible | undefined} [file]
   * @returns {Promise<TailTree extends undefined ? Node : TailTree>}
   *
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   *   Tree to transform and inspect.
   * @param {(
   *   RunCallback<TailTree extends undefined ? Node : TailTree> |
   *   Compatible
   * )} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} [done]
   *   Callback (optional).
   * @returns {Promise<TailTree extends undefined ? Node : TailTree> | undefined}
   *   Nothing if `done` is given.
   *   Otherwise, a promise rejected with a fatal error or resolved with the
   *   transformed tree.
   */
  run(t, n, r) {
    va(t), this.freeze();
    const s = this.transformers;
    return !r && typeof n == "function" && (r = n, n = void 0), r ? i(void 0, r) : new Promise(i);
    function i(u, c) {
      const d = kt(n);
      s.run(t, d, f);
      function f(p, b, y) {
        const T = (
          /** @type {TailTree extends undefined ? Node : TailTree} */
          b || t
        );
        p ? c(p) : u ? u(T) : r(void 0, T, y);
      }
    }
  }
  /**
   * Run *transformers* on a syntax tree.
   *
   * An error is thrown if asynchronous transforms are configured.
   *
   * > **Note**: `runSync` freezes the processor if not already *frozen*.
   *
   * > **Note**: `runSync` performs the run phase, not other phases.
   *
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   *   Tree to transform and inspect.
   * @param {Compatible | undefined} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @returns {TailTree extends undefined ? Node : TailTree}
   *   Transformed tree.
   */
  runSync(t, n) {
    let r = !1, s;
    return this.run(t, n, i), Oa("runSync", "run", r), s;
    function i(u, c) {
      Na(u), s = c, r = !0;
    }
  }
  /**
   * Compile a syntax tree.
   *
   * > **Note**: `stringify` freezes the processor if not already *frozen*.
   *
   * > **Note**: `stringify` performs the stringify phase, not the run phase
   * > or other phases.
   *
   * @param {CompileTree extends undefined ? Node : CompileTree} tree
   *   Tree to compile.
   * @param {Compatible | undefined} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @returns {CompileResult extends undefined ? Value : CompileResult}
   *   Textual representation of the tree (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most compilers
   *   > return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  stringify(t, n) {
    this.freeze();
    const r = kt(n), s = this.compiler || this.Compiler;
    return In("stringify", s), va(t), s(t, r);
  }
  /**
   * Configure the processor to use a plugin, a list of usable values, or a
   * preset.
   *
   * If the processor is already using a plugin, the previous plugin
   * configuration is changed based on the options that are passed in.
   * In other words, the plugin is not added a second time.
   *
   * > **Note**: `use` cannot be called on *frozen* processors.
   * > Call the processor first to create a new unfrozen processor.
   *
   * @example
   *   There are many ways to pass plugins to `.use()`.
   *   This example gives an overview:
   *
   *   ```js
   *   import {unified} from 'unified'
   *
   *   unified()
   *     // Plugin with options:
   *     .use(pluginA, {x: true, y: true})
   *     // Passing the same plugin again merges configuration (to `{x: true, y: false, z: true}`):
   *     .use(pluginA, {y: false, z: true})
   *     // Plugins:
   *     .use([pluginB, pluginC])
   *     // Two plugins, the second with options:
   *     .use([pluginD, [pluginE, {}]])
   *     // Preset with plugins and settings:
   *     .use({plugins: [pluginF, [pluginG, {}]], settings: {position: false}})
   *     // Settings only:
   *     .use({settings: {position: false}})
   *   ```
   *
   * @template {Array<unknown>} [Parameters=[]]
   * @template {Node | string | undefined} [Input=undefined]
   * @template [Output=Input]
   *
   * @overload
   * @param {Preset | null | undefined} [preset]
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {PluggableList} list
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {Plugin<Parameters, Input, Output>} plugin
   * @param {...(Parameters | [boolean])} parameters
   * @returns {UsePlugin<ParseTree, HeadTree, TailTree, CompileTree, CompileResult, Input, Output>}
   *
   * @param {PluggableList | Plugin | Preset | null | undefined} value
   *   Usable value.
   * @param {...unknown} parameters
   *   Parameters, when a plugin is given as a usable value.
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   Current processor.
   */
  use(t, ...n) {
    const r = this.attachers, s = this.namespace;
    if (xn("use", this.frozen), t != null)
      if (typeof t == "function")
        d(t, n);
      else if (typeof t == "object")
        Array.isArray(t) ? c(t) : u(t);
      else
        throw new TypeError("Expected usable value, not `" + t + "`");
    return this;
    function i(f) {
      if (typeof f == "function")
        d(f, []);
      else if (typeof f == "object")
        if (Array.isArray(f)) {
          const [p, ...b] = (
            /** @type {PluginTuple<Array<unknown>>} */
            f
          );
          d(p, b);
        } else
          u(f);
      else
        throw new TypeError("Expected usable value, not `" + f + "`");
    }
    function u(f) {
      if (!("plugins" in f) && !("settings" in f))
        throw new Error(
          "Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither"
        );
      c(f.plugins), f.settings && (s.settings = Cn(!0, s.settings, f.settings));
    }
    function c(f) {
      let p = -1;
      if (f != null)
        if (Array.isArray(f))
          for (; ++p < f.length; ) {
            const b = f[p];
            i(b);
          }
        else
          throw new TypeError("Expected a list of plugins, not `" + f + "`");
    }
    function d(f, p) {
      let b = -1, y = -1;
      for (; ++b < r.length; )
        if (r[b][0] === f) {
          y = b;
          break;
        }
      if (y === -1)
        r.push([f, ...p]);
      else if (p.length > 0) {
        let [T, ...C] = p;
        const N = r[y][1];
        Qn(N) && Qn(T) && (T = Cn(!0, N, T)), r[y] = [f, T, ...C];
      }
    }
  }
}
const Th = new dr().freeze();
function Nn(e, t) {
  if (typeof t != "function")
    throw new TypeError("Cannot `" + e + "` without `parser`");
}
function In(e, t) {
  if (typeof t != "function")
    throw new TypeError("Cannot `" + e + "` without `compiler`");
}
function xn(e, t) {
  if (t)
    throw new Error(
      "Cannot call `" + e + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`."
    );
}
function va(e) {
  if (!Qn(e) || typeof e.type != "string")
    throw new TypeError("Expected node, got `" + e + "`");
}
function Oa(e, t, n) {
  if (!n)
    throw new Error(
      "`" + e + "` finished async. Use `" + t + "` instead"
    );
}
function kt(e) {
  return _h(e) ? e : new Vn(e);
}
function _h(e) {
  return !!(e && typeof e == "object" && "message" in e && "messages" in e);
}
function Ah(e) {
  return typeof e == "string" || yh(e);
}
function yh(e) {
  return !!(e && typeof e == "object" && "byteLength" in e && "byteOffset" in e);
}
const ka = Th().use(i0).use(hh).freeze(), we = (
  // Note: overloads in JSDoc can’t yet use different `@template`s.
  /**
   * @type {(
   *   (<Condition extends TestFunction>(element: unknown, test: Condition, index?: number | null | undefined, parent?: Parents | null | undefined, context?: unknown) => element is Element & Predicate<Condition, Element>) &
   *   (<Condition extends string>(element: unknown, test: Condition, index?: number | null | undefined, parent?: Parents | null | undefined, context?: unknown) => element is Element & {tagName: Condition}) &
   *   ((element?: null | undefined) => false) &
   *   ((element: unknown, test?: null | undefined, index?: number | null | undefined, parent?: Parents | null | undefined, context?: unknown) => element is Element) &
   *   ((element: unknown, test?: Test, index?: number | null | undefined, parent?: Parents | null | undefined, context?: unknown) => boolean)
   * )}
   */
  /**
   * @param {unknown} [element]
   * @param {Test | undefined} [test]
   * @param {number | null | undefined} [index]
   * @param {Parents | null | undefined} [parent]
   * @param {unknown} [context]
   * @returns {boolean}
   */
  // eslint-disable-next-line max-params
  function(e, t, n, r, s) {
    const i = Nt(t);
    if (n != null && (typeof n != "number" || n < 0 || n === Number.POSITIVE_INFINITY))
      throw new Error("Expected positive finite `index`");
    if (r != null && (!r.type || !r.children))
      throw new Error("Expected valid `parent`");
    if (n == null != (r == null))
      throw new Error("Expected both `index` and `parent`");
    return hi(e) ? i.call(s, e, n, r) : !1;
  }
), Nt = (
  // Note: overloads in JSDoc can’t yet use different `@template`s.
  /**
   * @type {(
   *   (<Condition extends TestFunction>(test: Condition) => (element: unknown, index?: number | null | undefined, parent?: Parents | null | undefined, context?: unknown) => element is Element & Predicate<Condition, Element>) &
   *   (<Condition extends string>(test: Condition) => (element: unknown, index?: number | null | undefined, parent?: Parents | null | undefined, context?: unknown) => element is Element & {tagName: Condition}) &
   *   ((test?: null | undefined) => (element?: unknown, index?: number | null | undefined, parent?: Parents | null | undefined, context?: unknown) => element is Element) &
   *   ((test?: Test) => Check)
   * )}
   */
  /**
   * @param {Test | null | undefined} [test]
   * @returns {Check}
   */
  function(e) {
    if (e == null)
      return Ih;
    if (typeof e == "string")
      return Nh(e);
    if (typeof e == "object")
      return Ch(e);
    if (typeof e == "function")
      return hr(e);
    throw new Error("Expected function, string, or array as `test`");
  }
);
function Ch(e) {
  const t = [];
  let n = -1;
  for (; ++n < e.length; )
    t[n] = Nt(e[n]);
  return hr(r);
  function r(...s) {
    let i = -1;
    for (; ++i < t.length; )
      if (t[i].apply(this, s))
        return !0;
    return !1;
  }
}
function Nh(e) {
  return hr(t);
  function t(n) {
    return n.tagName === e;
  }
}
function hr(e) {
  return t;
  function t(n, r, s) {
    return !!(hi(n) && e.call(
      this,
      n,
      typeof r == "number" ? r : void 0,
      s || void 0
    ));
  }
}
function Ih(e) {
  return !!(e && typeof e == "object" && "type" in e && e.type === "element" && "tagName" in e && typeof e.tagName == "string");
}
function hi(e) {
  return e !== null && typeof e == "object" && "type" in e && "tagName" in e;
}
const fr = Nt(
  /**
   * @param element
   * @returns {element is {tagName: 'audio' | 'canvas' | 'embed' | 'iframe' | 'img' | 'math' | 'object' | 'picture' | 'svg' | 'video'}}
   */
  function(e) {
    return e.tagName === "audio" || e.tagName === "canvas" || e.tagName === "embed" || e.tagName === "iframe" || e.tagName === "img" || e.tagName === "math" || e.tagName === "object" || e.tagName === "picture" || e.tagName === "svg" || e.tagName === "video";
  }
), xh = {}.hasOwnProperty;
function Sh(e, t) {
  const n = e.type === "element" && xh.call(e.properties, t) && e.properties[t];
  return n != null && n !== !1;
}
const wh = /* @__PURE__ */ new Set(["pingback", "prefetch", "stylesheet"]);
function Rh(e) {
  if (e.type !== "element" || e.tagName !== "link")
    return !1;
  if (e.properties.itemProp)
    return !0;
  const t = e.properties.rel;
  let n = -1;
  if (!Array.isArray(t) || t.length === 0)
    return !1;
  for (; ++n < t.length; )
    if (!wh.has(String(t[n])))
      return !1;
  return !0;
}
const Lh = Nt([
  "a",
  "abbr",
  // `area` is in fact only phrasing if it is inside a `map` element.
  // However, since `area`s are required to be inside a `map` element, and it’s
  // a rather involved check, it’s ignored here for now.
  "area",
  "b",
  "bdi",
  "bdo",
  "br",
  "button",
  "cite",
  "code",
  "data",
  "datalist",
  "del",
  "dfn",
  "em",
  "i",
  "input",
  "ins",
  "kbd",
  "keygen",
  "label",
  "map",
  "mark",
  "meter",
  "noscript",
  "output",
  "progress",
  "q",
  "ruby",
  "s",
  "samp",
  "script",
  "select",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "template",
  "textarea",
  "time",
  "u",
  "var",
  "wbr"
]), vh = Nt("meta");
function Oh(e) {
  return !!(e.type === "text" || Lh(e) || fr(e) || Rh(e) || vh(e) && Sh(e, "itemProp"));
}
const kh = [
  "pre",
  "script",
  "style",
  "textarea"
], pr = (
  // Note: overloads in JSDoc can’t yet use different `@template`s.
  /**
   * @type {(
   *   (<Condition extends string>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & {type: Condition}) &
   *   (<Condition extends Props>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Condition) &
   *   (<Condition extends TestFunction>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Predicate<Condition, Node>) &
   *   ((test?: null | undefined) => (node?: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node) &
   *   ((test?: Test) => Check)
   * )}
   */
  /**
   * @param {Test} [test]
   * @returns {Check}
   */
  function(e) {
    if (e == null)
      return Uh;
    if (typeof e == "function")
      return un(e);
    if (typeof e == "object")
      return Array.isArray(e) ? Dh(e) : Ph(e);
    if (typeof e == "string")
      return Mh(e);
    throw new Error("Expected function, string, or object as test");
  }
);
function Dh(e) {
  const t = [];
  let n = -1;
  for (; ++n < e.length; )
    t[n] = pr(e[n]);
  return un(r);
  function r(...s) {
    let i = -1;
    for (; ++i < t.length; )
      if (t[i].apply(this, s))
        return !0;
    return !1;
  }
}
function Ph(e) {
  const t = (
    /** @type {Record<string, unknown>} */
    e
  );
  return un(n);
  function n(r) {
    const s = (
      /** @type {Record<string, unknown>} */
      /** @type {unknown} */
      r
    );
    let i;
    for (i in e)
      if (s[i] !== t[i])
        return !1;
    return !0;
  }
}
function Mh(e) {
  return un(t);
  function t(n) {
    return n && n.type === e;
  }
}
function un(e) {
  return t;
  function t(n, r, s) {
    return !!(Bh(n) && e.call(
      this,
      n,
      typeof r == "number" ? r : void 0,
      s || void 0
    ));
  }
}
function Uh() {
  return !0;
}
function Bh(e) {
  return e !== null && typeof e == "object" && "type" in e;
}
const Hh = [
  "address",
  // Flow content.
  "article",
  // Sections and headings.
  "aside",
  // Sections and headings.
  "blockquote",
  // Flow content.
  "body",
  // Page.
  "br",
  // Contribute whitespace intrinsically.
  "caption",
  // Similar to block.
  "center",
  // Flow content, legacy.
  "col",
  // Similar to block.
  "colgroup",
  // Similar to block.
  "dd",
  // Lists.
  "dialog",
  // Flow content.
  "dir",
  // Lists, legacy.
  "div",
  // Flow content.
  "dl",
  // Lists.
  "dt",
  // Lists.
  "figcaption",
  // Flow content.
  "figure",
  // Flow content.
  "footer",
  // Flow content.
  "form",
  // Flow content.
  "h1",
  // Sections and headings.
  "h2",
  // Sections and headings.
  "h3",
  // Sections and headings.
  "h4",
  // Sections and headings.
  "h5",
  // Sections and headings.
  "h6",
  // Sections and headings.
  "head",
  // Page.
  "header",
  // Flow content.
  "hgroup",
  // Sections and headings.
  "hr",
  // Flow content.
  "html",
  // Page.
  "legend",
  // Flow content.
  "li",
  // Block-like.
  "li",
  // Similar to block.
  "listing",
  // Flow content, legacy
  "main",
  // Flow content.
  "menu",
  // Lists.
  "nav",
  // Sections and headings.
  "ol",
  // Lists.
  "optgroup",
  // Similar to block.
  "option",
  // Similar to block.
  "p",
  // Flow content.
  "plaintext",
  // Flow content, legacy
  "pre",
  // Flow content.
  "section",
  // Sections and headings.
  "summary",
  // Similar to block.
  "table",
  // Similar to block.
  "tbody",
  // Similar to block.
  "td",
  // Block-like.
  "td",
  // Similar to block.
  "tfoot",
  // Similar to block.
  "th",
  // Block-like.
  "th",
  // Similar to block.
  "thead",
  // Similar to block.
  "tr",
  // Similar to block.
  "ul",
  // Lists.
  "wbr",
  // Contribute whitespace intrinsically.
  "xmp"
  // Flow content, legacy
], Fh = [
  // Form.
  "button",
  "input",
  "select",
  "textarea"
], $h = [
  "area",
  "base",
  "basefont",
  "dialog",
  "datalist",
  "head",
  "link",
  "meta",
  "noembed",
  "noframes",
  "param",
  "rp",
  "script",
  "source",
  "style",
  "template",
  "track",
  "title"
], Yh = {}, mr = pr(["doctype", "comment"]);
function qh(e) {
  const n = Xh(
    (e || Yh).newlines ? Qh : jh
  );
  return function(r) {
    fi(r, { collapse: n, whitespace: "normal" });
  };
}
function fi(e, t) {
  if ("children" in e) {
    const n = { ...t };
    return (e.type === "root" || bi(e)) && (n.before = !0, n.after = !0), n.whitespace = Kh(e, t), Wh(e, n);
  }
  if (e.type === "text") {
    if (t.whitespace === "normal")
      return zh(e, t);
    t.whitespace === "nowrap" && (e.value = t.collapse(e.value));
  }
  return { ignore: mr(e), stripAtStart: !1, remove: !1 };
}
function zh(e, t) {
  const n = t.collapse(e.value), r = { ignore: !1, stripAtStart: !1, remove: !1 };
  let s = 0, i = n.length;
  return t.before && Da(n.charAt(0)) && s++, s !== i && Da(n.charAt(i - 1)) && (t.after ? i-- : r.stripAtStart = !0), s === i ? r.remove = !0 : e.value = n.slice(s, i), r;
}
function Wh(e, t) {
  let n = t.before;
  const r = t.after, s = e.children;
  let i = s.length, u = -1;
  for (; ++u < i; ) {
    const c = fi(s[u], {
      ...t,
      after: pi(s, u, r),
      before: n
    });
    c.remove ? (s.splice(u, 1), u--, i--) : c.ignore || (n = c.stripAtStart), mi(s[u]) && (n = !1);
  }
  return { ignore: !1, stripAtStart: !!(n || r), remove: !1 };
}
function pi(e, t, n) {
  for (; ++t < e.length; ) {
    const r = e[t];
    let s = Vh(r);
    if (s === void 0 && "children" in r && !Gh(r) && (s = pi(r.children, -1)), typeof s == "boolean")
      return s;
  }
  return n;
}
function Vh(e) {
  if (e.type === "element") {
    if (mi(e))
      return !1;
    if (bi(e))
      return !0;
  } else if (e.type === "text") {
    if (!Se(e))
      return !1;
  } else if (!mr(e))
    return !1;
}
function mi(e) {
  return fr(e) || we(e, Fh);
}
function bi(e) {
  return we(e, Hh);
}
function Gh(e) {
  return !!(e.type === "element" && e.properties.hidden) || mr(e) || we(e, $h);
}
function Da(e) {
  return e === " " || e === `
`;
}
function Qh(e) {
  const t = /\r?\n|\r/.exec(e);
  return t ? t[0] : " ";
}
function jh() {
  return " ";
}
function Xh(e) {
  return t;
  function t(n) {
    return String(n).replace(/[\t\n\v\f\r ]+/g, e);
  }
}
function Kh(e, t) {
  if ("tagName" in e && e.properties)
    switch (e.tagName) {
      case "listing":
      case "plaintext":
      case "script":
      case "style":
      case "xmp":
        return "pre";
      case "nobr":
        return "nowrap";
      case "pre":
        return e.properties.wrap ? "pre-wrap" : "pre";
      case "td":
      case "th":
        return e.properties.noWrap ? "nowrap" : t.whitespace;
      case "textarea":
        return "pre-wrap";
    }
  return t.whitespace;
}
const Ei = [], Jh = !0, Pa = !1, gi = "skip";
function Zh(e, t, n, r) {
  let s;
  typeof t == "function" && typeof n != "function" ? (r = n, n = t) : s = t;
  const i = pr(s), u = r ? -1 : 1;
  c(e, void 0, [])();
  function c(d, f, p) {
    const b = (
      /** @type {Record<string, unknown>} */
      d && typeof d == "object" ? d : {}
    );
    if (typeof b.type == "string") {
      const T = (
        // `hast`
        typeof b.tagName == "string" ? b.tagName : (
          // `xast`
          typeof b.name == "string" ? b.name : void 0
        )
      );
      Object.defineProperty(y, "name", {
        value: "node (" + (d.type + (T ? "<" + T + ">" : "")) + ")"
      });
    }
    return y;
    function y() {
      let T = Ei, C, N, I;
      if ((!t || i(d, f, p[p.length - 1] || void 0)) && (T = ef(n(d, p)), T[0] === Pa))
        return T;
      if ("children" in d && d.children) {
        const x = (
          /** @type {UnistParent} */
          d
        );
        if (x.children && T[0] !== gi)
          for (N = (r ? x.children.length : -1) + u, I = p.concat(x); N > -1 && N < x.children.length; ) {
            const S = x.children[N];
            if (C = c(S, N, I)(), C[0] === Pa)
              return C;
            N = typeof C[1] == "number" ? C[1] : N + u;
          }
      }
      return T;
    }
  }
}
function ef(e) {
  return Array.isArray(e) ? e : typeof e == "number" ? [Jh, e] : e == null ? Ei : [e];
}
const tf = {}, nf = qh({ newlines: !0 });
function Ma(e) {
  const t = e || tf;
  let n = t.indent || 2, r = t.indentInitial;
  return typeof n == "number" && (n = " ".repeat(n)), r == null && (r = !0), function(u) {
    let c;
    nf(u), Zh(u, function(d, f) {
      let p = -1;
      if (!("children" in d))
        return;
      if (we(d, "head") && (c = !0), c && we(d, "body") && (c = void 0), we(d, kh))
        return gi;
      const b = d.children;
      let y = f.length;
      if (b.length === 0 || !Sn(d, c))
        return;
      r || y--;
      let T;
      for (; ++p < b.length; ) {
        const I = b[p];
        (I.type === "text" || I.type === "comment") && (I.value.includes(`
`) && (T = !0), I.value = I.value.replace(
          / *\n/g,
          "$&" + String(n).repeat(y)
        ));
      }
      const C = [];
      let N;
      for (p = -1; ++p < b.length; ) {
        const I = b[p];
        (Sn(I, c) || T && !p) && (s(C, y, I), T = !0), N = I, C.push(I);
      }
      N && (T || Sn(N, c)) && (Se(N) && (C.pop(), N = C[C.length - 1]), s(C, y - 1)), d.children = C;
    });
  };
  function s(u, c, d) {
    const f = u[u.length - 1], p = f && Se(f) ? u[u.length - 2] : f, b = (i(p) && i(d) ? `

` : `
`) + String(n).repeat(Math.max(c, 0));
    f && f.type === "text" ? f.value = Se(f) ? b : f.value + b : u.push({ type: "text", value: b });
  }
  function i(u) {
    return !!(u && u.type === "element" && t.blanks && t.blanks.length > 0 && t.blanks.includes(u.tagName));
  }
}
function Sn(e, t) {
  return e.type === "root" || (e.type === "element" ? t || we(e, "script") || fr(e) || !Oh(e) : !1);
}
const rf = co`*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: \"\"}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:Inter;font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:Fira Code;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}:root,[data-theme]{background-color:var(--fallback-b1,oklch(var(--b1)/1));color:var(--fallback-bc,oklch(var(--bc)/1))}@supports not (color: oklch(0% 0 0)){:root{color-scheme:light;--fallback-p: #491eff;--fallback-pc: #d4dbff;--fallback-s: #ff41c7;--fallback-sc: #fff9fc;--fallback-a: #00cfbd;--fallback-ac: #00100d;--fallback-n: #2b3440;--fallback-nc: #d7dde4;--fallback-b1: #ffffff;--fallback-b2: #e5e6e6;--fallback-b3: #e5e6e6;--fallback-bc: #1f2937;--fallback-in: #00b3f0;--fallback-inc: #000000;--fallback-su: #00ca92;--fallback-suc: #000000;--fallback-wa: #ffc22d;--fallback-wac: #000000;--fallback-er: #ff6f70;--fallback-erc: #000000}@media (prefers-color-scheme: dark){:root{color-scheme:dark;--fallback-p: #7582ff;--fallback-pc: #050617;--fallback-s: #ff71cf;--fallback-sc: #190211;--fallback-a: #00c7b5;--fallback-ac: #000e0c;--fallback-n: #2a323c;--fallback-nc: #a6adbb;--fallback-b1: #1d232a;--fallback-b2: #191e24;--fallback-b3: #15191e;--fallback-bc: #a6adbb;--fallback-in: #00b3f0;--fallback-inc: #000000;--fallback-su: #00ca92;--fallback-suc: #000000;--fallback-wa: #ffc22d;--fallback-wac: #000000;--fallback-er: #ff6f70;--fallback-erc: #000000}}}html{-webkit-tap-highlight-color:transparent}*{scrollbar-color:color-mix(in oklch,currentColor 35%,transparent) transparent}*:hover{scrollbar-color:color-mix(in oklch,currentColor 60%,transparent) transparent}:root{--p: 74.3539% .099369 84.709143;--bc: 83.7925% .007749 264.832992;--pc: 14.8708% .019874 84.709143;--sc: 17.6469% .011411 254.128381;--ac: 16.5517% .020255 230.317893;--inc: 89.9996% .023858 242.74902;--suc: 14.8873% .02544 151.585784;--wac: 17.2112% .034623 91.935651;--erc: 91.7168% .044408 17.584628;--rounded-box: 1rem;--rounded-btn: .5rem;--rounded-badge: 1.9rem;--animation-btn: .25s;--animation-input: .2s;--btn-focus-scale: .95;--border-btn: 1px;--tab-border: 1px;--tab-radius: .5rem;--s: 88.2343% .057057 254.128381;--a: 82.7586% .101277 230.317893;--n: 38.6654% 0 0;--nc: 100% 0 0;--b1: 18.9627% .038744 264.832992;--b2: 30.6997% .052885 257.552181;--b3: 42.4958% .052808 253.972014;--in: 49.9982% .11929 242.74902;--su: 74.4364% .127199 151.585784;--wa: 86.0559% .173115 91.935651;--er: 58.5838% .222042 17.584628}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }.alert{display:grid;width:100%;grid-auto-flow:row;align-content:flex-start;align-items:center;justify-items:center;gap:1rem;text-align:center;border-radius:var(--rounded-box, 1rem);border-width:1px;--tw-border-opacity: 1;border-color:var(--fallback-b2,oklch(var(--b2)/var(--tw-border-opacity)));padding:1rem;--tw-text-opacity: 1;color:var(--fallback-bc,oklch(var(--bc)/var(--tw-text-opacity)));--alert-bg: var(--fallback-b2,oklch(var(--b2)/1));--alert-bg-mix: var(--fallback-b1,oklch(var(--b1)/1));background-color:var(--alert-bg)}@media (min-width: 640px){.alert{grid-auto-flow:column;grid-template-columns:auto minmax(auto,1fr);justify-items:start;text-align:start}}@media (hover:hover){.label a:hover{--tw-text-opacity: 1;color:var(--fallback-bc,oklch(var(--bc)/var(--tw-text-opacity)))}.menu li>*:not(ul,.menu-title,details,.btn):active,.menu li>*:not(ul,.menu-title,details,.btn).active,.menu li>details>summary:active{--tw-bg-opacity: 1;background-color:var(--fallback-n,oklch(var(--n)/var(--tw-bg-opacity)));--tw-text-opacity: 1;color:var(--fallback-nc,oklch(var(--nc)/var(--tw-text-opacity)))}.table tr.hover:hover,.table tr.hover:nth-child(2n):hover{--tw-bg-opacity: 1;background-color:var(--fallback-b2,oklch(var(--b2)/var(--tw-bg-opacity)))}.table-zebra tr.hover:hover,.table-zebra tr.hover:nth-child(2n):hover{--tw-bg-opacity: 1;background-color:var(--fallback-b3,oklch(var(--b3)/var(--tw-bg-opacity)))}}.btn{display:inline-flex;height:3rem;min-height:3rem;flex-shrink:0;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none;flex-wrap:wrap;align-items:center;justify-content:center;border-radius:var(--rounded-btn, .5rem);border-color:transparent;border-color:oklch(var(--btn-color, var(--b2)) / var(--tw-border-opacity));padding-left:1rem;padding-right:1rem;text-align:center;font-size:.875rem;line-height:1em;gap:.5rem;font-weight:600;text-decoration-line:none;transition-duration:.2s;transition-timing-function:cubic-bezier(0,0,.2,1);border-width:var(--border-btn, 1px);transition-property:color,background-color,border-color,opacity,box-shadow,transform;--tw-text-opacity: 1;color:var(--fallback-bc,oklch(var(--bc)/var(--tw-text-opacity)));--tw-shadow: 0 1px 2px 0 rgb(0 0 0 / .05);--tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow);outline-color:var(--fallback-bc,oklch(var(--bc)/1));background-color:oklch(var(--btn-color, var(--b2)) / var(--tw-bg-opacity));--tw-bg-opacity: 1;--tw-border-opacity: 1}.btn-disabled,.btn[disabled],.btn:disabled{pointer-events:none}:where(.btn:is(input[type=checkbox])),:where(.btn:is(input[type=radio])){width:auto;-webkit-appearance:none;-moz-appearance:none;appearance:none}.btn:is(input[type=checkbox]):after,.btn:is(input[type=radio]):after{--tw-content: attr(aria-label);content:var(--tw-content)}.card{position:relative;display:flex;flex-direction:column;border-radius:var(--rounded-box, 1rem)}.card:focus{outline:2px solid transparent;outline-offset:2px}.card-body{display:flex;flex:1 1 auto;flex-direction:column;padding:var(--padding-card, 2rem);gap:.5rem}.card-body :where(p){flex-grow:1}.card figure{display:flex;align-items:center;justify-content:center}.card.image-full{display:grid}.card.image-full:before{position:relative;content:\"\";z-index:10;border-radius:var(--rounded-box, 1rem);--tw-bg-opacity: 1;background-color:var(--fallback-n,oklch(var(--n)/var(--tw-bg-opacity)));opacity:.75}.card.image-full:before,.card.image-full>*{grid-column-start:1;grid-row-start:1}.card.image-full>figure img{height:100%;-o-object-fit:cover;object-fit:cover}.card.image-full>.card-body{position:relative;z-index:20;--tw-text-opacity: 1;color:var(--fallback-nc,oklch(var(--nc)/var(--tw-text-opacity)))}.checkbox{flex-shrink:0;--chkbg: var(--fallback-bc,oklch(var(--bc)/1));--chkfg: var(--fallback-b1,oklch(var(--b1)/1));height:1.5rem;width:1.5rem;cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none;border-radius:var(--rounded-btn, .5rem);border-width:1px;border-color:var(--fallback-bc,oklch(var(--bc)/var(--tw-border-opacity)));--tw-border-opacity: .2}.collapse:not(td):not(tr):not(colgroup){visibility:visible}.collapse{position:relative;display:grid;overflow:hidden;grid-template-rows:auto 0fr;transition:grid-template-rows .2s;width:100%;border-radius:var(--rounded-box, 1rem)}.collapse-title,.collapse>input[type=checkbox],.collapse>input[type=radio],.collapse-content{grid-column-start:1;grid-row-start:1}.collapse>input[type=checkbox],.collapse>input[type=radio]{-webkit-appearance:none;-moz-appearance:none;appearance:none;opacity:0}.collapse-content{visibility:hidden;grid-column-start:1;grid-row-start:2;min-height:0px;transition:visibility .2s;transition:padding .2s ease-out,background-color .2s ease-out;padding-left:1rem;padding-right:1rem;cursor:unset}.collapse[open],.collapse-open,.collapse:focus:not(.collapse-close){grid-template-rows:auto 1fr}.collapse:not(.collapse-close):has(>input[type=checkbox]:checked),.collapse:not(.collapse-close):has(>input[type=radio]:checked){grid-template-rows:auto 1fr}.collapse[open]>.collapse-content,.collapse-open>.collapse-content,.collapse:focus:not(.collapse-close)>.collapse-content,.collapse:not(.collapse-close)>input[type=checkbox]:checked~.collapse-content,.collapse:not(.collapse-close)>input[type=radio]:checked~.collapse-content{visibility:visible;min-height:-moz-fit-content;min-height:fit-content}.diff{position:relative;display:grid;width:100%;overflow:hidden;container-type:inline-size;grid-template-columns:auto 1fr}@media (hover: hover){.btn:hover{--tw-border-opacity: 1;border-color:var(--fallback-b3,oklch(var(--b3)/var(--tw-border-opacity)));--tw-bg-opacity: 1;background-color:var(--fallback-b3,oklch(var(--b3)/var(--tw-bg-opacity)))}@supports (color: color-mix(in oklab,black,black)){.btn:hover{background-color:color-mix(in oklab,oklch(var(--btn-color, var(--b2)) / var(--tw-bg-opacity, 1)) 90%,black);border-color:color-mix(in oklab,oklch(var(--btn-color, var(--b2)) / var(--tw-border-opacity, 1)) 90%,black)}}@supports not (color: oklch(0% 0 0)){.btn:hover{background-color:var(--btn-color, var(--fallback-b2));border-color:var(--btn-color, var(--fallback-b2))}}.btn.glass:hover{--glass-opacity: 25%;--glass-border-opacity: 15%}.btn-outline.btn-primary:hover{--tw-text-opacity: 1;color:var(--fallback-pc,oklch(var(--pc)/var(--tw-text-opacity)))}@supports (color: color-mix(in oklab,black,black)){.btn-outline.btn-primary:hover{background-color:color-mix(in oklab,var(--fallback-p,oklch(var(--p)/1)) 90%,black);border-color:color-mix(in oklab,var(--fallback-p,oklch(var(--p)/1)) 90%,black)}}.btn-disabled:hover,.btn[disabled]:hover,.btn:disabled:hover{--tw-border-opacity: 0;background-color:var(--fallback-n,oklch(var(--n)/var(--tw-bg-opacity)));--tw-bg-opacity: .2;color:var(--fallback-bc,oklch(var(--bc)/var(--tw-text-opacity)));--tw-text-opacity: .2}@supports (color: color-mix(in oklab,black,black)){.btn:is(input[type=checkbox]:checked):hover,.btn:is(input[type=radio]:checked):hover{background-color:color-mix(in oklab,var(--fallback-p,oklch(var(--p)/1)) 90%,black);border-color:color-mix(in oklab,var(--fallback-p,oklch(var(--p)/1)) 90%,black)}}:where(.menu li:not(.menu-title,.disabled)>*:not(ul,details,.menu-title)):not(.active,.btn):hover,:where(.menu li:not(.menu-title,.disabled)>details>summary:not(.menu-title)):not(.active,.btn):hover{cursor:pointer;outline:2px solid transparent;outline-offset:2px}@supports (color: oklch(0% 0 0)){:where(.menu li:not(.menu-title,.disabled)>*:not(ul,details,.menu-title)):not(.active,.btn):hover,:where(.menu li:not(.menu-title,.disabled)>details>summary:not(.menu-title)):not(.active,.btn):hover{background-color:var(--fallback-bc,oklch(var(--bc)/.1))}}}.form-control{display:flex;flex-direction:column}.label{display:flex;-webkit-user-select:none;-moz-user-select:none;user-select:none;align-items:center;justify-content:space-between;padding:.5rem .25rem}.input{flex-shrink:1;-webkit-appearance:none;-moz-appearance:none;appearance:none;height:3rem;padding-left:1rem;padding-right:1rem;font-size:1rem;line-height:2;line-height:1.5rem;border-radius:var(--rounded-btn, .5rem);border-width:1px;border-color:transparent;--tw-bg-opacity: 1;background-color:var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity)))}.input[type=number]::-webkit-inner-spin-button,.input-md[type=number]::-webkit-inner-spin-button{margin-top:-1rem;margin-bottom:-1rem;margin-inline-end:-1rem}.menu{display:flex;flex-direction:column;flex-wrap:wrap;font-size:.875rem;line-height:1.25rem;padding:.5rem}.menu :where(li ul){position:relative;white-space:nowrap;margin-inline-start:1rem;padding-inline-start:.5rem}.menu :where(li:not(.menu-title)>*:not(ul,details,.menu-title,.btn)),.menu :where(li:not(.menu-title)>details>summary:not(.menu-title)){display:grid;grid-auto-flow:column;align-content:flex-start;align-items:center;gap:.5rem;grid-auto-columns:minmax(auto,max-content) auto max-content;-webkit-user-select:none;-moz-user-select:none;user-select:none}.menu li.disabled{cursor:not-allowed;-webkit-user-select:none;-moz-user-select:none;user-select:none;color:var(--fallback-bc,oklch(var(--bc)/.3))}.menu :where(li>.menu-dropdown:not(.menu-dropdown-show)){display:none}:where(.menu li){position:relative;display:flex;flex-shrink:0;flex-direction:column;flex-wrap:wrap;align-items:stretch}:where(.menu li) .badge{justify-self:end}.select{display:inline-flex;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;height:3rem;min-height:3rem;padding-inline-start:1rem;padding-inline-end:2.5rem;font-size:.875rem;line-height:1.25rem;line-height:2;border-radius:var(--rounded-btn, .5rem);border-width:1px;border-color:transparent;--tw-bg-opacity: 1;background-color:var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity)));background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);background-position:calc(100% - 20px) calc(1px + 50%),calc(100% - 16.1px) calc(1px + 50%);background-size:4px 4px,4px 4px;background-repeat:no-repeat}.select[multiple]{height:auto}.table{position:relative;width:100%;border-radius:var(--rounded-box, 1rem);text-align:left;font-size:.875rem;line-height:1.25rem}.table :where(.table-pin-rows thead tr){position:sticky;top:0;z-index:1;--tw-bg-opacity: 1;background-color:var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity)))}.table :where(.table-pin-rows tfoot tr){position:sticky;bottom:0;z-index:1;--tw-bg-opacity: 1;background-color:var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity)))}.table :where(.table-pin-cols tr th){position:sticky;left:0;right:0;--tw-bg-opacity: 1;background-color:var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity)))}.table-zebra tbody tr:nth-child(2n) :where(.table-pin-cols tr th){--tw-bg-opacity: 1;background-color:var(--fallback-b2,oklch(var(--b2)/var(--tw-bg-opacity)))}.toggle{flex-shrink:0;--tglbg: var(--fallback-b1,oklch(var(--b1)/1));--handleoffset: 1.5rem;--handleoffsetcalculator: calc(var(--handleoffset) * -1);--togglehandleborder: 0 0;height:1.5rem;width:3rem;cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none;border-radius:var(--rounded-badge, 1.9rem);border-width:1px;border-color:currentColor;background-color:currentColor;color:var(--fallback-bc,oklch(var(--bc)/.5));transition:background,box-shadow var(--animation-input, .2s) ease-out;box-shadow:var(--handleoffsetcalculator) 0 0 2px var(--tglbg) inset,0 0 0 2px var(--tglbg) inset,var(--togglehandleborder)}.alert-warning{border-color:var(--fallback-wa,oklch(var(--wa)/.2));--tw-text-opacity: 1;color:var(--fallback-wac,oklch(var(--wac)/var(--tw-text-opacity)));--alert-bg: var(--fallback-wa,oklch(var(--wa)/1));--alert-bg-mix: var(--fallback-b1,oklch(var(--b1)/1))}.btm-nav>* .label{font-size:1rem;line-height:1.5rem}@media (prefers-reduced-motion: no-preference){.btn{animation:button-pop var(--animation-btn, .25s) ease-out}}.btn:active:hover,.btn:active:focus{animation:button-pop 0s ease-out;transform:scale(var(--btn-focus-scale, .97))}@supports not (color: oklch(0% 0 0)){.btn{background-color:var(--btn-color, var(--fallback-b2));border-color:var(--btn-color, var(--fallback-b2))}.btn-primary{--btn-color: var(--fallback-p)}}@supports (color: color-mix(in oklab,black,black)){.btn-outline.btn-primary.btn-active{background-color:color-mix(in oklab,var(--fallback-p,oklch(var(--p)/1)) 90%,black);border-color:color-mix(in oklab,var(--fallback-p,oklch(var(--p)/1)) 90%,black)}}.btn:focus-visible{outline-style:solid;outline-width:2px;outline-offset:2px}.btn-primary{--tw-text-opacity: 1;color:var(--fallback-pc,oklch(var(--pc)/var(--tw-text-opacity)));outline-color:var(--fallback-p,oklch(var(--p)/1))}@supports (color: oklch(0% 0 0)){.btn-primary{--btn-color: var(--p)}}.btn.glass{--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow);outline-color:currentColor}.btn.glass.btn-active{--glass-opacity: 25%;--glass-border-opacity: 15%}.btn-outline.btn-primary{--tw-text-opacity: 1;color:var(--fallback-p,oklch(var(--p)/var(--tw-text-opacity)))}.btn-outline.btn-primary.btn-active{--tw-text-opacity: 1;color:var(--fallback-pc,oklch(var(--pc)/var(--tw-text-opacity)))}.btn.btn-disabled,.btn[disabled],.btn:disabled{--tw-border-opacity: 0;background-color:var(--fallback-n,oklch(var(--n)/var(--tw-bg-opacity)));--tw-bg-opacity: .2;color:var(--fallback-bc,oklch(var(--bc)/var(--tw-text-opacity)));--tw-text-opacity: .2}.btn:is(input[type=checkbox]:checked),.btn:is(input[type=radio]:checked){--tw-border-opacity: 1;border-color:var(--fallback-p,oklch(var(--p)/var(--tw-border-opacity)));--tw-bg-opacity: 1;background-color:var(--fallback-p,oklch(var(--p)/var(--tw-bg-opacity)));--tw-text-opacity: 1;color:var(--fallback-pc,oklch(var(--pc)/var(--tw-text-opacity)))}.btn:is(input[type=checkbox]:checked):focus-visible,.btn:is(input[type=radio]:checked):focus-visible{outline-color:var(--fallback-p,oklch(var(--p)/1))}@keyframes button-pop{0%{transform:scale(var(--btn-focus-scale, .98))}40%{transform:scale(1.02)}to{transform:scale(1)}}.card :where(figure:first-child){overflow:hidden;border-start-start-radius:inherit;border-start-end-radius:inherit;border-end-start-radius:unset;border-end-end-radius:unset}.card :where(figure:last-child){overflow:hidden;border-start-start-radius:unset;border-start-end-radius:unset;border-end-start-radius:inherit;border-end-end-radius:inherit}.card:focus-visible{outline:2px solid currentColor;outline-offset:2px}.card.bordered{border-width:1px;--tw-border-opacity: 1;border-color:var(--fallback-b2,oklch(var(--b2)/var(--tw-border-opacity)))}.card.compact .card-body{padding:1rem;font-size:.875rem;line-height:1.25rem}.card-title{display:flex;align-items:center;gap:.5rem;font-size:1.25rem;line-height:1.75rem;font-weight:600}.card.image-full :where(figure){overflow:hidden;border-radius:inherit}.checkbox:focus{box-shadow:none}.checkbox:focus-visible{outline-style:solid;outline-width:2px;outline-offset:2px;outline-color:var(--fallback-bc,oklch(var(--bc)/1))}.checkbox:disabled{border-width:0px;cursor:not-allowed;border-color:transparent;--tw-bg-opacity: 1;background-color:var(--fallback-bc,oklch(var(--bc)/var(--tw-bg-opacity)));opacity:.2}.checkbox:checked,.checkbox[aria-checked=true]{background-repeat:no-repeat;animation:checkmark var(--animation-input, .2s) ease-out;background-color:var(--chkbg);background-image:linear-gradient(-45deg,transparent 65%,var(--chkbg) 65.99%),linear-gradient(45deg,transparent 75%,var(--chkbg) 75.99%),linear-gradient(-45deg,var(--chkbg) 40%,transparent 40.99%),linear-gradient(45deg,var(--chkbg) 30%,var(--chkfg) 30.99%,var(--chkfg) 40%,transparent 40.99%),linear-gradient(-45deg,var(--chkfg) 50%,var(--chkbg) 50.99%)}.checkbox:indeterminate{--tw-bg-opacity: 1;background-color:var(--fallback-bc,oklch(var(--bc)/var(--tw-bg-opacity)));background-repeat:no-repeat;animation:checkmark var(--animation-input, .2s) ease-out;background-image:linear-gradient(90deg,transparent 80%,var(--chkbg) 80%),linear-gradient(-90deg,transparent 80%,var(--chkbg) 80%),linear-gradient(0deg,var(--chkbg) 43%,var(--chkfg) 43%,var(--chkfg) 57%,var(--chkbg) 57%)}@keyframes checkmark{0%{background-position-y:5px}50%{background-position-y:-2px}to{background-position-y:0}}details.collapse{width:100%}details.collapse summary{position:relative;display:block;outline:2px solid transparent;outline-offset:2px}details.collapse summary::-webkit-details-marker{display:none}.collapse:focus-visible{outline-style:solid;outline-width:2px;outline-offset:2px;outline-color:var(--fallback-bc,oklch(var(--bc)/1))}.collapse:has(.collapse-title:focus-visible),.collapse:has(>input[type=checkbox]:focus-visible),.collapse:has(>input[type=radio]:focus-visible){outline-style:solid;outline-width:2px;outline-offset:2px;outline-color:var(--fallback-bc,oklch(var(--bc)/1))}.collapse-arrow>.collapse-title:after{position:absolute;display:block;height:.5rem;width:.5rem;--tw-translate-y: -100%;--tw-rotate: 45deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-timing-function:cubic-bezier(0,0,.2,1);transition-duration:.15s;transition-duration:.2s;top:1.9rem;inset-inline-end:1.4rem;content:\"\";transform-origin:75% 75%;box-shadow:2px 2px;pointer-events:none}.collapse-plus>.collapse-title:after{position:absolute;display:block;height:.5rem;width:.5rem;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-timing-function:cubic-bezier(0,0,.2,1);transition-duration:.3s;top:.9rem;inset-inline-end:1.4rem;content:\"+\";pointer-events:none}.collapse:not(.collapse-open):not(.collapse-close)>input[type=checkbox],.collapse:not(.collapse-open):not(.collapse-close)>input[type=radio]:not(:checked),.collapse:not(.collapse-open):not(.collapse-close)>.collapse-title{cursor:pointer}.collapse:focus:not(.collapse-open):not(.collapse-close):not(.collapse[open])>.collapse-title{cursor:unset}.collapse-title{position:relative}:where(.collapse>input[type=checkbox]),:where(.collapse>input[type=radio]){z-index:1}.collapse-title,:where(.collapse>input[type=checkbox]),:where(.collapse>input[type=radio]){width:100%;padding:1rem;padding-inline-end:3rem;min-height:3.75rem;transition:background-color .2s ease-out}.collapse[open]>:where(.collapse-content),.collapse-open>:where(.collapse-content),.collapse:focus:not(.collapse-close)>:where(.collapse-content),.collapse:not(.collapse-close)>:where(input[type=checkbox]:checked~.collapse-content),.collapse:not(.collapse-close)>:where(input[type=radio]:checked~.collapse-content){padding-bottom:1rem;transition:padding .2s ease-out,background-color .2s ease-out}.collapse[open].collapse-arrow>.collapse-title:after,.collapse-open.collapse-arrow>.collapse-title:after,.collapse-arrow:focus:not(.collapse-close)>.collapse-title:after,.collapse-arrow:not(.collapse-close)>input[type=checkbox]:checked~.collapse-title:after,.collapse-arrow:not(.collapse-close)>input[type=radio]:checked~.collapse-title:after{--tw-translate-y: -50%;--tw-rotate: 225deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.collapse[open].collapse-plus>.collapse-title:after,.collapse-open.collapse-plus>.collapse-title:after,.collapse-plus:focus:not(.collapse-close)>.collapse-title:after,.collapse-plus:not(.collapse-close)>input[type=checkbox]:checked~.collapse-title:after,.collapse-plus:not(.collapse-close)>input[type=radio]:checked~.collapse-title:after{content:\"−\"}.label-text{font-size:.875rem;line-height:1.25rem;--tw-text-opacity: 1;color:var(--fallback-bc,oklch(var(--bc)/var(--tw-text-opacity)))}.input input{--tw-bg-opacity: 1;background-color:var(--fallback-p,oklch(var(--p)/var(--tw-bg-opacity)));background-color:transparent}.input input:focus{outline:2px solid transparent;outline-offset:2px}.input[list]::-webkit-calendar-picker-indicator{line-height:1em}.input:focus,.input:focus-within{box-shadow:none;border-color:var(--fallback-bc,oklch(var(--bc)/.2));outline-style:solid;outline-width:2px;outline-offset:2px;outline-color:var(--fallback-bc,oklch(var(--bc)/.2))}.input:has(>input[disabled]),.input-disabled,.input:disabled,.input[disabled]{cursor:not-allowed;--tw-border-opacity: 1;border-color:var(--fallback-b2,oklch(var(--b2)/var(--tw-border-opacity)));--tw-bg-opacity: 1;background-color:var(--fallback-b2,oklch(var(--b2)/var(--tw-bg-opacity)));color:var(--fallback-bc,oklch(var(--bc)/.4))}.input:has(>input[disabled])::-moz-placeholder,.input-disabled::-moz-placeholder,.input:disabled::-moz-placeholder,.input[disabled]::-moz-placeholder{color:var(--fallback-bc,oklch(var(--bc)/var(--tw-placeholder-opacity)));--tw-placeholder-opacity: .2}.input:has(>input[disabled])::placeholder,.input-disabled::placeholder,.input:disabled::placeholder,.input[disabled]::placeholder{color:var(--fallback-bc,oklch(var(--bc)/var(--tw-placeholder-opacity)));--tw-placeholder-opacity: .2}.input:has(>input[disabled])>input[disabled]{cursor:not-allowed}.input::-webkit-date-and-time-value{text-align:inherit}.join>:where(*:not(:first-child)):is(.btn){margin-inline-start:calc(var(--border-btn) * -1)}:where(.menu li:empty){--tw-bg-opacity: 1;background-color:var(--fallback-bc,oklch(var(--bc)/var(--tw-bg-opacity)));opacity:.1;margin:.5rem 1rem;height:1px}.menu :where(li ul):before{position:absolute;bottom:.75rem;inset-inline-start:0px;top:.75rem;width:1px;--tw-bg-opacity: 1;background-color:var(--fallback-bc,oklch(var(--bc)/var(--tw-bg-opacity)));opacity:.1;content:\"\"}.menu :where(li:not(.menu-title)>*:not(ul,details,.menu-title,.btn)),.menu :where(li:not(.menu-title)>details>summary:not(.menu-title)){border-radius:var(--rounded-btn, .5rem);padding:.5rem 1rem;text-align:start;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-timing-function:cubic-bezier(0,0,.2,1);transition-duration:.2s;text-wrap:balance}:where(.menu li:not(.menu-title,.disabled)>*:not(ul,details,.menu-title)):not(summary,.active,.btn).focus,:where(.menu li:not(.menu-title,.disabled)>*:not(ul,details,.menu-title)):not(summary,.active,.btn):focus,:where(.menu li:not(.menu-title,.disabled)>*:not(ul,details,.menu-title)):is(summary):not(.active,.btn):focus-visible,:where(.menu li:not(.menu-title,.disabled)>details>summary:not(.menu-title)):not(summary,.active,.btn).focus,:where(.menu li:not(.menu-title,.disabled)>details>summary:not(.menu-title)):not(summary,.active,.btn):focus,:where(.menu li:not(.menu-title,.disabled)>details>summary:not(.menu-title)):is(summary):not(.active,.btn):focus-visible{cursor:pointer;background-color:var(--fallback-bc,oklch(var(--bc)/.1));--tw-text-opacity: 1;color:var(--fallback-bc,oklch(var(--bc)/var(--tw-text-opacity)));outline:2px solid transparent;outline-offset:2px}.menu li>*:not(ul,.menu-title,details,.btn):active,.menu li>*:not(ul,.menu-title,details,.btn).active,.menu li>details>summary:active{--tw-bg-opacity: 1;background-color:var(--fallback-n,oklch(var(--n)/var(--tw-bg-opacity)));--tw-text-opacity: 1;color:var(--fallback-nc,oklch(var(--nc)/var(--tw-text-opacity)))}.menu :where(li>details>summary)::-webkit-details-marker{display:none}.menu :where(li>details>summary):after,.menu :where(li>.menu-dropdown-toggle):after{justify-self:end;display:block;margin-top:-.5rem;height:.5rem;width:.5rem;transform:rotate(45deg);transition-property:transform,margin-top;transition-duration:.3s;transition-timing-function:cubic-bezier(.4,0,.2,1);content:\"\";transform-origin:75% 75%;box-shadow:2px 2px;pointer-events:none}.menu :where(li>details[open]>summary):after,.menu :where(li>.menu-dropdown-toggle.menu-dropdown-show):after{transform:rotate(225deg);margin-top:0}.mockup-phone .display{overflow:hidden;border-radius:40px;margin-top:-25px}.mockup-browser .mockup-browser-toolbar .input{position:relative;margin-left:auto;margin-right:auto;display:block;height:1.75rem;width:24rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;--tw-bg-opacity: 1;background-color:var(--fallback-b2,oklch(var(--b2)/var(--tw-bg-opacity)));padding-left:2rem;direction:ltr}.mockup-browser .mockup-browser-toolbar .input:before{content:\"\";position:absolute;left:.5rem;top:50%;aspect-ratio:1 / 1;height:.75rem;--tw-translate-y: -50%;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));border-radius:9999px;border-width:2px;border-color:currentColor;opacity:.6}.mockup-browser .mockup-browser-toolbar .input:after{content:\"\";position:absolute;left:1.25rem;top:50%;height:.5rem;--tw-translate-y: 25%;--tw-rotate: -45deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));border-radius:9999px;border-width:1px;border-color:currentColor;opacity:.6}@keyframes modal-pop{0%{opacity:0}}@keyframes progress-loading{50%{background-position-x:-115%}}@keyframes radiomark{0%{box-shadow:0 0 0 12px var(--fallback-b1,oklch(var(--b1)/1)) inset,0 0 0 12px var(--fallback-b1,oklch(var(--b1)/1)) inset}50%{box-shadow:0 0 0 3px var(--fallback-b1,oklch(var(--b1)/1)) inset,0 0 0 3px var(--fallback-b1,oklch(var(--b1)/1)) inset}to{box-shadow:0 0 0 4px var(--fallback-b1,oklch(var(--b1)/1)) inset,0 0 0 4px var(--fallback-b1,oklch(var(--b1)/1)) inset}}@keyframes rating-pop{0%{transform:translateY(-.125em)}40%{transform:translateY(-.125em)}to{transform:translateY(0)}}.select:focus{box-shadow:none;border-color:var(--fallback-bc,oklch(var(--bc)/.2));outline-style:solid;outline-width:2px;outline-offset:2px;outline-color:var(--fallback-bc,oklch(var(--bc)/.2))}.select-disabled,.select:disabled,.select[disabled]{cursor:not-allowed;--tw-border-opacity: 1;border-color:var(--fallback-b2,oklch(var(--b2)/var(--tw-border-opacity)));--tw-bg-opacity: 1;background-color:var(--fallback-b2,oklch(var(--b2)/var(--tw-bg-opacity)));color:var(--fallback-bc,oklch(var(--bc)/.4))}.select-disabled::-moz-placeholder,.select:disabled::-moz-placeholder,.select[disabled]::-moz-placeholder{color:var(--fallback-bc,oklch(var(--bc)/var(--tw-placeholder-opacity)));--tw-placeholder-opacity: .2}.select-disabled::placeholder,.select:disabled::placeholder,.select[disabled]::placeholder{color:var(--fallback-bc,oklch(var(--bc)/var(--tw-placeholder-opacity)));--tw-placeholder-opacity: .2}.select-multiple,.select[multiple],.select[size].select:not([size=\"1\"]){background-image:none;padding-right:1rem}[dir=rtl] .select{background-position:calc(0% + 12px) calc(1px + 50%),calc(0% + 16px) calc(1px + 50%)}@keyframes skeleton{0%{background-position:150%}to{background-position:-50%}}.table:where([dir=rtl],[dir=rtl] *){text-align:right}.table :where(th,td){padding:.75rem 1rem;vertical-align:middle}.table tr.active,.table tr.active:nth-child(2n),.table-zebra tbody tr:nth-child(2n){--tw-bg-opacity: 1;background-color:var(--fallback-b2,oklch(var(--b2)/var(--tw-bg-opacity)))}.table-zebra tr.active,.table-zebra tr.active:nth-child(2n),.table-zebra-zebra tbody tr:nth-child(2n){--tw-bg-opacity: 1;background-color:var(--fallback-b3,oklch(var(--b3)/var(--tw-bg-opacity)))}.table :where(thead tr,tbody tr:not(:last-child),tbody tr:first-child:last-child){border-bottom-width:1px;--tw-border-opacity: 1;border-bottom-color:var(--fallback-b2,oklch(var(--b2)/var(--tw-border-opacity)))}.table :where(thead,tfoot){white-space:nowrap;font-size:.75rem;line-height:1rem;font-weight:700;color:var(--fallback-bc,oklch(var(--bc)/.6))}.table :where(tfoot){border-top-width:1px;--tw-border-opacity: 1;border-top-color:var(--fallback-b2,oklch(var(--b2)/var(--tw-border-opacity)))}@keyframes toast-pop{0%{transform:scale(.9);opacity:0}to{transform:scale(1);opacity:1}}[dir=rtl] .toggle{--handleoffsetcalculator: calc(var(--handleoffset) * 1)}.toggle:focus-visible{outline-style:solid;outline-width:2px;outline-offset:2px;outline-color:var(--fallback-bc,oklch(var(--bc)/.2))}.toggle:hover{background-color:currentColor}.toggle:checked,.toggle[aria-checked=true]{background-image:none;--handleoffsetcalculator: var(--handleoffset);--tw-text-opacity: 1;color:var(--fallback-bc,oklch(var(--bc)/var(--tw-text-opacity)))}[dir=rtl] .toggle:checked,[dir=rtl] .toggle[aria-checked=true]{--handleoffsetcalculator: calc(var(--handleoffset) * -1)}.toggle:indeterminate{--tw-text-opacity: 1;color:var(--fallback-bc,oklch(var(--bc)/var(--tw-text-opacity)));box-shadow:calc(var(--handleoffset) / 2) 0 0 2px var(--tglbg) inset,calc(var(--handleoffset) / -2) 0 0 2px var(--tglbg) inset,0 0 0 2px var(--tglbg) inset}[dir=rtl] .toggle:indeterminate{box-shadow:calc(var(--handleoffset) / 2) 0 0 2px var(--tglbg) inset,calc(var(--handleoffset) / -2) 0 0 2px var(--tglbg) inset,0 0 0 2px var(--tglbg) inset}.toggle:disabled{cursor:not-allowed;--tw-border-opacity: 1;border-color:var(--fallback-bc,oklch(var(--bc)/var(--tw-border-opacity)));background-color:transparent;opacity:.3;--togglehandleborder: 0 0 0 3px var(--fallback-bc,oklch(var(--bc)/1)) inset, var(--handleoffsetcalculator) 0 0 3px var(--fallback-bc,oklch(var(--bc)/1)) inset}.card-compact .card-body{padding:1rem;font-size:.875rem;line-height:1.25rem}.card-compact .card-title{margin-bottom:.25rem}.card-normal .card-body{padding:var(--padding-card, 2rem);font-size:1rem;line-height:1.5rem}.card-normal .card-title{margin-bottom:.75rem}.join.join-vertical>:where(*:not(:first-child)):is(.btn){margin-top:calc(var(--border-btn) * -1)}.join.join-horizontal>:where(*:not(:first-child)):is(.btn){margin-inline-start:calc(var(--border-btn) * -1)}.collapse{visibility:collapse}.static{position:static}.relative{position:relative}.flex{display:flex}.table{display:table}.contents{display:contents}.max-h-\\[40vh\\]{max-height:40vh}.w-48{width:12rem}.w-full{width:100%}.max-w-xs{max-width:20rem}.flex-1{flex:1 1 0%}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.flex-nowrap{flex-wrap:nowrap}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-1{gap:.25rem}.gap-2{gap:.5rem}.gap-4{gap:1rem}.gap-8{gap:2rem}.overflow-auto{overflow:auto}.overflow-x-auto{overflow-x:auto}.overflow-y-scroll{overflow-y:scroll}.rounded-box{border-radius:var(--rounded-box, 1rem)}.bg-base-100{--tw-bg-opacity: 1;background-color:var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity)))}.bg-base-200{--tw-bg-opacity: 1;background-color:var(--fallback-b2,oklch(var(--b2)/var(--tw-bg-opacity)))}.bg-base-300{--tw-bg-opacity: 1;background-color:var(--fallback-b3,oklch(var(--b3)/var(--tw-bg-opacity)))}.font-mono{font-family:Fira Code}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-bold{font-weight:700}.font-medium{font-weight:500}.text-primary{--tw-text-opacity: 1;color:var(--fallback-p,oklch(var(--p)/var(--tw-text-opacity)))}.opacity-50{opacity:.5}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}\n`, af = "datastar-inspector-event", sf = {
  bubbles: !0,
  cancelable: !0,
  composed: !0
}, Ti = (e, t, n = sf) => {
  globalThis.dispatchEvent(
    new CustomEvent(
      af,
      Object.assign(
        {
          detail: {
            time: /* @__PURE__ */ new Date(),
            name: e,
            script: t
          }
        },
        n
      )
    )
  );
};
var uf = Object.defineProperty, of = Object.getOwnPropertyDescriptor, ue = (e, t, n, r) => {
  for (var s = r > 1 ? void 0 : r ? of(t, n) : t, i = e.length - 1, u; i >= 0; i--)
    (u = e[i]) && (s = (r ? u(t, n, s) : u(s)) || s);
  return r && s && uf(t, n, s), s;
};
function cf(e) {
  const t = e.cloneNode(!0);
  return t.innerHTML = "", e.outerHTML;
}
const br = "datastar-inspector-highlight";
function Ua(e) {
  Ti(
    "highlight_element",
    `return document.getElementById('${e}')?.classList.add('${br}')`
  );
}
function Ba(e) {
  Ti(
    "highlight_element_stop",
    `return document.getElementById('${e}')?.classList.length === 1 ? document.getElementById('${e}').removeAttribute('class') : document.getElementById('${e}')?.classList.remove('${br}') `
  );
}
function Ha(e, t) {
  if (t) {
    const n = e.getElementById(t);
    return n || (console.warn(
      `Inspector could not find root element with id ${t}`
    ), e.documentElement);
  } else
    return e.documentElement;
}
const wn = new DOMParser();
let V = class extends nt {
  constructor() {
    super(...arguments), this.v = 0, this.maxEvents = 10, this.maxVersions = 10, this.remoteOnly = !1, this.showPlugins = !1, this.rootElementId = void 0, this.versionOffset = 0, this.stores = [
      {
        contents: {},
        time: /* @__PURE__ */ new Date(),
        expressions: []
      }
    ], this.currentDom = wn.parseFromString("<html></html>", "text/html"), this.events = [], this.prevStoreMarshalled = "{}";
  }
  firstUpdated(e) {
    window.addEventListener(
      Me,
      (r) => {
        n(r.detail);
      }
    );
    const n = async (r) => {
      if (r.subcategory === "backend" && r.type === "merge") {
        const s = JSON.parse(r.message), i = String(
          await ka().use(Ma).data("settings", { fragment: !0 }).process(s.fragment)
        );
        this.events = [
          ...this.events,
          { ...r, message: K`<pre>${i}</pre>` }
        ].slice(-this.maxEvents);
        return;
      }
      if (r.subcategory === "backend" && (r.type === "fetch_start" || r.type === "fetch_end")) {
        const { method: s, urlExpression: i } = JSON.parse(r.message), u = `${s} ${i}`;
        this.events = [...this.events, { ...r, message: u }].slice(
          -this.maxEvents
        );
        return;
      }
      if (r.subcategory === "dom") {
        let s = function(b) {
          c.querySelectorAll(`.${b}`).forEach((y) => {
            y.classList.remove(b), y.classList.length === 0 && y.removeAttribute("class");
          });
        };
        const i = this.currentDom, c = wn.parseFromString(r.message, "text/html");
        [...c.getElementsByTagName("datastar-inspector")].forEach((b) => {
          b.parentNode?.removeChild(b);
        }), [br, "datastar-swapping", "datastar-settling"].forEach(
          s
        );
        const d = this.stores[this.stores.length - 1].expressions, f = [
          ...c.querySelectorAll("*")
        ].filter((b) => b instanceof HTMLElement ? Object.keys({ ...b.dataset }).length > 0 : !1);
        if (this.currentDom = c, i.documentElement.outerHTML !== wn.parseFromString("<html></html>", "text/html").documentElement.outerHTML) {
          const b = ro(
            Ha(i, this.rootElementId).outerHTML,
            Ha(c, this.rootElementId).outerHTML
          ), y = (await Promise.all(
            b.filter((T) => T.added || T.removed).map(async (T) => {
              const C = String(
                await ka().use(Ma).data("settings", { fragment: !0 }).process(T.value)
              );
              return { ...T, value: C };
            })
          )).reduce(
            (T, C) => {
              const N = C.added ? "color: oklch(var(--suc)); background-color: oklch(var(--su)); padding: 0.5rem;" : C.removed ? "color: oklch(var(--erc)); background-color: oklch(var(--er)); padding: 0.5rem;" : "";
              return T.push(
                K`<div style="${N};">
                  <pre style="display: inline-block; width: 50vw;">
                    ${C.value}
                  </pre
                  >
                </div>`
              ), T;
            },
            []
          );
          if (y.length === 0)
            return;
          this.events = [...this.events, { ...r, message: y }];
        }
        (f.length !== d.length || !f.every((b, y) => b.isEqualNode(d[y]))) && (this.stores = [
          ...this.stores,
          {
            contents: this.stores[this.stores.length - 1].contents,
            time: /* @__PURE__ */ new Date(),
            expressions: f
          }
        ], this.stores.length > this.maxVersions && (this.versionOffset += this.stores.length - this.maxVersions, this.stores = this.stores.slice(-this.maxVersions)));
        return;
      }
      if (r.category === "core" && r.subcategory === "store" && r.type === "merged") {
        const { message: s } = r, i = this.stores[this.stores.length - 1].contents, u = JSON.parse(s), d = uo(i, u).filter((f) => f.added || f.removed).reduce(
          (f, p) => {
            const b = p.added ? "color: oklch(var(--suc)); background-color: oklch(var(--su)); padding: 0.5rem;" : p.removed ? "color: oklch(var(--erc)); background-color: oklch(var(--er)); padding: 0.5rem;" : "", y = p.added ? " + " : p.removed ? " - " : " ";
            return f.push(
              K`<span style="${b}">${y}${p.value}</span>`
            ), f;
          },
          []
        );
        if (!d)
          return;
        this.v = this.stores.length, this.stores = [
          ...this.stores,
          {
            contents: u,
            time: /* @__PURE__ */ new Date(),
            expressions: this.stores[this.stores.length - 1].expressions
          }
        ], this.stores.length > this.maxVersions && (this.versionOffset += this.stores.length - this.maxVersions, this.stores = this.stores.slice(-this.maxVersions)), this.events = [
          ...this.events,
          { ...r, message: d }
        ].slice(-this.maxEvents);
        return;
      }
      this.events = [...this.events, r].slice(-this.maxEvents);
    };
  }
  render() {
    let e;
    if (this.v < 0 && this.v >= this.stores.length)
      e = K` <div class="alert alert-warning">No store yet</div> `;
    else {
      let t = function(u) {
        return i.filter((c) => !!Object.keys(c.dataset).map((d) => c.dataset[d]).find((d) => d?.includes(`$${u}`) || d === `${u}`)).map((c) => K`<pre
              @mouseover="${() => Ua(c.id)}"
              @mouseout="${() => Ba(c.id)}"
            >
    ${cf(c)}</pre
            >`);
      }, n = function(u) {
        return Object.keys(u).map((c) => {
          if (typeof u[c] == "object")
            return K`<details class="collapse collapse-arrow">
              <summary class="collapse-title">${c}</summary>
              ${n(u[c])}
            </details>`;
          const d = typeof u[c] == "string" ? '"' : "", f = u[c].toString().length > 10 ? u[c] : "", p = t(c);
          return p.length > 0 ? K`
              <details class="collapse collapse-arrow">
                <summary class="collapse-title bg-base-100">
                ${c} = ${d}${u[c].toString().substring(0, 10)}${d}
              </summary>
                <div class="collapse-content bg-base-300">
                    <pre>${f}</pre>
                    Used by:</br>
                    ${p}
                </div>
              </details>
            ` : K`
            <summary>
              ${c} =
              ${d}${u[c].toString().substring(0, 10)}${d}
            </summary>
          `;
        });
      };
      const r = this.stores[this.v];
      let s = Object.assign({}, r?.contents), i = r?.expressions || [];
      this.remoteOnly && (s = gt(s)), this.showPlugins || delete s._dsPlugins, e = K`
        <div class="card-title items-center justify-between">
          <div>Store</div>
          <div class="flex items-center gap-4">
            <div class="form-control">
              <label class="label cursor-pointer gap-2">
                <span class="label-text">Show plugin signals</span>
                <input
                  type="checkbox"
                  class="toggle"
                  ?checked=${this.showPlugins}
                  @change=${(u) => {
        const c = u.target;
        this.showPlugins = c.checked;
      }}
                />
              </label>
            </div>
            <div class="form-control">
              <label class="label cursor-pointer gap-2">
                <span class="label-text">Remote only</span>
                <input
                  type="checkbox"
                  class="toggle"
                  ?checked=${this.remoteOnly}
                  @change=${(u) => {
        const c = u.target;
        this.remoteOnly = c.checked;
      }}
                />
              </label>
            </div>
          </div>
        </div>

        ${n(s)}
      `;
    }
    return K`
      <div data-theme="datastar">
        <details class="bg-base-100 collapse  collapse-arrow">
          <summary class="collapse-title text-xl font-medium">
            Inspector
          </summary>
          <details class="bg-base-100 collapse  collapse-arrow  " open>
            <summary class="collapse-title text-xl font-medium">Store</summary>
            <div class="collapse-content flex gap-4 max-h-[40vh]">
              <ul
                class="menu bg-base-200 w-48 rounded-box overflow-y-scroll flex-col flex-nowrap text-xs"
              >
                <div>Versions</div>
                ${this.stores.map(
      (t, n) => K`
                    <li
                      class=${`flex gap-1 ${this.v === n ? "text-primary" : ""}`}
                      @click=${() => this.v = n}
                    >
                      <div>
                        <span>${n + 1 + this.versionOffset}</span>
                        <div class="font-bold">
                          ${t.time.toLocaleTimeString()}
                        </div>
                      </div>
                    </li>
                  `
    )}
              </ul>
              <div class="card w-full bg-base-200 overflow-auto">
                <div class="card-body flex-1">${e}</div>
              </div>
            </div>
          </details>
          <details class="bg-base-100 collapse collapse-arrow " open>
            <summary class="collapse-title text-xl font-medium">
              <div class="flex gap-8 items-center">
                Events
                <select
                  class="select w-full max-w-xs"
                  @change=${(t) => {
      const n = t.target, r = parseInt(n.value);
      this.maxEvents = r;
    }}
                >
                  ${V.maxEventOptions.map(
      (t) => K`
                      <option value=${t} ?selected=${this.maxEvents === t}>
                        ${t} max
                      </option>
                    `
    )}
                </select>
                <div class="form-control">
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click=${(t) => {
      this.events = [];
    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </summary>
            <div class="collapse-content relative">
              <div class="overflow-auto">
                <table class="table table-zebra table-compact w-full">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Target</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.events.map((t) => K`
                        <tr class="text-xs">
                          <td class="font-mono opacity-50">
                            ${t.time.toISOString().split("T")[1].slice(0, 12)}
                          </td>
                          <td>${t.category}/${t.subcategory}</td>
                          <td>${t.type}</td>
                          <td
                            @mouseover="${() => Ua(t.target)}"
                            @mouseout="${() => Ba(t.target)}"
                          >
                            ${t.target}
                          </td>
                          <td class="w-full overflow-x-auto">${t.message}</td>
                        </tr>
                      `)}
                  </tbody>
                </table>
              </div>
            </div>
          </details>
        </details>
      </div>
    `;
  }
};
V.styles = [rf];
V.maxEventOptions = [10, 50, 100, 500, 1e3];
ue([
  Le()
], V.prototype, "v", 2);
ue([
  Le()
], V.prototype, "maxEvents", 2);
ue([
  Le()
], V.prototype, "maxVersions", 2);
ue([
  Le()
], V.prototype, "remoteOnly", 2);
ue([
  Le()
], V.prototype, "showPlugins", 2);
ue([
  Le()
], V.prototype, "rootElementId", 2);
ue([
  Zt()
], V.prototype, "stores", 2);
ue([
  Zt()
], V.prototype, "currentDom", 2);
ue([
  Zt()
], V.prototype, "events", 2);
ue([
  Zt()
], V.prototype, "prevStoreMarshalled", 2);
V = ue([
  Oo("datastar-inspector")
], V);
export {
  V as DatastarInspectorElement,
  af as datastarInspectorEvtName,
  Ti as sendDatastarInspectorEvent
};
//# sourceMappingURL=datastar-inspector.js.map
