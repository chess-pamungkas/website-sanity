/**
 * Dynamic import of socket.io-client with Webpack-compatible interop.
 * CJS build ends with `module.exports = lookup`, so `import()` often returns
 * `{ default: fn }` — not `{ io: fn }`. Static `import { io }` works; dynamic must normalize.
 */
export function loadSocketIo() {
  return import("socket.io-client").then((mod) => {
    const io = mod.io ?? mod.default;
    if (typeof io !== "function") {
      throw new TypeError(
        `socket.io-client: expected io to be a function, got ${typeof io}`
      );
    }
    return io;
  });
}
