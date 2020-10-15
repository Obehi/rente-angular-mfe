const { exec } = require('child_process');


if(process.ENV == null) {
    
    command = exec('npm run set-local-variable', () => {
    var locale =  require('./src/app/config/locale/locale-js')
    console.log("running locale script with: locale:" + locale);
    runScript(locale)
    });

} else {
    var locale = process.env.LOCALE;
    runScript(locale)
}



function runScript(currentLocale) {
    let command;
    var locale = ""

    console.log("running runscript")
    if (currentLocale== "sv")
        locale = ",sv"
    else if (currentLocale== "nb")
        locale = ",nb"
    else {
        console.log("Couldnt find locale in post-install.js");
    }
    console.log("locale is: " + locale)

    if (process.env.ENV === 'dev') {
        console.log("running heroku dev")
        command = exec('npm run config-env && npm run i18n-poeditor && ng build --configuration=heroku-dev' + locale +  '&& node move-locale-dir.js');
    } else if (process.env.ENV === 'prod') {
        console.log("running heroku prod")
        command = exec('npm run config-env && npm run i18n-poeditor && ng build --configuration=heroku-prod'  + locale +  '&& node move-locale-dir.js');
    } else {
        console.log("cant find env. running heroku dev")
        command = exec('npm run set-local-variable && npm run set-local-components && npm run i18n-poeditor && ng build --configuration=heroku-dev' + locale +  '&& node move-locale-dir.js');
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
}