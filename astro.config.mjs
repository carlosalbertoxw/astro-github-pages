// @ts-check
import { defineConfig } from 'astro/config';

// En GitHub Pages el sitio se publica en https://<usuario>.github.io/<repo>/,
// asi que los enlaces y los assets deben resolverse contra /<repo>/.
// Astro aplica `base` tambien en desarrollo: el sitio vive en
// http://localhost:4321/astro-github-pages/
const repo = 'astro-github-pages';

// https://astro.build/config
export default defineConfig({
  // Cambia el usuario si publicas desde otra cuenta.
  site: `https://carlosalbertoxw.github.io/${repo}`,

  // Sitio de proyecto -> '/<repo>/'. Sitio de usuario (<usuario>.github.io) -> '/'.
  base: `/${repo}/`,
});
