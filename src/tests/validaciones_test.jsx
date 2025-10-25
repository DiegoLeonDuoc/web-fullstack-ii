import { describe, it, expect } from 'vitest';
import { isValidEmail, isRutFormat, computeRutDV, isValidPassword, isValidAge } from '../utils/Validaciones';

describe('Validaciones generales', () => {
  it('valida emails comunes', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('USER+tag@sub.domain.co')).toBe(true);
  });

  it('rechaza emails inválidos', () => {
    expect(isValidEmail('bad-email')).toBe(false);
    expect(isValidEmail('name@domain')).toBe(false);
    expect(isValidEmail('name@@domain.com')).toBe(false);
  });

  it('valida formato de RUT (NNNNNNNN-D)', () => {
    expect(isRutFormat('12345678-5')).toBe(true);
    expect(isRutFormat('12.345.678-5')).toBe(true);
    expect(isRutFormat('123456785')).toBe(false);
  });

  it('calcula DV de RUT correctamente', () => {
    // 12345678 => DV 5
    expect(computeRutDV('12345678')).toBe('5');
  });

  it('valida contraseña fuerte', () => {
    expect(isValidPassword('Aa1!aaaa')).toBe(true);
    expect(isValidPassword('short1!')).toBe(false); // muy corta
    expect(isValidPassword('alllowercase1!')).toBe(false);
    expect(isValidPassword('ALLUPPERCASE1!')).toBe(false);
    expect(isValidPassword('NoDigits!!')).toBe(false);
    expect(isValidPassword('NoSymbols11')).toBe(false);
  });

  it('valida edad [18,120]', () => {
    expect(isValidAge(18)).toBe(true);
    expect(isValidAge(120)).toBe(true);
    expect(isValidAge(17)).toBe(false);
    expect(isValidAge(130)).toBe(false);
  });
});

