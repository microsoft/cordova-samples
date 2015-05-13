///<reference path='winjs.d.ts'/>

module Xplat {
    "use strict";

    export var dataSource: ToDo;
    export var converter: (done: boolean) => string;
    export var checkBoxConverter: (done: boolean) => string;

    export class ToDo {
        private _items: WinJS.Binding.List;
        get items(): WinJS.Binding.List {
            return this._items.dataSource;
        }

        constructor() {
            this._items = new WinJS.Binding.List([], { binding: true });
        }

        refresh(): void {
            Storage.getAllToDoItems()
                .done((items: ToDoItem[]) => {
                    this._items.splice(0, this._items.length);
                    for (var i = 0; i < items.length; i++) {
                        this._items.push(this._createToDoBinding(items[i]));
                    }
                });
        }

        addToDo(textInput: HTMLInputElement): void {
            var text = textInput.value;
            textInput.value = '';
            var item = new ToDoItem(text, "Getting location...");
            var bindingItem = this._createToDoBinding(item);
            Storage.insert(item)
                .then((item: ToDoItem) => this._items.push(item))
                .then(() => this._updateAddress(bindingItem));
        }

        changeItemText(item: BindingToDoItem, value: string) {
            item.text = value;
            Storage.update(item.backingData)
                .then(() => this._updateAddress(item));
        }

        toggleItemDone(item: BindingToDoItem): void {
            item.done = !item.done;
            Storage.update(item.backingData);
        }

        removeItem(item: BindingToDoItem): void {
            var index = this._items.indexOf(item);
            this._items.splice(index, 1);
            Storage.del(item.backingData);
        }

        private _updateAddress(item: BindingToDoItem): void {
            Maps.getCurrentPosition()
                .then(Maps.getAddressFromPosition, (error: PositionError) => "Couldn't get valid location")
                .done((address: string) => {
                    item.address = address;
                    Storage.update(item.backingData);
                });
        }

        private _createToDoBinding(item: ToDoItem): BindingToDoItem {
            var bindingItem = WinJS.Binding.as(item);
            bindingItem.changeText = (evt: Event) => this.changeItemText(bindingItem, (<HTMLInputElement>evt.target).value);
            bindingItem.toggleDone = () => this.toggleItemDone(bindingItem);
            bindingItem.remove = () => this.removeItem(bindingItem);

            WinJS.UI.eventHandler(bindingItem.changeText);
            WinJS.UI.eventHandler(bindingItem.toggleDone);
            WinJS.UI.eventHandler(bindingItem.remove);
            return bindingItem;
        }
    }

    export class ToDoItem {
        constructor(public text: string, public address: string, public done: boolean = false, public id: string = '') {
        }
    }

    export class BindingToDoItem extends ToDoItem {
        public backingData: ToDoItem;
    }

    converter = WinJS.Binding.converter((done) => done ? 'line-through' : 'none');
    checkBoxConverter = WinJS.Binding.converter((done) => done ? 'templateLeft templateToggle checked' : 'templateLeft templateToggle unchecked');
    dataSource = new ToDo();
}