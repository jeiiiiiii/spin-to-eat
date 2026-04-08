import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { AppContext, useAppContext } from '../store/AppContext'
import { AppReducer } from '../store/AppReducer'
import Button from '../shared/components/Button'
import Modal from '../shared/components/Modal'
import LoadingSpinner from '../shared/components/LoadingSpinner'
import { formatDistance, formatPriceLevel, formatRating } from '../shared/utils/formatters'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '../shared/hooks/useDebounce'

// ─── AppReducer ───────────────────────────────────────────────
describe('Module 2 — AppReducer', () => {
  const initialState = {
    userLocation: null,
    locationError: null,
    allRestaurants: [],
    filteredRestaurants: [],
    wheelRestaurants: [],
    activeFilters: { priceLevel: null, radius: 1000, openNow: true },
    winner: null,
    isSpinning: false,
    vetoMode: false,
    vetoedIds: [],
    isLoading: false,
    error: null
  }

  it('returns initial state for unknown action', () => {
    expect(AppReducer(initialState, { type: 'UNKNOWN' })).toEqual(initialState)
  })

  it('SET_LOCATION updates userLocation', () => {
    const location = { lat: 14.5995, lng: 120.9842 }
    const state = AppReducer(initialState, { type: 'SET_LOCATION', payload: location })
    expect(state.userLocation).toEqual(location)
  })

  it('SET_RESTAURANTS updates allRestaurants and wheelRestaurants', () => {
    const restaurants = [{ id: '1', name: 'Test' }]
    const state = AppReducer(initialState, { type: 'SET_RESTAURANTS', payload: restaurants })
    expect(state.allRestaurants).toEqual(restaurants)
    expect(state.wheelRestaurants).toEqual(restaurants)
  })

  it('SET_FILTERS updates activeFilters', () => {
    const filters = { priceLevel: 2, radius: 2000, openNow: false }
    const state = AppReducer(initialState, { type: 'SET_FILTERS', payload: filters })
    expect(state.activeFilters).toEqual(filters)
  })

  it('SET_WINNER updates winner and sets isSpinning to false', () => {
    const winner = { id: '1', name: 'Jollibee' }
    const state = AppReducer({ ...initialState, isSpinning: true }, { type: 'SET_WINNER', payload: winner })
    expect(state.winner).toEqual(winner)
    expect(state.isSpinning).toBe(false)
  })

  it('REMOVE_RESTAURANT removes correct restaurant from wheelRestaurants', () => {
    const state = AppReducer(
      { ...initialState, wheelRestaurants: [{ id: '1' }, { id: '2' }, { id: '3' }] },
      { type: 'REMOVE_RESTAURANT', payload: '2' }
    )
    expect(state.wheelRestaurants).toHaveLength(2)
    expect(state.wheelRestaurants.find(r => r.id === '2')).toBeUndefined()
  })

  it('TOGGLE_VETO_MODE flips vetoMode boolean', () => {
    const state = AppReducer(initialState, { type: 'TOGGLE_VETO_MODE' })
    expect(state.vetoMode).toBe(true)
    const state2 = AppReducer(state, { type: 'TOGGLE_VETO_MODE' })
    expect(state2.vetoMode).toBe(false)
  })

  it('RESPIN clears winner and sets isSpinning to true', () => {
    const state = AppReducer(
      { ...initialState, winner: { id: '1' }, isSpinning: false },
      { type: 'RESPIN' }
    )
    expect(state.winner).toBeNull()
    expect(state.isSpinning).toBe(true)
  })

  it('RESET_WHEEL clears winner, isSpinning, and vetoedIds', () => {
    const state = AppReducer(
      { ...initialState, winner: { id: '1' }, isSpinning: true, vetoedIds: ['1', '2'] },
      { type: 'RESET_WHEEL' }
    )
    expect(state.winner).toBeNull()
    expect(state.isSpinning).toBe(false)
    expect(state.vetoedIds).toEqual([])
  })
})

