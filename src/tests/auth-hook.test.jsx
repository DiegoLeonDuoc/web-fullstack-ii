import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { Auth } from '../utils/Auth';
import Storage from '../utils/UserStorage';

// Queremos asegurarnos de que el hook de auth siga manejando login/logout como esperamos.
describe('Auth hook (Vitest)', () => {
  beforeEach(() => {
    localStorage.clear();
    Storage.initializeStorage();
  });

  it('parte sin sesion activa', () => {
    const { result } = renderHook(() => Auth());
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.currentUser).toBeNull();
  });

  it('login actualiza el estado y la sesion', () => {
    const { result } = renderHook(() => Auth());
    const user = { id: 1, email: 'user@example.com', token: 'abc123' };

    act(() => {
      result.current.login(user);
    });

    expect(Storage.isUserLoggedIn()).toBe(true);
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.currentUser?.id).toBe(user.id);
  });

  it('logout limpia la sesion', () => {
    const { result } = renderHook(() => Auth());
    const user = Storage.getUsers()[0];

    act(() => {
      result.current.login(user);
      result.current.logout();
    });

    expect(Storage.isUserLoggedIn()).toBe(false);
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.currentUser).toBeNull();
  });
});
