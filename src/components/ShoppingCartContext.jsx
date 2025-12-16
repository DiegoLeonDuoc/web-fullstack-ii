import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import {
  loadCart, getLocalCart, addToCart, updateItemQty, removeItem, getCartCount, getCartTotal
} from '../utils/CartStorage';

const ShoppingCartContext = createContext();

export function ShoppingCartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const updateTimers = useRef({});

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

  // Limpiar timers al desmontar
  useEffect(() => {
    return () => {
      Object.values(updateTimers.current).forEach(timer => clearTimeout(timer));
    };
  }, []);

  const updateQtyDebounced = useCallback((id, qty) => {
    // Validar contra stock disponible
    const item = cart.find(i => i.id === id);
    if (item && item.stock) {
      qty = Math.min(qty, item.stock);
    }
    qty = Math.max(1, qty); // Mínimo 1

    // Actualizar estado local inmediatamente para UI responsiva
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, qty } : item
    ));

    // Cancelar timer anterior si existe
    if (updateTimers.current[id]) {
      clearTimeout(updateTimers.current[id]);
    }

    // Programar actualización al backend después de 1 segundo
    updateTimers.current[id] = setTimeout(async () => {
      try {
        const newCart = await updateItemQty(id, qty);
        setCart(newCart);
      } catch (e) {
        console.error('Error updating cart:', e);
        // Recargar carrito en caso de error
        const data = await loadCart();
        setCart(data);
      }
      delete updateTimers.current[id];
    }, 1000);
  }, [cart]);

  const refreshCart = useCallback(async () => {
    const data = await loadCart();
    setCart(data);
  }, []);

  const contextValue = {
    cart,
    cartCount: getCartCount(cart),
    cartTotal: getCartTotal(cart),
    addItem: async (product, qty = 1) => {
      const newCart = await addToCart(product, qty);
      setCart(newCart);
    },
    updateQty: updateQtyDebounced,
    removeItem: async (id) => {
      const newCart = await removeItem(id);
      setCart(newCart);
    },
    refreshCart, // Exponer función para refrescar carrito
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
