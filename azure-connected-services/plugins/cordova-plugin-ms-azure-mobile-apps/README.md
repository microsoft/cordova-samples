Apache Cordova plugin for Azure Mobile Apps
=============================

With Microsoft Azure Mobile Apps you can add a scalable backend to your connected client applications in minutes.

To learn more, visit our [Developer Center](http://azure.microsoft.com/en-us/services/app-service/mobile/).

The source code for the Azure Mobile Apps Cordova plugin is available at https://github.com/Azure/azure-mobile-apps-js-client. The code is packed in a standalone Javascript bundle and is added to this repository for packaging as a Cordova plugin.

## Getting Started

If you are new to Mobile Apps, you can get started by following [Mobile Apps documentation](http://azure.microsoft.com/en-us/documentation/articles/app-service-mobile-value-prop/).

### Offline data sync (Preview)

Offline data sync is a feature of Azure Mobile Apps that makes it easy for developers to create apps that are functional without a network connection. Offline data sync is now available in the Cordova SDK. For detailed documentation, known issues and future work refer this [README](https://github.com/azure/azure-mobile-apps-js-client/tree/cordova-2.0.0-beta6).

### Sample usage ###
The following code creates a new client object to access the *todolist* mobile apps backend and create a new proxy object for the *TodoItem* table.

    var mobileAppsClient = new WindowsAzure.MobileServiceClient(
            "https://todolist.azurewebsites.net"
        );

    var todoTable = mobileAppsClient.getTable('TodoItem');
    
### Quickstart ###
Refer [README.md](https://github.com/Azure/azure-mobile-apps-quickstarts/blob/master/README.md) for detailed quickstart instructions.

### Limitations ###
* Offline Data Synchronization is currently a beta feature. Detailed limitations are documented at https://github.com/Azure/azure-mobile-apps-js-client.

## Need Help?

Be sure to check out the Mobile Services [Developer Forum](http://social.msdn.microsoft.com/Forums/en-US/azuremobile/) if you are having trouble. The Azure Mobile Apps product team actively monitors the forum and will be more than happy to assist you.

## Contribute Code or Provide Feedback

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

If you would like to become an active contributor to this project please follow the instructions provided in [Microsoft Azure Projects Contribution Guidelines](http://azure.github.com/guidelines.html).

If you encounter any bugs with the library please file an issue in the [Issues](https://github.com/Azure/azure-mobile-apps-js-client/issues) section of the project.

## Learn More
[Microsoft Azure Mobile Apps Developer Center](http://azure.microsoft.com/en-us/services/app-service/mobile/)
