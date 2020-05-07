#!/usr/bin/env node
/**********************************************************
 * Flutter Folders
 * by John M. Wargo
 * 
 * Updates a flutter project's folder structure with 
 * folders to group Dart files and assets.
 **********************************************************/

// modules
const boxen = require('boxen');
const chalk = require('chalk');
const fs = require('fs');
const logger = require('cli-logger');
// https://stackoverflow.com/questions/9153571/is-there-a-way-to-get-version-from-package-json-in-nodejs-code
const packageDotJSON = require('./package.json');
const path = require('path');
// https://www.npmjs.com/package/commander
const program = require('commander');
const shell = require('shelljs');
https://stackabuse.com/reading-and-writing-yaml-to-a-file-in-node-js-javascript/
const yaml = require('js-yaml')

// constants
const APP_NAME = 'Flutter Folders';
const APP_AUTHOR = 'by John M. Wargo (https://johwargo.com)';
const CURRENT_PATH = process.cwd();
const EXIT_HEADING = chalk.red('Exiting:');
const PROJECT_FOLDERS: String[] = [
  'assets',
  'assets/icon',
  'assets/images',
  'assets/other',
  'lib/classes',
  'lib/models',
  'lib/pages',
  'lib/services',
  'lib/utils',
  'lib/widgets'
];
const PUBSPEC_FILE = 'pubspec.yaml'

var log = logger();

function updatePubspec() {
  log.info(`Updating the ${PUBSPEC_FILE} file`);
  let pubspecPath = path.join(CURRENT_PATH, PUBSPEC_FILE);
  try {
    let fileContents = fs.readFileSync(pubspecPath, 'utf8');
    let data = yaml.safeLoad(fileContents);
    data.flutter.assets = ['assets/icon', 'assets/images', 'assets/other'];
    let yamlStr = yaml.safeDump(data);
    fs.writeFileSync(pubspecPath, yamlStr, 'utf8');
  } catch (e) {
    log.error(chalk.red(e.message));
  }
}

function checkFile(filePath: string): boolean {
  log.debug(`checkFile(${filePath})`);
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    log.error(`checkFile error: ${err}`);
    return false;
  }
}

function checkDirectory(filePath: string): boolean {
  log.debug(`checkDirectory(${filePath})`);
  // does the folder exist?
  if (fs.existsSync(filePath)) {
    // Check to see if it's a folder
    try {
      let stats = fs.statSync(filePath);
      if (stats) {
        return stats.isDirectory;
      } else {
        return false;
      }
    } catch (err) {
      log.error(`checkDirectory error: ${err}`);
      return false;
    }
  } else {
    return false;
  }
}

function isValidConfig(): Boolean {
  // Make sure this is a Flutter project
  log.info(chalk.yellow('\nValidating Flutter project'));
  // does the pubspec file exist?
  let filePath = path.join(CURRENT_PATH, PUBSPEC_FILE);
  if (!checkFile(filePath)) {
    log.info(EXIT_HEADING + ` Unable to locate the ${filePath} file\n`);
    return false;
  } else {
    log.info(`Located ${filePath}`);
  }

  // Does the lib folder exist?
  filePath = path.join(CURRENT_PATH, 'lib');
  if (!checkDirectory(filePath)) {
    log.info(EXIT_HEADING + ` Unable to locate the ${filePath} folder\n`);
    return false;
  } else {
    log.info(`Located ${filePath}`);
  }
  // is flutter installed?
  filePath = shell.which('flutter').toString();
  if (!filePath) {
    log.info(EXIT_HEADING + ' Unable to locate the Flutter command\n');
    return false;
  } else {
    log.info(`Flutter command found at ${path.dirname(filePath)}`);
  }
  log.info(chalk.green('We have a Flutter project'));
  return true;
}


function makeFolders() {
  // Create the folders we need
  log.info(chalk.yellow('\nCreating project folders'));
  for (let folder of PROJECT_FOLDERS) {
    let folderPath = path.join(CURRENT_PATH, folder);
    if (!checkDirectory(folderPath)) {
      log.info(chalk.green(`Creating ${folderPath}`));
      try {
        fs.mkdirSync(folderPath);
      } catch (e) {
        log.info(chalk.red(`Unable to create ${folderPath} (e.message)`));
      }
    } else {
      log.info(chalk.red(`Skipping ${folderPath} (directory already exists)`));
    }
  }
}

// Get started
console.log(boxen(APP_NAME, { padding: 1 }));
console.log(APP_AUTHOR);
console.log(`Version: ${packageDotJSON.version}`);

// Get the version number from the package.json file
program.version(packageDotJSON.version);
program.option('-d, --debug', 'Output extra information during operation');
program.option('-u, --update', 'Update the Assets definition in the pubspec.yaml file');

if (isValidConfig()) {
  // Process the command line arguments
  program.parse(process.argv);
  // Configure the logger
  const conf = program.debug ? log.DEBUG : log.INFO;
  log.level(conf);
  log.debug(program.opts());
  // Start processing files
  makeFolders();
  // was there a -u on the command line?
  if (program.update) {
    // Then update the pubspec.yaml file
    // Note: This removes all comments from the file
    updatePubspec();
  }
} else {
  console.log(chalk.red('Exiting'));
}