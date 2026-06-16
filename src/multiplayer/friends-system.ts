export interface Friend {
  id: string
  name: string
  status: 'online' | 'offline' | 'in-race'
  lastSeen: number
  bestPower: number
  wins: number
}

export interface ChallengeRequest {
  id: string
  from: string
  to: string
  vehicleClass: 'any' | 'street' | 'race'
  wager: number
  timestamp: number
}

export class FriendsSystem {
  private friends: Map<string, Friend> = new Map()
  private challenges: Map<string, ChallengeRequest> = new Map()
  private currentPlayer: string = ''

  setCurrentPlayer(name: string): void {
    this.currentPlayer = name
  }

  /**
   * Add a friend
   */
  addFriend(name: string): boolean {
    if (this.friends.has(name)) return false
    
    this.friends.set(name, {
      id: `friend_${Date.now()}`,
      name,
      status: 'offline',
      lastSeen: Date.now(),
      bestPower: 0,
      wins: 0
    })
    return true
  }

  /**
   * Remove a friend
   */
  removeFriend(name: string): boolean {
    return this.friends.delete(name)
  }

  /**
   * Send challenge
   */
  sendChallenge(toPlayer: string, vehicleClass: string, wager: number): boolean {
    if (!this.friends.has(toPlayer)) return false

    const challenge: ChallengeRequest = {
      id: `challenge_${Date.now()}`,
      from: this.currentPlayer,
      to: toPlayer,
      vehicleClass: vehicleClass as 'any' | 'street' | 'race',
      wager,
      timestamp: Date.now()
    }

    this.challenges.set(challenge.id, challenge)
    return true
  }

  /**
   * Accept challenge
   */
  acceptChallenge(challengeId: string): boolean {
    return this.challenges.has(challengeId)
  }

  /**
   * Decline challenge
   */
  declineChallenge(challengeId: string): boolean {
    return this.challenges.delete(challengeId)
  }

  /**
   * Get all friends
   */
  getFriends(): Friend[] {
    return Array.from(this.friends.values())
  }

  /**
   * Get online friends
   */
  getOnlineFriends(): Friend[] {
    return Array.from(this.friends.values()).filter(f => f.status === 'online')
  }

  /**
   * Update friend status
   */
  updateFriendStatus(name: string, status: 'online' | 'offline' | 'in-race'): void {
    const friend = this.friends.get(name)
    if (friend) {
      friend.status = status
      friend.lastSeen = Date.now()
    }
  }

  /**
   * Get pending challenges
   */
  getPendingChallenges(): ChallengeRequest[] {
    return Array.from(this.challenges.values()).filter(c => c.to === this.currentPlayer)
  }

  /**
   * Get sent challenges
   */
  getSentChallenges(): ChallengeRequest[] {
    return Array.from(this.challenges.values()).filter(c => c.from === this.currentPlayer)
  }
}
