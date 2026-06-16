/**
 * Save/Load system for garage management and progression tracking
 */

export interface SaveData {
  version: string
  timestamp: number
  careerStats: {
    money: number
    reputation: number
    level: number
    totalRuns: number
    wins: number
    losses: number
    bestDynoRun: number
    totalEarnings: number
  }
  vehicles: Array<{
    id: string
    name: string
    engine: {
      name: string
      displacement: number
    }
    modifications: string[]
    tuneProfile: {
      fuelMap: number
      ignitionTiming: number
      boostTarget: number
      injectorDuty: number
      vvt: number
    }
  }>
  garage: {
    currentVehicleId: string
    totalValue: number
  }
  achievements: Array<{
    id: string
    achieved: boolean
    unlockedAt: number
  }>
  settings: {
    masterVolume: number
    soundEnabled: boolean
    graphicsQuality: 'low' | 'medium' | 'high'
    difficulty: 'easy' | 'normal' | 'hard'
  }
}

export class SaveSystem {
  private saveData: SaveData | null = null
  private autoSaveInterval: NodeJS.Timeout | null = null
  private storageKey: string = 'dyno_tuner_save'

  constructor() {
    this.initializeStorage()
  }

  private initializeStorage(): void {
    // Check for existing save
    const saved = localStorage.getItem(this.storageKey)
    if (saved) {
      try {
        this.saveData = JSON.parse(saved)
      } catch (e) {
        console.error('Failed to load save data:', e)
      }
    }
  }

  /**
   * Create new save
   */
  createNewSave(): SaveData {
    this.saveData = {
      version: '1.0.0',
      timestamp: Date.now(),
      careerStats: {
        money: 50000,
        reputation: 0,
        level: 1,
        totalRuns: 0,
        wins: 0,
        losses: 0,
        bestDynoRun: 0,
        totalEarnings: 0
      },
      vehicles: [],
      garage: {
        currentVehicleId: '',
        totalValue: 0
      },
      achievements: [],
      settings: {
        masterVolume: 0.8,
        soundEnabled: true,
        graphicsQuality: 'high',
        difficulty: 'normal'
      }
    }
    return this.saveData
  }

  /**
   * Save to storage
   */
  save(): boolean {
    try {
      if (!this.saveData) return false
      this.saveData.timestamp = Date.now()
      localStorage.setItem(this.storageKey, JSON.stringify(this.saveData))
      return true
    } catch (e) {
      console.error('Failed to save:', e)
      return false
    }
  }

  /**
   * Load from storage
   */
  load(): SaveData | null {
    const saved = localStorage.getItem(this.storageKey)
    if (saved) {
      try {
        this.saveData = JSON.parse(saved)
        return this.saveData
      } catch (e) {
        console.error('Failed to load save:', e)
      }
    }
    return null
  }

  /**
   * Start autosave
   */
  startAutoSave(intervalMs: number = 30000): void {
    if (this.autoSaveInterval) clearInterval(this.autoSaveInterval)
    this.autoSaveInterval = setInterval(() => this.save(), intervalMs)
  }

  /**
   * Stop autosave
   */
  stopAutoSave(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval)
      this.autoSaveInterval = null
    }
  }

  /**
   * Update career stats
   */
  updateCareerStats(stats: Partial<SaveData['careerStats']>): void {
    if (!this.saveData) return
    this.saveData.careerStats = { ...this.saveData.careerStats, ...stats }
  }

  /**
   * Add vehicle to save
   */
  addVehicle(vehicle: SaveData['vehicles'][0]): void {
    if (!this.saveData) return
    this.saveData.vehicles.push(vehicle)
  }

  /**
   * Get current save
   */
  getCurrentSave(): SaveData | null {
    return this.saveData
  }

  /**
   * Delete save
   */
  deleteSave(): void {
    localStorage.removeItem(this.storageKey)
    this.saveData = null
  }

  /**
   * Export save as JSON
   */
  exportSave(): string {
    if (!this.saveData) return ''
    return JSON.stringify(this.saveData, null, 2)
  }

  /**
   * Import save from JSON
   */
  importSave(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData)
      this.saveData = imported
      return this.save()
    } catch (e) {
      console.error('Failed to import save:', e)
      return false
    }
  }
}
