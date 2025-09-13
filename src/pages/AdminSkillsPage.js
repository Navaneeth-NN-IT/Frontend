import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Card, ListGroup } from 'react-bootstrap';
import skillService from '../services/skillService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

function AdminSkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSkillName, setNewSkillName] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await skillService.getAllSkills();
      setSkills(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch skills.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    try {
      await skillService.createSkill({ name: newSkillName });
      setNewSkillName('');
      fetchSkills();
    } catch (err) {
      setError("Failed to create skill. It might already exist.");
    }
  };
  
  const handleUpdateSkill = async () => {
    if (!editingSkill || !editingSkill.name.trim()) return;
    try {
      await skillService.updateSkill(editingSkill.id, { name: editingSkill.name });
      setShowEditModal(false);
      setEditingSkill(null);
      fetchSkills();
    } catch (err) {
      setError("Failed to update skill.");
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await skillService.deleteSkill(skillId);
        fetchSkills();
      } catch (err) {
        setError("Failed to delete skill. It may be in use by an employee.");
      }
    }
  };

  const openEditModal = (skill) => {
    setEditingSkill({ ...skill });
    setShowEditModal(true);
  };
  
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingSkill(null);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="h2 mb-4">Manage Skills</h1>
      {error && <ErrorAlert message={error} />}

      <Card className="mb-4">
        <Card.Body>
          <h5 className="card-title">Add New Skill</h5>
          <Form onSubmit={handleCreateSkill} className="d-flex gap-2">
            <Form.Control type="text" placeholder="Enter skill name" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} required />
            <Button variant="primary" type="submit">Add</Button>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header><h5>Existing Skills</h5></Card.Header>
        <ListGroup variant="flush">
          {skills.map((skill) => (
            <ListGroup.Item key={skill.id} className="d-flex justify-content-between align-items-center">
              {skill.name}
              <div>
                <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => openEditModal(skill)}>Edit</Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteSkill(skill.id)}>Delete</Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>

      <Modal show={showEditModal} onHide={closeEditModal} centered>
        <Modal.Header closeButton><Modal.Title>Edit Skill</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Skill Name</Form.Label>
            <Form.Control type="text" value={editingSkill?.name || ''} onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })} autoFocus />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>Close</Button>
          <Button variant="primary" onClick={handleUpdateSkill}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminSkillsPage;