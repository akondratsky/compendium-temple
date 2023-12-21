/**
 * Code Of Conduct
 */
export interface CodeOfConduct {
  key: string
  name: string
  url: string
  body?: string
  html_url: string | null
  [k: string]: unknown
}
