import { PixelRenderer } from '../rendering/pixel-renderer'
import { Engine } from '../game/engine'
import { Vehicle } from '../game/vehicles'

export class HUDSystem {
  private renderer: PixelRenderer
  private engine: Engine | null = null
  private vehicle: Vehicle | null = null
  private showDebug: boolean = false

  constructor(renderer: PixelRenderer) {
    this.renderer = renderer
  }

  setVehicle(vehicle: Vehicle): void {
    this.vehicle = vehicle
    this.engine = vehicle.engine
  }

  toggleDebug(): void {
    this.showDebug = !this.showDebug
  }

  render(x: number = 20, y: number = 20): void {
    if (!this.engine) return

    const state = this.engine.state

    // RPM Display
    this.renderer.drawText(`RPM: ${Math.floor(state.rpm).toString().padStart(5, '0')}`, x, y, '#ffff00', 12)

    // Power Display
    this.renderer.drawText(`PWR: ${state.power.toFixed(1).padStart(6, ' ')} hp`, x, y + 25, '#00ff00', 12)

    // Torque Display
    this.renderer.drawText(`TRQ: ${state.torque.toFixed(1).padStart(6, ' ')} Nm`, x, y + 50, '#00ccff', 12)

    // Boost Display (if applicable)
    if (this.engine.spec.maxBoost > 0) {
      this.renderer.drawText(`BOS: ${state.boostLevel.toFixed(1).padStart(5, ' ')} psi`, x, y + 75, '#ff6600', 12)
    }

    // Temperature
    this.renderer.drawText(`TMP: ${state.temperature.toFixed(0).padStart(3, ' ')}°C`, x, y + 100, '#ff3333', 12)

    // Fuel consumption
    this.renderer.drawText(`FUEL: ${state.fuelConsumption.toFixed(2)} L/min`, x, y + 125, '#0099ff', 12)

    if (this.showDebug) {
      this.renderDebugInfo(x, y + 160)
    }
  }

  private renderDebugInfo(x: number, y: number): void {
    if (!this.vehicle || !this.engine) return

    const state = this.engine.state
    const spec = this.engine.spec

    this.renderer.drawText(`[DEBUG INFO]`, x, y, '#ff00ff', 10)
    this.renderer.drawText(`Engine: ${spec.name}`, x, y + 20, '#ff00ff', 9)
    this.renderer.drawText(`Displacement: ${spec.displacement}cc`, x, y + 35, '#ff00ff', 9)
    this.renderer.drawText(`Max Boost: ${spec.maxBoost} psi`, x, y + 50, '#ff00ff', 9)
    this.renderer.drawText(`Throttle: ${(state.throttle * 100).toFixed(0)}%`, x, y + 65, '#ff00ff', 9)
    this.renderer.drawText(`Power/Weight: ${this.vehicle.getPowerToWeightRatio().toFixed(2)}`, x, y + 80, '#ff00ff', 9)
  }

  renderDynoHUD(dynoMaxPower: number, dynoMaxTorque: number, x: number = 20, y: number = 300): void {
    if (!this.engine) return

    const state = this.engine.state

    this.renderer.drawText('═ DYNO RUN ═', x, y, '#ffff00', 12)

    // Power gauge
    const powerPercent = dynoMaxPower > 0 ? Math.min(100, (state.power / dynoMaxPower) * 100) : 0
    this.renderer.drawText(`PWR: ${powerPercent.toFixed(0).padStart(3, ' ')}%`, x, y + 25, '#00ff00', 11)
    this.renderer.drawProgressBar(x + 100, y + 18, 150, 15, powerPercent / 100, '#00ff00')

    // Torque gauge
    const torquePercent = dynoMaxTorque > 0 ? Math.min(100, (state.torque / dynoMaxTorque) * 100) : 0
    this.renderer.drawText(`TRQ: ${torquePercent.toFixed(0).padStart(3, ' ')}%`, x, y + 50, '#00ccff', 11)
    this.renderer.drawProgressBar(x + 100, y + 43, 150, 15, torquePercent / 100, '#00ccff')

    // Boost gauge
    const boostPercent = this.engine.spec.maxBoost > 0 ? Math.min(100, (state.boostLevel / this.engine.spec.maxBoost) * 100) : 0
    this.renderer.drawText(`BOS: ${boostPercent.toFixed(0).padStart(3, ' ')}%`, x, y + 75, '#ff6600', 11)
    this.renderer.drawProgressBar(x + 100, y + 68, 150, 15, boostPercent / 100, '#ff6600')
  }
}
