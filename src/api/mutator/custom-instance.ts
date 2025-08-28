import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getSession, signOut ,} from 'next-auth/react';

// Create instance
export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Add request interceptor
AXIOS_INSTANCE.interceptors.request.use(
  //@ts-ignore
  async (config: AxiosRequestConfig) => {
    // Example: Add auth token if needed
    const session = await getSession(); // Get the session using the NextAuth.js getSession helper
    if (session?.user?.accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${session?.user?.accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.log(error.status)
    if (error.status === 401) {
      window.location.href = '/auth/login';
      // Handle unauthorized error, e.g., redirect to login
      console.log("Unauthorized! Redirect to login.");
    }
    console.error('[Request Error]', error);
    return Promise.reject(error);
  },
);

// Add response interceptor
AXIOS_INSTANCE.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    console.error('[Response Errorr]', error);
    if (error.response?.status === 401) {
      console.log("Unauthorized! Redirect to login.");
      await signOut({ callbackUrl: "/auth/login" });
    }
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

export interface ErrorType<Error> extends AxiosError<Error> { }
