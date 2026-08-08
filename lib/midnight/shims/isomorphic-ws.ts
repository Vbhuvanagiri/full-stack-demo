// isomorphic-ws's browser build only default-exports WebSocket, but some Midnight packages
// do `import * as ws from 'isomorphic-ws'` then `new ws.WebSocket()`. Turbopack enforces
// ESM named exports, so provide both a named and default WebSocket (the browser global).
const WS: typeof WebSocket = globalThis.WebSocket;
export { WS as WebSocket };
export default WS;
