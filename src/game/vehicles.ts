import { Engine, EngineSpec } from './engine'

export interface VehicleSpec {
  id: string
  name: string
  type: 'car' | 'motorcycle'
  year: number
  weight: number // kg
  basePower: number // hp
  baseTorque: number // Nm
  availableEngines: EngineSpec[]
}

// Popular cars
const carDatabase: VehicleSpec[] = [
  {
    id: 'civic',
    name: 'Honda Civic',
    type: 'car',
    year: 2022,
    weight: 1350,
    basePower: 180,
    baseTorque: 177,
    availableEngines: [
      {
        name: 'Honda K20Z3',
        displacement: 1998,
        basePower: 201,
        baseTorque: 152,
        redline: 7800,
        maxBoost: 0,
        turboType: 'none',
        cylinderCount: 4,
        fuelType: 'premium'
      }
    ]
  },
  {
    id: 'mustang',
    name: 'Ford Mustang GT',
    type: 'car',
    year: 2022,
    weight: 1850,
    basePower: 480,
    baseTorque: 420,
    availableEngines: [
      {
        name: 'Ford 5.0L Coyote',
        displacement: 5032,
        basePower: 480,
        baseTorque: 420,
        redline: 7500,
        maxBoost: 0,
        turboType: 'none',
        cylinderCount: 8,
        fuelType: 'premium'
      },
      {
        name: 'Ford 3.5L EcoBoost Twin-Turbo',
        displacement: 3496,
        basePower: 365,
        baseTorque: 350,
        redline: 6500,
        maxBoost: 15,
        turboType: 'twin-turbo',
        cylinderCount: 6,
        fuelType: 'premium'
      }
    ]
  },
  {
    id: 'supra',
    name: 'Toyota Supra',
    type: 'car',
    year: 2020,
    weight: 1495,
    basePower: 335,
    baseTorque: 365,
    availableEngines: [
      {
        name: 'BMW B58 Turbo',
        displacement: 2997,
        basePower: 335,
        baseTorque: 365,
        redline: 6500,
        maxBoost: 18,
        turboType: 'turbo',
        cylinderCount: 6,
        fuelType: 'premium'
      }
    ]
  }
]

// Popular motorcycles
const motorcycleDatabase: VehicleSpec[] = [
  {
    id: 'cbr1000rr',
    name: 'Honda CBR1000RR-R',
    type: 'motorcycle',
    year: 2022,
    weight: 201,
    basePower: 215,
    baseTorque: 113,
    availableEngines: [
      {
        name: 'Honda 999cc 4-Cylinder',
        displacement: 999,
        basePower: 215,
        baseTorque: 113,
        redline: 13000,
        maxBoost: 0,
        turboType: 'none',
        cylinderCount: 4,
        fuelType: 'premium'
      }
    ]
  },
  {
    id: 'hayabusa',
    name: 'Suzuki Hayabusa',
    type: 'motorcycle',
    year: 2021,
    weight: 238,
    basePower: 188,
    baseTorque: 150,
    availableEngines: [
      {
        name: 'Suzuki 1340cc 4-Cylinder',
        displacement: 1340,
        basePower: 188,
        baseTorque: 150,
        redline: 10000,
        maxBoost: 0,
        turboType: 'none',
        cylinderCount: 4,
        fuelType: 'premium'
      }
    ]
  },
  {
    id: 'ninja-h2',
    name: 'Kawasaki Ninja H2',
    type: 'motorcycle',
    year: 2022,
    weight: 263,
    basePower: 228,
    baseTorque: 150,
    availableEngines: [
      {
        name: 'Kawasaki 1442cc Supercharged',
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
  }
]

export class Vehicle {
  spec: VehicleSpec
  engine: Engine
  currentEngine: EngineSpec
  weight: number // Total vehicle weight
  horsepowerRating: number // Current HP
  torqueRating: number // Current Nm

  constructor(vehicleSpec: VehicleSpec, engineSpec?: EngineSpec) {
    this.spec = vehicleSpec
    this.currentEngine = engineSpec || vehicleSpec.availableEngines[0]
    this.engine = new Engine(this.currentEngine)
    this.weight = vehicleSpec.weight
    this.horsepowerRating = vehicleSpec.basePower
    this.torqueRating = vehicleSpec.baseTorque
  }

  /**
   * Swap to a different engine
   */
  swapEngine(newEngine: EngineSpec): void {
    this.currentEngine = newEngine
    this.engine = new Engine(newEngine)
    // Engine swaps can affect weight
    this.weight = this.spec.weight + (newEngine.displacement / 1000) * 5 // Rough weight estimate
  }

  /**
   * Get power-to-weight ratio
   */
  getPowerToWeightRatio(): number {
    return this.horsepowerRating / this.weight
  }
}

export class VehicleDatabase {
  private cars: Map<string, VehicleSpec> = new Map()
  private motorcycles: Map<string, VehicleSpec> = new Map()

  constructor() {
    carDatabase.forEach(car => this.cars.set(car.id, car))
    motorcycleDatabase.forEach(moto => this.motorcycles.set(moto.id, moto))
  }

  getCar(id: string): VehicleSpec | undefined {
    return this.cars.get(id)
  }

  getMotorcycle(id: string): VehicleSpec | undefined {
    return this.motorcycles.get(id)
  }

  getAllCars(): VehicleSpec[] {
    return Array.from(this.cars.values())
  }

  getAllMotorcycles(): VehicleSpec[] {
    return Array.from(this.motorcycles.values())
  }
}
