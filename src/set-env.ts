import * as fs from 'fs';
import { argv } from 'yargs';

// This is good for local dev environments, when it's better to
// store a projects environment variables in a .gitignore'd file
require('dotenv').config();

// Would be passed to script like this:
// `ts-node set-env.ts --environment=dev`
// we get it from yargs's argv object
const environment = argv.environment;
const isProd = environment === 'prod';

const targetPath = `./src/environments/environment.${environment}.ts`;
const envConfigFile = `
export const environment = {
  production: ${isProd},
  baseUrl: "${process.env.BASE_URL}",
  crawlerUrl: "${process.env.CRAWLER_URL}"
};
`;
console.log(envConfigFile);

fs.writeFile(targetPath, envConfigFile, (err) => {
  if (err) {
    // console.log(err);
  }

  // console.log(`Output generated at ${targetPath}`);
});
