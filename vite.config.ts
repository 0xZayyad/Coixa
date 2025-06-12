import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";

// https://vite.dev/config/
export default defineConfig({
  plugins: [wasm()],
  define: {
    global: {},
    "process.env": {},
  },
  resolve: {
    alias: {
      buffer: "buffer",
    },
  },
  optimizeDeps: {
    include: ["@mui/material", "@emotion/react", "@emotion/styled", "buffer"],
  },
});
