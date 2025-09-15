import React from 'react';
import { Pagination } from 'react-bootstrap';

/**
 * A reusable component to render pagination controls.
 * @param {object} page - The page object returned from the Spring Boot backend.
 *                        It should contain properties like `totalPages`, `number` (current page),
 *                        `first` (boolean), and `last` (boolean).
 * @param {function} onPageChange - A callback function to be executed when a page button is clicked.
 *                                  It receives the new page number as an argument.
 */
function PaginationControls({ page, onPageChange }) {
  // Don't render the controls if there's only one page or no data
  if (!page || page.totalPages <= 1) {
    return null;
  }

  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <span className="text-muted small">
        Page {page.number + 1} of {page.totalPages}
      </span>
      <Pagination size="sm" className="mb-0">
        <Pagination.Prev 
          onClick={() => onPageChange(page.number - 1)} 
          disabled={page.first} 
        />
        <Pagination.Next 
          onClick={() => onPageChange(page.number + 1)} 
          disabled={page.last} 
        />
      </Pagination>
    </div>
  );
}

export default PaginationControls;