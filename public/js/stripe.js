import axios from 'axios';

export const bookTour = async tourId => {
  const res = await axios.get(`/api/v1/bookings/checkout-session/${tourId}`);
  location.assign(res.data.session.url);
};
