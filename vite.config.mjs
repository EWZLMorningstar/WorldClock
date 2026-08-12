import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// If you plan to deploy to GitHub Pages under a repo path, set base to "/REPO_NAME/".
// Example: base: "/world-timezones/"
export default defineConfig({
  plugins: [react()],
  // base: '/',
});
