import { Vehicle, VehicleDatabase } from './vehicles'
import { Dyno, DynoResult } from './dyno'
import { PixelRenderer } from '../rendering/pixel-renderer'
import { MenuSystem, MenuState } from '../ui/menu-system'
import { GarageSystem } from '../ui/garage-system'
import { ShopSystem } from '../ui/shop-system'
import { HUDSystem } from '../ui/hud-system'
import { CareerManager } from '../career/career-manager'
import { Leaderboard } from '../multiplayer/leaderboard'
import { AudioEngine } from '../sound/audio-engine'
import { SaveSystem } from '../save/save-system'
import { EXTENDED_CAR_DATABASE, EXTENDED_MOTORCYCLE_DATABASE } from './vehicle-database-extended'
import { SpriteRenderer } from '../rendering/sprite-renderer'
import { DynoVisualizer } from '../rendering/dyno-visualizer'

export type GameState = 'menu' | 'garage' | 'shop' | 'dyno' | 'results' | 'career' | 'leaderboard'

export class Game {
  private canvas: HTMLCanvasElement
  private renderer: PixelRenderer
  private spriteRenderer: SpriteRenderer
  private dynoVisualizer: DynoVisualizer
  private vehicleDb: VehicleDatabase
  private menuSystem: MenuSystem
  private careerManager: CareerManager
  private garage: GarageSystem
  private shop: ShopSystem
  private hud: HUDSystem
  private leaderboard: Leaderboard
  private audioEngine: AudioEngine
  private saveSystem: SaveSystem

  private vehicle: Vehicle | null = null
  private dyno: Dyno | null = null
  private currentState: GameState = 'menu'
  private throttleInput: number = 0
  private lastTime: number = 0
  private selectedMenuIndex: number = 0

  constructor(canvas: HTMLCanvasElement, saveSystem: SaveSystem) {
    this.canvas = canvas
    this.saveSystem = saveSystem
    this.renderer = new PixelRenderer(canvas)
    this.spriteRenderer = new SpriteRenderer()
    this.dynoVisualizer = new DynoVisualizer(this.renderer)
    this.vehicleDb = this.createExtendedVehicleDatabase()
    this.menuSystem = new MenuSystem(this.renderer, this.vehicleDb)
    this.careerManager = new CareerManager(this.vehicleDb)
    this.garage = this.careerManager.getGarage()
    this.shop = new ShopSystem()
    this.hud = new HUDSystem(this.renderer)
    this.leaderboard = new Leaderboard()
    this.audioEngine = new AudioEngine()

    this.setupSprites()
    this.setupInputHandlers()
  }

  private createExtendedVehicleDatabase(): VehicleDatabase {
    const db = new VehicleDatabase()
    // Add extended database vehicles
    // This would require modifying VehicleDatabase to support adding vehicles dynamically
    return db
  }

  private setupSprites(): void {
    this.spriteRenderer.registerSprite(this.spriteRenderer.createCarSprite())
    this.spriteRenderer.registerSprite(this.spriteRenderer.createMotorcycleSprite())
  }

  private setupInputHandlers(): void {
    // Input is handled through handleInput method
  }

  handleInput(action: string): void {
    switch (action) {
      case 'throttle-up':
        this.throttleInput = Math.min(1, this.throttleInput + 0.15)
        break
      case 'throttle-down':
        this.throttleInput = Math.max(0, this.throttleInput - 0.15)
        break
      case 'select':
        this.handleMenuSelect()
        break
      case 'nav-left':
        if (this.currentState === 'menu') this.menuSystem.navigate('up')
        break
      case 'nav-right':
        if (this.currentState === 'menu') this.menuSystem.navigate('down')
        break
      case 'back':
        if (this.currentState !== 'menu') {
          this.currentState = 'menu'
          this.menuSystem.setMenu('main')
        }
        break
    }
  }

