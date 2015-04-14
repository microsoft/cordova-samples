/***
    Copyright (c) Microsoft. All rights reserved.  Licensed under the MIT license. See LICENSE file in the project root for full license information.
*/

module Todo {
  "use strict";

  /** A union of the differing promise types from WinJs and Azure */
  type Promise = Microsoft.WindowsAzure.asyncPromise | WinJS.Promise<any>;

  export module Storage {
    /**
     * The key for your Azure Mobile Service
     * TODO: Add your application key
     */
    var AZURE_MOBILE_SERVICES_KEY = '';

    /**
     * The URL for your Azure Mobile Service
     * TODO: Add your application URL
     */
    var AZURE_MOBILE_SERVICES_URL = '';

    /**
     * Get all items from storage
     * @return A promise that wraps a list of todo items
     */
    export function getAllToDoItems(): Promise {
      return storageImplementation.getAll();
    }

    /**
     * Insert an item into storage
     * @param toDoItem The item to insert
     * @return A promise to insert the item wrapping the inserted item
     */
    export function insert(toDoItem: ToDoItem): Promise {
      return storageImplementation.insert(toDoItem);
    }

    /**
     * Update an item in the backend 
     * @param toDoItem The item to update
     * @return A promise to update the item wrapping the updated item
     */
    export function update(toDoItem: ToDoItem): Promise {
      return storageImplementation.update(toDoItem);
    }

    /**
     * Delete an item from the storage backend.
     * @param toDoItem The item to delete
     * @return A promise to delete the item wrapping a null value
     */
    export function del(toDoItem: ToDoItem): Promise {
      return storageImplementation.del(toDoItem);
    }

    /**
     * Defines how to get, save, update, and delete items from storage
     */
    interface IStorageImplementation {
      getAll(): Promise;
      insert(item: ToDoItem): Promise;
      update(item: ToDoItem): Promise;
      del(item: ToDoItem): Promise;
    }

    /**
     * Provides a localStorage-backed API
     */
    class LocalStorageImplementation implements IStorageImplementation {
      /**
       * The key that the array will be stringified and stored under.
       */
      private static _localStorageKey: string = 'toDoItems';

      /**
       * Get all the items from local storage
       * @return An array of all the items
       */
      getAll(): WinJS.IPromise<ToDoItem[]> {
        return WinJS.Promise.as(this._loadFromStorage());
      }

      /**
       * Insert an item to local storage
       * @param item The item to insert
       * @return A promise that wraps the inserted item
       */
      insert(item: ToDoItem): WinJS.Promise<ToDoItem> {
        item.id = LocalStorageImplementation._generateGuid();
        var items = this._loadFromStorage();
        items.push(item);
        this._saveToStorage(items);
        return WinJS.Promise.as(item);
      }

      /**
       * Update an item in local storage
       * @param item The item to update
       * @return A promise that wraps the updated item
       */
      update(item: ToDoItem): WinJS.Promise<ToDoItem> {
        var items = this._loadFromStorage();
        for (var i = 0; i < items.length; i++) {
          // Loop through the array and replace the item that matches
          if (items[i].id === item.id) {
            items[i] = item;
            break;
          }
        }

        this._saveToStorage(items);
        return WinJS.Promise.as(item);
      }

      /**
       * Delete an item from local storage
       * @param item The item to delete
       * @return A WinJS promise that wraps null
       */
      del(item: ToDoItem): WinJS.IPromise<ToDoItem> {
        var items = this._loadFromStorage();
        // Loop through the array of items and remove the item that matches.
        for (var i = 0; i < items.length; i++) {
          if (items[i].id === item.id) {
            items.splice(i, 1);
            break;
          }
        }

        // Send the updated items array back to local storage
        this._saveToStorage(items);
        return WinJS.Promise.as(null);
      }

      /**
       * Get all items from local storage.
       * @return An array of all items stored in local storage (or an empty array if nothing was stored).
       */
      private _loadFromStorage(): ToDoItem[] {
        return JSON.parse(window.localStorage.getItem(LocalStorageImplementation._localStorageKey)) || [];
      }

      /**
       * Save items to local storage
       */
      private _saveToStorage(items: ToDoItem[]): void {
        window.localStorage.setItem(LocalStorageImplementation._localStorageKey, JSON.stringify(items));
      }

