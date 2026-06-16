/**
 * Pixel-art renderer for retro aesthetic
 */

export class PixelRenderer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private pixelSize: number = 1
  private width: number
  private height: number

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.width = canvas.width
    this.height = canvas.height
    this.setupCanvas()
  }

  private setupCanvas(): void {
    // Disable antialiasing for pixel-perfect rendering
    this.ctx.imageSmoothingEnabled = false
  }

  /**
   * Clear the canvas
   */
  clear(color: string = '#1a1a2e'): void {
    this.ctx.fillStyle = color
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  /**
   * Draw pixelated text
   */
  drawText(
    text: string,
    x: number,
    y: number,
    color: string = 'white',
    size: number = 16
  ): void {
    this.ctx.font = `${size}px "Courier New", monospace`
    this.ctx.fillStyle = color
    this.ctx.fillText(text, x, y)
  }

  /**
   * Draw a progress bar
   */
  drawProgressBar(
    x: number,
    y: number,
    width: number,
    height: number,
    progress: number,
    color: string = 'lime'
  ): void {
    // Draw border
    this.ctx.strokeStyle = 'white'
    this.ctx.lineWidth = 2
    this.ctx.strokeRect(x, y, width, height)

    // Draw fill
    this.ctx.fillStyle = color
    this.ctx.fillRect(x + 2, y + 2, (width - 4) * progress, height - 4)
  }

  /**
   * Draw a gauge (for RPM, boost, etc.)
   */
  drawGauge(
    x: number,
    y: number,
    radius: number,
    value: number,
    max: number,
    label: string,
    color: string = 'cyan'
  ): void {
    const angle = (value / max) * Math.PI * 1.5 - Math.PI * 0.75

    // Draw gauge arc
    this.ctx.strokeStyle = 'white'
    this.ctx.lineWidth = 3
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, -Math.PI * 0.75, Math.PI * 0.75)
    this.ctx.stroke()

    // Draw needle
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = 2
    const endX = x + Math.cos(angle) * (radius - 10)
    const endY = y + Math.sin(angle) * (radius - 10)
    this.ctx.beginPath()
    this.ctx.moveTo(x, y)
    this.ctx.lineTo(endX, endY)
    this.ctx.stroke()

    // Draw label
    this.drawText(label, x - 30, y + radius + 20, color, 12)
  }

  /**
   * Draw pixelated rectangle
   */
  drawRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    filled: boolean = true
  ): void {
    this.ctx.fillStyle = color
    if (filled) {
      this.ctx.fillRect(x, y, width, height)
    } else {
      this.ctx.strokeStyle = color
      this.ctx.strokeRect(x, y, width, height)
    }
  }

  /**
   * Resize renderer
   */
  resize(width: number, height: number): void {
    this.canvas.width = width
    this.canvas.height = height
    this.width = width
    this.height = height
  }
}
