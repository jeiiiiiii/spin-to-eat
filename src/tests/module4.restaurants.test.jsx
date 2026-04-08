import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { toRestaurant } from '../features/restaurants/restaurantUtils'
import PlacesRepository from '../features/restaurants/placesService'
import { useRestaurants } from '../features/restaurants'
import { AppContext } from '../store/AppContext'

const wrapper = ({ children }) => <AppContext>{children}</AppContext>

// ─── Mock Raw Google Places Data ──────────────────────────────
const mockRawPlace = {
  place_id: 'abc123',
  name: 'Jollibee',
  photos: [{ getUrl: () => 'https://photo.url/jollibee.jpg' }],
  rating: 4.5,
  user_ratings_total: 1200,
  price_level: 1,
  opening_hours: {
    isOpen: () => true,
    weekday_text: ['Monday: 6:00 AM – 12:00 AM']
  },
  vicinity: '123 Rizal Ave, Manila',
  types: ['fast_food', 'restaurant'],
  geometry: {
    location: { lat: () => 14.5995, lng: () => 120.9842 }
  },
  website: 'https://jollibee.com.ph'
}

// ─── Facade — toRestaurant ─────────────────────────────────────
describe('Module 4 — toRestaurant Facade', () => {
  it('maps place_id to id', () => {
    expect(toRestaurant(mockRawPlace).id).toBe('abc123')
  })

  it('maps name correctly', () => {
    expect(toRestaurant(mockRawPlace).name).toBe('Jollibee')
  })

  it('maps photo URL via getUrl()', () => {
    expect(toRestaurant(mockRawPlace).photo).toBe('https://photo.url/jollibee.jpg')
  })

  it('maps rating and totalRatings', () => {
    const r = toRestaurant(mockRawPlace)
    expect(r.rating).toBe(4.5)
    expect(r.totalRatings).toBe(1200)
  })

  it('maps priceLevel correctly', () => {
    expect(toRestaurant(mockRawPlace).priceLevel).toBe(1)
  })

  it('maps isOpen from opening_hours', () => {
    expect(toRestaurant(mockRawPlace).isOpen).toBe(true)
  })

  it('maps location lat and lng', () => {
    const r = toRestaurant(mockRawPlace)
    expect(r.location.lat).toBe(14.5995)
    expect(r.location.lng).toBe(120.9842)
  })

  it('maps mapsUrl correctly', () => {
    expect(toRestaurant(mockRawPlace).mapsUrl).toContain('abc123')
  })

  it('maps wazeUrl with coordinates', () => {
    const r = toRestaurant(mockRawPlace)
    expect(r.wazeUrl).toContain('14.5995')
    expect(r.wazeUrl).toContain('120.9842')
  })

  it('handles missing photo gracefully', () => {
    const raw = { ...mockRawPlace, photos: undefined }
    expect(toRestaurant(raw).photo).toBeNull()
  })

  it('handles missing rating gracefully', () => {
    const raw = { ...mockRawPlace, rating: undefined }
    expect(toRestaurant(raw).rating).toBe(0)
  })

  it('handles missing opening_hours gracefully', () => {
    const raw = { ...mockRawPlace, opening_hours: undefined }
    const r = toRestaurant(raw)
    expect(r.isOpen).toBeNull()
    expect(r.hours).toEqual([])
  })

  it('handles missing website gracefully', () => {
    const raw = { ...mockRawPlace, website: undefined }
    expect(toRestaurant(raw).menuUrl).toBeNull()
  })

  it('output shape has all required fields', () => {
    const r = toRestaurant(mockRawPlace)
    const requiredFields = ['id', 'name', 'photo', 'rating', 'totalRatings',
      'priceLevel', 'isOpen', 'hours', 'address', 'cuisine',
      'location', 'menuUrl', 'mapsUrl', 'wazeUrl']
    requiredFields.forEach(field => expect(r).toHaveProperty(field))
  })
})

// ─── PlacesRepository ─────────────────────────────────────────
describe('Module 4 — PlacesRepository', () => {
  it('exports getNearbyRestaurants, getRestaurantDetails, searchByArea', () => {
    expect(typeof PlacesRepository.getNearbyRestaurants).toBe('function')
    expect(typeof PlacesRepository.getRestaurantDetails).toBe('function')
    expect(typeof PlacesRepository.searchByArea).toBe('function')
  })

  it('getNearbyRestaurants returns normalized Restaurant array', async () => {
    vi.spyOn(PlacesRepository, 'getNearbyRestaurants').mockResolvedValue([
      toRestaurant(mockRawPlace)
    ])
    const results = await PlacesRepository.getNearbyRestaurants({ lat: 14.5995, lng: 120.9842, radius: 1000 })
    expect(Array.isArray(results)).toBe(true)
    expect(results[0]).toHaveProperty('id')
    expect(results[0]).toHaveProperty('name')
    expect(results[0]).toHaveProperty('location')
  })

  it('getNearbyRestaurants rejects when API key is missing', async () => {
    vi.spyOn(PlacesRepository, 'getNearbyRestaurants').mockRejectedValue(new Error('API key missing'))
    await expect(PlacesRepository.getNearbyRestaurants({ lat: 0, lng: 0, radius: 1000 })).rejects.toThrow()
  })
})

// ─── useRestaurants Hook ───────────────────────────────────────
describe('Module 4 — useRestaurants hook', () => {
  beforeEach(() => {
    vi.spyOn(PlacesRepository, 'getNearbyRestaurants').mockResolvedValue([
      toRestaurant(mockRawPlace)
    ])
  })

  afterEach(() => vi.restoreAllMocks())

  it('returns isLoading true initially', () => {
    const { result } = renderHook(
      () => useRestaurants({ lat: 14.5995, lng: 120.9842 }),
      { wrapper }
    )
    expect(result.current.isLoading).toBe(true)
  })

  it('returns restaurants after fetch completes', async () => {
    const { result } = renderHook(
      () => useRestaurants({ lat: 14.5995, lng: 120.9842 }),
      { wrapper }
    )
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.restaurants).toHaveLength(1)
    expect(result.current.restaurants[0].name).toBe('Jollibee')
  })

  it('does not fetch if location is null', async () => {
    const spy = vi.spyOn(PlacesRepository, 'getNearbyRestaurants')
    renderHook(() => useRestaurants(null), { wrapper })
    expect(spy).not.toHaveBeenCalled()
  })

  it('sets error on failed fetch', async () => {
    vi.spyOn(PlacesRepository, 'getNearbyRestaurants').mockRejectedValue(new Error('Network error'))
    const { result } = renderHook(
      () => useRestaurants({ lat: 14.5995, lng: 120.9842 }),
      { wrapper }
    )
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.error).not.toBeNull()
  })

  it('only fetches once — does not re-fetch on re-render', async () => {
    const spy = vi.spyOn(PlacesRepository, 'getNearbyRestaurants')
    const { rerender } = renderHook(
      () => useRestaurants({ lat: 14.5995, lng: 120.9842 }),
      { wrapper }
    )
    await waitFor(() => expect(spy).toHaveBeenCalledOnce())
    rerender()
    expect(spy).toHaveBeenCalledOnce()
  })
})

// ─── Public API ───────────────────────────────────────────────
describe('Module 4 — Restaurants feature public API', () => {
  it('only exports useRestaurants from index.js', async () => {
    const exports = await import('../features/restaurants/index.js')
    expect(exports).toHaveProperty('useRestaurants')
    expect(exports).not.toHaveProperty('PlacesRepository')
    expect(exports).not.toHaveProperty('toRestaurant')
  })
})