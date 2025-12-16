import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { loadCart, addToCart, updateItemQty, removeItem, getCartCount, getCartTotal } from '../utils/CartStorage';

const ShoppingCartContext = createContext();

/**
 * Proveedor de Contexto para el Carrito de Compras.
 * 
 * Gestiona el estado global del carrito y la sincronización con el backend.
 * Características principales:
 * - Persistencia en backend (vía CartStorage)
 * - Actualización optimista de la UI (cambio inmediato visual, persistencia diferida)
 * - Debouncing para actualizaciones de cantidad (evita exceso de peticiones)
 * - Sincronización automática al iniciar/cerrar sesión
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto
 */
export function ShoppingCartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Referencia para guardar temporizadores de debounce por ID de producto
  const updateTimers = useRef({});

  // Carga inicial del carrito al montar el componente
  useEffect(() => {
    const init = async () => {
      const data = await loadCart();
      setCart(data);
    };
    init();
  }, []);

  // Escuchar evento 'authStateChanged' para recargar carrito al login/logout
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

  // Limpieza de temporizadores pendientes al desmontar el componente
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(updateTimers.current).forEach(timer => clearTimeout(timer));
    };
  }, []);

  /**
   * Actualiza la cantidad de un item con debounce.
   * 
   * Estrategia de Debounce + UI Optimista:
   * 1. Actualiza el estado local inmediatamente (setCart) para que el input responda rápido.
   * 2. Cancela cualquier temporizador pendiente para este item.
   * 3. Crea un nuevo temporizador de 1 segundo.
   * 4. Si el usuario deja de escribir por 1s, se envía la petición al backend.
   * 
   * @param {string} id - SKU del producto
   * @param {number} qty - Nueva cantidad
   */
  const updateQtyDebounced = useCallback((id, qty) => {
    // 1. Validar contra stock máximo disponible
    const item = cart.find(i => i.id === id);
    if (item && item.stock) {
      qty = Math.min(qty, item.stock);
    }
    qty = Math.max(1, qty); // Mínimo siempre 1

    // 2. Actualización Optimista: Feedback instantáneo en UI
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, qty } : item
    ));

    // 3. Gestión del Debounce
    // Cancelar timer anterior si existe (usuario sigue escribiendo/clicando)
    if (updateTimers.current[id]) {
      clearTimeout(updateTimers.current[id]);
    }

    // Programar guardado en backend
    updateTimers.current[id] = setTimeout(async () => {
      try {
        const newCart = await updateItemQty(id, qty);
        setCart(newCart);
      } catch (e) {
        console.error('Error updating cart:', e);
        // Si falla, revertir al estado real del servidor
        const data = await loadCart();
        setCart(data);
      }
      delete updateTimers.current[id];
    }, 1000); // Esperar 1000ms de inactividad
  }, [cart]);

  /**
   * Fuerza una recarga completa del carrito desde el backend.
   */
  const refreshCart = useCallback(async () => {
    const data = await loadCart();
    setCart(data);
  }, []);

  const contextValue = {
    cart,
    cartCount: getCartCount(cart),
    cartTotal: getCartTotal(cart),

    // Wrapper para agregar item y actualizar estado
    addItem: async (product, qty = 1) => {
      const newCart = await addToCart(product, qty);
      setCart(newCart);
    },

    updateQty: updateQtyDebounced,

    // Wrapper para eliminar item y actualizar estado
    removeItem: async (id) => {
      const newCart = await removeItem(id);
      setCart(newCart);
    },

    refreshCart,
    clearCart: () => setCart([]) // TODO: Implementar vaciado real en backend
  };

  return (
    <ShoppingCartContext.Provider value={contextValue}>
      {children}
    </ShoppingCartContext.Provider>
  );
}

/**
 * Hook para consumir el contexto del carrito.
 * @returns {Object} { cart, cartCount, cartTotal, addItem, updateQty, removeItem, ... }
 */
export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}
