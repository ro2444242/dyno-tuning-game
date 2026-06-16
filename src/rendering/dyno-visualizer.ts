import { PixelRenderer } from './pixel-renderer'

export interface DynoGraphData {
  powerCurve: number[]
  torqueCurve: number[]
  rpmRange: number[]
}

export class DynoVisualizer {
  private renderer: PixelRenderer

  constructor(renderer: PixelRenderer) {
    this.renderer = renderer
  }

  /**
   * Draw power and torque graphs
   */
  drawGraphs(data: DynoGraphData, x: number, y: number, width: number, height: number): void {
    // Draw background
    this.renderer.drawRect(x, y, width, height, '#1a1a2e', true)
    this.renderer.drawRect(x, y, width, height, '#00ff00', false)

    if (data.powerCurve.length === 0) return

    // Find max values
    const maxPower = Math.max(...data.powerCurve)
    const maxTorque = Math.max(...data.torqueCurve)
    const maxRPM = Math.max(...data.rpmRange)

    // Draw grid
    this.drawGrid(x, y, width, height)

    // Draw power curve
    this.drawCurve(data.powerCurve, maxPower, maxRPM, x, y, width, height, '#00ff00')

    // Draw torque curve (scaled)
    const scaledTorque = data.torqueCurve.map(t => (t / maxTorque) * maxPower)
    this.drawCurve(scaledTorque, maxPower, maxRPM, x, y, width, height, '#ffff00')

    // Draw labels
    this.renderer.drawText(`Power: ${maxPower.toFixed(0)} hp`, x + 10, y + 10, '#00ff00', 10)
    this.renderer.drawText(`Torque: ${maxTorque.toFixed(0)} Nm`, x + 10, y + 25, '#ffff00', 10)
    this.renderer.drawText(`RPM: ${(maxRPM / 1000).toFixed(1)}k`, x + width - 100, y + 10, '#00ffff', 10)
  }

  private drawGrid(x: number, y: number, width: number, height: number): void {
    const gridSpacing = 50

    // Vertical grid lines
    for (let i = 0; i <= width; i += gridSpacing) {
      this.renderer.drawRect(x + i, y, 1, height, '#333333', true)
    }

    // Horizontal grid lines
    for (let i = 0; i <= height; i += gridSpacing) {
      this.renderer.drawRect(x, y + i, width, 1, '#333333', true)
    }
  }

  private drawCurve(
    data: number[],
    maxValue: number,
    maxX: number,
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
  ): void {
    for (let i = 0; i < data.length - 1; i++) {
      const x1 = x + (i / data.length) * width
      const y1 = y + height - (data[i] / maxValue) * height

      const x2 = x + ((i + 1) / data.length) * width
      const y2 = y + height - (data[i + 1] / maxValue) * height

      // Draw line
      this.drawLine(x1, y1, x2, y2, color)
    }
  }

  private drawLine(x1: number, y1: number, x2: number, y2: number, color: string): void {
    // Bresenham line algorithm for pixel perfect lines
    const dx = Math.abs(x2 - x1)
    const dy = Math.abs(y2 - y1)
    const sx = x1 < x2 ? 1 : -1
    const sy = y1 < y2 ? 1 : -1
    let err = dx - dy

    let x = x1
    let y = y1

    while (true) {
      this.renderer.drawRect(x, y, 2, 2, color, true)

      if (x === x2 && y === y2) break

      const e2 = 2 * err
      if (e2 > -dy) {
        err -= dy
        x += sx
      }
      if (e2 < dx) {
        err += dx
        y += sy
      }
    }
  }
}
