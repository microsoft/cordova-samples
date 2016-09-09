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
(function () {
    "use strict";

    var client,             // Connection to the Azure Mobile App backend
        todoItemTable;      // Reference to a table endpoint on backend

    // Add an event listener to call our initialization routine when the host is ready
    document.addEventListener('deviceready', onDeviceReady, false);

    /**
     * Event Handler, called when the host is ready
     *
     * @event
     */
    function onDeviceReady() {
        // TODO: Include the connection URL for your Azure Mobile Apps backend
        // TODO: Update CSP <meta> element in config.xml to reference your connected service domain URL.
        client = new WindowsAzure.MobileServiceClient('http://yourmobileapp.azurewebsites.net');

        // Offline sync code
        // Note: Requires at least version 2.0.0-beta6 of the Azure Mobile Apps plugin
        var store = new WindowsAzure.MobileServiceSqliteStore('store.db');

        // Define the local table for offline sync
        store.defineTable({
            name: 'todoitem',
            columnDefinitions: {
                id: 'string',
                text: 'string',
                deleted: 'boolean',
                complete: 'boolean'
            }
        });


        // TODO: Uncomment this code when using authentication (recommended for push, but commented out here)
        // Login to the service.
        // client.login('twitter')
        //    .then(function () {

                // If not using offline sync, uncomment this line of code, and
                // and comment out the offline sync code instead (anything referencing syncContext).
                // todoItemTable = client.getTable('todoitem');

                // Get the sync context from the client
                var syncContext = client.getSyncContext();
                // Initialize the sync context with the store
                syncContext.initialize(store).then(function () {

                    // Get the local table reference.
                    todoItemTable = client.getSyncTable('todoitem' /* table name */);

                    syncContext.pushHandler = {
                        onConflict: function (serverRecord, clientRecord, pushError) {
                            // Handle the conflict
                            console.log("Sync conflict! " + pushError.getError().message);
                        },
                        onError: function (pushError) {
                            // Handle the error
                            // In the simulated offline state, you get "Sync error! Unexpected connection failure."
                            console.log("Sync error! " + pushError.getError().message);
                        }
                    };

                    // Sync local store to Azure table when app loads, or when login complete.
                    syncContext.push().then(function () {
                        /* push complete */

                    });

                    // Pull items from the Azure table after syncing to Azure.
                    syncContext.pull(new WindowsAzure.Query('todoitem' /* table name */));

                    // Refresh the todoItems
                    refreshDisplay();

                    // Wire up the UI Event Handler for the Add Item
                    $('#add-item').submit(addItemHandler);
                    $('#refresh').on('click', refreshDisplay);

                    // Added to register for push notifications.
                    // Comment out this line of code if not using push.
                    registerForPushNotifications();

                });


            // }, handleError);
    }

    // Register for Push Notifications.
    // Requires that the phonegap-plugin-push be installed.
    // TODO: Setup an Azure push notification hub for your Mobile App backend.
    var pushRegistration = null;
    function registerForPushNotifications() {

        pushRegistration = PushNotification.init({
            android: { senderID: '134523967090' },
            ios: { alert: 'true', badge: 'true', sound: 'true' },
            wns: {}
        });

        // Handle the registration event.
        pushRegistration.on('registration', function (data) {
            // Get the native platform of the device.
            var platform = device.platform;
            // Get the handle returned during registration.
            var handle = data.registrationId;
            // Set the device-specific message template.
            if (platform == 'android' || platform == 'Android') {
                // Register for GCM notifications. Requires GCM configuration.
                client.push.register('gcm', handle, {
                    mytemplate: { body: { data: { message: "{$(message)}" } } }
                });
            } else if (device.platform === 'iOS') {
                // Register for APNS notifications. Requires APNS configuration.           
                client.push.register('apns', handle, {
                    mytemplate: { body: { aps: { alert: "{$(message)}" } } }
                });
            } else if (device.platform === 'windows') {
                // Register for WNS notifications. Requires WNS configuration.
                client.push.register('wns', handle, {
                    myTemplate: {
                        body: '<toast><visual><binding template="ToastText01"><text id="1">$(message)</text></binding></visual></toast>',
                        headers: { 'X-WNS-Type': 'wns/toast' } }
                });
            }
        });

        pushRegistration.on('notification', function (data, d2) {
            alert('Push Received: ' + data.message);
        });

        pushRegistration.on('error', handleError);
    }

    /**
     * Refresh the items within the page
     */
    function refreshDisplay() {
        updateSummaryMessage('Loading Data from Azure');

        // Execute a query for uncompleted items and process
        todoItemTable
            .where({ complete: false })     // Set up the query
            .read()                         // Read the results
            .then(createTodoItemList, handleError);
    }

    /**
     * Updates the Summary Message
     * @param {string} msg the message to use
     * @returns {void}
     */
    function updateSummaryMessage(msg) {
        $('#summary').html(msg);
    }

    /**
     * Create the DOM for a single todo item
     * @param {Object} item the Todo Item
     * @param {string} item.id the ID of the item
     * @param {bool} item.complete true if the item is completed
     * @param {string} item.text the text value
     * @returns {jQuery} jQuery DOM object
     */
    function createTodoItem(item) {
        return $('<li>')
            .attr('data-todoitem-id', item.id)
            .append($('<button class="item-delete">Delete</button>'))
            .append($('<input type="checkbox" class="item-complete">').prop('checked', item.complete))
            .append($('<div>').append($('<input class="item-text">').val(item.text)));
    }

    /**
     * Create a list of Todo Items
     * @param {TodoItem[]} items an array of todoitem objects
     * @returns {void}
     */
    function createTodoItemList(items) {
        // Cycle through each item received from Azure and add items to the item list
        var listItems = $.map(items, createTodoItem);
        $('#todo-items').empty().append(listItems).toggle(listItems.length > 0);
        $('#summary').html('<strong>' + items.length + '</strong> item(s)');

        // Wire up the event handlers for each item in the list
        $('.item-delete').on('click', deleteItemHandler);
        $('.item-text').on('change', updateItemTextHandler);
        $('.item-complete').on('change', updateItemCompleteHandler);
    }

    /**
     * Handle error conditions
     * @param {Error} error the error that needs handling
     * @returns {void}
     */
    function handleError(error) {
        var text = error + (error.request ? ' - ' + error.request.status : '');
        console.error(text);
        $('#errorlog').append($('<li>').text(text));
    }

    /**
     * Given a sub-element of an LI, find the TodoItem ID associated with the list member
     *
     * @param {DOMElement} el the form element
     * @returns {string} the ID of the TodoItem
     */
    function getTodoItemId(el) {
        return $(el).closest('li').attr('data-todoitem-id');
    }

    /**
     * Event handler for when the user enters some text and clicks on Add
     * @param {Event} event the event that caused the request
     * @returns {void}
     */
    function addItemHandler(event) {
        var textbox = $('#new-item-text'),
            itemText = textbox.val();

        updateSummaryMessage('Adding New Item');
        if (itemText !== '') {
            todoItemTable.insert({
                text: itemText,
                complete: false
            }).then(refreshDisplay, handleError);
        }

        textbox.val('').focus();
        event.preventDefault();
    }

    /**
     * Event handler for when the user clicks on Delete next to a todo item
     * @param {Event} event the event that caused the request
     * @returns {void}
     */
    function deleteItemHandler(event) {
        var itemId = getTodoItemId(event.currentTarget);

        updateSummaryMessage('Deleting Item in Azure');
        todoItemTable
            .del({ id: itemId })   // Async send the deletion to backend
            .then(refreshDisplay, handleError); // Update the UI
        event.preventDefault();
    }

    /**
     * Event handler for when the user updates the text of a todo item
     * @param {Event} event the event that caused the request
     * @returns {void}
     */
    function updateItemTextHandler(event) {
        var itemId = getTodoItemId(event.currentTarget),
            newText = $(event.currentTarget).val();

        updateSummaryMessage('Updating Item in Azure');
        todoItemTable
            .update({ id: itemId, text: newText })  // Async send the update to backend
            .then(refreshDisplay, handleError); // Update the UI
        event.preventDefault();
    }

    /**
     * Event handler for when the user updates the completed checkbox of a todo item
     * @param {Event} event the event that caused the request
     * @returns {void}
     */
    function updateItemCompleteHandler(event) {
        var itemId = getTodoItemId(event.currentTarget),
            isComplete = $(event.currentTarget).prop('checked');

        updateSummaryMessage('Updating Item in Azure');
        todoItemTable
            .update({ id: itemId, complete: isComplete })  // Async send the update to backend
            .then(refreshDisplay, handleError);        // Update the UI
    }
})();