import { describe, it, expect, beforeEach, vi } from 'vitest'
import Storage from '../utils/Storage'

describe('Storage', () => {
  beforeEach(() => {
    localStorage.clear()
    Storage.initializeStorage()
  })

  it('inicializa usuarios mock', () => {
    const users = Storage.getUsers()
    expect(users.length).toBeGreaterThan(0)
  })

  it('guarda un nuevo usuario', () => {
    const res = Storage.saveUser({
      rut: '22.333.444-5',
      age: '28',
      firstName: 'Ana',
      lastName: 'Torres',
      phone: '+56 9 5555 5555',
      email: 'ana.torres@example.com',
      password: 'Password123!'
    })
    expect(res.success).toBe(true)
  })

  it('evita duplicar email o rut', () => {
    const u = Storage.getUsers()[0]
    expect(Storage.saveUser({ ...u, email: u.email })).toEqual(
      expect.objectContaining({ success: false })
    )
    expect(Storage.saveUser({ ...u, rut: u.rut })).toEqual(
      expect.objectContaining({ success: false })
    )
  })

  it('login y logout funcionan', () => {
    const user = Storage.getUsers()[0]
    const login = Storage.loginUser(user)
    expect(login.success).toBe(true)
    expect(Storage.isUserLoggedIn()).toBe(true)

    const logout = Storage.logoutUser()
    expect(logout.success).toBe(true)
    expect(Storage.isUserLoggedIn()).toBe(false)
  })

  it('devuelve estadísticas correctas', () => {
    const stats = Storage.getStats()
    expect(stats.totalUsers).toBeGreaterThan(0)
    expect(typeof stats.averageAge).toBe('number')
  })
})
