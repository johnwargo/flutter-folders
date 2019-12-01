#!/usr/bin/env node

// Load the modules we'll need
const boxen = require('boxen');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

// Application constants
const appName = 'Flutter Project Folder Generator';
const appAuthor = '  by John M. Wargo (johwargo.com)';
const currentPath = process.cwd();
const exitHeading = chalk.red('Exiting:');
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
const pubSpec = 'pubspec.yaml'

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

function makeFolders() {
  // Get started
  console.log(boxen(appName, { padding: 1 }));
  console.log(appAuthor);

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
    if (!checkDirectory(folderPath)) {
      console.log(chalk.green(`Creating ${folderPath}`));
      fs.mkdirSync(folderPath);
    } else {
      console.log(chalk.red(`Skipping ${folderPath} (directory already exists)`));
    }
  }
}

module.exports = {
  makeFolders
}
