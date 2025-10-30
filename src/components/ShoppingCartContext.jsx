import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getCart, saveCart, addToCart, updateItemQty, removeItem, getCartTotal
} from '../utils/CartStorage';

const ShoppingCartContext = createContext();

export function ShoppingCartProvider({ children }) {
  const [cart, setCart] = useState(() => getCart());

  // Sync local changes
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  // Listen for cross-tab changes
  useEffect(() => {
    const syncCart = () => setCart(getCart());
    window.addEventListener('storage', syncCart);
    return () => {
      window.removeEventListener('storage', syncCart);
    };
  }, []);

  const contextValue = {
    cart,
    cartCount: cart.reduce((acc, item) => acc + (Number(item.qty)||0), 0),
    cartTotal: getCartTotal(),
    addItem: (product, qty=1) => setCart(addToCart(product, qty)),
    updateQty: (id, qty) => setCart(updateItemQty(id, qty)),
    removeItem: (id) => setCart(removeItem(id)),
    clearCart: () => setCart([])
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
