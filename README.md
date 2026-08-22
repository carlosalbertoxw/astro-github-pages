# astro-github-pages

Sitio estático de demostración hecho con **Astro** y publicado en **GitHub Pages**
mediante GitHub Actions.

Es la web de *Cauce*, una empresa ficticia de analítica operativa: cinco páginas
(inicio, servicios, precios, casos y contacto) más una 404, con menú responsive,
conmutador de precios, formulario validado en el navegador y animaciones de
aparición al hacer scroll. Todo el contenido y las cifras son inventados.

## Requisitos

- Node.js 22.12 o superior (lo exige Astro 7; probado con Node 24 y Astro 7.2.4)
- Una cuenta de GitHub

## Desarrollo local

```bash
npm install
npm run dev
```

Ojo: como `base` no es `/`, el sitio en desarrollo vive en
http://localhost:4321/astro-github-pages/ (la raíz devuelve 404).

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Genera el sitio estático en `dist/` |
| `npm run preview` | Sirve `dist/` para revisarlo antes de publicar |

## Estructura

```
├── astro.config.mjs          # site + base (¡edítalo antes de publicar!)
├── public/
│   └── favicon.svg           # se copia tal cual a la raíz del sitio
├── src/
│   ├── layouts/
│   │   └── Base.astro        # <head>, cabecera, pie y carga de los scripts
│   ├── components/
│   │   ├── Cabecera.astro    # menú + marca del enlace activo
│   │   ├── Pie.astro
│   │   └── Caso.astro        # ficha de caso: props + <slot> para el relato
│   ├── pages/                # cada archivo = una ruta
│   │   ├── index.astro       # /
│   │   ├── servicios.astro   # /servicios
│   │   ├── precios.astro     # /precios
│   │   ├── casos.astro       # /casos
│   │   ├── contacto.astro    # /contacto
│   │   └── 404.astro         # lo sirve GitHub Pages ante rutas desconocidas
│   ├── scripts/              # JS de cliente, uno por comportamiento
│   │   ├── navegacion.js     # menú desplegable en móvil
│   │   ├── revelado.js       # aparición progresiva (IntersectionObserver)
│   │   ├── precios.js        # conmutador mensual / anual
│   │   └── formulario.js     # validación del formulario de contacto
│   ├── styles/
│   │   └── global.css        # hoja única: tokens, layout y componentes
│   └── lib/
│       └── ruta.js           # enlaces internos que respetan `base`
└── .github/workflows/deploy.yml
```

### Cómo encaja cada pieza

- **`Base.astro`** envuelve todas las páginas. Recibe `titulo`, `descripcion` y
  un `noindex` opcional (lo usa la 404), e incluye un único `<script>` que
  importa los cuatro módulos de `src/scripts/`. Astro los empaqueta y les pone
  hash automáticamente.
- **Cada módulo se autodesactiva** si su HTML no está en la página, así que el
  mismo script sirve para el inicio, precios o contacto sin comprobaciones extra.
- **El contenido repetido vive en arrays** dentro del frontmatter de cada página
  (planes, pasos, métricas, preguntas frecuentes) y se recorre con `.map()`.
- **El año del pie se calcula al construir**, no en el navegador.

### Enlaces internos y `base`

Con `base` distinto de `/`, un `href="/precios"` escrito a mano funciona en local
y se rompe al publicar. Por eso todos los enlaces internos pasan por el ayudante
de `src/lib/ruta.js`:

```astro
---
import { ruta } from '../lib/ruta.js';
---
<a href={ruta('/precios')}>Ver precios</a>
```

Devuelve el destino tal cual si es externo (`https:`, `mailto:`, `tel:`, `#`).

### El formulario de contacto

GitHub Pages es hosting estático: no hay servidor que reciba el POST. El
formulario valida y confirma en el navegador, a modo de demostración. Para
recibir los mensajes de verdad, apunta el `action` a un servicio externo
(Formspree, Basin, Getform…) y quita el `evento.preventDefault()` de
`src/scripts/formulario.js`.

## Publicar en GitHub Pages

### 1. Ajusta `astro.config.mjs`

```js
const repo = 'astro-github-pages';

export default defineConfig({
  site: `https://TU-USUARIO.github.io/${repo}`,
  base: `/${repo}/`,
});
```

- **Sitio de proyecto** (`https://tu-usuario.github.io/mi-repo`): `base: '/mi-repo/'`.
- **Sitio de usuario** (repo llamado `tu-usuario.github.io`): `base: '/'`.

### 2. Sube el repositorio

```bash
git init -b main
git add .
git commit -m "Sitio estatico con Astro"
git remote add origin https://github.com/TU-USUARIO/astro-github-pages.git
git push -u origin main
```

### 3. Activa Pages

En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

A partir de ahí, cada `push` a `main` dispara `.github/workflows/deploy.yml`, que
construye el sitio y lo despliega. El progreso se ve en la pestaña **Actions** y
la URL final aparece en **Settings → Pages**.

> El workflow fija `node-version: 22` en `withastro/action@v3`. Sin eso la acción
> usa Node 20 y el build falla con *«Node.js v20.x is not supported by Astro»*.

## Añadir páginas

Crea un archivo en `src/pages/`; la ruta sale del nombre del archivo:

- `src/pages/blog.astro` → `/blog`
- `src/pages/legal/aviso.astro` → `/legal/aviso`

Empieza copiando la cabecera de cualquier página existente:

```astro
---
import Base from '../layouts/Base.astro';
---

<Base titulo="Titulo — Cauce" descripcion="Resumen para buscadores.">
  <section class="seccion">
    <div class="contenedor">…</div>
  </section>
</Base>
```

Añádela también al array `enlaces` de `src/components/Cabecera.astro` para que
salga en el menú.
