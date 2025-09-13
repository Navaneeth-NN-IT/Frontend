import api from './api';

const getAllEmployees = () => {
  return api.get('/employees');
};

const getEmployeeById = (id) => {
  return api.get(`/employees/${id}`);
};

const updateEmployee = (id, departmentId, managerId) => {
  const params = {};
  if (departmentId) params.departmentId = departmentId;
  if (managerId) params.managerId = managerId;
  
  return api.put(`/employees/${id}`, null, { params });
};

const assignSkillToEmployee = (employeeId, skillId) => {
  return api.post(`/employees/${employeeId}/skills`, { skillId });
};

const removeSkillFromEmployee = (employeeId, skillId) => {
  return api.delete(`/employees/${employeeId}/skills/${skillId}`);
};

const employeeService = {
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  assignSkillToEmployee,
  removeSkillFromEmployee,
};

export default employeeService;