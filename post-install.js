const { exec } = require('child_process');

let command;

var locale = ""
if (process.env.LOCALE == "sv")
    locale = ",sv"

if (process.env.ENV === 'dev') {
    console.log("running heroku dev")
    command = exec('npm run config-env && ng build --configuration=heroku-dev' + locale +  '&& node move-locale-dir.js');
} else if (process.env.ENV === 'prod') {
    console.log("running heroku prod")
    command = exec('npm run config-env && ng build --configuration=heroku-prod');
} else {
    console.log("cant find env. running heroku dev")
    command = exec('npm run config-env && npm run i18n-poeditor && ng build --configuration=heroku-dev,sv && node move-locale-dir.js');
}

console.log("locale enviornment is:" + locale)

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