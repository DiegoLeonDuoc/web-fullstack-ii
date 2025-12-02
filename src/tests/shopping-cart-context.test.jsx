import React from 'react';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { ShoppingCartProvider, useShoppingCart } from '../components/ShoppingCartContext';

const cartState = vi.hoisted(() => ({ items: [] }));
const loadCartMock = vi.hoisted(() =>
  vi.fn(async () => [...cartState.items])
);
const addToCartMock = vi.hoisted(() =>
  vi.fn(async (product, qty = 1) => {
    const existing = cartState.items.find((item) => item.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cartState.items.push({ ...product, qty });
    }
    return [...cartState.items];
  })
);
const updateItemQtyMock = vi.hoisted(() =>
  vi.fn(async (id, qty) => {
    cartState.items = cartState.items.map((item) =>
      item.id === id ? { ...item, qty } : item
    );
    return [...cartState.items];
  })
);
const removeItemMock = vi.hoisted(() =>
  vi.fn(async (id) => {
    cartState.items = cartState.items.filter((item) => item.id !== id);
    return [...cartState.items];
  })
);
const getCartCountMock = vi.hoisted(() =>
  vi.fn((cart) => cart.reduce((sum, item) => sum + (Number(item.qty) || 0), 0))
);
const getCartTotalMock = vi.hoisted(() =>
  vi.fn((cart) =>
    cart.reduce((sum, item) => sum + (Number(item.precio) || 0) * (item.qty || 1), 0)
  )
);

vi.mock('../utils/CartStorage', () => ({
  loadCart: loadCartMock,
  addToCart: addToCartMock,
  updateItemQty: updateItemQtyMock,
  removeItem: removeItemMock,
  getCartCount: getCartCountMock,
  getCartTotal: getCartTotalMock,
  getLocalCart: vi.fn(() => []),
}));

function CartHarness() {
  const { cartCount, cartTotal, addItem, updateQty, removeItem, clearCart } = useShoppingCart();

  return (
    <div>
      <span data-testid="cart-count">{cartCount}</span>
      <span data-testid="cart-total">{cartTotal}</span>
      <button type="button" onClick={() => addItem({ id: 'track-1', precio: 1000 }, 1)} data-testid="add">
        agregar
      </button>
      <button type="button" onClick={() => updateQty('track-1', 3)} data-testid="update">
        actualizar
      </button>
      <button type="button" onClick={() => removeItem('track-1')} data-testid="remove">
        eliminar
      </button>
      <button type="button" onClick={clearCart} data-testid="clear">
        limpiar
      </button>
    </div>
  );
}

// Aseguramos que el contexto del carrito mantenga contador y operaciones basicas funcionando.
describe('ShoppingCartProvider (Vitest)', () => {
  let originalDispatch;
  beforeEach(() => {
    localStorage.clear();
    originalDispatch = window.dispatchEvent;
    window.dispatchEvent = vi.fn(() => true);
    cartState.items = [];
    loadCartMock.mockClear();
    addToCartMock.mockClear();
    updateItemQtyMock.mockClear();
    removeItemMock.mockClear();
    getCartCountMock.mockClear();
    getCartTotalMock.mockClear();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    window.dispatchEvent = originalDispatch;
  });

  it('actualiza el estado del carrito cuando se agregan y modifican productos', async () => {
    render(
      <ShoppingCartProvider>
        <CartHarness />
      </ShoppingCartProvider>
    );

    const count = () => screen.getByTestId('cart-count').textContent;

    fireEvent.click(screen.getByTestId('add'));
    await waitFor(() => expect(count()).toBe('1'));

    fireEvent.click(screen.getByTestId('update'));
    await waitFor(() => expect(count()).toBe('3'));

    fireEvent.click(screen.getByTestId('remove'));
    await waitFor(() => expect(count()).toBe('0'));
  });

  it('calcula totales y permite limpiar el carrito', async () => {
    render(
      <ShoppingCartProvider>
        <CartHarness />
      </ShoppingCartProvider>
    );

    const total = () => screen.getByTestId('cart-total').textContent;

    fireEvent.click(screen.getByTestId('add'));
    await waitFor(() => expect(total()).toBe('1000'));

    fireEvent.click(screen.getByTestId('update'));
    await waitFor(() => expect(total()).toBe('3000'));

    fireEvent.click(screen.getByTestId('clear'));
    await waitFor(() => {
      expect(total()).toBe('0');
      expect(screen.getByTestId('cart-count').textContent).toBe('0');
    });
  });
});
