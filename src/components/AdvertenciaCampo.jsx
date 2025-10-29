import React from "react";

/**
 * Muestra un mensaje de advertencia debajo de un campo si existe.
 * @param {Object} props
 * @param {string} [props.message] - Mensaje a mostrar. Si está vacío, no renderiza nada.
 * @returns {JSX.Element|null}
 */
function AdvertenciaCampo({ message }) {
  if (!message) return null;
  return (
    <div
      className="field-warning"
      style={{ color: "#ff4d4f", marginBottom: "6px", fontSize: "0.9rem" }}
    >
      {message}
    </div>
  );
}

export default AdvertenciaCampo;