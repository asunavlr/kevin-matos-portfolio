import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
// served at comply.website/kevin (proxied) and kevin-matos-portfolio.vercel.app/kevin
export default defineConfig({ base: "/kevin/", build: { outDir: "dist/kevin" }, plugins: [react(), tailwind()] });
