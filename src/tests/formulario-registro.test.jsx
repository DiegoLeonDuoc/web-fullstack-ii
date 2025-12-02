import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { act } from 'react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import FormularioRegistro from '../components/FormularioRegistro';
import Storage from '../utils/UserStorage';

// Simulamos el flujo completo del formulario de registro para que los escenarios clave no se rompan.
describe('FormularioRegistro DOM (Vitest)', () => {
  let saveUserSpy;

  beforeEach(() => {
    saveUserSpy = vi.spyOn(Storage, 'saveUser');
  });

  afterEach(() => {
    cleanup();
    saveUserSpy.mockRestore();
    localStorage.clear();
  });

  const LocationDisplay = () => {
    const location = useLocation();
    return <span data-testid="router-location">{location.pathname}</span>;
  };

  const renderForm = () =>
    render(
      <MemoryRouter initialEntries={['/registro']}>
        <Routes>
          <Route
            path="/registro"
            element={
              <>
                <FormularioRegistro />
                <LocationDisplay />
              </>
            }
          />
          <Route path="/login" element={<span data-testid="login-marker">Login</span>} />
        </Routes>
      </MemoryRouter>
    );

  it('enfoca el primer campo invalido cuando faltan datos obligatorios', async () => {
    renderForm();

    await userEvent.type(screen.getByLabelText(/edad/i), '30');
    await userEvent.type(screen.getByLabelText(/nombre/i), 'Juan');
    await userEvent.type(screen.getByLabelText(/apellido/i), 'Perez');
    await userEvent.type(screen.getByLabelText(/tel/i), '+56 9 1234 5678');
    await userEvent.type(screen.getByLabelText(/correo/i), 'user@example.com');
    await userEvent.type(screen.getByLabelText(/contrase/i), 'Aa1!aaaa');

    const form = document.getElementById('registerForm');
    await act(async () => {
      fireEvent.submit(form);
    });

    expect(document.activeElement?.id).toBe('rut');
    expect(saveUserSpy).not.toHaveBeenCalled();
    expect(screen.getByTestId('router-location').textContent).toBe('/registro');
  });

  it('guarda un usuario valido y navega al login', async () => {
    saveUserSpy.mockResolvedValue({
      success: true,
      user: { id: 99, email: 'user@example.com' },
    });

    renderForm();

    await userEvent.type(screen.getByLabelText(/rut/i), '12.345.678-5');
    await userEvent.type(screen.getByLabelText(/edad/i), '30');
    await userEvent.type(screen.getByLabelText(/nombre/i), 'Juan');
    await userEvent.type(screen.getByLabelText(/apellido/i), 'Perez');
    await userEvent.type(screen.getByLabelText(/tel/i), '+56 9 1234 5678');
    await userEvent.type(screen.getByLabelText(/correo/i), 'user@example.com');
    await userEvent.type(screen.getByLabelText(/contrase/i), 'Aa1!aaaa');

    const submitButton = screen.getByRole('button', { name: /registrar/i });
    await waitFor(() => expect(submitButton.disabled).toBe(false));

    await act(async () => {
      await userEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(saveUserSpy).toHaveBeenCalledWith(expect.objectContaining({
        rut: '12.345.678-5',
        email: 'user@example.com',
      }));
    });

    await waitFor(() => {
      expect(screen.getByTestId('login-marker')).toBeDefined();
    });
  });
});
