const inquirer = require('inquirer');
const mySQL = require('mysql');
const {
    listenerCount
} = require('process');
require('console.table');

let connect = mySQL.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.password,
    database: 'employeeTracker_db',
    insecureAuth : true
});

connect.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connect.threadId + '\n');
    console.log('   ___  ___ ___  ____   _       ___   __ __    ___    ___ ');
    console.log('  \/  _]|   |   ||    \\ | |     \/   \\ |  |  |  \/  _]  \/  _]');
    console.log(' \/  [_ | _   _ ||  o  )| |    |     ||  |  | \/  [_  \/  [_ ');
    console.log('|    _]|  \\_\/  ||   _\/ | |___ |  O  ||  ~  ||    _]|    _]');
    console.log('|   [_ |   |   ||  |   |     ||     ||___, ||   [_ |   [_ ');
    console.log('|     ||   |   ||  |   |     ||     ||     ||     ||     |');
    console.log('|_____||___|___||__|   |_____| \\___\/ |____\/ |_____||_____|');
    console.log('                                                          ');
    console.log('     ___ ___   ____  ____    ____   ____    ___  ____     ');
    console.log('    |   |   | \/    ||    \\  \/    | \/    |  \/  _]|    \\    ');
    console.log('    | _   _ ||  o  ||  _  ||  o  ||   __| \/  [_ |  D  )   ');
    console.log('    |  \\_\/  ||     ||  |  ||     ||  |   |    _]|    \/    ');
    console.log('    |   |   ||  _  ||  |  ||  _  ||  |_. |   [_ |    \\    ');
    console.log('    |   |   ||  |  ||  |  ||  |  ||     ||     ||  .  \\   ');
    console.log('    |___|___||__|__||__|__||__|__||___,_||_____||__|\\_|   ');

    menuPrompts()
});

function menuPrompts() {
    inquirer.prompt({
        type: 'list',
        name: 'startMenu',
        message: 'What would you like to do?',
        choices: ['Add Employee', 'Add Role', 'Add Department', 'View Employee', 'View Employee by Manager', 'View Role', 'View Department', 'View Total Department Salary', 'Update Employee Role', 'Update Employee Manager', 'Delete Employee', 'Delete Role', 'Delete Department']
    }).then(answer => {
        switch (answer.startMenu) {
            case 'Add Employee':
                addEmployee();
            case 'Add Role':
                addRole();
            case 'Add Department':
                addDepartment();
            case 'View Employee':
                viewEmployee();
            case 'View Employee by Manager':
                viewEmpMan();
            case 'View Role':
                viewRole();
            case 'View Department':
                viewDepartment();
            case 'View Total Department Salary':
                viewTotSal();
            case 'Update Employee Role':
                updateEmp();
            case 'Update Employee Manager':
                updEmpMan();
            case 'Delete Employee':
                deleteEmp();
            case 'Delete Role':
                deleteRole();
            case 'Delete Department':
                deleteDept();
            case 'Complete':
                console.log('Have a great day!')
                connect.end();
        }
    })
};

async function addEmployee() {
        const role = await roleChoice();
        const manager = await managerChoice();
        inquirer.prompt([{
                    type: 'input',
                    name: 'firstName',
                    message: "Enter the Employee's First Name:",
                    default: 'First Name',
                    validate: function (answer) {
                        if (answer.length < 1) {
                            return clog("First Name is required!");
                        }
                        return true;
                    }
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: "Enter the Employee's Last Name:",
                    default: 'Last Name',
                    validate: function (answer) {
                        if (answer.length < 1) {
                            return clog("Last Name is required!");
                        }
                        return true;
                    }
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "Choose the Employee's Job Title:",
                    choices: role
                },
                {
                    type: 'confirm',
                    name: 'addManager',
                    message: 'Enter a Manager?',
                    default: true,
                },
                {
                    when: input => {
                        return input.addManager == true;
                    },
                    type: 'list',
                    name: 'manager',
                    message: "Choose the Employee's Manager:",
                    choices: manager
                }
            ])
            .then(function (answer) {
                connect.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);", [answer.firstName, answer.lastName, answer.role, answer.manager], function (err, res) {
                    if (err) throw err;
                    console.log('Add Successful');
                    menuPrompts();
                });
            });
    };

