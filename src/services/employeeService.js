import api from './api';

/**
 * Fetches a paginated and sorted list of employees from the backend.
 * Used for the main employee directory on the admin dashboard.
 * @param {number} page - The page number to fetch (0-indexed).
 * @param {number} size - The number of items per page.
 * @param {string} sort - The sorting criteria (e.g., 'name,asc').
 * @returns {Promise} An axios promise containing the Page object from the backend.
 */
const getAllEmployees = (page = 0, size = 10, sort = 'name,asc') => {
  return api.get('/employees', {
    params: {
      page,
      size,
      sort,
    },
  });
};

/**
 * Fetches a complete, non-paginated list of all employees.
 * Used for populating selection dropdowns, like the manager list.
 * @returns {Promise} An axios promise containing an array of all employees.
 */
const getAllEmployeesList = () => {
  return api.get('/employees/list');
};

const getEmployeeById = (id) => {
  return api.get(`/employees/${id}`);
};

const updateEmployee = (id, departmentId, managerId) => {
  const params = {};
  if (departmentId !== null) params.departmentId = departmentId;
  if (managerId !== null) params.managerId = managerId;
  
  return api.put(`/employees/${id}`, null, { params });
};

const assignSkillToEmployee = (employeeId, skillId) => {
  return api.post(`/employees/${employeeId}/skills`, { skillId });
};

const removeSkillFromEmployee = (employeeId, skillId) => {
  return api.delete(`/employees/${employeeId}/skills/${skillId}`);
};

const searchEmployeesBySkill = (skillName) => {
  return api.get('/employees/search/by-skill', { params: { skillName } });
};

const searchEmployeesByDepartment = (departmentId) => {
  return api.get('/employees/search/by-department', { params: { departmentId } });
};

const employeeService = {
  getAllEmployees,
  getAllEmployeesList, // <-- Export the new function
  getEmployeeById,
  updateEmployee,
  assignSkillToEmployee,
  removeSkillFromEmployee,
  searchEmployeesBySkill,
  searchEmployeesByDepartment
};

export default employeeService;