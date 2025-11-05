# **App Name**: Global NetCheck Vista

## Core Features:

- Configuration Loading: Loads application settings from `data/config/app.json`.
- CheckHost Service: Performs network checks using CheckHost API and auto-includes `defaultNodes`.
- DNS Lookup Service: Retrieves A/AAAA records for a given domain.
- IP Information Service: Obtains geolocation and IP information using IPInfoService with 4-source cross-validation.
- AI Placeholder Services: Placeholder services for AI authentication and anomaly detection.
- Interactive Map Display: Displays a Mapbox GL JS map with markers for check nodes and target IP. Component loaded dynamically.
- Liquid Glass UI Container: Encapsulates key elements (input, map, IP info) in `ui-layouts.com` Liquid Glass.

## Style Guidelines:

- Primary color: Light, vibrant cyan (#7DF9FF) evoking digital connectivity.
- Background color: Dark, desaturated gray (#121212) for contrast.
- Accent color: Bright cyan (#00FFFF) to highlight interactive elements.
- Headline font: 'Space Grotesk', a techy sans-serif.
- Body font: 'Inter', a neutral sans-serif.
- Use modern, minimalist icons representing network functions.
- Single-page scroll with fixed-position mesh gradients and sparkles.