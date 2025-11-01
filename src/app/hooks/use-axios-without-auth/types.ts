// import { WithRequired } from '@tanstack/react-query';
// import { AxiosRequestConfig } from 'axios';

// export interface AxiosFetchParams<D = unknown> extends WithRequired<AxiosRequestConfig<D>, 'url'> {}

export interface ResponsePayload {
  name: string;
  message: string;
  statusCode: number;
}
