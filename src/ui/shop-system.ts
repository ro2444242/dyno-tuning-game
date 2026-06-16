import { EngineModification } from '../game/engine'
import { PixelRenderer } from '../rendering/pixel-renderer'
import { MODIFICATION_CATALOG } from '../game/modifications'
import { TRANSMISSION_CATALOG } from '../systems/transmission'

export interface ShopItem {
  id: string
  name: string
  cost: number
  category: 'engine' | 'forced-induction' | 'transmission' | 'cosmetic'
  description: string
  bonus: number // Power/torque bonus percentage
}

export class ShopSystem {
  private items: ShopItem[] = []
  private selectedIndex: number = 0
  private playerMoney: number = 50000
  private purchasedItems: Set<string> = new Set()

  constructor() {
    this.initializeShop()
  }

  private initializeShop(): void {
    // Engine modifications
    MODIFICATION_CATALOG.forEach((mod, id) => {
      this.items.push({
        id: id,
        name: mod.name,
        cost: mod.cost,
        category: 'engine',
        description: `+${((mod.powerMultiplier - 1) * 100).toFixed(0)}% power, +${((mod.torqueMultiplier - 1) * 100).toFixed(0)}% torque`,
        bonus: (mod.powerMultiplier - 1) * 100
      })
    })

    // Transmissions
    TRANSMISSION_CATALOG.forEach((trans) => {
      this.items.push({
        id: `trans-${trans.name}`,
        name: trans.name,
        cost: 1000 + trans.gears * 300,
        category: 'transmission',
        description: `${trans.gears} gears, ${trans.type} type`,
        bonus: (1 - trans.efficiency) * 100 // Lower losses = better
      })
    })
  }

  getItems(): ShopItem[] {
    return this.items
  }

  getSelectedItem(): ShopItem {
    return this.items[this.selectedIndex]
  }

  navigate(direction: 'up' | 'down'): void {
    if (direction === 'up') {
      this.selectedIndex = (this.selectedIndex - 1 + this.items.length) % this.items.length
    } else {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length
    }
  }

  purchase(itemId: string): boolean {
    const item = this.items.find(i => i.id === itemId)
    if (!item || this.playerMoney < item.cost || this.purchasedItems.has(itemId)) {
      return false
    }

    this.playerMoney -= item.cost
    this.purchasedItems.add(itemId)
    return true
  }

  setPlayerMoney(amount: number): void {
    this.playerMoney = amount
  }

  getPlayerMoney(): number {
    return this.playerMoney
  }

  canAfford(itemId: string): boolean {
    const item = this.items.find(i => i.id === itemId)
    return item ? this.playerMoney >= item.cost : false
  }
}
