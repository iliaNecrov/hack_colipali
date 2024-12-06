export const api =
  import.meta.env.MODE === 'production' ? `/api` : `${import.meta.env.VITE_API_URL}`;

console.log('api', api);
