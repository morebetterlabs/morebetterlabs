import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://morebetterlabs.com',
  integrations: [tailwind()],
  build: {
    format: 'directory',
  },
});
