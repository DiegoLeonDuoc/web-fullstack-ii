import React from "react";
import { Form } from "react-bootstrap";
import '../styles/campos.css';

/**
 * Campo de formulario reutilizable con estados de validación.
 * @param {Object} props
 * @param {string} props.id - Id del campo y control del formulario.
 * @param {string} props.name - Nombre del input.
 * @param {string} props.label - Etiqueta visible del campo.
 * @param {string} [props.type="text"] - Tipo de input (text, email, number, etc.).
 * @param {string} [props.placeholder] - Texto de ayuda.
 * @param {boolean} [props.required=false] - Si el campo es requerido.
 * @param {string|number} [props.min] - Valor mínimo (para number).
 * @param {string|number} [props.value] - Valor del input.
 * @param {(e: React.ChangeEvent<HTMLInputElement>) => void} [props.onChange] - Manejador de cambio.
 * @param {boolean} [props.isInvalid] - Marca el control como inválido.
 * @param {boolean} [props.isValid] - Marca el control como válido.
 * @returns {JSX.Element}
 */
function CampoInput({
  id,
  name,
  label,
  type = "text",
  placeholder,
  required = false,
  min,
  value,
  onChange,
  isInvalid,
  isValid, 
}) {
//     console.log(
//     `[CampoInput] ${id} – value: "${value}" | isInvalid: ${isInvalid} | isValid: ${isValid}`
//   );
  return (
    <Form.Group controlId={id} style={{marginBottom: '0.8rem'}}>
      <Form.Label>{label}</Form.Label>
      <Form.Control 
        className='campo'
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        min={min}
        value={value}
        onChange={onChange}
        isInvalid={!!isInvalid}
        isValid={!!isValid}
      />
    </Form.Group>
  );
}


export default CampoInput;