import React, { useState, useMemo } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function AddSkillModal({ show, onHide, allSkills, employeeSkills, onAssign }) {
  const [selectedSkillId, setSelectedSkillId] = useState('');

  const assignableSkills = useMemo(() => {
    const employeeSkillIds = new Set(employeeSkills.map(s => s.id));
    return allSkills.filter(skill => !employeeSkillIds.has(skill.id));
  }, [allSkills, employeeSkills]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSkillId) {
      onAssign(Number(selectedSkillId));
      setSelectedSkillId('');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Assign New Skill</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {assignableSkills.length > 0 ? (
            <Form.Group>
              <Form.Label>Select a skill to add:</Form.Label>
              <Form.Select value={selectedSkillId} onChange={(e) => setSelectedSkillId(e.target.value)} required autoFocus>
                <option value="">Choose...</option>
                {assignableSkills.map(skill => (
                  <option key={skill.id} value={skill.id}>{skill.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          ) : (
            <p className="text-muted">This employee has all available skills.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button variant="primary" type="submit" disabled={!selectedSkillId || assignableSkills.length === 0}>
            Assign Skill
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddSkillModal;