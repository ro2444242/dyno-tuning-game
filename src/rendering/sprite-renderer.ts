/**
 * Sprite rendering for pixel art vehicles
 */

export interface SpriteData {
  name: string
  width: number
  height: number
  frames: Uint8Array
  palette: string[]
}

export class SpriteRenderer {
  private sprites: Map<string, SpriteData> = new Map()
  private pixelSize: number = 2

  /**
   * Create a simple pixel art car sprite
   */
  createCarSprite(): SpriteData {
    const width = 64
    const height = 32
    const frames = new Uint8Array(width * height)

    // Simple car body pattern
    const bodyColor = 1
    const wheelColor = 2
    const windowColor = 3

    // Draw car body
    for (let y = 10; y < 24; y++) {
      for (let x = 8; x < 56; x++) {
        frames[y * width + x] = bodyColor
      }
    }

    // Draw windows
    for (let y = 12; y < 16; y++) {
      for (let x = 16; x < 24; x++) {
        frames[y * width + x] = windowColor
      }
      for (let x = 40; x < 48; x++) {
        frames[y * width + x] = windowColor
      }
    }

    // Draw wheels
    frames[22 * width + 14] = wheelColor
    frames[22 * width + 15] = wheelColor
    frames[23 * width + 14] = wheelColor
    frames[23 * width + 15] = wheelColor

    frames[22 * width + 48] = wheelColor
    frames[22 * width + 49] = wheelColor
    frames[23 * width + 48] = wheelColor
    frames[23 * width + 49] = wheelColor

    return {
      name: 'car',
      width,
      height,
      frames,
      palette: ['#000000', '#FF0000', '#000000', '#00FFFF']
    }
  }

  /**
   * Create a pixel art motorcycle sprite
   */
  createMotorcycleSprite(): SpriteData {
    const width = 48
    const height = 32
    const frames = new Uint8Array(width * height)

    const bodyColor = 1
    const wheelColor = 2

    // Draw motorcycle body (vertical line-ish)
    for (let y = 8; y < 24; y++) {
      for (let x = 20; x < 28; x++) {
        frames[y * width + x] = bodyColor
      }
    }

    // Draw wheels
    frames[22 * width + 10] = wheelColor
    frames[22 * width + 11] = wheelColor
    frames[23 * width + 10] = wheelColor
    frames[23 * width + 11] = wheelColor

    frames[22 * width + 36] = wheelColor
    frames[22 * width + 37] = wheelColor
    frames[23 * width + 36] = wheelColor
    frames[23 * width + 37] = wheelColor

    return {
      name: 'motorcycle',
      width,
      height,
      frames,
      palette: ['#000000', '#0000FF', '#FFFF00']
    }
  }

  /**
   * Register a sprite
   */
  registerSprite(sprite: SpriteData): void {
    this.sprites.set(sprite.name, sprite)
  }

  /**
   * Get a sprite
   */
  getSprite(name: string): SpriteData | undefined {
    return this.sprites.get(name)
  }

  /**
   * Render sprite to canvas
   */
  renderSprite(ctx: CanvasRenderingContext2D, spriteName: string, x: number, y: number, scale: number = 1): void {
    const sprite = this.sprites.get(spriteName)
    if (!sprite) return

    const imageData = ctx.createImageData(sprite.width, sprite.height)
    const data = imageData.data

    for (let i = 0; i < sprite.frames.length; i++) {
      const colorIndex = sprite.frames[i]
      const color = sprite.palette[colorIndex]

      if (color && colorIndex !== 0) {
        const rgba = this.hexToRgba(color)
        const dataIndex = i * 4
        data[dataIndex] = rgba.r
        data[dataIndex + 1] = rgba.g
        data[dataIndex + 2] = rgba.b
        data[dataIndex + 3] = rgba.a
      }
    }

    ctx.putImageData(imageData, x, y)
  }

  private hexToRgba(hex: string): { r: number; g: number; b: number; a: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: 255
    } : { r: 0, g: 0, b: 0, a: 0 }
  }
}
