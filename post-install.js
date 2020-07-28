const { exec } = require('child_process');

let command;

if (process.env.ENV === 'dev') {
    console.log("running heroku dev")
    command = exec('npm run config-env && ng build --configuration=dev');
} else if (process.env.ENV === 'staging') {
    console.log("running not heroku dev")
    command = exec('npm run config-env && ng build --configuration=dev');
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