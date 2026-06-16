import { Vehicle, VehicleDatabase, VehicleSpec } from '../game/vehicles'
import { EngineSpec, EngineModification } from '../game/engine'
import { PixelRenderer } from '../rendering/pixel-renderer'

export interface GarageVehicle {
  vehicle: Vehicle
  purchasePrice: number
  modifications: EngineModification[]
  totalMoney: number
  reputation: number
}

export class GarageSystem {
  private vehicles: Map<string, GarageVehicle> = new Map()
  private currentVehicleId: string | null = null
  private money: number = 50000 // Starting money
  private reputation: number = 0
  private totalRuns: number = 0
  private wins: number = 0
  private losses: number = 0

  constructor(private vehicleDb: VehicleDatabase) {}

  /**
   * Purchase a vehicle
   */
  purchaseVehicle(vehicleSpec: VehicleSpec, price?: number): boolean {
    const purchasePrice = price || vehicleSpec.basePower * 50

    if (this.money < purchasePrice) {
      return false
    }

    const vehicle = new Vehicle(vehicleSpec)
    const garageVehicle: GarageVehicle = {
      vehicle,
      purchasePrice,
      modifications: [],
      totalMoney: this.money,
      reputation: this.reputation
    }

    this.vehicles.set(vehicleSpec.id, garageVehicle)
    this.money -= purchasePrice
    this.currentVehicleId = vehicleSpec.id
    return true
  }

  /**
   * Add modification to current vehicle
   */
  addModification(mod: EngineModification): boolean {
    if (!this.currentVehicleId) return false
    const garageVehicle = this.vehicles.get(this.currentVehicleId)
    if (!garageVehicle || this.money < mod.cost) return false

    garageVehicle.modifications.push(mod)
    garageVehicle.vehicle.engine.addModification(mod)
    this.money -= mod.cost
    return true
  }

  /**
   * Get current vehicle
   */
  getCurrentVehicle(): Vehicle | null {
    if (!this.currentVehicleId) return null
    return this.vehicles.get(this.currentVehicleId)?.vehicle || null
  }

  /**
   * Switch to different vehicle
   */
  selectVehicle(id: string): boolean {
    if (this.vehicles.has(id)) {
      this.currentVehicleId = id
      return true
    }
    return false
  }

  /**
   * Get all owned vehicles
   */
  getVehicles(): GarageVehicle[] {
    return Array.from(this.vehicles.values())
  }

  /**
   * Add money from race
   */
  addMoney(amount: number): void {
    this.money += amount
  }

  /**
   * Add reputation
   */
  addReputation(amount: number): void {
    this.reputation += amount
  }

  /**
   * Record race result
   */
  recordRace(won: boolean, earnedMoney: number): void {
    this.totalRuns++
    if (won) {
      this.wins++
      this.reputation += 10
      this.addMoney(earnedMoney)
    } else {
      this.losses++
      this.reputation += 2
      this.addMoney(Math.floor(earnedMoney * 0.3))
    }
  }

  /**
   * Get stats
   */
  getStats() {
    return {
      money: this.money,
      reputation: this.reputation,
      totalRuns: this.totalRuns,
      wins: this.wins,
      losses: this.losses,
      winRate: this.totalRuns > 0 ? ((this.wins / this.totalRuns) * 100).toFixed(1) : '0'
    }
  }
}
