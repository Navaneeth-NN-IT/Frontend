import api from './api';

// --- DEFINITIONS ---

const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.accessToken) {
    // Store the entire user object from the response in localStorage
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const register = (name, email, password, role) => {
  // This function is used by the RegisterPage
  return api.post('/auth/register', { name, email, password, role });
};

const logout = () => {
  // Clear the user data from localStorage
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  // Retrieve and parse the user data from localStorage
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    return null;
  }
  return JSON.parse(userStr);
};


// --- EXPORT OBJECT ---
// All functions are now correctly defined before being exported.

const authService = {
  login,
  register,
  logout,
  getCurrentUser,
};

export default authService;