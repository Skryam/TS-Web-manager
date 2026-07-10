import axios, { Axios } from "axios";

let api: Axios;

export const getApi = () => {
  if (!api) {
    api = axios.create({
      baseURL: import.meta.env.VITE_API_URL_DEV,
      withCredentials: true,
  });
}
  return api;
}