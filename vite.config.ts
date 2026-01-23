import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  // Simple dev-only API mock for onboarding preferences
  configureServer(server) {
    const preferences: any[] = [];

    server.middlewares.use("/api/onboarding/preferences", async (req, res, next) => {
      if (req.method !== "POST") return next();

      try {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", () => {
          try {
            const json = JSON.parse(body || "{}");
            const id = `pref_${Date.now()}`;
            const saved = { id, ...json };
            preferences.push(saved);

            res.statusCode = 201;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(saved));
          } catch (err) {
            res.statusCode = 400;
            res.end("Invalid JSON");
          }
        });
      } catch (err) {
        res.statusCode = 500;
        res.end("Internal error");
      }
    });
  },
}));