// ─── AppContext ────────────────────────────────────────────────
describe('Module 2 — AppContext', () => {
  it('useAppContext throws if used outside provider', () => {
    expect(() => renderHook(() => useAppContext())).toThrow()
  })

  it('provides state and dispatch to children', () => {
    const TestComponent = () => {
      const { state } = useAppContext()
      return <div>{state.isLoading ? 'loading' : 'ready'}</div>
    }
    render(
      <AppContext>
        <TestComponent />
      </AppContext>
    )
    expect(screen.getByText('ready')).toBeInTheDocument()
  })
})

// ─── Shared Components ─────────────────────────────────────────
describe('Module 2 — Button Component', () => {
  it('renders children', () => {
    render(<Button onClick={() => {}}>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handler = vi.fn()
    render(<Button onClick={handler}>Click</Button>)
    fireEvent.click(screen.getByText('Click'))
    expect(handler).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', () => {
    const handler = vi.fn()
    render(<Button onClick={handler} disabled>Click</Button>)
    fireEvent.click(screen.getByText('Click'))
    expect(handler).not.toHaveBeenCalled()
  })

  it('renders all variants without crashing', () => {
    const { rerender } = render(<Button variant="primary" onClick={() => {}}>P</Button>)
    rerender(<Button variant="secondary" onClick={() => {}}>S</Button>)
    rerender(<Button variant="danger" onClick={() => {}}>D</Button>)
  })
})

describe('Module 2 — Modal Component', () => {
  it('renders children when isOpen is true', () => {
    render(<Modal isOpen={true} onClose={() => {}} title="Test Modal">Modal content</Modal>)
    expect(screen.getByText('Modal content')).toBeInTheDocument()
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
  })

  it('does not render children when isOpen is false', () => {
    render(<Modal isOpen={false} onClose={() => {}} title="Test">Hidden</Modal>)
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument()
  })

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn()
    render(<Modal isOpen={true} onClose={onClose} title="Test">Content</Modal>)
    fireEvent.click(screen.getByTestId('modal-backdrop'))
    expect(onClose).toHaveBeenCalledOnce()
  })
})

describe('Module 2 — LoadingSpinner Component', () => {
  it('renders with message', () => {
    render(<LoadingSpinner message="Fetching restaurants..." />)
    expect(screen.getByText('Fetching restaurants...')).toBeInTheDocument()
  })

  it('renders without message', () => {
    render(<LoadingSpinner />)
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })
})

// ─── Formatters ────────────────────────────────────────────────
describe('Module 2 — Formatters', () => {
  it('formatDistance returns meters for < 1000m', () => {
    expect(formatDistance(500)).toBe('500m')
  })

  it('formatDistance returns km for >= 1000m', () => {
    expect(formatDistance(1200)).toBe('1.2km')
  })

  it('formatPriceLevel returns correct ₱ symbols', () => {
    expect(formatPriceLevel(1)).toBe('₱')
    expect(formatPriceLevel(2)).toBe('₱₱')
    expect(formatPriceLevel(3)).toBe('₱₱₱')
  })

  it('formatPriceLevel returns fallback for unknown level', () => {
    expect(formatPriceLevel(0)).toBeTruthy()
  })

  it('formatRating formats correctly', () => {
    expect(formatRating(4.5)).toBe('4.5 ★')
    expect(formatRating(0)).toBe('0 ★')
  })
})

// ─── useDebounce ───────────────────────────────────────────────
describe('Module 2 — useDebounce', () => {
  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300))
    expect(result.current).toBe('hello')
  })

  it('debounces value changes', async () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'hello' }
    })
    rerender({ value: 'world' })
    expect(result.current).toBe('hello')
    act(() => vi.advanceTimersByTime(300))
    expect(result.current).toBe('world')
    vi.useRealTimers()
  })
})