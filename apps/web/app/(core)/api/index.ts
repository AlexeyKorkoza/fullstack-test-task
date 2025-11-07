import ky from 'ky';

export const createApiClient = () => {
  const prefixUrl = 'http://localhost:3000/api';

  return ky.create({ prefixUrl });
};
