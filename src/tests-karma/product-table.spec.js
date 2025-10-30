import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import ProductTable from "../components/ProductTable";

// Revisamos que la tabla pinte todas las filas y dispare los botones de editar/eliminar.
describe("ProductTable (Jasmine)", () => {
  afterEach(() => {
    cleanup();
  });

  it("renderiza todas las filas para los productos entregados", () => {
    const productos = [
      { id: "p1", titulo: "Disco Uno", artista: "Artista A", formato: "CD", anio: 2020, etiqueta: "Label", precio: "$9.990", img: "/img/1.png" },
      { id: "p2", titulo: "Disco Dos", artista: "Artista B", formato: "Vinilo", anio: 1999, etiqueta: "Label", precio: "$12.990", img: "/img/2.png" },
    ];

    render(
      <ProductTable
        products={productos}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );

    productos.forEach((producto) => {
      expect(screen.getByText(producto.titulo)).toBeDefined();
      expect(screen.getByText(producto.artista)).toBeDefined();
    });
  });

  it("propaga eventos de editar y eliminar a traves de las props", () => {
    const productos = [
      { id: "p1", titulo: "Disco Evento", artista: "Artista Evento", formato: "CD", anio: 2020, etiqueta: "Label", precio: "$9.990", img: "/img/1.png" },
    ];
    const onEdit = jasmine.createSpy("onEdit");
    const onDelete = jasmine.createSpy("onDelete");

    render(
      <ProductTable
        products={productos}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /editar/i }));
    fireEvent.click(screen.getByRole('button', { name: /eliminar/i }));

    expect(onEdit).toHaveBeenCalledWith(productos[0]);
    expect(onDelete).toHaveBeenCalledWith(productos[0].id);
  });
});
