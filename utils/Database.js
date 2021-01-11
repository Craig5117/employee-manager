const mysql = require("mysql2");
const dotenv = require("dotenv").config();
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: process.env.NODE_ENV === "development" ? 3306 : "",
  user: process.env.user,
  password: process.env.pass,
  database: "employees_db",
});

const initiateConnection = function () {
  connection.promise().connect((err) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
  });
};

const getAll = (keyWord) => {
  let qryStmt = `SELECT * FROM ${keyWord}`;
  if (keyWord === "Employees") {
    qryStmt = "SELECT Employees.id AS ID, " + 
                      "Employees.first_name AS `First Name`, " + 
                      "Employees.last_name AS `Last Name`, " + 
                      "Roles.title AS Title, " + 
                      "Departments.dept_name AS Department, " + 
                      "Roles.salary AS Salary, " + 
                      "CONCAT(m.first_name, ' ', m.last_name) AS Manager " + 
                  "FROM Employees " +
                  "LEFT JOIN Roles ON Employees.role_id = Roles.id " + 
                  "LEFT JOIN Departments ON Roles.dept_id = Departments.id " +
                  "LEFT JOIN Employees m ON m.id = Employees.manager_id";
  }
  else if (keyWord === "Roles") {
      qryStmt = "SELECT Roles.title AS Title, Roles.id AS `Role ID`, Departments.dept_name AS Department, Roles.salary AS Salary FROM Roles " +
                    "LEFT JOIN Departments ON Roles.dept_id = Departments.id"
  }
  else if (keyWord === "Departments") {
      qryStmt = "SELECT Departments.dept_name AS Department, Departments.id AS `Dept ID` FROM Departments";
  }
  return connection
    .promise()
    .query(qryStmt)
    .then(([rows, fields]) => {
      console.table(keyWord, rows);
    });
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
  );
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
  );
};

const getNamesId = () => {
  let employeeNames = [];
  let qryStmt = `SELECT 
                        CONCAT(first_name, ' ', last_name) AS name, 
                        id 
                    FROM Employees`;

  return connection
    .promise()
    .query(qryStmt)
    .then(([rows, fields]) => {
      for (let i = 0; i < rows.length; ++i) {
        employeeNames = [...employeeNames, rows[i].name];
      }
      return (empList = { employeeNames, rows });
    });
};

const getRolesId = () => {
  let roleTitles = [];
  let qryStmt = `SELECT 
                        title, 
                        id 
                    FROM roles`;

  return connection
    .promise()
    .query(qryStmt)
    .then(([rows, fields]) => {
      for (let i = 0; i < rows.length; ++i) {
        roleTitles = [...roleTitles, rows[i].title];
      }
      return (rolesList = { roleTitles, rows });
    });
};

async function getNameRoleId() {
  try {
    const empList = await getNamesId();
    const rolesList = await getRolesId();
    return await new Promise((resolve, reject) => {
      let empChoices = { empList, rolesList };
      if (empChoices) {
        resolve(empChoices);
      } else {
        reject();
      }
    });
  } catch (error) {
    if (error) console.log(error);
  }
}

const addEmployee = (firstName, lastName, roleId, managerId) => {
  let qryStmt = `INSERT INTO Employees SET ?`;

  return connection.promise().query(
    qryStmt,
    {
      first_name: firstName,
      last_name: lastName,
      role_id: roleId,
      manager_id: managerId,
    },
    function (err, res) {
      if (err) throw err;
    }
  );
};

const updateEmp = (empId, valueId) => {
  let qryStmt = `Update Employees SET ? WHERE ?`;
  return connection.promise().query(
    qryStmt,
    [
      { ...valueId },
      {
        id: empId,
      },
    ],
    function (err, res) {
      if (err) throw err;
    }
  );
};

const quit = () => {
  connection.end();
};

module.exports = {
  initiateConnection,
  getAll,
  addDept,
  addRole,
  getNamesId,
  getRolesId,
  getNameRoleId,
  addEmployee,
  updateEmp,
  quit,
};
