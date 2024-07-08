const pool = require('./connection');

const viewEmployees = async () => {
    try {
        const res = await pool.query(`
            SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary,
            (SELECT first_name FROM employees WHERE id = employees.manager_id) AS manager_first_name,
            (SELECT last_name FROM employees WHERE id = employees.manager_id) AS manager_last_name
            FROM employees
            JOIN roles ON employees.role_id = roles.id
            JOIN departments ON roles.department_id = departments.id
        `);
        console.table(res.rows);
    } catch (err) {
        console.error('Error viewing employees:', err);
    }
};

const addEmployee = async (firstName, lastName, roleId, managerId) => {
    try {
        await pool.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [firstName, lastName, roleId, managerId]);
        console.log(`Employee ${firstName} ${lastName} added successfully.`);
    } catch (err) {
        console.error('Error adding employee:', err);
    }
};

const updateEmployeeRole = async (employeeId, roleId) => {
    try {
        await pool.query('UPDATE employees SET role_id = $1 WHERE id = $2', [roleId, employeeId]);
        console.log(`Employee role updated successfully.`);
    } catch (err) {
        console.error('Error updating employee role:', err);
    }
};

module.exports = { viewEmployees, addEmployee, updateEmployeeRole };
