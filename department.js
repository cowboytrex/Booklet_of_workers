const pool = require('./connection');

const viewDepartments = async () => {
    try {
        const res = await pool.query('SELECT * FROM departments');
        console.table(res.rows);
    } catch (err) {
        console.error('Error viewing departments:', err);
    }
};

const addDepartment = async (departmentName) => {
    try {
        await pool.query('INSERT INTO departments (name) VALUES ($1)', [departmentName]);
        console.log(`Department ${departmentName} added successfully.`);
    } catch (err) {
        console.error('Error adding department:', err);
    }
};

module.exports = { viewDepartments, addDepartment };
