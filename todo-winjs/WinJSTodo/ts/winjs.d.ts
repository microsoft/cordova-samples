declare module WinJS {
    export module Binding {
        export function as(data: any): any;
        export function converter(convert: any): any;
        export class List {
            constructor(data: any[]);
            constructor(data: any[], options: any);
            public push(item: any): any;
            public indexOf(item: any): number;
            public splice(index: number, count: number, newelems: any[]): any[];
            public splice(index: number, count: number): any[];
            public splice(index: number): any[];
            public createFiltered(predicate: (x: any) => boolean): List;
            public createGrouped(keySelector: (x: any) => any, dataSelector: (x: any) => any): List;
            public groups: any;
            public dataSource: any;
            public getAt: any;
            public length: number;
        }
    }

    export class Promise {
        constructor(
            init: (completedDispatch: (value: any) => any, errorDispatch: (value: any) => any) => void
            );
        constructor(
            init: (completedDispatch: (value: any) => any, errorDispatch: (value: any) => any, progressDispatch: (value: any) => any) => any
            );
        constructor(
            init: (completedDispatch: (value: any) => any, errorDispatch: (value: any) => any, progressDispatch: (value: any) => any) => any,
            onCancel: () => void
            );
        public static as(value: any): Promise;
        public then(completedDispatch: (value: any) => any): Promise;
        public then(completedDispatch: (value: any) => any, errorDispatch: (value: any) => any): Promise;
        public then(completedDispatch: (value: any) => any, errorDispatch: (value: any) => any, progressDispatch: (value: any) => any): Promise;
        public done(completedDispatch: (value: any) => any): void;
    }

    export function xhr(options: { type?: string; url: string; user?: string; password?: string; headers?: any; data?: any; responseType: string; }): WinJS.Promise;

    export module UI {
        var processAll: any;
        export function eventHandler(obj: any): void;
    }
}