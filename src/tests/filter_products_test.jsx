import { describe, it, expect } from 'vitest';
import { filterProducts, parsePrecio } from '../utils/Filters';

const mock = [
  { id: 'p1', precio: '$18.990', formato: 'CD', artista: 'Adele', anio: 2011, etiqueta: 'XL', rating: 4.6 },
  { id: 'p2', precio: '$12.000', formato: 'Vinilo 12" (180g)', artista: 'Nirvana', anio: 1991, etiqueta: 'DGC', rating: 4.8 },
  { id: 'p3', precio: '$9.990', formato: 'CD', artista: 'Adele', anio: 2015, etiqueta: 'XL', rating: 3.9 },
];

describe('Utils/Filters', () => {
  it('parsea precios con símbolos y puntos', () => {
    expect(parsePrecio('$18.990')).toBe(18990);
    expect(parsePrecio('12.000')).toBe(12000);
  });

  it('filtra por rango de precio', () => {
    const out = filterProducts(mock, { minPrecio: 10000, maxPrecio: 15000 });
    expect(out.map(p => p.id)).toEqual(['p1', 'p2']);
  });

  it('filtra por formato contiene', () => {
    const out = filterProducts(mock, { formato: 'Vinilo' });
    expect(out.map(p => p.id)).toEqual(['p2']);
  });

  it('filtra por artista exacto', () => {
    const out = filterProducts(mock, { artista: 'Adele' });
    expect(out.map(p => p.id)).toEqual(['p1', 'p3']);
  });

  it('filtra por año rango', () => {
    const out = filterProducts(mock, { anio: [1990, 2012] });
    expect(out.map(p => p.id)).toEqual(['p1', 'p2']);
  });

  it('filtra por etiqueta exacta y rating mínimo', () => {
    const out = filterProducts(mock, { etiqueta: 'XL', minRating: 4 });
    expect(out.map(p => p.id)).toEqual(['p1']);
  });
});

