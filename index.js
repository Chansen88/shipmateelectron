'use strict';

const path = require('path');
const electron = require('electron');
const ipc = require('ipc');
const app = require('app');
const BrowserWindow = require('browser-window');
const menubar = require('menubar');

require('fix-path')();

const opts = {
  dir: __dirname,
  height: 600,
  icon: path.join(__dirname, 'images', 'Icon.png')
};

const mb = menubar(opts);

let insertWindow = null;

function createPackageWindow(packageData) {
  insertWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    show: false,
    frame: true
  });

  if (packageData.service === 'UPS') {
    insertWindow.loadURL('https://wwwapps.ups.com/WebTracking/track?track=yes&trackNums=' + packageData.id + '&loc=en_us');
  } else if (packageData.service === 'USPS') {
    insertWindow.loadURL('https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=' + packageData.id);
  } else if (packageData.service === 'FEDEX') {
    insertWindow.loadURL('https://www.fedex.com/apps/fedextrack/?tracknumbers=' + packageData.id + '&language=en&cntry_code=us');
  }

  insertWindow.on('closed',function() {
    insertWindow = null;
  });
}

mb.on('ready', function() {

  ipc.on('toggle-package-view', function(event, packageData) {
      packageData = JSON.parse(packageData);
      createPackageWindow(packageData);
      return (insertWindow.show());
  });

});

mb.on('after-create-window', function() {
  mb.window.loadURL('https://nameless-gorge-4169.herokuapp.com/');
  mb.window.openDevTools()
});
