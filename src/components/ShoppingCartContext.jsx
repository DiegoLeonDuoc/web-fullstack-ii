import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  loadCart, getLocalCart, addToCart, updateItemQty, removeItem, getCartCount, getCartTotal
} from '../utils/CartStorage';

const ShoppingCartContext = createContext();

export function ShoppingCartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Cargar carrito al inicio
  useEffect(() => {
    const init = async () => {
      const data = await loadCart();
      setCart(data);
    };
    init();
  }, []);

  // Recargar carrito cuando cambia el estado de autenticación
  useEffect(() => {
    const handleAuthChange = async () => {
      const data = await loadCart();
      setCart(data);
    };

    window.addEventListener('authStateChanged', handleAuthChange);
    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const contextValue = {
    cart,
    cartCount: getCartCount(cart),
    cartTotal: getCartTotal(cart),
    addItem: async (product, qty = 1) => {
      const newCart = await addToCart(product, qty);
      setCart(newCart);
    },
    updateQty: async (id, qty) => {
      const newCart = await updateItemQty(id, qty);
      setCart(newCart);
    },
    removeItem: async (id) => {
      const newCart = await removeItem(id);
      setCart(newCart);
    },
    clearCart: () => setCart([]) // TODO: Implementar vaciar en backend
  };

  return (
    <ShoppingCartContext.Provider value={contextValue}>
      {children}
    </ShoppingCartContext.Provider>
  );
}

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}
