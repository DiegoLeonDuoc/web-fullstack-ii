import { filterProducts, parsePrecio } from "../utils/Filters";

const mockProducts = [
  { id: "p1", precio: "$18.990", formato: "CD", artista: "Adele", anio: 2011, etiqueta: "XL", rating: 4.6 },
  { id: "p2", precio: "$12.000", formato: "Vinilo 12\" (180g)", artista: "Nirvana", anio: 1991, etiqueta: "DGC", rating: 4.8 },
  { id: "p3", precio: "$9.990", formato: "CD", artista: "Adele", anio: 2015, etiqueta: "XL", rating: 3.9 },
];

// Casos rápidos para confirmar que el filtrado da los mismos resultados que vemos en el catálogo.
describe("Utils/Filters (Jasmine)", () => {
  it("convierte precios con simbolos y separadores", () => {
    expect(parsePrecio("$18.990")).toBe(18990);
    expect(parsePrecio("12.000")).toBe(12000);
  });

  it("filtra por rango de precio", () => {
    const out = filterProducts(mockProducts, { minPrecio: 10000, maxPrecio: 15000 });
    expect(out.map((p) => p.id)).toEqual(["p2"]);
  });

  it("filtra por formato parcial", () => {
    const out = filterProducts(mockProducts, { formato: "Vinilo" });
    expect(out.map((p) => p.id)).toEqual(["p2"]);
  });

  it("filtra por artista exacto", () => {
    const out = filterProducts(mockProducts, { artista: "Adele" });
    expect(out.map((p) => p.id)).toEqual(["p1", "p3"]);
  });

  it("filtra por rango de anio", () => {
    const out = filterProducts(mockProducts, { anio: [1990, 2012] });
    expect(out.map((p) => p.id)).toEqual(["p1", "p2"]);
  });

  it("filtra por etiqueta y rating minimo", () => {
    const out = filterProducts(mockProducts, { etiqueta: "XL", minRating: 4 });
    expect(out.map((p) => p.id)).toEqual(["p1"]);
  });
});
