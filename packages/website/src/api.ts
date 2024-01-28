import axios from 'axios';

export const api = axios.create({
  // environment variables are injected at build time
  baseURL: import.meta.env.WEBSITE_API_URL,
});
