import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  test: {
    // Le socle est du code serveur : pas besoin de DOM.
    environment: "node",
    globals: true,
    include: ["tests/**/*.test.ts"],
    testTimeout: 30_000,
    // Le démarrage d'un Postgres WASM par test dépasse le défaut.
    hookTimeout: 30_000,
    // Chaque test instancie un Postgres compilé en WebAssembly.
    // Les exécuter en parallèle sature la machine et rend les
    // résultats intermittents : on sérialise.
    fileParallelism: false,
    coverage: {
      provider: "v8",
      reporter: ["text"],
      include: ["lib/**/*.ts"],
      exclude: ["**/node_modules/**", "**/.next/**"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
})