async function addRole() {
    let title = await viewTitle();
    console.table(title);
    let dept = await deptChoice();
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'Enter Title:',
            default: 'New Title',
            validate: function (answer) {
                if (answer.length < 1) {
                    return clog("Job Title is required!");
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter Salary:',
            default: '90000',
            validate: function (value) {
                var validate = !isNaN(parseFloat(value));
                return validate || 'Enter a valid number!';
            },
        },
        {
            type: 'list',
            name: 'dept',
            message: 'Choose Department:',
            choices: dept
        }
    ])
        .then(function (answer) {
            connect.query("INSERT INTO role (title, salary, department_id) VALUES (?,?,?);", [answer.role, answer.salary, answer.dept], function (err, res) {
                if (err) throw err;
                console.log('Add Successful');
                menuPrompts();
            });
        });
};


async function addDepartment() {
    let dept = await deptList();
    console.table(dept);
    inquirer.prompt([
        {
            type: 'input',
            name: 'dept',
            message: 'Enter a new Department:',
            default: 'New Department',
            validate: function (answer) {
                if (answer.length < 1) {
                    return console.log("Department is required!");
                }
                return true;
            }
        }
    ])
        .then(function (answer) {
            connect.query("INSERT INTO department (name) VALUES (?);", [answer.dept], function (err, res) {
                if (err) throw err;
                console.log('Add Successful!');
                menuPrompts();
            });
        });

};

async function viewEmployee() {
    connect.query("SELECT CONCAT(e.first_name,' ', e.last_name) AS employee, r.title, r.salary, d.name AS department, CONCAT(m.first_name,' ',m.last_name) AS manager, rm.title AS manger_title FROM employee e LEFT JOIN role r ON e.role_id=r.id LEFT JOIN department d ON d.id=r.department_id LEFT JOIN employee m ON e.manager_id=m.id LEFT JOIN role rm on m.role_id=rm.id ORDER BY e.first_name, e.last_name;", function (err, res) {
        if (err) throw err;
        console.table(res);
        menuPrompts();
    });
};

async function viewEmpMan() {
    const manager = await managerChoice();
    inquirer.prompt([
        {
            type: 'list',
            message: 'Select Employee:',
            name: 'manager',
            choices: manager
        }
    ])
        .then(function (answer) {
            connect.query("SELECT CONCAT(e.first_name,' ', e.last_name) AS employee, r.title, r.salary, CONCAT(m.first_name,' ',m.last_name) AS manager, rm.title AS manger_title FROM employee e LEFT JOIN role r ON e.role_id=r.id LEFT JOIN department d ON d.id=r.department_id LEFT JOIN employee m ON e.manager_id=m.id LEFT JOIN role rm on m.role_id=rm.id WHERE m.id=?;", [answer.manager], function (err, res) {
                if (err) throw err;
                console.table(res);
                menuPrompts();
            });
        });
};

async function viewRole() {
    connect.query("SELECT r.title AS Title, r.salary AS Salary, d.name AS Department FROM role r JOIN department d ON r.department_id=d.id ORDER BY d.name, r.title, r.salary DESC;", function (err, res) {
        if (err) throw err;
        console.table(res);
        menuPrompts();
    });
};

async function viewDepartment() {
    connect.query("SELECT name AS Department FROM department ORDER BY id;", function (err, res) {
        if (err) throw err;
        console.table(res);
        menuPrompts();
    });
};

async function viewTotSal() {
    connect.query("SELECT d.name AS Department, SUM(salary) AS Total_Salary FROM employee e LEFT JOIN role r ON e.role_id=r.id LEFT JOIN department d ON d.id=r.department_id GROUP BY d.name ORDER BY d.id;", function (err, res) {
        if (err) throw err;
        console.table(res);
        menuPrompts();
    });
};

