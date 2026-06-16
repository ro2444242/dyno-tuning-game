# Dyno Tuning Game - Getting Started

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

The game will open at `http://localhost:3000`

## Controls

### Navigation
- **UP / W** - Navigate up / Increase throttle
- **DOWN / S** - Navigate down / Decrease throttle
- **LEFT / A** - Navigate left
- **RIGHT / D** - Navigate right
- **SPACE** - Select / Confirm
- **ESC** - Back / Main Menu

## Game Modes

### 1. **Main Menu**
Start screen with options to:
- New Game (Career Mode)
- Garage (View/manage vehicles)
- Leaderboard (Compare with friends)
- Settings

### 2. **Career Mode**
Progress through the game:
- Earn money from dyno runs
- Unlock new vehicles and parts
- Build reputation
- Complete milestones and achievements

### 3. **Garage**
Manage your vehicles:
- View current vehicle stats
- Check money and reputation
- See run history
- Access modification shop

### 4. **Modification Shop**
Upgrade your vehicle:
- **Engine Parts**: Intake, Exhaust, Headers, Cams
- **Pistons & Compression**: High compression upgrades
- **Forced Induction**: Turbo/Supercharger kits
- **Fuel System**: Upgraded fuel system
- **Ignition**: Performance ignition
- **Transmissions**: Manual, Automatic, CVT

### 5. **Dyno Run**
Test your vehicle's performance:
- Control throttle with UP/DOWN keys
- Watch real-time power/torque/boost readings
- See RPM gauge and temperature
- Get results with power curve graphs
- Earn money based on performance

### 6. **Leaderboard**
Compete globally:
- View top players' best runs
- See wins and reputation
- Compare your personal bests
- Challenge friends (multiplayer)

## Features

### 🏎️ **Vehicles** (20+ Cars & Motorcycles)
- Honda Civic (multiple variants)
- Ford Mustang (GT, EcoBoost, GT500)
- Toyota Supra GR
- Nissan GT-R
- Dodge Charger/Challenger
- Subaru WRX STi
- Plus 8+ motorcycles (CBR, Hayabusa, Ninja H2, Ducati, BMW, etc.)

### 🔧 **Engine Modifications**
- **ECU Tuning**: Fuel map, ignition timing, boost target, VVT
- **Engine Swaps**: Real engines from various vehicles
- **Forced Induction**: Turbo, supercharger, twin-turbo
- **Transmission Upgrades**: 5-8 speed options
- **Intake/Exhaust**: Performance air and fuel system upgrades
- **Pistons & Compression**: High compression ratio upgrades

### 📊 **Advanced Physics**
- Tire slip and grip calculations
- Weight transfer during acceleration
- Aerodynamic drag and downforce
- Tire temperature and wear tracking
- Realistic power curves

### 🎵 **Audio System**
- Engine sound based on RPM
- Turbo spool effects
- Gear shift sounds
- Exhaust pops
- Volume control

### 💾 **Save System**
- Auto-save every 30 seconds
- Save/load career progress
- Track vehicle configurations
- Export/import saves

### 🏆 **Career & Progression**
- Level system with experience
- Money earning from races
- Reputation system
- Achievement/milestone tracking
- Multiple vehicles ownership

### 👥 **Multiplayer Features**
- Global leaderboard
- Friend list management
- Challenge system
- Compare best runs
- Competitive rankings

## Game Flow

```
Main Menu
  ├─ New Game → Vehicle Select → Career Mode
  ├─ Garage → Manage Vehicles → Shop → Dyno Run → Results
  ├─ Leaderboard → View Rankings → Challenge Friends
  └─ Settings → Audio/Graphics/Difficulty
```

## Tips & Strategies

1. **Start with basic modifications** - Intake and exhaust are affordable first upgrades
2. **Turbo tuning** - Careful with boost levels to avoid engine damage
3. **ECU tuning** - Aggressive fuel mapping gives more power but reduces reliability
4. **Money management** - Balance spending on vehicles vs modifications
5. **Build reputation** - Higher reputation unlocks exclusive vehicles and parts
6. **Tire management** - Keep tire temperatures optimal for best grip
7. **Engine swaps** - Some swaps are expensive but can dramatically increase power

## File Structure

```
src/
├── main.ts              # Entry point
├── game/
│   ├── engine.ts        # Engine physics
│   ├── vehicles.ts      # Vehicle data & specs
│   ├── dyno.ts          # Dyno simulation
│   └── modifications.ts  # Parts catalog
├── systems/
│   ├── ecu-tuning.ts    # ECU tuning system
│   ├── engine-swap.ts   # Engine swap system
│   ├── forced-induction.ts  # Turbo/supercharger
│   └── transmission.ts  # Transmission upgrades
├── ui/
│   ├── menu-system.ts   # Menu navigation
│   ├── garage-system.ts # Vehicle management
│   ├── shop-system.ts   # Modification shop
│   └── hud-system.ts    # HUD display
├── career/
│   └── career-manager.ts # Career progression
├── multiplayer/
│   ├── leaderboard.ts   # Leaderboard system
│   └── friends-system.ts # Friends & challenges
├── physics/
│   └── advanced-physics.ts  # Advanced physics
├── sound/
│   └── audio-engine.ts  # Audio system
├── save/
│   └── save-system.ts   # Save/load system
└── rendering/
    ├── pixel-renderer.ts # Pixel art rendering
    ├── sprite-renderer.ts # Sprite management
    └── dyno-visualizer.ts # Graph visualization
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| UP/W | Navigate Up / Throttle Up |
| DOWN/S | Navigate Down / Throttle Down |
| LEFT/A | Navigate Left |
| RIGHT/D | Navigate Right |
| SPACE | Select / Confirm |
| ESC | Back / Menu |
| D | Toggle Debug Info |

## Troubleshooting

### Game won't start
- Make sure you have Node.js v16+ installed
- Run `npm install` to install dependencies
- Check browser console for errors

### Audio not working
- Some browsers require user interaction before audio plays
- Click the canvas first, then try a run
- Check browser audio settings

### Save not loading
- Clear browser cache and localStorage
- Try exporting/importing save manually

## Performance Tips

- Lower graphics quality in settings for better performance
- Close background applications
- Use Chrome or Firefox for best performance
- Update GPU drivers

## Future Updates

- [ ] Online multiplayer races
- [ ] Custom paint jobs and cosmetics
- [ ] More realistic tire physics
- [ ] Cup races and tournaments
- [ ] Vehicle damage system
- [ ] Nitrous oxide system
- [ ] Custom car builder
- [ ] VR support

## Support

For issues or feature requests, please open an issue on GitHub:
https://github.com/ro2444242/dyno-tuning-game/issues

---

**Enjoy tuning! 🏁**
