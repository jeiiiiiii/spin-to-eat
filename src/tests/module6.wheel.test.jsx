import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WheelCommands } from '../features/wheel/wheelCommands'
import { useWheel } from '../features/wheel'
import SpinWheel from '../features/wheel/SpinWheel'
import { AppContext } from '../store/AppContext'
import * as soundManager from '../shared/utils/soundManager'

const wrapper = ({ children }) => <AppContext>{children}</AppContext>

const mockRestaurants = [
  { id: '1', name: 'Jollibee' },
  { id: '2', name: 'Yabu' },
  { id: '3', name: 'McDonalds' },
]

const baseState = {
  wheelRestaurants: mockRestaurants,
  isSpinning: false,
  winner: null,
  vetoedIds: []
}

// ─── WheelCommands ────────────────────────────────────────────
describe('Module 6 — WheelCommands (pure functions)', () => {
  it('spin sets isSpinning to true and clears winner', () => {
    const state = WheelCommands.spin({ ...baseState, winner: { id: '1' } })
    expect(state.isSpinning).toBe(true)
    expect(state.winner).toBeNull()
  })

  it('setWinner sets winner and isSpinning to false', () => {
    const restaurant = { id: '1', name: 'Jollibee' }
    const state = WheelCommands.setWinner({ ...baseState, isSpinning: true }, restaurant)
    expect(state.winner).toEqual(restaurant)
    expect(state.isSpinning).toBe(false)
  })

  it('removeRestaurant removes correct restaurant by id', () => {
    const state = WheelCommands.removeRestaurant(baseState, '2')
    expect(state.wheelRestaurants).toHaveLength(2)
    expect(state.wheelRestaurants.find(r => r.id === '2')).toBeUndefined()
  })

  it('removeRestaurant does not mutate original state', () => {
    const original = [...baseState.wheelRestaurants]
    WheelCommands.removeRestaurant(baseState, '1')
    expect(baseState.wheelRestaurants).toEqual(original)
  })

  it('respin clears winner and sets isSpinning to true', () => {
    const state = WheelCommands.respin({ ...baseState, winner: { id: '1' } })
    expect(state.winner).toBeNull()
    expect(state.isSpinning).toBe(true)
  })

  it('resetWheel clears winner, isSpinning, and vetoedIds', () => {
    const state = WheelCommands.resetWheel({
      ...baseState, winner: { id: '1' }, isSpinning: true, vetoedIds: ['1', '2']
    })
    expect(state.winner).toBeNull()
    expect(state.isSpinning).toBe(false)
    expect(state.vetoedIds).toEqual([])
  })

  it('all commands are pure — return new objects, never mutate', () => {
    const state = { ...baseState }
    const newState = WheelCommands.spin(state)
    expect(newState).not.toBe(state)
  })
})

// ─── useWheel Hook ────────────────────────────────────────────
describe('Module 6 — useWheel hook', () => {
  beforeEach(() => {
    vi.spyOn(soundManager, 'playSpinSound').mockImplementation(() => {})
  })
  afterEach(() => vi.restoreAllMocks())

  it('exposes spin, respin, remove, reset functions', () => {
    const { result } = renderHook(() => useWheel(), { wrapper })
    expect(typeof result.current.spin).toBe('function')
    expect(typeof result.current.respin).toBe('function')
    expect(typeof result.current.remove).toBe('function')
    expect(typeof result.current.reset).toBe('function')
  })

  it('spin() calls playSpinSound', () => {
    const { result } = renderHook(() => useWheel(), { wrapper })
    act(() => result.current.spin())
    expect(soundManager.playSpinSound).toHaveBeenCalledOnce()
  })

  it('spin() sets isSpinning to true', async () => {
    const { result } = renderHook(() => useWheel(), { wrapper })
    act(() => result.current.spin())
    expect(result.current.isSpinning).toBe(true)
  })

  it('spin() eventually resolves a winner from wheelRestaurants', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useWheel(), { wrapper })
    act(() => result.current.spin())
    act(() => vi.runAllTimers())
    await waitFor(() => expect(result.current.winner).not.toBeNull())
    expect(mockRestaurants.map(r => r.id)).toContain(result.current.winner?.id)
    vi.useRealTimers()
  })

  it('remove() removes a restaurant by id', () => {
    const { result } = renderHook(() => useWheel(), { wrapper })
    act(() => result.current.remove('1'))
  })
})

// ─── SpinWheel Component ──────────────────────────────────────
describe('Module 6 — SpinWheel Component', () => {
  beforeEach(() => {
    vi.spyOn(soundManager, 'playSpinSound').mockImplementation(() => {})
  })
  afterEach(() => vi.restoreAllMocks())

  it('renders without crashing', () => {
    render(<AppContext><SpinWheel /></AppContext>)
  })

  it('renders Spin button', () => {
    render(<AppContext><SpinWheel /></AppContext>)
    expect(screen.getByText(/spin/i)).toBeInTheDocument()
  })

  it('renders "I\'m Feeling Hungry" button', () => {
    render(<AppContext><SpinWheel /></AppContext>)
    expect(screen.getByText(/feeling hungry/i)).toBeInTheDocument()
  })

  it('spin button is disabled during spin', async () => {
    render(<AppContext><SpinWheel /></AppContext>)
    const spinBtn = screen.getByText(/^spin$/i)
    fireEvent.click(spinBtn)
    await waitFor(() => expect(spinBtn).toBeDisabled())
  })
})

// ─── Public API ───────────────────────────────────────────────
describe('Module 6 — Wheel feature public API', () => {
  it('only exports SpinWheel and useWheel from index.js', async () => {
    const exports = await import('../features/wheel/index.js')
    expect(exports).toHaveProperty('SpinWheel')
    expect(exports).toHaveProperty('useWheel')
    expect(exports).not.toHaveProperty('WheelCommands')
  })
})