      /**
       * Get a random GUID
       * @return A string guid with no enclosing punctuation (ex. 5BCC1397-7B39-4860-4A20-7346C492F788)
       */
      private static _generateGuid(): string {
        return [
          this._generateGuidPart(),
          this._generateGuidPart(),
          '-',
          this._generateGuidPart(),
          '-',
          this._generateGuidPart(),
          '-',
          this._generateGuidPart(),
          '-',
          this._generateGuidPart(),
          this._generateGuidPart(),
          this._generateGuidPart()
        ].join('');
      }

      /**
       * Helper for generating a GUID.
       * @return A random four character uppercase hex string.
       */
      private static _generateGuidPart(): string {
        var guidPartNumber = (Math.random() * 0x10000) | 0;
        return (guidPartNumber + 0x10000).toString(16).substring(1).toUpperCase();
      }
    }

    /**
     * Storage wrapper for reading and saving items to the todoitem table.
     * TODO(adamre): Shouldn't this constructable against any table?
     */
    class WindowsAzureStorageImplementation implements IStorageImplementation {
      /**
       * The Mobile Services API client library
       */
      private _client: Microsoft.WindowsAzure.MobileServiceClient;
      /**
       * The reference to the Mobile Services table
       */
      private _toDoItemsTable: Microsoft.WindowsAzure.MobileServiceTable;

      /**
       * Get 1000 items from the todoitem table
       * @return An Azure promise for the read operation
       */
      getAll(): Microsoft.WindowsAzure.asyncPromise {
        this._ensureToDoItemsTable();
        return this._toDoItemsTable.take(1000).read();
      }

      /**
       * Insert an item into the todoitem table
       * @param item The item to insert into the table
       * @return An Azure promise for the insert operation
       */
      insert(item: ToDoItem): Microsoft.WindowsAzure.asyncPromise {
        return this._toDoItemsTable.insert(item);
      }

      /**
       * Update an item in the todoitem table
       * @param item The item to update it the table
       * @return An Azure promise for the update operation
       */
      update(item: ToDoItem): Microsoft.WindowsAzure.asyncPromise {
        return this._toDoItemsTable.update(item);
      }

      /**
       * Delete an item in the todoitem table
       * @param item The item to remove
       * @return An Azure promise for the delete operation
       */
      del(item: ToDoItem): Microsoft.WindowsAzure.asyncPromise {
        return this._toDoItemsTable.del(item);
      }

      /**
       * Make sure we have a table to work against
       * TODO(adamre): Shouldn't this be done in the constructor?
       */
      private _ensureToDoItemsTable(): void {
        if (!this._toDoItemsTable) {
          this._client = new WindowsAzure.MobileServiceClient(AZURE_MOBILE_SERVICES_URL, AZURE_MOBILE_SERVICES_KEY);
          this._toDoItemsTable = this._client.getTable("todoitem");
        }
      }
    }

    var storageImplementation: IStorageImplementation = (AZURE_MOBILE_SERVICES_KEY && AZURE_MOBILE_SERVICES_URL)
      ? new WindowsAzureStorageImplementation()
      : new LocalStorageImplementation();
  }

  /**
   * The Bing Maps API
   */
  export module Maps {
    var BING_MAPS_KEY = ''; //Add your Bing Maps API key

    /**
     * Get the current position as a promise from the window's navigator object.
     * @return A WinJS promise that resolves the current position.
     */
    export function getCurrentPosition(): WinJS.Promise<Position> {
      return new WinJS.Promise((completed, error) => {
        navigator.geolocation.getCurrentPosition(completed, error);
      });
    }

    /**
     * Call the Bing Maps API to get an address from a position.
     * @param position The position to get an address for.
     * @return A WinJS promise that resolves the address to a string on API call success or the plain coordinates on failure.
     */
    export function getAddressFromPosition(position: Position): WinJS.Promise<string> {
      var url = [
        'http://dev.virtualearth.net/REST/v1/Locations/',
        position.coords.latitude,
        ',',
        position.coords.longitude,
        '?key=',
        BING_MAPS_KEY
      ].join("");
      return WinJS.
        xhr({ responseType: 'text', url: url }).
        then(
          response => parseRestResponse(response).resourceSets[0].resources[0].address.formattedAddress,
          error => position.coords.latitude + ',' + position.coords.longitude
        );
    }

    /**
     * Helper to convert the Bing reponse from the XMLHttpRequest to a RestResponse object.
     * @param response The response from querying the Bing server.
     * @return The parsed JSON cast to a RestResponse.
     */
    function parseRestResponse(response: XMLHttpRequest): RestResponse {
      return <RestResponse>JSON.parse(response.responseText);
    }

