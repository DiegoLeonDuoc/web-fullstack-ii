// CartStorage.js — Utilidades para el carrito de compras

const CART_KEY = 'shopping_cart';

/** Obtiene el carrito actual del almacenamiento */
export function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

/** Guarda el carrito en almacenamiento */
export function saveCart(cartItems) {
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
}

/** Agrega un producto (o suma cantidad si ya existe) */
export function addToCart(product, qty = 1) {
  const cart = getCart();
  const idx = cart.findIndex((item) => item.id === product.id);
  if (idx >= 0) {
    cart[idx].qty += qty;
  } else {
    cart.push({ ...product, qty });
  }
  saveCart(cart);
  return cart;
}

/** Cambia la cantidad de un producto */
export function updateItemQty(productId, qty) {
  const cart = getCart();
  const idx = cart.findIndex((item) => item.id === productId);
  if (idx >= 0) {
    cart[idx].qty = Math.max(1, Number(qty));
    saveCart(cart);
  }
  return cart;
}

/** Elimina un producto del carrito */
export function removeItem(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
  return cart;
}

/** Obtiene la cantidad total de productos distintos (badge) */
export function getCartCount() {
  return getCart().reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
}

/** Obtiene el total en CLP de la compra */
export function getCartTotal() {
  return getCart().reduce((sum, item) => {
    const precio = Number((item.precio||'').replace(/[^\d]/g,''));
    return sum + (precio * (item.qty||1));
  }, 0);
}
