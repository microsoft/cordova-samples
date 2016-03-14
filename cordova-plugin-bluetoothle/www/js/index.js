/// <reference path="../../plugins/cordova-plugin-bluetoothle/www/bluetoothle.js" />
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var foundDevices = [];

document.addEventListener('deviceready', function () {

    new Promise(function (resolve, reject) {

        bluetoothle.initialize(resolve, reject,
            { request: true, statusReceiver: false });

    }).then(initializeSuccess, handleError);

});

function initializeSuccess(result) {

    if (result.status === "enabled") {

        log("Bluetooth is enabled.");
        log(result);
    }

    else {

        document.getElementById("start-scan").disabled = true;

        log("Bluetooth is not enabled:", "status");
        log(result, "status");
    }
}

function startScan() {

    log("Starting scan for devices...", "status");
    
    foundDevices = [];

    document.getElementById("devices").innerHTML = "";
    document.getElementById("services").innerHTML = "";
    document.getElementById("output").innerHTML = "";

    if (window.cordova.platformId === "windows") {

        bluetoothle.retrieveConnected(retrieveConnectedSuccess, handleError, {});
    }
    else {

        bluetoothle.startScan(startScanSuccess, handleError, { services: [] });
    }
}

function retrieveConnectedSuccess(result) {

    log("retrieveConnectedSuccess()");
    log(result);

    result.forEach(function (device) {

        addDevice(device.name, device.address);

    });
}

function startScanSuccess(result) {

    log("startScanSuccess(" + result.status + ")");

    if (result.status === "scanStarted") {

        log("Scanning for devices (will continue to scan until you select a device)...", "status");
    }
    else if (result.status === "scanResult") {

        if (!foundDevices.some(function (device) {

            return device.address === result.address;

        })) {

            log('FOUND DEVICE:');
            log(result);
            foundDevices.push(result);
            addDevice(result.name, result.address);
        }
    }
}

function addDevice(name, address) {

    var button = document.createElement("button");
    button.style.width = "100%";
    button.style.padding = "10px";
    button.style.fontSize = "16px";
    button.textContent = name + ": " + address;

    button.addEventListener("click", function () {

        document.getElementById("services").innerHTML = "";
        connect(address);
    });

    document.getElementById("devices").appendChild(button);
}

function connect(address) {

    log('Connecting to device: ' + address + "...", "status");

    if (cordova.platformId === "windows") {

        getDeviceServices(address);

    }
    else {

        stopScan();

        new Promise(function (resolve, reject) {

            bluetoothle.connect(resolve, reject, { address: address });

        }).then(connectSuccess, handleError);

    }
}

function connectSuccess(result) {

    log("- " + result.status);

    if (result.status === "connected") {

        getDeviceServices(result.address);
    }
    else if (result.status === "disconnected") {

        log("Disconnected from device: " + result.address, "status");
    }
}

function getDeviceServices(address) {

    log("Getting device services...", "status");

    var platform = window.cordova.platformId;

    if (platform === "android") {

        new Promise(function (resolve, reject) {

            bluetoothle.discover(resolve, reject,
                { address: address });

        }).then(discoverSuccess, handleError);

    }
    else if (platform === "windows") {

        new Promise(function (resolve, reject) {

            bluetoothle.services(resolve, reject,
                { address: address });

        }).then(servicesSuccess, handleError);

    }
    else {

        log("Unsupported platform: '" + window.cordova.platformId + "'", "error");
    }
}

function servicesSuccess(result) {

    log("servicesSuccess()");
    log(result);

    if (result.status === "services") {

        var readSequence = result.services.reduce(function (sequence, service) {

            return sequence.then(function () {

                console.log('Executing promise for service: ' + service);

                new Promise(function (resolve, reject) {

                    bluetoothle.characteristics(resolve, reject,
                        { address: result.address, service: service });

                }).then(characteristicsSuccess, handleError);

            }, handleError);

        }, Promise.resolve());

        // Once we're done reading all the values, disconnect
        readSequence.then(function () {

            new Promise(function (resolve, reject) {

                bluetoothle.disconnect(resolve, reject,
                    { address: result.address });

            }).then(connectSuccess, handleError);

        });
    }


    if (result.status === "services") {

        result.services.forEach(function (service) {

            new Promise(function (resolve, reject) {

                bluetoothle.characteristics(resolve, reject,
                    { address: result.address, service: service });

            }).then(characteristicsSuccess, handleError);

        });

    }
}

