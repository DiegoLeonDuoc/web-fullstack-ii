import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as CartStorage from '../utils/CartStorage';

const fetchMock = vi.fn();
let currentUser = { rut: '123', token: 'abc' };

vi.mock('../utils/UserStorage', () => ({
  __esModule: true,
  default: {
    getCurrentUser: () => currentUser,
  },
  getCurrentUser: () => currentUser,
}));

describe('CartStorage (backend)', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
    currentUser = { rut: '123', token: 'abc' };
  });

  it('retorna [] si no hay usuario autenticado', async () => {
    currentUser = null;
    const res = await CartStorage.loadCart();
    expect(res).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('loadCart devuelve lista mapeada cuando el backend responde ok', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        itemsCarrito: [{ sku: 'p1', cantidad: 2, id: 10 }],
      }),
    });
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ titulo: 'Disco Uno', precio: 5000, urlImagen: '/img/1.png', nombreFormato: 'CD', artista: { nombreArtista: 'Artista A' } }),
    });

    const cart = await CartStorage.loadCart();

    expect(fetchMock).toHaveBeenCalledWith('/api/v1/carritos/123', expect.any(Object));
    expect(cart).toEqual([
      expect.objectContaining({ id: 'p1', qty: 2, titulo: 'Disco Uno', precio: 5000 }),
    ]);
  });

  it('addToCart publica item y mapea respuesta', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        itemsCarrito: [{ sku: 'p1', cantidad: 1, id: 5 }],
      }),
    });
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ titulo: 'Album', precio: 1000, urlImagen: '/img', nombreFormato: 'CD', artista: { nombreArtista: 'Banda' } }),
    });

    const res = await CartStorage.addToCart({ id: 'p1', precio: 1000 }, 1);

    expect(fetchMock).toHaveBeenCalledWith('/api/v1/carritos/123/items', expect.objectContaining({ method: 'POST' }));
    expect(res[0]).toMatchObject({ id: 'p1', qty: 1, titulo: 'Album' });
  });

  it('updateItemQty hace PUT sobre item y retorna carrito actualizado', async () => {
    // Primera llamada: obtener carrito actual
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ itemsCarrito: [{ sku: 'p1', cantidad: 1, id: 77 }] }),
    });
    // Segunda: actualizar cantidad
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ itemsCarrito: [{ sku: 'p1', cantidad: 3, id: 77 }] }),
    });
    // Tercera: obtener producto
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ titulo: 'Album', precio: 1000, urlImagen: '/img', nombreFormato: 'CD', artista: { nombreArtista: 'Banda' } }),
    });

    const res = await CartStorage.updateItemQty('p1', 3);

    expect(fetchMock).toHaveBeenCalledWith('/api/v1/carritos/123/items/77', expect.objectContaining({ method: 'PUT' }));
    expect(res[0]).toMatchObject({ qty: 3 });
  });

  it('updateItemQty limita la cantidad minima a 1 cuando se entrega un valor negativo', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ itemsCarrito: [{ sku: 'p1', cantidad: 2, id: 11 }] }),
    });
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ itemsCarrito: [{ sku: 'p1', cantidad: 1, id: 11 }] }),
    });
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ titulo: 'Album', precio: 1000, urlImagen: '/img', nombreFormato: 'CD', artista: { nombreArtista: 'Banda' } }),
    });
    
    const res = await CartStorage.updateItemQty('p1', -10);
    // Cambiar -10 por 1 en la siguiente línea para que la prueba pase correctamente
    expect(res[0].qty,'FALLA A PROPÓSITO: el código actual normaliza la cantidad a 1, ' + 'pero esta prueba espera que conserve el valor negativo (-10).'
          ).toBe(-10);
  });


  it('removeItem hace DELETE y retorna carrito sin el item', async () => {
    // Obtener carrito actual
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ itemsCarrito: [{ sku: 'p1', cantidad: 1, id: 55 }] }),
    });
    // Eliminar item
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ itemsCarrito: [] }),
    });

    const res = await CartStorage.removeItem('p1');

    expect(fetchMock).toHaveBeenCalledWith('/api/v1/carritos/123/items/55', expect.objectContaining({ method: 'DELETE' }));
    expect(res).toEqual([]);
  });
});

describe('CartStorage (errores)', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
    currentUser = { rut: '123', token: 'abc' };
  });

  it('addToCart devuelve [] y no lanza si falta usuario', async () => {
    currentUser = null;
    const res = await CartStorage.addToCart({ id: 'p1' }, 1);
    expect(res).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('updateItemQty devuelve [] si backend no encuentra item', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ itemsCarrito: [] }) });
    const res = await CartStorage.updateItemQty('p1', 2);
    expect(res).toEqual([]);
  });

  it('removeItem devuelve [] si backend no encuentra item', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ itemsCarrito: [] }) });
    const res = await CartStorage.removeItem('missing');
    expect(res).toEqual([]);
  });
});
