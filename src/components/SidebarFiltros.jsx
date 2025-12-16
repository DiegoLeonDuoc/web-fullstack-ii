import { useMemo, useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

/**
 * Barra lateral de filtros para el catálogo de productos.
 * 
 * Permite filtrar productos por múltiples criterios:
 * - Precio (mínimo y máximo)
 * - Formato (CD, Vinilo)
 * - Artista (lista dinámica basada en productos disponibles)
 * - Rango de años de lanzamiento
 * - Etiquetas/Sellos (lista dinámica)
 * - Calificación mínima
 * 
 * @param {Object} props
 * @param {Array<Object>} [props.productos=[]] - Lista completa de productos para extraer opciones de filtrado.
 * @param {Object} [props.initial={}] - Criterios iniciales (e.g. desde parámetros de URL).
 * @param {(criteria: Object) => void} props.onChange - Callback que se ejecuta cuando cambian los filtros.
 * @returns {JSX.Element} Panel de filtros
 */
export default function SidebarFiltros({ productos = [], initial = {}, onChange }) {
  // Estado local que mantiene los valores de los inputs del filtro
  const [criteria, setCriteria] = useState({
    minPrecio: '',
    maxPrecio: '',
    formato: [],      // Array para permitir selección múltiple
    artista: '',
    anioMin: '',
    anioMax: '',
    etiqueta: '',
    minRating: '',
    ...normalizeInitial(initial),
  });

  // Efecto que notifica al componente padre cuando cambian los criterios
  useEffect(() => {
    if (typeof onChange === 'function') {
      // Transforma el estado interno al formato esperado por la utilidad de filtrado
      onChange(toFilterCriteria(criteria));
    }
  }, [criteria]);

  // Si los criterios iniciales cambian externamente (ej: navegación), sincroniza el estado
  useEffect(() => {
    if (initial && Object.keys(initial).length > 0) {
      setCriteria((prev) => ({ ...prev, ...normalizeInitial(initial) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  // Memoriza las opciones derivadas de la lista de productos para evitar costosos recálculos
  const opciones = useMemo(() => buildOptions(productos), [productos]);

  /**
   * Alterna la selección de un formato (checkbox logic).
   * @param {string} value - Formato a alternar ('CD', 'Vinilo')
   */
  const toggleFormato = (value) => {
    setCriteria((prev) => {
      const set = new Set(prev.formato);
      if (set.has(value)) set.delete(value); else set.add(value);
      return { ...prev, formato: Array.from(set) };
    });
  };

  /**
   * Manejador genérico para inputs de texto y select.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCriteria((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Restablece todos los filtros a su estado vacío.
   */
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
          {[5, 4.5, 4, 3.5, 3].map((r) => (
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

/**
 * Deriva opciones únicas de artistas y etiquetas.
 * @param {Array<Object>} productos
 * @returns {{artistas: string[], etiquetas: string[]}}
 */
function buildOptions(productos) {
  const artistas = Array.from(new Set(productos.map((p) => p.artista).filter(Boolean))).sort();
  const etiquetas = Array.from(new Set(productos.map((p) => p.etiqueta).filter(Boolean))).sort();
  return { artistas, etiquetas };
}

/**
 * Normaliza criterios iniciales para el estado del UI.
 * @param {Object} initial
 * @returns {Object}
 */
function normalizeInitial(initial) {
  const c = { ...initial };
  if (Array.isArray(c.formato)) c.formato = [...c.formato];
  if (typeof c.formato === 'string') c.formato = [c.formato];
  if (typeof c.minRating === 'number') c.minRating = String(c.minRating);
  return c;
}

/**
 * Transforma el estado del UI en criterios consumibles por el filtro.
 * @param {Object} ui - Estado del UI de filtros.
 * @returns {Object} Criterios para filterProducts.
 */
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
