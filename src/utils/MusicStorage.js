// MusicStorage.js — Utilidades para gestión de productos musicales
// Maneja CRUD de productos, caché, y mapeo entre formato Frontend/Backend

import Storage from './UserStorage';

// URLs de las APIs del backend
const API_URL = '/api/v1/productos';
const ARTIST_API_URL = '/api/v1/artistas';
const SELLO_API_URL = '/api/v1/sellos';

/**
 * Obtiene las cabeceras de autenticación con el token JWT.
 * 
 * Centraliza la lógica de agregar el token a las peticiones HTTP.
 * 
 * @returns {Object} Objeto con cabeceras incluyendo Authorization si hay usuario logueado
 */
const getAuthHeaders = () => {
  const user = Storage.getCurrentUser();
  const headers = {
    'Content-Type': 'application/json'
  };
  if (user && user.token) {
    headers['Authorization'] = `Bearer ${user.token}`;
  }
  return headers;
};

/**
 * Mapea un producto del formato Backend al formato Frontend.
 * 
 * El backend usa nombres en español y objetos anidados (artista, sello).
 * El frontend usa nombres más simples y strings directos.
 * 
 * @param {Object} backendProduct - Producto en formato backend
 * @returns {Object} Producto en formato frontend
 * 
 * Transformaciones principales:
 * - sku -> id
 * - artista.nombreArtista -> artista (string)
 * - sello.nombreSello -> etiqueta (string)
 * - urlImagen -> img
 * - anioLanzamiento -> año
 * - calificacionPromedio -> rating
 * - cantidadStock -> stock
 */
const mapToFrontend = (backendProduct) => {
  return {
    id: backendProduct.sku,
    titulo: backendProduct.titulo,
    artista: backendProduct.artista ? backendProduct.artista.nombreArtista : 'Desconocido',
    etiqueta: backendProduct.sello ? backendProduct.sello.nombreSello : 'Desconocido',
    formato: backendProduct.nombreFormato,
    img: backendProduct.urlImagen,
    año: backendProduct.anioLanzamiento,
    descripcion: backendProduct.descripcion,
    precio: backendProduct.precio,
    rating: backendProduct.calificacionPromedio,
    ratingCount: backendProduct.conteoCalificaciones,
    stock: backendProduct.cantidadStock
  };
};

/**
 * Mapea un producto del formato Frontend al formato Backend.
 * 
 * **IMPORTANTE**: Esta función es asíncrona porque necesita buscar los IDs
 * de artista y sello en el backend antes de crear el producto.
 * 
 * @param {Object} frontendProduct - Producto en formato frontend
 * @returns {Promise<Object>} Producto en formato backend
 * 
 * @throws {Error} Si el artista o sello no existen en la base de datos
 * 
 * Proceso:
 * 1. Busca el artista por nombre -> obtiene ID
 * 2. Busca el sello por nombre -> obtiene ID
 * 3. Genera SKU si no existe
 * 4. Infiere tipo de formato (VINYL, CD, etc.)
 * 5. Retorna objeto listo para enviar al backend
 * 
 * Uso:
 * const backendProduct = await mapToBackend({
 *   titulo: 'Abbey Road',
 *   artista: 'The Beatles',  // Se busca el ID
 *   etiqueta: 'Apple Records'  // Se busca el ID
 * });
 */
const mapToBackend = async (frontendProduct) => {
  // Necesitamos resolver Artista y Sello a objetos con IDs
  let artista = await findArtistByName(frontendProduct.artista);
  if (!artista) {
    // Si no existe, lanzamos error - el admin debe crear el artista primero
    throw new Error(`Artista '${frontendProduct.artista}' no encontrado. Debe crearlo primero.`);
  }

  let sello = await getSelloByName(frontendProduct.etiqueta);
  if (!sello) {
    throw new Error(`Sello '${frontendProduct.etiqueta}' no encontrado. Debe crearlo primero.`);
  }

  return {
    sku: frontendProduct.id || generateId(frontendProduct.titulo, frontendProduct.formato),
    titulo: frontendProduct.titulo,
    artista: { id: artista.id }, // Backend espera objeto con ID
    sello: { id: sello.id }, // Backend espera objeto con ID
    nombreFormato: frontendProduct.formato,
    tipoFormato: inferTipoFormato(frontendProduct.formato),
    urlImagen: frontendProduct.img,
    anioLanzamiento: frontendProduct.año,
    descripcion: frontendProduct.descripcion,
    precio: frontendProduct.precio,
    cantidadStock: frontendProduct.stock || 0,
    calificacionPromedio: frontendProduct.rating || 0,
    conteoCalificaciones: frontendProduct.ratingCount || 0,
    estaDisponible: true
  };
};

