import { Vehicle, VehicleDatabase } from './game/vehicles'

export interface VehicleDatabase {
  getCar(id: string): VehicleSpec | undefined
  getMotorcycle(id: string): VehicleSpec | undefined
  getAllCars(): VehicleSpec[]
  getAllMotorcycles(): VehicleSpec[]
}

export class VehicleDatabase {
  private cars: Map<string, any> = new Map()
  private motorcycles: Map<string, any> = new Map()

  constructor() {
    this.initializeDatabases()
  }

  private initializeDatabases(): void {
    // Base vehicles are already loaded from vehicles.ts
    // Extended vehicles can be added here
  }

  getCar(id: string): any | undefined {
    return this.cars.get(id)
  }

  getMotorcycle(id: string): any | undefined {
    return this.motorcycles.get(id)
  }

  getAllCars(): any[] {
    return Array.from(this.cars.values())
  }

  getAllMotorcycles(): any[] {
    return Array.from(this.motorcycles.values())
  }
}
