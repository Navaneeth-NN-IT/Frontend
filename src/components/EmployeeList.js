import React from 'react';
import { Link } from 'react-router-dom';

function EmployeeList({ employees }) {
  if (!employees || employees.length === 0) {
    return <p className="text-center mt-4">No employees match the current filters.</p>;
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Department</th>
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
                    {employee.skills.length > 0 ? (
                      employee.skills.map((skill) => (
                        <span key={skill.id} className="badge bg-primary me-1">{skill.name}</span>
                      ))
                    ) : (
                      <span className="text-muted">No skills</span>
                    )}
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
      </div>
    </div>
  );
}

export default EmployeeList;