/**
 * Infiere el tipo de formato basado en el nombre.
 * 
 * El backend requiere un enum específico: VINYL, CD, CASSETTE, DIGITAL.
 * Esta función lo deduce del texto ingresado por el usuario.
 * 
 * @param {string} formato - Nombre del formato (ej: "Vinilo 12\"", "CD")
 * @returns {string} Enum del backend: 'VINYL', 'CD', 'CASSETTE', o 'DIGITAL'
 */
const inferTipoFormato = (formato) => {
  const f = formato.toLowerCase();
  if (f.includes('vinilo') || f.includes('lp')) return 'VINYL';
  if (f.includes('cd')) return 'CD';
  if (f.includes('cassette')) return 'CASSETTE';
  return 'DIGITAL';
};

/**
 * Busca un artista por nombre en el backend.
 * 
 * Usado por mapToBackend para obtener el ID del artista.
 * 
 * @param {string} name - Nombre del artista a buscar
 * @returns {Promise<Object|null>} Objeto artista con ID, o null si no existe
 */
const findArtistByName = async (name) => {
  try {
    const res = await fetch(`${ARTIST_API_URL}/search?nombre=${encodeURIComponent(name)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching artist by name:', error);
    return null;
  }
};

/**
 * Busca un sello discográfico por nombre en el backend.
 * 
 * Usado por mapToBackend para obtener el ID del sello.
 * 
 * @param {string} name - Nombre del sello a buscar
 * @returns {Promise<Object|null>} Objeto sello con ID, o null si no existe
 */
export const getSelloByName = async (name) => {
  try {
    const res = await fetch(`${SELLO_API_URL}/search?nombre=${encodeURIComponent(name)}`, {
      headers: getAuthHeaders()
    });
    if (res.ok) return await res.json();
    return null;
  } catch (e) {
    return null;
  }
};

// Configuración de caché local
const CACHE_KEY = 'music_products_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos

/**
 * Inicializa el almacenamiento.
 * 
 * Función legacy mantenida por compatibilidad.
 * No hace nada porque usamos API backend en lugar de localStorage.
 */
export const initStorage = () => {
  // No-op para API
};

/**
 * Obtiene todos los productos desde la API con caché.
 * @returns {Promise<Array<Object>>} Lista de productos.
 */
/**
 * Obtiene todos los productos desde la API con estrategia de caché "stale-while-revalidate".
 * 
 * Estrategia de optimización:
 * 1. Revisa si hay datos en localStorage y si son recientes (< 5 min)
 * 2. Si el caché es válido, retorna inmediatamente (respuesta instantánea)
 * 3. Si no hay caché o expiró, consulta a la API backend
 * 4. Normaliza los datos recibidos y ordena por ID
 * 5. Actualiza el caché con los nuevos datos
 * 
 * @returns {Promise<Array<Object>>} Lista de productos en formato frontend
 */
export const getProducts = async () => {
  try {
    // 1. Revisar Caché
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        console.log('Sirviendo desde caché');
        return data; // Retorno rápido
      }
    }

    // 2. Obtener de API
    const res = await fetch(API_URL, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Error fetching products');
    const rawData = await res.json();

    // Manejar diferentes formatos de respuesta (HATEOAS vs Array directo)
    let list = [];
    if (Array.isArray(rawData)) {
      list = rawData;
    } else if (rawData._embedded && rawData._embedded.productoList) {
      list = rawData._embedded.productoList;
    }

    // Mapear a formato frontend
    const mappedData = list.map(mapToFrontend);

    // Ordenar por SKU para mantener orden consistente en la UI
    // Esto previene que los productos "salten" al recargar
    mappedData.sort((a, b) => {
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      return 0;
    });

    // 3. Guardar en Caché con timestamp actual
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data: mappedData
    }));

    return mappedData;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return []; // Retorna array vacío para no romper la UI
  }
};

/**
 * Obtiene un producto por su ID.
 * @param {string} id - ID del producto.
 * @returns {Promise<Object|null>} Producto encontrado o null.
 */
/**
 * Obtiene un producto específico por su ID (SKU).
 * 
 * Primero intenta buscarlo en el caché local para evitar latencia de red.
 * Si no está en caché o la llamada es explícita, consulta al backend.
 * 
 * @param {string} id - ID del producto (SKU)
 * @returns {Promise<Object|null>} Producto encontrado o null si no existe
 */
export const getProductById = async (id) => {
  // 1. Optimización: Buscar en caché local primero
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { timestamp, data } = JSON.parse(cached);
    // Solo usar caché si es reciente
    if (Date.now() - timestamp < CACHE_DURATION) {
      const found = data.find(p => p.id === id);
      if (found) return found;
    }
  }

  // 2. Si no está en caché, consultar API
  try {
    const res = await fetch(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    if (!res.ok) return null;

    // Convertir de backend -> frontend
    const backendProduct = await res.json();
    return mapToFrontend(backendProduct);
  } catch (error) {
    console.error(`Error buscando producto ${id}:`, error);
    return null;
  }
};

/**
 * Agrega un nuevo producto.
 * @param {Object} product - Producto a agregar.
 * @returns {Promise<Object>} Producto creado.
 */
/**
 * Agrega un nuevo producto al catálogo.
 * 
 * Requiere autenticación de administrador.
 * Se encarga de transformar los datos al formato del backend,
 * incluyendo la resolución de IDs de Artista y Sello.
 * 
 * @param {Object} product - Producto en formato frontend
 * @returns {Promise<Object>} Producto creado en formato frontend
 * 
 * @throws {Error} Si falla la validación o la API retorna error
 * 
 * Side effects:
 * - Inválida el caché de productos para forzar recarga en la próxima vista
 */
export const addProduct = async (product) => {
  // Transformar frontend -> backend (resuelve IDs de relaciones)
  const backendProduct = await mapToBackend(product);

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(backendProduct)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error creando producto: ${text}`);
  }

  const created = await res.json();

  // Invalidar Caché: importante para que el nuevo producto aparezca inmediatamente
  localStorage.removeItem(CACHE_KEY);

  return mapToFrontend(created);
};

