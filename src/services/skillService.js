import api from './api';

const getAllSkills = () => {
  return api.get('/skills');
};

const createSkill = (skillData) => {
  return api.post('/skills', skillData);
};

const updateSkill = (id, skillData) => {
  return api.put(`/skills/${id}`, skillData);
};

const deleteSkill = (id) => {
  return api.delete(`/skills/${id}`);
};

const skillService = {
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
};

export default skillService;