const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
// const bookingController = require('../controllers/bookingController');

const router = express.Router();

// router.use(authController.isLoggedIn); // used to render correct header and put user data onto request

// UNPROTECTED ROUTES
router.get(
  '/',
  // bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview
);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);

// PROTECTED ROUTES
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours);
router.post(
  '/update-user-data',
  authController.protect,
  viewController.updateUserData
);

module.exports = router;

// router.get('/me', authController.protect, viewController.getAccount);
// router.get('/my-tours', authController.protect, viewController.getAccount);

// router.use(bookingController.createBookingCheckout, authController.isLoggedIn);
// router.get('/', viewController.getOverview);
// router.get('/tour/:slug', viewController.getTour);
// router.get('/login', viewController.getLoginForm);
// router.post(
//   '/update-user-data',
//   authController.protect,
//   viewController.updateUserData
// );
