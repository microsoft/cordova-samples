import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { Keyboard } from 'ionic-native';
import { Weather } from '../../providers/weather';
import { WeatherDetailPage } from '../weather-detail/weather-detail';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    //This is used to set the Ionic Segment to the first item
    currentMode = 'current';
    degreeStr = ' degrees (F)';
    // used to control which content is displayed on the home page
    displayMode: string = this.currentMode;
    //an empty object (for now) to store our location data passed to the API
    currentLoc = {};
    //Mapped to the search field
    searchInput = '';
    //current weather items array
    c_items = [];
    //forecast items array
    f_items = [];

    //array of day strings used when rendering data
    days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    constructor(public nav: NavController, public platform: Platform, public weather: Weather,
        public alertController: AlertController) {
        //Nothing to do here, move along

    }

    ionViewDidLoad() {
        //Once the main view loads
        console.log('HomePage view loaded');
        //and after the platform is ready...
        this.platform.ready().then(() => {
            console.log('Platform is ready');
            //Setup a resume event listener
            document.addEventListener('resume', () => {
                //Get the local weather when the app resumes
                console.log('Application resumed');
                //Switch to the Current segment
                this.displayMode = this.currentMode
                //then update it with local weather conditions
                this.getLocalWeather();
            });
            //Populate the form with the current location data
            this.getLocalWeather();
        })
    }

    getLocalWeather() {
        console.log('Getting local weather conditions');
        let locOptions = { 'maximumAge': 3000, 'timeout': 5000, 'enableHighAccuracy': true };
        Geolocation.getCurrentPosition(locOptions).then(pos => {
            console.log('Retrieved current location');
            //Store our location object for later use
            this.currentLoc = { 'lat': pos.coords.latitude, 'long': pos.coords.longitude };
            //and ask for the weather for the current location
            this.showCurrent();
        }).catch(e => {
            console.error('Unable to determine current location');
            if (e) {
                console.log('%s: %s', e.code, e.message);
                console.dir(e);
            }
        })
    }

    setZipCode() {
        //whenever the user enters a zip code, replace the current location
        //with the entered value, then show current weather for the selected
        //location.
        console.log('Entering setZipCode');
        //Hide the keyboard if it's open, just in case
        Keyboard.close();
        //Populate the currentLoc variable with the city name
        this.currentLoc = { 'zip': this.searchInput };
        //Clear the Zip Code input field
        this.searchInput = '';
        //Switch to the 'current' tab
        this.displayMode = this.currentMode;
        //get the weather for the specified city
        this.showCurrent();
    }

    refreshPage() {
        console.log('Refreshing page');
        //Which page are we looking at now?
        if (this.displayMode === this.currentMode) {
            //Then load that page...
            this.showCurrent();
        } else {
            this.showForecast();
        }
    }

    private formatWeatherData(data): any {
        //create a blank array to hold our results
        let tmpArray = [];
        //Add the weather data values to the array
        if (data.name) {
            //Location name will only be available for current conditions
            tmpArray.push({ 'name': 'Location', 'value': data.name });
        }
        tmpArray.push({ 'name': 'Temperature', 'value': data.main.temp + this.degreeStr });
        tmpArray.push({ 'name': 'Low', 'value': data.main.temp_min + this.degreeStr });
        tmpArray.push({ 'name': 'High', 'value': data.main.temp_max + this.degreeStr });
        tmpArray.push({ 'name': 'Humidity', 'value': data.main.humidity + '%' });
        tmpArray.push({ 'name': 'Pressure', 'value': data.main.pressure + ' hPa' });
        tmpArray.push({ 'name': 'Wind', 'value': data.wind.speed + ' mph' });
        //Do we have visibility data?
        if (data.visibility) {
            tmpArray.push({ 'name': 'Visibility', 'value': data.visibility + ' meters' });
        }
        //do we have sunrise/sunset data?
        if (data.sys.sunrise) {
            var sunriseDate = new Date(data.sys.sunrise * 1000);
            tmpArray.push({ 'name': 'Sunrise', 'value': sunriseDate.toLocaleTimeString() });
        }
        if (data.sys.sunset) {
            var sunsetDate = new Date(data.sys.sunset * 1000);
            tmpArray.push({ 'name': 'Sunset', 'value': sunsetDate.toLocaleTimeString() });
        }
        //Do we have a coordinates object? only if we passed it in on startup
        if (data.coord) {
            //Then grab long and lat
            tmpArray.push({ 'name': 'Latitude', 'value': data.coord.lat });
            tmpArray.push({ 'name': 'Longitude', 'value': data.coord.lon });
        }
        //Return the new array to the calling function
        return tmpArray;
    }

    showCurrent() {
        console.log('Updating current weather conditions');
        this.weather.getCurrent(this.currentLoc).then(
            data => {
                console.log('Processing current conditions data');
                // console.dir(data);
                //clear out the previous array contents
                this.c_items = [];
                //Now, populate the array with data from the weather service
                if (data) {
                    //We have data, so lets do something with it
                    this.c_items = this.formatWeatherData(data);
                } else {
                    //This really should never happen
                    console.log('Data object is empty');
                }
            },
            error => {
                console.error("Error retrieving weather data");
                console.dir(error);
                this.showAlert(error);
            }
        );
    }

    showForecast() {
        console.log('Updating forecast data');
        this.weather.getForecast(this.currentLoc).then(
            data => {                
                console.log('Processing weather forecast data');
                // console.dir(data);
                //clear out the previous array contents
                this.f_items = [];
                //Now, populate the array with data from the weather service
                //Do we have some data?
                if (data) {
                    //Then lets build the results array we need
                    //Process each forecast period in the array
                    for (let period of data.list) {
                        //Create a 'record' consisting of a time period's results
                        let weatherValues = this.formatWeatherData(period);
                        //Append this, along with the time period information, into the forecast
                        //items array.          
                        //Get the forecast date as a date object                     
                        let d = new Date(period.dt_txt);
                        //Determe the day of the week
                        let day = this.days[d.getDay()];
                        //And the time
                        let tm = d.toLocaleTimeString();
                        //Create a new object in the results array for this period          
                        this.f_items.push({ 'period': day + ' at ' + tm, 'values': weatherValues });
                    }
                } else {
                    //This really should never happen
                    console.log('Data object is empty');
                }
            },
            error => {
                console.error("Error retrieving weather data");
                console.dir(error);
                this.showAlert(error);
            }
        );
    }

    viewForecast(item) {
        //When the user selects one of the Forecast periods,
        //open up the details page for the selected period.
        console.log('Opening forecast page: %s', item.period);
        this.nav.push(WeatherDetailPage, { 'forecast': item });
    }

    showAlert(message: string) {
        let alert = this.alertController.create({
            title: 'Error',
            subTitle: 'Source: Weather Service',
            message: message,
            buttons: [{ text: 'Sorry' }]
        });
        alert.present();
    }

}