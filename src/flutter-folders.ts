#!/usr/bin/env node

// modules
const boxen = require('boxen');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

// constants
const APPNAME = 'Flutter Project Folder Generator';
const APPAUTHOR = '  by John M. Wargo (johwargo.com)';
const CURRENTPATH = process.cwd();
const EXITHEADING = chalk.red('Exiting:');
const PROJECTFOLDERS: String[] = [
  `assets`,
  `assets/images`,
  `assets/other`,
  `lib/models`,
  `lib/pages`,
  `lib/services`,
  `lib/utils`,
  `lib/widgets`
];
const PUBSPECFILE = 'pubspec.yaml'

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
  console.log(boxen(APPNAME, { padding: 1 }));
  console.log(APPAUTHOR);

  // Make sure this is a Flutter project
  console.log(chalk.yellow('\nValidating Flutter project'));
  // does the pubspec file exist?
  let filePath = path.join(CURRENTPATH, PUBSPECFILE);
  if (!checkFile(filePath)) {
    console.log(EXITHEADING + ` Unable to locate the ${filePath} file\n`);
    shell.exit(1);
  } else {
    console.log(`Found ${filePath} file`);
  }
  // Does the lib folder exist?
  filePath = path.join(CURRENTPATH, 'lib');
  if (!checkDirectory(filePath)) {
    console.log(EXITHEADING + ` Unable to locate the ${filePath} folder\n`);
    shell.exit(1);
  } else {
    console.log(`Found ${filePath} file`);
  }
  // is flutter installed?
  filePath = shell.which('flutter').toString();
  if (!filePath) {
    // TODO: does this work if Flutter isn't installed globally?
    console.log(EXITHEADING + ' Unable to locate the Flutter command\n');
    shell.exit(1);
  } else {
    console.log(`Found Flutter command at ${path.dirname(filePath)}`);
  }
  console.log(chalk.green('We have a Flutter project'));

  // Create the folders we need
  console.log(chalk.yellow('\nCreating project folders'));
  for (let folder of PROJECTFOLDERS) {
    let folderPath = path.join(CURRENTPATH, folder);
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
