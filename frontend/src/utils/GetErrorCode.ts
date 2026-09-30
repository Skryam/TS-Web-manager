import axios, { AxiosError } from "axios";
import { GraphQLError } from "graphql";

export type PageError = AxiosError | GraphQLError | Error;

export const getErrorCode = (error: PageError | undefined): string | undefined => {
  console.log('ГОЛОВА', error)
  if (!error) {
    console.log('ПУСТО', error)
    return undefined;
  }

  if (axios.isAxiosError(error)) {
    console.log('АКИОС', error)
    if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log('АКИОС1', error.response)
    return error.response.data.error;
    } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log('АКИОС2', error.request)
    return error.request;
    } else {
      console.log('АКИОС3', error.message)
    // Something happened in setting up the request that triggered an Error
    return error.message;
    }
  }

  if (error instanceof GraphQLError) {
    console.log('GRAPH', error)
    return error?.message
  }

  console.log('ХЗ', error)
  return error.message;
}