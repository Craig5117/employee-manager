const mysql = require("mysql2");
const dotenv = require("dotenv").config();
const cTable = require("console.table");

// const start = function() {
//     menu.mainMenu()
//     .then((mainSelect) => {
//         let statementArr = mainSelect.choice.split(" ");
//         let keyWord = statementArr[2];
//         switch (mainSelect.choice) {
//         case "Quit":
//             quit();
//             break;
//         case "Add a Department":
//             menu.deptPrompt()
//             .then((input) => {
//                 addDept(input.deptName);
//             });
//             break;
//         case "Add a Role":
//             menu.rolePrompt()
//                 .then((input) => {
//                 addRole(input.roleTitle, input.roleSalary, input.roleDept);
//             });
//             break;
//         default:
//             getAll(keyWord);
//             break;
//         }
    
//     });
// };

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.user,
    password: process.env.pass,
    database: "employees_db",
  });
  
  const initiateConnection = function () {


    connection.promise().connect((err) => {
      if (err) throw err;
      console.log("connected as id " + connection.threadId + "\n");
        
    });
    
    }
  
  
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
  
  
   return connection.promise().query(qryStmt)
            .then( ([rows, fields]) => {
                console.table(keyWord, rows);
            })
  };
  
  const addDept = (deptName) => {
    let qryStmt = `INSERT INTO Departments SET ?`;
  
    return connection.promise().query(
              qryStmt,
              {
              dept_name: deptName,
              },
              function (err, res) {
                  if (err) throw err; 
              }
          )
  };
  
  
  const addRole = (roleTitle, roleSalary, roleDept) => {
      let qryStmt = `INSERT INTO Roles SET ?`;
  
      return connection.promise().query(
          qryStmt,
          {
              title: roleTitle, 
              salary: roleSalary, 
              dept_id: roleDept,
          },
          function (err, res) {
              if (err) throw err; 
          }
      )
        
  };
  
  const quit = () => {
    connection.end();
  };

module.exports = {initiateConnection, getAll, addDept, addRole, quit}