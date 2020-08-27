const { exec } = require('child_process');

let command;

var locale = ""
if (process.env.LOCALE == "sv")
    locale = ",sv"
else if (process.env.LOCALE == "nb")
    locale = ",nb"
    
if (process.env.ENV === 'dev') {
    console.log("running heroku dev")
    command = exec('npm run config-env && ng build --configuration=heroku-dev' + locale );
} else if (process.env.ENV === 'prod') {
    console.log("running heroku prod")
    command = exec('npm run config-env && ng build --configuration=heroku-prod' + locale );
} else {
    console.log("cant find env. running heroku dev")
    command = exec('npm run config-env && ng build --configuration=heroku-dev' + locale );
}

if (command != undefined) {
    command.stdout.on('data', (data) => {
        console.log(data);
    });

    command.stderr.on('data', (data) => {
        console.error(data);
    });

    command.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
} else {
    console.error('process.env.ENV: ' + process.env.ENV);
}