import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useLocation } from '../features/location'
import LocationService from '../features/location/locationService'
import { AppContext } from '../store/AppContext'

const wrapper = ({ children }) => <AppContext>{children}</AppContext>

const mockCoords = { lat: 14.5995, lng: 120.9842 }

// ─── LocationService ───────────────────────────────────────────
describe('Module 3 — LocationService', () => {
  it('exports getCurrentPosition function', () => {
    expect(typeof LocationService.getCurrentPosition).toBe('function')
  })

  it('getCurrentPosition resolves with lat and lng on success', async () => {
    vi.spyOn(navigator.geolocation, 'getCurrentPosition').mockImplementation((success) =>
      success({ coords: { latitude: 14.5995, longitude: 120.9842 } })
    )
    const result = await LocationService.getCurrentPosition()
    expect(result).toEqual({ lat: 14.5995, lng: 120.9842 })
  })

  it('getCurrentPosition rejects on geolocation error', async () => {
    vi.spyOn(navigator.geolocation, 'getCurrentPosition').mockImplementation((_, error) =>
      error({ code: 1, message: 'Permission denied' })
    )
    await expect(LocationService.getCurrentPosition()).rejects.toThrow()
  })

  it('handles missing geolocation API gracefully', async () => {
    const original = navigator.geolocation
    Object.defineProperty(navigator, 'geolocation', { value: undefined, configurable: true })
    await expect(LocationService.getCurrentPosition()).rejects.toThrow()
    Object.defineProperty(navigator, 'geolocation', { value: original, configurable: true })
  })
})

// ─── useLocation Hook ──────────────────────────────────────────
describe('Module 3 — useLocation hook', () => {
  beforeEach(() => {
    vi.spyOn(navigator.geolocation, 'getCurrentPosition').mockImplementation((success) =>
      success({ coords: { latitude: mockCoords.lat, longitude: mockCoords.lng } })
    )
  })

  afterEach(() => vi.restoreAllMocks())

  it('returns isLocating true initially', () => {
    const { result } = renderHook(() => useLocation(), { wrapper })
    expect(result.current.isLocating).toBe(true)
  })

  it('returns location after successful geolocation', async () => {
    const { result } = renderHook(() => useLocation(), { wrapper })
    await waitFor(() => expect(result.current.isLocating).toBe(false))
    expect(result.current.location).toEqual(mockCoords)
  })

  it('returns locationError when geolocation fails', async () => {
    vi.spyOn(navigator.geolocation, 'getCurrentPosition').mockImplementation((_, error) =>
      error({ code: 1, message: 'Permission denied' })
    )
    const { result } = renderHook(() => useLocation(), { wrapper })
    await waitFor(() => expect(result.current.isLocating).toBe(false))
    expect(result.current.locationError).not.toBeNull()
    expect(result.current.location).toBeNull()
  })

  it('exposes a retry function', () => {
    const { result } = renderHook(() => useLocation(), { wrapper })
    expect(typeof result.current.retry).toBe('function')
  })

  it('retry re-triggers geolocation request', async () => {
    const spy = vi.spyOn(navigator.geolocation, 'getCurrentPosition').mockImplementation((success) =>
      success({ coords: { latitude: mockCoords.lat, longitude: mockCoords.lng } })
    )
    const { result } = renderHook(() => useLocation(), { wrapper })
    await waitFor(() => expect(result.current.isLocating).toBe(false))
    act(() => result.current.retry())
    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('dispatches SET_LOCATION to AppContext on success', async () => {
    const { result } = renderHook(() => useLocation(), { wrapper })
    await waitFor(() => expect(result.current.location).not.toBeNull())
    expect(result.current.location).toEqual(mockCoords)
  })
})

// ─── index.js Public API ───────────────────────────────────────
describe('Module 3 — Location feature public API', () => {
  it('exports only useLocation from index.js', async () => {
    const exports = await import('../features/location/index.js')
    expect(exports).toHaveProperty('useLocation')
    // locationService should NOT be exported from index
    expect(exports).not.toHaveProperty('LocationService')
  })
})