var fs = require('fs')
const path = require('path');
const { exec } = require('child_process');
const rimraf = rmdir = require('rimraf'); 
var locale = process.env.LOCALE || require('./src/app/config/locale/locale-js')

if (locale === "sv")
    localeDir = "/sv"
else if (locale === "nb")
    localeDir = "/nb"

let originalPath =  __dirname + "/dist/rente-front-end" + localeDir;
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
console.log("renamed to buffer")

rmdir(finalPath, function(error){
    console.log("removed rente-front-end")
    fs.renameSync(buffer, finalPath);
    console.log("renamed buffer to rente-front-end");
});