  private handleMenuSelect(): void {
    const menu = this.menuSystem.getMenu()

    if (menu === 'main') {
      this.menuSystem.select()
    } else if (menu === 'vehicle-select') {
      // Select a vehicle and start career
      const cars = this.vehicleDb.getAllCars()
      if (cars.length > 0) {
        this.vehicle = new Vehicle(cars[0])
        this.garage.purchaseVehicle(cars[0], 0) // Free first vehicle
        this.currentState = 'garage'
        this.hud.setVehicle(this.vehicle)
      }
    }
  }

  start(): void {
    this.lastTime = performance.now()
    this.gameLoop()
  }

  private gameLoop = (): void => {
    const now = performance.now()
    const deltaTime = Math.min((now - this.lastTime) / 1000, 0.016)
    this.lastTime = now

    this.update(deltaTime)
    this.render()

    requestAnimationFrame(this.gameLoop)
  }

  private update(deltaTime: number): void {
    switch (this.currentState) {
      case 'menu':
        break
      case 'garage':
        break
      case 'shop':
        break
      case 'dyno':
        if (this.dyno && this.vehicle) {
          this.dyno.update(deltaTime)
          this.vehicle.engine.update(deltaTime, this.throttleInput)
          this.audioEngine.playEngineSound(this.vehicle.engine.state.rpm)
          if (this.vehicle.engine.state.boostLevel > 0) {
            this.audioEngine.playTurboSpool(this.vehicle.engine.state.boostLevel)
          }
          if (!this.dyno.isActive()) {
            this.currentState = 'results'
          }
        }
        break
      case 'results':
        break
      case 'career':
        break
      case 'leaderboard':
        break
    }
  }

  private render(): void {
    this.renderer.clear()

    switch (this.currentState) {
      case 'menu':
        this.renderMenu()
        break
      case 'garage':
        this.renderGarage()
        break
      case 'shop':
        this.renderShop()
        break
      case 'dyno':
        this.renderDyno()
        break
      case 'results':
        this.renderResults()
        break
      case 'career':
        this.renderCareer()
        break
      case 'leaderboard':
        this.renderLeaderboard()
        break
    }
  }

  private renderMenu(): void {
    this.menuSystem.render()
  }

  private renderGarage(): void {
    this.renderer.clear('#0a0a12')
    this.renderer.drawText('═══════════════════════════════════════', 40, 40, '#00ff00', 14)
    this.renderer.drawText('    GARAGE', 40, 70, '#00ff00', 20)
    this.renderer.drawText('═══════════════════════════════════════', 40, 100, '#00ff00', 14)

    if (this.vehicle) {
      const stats = this.garage.getStats()
      this.renderer.drawText(`Vehicle: ${this.vehicle.spec.name} (${this.vehicle.spec.year})`, 60, 150, '#00ffff', 12)
      this.renderer.drawText(`Engine: ${this.vehicle.currentEngine.name}`, 60, 180, '#00ffff', 12)
      this.renderer.drawText(`Power: ${this.vehicle.horsepowerRating} hp | Torque: ${this.vehicle.torqueRating} Nm`, 60, 210, '#00ff00', 12)
      this.renderer.drawText('', 60, 240, '#00ff00', 12)
      this.renderer.drawText(`Money: $${stats.money.toLocaleString()}`, 60, 270, '#ffff00', 12)
      this.renderer.drawText(`Reputation: ${stats.reputation}`, 60, 300, '#ffff00', 12)
      this.renderer.drawText(`Total Runs: ${stats.totalRuns} | Wins: ${stats.wins}`, 60, 330, '#00ccff', 12)

      this.renderer.drawText('', 60, 380, '#00ff00', 12)
      this.renderer.drawText('SPACE: Start Dyno Run | S: Shop | L: Leaderboard | ESC: Menu', 60, 450, '#888888', 11)
    }
  }

