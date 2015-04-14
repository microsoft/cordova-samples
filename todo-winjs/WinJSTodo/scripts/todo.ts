/***
    Copyright (c) Microsoft. All rights reserved.  Licensed under the MIT license. See LICENSE file in the project root for full license information.
*/

module Todo {
  "use strict";

  /**
   * WinJS Converter function that maps the ToDoItem.done property to the text-decoration style property
   */
  export var converter: Function = WinJS.Binding.converter((done: boolean): string =>
    done ? 'line-through' : 'none');

  /**
   * WinJS converter function for mapping the ToDoItem.done property to the class property on the checkbox
   */
  export var checkBoxConverter: Function = WinJS.Binding.converter((done: boolean): string =>
    done ? 'templateLeft templateToggle checked' : 'templateLeft templateToggle unchecked');

  /**
   * Holds the app state and describes ways to change the state
   */
  export class ToDo {
    /**
     * The WinJS list for the ToDoItems databound to the UI
     */
    private _items: WinJS.Binding.List<ToDoItem>;

    /**
     * Get the items behind the list
     */
    get dataSource(): WinJS.UI.IListDataSource<ToDoItem> {
      return this._items.dataSource;
    }

    /**
     * Set up the app state with an empty WinJS list
     */
    constructor() {
      document.addEventListener('deviceready', this._onDeviceReady, false);
      this._items = new WinJS.Binding.List<ToDoItem>([], { binding: true });
    }

    private _onDeviceReady() {
      app.refresh();
      WinJS.UI.processAll();
    }

    /**
     * Reload the displayed items by getting them all from storage again
     */
    refresh(): void {
      Storage.
        getAllToDoItems().
        done((items: ToDoItem[]) => {
        this._items.splice(0, this._items.length);
        for (var i = 0; i < items.length; i++) {
          this._items.push(this._createToDoBinding(items[i]));
        }
      });
    }

    /**
     * Add a new ToDo item
     * @param textInput The input the new item was entered in 
     */
    addToDo(textInput: HTMLInputElement): void {
      var text = textInput.value;
      textInput.value = '';
      var item = new ToDoItem(text, "Getting location...");
      var bindingItem = this._createToDoBinding(item);
      Storage.
        insert(item).
        then((item: ToDoItem) => this._items.push(item)).
        then(() => this._updateAddress(bindingItem));
    }

    /**
     * Change the text for an item (triggers an address update)
     * @param item The bound item to update
     * @param value The new value for the item
     */
    changeItemText(item: BoundToDoItem, value: string): void {
      item.text = value;
      Storage.
        update(item.backingData).
        then(() => this._updateAddress(item));
    }

    /**
     * Toggle the done state of an item
     * @param item The bound item to update
     */
    toggleItemDone(item: BoundToDoItem): void {
      item.done = !item.done;
      Storage.update(item.backingData);
    }

    /**
     * Remove an item from the app
     * @param item The bound item to update
     */
    removeItem(item: BoundToDoItem): void {
      var index = this._items.indexOf(item);
      this._items.splice(index, 1);
      Storage.del(item.backingData);
    }

    /**
     * Update the address for a bound item using the current location
     * @param item The bound item to update
     */
    private _updateAddress(item: BoundToDoItem): void {
      Maps.
        getCurrentPosition().
        then((position: Position) => Maps.getAddressFromPosition(position),
        (error: PositionError): string => "Couldn't get valid location").
        done((address: string) => {
        item.address = address;
        Storage.update(item.backingData);
      });
    }

    /**
     * Private helper to take a ToDoItem and make it observable for data binding
     */
    private _createToDoBinding(item: ToDoItem): BoundToDoItem {
      // Pass the item through WinJS to make it bindable
      var boundItem = <BoundToDoItem>WinJS.Binding.as(item);

      // Add event handler functions to the object
      // TODO(adamre): Shouldn't these just always exist on the prototype for BoundToDoItem?
      boundItem.changeText = (evt: Event) => this.changeItemText(boundItem,(<HTMLInputElement>evt.target).value);
      boundItem.toggleDone = () => this.toggleItemDone(boundItem);
      boundItem.remove = () => this.removeItem(boundItem);

      // Hook up event handlers 
      WinJS.UI.eventHandler(boundItem.changeText);
      WinJS.UI.eventHandler(boundItem.toggleDone);
      WinJS.UI.eventHandler(boundItem.remove);

      return boundItem;
    }
  }

  /**
   * Describes a ToDo item with event-triggered fields for updating the item
   */
  export class ToDoItem {
    /**
     * @param text The text for the item
     * @param address The address for the item
     * @param done The done state of the item (default: false = undone)
     * @param id A identifier for the item, set by the storage implementation (default: '')
     */
    constructor(public text: string, public address: string, public done: boolean = false, public id: string = '') {
    }

    /**
     * The event handler for changing the text of an item. Assigned when creating a bound version of the item.
     * @param evt The event triggering the handler.
     */
    public changeText: (evt: Event) => void;

    /**
     * The event handler for toggling the done state of an item. Assigned when creating a bound version of the item.
     */
    public toggleDone: () => void;

    /**
     * The event handler for removing an item. Assigned when creating a bound version of the item.
     */
    public remove: () => void;
  }

  /**
   * An observable wrapper for ToDoItem
   * TODO(adamre): If backingData holds the ToDoItem, why does BoundToDoItem extend it? Would Bound really have the same properties?
   */
  export class BoundToDoItem extends ToDoItem {
    /**
     * The core ToDo item without the handlers
     */
    public backingData: ToDoItem;
  }

}