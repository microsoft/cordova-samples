#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    os = require('os'),
    shelljs = require('shelljs'),
    cwd = process.cwd();

var argv = process.argv.slice(-1);
argv[0] = argv[0].replace('taco_create.js','create_fiori_client.js')
process.argv=argv;

// First run the fiori script
require('./create_fiori_client.js');

console.log('Project created. Migrating content to res/native so platforms do not need to be checked in');

// re-grab config so we have locations
process.chdir(cwd);
var config;
if(argv[0].indexOf('create_fiori_client.js') >= 0) {
    config = require(path.join(cwd,'config.json'));    
} else {
    config = require(argv[0]);    
}
var projectPath = path.resolve(config.targetFolder);
var configxml = path.join(projectPath, 'config.xml');
var res = path.join(projectPath, 'res');
console.log('Project res path: ' + res);

if (config.platforms.indexOf("ios") >= 0) {
    shelljs.cp('-f',  path.join(__dirname, 'assets', 'Root.plist'), constructAndJoin([res, 'native', 'ios', config.appName, 'Resources', 'Settings.bundle']));
    // Move icons and splash screens to standard Cordova location and update config.xml to use correct Cordova elements
    shelljs.cp('-Rf', path.join(__dirname, 'assets', 'ios', 'icons', '*'), constructAndJoin([res,'icons', 'ios']));
    shelljs.cp('-Rf', path.join(__dirname, 'assets', 'ios', 'splash', '*'), constructAndJoin([res,'screens', 'ios']));
    // Update config.xml
    shelljs.sed('-i', '<content src="index.html" />', fs.readFileSync(path.join(__dirname, 'append', 'config-xml-ios-append.txt'),'utf8'), configxml);
}

if (config.platforms.indexOf("android") >= 0) {
    shelljs.cp('-f', path.join(__dirname, 'assets', 'sap-supportability.properties'), constructAndJoin([res, 'native', 'android', 'assets']));
    // Copy modified AndroidManifest.xml
    shelljs.cp('-f', path.join(projectPath, 'platforms', 'android', 'AndroidManifest.xml'), constructAndJoin([res, 'native', 'android']));
    // Move icons to standard Cordova location and update config.xml to use correct Cordova elements
    var iconPath = constructAndJoin([res, 'icons','android']);
    copyIfExists(path.join(__dirname, 'assets', 'android', 'drawable-hdpi', 'icon.png'), path.join(iconPath,'icon-72-hdpi.png'));
    copyIfExists(path.join(__dirname, 'assets', 'android', 'drawable-ldpi', 'icon.png'), path.join(iconPath,'icon-36-ldpi.png'));
    copyIfExists(path.join(__dirname, 'assets', 'android', 'drawable-mdpi', 'icon.png'), path.join(iconPath,'icon-48-mdpi.png'));
    copyIfExists(path.join(__dirname, 'assets', 'android', 'drawable-xhdpi', 'icon.png'), path.join(iconPath,'icon-96-xhdpi.png'));
    copyIfExists(path.join(__dirname, 'assets', 'android', 'drawable-xxhdpi', 'icon.png'), path.join(iconPath,'icon-144-xxhdpi.png'));
    // Move splash screens to standard Cordova location and update config.xml to use correct Cordova elements
    var screenPath = constructAndJoin([res, 'screens','android']);
    copyIfExists(path.join(__dirname, 'assets', 'android', 'drawable-land-hdpi', 'screen.png'), path.join(screenPath,'splash-land-hdpi.png'));
    copyIfExists(path.join(__dirname, 'assets', 'android', 'drawable-land-ldpi', 'screen.png'), path.join(screenPath, 'splash-land-ldpi.png'));
    copyIfExists(path.join(__dirname, 'assets', 'android', 'drawable-land-mdpi', 'screen.png'), path.join(screenPath,'splash-land-mdpi.png'));
    copyIfExists(path.join(__dirname, 'assets', 'android', 'drawable-land-xhdpi', 'screen.png'), path.join(screenPath,'splash-land-xhdpi.png'));
    copyIfExists(path.join(__dirname, 'assets', 'android', 'drawable-land-xxhdpi', 'screen.png'), path.join(screenPath,'splash-land-xxhdpi.png'));
    copyIfExists(path.join(__dirname, 'assets', 'android', 'drawable-port-hdpi', 'screen.png'), path.join(screenPath,'splash-port-hdpi.png'));
    copyIfExists(path.join(__dirname, 'assets', 'android', 'drawable-port-ldpi', 'screen.png'), path.join(screenPath,'splash-port-ldpi.png'));
    copyIfExists(path.join(__dirname, 'assets', 'android', 'drawable-port-mdpi', 'screen.png'), path.join(screenPath,'splash-port-mdpi.png'));
    copyIfExists(path.join(__dirname, 'assets', 'android', 'drawable-port-xhdpi', 'screen.png'), path.join(screenPath,'splash-port-xhdpi.png'));
    copyIfExists(path.join(__dirname, 'assets', 'android', 'drawable-port-xxhdpi', 'screen.png'), path.join(screenPath,'splash-port-xxhdpi.png'));
    // Update config.xml
    shelljs.sed('-i', '<content src="index.html" />', fs.readFileSync(path.join(__dirname, 'append', 'config-xml-android-append.txt'), 'utf8'), configxml);
} 

//Add vs:plugin elements - Technically optional.
shelljs.sed('-i', 'xmlns="http://www.w3.org/ns/widgets"', 'xmlns="http://www.w3.org/ns/widgets" xmlns:vs="http://schemas.microsoft.com/appx/2014/htmlapps"', configxml);
shelljs.sed('-i', '<content src="index.html" />', fs.readFileSync(path.join(__dirname, 'append', 'config-xml-append.txt'),'utf8'), configxml);

// Create taco.json, .cordova/config.json - Technically optional
fs.writeFileSync(path.join(projectPath, 'taco.json') ,'{\n\t"cordova-cli": "5.1.1"\n}', 'utf8');
var dotCordova = path.join(projectPath, '.cordova');
if(!fs.existsSync(dotCordova)) fs.mkdirSync(dotCordova);
var pluginPath = path.resolve(__dirname,'..','..','plugins').replace(/\\/g,'\\\\');
fs.writeFileSync(path.join(projectPath, '.cordova', 'config.json'),'{\n\t"plugin_search_path": "' + pluginPath + '"\n}', 'utf8');

function constructAndJoin(pathList) {
    var outPath;
    pathList.forEach(function(relPath) {
        if(outPath) {
            outPath = path.join(outPath, relPath);
        } else {
            outPath = relPath;
        }
        if(!fs.existsSync(outPath)) fs.mkdirSync(outPath);
    });
    return outPath;
}

function copyIfExists(src, target) {
    if(fs.existsSync(src)) {
        shelljs.cp('-f', src, target);    
    }
}