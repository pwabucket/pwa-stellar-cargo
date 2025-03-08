import path from "path";
import process from "process";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { imagetools } from "vite-imagetools";
import { loadEnv } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  /** Env */
  const env = loadEnv(mode, process.cwd());

  return {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [
      /** Plugins */
      VitePWA({
        registerType: "autoUpdate",
      }),
      ViteEjsPlugin(env),
      tailwindcss(),
      imagetools(),
      react(),
    ],
  };
});
