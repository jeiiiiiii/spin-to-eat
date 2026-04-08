import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import WinnerCard from '../features/result/WinnerCard'
import RestaurantMap from '../features/result/RestaurantMap'
import ReviewsModal from '../features/result/ReviewsModal'
import MenuModal from '../features/result/MenuModal'
import { AppContext } from '../store/AppContext'

const mockWinner = {
  id: 'abc123',
  name: 'Jollibee Rizal',
  photo: 'https://photo.url/jollibee.jpg',
  rating: 4.5,
  totalRatings: 1200,
  priceLevel: 1,
  isOpen: true,
  hours: ['Monday: 6:00 AM – 12:00 AM', 'Tuesday: 6:00 AM – 12:00 AM'],
  address: '123 Rizal Ave, Manila',
  cuisine: 'fast_food',
  location: { lat: 14.5995, lng: 120.9842 },
  menuUrl: 'https://jollibee.com.ph/menu',
  mapsUrl: 'https://maps.google.com/?place_id=abc123',
  wazeUrl: 'https://waze.com/ul?ll=14.5995,120.9842',
  reviews: [
    { author: 'Maria', rating: 5, time: '2 days ago', text: 'Great food!' }
  ]
}

const WinnerWrapper = ({ winner = mockWinner, children }) => (
  <AppContext initialOverrides={{ winner }}>
    {children}
  </AppContext>
)

// ─── WinnerCard ───────────────────────────────────────────────
describe('Module 7 — WinnerCard Component', () => {
  it('renders restaurant name', () => {
    render(<WinnerWrapper><WinnerCard /></WinnerWrapper>)
    expect(screen.getByText('Jollibee Rizal')).toBeInTheDocument()
  })

  it('renders restaurant photo', () => {
    render(<WinnerWrapper><WinnerCard /></WinnerWrapper>)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', mockWinner.photo)
  })

  it('renders formatted rating', () => {
    render(<WinnerWrapper><WinnerCard /></WinnerWrapper>)
    expect(screen.getByText(/4\.5/)).toBeInTheDocument()
  })

  it('renders price level symbols', () => {
    render(<WinnerWrapper><WinnerCard /></WinnerWrapper>)
    expect(screen.getByText('₱')).toBeInTheDocument()
  })

  it('renders open status when restaurant is open', () => {
    render(<WinnerWrapper><WinnerCard /></WinnerWrapper>)
    expect(screen.getByText(/open/i)).toBeInTheDocument()
  })

  it('renders closed status when restaurant is closed', () => {
    render(<WinnerWrapper winner={{ ...mockWinner, isOpen: false }}><WinnerCard /></WinnerWrapper>)
    expect(screen.getByText(/closed/i)).toBeInTheDocument()
  })

  it('renders View on Map button', () => {
    render(<WinnerWrapper><WinnerCard /></WinnerWrapper>)
    expect(screen.getByText(/view on map/i)).toBeInTheDocument()
  })

  it('renders See Menu button', () => {
    render(<WinnerWrapper><WinnerCard /></WinnerWrapper>)
    expect(screen.getByText(/see menu/i)).toBeInTheDocument()
  })

  it('renders Read Reviews button', () => {
    render(<WinnerWrapper><WinnerCard /></WinnerWrapper>)
    expect(screen.getByText(/read reviews/i)).toBeInTheDocument()
  })

  it('renders Get Directions button', () => {
    render(<WinnerWrapper><WinnerCard /></WinnerWrapper>)
    expect(screen.getByText(/get directions/i)).toBeInTheDocument()
  })

  it('renders Re-spin button', () => {
    render(<WinnerWrapper><WinnerCard /></WinnerWrapper>)
    expect(screen.getByText(/re-spin/i)).toBeInTheDocument()
  })

  it('renders Remove & Re-spin button', () => {
    render(<WinnerWrapper><WinnerCard /></WinnerWrapper>)
    expect(screen.getByText(/remove.*re-spin/i)).toBeInTheDocument()
  })

  it('does not render when winner is null', () => {
    render(<WinnerWrapper winner={null}><WinnerCard /></WinnerWrapper>)
    expect(screen.queryByText('Jollibee Rizal')).not.toBeInTheDocument()
  })
})

// ─── RestaurantMap ────────────────────────────────────────────
describe('Module 7 — RestaurantMap Component', () => {
  it('renders map container', () => {
    render(
      <AppContext>
        <RestaurantMap isOpen={true} onClose={() => {}} restaurant={mockWinner} />
      </AppContext>
    )
    expect(screen.getByTestId('restaurant-map')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(
      <AppContext>
        <RestaurantMap isOpen={false} onClose={() => {}} restaurant={mockWinner} />
      </AppContext>
    )
    expect(screen.queryByTestId('restaurant-map')).not.toBeInTheDocument()
  })
})

// ─── ReviewsModal ─────────────────────────────────────────────
describe('Module 7 — ReviewsModal Component', () => {
  it('renders review author and text', () => {
    render(
      <AppContext>
        <ReviewsModal isOpen={true} onClose={() => {}} restaurant={mockWinner} />
      </AppContext>
    )
    expect(screen.getByText('Maria')).toBeInTheDocument()
    expect(screen.getByText('Great food!')).toBeInTheDocument()
  })

  it('renders overall rating', () => {
    render(
      <AppContext>
        <ReviewsModal isOpen={true} onClose={() => {}} restaurant={mockWinner} />
      </AppContext>
    )
    expect(screen.getByText(/4\.5/)).toBeInTheDocument()
  })

  it('shows fallback when no reviews available', () => {
    render(
      <AppContext>
        <ReviewsModal isOpen={true} onClose={() => {}} restaurant={{ ...mockWinner, reviews: [] }} />
      </AppContext>
    )
    expect(screen.getByText(/no reviews/i)).toBeInTheDocument()
  })
})

// ─── MenuModal ────────────────────────────────────────────────
describe('Module 7 — MenuModal Component', () => {
  it('renders menu link when menuUrl exists', () => {
    render(
      <AppContext>
        <MenuModal isOpen={true} onClose={() => {}} restaurant={mockWinner} />
      </AppContext>
    )
    expect(screen.getByRole('link', { name: /menu/i })).toBeInTheDocument()
  })

  it('shows fallback Google search link when menuUrl is null', () => {
    render(
      <AppContext>
        <MenuModal isOpen={true} onClose={() => {}} restaurant={{ ...mockWinner, menuUrl: null }} />
      </AppContext>
    )
    expect(screen.getByText(/search/i)).toBeInTheDocument()
  })
})