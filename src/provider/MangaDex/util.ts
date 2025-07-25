/********************
 * IMPORT STATEMENTS
 ********************/

// import { Constants } from "@/constants";
import type { AxiosRequestConfig } from "axios";

import type { ErrorResponse } from "@/types/mangadex";
import type { AuthenticationToken } from "./authentication";

/*******************
 * TYPE DEFINITIONS
 *******************/

/** HTTPS request options with an optional body property */
// export type AxiosRequestConfig = https.AxiosRequestConfig & {
//     body?: object
// };

/************************
 * CONSTANT DECLARATIONS
 ************************/

const MANGADEX_API_URL = process.env["NEXT_PUBLIC_MANGADEX_API_URL"]
const CORS = process.env["NEXT_PUBLIC_CORS"]
const CORS_V2 = process.env["NEXT_PUBLIC_CORS_V2"]

// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] =
//   process.env.NODE_ENV === "production" ? "1" : "0";

export class MangaDexError extends Error {
  status?: number;
  response?: { data: ErrorResponse | any; headers: Record<string, any> };
  constructor({
    message,
    status,
    response,
  }: {
    message: string;
    status?: number;
    response?: { data: ErrorResponse | any; headers: Record<string, any> };
  }) {
    super(message);
    this.status = status;
    this.name = "FetchError";
    this.response = response;
  }
}

/************************
 * FUNCTION DECLARATIONS
 ************************/

/**
 * Transform an array of strings to query string params of the form
 * `name[]=value1&name[]=value2` etc
 *
 * @param {string} name
 * @param {string[]} [array]
 * @returns {string} Formatted query string params
 */
const transformArrayForQueryString = (name: string, array?: string[]) => {
  let qs = "";

  if (array === undefined || array.length === 0) {
    return qs;
  }

  for (const s of array) {
    if (qs === "") {
      qs += `${name}[]=${s}`;
    } else {
      qs += `&${name}[]=${s}`;
    }
  }

  return qs;
};

/**
 * Build a query string from a request options object.
 *
 * @param {object} [options] A request options object to parse
 * @returns {string} The query string, including the starting '?' character
 */
export const buildQueryStringFromOptions = (options?: {
  [key: string]: any;
}) => {
  const queryParams = [];

  if (options === undefined || Object.keys(options).length === 0) {
    return "";
  }

  for (const key of Object.keys(options)) {
    if (options[key] === undefined) continue;
    if (options[key] instanceof Array) {
      queryParams.push(transformArrayForQueryString(key, options[key]));
    } else if (options[key] instanceof Date) {
      // /** @type {Date} */
      const d = options[key];
      queryParams.push(
        `${key}=${d.toISOString().substring(0, d.toISOString().indexOf("."))}`,
      );
    } else if (key === "order") {
      const order = options[key];

      for (const o of Object.keys(order)) {
        queryParams.push(`order[${o}]=${order[o]}`);
      }
    } else {
      queryParams.push(`${key}=${options[key]}`);
    }
  }

  const ret = `?${queryParams.join("&")}`;
  return ret === "?" ? "" : ret;
};

/**
 * @template T
 * @param {string} method The HTTP method.
 * @param {string} path The endpoint path.
 * @param {AxiosRequestConfig} [options] Additional request options (such as request body, headers, etc.)
 * @returns A promise that resolves to a specific response object T.
 */
export const createHttpsRequestPromise = async <T>(
  method: string,
  path: string,
  options?: AxiosRequestConfig,
): Promise<{ data: T }> => {
  if (method === undefined) {
    throw new Error(
      "ERROR - createHttpsRequestPromise: Parameter `method` cannot be undefined",
    );
  } else if (method === "") {
    throw new Error(
      "ERROR - createHttpsRequestPromise: Parameter `method` cannot be blank",
    );
  } else if (path === undefined) {
    throw new Error(
      "ERROR - createHttpsRequestPromise: Parameter `path` cannot be undefined",
    );
  } else if (path === "") {
    throw new Error(
      "ERROR - createHttpsRequestPromise: Parameter `path` cannot be blank",
    );
  }

  if (CORS_V2) {
    const headers = new Headers();
    headers.set("referer", "https://truyendex.com/");
    headers.set("origin", "https://truyendex.com/");
    headers.set("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36");
    headers.set("accept", "application/json, text/plain, */*");
    // headers.set("x-requested-with", " ");
    const data = await customFetch(`${CORS_V2}/mangadex${path}`);

    return { data };
  }

  const encodedUrl = btoa(`${MANGADEX_API_URL}${path}`)
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  console.info("Request to API Mangadex: ", path, " -> ", encodedUrl);

  const headers = new Headers();
  headers.set("x-requested-with", "cubari");
  const httpsRequestOptions: RequestInit = {
    method: method,
    headers,
  };

  // merge the options object if it was provided
  if (options) {
    Object.assign(httpsRequestOptions, options);
  }

  const data = await customFetch(
    `${CORS}/v1/cors/${encodedUrl}`,
    httpsRequestOptions,
  );
  console.info("Response from API Mangadex: ", `${CORS}/v1/cors/${encodedUrl}`,);
  return { data };
};

/**
 * Adds an authorization header to a request options object.
 *
 * @param {AuthenticationToken} token See {@link AuthenticationToken}
 * @param {AxiosRequestConfig} [request] AxiosRequestConfig object to add the token to
 * @returns A new {@link AxiosRequestConfig} object with the added authorization token
 */
export const addTokenAuthorization = (
  token: AuthenticationToken,
  request?: AxiosRequestConfig,
) => {
  if (token === undefined) {
    throw new Error(
      "ERROR - addTokenAuthorization: Parameter `token` cannot be undefined",
    );
  } else if (!("session" in token)) {
    throw new Error(
      "ERROR - addTokenAuthorization: Parameter `token` missing required property `session`",
    );
  }

  const headers = request?.headers;

  const o = {
    ...request,
    headers: {
      Authorization: `Bearer ${token.session}`,
      ...headers,
    },
  };

  return o;
};

/**
 * Type guarding function for checking if a response is an ErrorResponse.
 *
 * @param {ErrorResponse | any} res The response to check
 * @returns A boolean value indicating if the response is an ErrorResponse
 */
export const isErrorResponse = (
  res: ErrorResponse | any,
): res is ErrorResponse => {
  if (!res) return false;
  return (res as ErrorResponse).errors !== undefined;
};

async function customFetch(url: string, options: RequestInit = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    let errorData: any;
    try {
      errorData = await response.json();
    } catch {
      errorData = await response.text();
    }
    throw new MangaDexError({
      message: `Yêu cầu thất bại - Lỗi ${response.status}: ${response.statusText}`,
      status: response.status,
      response: {
        data: errorData,
        headers: Object.fromEntries(response.headers.entries()),
      },
    });
  }
  return await response.json();
}
