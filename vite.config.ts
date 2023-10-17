import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
    },
    base: "/mock-deploy",
    plugins: [react()],
    server: {
      port: 8000,
    },
  };
});
