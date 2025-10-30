import React from "react";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { ShoppingCartProvider, useShoppingCart } from "../components/ShoppingCartContext";

function CartHarness() {
  const { cartCount, addItem, updateQty, removeItem } = useShoppingCart();

  return (
    <div>
      <span data-testid="cart-count">{cartCount}</span>
      <button type="button" onClick={() => addItem({ id: 'track-1', precio: '$1000' }, 1)} data-testid="add">
        agregar
      </button>
      <button type="button" onClick={() => updateQty('track-1', 3)} data-testid="update">
        actualizar
      </button>
      <button type="button" onClick={() => removeItem('track-1')} data-testid="remove">
        eliminar
      </button>
    </div>
  );
}

// Aseguramos que el contexto del carrito mantenga contador y operaciones basicas funcionando.
describe("ShoppingCartProvider (Jasmine)", () => {
  let originalDispatch;
  beforeEach(() => {
    localStorage.clear();
    originalDispatch = window.dispatchEvent;
    window.dispatchEvent = () => true;
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    window.dispatchEvent = originalDispatch;
  });

  it("actualiza el estado del carrito cuando se agregan y modifican productos", async () => {
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
});
