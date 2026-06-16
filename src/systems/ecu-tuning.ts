import { Engine } from '../game/engine'

export interface ECUTuneProfile {
  name: string
  fuelMap: number
  ignitionTiming: number
  boostTarget: number
  injectorDuty: number
  vvt: number // Variable valve timing
}

export class ECUTuner {
  private engine: Engine
  private profiles: Map<string, ECUTuneProfile> = new Map()

  constructor(engine: Engine) {
    this.engine = engine
    this.initializeProfiles()
  }

  private initializeProfiles(): void {
    // Stock/safe profile
    this.profiles.set('stock', {
      name: 'Stock',
      fuelMap: 1.0,
      ignitionTiming: 25,
      boostTarget: this.engine.spec.maxBoost * 0.8,
      injectorDuty: 0.85,
      vvt: 0
    })

    // Performance profile
    this.profiles.set('performance', {
      name: 'Performance',
      fuelMap: 1.15,
      ignitionTiming: 28,
      boostTarget: this.engine.spec.maxBoost * 0.95,
      injectorDuty: 0.92,
      vvt: 5
    })

    // Race profile (aggressive)
    this.profiles.set('race', {
      name: 'Race',
      fuelMap: 1.3,
      ignitionTiming: 32,
      boostTarget: this.engine.spec.maxBoost * 1.0,
      injectorDuty: 0.98,
      vvt: 10
    })

    // Drag racing (max boost, early spool)
    this.profiles.set('drag', {
      name: 'Drag',
      fuelMap: 1.4,
      ignitionTiming: 30,
      boostTarget: this.engine.spec.maxBoost * 1.05,
      injectorDuty: 1.0,
      vvt: 15
    })
  }

  /**
   * Load a pre-built tune profile
   */
  loadProfile(profileName: string): void {
    const profile = this.profiles.get(profileName)
    if (!profile) return

    this.engine.tuneECU('fuelMap', profile.fuelMap)
    this.engine.tuneECU('ignitionTiming', profile.ignitionTiming)
    this.engine.tuneECU('boostTarget', profile.boostTarget)
    this.engine.tuneECU('injectorDuty', profile.injectorDuty)
    this.engine.tuneECU('vvt', profile.vvt)
  }

  /**
   * Custom tune individual parameters
   */
  customTune(
    fuelMap?: number,
    ignitionTiming?: number,
    boostTarget?: number,
    injectorDuty?: number,
    vvt?: number
  ): void {
    if (fuelMap !== undefined) this.engine.tuneECU('fuelMap', Math.max(0.8, Math.min(1.5, fuelMap)))
    if (ignitionTiming !== undefined) this.engine.tuneECU('ignitionTiming', Math.max(20, Math.min(40, ignitionTiming)))
    if (boostTarget !== undefined) this.engine.tuneECU('boostTarget', Math.max(0, Math.min(this.engine.spec.maxBoost * 1.1, boostTarget)))
    if (injectorDuty !== undefined) this.engine.tuneECU('injectorDuty', Math.max(0.7, Math.min(1.0, injectorDuty)))
    if (vvt !== undefined) this.engine.tuneECU('vvt', Math.max(-20, Math.min(20, vvt)))
  }

  /**
   * Get current tune profile
   */
  getCurrentTune(): ECUTuneProfile {
    const ecuMap = this.engine.getECUMap()
    return {
      name: 'Custom',
      fuelMap: ecuMap.get('fuelMap') || 1.0,
      ignitionTiming: ecuMap.get('ignitionTiming') || 25,
      boostTarget: ecuMap.get('boostTarget') || 0,
      injectorDuty: ecuMap.get('injectorDuty') || 0.85,
      vvt: ecuMap.get('vvt') || 0
    }
  }

  /**
   * Get all available profiles
   */
  getAvailableProfiles(): ECUTuneProfile[] {
    return Array.from(this.profiles.values())
  }
}
