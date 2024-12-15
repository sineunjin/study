import { api } from './api';

export const login = (data: { id: string; password: string }) => {
  return api({
    method: 'post',
    url: '/auth/sign-in',
    data,
  });
};

export const logout = () => {
  return api({
    method: 'post',
    url: '/auth/logout',
  });
};
