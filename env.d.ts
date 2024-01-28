declare namespace NodeJS {
  export interface ProcessEnv {
    SERVER_AUTH_TOKEN_HASH_SALT: string;
    E2E_GITHUB_TOKEN: string;
    E2E_GITHUB_USER_ID: string;
    WEBSITE_API_URL: string;
    BFF_PORT: string;
    NODE_ENV: string;
    SSL_PRIVATE_KEY_PATH: string;
    SSL_PUBLIC_CERT_PATH: string;
  }
}
