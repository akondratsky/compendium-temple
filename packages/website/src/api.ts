import axios from 'axios';

export const api = axios.create({
  // see ci-cd.yaml
  baseURL: import.meta.env.WEBSITE_API_URL,
});
