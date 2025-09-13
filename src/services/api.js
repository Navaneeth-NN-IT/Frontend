import axios from 'axios';

// Create an instance of axios with the base URL for your backend
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// --- THIS INTERCEPTOR IS THE FIX ---
// Add a request interceptor to automatically include the token in all API requests.
api.interceptors.request.use(
  (config) => {
    // 1. Get the user object string from localStorage.
    const userString = localStorage.getItem('user');

    if (userString) {
      // 2. If it exists, parse it from JSON into an object.
      const user = JSON.parse(userString);

      // 3. Extract the accessToken property from the user object.
      const token = user.accessToken;
      
      // 4. If the token exists, add it to the Authorization header.
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    // Handle any errors that occur during the request setup
    return Promise.reject(error);
  }
);

export default api;