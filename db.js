const pool = require('./connection');

const clearTables = async () => {
    const clearDepartmentsTable = 'DELETE FROM departments;';
    const clearRolesTable = 'DELETE FROM roles;';
    const clearEmployeesTable = 'DELETE FROM employees;';

    await pool.query(clearEmployeesTable);
    await pool.query(clearRolesTable);
    await pool.query(clearDepartmentsTable);
    console.log("Tables cleared successfully.");
};

const createTables = async () => {
    const createDepartmentsTable = `
    CREATE TABLE IF NOT EXISTS departments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL
    );`;

    const createRolesTable = `
    CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(50) NOT NULL,
        salary DECIMAL NOT NULL,
        department_id INT REFERENCES departments(id)
    );`;

    const createEmployeesTable = `
    CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        role_id INT REFERENCES roles(id),
        manager_id INT REFERENCES employees(id)
    );`;

    await pool.query(createDepartmentsTable);
    await pool.query(createRolesTable);
    await pool.query(createEmployeesTable);
    console.log("Tables created successfully.");
};

const insertSampleData = async () => {
    const insertDepartments = `
    INSERT INTO departments (name) VALUES
    ('Engineering'), ('Sales'), ('Finance'),
    ('Marketing'), ('HR'), ('IT Support');`;

    const insertRoles = `
    INSERT INTO roles (title, salary, department_id) VALUES
    ('Software Engineer', 60000, (SELECT id FROM departments WHERE name = 'Engineering')),
    ('Sales Manager', 50000, (SELECT id FROM departments WHERE name = 'Sales')),
    ('Accountant', 45000, (SELECT id FROM departments WHERE name = 'Finance')),
    ('Marketing Specialist', 55000, (SELECT id FROM departments WHERE name = 'Marketing')),
    ('HR Manager', 65000, (SELECT id FROM departments WHERE name = 'HR')),
    ('IT Support Specialist', 50000, (SELECT id FROM departments WHERE name = 'IT Support')),
    ('Senior Software Engineer', 90000, (SELECT id FROM departments WHERE name = 'Engineering')),
    ('Junior Sales Associate', 40000, (SELECT id FROM departments WHERE name = 'Sales')),
    ('Financial Analyst', 60000, (SELECT id FROM departments WHERE name = 'Finance'));`;

    const insertEmployees = `
    INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
    ('John', 'Doe', (SELECT id FROM roles WHERE title = 'Software Engineer'), NULL),
    ('Jane', 'Smith', (SELECT id FROM roles WHERE title = 'Sales Manager'), NULL),
    ('Emily', 'Johnson', (SELECT id FROM roles WHERE title = 'Accountant'), NULL),
    ('Alice', 'Brown', (SELECT id FROM roles WHERE title = 'Marketing Specialist'), NULL),
    ('Bob', 'Davis', (SELECT id FROM roles WHERE title = 'HR Manager'), NULL),
    ('Charlie', 'Evans', (SELECT id FROM roles WHERE title = 'IT Support Specialist'), NULL),
    ('David', 'Wilson', (SELECT id FROM roles WHERE title = 'Senior Software Engineer'), (SELECT id FROM employees WHERE first_name = 'John' AND last_name = 'Doe')),
    ('Eve', 'Martinez', (SELECT id FROM roles WHERE title = 'Junior Sales Associate'), (SELECT id FROM employees WHERE first_name = 'Jane' AND last_name = 'Smith')),
    ('Frank', 'Garcia', (SELECT id FROM roles WHERE title = 'Financial Analyst'), (SELECT id FROM employees WHERE first_name = 'Emily' AND last_name = 'Johnson')),
    ('Grace', 'Lee', (SELECT id FROM roles WHERE title = 'Senior Software Engineer'), (SELECT id FROM employees WHERE first_name = 'John' AND last_name = 'Doe')),
    ('Hank', 'Moore', (SELECT id FROM roles WHERE title = 'Junior Sales Associate'), (SELECT id FROM employees WHERE first_name = 'Jane' AND last_name = 'Smith')),
    ('Ivy', 'Taylor', (SELECT id FROM roles WHERE title = 'Financial Analyst'), (SELECT id FROM employees WHERE first_name = 'Emily' AND last_name = 'Johnson'));`;

    await pool.query(insertDepartments);
    await pool.query(insertRoles);
    await pool.query(insertEmployees);
    console.log("Sample data inserted successfully.");
};

const initDb = async () => {
    await clearTables();
    await createTables();
    await insertSampleData();
    pool.end();
};

initDb().catch(err => console.error("Error initializing database:", err));
