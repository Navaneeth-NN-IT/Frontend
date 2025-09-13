import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import employeeService from '../services/employeeService';
import LoadingSpinner from './LoadingSpinner';
import ErrorAlert from './ErrorAlert';
import { Card, Col, Row, ListGroup, Badge } from 'react-bootstrap';

function EmployeeDashboard() {
  const { user } = useAuth();
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!user?.employeeId) return;
    try {
      setLoading(true);
      const response = await employeeService.getEmployeeById(user.employeeId);
      setEmployeeData(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch your profile data.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!employeeData) return <p>Could not load your data.</p>;

  return (
    <>
      <h1 className="mb-4">My Dashboard</h1>
      <Row>
        <Col md={5}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-dark text-white">
              <h4 className="mb-0">{employeeData.name}</h4>
            </Card.Header>
            <Card.Body>
              <p><strong>Email:</strong> {employeeData.email}</p>
              <p><strong>Department:</strong> {employeeData.department?.name || 'N/A'}</p>
              <p><strong>Manager:</strong> {employeeData.manager?.name || 'N/A'}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={7}>
          <Card className="shadow-sm h-100">
            <Card.Header>
              <h5 className="mb-0">My Skills</h5>
            </Card.Header>
            <ListGroup variant="flush">
              {employeeData.skills.length > 0 ? (
                employeeData.skills.map(skill => (
                  <ListGroup.Item key={skill.id}>
                    <Badge bg="primary" pill className="fs-6">{skill.name}</Badge>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>You have no skills assigned yet.</ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default EmployeeDashboard;