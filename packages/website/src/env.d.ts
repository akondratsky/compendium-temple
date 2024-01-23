/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly WEBSITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}