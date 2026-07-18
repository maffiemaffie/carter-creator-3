import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { Features } from "lightningcss";

// https://vite.dev/config/
export default defineConfig({
  build: {
    cssMinify: "lightningcss",
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
