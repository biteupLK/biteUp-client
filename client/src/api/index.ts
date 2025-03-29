import axios, { AxiosRequestHeaders } from "axios";

axios.interceptors.request.use(
  function (config) {
    config.baseURL = getBaseUrl();

    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders;
    }

    // Retrieve token from localStorage
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // OAuth2 Bearer token
      config.headers["Token"] = token; // Custom token header (if needed)
    }

    console.log("Headers set", config.headers);

    config.validateStatus = (status: number) => status >= 200 && status < 300;
    console.log("Validate status set");

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

function getBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL;
}

axios.interceptors.response.use(
  (response) => response,
  function (error) {
    return Promise.reject(error?.response ?? error);
  }
);
