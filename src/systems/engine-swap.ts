import { EngineSpec, Engine } from '../game/engine'
import { Vehicle } from '../game/vehicles'

export interface EngineSwapRequirement {
  cost: number
  difficulty: number // 1-10
  timeRequired: number // minutes
  requiredSkill: number // 1-100
}

/**
 * Database of swappable engines
 */
export const SWAPPABLE_ENGINES: Map<string, EngineSpec[]> = new Map([
  [
    'Honda Civic',
    [
      {
        name: 'Honda B16B2',
        displacement: 1595,
        basePower: 190,
        baseTorque: 110,
        redline: 8000,
        maxBoost: 0,
        turboType: 'none',
        cylinderCount: 4,
        fuelType: 'premium'
      },
      {
        name: 'Honda F20C',
        displacement: 1997,
        basePower: 237,
        baseTorque: 156,
        redline: 8000,
        maxBoost: 0,
        turboType: 'none',
        cylinderCount: 4,
        fuelType: 'premium'
      }
    ]
  ],
  [
    'Motorcycle',
    [
      {
        name: 'Kawasaki H2 Engine',
        displacement: 1442,
        basePower: 228,
        baseTorque: 150,
        redline: 10000,
        maxBoost: 8,
        turboType: 'supercharger',
        cylinderCount: 4,
        fuelType: 'premium'
      }
    ]
  ]
])

export class EngineSwapSystem {
  /**
   * Calculate swap requirements
   */
  static getSwapRequirements(fromEngine: EngineSpec, toEngine: EngineSpec): EngineSwapRequirement {
    const displacementDiff = Math.abs(toEngine.displacement - fromEngine.displacement)
    const difficulty = Math.min(10, 2 + (displacementDiff / 1000) * 5)
    const cost = 500 + difficulty * 300 + (toEngine.displacement - fromEngine.displacement) * 0.5
    const timeRequired = 30 + difficulty * 20
    const requiredSkill = difficulty * 10

    return {
      cost: Math.round(cost),
      difficulty,
      timeRequired,
      requiredSkill
    }
  }

  /**
   * Perform engine swap
   */
  static performSwap(vehicle: Vehicle, newEngine: EngineSpec): boolean {
    try {
      vehicle.swapEngine(newEngine)
      return true
    } catch (error) {
      console.error('Engine swap failed:', error)
      return false
    }
  }

  /**
   * Get available engines for a vehicle type
   */
  static getAvailableEngines(vehicleType: string): EngineSpec[] {
    return SWAPPABLE_ENGINES.get(vehicleType) || []
  }
}
