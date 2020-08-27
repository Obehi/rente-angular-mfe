var fs = require('fs')
const path = require('path');
const { exec } = require('child_process');

let sv =  __dirname + "/dist/rente-front-end/sv";
let buffer = __dirname + "/dist/buffer"
let rentePath = __dirname + "/dist/rente-front-end"

fs.readdir(sv, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log(file); 
    });
});

const basePath = path.resolve(__dirname, '../dist/rente-front-end/');
const svPath = basePath + "/sv";

console.log("moving files")
console.log(basePath + " <- clientpath");
console.log(svPath + " <- svPath");



fs.renameSync(sv, buffer)
fs.rmdirSync(rentePath)
fs.renameSync(buffer, rentePath)

