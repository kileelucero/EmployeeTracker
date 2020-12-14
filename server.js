const inquirer = require('inquirer');
const mySQL = require('mysql');
const consoleTable = require('console.table');

let connection = mySQL.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employeeTracker_db',
    insecureAuth : true
});

connection.connect(function (err) {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId + '\n');
    menuPrompts()
});

function menuPrompts() {
    inquirer.prompt({
        type: 'list',
        name: 'startMenu',
        message: 'What would you like to do?',
        choices: ['Add Employee', 'Add Role', 'Add Department', 'View Employee', 'View Role', 'View Department', 'Update Employee Role', 'Complete']
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
            case 'View Role':
                viewRole();
            case 'View Department':
                viewDepartment();
            case 'Update Employee Role':
                updateEmp();
            case 'Complete':
                complete();
        }
    })
};

function addEmployee() {
    var roleChoice = [];
    connection.query("SELECT title FROM role", function (err, roleChosen) {
        if (err) throw err;
        for (let i = 0; i < roleChosen.length; i++) {
            roleChoice.push(roleChosen[i].title);
        };
        var managerChoice = [];
        connection.query("SELECT last_name FROM employee", function (err, managerChosen) {
            if (err) throw err;
            for (let i = 0; i < managerChosen.length; i++) {
                managerChoice.push(managerChosen[i].last_name);
            };
            inquirer.prompt([{
                    name: "empFirst",
                    type: "input",
                    message: "First name: "
                },
                {
                    name: "empLast",
                    type: "input",
                    message: "Last name: "
                },
                {
                    name: "empRole",
                    type: "list",
                    message: "Role: ",
                    choices: roleChoice
                },
                {
                    name: "empManager",
                    type: "list",
                    message: "Manager: ",
                    choices: managerChoice
                }

            ]).then(function (res) {
                connection.query(`INSERT INTO employee (first_name, last_name, role, manager) VALUES ('${res.empFirst}', '${res.empLast}', '${res.empRole}', '${res.empManager}')`, function (err, res) {
                    if (err) throw err;
                    console.log("Employee Added");
                    menuPrompts();
                });
            });
        });
    });
};

function addRole() {
    var departmentChoice = [];
    connection.query("SELECT * FROM department", function (err, departmentChosen) {
        if (err) throw err;
        for (let i = 0; i < departmentChosen.length; i++) {
            departmentChoice.push(departmentChosen[i].name);
        };
    });
    inquirer.prompt([
        {
            name: "roleTitle",
            type: "input",
            message: "Title: ",
        },
        {
            name: "rolePay",
            type: "input",
            message: "Salary: "
        },
        {
            name: "inDepartment",
            type: "list",
            message: "Department: ",
            choices: departmentChoice
        }
    ]).then(function (res) {
        connection.query(`INSERT INTO role (title, salary, department) VALUES ('${res.roleTitle}', '${res.rolePay}', '${res.inDepartment}')`, function (err, res) {
            if (err) throw err;
            console.log("Role Added");
            menuPrompts();
        });
    });
};

function addDepartment() {
    inquirer.prompt({
        name: "department",
        type: "input",
        message: "Department name: "
    }).then(function (res) {
        connection.query(`INSERT INTO department (name) VALUES ('${res.department}')`, function (err, res) {
            if (err) throw err;
            console.log("Department Added");
            menuPrompts();
        });
    });
};

function viewEmployee() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        const table = consoleTable.getTable(res);
        console.log(table);
        menuPrompts();
    });
};

function viewRole() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        const table = consoleTable.getTable(res);
        console.log(table);
        menuPrompts();
    });
};

function viewDepartment() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        const table = consoleTable.getTable(res);
        console.log(table);
        menuPrompts();
    });
};

function updateEmp() {
    var updateEmployeeRole = [];
    connection.query("SELECT first_name FROM employee", function (err, newRole) {
        if (err) throw err;
        for (let i = 0; i < newRole.length; i++) {
            updateEmployeeRole.push(newRole[i].last_name);
        };
        var updatedRole = [];
        connection.query("SELECT title FROM role", function (err, newRole) {
            if (err) throw err;
            for (let i = 0; i < newRole.length; i++) {
                updatedRole.push(newRole[i].title);
            };
            inquirer.prompt([{
                    name: "employeeName",
                    type: "list",
                    message: "Employee: ",
                    choices: updateEmployeeRole
                },
                {
                    name: "updatedRole",
                    type: "list",
                    message: "New role: ",
                    choices: updatedRole
                }
            ]).then(function (res) {
                connection.query(`UPDATE employee SET role = ('${res.updatedRole}')`, function (err, res) {
                    if (err) throw err;
                    console.log("Employee list updated");
                    menuPrompts();
                });
            });
        });
    });
};

function complete() {
    inquirer.prompt({
        name: 'complete',
        type: 'confirm',
        message: 'Are you sure?'
    }).then(function (res) {
        if (res.complete === true) {
            connection.end();
        } else {
            menuPrompts();
        };
    });
};