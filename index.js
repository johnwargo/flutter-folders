#!/usr/bin/env node
"use strict";
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
var shell = require('shelljs');
var appName = '| Flutter Project Folder Generator |';
var appAuthor = '| by John M. Wargo (johwargo.com)  |';
var appHeader = '|==================================|';
var currentPath = process.cwd();
var exitHeading = chalk.red('Exiting:');
var projectFolders = [
    "assets",
    "assets/images",
    "assets/other",
    "lib/models",
    "lib/pages",
    "lib/services",
    "lib/utils",
    "lib/widgets"
];
var pubSpec = 'pubspec.yaml';
function checkFile(filePath) {
    try {
        return fs.existsSync(filePath);
    }
    catch (err) {
        console.error("checkFile error: " + err);
        return false;
    }
}
function checkDirectory(filePath) {
    if (fs.existsSync(filePath)) {
        try {
            var stats = fs.statSync(filePath);
            if (stats) {
                return stats.isDirectory;
            }
            else {
                return false;
            }
        }
        catch (err) {
            console.error("checkDirectory error: " + err);
            return false;
        }
    }
    else {
        return false;
    }
}
console.log(chalk.green(appHeader));
console.log(chalk.green(appName));
console.log(chalk.green(appAuthor));
console.log(chalk.green(appHeader));
console.log(chalk.yellow('\nValidating Flutter project'));
var filePath = path.join(currentPath, pubSpec);
if (!checkFile(filePath)) {
    console.log(exitHeading + (" Unable to locate the " + filePath + " file\n"));
    shell.exit(1);
}
else {
    console.log("Found " + filePath + " file");
}
filePath = path.join(currentPath, 'lib');
if (!checkDirectory(filePath)) {
    console.log(exitHeading + (" Unable to locate the " + filePath + " folder\n"));
    shell.exit(1);
}
else {
    console.log("Found " + filePath + " file");
}
filePath = shell.which('flutter').toString();
if (!filePath) {
    console.log(exitHeading + ' Unable to locate the Flutter command\n');
    shell.exit(1);
}
else {
    console.log("Found Flutter command at " + path.dirname(filePath));
}
console.log(chalk.green('We have a Flutter project'));
console.log(chalk.yellow('\nCreating project folders'));
for (var _i = 0, projectFolders_1 = projectFolders; _i < projectFolders_1.length; _i++) {
    var folder = projectFolders_1[_i];
    var folderPath = path.join(currentPath, folder);
    console.log("Checking " + folderPath);
    if (!checkDirectory(folderPath)) {
        console.log(chalk.green("Creating " + folderPath));
        fs.mkdirSync(folderPath);
    }
    else {
        console.log(chalk.red("Skipping " + folderPath + " (directory already exists)"));
    }
}
