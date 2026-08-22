// Construye enlaces internos respetando `base` de astro.config.mjs.
// En desarrollo BASE_URL es '/', en produccion '/<repo>/'.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

const esExterno = (destino) => /^(https?:|mailto:|tel:|#)/.test(destino);

export function ruta(destino = '/') {
  if (esExterno(destino)) return destino;
  const limpia = destino.startsWith('/') ? destino : `/${destino}`;
  return `${base}${limpia}`;
}

// Compara la ruta actual con un destino, ignorando la barra final.
export function esActual(pathname, destino) {
  const normaliza = (valor) => valor.replace(/\/+$/, '') || '/';
  return normaliza(pathname) === normaliza(ruta(destino));
}