    /**
     * Bing Maps' API response
     */
    class RestResponse {
      /**
       * A status code that offers additional information about authentication success or failure.
       */
      authenticationResultCode: string;

      /**
       * A URL that references a brand image to support contractual branding requirements.
       */
      brandLogoUri: string;

      /**
       * A copyright notice.
       */
      copyright: string;

      /**
       * A collection of ResourceSet objects. A ResourceSet is a container of Resources returned by the request.
       */
      resourceSets: ResourceSet[];

      /**
       * The HTTP Status code for the request.
       */
      statusCode: number;

      /**
       * A description of the HTTP status code.
       */
      statusDescription: string;

      /**
       * A unique identifier for the request.
       */
      traceId: string;
    }

    /** A container for Resources. */
    class ResourceSet {
      /** An estimate of the total number of resources in the ResourceSet. */
      estimatedTotal: number;

      /** A collection of one or more resources. The resources that are returned depend on the request. */
      resources: Resource[];
    }

    /**
     * A Location resource. See https://msdn.microsoft.com/en-us/library/ff701725.aspx
     */
    class Resource {
      /**
       * The name of the resource
       */
      name: string;

      /**
       * The latitude and longitude coordinates of the location. 
       */
      point: Point;

      /**
       * A geographic area that contains the location. A bounding box contains SouthLatitude,
       * WestLongitude, NorthLatitude, and EastLongitude values in units of degrees.
       */
      bbox: number[];

      /**
       * The classification of the geographic entity returned, such as Address.
       */
      entityType: string;

      /**
       * The postal address for the location.
       */
      address: Address;

      /**
       * The level of confidence that the geocoded location result is a match.
       * One of the following values: High, Medium, Low
       */
      confidence: string;

      /**
       * One or more match code values that represent the geocoding level for each location in the response.
       */
      matchCodes: string;
      /**
       * A collection of geocoded points that differ in how they were calculated and their suggested use.
       */
      geocodePoints: GeocodePoint;
    }

    /**
     * Details about a point on the Earth that has additional location information.
     */
    class Address {
      /**
       * The official street line of an address relative to the area, as specified by the Locality,
       * or PostalCode, properties. Typical use of this element would be to provide a street address
       * or any official address.
       */
      addressLine: string;

      /**
       * A string specifying the populated place for the address. This typically refers to a city,
       * but may refer to a suburb or a neighborhood in certain countries.
       */
      locality: string;

      /**
       * A string specifying the neighborhood for an address. You must specify includeNeighborhood=1
       * in your request to return the neighborhood.
       */
      neighborhood: string;

      /**
       * A string specifying the subdivision name in the country or region for an address. This
       * element is typically treated as the first order administrative subdivision, but in some
       * cases it is the second, third, or fourth order subdivision in a country, dependency, or
       * region.
       */
      adminDistrict: string;

      /** A string specifying the subdivision name in the country or region for an address. This
       * element is used when there is another level of subdivision information for a location,
       * such as the county.
       */
      adminDistrict2: string;

      /**
       * A string specifying the complete address. This address may not include the country or region.
       */
      formattedAddress: string;

      /**
       * A string specifying the post code, postal code, or ZIP Code of an address.
       */
      postalCode: string;

      /**
       * A string specifying the country or region name of an address.
       */
      countryRegion: string;

      /**
       * A string specifying the two-letter ISO country code. You must specify include=ciso2 in your request to return this ISO country code.
       */
      countryRegionIso2: string;

      /**
       * A string specifying the name of the landmark when there is a landmark associated with an address.
       */
      landmark: string;
    }

    /**
     * Container for points. See https://msdn.microsoft.com/en-us/library/ff701725.aspx
     */
    class GeocodePoint {
      /**
       * The latitude and longitude coordinates of the geocode point. 
       */
      point: Point;

      /**
       * The method that was used to compute the geocode point. 
       * One of the following: Interpolation, InterpolationOffset, Parcel, Rooftop
       */
      calculationMethod: string;

      /**
       * The best use for the geocode point.
       * One or more of the following: Display, Route
       */
      usageTypes: string[];
    }

    /** A point on the Earth specified by a latitude and longitude. */
    class Point {
      /**
       * The coordinates are stored in a two element array as double values and are specified in the following order:
       *   Latitude,Longitude
       *
       * The following ranges of values are valid:
       *  Latitude (degrees): [-90, +90]
       *  Longitude (degrees): [-180,+180]
       */
      coordinates: number[];
    }
  }
}
