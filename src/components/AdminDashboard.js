import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import employeeService from '../services/employeeService';
import EmployeeList from './EmployeeList';
import LoadingSpinner from './LoadingSpinner';
import ErrorAlert from './ErrorAlert';
import AdminOnly from './AdminOnly';
import { Form, Row, Col, Card, Button } from 'react-bootstrap';
import { PersonPlusFill } from 'react-bootstrap-icons';

function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [stats, setStats] = useState({ total: 0, withSkills: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const empRes = await employeeService.getAllEmployees();
      setEmployees(empRes.data);
      setFilteredEmployees(empRes.data);
      setStats({
        total: empRes.data.length,
        withSkills: empRes.data.filter(e => e.skills.length > 0).length,
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const result = employees.filter(emp =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEmployees(result);
  }, [searchQuery, employees]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <>
      <Row className="mb-4">
        <Col md={4}><Card><Card.Body><h5 className="card-title">Total Employees</h5><p className="card-text fs-2 fw-bold">{stats.total}</p></Card.Body></Card></Col>
        <Col md={4}><Card><Card.Body><h5 className="card-title">Employees with Skills</h5><p className="card-text fs-2 fw-bold">{stats.withSkills}</p></Card.Body></Card></Col>
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
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form.Group>
          <EmployeeList employees={filteredEmployees} />
        </Card.Body>
      </Card>
    </>
  );
}

export default AdminDashboard;