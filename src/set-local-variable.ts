
//File replacement did not work with language interfaces when running heroku-postbuild (it works with ng serve...). This file is the workaround


const fs = require('fs');
const path = require('path');
const environment = process.env.ENV;
const locale = process.env.LOCALE
const isProd = environment === 'prod';
const mainPathJs = path.join(__dirname + `/app/config/locale/locale-js.js`);
const svPathJs = path.join(__dirname + `/app/config/locale/locale-sv.js`);
const noPathJs = path.join(__dirname + `/app/config/locale/locale-no.js`);

const mainPathTs = path.join(__dirname + `/app/config/locale/locale.ts`);
const svPathTs = path.join(__dirname + `/app/config/locale/locale-sv.ts`);
const noPathTs = path.join(__dirname + `/app/config/locale/locale-no.ts`);




const svFileJs = `module.exports =  "sv"`;
const noFileJs = `module.exports =  "nb"`;

const svFileTs = `module.exports =  "sv"`;
const noFileTs = `module.exports =  "nb"`;

const mockFileJs = svFileJs
const mockFileTs = svFileTs

let localefileJS = "";
let localefileTs = "";

if(!process.env.LOCALE) {
  localefileJS = mockFileJs;
  localefileTs = mockFileTs;
} else if(process.env.LOCALE == "nb") {
  localefileJS = noFileJs;
  localefileTs = noFileTs;
} else if(process.env.LOCALE == "sv") {
  localefileJS = svFileJs;
  localefileTs = svFileTs;
}


if(process.env.LOCALE == null) {
  console.log("Couldnt find LOCALE environment variable. Writing to locale mockup constant")
  console.log(mainPathJs)
  console.log("Couldnt find LOCALE environment variable. Writing to locale mockup constant")

  writeToComponentFile(localefileJS, mainPathJs)
  writeToComponentFile(localefileTs, mainPathTs)
} else if(localefileJS != null) {
  console.log("Couldnt find LOCALE environment variable")
  writeToComponentFile(localefileJS, mainPathJs)
  writeToComponentFile(localefileTs, mainPathTs)
} else {
  process.on('exit', function(code) {
    return console.log(`About to exit with code ${code}`);
});
}


/* overwrite local component files which can be used for file replacement with "ng serve ...". 
This file is the source of truth, not the respective local files: "components-sv" and "components-nb". 
This file does not run before ng serve 
*/
if(process.env == null) {
  writeToComponentFile(svFileJs, svPathJs);
  writeToComponentFile(noFileJs, noPathJs);

  writeToComponentFile(svFileTs, svPathTs);
  writeToComponentFile(noFileTs, noPathTs);
}

function writeToComponentFile(file, path) {
  fs.writeFile(path, file, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Environment config generated at ${mainPathJs}. Environment mode is ${process.env.APP} `);
  });
}