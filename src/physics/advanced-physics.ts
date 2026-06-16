/**
 * Advanced physics simulation including tire slip, weight transfer, aerodynamics
 */

export interface TireData {
  grip: number // 0-1 grip coefficient
  slip: number // Current slip ratio
  temperature: number // Tire temp in Celsius
  pressure: number // PSI
  wear: number // 0-1 (1 = new, 0 = worn)
}

export interface VehiclePhysics {
  weight: number // kg
  centerOfGravity: number // Height in cm
  weightDistribution: number // 0-1 (0 = rear, 1 = front)
  dragCoefficient: number // Cd
  frontalArea: number // m^2
}

export interface AerodynamicsData {
  downforce: number // kg
  dragForce: number // N
  liftCoefficient: number // Cl
}

export class AdvancedPhysicsEngine {
  private physics: VehiclePhysics
  private tires: TireData[] = []
  private wheelSlip: number[] = []
  private aero: AerodynamicsData

  constructor(vehiclePhysics: VehiclePhysics) {
    this.physics = vehiclePhysics
    this.aero = {
      downforce: 0,
      dragForce: 0,
      liftCoefficient: 0.1
    }
    this.initializeTires()
  }

  private initializeTires(): void {
    for (let i = 0; i < 4; i++) {
      this.tires.push({
        grip: 1.0,
        slip: 0,
        temperature: 20,
        pressure: 32,
        wear: 1.0
      })
      this.wheelSlip.push(0)
    }
  }

  /**
   * Calculate tire grip based on temperature and wear
   */
  calculateTireGrip(tireIndex: number): number {
    const tire = this.tires[tireIndex]
    let grip = tire.wear

    // Temperature affects grip (peak around 80C)
    const optimalTemp = 80
    const tempDiff = Math.abs(tire.temperature - optimalTemp)
    const tempFactor = Math.max(0.6, 1.0 - tempDiff / 200)
    grip *= tempFactor

    // Pressure affects grip
    const optimalPressure = 32
    const pressureDiff = Math.abs(tire.pressure - optimalPressure)
    const pressureFactor = Math.max(0.7, 1.0 - pressureDiff / 50)
    grip *= pressureFactor

    return Math.max(0, Math.min(1, grip))
  }

  /**
   * Update tire slip ratio
   */
  updateTireSlip(rpm: number, vehicleSpeed: number, throttlePercent: number): number {
    const slipRatio = throttlePercent * (rpm / 8000)
    return Math.min(1, slipRatio)
  }

  /**
   * Calculate weight transfer during acceleration
   */
  calculateWeightTransfer(acceleration: number): { front: number; rear: number } {
    const cg = this.physics.centerOfGravity
    const wheelbase = 260 // cm (approximate)
    
    const longitudinalTransfer = (this.physics.weight * acceleration * cg) / wheelbase
    const frontWeight = this.physics.weight * this.physics.weightDistribution + longitudinalTransfer
    const rearWeight = this.physics.weight * (1 - this.physics.weightDistribution) - longitudinalTransfer

    return {
      front: frontWeight,
      rear: rearWeight
    }
  }

  /**
   * Calculate aerodynamic forces
   */
  calculateAerodynamics(velocity: number): AerodynamicsData {
    const airDensity = 1.225 // kg/m^3
    const v2 = velocity * velocity

    // Drag force (N)
    const dragForce = 0.5 * airDensity * this.physics.dragCoefficient * this.physics.frontalArea * v2

    // Downforce (kg converted from N)
    const downforce = (0.5 * airDensity * this.aero.liftCoefficient * this.physics.frontalArea * v2) / 9.81

    return {
      dragForce,
      downforce,
      liftCoefficient: this.aero.liftCoefficient
    }
  }

  /**
   * Update tire temperature based on slip and grip
   */
  updateTireTemperature(tireIndex: number, slip: number, deltaTime: number): void {
    const tire = this.tires[tireIndex]
    const frictionHeat = slip * 50 * deltaTime // Heat generation from slip
    const cooling = (tire.temperature - 20) * 0.02 * deltaTime

    tire.temperature += frictionHeat - cooling
    tire.temperature = Math.max(20, Math.min(120, tire.temperature))
  }

  /**
   * Degrade tire wear
   */
  updateTireWear(tireIndex: number, slip: number, deltaTime: number): void {
    const tire = this.tires[tireIndex]
    const wearRate = slip * 0.001 * deltaTime
    tire.wear -= wearRate
    tire.wear = Math.max(0, Math.min(1, tire.wear))
  }

  /**
   * Get tire data
   */
  getTires(): TireData[] {
    return this.tires
  }

  /**
   * Get average tire grip
   */
  getAverageGrip(): number {
    const totalGrip = this.tires.reduce((sum, tire, idx) => sum + this.calculateTireGrip(idx), 0)
    return totalGrip / this.tires.length
  }
}
