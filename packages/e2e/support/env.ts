export const env = {
  githubUserId: Number(process.env.E2E_GITHUB_USER_ID),
  githubToken: String(process.env.E2E_GITHUB_TOKEN),
} as const;
