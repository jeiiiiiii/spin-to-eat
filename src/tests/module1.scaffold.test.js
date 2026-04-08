import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

const exists = (filePath) => fs.existsSync(path.resolve(process.cwd(), filePath))

describe('Module 1 — Project Scaffold', () => {

  describe('Config Files', () => {
    it('vite.config.js exists', () => expect(exists('vite.config.js')).toBe(true))
    it('tailwind.config.js exists', () => expect(exists('tailwind.config.js')).toBe(true))
    it('package.json exists', () => expect(exists('package.json')).toBe(true))
    it('.env exists', () => expect(exists('.env')).toBe(true))
  })

  describe('Entry Points', () => {
    it('src/main.jsx exists', () => expect(exists('src/main.jsx')).toBe(true))
    it('src/App.jsx exists', () => expect(exists('src/App.jsx')).toBe(true))
  })

  describe('Feature Folders', () => {
    const features = [
      'src/features/wheel/SpinWheel.jsx',
      'src/features/wheel/WheelSlice.jsx',
      'src/features/wheel/useWheel.js',
      'src/features/wheel/wheelCommands.js',
      'src/features/wheel/index.js',
      'src/features/filters/FilterPanel.jsx',
      'src/features/filters/RadiusSlider.jsx',
      'src/features/filters/useFilters.js',
      'src/features/filters/filterStrategies.js',
      'src/features/filters/index.js',
      'src/features/restaurants/placesService.js',
      'src/features/restaurants/useRestaurants.js',
      'src/features/restaurants/restaurantUtils.js',
      'src/features/restaurants/index.js',
      'src/features/location/locationService.js',
      'src/features/location/useLocation.js',
      'src/features/location/index.js',
      'src/features/result/WinnerCard.jsx',
      'src/features/result/RestaurantMap.jsx',
      'src/features/result/ReviewsModal.jsx',
      'src/features/result/MenuModal.jsx',
      'src/features/result/index.js',
      'src/features/group/VetoMode.jsx',
      'src/features/group/ShareLink.jsx',
      'src/features/group/useShareLink.js',
      'src/features/group/index.js',
    ]
    features.forEach(file => {
      it(`${file} exists`, () => expect(exists(file)).toBe(true))
    })
  })

  describe('Shared Folders', () => {
    const shared = [
      'src/shared/components/Button.jsx',
      'src/shared/components/Modal.jsx',
      'src/shared/components/LoadingSpinner.jsx',
      'src/shared/hooks/useDebounce.js',
      'src/shared/hooks/useMediaQuery.js',
      'src/shared/utils/formatters.js',
      'src/shared/utils/urlEncoder.js',
      'src/shared/utils/soundManager.js',
    ]
    shared.forEach(file => {
      it(`${file} exists`, () => expect(exists(file)).toBe(true))
    })
  })

  describe('Store & Constants', () => {
    it('store/AppContext.jsx exists', () => expect(exists('src/store/AppContext.jsx')).toBe(true))
    it('store/AppReducer.js exists', () => expect(exists('src/store/AppReducer.js')).toBe(true))
    it('constants/api.js exists', () => expect(exists('src/constants/api.js')).toBe(true))
    it('constants/defaults.js exists', () => expect(exists('src/constants/defaults.js')).toBe(true))
  })

  describe('Constants Values', () => {
    it('DEFAULTS exports correct shape', async () => {
      const { DEFAULTS } = await import('../constants/defaults.js')
      expect(DEFAULTS).toHaveProperty('radius', 1000)
      expect(DEFAULTS).toHaveProperty('maxResults', 20)
      expect(DEFAULTS).toHaveProperty('openNow', true)
      expect(DEFAULTS).toHaveProperty('priceLevel', null)
    })
  })

  describe('Dependencies in package.json', () => {
    it('all required dependencies are listed', () => {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies }
      expect(allDeps).toHaveProperty('react')
      expect(allDeps).toHaveProperty('vite')
      expect(allDeps).toHaveProperty('tailwindcss')
      expect(allDeps).toHaveProperty('leaflet')
      expect(allDeps).toHaveProperty('react-leaflet')
      expect(allDeps).toHaveProperty('howler')
      expect(allDeps).toHaveProperty('spin-wheel')
    })
  })

})