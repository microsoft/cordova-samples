///<reference path='..\ts\winjs.d.ts'/>
///<reference path='..\ts\mobileservices.d.ts'/>

module Xplat {
    "use strict";

    export var app: XplatApplication;

    export class XplatApplication {
        appEvents: ApplicationEvents;

        constructor() {
            this.appEvents = new ApplicationEvents();
        }

        initialize() {
            this.bindEvents();

            // TODO: Perform any additional initialization here that does not require Cordova.
        }

        bindEvents() {
            // Handle the Cordova deviceready event.
            document.addEventListener('deviceready', this.appEvents.onDeviceReady.bind(this.appEvents), false);

            // TODO: bind any additional required events such as 'loaded', 'online' or 'offline'
        }
    }

    export class ApplicationEvents {
        onDeviceReady() {
            // Handle the Cordova pause and resume events
            document.addEventListener('pause', this.onPause, false);
            document.addEventListener('resume', this.onResume, false);

            dataSource.refresh();
            WinJS.UI.processAll();
        }

        onPause() {
            // TODO: This application has been suspended. Save application state here.
        }

        onResume() {
            // TODO: This application has been reactivated. Restore application state here.
        }

        refreshTodoItems() {

        }

        handleError(error) {

        }

    }

    app = new XplatApplication();

    window.onload = function () {
        app.initialize();
    }
}