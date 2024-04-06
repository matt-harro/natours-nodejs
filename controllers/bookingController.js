const stripe = require('stripe')(process.env.STRIPE_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const factory = require('./handlerFactory');
// const User = require('../models/userModel');
// const AppError = require('../utils/appError');

const catchAsync = require('../utils/catchAsync');

exports.getCheckoutSession = catchAsync(async (req, res) => {
  // 1) Get tour data from collection
  const tour = await Tour.findById(req.params.tourId);

  // 2) Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/`,
    customer_email: req.user.email,
    client_reference_id: req.user.id,
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
            metadata: {
              id: tour.id
            }
          }
        },
        quantity: 1
      }
    ]
  });

  // 3) Send Checkout Session as respons
  res.status(200).json({ status: 'success', session });
});

// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//   // This is TEMPORARY, as it its unsecure and everyone can make bookings without paying
//   const { tour, user, price } = req.query;

//   if (!tour && !user && !price) return next();
//   await Booking.create({ tour, user, price });

//   res.redirect(req.originalUrl.split('?')[0]);
// });

const createBookingCheckout = async session => {
  const tour = session.line_items[0].price_data.product_data.metadata.id;
  const user = session.client_reference_id;
  const price = session.line_items[0].price_data.unit_amount / 100;

  await Booking.create({ tour, user, price });
};

exports.webhookStripe = (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      createBookingCheckout(session);
      break;
    }
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
};

exports.getAllBookings = factory.getAll(Booking);

exports.createBooking = factory.createOne(Booking);
exports.getBookings = factory.getOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
