/* eslint-disable */
import { showAlert } from './alerts';
import { useFetch } from './utils/useFetch';

export const login = async (email, password) => {
  try {
    const baseUrl = location.origin;
    const res = await useFetch(`${baseUrl}/api/v1/users/login`, {
      email,
      password
    });

    console.log('login', res); // TEST

    showAlert('success', 'Loggin in successfully');
    setTimeout(location.assign('/'), 1000);
  } catch (err) {
    console.error(err);
    showAlert('error', err.message);
  }
};

export const logout = async () => {
  try {
    const res = await useFetch('http://127.0.0.1:3000/api/v1/users/logout');

    if (res.status === 'success') location.assign('/');
  } catch (err) {
    showAlert('error', 'Logout unsuccessful, please try again!');
  }
};
