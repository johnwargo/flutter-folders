#!/usr/bin/env node
"use strict";
var boxen = require('boxen');
var chalk = require('chalk');
var fs = require('fs');
var logger = require('cli-logger');
var packageDotJSON = require('./package.json');
var path = require('path');
var program = require('commander');
var shell = require('shelljs');
https: var yaml = require('js-yaml');
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
var log = logger();
function setupLogger() {
    var conf = program.debug ? log.DEBUG : log.INFO;
    log.level(conf);
    log.debug(program.opts());
}
function updatePubspec() {
    console.log("Updating the " + PUBSPECFILE + " file");
    var pubspecPath = path.join(CURRENTPATH, PUBSPECFILE);
    try {
        var fileContents = fs.readFileSync(pubspecPath, 'utf8');
        var data = yaml.safeLoad(fileContents);
        data.flutter.assets = ['assets/icon', 'assets/images', 'assets/other'];
        var yamlStr = yaml.safeDump(data);
        fs.writeFileSync(pubspecPath, yamlStr, 'utf8');
    }
    catch (e) {
        console.error(chalk.red(e.message));
    }
}
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
function isValidConfig() {
    console.log(chalk.yellow('\nValidating Flutter project'));
    var filePath = path.join(CURRENTPATH, PUBSPECFILE);
    if (!checkFile(filePath)) {
        console.log(EXITHEADING + (" Unable to locate the " + filePath + " file\n"));
        return false;
    }
    else {
        console.log("Found " + filePath + " file");
    }
    filePath = path.join(CURRENTPATH, 'lib');
    if (!checkDirectory(filePath)) {
        console.log(EXITHEADING + (" Unable to locate the " + filePath + " folder\n"));
        return false;
    }
    else {
        console.log("Found " + filePath + " file");
    }
    filePath = shell.which('flutter').toString();
    if (!filePath) {
        console.log(EXITHEADING + ' Unable to locate the Flutter command\n');
        return false;
    }
    else {
        console.log("Found Flutter command at " + path.dirname(filePath));
    }
    console.log(chalk.green('We have a Flutter project'));
    return true;
}
function makeFolders() {
    log.info(chalk.yellow('\nCreating project folders'));
    for (var _i = 0, PROJECTFOLDERS_1 = PROJECTFOLDERS; _i < PROJECTFOLDERS_1.length; _i++) {
        var folder = PROJECTFOLDERS_1[_i];
        var folderPath = path.join(CURRENTPATH, folder);
        if (!checkDirectory(folderPath)) {
            log.info(chalk.green("Creating " + folderPath));
            try {
                fs.mkdirSync(folderPath);
            }
            catch (e) {
                log.info(chalk.red("Unable to create " + folderPath + " (e.message)"));
            }
        }
        else {
            log.info(chalk.red("Skipping " + folderPath + " (directory already exists)"));
        }
    }
}
console.log(boxen(APPNAME, { padding: 1 }));
console.log(APPAUTHOR);
program.version(packageDotJSON.version);
console.log("Version: " + program.version);
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
}
else {
    console.log(chalk.red('Exiting'));
}