  private renderShop(): void {
    this.renderer.clear('#0a0a12')
    this.renderer.drawText('═════════════════════════════════════', 40, 40, '#00ff00', 14)
    this.renderer.drawText('    MODIFICATION SHOP', 40, 70, '#00ff00', 18)
    this.renderer.drawText('═════════════════════════════════════', 40, 100, '#00ff00', 14)

    const stats = this.garage.getStats()
    this.renderer.drawText(`Money: $${stats.money.toLocaleString()}`, 60, 150, '#ffff00', 12)

    const items = this.shop.getItems().slice(0, 5) // Show first 5 items
    items.forEach((item, idx) => {
      const y = 200 + idx * 50
      const color = this.shop.canAfford(item.id) ? '#00ff00' : '#ff3333'
      this.renderer.drawText(`${item.name}`, 80, y, color, 12)
      this.renderer.drawText(`$${item.cost} | ${item.description}`, 100, y + 25, '#00ccff', 10)
    })

    this.renderer.drawText('UP/DOWN: Navigate | SPACE: Buy | ESC: Back', 60, 600, '#888888', 10)
  }

  private renderDyno(): void {
    if (!this.dyno || !this.vehicle) return

    this.renderer.clear('#0a0a12')
    this.renderer.drawText('╔═══════════════════════════════════════╗', 30, 30, '#ff6600', 12)
    this.renderer.drawText('║          DYNO RUN IN PROGRESS         ║', 30, 50, '#ff6600', 12)
    this.renderer.drawText('╚═══════════════════════════════════════╝', 30, 70, '#ff6600', 12)

    // Main displays
    this.hud.render(60, 120)
    this.hud.renderDynoHUD(this.dyno.getResult().maxPower, this.dyno.getResult().maxTorque, 60, 280)

    // Progress bar
    const progress = this.dyno.getProgress()
    this.renderer.drawText(`Progress: ${(progress * 100).toFixed(0)}%`, 60, 450, '#00ff00', 12)
    this.renderer.drawProgressBar(60, 470, 300, 20, progress, '#00ff00')

    // Throttle indicator
    this.renderer.drawText(`Throttle: ${(this.throttleInput * 100).toFixed(0)}%`, 60, 520, '#ffff00', 12)
    this.renderer.drawProgressBar(60, 540, 300, 15, this.throttleInput, '#ffff00')

    this.renderer.drawText('UP/DOWN: Control Throttle | SPACE: Stop Run', 60, 600, '#888888', 10)
  }

  private renderResults(): void {
    if (!this.dyno) return

    const result = this.dyno.getResult()
    this.renderer.clear('#0a0a12')

    this.renderer.drawText('╔═══════════════════════════════════════╗', 30, 30, '#ffff00', 12)
    this.renderer.drawText('║            DYNO RESULTS               ║', 30, 50, '#ffff00', 12)
    this.renderer.drawText('╚═══════════════════════════════════════╝', 30, 70, '#ffff00', 12)

    this.renderer.drawText(`Max Power:  ${result.maxPower.toFixed(1).padStart(7, ' ')} hp`, 80, 150, '#00ff00', 14)
    this.renderer.drawText(`Max Torque: ${result.maxTorque.toFixed(1).padStart(7, ' ')} Nm`, 80, 190, '#00ff00', 14)
    this.renderer.drawText(`Run Time:   ${result.runTime.toFixed(2).padStart(6, ' ')} s`, 80, 230, '#00ccff', 12)

    // Update career stats
    const earnings = Math.floor(result.maxPower * 2)
    this.careerManager.completeDynoRun(result.maxPower, true, earnings)
    const careerStats = this.careerManager.getStats()

    this.renderer.drawText('', 80, 280, '#00ff00', 12)
    this.renderer.drawText(`Earned: $${earnings}`, 80, 300, '#ffff00', 12)
    this.renderer.drawText(`Total Money: $${careerStats.money.toLocaleString()}`, 80, 330, '#ffff00', 12)
    this.renderer.drawText(`Level: ${careerStats.level} | Reputation: ${careerStats.reputation}`, 80, 360, '#00ccff', 12)

    // Check achievements
    const milestones = this.careerManager.getMilestones()
    const newAchievements = milestones.filter(m => m.achieved)
    if (newAchievements.length > 0) {
      this.renderer.drawText('', 80, 400, '#00ff00', 12)
      this.renderer.drawText('ACHIEVEMENTS UNLOCKED:', 80, 420, '#ffff00', 12)
      newAchievements.forEach((ach, idx) => {
        this.renderer.drawText(`  ⭐ ${ach.name}`, 100, 440 + idx * 20, '#ffff00', 10)
      })
    }

    this.renderer.drawText('SPACE: Another Run | G: Garage | ESC: Menu', 80, 580, '#888888', 10)
  }

