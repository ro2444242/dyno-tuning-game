/**
 * Transmission system
 */

export interface TransmissionSpec {
  name: string
  type: 'manual' | 'automatic' | 'cvt'
  gears: number
  ratios: number[]
  efficiency: number // 0.85 to 1.0
  shiftTime: number // ms
}

export const TRANSMISSION_CATALOG: TransmissionSpec[] = [
  {
    name: '5-Speed Manual',
    type: 'manual',
    gears: 5,
    ratios: [3.5, 2.1, 1.3, 0.9, 0.7],
    efficiency: 0.95,
    shiftTime: 150
  },
  {
    name: '6-Speed Manual',
    type: 'manual',
    gears: 6,
    ratios: [3.5, 2.1, 1.5, 1.1, 0.85, 0.68],
    efficiency: 0.96,
    shiftTime: 140
  },
  {
    name: '8-Speed Automatic',
    type: 'automatic',
    gears: 8,
    ratios: [4.5, 3.2, 2.4, 1.8, 1.4, 1.1, 0.87, 0.69],
    efficiency: 0.92,
    shiftTime: 200
  },
  {
    name: 'CVT',
    type: 'cvt',
    gears: 1,
    ratios: [4.5, 0.4],
    efficiency: 0.90,
    shiftTime: 50
  }
]

export class Transmission {
  private spec: TransmissionSpec
  private currentGear: number = 1
  private isShifting: boolean = false
  private shiftTimer: number = 0

  constructor(spec: TransmissionSpec) {
    this.spec = spec
  }

  /**
   * Get gear ratio for current gear
   */
  getGearRatio(): number {
    return this.spec.ratios[Math.max(0, Math.min(this.spec.gears - 1, this.currentGear - 1))]
  }

  /**
   * Shift to a gear
   */
  shiftToGear(gear: number): void {
    if (this.isShifting) return
    if (gear < 1 || gear > this.spec.gears) return

    this.currentGear = gear
    this.isShifting = true
    this.shiftTimer = 0
  }

  /**
   * Auto-shift for automatic transmissions
   */
  autoShift(rpm: number, maxRPM: number): void {
    if (this.spec.type === 'automatic' || this.spec.type === 'cvt') {
      const rpmRatio = rpm / maxRPM
      const optimalGear = Math.ceil(rpmRatio * this.spec.gears)
      this.shiftToGear(Math.max(1, optimalGear))
    }
  }

  /**
   * Update transmission state
   */
  update(deltaTime: number): void {
    if (this.isShifting) {
      this.shiftTimer += deltaTime * 1000
      if (this.shiftTimer >= this.spec.shiftTime) {
        this.isShifting = false
      }
    }
  }

  /**
   * Get transmission efficiency
   */
  getEfficiency(): number {
    return this.spec.efficiency
  }

  /**
   * Check if currently shifting
   */
  isShiftingNow(): boolean {
    return this.isShifting
  }
}
