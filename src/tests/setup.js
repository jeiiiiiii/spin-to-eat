import '@testing-library/jest-dom'
import { vi, beforeEach } from 'vitest'

// Ensure navigator exists
if (!global.navigator) {
  global.navigator = {}
}

// Create a fresh geolocation mock before each test
beforeEach(() => {
  global.navigator.geolocation = {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  }
  
  // Mock clipboard API
  global.navigator.clipboard = {
    writeText: vi.fn().mockResolvedValue(),
    readText: vi.fn(),
  }
})
