const dotenv = require("dotenv").config();
const cTable = require("console.table");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const db = require("./utils/Database");
const menu = require("./utils/Menu");

const start = function () {
  menu.mainMenu().then((mainSelect) => {
    let statementArr = mainSelect.choice.split(" ");
    let keyWord = statementArr[2];
    switch (mainSelect.choice) {
      case "Quit":
        db.quit();
        break;
      case "Add a Department":
        menu.deptPrompt().then((input) => {
          db.addDept(input.deptName)
            .then((res) => {
              console.log(res[0].affectedRows + " department added!\n");
              returnSwitch();
            })
            .catch(function (e) {
              console.error(e.message);
              returnSwitch();
            });
        });
        break;
      case "Add a Role":
        menu.rolePrompt().then((input) => {
          db.addRole(input.roleTitle, input.roleSalary, input.roleDept)
            .then((res) => {
              console.log(res[0].affectedRows + " role added!\n");
              returnSwitch();
            })
            .catch(function (e) {
              console.error(e.message);
              returnSwitch();
            });
        });
        break;
      case "Add an Employee":
        db.getNameRoleId().then((empChoices) => {
          (async function buildEmp() {
            try {
              const firstName = await menu.empNamePrompt("first");
              const lastName = await menu.empNamePrompt("last");
              const roleId = await menu.empRolePrompt(empChoices.rolesList);
              const managerId = await menu.empMngrPrompt(empChoices.empList);
              await db.addEmployee(firstName, lastName, roleId, managerId);
              await console.log("Employee added.");
              await returnSwitch();
            } catch (error) {
              if (error) console.log(error);
            }
          })();
        });
        break;
      case "Update an Employee's Role":
            db.getNameRoleId().then(empChoices => {
                (async function () {
                try {
                    const empNameId = await menu.empChoicePrompt(empChoices.empList);
                    const newRoleId = await menu.newRolePrompt(empChoices.rolesList, empNameId.empName);
                    await db.updateEmpRole(empNameId.id, newRoleId.roleId);
                    await console.log(`The role of ${empNameId.empName} has been changed to ${newRoleId.roleTitle}.`)
                    await returnSwitch();
                }
                catch (error) {
                    if (error) console.log(error);
                }
                })();   
            });
        break;
      default:
        db.getAll(keyWord)
          .then(() => returnSwitch())
          .catch(function (e) {
            console.error(e.message);
            returnSwitch();
          });
        break;
    }
  });
};

const returnSwitch = () => {
  menu.quitReturn().then((returnSelect) => {
    switch (returnSelect.choice) {
      case "Main Menu":
        start();
        break;
      case "Quit":
        db.quit();
        break;
    }
  });
};

(async function main() {
  try {
    await db.initiateConnection();
    await start();
  } catch (error) {
    if (error) console.log(error);
  }
})();
