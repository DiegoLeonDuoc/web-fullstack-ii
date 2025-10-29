/**
 * Renderiza íconos de estrellas (llenas/medias/vacías) según un valor 0-5.
 * @param {number} value - Valor del rating (admite medios puntos).
 * @returns {JSX.Element}
 */
const estrellas = (value) => {
    const full = Math.floor(value);
    const half = value % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
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