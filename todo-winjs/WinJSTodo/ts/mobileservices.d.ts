declare module WindowsAzure {
    export class MobileServiceClient {
        constructor(app: string, key: string);
        public getTable(name: string): MobileServicesTable;
    }

    export class MobileServicesTable {
        public del(instance: any): WinJS.Promise;
        public insert(instance: any): WinJS.Promise;
        public read(query?: any): WinJS.Promise;
        public take(count: number): any;
        public update(instance: any): WinJS.Promise;
    }


}