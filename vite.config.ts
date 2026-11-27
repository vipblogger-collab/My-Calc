import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';
import {
  CANONICAL_SITEMAP_ORIGIN,
  ROBOTS_TXT_CONTENT,
  generateSitemapXml,
} from './src/seo/sitemapXml.ts';

const rootDir = import.meta.dirname ?? process.cwd();

export default defineConfig(() => {
  const disableHmr = process.env.DISABLE_HMR === 'true';
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'generate-static-seo-files',
        apply: 'build',
        buildStart(): void {
          const publicDir = path.resolve(rootDir, 'public');
          fs.mkdirSync(publicDir, {recursive: true});
          fs.writeFileSync(path.join(publicDir, 'robots.txt'), ROBOTS_TXT_CONTENT, 'utf-8');
          fs.writeFileSync(
            path.join(publicDir, 'sitemap.xml'),
            generateSitemapXml(CANONICAL_SITEMAP_ORIGIN),
            'utf-8'
          );
        },
      },
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(rootDir, 'dist');
          const srcAssets = path.resolve(rootDir, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(rootDir, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: !disableHmr,
      ws: disableHmr ? (false as const) : undefined,
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: disableHmr ? null : {},
    },
  };
});
