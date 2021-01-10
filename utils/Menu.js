const inquirer = require("inquirer");
const validation = require('./Validation')
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
`;

function mainMenu () {
console.log(logo);
return inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Potential Managers",
          "Quit",
        ],
      },
    ]);
};

function deptPrompt () {
return inquirer
  .prompt([
    {
      type: "input",
      name: "deptName",
      message: `What is the department name? (Required)`,
      validate: (deptName) => {
        if (deptName) {
          return true;
        } else {
          console.log(`\n***** You must enter a department name. *****`);
          return false;
        }
      },
    },
  ]);
};

function rolePrompt () {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "roleTitle",
        message: `What is the role name? (Required)`,
        validate: (roleTitle) => {
          if (roleTitle) {
            return true;
          } else {
            console.log(`\n***** You must enter a role name. *****`);
            return false;
          }
        },
      },
      {
        type: "number",
        name: "roleSalary",
        message: `What is the salary for this role? (Required)`,
        ...validation.reqNumberInputValidation
      },
      {
          type: "number",
          name: "roleDept",
          message: "What is the deptartment id for this role?",
          ...validation.optNumberInputValidation
      }

    ]);
};

function quitReturn () {
 return inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: ["Main Menu", "Quit"],
      },
    ]);
};

module.exports = {mainMenu, deptPrompt, rolePrompt, quitReturn}