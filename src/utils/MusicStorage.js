import Storage from './UserStorage';

const API_URL = '/api/v1/productos';
const ARTIST_API_URL = '/api/v1/artistas';
const SELLO_API_URL = '/api/v1/sellos';

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

// Mapper: Backend -> Frontend
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

// Mapper: Frontend -> Backend
// Note: This is async because we might need to fetch Artist/Sello IDs
const mapToBackend = async (frontendProduct) => {
  // We need to resolve Artist and Sello to objects with IDs
  let artista = await findArtistByName(frontendProduct.artista);
  if (!artista) {
    // Try to create or fail? For now, fail if not found, or maybe we can't create without admin
    // If we are admin (which we should be for addProduct), we could try to create.
    // For simplicity, let's assume they exist or we fail.
    // Or better, if we can't find it, we might send a dummy object but backend will likely reject.
    throw new Error(`Artista '${frontendProduct.artista}' no encontrado. Debe crearlo primero.`);
  }

  let sello = await findSelloByName(frontendProduct.etiqueta);
  if (!sello) {
    throw new Error(`Sello '${frontendProduct.etiqueta}' no encontrado. Debe crearlo primero.`);
  }

  return {
    sku: frontendProduct.id || generateId(frontendProduct.titulo, frontendProduct.formato),
    titulo: frontendProduct.titulo,
    artista: { id: artista.id }, // Send ID
    sello: { id: sello.id }, // Send ID
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

const inferTipoFormato = (formato) => {
  const f = formato.toLowerCase();
  if (f.includes('vinilo') || f.includes('lp')) return 'VINYL';
  if (f.includes('cd')) return 'CD';
  if (f.includes('cassette')) return 'CASSETTE';
  return 'DIGITAL';
};

// Helpers to find Artist/Sello
const findArtistByName = async (name) => {
  try {
    const res = await fetch(`${ARTIST_API_URL}/nombre/${encodeURIComponent(name)}`, {
      headers: getAuthHeaders()
    });
    if (res.ok) return await res.json();
    return null;
  } catch (e) {
    return null;
  }
};

const findSelloByName = async (name) => {
  try {
    const res = await fetch(`${SELLO_API_URL}/nombre/${encodeURIComponent(name)}`, {
      headers: getAuthHeaders()
    });
    if (res.ok) return await res.json();
    return null;
  } catch (e) {
    return null;
  }
};

const CACHE_KEY = 'music_products_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const initStorage = () => {
  // No-op for API
};

/**
 * Obtiene todos los productos desde la API con caché.
 * @returns {Promise<Array<Object>>} Lista de productos.
 */
export const getProducts = async () => {
  try {
    // 1. Check Cache
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        console.log('Serving from cache');
        return data;
      }
    }

    // 2. Fetch from API
    const res = await fetch(API_URL, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Error fetching products');
    const rawData = await res.json();

    let list = [];
    if (Array.isArray(rawData)) {
      list = rawData;
    } else if (rawData._embedded && rawData._embedded.productoList) {
      list = rawData._embedded.productoList;
    }

    const mappedData = list.map(mapToFrontend);

    // 3. Save to Cache
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data: mappedData
    }));

    return mappedData;
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * Obtiene un producto por su ID.
 * @param {string} id - ID del producto.
 * @returns {Promise<Object|null>} Producto encontrado o null.
 */
export const getProductById = async (id) => {
  // Try to find in cache first to avoid call if possible
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { timestamp, data } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      const found = data.find(p => p.id === id);
      if (found) return found;
    }
  }

  try {
    const res = await fetch(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    if (!res.ok) return null;
    const backendProduct = await res.json();
    return mapToFrontend(backendProduct);
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Agrega un nuevo producto.
 * @param {Object} product - Producto a agregar.
 * @returns {Promise<Object>} Producto creado.
 */
export const addProduct = async (product) => {
  const backendProduct = await mapToBackend(product);
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(backendProduct)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error creating product: ${text}`);
  }
  const created = await res.json();

  // Invalidate Cache
  localStorage.removeItem(CACHE_KEY);

  return mapToFrontend(created);
};

/**
 * Actualiza un producto.
 * @param {string} id - Id del producto.
 * @param {Object} updated - Campos a actualizar.
 * @returns {Promise<Object>} Producto actualizado.
 */
export const updateProduct = async (id, updated) => {
  // Fetch current
  const currentRes = await fetch(`${API_URL}/${id}`, { headers: getAuthHeaders() });
  if (!currentRes.ok) throw new Error('Product not found');
  const currentBackend = await currentRes.json();
  const currentFrontend = mapToFrontend(currentBackend);

  const merged = { ...currentFrontend, ...updated };
  const backendProduct = await mapToBackend(merged);

  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(backendProduct)
  });
  if (!res.ok) throw new Error('Error updating product');
  const result = await res.json();

  // Invalidate Cache
  localStorage.removeItem(CACHE_KEY);

  return mapToFrontend(result);
};

/**
 * Elimina un producto.
 * @param {string} id - Id del producto.
 * @returns {Promise<void>}
 */
export const deleteProduct = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Error deleting product');

  // Invalidate Cache
  localStorage.removeItem(CACHE_KEY);
};

export function generateId(titulo, formato) {
  const clean = (str) =>
    str
      .toLowerCase()
      .normalize("NFD") // remove accents
      .replace(/[\u0300-\u036f]/g, "") // remove diacritics
      .replace(/[^a-z0-9]+/g, "-") // replace non-alphanum with dash
      .replace(/^-+|-+$/g, ""); // trim leading/trailing dash

  return `${clean(titulo)}-${clean(formato)}`;
}

// Deprecated synchronous methods - kept for safety but should not be used
export const saveProducts = () => { console.warn('saveProducts is deprecated'); };
