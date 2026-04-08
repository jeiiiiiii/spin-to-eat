# 🍽️ Spin to Eat

A fun restaurant picker app that helps you decide where to eat! Uses OpenStreetMap data to find nearby restaurants and randomly selects one for you.

## Features

- 📍 Automatic location detection
- 🔍 Filter by cuisine, price, radius, and open status
- 🎡 Spin the wheel to randomly pick a restaurant
- 🚫 Group veto mode - let everyone remove restaurants they don't want
- 🔗 Share your restaurant list with friends via URL
- 🗺️ View restaurant location on map
- ⭐ See reviews and details

## Tech Stack

- React + Vite
- TailwindCSS
- OpenStreetMap + Overpass API (free, no API key needed!)
- React Leaflet for maps
- Vitest for testing

## Quick Start

1. **Install dependencies:**
   ```bash
   cd spin-to-eat
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - The app will be available at `http://localhost:5173`
   - Allow location access when prompted

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Lint code

## How It Works

1. The app requests your location
2. Fetches nearby restaurants from OpenStreetMap using Overpass API
3. You can filter restaurants by various criteria
4. Spin the wheel to randomly select a restaurant
5. View details, location, and get directions

## Group Features

- **Veto Mode**: Enable veto mode to let each person remove restaurants they don't want
- **Share Link**: Generate a shareable URL that includes your filtered restaurant list
- **Shared Sessions**: When someone opens your shared link, they see the same restaurants

## No API Keys Required!

This app uses free and open data from:
- **OpenStreetMap** for restaurant data
- **Overpass API** for querying nearby places
- **Nominatim** for geocoding addresses

No registration, no API keys, no limits!

## License

MIT
