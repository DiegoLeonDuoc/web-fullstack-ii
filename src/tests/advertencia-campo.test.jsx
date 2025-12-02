import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, afterEach, expect } from 'vitest';
import AdvertenciaCampo from '../components/AdvertenciaCampo';

// Probamos que la advertencia aparezca solo cuando realmente hay texto que mostrar.
describe('AdvertenciaCampo (Vitest)', () => {
  afterEach(() => cleanup());

  it('no renderiza mensaje cuando no existe contenido', () => {
    const { container } = render(<AdvertenciaCampo message="" />);
    expect(container.textContent).toBe('');
  });

  it('muestra el mensaje cuando se entrega', () => {
    render(<AdvertenciaCampo message="Campo obligatorio" />);
    expect(screen.getByText('Campo obligatorio')).toBeInTheDocument();
  });
});
