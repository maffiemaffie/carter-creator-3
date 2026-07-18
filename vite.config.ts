import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { Features } from "lightningcss";

// https://vite.dev/config/
export default defineConfig({
  build: {
    cssMinify: "lightningcss",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        dead_code: true,
        unused: true,
      },
    },
  },
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  base: "/carter-creator-3/",
  css: {
    transformer: "lightningcss",
    lightningcss: {
      exclude: Features.LightDark,
    },
  },
});
