const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const util = require('util');


const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'company_db'
    },
    console.log('Successfully connected!')
  );
  
  db.connect(function (err){
      if (err) throw (err);
      runPrompt();
  })

  db.query = util.promisify(db.query);

const runPrompt = async () => {
    let selection = await inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add A Department',
            'Add A Role',
            'Add An Employee',
            'Update An Employee Role',
            'Exit'
        ]

    });
    
    switch(selection.choice) {
        case 'View All Departments':
            viewAllDept();
            break;
        case 'View All Roles':
            viewAllRoles();
            break;
        case 'View All Employees':
            viewAllEmp();
            break;
        case 'Add A Department':
            addDept();
            break;
        case 'Add A Role':
            addRole();
            break;
        case 'Add An Employee':
            addEmp();
            break;
        case 'Update An Employee Role':
            updateEmpRole();
            break;
        case 'Exit':
            console.log('Bye!')
            db.end();
    }; 
};

viewAllDept = async () => {
    console.log("Now Viewing All Departments");
    const sqlPrompt = "SELECT * FROM department";
    db.query(sqlPrompt, (err, res) => {
        if (err) return console.log(err);
        console.table(res);
        runPrompt();
    })
};

viewAllRoles = async () => {
    console.log("Now Viewing All Roles");
    const sqlPrompt = "SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id= department.id";
    db.query(sqlPrompt, (err, res) => {
        if (err) return console.log(err);
        console.table(res);
        runPrompt();
    })
};

viewAllEmp = async () => {
    console.log("Now Viewing All Employees");
    const sqlPrompt = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, CONCAT(manager.first_name, ' ' , manager.last_name) AS 'manager' FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id";
    db.query(sqlPrompt, (err, res) => {
        if (err) return console.log(err);
        console.table(res);
        runPrompt();
    })
};

addDept = async () => {
    const newDept = inquirer.prompt([
        {
        type: 'input',
        name: 'name',
        message: 'What is the name of the new Department?',
        validate: input => {
            if (input) {
                return true;
            } else {
                console.log ('Error! Department name cannot be empty');
                return false;
            }
        }
        }
    ])
    .then(newDept => {
    const sqlPrompt = 'INSERT INTO department (name) VALUES (?)';
    db.query(sqlPrompt, newDept.name, (err, res) => {
        if (err) return console.log(err);
        console.log(newDept.name + ' has been successfully added!');
        runPrompt();
    })
    })
};

addRole = async () => {
    const newRole = inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of the new role?',
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log('Error! Role title cannot be empty!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the yearly salary for this new role?',
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log('Error! Salary cannot be empty!');
                    return false;
                }
            }
        }
    ])
    .then(newRole => {
        const newRoleData = [newRole.title, newRole.salary];
        const deptView = db.query('SELECT id, name FROM department', (err, res) => {
            if (err) return (err); 
            const deptChoices = res.map(({ id, name }) => ({ name: name, value: id }));
        const roleDeptChoice = inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'Which department is this new role in?',
                choices: deptChoices
            }
        ])
        
        .then(roleDeptChoice => {
        newRoleData.push(roleDeptChoice.choice);
        const sqlPrompt = 'INSERT INTO role (title, salary, department_id) VALUES (?,?,?)';
        db.query(sqlPrompt, newRoleData, (err, res) => {
            if (err) return console.log(err);
            console.log(newRole.title + ' has been successfully added');
            runPrompt();
        })
    })
    });
    })
};

addEmp = async () => {
    const newEmployee = inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Please enter their first name',
            validate: input => {
                if (input) {
                    return true;
                } else {
                console.log('Error! Field cannot be empty');
                return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Please enter their last name',
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log('Error! Field cannot be empty');
                    return false;
                }
            }
        }
    ])
    .then(newEmployee => {
        const newEmployeeData = [newEmployee.firstName, newEmployee.lastName];
        const sqlPrompt = 'SELECT id, title FROM role';
        db.query(sqlPrompt, (err, res) => {
            if (err) return (err);
            const newEmployeeRole = res.map(({ id, title }) => ({ name: title, value: id }));

            const roleChoice = inquirer.prompt([
                {
                    type: 'list',
                    name: 'choice',
                    message: 'Please choose a role for the new employee',
                    choices: newEmployeeRole
                } 
            ])
            .then(roleChoice => {
                newEmployeeData.push(roleChoice.choice);
                const sqlPrompt = 'SELECT id, first_name, last_name FROM employee';
                db.query(sqlPrompt, (err, res) => {
                    if (err) return console.log(err);
                    const nullArray = ['NULL'];
                    const managerList = res.map(({ id, first_name, last_name }) => ({ name: first_name + ' ' + last_name, value: id}));
                
                    const managerChoice = inquirer.prompt([
                        {
                            type: 'confirm',
                            name: 'confirmation',
                            message: 'Will this employee have a manager?'
                        },
                        {
                            type: 'list',
                            name: 'choice',
                            message: 'Who is their manager?',
                            choices: [...managerList, ...nullArray],
                            when: (answers) => answers.confirmation === true,
                        }
                    
                    ])
                    
                    .then(managerChoice => {
                        newEmployeeData.push(managerChoice.choice);
                        const sqlPrompt = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)';
                        db.query(sqlPrompt, newEmployeeData, (err, res) => {
                            if (err) return console.log (err);
                            console.log(newEmployee.firstName + ' ' + newEmployee.lastName + ' has been added!');
                            runPrompt();
                })
            });

        })
    })
    
})
    })
}

updateEmpRole = async () => {
    const sqlPrompt = 'SELECT id, first_name, last_name FROM employee';
    db.query(sqlPrompt, (err, res) => {
        if (err) return console.log(err);
        const employeeList = res.map(({ id, first_name, last_name }) => ({ name: first_name + ' ' + last_name, value: id }));

        const employeeChoice = inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'Please choose an employee to update',
                choices: employeeList
            }
        ])
        .then(employeeChoice => {
            // console.log(employeeChoice.choice);
            const updateData = [employeeChoice.choice];
            const sqlPrompt = 'SELECT id, title FROM role';
            db.query(sqlPrompt, (err, res) => {
                if (err) return console.log(err);
                const roleList = res.map(({ id, title }) => ({ name: title, value: id }));

                const newRoleChoice = inquirer.prompt([
                    {
                        type: 'list',
                        name: 'choice',
                        message: 'Select a new role',
                        choices: roleList
                    }
                ])
                .then(newRoleChoice => {
                    // console.log(newRoleChoice.choice);
                    updateData.unshift(newRoleChoice.choice);
                    const sqlPrompt = 'UPDATE employee SET role_id = ? WHERE id = ?';
                    db.query(sqlPrompt, updateData, (err, res) => {
                        if (err) return console.log(err);
                        console.log('Successfully updated!');
                        runPrompt();
                    })
                })
            })
        })
    })
}