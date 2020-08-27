var fs = require('fs')
const path = require('path');
const { exec } = require('child_process');


let locale = "/nb"
if (process.env.LOCALE === "sv")
    locale = "/sv"
else if (process.env.LOCALE === "nb")
    locale = "/nb"

let localePath =  __dirname + "/dist/rente-front-end" + locale;
let buffer = __dirname + "/dist/buffer"
let rentePath = __dirname + "/dist/rente-front-end"

fs.readdir(localePath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach(function (file) {
        console.log(file); 
    });
});



console.log("moving files")
console.log(localePath + " <- localePath");
console.log(buffer + " <- bufferPath");
console.log(rentePath + " <- finalPath");



fs.renameSync(localePath, buffer)
fs.rmdirSync(rentePath)
fs.renameSync(buffer, rentePath)

