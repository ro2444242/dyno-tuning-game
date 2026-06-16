import { Vehicle, VehicleDatabase } from './vehicles'
import { Dyno } from './dyno'
import { PixelRenderer } from '../rendering/pixel-renderer'

export class Game {
  private canvas: HTMLCanvasElement
  private renderer: PixelRenderer
  private vehicleDb: VehicleDatabase
  private vehicle: Vehicle | null = null
  private dyno: Dyno | null = null
  private lastTime: number = 0
  private gameState: 'menu' | 'garage' | 'dyno' | 'results' = 'menu'
  private throttleInput: number = 0

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.renderer = new PixelRenderer(canvas)
    this.vehicleDb = new VehicleDatabase()
    this.setupInputHandlers()
  }

  private setupInputHandlers(): void {
    // Throttle control
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w') {
        this.throttleInput = Math.min(1, this.throttleInput + 0.1)
      }
      if (e.key === 'ArrowDown' || e.key === 's') {
        this.throttleInput = Math.max(0, this.throttleInput - 0.1)
      }
      if (e.key === ' ') {
        this.throttleInput = 0 // Release throttle
      }
    })

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w') {
        // Gradual throttle decay
        this.throttleInput = Math.max(0, this.throttleInput - 0.02)
      }
    })

    // Mouse throttle control
    window.addEventListener('mousemove', (e) => {
      const y = e.clientY / this.canvas.height
      this.throttleInput = 1 - y // Top = full throttle
    })
  }

  /**
   * Start the game loop
   */
  start(): void {
    this.lastTime = performance.now()
    this.gameLoop()
  }

  /**
   * Main game loop
   */
  private gameLoop = (): void => {
    const now = performance.now()
    const deltaTime = Math.min((now - this.lastTime) / 1000, 0.016) // Cap at 60fps
    this.lastTime = now

    this.update(deltaTime)
    this.render()

    requestAnimationFrame(this.gameLoop)
  }

  /**
   * Update game state
   */
  private update(deltaTime: number): void {
    if (this.gameState === 'menu') {
      // Menu updates
    } else if (this.gameState === 'garage') {
      // Garage updates
    } else if (this.gameState === 'dyno' && this.dyno) {
      this.dyno.update(deltaTime)
      if (!this.dyno.isActive()) {
        this.gameState = 'results'
      }
    }
  }

  /**
   * Render game
   */
  private render(): void {
    this.renderer.clear()

    if (this.gameState === 'menu') {
      this.renderMenu()
    } else if (this.gameState === 'garage') {
      this.renderGarage()
    } else if (this.gameState === 'dyno' && this.dyno && this.vehicle) {
      this.renderDyno()
    } else if (this.gameState === 'results' && this.dyno) {
      this.renderResults()
    }
  }

  private renderMenu(): void {
    this.renderer.drawText('DYNO TUNER', 100, 50, 'white')
    this.renderer.drawText('Press 1 for Car, 2 for Motorcycle', 100, 150, 'yellow')
  }

  private renderGarage(): void {
    this.renderer.drawText('GARAGE', 100, 50, 'white')
    if (this.vehicle) {
      this.renderer.drawText(`Vehicle: ${this.vehicle.spec.name}`, 100, 100, 'green')
      this.renderer.drawText('Press SPACE to go to Dyno', 100, 200, 'yellow')
    }
  }

  private renderDyno(): void {
    this.renderer.drawText('DYNO RUN', 50, 30, 'white')
    
    const rpm = this.vehicle!.engine.state.rpm
    const power = this.vehicle!.engine.state.power
    const torque = this.vehicle!.engine.state.torque
    const boost = this.vehicle!.engine.state.boostLevel

    this.renderer.drawText(`RPM: ${Math.floor(rpm)}`, 50, 80, 'cyan')
    this.renderer.drawText(`Power: ${power.toFixed(1)} hp`, 50, 130, 'yellow')
    this.renderer.drawText(`Torque: ${torque.toFixed(1)} Nm`, 50, 180, 'orange')
    this.renderer.drawText(`Boost: ${boost.toFixed(1)} psi`, 50, 230, 'red')

    const progress = this.dyno!.getProgress()
    this.renderer.drawProgressBar(50, 300, 400, 20, progress, 'green')
  }

  private renderResults(): void {
    const result = this.dyno!.getResult()
    
    this.renderer.drawText('RESULTS', 100, 50, 'white')
    this.renderer.drawText(`Max Power: ${result.maxPower.toFixed(1)} hp`, 100, 120, 'yellow')
    this.renderer.drawText(`Max Torque: ${result.maxTorque.toFixed(1)} Nm`, 100, 170, 'yellow')
    this.renderer.drawText(`Run Time: ${result.runTime.toFixed(2)}s`, 100, 220, 'cyan')
    this.renderer.drawText('Press SPACE for another run', 100, 300, 'green')
  }

  /**
   * Load a vehicle
   */
  selectVehicle(type: 'car' | 'motorcycle', id: string): void {
    const spec = type === 'car' 
      ? this.vehicleDb.getCar(id)
      : this.vehicleDb.getMotorcycle(id)
    
    if (spec) {
      this.vehicle = new Vehicle(spec)
      this.gameState = 'garage'
    }
  }

  /**
   * Start dyno run
   */
  startDynoRun(): void {
    if (!this.vehicle) return
    this.dyno = new Dyno(this.vehicle)
    this.dyno.start()
    this.gameState = 'dyno'
  }

  /**
   * Handle window resize
   */
  resize(width: number, height: number): void {
    this.renderer.resize(width, height)
  }
}
