import dataProducto from './DataProducto';

// Devuelve el arreglo de productos con un campo "anio" numérico garantizado :)
const productos = dataProducto.map((p) => {
  let anio = p.anio;
  if (!(Number.isFinite(anio))) {
    const maybeYear = Object.values(p).find(
      (v) => typeof v === 'string' && /^\d{4}$/.test(v)
    );
    anio = maybeYear ? Number(maybeYear) : undefined;
  }
  return { ...p, anio };
});

export default productos;