function characteristicsSuccess(result) {

    log("characteristicsSuccess()");
    log(result);

    if (result.status === "characteristics") {

        return addService(result.address, result.service, result.characteristics);
    }
}

function addService(address, serviceUuid, characteristics) {

    log('Adding service ' + serviceUuid + '; characteristics:');
    log(characteristics);

    var readSequence = Promise.resolve();

    var wrapperDiv = document.createElement("div");
    wrapperDiv.className = "service-wrapper";

    var serviceDiv = document.createElement("div");
    serviceDiv.className = "service";
    serviceDiv.textContent = uuids[serviceUuid] || serviceUuid;
    wrapperDiv.appendChild(serviceDiv);

    characteristics.forEach(function (characteristic) {

        var characteristicDiv = document.createElement("div");
        characteristicDiv.className = "characteristic";

        var characteristicNameSpan = document.createElement("span");
        characteristicNameSpan.textContent = (uuids[characteristic.uuid] || characteristic.uuid) + ":";
        characteristicDiv.appendChild(characteristicNameSpan);

        characteristicDiv.appendChild(document.createElement("br"));

        var characteristicValueSpan = document.createElement("span");
        characteristicValueSpan.id = serviceUuid + "." + characteristic.uuid;
        characteristicValueSpan.style.color = "blue";
        characteristicDiv.appendChild(characteristicValueSpan);

        wrapperDiv.appendChild(characteristicDiv);

        readSequence = readSequence.then(function () {
           
            return new Promise(function (resolve, reject) {

                bluetoothle.read(resolve, reject,
                    { address: address, service: serviceUuid, characteristic: characteristic.uuid });

            }).then(readSuccess, handleError);

        });
    });

    document.getElementById("services").appendChild(wrapperDiv);

    return readSequence;
}

function discoverSuccess(result) {

    log("Discover returned with status: " + result.status);

    if (result.status === "discovered") {

    var readSequence = result.services.reduce(function (sequence, service) {

        return sequence.then(function () {

            return addService(result.address, service.uuid, service.characteristics);
        });

    }, Promise.resolve());

    readSequence.then(function () {

        new Promise(function (resolve, reject) {

            bluetoothle.disconnect(resolve, reject,
                { address: result.address });

        }).then(connectSuccess, handleError);

    });

    }
}

function readSuccess(result) {

    log("readSuccess():");
    log(result);

    if (result.status === "read") {

        reportValue(result.service, result.characteristic, window.atob(result.value));
    }
}

function reportValue(serviceUuid, characteristicUuid, value) {

    document.getElementById(serviceUuid + "." + characteristicUuid).textContent = value;
}

// Stop scanning for bluetoothle devices.
function stopScan() {

    new Promise(function (resolve, reject) {

        bluetoothle.storpScan(resolve, reject,
            { address: result.address });

    }).then(stopScanSuccess, handleError);
}

function stopScanSuccess() {

    if (!foundDevices.length) {

        log("NO DEVICES FOUND");
    }
    else {

        log("Found " + foundDevices.length + " devices.", "status");
    }
}

function log(msg, level) {

    level = level || "log";

    if (typeof msg === "object") {

        msg = JSON.stringify(msg, null, "  ");
    }

    console.log(msg);

    if (level === "status" || level === "error") {

        var msgDiv = document.createElement("div");
        msgDiv.textContent = msg;

        if (level === "error") {

            msgDiv.style.color = "red";
        }

        msgDiv.style.padding = "5px 0";
        msgDiv.style.borderBottom = "rgb(192,192,192) solid 1px";
        document.getElementById("output").appendChild(msgDiv);
    }
}
// click event handler for start scan
document.getElementById("start-scan").addEventListener("click", function () {

    startScan();

});

function handleError(error) {

    var msg;

    if (error.error && error.message) {

        var errorItems = [];

        if (error.service) {

            errorItems.push("service: " + (uuids[error.service] || error.service));
        }

        if (error.characteristic) {

            errorItems.push("characteristic: " + (uuids[error.characteristic] || error.characteristic));
        }

        msg = "Error on " + error.error + ": " + error.message + (errorItems.length && (" (" + errorItems.join(", ") + ")"));
    }

    else {

        msg = error;
    }

    log(msg, "error");

    if (error.error === "read" && error.service && error.characteristic) {

        reportValue(error.service, error.characteristic, "Error: " + error.message);
    }
}
