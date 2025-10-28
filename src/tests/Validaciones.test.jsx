import { describe, it, expect } from 'vitest'
import {
    isValidEmail,
    normalizeRut,
    isRutFormat,
    computeRutDV,
    isValidRut,
    isValidPassword,
    isValidAge
} from '../utils/Validaciones'

describe('Validaciones', () => {
    it('valida email correcto', () => {
        expect(isValidEmail('user@example.com')).toBe(true)
    })

    it('rechaza email inválido', () => {
        expect(isValidEmail('bademail')).toBe(false)
    })

    it('normaliza rut', () => {
        expect(normalizeRut('12.345.678-9')).toBe('12345678-9')
    })

    it('verifica formato de rut válido', () => {
        expect(isRutFormat('12345678-5')).toBe(true)
        expect(isRutFormat('12.345.678-5')).toBe(true)
    })

    it('calcula DV correcto', () => {
        expect(computeRutDV('12345678')).toBe('5')
    })

    it('valida rut completo', () => {
        expect(isValidRut('12345678-5')).toBe(true)
        expect(isValidRut('12345678-9')).toBe(false)
    })

    it('valida contraseña segura', () => {
        expect(isValidPassword('StrongP@ss1')).toBe(true)
        expect(isValidPassword('weak')).toBe(false)
    })

    it('valida edad', () => {
        expect(isValidAge(25)).toBe(true)
        expect(isValidAge(10)).toBe(false)
        expect(isValidAge(130)).toBe(false)
    })
})
