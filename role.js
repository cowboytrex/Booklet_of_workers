const pool = require('./connection');

const viewRoles = async () => {
    try {
        const res = await pool.query(`
            SELECT roles.id, roles.title, roles.salary, departments.name AS department
            FROM roles
            JOIN departments ON roles.department_id = departments.id
        `);
        console.table(res.rows);
    } catch (err) {
        console.error('Error viewing roles:', err);
    }
};

const addRole = async (title, salary, departmentId) => {
    try {
        await pool.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, departmentId]);
        console.log(`Role ${title} added successfully.`);
    } catch (err) {
        console.error('Error adding role:', err);
    }
};

module.exports = { viewRoles, addRole };
