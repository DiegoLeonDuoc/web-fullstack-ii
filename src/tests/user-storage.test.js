import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Storage from '../utils/UserStorage';

// Tests adaptados al storage conectado a API: se mockea fetch para simular respuestas.
describe('UserStorage (Vitest)', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('devuelve [] cuando no hay usuario autenticado', async () => {
    const users = await Storage.getUsers();
    expect(users).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('obtiene usuarios cuando hay token valido', async () => {
    localStorage.setItem(Storage.STORAGE_KEYS.CURRENT_USER, JSON.stringify({ token: 'abc123' }));
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ _embedded: { usuarioList: [{ id: 1, email: 'user@example.com' }] } }),
    });

    const users = await Storage.getUsers();

    expect(fetchMock).toHaveBeenCalledWith('/api/v1/usuarios', expect.any(Object));
    expect(users).toEqual([{ id: 1, email: 'user@example.com' }]);
  });

  it('guarda un nuevo usuario cuando la API responde OK', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 99, email: 'ana.torres@example.com' }),
    });

    const res = await Storage.saveUser({
      rut: '22.333.444-5',
      age: '28',
      firstName: 'Ana',
      lastName: 'Torres',
      phone: '+56 9 5555 5555',
      email: 'ana.torres@example.com',
      password: 'Password123!',
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/v1/usuarios', expect.objectContaining({
      method: 'POST',
    }));
    expect(res).toEqual({ success: true, user: { id: 99, email: 'ana.torres@example.com' } });
  });

  it('propaga errores cuando la API rechaza el registro', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false });

    const res = await Storage.saveUser({
      rut: '22.333.444-5',
      age: '28',
      firstName: 'Ana',
      lastName: 'Torres',
      phone: '+56 9 5555 5555',
      email: 'ana.torres@example.com',
      password: 'Password123!',
    });

    expect(res.success).toBe(false);
  });

  it('login y logout actualizan la sesion', () => {
    const user = { id: 1, token: 'abc123' };
    const login = Storage.loginUser(user);
    expect(login.success).toBe(true);
    expect(Storage.isUserLoggedIn()).toBe(true);
    expect(Storage.getCurrentUser()?.id).toBe(1);

    const logout = Storage.logoutUser();
    expect(logout.success).toBe(true);
    expect(Storage.isUserLoggedIn()).toBe(false);
  });
});
