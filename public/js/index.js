/* eslint-disable */
import 'core-js/stable';
import 'regenerator-runtime/runtime.js';

import { login, logout } from './login';
import { updateSettings, previewPhoto } from './updateSettings';
import { displayMap } from './leaflet';
import { bookTour } from './stripe';

///////// ELEMENTS /////////
const loginFormEl = document.querySelector('.form--login');
const userDataFormEl = document.querySelector('.form-user-data');
const passwordFormEl = document.querySelector('.form-password');
const mapEl = document.querySelector('#map');
const logoutBtn = document.querySelector('.nav__el--logout');
const bookTourBtn = document.querySelector('#book-tour');

//////// DELEGATION //////////
// Login
if (loginFormEl) {
  const handleSubmit = e => {
    e.preventDefault();

    const email = e.target.email?.value;
    const password = e.target.password?.value;

    login(email, password);

    loginFormEl.reset();
  };

  loginFormEl.addEventListener('submit', handleSubmit);
}

// Logout
if (logoutBtn) logoutBtn.addEventListener('click', logout);

// Update user data
if (userDataFormEl) {
  let userPhotoUrl;
  document.querySelector('#photo').addEventListener('change', function(e) {
    const [file] = e.target.files;
    if (file && file.type.startsWith('image')) {
      const userPhoto = document.querySelector('.form__user-photo');
      userPhotoUrl = URL.createObjectURL(file);
      userPhoto.src = userPhotoUrl;
    }
  });

  userDataFormEl.addEventListener('submit', async e => {
    e.preventDefault();
    const submitBtn = document.querySelector('#form-user-data__submit-btn');
    submitBtn.textContent = 'Loading...';

    const form = new FormData();

    form.append('name', document.querySelector('#name').value);
    form.append('email', document.querySelector('#email').value);
    form.append('photo', document.querySelector('#photo').files[0]);

    const isSuccessful = await updateSettings(form, 'data');

    if (isSuccessful && userPhotoUrl) {
      document.querySelector('.nav__user-img').src = userPhotoUrl;
    }
    submitBtn.textContent = 'Save Settings';
  });
}

// Update password
if (passwordFormEl) {
  passwordFormEl.addEventListener('submit', async e => {
    e.preventDefault();
    const submitBtn = document.querySelector('.password-submit-btn');
    submitBtn.textContent = 'Submitting...';

    const passwordCurrent = document.querySelector('#password-current').value;
    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    submitBtn.textContent = 'Save password';
  });
}

// Map
if (mapEl) {
  const locations = JSON.parse(
    document.querySelector('#map').dataset.locations
  );

  displayMap(locations);
}

// Book Tour
if (bookTourBtn) {
  bookTourBtn.addEventListener('click', e => {
    bookTourBtn.textContent = 'Processing...';
    bookTour(e.target.dataset['tourId']);
  });
}
