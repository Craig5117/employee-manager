const dotenv = require("dotenv").config();
const cTable = require("console.table");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const db = require('./utils/Database')
const menu = require('./utils/Menu')

// async function start (){
//     try {
//        let mainSelect = await menu.mainMenu;
//        await menuSwitch (mainSelect) {
//         let statementArr = mainSelect.choice.split(" ");
//         let keyWord = statementArr[2];
//         switch (mainSelect.choice) {
//         case "Quit":
//              await db.quit();
//             break;
//         case "Add a Department":
//             const input = await menu.deptPrompt();
//             const res = await db.addDept(input.deptName)
//             await console.log(res[0].affectedRows + " department added!\n");
//             await returnSwitch();
//                 }).catch(function(e) {
//                     console.error(e.message)
//                     returnSwitch();
//                 });
//             });
//             break;
//         case "Add a Role":
//             menu.rolePrompt()
//             .then((input) => {
//                 db.addRole(input.roleTitle, input.roleSalary, input.roleDept)
//                 .then( (res) => {
//                     console.log(res[0].affectedRows + " role added!\n");
//                     returnSwitch();
//                 }).catch(function(e) {
//                     console.error(e.message)
//                     returnSwitch();
//                 });
//             });
//             break;
//         default:
//             db.getAll(keyWord)
//             .then( () => returnSwitch())
//             .catch(function(e) {
//                 console.error(e.message)
//                 returnSwitch();
//             });
//             break;
//         }

//     }    
//     }
//     catch {}
// }
const start = function() {
    menu.mainMenu()
    .then((mainSelect) => {
        let statementArr = mainSelect.choice.split(" ");
        let keyWord = statementArr[2];
        switch (mainSelect.choice) {
        case "Quit":
            db.quit();
            break;
        case "Add a Department":
            menu.deptPrompt()
            .then((input) => {
                db.addDept(input.deptName)
                .then( (res) => {
                    console.log(res[0].affectedRows + " department added!\n");
                    returnSwitch();
                }).catch(function(e) {
                    console.error(e.message)
                    returnSwitch();
                });
            });
            break;
        case "Add a Role":
            menu.rolePrompt()
            .then((input) => {
                db.addRole(input.roleTitle, input.roleSalary, input.roleDept)
                .then( (res) => {
                    console.log(res[0].affectedRows + " role added!\n");
                    returnSwitch();
                }).catch(function(e) {
                    console.error(e.message)
                    returnSwitch();
                });
            });
            break;
        default:
            db.getAll(keyWord)
            .then( () => returnSwitch())
            .catch(function(e) {
                console.error(e.message)
                returnSwitch();
            });
            break;
        }
    
    });
}

const returnSwitch = () => {
  menu.quitReturn()
    .then((returnSelect) => {
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
       if (error) console.log(error) 
    }
})();


    

