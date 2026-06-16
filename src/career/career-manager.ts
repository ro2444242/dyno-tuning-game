import { Vehicle, VehicleDatabase, VehicleSpec } from '../game/vehicles'
import { GarageSystem, GarageVehicle } from '../ui/garage-system'

export interface CareerStats {
  money: number
  reputation: number
  level: number
  totalRuns: number
  wins: number
  losses: number
  bestDynoRun: number
  totalEarnings: number
}

export interface Milestone {
  id: string
  name: string
  description: string
  requirement: number
  reward: number
  achieved: boolean
}

export class CareerManager {
  private garage: GarageSystem
  private stats: CareerStats
  private milestones: Milestone[] = []
  private currentLevel: number = 1
  private experiencePoints: number = 0
  private experienceToNextLevel: number = 1000

  constructor(private vehicleDb: VehicleDatabase) {
    this.garage = new GarageSystem(vehicleDb)
    this.stats = {
      money: 50000,
      reputation: 0,
      level: 1,
      totalRuns: 0,
      wins: 0,
      losses: 0,
      bestDynoRun: 0,
      totalEarnings: 0
    }
    this.initializeMilestones()
  }

  private initializeMilestones(): void {
    this.milestones = [
      {
        id: 'first-run',
        name: 'First Dyno',
        description: 'Complete your first dyno run',
        requirement: 1,
        reward: 500,
        achieved: false
      },
      {
        id: 'hundred-runs',
        name: 'Century Driver',
        description: 'Complete 100 dyno runs',
        requirement: 100,
        reward: 5000,
        achieved: false
      },
      {
        id: 'thousand-hp',
        name: 'Four Digit Club',
        description: 'Achieve 1000 hp dyno run',
        requirement: 1000,
        reward: 10000,
        achieved: false
      },
      {
        id: 'five-cars',
        name: 'Collector',
        description: 'Own 5 vehicles',
        requirement: 5,
        reward: 3000,
        achieved: false
      },
      {
        id: 'turbo-king',
        name: 'Forced Induction Master',
        description: 'Add turbos to 3 vehicles',
        requirement: 3,
        reward: 4000,
        achieved: false
      }
    ]
  }

  /**
   * Complete a dyno run
   */
  completeDynoRun(power: number, won: boolean, earnings: number): void {
    this.stats.totalRuns++
    this.stats.bestDynoRun = Math.max(this.stats.bestDynoRun, power)

    if (won) {
      this.stats.wins++
      this.stats.reputation += 15
    } else {
      this.stats.losses++
      this.stats.reputation += 5
    }

    this.garage.addMoney(earnings)
    this.stats.money = this.garage.getStats().money
    this.stats.totalEarnings += earnings

    this.addExperience(earnings / 10)
    this.checkMilestones()
  }

  private addExperience(amount: number): void {
    this.experiencePoints += amount
    while (this.experiencePoints >= this.experienceToNextLevel) {
      this.levelUp()
    }
  }

  private levelUp(): void {
    this.currentLevel++
    this.experiencePoints -= this.experienceToNextLevel
    this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.1)
    this.stats.level = this.currentLevel
  }

  private checkMilestones(): void {
    this.milestones.forEach(milestone => {
      if (!milestone.achieved) {
        let isAchieved = false

        if (milestone.id === 'first-run') {
          isAchieved = this.stats.totalRuns >= milestone.requirement
        } else if (milestone.id === 'hundred-runs') {
          isAchieved = this.stats.totalRuns >= milestone.requirement
        } else if (milestone.id === 'thousand-hp') {
          isAchieved = this.stats.bestDynoRun >= milestone.requirement
        } else if (milestone.id === 'five-cars') {
          isAchieved = this.garage.getVehicles().length >= milestone.requirement
        }

        if (isAchieved) {
          milestone.achieved = true
          this.garage.addMoney(milestone.reward)
          this.stats.money += milestone.reward
        }
      }
    })
  }

  getStats(): CareerStats {
    return { ...this.stats }
  }

  getMilestones(): Milestone[] {
    return this.milestones
  }

  getGarage(): GarageSystem {
    return this.garage
  }

  getLevelProgress(): { current: number; total: number; percent: number } {
    return {
      current: this.experiencePoints,
      total: this.experienceToNextLevel,
      percent: (this.experiencePoints / this.experienceToNextLevel) * 100
    }
  }
}
