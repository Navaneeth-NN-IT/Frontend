import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="text-center" style={{ marginTop: '100px' }}>
      <h1 className="display-1 fw-bold">404</h1>
      <p className="lead text-muted">Page Not Found</p>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary mt-3">
        Go to Dashboard
      </Link>
    </div>
  );
}

export default NotFoundPage;