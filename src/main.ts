import { Game } from './game/game'
import { SaveSystem } from './save/save-system'

// Initialize game
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement
if (!canvas) {
  throw new Error('Canvas element not found')
}

// Initialize save system
const saveSystem = new SaveSystem()
let saveData = saveSystem.load()
if (!saveData) {
  saveData = saveSystem.createNewSave()
  saveSystem.save()
}

// Create and start game
const game = new Game(canvas, saveSystem)
game.start()

// Auto-save every 30 seconds
saveSystem.startAutoSave(30000)

// Handle window resize
window.addEventListener('resize', () => {
  game.resize(window.innerWidth, window.innerHeight)
})

// Keyboard controls
window.addEventListener('keydown', (e) => {
  switch (e.key.toUpperCase()) {
    case 'ARROWUP':
    case 'W':
      game.handleInput('throttle-up')
      break
    case 'ARROWDOWN':
    case 'S':
      game.handleInput('throttle-down')
      break
    case ' ':
      game.handleInput('select')
      e.preventDefault()
      break
    case 'ARROWLEFT':
    case 'A':
      game.handleInput('nav-left')
      break
    case 'ARROWRIGHT':
    case 'D':
      game.handleInput('nav-right')
      break
    case 'ESCAPE':
      game.handleInput('back')
      break
  }
})

console.log('🏁 Dyno Tuner Elite Started!')
console.log('Controls:')
console.log('  UP/W - Navigate up / Increase throttle')
console.log('  DOWN/S - Navigate down / Decrease throttle')
console.log('  LEFT/A - Navigate left')
console.log('  RIGHT/D - Navigate right')
console.log('  SPACE - Select/Confirm')
console.log('  ESC - Back/Menu')
