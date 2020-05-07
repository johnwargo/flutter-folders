#!/usr/bin/env node
/**********************************************************
 * Flutter Folders
 * by John M. Wargo
 * 
 * Updates a flutter project's folder structure with 
 * folders to group Dart files and assets.
 **********************************************************/
// TODO: Switch to logger instead of console.log

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
const APPNAME = 'Flutter Project Folder Generator';
const APPAUTHOR = '  by John M. Wargo (https://johwargo.com)';
const CURRENTPATH = process.cwd();
const EXITHEADING = chalk.red('Exiting:');
const PROJECTFOLDERS: String[] = [
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
const PUBSPECFILE = 'pubspec.yaml'

var log = logger();

function setupLogger() {
  const conf = program.debug ? log.DEBUG : log.INFO;
  log.level(conf);
  log.debug(program.opts());
}

function updatePubspec() {
  console.log(`Updating the ${PUBSPECFILE} file`);
  let pubspecPath = path.join(CURRENTPATH, PUBSPECFILE);
  try {
    let fileContents = fs.readFileSync(pubspecPath, 'utf8');
    let data = yaml.safeLoad(fileContents);
    data.flutter.assets = ['assets/icon', 'assets/images', 'assets/other'];
    let yamlStr = yaml.safeDump(data);
    fs.writeFileSync(pubspecPath, yamlStr, 'utf8');
  } catch (e) {
    console.error(chalk.red(e.message));
  }
}

function checkFile(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    console.error(`checkFile error: ${err}`);
    return false;
  }
}

function checkDirectory(filePath: string): boolean {
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
      console.error(`checkDirectory error: ${err}`);
      return false;
    }
  } else {
    return false;
  }
}

function isValidConfig(): Boolean {
  // Make sure this is a Flutter project
  console.log(chalk.yellow('\nValidating Flutter project'));
  // does the pubspec file exist?
  let filePath = path.join(CURRENTPATH, PUBSPECFILE);
  if (!checkFile(filePath)) {
    console.log(EXITHEADING + ` Unable to locate the ${filePath} file\n`);
    return false;
  } else {
    console.log(`Found ${filePath} file`);
  }

  // Does the lib folder exist?
  filePath = path.join(CURRENTPATH, 'lib');
  if (!checkDirectory(filePath)) {
    console.log(EXITHEADING + ` Unable to locate the ${filePath} folder\n`);
    return false;
  } else {
    console.log(`Found ${filePath} file`);
  }
  // is flutter installed?
  filePath = shell.which('flutter').toString();
  if (!filePath) {
    // TODO: does this work if Flutter isn't installed globally?
    console.log(EXITHEADING + ' Unable to locate the Flutter command\n');
    return false;
  } else {
    console.log(`Found Flutter command at ${path.dirname(filePath)}`);
  }
  console.log(chalk.green('We have a Flutter project'));
  return true;
}


function makeFolders() {
    // Create the folders we need
  log.info(chalk.yellow('\nCreating project folders'));
  for (let folder of PROJECTFOLDERS) {
    let folderPath = path.join(CURRENTPATH, folder);
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
console.log(boxen(APPNAME, { padding: 1 }));
console.log(APPAUTHOR);

// Get the version number from the package.json file
program.version(packageDotJSON.version);
console.log(`Version: ${program.version}`);
program.option('-d, --debug', 'Output extra information during operation');
program.option('-u, --update', 'Update the Assets definition in the pubspec.yaml file');


if (isValidConfig()) {
  program.parse(process.argv);
  setupLogger();
  log.info(chalk.green('Configuration is valid\n'));
  makeFolders();
  if (program.update) {
    updatePubspec();
  }
} else {
  console.log(chalk.red('Exiting'));
}