/**
 * Actualiza un producto.
 * @param {string} id - Id del producto.
 * @param {Object} updated - Campos a actualizar.
 * @returns {Promise<Object>} Producto actualizado.
 */
/**
 * Actualiza un producto existente.
 * 
 * Patrón "Merge": Obtiene el producto actual, mezcla los cambios,
 * y envía el objeto completo actualizado.
 * 
 * @param {string} id - SKU del producto a actualizar
 * @param {Object} updated - Objeto con los campos modificados
 * @returns {Promise<Object>} Producto actualizado en formato frontend
 * 
 * @throws {Error} Si el producto no existe o falla la actualización
 */
export const updateProduct = async (id, updated) => {
  // 1. Obtener estado actual del producto desde el backend
  const currentRes = await fetch(`${API_URL}/${id}`, { headers: getAuthHeaders() });
  if (!currentRes.ok) throw new Error('Producto no encontrado');

  const currentBackend = await currentRes.json();
  const currentFrontend = mapToFrontend(currentBackend);

  // 2. Mezclar datos actuales con actualizaciones
  const merged = { ...currentFrontend, ...updated };

  // 3. Convertir a formato backend (resolviendo relaciones si cambiaron)
  const backendProduct = await mapToBackend(merged);

  // 4. Enviar actualización (PUT reemplaza recurso completo)
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(backendProduct)
  });

  if (!res.ok) throw new Error('Error actualizando producto');
  const result = await res.json();

  // Invalidar Caché para reflejar cambios
  localStorage.removeItem(CACHE_KEY);

  return mapToFrontend(result);
};

/**
 * Elimina un producto.
 * @param {string} id - Id del producto.
 * @returns {Promise<void>}
 */
/**
 * Elimina un producto permanentemente.
 * 
 * Requiere permisos de administrador.
 * 
 * @param {string} id - SKU del producto a eliminar
 * @returns {Promise<void>}
 * @throws {Error} Si falla la eliminación
 */
export const deleteProduct = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  if (!res.ok) throw new Error('Error al eliminar producto');

  // Invalidar Caché
  localStorage.removeItem(CACHE_KEY);
};

/**
 * Genera un ID (SKU) basado en el título y formato.
 * 
 * Crea un slug URL-friendly: "titulo-formato".
 * Ej: "Abbey Road" + "Vinilo" -> "abbey-road-vinilo"
 * 
 * @param {string} titulo - Título del álbum
 * @param {string} formato - Formato físico
 * @returns {string} ID generado
 */
export function generateId(titulo, formato) {
  const clean = (str) =>
    str
      .toLowerCase()
      .normalize("NFD") // Separar caracteres base de sus acentos
      .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
      .replace(/[^a-z0-9]+/g, "-") // Reemplazar caracteres especiales con guión
      .replace(/^-+|-+$/g, ""); // Eliminar guiones al inicio/final

  return `${clean(titulo)}-${clean(formato)}`;
}

// Métodos síncronos obsoletos - mantenidos por seguridad pero no deben usarse
export const saveProducts = () => { console.warn('saveProducts is deprecated'); };
