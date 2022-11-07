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
        case 'Update An Epmloyee Role':
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

