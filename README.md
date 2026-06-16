# Dyno Tuning Game

A pixelated retro-style dyno tuning simulator where you modify and tune vehicles to achieve maximum performance on the dyno.

## Features

- **Pixelated Graphics**: Retro pixel art style inspired by Car Pixel Racer
- **Dyno Simulation**: Run realistic dyno tests with throttle control
- **Vehicle Types**: Cars and motorcycles with authentic specifications
- **Engine Modifications**: 
  - ECU Tuning
  - Engine Swaps (real engines from various vehicles)
  - Forced Induction (turbos, superchargers)
  - Transmission upgrades
  - Exhaust systems
  - Intake modifications
  - And more!
- **Real Physics**: Authentic engine physics and performance calculations

## Getting Started

```bash
npm install
npm run dev
```

## Development

```bash
npm run build
npm run test
```

## Project Structure

```
src/
├── main.ts                 # Entry point
├── game/
│   ├── engine.ts          # Engine physics and calculations
│   ├── dyno.ts            # Dyno simulation
│   ├── vehicles.ts        # Vehicle database and properties
│   └── modifications.ts   # Modification system
├── systems/
│   ├── ecu-tuning.ts      # ECU parameter tuning
│   ├── engine-swap.ts     # Engine swap system
│   ├── forced-induction.ts# Turbo/supercharger system
│   └── transmission.ts    # Transmission upgrades
├── ui/
│   ├── gauges.ts          # RPM, Power, Torque displays
│   ├── tuning-menu.ts     # UI for modifications
│   └── hud.ts             # In-game HUD
└── rendering/
    ├── pixel-renderer.ts  # Pixelated graphics engine
    └── effects.ts         # Visual effects
```

## License

MIT
