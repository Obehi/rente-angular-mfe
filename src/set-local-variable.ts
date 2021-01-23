//File replacement did not work with language interfaces when running heroku-postbuild (it works with ng serve...). This file is the workaround
const fs = require('fs');
const path = require('path');
const environment = process.env.ENV;
const locale = process.env.LOCALE;
const isProd = environment === 'prod';
const mainPathJs = path.join(__dirname + `/app/config/locale/locale-js.js`);
const svPathJs = path.join(__dirname + `/app/config/locale/locale-sv.js`);
const noPathJs = path.join(__dirname + `/app/config/locale/locale-no.js`);

const mainPathTs = path.join(__dirname + `/app/config/locale/locale.ts`);
const svPathTs = path.join(__dirname + `/app/config/locale/locale-sv.ts`);
const noPathTs = path.join(__dirname + `/app/config/locale/locale-no.ts`);

// get argument from npm command
const arg = process.argv[0];

let MOCKUPLOCALVALUE = '';
switch (process.env.LOCALE) {
  case 'sv':
    MOCKUPLOCALVALUE = arg;
    break;
  case 'nb':
    MOCKUPLOCALVALUE = arg;
    break;
  case 'no':
    MOCKUPLOCALVALUE = 'nb';
    break;

  default:
    // manually set local value
    MOCKUPLOCALVALUE = 'nb';
}
//nb | sv

initializeLocaleFile(mainPathTs, MOCKUPLOCALVALUE),
  initializeLocaleFile(mainPathJs, MOCKUPLOCALVALUE),
  /* overwrite local component files which can be used for file replacement with "ng serve ...". 
This file is the source of truth, not the respective local files: "components-sv" and "components-nb". 
This file does not run before ng serve 
*/
  /* if(process.env == null) {
  writeToComponentFile(svFileJs, svPathJs);
  writeToComponentFile(noFileJs, noPathJs);

  writeToComponentFile(svFileTs, svPathTs);
  writeToComponentFile(noFileTs, noPathTs);
} 
*/

  function writeToComponentFile(file, path) {
    console.log('writing file: ' + file + ' to path: ' + path);
    fs.writeFile(path, file, (err) => {
      if (err) {
        console.log(err);
        process.exit(1);
        return;
      }
      console.log(
        'Locale variable file: ' +
          file +
          '. Environment mode is ${process.env.APP} '
      );
    });
  };

function initializeLocaleFile(filepath, devMockupvalue) {
  let fileOutput = '';
  const fileExtension = filepath.split('.').pop();
  let exportSyntax = '';
  if (fileExtension == 'js') {
    exportSyntax = 'module.exports';
  } else if (fileExtension == 'ts') {
    exportSyntax = 'export const locale ';
  } else {
    console.log(
      'Error: initializeLocaleFile filepath is not a ts or extension'
    );
    process.exit(1);
  }

  if (!process.env.LOCALE) {
    fileOutput = `${exportSyntax} =  "${devMockupvalue}"`;
  } else {
    fileOutput = `${exportSyntax} =  "${process.env.LOCALE}"`;
  }

  console.log('writing file: ' + fileOutput + ' to path: ' + filepath);
  fs.writeFile(filepath, fileOutput, (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    console.log(
      'Locale variable file: ' +
        fileOutput +
        '. Environment mode is ${process.env.APP} '
    );
  });
}
