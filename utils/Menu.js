const inquirer = require("inquirer");
const validation = require("./Validation");
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

function mainMenu() {
  console.clear();
  console.log(logo);
  return inquirer.prompt([
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
        "Update an Employee's Role",
        "Update an Employee's Manager",
        "Quit",
      ],
    },
  ]);
}

function deptPrompt() {
  return inquirer.prompt([
    {
      type: "input",
      name: "deptName",
      message: `What is the department name? (Required)`,
      validate: (deptName) => {
        if (deptName) {
          return true;
        } else {
          console.log(`
          ***** You must enter a department name. *****
          `);
          return false;
        }
      },
    },
  ]);
}

function rolePrompt() {
  return inquirer.prompt([
    {
      type: "input",
      name: "roleTitle",
      message: `What is the role name? (Required)`,
      validate: (roleTitle) => {
        if (roleTitle) {
          return true;
        } else {
          console.log(`
          ***** You must enter a role name. *****
          `);
          return false;
        }
      },
    },
    {
      type: "number",
      name: "roleSalary",
      message: `What is the salary for this role? (Required)`,
      ...validation.reqNumberInputValidation,
    },
    {
      type: "number",
      name: "roleDept",
      message: "What is the deptartment id for this role?",
      ...validation.optNumberInputValidation,
    },
  ]);
}

function empNamePrompt(order) {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: `What is the employee's ${order} name?`,
      },
    ])
    .then((input) => {
      return input.name;
    });
}

function empRolePrompt(rolesList) {
  const roleChoices = rolesList.roleTitles;
  const answerKey = rolesList.rows;
  return inquirer
    .prompt([
      {
        type: "list",
        name: "roleChoice",
        message: "What is the employee's role?",
        choices: [...roleChoices, "none"],
      },
    ])
    .then((choice) => {
      if (choice.roleChoice === "none") {
        return (choice.roleChoice = null);
      } else {
        const match = answerKey.filter(
          (TextRow) => TextRow["title"] === choice.roleChoice
        );
        return match[0].id;
      }
    });
}

function empMngrPrompt(empList) {
  const mngrChoices = empList.employeeNames;
  const answerKey = empList.rows;
  return inquirer
    .prompt([
      {
        type: "list",
        name: "mngrChoice",
        message: "Who is the employee's manager?",
        choices: [...mngrChoices, "none"],
      },
    ])
    .then((choice) => {
      const mngrName = choice.mngrChoice;
      if (choice.mngrChoice === "none") {
        const mngrId = null;
        return { mngrName, mngrId };
      } else {
        const match = answerKey.filter(
          (TextRow) => TextRow["name"] === choice.mngrChoice
        );
        const mngrId = match[0].id;
        return { mngrName, mngrId };
      }
    });
}

function empChoicePrompt(empList) {
  const empChoices = empList.employeeNames;
  const answerKey = empList.rows;
  return inquirer
    .prompt([
      {
        type: "list",
        name: "empChoice",
        message: "Choose an Employee?",
        choices: [...empChoices],
      },
    ])
    .then((choice) => {
      const match = answerKey.filter(
        (TextRow) => TextRow["name"] === choice.empChoice
      );
      const id = match[0].id;
      const empName = choice.empChoice;
      return { empName, id };
    });
}

function newRolePrompt(rolesList, name) {
  const roleChoices = rolesList.roleTitles;
  const answerKey = rolesList.rows;
  return inquirer
    .prompt([
      {
        type: "list",
        name: "roleChoice",
        message: `What role do you want to assign to ${name}?`,
        choices: [...roleChoices, "none"],
      },
    ])
    .then((choice) => {
      const roleTitle = choice.roleChoice;
      if (choice.roleChoice === "none") {
        const roleId = null;
        return { roleTitle, roleId };
      } else {
        const match = answerKey.filter(
          (TextRow) => TextRow["title"] === choice.roleChoice
        );
        const roleId = match[0].id;
        return { roleTitle, roleId };
      }
    });
}

function quitReturn() {
  return inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: ["Main Menu", "Quit"],
    },
  ]);
}

module.exports = {
  mainMenu,
  deptPrompt,
  rolePrompt,
  empNamePrompt,
  empRolePrompt,
  empMngrPrompt,
  empChoicePrompt,
  newRolePrompt,
  quitReturn,
};