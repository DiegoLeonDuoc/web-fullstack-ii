import React, { useMemo, useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

// props:
// - productos: array para derivar opciones (artistas, etiquetas, años)
// - initial: criterios iniciales
// - onChange: (criteria) => void
export default function SidebarFiltros({ productos = [], initial = {}, onChange }) {
  const [criteria, setCriteria] = useState({
    minPrecio: '',
    maxPrecio: '',
    formato: [],
    artista: '',
    anioMin: '',
    anioMax: '',
    etiqueta: '',
    minRating: '',
    ...normalizeInitial(initial),
  });

  // Notificar cambios de criterios (no dependemos de la identidad de onChange)
  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(toFilterCriteria(criteria));
    }
  }, [criteria]);

  // Si cambian presets iniciales (por querystring), sincroniza el estado local una vez
  useEffect(() => {
    if (initial && Object.keys(initial).length > 0) {
      setCriteria((prev) => ({ ...prev, ...normalizeInitial(initial) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  const opciones = useMemo(() => buildOptions(productos), [productos]);

  const toggleFormato = (value) => {
    setCriteria((prev) => {
      const set = new Set(prev.formato);
      if (set.has(value)) set.delete(value); else set.add(value);
      return { ...prev, formato: Array.from(set) };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setCriteria({
      minPrecio: '',
      maxPrecio: '',
      formato: [],
      artista: '',
      anioMin: '',
      anioMax: '',
      etiqueta: '',
      minRating: '',
    });
  };

  return (
    <aside className="sidebar-filtros" aria-label="Filtros de productos">
      <h5>Filtros</h5>

      <div className="mb-3">
        <Form.Label>Precio</Form.Label>
        <div className="d-flex gap-2">
          <Form.Control
            type="number"
            inputMode="numeric"
            placeholder="Mín"
            name="minPrecio"
            value={criteria.minPrecio}
            onChange={handleChange}
          />
          <Form.Control
            type="number"
            inputMode="numeric"
            placeholder="Máx"
            name="maxPrecio"
            value={criteria.maxPrecio}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="mb-3">
        <Form.Label>Formato</Form.Label>
        <div className="d-flex flex-column">
          {['Vinilo', 'CD'].map((f) => (
            <Form.Check
              key={f}
              type="checkbox"
              id={`formato-${f}`}
              label={f}
              checked={criteria.formato.includes(f)}
              onChange={() => toggleFormato(f)}
            />
          ))}
        </div>
      </div>

      <div className="mb-3">
        <Form.Label htmlFor="artista">Artista</Form.Label>
        <Form.Select name="artista" id="artista" value={criteria.artista} onChange={handleChange}>
          <option value="">Todos</option>
          {opciones.artistas.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </Form.Select>
      </div>

      <div className="mb-3">
        <Form.Label>Año</Form.Label>
        <div className="d-flex gap-2">
          <Form.Control
            type="number"
            placeholder="Desde"
            name="anioMin"
            value={criteria.anioMin}
            onChange={handleChange}
          />
          <Form.Control
            type="number"
            placeholder="Hasta"
            name="anioMax"
            value={criteria.anioMax}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="mb-3">
        <Form.Label htmlFor="etiqueta">Etiqueta</Form.Label>
        <Form.Select name="etiqueta" id="etiqueta" value={criteria.etiqueta} onChange={handleChange}>
          <option value="">Todas</option>
          {opciones.etiquetas.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </Form.Select>
      </div>

      <div className="mb-3">
        <Form.Label htmlFor="minRating">Rating mínimo</Form.Label>
        <Form.Select name="minRating" id="minRating" value={criteria.minRating} onChange={handleChange}>
          <option value="">Cualquiera</option>
          {[5,4.5,4,3.5,3].map((r) => (
            <option key={r} value={r}>{r}+</option>
          ))}
        </Form.Select>
      </div>

      <div className="d-grid gap-2">
        <Button variant="secondary" onClick={handleReset}>Limpiar filtros</Button>
      </div>
    </aside>
  );
}

function buildOptions(productos) {
  const artistas = Array.from(new Set(productos.map((p) => p.artista).filter(Boolean))).sort();
  const etiquetas = Array.from(new Set(productos.map((p) => p.etiqueta).filter(Boolean))).sort();
  return { artistas, etiquetas };
}

function normalizeInitial(initial) {
  const c = { ...initial };
  if (Array.isArray(c.formato)) c.formato = [...c.formato];
  if (typeof c.formato === 'string') c.formato = [c.formato];
  if (typeof c.minRating === 'number') c.minRating = String(c.minRating);
  return c;
}

export function toFilterCriteria(ui) {
  const crit = {};
  if (ui.minPrecio !== '') crit.minPrecio = Number(ui.minPrecio);
  if (ui.maxPrecio !== '') crit.maxPrecio = Number(ui.maxPrecio);
  if (ui.formato && ui.formato.length) crit.formato = ui.formato;
  if (ui.artista) crit.artista = ui.artista;
  const min = ui.anioMin !== '' ? Number(ui.anioMin) : null;
  const max = ui.anioMax !== '' ? Number(ui.anioMax) : null;
  if (min != null || max != null) crit.anio = [min ?? max, max ?? min];
  if (ui.etiqueta) crit.etiqueta = ui.etiqueta;
  if (ui.minRating !== '') crit.minRating = Number(ui.minRating);
  return crit;
}
