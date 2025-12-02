import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SidebarFiltros, { toFilterCriteria } from '../components/SidebarFiltros';

describe('SidebarFiltros integration', () => {
  const productos = [
    { id: 'p1', artista: 'Adele', etiqueta: 'XL', formato: 'Vinilo' },
    { id: 'p2', artista: 'Nirvana', etiqueta: 'DGC', formato: 'CD' },
  ];

  it('deriva opciones y notifica criterios al cambiar filtros', () => {
    const onChange = vi.fn();
    render(<SidebarFiltros productos={productos} onChange={onChange} />);

    fireEvent.change(screen.getByPlaceholderText(/mín/i), { target: { value: '1000' } });
    fireEvent.click(screen.getByLabelText(/Vinilo/i));
    fireEvent.change(screen.getByLabelText(/Artista/i), { target: { value: 'Adele' } });

    expect(onChange).toHaveBeenCalled();
    const lastCriteria = onChange.mock.calls.at(-1)[0];
    expect(lastCriteria).toMatchObject({ minPrecio: 1000, formato: ['Vinilo'], artista: 'Adele' });
  });

  it('limpia filtros con el botón correspondiente', () => {
    const onChange = vi.fn();
    render(<SidebarFiltros productos={productos} onChange={onChange} initial={{ minPrecio: 500 }} />);

    fireEvent.click(screen.getByRole('button', { name: /limpiar filtros/i }));

    const lastCriteria = onChange.mock.calls.at(-1)[0];
    expect(lastCriteria).toEqual({});
  });
});

describe('toFilterCriteria', () => {
  it('transforma el estado del UI en criterios de filtro', () => {
    const ui = {
      minPrecio: '1000',
      maxPrecio: '2000',
      formato: ['CD'],
      artista: 'Adele',
      anioMin: '1990',
      anioMax: '2020',
      etiqueta: 'XL',
      minRating: '4.5',
    };

    expect(toFilterCriteria(ui)).toEqual({
      minPrecio: 1000,
      maxPrecio: 2000,
      formato: ['CD'],
      artista: 'Adele',
      anio: [1990, 2020],
      etiqueta: 'XL',
      minRating: 4.5,
    });
  });
});
