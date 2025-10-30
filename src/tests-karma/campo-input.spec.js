import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import CampoInput from "../components/CampoInput";

// Estos tests revisan que el input reusable respete lo que le pasamos y avise los cambios.
describe("CampoInput (Jasmine)", () => {
  afterEach(() => cleanup());

  it("aplica correctamente las props de etiqueta y placeholder", () => {
    render(
      <CampoInput
        id="correo"
        name="email"
        label="Correo electr�nico"
        placeholder="usuario@dominio.com"
      />
    );

    expect(screen.getByLabelText("Correo electr�nico").getAttribute("placeholder"))
      .toBe("usuario@dominio.com");
  });

  it("dispara onChange cuando el usuario escribe", () => {
    const handleChange = jasmine.createSpy("handleChange");
    render(
      <CampoInput
        id="nombre"
        name="firstName"
        label="Nombre"
        onChange={handleChange}
      />
    );

    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Ana" } });
    expect(handleChange).toHaveBeenCalled();
  });
});