async function updateEmp() {
    const employee = await empChoice();
    const role = await roleChoice();
    inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Choose Employee:',
            choices: employee
        },
        {
            type: 'list',
            name: 'role',
            message: "Choose New Job Title:",
            choices: role
        }
    ]).then(function (answer) {
        connect.query("UPDATE employee SET role_id=? WHERE id=?;", [answer.role, answer.employee], function (err, res) {
            if (err) throw err;
            console.log('Update Successful!');
            menuPrompts();
        });
    });
};

async function updEmpMan() {
    const employee = await empChoice();
    const manager = await managerChoice();
    inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Choose Employee:',
            choices: employee
        },
        {
            type: 'list',
            name: 'manager',
            message: "Choose New Manager:",
            choices: manager
        }
    ]).then(function (answer) {
        connect.query("UPDATE employee SET manager_id=? WHERE id=?;", [ans.manager, answer.employee], function (err, res) {
            if (err) throw err;
            console.log('Update Successful!');
            menuPrompts();
        });
    });
};

async function deleteEmp() {
    const employee = await empChoice();
    inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Choose Employee:',
            choices: employee
        }
    ]).then(function (answer) {
        connect.query("DELETE FROM employee WHERE id=?;", [answer.employee], function (err, res) {
            if (err) throw err;
            console.log('Delete Successful!');
            menuPrompts();
        });
    });
};

async function deleteRole() {
    const employee = await empChoice();
    const role = await roleChoice();
    inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Choose Employee',
            choices: employee
        },
        {
            type: 'list',
            name: 'role',
            message: 'Choose role',
            choices: role
        }
    ]).then(function (answer) {
        connect.query("DELETE FROM employee SET role_id=? WHERE id=?;", [answer.employee, answer.role], function (err, res) {
            if (err) throw err;
            console.log('Delete Successful!');
            menuPrompts();
        });
    });
};

// function deleteDept() {

// };

function deptChoice() {
    return new Promise((res, rej) => {
        connect.query("SELECT name, id AS value FROM department ORDER BY name;", (err, results, fields) => {
            if (err) throw err;
            res(results);
        });
    });
};

function deptList() {
    return new Promise((res, rej) => {
        connect.query("SELECT name AS Department FROM department ORDER BY id;", (err, results, fields) => {
            if (err) throw err;
            res(results);
        });
    });
};

function roleChoice() {
    return new Promise((res, rej) => {
        connect.query("SELECT CONCAT(r.title,', ',d.name) AS name, r.id AS value FROM role r JOIN department d ON r.department_id=d.id ORDER by d.name, r.title;", (err, results, fields) => {
            if (err) throw err;
            res(results);
        });
    });
};

function managerChoice() {
    return new Promise((res, rej) => {
        connect.query("SELECT DISTINCT CONCAT(m.first_name,' ', m.last_name, ', ', r.title) AS name, m.id AS value FROM employee e JOIN employee m ON e.manager_id=m.id JOIN role r ON m.role_id=r.id ORDER BY m.last_name;", function (err, results, fields) {
            if (err) throw err;
            res(results);
        });
    });
};

function viewTitle() {
    return new Promise((res, rej) => {
        connect.query("SELECT r.title AS Title, r.salary AS Salary, d.name AS Department FROM role r JOIN department d ON r.department_id=d.id ORDER BY r.title;", function (err, results) {
            if (err) throw err;
            res(results);
        });
    });
};

function empChoice() {
    return new Promise((res, rej) => {
        connect.query("SELECT CONCAT(e.first_name,' ', e.last_name, ', ', r.title) AS name, e.id AS value FROM employee e JOIN role r on e.role_id=r.id ORDER BY e.first_name, e.last_name;", function (err, results) {
            if (err) throw err;
            res(results);
        });
    });
};