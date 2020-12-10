const { exec } = require('child_process');

const arg = process.argv[2]
const dev = process.env.ENV === 'dev' || process.env.ENV == null
if(process.env.ENV == null) {
    
    const arg = process.argv[2]
    var locale = ""
    switch (arg) {
        case 'sv':
            locale = arg
            break;
        case 'no':
            locale = "nb"
            break;
        default:
            //fall back on value last set in set-local-variable.ts
            locale =  require('./src/app/config/locale/locale-js')
        }

    process.env.LOCALE = locale
    command = exec('myVar=something node ./src/set-local-variable.ts', () => {

    console.log("running locale script with: locale:" + locale);
    runScript(locale, dev)
    });

} else {
    var locale = process.env.LOCALE;
    console.log("Is not local build: " + locale);
    runScript(locale, dev)
}



function runScript(currentLocale, dev) {
    let command;
    var locale = ""

    //These should mostly reflect filereplacements in angular.json
    if (currentLocale == "sv") {
        locale = ",sv";
        exec("npm run set-sv-routes");
        exec("cp -f ./src/app/config/routes-config-sv.ts ./src/app/config/routes-config.ts ");  
        exec("cp -f ./src/app/shared/constants/mask-sv.ts ./src/app/shared/constants/mask.ts ");
        exec("cp -f ./src/app/local-components/components-sv.ts ./src/app/local-components/components-output.ts ");
        if(dev) {
            exec("cp -f ./src/index/sv-dev/index-sv-dev.html ./src/index.html ");
        } else {
            exec("cp -f ./src/index/sv/index-sv.html ./src/index.html "); 
        }
    }
    else if (currentLocale == "nb") {
        locale = ",nb"
        exec("cp -f ./src/app/config/routes-config-no.ts ./src/app/config/routes-config.ts ");  
        exec("cp -f ./src/app/shared/constants/mask-no.ts ./src/app/shared/constants/mask.ts ");
        exec("cp -f ./src/app/local-components/components-no.ts ./src/app/local-components/components-output.ts ");
        if(dev) {
            exec("cp -f ./src/index/no-dev/index-no-dev.html ./src/index.html ");
        } else {
            exec("cp -f ./src/index/no/index-no.html ./src/index.html "); 
        }
    }
    else {
        console.log("Couldnt find locale in post-install.js");
    }
    console.log("locale is: " + locale)

    if (process.env.ENV === 'dev') {
        console.log("running heroku dev")
        command = exec('npm run config-env && npm run set-local-variable && npm run i18n-poeditor && ng build --configuration=heroku-dev' + locale +  '&& node move-locale-dir.js');
    } else if (process.env.ENV === 'prod') {
        console.log("running heroku prod")
        command = exec('npm run config-env && npm run set-local-variable && npm run i18n-poeditor && ng build --configuration=heroku-prod'  + locale +  '&& node move-locale-dir.js');
    } else {
        console.log("cant find env. running heroku dev")
        command = exec('npm run set-local-variable && npm run i18n-poeditor && ng build --configuration=heroku-dev' + locale +  '&& node move-locale-dir.js');
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