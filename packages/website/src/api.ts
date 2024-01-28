import axios from 'axios';

export const api = axios.create({
  // should be https lol
  baseURL: import.meta.env.WEBSITE_API_URL,
});
