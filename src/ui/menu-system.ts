import { PixelRenderer } from '../rendering/pixel-renderer'
import { VehicleDatabase } from '../game/vehicles'

export type MenuState = 'main' | 'vehicle-select' | 'garage' | 'shop' | 'dyno' | 'results' | 'career' | 'settings' | 'leaderboard'

export interface MenuItem {
  label: string
  action: () => void
  enabled: boolean
}

export class MenuSystem {
  private renderer: PixelRenderer
  private vehicleDb: VehicleDatabase
  private currentMenu: MenuState = 'main'
  private selectedIndex: number = 0
  private menuItems: MenuItem[] = []
  private carsMenuOpen: boolean = false
  private motorcyclesMenuOpen: boolean = false

  constructor(renderer: PixelRenderer, vehicleDb: VehicleDatabase) {
    this.renderer = renderer
    this.vehicleDb = vehicleDb
  }

  setMenu(menu: MenuState): void {
    this.currentMenu = menu
    this.selectedIndex = 0
    this.updateMenuItems()
  }

  getMenu(): MenuState {
    return this.currentMenu
  }

  private updateMenuItems(): void {
    this.menuItems = []
    switch (this.currentMenu) {
      case 'main':
        this.menuItems = [
          { label: 'New Game', action: () => this.setMenu('career'), enabled: true },
          { label: 'Garage', action: () => this.setMenu('garage'), enabled: true },
          { label: 'Leaderboard', action: () => this.setMenu('leaderboard'), enabled: true },
          { label: 'Settings', action: () => this.setMenu('settings'), enabled: true },
          { label: 'Exit', action: () => {}, enabled: true }
        ]
        break
      case 'vehicle-select':
        this.menuItems = [
          { label: 'Cars', action: () => { this.carsMenuOpen = !this.carsMenuOpen }, enabled: true },
          { label: 'Motorcycles', action: () => { this.motorcyclesMenuOpen = !this.motorcyclesMenuOpen }, enabled: true },
          { label: 'Back', action: () => this.setMenu('main'), enabled: true }
        ]
        break
      case 'career':
        this.menuItems = [
          { label: 'Start Career', action: () => this.setMenu('vehicle-select'), enabled: true },
          { label: 'Back', action: () => this.setMenu('main'), enabled: true }
        ]
        break
    }
  }

  navigate(direction: 'up' | 'down'): void {
    if (direction === 'up') {
      this.selectedIndex = (this.selectedIndex - 1 + this.menuItems.length) % this.menuItems.length
    } else {
      this.selectedIndex = (this.selectedIndex + 1) % this.menuItems.length
    }
  }

  select(): void {
    if (this.menuItems[this.selectedIndex]) {
      this.menuItems[this.selectedIndex].action()
    }
  }

  render(): void {
    this.renderer.clear('#0a0a12')

    // Title
    this.renderer.drawText('═══════════════════════════', 40, 40, '#00ff00', 14)
    this.renderer.drawText('    DYNO TUNER ELITE', 40, 60, '#00ff00', 20)
    this.renderer.drawText('═══════════════════════════', 40, 85, '#00ff00', 14)

    if (this.currentMenu === 'main') {
      this.renderMainMenu()
    } else if (this.currentMenu === 'vehicle-select') {
      this.renderVehicleSelect()
    } else if (this.currentMenu === 'career') {
      this.renderCareerMenu()
    } else if (this.currentMenu === 'garage') {
      this.renderGarageMenu()
    }
  }

  private renderMainMenu(): void {
    const startY = 150
    const spacing = 60

    this.menuItems.forEach((item, index) => {
      const y = startY + index * spacing
      const color = index === this.selectedIndex ? '#ffff00' : '#00ff00'
      const prefix = index === this.selectedIndex ? '► ' : '  '
      this.renderer.drawText(prefix + item.label, 80, y, color, 16)
    })

    // Instructions
    this.renderer.drawText('UP/DOWN: Navigate | SPACE: Select', 80, 600, '#888888', 12)
  }

  private renderVehicleSelect(): void {
    const startY = 150
    this.renderer.drawText('Select Vehicle Type:', 80, startY, '#ffff00', 14)

    if (this.carsMenuOpen) {
      this.renderer.drawText('CARS:', 100, startY + 50, '#00ff00', 12)
      this.vehicleDb.getAllCars().forEach((car, idx) => {
        this.renderer.drawText(`  ${car.name} (${car.year})`, 120, startY + 70 + idx * 30, '#00ffff', 11)
      })
    } else {
      this.renderer.drawText('► CARS', 100, startY + 50, '#ffff00', 12)
    }

    if (this.motorcyclesMenuOpen) {
      this.renderer.drawText('MOTORCYCLES:', 100, startY + 200, '#00ff00', 12)
      this.vehicleDb.getAllMotorcycles().forEach((moto, idx) => {
        this.renderer.drawText(`  ${moto.name} (${moto.year})`, 120, startY + 220 + idx * 30, '#00ffff', 11)
      })
    } else {
      this.renderer.drawText('► MOTORCYCLES', 100, startY + 200, '#ffff00', 12)
    }
  }

  private renderCareerMenu(): void {
    this.renderer.drawText('CAREER MODE', 80, 150, '#ffff00', 16)
    this.renderer.drawText('Start your journey to become', 80, 200, '#00ff00', 12)
    this.renderer.drawText('the ultimate dyno master!', 80, 230, '#00ff00', 12)
    this.renderer.drawText('', 80, 280, '#00ff00', 12)
    this.renderer.drawText('• Earn money from races', 100, 320, '#00ffff', 11)
    this.renderer.drawText('• Unlock new vehicles & parts', 100, 350, '#00ffff', 11)
    this.renderer.drawText('• Build your reputation', 100, 380, '#00ffff', 11)
    this.renderer.drawText('• Compete globally', 100, 410, '#00ffff', 11)

    const startY = 480
    this.menuItems.forEach((item, index) => {
      const y = startY + index * 40
      const color = index === this.selectedIndex ? '#ffff00' : '#00ff00'
      const prefix = index === this.selectedIndex ? '► ' : '  '
      this.renderer.drawText(prefix + item.label, 80, y, color, 14)
    })
  }

  private renderGarageMenu(): void {
    this.renderer.drawText('GARAGE', 80, 150, '#ffff00', 16)
    this.renderer.drawText('Your Vehicles:', 80, 200, '#00ff00', 12)
    // Garage content will be rendered here
  }
}
