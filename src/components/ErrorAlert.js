import React from 'react';

function ErrorAlert({ message }) {
  return (
    <div className="alert alert-danger" role="alert">
      <strong>Error:</strong> {message || 'An unexpected error occurred.'}
    </div>
  );
}

export default ErrorAlert;