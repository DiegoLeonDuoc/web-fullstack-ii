/**
 * Renderiza íconos de estrellas (llenas/medias/vacías) según un valor 0-5.
 * @param {number} value - Valor del rating (admite medios puntos).
 * @returns {JSX.Element}
 */
const estrellas = (value) => {
  // rating: Cantidad de estrellas
  // Elige el máximo entre 0 y X
  // X es el mínimo entre 5 y la cantidad de estrellas dadas
  // Si no se entrega valor se calcula el min entre 5 y 0
  const rating = Math.max(0, Math.min(5, Number(value) || 0));
  // Cantidad de estrellas llenas. Número truncado
  const full = Math.floor(rating);
  // Posee mitad si el decimal es mayor a 0.5
  const half = rating % 1 >= 0.5;
  // Estrellas vacías = 5 - llenos - (medio o 0)
  const empty = 5 - full - (half ? 1 : 0);

  return (
    // Se rellena con full estrellas rellenas
    // Se agrega media estrella si half = 1
    // Se rellena el resto con vacías
    <>
      {[...Array(full)].map((_, i) => (
        <i key={`full-${i}`} className="fa fa-star" />
      ))}
      {half && <i className="fa fa-star-half-full" />}
      {[...Array(empty)].map((_, i) => (
        <i key={`empty-${i}`} className="fa fa-star-o" />
      ))}
    </>
  );
};

export default estrellas;