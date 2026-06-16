/**
 * Forced induction system (turbo, supercharger)
 */

export interface ForcedInductionConfig {
  type: 'turbo' | 'supercharger' | 'twin-turbo'
  size: number // 0.5 to 2.0 multiplier
  spoolTime: number // ms to reach full boost
  maxBoost: number // psi
  efficiency: number // 0.7 to 1.0
}

export class ForcedInductionSystem {
  private config: ForcedInductionConfig
  private currentBoost: number = 0
  private spoolProgress: number = 0

  constructor(config: ForcedInductionConfig) {
    this.config = config
  }

  /**
   * Update boost level based on engine load
   */
  update(engineLoad: number, deltaTime: number): number {
    const targetBoost = engineLoad * this.config.maxBoost
    
    // Spool rate depends on turbo size and type
    let spoolRate = (this.config.size / this.config.spoolTime) * 1000
    if (this.config.type === 'supercharger') {
      spoolRate *= 2 // Superchargers spool faster
    }

    const diff = targetBoost - this.currentBoost
    const change = Math.sign(diff) * Math.min(Math.abs(diff), spoolRate * deltaTime)
    this.currentBoost = Math.max(0, this.currentBoost + change)

    return this.currentBoost
  }

  /**
   * Get current boost level
   */
  getBoost(): number {
    return this.currentBoost
  }

  /**
   * Upgrade turbo size
   */
  upgradeSize(newSize: number): void {
    this.config.size = Math.min(2.0, Math.max(0.5, newSize))
  }

  /**
   * Increase max boost
   */
  increaseMaxBoost(amount: number): void {
    this.config.maxBoost += amount
  }
}
