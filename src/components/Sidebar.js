import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HouseDoorFill, JournalBookmarkFill, Building, BoxArrowRight } from 'react-bootstrap-icons';

function Sidebar() {
  const { user, isAdmin, logout } = useAuth();

  return (
    <div className="sidebar vh-100">
      <Link to="/" className="sidebar-brand">
        SkillTracker
      </Link>

      <ul className="nav flex-column sidebar-nav">
        <li className="nav-item">
          <NavLink to="/dashboard" className="nav-link">
            <HouseDoorFill /> Dashboard
          </NavLink>
        </li>
        {isAdmin && (
          <>
            <li className="nav-item">
              <NavLink to="/admin/skills" className="nav-link">
                <JournalBookmarkFill /> Manage Skills
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin/departments" className="nav-link">
                <Building /> Manage Departments
              </NavLink>
            </li>
          </>
        )}
      </ul>
      
      <div className="sidebar-footer">
        <div className="small mb-2">Logged in as:</div>
        {/* With the AuthContext fix, this will now render correctly */}
        <div className="fw-bold mb-3">{user?.email}</div>
        
        <button className="btn btn-sm btn-outline-light w-100" onClick={logout}>
          <BoxArrowRight className="me-2"/> Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;