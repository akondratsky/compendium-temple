declare namespace NodeJS {
  export interface ProcessEnv {
    SERVER_AUTH_TOKEN_HASH_SALT: string;
    E2E_GITHUB_TOKEN: string;
    E2E_GITHUB_USER_ID: string;
  }
}
