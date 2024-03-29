const path = require('path');
const fs = require('fs');
const colors = require('colors/safe');
const appVersion = require('./package.json').version;
const buildDate = new Date().toString();

console.log(colors.cyan('\nRunning app version task...'));

const versionFilePath = path.join(__dirname + '/src/version.ts');

const src = `// This file is generated by npm version task
export const version = '${appVersion}';
export const buildDate = '${buildDate}';
`;

// ensure version module pulls value from package.json
fs.writeFile(versionFilePath, src, { flat: 'w' }, function (err) {
  if (err) {
    return console.log(
      colors.red('An error happened during version updating', err)
    );
  }

  console.log(
    colors.green(
      `Updating application version ${colors.yellow(
        appVersion
      )} - ${colors.yellow(buildDate)}`
    )
  );
  console.log(
    `${colors.green('Writing version module to ')}${colors.yellow(
      versionFilePath
    )}\n`
  );
});
