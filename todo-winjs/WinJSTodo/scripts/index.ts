/***
    Copyright (c) Microsoft. All rights reserved.  Licensed under the MIT license. See LICENSE file in the project root for full license information.
*/

///<reference path='..\..\packages\cordova.TypeScript.DefinitelyTyped.2.3.3\Content\Scripts\typings\cordova\cordova.d.ts' />
///<reference path='..\..\packages\winjs.TypeScript.DefinitelyTyped.0.1.9\Content\Scripts\typings\winjs\winjs.d.ts'/>
///<reference path='..\..\packages\azure-mobile-services-client.TypeScript.DefinitelyTyped.0.8.6\Content\Scripts\typings\azure-mobile-services-client\AzureMobileServicesClient.d.ts'/>
/// <reference path="services.ts" />
/// <reference path="todo.ts" />

module Todo {
  "use strict";

  /**
   * Container for app state
   */
  export var app: ToDo = new ToDo();

}