import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { Auth } from '../utils/Auth'
import Storage from '../utils/Storage'

describe('Auth hook', () => {
  beforeEach(() => {
    localStorage.clear()
    Storage.initializeStorage()
  })

  it('verifica estado inicial', () => {
    const { result } = renderHook(() => Auth())
    expect(result.current.isLoggedIn).toBe(false)
    expect(result.current.currentUser).toBe(null)
  })

  it('login actualiza estado', () => {
    const { result } = renderHook(() => Auth())
    const user = Storage.getUsers()[0]

    act(() => {
      result.current.login(user)
    })

    expect(Storage.isUserLoggedIn()).toBe(true)
  })

  it('logout limpia estado', () => {
    const { result } = renderHook(() => Auth())
    const user = Storage.getUsers()[0]

    act(() => {
      result.current.login(user)
      result.current.logout()
    })

    expect(Storage.isUserLoggedIn()).toBe(false)
  })
})
