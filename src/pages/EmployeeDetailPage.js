import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import employeeService from '../services/employeeService';
import skillService from '../services/skillService';
import departmentService from '../services/departmentService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import AdminOnly from '../components/AdminOnly';
import AddSkillModal from '../components/AddSkillModal';
import { Button, Card, Col, Row, Form, ListGroup, Badge } from 'react-bootstrap';

function EmployeeDetailPage() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  
  const [employee, setEmployee] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [allManagers, setAllManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedManager, setSelectedManager] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [empRes, skillsRes, deptsRes, managersRes] = await Promise.all([
        employeeService.getEmployeeById(id),
        skillService.getAllSkills(),
        departmentService.getAllDepartments(),
        employeeService.getAllEmployees()
      ]);

      setEmployee(empRes.data);
      setAllSkills(skillsRes.data);
      setAllDepartments(deptsRes.data);
      setAllManagers(managersRes.data.filter(m => m.id !== empRes.data.id));
      
      setSelectedDept(empRes.data.department?.id || '');
      setSelectedManager(empRes.data.manager?.id || '');

      setError(null);
    } catch (err) {
      setError("Failed to fetch employee details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAssignSkill = async (skillId) => {
    try {
      await employeeService.assignSkillToEmployee(id, skillId);
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError("Failed to assign skill.");
    }
  };

  const handleRemoveSkill = async (skillId) => {
    if (window.confirm('Are you sure you want to remove this skill?')) {
      try {
        await employeeService.removeSkillFromEmployee(id, skillId);
        fetchData();
      } catch (err) {
        setError("Failed to remove skill.");
      }
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await employeeService.updateEmployee(id, selectedDept || null, selectedManager || null);
      alert('Profile updated successfully!');
      fetchData();
    } catch(err) {
      setError('Failed to update profile.');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!employee) return <p>Employee not found.</p>;

  return (
    <div>
      <Link to="/dashboard" className="btn btn-outline-secondary mb-4">
        &larr; Back to Dashboard
      </Link>
      {error && <ErrorAlert message={error} />}
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header className="bg-dark text-white"><h4 className="mb-0">{employee.name}</h4></Card.Header>
            <Card.Body>
              <p><strong>Email:</strong> {employee.email}</p>
              <p><strong>Role:</strong> <Badge bg="info">{employee.role}</Badge></p>
              <p><strong>Department:</strong> {employee.department?.name || 'N/A'}</p>
              <p><strong>Manager:</strong> {employee.manager?.name || 'N/A'}</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header><div className="d-flex justify-content-between align-items-center"><h5 className="mb-0">Assigned Skills</h5><AdminOnly><Button variant="primary" size="sm" onClick={() => setShowModal(true)}>+ Assign Skill</Button></AdminOnly></div></Card.Header>
            <ListGroup variant="flush">
              {employee.skills.length > 0 ? employee.skills.map(skill => (
                <ListGroup.Item key={skill.id} className="d-flex justify-content-between align-items-center">{skill.name}<AdminOnly><Button variant="outline-danger" size="sm" onClick={() => handleRemoveSkill(skill.id)}>Remove</Button></AdminOnly></ListGroup.Item>
              )) : (<ListGroup.Item>No skills assigned yet.</ListGroup.Item>)}
            </ListGroup>
          </Card>
          
          <AdminOnly>
            <Card>
              <Card.Header><h5 className="mb-0">Update Profile</h5></Card.Header>
              <Card.Body>
                <Form onSubmit={handleProfileUpdate}>
                  <Row>
                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Department</Form.Label><Form.Select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}><option value="">None</option>{allDepartments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</Form.Select></Form.Group></Col>
                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Manager</Form.Label><Form.Select value={selectedManager} onChange={(e) => setSelectedManager(e.target.value)}><option value="">None</option>{allManagers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</Form.Select></Form.Group></Col>
                  </Row>
                  <Button variant="success" type="submit">Save Changes</Button>
                </Form>
              </Card.Body>
            </Card>
          </AdminOnly>
        </Col>
      </Row>

      <AddSkillModal show={showModal} onHide={() => setShowModal(false)} allSkills={allSkills} employeeSkills={employee.skills} onAssign={handleAssignSkill}/>
    </div>
  );
}

export default EmployeeDetailPage;