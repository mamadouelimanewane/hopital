import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: [
      "mediawatch/**/*.test.ts",
      "mediabase/**/*.test.ts",
      "antideep/**/*.test.ts",
      "edumedia/**/*.test.ts",
      "citoyen/**/*.test.ts",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["**/lib/utils.ts", "**/components/**/*.tsx"],
      exclude: ["**/node_modules/**", "**/.next/**"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
})
