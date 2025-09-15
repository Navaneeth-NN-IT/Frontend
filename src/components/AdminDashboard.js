import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import employeeService from '../services/employeeService';
import EmployeeList from './EmployeeList';
import LoadingSpinner from './LoadingSpinner';
import ErrorAlert from './ErrorAlert';
import AdminOnly from './AdminOnly';
import PaginationControls from './PaginationControls';
import { Form, Row, Col, Card, Button } from 'react-bootstrap';
import { PersonPlusFill } from 'react-bootstrap-icons';

function AdminDashboard() {
  // This state will now hold the full 'Page' object from the backend
  const [pageData, setPageData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for pagination and sorting
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ field: 'name', direction: 'asc' });

  // Note: Client-side search is complex with server-side pagination.
  // We will add a backend-driven search later if needed. For now, we remove it for clarity.

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const sortString = `${sortConfig.field},${sortConfig.direction}`;
      // We will use a fixed size of 5 employees per page for this example.
      const response = await employeeService.getAllEmployees(currentPage, 5, sortString);
      setPageData(response.data); // Store the entire page object
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch employee data.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortConfig]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const handleSort = (field) => {
    // Toggles the sort direction or changes the sort field
    let direction = 'asc';
    if (sortConfig.field === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ field, direction });
    setCurrentPage(0); // Go back to the first page when the sort order changes
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;
  // Don't render if we have no data yet
  if (!pageData) return null; 

  return (
    <>
      <Row className="mb-4">
        {/* Display total number of employees from the page object */}
        <Col md={4}>
            <Card>
                <Card.Body>
                    <h5 className="card-title">Total Employees</h5>
                    <p className="card-text fs-2 fw-bold">{pageData.totalElements}</p>
                </Card.Body>
            </Card>
        </Col>
      </Row>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Employee Directory</h5>
          <AdminOnly>
            <Link to="/register" className="btn btn-primary">
              <PersonPlusFill className="me-2"/> Add Employee
            </Link>
          </AdminOnly>
        </Card.Header>
        <Card.Body>
          {/* 
            --- THIS IS THE FIX ---
            We pass pageData.content (the array of employees) to the EmployeeList.
            We pass the full pageData object to the PaginationControls.
          */}
          <EmployeeList 
            employees={pageData.content} 
            sortConfig={sortConfig}
            onSort={handleSort}
          />
          <PaginationControls 
            page={pageData}
            onPageChange={handlePageChange}
          />
        </Card.Body>
      </Card>
    </>
  );
}

export default AdminDashboard;