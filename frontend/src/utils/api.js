import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const watchlistAPI = {
  getAll:  (params) => api.get('/watchlist', { params }),
  getStats: ()       => api.get('/watchlist/stats'),
  create:  (data)    => api.post('/watchlist', data),
  update:  (id, data)=> api.put(`/watchlist/${id}`, data),
  delete:  (id)      => api.delete(`/watchlist/${id}`),
};

export const authAPI = {
  verify: (password) => api.post('/auth/verify', { password }),
};

export default api;
