export enum SendLogTypeEnum {
  success = 'success',
  error = 'error',
  warning = 'warning',
  info = 'info',
  debug = 'debug',
  verbose = 'verbose',
}

export interface SendLogRequestDto {
  endpoint?: string;
  data?: unknown;
  message: string;
  type: SendLogTypeEnum;
}
