import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchBookings = async () => {
  const response = await axios.get(`${API_URL}/bookings`);
  return response.data;
};
