import type { NormalizedOptions } from 'ky';

export const isApiError = (
  error: unknown,
): error is {
  response: {
    status: number;
    json: () => Promise<any>;
    statusText: string;
    url: string;
  };
  options: NormalizedOptions;
} => {
  return typeof error === 'object' && error !== null && 'response' in error;
};
