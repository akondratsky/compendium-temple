import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.WEBSITE_API_URL,
});
