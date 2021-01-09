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



const quit = () => {
    connection.end();
}

function mainMenu() {
    console.log(logo);
    inquirer.prompt(
        [
            {
              type: "list",
              name: "choice",
              message: "What would you like to do?",
              choices: ["View All Employees", "Quit"],
            },
        ]
    ).then((mainSelect) => {
        switch (mainSelect.choice) {
            case "View All Employees":
                getAllEmployees();
                break;
            case "Quit":
                quit();
                break;
        }
    }) 
};

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

const getAllEmployees = () => {
    const query = connection.query(`SELECT * FROM Employees`,
        function(err, res) {
            if (err) throw err;
            console.table('Employees', res);
            quitReturn();
        }
    );
};

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

