import { Vehicle } from './vehicles'

export interface DynoResult {
  maxPower: number // hp
  maxTorque: number // Nm
  powerCurve: number[] // Power at 500 RPM intervals
  torqueCurve: number[] // Torque at 500 RPM intervals
  runTime: number // seconds
  passed: boolean
}

export class Dyno {
  private vehicle: Vehicle
  private isRunning: boolean = false
  private currentTime: number = 0
  private maxPower: number = 0
  private maxTorque: number = 0
  private powerReadings: number[] = []
  private torqueReadings: number[] = []
  private throttleProfile: (time: number) => number

  constructor(vehicle: Vehicle) {
    this.vehicle = vehicle
    // Default throttle profile: gradual spool up
    this.throttleProfile = (time: number) => {
      return Math.min(1, time / 2) // Full throttle after 2 seconds
    }
  }

  /**
   * Set custom throttle profile for the run
   */
  setThrottleProfile(profile: (time: number) => number): void {
    this.throttleProfile = profile
  }

  /**
   * Start a dyno run
   */
  start(): void {
    this.isRunning = true
    this.currentTime = 0
    this.maxPower = 0
    this.maxTorque = 0
    this.powerReadings = []
    this.torqueReadings = []
    this.vehicle.engine.state.rpm = 0
  }

  /**
   * Update dyno simulation
   */
  update(deltaTime: number): void {
    if (!this.isRunning) return

    this.currentTime += deltaTime
    const throttle = this.throttleProfile(this.currentTime)

    // Update engine
    this.vehicle.engine.update(deltaTime, throttle)

    // Record data
    const power = this.vehicle.engine.state.power
    const torque = this.vehicle.engine.state.torque

    this.powerReadings.push(power)
    this.torqueReadings.push(torque)

    this.maxPower = Math.max(this.maxPower, power)
    this.maxTorque = Math.max(this.maxTorque, torque)

    // End run when reaching near redline or after time limit
    if (
      this.vehicle.engine.state.rpm >= this.vehicle.currentEngine.redline * 0.95 ||
      this.currentTime > 15 // 15 second max run
    ) {
      this.end()
    }
  }

  /**
   * End dyno run
   */
  private end(): void {
    this.isRunning = false
  }

  /**
   * Get current dyno result
   */
  getResult(): DynoResult {
    return {
      maxPower: this.maxPower,
      maxTorque: this.maxTorque,
      powerCurve: [...this.powerReadings],
      torqueCurve: [...this.torqueReadings],
      runTime: this.currentTime,
      passed: this.maxPower > 0
    }
  }

  /**
   * Check if dyno run is active
   */
  isActive(): boolean {
    return this.isRunning
  }

  /**
   * Get current progress (0-1)
   */
  getProgress(): number {
    return Math.min(1, this.currentTime / 15)
  }
}
