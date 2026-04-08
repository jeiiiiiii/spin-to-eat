import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { encodeWheelState, decodeWheelState } from '../shared/utils/urlEncoder'
import { useShareLink } from '../features/group'
import VetoMode from '../features/group/VetoMode'
import ShareLink from '../features/group/ShareLink'
import { AppContext } from '../store/AppContext'

const wrapper = ({ children }) => <AppContext>{children}</AppContext>

const mockRestaurants = [
  { id: '1', name: 'Jollibee', cuisine: 'fast_food', priceLevel: 1, isOpen: true, location: { lat: 14.5995, lng: 120.9842 } },
  { id: '2', name: 'Yabu',     cuisine: 'japanese',  priceLevel: 3, isOpen: true, location: { lat: 14.6010, lng: 120.9860 } },
]

const mockFilters = { priceLevel: null, radius: 1000, openNow: true }

// ─── urlEncoder ───────────────────────────────────────────────
describe('Module 8 — urlEncoder (pure functions)', () => {
  it('encodeWheelState returns a non-empty string', () => {
    const encoded = encodeWheelState({ restaurants: mockRestaurants, filters: mockFilters })
    expect(typeof encoded).toBe('string')
    expect(encoded.length).toBeGreaterThan(0)
  })

  it('decodeWheelState recovers restaurants correctly', () => {
    const encoded = encodeWheelState({ restaurants: mockRestaurants, filters: mockFilters })
    const decoded = decodeWheelState(encoded)
    expect(decoded.restaurants).toHaveLength(2)
    expect(decoded.restaurants[0].id).toBe('1')
    expect(decoded.restaurants[1].name).toBe('Yabu')
  })

  it('decodeWheelState recovers filters correctly', () => {
    const encoded = encodeWheelState({ restaurants: mockRestaurants, filters: mockFilters })
    const decoded = decodeWheelState(encoded)
    expect(decoded.filters).toEqual(mockFilters)
  })

  it('encode → decode is lossless (round trip)', () => {
    const original = { restaurants: mockRestaurants, filters: mockFilters }
    const encoded = encodeWheelState(original)
    const decoded = decodeWheelState(encoded)
    expect(decoded.restaurants).toEqual(original.restaurants)
    expect(decoded.filters).toEqual(original.filters)
  })

  it('decodeWheelState handles malformed input gracefully', () => {
    expect(() => decodeWheelState('totally-invalid-string')).not.toThrow()
  })

  it('encoded string is URL-safe (no spaces or illegal chars)', () => {
    const encoded = encodeWheelState({ restaurants: mockRestaurants, filters: mockFilters })
    expect(encoded).not.toMatch(/\s/)
    expect(encodeURIComponent(encoded)).toBe(encoded)
  })
})

// ─── useShareLink Hook ────────────────────────────────────────
describe('Module 8 — useShareLink hook', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('exposes generateShareUrl function', () => {
    const { result } = renderHook(() => useShareLink(mockRestaurants), { wrapper })
    expect(typeof result.current.generateShareUrl).toBe('function')
  })

  it('generateShareUrl returns a valid URL string', () => {
    const { result } = renderHook(() => useShareLink(mockRestaurants), { wrapper })
    const url = result.current.generateShareUrl()
    expect(url).toContain('http')
    expect(url).toContain('?')
  })

  it('isSharedSession is false when no URL params present', () => {
    const { result } = renderHook(() => useShareLink(mockRestaurants), { wrapper })
    expect(result.current.isSharedSession).toBe(false)
  })

  it('isSharedSession is true when URL contains encoded state', () => {
    const encoded = encodeWheelState({ restaurants: mockRestaurants, filters: mockFilters })
    window.history.pushState({}, '', `/?state=${encoded}`)
    const { result } = renderHook(() => useShareLink(mockRestaurants), { wrapper })
    expect(result.current.isSharedSession).toBe(true)
  })

  it('restores wheel state from URL on mount', async () => {
    const encoded = encodeWheelState({ restaurants: mockRestaurants, filters: mockFilters })
    window.history.pushState({}, '', `/?state=${encoded}`)
    const { result } = renderHook(() => useShareLink(mockRestaurants), { wrapper })
    await waitFor(() => expect(result.current.isSharedSession).toBe(true))
  })
})

// ─── ShareLink Component ──────────────────────────────────────
describe('Module 8 — ShareLink Component', () => {
  it('renders share button', () => {
    render(<AppContext><ShareLink /></AppContext>)
    expect(screen.getByText(/share/i)).toBeInTheDocument()
  })

  it('copies URL to clipboard on click', async () => {
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    render(<AppContext><ShareLink /></AppContext>)
    fireEvent.click(screen.getByText(/share/i))
    expect(navigator.clipboard.writeText).toHaveBeenCalledOnce()
  })

  it('shows Copied! confirmation after click', async () => {
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    render(<AppContext><ShareLink /></AppContext>)
    fireEvent.click(screen.getByText(/share/i))
    await waitFor(() => expect(screen.getByText(/copied/i)).toBeInTheDocument())
  })

  it('shows shared session banner when isSharedSession is true', () => {
    const encoded = encodeWheelState({ restaurants: mockRestaurants, filters: mockFilters })
    window.history.pushState({}, '', `/?state=${encoded}`)
    render(<AppContext><ShareLink /></AppContext>)
    expect(screen.getByText(/shared wheel/i)).toBeInTheDocument()
  })
})

// ─── VetoMode Component ───────────────────────────────────────
describe('Module 8 — VetoMode Component', () => {
  it('renders veto mode toggle button', () => {
    render(<AppContext><VetoMode /></AppContext>)
    expect(screen.getByText(/veto/i)).toBeInTheDocument()
  })

  it('shows veto mode banner when active', () => {
    render(<AppContext><VetoMode /></AppContext>)
    fireEvent.click(screen.getByText(/veto/i))
    expect(screen.getByText(/tap.*remove/i)).toBeInTheDocument()
  })

  it('shows Done — Spin Now button when veto mode is active', () => {
    render(<AppContext><VetoMode /></AppContext>)
    fireEvent.click(screen.getByText(/veto/i))
    expect(screen.getByText(/done.*spin/i)).toBeInTheDocument()
  })

  it('exits veto mode when Done is clicked', async () => {
    render(<AppContext><VetoMode /></AppContext>)
    fireEvent.click(screen.getByText(/veto/i))
    fireEvent.click(screen.getByText(/done.*spin/i))
    await waitFor(() => expect(screen.queryByText(/tap.*remove/i)).not.toBeInTheDocument())
  })
})

// ─── Public API ───────────────────────────────────────────────
describe('Module 8 — Group feature public API', () => {
  it('exports VetoMode, ShareLink, and useShareLink from index.js', async () => {
    const exports = await import('../features/group/index.js')
    expect(exports).toHaveProperty('VetoMode')
    expect(exports).toHaveProperty('ShareLink')
    expect(exports).toHaveProperty('useShareLink')
  })
})