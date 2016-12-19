import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { WeatherDetailPage } from '../pages/weather-detail/weather-detail';
import { Weather } from '../providers/weather';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    WeatherDetailPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    WeatherDetailPage    
  ],
  providers: [Weather, { provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }
