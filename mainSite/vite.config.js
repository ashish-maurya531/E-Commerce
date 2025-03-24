import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [
        '..', // Allow access to parent directories
        'node_modules/@fortawesome/fontawesome-free', // Explicitly allow Font Awesome
      ],
    },
  },
});