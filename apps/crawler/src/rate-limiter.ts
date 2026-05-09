export class RateLimiter {
  private timestamps: number[] = []

  constructor(
    private readonly maxRequests: number,
    private readonly windowMs: number,
  ) {}

  async throttle(): Promise<void> {
    const now = Date.now()
    this.timestamps = this.timestamps.filter(t => now - t < this.windowMs)

    if (this.timestamps.length >= this.maxRequests) {
      const waitMs = this.windowMs - (now - this.timestamps[0]) + 1
      await new Promise<void>(resolve => setTimeout(resolve, waitMs))
      return this.throttle()
    }

    this.timestamps.push(now)
  }
}
