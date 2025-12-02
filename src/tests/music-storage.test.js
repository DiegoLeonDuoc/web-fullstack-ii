import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as MusicStorage from '../utils/MusicStorage';

const fetchMock = vi.fn();
let currentUser = { token: 'abc' };

vi.mock('../utils/UserStorage', () => ({
  __esModule: true,
  default: {
    getCurrentUser: () => currentUser,
  },
  getCurrentUser: () => currentUser,
}));

describe('MusicStorage (backend)', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
    localStorage.clear();
    currentUser = { token: 'abc' };
  });

  const setArtistAndLabelMocks = () => {
    fetchMock
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 1 }) }) // artista
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 2 }) }); // sello
  };

  it('getProducts mapea respuestas del backend y cachea', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        _embedded: {
          productoList: [
            {
              sku: 'p1',
              titulo: 'Album',
              artista: { nombreArtista: 'Artista' },
              sello: { nombreSello: 'Label' },
              nombreFormato: 'CD',
              urlImagen: '/img',
              anioLanzamiento: 2020,
              descripcion: 'desc',
              precio: 1000,
              calificacionPromedio: 4,
              conteoCalificaciones: 10,
              cantidadStock: 5,
            },
          ],
        },
      }),
    });

    const products = await MusicStorage.getProducts();
    expect(products[0]).toMatchObject({ id: 'p1', titulo: 'Album', artista: 'Artista', etiqueta: 'Label' });

    // segunda llamada debe usar cache y no llamar fetch si está fresco
    const again = await MusicStorage.getProducts();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(again[0].id).toBe('p1');
  });

  it('getProducts retorna [] cuando la API responde error', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock.mockResolvedValueOnce({ ok: false });
    const products = await MusicStorage.getProducts();
    expect(products).toEqual([]);
    errorSpy.mockRestore();
  });

  it('getProductById devuelve null si no está en cache y la API falla', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false });
    const res = await MusicStorage.getProductById('missing');
    expect(res).toBeNull();
  });

  it('addProduct envía datos mapeados y limpia cache', async () => {
    setArtistAndLabelMocks();
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ sku: 'new-id', titulo: 'Nuevo', artista: { nombreArtista: 'A' }, sello: { nombreSello: 'S' }, nombreFormato: 'CD', urlImagen: '/img', anioLanzamiento: 2024, descripcion: '', precio: 5000 }) });

    localStorage.setItem('music_products_cache', JSON.stringify({ timestamp: Date.now(), data: [{ id: 'cached' }] }));

    const created = await MusicStorage.addProduct({
      titulo: 'Nuevo',
      artista: 'A',
      etiqueta: 'S',
      formato: 'CD',
      img: '/img',
      anio: 2024,
      descripcion: '',
      precio: 5000,
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/v1/productos', expect.objectContaining({ method: 'POST' }));
    expect(created.id).toBe('new-id');
    expect(localStorage.getItem('music_products_cache')).toBeNull();
  });

  it('deleteProduct elimina y limpia cache', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    localStorage.setItem('music_products_cache', JSON.stringify({ timestamp: Date.now(), data: [] }));

    await MusicStorage.deleteProduct('p1');

    expect(fetchMock).toHaveBeenCalledWith('/api/v1/productos/p1', expect.objectContaining({ method: 'DELETE' }));
    expect(localStorage.getItem('music_products_cache')).toBeNull();
  });

  it('updateProduct lanza error si el producto no existe', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false });
    await expect(MusicStorage.updateProduct('p1', {})).rejects.toThrow('Product not found');
  });

  it('getProducts omite Authorization cuando no hay token', async () => {
    currentUser = null;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ _embedded: { productoList: [] } }),
    });
    await MusicStorage.getProducts();
    const [, options] = fetchMock.mock.calls[0];
    expect(options.headers.Authorization).toBeUndefined();
  });
});
