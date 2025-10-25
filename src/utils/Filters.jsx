// Utilidades de filtrado para productos

// Convierte precios como "$18.990" o "12.990" a número 18990/12990
export function parsePrecio(precio) {
  if (precio == null) return NaN;
  const onlyDigits = String(precio).replace(/[^0-9]/g, '');
  return onlyDigits ? parseInt(onlyDigits, 10) : NaN;
}

// criteria: {
//   minPrecio?: number,
//   maxPrecio?: number,
//   formato?: string[] | string,
//   artista?: string[] | string,
//   anio?: number[] | number, // puede ser [min,max] o valor único
//   etiqueta?: string[] | string,
//   minRating?: number
// }
export function filterProducts(productos, criteria = {}) {
  if (!Array.isArray(productos)) return [];

  const {
    minPrecio,
    maxPrecio,
    formato,
    artista,
    anio,
    etiqueta,
    minRating,
  } = criteria;

  const formatos = normalizeToArray(formato);
  const artistas = normalizeToArray(artista);
  const etiquetas = normalizeToArray(etiqueta);

  const anioRange = Array.isArray(anio)
    ? [Number(anio[0]), Number(anio[1])]
    : (anio != null ? [Number(anio), Number(anio)] : null);

  return productos.filter((p) => {
    // Precio
    const precioNum = parsePrecio(p.precio);
    if (Number.isFinite(minPrecio) && (Number.isFinite(precioNum) && precioNum < minPrecio)) return false;
    if (Number.isFinite(maxPrecio) && (Number.isFinite(precioNum) && precioNum > maxPrecio)) return false;

    // Formato (coincidencia contiene: para "Vinilo 12" cuenta como Vinilo)
    if (formatos.length > 0) {
      const pf = String(p.formato || '').toLowerCase();
      const okFormato = formatos.some((f) => pf.includes(String(f).toLowerCase()));
      if (!okFormato) return false;
    }

    // Artista exacto
    if (artistas.length > 0) {
      const pa = String(p.artista || '').toLowerCase();
      const okArtista = artistas.some((a) => pa === String(a).toLowerCase());
      if (!okArtista) return false;
    }

    // Año
    if (anioRange) {
      const an = Number(p.anio ?? p.año); // fallback por si los datos antiguos quedan
      if (!Number.isFinite(an)) return false;
      if (an < anioRange[0] || an > anioRange[1]) return false;
    }

    // Etiqueta exacta
    if (etiquetas.length > 0) {
      const pe = String(p.etiqueta || '').toLowerCase();
      const okEtiqueta = etiquetas.some((e) => pe === String(e).toLowerCase());
      if (!okEtiqueta) return false;
    }

    // Rating mínimo
    if (Number.isFinite(minRating)) {
      const r = Number(p.rating);
      if (!Number.isFinite(r) || r < minRating) return false;
    }

    return true;
  });
}

function normalizeToArray(val) {
  if (val == null) return [];
  return Array.isArray(val) ? val : [val];
}

export default {
  parsePrecio,
  filterProducts,
};

