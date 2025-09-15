import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUp } from 'react-bootstrap-icons';

/**
 * Renders the table of employees with sortable headers.
 * @param {Array} employees - The list of employee objects to display.
 * @param {object} sortConfig - An object containing the current sort field and direction (e.g., { field: 'name', direction: 'asc' }).
 * @param {function} onSort - A callback function to be executed when a sortable header is clicked.
 *                            It receives the field name as an argument.
 */
function EmployeeList({ employees, sortConfig, onSort }) {
  
  // Helper function to determine which sort icon to display (up, down, or none)
  const getSortIcon = (fieldName) => {
    if (!sortConfig || sortConfig.field !== fieldName) {
      return null;
    }
    if (sortConfig.direction === 'asc') {
      return <ArrowUp className="ms-1" />;
    }
    return <ArrowDown className="ms-1" />;
  };

  // A component for the table headers to make them clickable and show the sort icon
  const SortableHeader = ({ field, children }) => (
    <th scope="col" onClick={() => onSort(field)} style={{ cursor: 'pointer' }}>
      {children} {getSortIcon(field)}
    </th>
  );

  if (!employees || employees.length === 0) {
    return <p className="text-center mt-4">No employees match the current filters.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <SortableHeader field="user.name">Name</SortableHeader>
            <SortableHeader field="user.email">Email</SortableHeader>
            <SortableHeader field="department.name">Department</SortableHeader>
            <th scope="col">Skills</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.department?.name || <span className="text-muted">N/A</span>}</td>
              <td>
                {employee.skills && employee.skills.map((skill) => (
                  <span key={skill.id} className="badge bg-primary me-1">{skill.name}</span>
                ))}
              </td>
              <td>
                <Link to={`/employees/${employee.id}`} className="btn btn-outline-info btn-sm">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;