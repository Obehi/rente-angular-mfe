const { exec } = require('child_process');

let command;

var locale = ",sv"
if (process.env.LOCALE == "sv")
    locale = ",sv"
else if (process.env.LOCALE == "nb")
    locale = ",nb"

console.log("locale is: " + locale);

if (process.env.ENV === 'dev') {
    console.log("running heroku dev")
    command = exec('npm run config-env && npm run i18n-poeditor && ng build --configuration=heroku-dev' + locale +  '&& node move-locale-dir.js');
} else if (process.env.ENV === 'prod') {
    console.log("running heroku prod")
    command = exec('npm run config-env && npm run i18n-poeditor && ng build --configuration=heroku-prod'  + locale +  '&& node move-locale-dir.js');
} else {
    console.log("cant find env. running heroku dev")
    command = exec('npm run config-env && npm run i18n-poeditor && ng build --configuration=heroku-dev' + locale +  '&& node move-locale-dir.js');
}

console.log("locale enviornment is:" + process.env.LOCALE)

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
