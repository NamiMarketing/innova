import ky from 'ky';
import { env } from '@/lib/env';
import { getToken } from './auth';

export const api = ky.create({
  prefixUrl: env.PROPERFY_API_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        const token = await getToken();
        request.headers.set('Authorization', `Bearer ${token}`);
      },
    ],
  },
});
