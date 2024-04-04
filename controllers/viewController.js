const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');

const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template
  // 3) Render the template with the tour data
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new AppError("Couldn't find a tour with that name", 404));
  }

  res.status(200).render('tour', {
    title: `${tour.name} tour`,
    tour
  });
});

exports.getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
});

exports.getAccount = catchAsync(async (req, res) => {
  res.status(200).render('account', {
    title: 'Account Settings'
  });
});

exports.getMyTours = catchAsync(async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id });

  const tourIdArr = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIdArr } });
  // console.log('getMyTours', tours); // TEST

  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  });
});

exports.updateUserData = catchAsync(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );
  // console.log(updatedUser); // TEST

  res.status(200).render('account', {
    title: 'Account Settings',
    user: updatedUser
  });
});

/* DIY urlencoded parser

// Get all the 'chunks' of data from the readable stream (req.body)
  let chunks = [];
  // 1) Listen to the 'data' event on the http.IncomingMessage aka 'Request' aka 'req'
  req.on('data', chunk => {
    // 2) Push each 'chunk' of the readable stream to the array
    chunks.push(chunk);
  });

  // Parse 'data' after all 'chunks' have been recieved
  req.on('end', () => {
    console.log('all parts/chunks have arrived');

    // 1) Concat all the buffer chunks together into one Buffer
    const data = Buffer.concat(chunks);
    console.log('Data: ', data);

    // 2) Convert Buffer to a string (or unencoded the URL)
    const stringData = data.toString();
    console.log('stringData: ', stringData);

    // 3) Seperate the URL into its search Params
    const parsedData = new URLSearchParams(stringData);
    // 4) Convert the URLSearchParams into an object for logging to console
    const dataObj = {};
    for (const [key, value] of parsedData.entries()) {
      dataObj[key] = value;
    }
    console.log('DataObj: ', dataObj);
  });
  */
