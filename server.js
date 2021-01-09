const dotenv = require("dotenv").config();
const cTable = require("console.table");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const db = require('./utils/Database')
const menu = require('./utils/Menu')

const start = function() {
    menu.mainMenu()
    .then((mainSelect) => {
        let statementArr = mainSelect.choice.split(" ");
        let keyWord = statementArr[2];
        switch (mainSelect.choice) {
        case "Quit":
            quit();
            break;
        case "Add a Department":
            menu.deptPrompt()
            .then((input) => {
                addDept(input.deptName);
            });
            break;
            case "Add a Role":
            menu.rolePrompt()
                .then((input) => {
                addRole(input.roleTitle, input.roleSalary, input.roleDept);
            });
            break;

        default:
            getAll(keyWord);
            break;
        }
    
    });
}

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: process.env.user,
  password: process.env.pass,
  database: "employees_db",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
    start();
});


const getAll = (keyWord) => {
  let qryStmt = `SELECT * FROM ${keyWord}`;
  if (keyWord === "Employees") {
    qryStmt = `SELECT Employees.id, 
                    Employees.first_name, 
                    Employees.last_name, 
                    Roles.title, 
                    Departments.dept_name AS department, 
                    Roles.salary, 
                    CONCAT(m.first_name, ' ', m.last_name) AS manager 
                FROM Employees 
                INNER JOIN Roles ON Employees.role_id = Roles.id 
                LEFT JOIN Departments ON Roles.dept_id = Departments.id
                LEFT JOIN Employees m ON m.id = Employees.manager_id`;
  }


  connection.promise().query(`SELECT * FROM Employees`)
          .then( ([rows, fields]) => {
              console.table('Employees', rows);
          })
          .catch(console.log)
          .then( () => quitReturn());
//   const query = connection.query(qryStmt, function (err, res) {
//     if (err) throw err;
//     console.table(keyWord, res);
//     quitReturn();
//   });
};

// const getAllEmployees = () => {
//     connection.promise().query(`SELECT * FROM Employees`)
//         .then( ([rows, fields]) => {
//             console.table('Employees', rows);
//         })
//         .catch(console.log)
//         .then( () => connection.end());
// }

const addDept = (deptName) => {
  let qryStmt = `INSERT INTO Departments SET ?`;

  const query = connection.query(
    qryStmt,
    {
      dept_name: deptName,
    },
    function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " department added!\n");
      quitReturn();
    }
  );
};

const addRole = (roleTitle, roleSalary, roleDept) => {
    let qryStmt = `INSERT INTO Roles SET ?`;

    const query = connection.query(
        qryStmt,
        {
            title: roleTitle, 
            salary: roleSalary, 
            dept_id: roleDept,
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " role added!\n");
            quitReturn();
        }
    );
};

const quit = () => {
  connection.end();
};

const quitReturn = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: ["Main Menu", "Quit"],
      },
    ])
    .then((returnSelect) => {
      switch (returnSelect.choice) {
        case "Main Menu":
          start();
          break;
        case "Quit":
          quit();
          break;
      }
    });
};



// con.promise().query("SELECT 1")
//   .then( ([rows,fields]) => {
//     console.log(rows);
//   })
//   .catch(console.log)
//   .then( () => con.end());
