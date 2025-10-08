import React from "react";
import { Form } from "react-bootstrap";
import '../styles/campos.css';

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