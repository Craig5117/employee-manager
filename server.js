const dotenv = require('dotenv').config();
const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const logo = `
███████╗███╗   ███╗██████╗ ██╗      ██████╗ ██╗   ██╗███████╗███████╗    
██╔════╝████╗ ████║██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝██╔════╝██╔════╝    
█████╗  ██╔████╔██║██████╔╝██║     ██║   ██║ ╚████╔╝ █████╗  █████╗      
██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██║   ██║  ╚██╔╝  ██╔══╝  ██╔══╝      
███████╗██║ ╚═╝ ██║██║     ███████╗╚██████╔╝   ██║   ███████╗███████╗    
╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝   ╚══════╝╚══════╝    
                                                                         
███╗   ███╗ █████╗ ███╗   ██╗ █████╗  ██████╗ ███████╗██████╗            
████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔════╝ ██╔════╝██╔══██╗           
██╔████╔██║███████║██╔██╗ ██║███████║██║  ███╗█████╗  ██████╔╝           
██║╚██╔╝██║██╔══██║██║╚██╗██║██╔══██║██║   ██║██╔══╝  ██╔══██╗           
██║ ╚═╝ ██║██║  ██║██║ ╚████║██║  ██║╚██████╔╝███████╗██║  ██║           
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝           
`

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.user,
    password: process.env.pass,
    database: 'employees_db'
});


connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId + '\n');
    mainMenu();
});


const getAll = (keyWord) => {
    let qryStmt = `SELECT * FROM ${keyWord}`;
        if (keyWord === 'Employees') {
            qryStmt = `SELECT Employees.id, Employees.first_name, Employees.last_name, Roles.title, Departments.dept_name AS department, Roles.salary FROM Employees INNER JOIN Roles ON Employees.role_id = Roles.id LEFT JOIN Departments ON Roles.dept_id = Departments.id`;
        } 

    const query = connection.query(qryStmt,
        function(err, res) {
            if (err) throw err;
            console.table(keyWord, res);
            quitReturn();
        }
    );
};

const addDept = (deptName) => {
    let qryStmt = `INSERT INTO Departments SET ?`;
                    
    const query = connection.query(qryStmt,
        {
            dept_name: deptName
        },
        function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + ' department added!\n');
            quitReturn();
        }
    );
}

function mainMenu() {
    console.log(logo);
    inquirer.prompt(
        [
            {
              type: "list",
              name: "choice",
              message: "What would you like to do?",
              choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Quit"],
            },
        ]
    ).then((mainSelect) => {
        let statementArr = mainSelect.choice.split(' ');
        let keyWord = statementArr[2];
        switch (mainSelect.choice) {
            case "Quit":
                quit();
                break;
            case "Add a Department":
                inquirer.prompt(
                    [
                        {
                            type: "input",
                            name: "deptName",
                            message: `What is the department name? (Required)`,
                            validate: deptName => {
                                if (deptName) {
                                    return true;
                                }
                                else {
                                console.log(`
***** You must enter a department name. *****`);
                                return false;
                                }
                            }
                        }
                    ]
                )
                .then((input) => {
                    addDept(input.deptName);
                });
                break;
                
            default:
                getAll(keyWord);
                break;
        }
    }) 
};

const quit = () => {
    connection.end();
}

const quitReturn = () => {
    inquirer.prompt(
        [
            {
              type: "list",
              name: "choice",
              message: "What would you like to do?",
              choices: ["Main Menu", "Quit"],
            },
        ]
    ).then((returnSelect) => {
        switch (returnSelect.choice) {
            case "Main Menu":
                mainMenu();
                break;
            case "Quit":
                quit();
                break;
        }
    }) 
}


// const getAllEmployees = () => {
//     connection.promise().query(`SELECT * FROM Employees`)
//         .then( ([rows, fields]) => {
//             console.table('Employees', rows);
//         })
//         .catch(console.log)
//         .then(quitReturn());
// }

// con.promise().query("SELECT 1")
//   .then( ([rows,fields]) => {
//     console.log(rows);
//   })
//   .catch(console.log)
//   .then( () => con.end());

