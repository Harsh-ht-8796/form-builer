import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { token } from '../constant';

// Create instance
export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Add request interceptor
AXIOS_INSTANCE.interceptors.request.use(
  //@ts-ignore
  (config: AxiosRequestConfig) => {
    // Example: Add auth token if needed

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('[Request]', config);
    return config;
  },
  (error: AxiosError) => {
    console.error('[Request Error]', error);
    return Promise.reject(error);
  },
);

// Add response interceptor
AXIOS_INSTANCE.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('[Response]', response);
    return response;
  },
  (error: AxiosError) => {
    console.error('[Response Error]', error);
    // Optionally transform or handle error globally
    return Promise.reject(error);
  },
);

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({ ...config, cancelToken: source.token }).then(
    ({ data }) => data,
  );

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled by Vue Query'); // update message if needed
  };

  return promise;
};

export default customInstance;

export interface ErrorType<Error> extends AxiosError<Error> {}
