import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createRequire } from 'module';
import { createRequire } from 'module';

var require = createRequire(import.meta.url);
var module = { exports: {} };

const require = createRequire(import.meta.url);

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/predict": "http://127.0.0.1:8000",
      "/health": "http://127.0.0.1:8000",
      "/docs": "http://127.0.0.1:8000",
    },
  },
