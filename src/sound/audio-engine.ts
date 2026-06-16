/**
 * Audio engine for engine sounds, turbo spool, gear shifts
 */

export interface AudioClip {
  name: string
  url: string
  volume: number
  loop: boolean
  playing: boolean
}

export class AudioEngine {
  private audioContext: AudioContext | null = null
  private isInitialized: boolean = false
  private masterVolume: number = 0.8
  private soundEffects: Map<string, AudioClip> = new Map()
  private engineSound: AudioClip | null = null
  private turboSpoolOscillator: OscillatorNode | null = null

  constructor() {
    this.initializeAudio()
  }

  /**
   * Initialize Web Audio API
   */
  private initializeAudio(): void {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.audioContext = audioContext
      this.isInitialized = true
    } catch (e) {
      console.warn('Web Audio API not supported')
    }
  }

  /**
   * Play engine sound based on RPM
   */
  playEngineSound(rpm: number, volume: number = 1.0): void {
    if (!this.audioContext || !this.isInitialized) return

    // Engine sound frequency is proportional to RPM
    // Typical engine idles at 1000 RPM, redlines at 7000-8000 RPM
    const frequency = 200 + (rpm / 8000) * 400 // 200-600 Hz range

    // Create basic engine sound with harmonics
    const now = this.audioContext.currentTime
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.frequency.value = frequency
    oscillator.type = 'triangle'

    gainNode.gain.value = volume * this.masterVolume
    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.start(now)

    // Auto stop after 100ms for realistic sampling
    oscillator.stop(now + 0.1)
  }

  /**
   * Play turbo spool sound
   */
  playTurboSpool(boostLevel: number, volume: number = 0.8): void {
    if (!this.audioContext || !this.isInitialized) return

    const now = this.audioContext.currentTime
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()

    // Spool frequency increases with boost
    oscillator.frequency.value = 2000 + boostLevel * 1000
    oscillator.type = 'sine'

    // Filter for more realistic spool sound
    filter.type = 'highpass'
    filter.frequency.value = 3000

    gainNode.gain.value = volume * this.masterVolume * (boostLevel / 20) // Quieter at low boost

    oscillator.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.start(now)
    oscillator.stop(now + 0.2)
  }

  /**
   * Play gear shift sound
   */
  playGearShift(volume: number = 0.5): void {
    if (!this.audioContext || !this.isInitialized) return

    const now = this.audioContext.currentTime
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.frequency.setValueAtTime(800, now)
    oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1)
    oscillator.type = 'sine'

    gainNode.gain.value = volume * this.masterVolume

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.start(now)
    oscillator.stop(now + 0.1)
  }

  /**
   * Play backfire/exhaust pop
   */
  playExhaustPop(volume: number = 0.6): void {
    if (!this.audioContext || !this.isInitialized) return

    const now = this.audioContext.currentTime
    const bufferSize = this.audioContext.sampleRate * 0.1 // 100ms
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    // Generate white noise burst for pop sound
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()

    source.buffer = buffer
    gainNode.gain.value = volume * this.masterVolume

    source.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    source.start(now)
  }

  /**
   * Set master volume
   */
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume))
  }

  /**
   * Get master volume
   */
  getMasterVolume(): number {
    return this.masterVolume
  }
}
