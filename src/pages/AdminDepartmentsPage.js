import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Card, ListGroup } from 'react-bootstrap';
import departmentService from '../services/departmentService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  // Function to fetch all departments from the backend
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentService.getAllDepartments();
      setDepartments(response.data);
      setError(null); // Clear previous errors on a successful fetch
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch departments.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments when the component first loads
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Handler for submitting the "Add New Department" form
  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    if (!newDepartmentName.trim()) return;
    try {
      await departmentService.createDepartment({ name: newDepartmentName });
      setNewDepartmentName(''); // Clear the input field on success
      fetchDepartments(); // Refresh the list from the server
    } catch (err) {
      // FIX: Display the actual, specific error message from the backend
      const message = err.response?.data?.message || "Failed to create department. It might already exist.";
      setError(message);
    }
  };

  // Handler for saving changes from the "Edit Department" modal
  const handleUpdateDepartment = async () => {
    if (!editingDepartment || !editingDepartment.name.trim()) return;
    try {
      await departmentService.updateDepartment(editingDepartment.id, { name: editingDepartment.name });
      setShowEditModal(false);
      setEditingDepartment(null);
      fetchDepartments(); // Refresh the list
    } catch (err) {
      // FIX: Display the actual, specific error message from the backend
      const message = err.response?.data?.message || "Failed to update department.";
      setError(message);
    }
  };

  // Handler for the "Delete" button
  const handleDeleteDepartment = async (departmentId) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentService.deleteDepartment(departmentId);
        fetchDepartments(); // Refresh the list
      } catch (err) {
        // FIX: Display the actual, specific error message from the backend
        const message = err.response?.data?.message || "Failed to delete department. It may be in use by an employee.";
        setError(message);
      }
    }
  };

  // Helper functions to control the edit modal
  const openEditModal = (department) => {
    setEditingDepartment({ ...department });
    setShowEditModal(true);
  };
  
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingDepartment(null);
  };
  
  // Conditional rendering for loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Main component JSX
  return (
    <div>
      <h1 className="h2 mb-4">Manage Departments</h1>
      {error && <ErrorAlert message={error} />}

      <Card className="mb-4">
        <Card.Body>
          <h5 className="card-title">Add New Department</h5>
          <Form onSubmit={handleCreateDepartment} className="d-flex gap-2">
            <Form.Control 
              type="text" 
              placeholder="Enter department name" 
              value={newDepartmentName} 
              onChange={(e) => setNewDepartmentName(e.target.value)} 
              required
            />
            <Button variant="primary" type="submit">Add</Button>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header><h5>Existing Departments</h5></Card.Header>
        <ListGroup variant="flush">
          {departments.map((dept) => (
            <ListGroup.Item key={dept.id} className="d-flex justify-content-between align-items-center">
              {dept.name}
              <div>
                <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => openEditModal(dept)}>Edit</Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteDepartment(dept.id)}>Delete</Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
      
      <Modal show={showEditModal} onHide={closeEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Department Name</Form.Label>
            <Form.Control 
              type="text" 
              value={editingDepartment?.name || ''} 
              onChange={(e) => setEditingDepartment({ ...editingDepartment, name: e.target.value })} 
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>Close</Button>
          <Button variant="primary" onClick={handleUpdateDepartment}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminDepartmentsPage;