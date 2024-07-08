const inquirer = require('inquirer');
const { viewDepartments, addDepartment } = require('./department');
const { viewRoles, addRole } = require('./role');
const { viewEmployees, addEmployee, updateEmployeeRole } = require('./employee');
const pool = require('./connection');

const mainMenu = () => {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update an Employee Role',
            'Exit'
        ],
    }).then(answer => {
        switch (answer.action) {
            case 'View All Departments':
                viewDepartments().then(mainMenu);
                break;
            case 'View All Roles':
                viewRoles().then(mainMenu);
                break;
            case 'View All Employees':
                viewEmployees().then(mainMenu);
                break;
            case 'Add a Department':
                inquirer.prompt({
                    name: 'name',
                    type: 'input',
                    message: 'Enter the name of the department:',
                }).then(answer => {
                    addDepartment(answer.name).then(mainMenu);
                });
                break;
            case 'Add a Role':
                addRolePrompt();
                break;
            case 'Add an Employee':
                addEmployeePrompt();
                break;
            case 'Update an Employee Role':
                updateEmployeeRolePrompt();
                break;
            case 'Exit':
                pool.end();
                console.log('Goodbye!');
                break;
        }
    });
};

const addRolePrompt = async () => {
    try {
        const departmentsRes = await pool.query('SELECT * FROM departments');
        const departments = departmentsRes.rows.map(dept => ({ name: dept.name, value: dept.id }));

        const answers = await inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Enter the title of the role:',
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Enter the salary for the role:',
            },
            {
                name: 'department_id',
                type: 'list',
                message: 'Select the department for the role:',
                choices: departments,
            },
        ]);

        await addRole(answers.title, answers.salary, answers.department_id);
        mainMenu();
    } catch (err) {
        console.error('Error adding role:', err);
        mainMenu();
    }
};

const addEmployeePrompt = async () => {
    try {
        const rolesRes = await pool.query('SELECT * FROM roles');
        const employeesRes = await pool.query('SELECT * FROM employees');

        const roles = rolesRes.rows.map(role => ({ name: role.title, value: role.id }));
        const managers = employeesRes.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));
        managers.unshift({ name: 'None', value: null });

        const answers = await inquirer.prompt([
            {
                name: 'first_name',
                type: 'input',
                message: 'Enter the first name of the employee:',
            },
            {
                name: 'last_name',
                type: 'input',
                message: 'Enter the last name of the employee:',
            },
            {
                name: 'role_id',
                type: 'list',
                message: 'Select the role of the employee:',
                choices: roles,
            },
            {
                name: 'manager_id',
                type: 'list',
                message: 'Select the manager of the employee (optional):',
                choices: managers,
            },
        ]);

        await addEmployee(answers.first_name, answers.last_name, answers.role_id, answers.manager_id);
        mainMenu();
    } catch (err) {
        console.error('Error adding employee:', err);
        mainMenu();
    }
};

const updateEmployeeRolePrompt = async () => {
    try {
        const employeesRes = await pool.query('SELECT * FROM employees');
        const rolesRes = await pool.query('SELECT * FROM roles');

        const employees = employeesRes.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));
        const roles = rolesRes.rows.map(role => ({ name: role.title, value: role.id }));

        const answers = await inquirer.prompt([
            {
                name: 'employee_id',
                type: 'list',
                message: 'Select the employee to update:',
                choices: employees,
            },
            {
                name: 'role_id',
                type: 'list',
                message: 'Select the new role of the employee:',
                choices: roles,
            },
        ]);

        await updateEmployeeRole(answers.employee_id, answers.role_id);
        mainMenu();
    } catch (err) {
        console.error('Error updating employee role:', err);
        mainMenu();
    }
};

module.exports = { mainMenu };
