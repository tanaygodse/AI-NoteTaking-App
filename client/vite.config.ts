import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

export default defineConfig({
  base: "/",
  build: {
    outDir: "dist",
  },
  plugins: [reactRefresh()],
  server: {
    port: 3000,
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
});