  private renderCareer(): void {
    const stats = this.careerManager.getStats()
    const progress = this.careerManager.getLevelProgress()
    const milestones = this.careerManager.getMilestones()

    this.renderer.clear('#0a0a12')
    this.renderer.drawText('═════════════════════════════════════', 40, 40, '#00ff00', 14)
    this.renderer.drawText('    CAREER STATS', 40, 70, '#00ff00', 18)
    this.renderer.drawText('═════════════════════════════════════', 40, 100, '#00ff00', 14)

    this.renderer.drawText(`Level: ${stats.level}`, 60, 150, '#ffff00', 12)
    this.renderer.drawText(`Progress: ${progress.percent.toFixed(0)}%`, 60, 175, '#ffff00', 11)
    this.renderer.drawProgressBar(150, 165, 200, 15, progress.percent / 100, '#00ff00')

    this.renderer.drawText(`Money: $${stats.money.toLocaleString()}`, 60, 220, '#00ff00', 12)
    this.renderer.drawText(`Total Earnings: $${stats.totalEarnings.toLocaleString()}`, 60, 245, '#00ff00', 12)
    this.renderer.drawText(`Reputation: ${stats.reputation}`, 60, 270, '#00ff00', 12)
    this.renderer.drawText('', 60, 300, '#00ff00', 12)
    this.renderer.drawText(`Total Runs: ${stats.totalRuns} | Wins: ${stats.wins} | Losses: ${stats.losses}`, 60, 320, '#00ccff', 12)
    this.renderer.drawText(`Win Rate: ${stats.winRate}%`, 60, 345, '#00ccff', 12)

    this.renderer.drawText('', 60, 390, '#ffff00', 12)
    this.renderer.drawText('MILESTONES:', 60, 410, '#ffff00', 12)
    milestones.slice(0, 3).forEach((milestone, idx) => {
      const status = milestone.achieved ? '✓' : '◯'
      const color = milestone.achieved ? '#00ff00' : '#666666'
      this.renderer.drawText(`${status} ${milestone.name}: ${milestone.description}`, 80, 430 + idx * 25, color, 10)
    })
  }

  private renderLeaderboard(): void {
    this.renderer.clear('#0a0a12')
    this.renderer.drawText('═════════════════════════════════════', 40, 40, '#00ff00', 14)
    this.renderer.drawText('    GLOBAL LEADERBOARD', 40, 70, '#00ff00', 18)
    this.renderer.drawText('═════════════════════════════════════', 40, 100, '#00ff00', 14)

    this.renderer.drawText('Rank | Player         | Best Power | Wins', 60, 150, '#ffff00', 11)
    this.renderer.drawText('────────────────────────────────────────', 60, 170, '#888888', 10)

    const leaderboard = this.leaderboard.getGlobalLeaderboard(8)
    leaderboard.forEach((entry, idx) => {
      const rank = (entry.rank + 1).toString().padStart(2, ' ')
      const name = entry.playerName.padEnd(15, ' ')
      const power = entry.bestPower.toFixed(0).padStart(10, ' ')
      const wins = entry.wins.toString().padStart(5, ' ')
      const line = `${rank}. ${name} | ${power} hp | ${wins} W`
      const color = idx === 0 ? '#ffff00' : idx === 1 ? '#cccccc' : idx === 2 ? '#ffaa00' : '#00ccff'
      this.renderer.drawText(line, 60, 190 + idx * 25, color, 10)
    })

    this.renderer.drawText('ESC: Back', 60, 600, '#888888', 10)
  }

  resize(width: number, height: number): void {
    this.renderer.resize(width, height)
  }
}
