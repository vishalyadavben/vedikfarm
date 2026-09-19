import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // 5174, not the default 5173 - your other project's frontend already uses 5173.
    port: 5174,
  },
});
