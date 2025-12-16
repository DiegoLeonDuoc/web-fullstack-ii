// CartStorage.js — Gestión del Carrito (Implementación Backend)
// Maneja todas las operaciones del carrito sincronizadas con el servidor

import Storage from './UserStorage';

const API_URL = '/api/v1/carritos';

/**
 * Helper interno para obtener headers con token de autenticación.
 * @returns {Object} Headers HTTP con Content-Type y Authorization
 */
const getHeaders = () => {
  const user = Storage.getCurrentUser();
  return {
    'Content-Type': 'application/json',
    'Authorization': user ? `Bearer ${user.token}` : ''
  };
};

/**
 * Transforma el carrito del backend al formato usado por el frontend.
 * 
 * El backend retorna una lista de items con SKU y cantidad.
 * Esta función enriquece cada item buscando sus detalles (título, precio, img)
 * en la API de productos.
 * 
 * @param {Object} backendCart - Objeto carrito retornado por la API
 * @returns {Promise<Array<Object>>} Lista de items enriquecida con detalles de producto
 */
const mapBackendCart = async (backendCart) => {
  if (!backendCart || !backendCart.itemsCarrito) return [];

  // Obtener detalles del producto para cada ítem en paralelo
  const itemsWithDetails = await Promise.all(
    backendCart.itemsCarrito.map(async (item) => {
      try {
        const res = await fetch(`/api/v1/productos/${item.sku}`);
        if (res.ok) {
          const product = await res.json();
          return {
            id: item.sku,
            qty: item.cantidad,
            titulo: product.titulo,
            precio: product.precio,
            img: product.urlImagen,
            formato: product.nombreFormato,
            artista: product.artista ? product.artista.nombreArtista : 'Desconocido',
            stock: product.cantidadStock || 0
          };
        }
      } catch (e) {
        console.error(`Error fetching product ${item.sku}:`, e);
      }
      // Fallback: si falla la obtención del producto, mostrar placeholder
      return {
        id: item.sku,
        qty: item.cantidad,
        titulo: 'Producto no disponible',
        precio: 0,
        img: '',
        formato: '',
        artista: '',
        stock: 0
      };
    })
  );

  return itemsWithDetails;
};

/**
 * Carga el carrito del usuario actual desde el backend.
 * 
 * Requiere que el usuario esté logueado (tenga token y RUT).
 * 
 * @returns {Promise<Array<Object>>} Lista de productos en el carrito
 */
export async function loadCart() {
  const user = Storage.getCurrentUser();

  if (user && user.token && user.rut) {
    try {
      // GET /api/v1/carritos/{rut}
      const res = await fetch(`${API_URL}/${user.rut}`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return await mapBackendCart(data);
      }
    } catch (e) {
      console.error('Error loading cart from backend:', e);
    }
  }
  return [];
}

/**
 * Agrega un producto al carrito o incrementa su cantidad.
 * 
 * @param {Object} product - Producto a agregar (debe tener id/sku)
 * @param {number} qty - Cantidad a agregar (por defecto 1)
 * @returns {Promise<Array<Object>>} Nuevo estado del carrito
 */
export async function addToCart(product, qty = 1) {
  const user = Storage.getCurrentUser();

  if (!user || !user.token || !user.rut) {
    console.error('Usuario no logueado, no se puede agregar al carrito');
    return [];
  }

  try {
    // POST /api/v1/carritos/{rut}/items
    const res = await fetch(`${API_URL}/${user.rut}/items`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ sku: product.id, cantidad: qty })
    });

    if (res.ok) {
      const cart = await res.json();
      return await mapBackendCart(cart);
    } else {
      console.error('Fallo al agregar al carrito:', res.status);
    }
  } catch (e) {
    console.error('Error agregando al carrito backend:', e);
  }

  return [];
}

/**
 * Actualiza la cantidad de un producto específico en el carrito.
 * 
 * @param {string} productId - SKU del producto
 * @param {number} qty - Nueva cantidad (mínimo 1)
 * @returns {Promise<Array<Object>>} Nuevo estado del carrito
 */
export async function updateItemQty(productId, qty) {
  const user = Storage.getCurrentUser();
  const newQty = Math.max(1, Number(qty));

  if (!user || !user.token || !user.rut) {
    return [];
  }

  try {
    // 1. Obtener carrito actual para buscar ID interno del item
    const cartRes = await fetch(`${API_URL}/${user.rut}`, { headers: getHeaders() });
    if (cartRes.ok) {
      const cartData = await cartRes.json();
      const item = cartData.itemsCarrito.find(i => i.sku === productId);

      if (item) {
        // 2. PUT /api/v1/carritos/{rut}/items/{itemId}
        const res = await fetch(`${API_URL}/${user.rut}/items/${item.id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify({ cantidad: newQty })
        });
        if (res.ok) {
          const updatedCart = await res.json();
          return await mapBackendCart(updatedCart);
        }
      }
    }
  } catch (e) {
    console.error('Error actualizando carrito backend:', e);
  }

  return [];
}

/**
 * Elimina un producto del carrito.
 * 
 * @param {string} productId - SKU del producto a eliminar
 * @returns {Promise<Array<Object>>} Nuevo estado del carrito
 */
export async function removeItem(productId) {
  const user = Storage.getCurrentUser();

  if (!user || !user.token || !user.rut) {
    return [];
  }

  try {
    // 1. Obtener carrito para buscar ID interno
    const cartRes = await fetch(`${API_URL}/${user.rut}`, { headers: getHeaders() });
    if (cartRes.ok) {
      const cartData = await cartRes.json();
      const item = cartData.itemsCarrito.find(i => i.sku === productId);

      if (item) {
        // 2. DELETE /api/v1/carritos/{rut}/items/{itemId}
        const res = await fetch(`${API_URL}/${user.rut}/items/${item.id}`, {
          method: 'DELETE',
          headers: getHeaders()
        });
        if (res.ok) {
          const updatedCart = await res.json();
          return await mapBackendCart(updatedCart);
        }
      }
    }
  } catch (e) {
    console.error('Error eliminando del carrito backend:', e);
  }

  return [];
}

/**
 * Calcula la cantidad total de items en el carrito (para el badge).
 * 
 * @param {Array} cart - Estado actual del carrito
 * @returns {number} Suma de cantidades
 */
export function getCartCount(cart) {
  if (!cart) return 0;
  return cart.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
}

/**
 * Calcula el precio total del carrito.
 * 
 * @param {Array} cart - Estado actual del carrito
 * @returns {number} Suma total en CLP
 */
export function getCartTotal(cart) {
  if (!cart) return 0;
  return cart.reduce((sum, item) => {
    const precio = item.precio;
    return sum + (precio * (item.qty || 1));
  }, 0);
}

/**
 * @deprecated Función legacy para compatibilidad. Retorna siempre vacío.
 */
export function getLocalCart() {
  return [];
}
