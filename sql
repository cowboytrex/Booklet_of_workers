-- Create the departments table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- Create the roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT REFERENCES departments(id)
);

-- Create the employees table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role_id INT REFERENCES roles(id),
    manager_id INT REFERENCES employees(id)
);

-- Insert sample data into departments
INSERT INTO departments (name) VALUES 
('Engineering'), 
('Sales'), 
('Finance'), 
('Marketing'), 
('HR'), 
('IT Support');

-- Insert sample data into roles
INSERT INTO roles (title, salary, department_id) VALUES
('Software Engineer', 60000, 1),
('Sales Manager', 50000, 2),
('Accountant', 45000, 3),
('Marketing Specialist', 55000, 4),
('HR Manager', 65000, 5),
('IT Support Specialist', 50000, 6),
('Senior Software Engineer', 90000, 1),
('Junior Sales Associate', 40000, 2),
('Financial Analyst', 60000, 3);

-- Insert sample data into employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, NULL),
('Emily', 'Johnson', 3, NULL),
('Alice', 'Brown', 4, NULL),
('Bob', 'Davis', 5, NULL),
('Charlie', 'Evans', 6, NULL),
('David', 'Wilson', 7, 1),
('Eve', 'Martinez', 8, 2),
('Frank', 'Garcia', 9, 3),
('Grace', 'Lee', 10, 1),
('Hank', 'Moore', 11, 2),
('Ivy', 'Taylor', 12, 3);
