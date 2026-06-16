export interface LeaderboardEntry {
  rank: number
  playerName: string
  bestPower: number
  bestTorque: number
  totalRuns: number
  wins: number
  reputation: number
  timestamp: number
}

export interface ComparisonResult {
  playerName: string
  power: number
  torque: number
  vehicle: string
  timestamp: number
  isPersonalBest: boolean
}

export class Leaderboard {
  private entries: LeaderboardEntry[] = []
  private playerSubmissions: Map<string, LeaderboardEntry> = new Map()
  private personalBests: Map<string, ComparisonResult> = new Map()
  private nextRankId: number = 1

  constructor() {
    this.initializeDefaultEntries()
  }

  private initializeDefaultEntries(): void {
    // Initialize with some example leaderboard data
    const exampleData: Omit<LeaderboardEntry, 'rank'>[] = [
      {
        rank: 0,
        playerName: 'TurboKing',
        bestPower: 1247,
        bestTorque: 952,
        totalRuns: 342,
        wins: 287,
        reputation: 5000,
        timestamp: Date.now() - 86400000
      },
      {
        rank: 0,
        playerName: 'DynoMaster',
        bestPower: 1156,
        bestTorque: 891,
        totalRuns: 298,
        wins: 251,
        reputation: 4500,
        timestamp: Date.now() - 172800000
      },
      {
        rank: 0,
        playerName: 'EngineTuner',
        bestPower: 1089,
        bestTorque: 834,
        totalRuns: 256,
        wins: 198,
        reputation: 3800,
        timestamp: Date.now() - 259200000
      },
      {
        rank: 0,
        playerName: 'BoostAddict',
        bestPower: 998,
        bestTorque: 756,
        totalRuns: 412,
        wins: 329,
        reputation: 4200,
        timestamp: Date.now() - 345600000
      },
      {
        rank: 0,
        playerName: 'SpeedDemon',
        bestPower: 947,
        bestTorque: 712,
        totalRuns: 187,
        wins: 142,
        reputation: 2100,
        timestamp: Date.now() - 432000000
      }
    ]

    exampleData.forEach((data, index) => {
      const entry: LeaderboardEntry = { ...data, rank: index + 1 }
      this.entries.push(entry)
    })
  }

  /**
   * Submit a new run to leaderboard
   */
  submitRun(
    playerName: string,
    power: number,
    torque: number,
    vehicle: string,
    wins: number,
    reputation: number
  ): boolean {
    const existing = this.playerSubmissions.get(playerName)
    
    if (existing && existing.bestPower >= power) {
      return false // Only keep best runs
    }

    const entry: LeaderboardEntry = {
      rank: 0,
      playerName,
      bestPower: power,
      bestTorque: torque,
      totalRuns: existing ? existing.totalRuns + 1 : 1,
      wins,
      reputation,
      timestamp: Date.now()
    }

    this.playerSubmissions.set(playerName, entry)
    this.resortLeaderboard()
    return true
  }

  /**
   * Get global leaderboard
   */
  getGlobalLeaderboard(limit: number = 10): LeaderboardEntry[] {
    const combined = [...this.entries, ...Array.from(this.playerSubmissions.values())]
      .sort((a, b) => b.bestPower - a.bestPower)
      .slice(0, limit)

    return combined.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }))
  }

  /**
   * Get regional leaderboard
   */
  getRegionalLeaderboard(region: string, limit: number = 10): LeaderboardEntry[] {
    // This would connect to backend for actual regional data
    return this.getGlobalLeaderboard(limit)
  }

  /**
   * Compare with friends
   */
  compareFriends(friendNames: string[]): ComparisonResult[] {
    const results: ComparisonResult[] = []

    friendNames.forEach(name => {
      const entry = this.playerSubmissions.get(name)
      if (entry) {
        results.push({
          playerName: name,
          power: entry.bestPower,
          torque: entry.bestTorque,
          vehicle: 'Unknown',
          timestamp: entry.timestamp,
          isPersonalBest: true
        })
      }
    })

    return results.sort((a, b) => b.power - a.power)
  }

  /**
   * Get player ranking
   */
  getPlayerRank(playerName: string): number | null {
    const leaderboard = this.getGlobalLeaderboard(1000)
    const player = leaderboard.find(e => e.playerName === playerName)
    return player ? player.rank : null
  }

  /**
   * Resort leaderboard based on power
   */
  private resortLeaderboard(): void {
    const combined = [...this.entries, ...Array.from(this.playerSubmissions.values())]
    combined.sort((a, b) => b.bestPower - a.bestPower)
    combined.forEach((entry, index) => {
      entry.rank = index + 1
    })
  }

  getEntries(): LeaderboardEntry[] {
    return this.entries
  }
}
