(function () {
    'use strict';

    angular.module("xPlat.services")
        .factory("guidGenerator", function () {
            var generatePart = function () {
                var guidPartNumber = (Math.random() * 0x10000) | 0;
                return (guidPartNumber + 0x10000).toString(16).substring(1).toUpperCase();
            };

            return function() {
                return generatePart()
                    + generatePart()
                    + "-"
                    + generatePart()
                    + "-"
                    + generatePart()
                    + "-"
                    + generatePart()
                    + "-"
                    + generatePart()
                    + generatePart()
                    + generatePart();
            };
        })
        .factory("localStorage", ['$q', "$window", "guidGenerator", function ($q, $window, guidGenerator) {
            var localStorageKey = "toDoItems";

            var loadFromStorage = function () {
                return angular.fromJson($window.localStorage.getItem(localStorageKey)) || [];
            };

            var saveToStorage = function(items) {
                $window.localStorage.setItem(localStorageKey, angular.toJson(items));
            }

            return {
                getAll: function () {
                    return loadFromStorage();
                },

                create: function (text, address) {
                    var item = {
                        id: guidGenerator(),
                        text: text,
                        address: address,
                        done: false
                    }
                    var items = loadFromStorage();
                    items.push(item);
                    saveToStorage(items);
                    return $q.when(item);
                },

                update: function (item) {
                    var items = loadFromStorage();
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].id === item.id) {
                            items[i] = item;
                            break;
                        }
                    }

                    saveToStorage(items);
                    return $q.when(item);
                },

                del: function (item) {
                    var items = loadFromStorage();
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].id === item.id) {
                            items.splice(i, 1);
                            break;
                        }
                    }

                    saveToStorage(items);
                    return $q.when(item);
                }
            }
        }])
        .factory("azureStorage", ["$q", "$resource", "$rootScope", "guidGenerator", function ($q, $resource, $rootScope, guidGenerator) {
            var azureMobileServicesInstallationId = guidGenerator();
            var azureMobileServicesKey = ''; // Add your Azure Mobile Service Application Key
            var azureMobileServicesAddress = ''; // Add your Azure Mobile Service Application URL
            var azureMobileServicesTableAddress = azureMobileServicesAddress + 'tables/todoitem/:id';
            var headers = {
                'X-ZUMO-APPLICATION': azureMobileServicesKey,
                'X-ZUMO-INSTALLATION-ID': azureMobileServicesInstallationId,
                'X-ZUMO-VERSION': 'ZUMO/1.0 (lang=Web; os=--; os_version=--; arch=--; version=1.0.20218.0)',
                'Content-Type':'application/json'
            };

            var toDoItem = $resource(azureMobileServicesTableAddress, { id: '@id' }, {
                'query': {
                    method: 'GET',
                    params: { $top: '1000' },
                    isArray: true,
                    headers: headers
                },
                'delete': {
                    method: 'DELETE',
                    headers: headers
                },
                'save': {
                    method: 'POST',
                    headers: headers
                },
                'update': {
                    method: 'PATCH',
                    headers: headers
                }
            });


            var azureStorage = {
                getAll: function () {
                    return toDoItem.query();
                },

                create: function (text, address) {
                    var item = new toDoItem({
                        text: text,
                        address: address,
                        done: false
                    });

                    return item.$save();
                },

                update: function (item) {
                    return item.$update();
                },

                del: function (item) {
                    return item.$delete();
                },
            };

            Object.defineProperty(azureStorage, "isAvailable", {
                enumerable: false,
                get : function(){ return azureMobileServicesKey && azureMobileServicesAddress; },
            });

            return azureStorage;
        }])
        .factory("storage", ["$injector", function($injector) {
            var azureService = $injector.get('azureStorage');
            return azureService.isAvailable ? azureService : $injector.get('localStorage');
        }])
        .factory("maps", ["$rootScope", "$q", "$window", "$resource", "cordova", function ($rootScope, $q, $window, $resource, cordova) {
            var key = ''; // Add your Bing Maps API key
            var url = 'http://dev.virtualearth.net/REST/v1/Locations/:latitude,:longitude?key='+key;

            return {
                getCurrentPosition: function () {
                    return cordova.ready.then(function () {
                        var deferred = $q.defer();
                        $window.navigator.geolocation.getCurrentPosition(function (successValue) {
                            $rootScope.$apply(function () {
                                deferred.resolve(successValue);
                            });
                        }, function (errorValue) {
                            $rootScope.$apply(function () {
                                deferred.reject(errorValue);
                            });
                        });

                        return deferred.promise;
                    });
                },

                getAddressFromPosition: function (position) {
                    return $resource(url, {})
                        .get({ latitude: position.coords.latitude, longitude: position.coords.longitude })
                        .$promise.then(function(response) {
                            return response.resourceSets[0].resources[0].address.formattedAddress;
                        }, function (error) {
                            return position.coords.latitude + "," + position.coords.longitude
                        });
                }
            }
        }])
        .factory("cordova", ['$q', "$window", "$timeout", function ($q, $window, $timeout) {
            var deferred = $q.defer();
            var resolved = false;

            document.addEventListener('deviceready', function () {
                resolved = true;
                deferred.resolve($window.cordova);
            }, false);

            $timeout(function () {
                if (!resolved && $window.cordova) {
                    deferred.resolve($window.cordova);
                }
            });

            return { ready: deferred.promise };
        }]);
})();