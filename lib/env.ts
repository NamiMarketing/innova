const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_PROPERFY_API_URL || 'https://dev.properfy.com.br';
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

export const env = {
  PROPERFY_API_URL: getApiUrl(),
  PROPERFY_USERNAME: process.env.NEXT_PUBLIC_PROPERFY_USERNAME || '',
  PROPERFY_PASSWORD: process.env.NEXT_PUBLIC_PROPERFY_PASSWORD || '',
};
