import { describe, it, expect } from 'vitest'
import { isValidRut } from '../utils/Validaciones'

describe('Validador de Rut', () => {
    it('Comprueba rut correcto', () => {
        expect(isValidRut('12345678-5')).toBe(true)
    })

    it('Comprueba DV no match', () => {
        expect(isValidRut('12345678-9')).toBe(false)
    })
})
