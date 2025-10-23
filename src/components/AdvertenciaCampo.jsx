import React from "react";

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