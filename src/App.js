import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';

// Page Components
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import AdminSkillsPage from './pages/AdminSkillsPage';
import AdminDepartmentsPage from './pages/AdminDepartmentsPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// This is the core App component.
// Its primary job is to decide whether to show the login page or the main application.
function App() {
  const { isAuthenticated, loading } = useAuth();

  // On initial load, the AuthContext's `loading` state is true.
  // We display a loading message to prevent a blank white screen or rendering flicker.
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
          Loading Application...
      </div>
    );
  }

  // Once the initial authentication check is complete, we render the routes.
  return (
    <Routes>
      {/* 
        The login route is special:
        - If the user is NOT authenticated, it renders the LoginPage.
        - If the user IS authenticated and tries to go to /login, they are redirected to the dashboard.
      */}
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
      
      {/* 
        This is a wildcard route for all other paths. It's the protected part of the app.
        - If the user IS authenticated, it renders the MainLayout component which contains all the app pages.
        - If the user is NOT authenticated, they are redirected to the /login page.
      */}
      <Route path="/*" element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />} />
    </Routes>
  );
}

// This component defines the main structure for an authenticated user.
// It includes the persistent sidebar and the routing for all the internal pages.
const MainLayout = () => (
  <div className="app-wrapper">
    <div className="sidebar-wrapper">
      <Sidebar />
    </div>
    <div className="content-wrapper">
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/employees/:id" element={<EmployeeDetailPage />} />
        <Route path="/admin/skills" element={<AdminSkillsPage />} />
        <Route path="/admin/departments" element={<AdminDepartmentsPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* The default route for a logged-in user is their dashboard. */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        {/* This is a catch-all route for any undefined paths within the authenticated app. */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  </div>
);

// This is the final component that gets exported.
// It wraps the entire application in the Router and the AuthProvider,
// making routing and authentication state available to all components.
const AppWrapper = () => (
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);

export default AppWrapper;