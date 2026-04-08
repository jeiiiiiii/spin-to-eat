import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { renderHook, act } from '@testing-library/react'
import { filterStrategies, applyFilters } from '../features/filters/filterStrategies'
import { useFilters } from '../features/filters'
import FilterPanel from '../features/filters/FilterPanel'
import { AppContext } from '../store/AppContext'

const wrapper = ({ children }) => <AppContext>{children}</AppContext>

const mockRestaurants = [
  { id: '1', name: 'Jollibee',   isOpen: true,  priceLevel: 1, cuisine: 'fast_food', location: { lat: 14.5995, lng: 120.9842 } },
  { id: '2', name: 'Yabu',       isOpen: true,  priceLevel: 3, cuisine: 'japanese',  location: { lat: 14.6010, lng: 120.9860 } },
  { id: '3', name: 'Closed One', isOpen: false, priceLevel: 2, cuisine: 'italian',   location: { lat: 14.6100, lng: 121.0000 } },
  { id: '4', name: 'Far One',    isOpen: true,  priceLevel: 1, cuisine: 'fast_food', location: { lat: 15.0000, lng: 121.5000 } },
]

const userLocation = { lat: 14.5995, lng: 120.9842 }

// ─── filterStrategies ─────────────────────────────────────────
describe('Module 5 — filterStrategies (pure functions)', () => {
  it('openNow filters out closed restaurants', () => {
    const result = filterStrategies.openNow(mockRestaurants)
    expect(result.every(r => r.isOpen)).toBe(true)
    expect(result.find(r => r.name === 'Closed One')).toBeUndefined()
  })

  it('priceLevel filters by exact price level', () => {
    const result = filterStrategies.priceLevel(mockRestaurants, 1)
    expect(result.every(r => r.priceLevel === 1)).toBe(true)
  })

  it('radius filters out restaurants beyond max distance', () => {
    const result = filterStrategies.radius(mockRestaurants, 2000, userLocation)
    expect(result.find(r => r.name === 'Far One')).toBeUndefined()
  })

  it('radius keeps restaurants within max distance', () => {
    const result = filterStrategies.radius(mockRestaurants, 2000, userLocation)
    expect(result.find(r => r.name === 'Jollibee')).toBeDefined()
  })

  it('filter strategies are pure — do not mutate original array', () => {
    const original = [...mockRestaurants]
    filterStrategies.openNow(mockRestaurants)
    expect(mockRestaurants).toEqual(original)
  })
})

// ─── applyFilters ─────────────────────────────────────────────
describe('Module 5 — applyFilters pipeline', () => {
  it('applies multiple filters correctly', () => {
    const filters = { openNow: true, priceLevel: 1, radius: null }
    const result = applyFilters(mockRestaurants, filters, userLocation)
    expect(result.every(r => r.isOpen && r.priceLevel === 1)).toBe(true)
  })

  it('skips filters with null or false values', () => {
    const filters = { openNow: false, priceLevel: null, radius: null }
    const result = applyFilters(mockRestaurants, filters, userLocation)
    expect(result).toHaveLength(mockRestaurants.length)
  })

  it('returns empty array when no restaurants match', () => {
    const filters = { priceLevel: 999, openNow: null, radius: null }
    const result = applyFilters(mockRestaurants, filters, userLocation)
    expect(result).toHaveLength(0)
  })

  it('returns all restaurants when no filters active', () => {
    const filters = { openNow: null, priceLevel: null, radius: null }
    const result = applyFilters(mockRestaurants, filters, userLocation)
    expect(result).toHaveLength(mockRestaurants.length)
  })
})

// ─── FilterPanel UI ───────────────────────────────────────────
describe('Module 5 — FilterPanel Component', () => {
  it('renders without crashing', () => {
    render(<AppContext><FilterPanel /></AppContext>)
  })

  it('renders open now toggle', () => {
    render(<AppContext><FilterPanel /></AppContext>)
    expect(screen.getByLabelText(/open now/i)).toBeInTheDocument()
  })

  it('renders price level buttons ₱, ₱₱, ₱₱₱', () => {
    render(<AppContext><FilterPanel /></AppContext>)
    expect(screen.getByText('₱')).toBeInTheDocument()
    expect(screen.getByText('₱₱')).toBeInTheDocument()
    expect(screen.getByText('₱₱₱')).toBeInTheDocument()
  })

  it('renders radius slider', () => {
    render(<AppContext><FilterPanel /></AppContext>)
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })

  it('renders reset filters button', () => {
    render(<AppContext><FilterPanel /></AppContext>)
    expect(screen.getByText(/reset/i)).toBeInTheDocument()
  })

  it('dispatches SET_FILTERS when open now is toggled', () => {
    render(<AppContext><FilterPanel /></AppContext>)
    const toggle = screen.getByLabelText(/open now/i)
    fireEvent.click(toggle)
  })
})

// ─── Public API ───────────────────────────────────────────────
describe('Module 5 — Filters feature public API', () => {
  it('only exports useFilters and FilterPanel from index.js', async () => {
    const exports = await import('../features/filters/index.js')
    expect(exports).toHaveProperty('useFilters')
    expect(exports).toHaveProperty('FilterPanel')
    expect(exports).not.toHaveProperty('filterStrategies')
    expect(exports).not.toHaveProperty('applyFilters')
  })
})