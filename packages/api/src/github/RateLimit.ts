export interface RateLimit {
  limit: number
  remaining: number
  reset: number
  used: number
  [k: string]: unknown
}
