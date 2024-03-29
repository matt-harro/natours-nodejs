const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBookings)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

// router.post('/user/:userId', bookingController.createUserBooking);
// router.get('/user/:userId', bookingController.getUserBooking);
// router.patch('/user/:userId', bookingController.updateUserBooking);
// router.delete('/user/:userId', bookingController.deleteUserBooking);

module.exports = router;
