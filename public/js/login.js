/* eslint-disable */
import { showAlert } from './alerts';
import { useFetch } from './utils/useFetch';

export const login = async (email, password) => {
  try {
    const baseUrl = location.origin;
    const res = await useFetch(`/api/v1/users/login`, {
      email,
      password
    });

    showAlert('success', 'Loggin in successfully');
    setTimeout(location.assign('/'), 1000);
  } catch (err) {
    showAlert('error', err.message);
  }
};

export const logout = async () => {
  try {
    const res = await useFetch('/api/v1/users/logout');

    if (res.status === 'success') location.assign('/');
  } catch (err) {
    showAlert('error', 'Logout unsuccessful, please try again!');
  }
};
