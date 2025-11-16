export const MIN_PASSWORD_LENGTH = 8;
export const EMAIL_INVALID_ERROR = 'Email is invalid';
export const PASSWORD_INVALID_ERROR = (minLength: number): string =>
  `Password must be at least ${minLength} characters`;
