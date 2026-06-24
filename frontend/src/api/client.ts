import axios, { Axios } from "axios";
import "dotenv/config";

let api: Axios;

export const getApi = () => {
  if (!api) {
    api = axios.create({
      baseURL: process.env.API_URL_DEV,
      withCredentials: true,
  });
}
  return api;
}