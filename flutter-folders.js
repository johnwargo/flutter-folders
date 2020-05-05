#!/usr/bin/env node
"use strict";
var boxen = require('boxen');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
var shell = require('shelljs');
var APPNAME = 'Flutter Project Folder Generator';
var APPAUTHOR = '  by John M. Wargo (https://johwargo.com)';
var CURRENTPATH = process.cwd();
var EXITHEADING = chalk.red('Exiting:');
var PROJECTFOLDERS = [
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
var PUBSPECFILE = 'pubspec.yaml';
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
function makeFolders() {
    console.log(boxen(APPNAME, { padding: 1 }));
    console.log(APPAUTHOR);
    console.log(chalk.yellow('\nValidating Flutter project'));
    var filePath = path.join(CURRENTPATH, PUBSPECFILE);
    if (!checkFile(filePath)) {
        console.log(EXITHEADING + (" Unable to locate the " + filePath + " file\n"));
        shell.exit(1);
    }
    else {
        console.log("Found " + filePath + " file");
    }
    filePath = path.join(CURRENTPATH, 'lib');
    if (!checkDirectory(filePath)) {
        console.log(EXITHEADING + (" Unable to locate the " + filePath + " folder\n"));
        shell.exit(1);
    }
    else {
        console.log("Found " + filePath + " file");
    }
    filePath = shell.which('flutter').toString();
    if (!filePath) {
        console.log(EXITHEADING + ' Unable to locate the Flutter command\n');
        shell.exit(1);
    }
    else {
        console.log("Found Flutter command at " + path.dirname(filePath));
    }
    console.log(chalk.green('We have a Flutter project'));
    console.log(chalk.yellow('\nCreating project folders'));
    for (var _i = 0, PROJECTFOLDERS_1 = PROJECTFOLDERS; _i < PROJECTFOLDERS_1.length; _i++) {
        var folder = PROJECTFOLDERS_1[_i];
        var folderPath = path.join(CURRENTPATH, folder);
        if (!checkDirectory(folderPath)) {
            console.log(chalk.green("Creating " + folderPath));
            fs.mkdirSync(folderPath);
        }
        else {
            console.log(chalk.red("Skipping " + folderPath + " (directory already exists)"));
        }
    }
}
module.exports = {
    makeFolders: makeFolders
};
