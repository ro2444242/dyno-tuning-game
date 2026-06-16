/**
 * Engine simulation and physics calculations
 */

export interface EngineSpec {
  name: string
  displacement: number // cc
  basePower: number // hp
  baseTorque: number // Nm
  redline: number // RPM
  maxBoost: number // psi (for turbocharged engines)
  turboType: 'none' | 'turbo' | 'supercharger' | 'twin-turbo'
  cylinderCount: number
  fuelType: 'regular' | 'premium' | 'race'
}

export interface EngineState {
  rpm: number
  throttle: number // 0-1
  power: number // Current hp output
  torque: number // Current Nm output
  boostLevel: number // Current boost psi
  temperature: number // Engine temp in Celsius
  fuelConsumption: number // L/min
}

export class Engine {
  spec: EngineSpec
  state: EngineState
  private ecuMap: Map<string, number> = new Map()
  private modifications: EngineModification[] = []

  constructor(spec: EngineSpec) {
    this.spec = spec
    this.state = {
      rpm: 0,
      throttle: 0,
      power: 0,
      torque: 0,
      boostLevel: 0,
      temperature: 20,
      fuelConsumption: 0
    }
    this.initializeECU()
  }

  private initializeECU(): void {
    // Base ECU parameters
    this.ecuMap.set('fuelMap', 1.0)
    this.ecuMap.set('ignitionTiming', 25)
    this.ecuMap.set('boostTarget', this.spec.maxBoost * 0.8)
    this.ecuMap.set('injectorDuty', 0.85)
    this.ecuMap.set('vvt', 0) // Variable valve timing offset
  }

  /**
   * Update engine state based on throttle input and time delta
   */
  update(deltaTime: number, throttle: number): void {
    this.state.throttle = Math.max(0, Math.min(1, throttle))

    // Simulate RPM acceleration
    const rpmAccel = this.state.throttle * 8000 * deltaTime
    this.state.rpm = Math.min(this.state.rpm + rpmAccel, this.spec.redline * 1.1)

    // Calculate boost level
    this.updateBoost()

    // Calculate power and torque based on RPM curve
    this.calculatePowerTorque()

    // Update engine temperature
    this.updateTemperature(deltaTime)

    // Calculate fuel consumption
    this.calculateFuelConsumption()
  }

  private updateBoost(): void {
    const targetBoost = this.state.throttle * this.ecuMap.get('boostTarget')!
    const boostAccel = (targetBoost - this.state.boostLevel) * 0.1
    this.state.boostLevel = Math.max(0, this.state.boostLevel + boostAccel)
  }

  private calculatePowerTorque(): void {
    const rpmRatio = this.state.rpm / this.spec.redline
    
    // Base torque curve (bell curve approximation)
    let torqueCurve = Math.sin(rpmRatio * Math.PI) * 0.8 + 0.2
    torqueCurve = Math.max(0, torqueCurve)
    
    let baseTorque = this.spec.baseTorque * torqueCurve
    
    // Apply modifications
    for (const mod of this.modifications) {
      baseTorque *= mod.torqueMultiplier
    }
    
    // Apply ECU tuning
    baseTorque *= this.ecuMap.get('fuelMap')!
    
    // Boost contribution
    baseTorque += this.state.boostLevel * 5 // 5 Nm per psi of boost
    
    this.state.torque = baseTorque
    this.state.power = (baseTorque * this.state.rpm) / 7.5 // Convert to HP
  }

  private updateTemperature(deltaTime: number): void {
    const load = (this.state.throttle + this.state.boostLevel / 20) / 2
    const heatGeneration = load * 100 * deltaTime
    const cooling = (this.state.temperature - 20) * 0.05
    this.state.temperature += heatGeneration - cooling
    this.state.temperature = Math.max(20, Math.min(120, this.state.temperature))
  }

  private calculateFuelConsumption(): void {
    const load = this.state.throttle
    this.state.fuelConsumption = (this.spec.displacement / 1000) * (this.state.rpm / 1000) * load * 0.1
  }

  /**
   * Adjust ECU parameter
   */
  tuneECU(parameter: string, value: number): void {
    this.ecuMap.set(parameter, value)
  }

  /**
   * Add engine modification
   */
  addModification(mod: EngineModification): void {
    this.modifications.push(mod)
  }

  /**
   * Get current ECU map state
   */
  getECUMap(): Map<string, number> {
    return new Map(this.ecuMap)
  }
}

export interface EngineModification {
  name: string
  torqueMultiplier: number
  powerMultiplier: number
  cost: number
  weight: number // kg
}
