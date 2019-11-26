#!/usr/bin/env node

// Load the modules we'll need
const chalk = require('chalk');
const fs = require('fs');
var path = require('path');
const shell = require('shelljs');

// Application constants
const pubSpec = 'pubspec.yaml'
const projectFolders: String[] = [
  `assets`,
  `assets/images`,
  `assets/other`,
  `lib/models`,
  `lib/pages`,
  `lib/services`,
  `lib/utils`,
  `lib/widgets`
];

const appName = '| Flutter Project Folder Generator |';
const appAuthor = '| by John M. Wargo (johwargo.com)  |'
const appHeader = '|==================================|';
const currentPath = process.cwd();
const exitHeading = chalk.red('Exiting:');

function checkFile(filePath: string): boolean {
  // console.log(`Checking file ${filePath}`);
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

// Get started
console.log(chalk.green(appHeader));
console.log(chalk.green(appName));
console.log(chalk.green(appAuthor));
console.log(chalk.green(appHeader));

// Make sure this is a Flutter project
console.log(chalk.yellow('\nValidating Flutter project'));

// does the pubspec file exist?
let filePath = path.join(currentPath, pubSpec);
if (!checkFile(filePath)) {
  console.log(exitHeading + ` Unable to locate the ${filePath} file\n`);
  shell.exit(1);
} else {
  console.log(`Found ${filePath} file`);
}

// Does the lib folder exist?
filePath = path.join(currentPath, 'lib');
if (!checkDirectory(filePath)) {
  console.log(exitHeading + ` Unable to locate the ${filePath} folder\n`);
  shell.exit(1);
} else {
  console.log(`Found ${filePath} file`);
}

// is flutter installed?
filePath = shell.which('flutter').toString();
if (!filePath) {
  // TODO: does this work if Flutter isn't installed globally?
  console.log(exitHeading + ' Unable to locate the Flutter command\n');
  shell.exit(1);
} else {
  console.log(`Found Flutter command at ${path.dirname(filePath)}`);
}
console.log(chalk.green('We have a Flutter project'));

// Create the folders we need
console.log(chalk.yellow('\nCreating project folders'));
for (let folder of projectFolders) {
  let folderPath = path.join(currentPath, folder);
  console.log(`Checking ${folderPath}`);
  if (!checkDirectory(folderPath)) {
    console.log(chalk.green(`Creating ${folderPath}`));
    fs.mkdirSync(folderPath);
  } else {
    console.log(chalk.red(`Skipping ${folderPath} (directory already exists)`));
  }
}

// TODO: Update the pubspec.yaml file, add assets section
// Update the `pubspec.yaml` to point to the assets folders
// console.log(chalk.yellow(`\nUpdating the ${pubSpec} file`));