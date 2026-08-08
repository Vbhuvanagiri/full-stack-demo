// Global shims that must run before any Midnight module loads (side-effect import at the
// top of the Midnight context, i.e. at app boot).
import { Buffer } from 'buffer';

const g = globalThis as unknown as {
  Buffer?: typeof Buffer;
  fetch?: typeof fetch;
};

// 1. Buffer: the ported Midnight code uses it as a free global; Turbopack's browser bundle
//    doesn't inject node globals.
if (!g.Buffer) g.Buffer = Buffer;

// 2. Bound fetch: the midnight-js indexer provider hands `cross-fetch`'s export straight to
//    Apollo's HttpLink. cross-fetch captures the native `window.fetch` UNBOUND, so Apollo's
//    internal `fetch(...)` call throws "Illegal invocation" (wrong `this`). Rebinding the
//    global here — before cross-fetch's module initializes — makes it capture the bound one.
if (typeof g.fetch === 'function') {
  const native = g.fetch;
  // Only rebind once (guard against HMR double-apply); a bound fn has no own `polyfill`.
  if (!(native as { __bound__?: boolean }).__bound__) {
    const bound = native.bind(globalThis) as typeof fetch & { __bound__?: boolean };
    bound.__bound__ = true;
    g.fetch = bound;
  }
}
