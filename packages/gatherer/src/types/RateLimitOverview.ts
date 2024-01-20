import { RateLimit } from './RateLimit'

/**
 * Rate Limit Overview
 */
export interface RateLimitOverview {
  resources: {
    core: RateLimit
    graphql?: RateLimit
    search: RateLimit
    code_search?: RateLimit
    source_import?: RateLimit
    integration_manifest?: RateLimit
    code_scanning_upload?: RateLimit
    actions_runner_registration?: RateLimit
    scim?: RateLimit
    dependency_snapshots?: RateLimit
    [k: string]: unknown
  }
  rate: RateLimit
  [k: string]: unknown
}
