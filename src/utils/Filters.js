// Filters.js — Utilidades de filtrado y transformación para productos

/**
 * Normaliza y convierte un precio al formato numérico.
 * 
 * Elimina cualquier caracter no numérico (comas, puntos, símbolos de moneda)
 * y devuelve un entero. Útil para limpiar inputs o datos sucios.
 * 
 * Ejemplos:
 * - "$18.990" -> 18990
 * - "12.990" -> 12990
 * - "USD 50" -> 50
 * 
 * @param {string|number|null|undefined} precio - Precio a convertir
 * @returns {number} Valor numérico del precio, o NaN si la entrada es inválida
 */
export function parsePrecio(precio) {
  if (precio == null) return NaN;
  // Elimina todo lo que no sea dígito
  const onlyDigits = String(precio).replace(/[^0-9]/g, '');
  // Parsea en base 10
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
/**
 * Filtra una colección de productos basándose en múltiples criterios simultáneos.
 * 
 * Implementa una lógica de filtrado "AND" entre diferentes criterios,
 * pero "OR" dentro de criterios de selección múltiple (arrays).
 * 
 * Criterios soportados:
 * - Rango de precios (min/max)
 * - Formato (búsqueda parcial, insensible a mayúsculas)
 * - Artista (búsqueda exacta)
 * - Año (rango [min, max] o valor exacto)
 * - Etiqueta/Sello (búsqueda exacta)
 * - Calificación mínima (rating)
 * 
 * @param {Array<Object>} productos - Lista original de productos
 * @param {Object} [criteria] - Objeto de configuración de filtros
 * @param {number} [criteria.minPrecio] - Precio mínimo
 * @param {number} [criteria.maxPrecio] - Precio máximo
 * @param {string|string[]} [criteria.formato] - Uno o más formatos permitidos
 * @param {string|string[]} [criteria.artista] - Uno o más artistas permitidos
 * @param {number|number[]} [criteria.anio] - Año exacto o rango [min, max]
 * @param {string|string[]} [criteria.etiqueta] - Una o más etiquetas permitidas
 * @param {number} [criteria.minRating] - Calificación mínima requerida (0-5)
 * 
 * @returns {Array<Object>} Subconjunto de productos que cumplen TODOS los criterios
 */
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

/**
 * Helper interno: Normaliza cualquier valor a un array.
 * 
 * - null/undefined -> []
 * - array -> array original
 * - valor único -> [valor]
 * 
 * @param {any} val - Valor a normalizar
 * @returns {Array} Array resultante
 */
function normalizeToArray(val) {
  if (val == null) return [];
  return Array.isArray(val) ? val : [val];
}

export default {
  parsePrecio,
  filterProducts,
};

