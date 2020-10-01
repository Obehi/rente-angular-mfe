var fs = require('fs')
const path = require('path');
const { exec } = require('child_process');
const rimraf = rmdir = require('rimraf');

let locale = "/sv"
if (process.env.LOCALE === "sv")
    locale = "/sv"
else if (process.env.LOCALE === "nb")
    locale = "/nb"

let originalPath =  __dirname + "/dist/rente-front-end" + locale;
let buffer = __dirname + "/dist/buffer"
let finalPath = __dirname + "/dist/rente-front-end"

fs.readdir(originalPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach(function (file) {
        console.log(file); 
    });
});



console.log("moving files")
console.log(originalPath + " <- originalPath");
console.log(buffer + " <- bufferPath");
console.log(finalPath + " <- finalPath");

fs.renameSync(originalPath, buffer)
fs.rmdirSync(finalPath)
fs.renameSync(buffer, finalPath)



//rmdir(finalPath, function(error){});
//fs.renameSync(buffer, finalPath)

//fs.renameSync(originalPath, buffer)
//fs.rmdirSync(finalPath)

//rmdir(finalPath, function(error){});
//fs.renameSync(buffer, finalPath)

