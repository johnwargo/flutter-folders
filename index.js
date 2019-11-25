#!/usr/bin/env node
"use strict";
// Load the modules we'll need
var chalk = require('chalk');
var shell = require('shelljs');
// Application constants
var pubSpec = 'pubspec.yaml';
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
// Make sure this is a Flutter project
// Create the folders we need
// Update the `pubspec.yaml` to point to the assets folders
