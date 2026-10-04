import axios, { AxiosError } from "axios";
import { GraphQLError } from "graphql";

export type PageError = AxiosError | GraphQLError | Error;

export const getErrorCode = (error: PageError | undefined): string | undefined => {
  if (!error) {
    return undefined;
  }

  if (axios.isAxiosError(error)) {
    if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return error.response.data.error;
    } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    return error.request;
    } else {
    // Something happened in setting up the request that triggered an Error
    return error.message;
    }
  }

  if (error instanceof GraphQLError) {
    return error?.message
  }
  return error?.message;
}