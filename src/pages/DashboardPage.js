import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/AdminDashboard'; // <-- Imports the Admin view
import EmployeeDashboard from '../components/EmployeeDashboard'; // <-- Imports the Employee view

function DashboardPage() {
  const { isAdmin } = useAuth(); // Gets the current user's role

  // This is the core logic:
  // IF the user is an admin, show the AdminDashboard component.
  // ELSE, show the EmployeeDashboard component.
  return isAdmin ? <AdminDashboard /> : <EmployeeDashboard />;
}

export default DashboardPage;