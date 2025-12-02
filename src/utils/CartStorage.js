// CartStorage.js — Implementación solo Backend
import Storage from './UserStorage';

const API_URL = '/api/v1/carritos';

// Helper para obtener headers con token
const getHeaders = () => {
  const user = Storage.getCurrentUser();
  return {
    'Content-Type': 'application/json',
    'Authorization': user ? `Bearer ${user.token}` : ''
  };
};

// Mapper Backend -> Frontend (async para fetch de productos)
const mapBackendCart = async (backendCart) => {
  if (!backendCart || !backendCart.itemsCarrito) return [];

  // Obtener detalles del producto para cada ítem
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
            artista: product.artista ? product.artista.nombreArtista : 'Desconocido'
          };
        }
      } catch (e) {
        console.error(`Error fetching product ${item.sku}:`, e);
      }
      // Fallback si falla la obtención del producto
      return {
        id: item.sku,
        qty: item.cantidad,
        titulo: 'Producto no disponible',
        precio: 0,
        img: '',
        formato: '',
        artista: ''
      };
    })
  );

  return itemsWithDetails;
};

// Carga el carrito desde backend
export async function loadCart() {
  const user = Storage.getCurrentUser();
  console.log(user);
  if (user && user.token && user.rut) {
    try {
      const res = await fetch(`${API_URL}/${user.rut}`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        //console.log(data)
        console.log('Loaded cart from backend:', data);
        return await mapBackendCart(data);
      }
    } catch (e) {
      console.error('Error loading cart from backend:', e);
    }
  }
  console.log('No user logged in, returning empty cart');
  return [];
}

// Agrega un producto al carrito
export async function addToCart(product, qty = 1) {
  const user = Storage.getCurrentUser();

  if (!user || !user.token || !user.rut) {
    console.error('Usuario no logueado, no se puede agregar al carrito');
    return [];
  }

  try {
    console.log(`Agregando producto ${product.id} al carrito para usuario ${user.rut}`);
    const res = await fetch(`${API_URL}/${user.rut}/items`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ sku: product.id, cantidad: qty })
    });
    console.log(res);
    if (res.ok) {
      const cart = await res.json();
      console.log(cart);
      console.log('Cart after add:', cart);
      return await mapBackendCart(cart);
    } else {
      console.error('Fallo al agregar al carrito:', res.status);
    }
  } catch (e) {
    console.error('Error agregando al carrito backend:', e);
  }

  return [];
}

// Actualiza la cantidad de un producto
export async function updateItemQty(productId, qty) {
  const user = Storage.getCurrentUser();
  const newQty = Math.max(1, Number(qty));

  if (!user || !user.token || !user.rut) {
    console.error('Usuario no logueado, no se puede actualizar carrito');
    return [];
  }

  try {
    // Obtener carrito para buscar ID del item
    const cartRes = await fetch(`${API_URL}/${user.rut}`, { headers: getHeaders() });
    if (cartRes.ok) {
      const cartData = await cartRes.json();
      const item = cartData.itemsCarrito.find(i => i.sku === productId);

      if (item) {
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

// Elimina un producto del carrito
export async function removeItem(productId) {
  const user = Storage.getCurrentUser();

  if (!user || !user.token || !user.rut) {
    console.error('Usuario no logueado, no se puede eliminar del carrito');
    return [];
  }

  try {
    // Obtener carrito para buscar ID del item
    const cartRes = await fetch(`${API_URL}/${user.rut}`, { headers: getHeaders() });
    if (cartRes.ok) {
      const cartData = await cartRes.json();
      const item = cartData.itemsCarrito.find(i => i.sku === productId);

      if (item) {
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

// Obtiene la cantidad total de productos (para badge)
export function getCartCount(cart) {
  if (!cart) return 0;
  return cart.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
}

// Obtiene el total en CLP
export function getCartTotal(cart) {
  if (!cart) return 0;
  return cart.reduce((sum, item) => {
    const precio = item.precio;
    return sum + (precio * (item.qty || 1));
  }, 0);
}

// Placeholder para compatibilidad (no usado en backend-only)
export function getLocalCart() {
  return [];
}
