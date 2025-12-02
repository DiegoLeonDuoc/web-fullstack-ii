import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, afterEach, expect, vi } from 'vitest';
import CampoInput from '../components/CampoInput';

// Estos tests revisan que el input reusable respete lo que le pasamos y avise los cambios.
describe('CampoInput (Vitest)', () => {
  afterEach(() => cleanup());

  it('aplica correctamente las props de etiqueta y placeholder', () => {
    render(
      <CampoInput
        id="correo"
        name="email"
        label="Correo electrónico"
        placeholder="usuario@dominio.com"
      />
    );

    expect(screen.getByLabelText('Correo electrónico').getAttribute('placeholder'))
      .toBe('usuario@dominio.com');
  });

  it('dispara onChange cuando el usuario escribe', () => {
    const handleChange = vi.fn();
    render(
      <CampoInput
        id="nombre"
        name="firstName"
        label="Nombre"
        onChange={handleChange}
      />
    );

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana' } });
    expect(handleChange).toHaveBeenCalled();
  });
});
