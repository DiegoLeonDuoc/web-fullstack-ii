import { isValidEmail, isValidRut, isValidPassword, isValidAge, isValidPrice } from '../utils/Utilidades';

// Mini bateria para confirmar que las reglas de validacion siguen respondiendo igual que en los formularios.
describe("Validaciones (Jasmine)", () => {
  it("valida correos correctos y rechaza formatos invalidos", () => {
    expect(isValidEmail("user@example.com")).toBeTrue();
    expect(isValidEmail("USER+tag@sub.domain.co")).toBeTrue();
    expect(isValidEmail("bademail")).toBeFalse();
    expect(isValidEmail("name@domain")).toBeFalse();
    expect(isValidEmail("name@@domain.com")).toBeFalse();
  });

  it("normaliza y valida formato de RUT", () => {
    expect(normalizeRut("12.345.678-9")).toBe("12345678-9");
    expect(isRutFormat("12345678-5")).toBeTrue();
    expect(isRutFormat("12.345.678-5")).toBeTrue();
    expect(isRutFormat("123456785")).toBeFalse();
  });

  it("calcula digito verificador y valida RUT completo", () => {
    expect(computeRutDV("12345678")).toBe("5");
    expect(isValidRut("12345678-5")).toBeTrue();
    expect(isValidRut("12345678-9")).toBeFalse();
  });

  it("verifica contrasenas seguras", () => {
    expect(isValidPassword("StrongP@ss1")).toBeTrue();
    expect(isValidPassword("Aa1!aaaa")).toBeTrue();
    expect(isValidPassword("short1!")).toBeFalse();
    expect(isValidPassword("alllowercase1!")).toBeFalse();
    expect(isValidPassword("ALLUPPERCASE1!")).toBeFalse();
    expect(isValidPassword("NoDigits!!")).toBeFalse();
    expect(isValidPassword("NoSymbols11")).toBeFalse();
  });

  it("valida edades dentro del rango permitido", () => {
    expect(isValidAge(25)).toBeTrue();
    expect(isValidAge(18)).toBeTrue();
    expect(isValidAge(120)).toBeTrue();
    expect(isValidAge(17)).toBeFalse();
    expect(isValidAge(130)).toBeFalse();
  });
});
