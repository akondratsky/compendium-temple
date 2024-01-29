import axios from 'axios';

export const api = axios.create({
  // gh-pages redeployed with this homeopathic comment: ||
  baseURL: import.meta.env.WEBSITE_API_URL,
});
