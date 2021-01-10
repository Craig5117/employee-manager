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
          "Add an Employee",
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

function empNamePrompt (order) {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: `What is the employee's ${order} name?`
      }
    ]).then(input => {
      return input.name
    });
}

function empRolePrompt (rolesList) {
    const roleChoices = rolesList.roleTitles;
    const answerKey = rolesList.rows;
    return inquirer 
      .prompt([
        {
          type: "list",
          name: "roleChoice",
          message: "What is the employee's role?",
          choices: [...roleChoices, "none"]
        }
      ]).then(choice => {
            if (choice.roleChoice === "none") {
              return choice.roleChoice = null;
            } 
            else {
            const match = answerKey.filter( TextRow => TextRow['title'] === choice.roleChoice )
            return match[0].id;
            }
         
       
      })
}

function empMngrPrompt (empList) {
    const mngrChoices = empList.employeeNames;
    const answerKey = empList.rows;
    return inquirer 
      .prompt([
        {
          type: "list",
          name: "mngrChoice",
          message: "Who is the employee's manager?",
          choices: [...mngrChoices, "none"]
        }
      ]).then(choice => {
        if (choice.mngrChoice === "none") {
          return choice.mngrChoice = null;
        } 
        else {
            const match = answerKey.filter( TextRow => TextRow['name'] === choice.mngrChoice )
            return match[0].id;
        }
          
      })
}

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

module.exports = {mainMenu, deptPrompt, rolePrompt, empNamePrompt, empRolePrompt, empMngrPrompt, quitReturn}