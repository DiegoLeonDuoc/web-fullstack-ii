import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CampoInput from "./CampoInput";
import AdvertenciaCampo from "./AdvertenciaCampo";
import {
  isValidEmail,
  isRutFormat,
  isValidRut,
  isValidPassword,
  isValidAge,
} from "../utils/Validaciones";
import Storage from '../utils/UserStorage'

/**
 * Formulario de registro de usuario con validaciones en vivo.
 * @returns {JSX.Element}
 */
function FormularioRegistro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rut: "",
    age: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });

  // ---- validation state -------------------------------------------------
  const [valid, setValid] = useState({
    rut: null,
    age: null,
    email: null,
    password: null,
  });

  // ---- warning messages (only for display) -----------------------------
  const [warnings, setWarnings] = useState({
    rut: "",
    age: "",
    email: "",
    password: "",
  });

  // ----------------------------------------------------------------------
  // Maneja cambios actualizando el estado del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // recompute validity on every relevant change
  // Recalcula banderas de validez cada vez que cambien estos campos
  useEffect(() => {
    setValid({
      rut: formData.rut ? isRutFormat(formData.rut) && isValidRut(formData.rut) : null,
      age: formData.age ? isValidAge(formData.age) : null,
      email: formData.email ? isValidEmail(formData.email) : null,
      password: formData.password ? isValidPassword(formData.password) : null,
    });
  }, [formData.rut, formData.age, formData.email, formData.password]);

  // keep warning texts in sync with the validity flags
  // Mantiene sincronizados los mensajes de advertencia con las banderas de validez
  useEffect(() => {
    setWarnings({
      rut: valid.rut === false ? "RUT inválido o con formato incorrecto." : "",
      age: valid.age === false ? "Edad inválida (debe estar entre 18 y 120)." : "",
      email: valid.email === false ? "Email inválido." : "",
      password:
        valid.password === false
          ? "Contraseña inválida. 8‑30 caracteres, minúscula, mayúscula, número y símbolo."
          : "",
    });
  }, [valid]);

  const isFormValid = valid.rut && valid.age && valid.email && valid.password;

  // const handleSubmit = (e) => {
  //   e.preventDefault();

    // If the form is somehow submitted while invalid, focus first error
  //   if (!isFormValid) {
  //     const firstInvalidKey = Object.keys(valid).find((k) => !valid[k]);
  //     const el = document.getElementById(firstInvalidKey);
  //     if (el) el.focus();
  //     return;
  //   }

  //   console.log("Submitting:", formData);
  //   navigate("/login");
  // };
  // Envío: si es válido, delega a Storage.saveUser que hashea la contraseña
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isFormValid) {
    const firstInvalidKey = Object.keys(valid).find((k) => !valid[k]);
    const el = document.getElementById(firstInvalidKey);
    if (el) el.focus();
    return;
  }

  try {
    // Guardar usuario en localStorage (hash de contraseña dentro)
    const result = await Storage.saveUser(formData);
    
    if (result.success) {
      console.log("Usuario registrado exitosamente:", result.user);
      navigate("/login");
    } else {
      // Mostrar error al usuario
      alert(result.error);
      console.error("Error en registro:", result.error);
    }
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    alert("Error al registrar usuario. Intente nuevamente.");
  }
};

  return (
    <Form id="registerForm" noValidate onSubmit={handleSubmit}>
      {/* RUT & Edad */}
      <Row className="form-row">
        <Col md={6}>
          <CampoInput
            id="rut"
            name="rut"
            label="RUT"
            placeholder="12.345.678-9"
            required
            value={formData.rut}
            onChange={handleChange}
            isInvalid={valid.rut === false}   // ← use validity directly
            isValid={valid.rut}
          />
          <AdvertenciaCampo message={warnings.rut} />
        </Col>

        <Col md={6}>
          <CampoInput
            id="age"
            name="age"
            type="number"
            label="Edad"
            placeholder="e.g. 30"
            min="0"
            required
            value={formData.age}
            onChange={handleChange}
            isInvalid={valid.age === false}
            isValid={valid.age}
          />
          <AdvertenciaCampo message={warnings.age} />
        </Col>
      </Row>

      {/* Nombre & Apellido */}
      <Row className="form-row">
        <Col md={6}>
          <CampoInput
            id="firstName"
            name="firstName"
            label="Nombre"
            placeholder="Nombre"
            required
            value={formData.firstName}
            onChange={handleChange}
            isValid={!!formData.firstName}
          />
        </Col>

        <Col md={6}>
          <CampoInput
            id="lastName"
            name="lastName"
            label="Apellido"
            placeholder="Apellido"
            required
            value={formData.lastName}
            onChange={handleChange}
            isValid={!!formData.lastName}
          />
        </Col>
      </Row>

      {/* Phone */}
      <CampoInput
        id="phone"
        name="phone"
        type="tel"
        label="Teléfono"
        placeholder="+56 9 1234 5678"
        required
        value={formData.phone}
        onChange={handleChange}
        isValid={!!formData.phone}
      />

      {/* Email */}
      <CampoInput
        id="email"
        name="email"
        type="email"
        label="Correo electrónico"
        placeholder="tu@correo.com"
        required
        value={formData.email}
        onChange={handleChange}
        isInvalid={valid.email === false}
        isValid={valid.email}
      />
      <AdvertenciaCampo message={warnings.email} />

      {/* Password */}
      <CampoInput
        id="password"
        name="password"
        type="password"
        label="Contraseña"
        placeholder="●●●●●●●●"
        required
        value={formData.password}
        onChange={handleChange}
        isInvalid={valid.password === false}
        isValid={valid.password}
      />
      <AdvertenciaCampo message={warnings.password} />

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        className="w-100 mt-3"
        disabled={!isFormValid}
      >
        Registrar
      </Button>
    </Form>
  );
}

export default FormularioRegistro;
