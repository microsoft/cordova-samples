///<reference path='winjs.d.ts'/>

module Xplat {
    "use strict";

    export module Storage {
        var azureMobileServicesKey = ''; // Add your Azure Mobile Service Application Key
        var azureMobileServicesAddress = ''; // Add your Azure Mobile Service Application URL

        export function getAllToDoItems(): WinJS.Promise {
            return storageImplementation.getAll();
        }

        export function insert(toDoItem: ToDoItem): WinJS.Promise {
            return storageImplementation.insert(toDoItem);
        }

        export function update(toDoItem: ToDoItem): WinJS.Promise {
            return storageImplementation.update(toDoItem);
        }

        export function del(toDoItem: ToDoItem): WinJS.Promise {
            return storageImplementation.del(toDoItem);
        }

        interface IStorageImplementation {
            getAll(): WinJS.Promise;
            insert(item: ToDoItem): WinJS.Promise;
            update(item: ToDoItem): WinJS.Promise;
            del(item: ToDoItem): WinJS.Promise;
        }

        class LocalStorageImplementation implements IStorageImplementation {
            private static _localStorageKey: string = 'toDoItems';

            getAll(): WinJS.Promise {
                return WinJS.Promise.as(this._loadFromStorage());
            }

            insert(item: ToDoItem): WinJS.Promise {
                item.id = LocalStorageImplementation._generateGuid();
                var items = this._loadFromStorage();
                items.push(item);
                this._saveToStorage(items);
                return WinJS.Promise.as(item);
            }

            update(item: ToDoItem): WinJS.Promise {
                var items = this._loadFromStorage();
                for (var i = 0; i < items.length; i++) {
                    if (items[i].id === item.id) {
                        items[i] = item;
                        break;
                    }
                }

                this._saveToStorage(items);
                return WinJS.Promise.as(item);
            }

            del(item: ToDoItem): WinJS.Promise {
                var items = this._loadFromStorage();
                for (var i = 0; i < items.length; i++) {
                    if (items[i].id === item.id) {
                        items.splice(i, 1);
                        break;
                    }
                }

                this._saveToStorage(items);
                return WinJS.Promise.as(null);
            }

            private _loadFromStorage(): ToDoItem[] {
                return JSON.parse(window.localStorage.getItem(LocalStorageImplementation._localStorageKey)) || [];
            }

            private _saveToStorage(items: ToDoItem[]): void {
                window.localStorage.setItem(LocalStorageImplementation._localStorageKey, JSON.stringify(items));
            }

            private static _generateGuid(): string {
                return LocalStorageImplementation._generateGuidPart()
                    + LocalStorageImplementation._generateGuidPart()
                    + "-"
                    + LocalStorageImplementation._generateGuidPart()
                    + "-"
                    + LocalStorageImplementation._generateGuidPart()
                    + "-"
                    + LocalStorageImplementation._generateGuidPart()
                    + "-"
                    + LocalStorageImplementation._generateGuidPart()
                    + LocalStorageImplementation._generateGuidPart()
                    + LocalStorageImplementation._generateGuidPart();
            }

            private static _generateGuidPart(): string {
                var guidPartNumber = (Math.random() * 0x10000) | 0;
                return (guidPartNumber + 0x10000).toString(16).substring(1).toUpperCase();
            }
        }

        class WindowsAzureStorageImplementation implements IStorageImplementation {
            private _client: WindowsAzure.MobileServiceClient;
            private _toDoItemsTable: WindowsAzure.MobileServicesTable;

            constructor(address: string, key: string) {
            }

            getAll(): WinJS.Promise {
                this._ensureToDoItemsTable();
                return this._toDoItemsTable.take(1000).read();
            }

            insert(item: ToDoItem): WinJS.Promise {
                return this._toDoItemsTable.insert(item);
            }

            update(item: ToDoItem): WinJS.Promise {
                return this._toDoItemsTable.update(item);
            }

            del(item: ToDoItem): WinJS.Promise {
                return this._toDoItemsTable.del(item);
            }

            private _ensureToDoItemsTable(): void {
                if (!this._toDoItemsTable) {
                    this._client = new WindowsAzure.MobileServiceClient(azureMobileServicesAddress, azureMobileServicesKey);
                    this._toDoItemsTable = this._client.getTable("todoitem");
                }
            }
        }

        var storageImplementation: IStorageImplementation = (azureMobileServicesKey && azureMobileServicesAddress)
            ? new WindowsAzureStorageImplementation(azureMobileServicesAddress, azureMobileServicesKey)
            : new LocalStorageImplementation();
    }

    export module Maps {
        var key = ''; //Add your Bing Maps API key

        export function getCurrentPosition(): WinJS.Promise {
            return new WinJS.Promise((completed, error) => { navigator.geolocation.getCurrentPosition(completed, error); });
        }

        export function getAddressFromPosition(position: Position): WinJS.Promise {
            var url = 'http://dev.virtualearth.net/REST/v1/Locations/' + position.coords.latitude + ',' + position.coords.longitude + '?key=' + key;
            return WinJS.xhr({ responseType: 'text', url: url })
                .then(
                (response) => parseRestResponse(response).resourceSets[0].resources[0].address.formattedAddress,
                (error) => position.coords.latitude + "," + position.coords.longitude
                );
        }

        function parseRestResponse(response): RestResponse {
            return <RestResponse>JSON.parse(response.responseText);
        }

        class RestResponse {
            authenticationResultCode: string;
            brandLogoUri: string;
            copyright: string;
            resourceSets: ResourceSet[];
            statusCode: number;
            statusDescription: string;
            traceId: string;
        }

        class ResourceSet {
            estimatedTotal: number;
            resources: Resource[];
        }

        class Resource {
            address: Address;
            bbox: number[];
            confidence: string
            entityType: string;
            geocodePoints: GeocodePoint;
            matchCodes: string;
            name: string;
            point: Point;
        }

        class Address {
            addressLine: string;
            adminDistrict: string;
            adminDistrict2: string;
            countryRegion: string;
            formattedAddress: string;
            locality: string;
            postalCode: string;
        }

        class GeocodePoint {
            calculationMethod: string;
            coordinates: number[];
            type: string;
            usageTypes: string[];
        }

        class Point {
            coordinates: number[];
            type: string;
        }
    }
}
