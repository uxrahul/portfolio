import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import remarkCaseSections from './src/lib/remark-case-sections.mjs';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  markdown: { processor: unified({ remarkPlugins: [remarkCaseSections] }) },
  integrations: [mdx()],
  vite: { plugins: [tailwindcss()] },
});
