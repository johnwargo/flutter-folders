#!/usr/bin/env node

// Load the modules we'll need
const chalk = require('chalk');
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
// const emptyHeader = '|                                  |';

// Get started
console.log(chalk.green(appHeader));
console.log(chalk.green(appName));
// console.log(chalk.green(emptyHeader));
console.log(chalk.green(appAuthor));
console.log(chalk.green(appHeader));

// Make sure this is a Flutter project


// Create the folders we need


// Update the `pubspec.yaml` to point to the assets folders
