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
var APP_NAME = 'Flutter Folders';
var APP_AUTHOR = 'by John M. Wargo (https://johwargo.com)';
var CURRENT_PATH = process.cwd();
var EXIT_HEADING = chalk.red('Exiting:');
var PROJECT_FOLDERS = [
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
var PUBSPEC_FILE = 'pubspec.yaml';
var log = logger();
function updatePubspec() {
    log.info("Updating the " + PUBSPEC_FILE + " file");
    var pubspecPath = path.join(CURRENT_PATH, PUBSPEC_FILE);
    try {
        var fileContents = fs.readFileSync(pubspecPath, 'utf8');
        var data = yaml.safeLoad(fileContents);
        data.flutter.assets = ['assets/icon', 'assets/images', 'assets/other'];
        var yamlStr = yaml.safeDump(data);
        fs.writeFileSync(pubspecPath, yamlStr, 'utf8');
    }
    catch (e) {
        log.error(chalk.red(e.message));
    }
}
function checkFile(filePath) {
    log.debug("checkFile(" + filePath + ")");
    try {
        return fs.existsSync(filePath);
    }
    catch (err) {
        log.error("checkFile error: " + err);
        return false;
    }
}
function checkDirectory(filePath) {
    log.debug("checkDirectory(" + filePath + ")");
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
            log.error("checkDirectory error: " + err);
            return false;
        }
    }
    else {
        return false;
    }
}
function isValidConfig() {
    log.info(chalk.yellow('\nValidating Flutter project'));
    var filePath = path.join(CURRENT_PATH, PUBSPEC_FILE);
    if (!checkFile(filePath)) {
        log.info(EXIT_HEADING + (" Unable to locate the " + filePath + " file\n"));
        return false;
    }
    else {
        log.info("Located " + filePath);
    }
    filePath = path.join(CURRENT_PATH, 'lib');
    if (!checkDirectory(filePath)) {
        log.info(EXIT_HEADING + (" Unable to locate the " + filePath + " folder\n"));
        return false;
    }
    else {
        log.info("Located " + filePath);
    }
    var res = shell.which('flutter');
    if (res) {
        filePath = res.toString();
        if (!filePath) {
            log.info(EXIT_HEADING + ' Unable to locate the Flutter command\n');
            return false;
        }
        else {
            log.info("Flutter command found at " + path.dirname(filePath));
        }
        log.info(chalk.green('We have a Flutter project'));
        return true;
    }
    else {
        log.info(EXIT_HEADING + ' Unable to locate the Flutter command\n');
        return false;
    }
}
function makeFolders() {
    log.info(chalk.yellow('\nCreating project folders'));
    for (var _i = 0, PROJECT_FOLDERS_1 = PROJECT_FOLDERS; _i < PROJECT_FOLDERS_1.length; _i++) {
        var folder = PROJECT_FOLDERS_1[_i];
        var folderPath = path.join(CURRENT_PATH, folder);
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
console.log(boxen(APP_NAME, { padding: 1 }));
console.log(APP_AUTHOR);
console.log("Version: " + packageDotJSON.version);
program.version(packageDotJSON.version);
program.option('-d, --debug', 'Output extra information during operation');
program.option('-u, --update', 'Update the Assets definition in the pubspec.yaml file');
if (isValidConfig()) {
    program.parse(process.argv);
    var conf = program.debug ? log.DEBUG : log.INFO;
    log.level(conf);
    log.debug(program.opts());
    makeFolders();
    if (program.update) {
        updatePubspec();
    }
}
else {
    console.log(chalk.red('Exiting'));
}
