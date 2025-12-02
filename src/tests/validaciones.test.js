import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidRut,
  isValidPassword,
  isValidAge,
  isValidPrice,
  normalizeRut,
  isRutFormat,
  computeRutDV,
} from '../utils/Utilidades';

// Mini batería para confirmar que las reglas de validación siguen respondiendo igual que en los formularios.
describe('Validaciones (Vitest)', () => {
  it('valida correos correctos y rechaza formatos invalidos', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('USER+tag@sub.domain.co')).toBe(true);
    expect(isValidEmail('bademail')).toBe(false);
    expect(isValidEmail('name@domain')).toBe(false);
    expect(isValidEmail('name@@domain.com')).toBe(false);
  });

  it('normaliza y valida formato de RUT', () => {
    expect(normalizeRut('12.345.678-9')).toBe('12345678-9');
    expect(isRutFormat('12345678-5')).toBe(true);
    expect(isRutFormat('12.345.678-5')).toBe(true);
    expect(isRutFormat('123456785')).toBe(false);
  });

  it('calcula digito verificador y valida RUT completo', () => {
    expect(computeRutDV('12345678')).toBe('5');
    expect(isValidRut('12345678-5')).toBe(true);
    expect(isValidRut('12345678-9')).toBe(false);
  });

  it('verifica contrasenas seguras', () => {
    expect(isValidPassword('StrongP@ss1')).toBe(true);
    expect(isValidPassword('Aa1!aaaa')).toBe(true);
    expect(isValidPassword('short1!')).toBe(false);
    expect(isValidPassword('alllowercase1!')).toBe(false);
    expect(isValidPassword('ALLUPPERCASE1!')).toBe(false);
    expect(isValidPassword('NoDigits!!')).toBe(false);
    expect(isValidPassword('NoSymbols11')).toBe(false);
  });

  it('valida edades dentro del rango permitido', () => {
    expect(isValidAge(25)).toBe(true);
    expect(isValidAge(18)).toBe(true);
    expect(isValidAge(120)).toBe(true);
    expect(isValidAge(17)).toBe(false);
    expect(isValidAge(130)).toBe(false);
  });

  it('valida precios mayores o iguales a 1000', () => {
    expect(isValidPrice(1000)).toBe(true);
    expect(isValidPrice('1500')).toBe(true);
    expect(isValidPrice(999)).toBe(false);
  });
});
