// http://go.microsoft.com/fwlink/?LinkID=290993&clcid=0x409
var mobileServiceClient
var azureMobileServicesKey = ''; // Add your Azure Mobile Service Application Key
var azureMobileServicesAddress = ''; // Add your Azure Mobile Service Application URL 

document.addEventListener("deviceready", function () {
	if (azureMobileServicesKey && azureMobileServicesAddress) {
		mobileServiceClient = new WindowsAzure.MobileServiceClient(
							azureMobileServicesAddress,
							azureMobileServicesKey);
	}
	else {
		console.warn("No key was provided for Azure Mobile Services. See the readme for instructions on connecting to Azure as a backend. Local storage will be used instead.");
	}
});