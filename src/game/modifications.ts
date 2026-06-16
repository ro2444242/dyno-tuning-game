import { EngineModification } from './engine'

export const MODIFICATION_CATALOG: Map<string, EngineModification> = new Map([
  [
    'intake',
    {
      name: 'Performance Intake',
      torqueMultiplier: 1.05,
      powerMultiplier: 1.08,
      cost: 300,
      weight: 2
    }
  ],
  [
    'exhaust',
    {
      name: 'Performance Exhaust',
      torqueMultiplier: 1.08,
      powerMultiplier: 1.12,
      cost: 500,
      weight: -5
    }
  ],
  [
    'headers',
    {
      name: 'Headers',
      torqueMultiplier: 1.06,
      powerMultiplier: 1.10,
      cost: 700,
      weight: 0
    }
  ],
  [
    'cam',
    {
      name: 'Performance Cams',
      torqueMultiplier: 1.15,
      powerMultiplier: 1.18,
      cost: 1200,
      weight: 1
    }
  ],
  [
    'compression',
    {
      name: 'High Compression Pistons',
      torqueMultiplier: 1.12,
      powerMultiplier: 1.15,
      cost: 1500,
      weight: 3
    }
  ],
  [
    'turbo',
    {
      name: 'Turbocharger Kit',
      torqueMultiplier: 1.5,
      powerMultiplier: 1.6,
      cost: 3000,
      weight: 15
    }
  ],
  [
    'supercharger',
    {
      name: 'Supercharger Kit',
      torqueMultiplier: 1.45,
      powerMultiplier: 1.55,
      cost: 3500,
      weight: 20
    }
  ],
  [
    'fuel-system',
    {
      name: 'Fuel System Upgrade',
      torqueMultiplier: 1.03,
      powerMultiplier: 1.05,
      cost: 800,
      weight: 2
    }
  ],
  [
    'ignition',
    {
      name: 'Performance Ignition',
      torqueMultiplier: 1.04,
      powerMultiplier: 1.06,
      cost: 600,
      weight: 1
    }
  ]
])

export function getModification(id: string): EngineModification | undefined {
  return MODIFICATION_CATALOG.get(id)
}

export function getAllModifications(): EngineModification[] {
  return Array.from(MODIFICATION_CATALOG.values())
}
