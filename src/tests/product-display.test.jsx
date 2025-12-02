import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import TarjetaProducto from '../components/TarjetaProducto';
import ProductTable from '../components/ProductTable';
import FilaDeProductos from '../components/FilaDeProductos';

describe('TarjetaProducto', () => {
  const producto = {
    id: 'abc',
    titulo: 'Album X',
    artista: 'Banda Y',
    formato: 'CD',
    precio: 12990,
    img: '/img/cd.png',
    alt: 'Album X',
  };

  it('muestra titulo completo y precio formateado', () => {
    render(
      <MemoryRouter>
        <TarjetaProducto producto={producto} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Banda Y - Album X/i)).toBeInTheDocument();
    expect(screen.getByText(/\$[\d.]+/)).toBeInTheDocument();
  });
});

describe('ProductTable', () => {
  it('renderiza mensaje cuando no hay productos', () => {
    render(<ProductTable products={[]} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText(/no hay productos registrados/i)).toBeInTheDocument();
  });
});

describe('FilaDeProductos', () => {
  it('renderiza tarjetas para la lista entregada', () => {
    const productos = [
      { id: 'p1', titulo: 'Disco Uno', artista: 'Artista A', formato: 'CD', precio: 1000, img: '/img/1.png' },
      { id: 'p2', titulo: 'Disco Dos', artista: 'Artista B', formato: 'Vinilo', precio: 2000, img: '/img/2.png' },
    ];

    render(
      <MemoryRouter>
        <FilaDeProductos productos={productos} />
      </MemoryRouter>
    );

    expect(screen.getAllByText(/Disco/).length).toBe(2);
  });
});
